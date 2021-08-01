// Imports
import Siema from 'siema'
import SimpleBar from 'simplebar'
import SiemaOverflow from './helpers/_siema-overflow'
import cart from './cart'
import product from './product'

// simplebar css
import 'simplebar/dist/simplebar.css'

// polyfills
import './helpers/polyfills'

// general sticky nav
import StickyNav from './_sticky-nav'

// lazyload img tags and background images
import 'lazysizes'
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks'
import 'lazysizes/plugins/rias/ls.rias'

// make simplebar globally available
window.SimpleBar = SimpleBar

// make Siema instances global
window.Siema = Siema
window.SiemaOverflow = SiemaOverflow

// import favicon
// require('../assets/favicon.png')

// Wrap everything in a DCL
document.addEventListener('DOMContentLoaded', () => {
  // Open non-internal links in new tab
  const { links } = document
  for (let i = 0, linksLength = links.length; i < linksLength; i += 1) {
    if (links[i].hostname !== window.location.hostname) {
      links[i].target = '_blank'
      links[i].rel = 'noreferrer noopener'
    }
  }

  // cart and product have to be loaded together because of vuex
  cart()
  product()

  new StickyNav()
})
