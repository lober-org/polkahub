import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/projects - List all active projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search") || ""

    const supabase = await createClient()

    let query = supabase
      .from("projects")
      .select(
        `
        *,
        tasks (id, status, reward_amount_dot)
      `,
        { count: "exact" },
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`github_repo_name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      projects: data,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
