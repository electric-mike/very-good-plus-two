<template lang="pug">
  .quantity-input(:class="{ 'is-cart': isCart, 'updating-cart': updatingCart }")
    button.secondary(v-if="isCart" @click.prevent="changeValue(internalValue - 1)") -
    .required
      //- label(for="quantity" v-if="!isCart") Qty
      input(
        v-model.number="internalValue"
        type="number"
        name="quantity"
        min=`${ isCart ? 0 : 1 }`
        required
        label="Quantity Input"
      )
    .button-wrapper
      button.secondary(@click.prevent="changeValue(internalValue + 1)") +
      button.secondary(v-if="!isCart" @click.prevent="changeValue(internalValue - 1)") -
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    value: {
      type    : [String, Number],
      default : 1,
    },
    isCart: {
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
  },

  methods: {
    changeValue(newVal) {
      if ((!this.isCart && newVal === 0) || newVal === '') {
        newVal = 1
      }

      this.$emit('input', newVal)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.quantity-input {
  display: flex;
  align-items: flex-end;
  max-width: 250px;

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
    border: 1px solid $medium-gray;
    border-radius: 3px;
  }

  button {
    padding: 0 !important;
    width: 30px;
    height: 100%;
    height: 21px;
    line-height: 1;
    color: $medium-gray;
    background: $white;
    border-radius: 0;
    border: none;

    &:hover {
      color: $black;
      background: $white;
    }
  }

  .required {
    align-self: flex-start;

    input {
      width: 100% !important;
      margin: 0 !important;
      font-size: 1em !important;
      height: 100%;
      padding-right: .5em;
      padding-left: .5em;
      text-align: center;
      border: 1px solid $medium-gray;
      border-radius: 3px;
      color: $black;

      &:hover {
        border-color: $black;
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
      border-left: 0 !important;
      border-right: 0 !important;
      border-radius: 0 !important;
      border-color: $medium-gray;
      font-family: $primary-font;

      &:hover {
        border-color: $medium-gray;
      }
    }

    button {
      padding: 4px 7.5px !important;
      line-height: 1.6 !important;
      width: 30px !important;
      border: 1px solid $medium-gray;

      &:first-of-type {
        border-bottom: 1px solid $medium-gray;
      }

      &:last-of-type {
        border-top: 1px solid $medium-gray;
      }

      &:hover {
        border: 1px solid $black;
        color: $black;
      }
    }

    input, button {
      height: 33px !important; //for iOS
    }
  }
}
</style>
