import { promises as fs } from 'node:fs'
import path from 'node:path'

export const metadata = {
  title: 'Desenhos',
}

const drawsDirectory = path.join(process.cwd(), 'app', 'projects', 'draws')
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])

export default async function Page() {
  const entries = await fs.readdir(drawsDirectory, { withFileTypes: true })

  const drawings = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))

  return (
    <section className='drawings-gallery-section'>
      <h1 className='font-semibold mb-7 text-rurikon-600 text-balance'>
        Desenhos
      </h1>
      <div className='mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {drawings.map((name) => (
          <figure
            key={name}
            className='overflow-hidden border border-rurikon-border bg-rurikon-50'
          >
            <img
              src={`/desenhos/imagem/${encodeURIComponent(name)}`}
              alt={`Desenho ${path.parse(name).name}`}
              className='block h-full w-full object-cover'
              draggable={false}
              loading='lazy'
            />
          </figure>
        ))}
      </div>
    </section>
  )
}
