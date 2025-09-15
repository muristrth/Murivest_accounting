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
    const billId = id
    const body = await request.json()

    const bill = await prisma.bill.updateMany({
      where: {
        id: billId,
        userId
      },
      data: {
        number: body.number,
        date: new Date(body.date),
        dueDate: new Date(body.dueDate),
        amount: body.amount,
        taxAmount: body.taxAmount,
        totalAmount: body.totalAmount,
        vendorName: body.vendorName,
        vendorEmail: body.vendorEmail,
        description: body.description
      }
    })

    if (bill.count === 0) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    const updatedBill = await prisma.bill.findUnique({
      where: { id: billId }
    })

    return NextResponse.json(updatedBill)
  } catch (error) {
    console.error("Update bill error:", error)
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
    const billId = id

    const bill = await prisma.bill.deleteMany({
      where: {
        id: billId,
        userId
      }
    })

    if (bill.count === 0) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Bill deleted successfully" })
  } catch (error) {
    console.error("Delete bill error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}