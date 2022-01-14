import Vue from 'vue'
import { mapState } from 'vuex'
import store from './store/index'
import StickyHeights from './_sticky-heights'

// components
import searchInput from './components/search-input'
import searchResults from './components/search-results'

document.addEventListener('DOMContentLoaded', () => {
  // set top level active links
  // const links = document.querySelectorAll('.top-level-link')
  // links.forEach((link) => {
  //   const childLinks = link.parentElement
  //     && !link.parentElement.classList.contains('top-level-links')
  //     && link.parentElement.querySelectorAll('.children-links-wrapper')
  //   let isInParentLink = false

  //   if (childLinks) {
  //     childLinks.forEach((childLink) => {
  //       if (childLink.href === window.location.href) {
  //         isInParentLink = true
  //       }
  //     })
  //   }

  //   if (
  //     isInParentLink
  //     || window.location.href.includes(link.href)
  //   ) {
  //     // make sure to remove any old actives
  //     // as this one is more relevant, and last on the list
  //     const ACTIVE_ITEM = document.querySelector('.link.top-level-link.active')
  //     if (ACTIVE_ITEM) {
  //       ACTIVE_ITEM.classList.remove('active')
  //     }

  //     link.classList.add('active')
  //   }
  // })

  // layered nav hover class functionality
  function toggleLayeredNavActive(sentPath, toggle) {
    sentPath.forEach((path) => {
      if (
        path.classList
        && path.classList.contains('layered-nav')
      ) {
        if (toggle) {
          path.classList.add('active')
        } else {
          path.classList.remove('active')
        }
      }
    })
  }

  function addHoverEventListeners(link) {
    link.addEventListener('mouseover', (event) => {
      // https://stackoverflow.com/questions/39245488/event-path-undefined-with-firefox-and-vue-js
      const path = event.path || (event.composedPath && event.composedPath()) || event.composedPath(event.target)
      toggleLayeredNavActive(path, true)
    }, { passive: true })

    link.addEventListener('mouseout', (event) => {
      // https://stackoverflow.com/questions/39245488/event-path-undefined-with-firefox-and-vue-js
      const path = event.path || (event.composedPath && event.composedPath()) || event.composedPath(event.target)
      toggleLayeredNavActive(path, false)
    }, { passive: true })
  }

  const layeredNavLink = document.querySelectorAll('#desktop-top-level-links .parent-links-wrapper > a')
  layeredNavLink.forEach((link) => {
    addHoverEventListeners(link)
  })

  const childrenLinksWrapper = document.querySelectorAll('#desktop-top-level-links .children-links-wrapper')
  childrenLinksWrapper.forEach((link) => {
    addHoverEventListeners(link)
  })

  const parentLinksWrapper = document.querySelector('.parent-links-wrapper')
  if (parentLinksWrapper) {
    const observer = new MutationObserver(() => {
      // have to wait to let the stuff above do its work before we check
      // kind of a shitty hack, but oh well
      setTimeout(() => {
        if (childrenLinksWrapper.classList && !childrenLinksWrapper.classList.contains('active')) {
          childrenLinksWrapper.style.height = 'auto'
        }
      }, 10)
    })

    observer.observe(parentLinksWrapper, {
      attributes : true,
      childList  : true,
    })
  }

  // mobile nav mini app
  const mobileNav = document.getElementById('mobile-nav')
  if (mobileNav) {
    new Vue({
      el         : mobileNav,
      components : {
        searchInput,
        searchResults,
      },

      store,

      data() {
        return {
          navOpen             : false,
          wasOpened           : false,
          navToggles          : {},
          navChildToggles     : {},
          stickyHeights       : new StickyHeights(),
          inputFocused        : false,
          mobileNavType       : window.themeSettings.mobileNavType || 'accordion',
          currentPaginatePage : 'home',
          lastPaginatePage    : '',
        }
      },

      computed: {
        ...mapState('cart', [
          'showSideCart',
        ]),

        ...mapState('search', [
          'searchResults',
        ]),
      },

      watch: {
        currentPaginatePage(newVal, oldVal) {
          this.lastPaginatePage = oldVal

          const drawer = document.querySelector('.drawer-wrapper')
          if (drawer) drawer.scrollTo(0, 0)
        },
      },

      mounted() {
        let currentWidth = window.outerWidth
        window.addEventListener('resize', ({ target }) => {
          // will need to change in header.scss as well
          if (target.outerWidth !== currentWidth) {
            this.toggleNav(true)
          }
          currentWidth = target.outerWidth
        }, { passive: true })

        window.addEventListener('hideMobileNav', () => { this.navOpen = false })
      },

      methods: {
        toggleNav(hide) {
          this.wasOpened = true

          if (hide) {
            this.navOpen = false
          } else {
            this.navOpen = !this.navOpen
          }

          if (this.navOpen) {
            document.body.classList.add('no-scroll')

            if (window.scrollY) {
              document.body.classList.add('sticky-active')
              document.querySelector('header').classList.add('sticky')
            }

            if (this.showSideCart) {
              this.$store.commit('cart/toggleSideCart')
            }
          } else {
            document.body.classList.remove('sticky-active')
            document.body.classList.remove('no-scroll')
          }
        },

        toggleMobileChildren(handle, childHandle) {
          // hide all children to start
          Object.keys(this.navChildToggles).forEach((toggle) => {
            if (toggle !== childHandle) {
              this.navChildToggles[toggle] = false
            }
          })

          if (!childHandle) {
            // hide all parent toggles to start
            Object.keys(this.navToggles).forEach((toggle) => {
              if (toggle !== handle) {
                this.navToggles[toggle] = false
              }
            })

            this.$set(this.navToggles, handle, !this.navToggles[handle])
          } else {
            this.$set(this.navChildToggles, childHandle, !this.navChildToggles[childHandle])
          }
        },

        toggleInputFocused() {
          this.inputFocused = true
        },
      },
    })
  }

  // desktop search
  const searchWrapper = document.getElementById('search-wrapper')
  let searchInputWrapper = document.getElementById('search-input-wrapper')
  let searchInputClose = null

  function toggleSearchBar(e) {
    if (e && e.target.id === 'search-wrapper' && searchInputWrapper.style.display !== 'flex') {
      searchInputWrapper.style.display = 'flex'
      searchInputWrapper.querySelector('input').focus()
      searchWrapper.classList.add('underline')
    } else {
      searchInputWrapper.style.display = 'none'
      searchWrapper.classList.remove('underline')
    }
  }

  if (searchInputWrapper) {
    new Vue({
      store,
      el         : searchInputWrapper,
      components : {
        searchInput,
        searchResults,
      },

      computed: {
        ...mapState('search', [
          'searchQuery',
        ]),
      },

      mounted() {
        searchInputWrapper = document.getElementById('search-input-wrapper')
        searchWrapper.addEventListener('click', toggleSearchBar.bind(event)) //eslint-disable-line
        // window.addEventListener('resize', toggleSearchBar) // hide on resize

        searchInputClose = document.getElementById('search-close')
        if (searchInputClose) {
          searchInputClose.addEventListener('click', toggleSearchBar.bind(event)) //eslint-disable-line
        }
      },

      methods: {
        toggleSearchBar,

        escapeClose() {
          this.$store.commit('search/setSearchQuery')
          this.$store.commit('search/setSearchResults')
          this.toggleSearchBar()
        },
      },
    })
  }
})
