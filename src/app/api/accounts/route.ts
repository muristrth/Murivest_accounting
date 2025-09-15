import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const accounts = await (prisma as any).account.findMany({
      where: { userId },
      orderBy: { code: 'asc' }
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Accounts API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    const account = await (prisma as any).account.create({
      data: {
        code: body.code,
        name: body.name,
        type: body.type,
        category: body.category,
        description: body.description,
        userId
      }
    })

    return NextResponse.json(account)
  } catch (error) {
    console.error("Create account API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}