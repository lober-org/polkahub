import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/stats - Platform statistics
export async function GET() {
  try {
    const supabase = await createClient()

    // Get total projects
    const { count: totalProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get total open tasks
    const { count: totalTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "open")

    // Get total contributors (users with at least one contribution)
    const { data: contributors } = await supabase
      .from("contributions")
      .select("contributor_user_id")
      .not("contributor_user_id", "is", null)

    const uniqueContributors = new Set(contributors?.map((c) => c.contributor_user_id)).size

    // Get total rewards available
    const { data: tasks } = await supabase.from("tasks").select("reward_amount_dot").eq("status", "open")

    const totalRewards = tasks?.reduce((sum, task) => sum + Number(task.reward_amount_dot), 0) || 0

    // Get total paid out
    const { data: payouts } = await supabase.from("payouts").select("amount_dot").eq("status", "completed")

    const totalPaidOut = payouts?.reduce((sum, payout) => sum + Number(payout.amount_dot), 0) || 0

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: recentContributions } = await supabase
      .from("contributions")
      .select("*", { count: "exact", head: true })
      .gte("submitted_at", sevenDaysAgo.toISOString())

    return NextResponse.json({
      totalProjects: totalProjects || 0,
      totalTasks: totalTasks || 0,
      totalContributors: uniqueContributors,
      totalRewardsAvailable: totalRewards,
      totalPaidOut: totalPaidOut,
      recentContributions: recentContributions || 0,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
