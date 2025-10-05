import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileEditForm } from "@/components/profile-edit-form"

export default async function EditProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <ProfileEditForm profile={profile} />
    </div>
  )
}
