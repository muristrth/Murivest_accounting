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

    // Calculate total assets
    const totalAssets = await (prisma as any).transaction.aggregate({
      where: {
        userId,
        account: { type: "Asset" }
      },
      _sum: { debit: true, credit: true }
    })

    // Calculate total liabilities
    const totalLiabilities = await (prisma as any).transaction.aggregate({
      where: {
        userId,
        account: { type: "Liability" }
      },
      _sum: { debit: true, credit: true }
    })

    // Calculate owner's equity
    const totalEquity = await (prisma as any).transaction.aggregate({
      where: {
        userId,
        account: { type: "Equity" }
      },
      _sum: { debit: true, credit: true }
    })

    // Calculate net income (revenue - expenses)
    const totalRevenue = await (prisma as any).transaction.aggregate({
      where: {
        userId,
        account: { type: "Revenue" }
      },
      _sum: { credit: true }
    })

    const totalExpenses = await (prisma as any).transaction.aggregate({
      where: {
        userId,
        account: { type: "Expense" }
      },
      _sum: { debit: true }
    })

    const netIncome = (Number(totalRevenue._sum.credit || 0) - Number(totalExpenses._sum.debit || 0))

    const summary = [
      {
        title: "Total Assets",
        value: `KES ${(Number(totalAssets._sum.debit || 0) - Number(totalAssets._sum.credit || 0)).toLocaleString()}`,
        change: "+2.8%",
        trend: "up",
        icon: "Building2"
      },
      {
        title: "Total Liabilities",
        value: `KES ${(Number(totalLiabilities._sum.credit || 0) - Number(totalLiabilities._sum.debit || 0)).toLocaleString()}`,
        change: "-1.2%",
        trend: "down",
        icon: "CreditCard"
      },
      {
        title: "Owner's Equity",
        value: `KES ${(Number(totalEquity._sum.credit || 0) - Number(totalEquity._sum.debit || 0)).toLocaleString()}`,
        change: "+3.5%",
        trend: "up",
        icon: "DollarSign"
      },
      {
        title: "Net Income (YTD)",
        value: `KES ${netIncome.toLocaleString()}`,
        change: "+18.2%",
        trend: "up",
        icon: "TrendingUp"
      }
    ]

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Account summary API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}