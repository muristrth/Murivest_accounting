"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Plus,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Download,
  Eye,
  Edit
} from "lucide-react"

const invoiceData = [
  {
    id: "INV-2025-001",
    client: "Westlands Mall Ltd",
    property: "Westlands Office Complex",
    amount: "KES 2,400,000",
    dueDate: "2025-01-15",
    status: "paid",
    paymentDate: "2025-01-07",
    description: "Monthly Rent - January 2025"
  },
  {
    id: "INV-2025-002",
    client: "Tech Innovations Kenya",
    property: "CBD Shopping Mall - Unit 15",
    amount: "KES 450,000",
    dueDate: "2025-01-10",
    status: "overdue",
    daysOverdue: 3,
    description: "Monthly Rent - January 2025"
  },
  {
    id: "INV-2025-003",
    client: "Logistics Solutions Ltd",
    property: "Industrial Warehouse",
    amount: "KES 620,000",
    dueDate: "2025-01-20",
    status: "pending",
    description: "Monthly Rent - January 2025"
  },
  {
    id: "INV-2025-004",
    client: "Retail Chain Kenya",
    property: "CBD Shopping Mall - Units 5-8",
    amount: "KES 1,200,000",
    dueDate: "2025-01-25",
    status: "sent",
    description: "Monthly Rent - January 2025"
  }
]

const arSummary = [
  {
    title: "Total Outstanding",
    value: "KES 12.5M",
    change: "-KES 2.4M",
    trend: "down",
    description: "from last month"
  },
  {
    title: "Overdue Amount",
    value: "KES 3.2M",
    change: "+KES 0.8M",
    trend: "up",
    description: "from last month"
  },
  {
    title: "Avg Collection Period",
    value: "18 days",
    change: "-3 days",
    trend: "down",
    description: "from last month"
  },
  {
    title: "Collection Rate",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    description: "last 90 days"
  }
]

const reminderTemplates = [
  { name: "First Reminder", days: 3, sent: 12 },
  { name: "Second Reminder", days: 7, sent: 8 },
  { name: "Final Notice", days: 14, sent: 3 },
  { name: "Collection Agency", days: 30, sent: 1 }
]

const agingBuckets = [
  { range: "Current", amount: "KES 8.1M", count: 15, percentage: 65 },
  { range: "1-30 days", amount: "KES 2.8M", count: 8, percentage: 22 },
  { range: "31-60 days", amount: "KES 1.2M", count: 4, percentage: 10 },
  { range: "60+ days", amount: "KES 0.4M", count: 2, percentage: 3 }
]

export default function AccountsReceivable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "overdue": return "bg-red-100 text-red-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "sent": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />
      case "overdue": return <AlertTriangle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "sent": return <Send className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Accounts Receivable</h1>
              <p className="text-muted-foreground">
                Manage invoices, payments, and customer collections
              </p>
            </div>
            <div className="flex space-x-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export AR Report
              </Button>
            </div>
          </div>

          {/* AR Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {arSummary.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <span className={item.trend === "up" ? "text-red-600" : "text-green-600"}>
                      {item.change}
                    </span>
                    <span>{item.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="invoices" className="space-y-4">
            <TabsList>
              <TabsTrigger value="invoices">All Invoices</TabsTrigger>
              <TabsTrigger value="aging">Aging Report</TabsTrigger>
              <TabsTrigger value="reminders">Automated Reminders</TabsTrigger>
              <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>
                    Track all outstanding and paid invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoiceData.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            {getStatusIcon(invoice.status)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{invoice.id}</p>
                              <Badge className={getStatusColor(invoice.status)}>
                                {invoice.status.toUpperCase()}
                                {invoice.status === "overdue" && invoice.daysOverdue &&
                                  ` (${invoice.daysOverdue} days)`
                                }
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{invoice.client}</p>
                            <p className="text-xs text-muted-foreground">{invoice.property}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{invoice.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {invoice.dueDate}
                          </p>
                          {invoice.paymentDate && (
                            <p className="text-xs text-green-600">
                              Paid: {invoice.paymentDate}
                            </p>
                          )}
                          <div className="flex space-x-1 mt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <Send className="h-3 w-3 mr-1" />
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aging">
              <Card>
                <CardHeader>
                  <CardTitle>Accounts Receivable Aging</CardTitle>
                  <CardDescription>
                    Outstanding balances by age
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agingBuckets.map((bucket, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{bucket.range}</p>
                          <p className="text-sm text-muted-foreground">{bucket.count} invoices</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{bucket.amount}</p>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-primary rounded-full"
                                style={{ width: `${bucket.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{bucket.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reminders">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Payment Reminders</CardTitle>
                  <CardDescription>
                    Configure and track automated reminder sequences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reminderTemplates.map((template, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{template.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Send {template.days} days after due date
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{template.sent} sent this month</p>
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Template
                            </Button>
                            <Button size="sm" variant="outline">
                              <Send className="h-3 w-3 mr-1" />
                              Send Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Tracking</CardTitle>
                  <CardDescription>
                    Monitor payment methods and processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Bank Transfers</h3>
                      <p className="text-2xl font-bold">KES 8.5M</p>
                      <p className="text-sm text-muted-foreground">68% of payments</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Mobile Money</h3>
                      <p className="text-2xl font-bold">KES 3.2M</p>
                      <p className="text-sm text-muted-foreground">26% of payments</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Cash/Check</h3>
                      <p className="text-2xl font-bold">KES 0.8M</p>
                      <p className="text-sm text-muted-foreground">6% of payments</p>
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
