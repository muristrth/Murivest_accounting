"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  CreditCard,
  Receipt,
  Plus
} from "lucide-react"

// Types for dashboard data
interface KPIData {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: any
}

interface FinancialSummary {
  title: string
  value: string
  status: string
  icon: any
  color: string
}

interface Transaction {
  id: string
  type: string
  client: string
  amount: string
  date: string
  status: string
}

interface Task {
  id: string
  task: string
  due: string
  priority: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [kpiData, setKpiData] = useState<KPIData[]>([])
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard")
      if (response.ok) {
        const data = await response.json()
        setKpiData(data.kpiData)
        setFinancialSummary(data.financialSummary)
        setRecentTransactions(data.recentTransactions)
        setUpcomingTasks(data.upcomingTasks)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
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
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {session.user.name}! Here's what's happening with your portfolio.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => {
              const getIcon = (iconName: string) => {
                switch (iconName) {
                  case "Building2": return Building2
                  case "Users": return Users
                  case "DollarSign": return DollarSign
                  case "TrendingDown": return TrendingDown
                  default: return Building2
                }
              }
              const IconComponent = getIcon(kpi.icon)

              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {kpi.title}
                    </CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={kpi.trend === "up" ? "text-green-600" : "text-red-600"}>
                        {kpi.change}
                      </span>
                      <span>from last month</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {financialSummary.map((item, index) => {
              const getIcon = (iconName: string) => {
                switch (iconName) {
                  case "Receipt": return Receipt
                  case "CreditCard": return CreditCard
                  case "DollarSign": return DollarSign
                  default: return DollarSign
                }
              }
              const IconComponent = getIcon(item.icon)

              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {item.title}
                    </CardTitle>
                    <IconComponent className={`h-4 w-4 ${item.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <Badge
                      variant={item.status === "healthy" ? "default" : "destructive"}
                      className="mt-2"
                    >
                      {item.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="transactions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
              <TabsTrigger value="tasks">Upcoming Tasks</TabsTrigger>
              <TabsTrigger value="properties">Property Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Latest financial activities in your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            {transaction.type === "Payment Received" ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.type}</p>
                            <p className="text-sm text-muted-foreground">{transaction.client}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{transaction.amount}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                            <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>
                    Important deadlines and activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            {task.priority === "high" ? (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            ) : task.priority === "medium" ? (
                              <Clock className="h-5 w-5 text-yellow-600" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{task.task}</p>
                            <p className="text-sm text-muted-foreground">Due: {task.due}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            task.priority === "high" ? "destructive" :
                            task.priority === "medium" ? "secondary" : "default"
                          }
                        >
                          {task.priority.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <CardTitle>Property Portfolio Overview</CardTitle>
                  <CardDescription>
                    Quick snapshot of your real estate assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Westlands Office Complex</h3>
                        <Badge>Leased</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Commercial Office</p>
                      <p className="text-lg font-bold">KES 15M/month</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">CBD Shopping Mall</h3>
                        <Badge variant="secondary">Partially Occupied</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Retail Space</p>
                      <p className="text-lg font-bold">KES 8.5M/month</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Industrial Warehouse</h3>
                        <Badge>Leased</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Warehouse</p>
                      <p className="text-lg font-bold">KES 6.2M/month</p>
                    </div>
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
