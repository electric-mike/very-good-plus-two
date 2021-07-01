export default {
  namespaced: true,

  state() {
    const appliedPromoCode = window.localStorage.getItem('storedDiscount') || ''

    return {
      cartData     : {},
      cartError    : false,
      PdpError     : false,
      showSideCart : false,
      fetchingCart : true,
      addingToCart : false,
      updatingCart : false,
      appliedPromoCode,
      pageYOffset  : 0,
    }
  },

  mutations: {
    setCartData(state, sentCartData = {}) {
      state.cartData = sentCartData
    },

    setCartError(state, sentResponse = false) {
      state.cartError = sentResponse
    },

    setPdpError(state, sentResponse = false) {
      state.PdpError = sentResponse
    },

    setfetchingCart(state, fetching = false) {
      state.fetchingCart = fetching
    },

    toggleAddingToCart(state) {
      state.addingToCart = !state.addingToCart
    },

    toggleUpdatingCart(state) {
      state.updatingCart = !state.updatingCart
    },

    toggleSideCart(state) {
      state.showSideCart = !state.showSideCart

      if (state.showSideCart) {
        state.pageYOffset = window.pageYOffset
        document.body.classList.add('no-scroll')

        // for ios safari
        if (navigator.platform.match(/iPhone/)) {
          window.scrollTo(0, -100)
        }

        if (window.scrollY) {
          document.body.classList.add('sticky-active')
          document.querySelector('header').classList.add('sticky')
        }
      } else {
        window.scrollTo(0, state.pageYOffset)
        document.body.classList.remove('sticky-active')
        document.body.classList.remove('no-scroll')
      }
    },

    setAppliedPromoCode(state, sentPromoCode = '') {
      window.localStorage.setItem('storedDiscount', sentPromoCode)
      state.appliedPromoCode = sentPromoCode
    },
  },

  actions: {
    async fetchCart(store) {
      await fetch('/cart.js').then(res => res.json()).then((res) => {
        store.commit('setCartData', res)
        store.commit('setfetchingCart', false)
      })
    },

    addToCart(store, {
      quantity,
      id,
      upsell,
      selling_plan, //eslint-disable-line
    }) {
      store.commit('toggleAddingToCart')

      fetch('/cart/add.js', {
        method  : 'POST',
        headers : {
          'Content-Type'     : 'application/json',
          // https://community.shopify.com/c/Shopify-Design/AJAX-POST-cart-add-js-NEVER-returns-422-only-200-OK-on/td-p/375736
          'X-Requested-With' : 'XMLHttpRequest',
        },
        body: JSON.stringify({
          quantity,
          id,
          selling_plan,
        }),
      })
        .then(res => res.json())
        .then(async (res) => {
          if (!res.message) {
            await store.dispatch('fetchCart')
            store.commit('setPdpError')

            if (!upsell) {
              store.commit('toggleSideCart')
            }
          } else {
            store.commit('setPdpError', res)
          }

          store.commit('toggleAddingToCart')
        })
    },

    updateQuantity(store, { quantity, line }) {
      if (store.updatingCart) return

      store.commit('toggleUpdatingCart')

      fetch('/cart/change.js', {
        method  : 'POST',
        headers : {
          'Content-Type'     : 'application/json',
          'X-Requested-With' : 'XMLHttpRequest',
        },
        body: JSON.stringify({
          quantity,
          line,
        }),
      }).then(res => res.json()).then(async (res) => {
        if (!res.message) {
          store.commit('setCartData', res)
          store.commit('setCartError')
        } else {
          store.commit('setCartError', res)
          await store.dispatch('fetchCart')
        }

        store.commit('toggleUpdatingCart')
      })
    },

    removeFromCart(store, line) {
      if (store.updatingCart) return

      store.commit('toggleUpdatingCart')

      fetch('/cart/change.js', {
        method  : 'POST',
        headers : {
          'Content-Type'     : 'application/json',
          'X-Requested-With' : 'XMLHttpRequest',
        },
        body: JSON.stringify({
          quantity: 0,
          line,
        }),
      }).then(res => res.json()).then((res) => {
        if (!res.message) {
          store.commit('setCartData', res)
          store.commit('setCartError')
        } else {
          store.commit('setCartError', res)
        }

        store.commit('toggleUpdatingCart')
      })
    },

    emptyCart(store) {
      store.commit('toggleUpdatingCart')

      fetch('/cart/clear.js', {
        method: 'POST',
      }).then(res => res.json()).then((res) => {
        if (!res.message) {
          store.commit('setCartData', res)
          store.commit('setCartError')
        } else {
          store.commit('setCartError', res)
        }

        store.commit('toggleUpdatingCart')
      })
    },
  },
}
