import Vue from 'vue'
import store from './store/index'
import geolocate from './helpers/_geolocate'
import StickyNav from './_sticky-nav'

export default function cart() {
  // cart icon
  const announcementBar = document.getElementById('announcement-bar')
  if (announcementBar) {
    new Vue({
      store,
      el         : announcementBar,
      delimiters : ['${', '}'],

      data() {
        return {
          cartChanged   : false,
          announcements : window.announcements,
          geocode       : '',
        }
      },

      computed: {
        announcement() {
          if (this.announcements[this.geocode]) return this.announcements[this.geocode].message

          return ''
        },
      },

      async mounted() {
        this.geocode = await geolocate()
        this.$nextTick(() => {
          new StickyNav()
        })
      },
    })
  }
}
