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
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Filter,
  UserCheck,
  UserX
} from "lucide-react"

export default function ClientReports() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [clientStats, setClientStats] = useState({
    totalClients: 0,
    activeClients: 0,
    corporateClients: 0,
    individualClients: 0,
    revenuePerClient: 0,
    retentionRate: 0
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user) {
      fetchClientData()
    }
  }, [status, session, router])

  const fetchClientData = async () => {
    try {
      setLoading(true)

      // Fetch clients
      const clientsResponse = await fetch("/api/clients")
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json()
        setClients(clientsData)

        // Calculate statistics
        const totalClients = clientsData.length
        const activeClients = clientsData.filter((client: any) => client.isActive).length
        const corporateClients = clientsData.filter((client: any) => client.company).length
        const individualClients = totalClients - corporateClients

        // Calculate revenue per client (mock calculation based on available data)
        const revenuePerClient = totalClients > 0 ? 28800000 / totalClients : 0 // KES 28.8M total / clients
        const retentionRate = 94.2 // This would be calculated from historical data

        setClientStats({
          totalClients,
          activeClients,
          corporateClients,
          individualClients,
          revenuePerClient,
          retentionRate
        })
      }
    } catch (error) {
      console.error("Failed to fetch client data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading client reports...</p>
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
              <h1 className="text-3xl font-bold">Client Reports</h1>
              <p className="text-muted-foreground">
                Comprehensive analysis of your client relationships and performance
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" onClick={() => window.open("/api/clients/export", "_blank")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>


          {/* Reports Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
              <TabsTrigger value="retention">Retention</TabsTrigger>
              <TabsTrigger value="segments">Client Segments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>All Clients</CardTitle>
                  <CardDescription>Complete list of all clients in your database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Name</th>
                          <th className="text-left p-3 font-medium">Company</th>
                          <th className="text-left p-3 font-medium">Email</th>
                          <th className="text-left p-3 font-medium">Phone</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center p-8 text-muted-foreground">
                              No clients found. Add your first client to get started.
                            </td>
                          </tr>
                        ) : (
                          clients.map((client: any) => (
                            <tr key={client.id} className="border-b hover:bg-muted/50">
                              <td className="p-3">
                                <div className="font-medium">
                                  {client.firstName} {client.lastName}
                                </div>
                              </td>
                              <td className="p-3">{client.company || '-'}</td>
                              <td className="p-3">{client.email}</td>
                              <td className="p-3">{client.phone || '-'}</td>
                              <td className="p-3">
                                <Badge className={client.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {client.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {new Date(client.createdAt).toLocaleDateString()}
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

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Client Revenue Data</CardTitle>
                  <CardDescription>Revenue information for each client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Client Name</th>
                          <th className="text-left p-3 font-medium">Company</th>
                          <th className="text-left p-3 font-medium">Total Invoices</th>
                          <th className="text-left p-3 font-medium">Total Revenue</th>
                          <th className="text-left p-3 font-medium">Outstanding</th>
                          <th className="text-left p-3 font-medium">Last Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center p-8 text-muted-foreground">
                              No client data available.
                            </td>
                          </tr>
                        ) : (
                          clients.map((client: any) => (
                            <tr key={client.id} className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">
                                {client.firstName} {client.lastName}
                              </td>
                              <td className="p-3">{client.company || '-'}</td>
                              <td className="p-3">
                                <Badge variant="secondary">
                                  {client.invoices?.length || 0}
                                </Badge>
                              </td>
                              <td className="p-3">
                                KES {(client.invoices?.reduce((sum: number, inv: any) =>
                                  sum + Number(inv.totalAmount || 0), 0) || 0).toLocaleString()}
                              </td>
                              <td className="p-3">
                                KES {(client.invoices?.filter((inv: any) => inv.status === 'UNPAID')
                                  .reduce((sum: number, inv: any) => sum + Number(inv.totalAmount || 0), 0) || 0).toLocaleString()}
                              </td>
                              <td className="p-3">
                                {client.invoices?.length > 0
                                  ? new Date(Math.max(...client.invoices.map((inv: any) =>
                                      new Date(inv.createdAt).getTime()))).toLocaleDateString()
                                  : '-'
                                }
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

            <TabsContent value="retention">
              <Card>
                <CardHeader>
                  <CardTitle>Client Activity Data</CardTitle>
                  <CardDescription>Client activity and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Client Name</th>
                          <th className="text-left p-3 font-medium">Company</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Last Activity</th>
                          <th className="text-left p-3 font-medium">Total Invoices</th>
                          <th className="text-left p-3 font-medium">Total Payments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center p-8 text-muted-foreground">
                              No client activity data available.
                            </td>
                          </tr>
                        ) : (
                          clients.map((client: any) => (
                            <tr key={client.id} className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">
                                {client.firstName} {client.lastName}
                              </td>
                              <td className="p-3">{client.company || '-'}</td>
                              <td className="p-3">
                                <Badge className={client.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {client.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {client.invoices?.length > 0
                                  ? new Date(Math.max(...client.invoices.map((inv: any) =>
                                      new Date(inv.createdAt).getTime()))).toLocaleDateString()
                                  : new Date(client.createdAt).toLocaleDateString()
                                }
                              </td>
                              <td className="p-3">
                                <Badge variant="secondary">
                                  {client.invoices?.length || 0}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Badge variant="secondary">
                                  {client.payments?.length || 0}
                                </Badge>
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

            <TabsContent value="segments">
              <Card>
                <CardHeader>
                  <CardTitle>Client Segmentation Data</CardTitle>
                  <CardDescription>Client distribution by various characteristics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Client Name</th>
                          <th className="text-left p-3 font-medium">Company</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">Location</th>
                          <th className="text-left p-3 font-medium">Revenue Tier</th>
                          <th className="text-left p-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center p-8 text-muted-foreground">
                              No client segmentation data available.
                            </td>
                          </tr>
                        ) : (
                          clients.map((client: any) => {
                            const totalRevenue = client.invoices?.reduce((sum: number, inv: any) =>
                              sum + Number(inv.totalAmount || 0), 0) || 0

                            let revenueTier = "Starter"
                            if (totalRevenue >= 10000000) revenueTier = "High Value"
                            else if (totalRevenue >= 5000000) revenueTier = "Medium Value"
                            else if (totalRevenue >= 1000000) revenueTier = "Low Value"

                            return (
                              <tr key={client.id} className="border-b hover:bg-muted/50">
                                <td className="p-3 font-medium">
                                  {client.firstName} {client.lastName}
                                </td>
                                <td className="p-3">{client.company || '-'}</td>
                                <td className="p-3">
                                  <Badge variant="outline">
                                    {client.company ? "Corporate" : "Individual"}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  {client.city ? `${client.city}, ${client.country}` : '-'}
                                </td>
                                <td className="p-3">
                                  <Badge className={
                                    revenueTier === "High Value" ? "bg-purple-100 text-purple-800" :
                                    revenueTier === "Medium Value" ? "bg-blue-100 text-blue-800" :
                                    revenueTier === "Low Value" ? "bg-green-100 text-green-800" :
                                    "bg-gray-100 text-gray-800"
                                  }>
                                    {revenueTier}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <Badge className={client.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {client.isActive ? "Active" : "Inactive"}
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
          </Tabs>
        </div>
      </main>
    </div>
  )
}