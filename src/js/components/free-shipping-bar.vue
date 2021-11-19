<template lang="pug">
  section.free-shipping-progress-outer(
    v-if="(cartData.item_count && cartData.item_count >= 0) && enableFreeShippingBar && freeShippingMinimum !== false"
    :class="{ 'cart-page-free-shipping-progress-outer' : isCart }"
  )
    .free-shipping-progress
      h6(
        v-if="freeShippingMinimum <= computedCartTotal"
      ) You qualify for free shipping!
      h6(v-else)
        | You are&nbsp;
        strong {{ priceUntilFreeShipping | currency }}&nbsp;
        | away from free shipping.
      progress(:value="computedCartTotal" :max="freeShippingMinimum")
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import currency from '../helpers/_currency'
import geolocate from '../helpers/_geolocate'

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
      enableFreeShippingBar  : window.themeSettings.enableFreeShippingBar,
      freeShippingThresholds : window.themeSettings.freeShippingThresholds,
      geocode                : '',
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
    ]),

    ...mapGetters('cart', [
      'computedCartTotal',
    ]),

    priceUntilFreeShipping() {
      return this.freeShippingMinimum - this.computedCartTotal
    },

    freeShippingMinimum() {
      let threshold = this.freeShippingThresholds[this.geocode]
      if (!threshold && this.freeShippingThresholds.EU) {
        threshold = this.freeShippingThresholds.EU
      }

      if (threshold) return parseFloat(threshold) * 100 || false

      return ''
    },
  },

  async mounted() {
    this.geocode = await geolocate()
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
  border-bottom: 1px solid var(--shop-medium-gray);

  p strong {
    display: inline;
  }

  progress {
    appearance: none;
    width: 100%;
    height: 0.75em;
    border: 1px solid var(--shop-secondary-color);
    color: var(--shop-secondary-color);

    &::-webkit-progress-bar {
      background-color: var(--shop-white);
    }

    &::-webkit-progress-value {
      background-color: var(--shop-secondary-color);
    }

    &::-moz-progress-bar {
      background-color: var(--shop-secondary-color);
    }
  }
}

// Specific to cart page
.cart-page-free-shipping-progress-outer {
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
