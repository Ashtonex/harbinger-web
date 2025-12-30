"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2, FileSpreadsheet } from "lucide-react"
import { getTaxReportData } from "@/actions/finance"

export function ExportButton() {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      // 1. Fetch the data
      const transactions = await getTaxReportData()

      if (!transactions || transactions.length === 0) {
        alert("No successful transactions found for this year.")
        setLoading(false)
        return
      }

      // 2. Define CSV Headers
      const headers = ["Date", "Transaction ID", "Type", "Status", "Amount"]
      
      // 3. Convert Data to CSV Rows
      const csvRows = transactions.map(t => {
        // Format date (YYYY-MM-DD)
        const date = new Date(t.created_at).toISOString().split('T')[0]
        
        // CSV safe string (handles commas in data)
        return [
          date,
          t.id,
          t.type,
          t.status,
          t.amount
        ].join(",")
      })

      // Combine Headers and Rows
      const csvContent = [headers.join(","), ...csvRows].join("\n")

      // 4. Create the File (Blob)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      // 5. Trigger the Download
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `Tithe_Report_${new Date().getFullYear()}.csv`)
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)

    } catch (error) {
      console.error("Export failed:", error)
      alert("Failed to generate report.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDownload} 
      disabled={loading}
      className="gap-2 border-primary/20 hover:bg-primary/5"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
      )}
      Download Tax CSV
    </Button>
  )
}