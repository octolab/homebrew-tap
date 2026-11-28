// The sections of the page, rendered at build time from docs/catalog.json and
// the Formula and Cask files of the tap (see ../catalog.mjs).
import { resolve } from 'node:path'
import { loadCatalog, STATUSES, TAP } from '../catalog.mjs'
import { Command } from './copy'
import { Shelf } from './shelf'

const root = resolve(process.cwd(), '..')
const catalog = loadCatalog(root)
const base = process.env.BASE_PATH || ''

const date = (day) => day && new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const host = (url) => new URL(url).host + new URL(url).pathname.replace(/\/$/, '')
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

function platforms(item) {
  if (item.kind === 'cask') {
    const chip = item.arch.length === 1 && item.arch[0] === 'arm64' ? 'Apple Silicon' : item.arch.join(' and ')
    const macos = item.minimum ? `macOS ${item.minimum} or later` : 'macOS'
    return [chip, item.os.includes('Linux') ? `${macos} & Linux` : macos]
  }
  return [item.os.join(' & '), item.arch.join(' and ')]
}

function facts(item) {
  const what = [...(item.apps ?? []), ...item.binaries].join(', ')
  return [what, ...platforms(item)].filter(Boolean).join(' · ')
}

const upgrade = (item) => `brew upgrade --${item.kind} ${item.token}`
const siteLabel = (item) => item.site.startsWith('https://github.com/') ? 'Repository' : host(item.site)

export function Hero() {
  const products = catalog.groups.find((g) => g.id === 'products')?.items ?? []
  const latest = catalog.latest
  const shelf = products.map((item) => ({
    name: item.name,
    title: item.title,
    token: item.token,
    tagline: item.tagline,
    version: item.version,
    install: item.install,
    upgrade: upgrade(item),
    facts: facts(item),
    local: item.local ?? null,
    open: item.open ?? null,
    check: item.check,
    site: item.site,
    siteLabel: siteLabel(item),
    iconSrc: `${base}/${item.icon}`,
  }))
  return (
    <section className="hero">
      <div>
        {latest && (
          <a className="release-pill" href={latest.changelog ?? latest.release}>
            <span>{`Last release · ${latest.title} v${latest.version}`}</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
        <p className="eyebrow">THE HOMEBREW TAP OF OCTOLAB</p>
        <h1>Every OctoLab tool, <em>one&nbsp;tap away.</em></h1>
        <p className="hero-lead">
          {`${products.map((i) => i.title).join(', ').replace(/, ([^,]*)$/, ' and $1')}, and the earlier tools: installed and upgraded with Homebrew. `}
          Each card says what a package does, which version you get and where its own site lives.
        </p>
        <div className="hero-actions">
          <Command label="add the tap">{`brew tap ${TAP}`}</Command>
          <a className="button-text" href="#products">Browse the catalog<span aria-hidden="true">↓</span></a>
        </div>
        <p className="hero-note">
          {plural(catalog.counts.formula, 'formula', 'formulae')} · {plural(catalog.counts.cask, 'cask', 'casks')} · macOS &amp; Linux · free and open source
        </p>
      </div>
      <Shelf items={shelf} />
    </section>
  )
}

function Version({ item }) {
  const href = item.changelog ?? item.release
  const label = <>{`v${item.version}`}{item.prerelease && <span className="tag">prerelease</span>}</>
  return (
    <span className="version">
      {href ? <a href={href} title={item.changelog ? 'Release notes' : 'GitHub release'}>{label}</a> : label}
      {item.updated && <span className="version-date"> · {date(item.updated)}</span>}
    </span>
  )
}

function Icon({ item, size }) {
  return <img className="package-icon" src={`${base}/${item.icon}`} alt="" width={size} height={size} />
}

function ProductCard({ item }) {
  return (
    <article className="product" id={item.name} data-package={item.token}>
      <header className="product-head">
        <Icon item={item} size={44} />
        <div>
          <h3><a href={item.site}>{item.title}</a></h3>
          <Version item={item} />
        </div>
        <span className="kind">{item.kind}</span>
      </header>
      <p className="product-tagline">{item.tagline}</p>
      <p className="product-summary">{item.summary}</p>
      <ul className="facts" aria-label="Package facts">
        {facts(item).split(' · ').map((fact) => <li key={fact}>{fact}</li>)}
        {item.local && <li className="fact-service">{`macOS service :${new URL(item.local).port}`}</li>}
      </ul>
      <Command label={`install ${item.title}`}>{item.install}</Command>
      <nav className="product-links" aria-label={`${item.title} links`}>
        <a href={item.site}>{siteLabel(item)} <span aria-hidden="true">↗</span></a>
        {item.repositoryUrl && item.repositoryUrl !== item.site && <a href={item.repositoryUrl}>Repository</a>}
        {item.changelog && <a href={item.changelog}>Release notes</a>}
      </nav>
    </article>
  )
}

function Row({ item }) {
  const repository = item.repositoryUrl && item.repositoryUrl !== item.site ? item.repositoryUrl : null
  return (
    <article className="row" id={item.name} data-package={item.token}>
      <Icon item={item} size={32} />
      <div className="row-main">
        <h3>
          <a href={item.site}>{item.title}</a>
          <span className={`status status-${item.status}`}>{STATUSES[item.status]}</span>
        </h3>
        <p>{item.summary}</p>
        {(repository || item.upstream) && (
          <p className="row-links">
            {repository && <a href={repository}>Repository</a>}
            {item.upstream && <span>Fork of <a href={`https://github.com/${item.upstream}`}>{item.upstream}</a></span>}
          </p>
        )}
      </div>
      <div className="row-side">
        <Version item={item} />
        <Command className="command-small" label={`install ${item.title}`}>{item.install}</Command>
      </div>
    </article>
  )
}

function Heading({ group }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{group.eyebrow}</p>
      <h2>{group.title}</h2>
      <p className="section-lead">{group.lead}</p>
    </div>
  )
}

export function Products() {
  const group = catalog.groups.find((g) => g.id === 'products')
  if (!group?.items.length) return null
  return (
    <section className="catalog-section" id="products" aria-labelledby="products-title">
      <Heading group={{ ...group, title: <span id="products-title">{group.title}</span> }} />
      <div className="product-grid">
        {group.items.map((item) => <ProductCard key={item.token} item={item} />)}
      </div>
    </section>
  )
}

export function More() {
  const groups = catalog.groups.filter((g) => g.id !== 'products' && g.items.length)
  return groups.map((group) => (
    <section className="catalog-section" id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}>
      <Heading group={{ ...group, title: <span id={`${group.id}-title`}>{group.title}</span> }} />
      <div className="rows">
        {group.items.map((item) => <Row key={item.token} item={item} />)}
      </div>
    </section>
  ))
}

export function Services() {
  const services = catalog.items.filter((i) => i.local)
  if (!services.length) return null
  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="services-copy">
        <p className="eyebrow">LOCAL SERVICES</p>
        <h2 id="services-title">{services.length === 1 ? 'One of them keeps a page open on your Mac.' : `${['Two', 'Three', 'Four', 'Five', 'Six'][services.length - 2] ?? services.length} of them keep a page open on your Mac.`}</h2>
        <p>
          On macOS, <code>brew services</code> runs each of them as you, without root, and starts it again after a login.
          They listen on loopback only. Installing a package does not start its service.
        </p>
      </div>
      <ul className="service-list">
        {services.map((item) => (
          <li key={item.token}>
            <span className="service-name"><Icon item={item} size={22} />{item.title}</span>
            <Command label={`start the service of ${item.title}`}>{`brew services start ${item.token}`}</Command>
            {item.open
              ? <Command className="service-open" label={`open the service of ${item.title}`}>{item.open}</Command>
              : <a className="service-address" href={item.local}>{item.local.replace(/^http:\/\//, '').replace(/\/$/, '')}</a>}
          </li>
        ))}
      </ul>
    </section>
  )
}

// "Last change: <date>." when git knows the date, nothing otherwise.
export function Updated() {
  return catalog.updated ? <>{` Last change: ${date(catalog.updated)}.`}</> : null
}
