/*! Built with http://stenciljs.com */
(function(Context,appNamespace,hydratedCssClass,publicPath){"use strict";
var s=document.querySelector("script[data-namespace='complete-table']");if(s){publicPath=s.getAttribute('data-path');}
(function(n,t,e,o,i){"use strict";function c(n,t,e,o,i,c){let l=t.n+(e||k),f=t[l];if(f||(f=t[l=t.n+k]),f){let e=n.t;if(n.e)if(1===t.encapsulation)e=o.shadowRoot;else for(;o=n.o(o);)if(o.host&&o.host.shadowRoot){e=o.host.shadowRoot;break}const i=e.i=e.i||{};if(!i[l]){c=f.content.cloneNode(!0);const t=e.querySelectorAll("[data-styles]");n.c(e,c,t.length&&t[t.length-1].nextSibling||e.l),i[l]=!0}}}function l(n){return{f:n[0],r:n[1],u:!!n[2],s:!!n[3],a:!!n[4]}}function f(n,t){if(T(t)){if(n===Boolean||3===n)return"false"!==t&&(""===t||!!t);if(n===Number||4===n)return parseFloat(t)}return t}function r(n,t,e){n.d&&((e=n.d.$activeLoading)&&((t=e.indexOf(n))>-1&&e.splice(t,1),!e.length&&n.d.$initLoad()),n.d=null)}function u(n,t,e){let o,i=!1,c=!1;for(var l=arguments.length;l-- >2;)L.push(arguments[l]);for(;L.length;)if((e=L.pop())&&void 0!==e.pop)for(l=e.length;l--;)L.push(e[l]);else"boolean"==typeof e&&(e=null),(c="function"!=typeof n)&&(null==e?e="":"number"==typeof e?e=String(e):"string"!=typeof e&&(c=!1)),c&&i?o[o.length-1].p+=e:void 0===o?o=[c?s(e):e]:o.push(c?s(e):e),i=c;const f=new B;if(f.m=n,f.y=o,t&&(f.v=t,f.b=t.g,f.w=t.ref,t.className&&(t.class=t.className),"object"==typeof t.class)){for(l in t.class)t.class[l]&&L.push(l);t.class=L.join(" "),L.length=0}return f}function s(n){const t=new B;return t.p=n,t}function a(n,t){t.C||(t.C=!0,n.N.add(()=>{t.C=!1,function n(t,e){if(!e.j){const o=!e.k;let i;if(o){const o=e.d;if(o&&!o.$rendered)return void(o.$onRender=o.$onRender||[]).push(()=>{n(t,e)});(function o(n,t,e){try{e=n.O(t).x,t.k=new e,function o(n,t,e,i,c,l){for(l in i.S=e,e.T=e.T||{},(c=Object.assign({color:{type:String}},t.properties)).mode={type:String},c)p(n,c[l],e,i,l)}(n,e,t,t.k)}catch(e){t.k={},n.M(e,7,t,!0)}})(t,e);try{e.k.componentWillLoad&&(i=e.k.componentWillLoad())}catch(n){t.M(n,3,e)}}i&&i.then?i.then(()=>d(t,e,o)):d(t,e,o)}}(n,t)}))}function d(n,t,e){(function o(n,t,e,i){try{const o=t.k,c=e.x.host;if(o.render||o.hostData||c){n.A=!0;const c=o.render&&o.render();let l;n.A=!1;const f=t.P||new B;f.B=t,t.P=n.render(f,u(null,l,c),i,t.L,e.x.encapsulation)}n.R(n.q,e,o.mode,t),t.$rendered=!0,t.$onRender&&(t.$onRender.forEach(n=>n()),t.$onRender=null)}catch(e){n.A=!1,n.M(e,8,t,!0)}})(n,t,n.O(t),!e);try{e&&t.$initLoad()}catch(e){n.M(e,6,t,!0)}}function p(n,t,e,o,i){if(t.type||t.state){if(!t.state){if(t.attr&&(void 0===e.T[i]||""===e.T[i])){const o=n.q.D(e,t.attr);null!=o&&(e.T[i]=f(t.type,o))}e.hasOwnProperty(i)&&(void 0===e.T[i]&&(e.T[i]=e[i]),delete e[i])}o.hasOwnProperty(i)&&void 0===e.T[i]&&(e.T[i]=o[i]),t.watchCallbacks&&(e.T[R+i]=t.watchCallbacks.slice()),h(o,i,function c(n){return(n=this.S)&&n.T&&n.T[i]},function l(e,o){(o=this.S)&&(t.state||t.mutable)&&m(n,o,i,e)})}else t.elementRef?y(o,i,e):t.method&&y(e,i,o[i].bind(o))}function m(n,t,e,o,i,c,l){const f=(i=t.T=t.T||{})[e];if(o!==f&&(i[e]=o,c=t.k)){if(l=i[R+e])for(let n=0;n<l.length;n++)try{c[l[n]].call(c,o,f,e)}catch(n){}n.A||a(n,t)}}function y(n,t,e){Object.defineProperty(n,t,{configurable:!0,value:e})}function h(n,t,e,o){Object.defineProperty(n,t,{configurable:!0,get:e,set:o})}function v(n,t,e,o,i){const c=11===e.B.nodeType&&e.B.host?e.B.host:e.B,l=t&&t.v||x,f=e.v||x;for(i in l)f&&null!=f[i]||null==l[i]||b(n,c,i,l[i],void 0,o);for(i in f)i in l&&f[i]===("value"===i||"checked"===i?c[i]:l[i])||b(n,c,i,l[i],f[i],o)}function b(n,t,e,o,i,c,l,f){if("class"!==e||c)if("style"===e){for(l in o=o||x,i=i||x,o)i[l]||(t.style[l]="");for(l in i)i[l]!==o[l]&&(t.style[l]=i[l])}else if("o"!==e[0]||"n"!==e[1]||e in t)if("list"!==e&&"type"!==e&&!c&&(e in t||-1!==["object","function"].indexOf(typeof i)&&null!==i)){const o=n.O(t);o&&o.H&&o.H[e]?$(t,e,i):"ref"!==e&&($(t,e,null==i?"":i),null!=i&&!1!==i||t.removeAttribute(e))}else null!=i&&(l=e!==(e=e.replace(/^xlink\:?/,"")),1!==q[e]||i&&"false"!==i?"function"!=typeof i&&(l?t.setAttributeNS(D,A(e),i):t.setAttribute(e,i)):l?t.removeAttributeNS(D,A(e)):t.removeAttribute(e));else e=A(e.substring(2)),i?o||n.q.z(t,e,i):n.q.F(t,e);else if(o!==i){const n=null==o||""===o?O:o.trim().split(/\s+/),e=null==i||""===i?O:i.trim().split(/\s+/);let c=null==t.className||""===t.className?O:t.className.trim().split(/\s+/);for(l=0,f=n.length;l<f;l++)-1===e.indexOf(n[l])&&(c=c.filter(t=>t!==n[l]));for(l=0,f=e.length;l<f;l++)-1===n.indexOf(e[l])&&(c=[...c,e[l]]);t.className=c.join(" ")}}function $(n,t,e){try{n[t]=e}catch(n){}}function g(n,t){function e(o,i,c){let l=0;if("function"==typeof o.m&&(o=o.m(Object.assign({},o.v,{I:o.y}))),!u&&"slot"===o.m){if(r){s&&t.W(i,s+"-slot","");const e=o.v&&o.v.name;let c;if(c=T(e)?r.G&&r.G[e]:r.J,T(c)){for(n.K=!0;l<c.length;l++)t.Q(c[l]),t.U(i,c[l]);n.K=!1}}return null}if(T(o.p))o.B=t.V(o.p);else{const i=o.B=t.X(o.m);v(n,null,o,H),null!==s&&i.Y!==s&&t.W(i,i.Y=s,"");const c=o.y;let f;if(c)for(;l<c.length;++l)(f=e(c[l],i))&&t.U(i,f);"svg"===o.m&&(H=!1)}return o.B}function o(n,o,i,c,l,f,r){const u=n.$defaultHolder&&t.o(n.$defaultHolder)||n;for(;c<=l;++c)r=i[c],T(r)&&(f=T(r.p)?t.V(r.p):e(r,n),T(f)&&(r.B=f,t.c(u,f,o)))}function i(n,e,o){for(;e<=o;++e)T(n[e])&&t.Q(n[e].B)}function c(n,t){return n.m===t.m&&n.b===t.b}function l(n,t,e){const o={};let i,c,l;for(i=t;i<=e;++i)null!=(l=n[i])&&void 0!==(c=l.b)&&(o.Z=i);return o}let f,r,u,s;return function u(a,d,p,m,y,h){return f=p,r=m,s="scoped"===y||"shadow"===y&&!t.e?"data-"+t._(a.B):null,f||s&&t.W(a.B,s+"-host",""),function f(r,u){const s=u.B=r.B,a=r.y,d=u.y;if(M(u.p))"slot"!==u.m&&v(n,r,u,H),T(a)&&T(d)?function p(n,r,u){let s,a,d,p,m=0,y=0,h=r.length-1,v=r[0],b=r[h],$=u.length-1,g=u[0],w=u[$];for(;m<=h&&y<=$;)null==v?v=r[++m]:null==b?b=r[--h]:null==g?g=u[++y]:null==w?w=u[--$]:c(v,g)?(f(v,g),v=r[++m],g=u[++y]):c(b,w)?(f(b,w),b=r[--h],w=u[--$]):c(v,w)?(f(v,w),t.c(n,v.B,t.nn(b.B)),v=r[++m],w=u[--$]):c(b,g)?(f(b,g),t.c(n,b.B,v.B),b=r[--h],g=u[++y]):(M(s)&&(s=l(r,m,h)),a=s[g.b],M(a)?(p=e(g,n),g=u[++y]):((d=r[a]).m!==g.m?p=e(g,n):(f(d,g),r[a]=void 0,p=d.B),g=u[++y]),p&&t.c(v.B&&v.B.parentNode||n,p,v.B));m>h?o(n,null==u[$+1]?null:u[$+1].B,u,y,$):y>$&&i(r,m,h)}(s,a,d):T(d)?(T(r.p)&&t.tn(s,""),o(s,null,d,0,d.length-1)):T(a)&&i(a,0,a.length-1);else if(s.L&&s.L.J){const n=s.L.J[0].parentElement;t.tn(n,u.p),s.L.J=[n.childNodes[0]]}else r.p!==u.p&&t.tn(s,u.p);"svg"===u.m&&H&&(H=!1)}(a,d),d}}function w(n,t){n&&(n.w&&n.w(t?null:n.B),n.y&&n.y.forEach(n=>{w(n,t)}))}function C(n,t,e,o,i){const c=n.en(t);let l,f,r,u;if(i&&1===c){(f=n.D(t,j))&&(r=f.split("."))[0]===o&&((u=new B).m=n._(u.B=t),e.y||(e.y=[]),e.y[r[1]]=u,e=u,i=""!==r[2]);for(let c=0;c<t.childNodes.length;c++)C(n,t.childNodes[c],e,o,i)}else 3===c&&(l=t.previousSibling)&&8===n.en(l)&&"s"===(r=n.on(l).split("."))[0]&&r[1]===o&&((u=s(n.on(t))).B=t,e.y||(e.y=[]),e.y[r[2]]=u)}function N(n,t,e,o){return function(){const i=arguments;return function c(n,t,e){return new Promise(o=>{let i=t[e];i||(i=n.in.querySelector(e)),i||(i=t[e]=n.X(e),n.U(n.in,i)),i.componentOnReady(o)})}(n,t,e).then(n=>n[o].apply(n,i))}}const E="data-ssrv",j="data-ssrc",k="$",x={},O=[],S={enter:13,escape:27,space:32,tab:9,left:37,up:38,right:39,down:40},T=n=>void 0!==n&&null!==n,M=n=>void 0===n||null===n,A=n=>n.toLowerCase(),P=()=>{};class B{}const L=[],R="wc-",q={allowfullscreen:1,async:1,autofocus:1,autoplay:1,checked:1,controls:1,disabled:1,enabled:1,formnovalidate:1,hidden:1,multiple:1,noresize:1,readonly:1,required:1,selected:1,spellcheck:1},D="http://www.w3.org/1999/xlink";let H=!1;const z=n[o]=n[o]||{};{const o=function F(t,e,o,i,s,d){const p={html:{}},v={},b=function $(n,t){const e=new WeakMap,o={cn:t.documentElement,t:t.head,in:t.body,ln:!1,en:n=>n.nodeType,X:n=>t.createElement(n),fn:(n,e)=>t.createElementNS(n,e),V:n=>t.createTextNode(n),rn:n=>t.createComment(n),c:(n,t,e)=>n.insertBefore(t,e),Q:n=>n.remove(),U:(n,t)=>n.appendChild(t),un:n=>n.childNodes,o:n=>n.parentNode,nn:n=>n.nextSibling,_:n=>A(n.tagName),on:n=>n.textContent,tn:(n,t)=>n.textContent=t,D:(n,t)=>n.getAttribute(t),W:(n,t,e)=>n.setAttribute(t,e),sn:(n,t,e,o)=>n.setAttributeNS(t,e,o),an:(n,t)=>n.removeAttribute(t),dn:(e,i)=>"child"===i?e.firstElementChild:"parent"===i?o.pn(e):"body"===i?o.in:"document"===i?t:"window"===i?n:e,z:(n,t,i,c,l,f,r,u)=>{const s=t;let a=n,d=e.get(n);if(d&&d[s]&&d[s](),"string"==typeof f?a=o.dn(n,f):"object"==typeof f?a=f:(u=t.split(":")).length>1&&(a=o.dn(n,u[0]),t=u[1]),!a)return;let p=i;(u=t.split(".")).length>1&&(t=u[0],p=(n=>{n.keyCode===S[u[1]]&&i(n)})),r=o.ln?{capture:!!c,passive:!!l}:!!c,a.addEventListener(t,p,r),d||e.set(n,d={}),d[s]=(()=>{a&&a.removeEventListener(t,p,r),d[s]=null})},F:(n,t)=>{const o=e.get(n);o&&(t?o[t]&&o[t]():(Object.keys(o).forEach(n=>{o[n]&&o[n]()}),e.delete(n)))},pn:(n,t)=>(t=o.o(n))&&11===o.en(t)?t.host:t};return o}(o,i);t.isServer=t.isPrerender=!(t.isClient=!0),t.window=o,t.location=o.location,t.document=i,t.publicPath=s,e.h=u,e.Context=t;const j=o.$definedCmps=o.$definedCmps||{},x={mn:function O(n,e){e.mode||(e.mode=b.D(e,"mode")||t.mode),b.D(e,E)||function o(n,t){return n&&1===t.encapsulation}(b.e,n)||function i(n,t,e,o){let i,c,l;t.$defaultHolder||n.c(t,t.$defaultHolder=n.rn(""),e[0]);let f=0;for(;f<e.length;f++)o=e[f],1===n.en(o)&&null!=(i=n.D(o,"slot"))?(l=l||{})[i]?l[i].push(o):l[i]=[o]:c?c.push(o):c=[o];t.L={J:c,G:l}}(b,e,e.childNodes),b.e||1!==n.encapsulation||(e.shadowRoot=e)},q:b,yn:function T(n,t){if(!j[n.n]){j[n.n]=!0,function e(n,t,o,i){o.connectedCallback=function(){(function e(n,t,o){o.$connected||(o.$connected=!0,o.j=null,function i(n,t,e){for(e=t;e=n.q.pn(e);)if(n.hn(e)){e.vn||(t.d=e,(e.$activeLoading=e.$activeLoading||[]).push(t));break}}(n,o),n.N.add(()=>{n.mn(t,o),n.loadBundle(t,o.mode,()=>a(n,o))},3))})(n,t,this)},o.attributeChangedCallback=function(n,e,o){(function i(n,t,e,o,c,l){if(o!==c&&n)for(l in e=A(e),n)if(n[l].bn===e){t[l]=f(n[l].$n,c);break}})(t.H,this,n,e,o)},o.disconnectedCallback=function(){(function t(n,e){!n.K&&function o(n,t){for(;t;){if(!n.o(t))return 9!==n.en(t);t=n.o(t)}}(n.q,e)&&(e.j=!0,r(e),w(e.P,!0),n.q.F(e),e.L&&(e.L=e.L.J=e.L.G=null),e.k&&(e.k=e.k.S=null),e.$activeLoading=e.$connected=e.$defaultHolder=e.gn=e.T=e.P=e.d=e.vn=e.C=e.wn=null)})(n,this)},o.componentOnReady=function(n,t){return n||(t=new Promise(t=>n=t)),function e(n,t){n.j||(n.vn?t(n):(n.Cn=n.Cn||[]).push(t))}(this,n),t},o.$initLoad=function(){(function t(n,e,o){if(e.k&&!e.j&&(!e.$activeLoading||!e.$activeLoading.length)){e.$activeLoading=null,e.vn=!0;try{w(e.P),e.Cn&&(e.Cn.forEach(n=>n(e)),e.Cn=null),e.k.componentDidLoad&&e.k.componentDidLoad()}catch(t){n.M(t,4,e)}e.classList.add(o),r(e)}})(n,this,i)},o.Nn=function(){a(n,this)},function c(n,t,e){t&&Object.keys(t).forEach(o=>{const i=t[o].En;1===i||2===i?h(e,o,function n(){return(this.T=this.T||{})[o]},function t(e){m(n,this,o,e)}):6===i&&y(e,o,P)})}(n,t.H,o)}(x,n,t.prototype,d);{const e=[];for(const o in n.H)n.H[o].bn&&e.push(n.H[o].bn),t.observedAttributes=e}o.customElements.define(n.n,t)}},jn:t.emit,O:n=>p[b._(n)],kn:n=>t[n],isClient:!0,hn:n=>!(!j[b._(n)]&&!x.O(n)),loadBundle:function M(n,t,e){if(n.x)e();else{const o="string"==typeof n.xn?n.xn:n.xn[t],i=s+o+(function o(n,t){return 2===t.encapsulation||1===t.encapsulation&&!n}(b.e,n)?".sc":"")+".js";import(i).then(t=>{try{n.x=t[(n=>A(n).split("-").map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(""))(n.n)],function o(n,t,e){const o=e.style;if(o){const i=e.is+(e.styleMode||k);if(!t[i]){const e=n.X("template");t[i]=e,e.innerHTML=`<style>${o}</style>`,n.U(n.t,e)}}}(b,n,n.x)}catch(t){n.x=class{}}e()}).catch(n=>void 0)}},M:(n,t,e)=>void 0,On:n=>(function t(n,e,o){return{create:N(n,e,o,"create"),componentOnReady:N(n,e,o,"componentOnReady")}})(b,v,n),N:function L(t,e,o){function i(){for(;s.length>0;)s.shift()();e=!1}function c(n){for(n=f(),i();a.length>0&&f()-n<40;)a.shift()();(o=a.length>0)&&r(l)}function l(n){for(i(),n=4+f();a.length>0&&f()<n;)a.shift()();(o=a.length>0)&&r(c)}const f=()=>t.performance.now(),r=t=>n.requestAnimationFrame(t),u=Promise.resolve(),s=[],a=[];return{add:(n,t)=>{3===t?(s.push(n),e||(e=!0,u.then(i))):(a.push(n),o||(o=!0,r(c)))}}}(o),Sn:n=>(n||[]).map(n=>(function t(n,e,o,i){const c={n:n[0],H:{color:{bn:"color"}}};c.xn=n[1];const f=n[3];if(f)for(o=0;o<f.length;o++)i=f[o],c.H[i[0]]={En:i[1],bn:"string"==typeof i[2]?i[2]:i[2]?i[0]:0,$n:i[3]};return c.encapsulation=n[4],n[5]&&(c.Tn=n[5].map(l)),e[c.n]=c})(n,p))};x.render=g(x,b);const R=b.cn;return R.$rendered=!0,R.$activeLoading=[],R.$initLoad=(()=>R.vn=!0),function q(n,t){const e=t.querySelectorAll(`[${E}]`),o=e.length;let i,c,l,f,r,u;if(t.vn=o>0)for(f=0;f<o;f++)for(i=e[f],c=n.D(i,E),(l=i.P=new B).m=n._(l.B=i),r=0,u=i.childNodes.length;r<u;r++)C(n,i.childNodes[r],l,c,!0)}(b,R),x.R=c,x}(e,z,n,t,i,hydratedCssClass);o.Sn(z.components).forEach(n=>o.yn(n,class extends HTMLElement{}))}})(window,document,Context,appNamespace,publicPath);
})({},"CompleteTable","hydrated","/build/complete-table/");