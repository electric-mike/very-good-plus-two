<template lang="pug">
  button#checkout-button(
    @click="goToCartOrCheckout()"
    :class="{ 'loading': loading, 'disabled': cartData.item_count <= 0 }"
  ) Checkout#[span(v-if="showPrice") &nbsp;- {{ computedCartTotal | currency }}]
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import currency from '../helpers/_currency'

export default {

  filters: {
    currency,
  },
  props: {
    showPrice: {
      type    : Boolean,
      default : false,
    },
  },

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
    ]),

    ...mapGetters('cart', [
      'computedCartTotal',
    ]),
  },

  methods: {
    goToCartOrCheckout() {
      const checkoutFormButton = document.querySelector('.cart-page-subtotal-checkout .checkout-form button')

      if (window.location.pathname.includes('/cart')) {
        if (checkoutFormButton) {
          checkoutFormButton.click()
        }
      } else {
        window.location.pathname = '/cart'
      }

      this.loading = true
    },
  },
}
</script>
