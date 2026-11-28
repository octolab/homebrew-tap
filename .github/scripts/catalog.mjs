#!/usr/bin/env node
// The catalog of the tap, from the command line. Zero dependencies: Node and git.
//
//   catalog.mjs check              (offline: docs/catalog.json and the tap agree, README.md is current)
//   catalog.mjs readme [--write]   (prints the catalog block of README.md, or writes it)
//   catalog.mjs links              (online: every site, release note and repository answers)
//   catalog.mjs list               (the packages as the site shows them, one per line)
//
// Run it from anywhere inside the repository; it works on the repository root.

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { checkCatalog, loadCatalog, renderReadme } from '../../docs/catalog.mjs'

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()

export function readmeErrors(dir = root) {
  const path = join(dir, 'README.md')
  const text = readFileSync(path, 'utf8')
  let want
  try {
    want = renderReadme(dir, text)
  } catch (e) {
    return [e.message]
  }
  return want === text ? [] : ['README.md: the catalog block is out of date; run: node .github/scripts/catalog.mjs readme --write']
}

// GET, following redirects: some sites answer HEAD differently. One retry
// after a pause, so a single 429 or timeout does not fail the job.
async function answers(url) {
  let error = null
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 5000))
    try {
      const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'octolab-tap-catalog' } })
      await res.body?.cancel()
      if (res.ok) return null
      error = `HTTP ${res.status}`
    } catch (e) {
      error = e.cause?.code || e.message
    }
  }
  return error
}

// At most `limit` requests at a time, results in the order of `list`.
async function pool(list, limit, fn) {
  const out = new Array(list.length)
  let next = 0
  const worker = async () => { while (next < list.length) { const i = next++; out[i] = await fn(list[i]) } }
  await Promise.all(Array.from({ length: Math.min(limit, list.length) }, worker))
  return out
}

export function links(catalog) {
  const out = new Map()
  for (const item of catalog.items) {
    const add = (what, url) => { if (url && !out.has(url)) out.set(url, `${item.name} ${what}`) }
    add('site', item.site)
    add('release notes', item.changelog)
    add('release', item.release)
    add('repository', item.repositoryUrl)
    if (item.upstream) add('upstream', `https://github.com/${item.upstream}`)
  }
  return out
}

async function main(mode, rest) {
  const README = join(root, 'README.md')
  switch (mode) {
    case 'check': {
      const errors = [...checkCatalog(root), ...readmeErrors()]
      errors.forEach((e) => console.error(`catalog: ${e}`))
      if (!errors.length) console.log(`catalog: ${loadCatalog(root, { dates: false }).items.length} packages, all described`)
      process.exit(errors.length ? 1 : 0)
    }
    case 'readme': {
      const text = readFileSync(README, 'utf8')
      const next = renderReadme(root, text)
      if (rest.includes('--write')) {
        if (next !== text) writeFileSync(README, next)
        console.log(next === text ? 'README.md is current' : 'README.md updated')
      } else {
        process.stdout.write(next)
      }
      break
    }
    case 'links': {
      const urls = links(loadCatalog(root, { dates: false }))
      const results = await pool([...urls], 4, async ([url, what]) => [url, what, await answers(url)])
      for (const [url, what, error] of results) {
        if (error) console.error(`links: ${what} ${url}: ${error}`)
        else console.log(`links: ${what} ${url} ok`)
      }
      process.exit(results.some(([, , e]) => e) ? 1 : 0)
    }
    case 'list': {
      for (const item of loadCatalog(root).items) {
        console.log([item.kind, item.token, item.version, item.updated ?? '-', item.status, item.site].join('\t'))
      }
      break
    }
    default:
      console.error('usage: catalog.mjs check|readme [--write]|links|list')
      process.exit(2)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main(process.argv[2], process.argv.slice(3))
}
