export default {
  data() {
    return {
      showMobileNav : false,
      wasOpened     : false,
    }
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.toggleMobileCollectionNav(false)
    })
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
