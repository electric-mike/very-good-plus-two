export default {
  beforeMount() {
    this.fetchCollectionData(1)
    this.fetchCollectionData(1, 'best-selling')
  },

  data() {
    return {
      bestSellingProducts : [],
      error               : false,
      // products stored in collection.js
    }
  },

  computed: {
    loading() {
      if (
        (this.products.length > 0 && this.bestSellingProducts.length > 0
        ) || this.error === true
      ) {
        return false
      }

      return true
    },
  },

  methods: {
    fetchCollectionData(sentPage, sentFilter) {
      let localProducts = []
      let url = `${window.location.pathname}?view=products-endpoint&page=${sentPage}`
      if (window.location.search.includes('?q=') || window.location.search.includes('&q=')) {
        url += window.location.search.replace('?', '&').replace('&type=article', '')
      }

      if (sentFilter === 'best-selling') {
        url += `${url.includes('?') ? '&' : '?'}sort_by=best-selling`
      }

      return fetch(url)
        .then(response => response.json())
        .then((data) => {
          localProducts = localProducts.concat(data.products)

          if (data.page < data.totalPages) {
            this.fetchCollectionData(data.page + 1)
          } else {
            this.formatData(localProducts, sentFilter)
          }
        })
        .catch(() => { this.error = true })
    },

    formatData(sentData, sentFilter) {
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
      if (sentFilter === 'best-selling') {
        this.bestSellingProducts = localProducts
      } else {
        this.products = localProducts
        this.vendors = localVendors
        this.prices = localPrices
        this.tags = localTags
        this.types = localTypes
        this.sizes = localSizes.filter(size => size !== '')

        this.totalProducts = sentData.length

        this.generateFilters()
        this.checkURL()
        this.sortFilterOptions()
      }
    },
  },
}
