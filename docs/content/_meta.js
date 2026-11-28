export default {
  '*': { theme: { timestamp: false } },
  index: {
    title: 'Home', type: 'page', display: 'hidden',
    theme: { layout: 'full', sidebar: false, toc: false, breadcrumb: false, pagination: false, copyPage: false },
  },
  products: { title: 'Products', type: 'page', href: '/#products' },
  more: { title: 'Forks and earlier projects', type: 'page', href: '/#more' },
}
