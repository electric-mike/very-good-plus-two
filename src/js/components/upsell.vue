<template lang="pug">
.upsell(v-if='computedUpsellProduct')
  .upsell-image
    a(:href='"/products/" + computedUpsellProduct.handle')
      vue-image.upsell-image(
        :source='computedImage'
        :width='200'
        :height='placeholderHeight'
        :alt='computedUpsellProduct.title'
      )
  .upsell-info
    .upsell-text
      h6.upsell-deal(v-if="computedUpsellProduct === upsellProduct") {{ upsellProductHeader }}
      h6.upsell-deal(v-else) {{ secondaryUpsellProductHeader }}
      h6.upsell-title #[a(:href='"/products/" + computedUpsellProduct.handle') {{ computedUpsellProduct.title }}]
      h6.price {{ formatMoney(selectedVariant.price) }}
        //- span(v-if='selectedVariant.title')&nbsp;({{ selectedVariant.title }})&nbsp;
      .upsell-modify
        select.hover(
          v-model='selectedVariant'
          v-if='computedUpsellProduct.variants && computedUpsellProduct.variants.length > 1'
        )
          option(
            v-for='(variant, i) in computedUpsellProduct.variants'
            :key='variant.id'
            :value='variant'
            :disabled="!variant.available"
          ) {{ variant.title }}
        button.secondary(@click='addToCart' v-bind:class="{ 'loading': addingToCart }") ADD +
</template>

<script>
import { mapState } from 'vuex'
import vueImage from './vue-image'
import formatMoney from '../helpers/_format-money'

export default {
  components: {
    vueImage,
  },

  data() {
    let placeholderHeight = this.height || 200
    const aspectRatio = window.themeSettings.placeholderImageAspectRatio || false

    if (aspectRatio && aspectRatio === '4:5') {
      placeholderHeight = 250
    }

    return {
      placeholderHeight,
      upsellProduct: (
        window.themeSettings
        && window.themeSettings.upsellProduct
        && !Object.prototype.hasOwnProperty.call(window.themeSettings.upsellProduct, 'error')
      ) ? window.themeSettings.upsellProduct : false,
      upsellProductHeader: (
        window.themeSettings
        && window.themeSettings.upsellProduct
        && window.themeSettings.upsellProductHeader
      ) ? window.themeSettings.upsellProductHeader : 'Complete Your Cart',
      secondaryUpsellProduct: (
        window.themeSettings
        && window.themeSettings.secondaryUpsellProduct
        && !Object.prototype.hasOwnProperty.call(window.themeSettings.secondaryUpsellProduct, 'error')
      ) ? window.themeSettings.secondaryUpsellProduct : false,
      secondaryUpsellProductHeader: (
        window.themeSettings
        && window.themeSettings.secondaryUpsellProduct
        && window.themeSettings.secondaryUpsellProductHeader
      ) ? window.themeSettings.secondaryUpsellProductHeader : 'Deal Of The Day',
      upsellProductInCart          : false,
      secondaryUpsellProductInCart : false,
      selectedVariant              : false,
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
      'fetchingCart',
      'addingToCart',
    ]),

    computedUpsellProduct() {
      if (!this.upsellProductInCart) return this.upsellProduct
      if (!this.secondaryUpsellProductInCart) return this.secondaryUpsellProduct

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

      return this.computedUpsellProduct.featured_image
    },
  },

  watch: {
    cartData() {
      this.checkUpsellsInCart()
    },
  },

  mounted() {
    this.checkUpsellsInCart()
  },

  methods: {
    formatMoney,

    checkUpsellsInCart() {
      this.upsellProductInCart = false
      this.secondaryUpsellProductInCart = false

      if (this.cartData.items) {
        this.cartData.items.forEach((item) => {
          if (this.upsellProduct.id === item.id) {
            this.upsellProductInCart = true
          }

          if (this.secondaryUpsellProduct.id === item.id) {
            this.secondaryUpsellProductInCart = true
          }

          if (this.upsellProduct) {
            this.upsellProduct.variants.forEach((variant) => {
              if (item.id === variant.id) {
                this.upsellProductInCart = true
              }
            })
          }

          if (this.secondaryUpsellProduct) {
            this.secondaryUpsellProduct.variants.forEach((variant) => {
              if (item.id === variant.id) {
                this.secondaryUpsellProductInCart = true
              }
            })
          }
        })
      }

      this.selectDefaultVariant()
    },

    selectDefaultVariant() {
      if (this.computedUpsellProduct && this.computedUpsellProduct.variants.length > 0) {
        this.selectedVariant = this.computedUpsellProduct.variants.find((variant) => {
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
.upsell {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  border-top: 0 !important;
  padding: 1.25em;
  margin: -1px 0 1.25em;
  background: var(--shop-light-gray);

  &:first-of-type {
    padding-top: 0;
  }

  &:last-of-type {
    border-bottom: 0;
  }

  .upsell-image {
    flex-basis: 20%;

    img {
      max-width: 100%;
      margin-bottom: 0;
    }
  }

  .upsell-info {
    flex-basis: 37%;
    flex-grow: 1;
    padding: 0 1.25em;

    .upsell-deal, .upsell-title, .price {
      margin: 0 0 0.5rem;

      a {
        text-decoration: none;
      }
    }
  }

  .upsell-modify {
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
