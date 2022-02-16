/*! For license information please see cms.js.LICENSE.txt */
!function(e){function n(n){for(var r,o,i=n[0],l=n[1],_=n[2],u=0,d=[];u<i.length;u++)o=i[u],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&d.push(s[o][0]),s[o]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);for(c&&c(n);d.length;)d.shift()();return a.push.apply(a,_||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],r=!0,i=1;i<t.length;i++){var l=t[i];0!==s[l]&&(r=!1)}r&&(a.splice(n--,1),e=o(o.s=t[0]))}return e}var r={},s={cms:0},a=[];function o(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=e,o.c=r,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)o.d(t,r,function(n){return e[n]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="";var i=window.webpackJsonp=window.webpackJsonp||[],l=i.push.bind(i);i.push=n,i=i.slice();for(var _=0;_<i.length;_++)n(i[_]);var c=l;a.push([2,"vendor"]),t()}({"../node_modules/mini-css-extract-plugin/dist/loader.js?!../node_modules/css-loader/dist/cjs.js?!../node_modules/postcss-loader/src/index.js!../node_modules/sass-loader/lib/loader.js?!./scss/cms.scss":function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./scss/cms.scss?../node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-1!../node_modules/css-loader/dist/cjs.js??ref--6-2!../node_modules/postcss-loader/src!../node_modules/sass-loader/lib/loader.js??ref--6-4")},"./js/cms.js":function(module,__webpack_exports__,__webpack_require__){"use strict";eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"../node_modules/@babel/runtime/helpers/defineProperty.js\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"../node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ \"../node_modules/@babel/runtime/helpers/toConsumableArray.js\");\n/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue */ \"../node_modules/vue/dist/vue.esm.js\");\n/* harmony import */ var _helpers_swatches__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/_swatches */ \"./js/helpers/_swatches.js\");\n\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n// category page\n // import VueForm from 'vue-form'\n// import VueRecaptcha from 'vue-recaptcha'\n// import formOptions from './vue-form/options'\n// import formValidationMethods from './vue-form/_form-validation'\n\n // const CONTACT_US_FORM_URL = ''\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  // --------\n  // STYLE GUIDE\n  // --------\n  var styleGuide = document.getElementById('style-guide');\n\n  if (styleGuide) {\n    new vue__WEBPACK_IMPORTED_MODULE_3__[\"default\"]({\n      el: styleGuide,\n      delimiters: ['${', '}'],\n      computed: {\n        variables: function variables() {\n          /*\n          Check if the stylesheet is internal or hosted on the current domain.\n          If it isn't, attempting to access sheet.cssRules will throw a cross origin error.\n          See https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet#Notes\n           NOTE: One problem this could raise is hosting stylesheets on a CDN with a\n          different domain. Those would be cross origin, so you can't access them.\n          */\n          var isSameDomain = function isSameDomain(styleSheet) {\n            // Internal style blocks won't have an href value\n            if (!styleSheet.href) {\n              return true;\n            }\n\n            return styleSheet.href.indexOf(window.location.origin) === 0;\n          };\n          /*\n          Determine if the given rule is a CSSStyleRule\n          See: https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants\n          */\n\n\n          var isStyleRule = function isStyleRule(rule) {\n            return rule.type === 1;\n          };\n          /**\n          * Get all custom properties on a page\n          * @return array<array[string, string]>\n          * ex; [[\"--color-accent\", \"#b9f500\"], [\"--color-text\", \"#252525\"], ...]\n          */\n\n\n          var getCSSCustomPropIndex = function getCSSCustomPropIndex() {\n            return (// styleSheets is array-like, so we convert it to an array.\n              // Filter out any stylesheets not on this domain\n              _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(document.styleSheets).filter(isSameDomain).reduce( //eslint-disable-line\n              function (finalArr, sheet) {\n                return finalArr.concat( // cssRules is array-like, so we convert it to an array\n                _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(sheet.cssRules).filter(isStyleRule).reduce(function (propValArr, rule) {\n                  // NOTE: rule.styleMap is only available in Chrome and Edge\n                  // at the time of this writing.\n                  // See https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule/styleMap\n                  // // Discard any props that don't start with \"--\". Custom props are required to.\n                  var customProps = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(rule.styleMap.entries()).filter(function (_ref) {\n                    var _ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref, 1),\n                        propName = _ref2[0];\n\n                    return propName.indexOf('--') === 0;\n                  });\n\n                  return [].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(propValArr), _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(customProps));\n                }, []));\n              }, [])\n            );\n          };\n\n          return getCSSCustomPropIndex().reduce(function (str, _ref3) {\n            var _ref4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref3, 2),\n                prop = _ref4[0],\n                val = _ref4[1];\n\n            return _objectSpread(_objectSpread({}, str), {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({}, prop, val[0][0]));\n          }, {});\n        }\n      },\n      methods: {\n        showColor: function showColor(value, key) {\n          return (value.includes('#') || value.includes('rgb')) && !key.includes('overlay') && !key.includes('shadow') && !key.includes('primary') && !key.includes('secondary');\n        }\n      }\n    });\n  } // --------\n  // FAQ\n  // --------\n\n\n  var faq = document.getElementById('faq');\n\n  if (faq) {\n    new vue__WEBPACK_IMPORTED_MODULE_3__[\"default\"]({\n      el: faq,\n      delimiters: ['${', '}'],\n      data: function data() {\n        return {\n          toggles: {}\n        };\n      },\n      methods: {\n        toggleQuestion: function toggleQuestion(index) {\n          this.$set(this.toggles, index, Object.prototype.hasOwnProperty.call(this.toggles, index) ? !this.toggles[index] : true);\n        }\n      }\n    });\n  } // --------\n  // PASSWORD PAGE\n  // --------\n\n\n  var password = document.getElementById('password');\n\n  if (password) {\n    new vue__WEBPACK_IMPORTED_MODULE_3__[\"default\"]({\n      el: password,\n      delimiters: ['${', '}'],\n      data: function data() {\n        return {\n          showPassword: false\n        };\n      },\n      mounted: function mounted() {\n        var _this = this;\n\n        this.checkHash();\n        window.addEventListener('popstate', function () {\n          _this.checkHash();\n        });\n      },\n      methods: {\n        checkHash: function checkHash() {\n          if (window.location.hash.includes('#enter-password')) {\n            this.showPassword = true;\n          } else {\n            this.showPassword = false;\n          }\n        },\n        toggleShowPassword: function toggleShowPassword() {\n          this.showPassword = !this.showPassword;\n        }\n      }\n    });\n  } // --------\n  // 404\n  // --------\n\n\n  var fourOhFour = document.getElementById('four-oh-four');\n\n  if (fourOhFour) {\n    new vue__WEBPACK_IMPORTED_MODULE_3__[\"default\"]({\n      el: fourOhFour,\n      delimiters: ['${', '}'],\n      mixins: [_helpers_swatches__WEBPACK_IMPORTED_MODULE_4__[\"default\"]]\n    });\n  } // --------\n  // FORMS\n  // --------\n  // contact us form\n  // const contactUsForm = document.getElementById('contact-us-form')\n  // if (contactUsForm) {\n  //   new Vue({\n  //     el         : contactUsForm,\n  //     delimiters : ['${', '}'],\n  //     components : { VueRecaptcha },\n  //     mixins     : [new VueForm(formOptions)],\n  //     data() {\n  //       return {\n  //         formState : {},\n  //         formData  : {\n  //           firstname   : '',\n  //           lastname    : '',\n  //           company     : '',\n  //           email       : '',\n  //           phone       : '',\n  //           category    : '',\n  //           description : '',\n  //           // date: '',\n  //           recaptcha   : '',\n  //         },\n  //         loading             : false,\n  //         showSuccess         : false,\n  //         showSuccessRedirect : false,\n  //         showError           : false,\n  //       }\n  //     },\n  //     methods: {\n  //       ...formValidationMethods,\n  //       setRecaptchaTrue(event) {\n  //         this.formData.recaptcha = event\n  //       },\n  //       submitForm() {\n  //         if (!this.loading && this.validateForm()) {\n  //           this.loading = true\n  //           this.showSuccess = false\n  //           this.showSuccessRedirect = false\n  //           this.showError = false\n  //           fetch(CONTACT_US_FORM_URL, {\n  //             method  : 'POST',\n  //             body    : JSON.stringify(this.formData),\n  //             headers : { 'Content-Type': 'application/json', Accept: 'application/json' },\n  //           })\n  //             .then(r => r.json())\n  //             .then((response) => {\n  //               if (response.status === 'success') {\n  //                 // reset form\n  //                 Object.keys(this.formData).forEach((key) => {\n  //                   this.$set(this.formData, key, '')\n  //                 })\n  //                 this.formState._reset()\n  //                 // show message\n  //                 // set timeout to give loop above time to run\n  //                 this.$nextTick(() => {\n  //                   this.loading = false\n  //                   // this.showSuccess = true\n  //                   this.showSuccessRedirect = true\n  //                   window.location.href = `${window.location.origin}/pages/thank-you?form=contact`\n  //                   this.showError = false\n  //                   window.scrollTo(0, 0)\n  //                 })\n  //               } else {\n  //                 console.error(response)\n  //                 this.loading = false\n  //                 this.showError = true\n  //                 this.showSuccess = false\n  //                 this.showSuccessRedirect = false\n  //                 window.scrollTo(0, 0)\n  //               }\n  //             })\n  //             .catch((err) => {\n  //               console.error(err)\n  //               this.loading = false\n  //               this.showError = true\n  //               this.showSuccess = false\n  //               this.showSuccessRedirect = false\n  //               window.scrollTo(0, 0)\n  //             })\n  //         }\n  //       },\n  //     },\n  //   })\n  // }\n\n});\n\n//# sourceURL=webpack:///./js/cms.js?")},"./js/helpers/_swatches.js":function(module,__webpack_exports__,__webpack_require__){"use strict";eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {\n      activeSwatches: window.activeSwatches || {},\n      enableProductImageHover: window.themeSettings.enableProductImageHover || false,\n      enableDefaultProductSelection: window.themeSettings.enableDefaultProductSelection || false\n    };\n  },\n  mounted: function mounted() {\n    this.preloadAdditionalImage();\n  },\n  methods: {\n    defaultSwatchSelected: function defaultSwatchSelected(sentProductId, sentIndex) {\n      if (this.enableDefaultProductSelection && Object.keys(this.activeSwatches).indexOf(sentProductId) <= -1 && sentIndex <= 0) {\n        return true;\n      }\n\n      return false;\n    },\n    changeSwatch: function changeSwatch(sentImageVariant, imgUrl, aspectRatio, productId, productUrl, swatchIndex, fallbackImage) {\n      // if (this.activeSwatches[productId] === sentImageVariant) return\n      this.$set(this.activeSwatches, productId, sentImageVariant);\n      var parentEls = document.querySelectorAll(\".product-\".concat(productId));\n      parentEls.forEach(function (parentEl) {\n        var parentImageWrapper = parentEl.querySelector('.image-wrap');\n        var newImage = fallbackImage;\n\n        if (parentImageWrapper && !imgUrl.includes('no-image')) {\n          newImage = imgUrl;\n        }\n\n        if (newImage && !newImage.includes('no-image')) {\n          parentImageWrapper.style.paddingBottom = \"\".concat(100 / parseInt(aspectRatio, 10), \"%\");\n          var mainImage = parentImageWrapper.querySelector('img');\n          mainImage.dataset.src = newImage;\n          mainImage.dataset.firstSrc = newImage;\n          mainImage.dataset.swatchIndex = swatchIndex;\n          mainImage.classList.add('lazyload');\n          mainImage.classList.remove('lazyloaded');\n        }\n\n        var parentLinks = parentEl.querySelectorAll('a');\n\n        if (parentLinks.length > 0) {\n          parentLinks.forEach(function (link) {\n            link.href = productUrl;\n          });\n        }\n      });\n    },\n    preloadAdditionalImage: function preloadAdditionalImage() {\n      var _this = this;\n\n      // preload main image\n      var els = this.$el.querySelectorAll('img');\n      els.forEach(function (el) {\n        if (el.dataset.additionalImage && !el.dataset.additionalImage.includes('no-image')) {\n          var imgSrc = el.dataset.additionalImage.replace('_{width}x', '_540x');\n          var imageEl = document.createElement('link');\n\n          _this.preloadImage(imgSrc, imageEl);\n        }\n      }); // preload swatch images\n\n      var swatches = this.$el.querySelectorAll('.swatches .swatch');\n      swatches.forEach(function (el) {\n        if (el.dataset.imageSrc && !el.dataset.imageSrc.includes('no-image')) {\n          var imgSrc = el.dataset.imageSrc.replace('_{width}x', '_540x');\n          var imageEl = document.createElement('link');\n\n          _this.preloadImage(imgSrc, imageEl);\n        }\n      });\n    },\n    preloadImage: function preloadImage(imgSrc, imageEl) {\n      imageEl.rel = 'preload';\n      imageEl.href = imgSrc;\n      imageEl.as = 'image';\n      document.head.appendChild(imageEl);\n    }\n  }\n});\n\n//# sourceURL=webpack:///./js/helpers/_swatches.js?")},"./scss/cms.scss":function(module,exports,__webpack_require__){eval('// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-1!../../node_modules/css-loader/dist/cjs.js??ref--6-2!../../node_modules/postcss-loader/src!../../node_modules/sass-loader/lib/loader.js??ref--6-4!./cms.scss */ "../node_modules/mini-css-extract-plugin/dist/loader.js?!../node_modules/css-loader/dist/cjs.js?!../node_modules/postcss-loader/src/index.js!../node_modules/sass-loader/lib/loader.js?!./scss/cms.scss");\nif(content.__esModule) content = content.default;\nif(typeof content === \'string\') content = [[module.i, content, \'\']];\nif(content.locals) module.exports = content.locals;\n// add the styles to the DOM\nvar add = __webpack_require__(/*! ../../node_modules/vue-style-loader/lib/addStylesClient.js */ "../node_modules/vue-style-loader/lib/addStylesClient.js").default\nvar update = add("121015a0", content, false, {});\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./scss/cms.scss?')},2:function(module,exports,__webpack_require__){eval('__webpack_require__(/*! ./js/cms.js */"./js/cms.js");\nmodule.exports = __webpack_require__(/*! ./scss/cms.scss */"./scss/cms.scss");\n\n\n//# sourceURL=webpack:///multi_./js/cms.js_./scss/cms.scss?')}});