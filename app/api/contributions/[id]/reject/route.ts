import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get contribution with task and project info
    const { data: contribution } = await supabase
      .from("contributions")
      .select(
        `
        *,
        tasks (
          *,
          projects (maintainer_user_id)
        )
      `,
      )
      .eq("id", id)
      .single()

    if (!contribution) {
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 })
    }

    // Verify user is the project maintainer
    if (contribution.tasks.projects.maintainer_user_id !== user.id) {
      return NextResponse.json({ error: "Only project maintainer can reject contributions" }, { status: 403 })
    }

    // Update contribution status
    const { error: updateError } = await supabase
      .from("contributions")
      .update({
        status: "rejected",
      })
      .eq("id", id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ message: "Contribution rejected" })
  } catch (error) {
    console.error("Error rejecting contribution:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
