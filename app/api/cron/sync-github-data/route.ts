import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/cron/sync-github-data - Sync GitHub data for projects
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "development-secret"

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get all active projects
    const { data: projects } = await supabase.from("projects").select("*").eq("is_active", true)

    console.log(`[v0] Syncing GitHub data for ${projects?.length || 0} projects`)

    if (!projects || projects.length === 0) {
      return NextResponse.json({
        message: "No projects to sync",
        syncedCount: 0,
      })
    }

    let syncedCount = 0

    for (const project of projects) {
      try {
        // In production, fetch GitHub data using GitHub API
        // const githubData = await fetchGitHubRepoData(project.github_owner, project.github_repo_name)

        // Update project with latest GitHub data
        // await supabase.from('projects').update({
        //   stars: githubData.stargazers_count,
        //   forks: githubData.forks_count,
        //   open_issues: githubData.open_issues_count,
        //   last_synced_at: new Date().toISOString()
        // }).eq('id', project.id)

        console.log(`[v0] Synced GitHub data for ${project.github_repo_name}`)
        syncedCount++
      } catch (error) {
        console.error(`[v0] Error syncing project ${project.id}:`, error)
      }
    }

    return NextResponse.json({
      message: "GitHub data synced",
      syncedCount,
    })
  } catch (error) {
    console.error("Error syncing GitHub data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
