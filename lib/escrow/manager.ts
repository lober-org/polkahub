import { createClient } from "@/lib/supabase/server"

export async function createEscrow(taskId: string, amount: number): Promise<boolean> {
  const supabase = await createClient()

  try {
    // Update task escrow status
    const { error } = await supabase
      .from("tasks")
      .update({
        escrow_status: "funded",
        escrow_amount_dot: amount,
      })
      .eq("id", taskId)

    if (error) {
      console.error("[v0] Error creating escrow:", error)
      return false
    }

    // In production, this would transfer DOT to an escrow smart contract
    // For now, we just track it in the database
    console.log(`[v0] Escrow created for task ${taskId}: ${amount} DOT`)

    return true
  } catch (error) {
    console.error("[v0] Error in createEscrow:", error)
    return false
  }
}

export async function releaseEscrow(contributionId: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    // Get contribution details
    const { data: contribution } = await supabase
      .from("contributions")
      .select(
        `
        *,
        tasks (
          id,
          reward_amount_dot,
          escrow_status,
          projects (id, maintainer_user_id)
        ),
        profiles:contributor_user_id (polkadot_address)
      `,
      )
      .eq("id", contributionId)
      .single()

    if (!contribution) {
      console.error("[v0] Contribution not found")
      return false
    }

    if (!contribution.profiles.polkadot_address) {
      console.error("[v0] Contributor has no Polkadot address")
      return false
    }

    // Check if escrow is funded
    if (contribution.tasks.escrow_status !== "funded") {
      console.error("[v0] Escrow not funded for this task")
      return false
    }

    // In production, this would:
    // 1. Call smart contract to release funds
    // 2. Transfer DOT from escrow to contributor's wallet
    // 3. Record transaction on-chain

    // For now, we simulate the payout
    const platformAddress = process.env.POLKADOT_PLATFORM_ADDRESS
    const contributorAddress = contribution.profiles.polkadot_address
    const amount = contribution.tasks.reward_amount_dot

    console.log(`[v0] Releasing escrow: ${amount} DOT to ${contributorAddress}`)

    // Create payout record
    const { data: payout, error: payoutError } = await supabase
      .from("payouts")
      .insert({
        contribution_id: contributionId,
        recipient_user_id: contribution.contributor_user_id,
        amount_dot: amount,
        polkadot_address: contributorAddress,
        status: "pending",
      })
      .select()
      .single()

    if (payoutError) {
      console.error("[v0] Error creating payout record:", payoutError)
      return false
    }

    // In production, execute the actual transfer here
    // const txHash = await transferDOT(platformAddress, contributorAddress, amount, privateKey)

    // Update payout status
    await supabase
      .from("payouts")
      .update({
        status: "completed",
        transaction_hash: "simulated-tx-hash-" + Date.now(),
        paid_at: new Date().toISOString(),
      })
      .eq("id", payout.id)

    // Update task escrow status
    await supabase
      .from("tasks")
      .update({
        escrow_status: "released",
      })
      .eq("id", contribution.tasks.id)

    console.log(`[v0] Escrow released successfully for contribution ${contributionId}`)

    return true
  } catch (error) {
    console.error("[v0] Error in releaseEscrow:", error)
    return false
  }
}

export async function refundEscrow(taskId: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    // Get task details
    const { data: task } = await supabase
      .from("tasks")
      .select(
        `
        *,
        projects (maintainer_user_id, profiles:maintainer_user_id (polkadot_address))
      `,
      )
      .eq("id", taskId)
      .single()

    if (!task) {
      console.error("[v0] Task not found")
      return false
    }

    if (task.escrow_status !== "funded") {
      console.error("[v0] Escrow not funded for this task")
      return false
    }

    // In production, this would refund DOT from escrow back to maintainer
    console.log(`[v0] Refunding escrow: ${task.reward_amount_dot} DOT to maintainer`)

    // Update task escrow status
    await supabase
      .from("tasks")
      .update({
        escrow_status: "refunded",
      })
      .eq("id", taskId)

    console.log(`[v0] Escrow refunded successfully for task ${taskId}`)

    return true
  } catch (error) {
    console.error("[v0] Error in refundEscrow:", error)
    return false
  }
}
