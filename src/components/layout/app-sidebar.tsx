"use client"

import {
  Building2,
  DollarSign,
  FileText,
  Users,
  BarChart3,
  Settings,
  Home,
  CreditCard,
  Receipt,
  Banknote,
  Calculator,
  FolderOpen,
  UserCheck,
  TrendingUp,
  Calendar,
  Bell
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    current: false,
  },
  {
    name: "Accounting",
    icon: Calculator,
    children: [
      { name: "General Ledger", href: "/accounting/general-ledger", icon: FileText },
      { name: "Accounts Payable", href: "/accounting/accounts-payable", icon: Receipt },
      { name: "Accounts Receivable", href: "/accounting/receivable", icon: DollarSign },
      { name: "Bank Reconciliation", href: "/accounting/bank-reconciliation", icon: Banknote },
      { name: "Expenses", href: "/accounting/expenses", icon: CreditCard },
    ],
  },
  {
    name: "Properties",
    href: "/properties",
    icon: Building2,
    badge: "24",
  },
  {
    name: "Clients & Tenants",
    href: "/clients",
    icon: Users,
    badge: "156",
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FolderOpen,
  },
  {
    name: "Reports",
    icon: BarChart3,
    children: [
      { name: "Financial Statements", href: "/accounting/reports", icon: TrendingUp },
      { name: "Property Reports", href: "/reports/properties", icon: Building2 },
      { name: "Client Reports", href: "/reports/clients", icon: Users },
      { name: "Custom Reports", href: "/reports/custom", icon: BarChart3 },
    ],
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: "3",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold">Murivest Realty</h1>
            <p className="text-xs text-muted-foreground">CRM & Accounting</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div className="space-y-1">
                <div className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </div>
                <div className="ml-6 space-y-1">
                  {item.children.map((child) => (
                    <Link key={child.name} href={child.href}>
                      <Button
                        variant={pathname === child.href ? "secondary" : "ghost"}
                        className="w-full justify-start h-8 px-3"
                      >
                        <child.icon className="mr-2 h-3 w-3" />
                        {child.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCheck className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@murivest.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
