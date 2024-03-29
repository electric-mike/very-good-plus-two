export default {
  data() {
    return {
      activeSwatches                : window.activeSwatches || {},
      enableProductImageHover       : window.themeSettings.enableProductImageHover || false,
      enableDefaultProductSelection : window.themeSettings.enableDefaultProductSelection || false,
    }
  },

  mounted() {
    this.preloadAdditionalImage()
  },

  methods: {
    defaultSwatchSelected(sentProductId, sentIndex) {
      if (
        this.enableDefaultProductSelection
        && Object.keys(this.activeSwatches).indexOf(sentProductId) <= -1
        && sentIndex <= 0
      ) {
        return true
      }

      return false
    },

    changeSwatch(sentImageVariant, imgUrl, aspectRatio, productId, productUrl, swatchIndex, fallbackImage) {
      // if (this.activeSwatches[productId] === sentImageVariant) return

      this.$set(this.activeSwatches, productId, sentImageVariant)

      const parentEls = document.querySelectorAll(`.product-${productId}`)
      parentEls.forEach((parentEl) => {
        const parentImageWrapper = parentEl.querySelector('.image-wrap')
        let newImage = fallbackImage

        if (
          parentImageWrapper
          && !imgUrl.includes('no-image')
        ) {
          newImage = imgUrl
        }

        if (
          newImage
          && !newImage.includes('no-image')
        ) {
          parentImageWrapper.style.paddingBottom = `${100 / parseInt(aspectRatio, 10)}%`
          const mainImage = parentImageWrapper.querySelector('img')

          mainImage.dataset.src = newImage
          mainImage.dataset.firstSrc = newImage
          mainImage.dataset.swatchIndex = swatchIndex

          mainImage.classList.add('lazyload')
          mainImage.classList.remove('lazyloaded')
        }

        const parentLinks = parentEl.querySelectorAll('a')
        if (parentLinks.length > 0) {
          parentLinks.forEach((link) => {
            link.href = productUrl
          })
        }
      })
    },

    preloadAdditionalImage() {
      // preload main image
      const els = this.$el.querySelectorAll('img')

      els.forEach((el) => {
        if (el.dataset.additionalImage && !el.dataset.additionalImage.includes('no-image')) {
          const imgSrc = el.dataset.additionalImage.replace('_{width}x', '_540x')
          const imageEl = document.createElement('link')
          this.preloadImage(imgSrc, imageEl)
        }
      })

      // preload swatch images
      const swatches = this.$el.querySelectorAll('.swatches .swatch')
      swatches.forEach((el) => {
        if (el.dataset.imageSrc && !el.dataset.imageSrc.includes('no-image')) {
          const imgSrc = el.dataset.imageSrc.replace('_{width}x', '_540x')
          const imageEl = document.createElement('link')
          this.preloadImage(imgSrc, imageEl)
        }
      })
    },

    preloadImage(imgSrc, imageEl) {
      imageEl.rel = 'preload'
      imageEl.href = imgSrc
      imageEl.as = 'image'

      document.head.appendChild(imageEl)
    },
  },
}
