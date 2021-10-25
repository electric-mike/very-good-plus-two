import Vue from 'vue'
import { mapState } from 'vuex'
import store from './store/index'
import swatches from './helpers/_swatches'
import currency from './helpers/_currency'

export default function bundle() {
  // --------
  // BUNDLE PAGE
  // --------
  const bundleWrapper = document.getElementById('bundle-wrapper')
  if (bundleWrapper) {
    new Vue({
      el         : bundleWrapper,
      delimiters : ['${', '}'],
      filters    : { currency },
      mixins     : [swatches],
      store,
      data() {
        return {
          addingId        : false,
          goingToCheckout : false,
          errors          : {},
          discounts       : [
            {
              percent : 20,
              limit   : 3,
            },
            {
              percent : 30,
              limit   : 5,
            },
          ],
        }
      },

      computed: {
        ...mapState('cart', [
          'cartData',
        ]),

        productIdsInCart() {
          const prods = []
          if (this.cartData.items) {
            this.cartData.items.forEach((item) => {
              prods.push(item.id)
            })
          }

          return prods
        },

        productsInCart() {
          const prods = []
          if (this.cartData.items) {
            this.cartData.items.forEach((item) => {
              const productType = item.product_type.toLowerCase()

              if (
                productType === 'vinyl'
                || productType === 'lp'
                || item.title.toLowerCase().includes('vinyl')
                || item.title.toLowerCase().includes('lp')
              ) {
                prods.push(item)
              }
            })
          }

          return prods
        },

        productQtyInCart() {
          let qty = 0
          this.productsInCart.forEach((prod) => {
            qty += prod.quantity
          })

          return qty
        },

        hasMetDiscount() {
          return this.productQtyInCart >= this.discounts[0].limit
        },

        currentDiscount() {
          return this.discounts.slice().reverse().find((discount) => {
            if (this.productQtyInCart >= discount.limit) {
              return discount
            }

            return false
          })
        },
      },

      mounted() {
        this.$store.dispatch('cart/fetchCart')
      },

      methods: {
        async addBundleProductToCart(sentVariantId) {
          this.addingId = sentVariantId

          const response = await this.$store.dispatch('cart/addToCart', {
            quantity       : 1,
            id             : sentVariantId,
            dontOpenDrawer : true,
          })

          if (Object.prototype.hasOwnProperty.call(response, 'description')) {
            this.$set(this.errors, sentVariantId, response.description)
          } else {
            this.$set(this.errors, sentVariantId, false)
          }

          this.addingId = false
        },

        openCart(e) {
          e.preventDefault()
          this.$store.commit('cart/toggleSideCart')
        },
      },
    })
  }
}
