import 'server-only'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

// Vocaux stockés sur disque. En production serverless (Vercel…), remplacer par
// un stockage objet (S3, R2, Vercel Blob) : seules ces deux fonctions changent.
const VOICES_DIR = path.join(process.cwd(), 'storage', 'voices')

export async function saveVoiceFile(fileName: string, data: Buffer) {
  await mkdir(VOICES_DIR, { recursive: true })
  await writeFile(path.join(VOICES_DIR, path.basename(fileName)), data)
}

export function readVoiceFile(fileName: string) {
  return readFile(path.join(VOICES_DIR, path.basename(fileName)))
}
