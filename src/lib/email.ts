import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      }

      await this.transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('Email sending failed:', error)
      return false
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Murivest Realty!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for joining Murivest Realty. Your account has been successfully created.</p>
        <p>You can now access your dashboard to manage your properties, clients, and accounting.</p>
        <p>Best regards,<br>The Murivest Team</p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Murivest Realty',
      html
    })
  }

  async sendInvoiceNotification(email: string, clientName: string, invoiceNumber: string, amount: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Invoice Generated</h2>
        <p>Dear ${clientName},</p>
        <p>A new invoice has been generated for your account.</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
          <p><strong>Amount:</strong> ${amount}</p>
        </div>
        <p>Please review the invoice and make payment by the due date.</p>
        <p>Best regards,<br>Murivest Realty</p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: `Invoice ${invoiceNumber} - Murivest Realty`,
      html
    })
  }

  async sendPaymentReminder(email: string, clientName: string, amount: string, dueDate: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Reminder</h2>
        <p>Dear ${clientName},</p>
        <p>This is a friendly reminder that you have an outstanding payment.</p>
        <div style="background-color: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
          <p><strong>Amount Due:</strong> ${amount}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
        </div>
        <p>Please make your payment to avoid any late fees.</p>
        <p>Best regards,<br>Murivest Realty</p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: 'Payment Reminder - Murivest Realty',
      html
    })
  }

  async sendBirthdayGreeting(email: string, clientName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Happy Birthday!</h2>
        <p>Dear ${clientName},</p>
        <p>On behalf of the entire Murivest Realty team, we wish you a very happy birthday!</p>
        <p>Thank you for being a valued client. We look forward to continuing our partnership.</p>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
          <p style="font-size: 24px;">🎉 🎂 🎈</p>
        </div>
        <p>Best regards,<br>The Murivest Realty Team</p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: 'Happy Birthday from Murivest Realty!',
      html
    })
  }

  async sendWeeklyReport(email: string, userName: string, reportData: any): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Weekly Financial Report</h2>
        <p>Dear ${userName},</p>
        <p>Here's your weekly financial summary:</p>

        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Revenue</h3>
          <p><strong>This Week:</strong> ${reportData.revenue || 'KES 0'}</p>
          <p><strong>Last Week:</strong> ${reportData.lastWeekRevenue || 'KES 0'}</p>

          <h3>Expenses</h3>
          <p><strong>This Week:</strong> ${reportData.expenses || 'KES 0'}</p>
          <p><strong>Last Week:</strong> ${reportData.lastWeekExpenses || 'KES 0'}</p>

          <h3>Outstanding Receivables</h3>
          <p><strong>Total:</strong> ${reportData.receivables || 'KES 0'}</p>

          <h3>Outstanding Payables</h3>
          <p><strong>Total:</strong> ${reportData.payables || 'KES 0'}</p>
        </div>

        <p>Best regards,<br>Murivest Realty System</p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: 'Weekly Financial Report - Murivest Realty',
      html
    })
  }
}

export const emailService = new EmailService()