!function(e){function t(t){for(var o,a,c=t[0],l=t[1],u=t[2],s=0,f=[];s<c.length;s++)a=c[s],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&f.push(r[a][0]),r[a]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(e[o]=l[o]);for(d&&d(t);f.length;)f.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],o=!0,c=1;c<n.length;c++){var l=n[c];0!==r[l]&&(o=!1)}o&&(i.splice(t--,1),e=a(a.s=n[0]))}return e}var o={},r={blog:0},i=[];function a(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=o,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)a.d(n,o,function(t){return e[t]}.bind(null,o));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var c=window.webpackJsonp=window.webpackJsonp||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var d=l;i.push([248,"vendor"]),n()}({248:function(e,t,n){n(249),e.exports=n(250)},249:function(e,t,n){"use strict";n.r(t);var o=n(3);document.addEventListener("DOMContentLoaded",(function(){function e(e,t){e.parentNode.insertBefore(t,e),t.appendChild(e)}document.querySelectorAll('iframe[src*="youtube"]').forEach((function(t){var n=document.createElement("div");n.classList.add("video-responsive");var o=document.createElement("div");o.classList.add("video-responsive-wrapper"),e(t,o),e(t,n)}));var t=document.getElementById("BlogTagFilter");t&&t.addEventListener("change",(function(e){var t=e.target.value;t&&(window.location.pathname=t)}));var n=document.getElementById("comments-count");n&&n.addEventListener("click",(function(e){e.preventDefault(),e.stopPropagation(),window.scrollTo({top:document.getElementById("comments").offsetTop-(document.querySelector("header nav").getBoundingClientRect().height+20),behavior:"smooth"})}));var r=document.getElementById("blog-right-area");r&&new o.default({el:r,data:function(){return{toggles:window.innerWidth>767?{search:!0,newsletter:!0,posts:!0,categories:!0,tags:!0}:{search:!0,newsletter:!0}}},methods:{toggleAccordion:function(e){this.$set(this.toggles,e,!this.toggles[e])}}}),window.location.search.includes("page")&&window.scrollTo({top:document.getElementById("comments").offsetTop-(document.querySelector("header nav").getBoundingClientRect().height+20),behavior:"smooth"})}))},250:function(e,t,n){var o=n(251);o.__esModule&&(o=o.default),"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,n(6).default)("7db1bc5c",o,!1,{})},251:function(e,t,n){}});