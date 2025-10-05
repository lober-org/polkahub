"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X } from "lucide-react"

export function ContributionActions({ contributionId }: { contributionId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this contribution? This will trigger the payout.")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/contributions/${contributionId}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve contribution")
      }

      alert("Contribution approved successfully!")
      router.refresh()
      router.push("/dashboard")
    } catch (error) {
      console.error("Error approving contribution:", error)
      alert("Failed to approve contribution")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this contribution?")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/contributions/${contributionId}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject contribution")
      }

      alert("Contribution rejected")
      router.refresh()
      router.push("/dashboard")
    } catch (error) {
      console.error("Error rejecting contribution:", error)
      alert("Failed to reject contribution")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-4">
      <Button onClick={handleApprove} disabled={loading} className="flex-1">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
        Approve & Pay
      </Button>
      <Button onClick={handleReject} disabled={loading} variant="destructive" className="flex-1">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
        Reject
      </Button>
    </div>
  )
}
