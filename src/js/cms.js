// category page
import Vue from 'vue'
// import VueForm from 'vue-form'
// import VueRecaptcha from 'vue-recaptcha'
// import formOptions from './vue-form/options'
// import formValidationMethods from './vue-form/_form-validation'
import variables from '../scss/_variables.scss'
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

      data() {
        return {
          variables,
        }
      },

      methods: {
        showColor(sassVar, key) {
          return sassVar.type === 'SassColor'
            && key !== '$overlay'
            && sassVar.value.a === 1
            && !key.includes('primary')
            && !key.includes('secondary')
        },
      },
    })
  }

  // --------
  // FAQ
  // --------
  const faq = document.getElementById('faq')
  if (faq) {
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
