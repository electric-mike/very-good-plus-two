<template lang="pug">
.order-note
  .checkbox
    input#enableOrder(type="checkbox" v-model="enableOrderNote")
    label(for="enableOrder" @click="userInteracted = true") Order or gift note
  textarea.order-note(
    aria-label="Order or gift note"
    placeholder="Add any special notes here"
    name="order-note"
    v-model="localOrderNote"
    v-show="enableOrderNote"
    @blur="orderNoteBlur"
  )
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
      enableOrderNote : false,
      userInteracted  : false,
    }
  },

  computed: {
    ...mapState('cart', [
      'cartData',
      'orderNote',
    ]),
  },

  watch: {
    enableOrderNote() {
      if (!this.enableOrderNote) {
        this.localOrderNote = ''
        this.orderNoteBlur()
      } else if (this.userInteracted) {
        const textarea = this.$el.querySelector('textarea')
        this.$nextTick(() => {
          let params = {}
          textarea.focus()

          if (this.isCart) {
            params = {
              behavior : 'auto',
              block    : 'center',
              inline   : 'center',
            }
          }

          textarea.scrollIntoView(params)
        })
      }
    },
  },

  beforeMount() {
    this.localOrderNote = this.orderNote
    if (this.localOrderNote !== '') this.enableOrderNote = true
  },

  methods: {
    orderNoteBlur() {
      if (this.orderNote !== this.localOrderNote) {
        this.$store.commit('cart/setOrderNote', this.localOrderNote)
        this.$store.dispatch('cart/updateOrderNote')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.order-note {
  width: 100%;

  textarea, .checkbox {
    margin-bottom: 1.25em;
  }

  label {
    text-transform: none;
  }
}
</style>
