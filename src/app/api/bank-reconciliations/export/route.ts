import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient, BankReconciliation } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const reconciliations = await prisma.bankReconciliation.findMany({
      where: { userId },
      orderBy: { statementDate: "desc" }
    })

    // Create CSV content
    const csvHeaders = [
      "Statement Date",
      "Bank Name",
      "Account Number",
      "Statement Balance",
      "Book Balance",
      "Difference",
      "Reconciled",
      "Notes",
      "Created Date"
    ]

    const csvRows = reconciliations.map((reconciliation: BankReconciliation) => {
      const statementBalance = Number(reconciliation.statementBalance)
      const bookBalance = Number(reconciliation.bookBalance)
      const difference = statementBalance - bookBalance

      return [
        reconciliation.statementDate.toISOString().split('T')[0],
        reconciliation.bankName,
        reconciliation.accountNumber,
        statementBalance.toString(),
        bookBalance.toString(),
        difference.toString(),
        reconciliation.reconciled ? "Yes" : "No",
        reconciliation.notes || "",
        reconciliation.createdAt.toISOString().split('T')[0]
      ]
    })

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row: string[]) => row.map((field: string) => `"${field}"`).join(","))
    ].join("\n")

    // Return CSV file
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="bank_reconciliations_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

    return response

  } catch (error) {
    console.error("Export bank reconciliations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}