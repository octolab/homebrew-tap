#!/usr/bin/env node
// Guardrails of the catalog site, shared by cd.docs.yml and local runs.
// Zero dependencies: Node, git, and gh where GitHub is asked.
//
//   site.mjs pages <base-url>            (CI: the Pages URL matches settings.json pages)
//   site.mjs settings                    (Pages on GitHub: source, domain and HTTPS as settings.json declares)
//   site.mjs site-env                    (CI: SITE_URL and BASE_PATH of a preview, from settings.json pages)
//   site.mjs smoke <site-url> [--retries <n>]
//                                        (CI: the deployed site serves the page, its assets and the current catalog)
//   site.mjs doctor                      (on demand: settings, workflows and the live site, with remediation)
//
// The pages, site-env and smoke modes follow .github/scripts/release.mjs of
// octomation/pulse, so the sites of OctoLab fail the same way.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadCatalog } from '../../docs/catalog.mjs'

const SETTINGS = '.github/settings.json'

function tryGit(...args) {
  try { return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }) } catch { return null }
}

const root = () => tryGit('rev-parse', '--show-toplevel')?.trim() ?? process.cwd()

function gh(...args) {
  try {
    return execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (e) {
    throw new Error((e.stderr || e.message || '').trim())
  }
}

export function settings(dir = root()) {
  const file = join(dir, SETTINGS)
  const cfg = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  return { pages: cfg.pages || null, workflows: cfg.workflows || {} }
}

// owner/name from GITHUB_REPOSITORY or the origin remote.
export function repoSlug() {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY
  const m = tryGit('remote', 'get-url', 'origin')?.trim().match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/)
  return m ? m[1] : null
}

// The URL the site must be built for: the custom domain, or the default one.
export function expectedSite(pages, slug) {
  if (pages?.cname) return `https://${pages.cname}/`
  if (!slug) return null
  const [owner, name] = slug.toLowerCase().split('/')
  return name === `${owner}.github.io` ? `https://${name}/` : `https://${owner}.github.io/${name}/`
}

const slash = (url) => url.replace(/\/*$/, '/')

// The build bakes the base path and the origin in; a domain changed in Settings
// but not in settings.json (or the reverse) must stop the build, not ship it.
export function pagesCheck(baseUrl, pages = settings().pages, slug = repoSlug()) {
  const expected = expectedSite(pages, slug)
  if (!baseUrl) return ['no Pages base URL; is actions/configure-pages set up?']
  if (!expected) return ['cannot resolve the repository; set GITHUB_REPOSITORY or the origin remote']
  if (slash(baseUrl) === expected) return []
  return [`Pages serves ${slash(baseUrl)}, ${SETTINGS} expects ${expected}; ` +
    'update pages.cname there or Settings → Pages → Custom domain so they agree']
}

// The Pages configuration on GitHub against settings.json: the source, the
// custom domain and Enforce HTTPS. `actual` is the answer of GET /repos/{slug}/pages.
export function settingsCheck(actual, want, slug) {
  const errors = []
  const where = `https://github.com/${slug}/settings/pages`
  if (!want) return errors
  if (actual.build_type !== (want.build_type || 'workflow')) errors.push(`Pages builds from ${actual.build_type}; set Settings → Pages → Source: GitHub Actions (${where})`)
  if ((actual.cname || null) !== (want.cname || null)) errors.push(`Pages domain is ${actual.cname || 'default'}, ${SETTINGS} says ${want.cname || 'default'}; align them (${where}), then rebuild: gh workflow run cd.docs.yml`)
  if (want.https_enforced !== undefined && Boolean(actual.https_enforced) !== want.https_enforced) {
    errors.push(`Pages HTTPS enforcement is ${actual.https_enforced ? 'on' : 'off'}, ${SETTINGS} wants ${want.https_enforced ? 'on' : 'off'}; ` +
      `toggle Enforce HTTPS (${where}) or: gh api -X PUT repos/${slug}/pages -F https_enforced=${want.https_enforced}`)
  }
  return errors
}

function readPages(slug) {
  return JSON.parse(gh('api', `repos/${slug}/pages`))
}

async function probe(url, init = {}) {
  try {
    const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000), ...init })
    return { status: res.status, type: res.headers.get('content-type') || '', location: res.headers.get('location'), text: init.method === 'HEAD' ? '' : await res.text() }
  } catch (e) {
    return { status: 0, type: '', location: null, text: '', error: e.cause?.code || e.message }
  }
}

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// What the deployed page must show: every package of the catalog, in its own
// card (data-package), with its install command and the version of the tap.
// A page built before the last release fails here.
export function catalogErrors(html, items, site) {
  const errors = []
  for (const item of items) {
    const start = html.indexOf(`data-package="${item.token}"`)
    if (start < 0) {
      errors.push(`${site}: ${item.token} has no card on the page`)
      continue
    }
    const card = html.slice(start, html.indexOf('</article>', start))
    if (!card.includes(`${item.token}</code>`)) errors.push(`${site}: the card of ${item.token} has no install command`)
    if (item.version && !new RegExp(`>v${escape(item.version)}<`).test(card)) {
      errors.push(`${site}: ${item.token} is not shown at v${item.version}; the site is older than the tap, rebuild it`)
    }
  }
  return errors
}

async function smokeOnce(site, { items, pages, slug }) {
  const errors = []
  const expect = (cond, msg) => { if (!cond) errors.push(msg) }
  const show = (r) => r.error || `HTTP ${r.status}`

  const home = await probe(site)
  expect(home.status === 200 && home.type.includes('text/html'), `${site}: ${show(home)}, want an HTML page`)
  if (home.status !== 200) return errors

  // A stale base path is exactly this: the page loads, its assets do not.
  const assets = [...new Set(home.text.match(/(?:href|src)="([^"]*\/_next\/static\/[^"]+\.(?:css|js))"/g) || [])]
    .map((a) => new URL(a.replace(/^(?:href|src)="|"$/g, ''), site).href)
  expect(assets.length > 0, `${site}: no /_next/static assets referenced`)
  for (const url of [assets.find((a) => a.endsWith('.css')), assets.find((a) => a.endsWith('.js'))].filter(Boolean)) {
    const r = await probe(url, { method: 'HEAD' })
    expect(r.status === 200, `${url}: ${show(r)}; the site was built for another base path, rebuild it`)
  }

  const og = home.text.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1]
  if (og) {
    expect(og.startsWith(site), `og:image ${og} is outside ${site}; SITE_URL is stale, rebuild the site`)
    const r = await probe(og, { method: 'HEAD' })
    expect(r.status === 200 && r.type.startsWith('image/'), `${og}: ${show(r)}, want an image`)
  } else {
    errors.push(`${site}: no og:image`)
  }

  const icon = await probe(new URL('icon.svg', site).href, { method: 'HEAD' })
  expect(icon.status === 200, `${site}icon.svg: ${show(icon)}`)

  errors.push(...catalogErrors(home.text, items, site))

  const missing = await probe(new URL('smoke-missing-page/', site).href)
  expect(missing.status === 404 && missing.text.includes('/_next/static/'), `${site}smoke-missing-page/: ${show(missing)}, want the site's own 404`)

  // Enforce HTTPS: the plain address only redirects to the secure one.
  if (pages?.cname && pages.https_enforced) {
    const plain = `http://${pages.cname}/`
    const r = await probe(plain)
    expect([301, 308].includes(r.status) && r.location === site,
      `${plain}: ${show(r)} to ${r.location}, want a permanent redirect to ${site}; turn on Enforce HTTPS`)
  }

  // With a custom domain, the default one only redirects, keeping the path.
  const fallback = expectedSite(null, slug)
  if (fallback && fallback !== site) {
    const r = await probe(fallback)
    expect([301, 302, 308].includes(r.status) && r.location === site,
      `${fallback}: ${show(r)} to ${r.location}, want a redirect to ${site}`)
  }
  return errors
}

// Pages may serve the previous deployment for a while after deploy-pages returns.
export async function smoke(site, retries, context) {
  if (!Number.isInteger(retries) || retries < 0) return [`--retries must be a non-negative integer, got ${retries}`]
  const ctx = context ?? { items: loadCatalog(root(), { dates: false }).items, pages: settings().pages, slug: repoSlug() }
  let errors = []
  for (let i = 0; i <= retries; i++) {
    errors = await smokeOnce(slash(site), ctx)
    if (!errors.length || i === retries) break
    await new Promise((r) => setTimeout(r, 15000))
  }
  return errors
}

async function doctor() {
  const report = []
  const ok = (m) => report.push(['ok', m])
  const fail = (m) => report.push(['fail', m])
  const slug = repoSlug()
  if (!slug) return [['fail', 'cannot resolve the repository; set GITHUB_REPOSITORY or the origin remote']]
  const { pages: want, workflows: declared } = settings()

  try {
    const workflows = JSON.parse(gh('api', `repos/${slug}/actions/workflows`, '--paginate', '--slurp')).flatMap((page) => page.workflows)
    for (const workflow of workflows.filter((w) => w.path.startsWith('.github/workflows/'))) {
      const file = workflow.path.split('/').at(-1)
      const state = declared[file]?.state || 'active'
      // "disabled" accepts any way of being off: by hand, or after 60 days without activity
      const matches = workflow.state === state || (state === 'disabled' && workflow.state.startsWith('disabled'))
      if (matches) ok(`${workflow.name} is ${workflow.state}${declared[file]?.reason ? `: ${declared[file].reason}` : ''}`)
      else if (state === 'active') fail(`${workflow.name} is ${workflow.state}; after pushing the reviewed YAML, run: gh workflow enable ${file} -R ${slug}`)
      else fail(`${workflow.name} is ${workflow.state}, ${SETTINGS} wants ${state}; run: gh workflow disable ${file} -R ${slug}, or drop it from ${SETTINGS}`)
    }
  } catch (e) {
    fail(`workflows are not readable (${e.message})`)
  }

  let actual = null
  try {
    actual = readPages(slug)
  } catch (e) {
    fail(`Pages is not enabled or not readable (${e.message}); check https://github.com/${slug}/settings/pages`)
  }
  if (actual) {
    const errors = settingsCheck(actual, want, slug)
    errors.forEach(fail)
    if (!errors.length) ok(`Pages publishes ${actual.html_url} from GitHub Actions${actual.https_enforced ? ', HTTPS enforced' : ''}`)
    const site = expectedSite(want, slug)
    const smokeErrors = await smoke(site, 0)
    smokeErrors.forEach((e) => fail(`site: ${e}`))
    if (!smokeErrors.length) ok(`site ${site} serves the page, its assets and the current catalog`)
  }
  return report
}

async function main(mode, rest) {
  const opts = { _: [] }
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--retries') opts.retries = rest[++i]
    else opts._.push(rest[i])
  }
  switch (mode) {
    case 'pages': {
      const errors = pagesCheck(opts._[0])
      errors.forEach((e) => console.error(`pages: ${e}`))
      process.exit(errors.length ? 1 : 0)
    }
    case 'settings': {
      const slug = repoSlug()
      const errors = settingsCheck(readPages(slug), settings().pages, slug)
      errors.forEach((e) => console.error(`settings: ${e}`))
      if (!errors.length) console.log(`settings: Pages of ${slug} match ${SETTINGS}`)
      process.exit(errors.length ? 1 : 0)
    }
    case 'site-env': {
      const site = expectedSite(settings().pages, repoSlug())
      if (!site) throw new Error('cannot resolve the Pages URL')
      console.log(`SITE_URL=${site}`)
      console.log(`BASE_PATH=${new URL(site).pathname.replace(/\/$/, '')}`)
      break
    }
    case 'smoke': {
      const errors = await smoke(opts._[0], Number(opts.retries ?? 20))
      errors.forEach((e) => console.error(`smoke: ${e}`))
      process.exit(errors.length ? 1 : 0)
    }
    case 'doctor': {
      const report = await doctor()
      for (const [status, msg] of report) console.log(`${status.padEnd(6)} ${msg}`)
      process.exit(report.some(([s]) => s === 'fail') ? 1 : 0)
    }
    default:
      console.error('usage: site.mjs pages|settings|site-env|smoke|doctor ...')
      process.exit(2)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main(process.argv[2], process.argv.slice(3))
  } catch (e) {
    console.error(`site: ${e.message}`)
    process.exit(1)
  }
}
