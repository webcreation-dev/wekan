// Applique les migrations Prisma (prisma/migrations/*/migration.sql) sur la base Turso.
// Idempotent : les migrations déjà appliquées sont notées dans la table _turso_migrations.
// Lancé automatiquement au déploiement Vercel (script vercel-build) ; sans
// TURSO_DATABASE_URL (en local), ne fait rien.
import { createClient } from '@libsql/client'
import { readdir, readFile } from 'fs/promises'
import path from 'path'

const url = process.env.TURSO_DATABASE_URL
if (!url) {
  console.log('TURSO_DATABASE_URL absent : migrations Turso ignorées.')
  process.exit(0)
}

const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
await client.execute('CREATE TABLE IF NOT EXISTS _turso_migrations (name TEXT PRIMARY KEY, applied_at INTEGER NOT NULL)')
const applied = new Set((await client.execute('SELECT name FROM _turso_migrations')).rows.map(r => r.name))

const dir = path.join(process.cwd(), 'prisma', 'migrations')
const names = (await readdir(dir, { withFileTypes: true })).filter(d => d.isDirectory()).map(d => d.name).sort()
for (const name of names) {
  if (applied.has(name)) continue
  const sql = await readFile(path.join(dir, name, 'migration.sql'), 'utf8')
  await client.executeMultiple(sql)
  await client.execute({ sql: 'INSERT INTO _turso_migrations (name, applied_at) VALUES (?, ?)', args: [name, Date.now()] })
  console.log(`Migration appliquée : ${name}`)
}
console.log('Base Turso à jour.')
client.close()
