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

    // Get all accounts with their transaction balances
    const accounts = await (prisma as any).account.findMany({
      where: { userId },
      include: {
        transactions: true
      },
      orderBy: { code: 'asc' }
    })

    const trialBalance = accounts.map((account: any) => {
      const debitBalance = account.transactions.reduce((sum: number, txn: any) =>
        sum + Number(txn.debit || 0), 0)
      const creditBalance = account.transactions.reduce((sum: number, txn: any) =>
        sum + Number(txn.credit || 0), 0)

      // For assets and expenses: debit balance
      // For liabilities, equity, and revenue: credit balance
      const isDebitAccount = ['Asset', 'Expense'].includes(account.type)

      return {
        account: account.name,
        debit: isDebitAccount ? debitBalance.toString() : '',
        credit: !isDebitAccount ? creditBalance.toString() : ''
      }
    }).filter((item: any) => item.debit !== '' || item.credit !== '')

    return NextResponse.json(trialBalance)
  } catch (error) {
    console.error("Trial balance API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}