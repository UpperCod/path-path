var e=/^\:([^\?\.]+)(\?|(?:\.){3}){0,1}$/,r=/([^\/]+)/g,a="[^\\/]",c="(?:\\/){0,1}";function t(e,r){return void 0===r&&(r={}),(e=e.replace("?","").match(/[^\&]+/g)||[]).reduce(function(e,r){var a=r.search("="),c=r.slice(0,a>>>0),t=a>-1?r.slice(a+1):void 0;return e[c]=t,e},r)}exports.getSearch=t,exports.create=function(t){var s=["^"],u=[],n=t.match(r);return n?n.some(function(r){var t=r.match(e);if(t){var n=t[2];switch(u.push(t[1]),n){case"?":s.push(c+"("+a+"*)");break;case"...":return s.push("(.*)"),!0;default:s.push("\\/("+a+"+)")}}else s.push("\\/"+("**"==r?a+"+":r.replace(/([^\w\d])/g,"\\$1")))}):s.push(c),{path:t,regExp:RegExp(s.join("")+"$"),params:u}},exports.resolve=function(a,c){for(var t=a.match(r),s=c.match(r),u=[""],n=0;n<s.length;n++){var h=s[n],o=t[n],p=h.match(e),i=p?p[2]:h;switch(i){case"?":o&&u.push(o);break;case"...":u=u.concat(t.slice(n));break;default:u.push(p?o||i:"**"===i?o:i)}}return u.join("/")},exports.compare=function(e,r,a){void 0===a&&(a={});var c=r.match(/([^\?]+)(.*)/);c[2]&&(a.query=t(c[2]),r=c[1]);var s=r.match(e.regExp);return!!s&&(s.slice(1).forEach(function(r,c){a[e.params[c]]=r}),a)};
//# sourceMappingURL=path-path.js.map