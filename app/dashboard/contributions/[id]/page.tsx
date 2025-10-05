import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink } from "lucide-react"
import { ContributionActions } from "@/components/contribution-actions"

export default async function ReviewContributionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: contribution } = await supabase
    .from("contributions")
    .select(
      `
      *,
      profiles:contributor_user_id (display_name, avatar_url, github_username),
      tasks (
        *,
        projects (id, github_repo_name, maintainer_user_id)
      )
    `,
    )
    .eq("id", id)
    .single()

  if (!contribution) {
    notFound()
  }

  // Verify user is the project maintainer
  if (contribution.tasks.projects.maintainer_user_id !== user.id) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/50">
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight">Review Contribution</h1>
            <p className="text-muted-foreground mt-1">Approve or reject this pull request</p>
          </div>
        </section>

        <section className="container py-8 max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
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
                  <CardTitle className="text-2xl">{contribution.tasks.title}</CardTitle>
                  <CardDescription>{contribution.tasks.projects.github_repo_name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Task Description</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{contribution.tasks.description}</p>
                  </div>

                  <div className="pt-4">
                    <Button asChild>
                      <a href={contribution.github_pr_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Pull Request on GitHub
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {contribution.status === "pending" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Actions</CardTitle>
                    <CardDescription>Approve or reject this contribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContributionActions contributionId={contribution.id} />
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contributor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contribution.profiles.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{contribution.profiles.display_name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contribution.profiles.display_name}</p>
                      {contribution.profiles.github_username && (
                        <p className="text-sm text-muted-foreground">@{contribution.profiles.github_username}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Number(contribution.tasks.reward_amount_dot).toFixed(2)} DOT
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Will be paid upon approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>
                    <p>{new Date(contribution.submitted_at).toLocaleString()}</p>
                  </div>
                  {contribution.approved_at && (
                    <div>
                      <span className="text-muted-foreground">Approved:</span>
                      <p>{new Date(contribution.approved_at).toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">PR Number:</span>
                    <p>#{contribution.github_pr_number}</p>
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
