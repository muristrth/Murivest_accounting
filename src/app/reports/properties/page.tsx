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
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter
} from "lucide-react"

export default function PropertyReports() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState([])
  const [propertyStats, setPropertyStats] = useState({
    totalProperties: 0,
    totalValue: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user) {
      fetchPropertyData()
    }
  }, [status, session, router])

  const fetchPropertyData = async () => {
    try {
      setLoading(true)

      // Fetch properties
      const propertiesResponse = await fetch("/api/properties")
      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json()
        setProperties(propertiesData)

        // Calculate statistics
        const totalProperties = propertiesData.length
        const totalValue = propertiesData.reduce((sum: number, prop: any) => sum + (prop.currentValue || 0), 0)
        const monthlyRevenue = propertiesData.reduce((sum: number, prop: any) => sum + (prop.monthlyRent || 0), 0)
        const leasedProperties = propertiesData.filter((prop: any) => prop.status === 'LEASED').length
        const occupancyRate = totalProperties > 0 ? (leasedProperties / totalProperties) * 100 : 0

        setPropertyStats({
          totalProperties,
          totalValue,
          monthlyRevenue,
          occupancyRate
        })
      }
    } catch (error) {
      console.error("Failed to fetch property data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading property reports...</p>
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
              <h1 className="text-3xl font-bold">Property Reports</h1>
              <p className="text-muted-foreground">
                Comprehensive analysis of your property portfolio performance
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" onClick={() => window.open("/api/properties/export", "_blank")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>


          {/* Reports Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>All Properties</CardTitle>
                  <CardDescription>Complete list of all properties in your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Property Name</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">Location</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Monthly Rent</th>
                          <th className="text-left p-3 font-medium">Current Value</th>
                          <th className="text-left p-3 font-medium">Tenant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center p-8 text-muted-foreground">
                              No properties found. Add your first property to get started.
                            </td>
                          </tr>
                        ) : (
                          properties.map((property: any) => (
                            <tr key={property.id} className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">{property.name}</td>
                              <td className="p-3">{property.propertyType}</td>
                              <td className="p-3">{property.city}, {property.country}</td>
                              <td className="p-3">
                                <Badge className={
                                  property.status === 'LEASED' ? "bg-green-100 text-green-800" :
                                  property.status === 'AVAILABLE' ? "bg-blue-100 text-blue-800" :
                                  property.status === 'UNDER_MAINTENANCE' ? "bg-yellow-100 text-yellow-800" :
                                  "bg-gray-100 text-gray-800"
                                }>
                                  {property.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {property.monthlyRent ? `KES ${property.monthlyRent.toLocaleString()}` : '-'}
                              </td>
                              <td className="p-3">
                                {property.currentValue ? `KES ${property.currentValue.toLocaleString()}` : '-'}
                              </td>
                              <td className="p-3">
                                {property.client ? `${property.client.firstName} ${property.client.lastName}` : '-'}
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

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance Data</CardTitle>
                  <CardDescription>Detailed performance metrics for each property</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Property Name</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">Monthly Rent</th>
                          <th className="text-left p-3 font-medium">Purchase Price</th>
                          <th className="text-left p-3 font-medium">Current Value</th>
                          <th className="text-left p-3 font-medium">ROI</th>
                          <th className="text-left p-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center p-8 text-muted-foreground">
                              No property data available.
                            </td>
                          </tr>
                        ) : (
                          properties.map((property: any) => {
                            const roi = property.purchasePrice && property.monthlyRent
                              ? ((property.monthlyRent * 12) / property.purchasePrice) * 100
                              : 0

                            return (
                              <tr key={property.id} className="border-b hover:bg-muted/50">
                                <td className="p-3 font-medium">{property.name}</td>
                                <td className="p-3">{property.propertyType}</td>
                                <td className="p-3">
                                  {property.monthlyRent ? `KES ${property.monthlyRent.toLocaleString()}` : '-'}
                                </td>
                                <td className="p-3">
                                  {property.purchasePrice ? `KES ${property.purchasePrice.toLocaleString()}` : '-'}
                                </td>
                                <td className="p-3">
                                  {property.currentValue ? `KES ${property.currentValue.toLocaleString()}` : '-'}
                                </td>
                                <td className="p-3">
                                  {roi > 0 ? `${roi.toFixed(1)}%` : '-'}
                                </td>
                                <td className="p-3">
                                  <Badge className={
                                    property.status === 'LEASED' ? "bg-green-100 text-green-800" :
                                    property.status === 'AVAILABLE' ? "bg-blue-100 text-blue-800" :
                                    property.status === 'UNDER_MAINTENANCE' ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                  }>
                                    {property.status}
                                  </Badge>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="occupancy">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Data</CardTitle>
                  <CardDescription>Current occupancy status for all properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Property Name</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Tenant</th>
                          <th className="text-left p-3 font-medium">Monthly Rent</th>
                          <th className="text-left p-3 font-medium">Lease Start</th>
                          <th className="text-left p-3 font-medium">Lease End</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center p-8 text-muted-foreground">
                              No occupancy data available.
                            </td>
                          </tr>
                        ) : (
                          properties.map((property: any) => (
                            <tr key={property.id} className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">{property.name}</td>
                              <td className="p-3">{property.propertyType}</td>
                              <td className="p-3">
                                <Badge className={
                                  property.status === 'LEASED' ? "bg-green-100 text-green-800" :
                                  property.status === 'AVAILABLE' ? "bg-blue-100 text-blue-800" :
                                  property.status === 'UNDER_MAINTENANCE' ? "bg-yellow-100 text-yellow-800" :
                                  "bg-gray-100 text-gray-800"
                                }>
                                  {property.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {property.client ? `${property.client.firstName} ${property.client.lastName}` : '-'}
                              </td>
                              <td className="p-3">
                                {property.monthlyRent ? `KES ${property.monthlyRent.toLocaleString()}` : '-'}
                              </td>
                              <td className="p-3">-</td>
                              <td className="p-3">-</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Data</CardTitle>
                  <CardDescription>Financial information for all properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Property Name</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">Monthly Revenue</th>
                          <th className="text-left p-3 font-medium">Purchase Price</th>
                          <th className="text-left p-3 font-medium">Current Value</th>
                          <th className="text-left p-3 font-medium">Net Income</th>
                          <th className="text-left p-3 font-medium">ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center p-8 text-muted-foreground">
                              No financial data available.
                            </td>
                          </tr>
                        ) : (
                          properties.map((property: any) => {
                            const monthlyRevenue = property.monthlyRent || 0
                            const purchasePrice = property.purchasePrice || 0
                            const currentValue = property.currentValue || 0
                            const netIncome = monthlyRevenue // Simplified - in real app would subtract expenses
                            const roi = purchasePrice > 0 ? ((monthlyRevenue * 12) / purchasePrice) * 100 : 0

                            return (
                              <tr key={property.id} className="border-b hover:bg-muted/50">
                                <td className="p-3 font-medium">{property.name}</td>
                                <td className="p-3">{property.propertyType}</td>
                                <td className="p-3">
                                  {monthlyRevenue > 0 ? `KES ${monthlyRevenue.toLocaleString()}` : '-'}
                                </td>
                                <td className="p-3">
                                  {purchasePrice > 0 ? `KES ${purchasePrice.toLocaleString()}` : '-'}
                                </td>
                                <td className="p-3">
                                  {currentValue > 0 ? `KES ${currentValue.toLocaleString()}` : '-'}
                                </td>
                                <td className="p-3">
                                  {netIncome > 0 ? `KES ${netIncome.toLocaleString()}` : '-'}
                                </td>
                                <td className="p-3">
                                  {roi > 0 ? `${roi.toFixed(1)}%` : '-'}
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
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