import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userId = session.user.id
    const propertyId = id
    const body = await request.json()

    const property = await prisma.property.updateMany({
      where: {
        id: propertyId,
        userId
      },
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        country: body.country,
        propertyType: body.propertyType,
        status: body.status,
        purchasePrice: body.purchasePrice ? parseFloat(body.purchasePrice) : null,
        currentValue: body.currentValue ? parseFloat(body.currentValue) : null,
        monthlyRent: body.monthlyRent ? parseFloat(body.monthlyRent) : null,
        description: body.description
      }
    })

    if (property.count === 0) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const updatedProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        client: true
      }
    })

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error("Update property error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userId = session.user.id
    const propertyId = id

    const property = await prisma.property.deleteMany({
      where: {
        id: propertyId,
        userId
      }
    })

    if (property.count === 0) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Property deleted successfully" })
  } catch (error) {
    console.error("Delete property error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}