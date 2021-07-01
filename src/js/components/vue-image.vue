<template lang="pug">
.vue-image(:style="{ 'padding-bottom': computedPaddingBottom, 'height': computedHeight }")
  transition(name="fade")
    img(v-if="loaded" :src="source" :alt="alt")
    svg(
      v-else
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg"
      viewbox="0 0 10 10"
      :width="localWidth"
      :height="localHeight"
      :style="{ 'background-color': backgroundColor }"
    )
</template>

<script>
export default {
  props: {
    backgroundColor: {
      type    : String,
      default : '#efefef',
    },
    width: {
      type    : Number,
      default : 200,
    },
    height: {
      type    : Number,
      default : 200,
    },
    source: {
      type    : String,
      default : '',
    },
    alt: {
      type    : String,
      default : '',
    },
    disableAspectRatio: {
      type    : Boolean,
      default : false,
    },
  },

  data() {
    const localWidth = this.width || 200
    let localHeight = this.height || 200
    const aspectRatio = window.themeSettings.placeholderImageAspectRatio || false

    if (aspectRatio && aspectRatio === '4:5') {
      localHeight = 250
    }

    return {
      loaded   : false,
      observer : null,
      localWidth,
      localHeight,
    }
  },

  computed: {
    computedHeight() {
      if (this.disableAspectRatio) return false

      return 0
    },

    computedPaddingBottom() {
      if (this.disableAspectRatio) return false

      return `${(this.localHeight / this.localWidth * 100)}%`
    },
  },

  mounted() {
    this.intersectionWatcher()
  },

  destroyed() {
    this.observer.disconnect()
  },

  methods: {
    intersectionWatcher() {
      this.observer = new IntersectionObserver(async (entries) => {
        const image = entries[0]
        if (image.isIntersecting) {
          this.observer.disconnect()

          if (this.source !== '') {
            const newImg = new Image()
            newImg.src = this.source

            newImg.onload = () => {
              this.loaded = true

              if (!this.disableAspectRatio) {
                this.localHeight = newImg.height
                this.localWidth = newImg.width
              }
            }
          }
        }
      })

      this.observer.observe(this.$el)
    },
  },
}
</script>

<style lang="scss" scoped>
.vue-image {
  position: relative;

  svg, img {
    display: block;
    height: auto;
    width: 100%;
    max-width: 100%;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}
</style>
