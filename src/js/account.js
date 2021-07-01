import Vue from 'vue'
import VueForm from 'vue-form'
import formOptions from './vue-form/options'
import formValidationMethods from './vue-form/_form-validation'

function generateForm(formId) {
  new Vue({
    el         : formId,
    delimiters : ['${', '}'],

    mixins: [new VueForm(formOptions)],

    data() {
      return {
        formState : {},
        formData  : {
          firstname  : '',
          lastname   : '',
          company    : '',
          address1   : '',
          address2   : '',
          city       : '',
          country    : 'United States',
          province   : '',
          postalcode : '',
          phone      : '',
          isdefault  : false,
        },
        loading  : false,
        showForm : false,
      }
    },

    mounted() {
      const itemDataSetData = this.$el.dataset

      if (itemDataSetData.firstname) this.formData.firstname = itemDataSetData.firstname
      if (itemDataSetData.lastname) this.formData.lastname = itemDataSetData.lastname
      if (itemDataSetData.company) this.formData.company = itemDataSetData.company
      if (itemDataSetData.address1) this.formData.address1 = itemDataSetData.address1
      if (itemDataSetData.address2) this.formData.address2 = itemDataSetData.address2
      if (itemDataSetData.city) this.formData.city = itemDataSetData.city
      if (itemDataSetData.country) this.formData.country = itemDataSetData.country
      if (itemDataSetData.province) this.formData.province = itemDataSetData.province
      if (itemDataSetData.postalcode) this.formData.postalcode = itemDataSetData.postalcode
      if (itemDataSetData.phone) this.formData.phone = itemDataSetData.phone
    },

    methods: {
      ...formValidationMethods,

      submitForm() {
        if (!this.loading && this.validateForm()) {
          this.loading = true
          this.$el.querySelector('form').submit()
        }
      },
    },
  })
}

export default function account() {
  // active link
  // if (window.location.href.includes('/addresses')) {
  //   document.getElementById('view-address').classList.add('active')
  // } else if (window.location.href.includes('/account')) {
  //   document.getElementById('account').classList.add('active')
  // }

  // Forms
  const addNewForm = document.getElementById('add_address')
  const formElements = document.querySelectorAll('.edit-address')

  if (addNewForm) {
    generateForm(addNewForm)
  }

  formElements.forEach((el) => {
    generateForm(el)
  })

  // add featured link class to all ReCharge anchor tags
  if (window.location.href.includes('tools/recurring/customers')) {
    const anchorTags = document.querySelectorAll('#ReCharge .rc_layout__content a')

    anchorTags.forEach((tag) => {
      tag.classList.add('featured')
    })
  }
}
