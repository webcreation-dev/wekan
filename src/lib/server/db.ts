import 'server-only'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

// SQLite partout :
// - TURSO_DATABASE_URL défini (Vercel) → base SQLite hébergée chez Turso ;
// - sinon → fichier local désigné par DATABASE_URL (prisma/dev.db).
function createPrisma() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  if (!tursoUrl) return new PrismaClient()
  // Prisma exige DATABASE_URL même quand l'adaptateur fournit la connexion
  process.env.DATABASE_URL ??= 'file:./dev.db'
  const libsql = createClient({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN })
  return new PrismaClient({ adapter: new PrismaLibSQL(libsql) })
}

// Une seule instance en développement (le rechargement à chaud recrée les modules)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db = globalForPrisma.prisma ?? createPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
