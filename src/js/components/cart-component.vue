<template lang="pug">
.cart-content(:class="{ 'cart-page-content' : isCart }")
  div(v-if='fetchingCart')
    p(:class="{ 'fetching-cart' : !isCart }") Getting your cart..
  .products-wrapper(v-else-if='cartData.item_count && cartData.item_count >= 0')
    .products
      .product(v-for='(item, index) in cartData.items' :key='item.id')
        .product-image
          a(:href='productLink(item)' :aria-label='item.title')
            vue-image.product-image(
              :source='item.image'
              :width='200'
              :height='placeholderHeight'
              :alt='item.title'
            )
        .product-info
          .product-text
            h5.product-title.capitalize
              a(:href='productLink(item)') {{ item.product_title }}
            h6.product-variant(v-if='item.variant_title') {{ item.variant_title }}
            p.product-variant(
              v-if="item.selling_plan_allocation && item.selling_plan_allocation.selling_plan"
            ) {{ item.selling_plan_allocation.selling_plan.name }}
            .discounts(v-if="item.discounts.length > 0")
              h6.discount-text(
                v-for='(discount, j) in item.discounts'
                :key='j'
              ) {{ discount.title }}
          .product-modify
            quantity-input(
              v-model.number='item.quantity'
              v-bind:is-cart="true"
              @input='updateQuantity(index + 1, item.quantity)'
            )
        .product-quantity
          .product-total
            p.at-price(v-if="item.quantity > 1") {{ item.quantity }} x {{ item.price | currency }}
            h6.original-price(
              v-if='item.original_line_price !== item.line_price'
            ) {{ item.original_line_price | currency }}
            h6.price {{ item.line_price | currency }}
          .remove.hamburger.open.hover(@click='removeFromCart(index + 1)') #[.lines]
      upsell
  .fill-up(v-else)
    h3(v-if="isCart") {{ themeSettings.sideCartEmptyText }}
    h2(v-else) {{ themeSettings.sideCartEmptyText }}
    a.button(
      v-if="themeSettings.sideCartLinkCollection"
      :href="`/collections/${themeSettings.sideCartLinkCollection}`"
    ) {{ themeSettings.sideCartLinkText }}
</template>

<script>
import { mapState } from 'vuex'
import quantityInput from './quantity-input'
import vueImage from './vue-image'
import upsell from './upsell'
import currency from '../helpers/_currency'

export default {
  components: {
    quantityInput,
    vueImage,
    upsell,
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
    let placeholderHeight = this.height || 200
    const aspectRatio = window.themeSettings.placeholderImageAspectRatio || false

    if (aspectRatio && aspectRatio === '4:5') {
      placeholderHeight = 250
    }

    return {
      placeholderHeight,
      themeSettings: window.themeSettings,
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
      'fetchingCart',
    ]),
  },

  methods: {
    productLink(item) {
      if (item.properties && item.properties.shipping_interval_frequency) {
        return '#'
      }

      return item.url
    },

    removeFromCart(sentIndex) {
      this.$store.dispatch('cart/removeFromCart', sentIndex)
    },

    updateQuantity(sentIndex, sentQuantity) {
      this.$store.dispatch('cart/updateQuantity', {
        quantity : sentQuantity,
        line     : sentIndex,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.cart-content {
  padding: 1.25em 1.25em 0;

  .products {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0;

    .product {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
      border-bottom: 1px solid $medium-gray;
      padding: 1.25em 0;

      &:first-of-type {
        padding-top: 0;
      }

      &:last-of-type {
        border-bottom: 0;
      }

      .product-image {
        flex-basis: 20%;

        img {
          max-width: 100%;
          display: block;
        }
      }


      /deep/ .quantity-input {
        &, * {
          margin-bottom: 0;
        }
      }

      .remove {
        margin: 0;
        width: 17px;
        height: 19px;
      }

      .product-info {
        flex-basis: 37%;
        flex-grow: 1;
        padding: 0 1.25em;

        .product-title {
          margin: 0 0 0.35rem;
        }

        .product-variant {
          color: $dark-gray;
          margin: 0 0 0.75rem;
          margin-bottom: 0;

          &:last-of-type {
            margin-bottom: 1em;
          }
        }

        .discount-text {
          padding: 2px 10px;
          font-size: .75em;
          background: $gray;
          display: inline-block;
          border-radius: 10px;
          margin-bottom: 0.5em;
          color: $white;
          font-style: italic;
          text-align: center;
        }
      }

      .product-quantity {
        display: flex;
        flex-flow: column-reverse;
        align-items: flex-end;
        flex-basis: 15%;
        height: 100%;
        justify-content: space-between;

        input {
          max-width: 50px;
          margin: 0 auto;
        }

        p {
          white-space: nowrap;
          margin: 0 auto;
          text-align: center;
          font-size: 1.25em;
        }
      }

      .product-total {
        text-align: right;

        &, * {
          white-space: nowrap;
          margin-bottom: 0;
        }

        p {
          font-size: 1.25em;
          text-align: right;
        }

        .at-price {
          font-size: 0.75em;
          line-height: 1.5;
        }

        .original-price {
          color: $black;
          position: relative;
          display: inline-block;

          &:after {
            position: absolute;
            content: "";
            left: 0;
            top: 50%;
            right: 0;
            border-top: 1px solid;
            border-color: inherit;
          }
        }

        .original-price + .price {
          color: $red;
          display: inline-block;
          margin-left: 0.25em;
        }
      }
    }
  }

  .fill-up {
    display: flex;
    flex-flow: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    min-height: calc(100vh - 14em);
    padding-bottom: 1.25em;

    .button {
      border: 1px solid $primary-color;
    }
  }
}

// Specific to cart page
.cart-page-content {
  padding: 0 .625em 1.25em;

  .products {
    @media(min-width: $tablet) {
      max-width: $mobile;
    }
  }

  .fill-up {
    min-height: 300px;
    padding: 1.25em 0 2.25em 0 !important;

    @media(min-width: $tablet) {
      padding: 0 0 2.25em 0 !important;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
}
</style>
