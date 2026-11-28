import assert from 'node:assert/strict'
import { test } from 'node:test'
import { catalogErrors, expectedSite, pagesCheck, settingsCheck } from './site.mjs'

const pages = { cname: 'brew.octolab.org', https_enforced: true, build_type: 'workflow' }

test('the expected site follows the custom domain, or the default one', () => {
  assert.equal(expectedSite(pages, 'octolab/homebrew-tap'), 'https://brew.octolab.org/')
  assert.equal(expectedSite(null, 'OctoLab/homebrew-tap'), 'https://octolab.github.io/homebrew-tap/')
  assert.equal(expectedSite(null, 'octolab/octolab.github.io'), 'https://octolab.github.io/')
})

test('the Pages URL must match settings.json', () => {
  assert.deepEqual(pagesCheck('https://brew.octolab.org', pages, 'octolab/homebrew-tap'), [])
  assert.match(pagesCheck('https://octolab.github.io/homebrew-tap/', pages, 'octolab/homebrew-tap')[0], /expects https:\/\/brew\.octolab\.org\//)
  assert.match(pagesCheck('', pages, 'octolab/homebrew-tap')[0], /no Pages base URL/)
})

test('Pages settings: source, domain and HTTPS enforcement', () => {
  assert.deepEqual(settingsCheck({ ...pages }, pages, 'o/r'), [])
  const errors = settingsCheck({ build_type: 'legacy', cname: null, https_enforced: false }, pages, 'o/r')
  assert.equal(errors.length, 3)
  assert.match(errors[2], /HTTPS enforcement is off/)
  assert.deepEqual(settingsCheck({ build_type: 'legacy' }, null, 'o/r'), [])
})

test('each card must show its own package at the version of the tap', () => {
  const card = (token, version) => `<article class="product" data-package="${token}"><a>v${version}<span>x</span></a><code><span>$ </span>brew install --formula ${token}</code></article>`
  const items = [
    { token: 'octolab/tap/sushi', version: '0.3.1' },
    { token: 'octolab/tap/sparkle', version: '0.3.1' },
    { token: 'octolab/tap/tool', version: '1.2.3' },
  ]
  // sparkle shows v0.3.1, which must not cover a stale sushi card; v1.2.30 is not v1.2.3
  const html = card('octolab/tap/sushi', '0.3.0') + card('octolab/tap/sparkle', '0.3.1') + card('octolab/tap/tool', '1.2.30')
  const errors = catalogErrors(html, items, 'https://x/')
  assert.equal(errors.length, 2, errors.join('\n'))
  assert.match(errors[0], /octolab\/tap\/sushi is not shown at v0\.3\.1/)
  assert.match(errors[1], /octolab\/tap\/tool is not shown at v1\.2\.3/)
  assert.deepEqual(catalogErrors(card('octolab/tap/tool', '1.2.3'), items.slice(2), 'https://x/'), [])
  assert.match(catalogErrors('<p>octolab/tap/tool v1.2.3</p>', items.slice(2), 'https://x/')[0], /has no card/)
})
