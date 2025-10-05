import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Wallet } from "lucide-react"

export default async function WalletPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's payouts
  const { data: payouts } = await supabase
    .from("payouts")
    .select(
      `
      *,
      contributions (
        tasks (title, projects (github_repo_name))
      )
    `,
    )
    .eq("recipient_user_id", user.id)
    .order("created_at", { ascending: false })

  const totalEarned =
    payouts?.filter((p) => p.status === "completed").reduce((sum, p) => sum + Number(p.amount_dot), 0) || 0

  const pendingPayouts = payouts?.filter((p) => p.status === "pending") || []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/50">
          <div className="container py-8">
            <div className="flex items-center gap-3">
              <Wallet className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
                <p className="text-muted-foreground mt-1">Manage your earnings and payouts</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-8">
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalEarned.toFixed(2)} DOT</div>
                <p className="text-xs text-muted-foreground mt-1">All-time earnings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingPayouts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Being processed</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Polkadot Address</CardTitle>
              <CardDescription>This is where you'll receive your DOT rewards</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.polkadot_address ? (
                <div className="flex items-center justify-between gap-4">
                  <code className="text-sm bg-muted px-3 py-2 rounded flex-1 break-all">
                    {profile.polkadot_address}
                  </code>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://westend.subscan.io/account/${profile.polkadot_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No Polkadot address set</p>
                  <Button asChild>
                    <a href="/profile">Add Address</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Your completed and pending payouts</CardDescription>
            </CardHeader>
            <CardContent>
              {!payouts || payouts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No payouts yet</div>
              ) : (
                <div className="space-y-4">
                  {payouts.map((payout: any) => (
                    <div key={payout.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              payout.status === "completed"
                                ? "default"
                                : payout.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {payout.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {payout.contributions.tasks.projects.github_repo_name}
                          </span>
                        </div>
                        <p className="font-medium">{payout.contributions.tasks.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {payout.paid_at
                            ? `Paid ${new Date(payout.paid_at).toLocaleDateString()}`
                            : `Created ${new Date(payout.created_at).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{Number(payout.amount_dot).toFixed(2)} DOT</div>
                        {payout.transaction_hash && (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={`https://westend.subscan.io/extrinsic/${payout.transaction_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs"
                            >
                              View TX
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
