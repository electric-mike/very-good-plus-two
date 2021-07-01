<template lang="pug">
.promo-code(v-if="enablePromoCodeInput" :class="{ 'is-cart': isCart }")
  input(
    autocomplete="off"
    type="text"
    name="discount"
    placeholder="Promo code"
    v-model="promoCode"
    @keydown.enter.stop.prevent="applyPromoCode"
  )
  p.promo-code-button(@click="applyPromoCode" v-show="showApplyCode") Apply
  p.promo-code-button.applied(v-show="!showApplyCode") Promo Applied
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    isCart: {
      type    : Boolean,
      default : false,
    },
  },

  data() {
    return {
      promoCode            : '',
      enablePromoCodeInput : window.themeSettings && window.themeSettings.enablePromoCodeInput,
    }
  },

  computed: {
    ...mapState('cart', [
      'appliedPromoCode',
    ]),

    showApplyCode() {
      return this.promoCode === '' || this.appliedPromoCode !== this.promoCode
    },
  },

  beforeMount() {
    this.promoCode = this.appliedPromoCode
  },

  methods: {
    applyPromoCode() {
      this.$store.commit('cart/setAppliedPromoCode', this.promoCode)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.promo-code {
  position: relative;
  margin: 1em 1em 0;

  &.is-cart {
    margin: 1em 0 0;
  }

  &-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 1em;
    color: $primary-color;
    margin: 0;
    cursor: pointer;

    &:hover {
      color: $dark-gray;
    }
  }

  .applied {
    color: $black;
  }
}
</style>
