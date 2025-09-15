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
    const reconciliationId = id
    const body = await request.json()

    const reconciliation = await prisma.bankReconciliation.updateMany({
      where: {
        id: reconciliationId,
        userId
      },
      data: {
        statementDate: new Date(body.statementDate),
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        statementBalance: body.statementBalance,
        bookBalance: body.bookBalance,
        notes: body.notes
      }
    })

    if (reconciliation.count === 0) {
      return NextResponse.json({ error: "Bank reconciliation not found" }, { status: 404 })
    }

    const updatedReconciliation = await prisma.bankReconciliation.findUnique({
      where: { id: reconciliationId }
    })

    return NextResponse.json(updatedReconciliation)
  } catch (error) {
    console.error("Update bank reconciliation error:", error)
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
    const reconciliationId = id
    const body = await request.json()

    const reconciliation = await prisma.bankReconciliation.updateMany({
      where: {
        id: reconciliationId,
        userId
      },
      data: {
        reconciled: body.reconciled
      }
    })

    if (reconciliation.count === 0) {
      return NextResponse.json({ error: "Bank reconciliation not found" }, { status: 404 })
    }

    const updatedReconciliation = await prisma.bankReconciliation.findUnique({
      where: { id: reconciliationId }
    })

    return NextResponse.json(updatedReconciliation)
  } catch (error) {
    console.error("Patch bank reconciliation error:", error)
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
    const reconciliationId = id

    const reconciliation = await prisma.bankReconciliation.deleteMany({
      where: {
        id: reconciliationId,
        userId
      }
    })

    if (reconciliation.count === 0) {
      return NextResponse.json({ error: "Bank reconciliation not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Bank reconciliation deleted successfully" })
  } catch (error) {
    console.error("Delete bank reconciliation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}