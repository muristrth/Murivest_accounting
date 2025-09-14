
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
  Users,
  Plus,
  UserCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  Star,
  AlertCircle,
  CheckCircle,
  Trash2
} from "lucide-react"

// Types for client data
interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  city: string | null
  country: string | null
  dateOfBirth: string | null
  isActive: boolean
  createdAt: string
}

const prospectsPipeline = [
  {
    name: "Sarah Wilson",
    company: "Wilson Enterprises",
    interest: "CBD Shopping Mall - Unit 8",
    budget: "KES 800,000/month",
    stage: "viewing_scheduled",
    probability: 75,
    lastContact: "2025-01-05"
  },
  {
    name: "Michael Chen",
    company: "Chen Industries",
    interest: "Industrial Warehouse Space",
    budget: "KES 5,000,000/month",
    stage: "proposal_sent",
    probability: 60,
    lastContact: "2025-01-04"
  },
  {
    name: "Alice Johnson",
    company: "Johnson & Associates",
    interest: "Office Space - Westlands",
    budget: "KES 1,200,000/month",
    stage: "initial_contact",
    probability: 30,
    lastContact: "2025-01-03"
  }
]

const recentCommunications = [
  {
    client: "Westlands Mall Ltd",
    type: "email",
    subject: "Monthly rent payment confirmation",
    date: "2025-01-06",
    status: "sent"
  },
  {
    client: "Tech Innovations Kenya",
    type: "phone",
    subject: "Overdue payment follow-up",
    date: "2025-01-05",
    status: "completed"
  },
  {
    client: "Logistics Solutions Ltd",
    type: "meeting",
    subject: "Lease renewal discussion",
    date: "2025-01-04",
    status: "scheduled"
  }
]

export default function Clients() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Form states
  const [clientForm, setClientForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: ''
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user) {
      fetchClients()
    }
  }, [status, session, router])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async () => {
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientForm),
      })

      if (response.ok) {
        setIsAddModalOpen(false)
        setClientForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          address: '',
          city: '',
          country: '',
          dateOfBirth: ''
        })
        fetchClients()
        alert('Client added successfully!')
      } else {
        alert('Failed to add client')
      }
    } catch (error) {
      console.error('Failed to add client:', error)
      alert('Failed to add client')
    }
  }

  const handleEditClient = async () => {
    if (!selectedClient) return

    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientForm),
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        setSelectedClient(null)
        setClientForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          address: '',
          city: '',
          country: '',
          dateOfBirth: ''
        })
        fetchClients()
        alert('Client updated successfully!')
      } else {
        alert('Failed to update client')
      }
    } catch (error) {
      console.error('Failed to update client:', error)
      alert('Failed to update client')
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchClients()
        alert('Client deleted successfully!')
      } else {
        alert('Failed to delete client')
      }
    } catch (error) {
      console.error('Failed to delete client:', error)
      alert('Failed to delete client')
    }
  }

  const openEditModal = (client: Client) => {
    setSelectedClient(client)
    setClientForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      address: client.address || '',
      city: client.city || '',
      country: client.country || '',
      dateOfBirth: client.dateOfBirth ? client.dateOfBirth.split('T')[0] : ''
    })
    setIsEditModalOpen(true)
  }

  const handleExportClients = async () => {
    try {
      const response = await fetch("/api/clients/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `clients_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        alert('Client list exported successfully!')
      } else {
        alert('Failed to export clients')
      }
    } catch (error) {
      console.error('Failed to export clients:', error)
      alert('Failed to export clients')
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }
  
  // Returns badge color classes based on prospect pipeline stage
  const getStageColor = (stage: string) => {
    switch (stage) {
      case "viewing_scheduled":
        return "bg-blue-100 text-blue-800"
      case "proposal_sent":
        return "bg-yellow-100 text-yellow-800"
      case "initial_contact":
        return "bg-gray-100 text-gray-800"
      case "closed_won":
        return "bg-green-100 text-green-800"
      case "closed_lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading clients...</p>
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
              <h1 className="text-3xl font-bold">Clients & Tenants</h1>
              <p className="text-muted-foreground">
                Manage your client relationships and tenant portfolio
              </p>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Add a new client to your CRM database
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          value={clientForm.firstName}
                          onChange={(e) => setClientForm({...clientForm, firstName: e.target.value})}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          value={clientForm.lastName}
                          onChange={(e) => setClientForm({...clientForm, lastName: e.target.value})}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={clientForm.email}
                          onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                          placeholder="client@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={clientForm.phone}
                          onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                          placeholder="+254 XXX XXX XXX"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={clientForm.company}
                        onChange={(e) => setClientForm({...clientForm, company: e.target.value})}
                        placeholder="Company name (optional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={clientForm.city}
                          onChange={(e) => setClientForm({...clientForm, city: e.target.value})}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={clientForm.country}
                          onChange={(e) => setClientForm({...clientForm, country: e.target.value})}
                          placeholder="Country"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={clientForm.address}
                        onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                        placeholder="Full address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date-of-birth">Date of Birth</Label>
                      <Input
                        id="date-of-birth"
                        type="date"
                        value={clientForm.dateOfBirth}
                        onChange={(e) => setClientForm({...clientForm, dateOfBirth: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddClient}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Client
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleExportClients}>
                <FileText className="mr-2 h-4 w-4" />
                Export List
              </Button>
            </div>
          </div>

          {/* Client Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
                <p className="text-xs text-muted-foreground">Active clients in system</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {clients.filter(client => client.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Corporate Clients</CardTitle>
                <Building2 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {clients.filter(client => client.company).length}
                </div>
                <p className="text-xs text-muted-foreground">Business clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Individual Clients</CardTitle>
                <UserCheck className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {clients.filter(client => !client.company).length}
                </div>
                <p className="text-xs text-muted-foreground">Individual clients</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="clients" className="space-y-4">
            <TabsList>
              <TabsTrigger value="clients">All Clients</TabsTrigger>
              <TabsTrigger value="prospects">Prospects Pipeline</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="retention">Customer Retention</TabsTrigger>
              <TabsTrigger value="analytics">Client Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>Client Directory</CardTitle>
                  <CardDescription>
                    Manage all your clients and tenants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No clients found</h3>
                        <p className="text-muted-foreground mb-4">
                          Add your first client to get started.
                        </p>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Client
                        </Button>
                      </div>
                    ) : (
                      clients.map((client) => (
                        <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                              {client.company ? (
                                <Building2 className="h-6 w-6" />
                              ) : (
                                <UserCheck className="h-6 w-6" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-bold">{client.firstName} {client.lastName}</p>
                                <Badge className={getStatusColor(client.isActive)}>
                                  {client.isActive ? "ACTIVE" : "INACTIVE"}
                                </Badge>
                                {client.company && (
                                  <Badge variant="outline">{client.company}</Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {client.email}
                                </span>
                                {client.phone && (
                                  <span className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {client.phone}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {client.city && client.country && (
                                  <span className="text-xs text-muted-foreground">
                                    {client.city}, {client.country}
                                  </span>
                                )}
                                {client.dateOfBirth && (
                                  <span className="text-xs text-muted-foreground">
                                    DOB: {new Date(client.dateOfBirth).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Added: {new Date(client.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex space-x-1 mt-2">
                              <Button size="sm" variant="outline" onClick={() => openEditModal(client)}>
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteClient(client.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prospects">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Pipeline</CardTitle>
                  <CardDescription>
                    Track potential clients and deals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prospectsPipeline.map((prospect, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <UserCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{prospect.name}</p>
                              <Badge className={getStageColor(prospect.stage)}>
                                {prospect.stage.replace("_", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{prospect.company}</p>
                            <p className="text-xs text-muted-foreground">
                              Interested in: {prospect.interest}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last contact: {prospect.lastContact}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{prospect.budget}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-green-500 rounded-full"
                                style={{ width: `${prospect.probability}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{prospect.probability}%</span>
                          </div>
                          <div className="flex space-x-1 mt-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communications">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Communications</CardTitle>
                  <CardDescription>
                    Track all client interactions and follow-ups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCommunications.map((comm, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            {comm.type === "email" ? (
                              <Mail className="h-5 w-5" />
                            ) : comm.type === "phone" ? (
                              <Phone className="h-5 w-5" />
                            ) : (
                              <Calendar className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{comm.client}</p>
                            <p className="text-sm text-muted-foreground">{comm.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              {comm.type.toUpperCase()} • {comm.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              comm.status === "completed" ? "bg-green-100 text-green-800" :
                              comm.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {comm.status.toUpperCase()}
                          </Badge>
                          <div className="mt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="retention">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Birthdays</CardTitle>
                    <CardDescription>
                      Clients with birthdays this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clients
                        .filter(client => client.dateOfBirth)
                        .slice(0, 3)
                        .map((client, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100">
                                <Calendar className="h-4 w-4 text-pink-600" />
                              </div>
                              <div>
                                <p className="font-medium">{client.firstName} {client.lastName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Birthday: {client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : ""}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              Send Birthday Email
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Gifts</CardTitle>
                    <CardDescription>
                      Track gifts sent to clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                            <Star className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Welcome Gift</p>
                            <p className="text-sm text-muted-foreground">Sent to new clients</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Birthday Gift</p>
                            <p className="text-sm text-muted-foreground">Monthly birthday gifts</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Loyalty Gift</p>
                            <p className="text-sm text-muted-foreground">For long-term clients</p>
                          </div>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Gift History</CardTitle>
                    <CardDescription>
                      Recent gifts sent to clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">Welcome Gift - Tech Innovations Kenya</p>
                              <Badge className="bg-green-100 text-green-800">Sent</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Office supplies package • Sent on Jan 2, 2025
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">KES 5,000</p>
                          <Button size="sm" variant="outline" className="mt-2">
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100">
                            <Calendar className="h-5 w-5 text-pink-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">Birthday Gift - John Doe</p>
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Coffee gift card • Scheduled for Jan 15, 2025
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">KES 2,000</p>
                          <Button size="sm" className="mt-2">
                            Send Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Distribution</CardTitle>
                    <CardDescription>Breakdown by client type and category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Corporate Clients</span>
                        <span className="font-bold">78% (122 clients)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Individual Clients</span>
                        <span className="font-bold">22% (34 clients)</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <span>Premium Category</span>
                          <span className="font-bold">15% (23 clients)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Standard Category</span>
                          <span className="font-bold">65% (101 clients)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Prospects</span>
                          <span className="font-bold">20% (32 prospects)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Acquisition</CardTitle>
                    <CardDescription>New clients over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>August 2024</span>
                        <span className="font-bold">8 new clients</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>September 2024</span>
                        <span className="font-bold">12 new clients</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>October 2024</span>
                        <span className="font-bold">15 new clients</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>November 2024</span>
                        <span className="font-bold">9 new clients</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>December 2024</span>
                        <span className="font-bold">11 new clients</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>January 2025</span>
                        <span className="font-bold text-green-600">7 new clients</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit Client Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Client</DialogTitle>
                <DialogDescription>
                  Update client information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-first-name">First Name</Label>
                    <Input
                      id="edit-first-name"
                      value={clientForm.firstName}
                      onChange={(e) => setClientForm({...clientForm, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-last-name">Last Name</Label>
                    <Input
                      id="edit-last-name"
                      value={clientForm.lastName}
                      onChange={(e) => setClientForm({...clientForm, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={clientForm.company}
                    onChange={(e) => setClientForm({...clientForm, company: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      value={clientForm.city}
                      onChange={(e) => setClientForm({...clientForm, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-country">Country</Label>
                    <Input
                      id="edit-country"
                      value={clientForm.country}
                      onChange={(e) => setClientForm({...clientForm, country: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    value={clientForm.address}
                    onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-date-of-birth">Date of Birth</Label>
                  <Input
                    id="edit-date-of-birth"
                    type="date"
                    value={clientForm.dateOfBirth}
                    onChange={(e) => setClientForm({...clientForm, dateOfBirth: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditClient}>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
