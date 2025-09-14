# Murivest Realty - Accounting & CRM System

A comprehensive web-based accounting and Customer Relationship Management (CRM) system built with Next.js, designed specifically for commercial real estate management.

## Features

### 🏢 **Core Accounting Modules**
- **General Ledger** - Chart of accounts and transaction management
- **Accounts Payable** - Vendor bill tracking and payment management
- **Financial Reports** - Profit & Loss statements and Balance Sheets
- **Real-time Dashboard** - KPI monitoring and financial insights

### 👥 **CRM Features**
- **Client Management** - Comprehensive client profiles and tracking
- **Customer Retention** - Gift tracking, birthday notifications, and loyalty programs
- **Prospect Pipeline** - Sales funnel management
- **Communication Tracking** - Email, phone, and meeting logs

### 🔐 **Security & Authentication**
- **NextAuth.js Integration** - Secure user authentication
- **Role-Based Access Control** - Granular permission management
- **Session Management** - JWT-based secure sessions

### 📧 **Email System**
- **Automated Notifications** - Invoice reminders, payment confirmations
- **Welcome Emails** - New user onboarding
- **Birthday Greetings** - Client retention communications
- **Weekly Reports** - Financial summary emails

### 🗄️ **Database**
- **Prisma ORM** - Type-safe database operations
- **SQLite Database** - Local development database
- **Comprehensive Schema** - 15+ interconnected models

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database:** Prisma + SQLite
- **Authentication:** NextAuth.js
- **UI:** shadcn/ui + Tailwind CSS
- **Email:** Nodemailer
- **Language:** TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd murivest-accounting
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push

   # Seed the database with sample data
   npx tsx prisma/seed.ts
   ```

4. **Configure environment variables**
   Copy `.env` and update the values:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-change-in-production"

   # Email (optional - configure for email features)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   SMTP_FROM="noreply@murivest.com"
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Login Credentials

- **Email:** `admin@murivest.com`
- **Password:** `admin123`

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/[...nextauth]/ # NextAuth configuration
│   │   ├── dashboard/          # Dashboard data API
│   │   ├── accounts-payable/   # AP module API
│   │   ├── reports/            # Reports API
│   │   └── email/              # Email service API
│   ├── accounting/             # Accounting modules
│   │   ├── general-ledger/     # General ledger
│   │   ├── accounts-payable/   # Accounts payable
│   │   └── reports/            # Financial reports
│   ├── clients/                # CRM module
│   ├── auth/                   # Authentication pages
│   │   └── signin/             # Sign-in page
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── layout/                 # Layout components
│   └── providers/              # React providers
├── lib/
│   ├── prisma.ts               # Database client
│   ├── auth.ts                 # NextAuth configuration
│   └── email.ts                # Email service
└── prisma/
    ├── schema.prisma           # Database schema
    └── seed.ts                 # Database seeding
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Biome

## Database Management

```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev
```

## Email Configuration

To enable email features, configure SMTP settings in `.env`:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@murivest.com"
```

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in SMTP_PASS

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- **Railway:** Supports Next.js + Prisma + SQLite
- **Render:** Similar configuration to Vercel
- **AWS/DigitalOcean:** Manual server setup required

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.