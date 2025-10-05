import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

// Verify GitHub webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!signature) return false

  const hmac = crypto.createHmac("sha256", secret)
  const digest = "sha256=" + hmac.update(payload).digest("hex")

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function POST(request: Request) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("x-hub-signature-256") || ""
    const event = request.headers.get("x-github-event")

    // Verify webhook signature (in production, use environment variable for secret)
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET || "development-secret"

    // Skip signature verification in development
    if (process.env.NODE_ENV === "production" && !verifySignature(payload, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = JSON.parse(payload)
    const supabase = await createClient()

    // Handle pull request events
    if (event === "pull_request") {
      const action = data.action
      const pr = data.pull_request
      const repo = data.repository

      console.log(`[v0] GitHub webhook: PR ${action} - ${pr.html_url}`)

      // Find the task associated with this issue
      // PRs can reference issues in their body or title
      const issueNumber = extractIssueNumber(pr.body || pr.title)

      if (!issueNumber) {
        console.log("[v0] No issue number found in PR")
        return NextResponse.json({ message: "No issue reference found" })
      }

      // Find task by issue number and repo
      const { data: task } = await supabase
        .from("tasks")
        .select("*, projects(*)")
        .eq("github_issue_number", issueNumber)
        .single()

      if (!task) {
        console.log(`[v0] No task found for issue #${issueNumber}`)
        return NextResponse.json({ message: "Task not found" })
      }

      // Verify PR is for the correct repository
      if (task.projects.github_repo_url !== repo.html_url) {
        console.log("[v0] PR repository doesn't match task repository")
        return NextResponse.json({ message: "Repository mismatch" })
      }

      // Find contributor by GitHub username
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("github_username", pr.user.login)
        .single()

      if (!profile) {
        console.log(`[v0] No profile found for GitHub user ${pr.user.login}`)
        return NextResponse.json({ message: "Contributor profile not found" })
      }

      if (action === "opened") {
        // Create or update contribution
        const { data: existingContribution } = await supabase
          .from("contributions")
          .select("*")
          .eq("task_id", task.id)
          .eq("contributor_user_id", profile.id)
          .single()

        if (existingContribution) {
          // Update existing contribution
          await supabase
            .from("contributions")
            .update({
              github_pr_url: pr.html_url,
              github_pr_number: pr.number,
              status: "pending",
            })
            .eq("id", existingContribution.id)

          console.log(`[v0] Updated contribution ${existingContribution.id}`)
        } else {
          // Create new contribution
          await supabase.from("contributions").insert({
            task_id: task.id,
            contributor_user_id: profile.id,
            github_pr_url: pr.html_url,
            github_pr_number: pr.number,
            status: "pending",
            submitted_at: new Date().toISOString(),
          })

          console.log(`[v0] Created new contribution for task ${task.id}`)
        }
      } else if (action === "closed") {
        // Find the contribution
        const { data: contribution } = await supabase
          .from("contributions")
          .select("*")
          .eq("task_id", task.id)
          .eq("github_pr_number", pr.number)
          .single()

        if (contribution) {
          if (pr.merged) {
            // PR was merged - approve contribution
            await supabase
              .from("contributions")
              .update({
                status: "approved",
                approved_at: new Date().toISOString(),
              })
              .eq("id", contribution.id)

            // Update task status
            await supabase
              .from("tasks")
              .update({
                status: "completed",
                completed_at: new Date().toISOString(),
              })
              .eq("id", task.id)

            console.log(`[v0] Approved contribution ${contribution.id} - PR merged`)
          } else {
            // PR was closed without merging
            await supabase
              .from("contributions")
              .update({
                status: "rejected",
              })
              .eq("id", contribution.id)

            console.log(`[v0] Rejected contribution ${contribution.id} - PR closed without merge`)
          }
        }
      }
    }

    // Handle issue events (for task creation/updates)
    if (event === "issues") {
      const action = data.action
      const issue = data.issue
      const repo = data.repository

      console.log(`[v0] GitHub webhook: Issue ${action} - ${issue.html_url}`)

      // Find project by repository URL
      const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("github_repo_url", repo.html_url)
        .single()

      if (!project) {
        console.log("[v0] No project found for this repository")
        return NextResponse.json({ message: "Project not found" })
      }

      // Check if issue has a reward label (e.g., "reward: 10 DOT")
      const rewardLabel = issue.labels.find((label: any) => label.name.startsWith("reward:"))

      if (action === "opened" && rewardLabel) {
        // Auto-create task from labeled issue
        const rewardAmount = parseRewardFromLabel(rewardLabel.name)

        if (rewardAmount > 0) {
          // Check if task already exists
          const { data: existingTask } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", project.id)
            .eq("github_issue_number", issue.number)
            .single()

          if (!existingTask) {
            await supabase.from("tasks").insert({
              project_id: project.id,
              title: issue.title,
              description: issue.body || "",
              github_issue_url: issue.html_url,
              github_issue_number: issue.number,
              reward_amount_dot: rewardAmount,
              status: "open",
              escrow_status: "pending",
              tags: issue.labels.map((l: any) => l.name),
            })

            console.log(`[v0] Auto-created task for issue #${issue.number}`)
          }
        }
      } else if (action === "closed") {
        // Update task status when issue is closed
        await supabase
          .from("tasks")
          .update({ status: "closed" })
          .eq("project_id", project.id)
          .eq("github_issue_number", issue.number)

        console.log(`[v0] Closed task for issue #${issue.number}`)
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to extract issue number from PR body/title
function extractIssueNumber(text: string): number | null {
  // Look for patterns like "Fixes #123", "Closes #123", "Resolves #123"
  const patterns = [/(?:fix|fixes|fixed|close|closes|closed|resolve|resolves|resolved)\s+#(\d+)/i, /#(\d+)/]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return Number.parseInt(match[1])
    }
  }

  return null
}

// Helper function to parse reward amount from label
function parseRewardFromLabel(label: string): number {
  // Expected format: "reward: 10 DOT" or "reward:10DOT"
  const match = label.match(/reward:\s*(\d+(?:\.\d+)?)/i)
  return match ? Number.parseFloat(match[1]) : 0
}
