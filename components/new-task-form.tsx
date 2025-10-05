"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function NewTaskForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github_issue_url: "",
    github_issue_number: "",
    reward_amount_dot: "",
    difficulty: "medium",
    tags: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        project_id: projectId,
        title: formData.title,
        description: formData.description,
        github_issue_url: formData.github_issue_url,
        github_issue_number: Number.parseInt(formData.github_issue_number),
        reward_amount_dot: Number.parseFloat(formData.reward_amount_dot),
        difficulty: formData.difficulty,
        tags: tagsArray,
        status: "open",
        escrow_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating task:", error)
      alert("Failed to create task: " + error.message)
      setLoading(false)
    } else {
      router.push(`/dashboard/projects/${projectId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Fix authentication bug"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed description of the task"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_issue_url">GitHub Issue URL</Label>
        <Input
          id="github_issue_url"
          value={formData.github_issue_url}
          onChange={(e) => setFormData({ ...formData, github_issue_url: e.target.value })}
          placeholder="https://github.com/owner/repo/issues/123"
          type="url"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_issue_number">Issue Number</Label>
        <Input
          id="github_issue_number"
          value={formData.github_issue_number}
          onChange={(e) => setFormData({ ...formData, github_issue_number: e.target.value })}
          placeholder="123"
          type="number"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reward_amount_dot">Reward Amount (DOT)</Label>
        <Input
          id="reward_amount_dot"
          value={formData.reward_amount_dot}
          onChange={(e) => setFormData({ ...formData, reward_amount_dot: e.target.value })}
          placeholder="10.5"
          type="number"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="bug, frontend, urgent"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Task
      </Button>
    </form>
  )
}
