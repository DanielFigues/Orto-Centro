import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const sourceDir = path.join(root, 'public', 'categories-source')
const outDir = path.join(root, 'public', 'categories')
const focalPath = path.join(__dirname, 'category-focal-points.json')
const dimsOutPath = path.join(outDir, 'category-image-dimensions.json')

const slugs = [
  'mobilidade',
  'ortopedia-e-suporte',
  'apoio-postural',
  'banho-e-higiene',
  'compressao-e-circulacao',
  'saude-dos-pes',
  'fisioterapia-e-exercicios',
  'bem-estar-e-terapia',
  'cuidados-em-casa',
  'locacao-de-equipamentos',
]

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

async function main() {
  let focalPoints = {}
  try {
    focalPoints = JSON.parse(await fs.readFile(focalPath, 'utf8'))
  } catch {
    // default center for all
  }

  await fs.mkdir(outDir, { recursive: true })

  const sourceFiles = await fs.readdir(sourceDir)
  const errors = []
  const dimensions = {}
  let processed = 0

  for (const slug of slugs) {
    const match = sourceFiles.find((f) => path.parse(f).name === slug)
    if (!match) {
      errors.push(`[${slug}] Arquivo de origem não encontrado em public/categories-source/`)
      continue
    }

    const srcPath = path.join(sourceDir, match)
    const image = sharp(srcPath)
    const meta = await image.metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 0
    const shorter = Math.min(width, height)

    if (shorter < 600) {
      errors.push(
        `[${slug}] Origem menor que 600px no lado menor: ${width}x${height} (${match})`,
      )
      continue
    }

    if (shorter < 900) {
      console.warn(
        `WARNING [${slug}] Origem abaixo de 900px no lado menor: ${width}x${height} (${match})`,
      )
    }

    const focal = focalPoints[slug] ?? { x: 0.5, y: 0.5 }
    const fx = clamp(Number(focal.x ?? 0.5), 0, 1)
    const fy = clamp(Number(focal.y ?? 0.5), 0, 1)
    const size = shorter
    let left = Math.round(fx * width - size / 2)
    let top = Math.round(fy * height - size / 2)
    left = clamp(left, 0, width - size)
    top = clamp(top, 0, height - size)

    const largeSize = shorter >= 1200 ? 1200 : shorter
    const pipeline = sharp(srcPath).extract({ left, top, width: size, height: size })

    const outLarge = path.join(outDir, `${slug}.jpg`)
    const out600 = path.join(outDir, `${slug}-600.jpg`)

    await pipeline
      .clone()
      .resize(largeSize, largeSize)
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outLarge)
    await pipeline.clone().resize(600, 600).jpeg({ quality: 82, mozjpeg: true }).toFile(out600)

    dimensions[slug] = {
      large: { width: largeSize, height: largeSize, file: `/categories/${slug}.jpg` },
      small: { width: 600, height: 600, file: `/categories/${slug}-600.jpg` },
      source: { width, height, file: match },
    }

    processed++
    console.log(
      `OK ${slug}: ${match} (${width}x${height}) -> ${slug}.jpg (${largeSize}x${largeSize}), ${slug}-600.jpg (600x600)`,
    )
  }

  if (errors.length) {
    console.error('\nFalha ao gerar imagens de categoria:')
    for (const e of errors) console.error(' - ' + e)
    process.exit(1)
  }

  await fs.writeFile(dimsOutPath, JSON.stringify(dimensions, null, 2) + '\n', 'utf8')
  console.log(`\nConcluído: ${processed} categorias processadas. Dimensões em ${dimsOutPath}`)
}

main().catch((err) => {
  console.error('Erro inesperado:', err?.message || err)
  process.exit(1)
})
