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

export function NewProjectForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    github_owner: "",
    github_repo_name: "",
    github_repo_url: "",
    description: "",
    website_url: "",
    logo_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...formData,
        maintainer_user_id: userId,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      alert("Failed to create project: " + error.message)
      setLoading(false)
    } else {
      router.push(`/dashboard/projects/${data.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="github_owner">GitHub Owner</Label>
        <Input
          id="github_owner"
          value={formData.github_owner}
          onChange={(e) => setFormData({ ...formData, github_owner: e.target.value })}
          placeholder="polkadot-js"
          required
        />
        <p className="text-xs text-muted-foreground">The GitHub organization or username</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_repo_name">Repository Name</Label>
        <Input
          id="github_repo_name"
          value={formData.github_repo_name}
          onChange={(e) => setFormData({ ...formData, github_repo_name: e.target.value })}
          placeholder="apps"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_repo_url">Repository URL</Label>
        <Input
          id="github_repo_url"
          value={formData.github_repo_url}
          onChange={(e) => setFormData({ ...formData, github_repo_url: e.target.value })}
          placeholder="https://github.com/polkadot-js/apps"
          type="url"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your project"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url">Website URL (Optional)</Label>
        <Input
          id="website_url"
          value={formData.website_url}
          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
          placeholder="https://polkadot.js.org"
          type="url"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo_url">Logo URL (Optional)</Label>
        <Input
          id="logo_url"
          value={formData.logo_url}
          onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          placeholder="https://example.com/logo.png"
          type="url"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Project
      </Button>
    </form>
  )
}
