export default {
  validators: {
    matches: function matches(value, attrValue) {
      if (!attrValue) {
        return true
      }

      return value === attrValue
    },
  },
}
