import 'server-only'
import { PrismaClient } from '@prisma/client'

// Une seule instance en développement (le rechargement à chaud recrée les modules)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
