var e,t,n;function r(e,t,n,r,o,a,l){try{var i=e[a](l),s=i.value}catch(e){n(e);return}i.done?t(s):Promise.resolve(s).then(r,o)}performance.now();const o=document.currentScript.outerHTML,a=document.body.innerHTML.replace(o,""),l=`사과
바나나
포도
딸기
오렌지
체리
복숭아
수박
파인애플
배
레몬
라즈베리
블루베리
키위
망고
참외
아보카도
석류
자몽
두리안
코코넛
라임
자두
무화과
감
살구
상추
양파
당근
감자
토마토
오이
시금치
호박
콩
옥수수
파프리카
브로콜리
고구마
아스파라거스
샐러리
양배추
고추
버섯
마늘
생강
비트
콜라비
아티초크
미역
김
호박
피망
죽순
무
고사리
갓
청경채
케일
취나물
치커리
미나리
더덕
토란
귤
대추
파파야
복분자
유자
부추
매실
호두
가지
노각`.split("\n"),i={s1:0,s2:0,setSeed(e){this.s1=e,this.s2=e},random(){return this.s1=1103515245*this.s1+12345&2147483647,this.s2^=this.s2<<13,this.s2^=this.s2>>17,this.s2^=this.s2<<5,(this.s1^this.s2+2147483648)/4294967295}};function s(){let r;if(window.hwgInitialized)throw Error("Game was already initialized.");window.hwgInitialized=!0;let o=document.getElementById("stage"),a=[[3,2,1],[4,-1,0],[5,6,7]],[s,h,m]=[..."각".normalize("NFD")],f=12623-h.charCodeAt(0),p=Object.fromEntries(Object.entries({ㄱㄱ:"ㄲ",ㄱㅅ:"ㄳ",ㄴㅈ:"ㄵ",ㄴㅎ:"ㄶ",ㄷㄷ:"ㄸ",ㄹㄱ:"ㄺ",ㄹㅁ:"ㄻ",ㄹㅂ:"ㄼ",ㄹㅅ:"ㄽ",ㄹㅌ:"ㄾ",ㄹㅍ:"ㄿ",ㄹㅎ:"ㅀ",ㅂㅂ:"ㅃ",ㅂㅅ:"ㅄ",ㅅㅅ:"ㅆ",ㅈㅈ:"ㅉ",ㅏㅣ:"ㅐ",ㅑㅣ:"ㅒ",ㅓㅣ:"ㅔ",ㅕㅣ:"ㅖ",ㅗㅏ:"ㅘ",ㅗㅏㅣ:"ㅙ",ㅗㅣ:"ㅚ",ㅜㅓ:"ㅝ",ㅜㅓㅣ:"ㅞ",ㅜㅣ:"ㅟ",ㅡㅣ:"ㅢ"}).map(([e,t])=>[t,e])),g=-1,y=1;try{(r=z(u("gameState")))&&(y=r[6])}catch(t){console.error(t),delete e.gameState}o.textContent=y,i.setSeed(y);let w=[...l];function v(e){return[...e.normalize("NFC")].flatMap(x)}let M=[];for(let e=0;e<16;e++)M.push(...w.splice(U(0,w.length-1),1));w.length=0;let b=document.getElementById("word-list"),E=document.getElementById("word-template");M.forEach(e=>{let t=E.content.cloneNode(!0).querySelector("li");t.textContent=e,t.dataset.word=e,b.appendChild(t)});let S=document.getElementById("jamo-board"),$=document.getElementById("jamo-template");S.addEventListener("selectstart",e=>{e.preventDefault()});let C=!1;S.addEventListener("contextmenu",e=>{C||e.preventDefault(),C=!1});let L="ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ";function A(e){return[...e].map(e=>e.charCodeAt()).reduce((e,t)=>(e>>>1|(1&e)<<15)^t,0)}function P(){let e=JSON.stringify({GAME_VERSION:4,width:12,height:12,completions:Array.from(S.querySelectorAll(".completion-bar")).filter(e=>e!==eo).map(e=>`${e.dataset.start},${e.dataset.end}`).join(),stageNumber:y});return`${e}|${A(e)}`}function z(e){if(null===e)return null;let[t,n,r,o,a,l,i,s,d]=e.split("|");if(1*t!=4)throw Error("The saved game state is from a different version of the game.");if(A(`${t}|${n}|${r}|${o}|${a}|${l}|${i}|${s}`)!==1*d||a.length!==r*o)throw Error("saved game state is corrupted");return[n.split(","),1*r,1*o,a,l?l.split(",").map(Number).reduce((e,t)=>(e.length&&4!==e.at(-1).length||e.push([]),e.at(-1).push(t),e),[]):[],1*i,1*s]}function x(e){let[t,n,r]=[...e.normalize("NFD")].concat(["","",""]).slice(0,3);return["ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"[t.charCodeAt(0)-s.charCodeAt(0)],String.fromCharCode(n.charCodeAt(0)+f),r.length?"ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"[r.charCodeAt(0)-m.charCodeAt(0)]:""].flatMap(e=>{var t;return[...null!==(t=p[e])&&void 0!==t?t:e]})}let B=()=>L[U(0,L.length-1)],I=M.flatMap(e=>[...e.normalize("NFC")].flatMap(x)),N=()=>I[U(0,I.length-1)];function k(e,n){n.classList.add("no-transition"),e(),t(()=>{t(()=>{n.classList.remove("no-transition")})})}S.style.setProperty("--gap","0.75em"),S.style.setProperty("--width",12),S.style.setProperty("--height",12),k(()=>{for(let e=0;e<144;e++){let e=$.content.cloneNode(!0).querySelector("i"),t=U(0,1)?B():N();e.dataset.jamo=t,S.appendChild(e)}},S);let j=Array.from({length:144},()=>null),R=(e,t,n,r)=>{if(n<0||n>7)throw RangeError("direction must be 0 to 7");for(let o=-1;o<=1;o++)for(let l=-1;l<=1;l++)if(a[o+1][l+1]===n)return[e+l*r,t+o*r]},q=S.querySelectorAll("#jamo-board>i");q.forEach((e,t)=>{e.dataset.index=t});let O=(e,t,n,r)=>{let o=v(e);if(o.length>12&&o.length>12)throw RangeError("word too long for board");for(let e=0;e<o.length;e++){let[a,l]=R(t,n,r,e);if(a<0||a>=12||l<0||l>=12)return!1;let i=j[12*l+a];if(i&&i!==o[e])return!1}for(let e=0;e<o.length;e++){let[a,l]=R(t,n,r,e),i=o[e],s=12*l+a;j[s]=i,q[s].dataset.jamo=i}return!0};function D(e,t){var n;let r=null!==(n=D.cache)&&void 0!==n?n:D.cache=new Map;if(r.has(e))return r.get(e);let o=t();return r.set(e,o),o}function T(e,t,n,r,o=null){let a=D(T,()=>document.getElementById("completion-bar-template")),l=null!=o?o:a.content.cloneNode(!0).querySelector(".completion-bar");l.dataset.start=`${e},${t}`,l.dataset.end=`${n},${r}`;let i=Math.min(e,n),s=Math.max(e,n),d=Math.min(t,r),u=Math.max(t,r),c=(s-i+1)*2+.75*(s-i),h=(u-d+1)*2+.75*(u-d);return l.style.setProperty("--top",`${2*d+.75*d}em`),l.style.setProperty("--left",`${2*i+.75*i}em`),l.style.setProperty("--width",`${c}em`),l.style.setProperty("--height",`${h}em`),l.style.setProperty("--thick","2.25em"),l.style.setProperty("--hypot",`${Math.hypot(c,h)+.25}em`),l.style.setProperty("--angle",`${180*Math.atan2(Math.sign(r-t)*h,Math.sign(n-e)*c)/Math.PI}deg`),l.style.setProperty("--hue",g+Math.floor(43758.5453*Math.sin(12.9898*e+78.233*t)%1*X)*Math.floor(360/X)),l}S.style.setProperty("--size","2rem");let F=0,V=document.getElementById("stage-clear-dialog"),G=V.querySelector("#next-stage"),H=V.querySelector("#cancel-next-stage");function J(e,t){F++,e.style.setProperty("--hue",t.style.getPropertyValue("--hue")),e.classList.add("found"),16===F&&V.showModal()}function U(e,t){return Math.floor(i.random()*(t-e+1))+e}G.addEventListener("click",()=>{y++,z(P())[6]=y,c("gameState",P()),d()},{passive:!0}),H.addEventListener("click",()=>{V.close()},{passive:!0});let X=16;g=U(0,359);let Y=Array.from({length:4},()=>16),W=64,_=()=>{let e=U(0,W-1),t=0;for(let n=0;n<4;n++)if(e<(t+=Y[n]))return n};try{M.toSorted((e,t)=>v(t).length-v(e).length).forEach(e=>{let t,n,r;let o=0;for(;;){t=U(0,11),n=U(0,11);let a=((r=_())+6)%8;if(O(e,t,n,a)){Y[r]--,W--,16-Y[r]>16/3&&(W-=Y[r],Y[r]=0);break}if(o>256)throw Error("The board generation was stuck in impossible state, so the page was reloaded.");o++}})}catch(e){console.error(e),d();return}r&&r[4].forEach(([e,t,n,r])=>{!function(e,t,n,r){let o=T(e,t,n,r),a=es(ei(e,t,n,r));J(b.querySelector(`li[data-word="${a}"]`),o),S.appendChild(o)}(e,t,n,r)});let K=document.getElementById("dark-mode-toggle");K.addEventListener("click",()=>{let t;let n=K.dataset.mode,r=K.dataset.modeOptions.split("|"),o=r[(r.indexOf(n)+1)%r.length];t=()=>{K.dataset.mode=o,document.documentElement.dataset.mode=o},document.startViewTransition?document.startViewTransition(t):t(),e.darkMode=o},{passive:!0});let Q=e.darkMode;Q&&k(()=>{K.dataset.mode=Q,document.documentElement.dataset.mode=Q},K);let Z=new Proxy({value:!1},{set:(e,t,n)=>{if("value"===t&&"boolean"==typeof n)return Reflect.set(e,t,n)}}),ee=[-1,-1],et=-1,en=[-1,-1];function er(e,t){let[n,r]=e,[o,l]=t;if(!(n===o||r===l||Math.abs(n-o)===Math.abs(r-l)))return -1;let[i,s]=[o-n,l-r];return a[Math.sign(s)+1][Math.sign(i)+1]}let eo=null;function ea(){if(!(-1!==ee[0]&&-1!==ee[1]))return;let e=null!==eo,[t,n]=ee,[r,o]=-1===en[0]&&-1===en[1]?[t,n]:en;eo=T(t,n,r,o,eo),e||S.appendChild(eo)}function el(e,t){let n=e<t?1:-1,r=[];for(let o=0;o<=Math.abs(t-e);o++)r.push(o*n+e);return r}function ei(e,t,n,r){let o=el(e,n),a=el(t,r);return Array.from({length:Math.max(o.length,a.length)},(n,r)=>{var l,i;return[null!==(l=o[r])&&void 0!==l?l:e,null!==(i=a[r])&&void 0!==i?i:t]}).map(([e,t])=>q[12*t+e].dataset.jamo).join("")}function es(e){return M.find(t=>{let[n,r]=D(t,()=>{let e=v(t);return[e.join(""),e.toReversed().join("")]});return n===e||r===e})}function ed(e,t,n){return e<t?t-e:e>n?e-n:0}function eu(e,t){let[n,r,o,a,l,i]=function(){let e=q[0],t=q[1],n=q[12],r=e.getBoundingClientRect(),o=t.getBoundingClientRect(),a=n.getBoundingClientRect(),l=o.left-r.left,i=a.top-r.top,s=r.left;return[s,r.top,l,i,o.left-r.right,a.top-r.bottom]}(),[s,d]=[e-(n-l/2),t-(r-i/2)],[u,c]=[Math.floor(s/o),Math.floor(d/a)];return[u,c]}function ec(e,t,n){return Math.min(n,Math.max(t,e))}S.addEventListener("pointerdown",e=>{e.target.matches("#jamo-board>i")&&(Z.value=!0,ee=eu(e.clientX,e.clientY),en=[-1,-1],et=-1,ea())},{passive:!0}),document.addEventListener("pointerup",e=>{C=2===e.button,Z.value=!1,ee[0]===en[0]&&ee[1]===en[1]?(null==eo||eo.remove(),eo=null):-1!==en[0]&&-1!==en[1]&&function(e){try{if(null===e)return;let[t,n]=e.dataset.start.split(",").map(Number),[r,o]=e.dataset.end.split(",").map(Number);if(t===r&&n===o){e.remove();return}let a=er([t,n],[r,o]);if(-1===a){e.remove();return}let l=ei(t,n,r,o),i=es(l);if(i){let t=b.querySelector(`li[data-word="${i}"]`);t&&(t.classList.contains("found")?e.remove():J(t,e))}else e.remove()}finally{eo=null}}(eo)},{passive:!0}),document.addEventListener("pointermove",e=>{if(!Z.value)return;e.preventDefault();let t=eu(e.clientX,e.clientY);if(t[0]=ec(t[0],0,11),t[1]=ec(t[1],0,11),ee[0]===t[0]&&ee[1]===t[1])return;let n=er(ee,t);if(-1!==n?(en=t,et=n):-1!==en[0]&&-1!==en[1]&&(en=function(e,t,n){let[r,o]=e,[a,l]=t,[i,s]=[a-r,l-o],[d,u]=[a-r,l-o],[c,h]=[a-r,l-o];Math.abs(d)<Math.abs(u)?d=0:u=0,(c+h)%2&&(Math.abs(c)<Math.abs(h)?h-=Math.sign(h):c-=Math.sign(c));{let e=Math.abs(Math.abs(c)-Math.abs(h))/2;Math.abs(c)<Math.abs(h)?(c+=Math.sign(c)*e,h-=Math.sign(h)*e):(c-=Math.sign(c)*e,h+=Math.sign(h)*e)}let m=Math.abs(i-d)+Math.abs(s-u),f=Math.abs(i-c)+Math.abs(s-h);return m===f?n%2==0?[r+d,o+u]:[r+c,o+h]:m<f?[r+d,o+u]:[r+c,o+h]}(ee,t,et)),!(-1!==en[0]&&-1!==en[1]))return;let[r,o]=en;if(r<0||r>=12||o<0||o>=12){let e=er(ee,[r,o]),t=ed(r,0,11),n=ed(o,0,11);[r,o]=R(r,o,e,-Math.max(t,n))}q[12*(en=[r,o])[1]+en[0]],ea()}),r||c("gameState",P()),window.serializeGameState=P;let eh=()=>{let e=n.availWidth;b.style.zoom=1,b.style.fontSize="1rem",S.style.setProperty("--zoom",1);let t=b.getBoundingClientRect().width,r=S.getBoundingClientRect().width;b.style.zoom=Math.min(1,e/t),b.style.fontSize=`${1/b.style.zoom}rem`,S.style.setProperty("--zoom",Math.min(1,e/r))};eh(),window.addEventListener("resize",eh,{passive:!0}),window.addEventListener("beforeunload",()=>{c("beforeunload",u("beforeunload",0)+1),u("gameState")&&c("gameState",P())},{passive:!0}),window.addEventListener("pagehide",()=>{c("pagehide",u("pagehide",0)+1)},{passive:!0}),performance.now()}function d(){[...document.body.children].filter(e=>e!==document.currentScript).forEach(e=>e.remove()),document.body.innerHTML=a,window.hwgInitialized=!1,s()}function u(t,n){let r=e[t];return"string"==typeof r?JSON.parse(r):null!=n?n:null}function c(t,n){e[t]=JSON.stringify(n)}window.average=function(e){return e.reduce((e,t)=>e+t,0)/e.length},window.median=function(e){let t=e.slice().sort((e,t)=>e-t),n=Math.floor(t.length/2);return t.length%2==0?(t[n-1]+t[n])/2:t[n]},window.getCurrentFunctionName=function(){return Error().stack.split("\n").slice(1)[1].match(/at (\w+)/)[1]},performance.now(),s(),function(){var e,t;let n=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a","Enter"],o=0,a=(e=function*(e){e.key===n[o]?++o===n.length&&(console.log("showing lunatic text"),window.removeEventListener("keydown",a)):o=0},t=function(){var t=this,n=arguments;return new Promise(function(o,a){var l=e.apply(t,n);function i(e){r(l,o,a,i,s,"next",e)}function s(e){r(l,o,a,i,s,"throw",e)}i(void 0)})},function(e){return t.apply(this,arguments)});window.addEventListener("keydown",a,{passive:!0})}(),document.getElementById("show-settings-panel").addEventListener("click",()=>{document.getElementById("settings-panel").showModal()});

//# sourceMappingURL=js.js.map