<template lang="pug">
.upsell(v-if='upsellProduct && !upsellProductInCart')
  .upsell-image
    a(:href='"/products/" + upsellProduct.handle')
      vue-image.upsell-image(
        :source='computedImage'
        :width='200'
        :height='placeholderHeight'
        :alt='upsellProduct.title'
      )
  .upsell-info
    .upsell-text
      h5.upsell-title
        | Add a #[a(:href='"/products/" + upsellProduct.handle') {{ upsellProduct.title }}]
        //- span(v-if='selectedVariant.title')&nbsp;({{ selectedVariant.title }})&nbsp;
        | to your cart for {{ formatMoney(selectedVariant.price) }}
    .upsell-modify
      select(v-model='selectedVariant' v-if='upsellProduct.variants && upsellProduct.variants.length > 1')
        option(
          v-for='(variant, i) in upsellProduct.variants'
          :key='variant.id'
          :value='variant'
          :disabled="!variant.available"
        ) {{ variant.title }}
      button(@click='addToCart' v-bind:class="{ 'loading': addingToCart }") Add
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
      upsellProductInCart : false,
      selectedVariant     : false,
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
      'fetchingCart',
      'addingToCart',
    ]),

    computedImage() {
      if (
        this.selectedVariant
        && this.selectedVariant.featured_image
        && this.selectedVariant.featured_image.src
        && !this.selectedVariant.featured_image.src.includes('no_image')
      ) {
        return this.selectedVariant.featured_image.src
      }

      return this.upsellProduct.featured_image
    },
  },

  watch: {
    cartData() {
      this.checkUpsellInCart()
    },
  },

  mounted() {
    this.checkUpsellInCart()

    if (this.upsellProduct && this.upsellProduct.variants.length > 0) {
      this.upsellProduct.variants.forEach((variant) => {
        if (variant.available && !this.selectedVariant) {
          this.selectedVariant = variant
        }
      })
    }

    // Shut it down if no variants available
    if (!this.selectedVariant) {
      this.upsellProduct = false
    }
  },

  methods: {
    formatMoney,

    checkUpsellInCart() {
      this.upsellProductInCart = false

      if (this.cartData.items) {
        this.cartData.items.forEach((item) => {
          if (this.upsellProduct.id === item.id) {
            this.upsellProductInCart = true

            return
          }

          if (this.upsellProduct) {
            this.upsellProduct.variants.forEach((variant) => {
              if (item.id === variant.id) {
                this.upsellProductInCart = true
              }
            })
          }
        })
      }
    },

    addToCart() {
      this.$store.dispatch('cart/addToCart', {
        quantity : 1,
        id       : this.selectedVariant.id,
        upsell   : true,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.upsell {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  border-top: 0 !important;
  padding: 1.25em;
  margin: -1px 0 1.25em;
  background: $light-gray;

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
    }
  }

  .upsell-info {
    flex-basis: 37%;
    flex-grow: 1;
    padding: 0 1.25em;

    .upsell-title {
      margin: 0 0 0.5em;

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
