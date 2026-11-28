// The catalog of the tap: what docs/catalog.json says about each package,
// joined with what the tap itself says in Formula/*.rb and Casks/*.rb.
//
// catalog.json is written by hand and changes only when a package joins,
// leaves or is described anew. The version, the platforms, the binaries and
// the date of the last update come from the tap, so a release that rewrites a
// Formula or a Cask updates the site without touching this file.
//
// Zero dependencies: Node and git only. The site imports it at build time;
// .github/scripts/catalog.mjs runs the same code for checks and the README.

import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const TAP = 'octolab/tap'
export const KINDS = { formula: 'Formula', cask: 'Casks' }
export const STATUSES = {
  active: 'Active',
  template: 'Template',
  legacy: 'Earlier project',
  fork: 'Fork',
  archived: 'Archived fork',
}

// macOS releases a Cask may require, by the symbol Homebrew uses
const MACOS = { tahoe: '26', sequoia: '15', sonoma: '14', ventura: '13', monterey: '12', big_sur: '11' }

// A Ruby string literal in double quotes; GoReleaser writes multi-line ones.
const string = (text, key) => {
  const m = new RegExp(`^\\s*${key}\\s+"((?:[^"\\\\]|\\\\.)*)"`, 'm').exec(text)
  return m ? m[1].replace(/\\(.)/g, '$1').replace(/\s+/g, ' ').trim() : null
}

const unique = (list) => [...new Set(list)]

// owner/name of the GitHub repository whose releases the package downloads
const repository = (text) => /url\s+"https:\/\/github\.com\/([^/"]+\/[^/"]+)\/releases\/download\//.exec(text)?.[1] ?? null

export function parseFormula(text) {
  const os = []
  if (/^\s*on_macos do/m.test(text)) os.push('macOS')
  if (/^\s*on_linux do/m.test(text)) os.push('Linux')
  const arch = []
  if (/Hardware::CPU\.arm\?/.test(text)) arch.push('arm64')
  if (/Hardware::CPU\.intel\?/.test(text)) arch.push('x86_64')
  return {
    version: string(text, 'version'),
    desc: string(text, 'desc'),
    homepage: string(text, 'homepage'),
    license: string(text, 'license'),
    repository: repository(text),
    os,
    arch,
    binaries: unique([...text.matchAll(/bin\.install\s+"([^"]+)"/g)].map((m) => m[1])),
    service: /^\s*service do/m.test(text),
    check: versionCheck(text),
  }
}

// The command the Formula's own test runs to print the version, such as
// `pulse version`: system "#{bin}/pulse", "version" or system "#{bin}/x --version".
function versionCheck(text) {
  const test = /^\s*test do([\s\S]*?)^\s*end\b/m.exec(text)?.[1] ?? ''
  const m = /system\s+"#\{bin\}\/([^"\s]+)(?:",\s*"([^"]+)"|\s+([^"]+)")/.exec(test)
  return m ? `${m[1]} ${m[2] ?? m[3]}` : null
}

export function parseCask(text) {
  const arch = /depends_on\s+arch:\s+:(\w+)/.exec(text)?.[1]
  const linux = /^\s*on_linux do/m.test(text)
  const macos = /depends_on\s+macos:\s+(?:">=\s*)?:(\w+)/.exec(text)?.[1]
  return {
    version: string(text, 'version'),
    desc: string(text, 'desc'),
    homepage: string(text, 'homepage'),
    appName: string(text, 'name'),
    license: null,
    repository: repository(text.replace(/#\{version\}/g, '0')),
    os: linux ? ['macOS', 'Linux'] : ['macOS'],
    arch: arch ? [{ arm64: 'arm64', intel: 'x86_64', x86_64: 'x86_64' }[arch] ?? arch] : ['arm64', 'x86_64'],
    // a release missing from MACOS shows by its name, e.g. "Golden Gate"
    minimum: macos ? (MACOS[macos] ?? macos.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')) : null,
    apps: unique([...text.matchAll(/^\s*app\s+"([^"]+)"/gm)].map((m) => m[1])),
    binaries: unique([...text.matchAll(/^\s*binary\s+"([^"]+)"/gm)].map((m) => m[1].split('/').at(-1))),
    service: false,
    check: null,
  }
}

// The packages of the tap, from the files themselves.
export function scanTap(root) {
  const found = []
  for (const [kind, dir] of Object.entries(KINDS)) {
    const path = join(root, dir)
    if (!existsSync(path)) continue
    for (const file of readdirSync(path).filter((f) => f.endsWith('.rb')).sort()) {
      const text = readFileSync(join(path, file), 'utf8')
      const data = kind === 'cask' ? parseCask(text) : parseFormula(text)
      found.push({ name: file.slice(0, -3), kind, file: `${dir}/${file}`, ...data })
    }
  }
  return found
}

// When the last commit that changed a file was made: { time } in Unix seconds
// for ordering, { day } as YYYY-MM-DD in UTC for display. Null when git or the
// history is not there, as in a shallow or exported tree.
const shallow = new Map()
const isShallow = (root) => {
  if (!shallow.has(root)) {
    try {
      shallow.set(root, execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() !== 'false')
    } catch {
      shallow.set(root, true)
    }
  }
  return shallow.get(root)
}

export function updatedAt(root, file) {
  // in a shallow clone, the log of any file ends at the boundary commit
  if (isShallow(root)) return null
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%ct', '--', file], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (!/^\d+$/.test(out)) return null
    const time = Number(out)
    return { time, day: new Date(time * 1000).toISOString().slice(0, 10) }
  } catch {
    return null
  }
}

export function readCatalog(root) {
  return JSON.parse(readFileSync(join(root, 'docs/catalog.json'), 'utf8'))
}

const key = (item) => `${item.kind}:${item.name}`

export const installCommand = (item) => `brew install --${item.kind} ${TAP}/${item.name}`

// The catalog as the site shows it: entries in the order of catalog.json,
// each joined with its package. Entries without a package are left out here;
// checkCatalog reports them.
export function loadCatalog(root, { dates = true } = {}) {
  const catalog = readCatalog(root)
  const packages = new Map(scanTap(root).map((p) => [key(p), p]))
  const items = catalog.items.flatMap((entry) => {
    const pkg = packages.get(key(entry))
    if (!pkg) return []
    const version = pkg.version
    return [{
      ...pkg,
      ...entry,
      version,
      prerelease: /-/.test(version ?? ''),
      install: installCommand(entry),
      token: `${TAP}/${entry.name}`,
      release: pkg.repository && version ? `https://github.com/${pkg.repository}/releases/tag/v${version}` : null,
      changelog: entry.changelog && version ? entry.changelog.replaceAll('{version}', version) : null,
      repositoryUrl: pkg.repository ? `https://github.com/${pkg.repository}` : null,
      ...(() => { const at = dates ? updatedAt(root, pkg.file) : null; return { updated: at?.day ?? null, updatedTime: at?.time ?? null } })(),
    }]
  })
  const groups = catalog.groups.map((group) => ({ ...group, items: items.filter((i) => i.group === group.id) }))
  const latest = items.filter((i) => i.updatedTime).sort((a, b) => b.updatedTime - a.updatedTime)[0] ?? null
  const updated = latest?.updated ?? null
  return {
    groups,
    items,
    updated,
    latest,
    counts: {
      formula: items.filter((i) => i.kind === 'formula').length,
      cask: items.filter((i) => i.kind === 'cask').length,
    },
  }
}

const REQUIRED = ['name', 'kind', 'group', 'icon', 'title', 'tagline', 'summary', 'site', 'status']

// Everything a build relies on, offline. Returns a list of problems.
export function checkCatalog(root) {
  const errors = []
  let catalog
  try {
    catalog = readCatalog(root)
  } catch (e) {
    return [`docs/catalog.json: ${e.message}`]
  }
  const groups = new Set((catalog.groups ?? []).map((g) => g.id))
  for (const group of catalog.groups ?? []) {
    for (const field of ['id', 'eyebrow', 'title', 'lead']) {
      if (typeof group[field] !== 'string' || !group[field].trim()) errors.push(`group ${group.id ?? '?'}: ${field} is required`)
    }
  }
  const packages = new Map(scanTap(root).map((p) => [key(p), p]))
  const seen = new Set()
  for (const entry of catalog.items ?? []) {
    const where = `entry ${entry.kind ?? '?'} ${entry.name ?? '?'}`
    for (const field of REQUIRED) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) errors.push(`${where}: ${field} is required`)
    }
    if (entry.kind && !KINDS[entry.kind]) errors.push(`${where}: kind must be ${Object.keys(KINDS).join(' or ')}`)
    if (entry.group && !groups.has(entry.group)) errors.push(`${where}: group ${entry.group} is not in groups`)
    if (entry.status && !STATUSES[entry.status]) errors.push(`${where}: status must be one of ${Object.keys(STATUSES).join(', ')}`)
    if (seen.has(key(entry))) errors.push(`${where}: listed twice`)
    seen.add(key(entry))
    for (const field of ['site', 'changelog']) {
      if (entry[field] !== undefined && !/^https:\/\/[^\s/]+\.[^\s/]+\/\S*$/.test(entry[field])) errors.push(`${where}: ${field} must be an https:// URL with a path, got ${entry[field]}`)
    }
    if (entry.changelog && !entry.changelog.includes('{version}')) errors.push(`${where}: changelog must contain {version}`)
    if (entry.local !== undefined && !/^http:\/\/[a-z0-9-]+\.localhost:\d+\/$/.test(entry.local)) errors.push(`${where}: local must look like http://<name>.localhost:<port>/`)
    if (entry.open !== undefined && (typeof entry.open !== 'string' || !entry.open.trim())) errors.push(`${where}: open must be the command that opens the service`)
    if (entry.open !== undefined && !entry.local) errors.push(`${where}: open needs local`)
    if (entry.upstream !== undefined && !/^[\w.-]+\/[\w.-]+$/.test(entry.upstream)) errors.push(`${where}: upstream must be owner/name`)
    if (entry.icon && !existsSync(join(root, 'docs/public', entry.icon))) errors.push(`${where}: icon docs/public/${entry.icon} does not exist`)
    const pkg = packages.get(key(entry))
    if (!pkg) {
      errors.push(`${where}: no ${KINDS[entry.kind] ?? '?'}/${entry.name}.rb in the tap; remove the entry or fix its name and kind`)
      continue
    }
    if (!pkg.version) errors.push(`${pkg.file}: no version`)
    if (!pkg.repository) errors.push(`${pkg.file}: no download from GitHub releases; the catalog links releases and repositories from that URL, so extend repository() in docs/catalog.mjs first`)
    if (entry.local && !pkg.service) errors.push(`${where}: local is set, but ${pkg.file} has no service block`)
    if (pkg.service && !entry.local) errors.push(`${where}: ${pkg.file} has a service block; set local to its address`)
  }
  for (const [k, pkg] of packages) {
    if (!seen.has(k)) errors.push(`${pkg.file}: not in docs/catalog.json; add an entry as AGENTS.md describes`)
  }
  return errors
}

// --- README ------------------------------------------------------------------

export const README_BEGIN = '<!-- catalog:begin (generated from docs/catalog.json: node .github/scripts/catalog.mjs readme --write) -->'
export const README_END = '<!-- catalog:end -->'

// The table of packages in README.md. It names no versions: they change with
// every release, and the README would then go stale between two of them.
export function readmeTable(root) {
  const { groups } = loadCatalog(root, { dates: false })
  const lines = []
  for (const group of groups) {
    if (!group.items.length) continue
    lines.push('', `### ${group.title}`, '', '| Package | What it is | Install |', '|:--------|:-----------|:--------|')
    for (const item of group.items) {
      const status = item.status === 'active' ? '' : ` <sup>${STATUSES[item.status].toLowerCase()}</sup>`
      lines.push(`| [${item.title}](${item.site})${status} | ${item.tagline} | \`${item.install}\` |`)
    }
  }
  return [README_BEGIN, ...lines, '', README_END].join('\n')
}

// README.md with its catalog block replaced; throws when the markers are missing.
export function renderReadme(root, text) {
  const begin = text.indexOf('<!-- catalog:begin')
  const end = text.indexOf(README_END)
  if (begin < 0 || end < begin) throw new Error(`README.md has no ${README_BEGIN} … ${README_END} block`)
  return text.slice(0, begin) + readmeTable(root) + text.slice(end + README_END.length)
}
