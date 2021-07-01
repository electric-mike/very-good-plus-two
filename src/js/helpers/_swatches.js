export default {
  data() {
    return {
      activeSwatches: window.activeSwatches || {},
    }
  },

  methods: {
    changeSwatch(sentImageVariant, imgUrl, aspectRatio, productId, productUrl) {
      if (this.activeSwatches[productId] === sentImageVariant) return

      this.$set(this.activeSwatches, productId, sentImageVariant)

      const parentEls = document.querySelectorAll(`.product-${productId}`)
      parentEls.forEach((parentEl) => {
        const parentImageWrapper = parentEl.querySelector('.image-wrap')
        if (parentImageWrapper) {
          parentImageWrapper.style.paddingBottom = `${100 / parseInt(aspectRatio, 10)}%`
          parentImageWrapper.querySelector('img').dataset.src = imgUrl
          parentImageWrapper.querySelector('img').classList.add('lazyload', 'blur-up', 'blur-up-actually')
          parentImageWrapper.querySelector('img').classList.remove('lazyloaded')
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
