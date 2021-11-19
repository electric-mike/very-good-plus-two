<template lang="pug">
  .klarna-afterpay(:class="{ 'side-cart-payments': !isCart }")
    h6
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

  computed: {
    ...mapState('cart', [
      'cartData',
    ]),

    ...mapGetters('cart', [
      'computedCartTotal',
    ]),

    computedPaymentsPrice() {
      return parseFloat(this.$options.filters.currency(this.computedCartTotal).replace('$', '') / 4).toFixed(2)
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
