export default {
  data() {
    return {
      activeSwatches          : window.activeSwatches || {},
      enableProductImageHover : window.themeSettings.enableProductImageHover || false,
    }
  },

  methods: {
    changeImage(inOrOut, $event) {
      if (this.enableProductImageHover) {
        const image = $event.target

        if (
          Object.prototype.hasOwnProperty.call(image.dataset, 'additionalImage')
          && !('ontouchstart' in window || navigator.msMaxTouchPoints) // touch check
        ) {
          if (inOrOut === 'in' && !image.dataset.additionalImage.includes('no-image')) {
            image.dataset.src = image.dataset.additionalImage
            image.src = image.dataset.additionalImage
            image.parentElement.style.paddingBottom = `${100 / image.dataset.secondaryAspectratio}%`
          } else if (!image.dataset.firstSrc.includes('no-image')) {
            image.dataset.src = image.dataset.firstSrc
            image.src = image.dataset.firstSrc
            image.parentElement.style.paddingBottom = `${100 / image.dataset.aspectratio}%`
          }

          image.classList.add('lazyload')
          image.classList.remove('lazyloaded')
        }
      }
    },

    changeSwatch(sentImageVariant, imgUrl, aspectRatio, productId, productUrl) {
      if (this.activeSwatches[productId] === sentImageVariant) return

      this.$set(this.activeSwatches, productId, sentImageVariant)

      const parentEls = document.querySelectorAll(`.product-${productId}`)
      parentEls.forEach((parentEl) => {
        const parentImageWrapper = parentEl.querySelector('.image-wrap')
        if (
          parentImageWrapper
          && !imgUrl.includes('no-image')
        ) {
          parentImageWrapper.style.paddingBottom = `${100 / parseInt(aspectRatio, 10)}%`
          const mainImage = parentImageWrapper.querySelector('img')

          mainImage.dataset.src = imgUrl
          mainImage.dataset.firstSrc = imgUrl
          mainImage.classList.add('lazyload', 'blur-up', 'blur-up-actually')
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
  },
}
