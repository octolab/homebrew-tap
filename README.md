[![🍻 Homebrew][social.preview]][preview.config]

# 🍻 Homebrew

OctoLab's [Homebrew tap](https://docs.brew.sh/Taps) listing the products
that can be installed using [Homebrew](https://brew.sh/).
<!-- 🍻 Homebrew tap to install OctoLab products. -->

## 🧩 Installation

```bash
brew tap octolab/tap
brew install --formula octolab/tap/<name>   # a command line or a local service
brew install --cask octolab/tap/<name>      # a macOS app
```

Always name the tap: some names here also belong to packages of Homebrew
itself, such as `golangci-lint`. Formulae support macOS and Linux on arm64 and
x86_64; a cask states its own requirements.

As an alternative, you can use [Shell scripts](https://install.octolab.org/) for installation.

## 📦 Catalog

The catalog lives at **[brew.octolab.org](https://brew.octolab.org/)**: what
each package does, the version the tap installs and a link to the project's
own site. Releases update the Formulae and the Cask here, and the site follows
them. How to add a package to the catalog is in [AGENTS.md](AGENTS.md).

<!-- catalog:begin (generated from docs/catalog.json: node .github/scripts/catalog.mjs readme --write) -->

### Tools in active development, each with its own site.

| Package | What it is | Install |
|:--------|:-----------|:--------|
| [maintainer](https://maintainer.octolab.org/) | See all of your open source. Move it every day. | `brew install --formula octolab/tap/maintainer` |
| [indexit](https://indexit.octolab.org/) | Your Telegram. Your data. | `brew install --formula octolab/tap/indexit` |
| [pulse](https://pulse.octolab.org/) | Your morning, with a hand on the pulse. | `brew install --formula octolab/tap/pulse` |
| [Sushi](https://sushi.octolab.org/) | The prompt deserves an editor. | `brew install --cask octolab/tap/sushi` |

### Still installable, no longer in active development.

| Package | What it is | Install |
|:--------|:-----------|:--------|
| [go-service](https://go-service.octolab.org/) <sup>template</sup> | Template for a typical service written in Go. | `brew install --formula octolab/tap/service` |
| [sparkle](https://github.com/withsparkle/service) <sup>earlier project</sup> | A personal development framework and knowledge platform. | `brew install --formula octolab/tap/sparkle` |
| [godownloader](https://github.com/kamilsk/godownloader) <sup>fork</sup> | Install scripts from a GoReleaser config. | `brew install --formula octolab/tap/godownloader` |
| [goimports](https://github.com/kamilsk/go-tools) <sup>fork</sup> | Go imports, fixed and formatted. | `brew install --formula octolab/tap/goimports` |
| [golangci-lint](https://github.com/kamilsk/golangci-lint) <sup>fork</sup> | Fast linters runner for Go, with looppointer. | `brew install --formula octolab/tap/golangci-lint` |

<!-- catalog:end -->


<p align="right">made with ❤️ for everyone by <a href="https://www.octolab.org/">OctoLab</a></p>

[social.preview]:   https://cdn.octolab.org/repo/homebrew-tap.png
[preview.config]:   https://socialify.git.ci/octolab/homebrew-tap?description=1&font=Raleway&language=1&name=1&owner=1&pattern=Circuit%20Board&theme=Light
[preview.fallback]: https://socialify.git.ci/octolab/homebrew-tap/image?description=1&font=Raleway&language=1&name=1&owner=1&pattern=Circuit%20Board&theme=Light
