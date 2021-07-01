<template>
  <form
    class="search-input-form"
    :class="{ 'desktop-search-input-form': !isMobile, 'mobile-search-input-form': isMobile }"
    action="/search"
    method="get"
    role="search"
  >
    <button
      type="submit"
      class="link search-link"
    >
      <div class="search" />
    </button>
    <input
      v-model="localSearchQuery"
      class="search-input"
      type="search"
      name="q"
      placeholder="Search for products, brands..."
      autocomplete="off"
      required
      @focus="emitFocused()"
      @keyup.esc="emitClose()"
    >
  </form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    isMobile: {
      type    : Boolean,
      default : false,
    },
  },

  data() {
    return {
      localSearchQuery : '',
      timeout          : 0,
    }
  },

  computed: {
    ...mapState('search', [
      'searchQuery',
      'loadingResults',
    ]),
  },

  watch: {
    searchQuery() {
      this.matchQuery()
    },

    localSearchQuery() {
      clearTimeout(this.timeout)
      if (!this.loadingResults) {
        this.timeout = setTimeout(() => {
          this.$store.dispatch('search/fetchSearch', this.localSearchQuery)
        }, 200)
      }
    },
  },

  mounted() {
    this.matchQuery()
  },

  methods: {
    matchQuery() {
      if (this.searchQuery !== this.localSearchQuery) this.localSearchQuery = this.searchQuery
    },

    emitClose() {
      if (this.searchQuery === '' && this.localSearchQuery === '') {
        this.$emit('close')
      }
    },

    emitFocused() {
      this.$emit('focused')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.search-input-form {
  display: flex;
  width: 100%;
  margin: 0;

  input {
    box-shadow: none !important; //override PF&S
  }

  // https://medium.com/@rion.mrk/how-to-remove-x-icon-from-search-input-field-or-input-type-search-db3c808405fb
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration { display: none; }

  .search-link {
    padding: 0.325em 1em !important;
    margin-right: 0;
    width: 1.4rem;
    height: 1.4rem;
    background: url('~Src/assets/search.svg') no-repeat;
    background-size: contain;
    border: none;
  }

  &.desktop-search-input-form {
    margin-left: 1.25em;

    input {
      padding: 0;
      border: none;
      background: transparent;
    }
  }

  &.mobile-search-input-form {
    position: relative;

    .search-link {
      position: absolute;
      top: 33px;
      margin-left: 1em;
    }

    input {
      padding-left: 3em;
    }
  }
}
</style>
