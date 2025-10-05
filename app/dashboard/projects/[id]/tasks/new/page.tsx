import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewTaskForm } from "@/components/new-task-form"

export default async function NewTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("maintainer_user_id", user.id)
    .single()

  if (!project) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/50">
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
            <p className="text-muted-foreground mt-1">Add a new task to {project.github_repo_name}</p>
          </div>
        </section>

        <section className="container py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Create a task from a GitHub issue</CardDescription>
            </CardHeader>
            <CardContent>
              <NewTaskForm projectId={id} />
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
