import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/tasks - List all open tasks
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const difficulty = searchParams.get("difficulty")
    const minReward = searchParams.get("minReward")
    const maxReward = searchParams.get("maxReward")
    const tags = searchParams.get("tags")?.split(",").filter(Boolean)
    const projectId = searchParams.get("projectId")

    const supabase = await createClient()

    let query = supabase
      .from("tasks")
      .select(
        `
        *,
        projects (id, github_repo_name, github_owner, logo_url)
      `,
        { count: "exact" },
      )
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (difficulty) {
      query = query.eq("difficulty", difficulty)
    }

    if (minReward) {
      query = query.gte("reward_amount_dot", Number.parseFloat(minReward))
    }

    if (maxReward) {
      query = query.lte("reward_amount_dot", Number.parseFloat(maxReward))
    }

    if (tags && tags.length > 0) {
      query = query.contains("tags", tags)
    }

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      tasks: data,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
