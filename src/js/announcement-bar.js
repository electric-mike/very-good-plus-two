import Vue from 'vue'
import store from './store/index'
import geolocate from './helpers/_geolocate'
import StickyNav from './_sticky-nav'

export default function abar() {
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
          let threshold = this.announcements[this.geocode]
          if (!threshold && this.announcements.EU) {
            threshold = this.announcements.EU
          }

          if (threshold) return threshold.message

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
