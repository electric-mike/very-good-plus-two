<template>
  <img
    :srcset="`
      ${sizeImageOrReturn(source, '200x')} 200w,
      ${sizeImageOrReturn(source, '500x')} 500w,
      ${sizeImageOrReturn(source, '730x')} 730w,
      ${sizeImageOrReturn(source, '990x')} 990w,
      ${sizeImageOrReturn(source, '1440x')} 1440w,
      ${sizeImageOrReturn(source, '2080x')} 2080w
    `"
    :src="sizeImageOrReturn(source, '100x')"
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
  methods: {
    getSizedImage,
    sizeImageOrReturn(sentSource, sentSize) {
      if (sentSource.includes('cdn.shopify')) {
        return this.getSizedImage(sentSource, sentSize)
      }

      return sentSource
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
