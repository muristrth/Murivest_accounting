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

    const reconciliations = await prisma.bankReconciliation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(reconciliations)
  } catch (error) {
    console.error("Bank reconciliations API error:", error)
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

    const reconciliation = await prisma.bankReconciliation.create({
      data: {
        statementDate: new Date(body.statementDate),
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        statementBalance: body.statementBalance,
        bookBalance: body.bookBalance,
        notes: body.notes,
        userId
      }
    })

    return NextResponse.json(reconciliation, { status: 201 })
  } catch (error) {
    console.error("Create bank reconciliation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}