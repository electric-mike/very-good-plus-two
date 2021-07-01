import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import cart from './modules/cart'
import search from './modules/search'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    cart,
    search,
  },
})
