# Agent guide

This repository is the Homebrew tap `octolab/tap` and the catalog of what it
holds, published at [brew.octolab.org](https://brew.octolab.org/). The catalog
is one page: what each package does, the version the tap installs, and links
to the project's own site, its release notes and its repository.

## What writes what

| Path | Written by | Notes |
| --- | --- | --- |
| `Formula/*.rb`, `Casks/*.rb` | the release workflow of each project | GoReleaser or the project's own script, with a token of the GitHub App "OctoLab Releaser". Never edit them by hand: the next release overwrites them |
| `cask_renames.json` | by hand | Homebrew's record of renamed Casks, such as `susi` → `sushi` |
| `docs/catalog.json` | by hand | One entry per package: how the catalog presents it. Changes only when a package joins, leaves or is described anew |
| `docs/public/icons/` | by hand | The icon of each entry |
| `README.md` | by hand, except its catalog block | The block between `<!-- catalog:begin … -->` and `<!-- catalog:end -->` is generated from `docs/catalog.json` |
| `docs/` | by hand | The Nextra site; see [docs/README.md](docs/README.md) |
| `.github/scripts/` | by hand | `catalog.mjs` checks the catalog and writes the README block; `site.mjs` checks Pages and the deployed site |

The version, the platforms, the binaries, the app of a Cask, the service and
the date of the last update are **not** in `docs/catalog.json`: the site reads
them from the Formula or the Cask at build time, and the date from the last
commit that changed the file. A release that rewrites a Formula or a Cask
pushes to `main`, which runs [cd.docs](.github/workflows/cd.docs.yml) and
rebuilds the site. A new version therefore needs nothing here; a new package
does.

## Add a package

For now a package joins the catalog by hand. Its Formula or Cask arrives first,
with the first stable release of the project; the entry follows it.

1. **Notice it.** `node .github/scripts/catalog.mjs check` fails with
   `Formula/<name>.rb: not in docs/catalog.json`. The same check stops
   `cd.docs` on the push of the release, so the site stays as it was and the
   failure is notified until the entry is added. Nothing else breaks: the
   package installs from the tap already.
2. **Read the project.** Take the facts from the project's own site and its
   `AGENTS.md`, not from memory: the slogan, a one-line description, the
   address of a local service, the URL pattern of its release notes. Open each
   URL you are going to write.
3. **Add the icon** to `docs/public/icons/<name>.svg`: the project's own
   `docs/public/icon.svg` when it has a site, otherwise an emoji from
   [Noto Emoji](https://github.com/googlefonts/noto-emoji) (`2D/svg/emoji_u<codepoint>.svg`),
   without its XML prolog and generator comment, with an attribution comment
   right after the `<svg>` tag, as the other icons have. An icon may be shared
   by several entries, as `wrench.svg` is.
4. **Add the entry** to `items` in `docs/catalog.json`. The order of `items`
   is the order on the page and in the README: products first, by how much
   they are used, then the rest. Fields:

   | Field | Required | Meaning |
   | --- | --- | --- |
   | `name` | yes | The file name without `.rb`: the token in `octolab/tap/<name>` |
   | `kind` | yes | `formula` for `Formula/`, `cask` for `Casks/` |
   | `group` | yes | The `id` of a group in `groups`: `products` for a project in active development with its own site, `more` for forks, templates and earlier projects |
   | `icon` | yes | The path under `docs/public/`, e.g. `icons/pulse.svg` |
   | `title` | yes | The name as the project writes it, e.g. `Sushi` |
   | `tagline` | yes | The project's own slogan, one short sentence ending with a period |
   | `summary` | yes | One or two sentences on what the user gets, in user terms |
   | `site` | yes | The project's site, `https://` with a trailing slash; the repository when there is no site that answers |
   | `status` | yes | `active`, `template`, `legacy` (an earlier project), `fork`, `archived` (an archived fork) |
   | `changelog` | no | The URL of a release note with `{version}` in place of the version without `v`, e.g. `https://pulse.octolab.org/changelog/v{version}/`; without it, the version links to the GitHub release |
   | `local` | when the Formula has a `service` block | The address of the service, `http://<name>.localhost:<port>/`. The ports are in the `AGENTS.md` of octomation/pulse: 17840 indexit, 17841 maintainer, 17842 pulse |
   | `open` | when the plain address shows no data | The command that opens the service instead of a link, e.g. `maintainer service open`: maintainer serves its data only at an address with a random label |
   | `upstream` | for a fork | `owner/name` of the original repository |

   Write in English, as the project's site does; no promises of unreleased
   behavior, no development history.
5. **Regenerate and check**, from the repository root:

   ```sh
   node .github/scripts/catalog.mjs readme --write
   node .github/scripts/catalog.mjs check
   node .github/scripts/catalog.mjs links
   node --test .github/scripts/*.test.mjs
   ```

   `links` asks every site, release note and repository of the catalog over
   the network; the others are offline.
6. **Look at it.** Run the site and open it, in light and dark, on a wide
   and a narrow screen. The catalog is read once when the server starts:
   restart `docs dev` after you change `docs/catalog.json` or a Formula.

   ```sh
   ./Taskfile docs npm ci
   ./Taskfile docs dev
   ```

   `catalog.mjs check` also stops on a download outside GitHub releases,
   which the parser of `docs/catalog.mjs` cannot link yet: extend it first,
   with a test in `.github/scripts/catalog.test.mjs`. A Cask that needs a
   macOS release missing from the `MACOS` table shows the release by name
   ("macOS Golden Gate or later") until its number is added there.

7. **A new product** also goes on the social preview: `docs/scripts/og.html`
   shows the products of the `products` group by hand. Add or replace its
   card, render `docs/public/og.png` again (see
   [docs/README.md](docs/README.md#social-preview-image)) and look at the result.
   The other texts of the page name no package by hand: the first screen
   lists the products from the catalog, and the descriptions in
   `docs/content/index.mdx` and `docs/app/layout.jsx` stay general. Keep them
   so.
8. **Hand it over.** The maintainer commits: stage the change and give one
   message, `docs(catalog): add <name>`.

## Change or remove a package

- **A new description, a new site:** change the entry, then steps 5, 6 and 8
  (`docs(catalog): update <name>`).
- **A product stops being developed:** move it to the group `more`, set its
  `status`, and take it off `og.html`. `archived` is for a repository that
  GitHub shows as archived; a fork whose description only says so stays
  `fork`, and its summary says what the description says.
- **A renamed package:** the project's release writes the new file; record
  the old name in `cask_renames.json` or `formula_renames.json` for Homebrew,
  rename the entry and its icon, and delete the old file in the same commit.
- **A removed package:** delete its file, its entry and an icon nobody else
  uses, in one commit. Homebrew users keep what they installed;
  `tap_migrations.json` can point them elsewhere.

## After a release of a project

Nothing to do by hand. The release pushes its Formula or Cask, `cd.docs`
rebuilds the site, and its smoke test fails while the card of the package
does not show the version of the tap. If no run follows the release, the
workflow is off: `gh workflow enable cd.docs.yml -R octolab/homebrew-tap`,
then `gh workflow run cd.docs.yml -f reason="catch up"`. To check:

```sh
gh run list -R octolab/homebrew-tap -w cd.docs.yml -L 1
node .github/scripts/site.mjs doctor
```

## Pages and HTTPS

The site is served from the custom domain `brew.octolab.org` by GitHub Pages,
built by GitHub Actions, with Enforce HTTPS on. `.github/settings.json`
declares all three; `cd.docs` refuses to build for another domain, checks the
settings on GitHub before every deployment and, after it, checks that
`http://brew.octolab.org/` redirects to `https://` and that
`octolab.github.io/homebrew-tap/` redirects to the domain. `site.mjs doctor`
runs the same checks locally and lists the workflows that are off, with the
ones `.github/settings.json` keeps off on purpose. How to change the domain is
in [docs/README.md](docs/README.md#change-the-domain); the workflows are
described in [.github/workflows/README.md](.github/workflows/README.md).

## Ground rules

- The agent prepares a change in full and hands over its commit message; the
  maintainer reviews, commits and pushes.
- Facts on the page come from the tap or from the project's site; a claim
  that neither supports does not go on the page.
- Dependencies of the site follow octomation/pulse and octopot/indexit; see
  [docs/README.md](docs/README.md#dependencies).
