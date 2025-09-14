"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Receipt,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter
} from "lucide-react"

interface Bill {
  id: string
  number: string
  date: string
  dueDate: string
  amount: number
  taxAmount: number
  totalAmount: number
  status: string
  vendorName: string
  vendorEmail: string
  description: string
}

export default function AccountsPayable() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)

  // Form states
  const [billForm, setBillForm] = useState({
    number: '',
    date: '',
    dueDate: '',
    amount: '',
    taxAmount: '',
    vendorName: '',
    vendorEmail: '',
    description: ''
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user) {
      fetchBills()
    }
  }, [status, session, router])

  const fetchBills = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bills")
      if (response.ok) {
        const data = await response.json()
        setBills(data)
      }
    } catch (error) {
      console.error("Failed to fetch bills:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBill = async () => {
    try {
      const response = await fetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...billForm,
          amount: parseFloat(billForm.amount),
          taxAmount: parseFloat(billForm.taxAmount),
          totalAmount: parseFloat(billForm.amount) + parseFloat(billForm.taxAmount)
        }),
      })

      if (response.ok) {
        setIsAddModalOpen(false)
        setBillForm({
          number: '',
          date: '',
          dueDate: '',
          amount: '',
          taxAmount: '',
          vendorName: '',
          vendorEmail: '',
          description: ''
        })
        fetchBills()
        alert('Bill added successfully!')
      } else {
        alert('Failed to add bill')
      }
    } catch (error) {
      console.error('Failed to add bill:', error)
      alert('Failed to add bill')
    }
  }

  const handleEditBill = async () => {
    if (!selectedBill) return

    try {
      const response = await fetch(`/api/bills/${selectedBill.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...billForm,
          amount: parseFloat(billForm.amount),
          taxAmount: parseFloat(billForm.taxAmount),
          totalAmount: parseFloat(billForm.amount) + parseFloat(billForm.taxAmount)
        }),
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        setSelectedBill(null)
        setBillForm({
          number: '',
          date: '',
          dueDate: '',
          amount: '',
          taxAmount: '',
          vendorName: '',
          vendorEmail: '',
          description: ''
        })
        fetchBills()
        alert('Bill updated successfully!')
      } else {
        alert('Failed to update bill')
      }
    } catch (error) {
      console.error('Failed to update bill:', error)
      alert('Failed to update bill')
    }
  }

  const handleDeleteBill = async (billId: string) => {
    if (!confirm('Are you sure you want to delete this bill?')) return

    try {
      const response = await fetch(`/api/bills/${billId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchBills()
        alert('Bill deleted successfully!')
      } else {
        alert('Failed to delete bill')
      }
    } catch (error) {
      console.error('Failed to delete bill:', error)
      alert('Failed to delete bill')
    }
  }

  const openEditModal = (bill: Bill) => {
    setSelectedBill(bill)
    setBillForm({
      number: bill.number,
      date: bill.date,
      dueDate: bill.dueDate,
      amount: bill.amount.toString(),
      taxAmount: bill.taxAmount.toString(),
      vendorName: bill.vendorName,
      vendorEmail: bill.vendorEmail,
      description: bill.description
    })
    setIsEditModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800"
      case "OVERDUE": return "bg-red-100 text-red-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`
  }

  const overdueBills = bills.filter(bill => bill.status === "OVERDUE")
  const pendingBills = bills.filter(bill => bill.status === "PENDING")
  const totalPayable = bills
    .filter(bill => bill.status !== "PAID")
    .reduce((sum, bill) => sum + bill.totalAmount, 0)

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading accounts payable...</p>
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
              <h1 className="text-3xl font-bold">Accounts Payable</h1>
              <p className="text-muted-foreground">
                Manage vendor bills and payment obligations
              </p>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bill
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Bill</DialogTitle>
                    <DialogDescription>
                      Create a new vendor bill for payment tracking
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bill-number">Bill Number</Label>
                        <Input
                          id="bill-number"
                          value={billForm.number}
                          onChange={(e) => setBillForm({...billForm, number: e.target.value})}
                          placeholder="e.g., BILL-2025-001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bill-date">Bill Date</Label>
                        <Input
                          id="bill-date"
                          type="date"
                          value={billForm.date}
                          onChange={(e) => setBillForm({...billForm, date: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="due-date">Due Date</Label>
                        <Input
                          id="due-date"
                          type="date"
                          value={billForm.dueDate}
                          onChange={(e) => setBillForm({...billForm, dueDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (KES)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={billForm.amount}
                          onChange={(e) => setBillForm({...billForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tax-amount">Tax Amount (KES)</Label>
                        <Input
                          id="tax-amount"
                          type="number"
                          value={billForm.taxAmount}
                          onChange={(e) => setBillForm({...billForm, taxAmount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor-name">Vendor Name</Label>
                        <Input
                          id="vendor-name"
                          value={billForm.vendorName}
                          onChange={(e) => setBillForm({...billForm, vendorName: e.target.value})}
                          placeholder="Vendor company name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vendor-email">Vendor Email</Label>
                      <Input
                        id="vendor-email"
                        type="email"
                        value={billForm.vendorEmail}
                        onChange={(e) => setBillForm({...billForm, vendorEmail: e.target.value})}
                        placeholder="vendor@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={billForm.description}
                        onChange={(e) => setBillForm({...billForm, description: e.target.value})}
                        placeholder="Bill description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddBill}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Bill
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payable</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalPayable)}</div>
                <p className="text-xs text-muted-foreground">
                  Outstanding bills
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Bills</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{overdueBills.length}</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingBills.length}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting payment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {bills.filter(bill => {
                    const billDate = new Date(bill.date)
                    const now = new Date()
                    return billDate.getMonth() === now.getMonth() &&
                           billDate.getFullYear() === now.getFullYear()
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Bills this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bills Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Bills</CardTitle>
              <CardDescription>
                Manage all vendor bills and payment tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No bills found</h3>
                          <p className="text-muted-foreground mb-4">
                            Add your first vendor bill to get started.
                          </p>
                          <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Bill
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      bills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-medium">{bill.number}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{bill.vendorName}</p>
                              <p className="text-sm text-muted-foreground">{bill.vendorEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{formatCurrency(bill.totalAmount)}</p>
                              <p className="text-sm text-muted-foreground">
                                Amount: {formatCurrency(bill.amount)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{new Date(bill.dueDate).toLocaleDateString()}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(bill.dueDate) < new Date() && bill.status !== "PAID"
                                  ? "Overdue"
                                  : `${Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(bill.status)}>
                              {bill.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditModal(bill)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteBill(bill.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Bill Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Bill</DialogTitle>
                <DialogDescription>
                  Update bill information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-bill-number">Bill Number</Label>
                    <Input
                      id="edit-bill-number"
                      value={billForm.number}
                      onChange={(e) => setBillForm({...billForm, number: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-bill-date">Bill Date</Label>
                    <Input
                      id="edit-bill-date"
                      type="date"
                      value={billForm.date}
                      onChange={(e) => setBillForm({...billForm, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-due-date">Due Date</Label>
                    <Input
                      id="edit-due-date"
                      type="date"
                      value={billForm.dueDate}
                      onChange={(e) => setBillForm({...billForm, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-amount">Amount (KES)</Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      value={billForm.amount}
                      onChange={(e) => setBillForm({...billForm, amount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-tax-amount">Tax Amount (KES)</Label>
                    <Input
                      id="edit-tax-amount"
                      type="number"
                      value={billForm.taxAmount}
                      onChange={(e) => setBillForm({...billForm, taxAmount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-vendor-name">Vendor Name</Label>
                    <Input
                      id="edit-vendor-name"
                      value={billForm.vendorName}
                      onChange={(e) => setBillForm({...billForm, vendorName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-vendor-email">Vendor Email</Label>
                  <Input
                    id="edit-vendor-email"
                    type="email"
                    value={billForm.vendorEmail}
                    onChange={(e) => setBillForm({...billForm, vendorEmail: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={billForm.description}
                    onChange={(e) => setBillForm({...billForm, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditBill}>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Bill
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}