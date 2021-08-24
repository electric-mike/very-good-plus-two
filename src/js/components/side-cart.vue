<template lang="pug">
  .side-cart(v-if="cartData" v-cloak)
    .overlay(
      @click="closeSideCart()"
      v-show="showSideCart"
      :style="{ 'top': `${enableStickyHeights && stickyHeights.headerTop()}px` }"
    )
    .drawer-wrapper(
      :class="{ 'open': showSideCart, 'has-announcement': announcement.enable, 'was-opened': wasOpened }"
      :style="{ 'top': `${enableStickyHeights && stickyHeights.headerTop()}px` }"
    )
      .drawer-header
        p.cart-text #[a(href='/cart') Your cart ({{ cartData.item_count }})]
        .hamburger.open(@click="closeSideCart()") #[.lines]
      .drawer-announcement(
        v-if="announcementEnable && announcement !== ''"
        :style="{ 'background-color' : announcementColor }"
      )
        h6.drawer-announcement-text(v-html="announcement")
      free-shipping-bar
      cart-component
      subtotal-checkout(v-if="cartData.item_count && cartData.item_count >= 0")
</template>

<script>
import { mapState } from 'vuex'
import cartComponent from './cart-component'
import subtotalCheckout from './subtotal-checkout'
import StickyHeights from '../_sticky-heights'
import freeShippingBar from './free-shipping-bar'
import geolocate from '../helpers/_geolocate'

export default {
  components: {
    cartComponent,
    subtotalCheckout,
    freeShippingBar,
  },

  data() {
    return {
      stickyHeights       : new StickyHeights(),
      announcementColor   : window.themeSettings.sideCartAnnouncement.color,
      announcementEnable  : window.themeSettings.sideCartAnnouncement.enable,
      enableStickyHeights : false,
      wasOpened           : false,
      geocode             : '',
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
      'showSideCart',
    ]),

    announcement() {
      if (
        window.themeSettings.sideCartAnnouncement
        && window.themeSettings.sideCartAnnouncement.text
        && window.themeSettings.sideCartAnnouncement.text[this.geocode]
      ) return window.themeSettings.sideCartAnnouncement.text[this.geocode]

      return ''
    },
  },

  async mounted() {
    this.geocode = await geolocate()
  },

  methods: {
    closeSideCart() {
      this.wasOpened = true
      this.$store.commit('cart/toggleSideCart')
    },

    goToCart() {
      window.location.pathname = '/cart'
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.drawer-wrapper {
  display: flex;
  flex-flow: column;
  align-items: stretch;

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    position: relative;
    border-bottom: 1px solid $medium-gray;

    .cart-text {
      margin: 0;
      flex-grow: 1;
      text-align: center;
      line-height: 1;

      a {
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .hamburger {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 1em;

      .lines {
        &:before, &:after {
          background-color: $black;
        }
      }
    }
  }

  .close-cart {
    display: flex;
    justify-content: space-between;
    padding: 1em 0;
  }

  .drawer-announcement {
    text-align: center;
    padding: 0.5em;

    &-text {
      margin-bottom: 0;
      color: $white;
    }
  }

  /deep/ .cart-content {
    height: auto;
    overflow: hidden;
    overflow-y: auto;
    flex-grow: 1;
  }
}
</style>
