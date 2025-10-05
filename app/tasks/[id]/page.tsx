import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mockTasks, mockProjects } from "@/lib/mock-data"

const Github = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
)

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const task = mockTasks.find((t) => t.id === id)

  if (!task) {
    notFound()
  }

  const project = mockProjects.find((p) => p.id === task.project_id)

  if (!project) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-purple-950/20 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge
                      variant={
                        task.status === "open" ? "default" : task.status === "completed" ? "secondary" : "outline"
                      }
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                    >
                      {task.status}
                    </Badge>
                    {task.difficulty && (
                      <Badge variant="outline" className="border-pink-500/30 text-pink-300">
                        {task.difficulty}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-purple-100">{task.title}</CardTitle>
                  <CardDescription className="text-purple-300/70">
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:text-purple-400 transition-colors inline-flex items-center gap-1"
                    >
                      {project.github_repo_name}
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task.description && (
                    <div>
                      <h3 className="font-semibold mb-2 text-purple-200">Description</h3>
                      <p className="text-purple-300/80 whitespace-pre-wrap">{task.description}</p>
                    </div>
                  )}

                  {task.tags && task.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 text-purple-200">Tags</h3>
                      <div className="flex gap-2 flex-wrap">
                        {task.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="bg-purple-500/10 text-purple-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      asChild
                    >
                      <a href={task.github_issue_url} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View GitHub Issue
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500/30 hover:bg-purple-500/10 bg-transparent"
                      asChild
                    >
                      <Link href="/auth/login">Start Contributing</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-purple-950/20 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-100">Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {Number(task.reward_amount_dot).toFixed(2)} DOT
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300/70">
                    <Lock className="h-4 w-4" />
                    <span>Locked in escrow</span>
                  </div>
                  <Badge variant="outline" className="mt-2 border-purple-500/30 text-purple-300">
                    funded
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-purple-950/20 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-100">Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {project.logo_url && (
                      <Avatar className="border-2 border-purple-500/20">
                        <AvatarImage src={project.logo_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-purple-500/10 text-purple-300">
                          {project.github_repo_name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="font-medium text-purple-100">{project.github_repo_name}</p>
                      <p className="text-sm text-purple-300/70">@{project.github_owner}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-purple-500/30 hover:bg-purple-500/10 bg-transparent"
                    asChild
                  >
                    <Link href={`/projects/${project.id}`}>View All Tasks</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-purple-950/20 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-100">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-300/70" />
                    <span className="text-purple-300/70">Created:</span>
                    <span className="text-purple-200">{new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-purple-300/70" />
                    <span className="text-purple-300/70">Issue:</span>
                    <span className="text-purple-200">#{task.github_issue_number}</span>
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
