import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { releaseEscrow } from "@/lib/escrow/manager"

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
      return NextResponse.json({ error: "Only project maintainer can approve contributions" }, { status: 403 })
    }

    // Update contribution status
    const { error: updateError } = await supabase
      .from("contributions")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      throw updateError
    }

    // Update task status
    await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", contribution.task_id)

    const payoutSuccess = await releaseEscrow(id)

    if (!payoutSuccess) {
      console.error("[v0] Failed to release escrow, but contribution is approved")
      // Don't fail the approval, just log the error
    }

    return NextResponse.json({ message: "Contribution approved successfully" })
  } catch (error) {
    console.error("Error approving contribution:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
