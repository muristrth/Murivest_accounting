"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  Users,
  CreditCard,
  Receipt
} from "lucide-react"

interface ReportData {
  profitAndLoss: {
    revenue: {
      rentalIncome: number
      propertyManagementFees: number
      totalRevenue: number
    }
    expenses: {
      propertyMaintenance: number
      staffSalaries: number
      marketing: number
      professionalServices: number
      totalExpenses: number
    }
    netIncome: number
  }
  balanceSheet: {
    assets: {
      cashAndEquivalents: number
      accountsReceivable: number
      investmentProperties: number
      equipment: number
      totalAssets: number
    }
    liabilities: {
      accountsPayable: number
      accruedExpenses: number
      longTermLoans: number
      totalLiabilities: number
    }
    equity: {
      ownersEquity: number
      retainedEarnings: number
      totalEquity: number
    }
    totalLiabilitiesAndEquity: number
  }
}

export default function Reports() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("current_month")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchReportData()
    }
  }, [session, selectedPeriod])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error("Failed to fetch report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`
  }

  const exportReport = (type: string) => {
    // In a real app, this would generate and download a PDF/Excel file
    console.log(`Exporting ${type} report for ${selectedPeriod}`)
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Generating reports...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Financial Reports</h1>
              <p className="text-muted-foreground">
                Profit & Loss statements and balance sheet reports
              </p>
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="current_month">Current Month</option>
                <option value="last_month">Last Month</option>
                <option value="current_quarter">Current Quarter</option>
                <option value="last_quarter">Last Quarter</option>
                <option value="current_year">Current Year</option>
                <option value="last_year">Last Year</option>
              </select>
              <Button variant="outline" onClick={() => exportReport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          {reportData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(reportData.profitAndLoss.revenue.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For selected period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(reportData.profitAndLoss.expenses.totalExpenses)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Operating costs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                  <DollarSign className={`h-4 w-4 ${reportData.profitAndLoss.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${reportData.profitAndLoss.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(reportData.profitAndLoss.netIncome)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Profit/Loss
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                  <Building2 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(reportData.balanceSheet.assets.totalAssets)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Company assets
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Report Tabs */}
          <Tabs defaultValue="profit-loss" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
              <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
              <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
            </TabsList>

            <TabsContent value="profit-loss">
              <Card>
                <CardHeader>
                  <CardTitle>Profit & Loss Statement</CardTitle>
                  <CardDescription>
                    Revenue and expenses for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData && (
                    <div className="space-y-6">
                      {/* Revenue Section */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-700">Revenue</h3>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between">
                            <span>Rental Income</span>
                            <span className="font-medium">{formatCurrency(reportData.profitAndLoss.revenue.rentalIncome)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Property Management Fees</span>
                            <span className="font-medium">{formatCurrency(reportData.profitAndLoss.revenue.propertyManagementFees)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Total Revenue</span>
                            <span className="font-semibold text-green-600">{formatCurrency(reportData.profitAndLoss.revenue.totalRevenue)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expenses Section */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-red-700">Expenses</h3>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between">
                            <span>Property Maintenance</span>
                            <span className="font-medium">{formatCurrency(reportData.profitAndLoss.expenses.propertyMaintenance)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Staff Salaries</span>
                            <span className="font-medium">{formatCurrency(reportData.profitAndLoss.expenses.staffSalaries)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Marketing & Advertising</span>
                            <span className="font-medium">{formatCurrency(reportData.profitAndLoss.expenses.marketing)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Professional Services</span>
                            <span className="font-medium">{formatCurrency(reportData.profitAndLoss.expenses.professionalServices)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Total Expenses</span>
                            <span className="font-semibold text-red-600">{formatCurrency(reportData.profitAndLoss.expenses.totalExpenses)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Net Income */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Net Income</span>
                          <span className={reportData.profitAndLoss.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(reportData.profitAndLoss.netIncome)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="balance-sheet">
              <Card>
                <CardHeader>
                  <CardTitle>Balance Sheet</CardTitle>
                  <CardDescription>
                    Assets, liabilities, and equity as of the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Assets */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-700">Assets</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Cash & Equivalents</span>
                            <span className="font-medium">{formatCurrency(reportData.balanceSheet.assets.cashAndEquivalents)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Accounts Receivable</span>
                            <span className="font-medium">{formatCurrency(reportData.balanceSheet.assets.accountsReceivable)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Investment Properties</span>
                            <span className="font-medium">{formatCurrency(reportData.balanceSheet.assets.investmentProperties)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Equipment & Furniture</span>
                            <span className="font-medium">{formatCurrency(reportData.balanceSheet.assets.equipment)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 font-semibold">
                            <span>Total Assets</span>
                            <span className="text-blue-600">{formatCurrency(reportData.balanceSheet.assets.totalAssets)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Liabilities */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-red-700">Liabilities</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Accounts Payable</span>
                            <span className="font-medium">{formatCurrency(reportData.balanceSheet.liabilities.accountsPayable)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Accrued Expenses</span>
                            <span className="font-medium">{formatCurrency(reportData.balanceSheet.liabilities.accruedExpenses)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Long-term Loans</span>
                            <span className="font-medium">{formatCurrency(reportData.balanceSheet.liabilities.longTermLoans)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 font-semibold">
                            <span>Total Liabilities</span>
                            <span className="text-red-600">{formatCurrency(reportData.balanceSheet.liabilities.totalLiabilities)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Equity */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-700">Equity</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Owner's Equity</span>
                            <span className="font-medium">{formatCurrency(reportData.balanceSheet.equity.ownersEquity)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Retained Earnings</span>
                            <span className="font-medium">{formatCurrency(reportData.balanceSheet.equity.retainedEarnings)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 font-semibold">
                            <span>Total Equity</span>
                            <span className="text-green-600">{formatCurrency(reportData.balanceSheet.equity.totalEquity)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cash-flow">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Statement</CardTitle>
                  <CardDescription>
                    Cash inflows and outflows for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Cash Flow Report</h3>
                    <p className="text-muted-foreground mb-4">
                      Detailed cash flow analysis will be available in the next update
                    </p>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Generate Cash Flow Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}