import { promises as fs } from 'node:fs'
import path from 'node:path'
import { notFound } from 'next/navigation'

const drawsDirectory = path.join(process.cwd(), 'app', 'projects', 'draws')
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params
  const safeName = path.basename(name)
  const extension = path.extname(safeName).toLowerCase()
  const contentType = mimeTypes[extension]

  if (!contentType) {
    notFound()
  }

  const filePath = path.join(drawsDirectory, safeName)

  try {
    const file = await fs.readFile(filePath)

    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    notFound()
  }
}
