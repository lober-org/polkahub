"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Lock } from "lucide-react"

export function FundEscrowButton({ taskId, amount }: { taskId: string; amount: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleFund = async () => {
    if (!confirm(`Fund escrow with ${amount.toFixed(2)} DOT? This will lock the funds until the task is completed.`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/tasks/${taskId}/fund-escrow`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to fund escrow")
      }

      alert("Escrow funded successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error funding escrow:", error)
      alert("Failed to fund escrow")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleFund} disabled={loading} variant="outline">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
      Fund Escrow
    </Button>
  )
}
