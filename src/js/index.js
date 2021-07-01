// Imports
import Vue from 'vue'
import Siema from 'siema'
import PortalVue from 'portal-vue'
import SiemaOverflow from './helpers/_siema-overflow'
import cart from './cart'
import homepage from './homepage'
import navigation from './navigation'
import product from './product'
import category from './category'
import cms from './cms'
import blog from './blog'
import account from './account'

// polyfills
import './helpers/polyfills'

// general sticky nav
import StickyNav from './_sticky-nav'

// lazyload img tags and background images
import 'lazysizes'
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks'
import 'lazysizes/plugins/rias/ls.rias'

// make Siema instances global
window.Siema = Siema
window.SiemaOverflow = SiemaOverflow

// import favicon
// require('../assets/favicon.png')

// plugins
Vue.use(PortalVue)

// global filters
Vue.filter('removeDashes', str => str.replace(/-/g, ' ').replace(/ca/g, 'CA'))
Vue.filter('currency', (str) => {
  // shopify API prices are stupid
  str = str ? str.toString() : '000'

  const decimalVal = str.substring(str.length - 2)
  const beforeDecimal = str.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace('.', '')

  return decimalVal !== '00' ? `$${beforeDecimal}.${decimalVal}` : `$${beforeDecimal}`
  // return `$${beforeDecimal}.${decimalVal}`
})

// Wrap everything in a DCL
document.addEventListener('DOMContentLoaded', () => {
  cart()
  homepage()
  navigation()
  product()
  category()
  cms()
  blog()
  account()

  // Open non-internal links in new tab
  const { links } = document
  for (let i = 0, linksLength = links.length; i < linksLength; i += 1) {
    if (links[i].hostname !== window.location.hostname) {
      links[i].target = '_blank'
      links[i].rel = 'noreferrer noopener'
    }
  }

  new StickyNav()
})
