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

    const bills = await prisma.bill.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" }
    })

    // Create CSV content
    const csvHeaders = [
      "Number",
      "Vendor Name",
      "Vendor Email",
      "Amount",
      "Tax Amount",
      "Total Amount",
      "Due Date",
      "Status",
      "Description",
      "Created Date"
    ]

    const csvRows = bills.map(bill => [
      bill.number,
      bill.vendorName,
      bill.vendorEmail || "",
      bill.amount.toString(),
      bill.taxAmount.toString(),
      bill.totalAmount.toString(),
      bill.dueDate.toISOString().split('T')[0],
      bill.status,
      bill.description || "",
      bill.createdAt.toISOString().split('T')[0]
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
        "Content-Disposition": `attachment; filename="bills_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

    return response

  } catch (error) {
    console.error("Export bills error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}