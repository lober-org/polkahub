import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { createEscrow } from "@/lib/escrow/manager"

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

    // Get task with project info
    const { data: task } = await supabase
      .from("tasks")
      .select(
        `
        *,
        projects (maintainer_user_id)
      `,
      )
      .eq("id", id)
      .single()

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Verify user is the project maintainer
    if (task.projects.maintainer_user_id !== user.id) {
      return NextResponse.json({ error: "Only project maintainer can fund escrow" }, { status: 403 })
    }

    // Check if already funded
    if (task.escrow_status === "funded") {
      return NextResponse.json({ error: "Escrow already funded" }, { status: 400 })
    }

    // Create escrow
    const success = await createEscrow(id, task.reward_amount_dot)

    if (!success) {
      return NextResponse.json({ error: "Failed to create escrow" }, { status: 500 })
    }

    return NextResponse.json({ message: "Escrow funded successfully" })
  } catch (error) {
    console.error("Error funding escrow:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
