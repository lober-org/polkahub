import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/cron/process-pending-payouts - Process pending payouts
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "development-secret"

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Find pending payouts
    const { data: pendingPayouts } = await supabase
      .from("payouts")
      .select(
        `
        *,
        profiles:recipient_user_id (polkadot_address)
      `,
      )
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10) // Process 10 at a time

    console.log(`[v0] Found ${pendingPayouts?.length || 0} pending payouts`)

    if (!pendingPayouts || pendingPayouts.length === 0) {
      return NextResponse.json({
        message: "No pending payouts",
        processedCount: 0,
      })
    }

    let processedCount = 0

    for (const payout of pendingPayouts) {
      try {
        // In production, execute actual Polkadot transfer here
        // const txHash = await transferDOT(platformAddress, payout.polkadot_address, payout.amount_dot, privateKey)

        // For now, simulate successful payout
        const txHash = `simulated-tx-${Date.now()}-${payout.id}`

        await supabase
          .from("payouts")
          .update({
            status: "completed",
            transaction_hash: txHash,
            paid_at: new Date().toISOString(),
          })
          .eq("id", payout.id)

        console.log(`[v0] Processed payout ${payout.id}: ${payout.amount_dot} DOT to ${payout.polkadot_address}`)
        processedCount++
      } catch (error) {
        console.error(`[v0] Error processing payout ${payout.id}:`, error)

        // Mark as failed
        await supabase
          .from("payouts")
          .update({
            status: "failed",
          })
          .eq("id", payout.id)
      }
    }

    return NextResponse.json({
      message: "Pending payouts processed",
      processedCount,
    })
  } catch (error) {
    console.error("Error processing pending payouts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
