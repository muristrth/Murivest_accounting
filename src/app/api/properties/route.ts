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

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Properties API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    const property = await prisma.property.create({
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
        description: body.description,
        userId
      }
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error("Create property error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}