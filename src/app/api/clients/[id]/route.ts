import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    const clientId = id
    const body = await request.json()

    const client = await prisma.client.updateMany({
      where: {
        id: clientId,
        userId
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        company: body.company,
        address: body.address,
        city: body.city,
        country: body.country,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null
      }
    })

    if (client.count === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const updatedClient = await prisma.client.findUnique({
      where: { id: clientId }
    })

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error("Update client error:", error)
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
    const clientId = id

    const client = await prisma.client.deleteMany({
      where: {
        id: clientId,
        userId
      }
    })

    if (client.count === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Client deleted successfully" })
  } catch (error) {
    console.error("Delete client error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}