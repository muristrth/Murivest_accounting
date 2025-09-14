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
  Bell,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Building2,
  Eye,
  Trash2,
  Settings
} from "lucide-react"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export default function Notifications() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      // Mock notifications data - in a real app, this would come from an API
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "payment",
          title: "Payment Reminder",
          message: "Invoice #INV-2025-001 for Westlands Mall Ltd is due in 3 days",
          priority: "high",
          read: false,
          createdAt: "2025-01-06T10:00:00Z",
          actionUrl: "/accounting/receivable"
        },
        {
          id: "2",
          type: "client",
          title: "New Client Added",
          message: "Tech Innovations Kenya has been added to your client list",
          priority: "medium",
          read: false,
          createdAt: "2025-01-05T14:30:00Z",
          actionUrl: "/clients"
        },
        {
          id: "3",
          type: "system",
          title: "Weekly Report Generated",
          message: "Your weekly financial summary is ready for review",
          priority: "low",
          read: true,
          createdAt: "2025-01-05T09:00:00Z",
          actionUrl: "/accounting/reports"
        },
        {
          id: "4",
          type: "alert",
          title: "Overdue Payment",
          message: "Payment from Logistics Solutions Ltd is 7 days overdue",
          priority: "high",
          read: false,
          createdAt: "2025-01-04T16:45:00Z",
          actionUrl: "/accounting/receivable"
        },
        {
          id: "5",
          type: "birthday",
          title: "Client Birthday",
          message: "John Doe's birthday is tomorrow. Consider sending a gift!",
          priority: "medium",
          read: false,
          createdAt: "2025-01-03T08:15:00Z",
          actionUrl: "/clients"
        }
      ]
      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment": return DollarSign
      case "client": return Users
      case "system": return Settings
      case "alert": return AlertTriangle
      case "birthday": return Bell
      default: return Bell
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading notifications...</p>
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
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with important alerts and reminders
              </p>
            </div>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  Mark All as Read ({unreadCount})
                </Button>
              )}
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Notification Settings
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.priority === "high" && !n.read).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Urgent items
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {notifications.filter(n => {
                    const notificationDate = new Date(n.createdAt)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return notificationDate >= weekAgo
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recent notifications
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Notifications Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Notifications</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="high-priority">High Priority</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Notifications</CardTitle>
                  <CardDescription>
                    Complete list of all your notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No notifications</h3>
                        <p className="text-muted-foreground">
                          You're all caught up! Check back later for new notifications.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const IconComponent = getNotificationIcon(notification.type)
                        return (
                          <div
                            key={notification.id}
                            className={`flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 ${
                              !notification.read ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                          >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                              notification.read ? 'bg-gray-100' : 'bg-blue-100'
                            }`}>
                              <IconComponent className={`h-5 w-5 ${
                                notification.read ? 'text-gray-600' : 'text-blue-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={`font-medium ${!notification.read ? 'text-blue-900' : ''}`}>
                                  {notification.title}
                                </h4>
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority.toUpperCase()}
                                </Badge>
                                {!notification.read && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm ${!notification.read ? 'text-blue-800' : 'text-muted-foreground'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {notification.actionUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(notification.actionUrl!)}
                                >
                                  View
                                </Button>
                              )}
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark Read
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unread">
              <Card>
                <CardHeader>
                  <CardTitle>Unread Notifications</CardTitle>
                  <CardDescription>
                    Notifications that require your attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.filter(n => !n.read).map((notification) => {
                      const IconComponent = getNotificationIcon(notification.type)
                      return (
                        <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-blue-900">{notification.title}</h4>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-blue-800">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {notification.actionUrl && (
                              <Button
                                size="sm"
                                onClick={() => router.push(notification.actionUrl!)}
                              >
                                Take Action
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark Read
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="high-priority">
              <Card>
                <CardHeader>
                  <CardTitle>High Priority Notifications</CardTitle>
                  <CardDescription>
                    Urgent items that need immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.filter(n => n.priority === "high").map((notification) => {
                      const IconComponent = getNotificationIcon(notification.type)
                      return (
                        <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg border-red-200 bg-red-50">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                            <IconComponent className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-red-900">{notification.title}</h4>
                              <Badge className="bg-red-100 text-red-800">
                                HIGH PRIORITY
                              </Badge>
                            </div>
                            <p className="text-sm text-red-800">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {notification.actionUrl && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => router.push(notification.actionUrl!)}
                              >
                                Take Action
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>
                    Notifications from the past 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.filter(n => {
                      const notificationDate = new Date(n.createdAt)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return notificationDate >= weekAgo
                    }).map((notification) => {
                      const IconComponent = getNotificationIcon(notification.type)
                      return (
                        <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                            <IconComponent className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {notification.actionUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(notification.actionUrl!)}
                              >
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
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