!function(e){function t(t){for(var o,i,c=t[0],u=t[1],l=t[2],d=0,f=[];d<c.length;d++)i=c[d],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&f.push(r[i][0]),r[i]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);for(s&&s(t);f.length;)f.shift()();return a.push.apply(a,l||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],o=!0,c=1;c<n.length;c++){var u=n[c];0!==r[u]&&(o=!1)}o&&(a.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},r={blog:0},a=[];function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var c=window.webpackJsonp=window.webpackJsonp||[],u=c.push.bind(c);c.push=t,c=c.slice();for(var l=0;l<c.length;l++)t(c[l]);var s=u;a.push([245,"vendor"]),n()}({245:function(e,t,n){n(246),e.exports=n(247)},246:function(e,t,n){"use strict";n.r(t);var o=n(3);document.addEventListener("DOMContentLoaded",(function(){function e(e,t){e.parentNode.insertBefore(t,e),t.appendChild(e)}document.querySelectorAll('iframe[src*="youtube"]').forEach((function(t){var n=document.createElement("div");n.classList.add("video-responsive");var o=document.createElement("div");o.classList.add("video-responsive-wrapper"),e(t,o),e(t,n)}));var t=document.getElementById("BlogTagFilter");t&&t.addEventListener("change",(function(e){var t=e.target.value;t&&(window.location.pathname=t)}));var n=document.getElementById("comments-count");n&&n.addEventListener("click",(function(e){e.preventDefault(),e.stopPropagation(),window.scrollTo({top:document.getElementById("comments").offsetTop-(document.querySelector("header nav").getBoundingClientRect().height+20),behavior:"smooth"})}));var r=document.getElementById("blog-right-area");r&&new o.default({el:r,data:function(){return{toggles:window.innerWidth>767?{search:!0,newsletter:!0,posts:!0,categories:!0,tags:!0}:{search:!0,newsletter:!0}}},methods:{toggleAccordion:function(e){this.$set(this.toggles,e,!this.toggles[e])}}})}))},247:function(e,t,n){var o=n(248);o.__esModule&&(o=o.default),"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,n(6).default)("7db1bc5c",o,!1,{})},248:function(e,t,n){}});