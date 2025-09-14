"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Plus,
  Upload,
  Download,
  Eye,
  Edit,
  Share,
  FolderOpen,
  Calendar,
  User,
  Mail,
  PenTool,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings
} from "lucide-react"

const documentCategories = [
  {
    name: "Legal Agreements",
    count: 45,
    icon: FileText,
    color: "bg-blue-100 text-blue-800"
  },
  {
    name: "Financial Records",
    count: 78,
    icon: FileText,
    color: "bg-green-100 text-green-800"
  },
  {
    name: "Property Documents",
    count: 32,
    icon: FileText,
    color: "bg-purple-100 text-purple-800"
  },
  {
    name: "Client Communications",
    count: 124,
    icon: Mail,
    color: "bg-yellow-100 text-yellow-800"
  }
]

const recentDocuments = [
  {
    id: "DOC-001",
    name: "Sales Agreement - Westlands Office Complex",
    type: "Sales Agreement",
    client: "Westlands Mall Ltd",
    property: "Westlands Office Complex",
    status: "signed",
    dateCreated: "2025-01-05",
    lastModified: "2025-01-07",
    size: "2.4 MB",
    version: "v2.1"
  },
  {
    id: "DOC-002",
    name: "Expression of Interest - CBD Mall Unit 15",
    type: "Expression of Interest",
    client: "Tech Innovations Kenya",
    property: "CBD Shopping Mall",
    status: "pending_signature",
    dateCreated: "2025-01-03",
    lastModified: "2025-01-06",
    size: "1.8 MB",
    version: "v1.0"
  },
  {
    id: "DOC-003",
    name: "Authority to Sell - Industrial Warehouse",
    type: "Authority to Sell",
    client: "Property Investment Group",
    property: "Industrial Warehouse",
    status: "draft",
    dateCreated: "2025-01-02",
    lastModified: "2025-01-04",
    size: "1.2 MB",
    version: "v0.5"
  },
  {
    id: "DOC-004",
    name: "Broker Agreement - John Doe Real Estate",
    type: "Broker Agreement",
    client: "John Doe Real Estate",
    property: "Multiple Properties",
    status: "signed",
    dateCreated: "2024-12-28",
    lastModified: "2025-01-01",
    size: "980 KB",
    version: "v1.2"
  }
]

const documentTemplates = [
  {
    name: "Expression of Interest",
    description: "Template for buyer interest documentation",
    fields: ["Client Info", "Property Details", "Offer Amount", "Terms"],
    lastUpdated: "2025-01-01",
    usage: 12
  },
  {
    name: "Offer Letter",
    description: "Formal property purchase offer template",
    fields: ["Purchase Price", "Conditions", "Timeline", "Financing"],
    lastUpdated: "2024-12-15",
    usage: 8
  },
  {
    name: "Sales Agreement",
    description: "Comprehensive property sale contract",
    fields: ["Parties", "Property Description", "Price", "Closing Date"],
    lastUpdated: "2024-12-20",
    usage: 25
  },
  {
    name: "Broker Agreement",
    description: "Real estate broker commission agreement",
    fields: ["Commission Rate", "Terms", "Exclusivity", "Duration"],
    lastUpdated: "2024-11-30",
    usage: 6
  },
  {
    name: "Authority to Sell",
    description: "Property listing authorization document",
    fields: ["Property Details", "Listing Price", "Duration", "Terms"],
    lastUpdated: "2024-12-10",
    usage: 15
  }
]

const signatureRequests = [
  {
    id: "SIG-001",
    document: "Sales Agreement - Westlands Office Complex",
    client: "Westlands Mall Ltd",
    sentDate: "2025-01-05",
    status: "completed",
    signers: 2,
    completedSigners: 2
  },
  {
    id: "SIG-002",
    document: "Expression of Interest - CBD Mall Unit 15",
    client: "Tech Innovations Kenya",
    sentDate: "2025-01-06",
    status: "pending",
    signers: 1,
    completedSigners: 0
  },
  {
    id: "SIG-003",
    document: "Broker Agreement - Jane Smith Realty",
    client: "Jane Smith Realty",
    sentDate: "2025-01-04",
    status: "partially_signed",
    signers: 2,
    completedSigners: 1
  }
]

export default function Documents() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed": return "bg-green-100 text-green-800"
      case "pending_signature": return "bg-yellow-100 text-yellow-800"
      case "draft": return "bg-gray-100 text-gray-800"
      case "completed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "partially_signed": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "signed":
      case "completed": return <CheckCircle className="h-4 w-4" />
      case "pending_signature":
      case "pending": return <Clock className="h-4 w-4" />
      case "draft": return <Edit className="h-4 w-4" />
      case "partially_signed": return <PenTool className="h-4 w-4" />
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
              <h1 className="text-3xl font-bold">Document Management</h1>
              <p className="text-muted-foreground">
                Manage contracts, templates, and digital signatures
              </p>
            </div>
            <div className="flex space-x-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Document
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Document Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentCategories.map((category, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{category.name}</p>
                      <p className="text-2xl font-bold">{category.count}</p>
                    </div>
                    <div className={`p-2 rounded-full ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="documents">All Documents</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="signatures">Digital Signatures</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>
                    Manage all your real estate documents in one place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            {getStatusIcon(doc.status)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{doc.name}</p>
                              <Badge className={getStatusColor(doc.status)}>
                                {doc.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{doc.client} • {doc.property}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                              <span>Created: {doc.dateCreated}</span>
                              <span>Modified: {doc.lastModified}</span>
                              <span>{doc.size}</span>
                              <span>{doc.version}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {documentTemplates.map((template, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="secondary">{template.usage} used</Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Template Fields:</p>
                          <div className="flex flex-wrap gap-2">
                            {template.fields.map((field, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Last updated: {template.lastUpdated}</span>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <Plus className="h-3 w-3 mr-1" />
                            Use Template
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="signatures">
              <Card>
                <CardHeader>
                  <CardTitle>Digital Signature Requests</CardTitle>
                  <CardDescription>
                    Track document signatures and approvals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {signatureRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <PenTool className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{request.document}</p>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{request.client}</p>
                            <p className="text-xs text-muted-foreground">Sent: {request.sentDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {request.completedSigners}/{request.signers} signatures
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="h-3 w-3 mr-1" />
                              Resend
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="automation">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Document Capture</CardTitle>
                    <CardDescription>
                      Automatically import documents sent to your dedicated email address
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-medium">Dedicated Email Address:</p>
                        <p className="text-lg font-mono bg-background p-2 rounded mt-2">
                          documents@murivest.crm.email.com
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Forward documents from vendors, clients, and banks to this address for automatic processing
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium">Documents Processed</h4>
                          <p className="text-2xl font-bold text-green-600">148</p>
                          <p className="text-sm text-muted-foreground">This month</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium">Auto-Categorized</h4>
                          <p className="text-2xl font-bold text-blue-600">92%</p>
                          <p className="text-sm text-muted-foreground">Success rate</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium">Manual Review</h4>
                          <p className="text-2xl font-bold text-yellow-600">12</p>
                          <p className="text-sm text-muted-foreground">Pending</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Document Generation Rules</CardTitle>
                    <CardDescription>
                      Configure automatic document generation based on triggers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Auto-generate Offer Letters</p>
                          <p className="text-sm text-muted-foreground">When EOI is submitted and approved</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Auto-send Payment Reminders</p>
                          <p className="text-sm text-muted-foreground">3 days after invoice due date</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Generate Lease Renewal Notices</p>
                          <p className="text-sm text-muted-foreground">60 days before lease expiry</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
