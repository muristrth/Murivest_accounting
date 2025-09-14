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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  Plus,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Users,
  CreditCard,
  Receipt,
  Banknote,
  Settings,
  Eye,
  Edit,
  Download,
  Filter,
  Save,
  X,
  Trash2
} from "lucide-react"

export default function GeneralLedger() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [accountSummary, setAccountSummary] = useState([])
  const [trialBalance, setTrialBalance] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  type Account = {
    id: string
    code: string
    name: string
    type: string
    category: string
    description?: string
    [key: string]: any
  }
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [processing, setProcessing] = useState(false)

  // Form states
  const [accountForm, setAccountForm] = useState({
    code: '',
    name: '',
    type: '',
    category: '',
    description: ''
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user) {
      fetchGeneralLedgerData()
    }
  }, [status, session, router])

  const fetchGeneralLedgerData = async () => {
    try {
      setLoading(true)

      // Fetch accounts
      const accountsResponse = await fetch("/api/accounts")
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json()
        setAccounts(accountsData)
      }

      // Fetch recent transactions
      const transactionsResponse = await fetch("/api/transactions?limit=10")
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData)
      }

      // Fetch account summary
      const summaryResponse = await fetch("/api/accounts/summary")
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        setAccountSummary(summaryData)
      }

      // Fetch trial balance
      const trialResponse = await fetch("/api/accounts/trial-balance")
      if (trialResponse.ok) {
        const trialData = await trialResponse.json()
        setTrialBalance(trialData)
      }
    } catch (error) {
      console.error("Failed to fetch general ledger data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Asset": return "bg-green-100 text-green-800"
      case "Liability": return "bg-red-100 text-red-800"
      case "Equity": return "bg-blue-100 text-blue-800"
      case "Revenue": return "bg-purple-100 text-purple-800"
      case "Expense": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: string) => {
    if (!amount) return ""
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleAddAccount = async () => {
    setProcessing(true)
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountForm),
      })

      if (response.ok) {
        await fetchGeneralLedgerData()
        setIsAddModalOpen(false)
        setAccountForm({ code: '', name: '', type: '', category: '', description: '' })
        alert('Account added successfully!')
      } else {
        alert('Failed to add account')
      }
    } catch (error) {
      console.error('Failed to add account:', error)
      alert('Failed to add account')
    } finally {
      setProcessing(false)
    }
  }

  const handleEditAccount = async () => {
    if (!selectedAccount) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/accounts/${selectedAccount.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountForm),
      })

      if (response.ok) {
        await fetchGeneralLedgerData()
        setIsEditModalOpen(false)
        setSelectedAccount(null)
        setAccountForm({ code: '', name: '', type: '', category: '', description: '' })
        alert('Account updated successfully!')
      } else {
        alert('Failed to update account')
      }
    } catch (error) {
      console.error('Failed to update account:', error)
      alert('Failed to update account')
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchGeneralLedgerData()
        alert('Account deleted successfully!')
      } else {
        alert('Failed to delete account')
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert('Failed to delete account')
    } finally {
      setProcessing(false)
    }
  }

  const openEditModal = (account: any) => {
    setSelectedAccount(account)
    setAccountForm({
      code: account.code,
      name: account.name,
      type: account.type,
      category: account.category,
      description: account.description || ''
    })
    setIsEditModalOpen(true)
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading general ledger...</p>
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
              <h1 className="text-3xl font-bold">General Ledger</h1>
              <p className="text-muted-foreground">
                Chart of accounts and financial transaction management
              </p>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                    <DialogDescription>
                      Create a new account in your chart of accounts
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="code" className="text-right">
                        Code
                      </Label>
                      <Input
                        id="code"
                        value={accountForm.code}
                        onChange={(e) => setAccountForm({...accountForm, code: e.target.value})}
                        className="col-span-3"
                        placeholder="e.g., 1001"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                        className="col-span-3"
                        placeholder="Account name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select
                        value={accountForm.type}
                        onValueChange={(value) => setAccountForm({...accountForm, type: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asset">Asset</SelectItem>
                          <SelectItem value="Liability">Liability</SelectItem>
                          <SelectItem value="Equity">Equity</SelectItem>
                          <SelectItem value="Revenue">Revenue</SelectItem>
                          <SelectItem value="Expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Input
                        id="category"
                        value={accountForm.category}
                        onChange={(e) => setAccountForm({...accountForm, category: e.target.value})}
                        className="col-span-3"
                        placeholder="e.g., Current Assets"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={accountForm.description}
                        onChange={(e) => setAccountForm({...accountForm, description: e.target.value})}
                        className="col-span-3"
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAccount} disabled={processing}>
                      <Save className="mr-2 h-4 w-4" />
                      {processing ? 'Adding...' : 'Add Account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export GL
              </Button>
            </div>
          </div>

          {/* Account Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accountSummary.map((item: any, index: number) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {item.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={item.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {item.change}
                    </span>
                    <span>from last quarter</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="chart" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chart">Chart of Accounts</TabsTrigger>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
              <TabsTrigger value="trial">Trial Balance</TabsTrigger>
              <TabsTrigger value="adjustments">Journal Entries</TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Chart of Accounts</CardTitle>
                      <CardDescription>
                        Manage your account structure and balances
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter by Type
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {accounts.map((account: any) => (
                      <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 text-sm font-mono text-muted-foreground">
                            {account.code}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{account.name}</p>
                              <Badge className={getAccountTypeColor(account.type)}>
                                {account.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{account.category}</p>
                            <p className="text-xs text-muted-foreground">
                              Last activity: {account.lastActivity || 'No activity'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            account.balanceType === 'debit' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {account.balance || 'KES 0'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {account.balanceType?.toUpperCase() || 'DEBIT'} BALANCE
                          </p>
                          <div className="flex space-x-1 mt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(account)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteAccount(account.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Account Modal */}
                  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Account</DialogTitle>
                        <DialogDescription>
                          Update account information
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-code" className="text-right">
                            Code
                          </Label>
                          <Input
                            id="edit-code"
                            value={accountForm.code}
                            onChange={(e) => setAccountForm({...accountForm, code: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="edit-name"
                            value={accountForm.name}
                            onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-type" className="text-right">
                            Type
                          </Label>
                          <Select
                            value={accountForm.type}
                            onValueChange={(value) => setAccountForm({...accountForm, type: value})}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asset">Asset</SelectItem>
                              <SelectItem value="Liability">Liability</SelectItem>
                              <SelectItem value="Equity">Equity</SelectItem>
                              <SelectItem value="Revenue">Revenue</SelectItem>
                              <SelectItem value="Expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-category" className="text-right">
                            Category
                          </Label>
                          <Input
                            id="edit-category"
                            value={accountForm.category}
                            onChange={(e) => setAccountForm({...accountForm, category: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="edit-description"
                            value={accountForm.description}
                            onChange={(e) => setAccountForm({...accountForm, description: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditAccount} disabled={processing}>
                          <Save className="mr-2 h-4 w-4" />
                          {processing ? 'Updating...' : 'Update Account'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Journal Entries</CardTitle>
                  <CardDescription>
                    Latest accounting transactions and postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Date</th>
                          <th className="text-left p-3 font-medium">Reference</th>
                          <th className="text-left p-3 font-medium">Description</th>
                          <th className="text-left p-3 font-medium">Account</th>
                          <th className="text-right p-3 font-medium">Debit</th>
                          <th className="text-right p-3 font-medium">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center p-8 text-muted-foreground">
                              No transactions found.
                            </td>
                          </tr>
                        ) : (
                          transactions.map((txn: any) => (
                            <tr key={txn.id} className="border-b hover:bg-muted/50">
                              <td className="p-3 text-sm">{new Date(txn.date).toLocaleDateString()}</td>
                              <td className="p-3 text-sm font-mono">{txn.reference}</td>
                              <td className="p-3 text-sm">{txn.description}</td>
                              <td className="p-3 text-sm">{txn.account?.name || 'Unknown Account'}</td>
                              <td className="p-3 text-sm text-right font-medium text-green-600">
                                {txn.debit ? `KES ${Number(txn.debit).toLocaleString()}` : ''}
                              </td>
                              <td className="p-3 text-sm text-right font-medium text-blue-600">
                                {txn.credit ? `KES ${Number(txn.credit).toLocaleString()}` : ''}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trial">
              <Card>
                <CardHeader>
                  <CardTitle>Trial Balance</CardTitle>
                  <CardDescription>
                    Verify that debits equal credits across all accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Account Name</th>
                          <th className="text-right p-3 font-medium">Debit</th>
                          <th className="text-right p-3 font-medium">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trialBalance.map((account: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-3 text-sm">{account.account}</td>
                            <td className="p-3 text-sm text-right font-medium text-green-600">
                              {account.debit && `KES ${formatCurrency(account.debit)}`}
                            </td>
                            <td className="p-3 text-sm text-right font-medium text-blue-600">
                              {account.credit && `KES ${formatCurrency(account.credit)}`}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-primary font-bold">
                          <td className="p-3">TOTAL</td>
                          <td className="p-3 text-right text-green-600">
                            KES {trialBalance.reduce((sum: number, acc: any) => sum + (acc.debit ? parseInt(acc.debit.replace(/,/g, '')) : 0), 0).toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-blue-600">
                            KES {trialBalance.reduce((sum: number, acc: any) => sum + (acc.credit ? parseInt(acc.credit.replace(/,/g, '')) : 0), 0).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="adjustments">
              <Card>
                <CardHeader>
                  <CardTitle>Journal Entry Creation</CardTitle>
                  <CardDescription>
                    Create manual journal entries and adjustments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 border-2 border-dashed border-muted rounded-lg text-center">
                      <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Create New Journal Entry</h3>
                      <p className="text-muted-foreground mb-4">
                        Record manual transactions, adjustments, and corrections
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Journal Entry
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Pending Entries</h4>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">Awaiting approval</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">This Month</h4>
                        <p className="text-2xl font-bold">47</p>
                        <p className="text-sm text-muted-foreground">Journal entries posted</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Auto-Posted</h4>
                        <p className="text-2xl font-bold">156</p>
                        <p className="text-sm text-muted-foreground">System-generated entries</p>
                      </div>
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