import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Plus, ExternalLink, Settings } from "lucide-react"

export default async function ManageProjectPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: tasks } = await supabase
    .from("tasks")
    .select(
      `
      *,
      contributions (id, status, github_pr_url, submitted_at, profiles:contributor_user_id (display_name))
    `,
    )
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  const openTasks = tasks?.filter((t) => t.status === "open") || []
  const pendingContributions =
    tasks?.flatMap((t: any) => t.contributions?.filter((c: any) => c.status === "pending") || []) || []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/50">
          <div className="container py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{project.github_repo_name}</h1>
                <p className="text-muted-foreground mt-1">Manage your project and tasks</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/projects/${id}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/projects/${id}/tasks/new`}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-8">
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openTasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingContributions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks?.length || 0}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="tasks" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="contributions">
                Contributions
                {pendingContributions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingContributions.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              {!tasks || tasks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">No tasks created yet.</p>
                    <Button asChild>
                      <Link href={`/dashboard/projects/${id}/tasks/new`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                tasks.map((task: any) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                task.status === "open"
                                  ? "default"
                                  : task.status === "completed"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {task.status}
                            </Badge>
                            {task.difficulty && <Badge variant="outline">{task.difficulty}</Badge>}
                            {task.contributions?.some((c: any) => c.status === "pending") && (
                              <Badge variant="secondary">Pending Review</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          {task.description && (
                            <CardDescription className="line-clamp-2 mt-1">{task.description}</CardDescription>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">{Number(task.reward_amount_dot).toFixed(2)} DOT</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {task.contributions?.length || 0} contribution(s)
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={task.github_issue_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              View Issue
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/tasks/${task.id}`}>Manage</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="contributions" className="space-y-4">
              {pendingContributions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No pending contributions to review.</p>
                  </CardContent>
                </Card>
              ) : (
                pendingContributions.map((contribution: any) => (
                  <Card key={contribution.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Pending Review</Badge>
                          </div>
                          <CardTitle className="text-lg">
                            Contribution by {contribution.profiles.display_name}
                          </CardTitle>
                          <CardDescription>
                            Submitted {new Date(contribution.submitted_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={contribution.github_pr_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            View PR
                          </a>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/contributions/${contribution.id}`}>Review</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
