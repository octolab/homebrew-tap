# octolab/tap catalog

The site of the tap at [brew.octolab.org](https://brew.octolab.org/): one page
with every package of the tap. Nextra 4 on Next.js, the stack shared with
octopot/indexit, octomation/maintainer, octomation/pulse and octopot/sushi.
How a package joins the catalog is in [AGENTS.md](../AGENTS.md#add-a-package).

## Run locally

Use Node 24 (the CI version). From the repository root:

```sh
./Taskfile docs npm ci
./Taskfile docs dev
```

Open the local URL printed by Next.js, normally <http://localhost:3000>.

## Build

For GitHub Pages:

```sh
TARGET=static SITE_URL=https://brew.octolab.org/ ./Taskfile docs build
```

Static output is written to `docs/dist/`. `SITE_URL` is required; add
`BASE_PATH=/homebrew-tap` only when hosting under a path, as on the default
`octolab.github.io/homebrew-tap/`. The [Pages workflow](../.github/workflows/cd.docs.yml)
supplies both: from the Pages configuration on main, from
`.github/settings.json` for PR previews.

The build reads `../Formula` and `../Casks`, and asks git for the date of the
last commit of each file; without the history (a shallow clone), the dates are
left out.

## Edit the content

| Location | Purpose |
| --- | --- |
| `catalog.json` | The entries of the catalog and its groups, written by hand |
| `catalog.mjs` | Joins the entries with the Formulae and Casks of the tap; checks them; renders the README block. No dependencies, shared with `.github/scripts/` |
| `content/index.mdx` | The page: its order of sections and the notes at the end |
| `content/_meta.js` | The navbar: anchors to the sections |
| `components/catalog.jsx` | The sections rendered from the catalog at build time: the first screen, the products, the local services, the rest |
| `components/shelf.jsx` | The terminal of the first screen: pick a product, see its commands |
| `components/copy.jsx` | A command with a button that copies it |
| `app/globals.css` | Shared layouts, kept identical to octopot/indexit |
| `app/brand.css` | The tokens of the tap: beer-mat paper, malt ink, burnt amber accent |
| `app/landing.css` | The page itself |
| `app/layout.jsx` | Site identity and Nextra theme |
| `app/[[...mdxPath]]/page.jsx` | Titles and social metadata |
| `public/` | Favicon, social preview and the icons of the entries in `icons/` |
| `scripts/og.html`, `scripts/og.mjs` | The source of `og.png` and its renderer |

The public origin in metadata comes from `SITE_URL` (see `site.mjs`).

## Social preview image

`public/og.png`, 1733×908 RGB, is the social preview of the page: the
`🍻 octolab/tap` wordmark, the slogan "Every OctoLab tool, one tap away." with
its second half in amber, the command `brew tap octolab/tap`, and a card for
each product of the `products` group. It names no versions, so a release does
not change it; a product that joins or leaves that group does. Edit the cards
in `scripts/og.html`, then render it with headless Chrome and a copy of
`playwright-core` the script can import:

```sh
PLAYWRIGHT_CORE=/path/to/playwright-core/index.js node scripts/og.mjs
```

`CHROME=/path/to/chrome` uses an installed browser instead of the one that
copy of playwright-core expects.

## Change the domain

The site is served from the custom domain `brew.octolab.org`;
`octolab.github.io/homebrew-tap/` redirects to it. The build bakes the domain
into asset paths and metadata, and changing it in Settings → Pages triggers no
rebuild. To change it:

1. Update `pages.cname` in [`.github/settings.json`](../.github/settings.json)
   (remove it for the default domain) and push.
2. Change Settings → Pages → Custom domain to match, and turn Enforce HTTPS on
   again once GitHub has issued the certificate.
3. Rebuild: `gh workflow run cd.docs.yml -f reason="domain change"`.

The build stops while the two disagree, the deployment is smoke-tested, and
`node .github/scripts/site.mjs doctor` reports a stale site.

## Dependencies

`package.json` and the lockfile follow octomation/pulse. It pins Zod to
`4.1.12` under `nextra-theme-docs` to avoid
[a validation regression](https://github.com/shuding/nextra/issues/5036).
Keep the exact Zod version: a caret range allows incompatible releases. Zod
before 4.6.6 has a memory exhaustion advisory (GHSA-mrhx-c7xc-m3w5); its
Dependabot alert is dismissed as a tolerable risk, since only the static
build validates the repository's own files, and Zod 4.6.6 still fails the
build with that regression. Once a Nextra release after 4.6.1 ships
[its fix](https://github.com/shuding/nextra/pull/4990), move the override to
`4.6.6` or later, or drop it, and check the static export.

Nextra 4.6.1 pins minimatch 10 (through `ts-morph`) and KaTeX 0.16 below
their advisories (GHSA-g3hv-75wg-m249, GHSA-238p-pmpm-9mq7); `overrides` in
`package.json` lift them to minimatch 11 and KaTeX 0.18, and override the
xmldom dependency of `speech-rule-engine@4.1.4` with `@xmldom/xmldom@^0.9.12`
for its security fixes. The site builds with all of them.
[`.github/self-control.md`](../.github/self-control.md) lists every override,
why it is there and when to drop it. Dependabot proposes npm updates of this
folder weekly, on Monday.

Search is disabled: static search indexing is not configured.
