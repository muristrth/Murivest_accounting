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

    const properties = await prisma.property.findMany({
      where: { userId },
      include: {
        client: true
      },
      orderBy: { createdAt: "desc" }
    })

    // Create CSV content
    const csvHeaders = [
      "Property Name",
      "Type",
      "Address",
      "City",
      "Country",
      "Status",
      "Purchase Price",
      "Current Value",
      "Monthly Rent",
      "Tenant Name",
      "Tenant Company",
      "Created Date"
    ]

    const csvRows = properties.map(property => [
      property.name,
      property.propertyType,
      property.address,
      property.city,
      property.country,
      property.status,
      property.purchasePrice ? property.purchasePrice.toString() : "",
      property.currentValue ? property.currentValue.toString() : "",
      property.monthlyRent ? property.monthlyRent.toString() : "",
      property.client ? `${property.client.firstName} ${property.client.lastName}` : "",
      property.client?.company || "",
      new Date(property.createdAt).toLocaleDateString()
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
        "Content-Disposition": `attachment; filename="properties_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

    return response

  } catch (error) {
    console.error("Export properties error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}