import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'
import './brand.css'
import './landing.css'
import { siteUrl } from '../site.mjs'

export const metadata = {
  title: { default: 'octolab/tap — Every OctoLab tool, one tap away.', template: '%s · octolab/tap' },
  description: 'The Homebrew tap of OctoLab: every package it holds, with the version it installs and a link to the project’s own site.',
  metadataBase: new URL(siteUrl),
  icons: { icon: `${process.env.BASE_PATH || ''}/icon.svg` },
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head color={{ hue: 26, saturation: 72, lightness: { light: 38, dark: 66 } }} backgroundColor={{ light: 'rgb(251, 248, 241)', dark: 'rgb(22, 19, 15)' }} />
      <body>
        <Layout
          navbar={<Navbar logo={<span className="wordmark"><span className="brand-emoji" aria-hidden="true">🍻</span>octolab/tap</span>} projectLink="https://github.com/octolab/homebrew-tap" />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/octolab/homebrew-tap/tree/main/docs"
          footer={<Footer><div className="site-footer"><span><b>octolab/tap</b> <span>Every OctoLab tool, one tap away.</span></span><span>MIT © {new Date().getFullYear()} <a href="https://github.com/octolab">OctoLab</a></span></div></Footer>}
          search={null}
          copyPageButton={false}
          feedback={{ content: 'Something wrong with a package?', link: 'https://github.com/octolab/homebrew-tap/issues/new' }}
          nextThemes={{ defaultTheme: 'system' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
