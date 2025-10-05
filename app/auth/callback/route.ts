import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user has a profile, if not redirect to profile setup
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        // If GitHub OAuth and no github_username, update profile
        if (user.app_metadata.provider === "github" && !profile?.github_username) {
          await supabase
            .from("profiles")
            .update({
              github_username: user.user_metadata.user_name,
              github_id: user.user_metadata.provider_id,
              avatar_url: user.user_metadata.avatar_url,
            })
            .eq("id", user.id)
        }
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
