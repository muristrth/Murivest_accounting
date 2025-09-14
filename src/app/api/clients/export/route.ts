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

    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })

    // Create CSV content
    const csvHeaders = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Company",
      "Address",
      "City",
      "Country",
      "Date of Birth",
      "Status",
      "Created Date"
    ]

    const csvRows = clients.map(client => [
      client.firstName,
      client.lastName,
      client.email,
      client.phone || "",
      client.company || "",
      client.address || "",
      client.city || "",
      client.country || "",
      client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : "",
      client.isActive ? "Active" : "Inactive",
      new Date(client.createdAt).toLocaleDateString()
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
        "Content-Disposition": `attachment; filename="clients_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

    return response

  } catch (error) {
    console.error("Export clients error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}