<template lang="pug">
  section.free-shipping-progress-outer(
    v-if="(cartData.item_count && cartData.item_count >= 0) && enableFreeShippingBar"
    :class="{ 'cart-page-free-shipping-progress-outer' : isCart }"
  )
    .free-shipping-progress
      h6(
        v-if="freeShippingMinimum <= cartTotal"
      ) You qualify for free shipping!
      h6(v-else)
        | You are&nbsp;
        strong {{ priceUntilFreeShipping | currency }}&nbsp;
        | away from free shipping.
      progress(:value="cartTotal" :max="freeShippingMinimum")
</template>

<script>
import { mapState } from 'vuex'
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
      enableFreeShippingBar : window.themeSettings.enableFreeShippingBar,
      freeShippingMinimum   : parseFloat(window.themeSettings.freeShippingThreshold) * 100 || 7500,
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
    ]),

    cartTotal() {
      return this.cartData.total_price
    },

    priceUntilFreeShipping() {
      return this.freeShippingMinimum - this.cartTotal
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.free-shipping-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-direction: column;
  align-self: center;
  width: 100%;
  padding: 1.25em;
  border-bottom: 1px solid $medium-gray;

  p strong {
    display: inline;
  }

  progress {
    appearance: none;
    width: 100%;
    height: 0.75em;
    border: 1px solid $secondary-color;
    color: $secondary-color;

    &::-webkit-progress-bar {
      background-color: $white;
    }

    &::-webkit-progress-value {
      background-color: $secondary-color;
    }

    &::-moz-progress-bar {
      background-color: $secondary-color;
    }
  }
}

// Specific to cart page
.cart-page-free-shipping-progress-outer {
  @media(min-width: $tablet) {
    padding-left: 1em;
  }

  @media(min-width: $desktop) {
    max-width: 425px;
    margin-right: 0;
    margin-left: auto;
  }

  .free-shipping-progress {
    padding: 0 0 1.25em 0;
    margin-bottom: 1.25em;
  }
}
</style>
