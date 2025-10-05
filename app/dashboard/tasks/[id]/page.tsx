import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FundEscrowButton } from "@/components/fund-escrow-button"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default async function ManageTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: task } = await supabase
    .from("tasks")
    .select(
      `
      *,
      projects (id, github_repo_name, maintainer_user_id),
      contributions (
        *,
        profiles:contributor_user_id (display_name, github_username)
      )
    `,
    )
    .eq("id", id)
    .single()

  if (!task) {
    notFound()
  }

  // Verify user is the project maintainer
  if (task.projects.maintainer_user_id !== user.id) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/50">
          <div className="container py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
                <p className="text-muted-foreground mt-1">{task.projects.github_repo_name}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/projects/${task.projects.id}`}>Back to Project</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-8 max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={task.status === "open" ? "default" : "secondary"}>{task.status}</Badge>
                    {task.difficulty && <Badge variant="outline">{task.difficulty}</Badge>}
                  </div>
                  <CardTitle>Task Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{task.description || "No description"}</p>
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button asChild>
                      <a href={task.github_issue_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Issue on GitHub
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contributions ({task.contributions?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {!task.contributions || task.contributions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No contributions yet</p>
                  ) : (
                    <div className="space-y-4">
                      {task.contributions.map((contribution: any) => (
                        <div key={contribution.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{contribution.profiles.display_name}</p>
                              <p className="text-sm text-muted-foreground">@{contribution.profiles.github_username}</p>
                            </div>
                            <Badge
                              variant={
                                contribution.status === "approved"
                                  ? "default"
                                  : contribution.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {contribution.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={contribution.github_pr_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-3 w-3" />
                                View PR
                              </a>
                            </Button>
                            {contribution.status === "pending" && (
                              <Button size="sm" asChild>
                                <Link href={`/dashboard/contributions/${contribution.id}`}>Review</Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Number(task.reward_amount_dot).toFixed(2)} DOT</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Escrow Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge
                      variant={
                        task.escrow_status === "funded"
                          ? "default"
                          : task.escrow_status === "released"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {task.escrow_status}
                    </Badge>
                  </div>

                  {task.escrow_status === "pending" && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Fund the escrow to activate this task and ensure contributors get paid.
                      </p>
                      <FundEscrowButton taskId={task.id} amount={task.reward_amount_dot} />
                    </div>
                  )}

                  {task.escrow_status === "funded" && (
                    <p className="text-sm text-muted-foreground">
                      Funds are locked in escrow and will be released when a contribution is approved.
                    </p>
                  )}

                  {task.escrow_status === "released" && (
                    <p className="text-sm text-muted-foreground">Funds have been paid to the contributor.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <p>{new Date(task.created_at).toLocaleDateString()}</p>
                  </div>
                  {task.completed_at && (
                    <div>
                      <span className="text-muted-foreground">Completed:</span>
                      <p>{new Date(task.completed_at).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Issue:</span>
                    <p>#{task.github_issue_number}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
