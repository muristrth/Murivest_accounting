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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: string
  priority: string
  location?: string
  attendees?: string[]
  amount?: number
  status: string
}

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchEvents()
    }
  }, [session, currentDate])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      // Mock events data - in a real app, this would come from an API
      const mockEvents: CalendarEvent[] = [
        {
          id: "1",
          title: "Property Inspection - Westlands Office",
          description: "Quarterly inspection of Westlands office complex",
          date: "2025-01-08",
          time: "10:00 AM",
          type: "inspection",
          priority: "high",
          location: "Westlands Road, Nairobi",
          status: "scheduled"
        },
        {
          id: "2",
          title: "Client Meeting - Tech Innovations",
          description: "Discuss lease renewal and expansion options",
          date: "2025-01-10",
          time: "2:00 PM",
          type: "meeting",
          priority: "medium",
          location: "CBD Shopping Mall, Unit 15",
          attendees: ["John Manager", "Sarah Sales"],
          status: "scheduled"
        },
        {
          id: "3",
          title: "Rent Payment Due - Westlands Mall",
          description: "Monthly rent payment deadline",
          date: "2025-01-15",
          time: "5:00 PM",
          type: "payment",
          priority: "high",
          amount: 15000000,
          status: "pending"
        },
        {
          id: "4",
          title: "Tax Filing Deadline",
          description: "Quarterly tax return submission",
          date: "2025-01-20",
          time: "11:59 PM",
          type: "deadline",
          priority: "high",
          status: "upcoming"
        },
        {
          id: "5",
          title: "Property Valuation - Industrial Warehouse",
          description: "Annual property valuation assessment",
          date: "2025-01-25",
          time: "9:00 AM",
          type: "valuation",
          priority: "medium",
          location: "Industrial Area, Nairobi",
          status: "scheduled"
        }
      ]
      setEvents(mockEvents)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 text-blue-800"
      case "inspection": return "bg-green-100 text-green-800"
      case "payment": return "bg-red-100 text-red-800"
      case "deadline": return "bg-orange-100 text-orange-800"
      case "valuation": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Calendar</h1>
              <p className="text-muted-foreground">
                Schedule and manage your appointments and deadlines
              </p>
            </div>
            <div className="flex space-x-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Today
              </Button>
            </div>
          </div>

          {/* Calendar Navigation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={index} className="p-2 border rounded-md bg-muted/20"></div>
                  }

                  const dayEvents = getEventsForDate(date)
                  const isToday = date.toDateString() === today.toDateString()
                  const isSelected = date.toDateString() === selectedDate.toDateString()

                  return (
                    <div
                      key={index}
                      className={`p-2 border rounded-md min-h-[100px] cursor-pointer hover:bg-muted/50 ${
                        isToday ? 'bg-blue-50 border-blue-200' : ''
                      } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-blue-600' : ''
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                            title={event.title}
                          >
                            {event.time} {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Events */}
          <Card>
            <CardHeader>
              <CardTitle>
                Events for {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardTitle>
              <CardDescription>
                {getEventsForDate(selectedDate).length} event(s) scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No events scheduled</h3>
                    <p className="text-muted-foreground mb-4">
                      This day is free. Add an event to get started.
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                ) : (
                  getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={
                            event.priority === "high" ? "border-red-200 text-red-800" :
                            event.priority === "medium" ? "border-yellow-200 text-yellow-800" :
                            "border-green-200 text-green-800"
                          }>
                            {event.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </span>
                          {event.location && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </span>
                          )}
                          {event.amount && (
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatCurrency(event.amount)}
                            </span>
                          )}
                        </div>
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            Attendees: {event.attendees.join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Your next 5 upcoming events and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .filter(event => new Date(event.date) >= today)
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          event.priority === "high" ? "bg-red-100" :
                          event.priority === "medium" ? "bg-yellow-100" : "bg-green-100"
                        }`}>
                          {event.type === "payment" ? (
                            <DollarSign className="h-4 w-4 text-red-600" />
                          ) : event.type === "meeting" ? (
                            <Users className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Calendar className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                        </div>
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}