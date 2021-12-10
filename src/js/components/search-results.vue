<template>
  <div
    v-if="computedSearchResultProducts.length > 0 || searchTerms.length > 0"
    class="search-results"
    :class="{ 'show-mobile': showMobile }"
  >
    <div class="search-results-inner">
      <div class="search-terms">
        <div
          v-if="Object.keys(computedAltSearchResults).length > 0"
        >
          <div
            v-for="group in computedAltSearchResults"
            :key="group.key"
            class="alt-results-group"
          >
            <h6 class="alt-result-key">
              {{ group.key }}
            </h6>
            <div
              v-for="result in group.results"
              :key="result.id"
              class="alt-result"
            >
              <a
                :href="result.url"
                :title="result.title"
              >{{ result.title }}</a>
            </div>
          </div>
        </div>

        <div v-else-if="searchTerms.length > 0">
          <h6>Most popular searches</h6>
          <div
            v-for="term in searchTerms"
            :key="term"
            class="search-term"
            :class="{ 'active': searchQuery.toLowerCase() === term.toLowerCase() }"
          >
            <a
              href="#"
              :title="`Search all ${ term }`"
              @click.prevent="setSearchQuery(term)"
            >
              {{ term }}
            </a>
          </div>
        </div>
      </div>

      <div
        v-show="
          loadingResults
            || (!loadingResults && (!computedSearchResultProducts || computedSearchResultProducts.length == 0))
        "
        class="search-products-wrapper"
      >
        <h6 class="top-products-header">
          Loading products
        </h6>
        <simplebar
          data-simplebar-auto-hide="true"
          data-simplebar-force-visible="false"
          class="search-products product-list-wrapper product-list row"
        >
          <div
            v-for="(product, i) in featuredSearchResults.products"
            :key="i"
            class="search-product product column-6"
          >
            <a
              class="product-image-wrapper"
              :href="product.url"
              :title="product.title"
              @click="(e) => { e.preventDefault(); e.stopPropagation(); }"
            >
              <div class="image-wrap">
                <img
                  class="product-image"
                  :src="placeholderImageUrl"
                  :source="product.featured_image.url"
                  :alt="product.featured_image.alt"
                  :width="product.featured_image.width"
                  :height="product.featured_image.height"
                >
              </div>
            </a>
            <div
              class="product-info"
              style="visibility: hidden"
            >
              <h5 class="vendor">
                {{ product.vendor }}
              </h5>
              <a
                :href="product.url"
                :title="product.title"
                @click="(e) => { e.preventDefault(); e.stopPropagation(); }"
              >
                <h5>{{ product.title }}</h5>
              </a>
              <h5
                v-if="parseFloat(product.compare_at_price_min) > parseFloat(product.price)"
                class="original-price"
              >
                {{ product.compare_at_price_min | currency }}
              </h5>
              <h5 class="price">
                {{ product.price | currency }}
              </h5>
            </div>
          </div>
        </simplebar>

        <div
          style="visibility: hidden"
          class="view-all"
        >
          <a
            href="#"
            title="View All Search Products"
            @click.prevent="submitForm()"
          >View All</a>
        </div>
      </div>

      <div
        v-show="
          !loadingResults
            && searchResults.products
            && searchResults.products.length === 0
            && searchQuery !== ''
        "
      >
        <h4 class="results-text">
          No product results for '{{ searchQuery }}'
        </h4>
      </div>

      <div
        v-show="
          !loadingResults && computedSearchResultProducts.length > 0
            && !(
              searchResults.products
              && searchResults.products.length === 0
              && searchQuery !== ''
            )
        "
        class="search-products-wrapper"
      >
        <h6
          v-if="!searchResults.products || searchResults.products.length <= 0"
          class="top-products-header"
        >
          Featured products
        </h6>
        <h6
          v-else
          class="top-products-header"
        >
          Products
        </h6>

        <simplebar
          data-simplebar-auto-hide="true"
          data-simplebar-force-visible="false"
          class="search-products product-list-wrapper product-list row"
        >
          <div
            v-for="(product, i) in computedSearchResultProducts"
            :key="`${product.id}-${i}`"
            class="search-product product column-6"
          >
            <a
              class="product-image-wrapper"
              :href="product.url"
              :title="product.title"
            >
              <div
                class="image-wrap"
                :style="{ 'background': `url(${placeholderImageUrl})` }"
              >
                <vue-image
                  class="product-image"
                  :width="293"
                  :height="placeholderHeight"
                  :source="product.featured_image.url"
                  :alt="product.title"
                />
              </div>
            </a>
            <div class="product-info">
              <h5 class="vendor">
                {{ product.vendor }}
              </h5>
              <a
                :href="product.url"
                :title="product.title"
              >
                <h5>{{ product.title }}</h5>
              </a>
              <h5
                v-if="parseFloat(product.compare_at_price_min) > parseFloat(product.price)"
                class="original-price"
              >
                {{ product.compare_at_price_min | currency }}
              </h5>
              <h5 class="price">
                {{ product.price | currency }}
              </h5>
            </div>
          </div>
        </simplebar>

        <div
          :class="{
            'view-all-hide': loadingResults
              || (!loadingResults && (
                !computedSearchResultProducts
              || computedSearchResultProducts.length <= 1
              || searchQuery.length <= 0)
              )
              ? 'hidden' : ''
          }"
          class="view-all"
        >
          <a
            href="#"
            title="View All Search Products"
            @click.prevent="submitForm()"
          >View All</a>
        </div>
      </div>
    </div>
    <div
      class="search-results-overlay"
      @click="close"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'
import vueImage from './vue-image'
import currency from '../helpers/_currency'

export default {
  components: {
    simplebar,
    vueImage,
  },

  filters: {
    currency,
  },

  props: {
    inputFocused: {
      type    : Boolean,
      default : false,
    },
  },

  data() {
    let placeholderHeight = this.height || 293
    const aspectRatio = window.themeSettings.placeholderImageAspectRatio || false

    if (aspectRatio && aspectRatio === '4:5') {
      placeholderHeight = 366
    }

    return {
      placeholderHeight,
      placeholderImageUrl : (window.themeSettings && window.themeSettings.placeholderImageUrl) || '',
      searchTerms         : (window.themeSettings && window.themeSettings.searchTerms) || '',
    }
  },

  computed: {
    ...mapState('search', [
      'searchQuery',
      'searchResults',
      'featuredSearchResults',
      'loadingResults',
    ]),

    computedSearchResultProducts() {
      if (this.searchResults.products && this.searchResults.products.length > 0) {
        return this.searchResults.products
      }

      if (this.featuredSearchResults.products && this.featuredSearchResults.products.length > 0) {
        return this.featuredSearchResults.products
      }

      return []
    },

    computedAltSearchResults() {
      const order = ['collections', 'pages', 'articles']
      let results = []
      Object.keys(this.searchResults).forEach((key) => {
        if (key !== 'products' && this.searchResults[key].length > 0) {
          results.push({
            key,
            results: this.searchResults[key],
          })
        }
      })

      // sort results based on our requirements
      results = results.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))

      return results
    },

    showMobile() {
      return (this.searchQuery.length > 0 && this.searchTerms.length > 0) || this.inputFocused
    },
  },

  mounted() {
    this.$store.dispatch('search/fetchFeaturedSearch')
  },

  methods: {
    setSearchQuery(term) {
      this.$store.dispatch('search/fetchSearch', term)
    },

    close() {
      this.$emit('close')
    },

    submitForm() {
      const parentForm = this.$el.parentElement.querySelector('.search-input-form')
      if (parentForm) parentForm.submit()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';

.search-results {
  display: none;

  &.show-mobile {
    display: block;
  }

  @media(min-width: $desktop) {
    display: block;
  }
}

.search-results-inner {
  position: relative;
  grid-template-columns: 1.5fr 7fr;
  grid-column-gap: 2em;
  padding: 1em 1.25em;
  margin: 0 auto;
  max-width: $max-width;
  z-index: 1;

  @media(min-width: $desktop) {
    display: grid;
  }

  .search-terms {
    display: inline-block;
    padding: 2em 0;

    @media(max-width: $desktop - 1) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 1rem 0 0;
    }

    h6 {
      margin-bottom: 1rem;
    }

    a {
      text-decoration: none;
    }
  }

  .search-term, .alt-result {
    position: relative;
    padding: 0.25em 0;
    margin-bottom: 0.25em;

    &:last-of-type {
      margin-bottom: 1.5em;
    }
  }

  .alt-results-group .alt-result &:last-of-type {
    margin-bottom: 0;
  }

  .alt-result-key {
    text-transform: capitalize;
  }
}

.search-products-wrapper {
  margin: 0 auto;
  width: 100%;

  .top-products-header {
    margin-top: 1.5rem;
    margin-bottom: 0;

    @media(min-width: $desktop) {
      margin-top: 2rem;
    }

    + .search-products .search-product {
      margin-top: 1.5rem;
      margin-bottom: 0.5em;
      padding-right: 0;
    }
  }
}

.view-all {
  text-align: right;
  margin: 1.25em 0 0.5em;

  &.view-all-hide {
    display: none;

    @media(min-width: $tablet) {
      display: block;
      visibility: hidden;
    }
  }

  @media(min-width: $desktop) {
    margin-bottom: 1em;
  }
}

.results-text {
  margin: 2rem 0;
}

@media(min-width: $desktop) {
  .search-results-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--shop-overlay);
      pointer-events: none;
      user-select: none;
      z-index: -1;
    }
  }
}
</style>
