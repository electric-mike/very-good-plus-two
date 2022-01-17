// collection page
import Vue from 'vue'
import VRuntimeTemplate from 'v-runtime-template'
import baseFilterOptions from './data/base-filter-options'
import fetchCollectionData from './_fetch-collection-data'
import swatches from './helpers/_swatches'
import toggleMobileCollectionNav from './_toggle-mobile-collection-nav'
import getUrlParameter from './helpers/_get-url-param'
import currency from './helpers/_currency'

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.href.indexOf('collections') > -1 || window.location.href.indexOf('search') > -1) {
    const collection = document.getElementById('category-app') || document.getElementById('search-app')

    if (collection) {
      new Vue({
        el         : collection,
        delimiters : ['${', '}'],
        components : { VRuntimeTemplate },
        filters    : { currency },
        mixins     : [fetchCollectionData, toggleMobileCollectionNav, swatches],

        data() {
          const {
            totalProducts,
            additionalFilterOptions,
          } = window

          const {
            paginationLimit,
            enableVendorFilter,
            enableRatingsFilter,
          } = window.themeSettings

          return {
            products            : [],
            tags                : [],
            prices              : [],
            ratings             : [],
            types               : [],
            vendors             : [],
            sizes               : [],
            filterOptions       : additionalFilterOptions.concat(baseFilterOptions),
            filterToggles       : {},
            checkedOptions      : {},
            totalProducts,
            currentPage         : 1,
            sort                : '',
            setPageFromURL      : false,
            enableVendorFilter  : enableVendorFilter || false,
            enableRatingsFilter : enableRatingsFilter || false,
            activeTab           : 'products',
            showFilters         : window.localStorage.getItem('showCategoryFilters') ? window.localStorage.getItem('showCategoryFilters') === 'true' : true,
            mobileGridSize      : parseFloat(window.localStorage.getItem('mobileGridSize') || 2),
            paginationLimit     : paginationLimit || 40,
          }
        },

        computed: {
          actualCheckedOptions() {
            // generate actual list of options to match each product against
            const actualCheckedOptions = {}
            Object.keys(this.checkedOptions).forEach((key) => {
              const option = this.checkedOptions[key]
              if (option.length > 0) {
                actualCheckedOptions[key] = option
              }
            })

            return actualCheckedOptions
          },

          actualCheckedOptionsArray() {
            const actualArray = []
            Object.keys(this.actualCheckedOptions).forEach((option) => {
              this.actualCheckedOptions[option].forEach(o => actualArray.push(o))
            })

            return actualArray
          },

          filterOptionsAvailable() {
            if (this.loading) return ['loading']

            return this.filterOptions.filter((option) => {
              if (option.options.length > 1) {
                return option
              }

              return false
            })
          },

          filteredProducts() {
            let prods = this.products
            if (this.sort === 'best-selling') {
              prods = this.bestSellingProducts
            }

            let filteredProducts = prods.filter((product) => {
              const actualCheckedOptionsKeys = Object.keys(this.actualCheckedOptions)
              const foundMatches = {}

              if (actualCheckedOptionsKeys.length === 0) {
                return true
              }

              actualCheckedOptionsKeys.forEach((key) => {
                const options = this.actualCheckedOptions[key]

                options.forEach((checkedOption) => {
                  if (checkedOption.name.indexOf('$') > -1) {
                    if (
                      (
                        checkedOption.value.min <= product.price
                        && checkedOption.value.max >= product.price
                      ) || (
                        product.price >= 500
                      && checkedOption.value.max === null
                      && checkedOption.value.min <= product.price
                      )
                    ) {
                      foundMatches[key] = true
                    }
                  } else if (checkedOption.name.indexOf('Star') > -1) {
                    if (
                      (
                        checkedOption.value.min <= product.reviews_integer
                        && checkedOption.value.max >= product.reviews_integer
                      ) || (
                        product.reviews_integer >= 4
                      && checkedOption.value.max === null
                      && checkedOption.value.min <= product.reviews_integer
                      )
                    ) {
                      foundMatches[key] = true
                    }
                  } else if (key === 'Vendor' || key === 'Product Type') {
                    const localKey = () => {
                      if (key === 'Vendor') {
                        return 'vendor'
                      }

                      if (key === 'Product Type') {
                        return 'type'
                      }

                      return ''
                    }

                    if (
                      (
                        product[localKey()]
                      && product[localKey()].toLowerCase() === checkedOption.value.toLowerCase()
                      ) || (
                        product[key]
                        && product[key].toLowerCase() === checkedOption.value.toLowerCase()
                      )
                    ) {
                      foundMatches[key] = true
                    }
                  } else {
                    let localSentOptions = []

                    if (
                      key === 'Size'
                      && Object.prototype.hasOwnProperty.call(product, 'sizes')
                    ) {
                      localSentOptions = product.sizes.split(',')
                    } else {
                      localSentOptions = product.tags.split(',')
                    }

                    localSentOptions.forEach((option) => {
                      const floatOption = parseFloat(option) || 0
                      let stringsHasOption = false

                      if (
                        Object.prototype.hasOwnProperty.call(checkedOption, 'strings')
                        && checkedOption.strings.find(optionString => option.toLowerCase().includes(optionString))
                      ) {
                        stringsHasOption = checkedOption.strings.find(optionString => option.toLowerCase().includes(optionString)) //eslint-disable-line
                      }

                      if (
                        checkedOption.name === option
                        || (
                          (
                            stringsHasOption
                            && checkedOption.value.min <= floatOption
                            && checkedOption.value.max >= floatOption
                          ) || (
                            stringsHasOption
                            && floatOption >= 10000
                            && checkedOption.value.max === null
                            && checkedOption.value.min <= floatOption
                          )
                        )
                      ) {
                        if (checkedOption.value.max) {
                          foundMatches[key] = true
                        } else if (foundMatches[key] >= 1) {
                          foundMatches[key] += 1
                        } else {
                          foundMatches[key] = 1
                        }
                      }
                    })
                  }
                })
              })

              let showProduct = true
              Object.keys(this.actualCheckedOptions).forEach((key) => {
                if (
                  !foundMatches[key]
                  // NOTE
                  // uncomment to add "exclusionary" filtering
                  // ------
                  // || (
                  //   foundMatches[key] !== true
                  //   && foundMatches[key] < this.actualCheckedOptions[key].length
                  // )
                ) {
                  showProduct = false
                }
              })

              return showProduct
            })

            // sort
            if (this.sort === 'atoz') {
              filteredProducts = filteredProducts.sort((a, b) => (a.title !== b.title ? a.title < b.title ? -1 : 1 : 0)) //eslint-disable-line
            } else if (this.sort === 'ztoa') {
              filteredProducts = filteredProducts.sort((a, b) => (a.title !== b.title ? b.title < a.title ? -1 : 1 : 0)) //eslint-disable-line
            } else if (this.sort === 'type') {
              filteredProducts = filteredProducts.sort((a, b) => (a.type !== b.type ? a.type < b.type ? -1 : 1 : 0)) //eslint-disable-line
            } else if (this.sort === 'vendor') {
              filteredProducts = filteredProducts.sort((a, b) => (a.vendor !== b.vendor ? a.vendor < b.vendor ? -1 : 1 : 0)) //eslint-disable-line
            } else if (this.sort === 'pricea') {
              filteredProducts = filteredProducts.sort((a, b) => (a.price !== b.price ? a.price > b.price ? -1 : 1 : 0)) //eslint-disable-line
            } else if (this.sort === 'priced') {
              filteredProducts = filteredProducts.sort((a, b) => (a.price !== b.price ? a.price < b.price ? -1 : 1 : 0)) //eslint-disable-line
            } else if (this.sort === 'datea') {
              filteredProducts = filteredProducts.sort((a, b) => {
                const aDate = new Date(a.date)
                const bDate = new Date(b.date)
                return aDate !== bDate ? aDate > bDate ? -1 : 1 : 0 //eslint-disable-line
              })
            } else if (this.sort === 'dated') {
              filteredProducts = filteredProducts.sort((a, b) => {
                const aDate = new Date(a.date)
                const bDate = new Date(b.date)

                return aDate !== bDate ? aDate < bDate ? -1 : 1 : 0 //eslint-disable-line
              })
            } else {
              filteredProducts = filteredProducts.sort((a, b) => (a.position !== b.position ? a.position < b.position ? -1 : 1 : 0)) //eslint-disable-line
            }

            return filteredProducts || []
          },

          paginationSize() {
            if (this.filteredProducts.length > 0) {
              return this.filteredProducts.length <= this.paginationLimit
                ? this.filteredProducts.length : this.paginationLimit
            }

            return this.paginationLimit
          },

          pageRangeEnd() {
            const end = this.currentPage * this.paginationSize

            return end > this.filteredProducts.length ? this.filteredProducts.length : end
          },

          pageRangeStart() {
            const lastPageStart = (this.currentPage - 1) * this.paginationSize
            const start = this.pageRangeEnd - this.paginationSize

            return this.pageRangeEnd === this.filteredProducts.length ? lastPageStart : start
          },

          paginatedProducts() {
            // logic for pagination
            if (this.paginationSize !== '') {
              return this.filteredProducts.filter((product, index) => {
                if (this.currentPage > 1) {
                  if (
                    index >= this.pageRangeEnd
                    || index < this.pageRangeStart
                  ) {
                    return false
                  }
                } else if (index >= this.paginationSize) {
                  return false
                }

                return true
              })
            }

            return this.filteredProducts
          },

          paginatedProductsPages() {
            return Math.ceil(this.filteredProducts.length / this.paginationSize)
          },

          showVueProducts() {
            return !this.loading && (
              this.actualCheckedOptionsArray.length > 0
              || this.currentPage > 1
              || this.sort !== ''
            )
          },

          computedMobileGridSize() {
            // sort of a nono, but works fine
            window.localStorage.setItem('mobileGridSize', this.mobileGridSize)

            return `mobile-grid-${this.mobileGridSize}`
          },

          isBestSellerCollection() {
            return window.location.pathname.includes('best-sell')
          },
        },

        watch: {
          actualCheckedOptions: {
            immediate : true,
            deep      : true,
            handler(after, before) {
              if (
                after
                && before
                && (
                  Object.keys(before).length !== 0
                  || Object.keys(after).length !== 0
                )
              ) {
                this.updateURL()

                if (this.setPageFromURL) {
                  this.setPageFromURL = false
                } else {
                  this.currentPage = 1
                }

                this.checkForRelatedColorSwatch()
                this.triggerLazyload()

                if (this.filteredProducts.length <= 6) {
                  const filterWrapper = document.querySelector('.filters-products-wrapper')
                  const header = document.querySelector('header nav')

                  if (filterWrapper && header) {
                    window.scrollTo({
                      top: filterWrapper.getBoundingClientRect().top + (
                        window.scrollY - header.getBoundingClientRect().height
                      ),
                      behavior: 'smooth',
                    })
                  }
                }
              }
            },
          },

          sort: {
            handler(after, before) {
              if (after || before) {
                this.currentPage = 1
                this.updateURL()
                this.triggerLazyload()
              }
            },
          },

          currentPage: {
            immediate : true,
            deep      : true,
            handler(after, before) {
              if (
                !after
                || !before
              ) {
                this.currentPage = 1
              } else {
                window.scrollTo(0, 0)
                this.triggerLazyload()
                this.updateURL()
              }
            },
          },
        },

        methods: {
          getUrlParameter,

          checkURL() {
            // @NOTE if this ever changes to have multiple query strings, we should use URLSearchParameters
            // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
            // @UPDATE changed this to use custom function getUrlParameter
            const query = window.location.search ? this.getUrlParameter('filters').split(';') : false

            if (query) {
              query.forEach((param) => {
                const localParam = param.split(':')

                const filter = decodeURIComponent(localParam[0])
                const options = decodeURIComponent(localParam[1]).split(',')

                const localFilter = this.filterOptions.find(option => option.name === filter)

                if (localFilter) {
                  options.forEach((filterOption) => {
                    const matchedOption = localFilter.options.find(option => option.name.replace('+', '').trim() === filterOption.replace('+', '').trim())

                    if (matchedOption) {
                      if (!Object.prototype.hasOwnProperty.call(this.checkedOptions, filter)) {
                        this.$set(this.checkedOptions, filter, [])
                      }

                      this.checkedOptions[filter].push(matchedOption)
                      this.$set(this.filterToggles, filter, true)
                    }
                  })
                }
              })
            }

            const sort = window.location.search ? this.getUrlParameter('sort') : false
            if (sort) {
              this.sort = sort
            }

            const page = window.location.search ? this.getUrlParameter('pagination') : false
            if (page) {
              this.currentPage = parseInt(page, 10)
              this.setPageFromURL = true
            }

            const tab = window.location.search ? this.getUrlParameter('tab') : false
            if (tab) {
              this.activeTab = tab
            }
          },

          updateURL() {
            let query = `${window.location.protocol}//${window.location.host}${window.location.pathname}`

            if (Object.keys(this.actualCheckedOptions).length > 0) {
              query += '?filters='

              Object.keys(this.actualCheckedOptions).forEach((cat, index) => {
                query += `${index !== 0 ? ';' : ''}${cat}:`

                this.actualCheckedOptions[cat].forEach((option, i) => {
                  query += `${i !== 0 ? ',' : ''}${option.name}`
                })
              })
            }

            if (this.sort !== '') {
              query += `${query.includes('?') ? '&' : '?'}sort=${this.sort}`
            }

            if (this.currentPage > 1) {
              query += `${query.includes('?') ? '&' : '?'}pagination=${this.currentPage}`
            }

            // extract query from search
            if (window.location.search.includes('?q=') || window.location.search.includes('&q=')) {
              const searchQuery = this.getUrlParameter('q')
              query += `${query.includes('?') ? '&' : '?'}q=${searchQuery}`
            }

            if (this.activeTab !== 'products') {
              query += `${query.includes('?') ? '&' : '?'}tab=${this.activeTab}`
            }

            window.history.replaceState(null, null, encodeURI(query))
          },

          generateFilters() {
            // loop through all tags in category (from shopify)
            this.tags.forEach((tag) => {
              // let foundOption = false
              const localTag = tag.toLowerCase()

              // match to existing NORMAL options normal tags (no ranges)
              this.filterOptions.filter(option => (
                option.name !== 'Price'
                && option.name !== 'Rating'
              )).forEach((option, index) => {
                option.strings.forEach((optionString) => {
                  optionString = optionString.toLowerCase()

                  if (
                    localTag === optionString
                    && !this.filterOptions[index].options.find(filterOption => filterOption.name.toLowerCase() === tag.toLowerCase()) //eslint-disable-line
                  ) {
                    // push key to checkedOptions for v-model
                    this.$set(this.checkedOptions, option.name, [])


                    // push to available options
                    this.filterOptions[index].options.push({
                      name  : tag,
                      value : localTag,
                    })
                  }
                })
              })

              // range option
              // can be expanded to other ranges like this one
              const rangeOption = this.filterOptions.find(option => option.name === 'Range')
              if (rangeOption) {
                const tagInt = parseInt(tag, 10)

                rangeOption.strings.forEach((optionString) => {
                  rangeOption.ranges.forEach((range) => {
                    if (
                      localTag.includes(optionString)
                      && !rangeOption.options.find(wo => wo.name === range.name)
                    ) {
                      if (
                        tagInt >= range.min
                        && tagInt <= range.max
                      ) {
                        // push key to checkedOptions for v-model
                        this.$set(this.checkedOptions, rangeOption.name, [])

                        // push to available options
                        rangeOption.options.push({
                          name    : range.name,
                          strings : rangeOption.strings,
                          value   : {
                            min : range.min,
                            max : range.max,
                          },
                        })
                      } else if (
                        tagInt >= 50000
                        && range.max === null
                      ) {
                        // push key to checkedOptions for v-model
                        this.$set(this.checkedOptions, rangeOption.name, [])

                        // push to highest available option
                        rangeOption.options.push({
                          name    : range.name,
                          strings : rangeOption.strings,
                          value   : {
                            min : range.min,
                            max : range.max,
                          },
                        })
                      }
                    }
                  })
                })

                // order range options
                rangeOption.options.sort((a, b) => ((a.value.min > b.value.min) ? 1 : -1))
              }

              // push the rest to the others option
              // else set it to others
              // we're assuming others is always last
              // if(!Object.prototype.hasOwnProperty(this.checkedOptions, 'Other Filters')) {  //eslint-disable-line
              //   this.$set(this.checkedOptions, 'Other Filters', [])
              // }

              // if (
              //   !foundOption
              //   && !this.filterOptions[this.filterOptions.length - 1].options.find(filterOption => filterOption.name === tag) //eslint-disable-line
              // ) {
              //   this.filterOptions[this.filterOptions.length - 1].options.push({
              //     name  : tag,
              //     value : localTag,
              //   })
              // }
            })

            // loop through all vendors in category
            if (this.enableVendorFilter) {
              const vendorOption = this.filterOptions.find(option => option.name === 'Vendor')
              if (vendorOption) {
                this.$set(vendorOption, 'strings', this.vendors)
                this.$set(this.checkedOptions, 'Vendor', [])

                this.vendors.forEach((vendor) => {
                  if (!vendorOption.options.find(v => v.name.toLowerCase() === vendor.toLowerCase())) {
                    vendorOption.options.push({
                      name  : vendor,
                      value : vendor.toLowerCase(),
                    })
                  }
                })
              }
            }

            // loop through all types in category
            const typeOption = this.filterOptions.find(option => option.name === 'Product Type')
            if (typeOption) {
              this.$set(typeOption, 'strings', this.types)
              this.$set(this.checkedOptions, 'Product Type', [])

              this.types.forEach((type) => {
                if (!typeOption.options.find(v => v.name.toLowerCase() === type.toLowerCase())) {
                  typeOption.options.push({
                    name  : type,
                    value : type.toLowerCase(),
                  })
                }
              })
            }

            // loop through all sizes in category
            const sizeOption = this.filterOptions.find(option => option.name === 'Size')
            if (sizeOption) {
              this.$set(sizeOption, 'strings', this.sizes)
              this.$set(this.checkedOptions, 'Size', [])

              this.sizes.forEach((size) => {
                if (!sizeOption.options.find(s => s.name.toLowerCase() === size.toLowerCase())) {
                  sizeOption.options.push({
                    name  : size,
                    value : size.toLowerCase(),
                  })
                }
              })
            }

            // price range
            const priceOption = this.filterOptions.find(option => option.name === 'Price')
            if (priceOption) {
              priceOption.ranges.forEach((range) => {
                this.prices.forEach((price) => {
                  if (
                    (
                      price >= range.min
                      && price <= range.max
                      && !priceOption.options.find(optionPrice => optionPrice.name === range.name)
                    )
                    || (
                      price >= 500
                      && range.max === null
                      && price >= range.min
                      && !priceOption.options.find(optionPrice => optionPrice.name === range.name)
                    )
                  ) {
                    // push key to checkedOptions for v-model
                    this.$set(this.checkedOptions, priceOption.name, [])

                    // push to available options
                    priceOption.options.push({
                      name  : range.name,
                      value : {
                        min : range.min,
                        max : range.max,
                      },
                    })
                  }
                })
              })
            }

            if (this.enableRatingsFilter) {
              // rating option
              const ratingOption = this.filterOptions.find(option => option.name === 'Rating')
              if (ratingOption) {
                ratingOption.ranges.forEach((range) => {
                  this.ratings.forEach((rating) => {
                    if (
                      (
                        rating >= range.min
                      && rating <= range.max
                      && !ratingOption.options.find(option => option.name === range.name)
                      )
                    || (
                      rating >= 4
                      && range.max === null
                      && rating >= range.min
                      && !ratingOption.options.find(option => option.name === range.name)
                    )
                    ) {
                    // push key to checkedOptions for v-model
                      this.$set(this.checkedOptions, ratingOption.name, [])

                      // push to available options
                      ratingOption.options.push({
                        name  : range.name,
                        value : {
                          min : range.min,
                          max : range.max,
                        },
                      })
                    }
                  })
                })
              }
            }

            // open sort by default on mobile
            this.$set(this.filterToggles, 'sort', true)

            // Set first option to be open initially
            if (Object.keys(this.filterOptions).length > 0) {
              for (let i = 0; i < this.filterOptions.length; i += 1) {
                if (this.filterOptions[i].options.length > 1) {
                  this.toggleFilter(this.filterOptions[i].name)

                  return
                }
              }
            }
          },

          sortFilterOptions() {
            this.filterOptions.forEach((option) => {
              option.options = option.options.sort((a, b) => {
                if (a.value.match('.*\\d.*') || b.value.match('.*\\d.*')) {
                  return a.value.replace(/\D/g, '').localeCompare(b.value.replace(/\D/g, ''), 'en', { numeric: true })
                }

                return a.value.localeCompare(b.value)
              })
            })
          },

          uncheckOption(sentOption) {
            Object.keys(this.checkedOptions).forEach((option) => {
              this.checkedOptions[option].forEach((o, i) => {
                if (o.name === sentOption.name) {
                  this.checkedOptions[option].splice(i, 1)
                }
              })
            })
          },

          clearCheckedOptions() {
            Object.keys(this.checkedOptions).forEach((option) => {
              this.checkedOptions[option] = []
            })

            window.scrollTo(0, 0)
          },

          // deprecated; old functionality
          productInCheckedFilterOptions(sentId) {
            if (this.loading) return true

            return this.paginatedProducts.find(product => product.id === sentId)
          },

          triggerLazyload() {
            this.$nextTick(() => {
              document.querySelectorAll('.product .product-image').forEach((el) => {
                el.classList.add('lazyload')
                el.classList.remove('lazyloaded')
              })
            })
          },

          toggleFilter(filterName) {
            this.$set(this.filterToggles, filterName, !this.filterToggles[filterName])
          },

          toggleFilters() {
            this.showFilters = !this.showFilters
            window.localStorage.setItem('showCategoryFilters', this.showFilters)
          },

          generateProductUrl(handle) {
            let url = window.location.pathname
            if (url.includes('/search')) url = url.replace('/search', '')
            if (url.includes('/collections/')) url = '/collections/' + url.replace('/collections/', '').split('/')[0] //eslint-disable-line

            return `${url}/products/${handle}`
          },

          changeVendorToBrand(title) {
            if (title === 'Vendor') return 'Brand'

            return title
          },

          isSwatch(filterName) {
            return filterName.toLowerCase() === 'color' || filterName.toLowerCase() === 'size'
          },

          activateTab(name) {
            this.activeTab = name
            this.updateURL()
          },

          checkForRelatedColorSwatch() {
            if (Object.prototype.hasOwnProperty.call(this.actualCheckedOptions, 'Color')) {
              this.actualCheckedOptions.Color.forEach((color) => {
                // Double next tick to make sure DOM renders fully, or if swatch has BOTH options
                this.$nextTick(() => {
                  this.$nextTick(() => {
                    const visibleColorSwatches = document.querySelectorAll(`.swatch[class*="${color.name.replace(/ /g, '-').toLowerCase()}"]`)
                    visibleColorSwatches.forEach((swatch) => {
                      swatch.click()
                    })
                  })
                })
              })
            }
          },
        },
      })
    }
  }
})
