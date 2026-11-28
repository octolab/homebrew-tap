'use client'

import { useState } from 'react'
import { Command } from './copy'

// The terminal of the first screen: pick a product, see the commands that
// install it, start its service and check the version. Nothing here runs;
// the versions are those of the tap when the site was built.
export function Shelf({ items }) {
  const [current, setCurrent] = useState(0)
  const item = items[current]
  const pick = (event, index) => {
    setCurrent(index)
    event.currentTarget.focus()
  }
  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    const jump = { Home: 0, End: items.length - 1 }[event.key]
    if (step === undefined && jump === undefined) return
    event.preventDefault()
    const next = jump ?? (current + step + items.length) % items.length
    setCurrent(next)
    event.currentTarget.parentElement.children[next]?.focus()
  }
  return (
    <div className="shelf">
      <div className="shelf-tabs" role="tablist" aria-label="Products of the tap">
        {items.map((it, index) => (
          <button
            key={it.name}
            type="button"
            role="tab"
            id={`shelf-tab-${it.name}`}
            aria-selected={index === current}
            aria-controls="shelf-panel"
            tabIndex={index === current ? 0 : -1}
            onClick={(event) => pick(event, index)}
            onKeyDown={onKeyDown}
          >
            <img src={it.iconSrc} alt="" width="18" height="18" />
            <span>{it.title}</span>
          </button>
        ))}
      </div>
      <div className="terminal" role="tabpanel" id="shelf-panel" aria-labelledby={`shelf-tab-${item.name}`}>
        <div className="terminal-bar">
          <span><span className="terminal-dots" aria-hidden="true">●●●</span> zsh — {item.token}</span>
          <span className="terminal-version">{`v${item.version}`}</span>
        </div>
        <div className="terminal-body">
          <p className="terminal-comment"># {item.tagline}</p>
          <Command label={`install ${item.title}`}>{item.install}</Command>
          <p className="terminal-comment"># {item.facts}</p>
          {item.local && (
            <>
              <p className="terminal-comment"># on macOS, keep its service running</p>
              <Command label={`start the service of ${item.title}`}>{`brew services start ${item.token}`}</Command>
              {item.open
                ? <Command label={`open the service of ${item.title}`}>{item.open}</Command>
                : <p className="terminal-comment"># then open <a href={item.local}>{item.local.replace(/^http:\/\//, '').replace(/\/$/, '')}</a></p>}
            </>
          )}
          {item.check && <Command label={`check the version of ${item.title}`}>{item.check}</Command>}
        </div>
        <div className="terminal-caption">
          <span>Later: <code>{item.upgrade}</code></span>
          <a href={item.site}>{item.siteLabel} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </div>
  )
}
