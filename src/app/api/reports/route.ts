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
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "current_month"

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    let endDate: Date = new Date(now)

    switch (period) {
      case "current_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "last_month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case "current_quarter":
        const quarterStart = Math.floor(now.getMonth() / 3) * 3
        startDate = new Date(now.getFullYear(), quarterStart, 1)
        break
      case "last_quarter":
        const lastQuarterStart = Math.floor((now.getMonth() - 3) / 3) * 3
        startDate = new Date(now.getFullYear(), lastQuarterStart, 1)
        endDate = new Date(now.getFullYear(), lastQuarterStart + 3, 0)
        break
      case "current_year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case "last_year":
        startDate = new Date(now.getFullYear() - 1, 0, 1)
        endDate = new Date(now.getFullYear() - 1, 11, 31)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Fetch revenue data
    const revenueData = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { type: "Revenue" },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { credit: true }
    })

    const rentalIncome = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Rental" } },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { credit: true }
    })

    const managementFees = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Management" } },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { credit: true }
    })

    // Fetch expense data
    const expenseData = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { type: "Expense" },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { debit: true }
    })

    const maintenanceExpense = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Maintenance" } },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { debit: true }
    })

    const salaryExpense = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Salaries" } },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { debit: true }
    })

    const marketingExpense = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Marketing" } },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { debit: true }
    })

    const professionalExpense = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Professional" } },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { debit: true }
    })

    // Fetch balance sheet data
    const cashBalance = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Cash" } }
      },
      _sum: { debit: true, credit: true }
    })

    const receivables = await prisma.invoice.aggregate({
      where: {
        userId,
        status: "UNPAID"
      },
      _sum: { totalAmount: true }
    })

    const investmentProperties = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Investment Properties" } }
      },
      _sum: { debit: true }
    })

    const equipment = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Equipment" } }
      },
      _sum: { debit: true }
    })

    const payables = await prisma.bill.aggregate({
      where: {
        userId,
        status: "UNPAID"
      },
      _sum: { totalAmount: true }
    })

    const longTermLoans = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Long-term Loans" } }
      },
      _sum: { credit: true }
    })

    const ownersEquity = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Owner's Equity" } }
      },
      _sum: { credit: true }
    })

    const retainedEarnings = await prisma.transaction.aggregate({
      where: {
        userId,
        account: { name: { contains: "Retained Earnings" } }
      },
      _sum: { credit: true }
    })

    // Calculate totals
    const totalRevenue = Number(revenueData._sum.credit || 0)
    const totalExpenses = Number(expenseData._sum.debit || 0)
    const netIncome = totalRevenue - totalExpenses

    const totalAssets = Number(cashBalance._sum.debit || 0) - Number(cashBalance._sum.credit || 0) +
                       Number(receivables._sum.totalAmount || 0) +
                       Number(investmentProperties._sum.debit || 0) +
                       Number(equipment._sum.debit || 0)

    const totalLiabilities = Number(payables._sum.totalAmount || 0) +
                            Number(longTermLoans._sum.credit || 0)

    const totalEquity = Number(ownersEquity._sum.credit || 0) +
                       Number(retainedEarnings._sum.credit || 0)

    const reportData = {
      profitAndLoss: {
        revenue: {
          rentalIncome: Number(rentalIncome._sum.credit || 0),
          propertyManagementFees: Number(managementFees._sum.credit || 0),
          totalRevenue
        },
        expenses: {
          propertyMaintenance: Number(maintenanceExpense._sum.debit || 0),
          staffSalaries: Number(salaryExpense._sum.debit || 0),
          marketing: Number(marketingExpense._sum.debit || 0),
          professionalServices: Number(professionalExpense._sum.debit || 0),
          totalExpenses
        },
        netIncome
      },
      balanceSheet: {
        assets: {
          cashAndEquivalents: Number(cashBalance._sum.debit || 0) - Number(cashBalance._sum.credit || 0),
          accountsReceivable: Number(receivables._sum.totalAmount || 0),
          investmentProperties: Number(investmentProperties._sum.debit || 0),
          equipment: Number(equipment._sum.debit || 0),
          totalAssets
        },
        liabilities: {
          accountsPayable: Number(payables._sum.totalAmount || 0),
          accruedExpenses: 0, // Placeholder
          longTermLoans: Number(longTermLoans._sum.credit || 0),
          totalLiabilities
        },
        equity: {
          ownersEquity: Number(ownersEquity._sum.credit || 0),
          retainedEarnings: Number(retainedEarnings._sum.credit || 0),
          totalEquity
        },
        totalLiabilitiesAndEquity: totalLiabilities + totalEquity
      }
    }

    return NextResponse.json(reportData)

  } catch (error) {
    console.error("Reports API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}