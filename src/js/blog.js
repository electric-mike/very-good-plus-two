import Vue from 'vue'
// import responsiveYoutube from './helpers/_responsive-youtube'

document.addEventListener('DOMContentLoaded', () => {
  // BUG - This file does not export on build if this file is imported,
  // so we raw dog it in here instead
  // responsiveYoutube()

  function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el)
    wrapper.appendChild(el)
  }

  // responsive youtube
  document.querySelectorAll('iframe[src*="youtube"]').forEach((video) => {
    const videoWrapper = document.createElement('div')
    videoWrapper.classList.add('video-responsive')

    const videoOuterWrapper = document.createElement('div')
    videoOuterWrapper.classList.add('video-responsive-wrapper')

    wrap(video, videoOuterWrapper)
    wrap(video, videoWrapper)
  })

  // filter change
  const BlogTagFilter = document.getElementById('BlogTagFilter')
  if (BlogTagFilter) {
    BlogTagFilter.addEventListener('change', (e) => {
      const newURL = e.target.value
      if (newURL) {
        window.location.pathname = newURL
      }
    })
  }

  // comments badge scroll
  const commentsBadge = document.getElementById('comments-count')
  if (commentsBadge) {
    commentsBadge.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()

      window.scrollTo({
        top      : document.getElementById('comments').offsetTop - (document.querySelector('header nav').getBoundingClientRect().height + 20),
        behavior : 'smooth',
      })
    })
  }

  // blog landing right area
  const blogRightArea = document.getElementById('blog-right-area')
  if (blogRightArea) {
    new Vue({
      el: blogRightArea,
      data() {
        const togglesOn = {
          search     : true,
          newsletter : true,
          posts      : true,
          categories : true,
          tags       : true,
        }

        return {
          toggles: window.innerWidth > 767 ? togglesOn : {
            search     : true,
            newsletter : true,
          },
        }
      },
      methods: {
        toggleAccordion(accordionName) {
          this.$set(this.toggles, accordionName, !this.toggles[accordionName])
        },
      },
    })
  }
})
