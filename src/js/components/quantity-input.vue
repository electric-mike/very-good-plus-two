<template lang="pug">
  .quantity-input(:class="{ 'is-cart': isCart, 'updating-cart': updatingCart }")
    button.secondary(@click.prevent="changeValue(internalValue - computedStep)") -
    .required
      label(
        for="quantity"
        v-if="!isCart"
        style="display: none"
        aria-label="Quantity"
      ) Qty
      input(
        v-model.number="internalValue"
        type="number"
        name="quantity"
        min="computedMin"
        step="computedStep"
        required
        label="Quantity Input"
      )
    button.secondary(@click.prevent="changeValue(internalValue + computedStep)") +
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    value: {
      type    : [String, Number],
      default : 1,
    },
    max    : Number,
    isCart : {
      type    : Boolean,
      default : false,
    },
  },
  computed: {
    internalValue: {
      get() { return this.value },
      set(v) {
        this.changeValue(v)
      },
    },

    ...mapState('cart', [
      'updatingCart',
    ]),

    computedStep() {
      return 1
    },

    computedMin() {
      return this.isCart ? 0 : 1
    },
  },

  methods: {
    changeValue(newVal) {
      if (this.max >= 1 && newVal > this.max) {
        newVal = this.max
      } else if ((!this.isCart && newVal === 0) || newVal === '') {
        newVal = this.computedMin
      }

      this.$emit('input', newVal)
    },
  },
}
</script>

<style lang="scss" scoped>
.quantity-input {
  display: flex;
  align-items: stretch;
  max-width: 250px;
  height: 100%;

  &.updating-cart {
    pointer-events: none;
    user-select: none;
  }

  .button-wrapper {
    display: grid;
    flex-flow: column;
    grid-gap: 5px;
    flex-basis: 25%;
    margin-left: 5px;
    border: 1px solid var(--shop-gray);
    border-radius: 3px;
  }

  button {
    padding: 0.95em 0.5em !important;
    width: 30px;
    line-height: 1;
    color: var(--shop-gray);
    background: var(--shop-white);
    border-radius: 0;
    border: 1px solid var(--shop-gray);
    flex-shrink: 0;
    align-self: stretch;

    &:first-of-type {
      border-bottom: 1px solid var(--shop-gray);
    }

    &:last-of-type {
      border-top: 1px solid var(--shop-gray);
    }

    &:hover {
      color: var(--shop-black);
      background: var(--shop-white);
      border: 1px solid var(--shop-black);
      color: var(--shop-black);
    }
  }

  .required {
    align-self: flex-start;
    height: 100%;

    input {
      width: 100% !important;
      height: 100%;
      margin: 0 !important;
      font-size: 1em !important;
      padding-right: .5em;
      padding-left: .5em;
      text-align: center;
      border: 1px solid var(--shop-gray);
      border-left: 0 !important;
      border-right: 0 !important;
      border-radius: 0 !important;
      border-color: var(--shop-gray);
      color: var(--shop-black);

      &:hover, &:active, &:focus {
        border: 1px solid var(--shop-black) !important;
      }
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }

    p {
      white-space: nowrap;
    }
  }

  &.is-cart {
    align-items: flex-start;
    margin: 0.5em 0 0;

    .button-wrapper {
      display: block;
      margin-left: 0;
      border: none;
      border-radius: 0;
    }

    input {
      width: auto!important;
      padding: 6px !important;
      max-width: 50px;
    }

    button {
      padding: 3.5px 7.5px 4.5px !important;
    }

    input, button {
      height: 33px !important; //for iOS
    }
  }
}
</style>
