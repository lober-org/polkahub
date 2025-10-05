import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, github, role } = body

    console.log("[v0] Waitlist submission received:", { name, email, github, role })

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json({ error: "Name, email, and role are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate role
    if (!["developer", "project"].includes(role)) {
      return NextResponse.json({ error: "Role must be either 'developer' or 'project'" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        name,
        email: email.toLowerCase(),
        github: github || null,
        role,
        source: "landing_page",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Waitlist insert error:", error)

      // Check for duplicate email
      if (error.code === "23505") {
        return NextResponse.json({ error: "This email is already on the waitlist" }, { status: 409 })
      }

      return NextResponse.json(
        {
          error: "Failed to add to waitlist",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Waitlist submission successful:", data)
    return NextResponse.json(
      {
        success: true,
        data,
        message: "Thank you for joining the waitlist! We'll notify you when we launch.",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Waitlist API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
