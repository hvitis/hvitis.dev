import { execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { access, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const blogRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const projectArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'))
const projectRoot = resolve(projectArg || join(blogRoot, '..', 'LanternHouse'))
const siteRoot = join(projectRoot, '_site')
const imageDirectory = join(blogRoot, 'public/static/images/blog/lanternhouse')
const articlePath = join(
  blogRoot,
  'data/blog/2026-10-17/lanternwood-house-parametryczny-domek-ze-sklejki-cad-ai.mdx'
)
const projectRequire = createRequire(join(projectRoot, 'package.json'))
const { chromium } = projectRequire('playwright')

const shots = [
  {
    name: 'site-main-view',
    heading: 'Main view:',
    alt: 'Główny widok strony LanternHouse z otwartymi ścianami i wnętrzem domku',
  },
  {
    name: 'site-dxf-preview',
    heading: 'DXF preview:',
    alt: 'Podgląd rysunku części domku rozłożonych na arkuszach do wycięcia',
  },
  {
    name: 'site-3d-printables',
    heading: '3D printables:',
    alt: 'Strona mebli do druku 3D z podglądem wybranego mebla i plikami do pobrania',
  },
  {
    name: 'site-preparation',
    heading: 'Instructions:',
    alt: 'Polska lista materiałów i narzędzi w internetowym przewodniku budowy domku',
  },
  {
    name: 'site-instructions',
    heading: 'Instructions:',
    alt: 'Krok montażu domku z widokiem 3D, opisem i przyciskami nawigacji',
  },
]

for (const file of [
  'index.html',
  'data/parts.json',
  'data/assembly.json',
  'prints/manifest.json',
]) {
  await access(join(siteRoot, file))
}
await access(chromium.executablePath())
execFileSync('cwebp', ['-version'], { stdio: 'pipe' })
let article = await readFile(articlePath, 'utf8')
for (const shot of shots) {
  if (!article.includes(`### ${shot.heading}`)) throw new Error(`Missing section: ${shot.heading}`)
}

if (process.argv.includes('--check')) {
  console.log(`Static site: ${siteRoot}`)
  console.log(`Screenshot browser: ${chromium.executablePath()}`)
  console.log(`Ready to capture ${shots.length} views and add them to ${articlePath}`)
  process.exit(0)
}

const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.stl': 'model/stl',
}
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const file = resolve(siteRoot, `.${pathname === '/' ? '/index.html' : pathname}`)
    if (!file.startsWith(siteRoot + sep)) throw new Error('Outside the static site')
    const body = await readFile(file)
    response.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    })
    response.end(body)
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
})

let browser
let temporaryDirectory
try {
  await new Promise((accept, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', accept)
  })
  const origin = `http://127.0.0.1:${server.address().port}`
  console.log(`Local LanternHouse preview: ${origin}`)
  temporaryDirectory = await mkdtemp(join(tmpdir(), 'lanternhouse-screenshots-'))
  browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] })
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1.25,
    colorScheme: 'light',
  })
  page.setDefaultTimeout(60000)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route('**/*', (route) =>
    route
      .request()
      .url()
      .startsWith(origin + '/')
      ? route.continue()
      : route.abort()
  )

  const capture = async (name) => {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.evaluate(() => document.fonts.ready)
    // Let camera and drawer animations settle before capturing the real WebGL scene.
    await page.waitForTimeout(1000)
    const png = join(temporaryDirectory, `${name}.png`)
    await page.screenshot({ path: png, animations: 'disabled' })
    execFileSync('cwebp', [
      '-quiet',
      '-lossless',
      '-m',
      '6',
      png,
      '-o',
      join(temporaryDirectory, `${name}.webp`),
    ])
    console.log(`Captured ${name}`)
  }

  await page.goto(origin)
  await page.locator('#view[data-ready="true"]').waitFor()
  await page.locator('#openAll').click()
  await capture('site-main-view')

  await page.locator('#tab-dxf').click()
  await page.locator('#dxfViewport[data-ready="true"]').waitFor()
  await capture('site-dxf-preview')

  await page.locator('#tab-printables').click()
  await page.frameLocator('#printablesFrame').locator('#view[data-ready="true"]').waitFor()
  await capture('site-3d-printables')

  await page.locator('#tab-instructions').click()
  await page.locator('#instructionStart').waitFor()
  await capture('site-preparation')
  await page.locator('#instructionStart').click()
  await page.locator('#instructionStepSelect').selectOption('windows-trim')
  await page.locator('#instructionView[data-step="windows-trim"][data-ready="true"]').waitFor()
  await page.locator('#instructionCloseup').click()
  await capture('site-instructions')

  if (errors.length) throw new Error(`The site reported errors: ${errors.join('; ')}`)
  await mkdir(imageDirectory, { recursive: true })
  for (const shot of shots) {
    await copyFile(
      join(temporaryDirectory, `${shot.name}.webp`),
      join(imageDirectory, `${shot.name}.webp`)
    )
  }

  // Insert references only after all actual screenshots have been captured successfully.
  for (const heading of new Set(shots.map((shot) => shot.heading))) {
    const additions = shots
      .filter((shot) => shot.heading === heading && !article.includes(`${shot.name}.webp`))
      .map((shot) => `![${shot.alt}](/static/images/blog/lanternhouse/${shot.name}.webp)`)
    if (!additions.length) continue
    const lines = article.split('\n')
    const index = lines.findIndex((line) => line.startsWith(`### ${heading}`))
    lines.splice(index + 1, 0, '', additions.join('\n\n'))
    article = lines.join('\n')
  }
  await writeFile(articlePath, article)
  console.log(`Added all ${shots.length} optimized screenshots to the blog post.`)
} catch (error) {
  console.error(`Screenshot capture failed: ${error.message}`)
  process.exitCode = 1
} finally {
  await browser?.close()
  if (server.listening) await new Promise((accept) => server.close(accept))
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true })
}
