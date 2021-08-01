// product page
import Siema from 'siema'
import rhpa from './_rhpa'
import productDescription from './_product-description'

export default function product() {
  // run RHPA
  rhpa()

  // run product description
  productDescription()

  // hover zoom
  function zoom(e) {
    const zoomer = e.currentTarget
    const offsetX = e.offsetX ? e.offsetX : e.touches && e.touches[0] && e.touches[0].pageX
    const offsetY = e.offsetY ? e.offsetY : e.touches && e.touches[0] && e.touches[0].pageX
    const x = offsetX / zoomer.offsetWidth * 100
    const y = offsetY / zoomer.offsetHeight * 100
    zoomer.style.backgroundPosition = `${x}% ${y}%`
  }

  const zoomImages = document.querySelectorAll('.zoomImg')
  if (zoomImages.length > 0) {
    zoomImages.forEach((zoomImg) => {
      zoomImg.addEventListener('mousemove', zoom, { passive: true })
    })
  }

  // change product images
  const mainImage = document.getElementById('ProductPhotoImg')
  const additionalImages = document.querySelectorAll('.additional-image')
  let currentImageSrc = ''

  // set to window for when we don't have an option selected
  window.isFirstTime = true
  function changeMainImage(sentIndex) {
    additionalImages.forEach((image, index) => {
      if (index === sentIndex) {
        image.classList.add('active')
        // mainImage.src = image.dataset.smallSrc

        currentImageSrc = image.dataset.src
        mainImage.dataset.src = currentImageSrc

        if (window.isFirstTime) {
          mainImage.classList.add('lazyload')
        } else {
          mainImage.classList.add('lazyload', 'blur-up', 'blur-up-actually')
        }

        mainImage.classList.remove('lazyloaded')
        document.querySelector('.main-image-wrapper .image-wrap').style.paddingBottom = `${100 / image.dataset.aspectratio}%`

        if (zoomImages.length < 1) {
          zoomImages.forEach((zoomImg) => {
            zoomImg.style.backgroundImage = ''
            mainImage.addEventListener('load', () => {
              zoomImg.style.backgroundImage = `url(${image.dataset.masterSrc})`
            })
          })
        }
      } else {
        image.classList.remove('active')
      }
    })

    if (window.isFirstTime) window.isFirstTime = false
  }

  if (additionalImages.length > 0) {
    /// desktop simplescroll
    const mainImageWrapper = document.querySelector('.desktop-images-wrapper .main-image')
    const localSimpleBar = false

    const observer = new MutationObserver(() => {
      const additionalImagesWrapper = document.querySelector('.desktop-images-wrapper .additional-images-wrapper')
      const mainImageHeight = mainImageWrapper.offsetHeight

      if (
        additionalImagesWrapper
          && window.SimpleBar
          && (
            // use scrollheight
            additionalImagesWrapper.scrollHeight > mainImageHeight
            || (localSimpleBar && additionalImagesWrapper.offsetHeight <= mainImageHeight)
          )
      ) {
        if (mainImage.classList.contains('lazyloaded')) {
          additionalImagesWrapper.style.maxHeight = `${mainImageHeight}px`
        }
        document.querySelector('.desktop-images-wrapper').classList.add('has-simplebar')
      } else if (localSimpleBar) {
        document.querySelector('.desktop-images-wrapper').classList.remove('has-simplebar')
        additionalImagesWrapper.style.maxHeight = ''
        localSimpleBar.unMount()
      }
    })

    observer.observe(mainImageWrapper, {
      attributes : true,
      childList  : true,
    })
  }

  // do mobile slider
  window.mobileSlider = false
  const mobileImages = document.querySelector('.mobile-images')
  if (mobileImages) {
    window.mobileSlider = new Siema({
      selector  : mobileImages,
      perPage   : 1,
      draggable : true,
      loop      : true,
      onInit() {
        if (this.innerElements.length > 1) {
          const self = this
          const dotsDiv = document.createElement('div')
          dotsDiv.classList.add('dots')

          this.innerElements.forEach((el, i) => {
            const dot = document.createElement('span')
            dot.classList.add('dot', 'invert')

            if (self.currentSlide === i) {
              dot.classList.add('active')
            }

            dot.addEventListener('click', () => { self.goTo(i) })
            dotsDiv.appendChild(dot)
          })

          this.selector.parentNode.insertBefore(dotsDiv, this.selector.nextSibling)
        }
      },
      onChange() {
        const dots = this.selector.parentNode.querySelectorAll('.dot')

        for (let i = 0; i < dots.length; i += 1) {
          if (this.currentSlide === i) {
            dots[i].classList.add('active')
            changeMainImage(i) // for desktop (responsive)
          } else {
            dots[i].classList.remove('active')
          }
        }
      },
    })
  }

  const CURRENT_IMAGE = document.getElementById('ProductPhotoImg')
  if (additionalImages.length > 0) {
    additionalImages.forEach((image, index) => {
      if (image.dataset.src === CURRENT_IMAGE.dataset.src) {
        image.classList.add('active')
        if (window.mobileSlider) window.mobileSlider.goTo(index)
      }

      image.addEventListener('click', () => {
        if (window.mobileSlider) window.mobileSlider.goTo(index)
        changeMainImage.bind(this, index)
      })
    })
  }

  const COLOR_IMAGE_SWATCHES = document.querySelectorAll('.color-image-swatch img')
  if (COLOR_IMAGE_SWATCHES.length > 0) {
    COLOR_IMAGE_SWATCHES.forEach((image, index) => {
      image.addEventListener('click', () => {
        if (window.mobileSlider) window.mobileSlider.goTo(index + 1)
        changeMainImage.bind(this, index + 1)
      })
    })
  }
}
