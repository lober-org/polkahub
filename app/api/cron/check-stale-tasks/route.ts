import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/cron/check-stale-tasks - Check for stale tasks and send notifications
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "development-secret"

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Find tasks that have been open for more than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: staleTasks } = await supabase
      .from("tasks")
      .select(
        `
        *,
        projects (
          id,
          github_repo_name,
          maintainer_user_id,
          profiles:maintainer_user_id (email, display_name)
        )
      `,
      )
      .eq("status", "open")
      .lt("created_at", thirtyDaysAgo.toISOString())

    console.log(`[v0] Found ${staleTasks?.length || 0} stale tasks`)

    // In production, send email notifications to maintainers
    // For now, just log the stale tasks
    if (staleTasks && staleTasks.length > 0) {
      for (const task of staleTasks) {
        console.log(`[v0] Stale task: ${task.title} (${task.id}) - ${task.projects.github_repo_name}`)
        // TODO: Send email notification to maintainer
      }
    }

    return NextResponse.json({
      message: "Stale tasks checked",
      staleTaskCount: staleTasks?.length || 0,
    })
  } catch (error) {
    console.error("Error checking stale tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
