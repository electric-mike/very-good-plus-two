import responsiveYoutube from './helpers/_responsive-youtube'

document.addEventListener('DOMContentLoaded', () => {
  responsiveYoutube()

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
})
