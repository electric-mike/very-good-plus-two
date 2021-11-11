export default {
  beforeMount() {
    this.fetchCollectionData(1)
  },

  data() {
    return {
      loading       : true,
      localProducts : [],
    }
  },

  methods: {
    fetchCollectionData(sentPage) {
      let url = `${window.location.pathname}?view=products-endpoint&page=${sentPage}`
      if (window.location.search.includes('?q=') || window.location.search.includes('&q=')) {
        url += window.location.search.replace('?', '&').replace('&type=article', '')
      }

      fetch(url)
        .then(response => response.json())
        .then((data) => {
          this.localProducts = this.localProducts.concat(data.products)

          if (data.page < data.totalPages) {
            this.fetchCollectionData(data.page + 1)
          } else {
            this.formatData(this.localProducts)
          }
        })
        .catch(() => { this.loading = false })
    },

    formatData(sentData) {
      this.totalProducts = sentData.length

      // format data
      // doing this first prevents a shit ton of re-paints
      const localProducts = []
      const localVendors = []
      const localPrices = []
      const localTypes = []
      let localSizes = []
      let localTags = []

      sentData.forEach((product) => {
        localProducts.push(product)
        localVendors.push(product.vendor)
        localPrices.push(product.price)
        localTypes.push(product.type)
        localTags = localTags.concat(product.tags.split(','))
        if (product.sizes) localSizes = localSizes.concat(product.sizes.split(','))
      })

      // set data
      this.products = localProducts
      this.vendors = localVendors
      this.prices = localPrices
      this.tags = localTags
      this.types = localTypes
      this.sizes = localSizes.filter(size => size !== '')

      this.generateFilters()
      this.loading = false
      this.checkURL()
      this.sortFilterOptions()
    },
  },
}
