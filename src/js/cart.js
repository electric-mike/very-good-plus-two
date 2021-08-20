import Vue from 'vue'
import { mapState } from 'vuex'
import store from './store/index'
import cartComponent from './components/cart-component'
import sideCart from './components/side-cart'
import subtotalCheckout from './components/subtotal-checkout'
import cartButton from './components/cart-button'
import freeShippingBar from './components/free-shipping-bar'

export default function cart() {
  // cart icon
  const cartEl = document.getElementById('cart')
  if (cartEl) {
    new Vue({
      store,
      el         : cartEl,
      delimiters : ['${', '}'],

      components: {
        sideCart,
      },

      data() {
        return {
          cartChanged: false,
        }
      },

      computed: {
        cartSize() {
          return this.cartData && this.cartData.item_count
        },

        isCartPage() {
          return window.location.href.includes('cart')
        },

        ...mapState('cart', [
          'cartData',
          'cartError',
          'showSideCart',
        ]),
      },

      watch: {
        cartSize(next, prev) {
          if (!prev && prev !== 0) return

          this.$nextTick(() => {
            this.cartChanged = true

            setTimeout(() => {
              this.cartChanged = false
            }, 500)
          })
        },
      },

      mounted() {
        this.$store.dispatch('cart/fetchCart')
      },

      methods: {
        openCart(e) {
          e.preventDefault()
          e.stopPropagation()

          if (!this.isCartPage) {
            this.$store.commit('cart/toggleSideCart')
          }

          if (this.showSideCart) {
            const event = new Event('hideMobileNav')
            window.dispatchEvent(event)
          }
        },
      },
    })
  }

  // cart page
  const cartPage = document.getElementById('cart-page')
  if (cartPage) {
    new Vue({
      store,
      el         : cartPage,
      delimiters : ['${', '}'],
      components : {
        cart: cartComponent,
        subtotalCheckout,
        cartButton,
        freeShippingBar,
      },

      computed: {
        ...mapState('cart', [
          'cartData',
        ]),
      },
    })
  }
}
