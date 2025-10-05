import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { mockUserProfile, mockContributions, mockUserProjects } from "@/lib/mock-data"
import { ParticlesBackground } from "@/components/particles-background"

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const ExternalLink = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
)

export default async function DashboardPage() {
  const profile = mockUserProfile
  const contributions = mockContributions
  const projects = mockUserProjects

  const openContributions = contributions?.filter((c) => c.status === "pending") || []
  const approvedContributions = contributions?.filter((c) => c.status === "approved") || []
  const totalEarned = approvedContributions.reduce((sum, c) => sum + Number(c.tasks.reward_amount_dot), 0)

  return (
    <div className="relative flex min-h-screen flex-col">
      <ParticlesBackground />
      <SiteHeader />
      <main className="relative z-10 flex-1">
        <section className="border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-balance">Dashboard</h1>
                <p className="text-muted-foreground mt-3 text-lg">
                  Welcome back, <span className="text-[#EC4899] font-semibold">{profile?.display_name || "User"}</span>
                </p>
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-[#EC4899] to-pink-600 hover:from-[#EC4899]/90 hover:to-pink-600/90 text-white border-0"
              >
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            <Card className="relative overflow-hidden border-border/40 bg-muted/5 backdrop-blur-sm hover:border-[#EC4899]/50 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#EC4899]">
                  {totalEarned.toFixed(2)} <span className="text-2xl">DOT</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {approvedContributions.length} approved contributions
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/40 bg-muted/5 backdrop-blur-sm hover:border-[#EC4899]/50 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{openContributions.length}</div>
                <p className="text-sm text-muted-foreground mt-2">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/40 bg-muted/5 backdrop-blur-sm hover:border-[#EC4899]/50 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{projects?.length || 0}</div>
                <p className="text-sm text-muted-foreground mt-2">As maintainer</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="contributions" className="space-y-6">
            <TabsList className="bg-muted/10 border border-border/40">
              <TabsTrigger
                value="contributions"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#EC4899] data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                My Contributions
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#EC4899] data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                My Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contributions" className="space-y-6">
              {!contributions || contributions.length === 0 ? (
                <Card className="border-border/40 bg-muted/5 backdrop-blur-sm">
                  <CardContent className="py-20 text-center">
                    <p className="text-muted-foreground mb-6 text-lg">You haven't made any contributions yet.</p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[#EC4899] to-pink-600 hover:from-[#EC4899]/90 hover:to-pink-600/90 text-white border-0"
                    >
                      <Link href="/tasks">Browse Tasks</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                contributions.map((contribution: any) => (
                  <Card
                    key={contribution.id}
                    className="border-border/40 bg-muted/5 backdrop-blur-sm hover:border-[#EC4899]/50 transition-all duration-300 group"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              className={
                                contribution.status === "approved"
                                  ? "bg-[#EC4899] hover:bg-[#EC4899]/90 text-white"
                                  : contribution.status === "rejected"
                                    ? "bg-red-500 hover:bg-red-500/90 text-white"
                                    : "bg-muted text-muted-foreground"
                              }
                            >
                              {contribution.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {contribution.tasks.projects.github_repo_name}
                            </span>
                          </div>
                          <CardTitle className="text-xl group-hover:text-[#EC4899] transition-colors">
                            {contribution.tasks.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Submitted {new Date(contribution.submitted_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#EC4899]">
                            {Number(contribution.tasks.reward_amount_dot).toFixed(2)} DOT
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-border/40 hover:border-[#EC4899]/50 hover:text-[#EC4899] bg-transparent"
                        >
                          <a href={contribution.github_pr_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            View PR
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-border/40 hover:border-[#EC4899]/50 hover:text-[#EC4899] bg-transparent"
                        >
                          <Link href={`/tasks/${contribution.task_id}`}>View Task</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              {!projects || projects.length === 0 ? (
                <Card className="border-border/40 bg-muted/5 backdrop-blur-sm">
                  <CardContent className="py-20 text-center">
                    <p className="text-muted-foreground mb-6 text-lg">You haven't created any projects yet.</p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[#EC4899] to-pink-600 hover:from-[#EC4899]/90 hover:to-pink-600/90 text-white border-0"
                    >
                      <Link href="/dashboard/projects/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project: any) => {
                  const openTasks = project.tasks?.filter((t: any) => t.status === "open") || []
                  const totalRewards = openTasks.reduce((sum: number, t: any) => sum + Number(t.reward_amount_dot), 0)

                  return (
                    <Card
                      key={project.id}
                      className="border-border/40 bg-muted/5 backdrop-blur-sm hover:border-[#EC4899]/50 transition-all duration-300 group"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl group-hover:text-[#EC4899] transition-colors">
                              {project.github_repo_name}
                            </CardTitle>
                            <CardDescription className="mt-1">@{project.github_owner}</CardDescription>
                          </div>
                          <Badge
                            className={
                              project.is_active
                                ? "bg-[#EC4899] hover:bg-[#EC4899]/90 text-white"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {project.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-6 text-sm">
                            <div>
                              <span className="font-bold text-lg text-[#EC4899]">{openTasks.length}</span>
                              <span className="text-muted-foreground ml-1">open tasks</span>
                            </div>
                            <div>
                              <span className="font-bold text-lg text-[#EC4899]">{totalRewards.toFixed(2)} DOT</span>
                              <span className="text-muted-foreground ml-1">in rewards</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-border/40 hover:border-[#EC4899]/50 hover:text-[#EC4899] bg-transparent"
                            >
                              <Link href={`/dashboard/projects/${project.id}`}>Manage</Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-border/40 hover:border-[#EC4899]/50 hover:text-[#EC4899] bg-transparent"
                            >
                              <Link href={`/projects/${project.id}`}>View Public</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
