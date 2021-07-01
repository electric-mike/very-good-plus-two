export default class StickyHeights {
  constructor() {
    this.init()
  }

  init() {
    this.elements = this.getElements()
    this.resizeListenerHandler = this.resizeListener.bind(this)
    window.addEventListener('resize', this.resizeListenerHandler)
  }

  unmountClass() {
    window.removeEventListener('resize', this.resizeListenerHandler)
  }

  getElements() {
    let headerRect = document.querySelector('header')

    if (!headerRect) return {}

    headerRect = headerRect.getBoundingClientRect()

    return {
      headerRect,
      mainTop      : document.querySelector('main').offsetTop,
      headerHeight : headerRect.height,
    }
  }

  headerTop() {
    if (document.querySelector('header').classList.contains('sticky')) {
      return this.elements.headerHeight
    }

    return this.getElements().headerRect.bottom
  }

  resizeListener() {
    this.unmountClass()
    this.init()
  }
}
