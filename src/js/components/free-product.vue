<template lang="pug">
  .free-product(
    v-if="(cartData.item_count && cartData.item_count >= 0)\
    && enableFreeProduct && freeProductMinimum !== false\
    && computedFreeProduct"
    :class="{ 'is-cart' : isCart }"
  )
    .product(v-if="computedFreeProduct")
      .product-image
        a(:href='"/products/" + computedFreeProduct.handle')
          vue-image.product-image(
            :source='computedImage'
            :width='200'
            :height='placeholderHeight'
            :alt='computedFreeProduct.title'
          )
      .product-info
        h6.product-title(
          v-if="freeProductMinimum <= computedCartTotal"
        ) You qualify for a free product!
        h6.product-title(v-else)
          | You are&nbsp;
          strong {{ priceUntilFreeProduct | currency }}&nbsp;
          | away from a free product.
        .product-text
          h6.product-title #[a(:href='"/products/" + computedFreeProduct.handle') {{ computedFreeProduct.title }}]
          //- h6.price {{ formatMoney(selectedVariant.price) }}
          //-   span(v-if='selectedVariant.title') &nbsp;({{ selectedVariant.title }})&nbsp;
          .product-modify
            select.hover(
              v-model='selectedVariant'
              v-if='computedFreeProduct.variants && computedFreeProduct.variants.length > 1'
            )
              option(
                v-for='(variant, i) in computedFreeProduct.variants'
                :key='variant.id'
                :value='variant'
                :disabled="!variant.available"
              ) {{ variant.title }}
            button(
              @click='addToCart'
              v-bind:class="{ 'loading': addingToCart }"
              v-if='freeProductMinimum <= computedCartTotal'
            ) ADD +

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import vueImage from './vue-image'
import formatMoney from '../helpers/_format-money'
import currency from '../helpers/_currency'
import geolocate from '../helpers/_geolocate'

export default {
  filters: {
    currency,
  },

  components: {
    vueImage,
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
      selectedVariant      : false,
      freeProductInCart    : false,
      enableFreeProduct    : window.themeSettings.enableFreeProduct,
      freeProduct          : window.themeSettings.freeProduct,
      freeProductThreshold : window.themeSettings.freeProductThreshold,
      geocode              : '',
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
      'fetchingCart',
      'addingToCart',
    ]),

    ...mapGetters('cart', [
      'computedCartTotal',
    ]),

    priceUntilFreeProduct() {
      return this.freeProductMinimum - this.computedCartTotal
    },

    freeProductMinimum() {
      const threshold = this.freeProductThreshold
      if (threshold) return parseFloat(threshold) * 100 || false

      return ''
    },

    computedFreeProduct() {
      if (
        !this.freeProductInCart
        && Object.keys(this.freeProduct).indexOf('error') <= -1
      ) return this.freeProduct

      return false
    },

    computedImage() {
      if (
        this.selectedVariant
        && this.selectedVariant.featured_image
        && this.selectedVariant.featured_image.src
        && !this.selectedVariant.featured_image.src.includes('no_image')
      ) {
        return this.selectedVariant.featured_image.src
      }

      return this.computedFreeProduct.featured_image
    },
  },

  watch: {
    cartData() {
      this.checkFreeProductInCart()
    },
  },

  async mounted() {
    this.geocode = await geolocate()

    this.checkFreeProductInCart()
  },

  methods: {
    formatMoney,

    checkFreeProductInCart() {
      this.freeProductInCart = false

      if (this.cartData.items.length > 0) {
        this.cartData.items.forEach((item) => {
          if (this.freeProduct.id === item.id) {
            this.freeProductInCart = true
          }

          if (this.computedFreeProduct) {
            this.computedFreeProduct.variants.forEach((variant) => {
              if (item.id === variant.id) {
                this.freeProductInCart = true
              }
            })
          }
        })
      }

      this.selectDefaultVariant()
    },

    selectDefaultVariant() {
      if (this.computedFreeProduct && this.computedFreeProduct.variants.length > 0) {
        this.selectedVariant = this.computedFreeProduct.variants.find((variant) => {
          if (variant.available) {
            return variant
          }

          return false
        })
      }
    },

    addToCart() {
      this.$store.dispatch('cart/addToCart', {
        quantity       : 1,
        id             : this.selectedVariant.id,
        dontOpenDrawer : true,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.upsell + .free-product {
  margin-top: calc(-1.25em + 1px) !important
}

.free-product {
  width: calc(100% + 2.5em);
  max-width: none !important;
  border-top: 0 !important;
  padding: 1.25em 1.25em 0;
  margin: -1px -1.25em 1.25em;
  background: var(--shop-light-gray);

  &.is-cart {
    width: 100%;
    margin: -1px 0 0;
  }

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
.is-cart {
  @media(min-width: $desktop) {
    max-width: 425px;
    margin-right: 0;
    margin-left: auto;
  }

  .free-product {
    padding: 0 0 1.25em 0;
    margin-bottom: 1.25em;
  }
}

.product {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: calc(100% + 2.5em);
  border-top: 0 !important;
  padding: 1.25em;
  margin: -1px -1.25em 0;

  &.is-cart {
    width: 100%;
    margin: -1px 0 0;
  }

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
      margin-bottom: 0;
    }
  }

  .product-info {
    flex-basis: 37%;
    flex-grow: 1;
    padding: 0 1.25em;

    .product-deal, .product-title, .price {
      margin: 0 0 0.5rem;

      a {
        text-decoration: none;
      }
    }
  }

  .product-modify {
    display: flex;

    select, button {
      padding: 7.5px 15px !important;
      font-size: 0.75em !important;
      width: auto;
    }

    select {
      background-size: 7.5px;
      padding-right: 30px !important;
      margin-right: 1em;
    }
  }
}
</style>
