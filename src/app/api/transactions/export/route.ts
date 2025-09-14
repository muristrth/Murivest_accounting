import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        account: true,
        journalEntry: true
      },
      orderBy: { date: "desc" }
    })

    // Create CSV content
    const csvHeaders = [
      "Date",
      "Reference",
      "Description",
      "Account Code",
      "Account Name",
      "Debit",
      "Credit",
      "Journal Entry",
      "Created Date"
    ]

    const csvRows = transactions.map(transaction => [
      transaction.date.toISOString().split('T')[0],
      transaction.reference,
      transaction.description,
      transaction.account.code,
      transaction.account.name,
      transaction.debit.toString(),
      transaction.credit.toString(),
      transaction.journalEntry?.reference || "",
      transaction.createdAt.toISOString().split('T')[0]
    ])

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n")

    // Return CSV file
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

    return response

  } catch (error) {
    console.error("Export transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}