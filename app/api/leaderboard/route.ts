import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/leaderboard - Top contributors
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const supabase = await createClient()

    // Get contributors with their total earnings
    const { data: payouts } = await supabase
      .from("payouts")
      .select(
        `
        amount_dot,
        recipient_user_id,
        profiles:recipient_user_id (
          id,
          display_name,
          avatar_url,
          github_username
        )
      `,
      )
      .eq("status", "completed")

    if (!payouts) {
      return NextResponse.json({ leaderboard: [] })
    }

    // Aggregate earnings by user
    const userEarnings = new Map<string, { profile: any; totalEarned: number; contributionCount: number }>()

    for (const payout of payouts) {
      const userId = payout.recipient_user_id
      const existing = userEarnings.get(userId)

      if (existing) {
        existing.totalEarned += Number(payout.amount_dot)
        existing.contributionCount += 1
      } else {
        userEarnings.set(userId, {
          profile: payout.profiles,
          totalEarned: Number(payout.amount_dot),
          contributionCount: 1,
        })
      }
    }

    // Convert to array and sort by total earned
    const leaderboard = Array.from(userEarnings.values())
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, limit)
      .map((entry, index) => ({
        rank: index + 1,
        userId: entry.profile.id,
        displayName: entry.profile.display_name,
        avatarUrl: entry.profile.avatar_url,
        githubUsername: entry.profile.github_username,
        totalEarned: entry.totalEarned,
        contributionCount: entry.contributionCount,
      }))

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
