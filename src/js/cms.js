// category page
import Vue from 'vue'
// import VueForm from 'vue-form'
// import VueRecaptcha from 'vue-recaptcha'
// import formOptions from './vue-form/options'
// import formValidationMethods from './vue-form/_form-validation'

import swatches from './helpers/_swatches'

// const CONTACT_US_FORM_URL = ''

document.addEventListener('DOMContentLoaded', () => {
  // --------
  // STYLE GUIDE
  // --------
  const styleGuide = document.getElementById('style-guide')
  if (styleGuide) {
    new Vue({
      el         : styleGuide,
      delimiters : ['${', '}'],

      computed: {
        variables() {
          /*
          Check if the stylesheet is internal or hosted on the current domain.
          If it isn't, attempting to access sheet.cssRules will throw a cross origin error.
          See https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet#Notes

          NOTE: One problem this could raise is hosting stylesheets on a CDN with a
          different domain. Those would be cross origin, so you can't access them.
          */
          const isSameDomain = (styleSheet) => {
            // Internal style blocks won't have an href value
            if (!styleSheet.href) {
              return true
            }

            return styleSheet.href.indexOf(window.location.origin) === 0
          }

          /*
          Determine if the given rule is a CSSStyleRule
          See: https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants
          */
          const isStyleRule = rule => rule.type === 1

          /**
          * Get all custom properties on a page
          * @return array<array[string, string]>
          * ex; [["--color-accent", "#b9f500"], ["--color-text", "#252525"], ...]
          */
          const getCSSCustomPropIndex = () =>
          // styleSheets is array-like, so we convert it to an array.
          // Filter out any stylesheets not on this domain
            [...document.styleSheets].filter(isSameDomain).reduce( //eslint-disable-line
              (finalArr, sheet) => finalArr.concat(
                // cssRules is array-like, so we convert it to an array
                [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule) => {
                  // NOTE: rule.styleMap is only available in Chrome and Edge
                  // at the time of this writing.
                  // See https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule/styleMap
                  // // Discard any props that don't start with "--". Custom props are required to.
                  const customProps = [...rule.styleMap.entries()].filter(
                    ([propName]) => propName.indexOf('--') === 0
                  )

                  return [...propValArr, ...customProps]
                }, [])
              ),
              []
            )

          return getCSSCustomPropIndex().reduce((str, [prop, val]) => ({ ...str, [prop]: val[0][0] }), {})
        },
      },

      methods: {
        showColor(value, key) {
          return (
            value.includes('#')
            || value.includes('rgb')
          )
          && !key.includes('overlay')
          && !key.includes('shadow')
          && !key.includes('primary')
          && !key.includes('secondary')
        },
      },
    })
  }

  // --------
  // FAQ
  // --------
  function doFaq(faq) {
    new Vue({
      el         : faq,
      delimiters : ['${', '}'],

      data() {
        return {
          toggles: {},
        }
      },

      methods: {
        toggleQuestion(index) {
          this.$set(
            this.toggles,
            index, Object.prototype.hasOwnProperty.call(this.toggles, index) ? !this.toggles[index] : true
          )
        },
      },
    })
  }
  const faq = document.getElementById('faq')
  const faqSections = document.querySelectorAll('.faq-section')
  if (faq) {
    doFaq(faq)
  } else if (faqSections) {
    faqSections.forEach(section => doFaq(section))
  }

  // --------
  // PASSWORD PAGE
  // --------
  const password = document.getElementById('password')
  if (password) {
    new Vue({
      el         : password,
      delimiters : ['${', '}'],

      data() {
        return {
          showPassword: false,
        }
      },

      mounted() {
        this.checkHash()

        window.addEventListener('popstate', () => {
          this.checkHash()
        })
      },

      methods: {
        checkHash() {
          if (window.location.hash.includes('#enter-password')) {
            this.showPassword = true
          } else {
            this.showPassword = false
          }
        },

        toggleShowPassword() {
          this.showPassword = !this.showPassword
        },
      },
    })
  }

  // --------
  // 404
  // --------
  const fourOhFour = document.getElementById('four-oh-four')
  if (fourOhFour) {
    new Vue({
      el         : fourOhFour,
      delimiters : ['${', '}'],
      mixins     : [swatches],
    })
  }

  // --------
  // FORMS
  // --------

  // contact us form
  // const contactUsForm = document.getElementById('contact-us-form')
  // if (contactUsForm) {
  //   new Vue({
  //     el         : contactUsForm,
  //     delimiters : ['${', '}'],
  //     components : { VueRecaptcha },
  //     mixins     : [new VueForm(formOptions)],
  //     data() {
  //       return {
  //         formState : {},
  //         formData  : {
  //           firstname   : '',
  //           lastname    : '',
  //           company     : '',
  //           email       : '',
  //           phone       : '',
  //           category    : '',
  //           description : '',
  //           // date: '',
  //           recaptcha   : '',
  //         },
  //         loading             : false,
  //         showSuccess         : false,
  //         showSuccessRedirect : false,
  //         showError           : false,
  //       }
  //     },

  //     methods: {
  //       ...formValidationMethods,

  //       setRecaptchaTrue(event) {
  //         this.formData.recaptcha = event
  //       },

  //       submitForm() {
  //         if (!this.loading && this.validateForm()) {
  //           this.loading = true
  //           this.showSuccess = false
  //           this.showSuccessRedirect = false
  //           this.showError = false

  //           fetch(CONTACT_US_FORM_URL, {
  //             method  : 'POST',
  //             body    : JSON.stringify(this.formData),
  //             headers : { 'Content-Type': 'application/json', Accept: 'application/json' },
  //           })
  //             .then(r => r.json())
  //             .then((response) => {
  //               if (response.status === 'success') {
  //                 // reset form
  //                 Object.keys(this.formData).forEach((key) => {
  //                   this.$set(this.formData, key, '')
  //                 })
  //                 this.formState._reset()

  //                 // show message
  //                 // set timeout to give loop above time to run
  //                 this.$nextTick(() => {
  //                   this.loading = false

  //                   // this.showSuccess = true
  //                   this.showSuccessRedirect = true
  //                   window.location.href = `${window.location.origin}/pages/thank-you?form=contact`

  //                   this.showError = false
  //                   window.scrollTo(0, 0)
  //                 })
  //               } else {
  //                 console.error(response)
  //                 this.loading = false
  //                 this.showError = true
  //                 this.showSuccess = false
  //                 this.showSuccessRedirect = false
  //                 window.scrollTo(0, 0)
  //               }
  //             })
  //             .catch((err) => {
  //               console.error(err)
  //               this.loading = false
  //               this.showError = true
  //               this.showSuccess = false
  //               this.showSuccessRedirect = false
  //               window.scrollTo(0, 0)
  //             })
  //         }
  //       },
  //     },
  //   })
  // }
})
