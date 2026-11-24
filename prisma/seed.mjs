// Crée (ou met à jour) le compte agent défini par AGENT_PHONE / AGENT_PASSWORD.
// Usage : npm run db:seed
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import { randomBytes, scryptSync } from 'crypto'

const phone = (process.env.AGENT_PHONE ?? '').replace(/\D/g, '')
const password = process.env.AGENT_PASSWORD ?? ''
if (!phone || password.length < 6) {
  console.error('Définissez AGENT_PHONE et AGENT_PASSWORD (6 caractères min.) dans .env')
  process.exit(1)
}

const salt = randomBytes(16).toString('hex')
const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`

// Même logique que src/lib/server/db.ts : Turso si TURSO_DATABASE_URL, sinon fichier local
let db
if (process.env.TURSO_DATABASE_URL) {
  process.env.DATABASE_URL ??= 'file:./dev.db'
  const libsql = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN })
  db = new PrismaClient({ adapter: new PrismaLibSQL(libsql) })
} else {
  db = new PrismaClient()
}
const agent = await db.user.upsert({
  where: { phone },
  update: { role: 'agent', passwordHash },
  create: { phone, passwordHash, role: 'agent', firstName: 'Agent', lastName: 'Wekan' },
})
console.log(`Compte agent prêt : ${agent.phone}`)
await db.$disconnect()
