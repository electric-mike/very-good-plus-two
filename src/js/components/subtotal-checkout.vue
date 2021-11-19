<template lang="pug">
  .subtotal-checkout(:class="{ 'cart-page-subtotal-checkout' : isCart }")
    .title-subtotal
      h4(v-if="isCart") Order Summary
      .subtotal
        h5.subtotal-text Subtotal:
        h5 &nbsp;{{ computedCartTotal | currency }}
      .promo-code(v-if="appliedPromoCode !== ''")
        h5.promo-text
          | Promo Code:
          | #[br]
          | #[span.applied-text Applied at checkout]
        strong &nbsp;{{ appliedPromoCode }}
    form.checkout-form(
      v-if="!hasSubscriptionProduct"
      action='/cart'
      method='post'
      novalidate=''
      @submit="goingToCheckout = true"
    )
      subtotal-payments(:is-cart="isCart")
      promo-code(v-if="isCart" :is-cart="isCart")
      button(
        type='submit'
        name='checkout'
        :class="{ 'loading': goingToCheckout, 'disabled': cartData.item_count <= 0 }"
      ) Checkout
    div(v-else)
      subtotal-payments(:is-cart="isCart")
      promo-code(v-if="isCart" :is-cart="isCart")
      cart-button
    .continue-shopping.center-text(v-if="isCart")
      a(v-if="isCart" href="/") Continue Shopping
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import cartButton from './cart-button'
import subtotalPayments from './subtotal-payments'
import promoCode from './promo-code'
import currency from '../helpers/_currency'

export default {
  components: {
    cartButton,
    subtotalPayments,
    promoCode,
  },

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
      themeSettings   : window.themeSettings,
      goingToCheckout : false,
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
      'appliedPromoCode',
    ]),

    ...mapGetters('cart', [
      'hasBundleProduct',
      'computedCartTotal',
    ]),

    hasSubscriptionProduct() {
      const hasSubscription = this.cartData.items && this.cartData.items.find(
        item => item.properties && item.properties.shipping_interval_frequency
      )

      if (hasSubscription) {
        return true
      }

      return false
    },
  },

  mounted() {
    // fix for safari dumbness
    // https://stackoverflow.com/questions/8788802/prevent-safari-loading-from-cache-when-back-button-is-clicked
    window.onpageshow = function fixGTCLoading(event) {
      if (event.persisted) {
        this.goingToCheckout = false
      }
    }.bind(this)
  },
}
</script>

<style lang="scss" scoped>
  @import '../../scss/variables.scss';

  .subtotal-checkout {
    border-top: 1px solid var(--shop-medium-gray);

    .title-subtotal {
      padding: 1.25em 1.25em 0;

      .subtotal, .promo-code {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .empty {
          a {
            text-align: center;
          }
        }

        p {
          font-size: 1.5em;
          margin-bottom: 1em;
        }

        .subtotal-text, .promo-text {
          display: inline-block;
          margin-bottom: 0;
        }

        .applied-text {
          font-size: 0.85em;
        }
      }

      .promo-code {
        margin-top: 0.5em;
      }

      .subtotal {
        h5, h6 {
          margin-bottom: 0;
        }
      }
    }

    button {
      margin: 1.25em;
      width: calc(100% - 2.5em);
    }
  }

  // Specific to cart page
  .cart-page-subtotal-checkout {
    border-top: none;

    @media(min-width: $desktop) {
      max-width: 425px;
      margin-right: 0;
      margin-left: auto;
    }

    .title-subtotal {
      background: var(--shop-light-gray);
      padding: 1em;
    }

    button {
      margin: 1.25em 0 0;
      width: 100%;
    }
  }

  .continue-shopping {
    margin-top: 1em;
  }
</style>
