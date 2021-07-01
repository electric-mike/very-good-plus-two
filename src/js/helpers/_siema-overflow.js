/* eslint-disable */
import Siema from 'siema'

// READ MORE HERE
// https://github.com/pawelgrzybek/siema/issues/133

// Extend Siema to new class to create new instance
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends
class SiemaOverflow extends Siema {
  slideToCurrent(enon) {
    const currentSlide = this.config.loop ? Math.round(this.currentSlide + this.perPage) : Math.round(this.currentSlide)
    const offset = (this.config.rtl ? 1 : -1) * currentSlide * (this.selectorWidth / this.perPage) + (this.selectorWidth / (this.perPage * 4))

    // Fix siema overflow skipping around on scroll down in safari
    if(!this.windowWidth || this.windowWidth === window.innerWidth || this.windowHeight === window.innerHeight) {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
      this.oldOffset = offset

      this.sliderFrame.style[this.transformProperty] = `translate3d(${this.oldOffset}px, 0, 0)`
      return false
    }

    if (this.enableTransition) {
      // This one is tricky, I know but this is a perfect explanation:
      // https://youtu.be/cCOL7MC4Pl0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.enableTransition()
          this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`
        })
      })
    } else {
      this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`
    }
  }

  /**
  * touchmove event handler
  */
  touchmoveHandler(e) {
    e.stopPropagation()

    if (this.drag.letItGo === null) {
      this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX)
    }

    if (this.pointerDown && this.drag.letItGo) {
      e.preventDefault()
      this.drag.endX = e.touches[0].pageX
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`

      const currentSlide = this.config.loop ? Math.round(this.currentSlide + this.perPage) : Math.round(this.currentSlide)
      const currentOffset = currentSlide * (this.selectorWidth / this.perPage) - (this.selectorWidth / (this.perPage * 4))
      const dragOffset = (this.drag.endX - this.drag.startX)
      const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`
    }
  }

  /**
  * mousemove event handler
  */
  mousemoveHandler(e) {
    e.preventDefault()
    if (this.pointerDown) {
      // if dragged element is a link
      // mark preventClick prop as a true
      // to detemine about browser redirection later on
      if (e.target.nodeName === 'A') {
        this.drag.preventClick = true
      }

      this.drag.endX = e.pageX
      this.selector.style.cursor = '-webkit-grabbing'
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`

      const currentSlide = this.config.loop ? Math.round(this.currentSlide + this.perPage) : Math.round(this.currentSlide)
      const currentOffset = currentSlide * (this.selectorWidth / this.perPage) - (this.selectorWidth / (this.perPage * 4))
      const dragOffset = (this.drag.endX - this.drag.startX)
      const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`
    }
  }
}

export default SiemaOverflow
