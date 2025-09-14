import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { emailService } from "@/lib/email"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { type, recipient, subject, content, metadata } = body

    let success = false

    switch (type) {
      case 'welcome':
        success = await emailService.sendWelcomeEmail(recipient, metadata?.name || 'User')
        break
      case 'invoice':
        success = await emailService.sendInvoiceNotification(
          recipient,
          metadata?.clientName || 'Client',
          metadata?.invoiceNumber || '',
          metadata?.amount || ''
        )
        break
      case 'payment_reminder':
        success = await emailService.sendPaymentReminder(
          recipient,
          metadata?.clientName || 'Client',
          metadata?.amount || '',
          metadata?.dueDate || ''
        )
        break
      case 'birthday':
        success = await emailService.sendBirthdayGreeting(
          recipient,
          metadata?.clientName || 'Client'
        )
        break
      case 'weekly_report':
        success = await emailService.sendWeeklyReport(
          recipient,
          metadata?.userName || 'User',
          metadata?.reportData || {}
        )
        break
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    // Log the email
    await prisma.emailLog.create({
      data: {
        to: recipient,
        subject: subject || 'System Notification',
        body: content || '',
        type,
        status: success ? 'SENT' : 'FAILED',
        error: success ? null : 'Email sending failed',
        userId
      }
    })

    return NextResponse.json({
      success,
      message: success ? 'Email sent successfully' : 'Failed to send email'
    })

  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}