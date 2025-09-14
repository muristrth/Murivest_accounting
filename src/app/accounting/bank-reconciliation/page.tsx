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
  Banknote,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Filter,
  Calculator
} from "lucide-react"

interface BankReconciliation {
  id: string
  statementDate: string
  bankName: string
  accountNumber: string
  statementBalance: number
  bookBalance: number
  reconciled: boolean
  notes: string
}

export default function BankReconciliation() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedReconciliation, setSelectedReconciliation] = useState<BankReconciliation | null>(null)

  // Form states
  const [reconciliationForm, setReconciliationForm] = useState({
    statementDate: '',
    bankName: '',
    accountNumber: '',
    statementBalance: '',
    bookBalance: '',
    notes: ''
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user) {
      fetchReconciliations()
    }
  }, [status, session, router])

  const fetchReconciliations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bank-reconciliations")
      if (response.ok) {
        const data = await response.json()
        setReconciliations(data)
      }
    } catch (error) {
      console.error("Failed to fetch reconciliations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddReconciliation = async () => {
    try {
      const response = await fetch("/api/bank-reconciliations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statementDate: reconciliationForm.statementDate,
          bankName: reconciliationForm.bankName,
          accountNumber: reconciliationForm.accountNumber,
          statementBalance: parseFloat(reconciliationForm.statementBalance),
          bookBalance: parseFloat(reconciliationForm.bookBalance),
          notes: reconciliationForm.notes
        }),
      })

      if (response.ok) {
        setIsAddModalOpen(false)
        setReconciliationForm({
          statementDate: '',
          bankName: '',
          accountNumber: '',
          statementBalance: '',
          bookBalance: '',
          notes: ''
        })
        fetchReconciliations()
        alert('Bank reconciliation added successfully!')
      } else {
        alert('Failed to add bank reconciliation')
      }
    } catch (error) {
      console.error('Failed to add reconciliation:', error)
      alert('Failed to add bank reconciliation')
    }
  }

  const handleEditReconciliation = async () => {
    if (!selectedReconciliation) return

    try {
      const response = await fetch(`/api/bank-reconciliations/${selectedReconciliation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statementDate: reconciliationForm.statementDate,
          bankName: reconciliationForm.bankName,
          accountNumber: reconciliationForm.accountNumber,
          statementBalance: parseFloat(reconciliationForm.statementBalance),
          bookBalance: parseFloat(reconciliationForm.bookBalance),
          notes: reconciliationForm.notes
        }),
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        setSelectedReconciliation(null)
        setReconciliationForm({
          statementDate: '',
          bankName: '',
          accountNumber: '',
          statementBalance: '',
          bookBalance: '',
          notes: ''
        })
        fetchReconciliations()
        alert('Bank reconciliation updated successfully!')
      } else {
        alert('Failed to update bank reconciliation')
      }
    } catch (error) {
      console.error('Failed to update reconciliation:', error)
      alert('Failed to update bank reconciliation')
    }
  }

  const handleDeleteReconciliation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bank reconciliation?')) return

    try {
      const response = await fetch(`/api/bank-reconciliations/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchReconciliations()
        alert('Bank reconciliation deleted successfully!')
      } else {
        alert('Failed to delete bank reconciliation')
      }
    } catch (error) {
      console.error('Failed to delete reconciliation:', error)
      alert('Failed to delete bank reconciliation')
    }
  }

  const handleMarkReconciled = async (id: string) => {
    try {
      const response = await fetch(`/api/bank-reconciliations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reconciled: true }),
      })

      if (response.ok) {
        fetchReconciliations()
        alert('Bank reconciliation marked as completed!')
      } else {
        alert('Failed to update reconciliation status')
      }
    } catch (error) {
      console.error('Failed to mark as reconciled:', error)
      alert('Failed to update reconciliation status')
    }
  }

  const openEditModal = (reconciliation: BankReconciliation) => {
    setSelectedReconciliation(reconciliation)
    setReconciliationForm({
      statementDate: reconciliation.statementDate.split('T')[0],
      bankName: reconciliation.bankName,
      accountNumber: reconciliation.accountNumber,
      statementBalance: reconciliation.statementBalance.toString(),
      bookBalance: reconciliation.bookBalance.toString(),
      notes: reconciliation.notes
    })
    setIsEditModalOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`
  }

  const calculateDifference = (statementBalance: number, bookBalance: number) => {
    return statementBalance - bookBalance
  }

  const unreconciledCount = reconciliations.filter(r => !r.reconciled).length
  const totalDifference = reconciliations
    .filter(r => !r.reconciled)
    .reduce((sum, r) => sum + Math.abs(calculateDifference(r.statementBalance, r.bookBalance)), 0)

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading bank reconciliation...</p>
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
              <h1 className="text-3xl font-bold">Bank Reconciliation</h1>
              <p className="text-muted-foreground">
                Reconcile bank statements with your accounting records
              </p>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Reconciliation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Bank Reconciliation</DialogTitle>
                    <DialogDescription>
                      Create a new bank reconciliation to match your records
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="statement-date">Statement Date</Label>
                        <Input
                          id="statement-date"
                          type="date"
                          value={reconciliationForm.statementDate}
                          onChange={(e) => setReconciliationForm({...reconciliationForm, statementDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input
                          id="bank-name"
                          value={reconciliationForm.bankName}
                          onChange={(e) => setReconciliationForm({...reconciliationForm, bankName: e.target.value})}
                          placeholder="e.g., KCB Bank"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input
                          id="account-number"
                          value={reconciliationForm.accountNumber}
                          onChange={(e) => setReconciliationForm({...reconciliationForm, accountNumber: e.target.value})}
                          placeholder="e.g., 1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statement-balance">Statement Balance (KES)</Label>
                        <Input
                          id="statement-balance"
                          type="number"
                          value={reconciliationForm.statementBalance}
                          onChange={(e) => setReconciliationForm({...reconciliationForm, statementBalance: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="book-balance">Book Balance (KES)</Label>
                        <Input
                          id="book-balance"
                          type="number"
                          value={reconciliationForm.bookBalance}
                          onChange={(e) => setReconciliationForm({...reconciliationForm, bookBalance: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={reconciliationForm.notes}
                        onChange={(e) => setReconciliationForm({...reconciliationForm, notes: e.target.value})}
                        placeholder="Additional notes or adjustments"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddReconciliation}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Reconciliation
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
                <CardTitle className="text-sm font-medium">Total Reconciliations</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reconciliations.length}</div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unreconciled</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{unreconciledCount}</div>
                <p className="text-xs text-muted-foreground">
                  Need attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Difference</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalDifference)}</div>
                <p className="text-xs text-muted-foreground">
                  Outstanding adjustments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {reconciliations.filter(r => r.reconciled).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully reconciled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reconciliations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Bank Reconciliations</CardTitle>
              <CardDescription>
                Manage and track your bank statement reconciliations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Statement Date</TableHead>
                      <TableHead>Bank Account</TableHead>
                      <TableHead>Statement Balance</TableHead>
                      <TableHead>Book Balance</TableHead>
                      <TableHead>Difference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Banknote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No reconciliations found</h3>
                          <p className="text-muted-foreground mb-4">
                            Start by creating your first bank reconciliation.
                          </p>
                          <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Reconciliation
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      reconciliations.map((reconciliation) => {
                        const difference = calculateDifference(
                          reconciliation.statementBalance,
                          reconciliation.bookBalance
                        )
                        return (
                          <TableRow key={reconciliation.id}>
                            <TableCell>
                              {new Date(reconciliation.statementDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{reconciliation.bankName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {reconciliation.accountNumber}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(reconciliation.statementBalance)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(reconciliation.bookBalance)}
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${
                                difference === 0 ? 'text-green-600' :
                                difference > 0 ? 'text-blue-600' : 'text-red-600'
                              }`}>
                                {difference === 0 ? 'Matched' : formatCurrency(Math.abs(difference))}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                reconciliation.reconciled
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }>
                                {reconciliation.reconciled ? "Reconciled" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {!reconciliation.reconciled && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleMarkReconciled(reconciliation.id)}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Complete
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditModal(reconciliation)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteReconciliation(reconciliation.id)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Reconciliation Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Bank Reconciliation</DialogTitle>
                <DialogDescription>
                  Update reconciliation information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-statement-date">Statement Date</Label>
                    <Input
                      id="edit-statement-date"
                      type="date"
                      value={reconciliationForm.statementDate}
                      onChange={(e) => setReconciliationForm({...reconciliationForm, statementDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-bank-name">Bank Name</Label>
                    <Input
                      id="edit-bank-name"
                      value={reconciliationForm.bankName}
                      onChange={(e) => setReconciliationForm({...reconciliationForm, bankName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-account-number">Account Number</Label>
                    <Input
                      id="edit-account-number"
                      value={reconciliationForm.accountNumber}
                      onChange={(e) => setReconciliationForm({...reconciliationForm, accountNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-statement-balance">Statement Balance (KES)</Label>
                    <Input
                      id="edit-statement-balance"
                      type="number"
                      value={reconciliationForm.statementBalance}
                      onChange={(e) => setReconciliationForm({...reconciliationForm, statementBalance: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-book-balance">Book Balance (KES)</Label>
                    <Input
                      id="edit-book-balance"
                      type="number"
                      value={reconciliationForm.bookBalance}
                      onChange={(e) => setReconciliationForm({...reconciliationForm, bookBalance: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Input
                    id="edit-notes"
                    value={reconciliationForm.notes}
                    onChange={(e) => setReconciliationForm({...reconciliationForm, notes: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditReconciliation}>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Reconciliation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}