import Vue from 'vue'
import { mapState } from 'vuex'
import PortalVue from 'portal-vue'
import store from './store/index'
import formatMoney from './helpers/_format-money'
import getUrlParameter from './helpers/_get-url-param'
import quantityInput from './components/quantity-input'
import modal from './components/modal'
import currency from './helpers/_currency'

// plugins
Vue.use(PortalVue)

export default function rhpa() {
  const rhpaEl = document.getElementById('rhpa')

  if (rhpaEl) {
    new Vue({
      store,
      el         : rhpaEl,
      delimiters : ['${', '}'],

      components: {
        quantityInput,
        modal,
      },

      filters: {
        currency,
      },

      data() {
        return {
          formQuantity                : 1,
          productInitialOriginalPrice : JSON.parse(JSON.stringify(window.productOriginalPrice)),
          productOriginalPrice        : window.productOriginalPrice,
          productInitialPrice         : JSON.parse(JSON.stringify(window.productPrice)),
          productVendor               : window.productVendor,
          productPrice                : window.productPrice,
          productVariantOptions       : window.productData.options,
          productVariants             : window.productData.variants,
          customerTags                : window.themeSettings.customerTags,
          optionSelections            : {
            1 : null,
            2 : null,
            3 : null,
          },
          showSizeChart : false,
          isRecharge    : window.productData.selling_plan_groups && window.productData.selling_plan_groups.length > 0,
        }
      },

      computed: {
        ...mapState('cart', [
          'cartData',
          'PdpError',
          'addingToCart',
        ]),

        originalPriceWithQuantity() {
          return this.formQuantity > 1
            ? this.formatMoney(this.productInitialOriginalPrice * this.formQuantity)
            : this.formatMoney(this.productInitialOriginalPrice)
        },

        option1Options() {
          const options = []
          this.productVariants.forEach((variant) => {
            if (
              Object.prototype.hasOwnProperty.call(variant, 'option1')
              && variant.option1
              && !options.includes(variant.option1)
            ) {
              options.push(variant.option1)
            }
          })

          return options
        },

        option2Options() {
          const options = []
          this.productVariants.forEach((variant) => {
            if (
              Object.prototype.hasOwnProperty.call(variant, 'option2')
              && variant.option2
              && !options.includes(variant.option2)
            ) {
              options.push(variant.option2)
            }
          })

          return options
        },

        option3Options() {
          const options = []
          this.productVariants.forEach((variant) => {
            if (
              Object.prototype.hasOwnProperty.call(variant, 'option3')
              && variant.option3
              && !options.includes(variant.option3)
            ) {
              options.push(variant.option3)
            }
          })

          return options
        },

        selectedOptionVariant() {
          return this.productVariants.find((variant) => {
            if (
              variant.option1 === this.optionSelections[1]
              && variant.option2 === this.optionSelections[2]
              && variant.option3 === this.optionSelections[3]
            ) {
              return variant
            }

            return false
          })
        },

        hasDiscount() {
          return parseFloat(this.computedProductOriginalPrice) > parseFloat(this.productPrice.replace(/[,$.]/g, ''))
        },

        InvalidVariantSelections() {
          let optionsString = ''

          Object.keys(this.optionSelections).forEach((option, i) => {
            if (!this.optionSelections[option] && this.productVariantOptions[i]) {
              const optionSplitText = () => {
                if (optionsString !== '') {
                  // only 3 options so this works
                  if (optionsString.includes(',')) {
                    return 'and '
                  }

                  // replaced below
                  return ', '
                }

                return ''
              }

              optionsString += `${optionSplitText()}${this.productVariantOptions[i].toLowerCase()}`
            }
          })

          if (optionsString === '') return false

          // then replace if upper doesnt work
          if (!optionsString.includes('and')) {
            optionsString = optionsString.replace(',', ' and')
          }

          return `Select a ${optionsString}`
        },

        computedProductOriginalPrice() {
          const comparePrice = this.selectedOptionVariant
            && this.selectedOptionVariant.compare_at_price
          if (comparePrice) return parseFloat(comparePrice)

          if (
            !comparePrice
            && this.selectedOptionVariant
            && Object.prototype.hasOwnProperty.call(this.selectedOptionVariant, 'price')
          ) {
            return parseFloat(this.selectedOptionVariant.price)
          }

          return this.productInitialOriginalPrice
        },

        computedProductOriginalPriceFormatted() {
          return this.formatMoney(this.computedProductOriginalPrice * this.formQuantity)
        },
      },

      watch: {
        optionSelections: {
          deep: true,
          handler() {
            this.updateConfig()
            this.$forceUpdate() // force rerender for "outOfStock check"
            this.setSelectedOptionInURL()

            // if no selection, but a color is selected
            // try to find matching image
            this.$nextTick(() => {
              if (!this.selectedOptionVariant) {
                const currentColorSelected = document.querySelector('.color-swatch input:checked')
                if (currentColorSelected) {
                  const foundVariant = this.productVariants.find(variant => variant.options.includes(currentColorSelected.value)) //eslint-disable-line
                  if (foundVariant) {
                    const foundVariantId = foundVariant.featured_image && foundVariant.featured_image.id
                    const closeToCurrentVariantImage = document.querySelector(`div[data-variantid="${foundVariantId}"]`)
                    if (foundVariantId && closeToCurrentVariantImage) {
                      closeToCurrentVariantImage.click()
                      // set offset top for image inside simplebar wrapper
                      const simplebarWrapper = document.querySelector('.additional-images-wrapper .simplebar-content-wrapper')
                      if (simplebarWrapper) {
                        simplebarWrapper.scrollTop = closeToCurrentVariantImage.offsetTop
                      }
                    }
                  }
                }
              }
            })
          },
        },

        formQuantity(val) {
          if (this.formQuantity) {
            this.updateConfig()
          } else {
            this.productPrice = this.formatMoney(this.productInitialPrice * val)
            this.productOriginalPrice = this.formatMoney(this.productInitialOriginalPrice * val)
          }
        },

        selectedOptionVariant() {
          // select the correct variant image, if present
          const currentVariantImageID = this.selectedOptionVariant
          && this.selectedOptionVariant.featured_image
          && this.selectedOptionVariant.featured_image.id
          const currentVariantImage = document.querySelector(`.additional-images-wrapper div[data-variantid="${currentVariantImageID}"]`)
            || document.querySelector(`div[alt*="${this.selectedOptionVariant.option1}"]`)

          if (currentVariantImage) {
            currentVariantImage.click()

            // set offset top for image inside simplebar wrapper
            const simplebarWrapper = document.querySelector('.additional-images-wrapper .simplebar-content-wrapper')
            if (simplebarWrapper) {
              simplebarWrapper.scrollTop = currentVariantImage.offsetTop
            }
          }

          // logic for when we don't use additional image swatches
          if (this.selectedOptionVariant && window.mobileSlider && this.productVariants.length > 1) {
            this.productVariants.forEach((variant) => {
              if (variant.id === this.selectedOptionVariant.id) {
                const variantImage = document.getElementById(variant.featured_image.id)
                if (variantImage) {
                  const imageIndex = variantImage.dataset.index
                  if (imageIndex) {
                    window.mobileSlider.goTo(imageIndex - 1)
                  }
                }
              }
            })
          }

          // check for OOS
          // Dont if we have Klaviyo BIS
          // this.checkOOSSelected()
        },
      },

      mounted() {
        this.selectOptions()

        window.addEventListener('load', () => {
          this.reinitializeJudgeMe()
          window.isFirstTime = false // see product.js
        })

        // recharge price watcher
        // shameful; since the radio buttons are not available on page load
        // we have to watch clicks on the entire form :\
        if (this.isRecharge) {
          document.querySelector('form[action="/cart/add"]').addEventListener('click', () => {
            this.updateConfig()
          })
        }
      },

      methods: {
        formatMoney,
        getUrlParameter,

        selectOptions() {
          this.selectOptionsFromURL()

          this.updateConfig()

          // check if only has one option
          // for simple products only
          // if there's more than one, we require a selection
          // which is why below is commented out
          if (this.productVariants.length <= 1) {
            this.optionSelections[1] = this.option1Options[0] //eslint-disable-line
          }

          // set default options
          // Right now only preselecting if it's the only option
          // such as only one color
          [this.option1Options, this.option2Options, this.option3Options].forEach((option, i) => {
            if (option.length === 1 && (!this.optionSelections[i + 1] || this.optionSelections[i + 1].length <= 0)) {
              this.optionSelections[i + 1] = option[0] //eslint-disable-line
            }
          })

          // then check for oos options
          // only check if URL does not already contain a variant
          // if (!window.location.search.includes('variant=')) {
          //   this.checkOOSSelected()
          // }
        },

        checkOOSSelected() {
          this.$nextTick(() => {
            // use DOM to find selected & disabled option
            const selectedDisabledVariant = document.querySelector('.swatches-wrapper .oos input:checked')
            const closestAvailableOption = selectedDisabledVariant
            && selectedDisabledVariant.parentElement.parentElement.querySelector('.swatches-wrapper .swatch:not(.oos) input')

            if (selectedDisabledVariant && closestAvailableOption) {
              closestAvailableOption.click()
            }
          })
        },

        selectOptionsFromURL() {
          if (window.location.search.includes('variant=')) {
            const searchVariant = this.getUrlParameter('variant')
            this.productVariants.forEach((variant) => {
              // loose comparison for string vs int
              if (variant.id == searchVariant) { // eslint-disable-line
                this.optionSelections[1] = variant.option1
                this.optionSelections[2] = variant.option2
                this.optionSelections[3] = variant.option3
                const mainImage = document.querySelector('.main-image')
                if (mainImage && mainImage.dataset.placeholder) mainImage.src = mainImage.dataset.placeholder
              }
            })
          }
        },

        setSelectedOptionInURL() {
          this.$nextTick(() => {
            if (this.selectedOptionVariant) {
              let query = window.location.search
              if (window.location.search.includes('variant=')) {
                query = query.replace(/(variant=).*?(&|$)/, `$1${this.selectedOptionVariant.id}$2`)
              } else {
                query += `${query.includes('?') ? '&' : '?'}variant=${this.selectedOptionVariant.id}`
              }

              window.history.replaceState(null, null, encodeURI(query))
            }
          })
        },

        outOfStock(sentItem, sentIndex) {
          // check first level, then second level, then third
          // each level down, it has to match the one above it
          // If previous option isn't selected, return
          const sentVariant = this.productVariants.find((variant) => {
            if (variant.available) {
              if (sentIndex === 1) {
                return variant.options.includes(sentItem)
              } if (sentIndex === 2) {
                if (!this.optionSelections[1]) return true

                return variant.options.includes(sentItem)
                && variant.options.includes(this.optionSelections[1])
              } if (sentIndex === 3) {
                if (!this.optionSelections[1] || !this.optionSelections[2]) return false

                return variant.options.includes(sentItem)
                && variant.options.includes(this.optionSelections[1])
                && variant.options.includes(this.optionSelections[2])
              }
            }

            return false
          })

          if (!sentVariant) {
            return true
          }

          return false
        },

        addToCart(e) {
          e.preventDefault()

          const payload = {
            quantity : this.formQuantity,
            id       : this.selectedOptionVariant.id,
          }

          // recharge
          let sellingPlan = document.querySelector('[data-plans-dropdown]') || false
          if (sellingPlan) {
            sellingPlan = parseInt(sellingPlan.value, 10)
            payload.selling_plan = sellingPlan
          }

          this.$store.dispatch('cart/addToCart', payload)
          console.log(this.$store)
        },

        updateConfig() {
          if (!this.selectedOptionVariant) {
            this.productPrice = this.formatMoney(this.productInitialPrice * this.formQuantity)
            this.productOriginalPrice = this.formatMoney(this.productOriginalPrice)
          } else {
            this.productPrice = this.formatMoney(this.selectedOptionVariant.price * this.formQuantity)
            this.productOriginalPrice = this.selectedOptionVariant.price
          }
        },

        reinitializeJudgeMe() {
          if (window.judgeme) {
            window.judgeme.caches = {
              $revWidgets : document.querySelector('.jdgm-review-widget'),
              $prevBadges : document.querySelector('.jdgm-preview-badge'),
            }
            window.judgeme.customizeBadges()
            window.judgeme.initializeWidgets()
          }
        },

        toggleSizeChart() {
          this.showSizeChart = !this.showSizeChart
          if (this.showSizeChart) {
            document.body.classList.add('no-scroll')
          } else {
            document.body.classList.remove('no-scroll')
          }
        },
      },
    })
  }
}
