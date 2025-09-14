import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@murivest.com' },
    update: {},
    create: {
      email: 'admin@murivest.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create some sample accounts
  const accounts = [
    {
      code: '1000',
      name: 'Cash and Cash Equivalents',
      type: 'Asset',
      category: 'Current Assets',
    },
    {
      code: '1100',
      name: 'Accounts Receivable',
      type: 'Asset',
      category: 'Current Assets',
    },
    {
      code: '1500',
      name: 'Investment Properties',
      type: 'Asset',
      category: 'Fixed Assets',
    },
    {
      code: '2000',
      name: 'Accounts Payable',
      type: 'Liability',
      category: 'Current Liabilities',
    },
    {
      code: '3000',
      name: 'Owner\'s Equity',
      type: 'Equity',
      category: 'Equity',
    },
    {
      code: '4000',
      name: 'Rental Income',
      type: 'Revenue',
      category: 'Operating Revenue',
    },
    {
      code: '5000',
      name: 'Property Maintenance',
      type: 'Expense',
      category: 'Operating Expenses',
    },
  ]

  for (const account of accounts) {
    await prisma.account.upsert({
      where: { code: account.code },
      update: {},
      create: {
        ...account,
        userId: adminUser.id,
      },
    })
  }

  // Create sample client
  const client = await prisma.client.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+254712345678',
      company: 'ABC Corp',
      address: '123 Main St',
      city: 'Nairobi',
      country: 'Kenya',
      userId: adminUser.id,
    },
  })

  // Create sample property
  await prisma.property.upsert({
    where: { id: 'sample-property-1' },
    update: {},
    create: {
      id: 'sample-property-1',
      name: 'Westlands Office Complex',
      address: 'Westlands Road',
      city: 'Nairobi',
      country: 'Kenya',
      propertyType: 'Commercial',
      status: 'LEASED',
      purchasePrice: 150000000,
      currentValue: 180000000,
      monthlyRent: 2400000,
      description: 'Modern office complex in Westlands',
      userId: adminUser.id,
      clientId: client.id,
    },
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })