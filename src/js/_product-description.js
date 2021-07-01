import Vue from 'vue'

export default function productDescription() {
  const description = document.getElementById('product-description')

  if (description) {
    new Vue({
      el         : description,
      delimiters : ['${', '}'],

      data() {
        return {
          descriptionToggles: {
            description: true,
          },
        }
      },

      methods: {
        toggleDescriptionAccordion(accordionName) {
          this.$set(this.descriptionToggles, accordionName, !this.descriptionToggles[accordionName])
        },
      },
    })
  }
}
