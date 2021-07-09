<template lang="pug">
  .modal-wrapper
    .overlay(@click="close()")
    .modal-content
      .hamburger.open(@click="close()") #[.lines]
      slot
</template>

<script>
export default {
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.modal-wrapper {
  .modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-font-smoothing: subpixel-antialiased;
    backface-visibility: hidden;
    width: calc(100% - 2.5em);
    max-height: 600px;
    overflow-y: auto;
    max-width: 500px;
    background: $white;
    z-index: 999999;
    padding: 1em;
    animation: fadeIn 0.5s;
  }

  .hamburger {
    position: absolute;
    right: 0;

    .lines {
      &:before, &:after {
        background-color: $black !important;
      }
    }
  }
}
</style>
