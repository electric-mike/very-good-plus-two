export default {
  data() {
    return {
      showMobileNav : false,
      wasOpened     : false,
    }
  },

  mounted() {
    let currentWidth = window.outerWidth

    window.addEventListener('resize', ({ target }) => {
      if (target.outerWidth !== currentWidth) {
        this.toggleMobileCollectionNav(false)
      }
      currentWidth = target.outerWidth
    }, { passive: true })
  },

  methods: {
    toggleMobileCollectionNav(sentValue = true) {
      this.showMobileNav = sentValue
      this.wasOpened = true

      if (this.showMobileNav) {
        document.body.classList.add('no-scroll')
      } else {
        document.body.classList.remove('no-scroll')
      }
    },
  },
}
