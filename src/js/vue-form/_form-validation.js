export default {
  scrollToError(formState) {
    const topElement = document.querySelector('.vf-invalid')

    Object.keys(this.formState.$error).forEach((field) => {
      formState[field].$touched = true
    })

    if (topElement) {
      topElement.scrollIntoView({ behavior: 'smooth' })
      topElement.focus()
    }
  },

  validateForm() {
    Object.values(this.formState).forEach((val) => {
      if (Object.hasOwnProperty.call(val, '$touched')) {
        val.$touched = true
      }
    })

    if (!this.formState.$invalid && this.formState.$valid) {
      return true
    }

    this.scrollToError(this.formState)

    return false
  },
}
