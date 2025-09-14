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
  Building2,
  Plus,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  FileText,
  Settings,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle,
  Trash2
} from "lucide-react"

// Types for property data
interface Property {
  id: string
  name: string
  address: string
  city: string
  country: string
  propertyType: string
  status: string
  purchasePrice: number | null
  currentValue: number | null
  monthlyRent: number | null
  description: string | null
  createdAt: string
  client?: {
    id: string
    firstName: string
    lastName: string
    company: string | null
  } | null
}

const upcomingMaintenance = [
  {
    property: "Westlands Office Complex",
    task: "HVAC System Inspection",
    date: "2025-01-15",
    cost: "KES 150,000",
    priority: "medium"
  },
  {
    property: "CBD Shopping Mall",
    task: "Elevator Maintenance",
    date: "2025-01-12",
    cost: "KES 85,000",
    priority: "high"
  },
  {
    property: "Industrial Warehouse",
    task: "Fire Safety Inspection",
    date: "2025-01-20",
    cost: "KES 45,000",
    priority: "high"
  }
]

const leaseExpirations = [
  {
    property: "Industrial Warehouse",
    tenant: "Logistics Solutions Ltd",
    expiry: "2025-08-15",
    monthsLeft: 7,
    value: "KES 6,200,000",
    status: "renewal_due"
  },
  {
    property: "CBD Shopping Mall - Unit 12",
    tenant: "Fashion Boutique Kenya",
    expiry: "2025-03-31",
    monthsLeft: 2,
    value: "KES 450,000",
    status: "urgent"
  }
]

export default function Properties() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // Form states
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    propertyType: '',
    status: 'AVAILABLE',
    purchasePrice: '',
    currentValue: '',
    monthlyRent: '',
    description: ''
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user) {
      fetchProperties()
    }
  }, [status, session, router])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/properties")
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProperty = async () => {
    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: propertyForm.name,
          address: propertyForm.address,
          city: propertyForm.city,
          country: propertyForm.country,
          propertyType: propertyForm.propertyType,
          status: propertyForm.status,
          purchasePrice: propertyForm.purchasePrice ? parseFloat(propertyForm.purchasePrice) : null,
          currentValue: propertyForm.currentValue ? parseFloat(propertyForm.currentValue) : null,
          monthlyRent: propertyForm.monthlyRent ? parseFloat(propertyForm.monthlyRent) : null,
          description: propertyForm.description
        }),
      })

      if (response.ok) {
        setIsAddModalOpen(false)
        setPropertyForm({
          name: '',
          address: '',
          city: '',
          country: '',
          propertyType: '',
          status: 'AVAILABLE',
          purchasePrice: '',
          currentValue: '',
          monthlyRent: '',
          description: ''
        })
        fetchProperties()
        alert('Property added successfully!')
      } else {
        alert('Failed to add property')
      }
    } catch (error) {
      console.error('Failed to add property:', error)
      alert('Failed to add property')
    }
  }

  const handleEditProperty = async () => {
    if (!selectedProperty) return

    try {
      const response = await fetch(`/api/properties/${selectedProperty.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: propertyForm.name,
          address: propertyForm.address,
          city: propertyForm.city,
          country: propertyForm.country,
          propertyType: propertyForm.propertyType,
          status: propertyForm.status,
          purchasePrice: propertyForm.purchasePrice ? parseFloat(propertyForm.purchasePrice) : null,
          currentValue: propertyForm.currentValue ? parseFloat(propertyForm.currentValue) : null,
          monthlyRent: propertyForm.monthlyRent ? parseFloat(propertyForm.monthlyRent) : null,
          description: propertyForm.description
        }),
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        setSelectedProperty(null)
        setPropertyForm({
          name: '',
          address: '',
          city: '',
          country: '',
          propertyType: '',
          status: 'AVAILABLE',
          purchasePrice: '',
          currentValue: '',
          monthlyRent: '',
          description: ''
        })
        fetchProperties()
        alert('Property updated successfully!')
      } else {
        alert('Failed to update property')
      }
    } catch (error) {
      console.error('Failed to update property:', error)
      alert('Failed to update property')
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchProperties()
        alert('Property deleted successfully!')
      } else {
        alert('Failed to delete property')
      }
    } catch (error) {
      console.error('Failed to delete property:', error)
      alert('Failed to delete property')
    }
  }

  const openEditModal = (property: Property) => {
    setSelectedProperty(property)
    setPropertyForm({
      name: property.name,
      address: property.address,
      city: property.city,
      country: property.country,
      propertyType: property.propertyType,
      status: property.status,
      purchasePrice: property.purchasePrice?.toString() || '',
      currentValue: property.currentValue?.toString() || '',
      monthlyRent: property.monthlyRent?.toString() || '',
      description: property.description || ''
    })
    setIsEditModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LEASED": return "bg-green-100 text-green-800"
      case "AVAILABLE": return "bg-blue-100 text-blue-800"
      case "UNDER_MAINTENANCE": return "bg-yellow-100 text-yellow-800"
      case "SOLD": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "LEASED": return "Leased"
      case "AVAILABLE": return "Available"
      case "UNDER_MAINTENANCE": return "Under Maintenance"
      case "SOLD": return "Sold"
      default: return "Unknown"
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A"
    return `KES ${amount.toLocaleString()}`
  }

  const calculateROI = (monthlyRent: number | null, purchasePrice: number | null) => {
    if (!monthlyRent || !purchasePrice || purchasePrice === 0) return 0
    return ((monthlyRent * 12) / purchasePrice) * 100
  }

  const handleExportProperties = async () => {
    try {
      const response = await fetch("/api/properties/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `properties_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        alert('Properties list exported successfully!')
      } else {
        alert('Failed to export properties')
      }
    } catch (error) {
      console.error('Failed to export properties:', error)
      alert('Failed to export properties')
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading properties...</p>
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
              <h1 className="text-3xl font-bold">Property Portfolio</h1>
              <p className="text-muted-foreground">
                Manage your commercial real estate properties and tenants
              </p>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                    <DialogDescription>
                      Add a new property to your portfolio
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="property-name">Property Name</Label>
                      <Input
                        id="property-name"
                        value={propertyForm.name}
                        onChange={(e) => setPropertyForm({...propertyForm, name: e.target.value})}
                        placeholder="e.g., Westlands Office Complex"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property-type">Property Type</Label>
                      <Select
                        value={propertyForm.propertyType}
                        onValueChange={(value) => setPropertyForm({...propertyForm, propertyType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Commercial Office">Commercial Office</SelectItem>
                          <SelectItem value="Retail Space">Retail Space</SelectItem>
                          <SelectItem value="Warehouse">Warehouse</SelectItem>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="property-city">City</Label>
                        <Input
                          id="property-city"
                          value={propertyForm.city}
                          onChange={(e) => setPropertyForm({...propertyForm, city: e.target.value})}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-country">Country</Label>
                        <Input
                          id="property-country"
                          value={propertyForm.country}
                          onChange={(e) => setPropertyForm({...propertyForm, country: e.target.value})}
                          placeholder="Country"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property-address">Address</Label>
                      <Input
                        id="property-address"
                        value={propertyForm.address}
                        onChange={(e) => setPropertyForm({...propertyForm, address: e.target.value})}
                        placeholder="Full address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purchase-price">Purchase Price (KES)</Label>
                        <Input
                          id="purchase-price"
                          type="number"
                          value={propertyForm.purchasePrice}
                          onChange={(e) => setPropertyForm({...propertyForm, purchasePrice: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current-value">Current Value (KES)</Label>
                        <Input
                          id="current-value"
                          type="number"
                          value={propertyForm.currentValue}
                          onChange={(e) => setPropertyForm({...propertyForm, currentValue: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthly-rent">Monthly Rent (KES)</Label>
                        <Input
                          id="monthly-rent"
                          type="number"
                          value={propertyForm.monthlyRent}
                          onChange={(e) => setPropertyForm({...propertyForm, monthlyRent: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-status">Status</Label>
                        <Select
                          value={propertyForm.status}
                          onValueChange={(value) => setPropertyForm({...propertyForm, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="LEASED">Leased</SelectItem>
                            <SelectItem value="UNDER_MAINTENANCE">Under Maintenance</SelectItem>
                            <SelectItem value="SOLD">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property-description">Description</Label>
                      <Input
                        id="property-description"
                        value={propertyForm.description}
                        onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                        placeholder="Property description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddProperty}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Property
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleExportProperties}>
                <FileText className="mr-2 h-4 w-4" />
                Portfolio Report
              </Button>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{properties.length}</div>
                <p className="text-xs text-muted-foreground">Properties in portfolio</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    properties.reduce((sum, prop) => sum + (prop.currentValue || 0), 0)
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Current market value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    properties.reduce((sum, prop) => sum + (prop.monthlyRent || 0), 0)
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Total monthly rent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {properties.length > 0
                    ? (properties.reduce((sum, prop) =>
                        sum + calculateROI(prop.monthlyRent, prop.purchasePrice), 0
                      ) / properties.length).toFixed(1)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Annual return rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="properties" className="space-y-4">
            <TabsList>
              <TabsTrigger value="properties">All Properties</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="leases">Lease Management</TabsTrigger>
              <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No properties found</h3>
                    <p className="text-muted-foreground mb-6">
                      Add your first property to get started with your portfolio.
                    </p>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Property
                    </Button>
                  </div>
                ) : (
                  properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden">
                      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                        <div className="absolute top-4 right-4">
                          <Badge className={getStatusColor(property.status)}>
                            {getStatusText(property.status)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-bold">{property.name}</h3>
                          <p className="text-sm opacity-90">{property.propertyType}</p>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{property.city}, {property.country}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Monthly Rent</p>
                              <p className="font-bold text-green-600">{formatCurrency(property.monthlyRent)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Current Value</p>
                              <p className="font-bold">{formatCurrency(property.currentValue)}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">ROI</p>
                              <p className="font-bold">{calculateROI(property.monthlyRent, property.purchasePrice).toFixed(1)}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Purchase Price</p>
                              <p className="font-medium">{formatCurrency(property.purchasePrice)}</p>
                            </div>
                          </div>

                          {property.client && (
                            <div>
                              <p className="text-muted-foreground text-sm">Current Tenant</p>
                              <p className="font-medium">
                                {property.client.company || `${property.client.firstName} ${property.client.lastName}`}
                              </p>
                            </div>
                          )}

                          <div className="flex space-x-2 pt-4">
                            <Button size="sm" className="flex-1" onClick={() => openEditModal(property)}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProperty(property.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Maintenance</CardTitle>
                  <CardDescription>
                    Scheduled maintenance and inspections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingMaintenance.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            {item.priority === "high" ? (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <Settings className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.task}</p>
                            <p className="text-sm text-muted-foreground">{item.property}</p>
                            <p className="text-xs text-muted-foreground">Due: {item.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{item.cost}</p>
                          <Badge
                            variant={item.priority === "high" ? "destructive" : "secondary"}
                            className="mt-1"
                          >
                            {item.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leases">
              <Card>
                <CardHeader>
                  <CardTitle>Lease Expirations</CardTitle>
                  <CardDescription>
                    Track upcoming lease renewals and expirations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaseExpirations.map((lease, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{lease.property}</p>
                            <p className="text-sm text-muted-foreground">{lease.tenant}</p>
                            <p className="text-xs text-muted-foreground">Expires: {lease.expiry}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{lease.value}/month</p>
                          <p className="text-sm text-muted-foreground">{lease.monthsLeft} months left</p>
                          <Badge
                            variant={lease.status === "urgent" ? "destructive" : "secondary"}
                            className="mt-1"
                          >
                            {lease.status === "urgent" ? "URGENT" : "RENEWAL DUE"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Property Type</CardTitle>
                    <CardDescription>Monthly revenue breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Commercial Office</span>
                        <span className="font-bold">KES 15.0M (50.5%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Retail Space</span>
                        <span className="font-bold">KES 8.5M (28.6%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Warehouse</span>
                        <span className="font-bold">KES 6.2M (20.9%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Occupancy Trends</CardTitle>
                    <CardDescription>6-month occupancy rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Aug 2024</span>
                        <span className="font-bold">78.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sep 2024</span>
                        <span className="font-bold">82.1%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Oct 2024</span>
                        <span className="font-bold">85.7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Nov 2024</span>
                        <span className="font-bold">86.3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Dec 2024</span>
                        <span className="font-bold">84.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Jan 2025</span>
                        <span className="font-bold text-green-600">84.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit Property Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Property</DialogTitle>
                <DialogDescription>
                  Update property information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-property-name">Property Name</Label>
                  <Input
                    id="edit-property-name"
                    value={propertyForm.name}
                    onChange={(e) => setPropertyForm({...propertyForm, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-property-type">Property Type</Label>
                  <Select
                    value={propertyForm.propertyType}
                    onValueChange={(value) => setPropertyForm({...propertyForm, propertyType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Commercial Office">Commercial Office</SelectItem>
                      <SelectItem value="Retail Space">Retail Space</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-property-city">City</Label>
                    <Input
                      id="edit-property-city"
                      value={propertyForm.city}
                      onChange={(e) => setPropertyForm({...propertyForm, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-property-country">Country</Label>
                    <Input
                      id="edit-property-country"
                      value={propertyForm.country}
                      onChange={(e) => setPropertyForm({...propertyForm, country: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-property-address">Address</Label>
                  <Input
                    id="edit-property-address"
                    value={propertyForm.address}
                    onChange={(e) => setPropertyForm({...propertyForm, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-purchase-price">Purchase Price (KES)</Label>
                    <Input
                      id="edit-purchase-price"
                      type="number"
                      value={propertyForm.purchasePrice}
                      onChange={(e) => setPropertyForm({...propertyForm, purchasePrice: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-current-value">Current Value (KES)</Label>
                    <Input
                      id="edit-current-value"
                      type="number"
                      value={propertyForm.currentValue}
                      onChange={(e) => setPropertyForm({...propertyForm, currentValue: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-monthly-rent">Monthly Rent (KES)</Label>
                    <Input
                      id="edit-monthly-rent"
                      type="number"
                      value={propertyForm.monthlyRent}
                      onChange={(e) => setPropertyForm({...propertyForm, monthlyRent: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-property-status">Status</Label>
                    <Select
                      value={propertyForm.status}
                      onValueChange={(value) => setPropertyForm({...propertyForm, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="LEASED">Leased</SelectItem>
                        <SelectItem value="UNDER_MAINTENANCE">Under Maintenance</SelectItem>
                        <SelectItem value="SOLD">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-property-description">Description</Label>
                  <Input
                    id="edit-property-description"
                    value={propertyForm.description}
                    onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditProperty}>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Property
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
