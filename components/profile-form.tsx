"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function ProfileForm({ profile }: { profile: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    github_username: profile?.github_username || "",
    polkadot_address: profile?.polkadot_address || "",
    avatar_url: profile?.avatar_url || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.from("profiles").update(formData).eq("id", profile.id)

    if (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    } else {
      router.refresh()
      alert("Profile updated successfully!")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name</Label>
        <Input
          id="display_name"
          value={formData.display_name}
          onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
          placeholder="Your name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_username">GitHub Username</Label>
        <Input
          id="github_username"
          value={formData.github_username}
          onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
          placeholder="octocat"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="polkadot_address">Polkadot Wallet Address</Label>
        <Input
          id="polkadot_address"
          value={formData.polkadot_address}
          onChange={(e) => setFormData({ ...formData, polkadot_address: e.target.value })}
          placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
        />
        <p className="text-xs text-muted-foreground">This is where you'll receive your DOT rewards</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input
          id="avatar_url"
          value={formData.avatar_url}
          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
          placeholder="https://example.com/avatar.jpg"
          type="url"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )
}
