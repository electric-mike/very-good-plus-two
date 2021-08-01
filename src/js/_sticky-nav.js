import StickyHeights from './_sticky-heights'

export default class StickyNav {
  constructor() {
    this.init()
    this.stickyHeights = new StickyHeights()
  }

  init() {
    this.elements = this.getElements()

    // have to do this to allow us to be able to remove event listener
    this.scrollListenerHandler = this.scrollListener.bind(this)
    document.addEventListener('scroll', this.scrollListenerHandler, { passive: true })
  }

  unmountClass() {
    document.removeEventListener('scroll', this.scrollListenerHandler)
    this.toggleScrollParams(false)
  }

  getElements() {
    return {
      header: document.querySelector('header'),
    }
  }

  toggleScrollParams(add) {
    if (add) {
      this.elements.header.classList.add('sticky')
      document.querySelector('main').style.marginTop = `${this.stickyHeights.elements.headerHeight}px`
    } else {
      this.elements.header.classList.remove('sticky')
      document.querySelector('main').style.marginTop = '0'
    }
  }

  scrollListener() {
    const CURRENT_OFFSET = window.pageYOffset

    if (CURRENT_OFFSET > this.lastScrollTop) {
      if (window.pageYOffset > this.stickyHeights.elements.mainTop - this.stickyHeights.elements.headerHeight) {
        this.toggleScrollParams(true)
      }
    } else if (window.pageYOffset < this.stickyHeights.elements.mainTop - this.stickyHeights.elements.headerHeight) {
      this.toggleScrollParams()
    }

    this.lastScrollTop = CURRENT_OFFSET
  }
}
