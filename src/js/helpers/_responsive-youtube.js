function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el)
  wrapper.appendChild(el)
}

export default function responsiveYoutube() {
  document.querySelectorAll('iframe[src*="youtube"]').forEach((video) => {
    const videoWrapper = document.createElement('div')
    videoWrapper.classList.add('video-responsive')

    const videoOuterWrapper = document.createElement('div')
    videoOuterWrapper.classList.add('video-responsive-wrapper')

    wrap(video, videoOuterWrapper)
    wrap(video, videoWrapper)
  })
}
