function t(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}function n(t,n){return function(t){if(Array.isArray(t))return t}(t)||function(t,n){var e,r,o=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=o){var a=[],i=!0,c=!1;try{for(o=o.call(t);!(i=(e=o.next()).done)&&(a.push(e.value),!n||a.length!==n);i=!0);}catch(t){c=!0,r=t}finally{try{i||null==o.return||o.return()}finally{if(c)throw r}}return a}}(t,n)||r(t,n)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(n){return function(n){if(Array.isArray(n))return t(n)}(n)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(n)||r(n)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(n,e){if(n){if("string"==typeof n)return t(n,e);var r=Object.prototype.toString.call(n).slice(8,-1);if("Object"===r&&n.constructor&&(r=n.constructor.name),"Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return t(n,e)}}performance.now();var o=!1,a=[],i=document.currentScript.outerHTML,c=document.body.innerHTML.replace(i,""),l="사과\n바나나\n포도\n딸기\n오렌지\n체리\n복숭아\n수박\n파인애플\n배\n레몬\n라즈베리\n블루베리\n키위\n망고\n참외\n아보카도\n석류\n자몽\n두리안\n코코넛\n라임\n자두\n무화과\n감\n살구\n상추\n양파\n당근\n감자\n토마토\n오이\n시금치\n호박\n콩\n옥수수\n파프리카\n브로콜리\n고구마\n아스파라거스\n샐러리\n양배추\n고추\n버섯\n마늘\n생강\n비트\n콜라비\n아티초크\n미역\n김\n호박\n피망\n죽순\n무\n고사리\n갓\n청경채\n케일\n취나물\n치커리\n미나리\n더덕\n토란\n귤\n대추\n파파야\n복분자\n유자\n부추\n매실\n호두\n가지\n노각".split("\n");function u(t,n){var e=localStorage[t];return"string"==typeof e?JSON.parse(e):null!=n?n:null}function s(t,n){localStorage[t]=JSON.stringify(n)}performance.now(),function t(){if(o)throw Error("This function should not be called more than once.");o=!0;var r=[[3,2,1],[4,-1,0],[5,6,7]],i=n(e("각".normalize("NFD")),3),d=i[0],f=i[1],m=i[2],h=12623-f.charCodeAt(0),v=Object.fromEntries(Object.entries({ㄱㄱ:"ㄲ",ㄱㅅ:"ㄳ",ㄴㅈ:"ㄵ",ㄴㅎ:"ㄶ",ㄷㄷ:"ㄸ",ㄹㄱ:"ㄺ",ㄹㅁ:"ㄻ",ㄹㅂ:"ㄼ",ㄹㅅ:"ㄽ",ㄹㅌ:"ㄾ",ㄹㅍ:"ㄿ",ㄹㅎ:"ㅀ",ㅂㅂ:"ㅃ",ㅂㅅ:"ㅄ",ㅅㅅ:"ㅆ",ㅈㅈ:"ㅉ",ㅏㅣ:"ㅐ",ㅑㅣ:"ㅒ",ㅓㅣ:"ㅔ",ㅕㅣ:"ㅖ",ㅗㅏ:"ㅘ",ㅗㅏㅣ:"ㅙ",ㅗㅣ:"ㅚ",ㅜㅓ:"ㅝ",ㅜㅓㅣ:"ㅞ",ㅜㅣ:"ㅟ",ㅡㅣ:"ㅢ"}).map(function(t){var e=n(t,2),r=e[0];return[e[1],r]})),y=-1;try{(M=function(t){if(null===t)return null;var e=n(t.split("|"),8),r=e[0],o=e[1],a=e[2],i=e[3],c=e[4],l=e[5],u=e[6],s=e[7];if(1*r!=2)throw Error("The saved game state is from a different version of the game.");if(x("".concat(r,"|").concat(o,"|").concat(a,"|").concat(i,"|").concat(c,"|").concat(l,"|").concat(u))!==1*s||c.length!==a*i)throw Error("saved game state is corrupted");return[o.split(","),1*a,1*i,c,l?l.split(",").map(Number).reduce(function(t,n){return t.length&&4!==t.at(-1).length||t.push([]),t.at(-1).push(n),t},[]):[],1*u]}(u("gameState")))&&(y=M[5])}catch(t){console.error(t),delete localStorage.gameState}var p=e(l);function g(t){return e(t.normalize("NFC")).flatMap(L)}var b=M?M[0]:[];if(!M){for(var M,w=0;w<16;w++)b.push.apply(b,e(p.splice(D(0,p.length-1),1)));p.length=0}var S=document.getElementById("word-list"),E=document.getElementById("word-template");b.forEach(function(t){var n=E.content.cloneNode(!0).querySelector("li");n.textContent=t,n.dataset.word=t,S.appendChild(n)});var A=document.getElementById("jamo-board"),C=document.getElementById("jamo-template");A.addEventListener("selectstart",function(t){t.preventDefault()});var P=!1;A.addEventListener("contextmenu",function(t){P||t.preventDefault(),P=!1});var j="ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ";function x(t){return e(t).map(function(t){return t.charCodeAt()}).reduce(function(t,n){return(t>>>1|(1&t)<<15)^n},0)}function z(){var t=b.join(),n=Array.from({length:144},function(t,n){return T[n].textContent}).join(""),e=Array.from(A.querySelectorAll(".completion-bar")).filter(function(t){return t!==_}).map(function(t){return"".concat(t.dataset.start,",").concat(t.dataset.end)}).join(),r="".concat(2,"|").concat(t,"|").concat(12,"|").concat(12,"|").concat(n,"|").concat(e,"|").concat(y);return"".concat(r,"|").concat(x(r))}function L(t){var r=n(e(t.normalize("NFD")).concat(["","",""]).slice(0,3),3),o=r[0],a=r[1],i=r[2];return["ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"[o.charCodeAt(0)-d.charCodeAt(0)],String.fromCharCode(a.charCodeAt(0)+h),i.length?"ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"[i.charCodeAt(0)-m.charCodeAt(0)]:""].flatMap(function(t){var n;return e(null!==(n=v[t])&&void 0!==n?n:t)})}var I=b.flatMap(function(t){return e(t.normalize("NFC")).flatMap(L)});function N(t,n){n.classList.add("notransition"),t(),requestAnimationFrame(function(){requestAnimationFrame(function(){n.classList.remove("notransition")})})}A.style.setProperty("--gap","".concat(.75,"em")),A.style.setProperty("--width",12),A.style.setProperty("--height",12),N(function(){for(var t=0;t<144;t++){var n=C.content.cloneNode(!0).querySelector("i"),e=M?M[3][t]:D(0,1)?j[D(0,j.length-1)]:I[D(0,I.length-1)];n.textContent=e,A.appendChild(n)}},A);var B=Array.from({length:144},function(){return null}),q=function(t,n,e,o){if(e<0||e>7)throw RangeError("direction must be 0 to 7");for(var a=-1;a<=1;a++)for(var i=-1;i<=1;i++)if(r[a+1][i+1]===e)return[t+i*o,n+a*o]},T=A.querySelectorAll("#jamo-board>i");T.forEach(function(t,n){t.dataset.index=n});var k=function(t,e,r,o){var a=g(t);if(a.length>12&&a.length>12)throw RangeError("word too long for board");for(var i=0;i<a.length;i++){var c=n(q(e,r,o,i),2),l=c[0],u=c[1];if(l<0||l>=12||u<0||u>=12)return!1;var s=B[12*u+l];if(s&&s!==a[i])return!1}for(var d=0;d<a.length;d++){var f,m,h=n(q(e,r,o,d),2),v=h[0],y=h[1];0===d&&((f=[v,y])[0],f[1]),d===a.length-1&&((m=[v,y])[0],m[1]);var p=a[d],b=12*y+v;B[b]=p,T[b].textContent=p}return!0};function F(t,n){var e,r=null!==(e=F.cache)&&void 0!==e?e:F.cache=new Map;if(r.has(t))return r.get(t);var o=n();return r.set(t,o),o}function O(t,n,e,r){var o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,a=F(O,function(){return document.getElementById("completion-bar-template")}),i=null!=o?o:a.content.cloneNode(!0).querySelector(".completion-bar");i.dataset.start="".concat(t,",").concat(n),i.dataset.end="".concat(e,",").concat(r);var c=Math.sign(r-n),l=Math.min(t,e),u=Math.max(t,e),s=Math.min(n,r),d=Math.max(n,r),f=(u-l+1)*2+.75*(u-l),m=(d-s+1)*2+.75*(d-s);i.style.setProperty("--top","".concat(2*s+.75*s,"em")),i.style.setProperty("--left","".concat(2*l+.75*l,"em")),i.style.setProperty("--width","".concat(f,"em")),i.style.setProperty("--height","".concat(m,"em")),i.style.setProperty("--thick","".concat(2.25,"em")),i.style.setProperty("--hypot","".concat(Math.hypot(f,m)+.25,"em")),i.style.setProperty("--angle","".concat(180*Math.atan2(c*m,Math.sign(e-t)*f)/Math.PI,"deg"));var h=Math.floor(43758.5453*Math.sin(12.9898*t+78.233*n)%1*H)*Math.floor(360/H),v="oklch(75% 75% ".concat(y+h,"deg)");return i.style.setProperty("--color",v),i}function R(t,n){t.style.setProperty("--color",n.style.getPropertyValue("--color")),t.classList.add("found")}function D(t,n){return Math.floor(Math.random()*(n-t+1))+t}A.style.setProperty("--size","".concat(2,"rem"));var H=16;M||(y=D(0,359));var V=Array.from({length:4},function(){return 16}),J=64,X=function(){for(var t=D(0,J-1),n=0,e=0;e<4;e++)if(t<(n+=V[e]))return e};if(M)M[4].forEach(function(t){var e,r,o=n(t,4),a=o[0],i=o[1],c=o[2],l=o[3];e=O(a,i,c,l),r=tr(te(a,i,c,l)),R(S.querySelector('li[data-word="'.concat(r,'"]')),e),A.appendChild(e)});else try{b.toSorted(function(t,n){return g(n).length-g(t).length}).forEach(function(t){for(var n,e,r,o=0;;){n=D(0,11),e=D(0,11);var a=((r=X())+6)%8;if(k(t,n,e,a)){V[r]--,J--,16-V[r]>16/3&&(J-=V[r],V[r]=0);break}if(o>256)throw"The board generation was stuck in impossible state, so the page was reloaded.";o++}})}catch(n){console.error(n),a.forEach(clearInterval),a.length=0,e(document.body.children).filter(function(t){return t!==document.currentScript}).forEach(function(t){return t.remove()}),document.body.innerHTML=c,o=!1,t();return}var Y=document.getElementById("dark-mode-toggle");Y.addEventListener("click",function(){var t,n=Y.dataset.mode,e=Y.dataset.modeOptions.split("|"),r=e[(e.indexOf(n)+1)%e.length];t=function(){Y.dataset.mode=r,document.documentElement.dataset.mode=r},document.startViewTransition?document.startViewTransition(t):t(),localStorage.darkMode=r});var G=localStorage.darkMode;G&&N(function(){Y.dataset.mode=G,document.documentElement.dataset.mode=G},Y);var U=new Proxy({value:!1},{set:function(t,n,e){if("value"===n&&"boolean"==typeof e)return Reflect.set(t,n,e)}}),W=[-1,-1],$=-1,K=[-1,-1];function Q(t){return[t%12,Math.floor(t/12)]}function Z(t,e){var o=n(t,2),a=o[0],i=o[1],c=n(e,2),l=c[0],u=c[1];if(!(a===l||i===u||Math.abs(a-l)===Math.abs(i-u)))return -1;var s=[l-a,u-i],d=s[0];return r[Math.sign(s[1])+1][Math.sign(d)+1]}var _=null;function tt(){if(-1!==W[0]&&-1!==W[1]){var t=null!==_,e=n(W,2),r=e[0],o=e[1],a=n(-1===K[0]&&-1===K[1]?[r,o]:K,2);_=O(r,o,a[0],a[1],_),t||A.appendChild(_)}}function tn(t,n){for(var e=t<n?1:-1,r=[],o=0;o<=Math.abs(n-t);o+=1)r.push(o*e+t);return r}function te(t,e,r,o){var a=tn(t,r),i=tn(e,o);return Array.from({length:Math.max(a.length,i.length)},function(n,r){var o,c;return[null!==(o=a[r])&&void 0!==o?o:t,null!==(c=i[r])&&void 0!==c?c:e]}).map(function(t){var e=n(t,2),r=e[0];return T[12*e[1]+r].textContent}).join("")}function tr(t){return b.find(function(e){var r=n(F(e,function(){var t=g(e);return[t.join(""),t.toReversed().join("")]}),2),o=r[0],a=r[1];return o===t||a===t})}function to(t,n,e){return t<n?n-t:t>e?t-e:0}A.addEventListener("pointerdown",function(t){var n=document.elementFromPoint(t.clientX,t.clientY);n.matches("#jamo-board>i")&&(U.value=!0,W=Q(1*n.dataset.index),K=[-1,-1],$=-1,tt())}),document.addEventListener("pointerup",function(t){P=2===t.button,U.value=!1,-1!==K[0]&&-1!==K[1]&&(W[0]!==K[0]||W[1]!==K[1])&&function(t){try{if(null===t)return;var e=n(t.dataset.start.split(",").map(Number),2),r=e[0],o=e[1],a=n(t.dataset.end.split(",").map(Number),2),i=a[0],c=a[1];if(r===i&&o===c){t.remove();return}var l=Z([r,o],[i,c]);if(-1===l){t.remove();return}var u=te(r,o,i,c),s=tr(u);if(s){var d=S.querySelector('li[data-word="'.concat(s,'"]'));d&&(d.classList.contains("found")?t.remove():R(d,t))}else t.remove()}finally{_=null}}(_)}),document.addEventListener("pointermove",function(t){if(U.value){t.preventDefault();var e=document.elementFromPoint(t.clientX,t.clientY);if(null==e?void 0:e.matches("#jamo-board>i")){var r=Q(1*e.dataset.index);if(W[0]===r[0]&&W[1]===r[1])return;var o=Z(W,r);if(-1!==o)K=r,$=o;else if(-1!==K[0]&&-1!==K[1]){var a=n((l=W,u=$,d=(s=n(l,2))[0],f=s[1],p=(y=[(h=(m=n(r,2))[0])-d,(v=m[1])-f])[0],g=y[1],M=(b=[h-d,v-f])[0],w=b[1],E=(S=[h-d,v-f])[0],Math.abs(M)<Math.abs(w)?M=0:w=0,(E+(A=S[1]))%2&&(Math.abs(E)<Math.abs(A)?A-=Math.sign(A):E-=Math.sign(E)),C=Math.abs(Math.abs(E)-Math.abs(A))/2,Math.abs(E)<Math.abs(A)?(E+=Math.sign(E)*C,A-=Math.sign(A)*C):(E-=Math.sign(E)*C,A+=Math.sign(A)*C),(P=Math.abs(p-M)+Math.abs(g-w))===(j=Math.abs(p-E)+Math.abs(g-A))?u%2==0?[d+M,f+w]:[d+E,f+A]:P<j?[d+M,f+w]:[d+E,f+A]),2),i=a[0],c=a[1];if(i<0||i>=12||c<0||c>=12){var l,u,s,d,f,m,h,v,y,p,g,b,M,w,S,E,A,C,P,j,x,z=Z(W,[i,c]),L=to(i,0,11),I=to(c,0,11);i=(x=n(q(i,c,z,-Math.max(L,I)),2))[0],c=x[1]}K=[i,c]}-1!==K[0]&&-1!==K[1]&&(T[12*K[1]+K[0]],tt())}}}),M||s("gameState",z()),window.serializeGameState=z;var ta=document.querySelector("main"),ti=function(){var t=screen.availWidth,n=screen.availHeight;S.style.zoom=1,S.style.fontSize="1rem",A.style.zoom=1,ta.style.zoom=1;var e=S.getBoundingClientRect().width,r=A.getBoundingClientRect().width;S.style.zoom=Math.min(1,t/e),S.style.fontSize="".concat(1/S.style.zoom,"rem"),A.style.zoom=Math.min(1,t/r);var o=ta.getBoundingClientRect().height;ta.style.zoom=Math.min(1,n/o)};ti(),window.addEventListener("resize",ti),window.addEventListener("beforeunload",function(){u("gameState")&&s("gameState",z())}),performance.now()}(),document.getElementById("show-settings-panel").addEventListener("click",function(){document.getElementById("settings-panel").showModal()});

//# sourceMappingURL=js.js.map