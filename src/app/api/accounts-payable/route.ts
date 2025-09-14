import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Bill } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch bills for the user
    const bills = await prisma.bill.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" }
    })

    // Format the bills for the frontend
    const formattedBills = bills.map((bill: Bill) => ({
      id: bill.id,
      number: bill.number,
      date: bill.date.toISOString().split('T')[0],
      dueDate: bill.dueDate.toISOString().split('T')[0],
      amount: Number(bill.amount),
      taxAmount: Number(bill.taxAmount),
      totalAmount: Number(bill.totalAmount),
      status: bill.status,
      description: bill.description || "",
      vendorName: bill.vendorName,
      vendorEmail: bill.vendorEmail || ""
    }))

    return NextResponse.json({ bills: formattedBills })

  } catch (error) {
    console.error("Accounts payable API error:", error)
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

    const {
      number,
      date,
      dueDate,
      amount,
      taxAmount,
      totalAmount,
      description,
      vendorName,
      vendorEmail
    } = body

    // Create new bill
    const bill = await prisma.bill.create({
      data: {
        number,
        date: new Date(date),
        dueDate: new Date(dueDate),
        amount,
        taxAmount: taxAmount || 0,
        totalAmount,
        description,
        vendorName,
        vendorEmail,
        userId
      }
    })

    return NextResponse.json({
      bill: {
        id: bill.id,
        number: bill.number,
        date: bill.date.toISOString().split('T')[0],
        dueDate: bill.dueDate.toISOString().split('T')[0],
        amount: Number(bill.amount),
        taxAmount: Number(bill.taxAmount),
        totalAmount: Number(bill.totalAmount),
        status: bill.status,
        description: bill.description,
        vendorName: bill.vendorName,
        vendorEmail: bill.vendorEmail
      }
    })

  } catch (error) {
    console.error("Create bill API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}