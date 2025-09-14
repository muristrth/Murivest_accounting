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

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        client: true,
        payments: true
      },
      orderBy: { dueDate: "asc" }
    })

    // Create CSV content
    const csvHeaders = [
      "Invoice Number",
      "Client Name",
      "Client Email",
      "Amount",
      "Tax Amount",
      "Total Amount",
      "Due Date",
      "Status",
      "Description",
      "Created Date"
    ]

    const csvRows = invoices.map(invoice => [
      invoice.number,
      `${invoice.client.firstName} ${invoice.client.lastName}`,
      invoice.client.email,
      invoice.amount.toString(),
      invoice.taxAmount.toString(),
      invoice.totalAmount.toString(),
      invoice.dueDate.toISOString().split('T')[0],
      invoice.status,
      invoice.description || "",
      invoice.createdAt.toISOString().split('T')[0]
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
        "Content-Disposition": `attachment; filename="invoices_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

    return response

  } catch (error) {
    console.error("Export invoices error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}