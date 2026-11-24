import 'server-only'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { get, put } from '@vercel/blob'

// Stockage des vocaux :
// - Vercel Blob (store privé) dès que BLOB_STORE_ID (auth OIDC de Vercel) ou
//   BLOB_READ_WRITE_TOKEN est défini (production) ;
// - sinon dossier local storage/voices (développement).
// Les fichiers ne sont jamais exposés directement : ils passent par GET /api/voices/[id],
// qui vérifie les droits.
const useBlob = () => Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN)
const VOICES_DIR = path.join(process.cwd(), 'storage', 'voices')
const blobPath = (fileName: string) => `voices/${path.basename(fileName)}`

export async function saveVoiceFile(fileName: string, data: Buffer, contentType: string) {
  if (useBlob()) {
    await put(blobPath(fileName), data, { access: 'private', contentType, addRandomSuffix: false })
    return
  }
  await mkdir(VOICES_DIR, { recursive: true })
  await writeFile(path.join(VOICES_DIR, path.basename(fileName)), data)
}

export async function readVoiceFile(fileName: string): Promise<Buffer | null> {
  if (useBlob()) {
    const result = await get(blobPath(fileName), { access: 'private' })
    if (!result || result.statusCode !== 200) return null
    return Buffer.from(await new Response(result.stream).arrayBuffer())
  }
  return readFile(path.join(VOICES_DIR, path.basename(fileName))).catch(() => null)
}
