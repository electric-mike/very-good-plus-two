export default {
  namespaced: true,

  state() {
    const appliedPromoCode = window.localStorage.getItem('storedDiscount') || ''
    const orderNote = window.localStorage.getItem('orderNote') || ''

    return {
      cartData     : {},
      cartError    : false,
      PdpError     : false,
      showSideCart : false,
      fetchingCart : true,
      addingToCart : false,
      updatingCart : false,
      appliedPromoCode,
      orderNote,
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

    setOrderNote(state, sentOrderNote = '') {
      window.localStorage.setItem('orderNote', sentOrderNote)
      state.orderNote = sentOrderNote
    },
  },

  actions: {
    async fetchCart(store) {
      await fetch('/cart.js').then(res => res.json()).then((res) => {
        if (window.bbProcessCart) {
          store.commit('setCartData', window.bbProcessCart(res))
        } else {
          store.commit('setCartData', res)
        }

        store.commit('setfetchingCart', false)
      })
    },

    async addToCart(store, {
      quantity,
      id,
      dontOpenDrawer,
      selling_plan, //eslint-disable-line
    }) {
      store.commit('toggleAddingToCart')

      return fetch('/cart/add.js', {
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

            if (!dontOpenDrawer) {
              store.commit('toggleSideCart')
            }
          } else {
            store.commit('setPdpError', res)
          }

          store.commit('toggleAddingToCart')

          return res
        })
    },

    updateQuantity(store, { quantity, line }) {
      if (store.state.updatingCart) return

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
          if (window.bbProcessCart) {
            store.commit('setCartData', window.bbProcessCart(res))
          } else {
            store.commit('setCartData', res)
          }

          store.commit('setCartError')
        } else {
          store.commit('setCartError', res)
          await store.dispatch('fetchCart')
        }

        store.commit('toggleUpdatingCart')
      })
    },

    removeFromCart(store, line) {
      if (store.state.updatingCart) return

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
          if (window.bbProcessCart) {
            store.commit('setCartData', window.bbProcessCart(res))
          } else {
            store.commit('setCartData', res)
          }

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
          if (window.bbProcessCart) {
            store.commit('setCartData', window.bbProcessCart(res))
          } else {
            store.commit('setCartData', res)
          }

          store.commit('setCartError')
        } else {
          store.commit('setCartError', res)
        }

        store.commit('toggleUpdatingCart')
      })
    },

    updateOrderNote(store) {
      store.commit('toggleUpdatingCart')

      fetch('/cart/update.js', {
        method  : 'POST',
        headers : {
          'Content-Type'     : 'application/json',
          'X-Requested-With' : 'XMLHttpRequest',
        },
        body: JSON.stringify({ note: store.state.orderNote }),
      }).then(res => res.json()).then((res) => {
        if (!res.message) {
          if (window.bbProcessCart) {
            store.commit('setCartData', window.bbProcessCart(res))
          } else {
            store.commit('setCartData', res)
          }

          store.commit('setCartError')
        } else {
          store.commit('setCartError', res)
        }

        store.commit('toggleUpdatingCart')
      })
    },

    applyPromoCode(store) {
      store.commit('toggleUpdatingCart')

      fetch('/cart/update.js', {
        method  : 'POST',
        headers : {
          'Content-Type'     : 'application/json',
          'X-Requested-With' : 'XMLHttpRequest',
        },
        body: JSON.stringify({ discount: store.state.appliedPromoCode }),
      }).then(res => res.json()).then((res) => {
        if (!res.message) {
          if (window.bbProcessCart) {
            store.commit('setCartData', window.bbProcessCart(res))
          } else {
            store.commit('setCartData', res)
          }

          store.commit('setCartError')
        } else {
          store.commit('setCartError', res)
        }

        store.commit('toggleUpdatingCart')
      })
    },
  },

  getters: {
    hasBundleProduct(state) {
      return state.cartData
      && state.cartData.items
      && state.cartData.items.length > 0 ? !!state.cartData.items.find(
          item => item.properties && Object.prototype.hasOwnProperty.call(item.properties, '_bundle_price')
        ) : false
    },

    computedCartTotal(state, getters) {
      if (getters.hasBundleProduct) {
        let iteratedTotal = 0
        state.cartData.items.forEach((item) => {
          if (item.properties && Object.prototype.hasOwnProperty.call(item.properties, '_bundle_price')) {
            iteratedTotal += item.properties._bundle_price * item.quantity
          } else {
            iteratedTotal += item.price * item.quantity
          }
        })

        return iteratedTotal
      }

      return state.cartData && state.cartData.total_price
    },
  },
}
