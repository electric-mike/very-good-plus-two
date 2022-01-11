<template lang="pug">
  .klarna-afterpay(:class="{ 'side-cart-payments': !isCart }" v-if="themeSettings.showPaymentOptions")
    h6(v-if="themeSettings.showPaymentOptions")
      | or 4 payments of {{ computedPaymentsPrice | currency }} with
      | <i class="icon afterpay-icon" aria-label="Afterpay"></i>
      | or <i class="icon klarna-icon" aria-label="Klarna"></i>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import currency from '../helpers/_currency'

export default {
  filters: {
    currency,
  },

  props: {
    isCart: {
      type    : Boolean,
      default : false,
    },
  },

  data() {
    return {
      themeSettings: window.themeSettings,
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
    ]),

    ...mapGetters('cart', [
      'computedCartTotal',
    ]),

    computedPaymentsPrice() {
      return parseFloat(this.$options.filters.currency(this.computedCartTotal).replace('$', '').replace(/,/g, '') / 4).toFixed(2)
    },
  },
}
</script>

<style lang="scss">
.side-cart-payments {
  padding: 0 1.25em;

  > * {
    margin: 0;
  }
}
</style>
