import { PrismaClient } from '../../prisma/generated/prisma-client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<PrismaClient['$extends']> | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma