<template>
  <img
    :srcset="computedSrcSet"
    :src="placeholderImageUrl"
    sizes="`
      (min-width: 0px) 200px,
      (min-width: 500px) 500px,
      (min-width: 730px) 730px,
      (min-width: 990px) 990px,
      (min-width: 1440px) 1440px,
      (min-width: 2080px) 2080px
    `"
    :alt="alt"
    loading="lazy"
    :width="width"
    :height="height"
  >
</template>

<script>
import getSizedImage from '../helpers/_get-sized-image'

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
    return {
      placeholderImageUrl : (window.themeSettings && window.themeSettings.placeholderImageUrl) || '',
      loaded              : false,
      observer            : null,
    }
  },

  computed: {
    computedSrcSet() {
      if (this.loaded) {
        return `
        ${this.sizeImageOrReturn(this.source, '200x')} 200w,
        ${this.sizeImageOrReturn(this.source, '500x')} 500w,
        ${this.sizeImageOrReturn(this.source, '730x')} 730w,
        ${this.sizeImageOrReturn(this.source, '990x')} 990w,
        ${this.sizeImageOrReturn(this.source, '1440x')} 1440w,
        ${this.sizeImageOrReturn(this.source, '2080x')} 2080w
        `
      }

      return ''
    },
  },

  mounted() {
    this.intersectionWatcher()
  },

  destroyed() {
    this.observer.disconnect()
  },

  methods: {
    getSizedImage,
    sizeImageOrReturn(sentSource, sentSize) {
      if (sentSource.includes('cdn.shopify')) {
        return this.getSizedImage(sentSource, sentSize)
      }

      return sentSource
    },

    intersectionWatcher() {
      this.observer = new IntersectionObserver(async (entries) => {
        const image = entries[0]
        if (image.isIntersecting) {
          this.observer.disconnect()

          if (this.source !== '') {
            this.loaded = true
          }
        }
      })

      this.observer.observe(this.$el)
    },
  },
}
</script>

<style lang="scss" scoped>
img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
