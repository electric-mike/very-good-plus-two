/* eslint-disable */
import Siema from 'siema'

// Extend Siema to new class to create new instance
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends
class SiemaCustom extends Siema {
  setAutoHeight(stopTime) {
    var that, timeout;
    that = this;

    function autoHeight() {
      var currentItems, min, max, itemHeightList, height, maxHeight, i;

    	min = that.currentSlide;
      max =  min + that.perPage;
      itemHeightList = [];

      for (i = min; i < max; i++) {
        if(that.innerElements[i]) {
          height = parseInt(that.innerElements[i].scrollHeight, 10);
          itemHeightList.push(height);
        }
      }

      if(height > 0) {
        maxHeight = Math.max.apply(null, itemHeightList);
        that.sliderFrame.style.maxHeight = maxHeight + 'px';
      }
    }

    window.addEventListener('resize', function () {
      that.sliderFrame.style.maxHeight = '';
      autoHeight();
    });

    autoHeight();
  };
}

export default SiemaCustom
