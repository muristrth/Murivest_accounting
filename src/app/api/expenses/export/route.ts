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

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" }
    })

    // Create CSV content
    const csvHeaders = [
      "Date",
      "Amount",
      "Category",
      "Description",
      "Status",
      "Created Date"
    ]

    const csvRows = expenses.map(expense => [
      expense.date.toISOString().split('T')[0],
      expense.amount.toString(),
      expense.category,
      expense.description,
      expense.status,
      expense.createdAt.toISOString().split('T')[0]
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
        "Content-Disposition": `attachment; filename="expenses_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

    return response

  } catch (error) {
    console.error("Export expenses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}