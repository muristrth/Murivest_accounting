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
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(bills)
  } catch (error) {
    console.error("Bills API error:", error)
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

    const bill = await prisma.bill.create({
      data: {
        number: body.number,
        date: new Date(body.date),
        dueDate: new Date(body.dueDate),
        amount: body.amount,
        taxAmount: body.taxAmount,
        totalAmount: body.totalAmount,
        vendorName: body.vendorName,
        vendorEmail: body.vendorEmail,
        description: body.description,
        userId
      }
    })

    return NextResponse.json(bill, { status: 201 })
  } catch (error) {
    console.error("Create bill error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}