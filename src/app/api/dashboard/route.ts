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

    // Fetch KPI data
    const [totalProperties, totalClients, totalRevenue, totalExpenses] = await Promise.all([
      prisma.property.count({ where: { userId } }),
      prisma.client.count({ where: { userId } }),
      prisma.transaction.aggregate({
        where: { userId, account: { type: "Revenue" } },
        _sum: { credit: true }
      }),
      prisma.transaction.aggregate({
        where: { userId, account: { type: "Expense" } },
        _sum: { debit: true }
      })
    ])

    const kpiData = [
      {
        title: "Total Properties",
        value: totalProperties.toString(),
        change: "+2",
        trend: "up" as const,
        icon: "Building2",
      },
      {
        title: "Total Clients",
        value: totalClients.toString(),
        change: "+5",
        trend: "up" as const,
        icon: "Users",
      },
      {
        title: "Monthly Revenue",
        value: `KES ${(totalRevenue._sum.credit || 0).toLocaleString()}`,
        change: "+8.2%",
        trend: "up" as const,
        icon: "DollarSign",
      },
      {
        title: "Monthly Expenses",
        value: `KES ${(totalExpenses._sum.debit || 0).toLocaleString()}`,
        change: "-2.1%",
        trend: "down" as const,
        icon: "TrendingDown",
      },
    ]

    // Fetch financial summary
    const [receivables, payables, cashBalance] = await Promise.all([
      prisma.invoice.aggregate({
        where: { userId, status: "UNPAID" },
        _sum: { totalAmount: true }
      }),
      prisma.bill.aggregate({
        where: { userId, status: "UNPAID" },
        _sum: { totalAmount: true }
      }),
      prisma.transaction.aggregate({
        where: { userId, account: { name: { contains: "Cash" } } },
        _sum: { debit: true, credit: true }
      })
    ])

    const receivablesAmount = Number(receivables._sum.totalAmount || 0)
    const payablesAmount = Number(payables._sum.totalAmount || 0)
    const cashDebit = Number(cashBalance._sum.debit || 0)
    const cashCredit = Number(cashBalance._sum.credit || 0)

    const financialSummary = [
      {
        title: "Accounts Receivable",
        value: `KES ${receivablesAmount.toLocaleString()}`,
        status: receivablesAmount > 1000000 ? "overdue" : "healthy",
        icon: "Receipt",
        color: receivablesAmount > 1000000 ? "text-red-600" : "text-green-600",
      },
      {
        title: "Accounts Payable",
        value: `KES ${payablesAmount.toLocaleString()}`,
        status: payablesAmount > 500000 ? "due_soon" : "healthy",
        icon: "CreditCard",
        color: payablesAmount > 500000 ? "text-yellow-600" : "text-green-600",
      },
      {
        title: "Cash Balance",
        value: `KES ${(cashDebit - cashCredit).toLocaleString()}`,
        status: "healthy",
        icon: "DollarSign",
        color: "text-green-600",
      },
    ]

    // Fetch recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      include: { account: true },
      orderBy: { createdAt: "desc" },
      take: 5
    })

    const formattedTransactions = recentTransactions.map((txn, index) => {
      const debit = Number(txn.debit || 0)
      const credit = Number(txn.credit || 0)
      const amount = debit + credit

      return {
        id: txn.id,
        type: txn.account.type === "Revenue" ? "Income" : txn.account.type === "Expense" ? "Expense" : "Transfer",
        client: txn.account.name,
        amount: `KES ${amount.toLocaleString()}`,
        date: txn.date.toISOString().split('T')[0],
        status: "completed",
      }
    })

    // Mock upcoming tasks (in a real app, you'd have a tasks table)
    const upcomingTasks = [
      {
        id: "1",
        task: "Bank Reconciliation - January",
        due: "2025-01-10",
        priority: "high",
      },
      {
        id: "2",
        task: "Quarterly Tax Filing",
        due: "2025-01-15",
        priority: "medium",
      },
      {
        id: "3",
        task: "Property Inspection - CBD Office",
        due: "2025-01-12",
        priority: "low",
      },
    ]

    return NextResponse.json({
      kpiData,
      financialSummary,
      recentTransactions: formattedTransactions,
      upcomingTasks
    })

  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}