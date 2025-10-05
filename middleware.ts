// import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Temporarily bypassing Supabase auth until we're ready to use it
  // return await updateSession(request)

  // For now, just pass through all requests
  const { NextResponse } = await import("next/server")
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
