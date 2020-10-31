import{t,f as e,u as n,s as r,d as o,a as s,S as a,g as c,h as i,j as u,b as l,l as h,c as d}from"./index-5cfc0039.js";function p(t){return t.split("/").map(g).join("/")}const f=/%|\//g;function g(t){return t.length<3||-1===t.indexOf("%")?t:decodeURIComponent(t).replace(f,encodeURIComponent)}const m=/%(?:2(?:4|6|B|C)|3(?:B|D|A)|40)/g;function S(t){return encodeURIComponent(t).replace(m,decodeURIComponent)}var y;!function(t){t[t.ANY=-1]="ANY",t[t.STAR=42]="STAR",t[t.SLASH=47]="SLASH",t[t.COLON=58]="COLON"}(y||(y={}));const A=/(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g,D=Array.isArray,E=Object.prototype.hasOwnProperty;function w(t,e){if("object"!=typeof t||null===t)throw new Error("You must pass an object as the second argument to `generate`.");if(!E.call(t,e))throw new Error("You must provide param `"+e+"` to `generate`.");const n=t[e],r="string"==typeof n?n:""+n;if(0===r.length)throw new Error("You must provide a param `"+e+"`.");return r}var v,x;!function(t){t[t.Static=0]="Static",t[t.Dynamic=1]="Dynamic",t[t.Star=2]="Star",t[t.Epsilon=4]="Epsilon"}(v||(v={})),function(t){t[t.Static=v.Static]="Static",t[t.Dynamic=v.Dynamic]="Dynamic",t[t.Star=v.Star]="Star",t[t.Epsilon=v.Epsilon]="Epsilon",t[t.Named=v.Dynamic|v.Star]="Named",t[t.Decoded=v.Dynamic]="Decoded",t[t.Counted=v.Static|v.Dynamic|v.Star]="Counted"}(x||(x={}));const C=[];C[v.Static]=function(t,e){let n=e;const r=t.value;for(let t=0;t<r.length;t++){const e=r.charCodeAt(t);n=n.put(e,!1,!1)}return n},C[v.Dynamic]=function(t,e){return e.put(y.SLASH,!0,!0)},C[v.Star]=function(t,e){return e.put(y.ANY,!1,!0)},C[v.Epsilon]=function(t,e){return e};const N=[];N[v.Static]=function(t){return t.value.replace(A,"\\$1")},N[v.Dynamic]=function(){return"([^/]+)"},N[v.Star]=function(){return"(.+)"},N[v.Epsilon]=function(){return""};const O=[];O[v.Static]=function(t){return t.value},O[v.Dynamic]=function(t,e,n){const r=w(e,t.value);return n?S(r):r},O[v.Star]=function(t,e){return w(e,t.value)},O[v.Epsilon]=function(){return""};const b=Object.freeze({}),R=Object.freeze([]);function _(t,e,n){e.length>0&&e.charCodeAt(0)===y.SLASH&&(e=e.substr(1));const r=e.split("/");let o=void 0,s=void 0;for(let e=0;e<r.length;e++){let a=r[e],c=0;c=""===a?v.Epsilon:a.charCodeAt(0)===y.COLON?v.Dynamic:a.charCodeAt(0)===y.STAR?v.Star:v.Static,c&x.Named&&(a=a.slice(1),o=o||[],o.push(a),s=s||[],s.push(0!=(c&x.Decoded))),c&x.Counted&&n[c]++,t.push({type:c,value:g(a)})}return{names:o||R,shouldDecodes:s||R}}function L(t,e,n){return t.char===e&&t.negate===n}class j{constructor(t,e,n,r,o){this.states=t,this.id=e,this.char=n,this.negate=r,this.nextStates=o?e:null,this.pattern="",this._regex=void 0,this.handlers=void 0,this.types=void 0}regex(){return this._regex||(this._regex=new RegExp(this.pattern)),this._regex}get(t,e){const n=this.nextStates;if(null!==n)if(D(n))for(let r=0;r<n.length;r++){const o=this.states[n[r]];if(L(o,t,e))return o}else{const r=this.states[n];if(L(r,t,e))return r}}put(t,e,n){let r;if(r=this.get(t,e))return r;const o=this.states;return r=new j(o,o.length,t,e,n),o[o.length]=r,null==this.nextStates?this.nextStates=r.id:D(this.nextStates)?this.nextStates.push(r.id):this.nextStates=[this.nextStates,r.id],r}match(t){const e=this.nextStates;if(!e)return[];const n=[];if(D(e))for(let r=0;r<e.length;r++){const o=this.states[e[r]];Y(o,t)&&n.push(o)}else{const r=this.states[e];Y(r,t)&&n.push(r)}return n}}function Y(t,e){return t.negate?t.char!==e&&t.char!==y.ANY:t.char===e||t.char===y.ANY}function P(t,e){let n=[];for(let r=0,o=t.length;r<o;r++){const o=t[r];n=n.concat(o.match(e))}return n}function U(t){let e;t=t.replace(/\+/gm,"%20");try{e=decodeURIComponent(t)}catch(t){e=""}return e}class z{constructor(){const t=[],e=new j(t,0,y.ANY,!0,!1);t[0]=e,this.rootState=e}static ENCODE_AND_DECODE_PATH_SEGMENTS=!0;static Normalizer={normalizeSegment:g,normalizePath:p,encodePathSegment:S};add(t,e){let n=this.rootState,r="^";const o=[0,0,0],s=new Array(t.length),a=[];let c=!0,i=0;for(let e=0;e<t.length;e++){const u=t[e],{names:l,shouldDecodes:h}=_(a,u.path,o);for(;i<a.length;i++){const t=a[i];t.type!==v.Epsilon&&(c=!1,n=n.put(y.SLASH,!1,!1),r+="/",n=C[t.type](t,n),r+=N[t.type](t))}s[e]={handler:u.handler,names:l,shouldDecodes:h}}c&&(n=n.put(y.SLASH,!1,!1),r+="/"),n.handlers=s,n.pattern=r+"$",n.types=o}recognize(t){const e=z.ENCODE_AND_DECODE_PATH_SEGMENTS;let n,r=[this.rootState],o={},s=!1;const a=t.indexOf("#");-1!==a&&(t=t.substr(0,a));const c=t.indexOf("?");if(-1!==c){const e=t.substr(c+1,t.length);t=t.substr(0,c),o=function(t){const e=t.split("&"),n={};for(let t=0;t<e.length;t++){const r=e[t].split("=");let o=U(r[0]);const s=o.length;let a,c=!1;1===r.length?a="true":(s>2&&o.endsWith("[]")&&(c=!0,o=o.slice(0,s-2),n[o]||(n[o]=[])),a=r[1]?U(r[1]):""),c?n[o].push(a):n[o]=a}return n}(e)}t.startsWith("/")||(t="/"+t);let i=t;e?t=p(t):(t=decodeURI(t),i=decodeURI(i));const u=t.length;u>1&&"/"===t.charAt(u-1)&&(t=t.substr(0,u-1),i=i.substr(0,i.length-1),s=!0);for(let e=0;e<t.length&&(r=P(r,t.charCodeAt(e)),r.length);e++);const l=[];for(let t=0;t<r.length;t++)r[t].handlers&&l.push(r[t]);r=function(t){return t.sort((function(t,e){const[n,r,o]=t.types||[0,0,0],[s,a,c]=e.types||[0,0,0];if(o!==c)return o-c;if(o){if(n!==s)return s-n;if(r!==a)return a-r}return r!==a?r-a:n!==s?s-n:0}))}(l);const h=l[0];return h&&h.handlers&&(s&&h.char===y.ANY&&(i+="/"),n=function(t,e,n,r){const o=t.handlers,s=t.regex();if(!s||!o)throw new Error("state not initialized");const a=s.exec(e);let c=1;const i=function(t){const e=[];return e.queryParams=t||{},e}(n);i.length=o.length;for(let t=0;t<o.length;t++){const e=o[t],n=e.names,s=e.shouldDecodes;let u=b,l=!1;if(n!==R&&s!==R)for(let t=0;t<n.length;t++){l=!0;const e=n[t],o=a&&a[c++];u===b&&(u={}),r&&s[t]?u[e]=o&&decodeURIComponent(o):u[e]=o}i[t]={handler:e.handler,params:u,isDynamic:l}}return i}(h,i,o,e)),n}}const H=t("<a></a>",2),I=d();function T(){return n(I)}function k(t){const{router:e,level:n}=T(),r=o((()=>{const t=e.current;return t&&t[n].handler.component}),void 0,!0),l=o((()=>{const t=e.current;return t&&t[n].params}),void 0,!0),h=o((()=>{const t=e.current;return t&&t.queryParams}),void 0,!0),d=()=>{const t=e.current;return t&&t[n].handler.data&&t[n].handler.data({get params(){return l()},get query(){return h()}})};return s(I.Provider,{value:{level:n+1,router:e},get children(){return s(a,{get when(){return r()},children:e=>{const n=c(d);return s(e,i({get params(){return l()},get query(){return h()}},Object.keys(n).reduce(((t,e)=>(t[e]=()=>n[e],u(t,e))),{}),Object.keys(t).reduce(((e,n)=>(e[n]=()=>t[n],u(e,n))),{}),{}))}})}})}const q=t=>{const{router:e}=T();return(()=>{const n=H.cloneNode(!0);return n.__click=n=>{n.preventDefault(),e.push(t.href||"")},r(n,t,!1,!1),n})()},B=t=>{const e=function(t,e,n=""){const r=new z;M(r,t,n);const[s,a]=l(e||window.location.pathname.replace(n,"")+window.location.search),c=o((()=>r.recognize(n+s())));return globalThis.window&&(window.onpopstate=()=>a(window.location.pathname.replace(n,""))),{root:n,get location(){return s()},get current(){return c()},push(t){window.history.pushState("","",n+t),a(t)},addRoutes(t){M(r,t,n)}}}(t.routes,t.initialURL,t.root);return s(I.Provider,{value:{level:0,router:e},get children(){return t.children}})};let G={};function M(t,e,n,r=[]){e.forEach((e=>{let o;"string"==typeof e.component?(o=G[e.component],o&&o.data===e.data||(G[e.component]=o={component:h((()=>import(n+e.component))),data:e.data})):o={component:e.component,data:e.data};const s={path:n+e.path,handler:o};if(!e.children)return t.add([...r,s]);M(t,e.children,n,[...r,s])}))}e(["click"]);export{q as L,k as R,B as a,T as u};