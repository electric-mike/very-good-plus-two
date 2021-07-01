export default {
  namespaced: true,

  state: {
    searchQuery           : '',
    searchResults         : {},
    featuredSearchResults : {},
    loadingResults        : false,
  },

  mutations: {
    setSearchQuery(state, sentSearchQuery = '') {
      state.searchQuery = sentSearchQuery
    },

    setLoadingResults(state, loading = false) {
      state.loadingResults = loading
    },

    setSearchResults(state, sentSearchResults = {}) {
      state.searchResults = sentSearchResults
    },

    setFeaturedSearchResults(state, sentSearchResults = {}) {
      state.featuredSearchResults = sentSearchResults
    },
  },

  actions: {
    async fetchFeaturedSearch(store) {
      const resourceParams = '&resources[type]=product&resources[limit]=4&resources[options][unavailable_products]=last&resources[options][fields]=title,tag'
      // @TODO why does "featured" not work, but "feature" does....
      await fetch(encodeURI(`/search/suggest.json?q=feature${resourceParams}`)).then(res => res.json()).then((res) => {
        if (res && res.resources && res.resources.results) store.commit('setFeaturedSearchResults', res.resources.results)
      })
    },

    async fetchSearch(store, query) {
      store.commit('setSearchQuery', query)
      store.commit('setLoadingResults', true)

      if (query === '') {
        store.commit('setSearchResults', {})
        store.commit('setLoadingResults', false)

        return
      }

      const resourceParams = '&resources[type]=product,article,page,collection&resources[limit]=4&resources[options][unavailable_products]=last&resources[options][fields]=title,product_type,variants.title,vendor,tag'
      await fetch(encodeURI(`/search/suggest.json?q=${query}${resourceParams}`)).then(res => res.json()).then((res) => {
        if (res && res.resources && res.resources.results) store.commit('setSearchResults', res.resources.results)
        store.commit('setLoadingResults', false)
      }).catch(() => {
        store.commit('setLoadingResults', false)
      })
    },
  },
}
