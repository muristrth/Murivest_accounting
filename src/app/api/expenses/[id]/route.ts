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
    const expenseId = id
    const body = await request.json()

    const expense = await prisma.expense.updateMany({
      where: {
        id: expenseId,
        userId
      },
      data: {
        date: new Date(body.date),
        amount: body.amount,
        category: body.category,
        description: body.description,
        receipt: body.receipt
      }
    })

    if (expense.count === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    const updatedExpense = await prisma.expense.findUnique({
      where: { id: expenseId }
    })

    return NextResponse.json(updatedExpense)
  } catch (error) {
    console.error("Update expense error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
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
    const expenseId = id
    const body = await request.json()

    const expense = await prisma.expense.updateMany({
      where: {
        id: expenseId,
        userId
      },
      data: {
        status: body.status
      }
    })

    if (expense.count === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    const updatedExpense = await prisma.expense.findUnique({
      where: { id: expenseId }
    })

    return NextResponse.json(updatedExpense)
  } catch (error) {
    console.error("Patch expense error:", error)
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
    const expenseId = id

    const expense = await prisma.expense.deleteMany({
      where: {
        id: expenseId,
        userId
      }
    })

    if (expense.count === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Delete expense error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}