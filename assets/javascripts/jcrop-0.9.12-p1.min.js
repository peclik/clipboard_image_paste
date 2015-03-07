/**
 * jquery.Jcrop.js v0.9.12-p1
 * jQuery Image Cropping Plugin - released under MIT License
 * Author: Kelly Hallman <khallman@gmail.com>
 * http://github.com/tapmodo/Jcrop
 * Copyright (c) 2008-2013 Tapmodo Interactive LLC
 */
!function(e){e.Jcrop=function(t,n){function r(e){var t=e.indexOf("MSIE ")
return t>0||e.match(/Trident.*rv\:11\./)?!0:!1}function o(e){var t=e.indexOf("MSIE "),n=parseInt(e.substring(t+5,e.indexOf(".",t)))
return 6>=n}function i(e){return Math.round(e)+"px"}function a(e){return A.baseClass+"-"+e}function s(){return e.fx.step.hasOwnProperty("backgroundColor")}function c(t){var n=e(t).offset()
return[n.left,n.top]}function u(e){return[e.pageX-T[0],e.pageY-T[1]]}function d(t){"object"!=typeof t&&(t={}),A=e.extend(A,t),e.each(["onChange","onSelect","onRelease","onDblClick"],function(e,t){"function"!=typeof A[t]&&(A[t]=function(){})})}function l(e,t,n){if(T=c(X),bt.setCursor("move"===e?e:e+"-resize"),"move"===e)return bt.activateHandlers(h(t),v,n)
var r=ht.getFixed(),o=p(e),i=ht.getCorner(p(o))
ht.setPressed(ht.getCorner(o)),ht.setCurrent(i),bt.activateHandlers(f(e,r),v,n)}function f(e,t){return function(n){if(A.aspectRatio)switch(e){case"e":n[1]=t.y+1
break
case"w":n[1]=t.y+1
break
case"n":n[0]=t.x+1
break
case"s":n[0]=t.x+1}else switch(e){case"e":n[1]=t.y2
break
case"w":n[1]=t.y2
break
case"n":n[0]=t.x2
break
case"s":n[0]=t.x2}ht.setCurrent(n),gt.update()}}function h(e){var t=e
return wt.watchKeys(),function(e){ht.moveOffset([e[0]-t[0],e[1]-t[1]]),t=e,gt.update()}}function p(e){switch(e){case"n":return"sw"
case"s":return"nw"
case"e":return"nw"
case"w":return"ne"
case"ne":return"sw"
case"nw":return"se"
case"se":return"nw"
case"sw":return"ne"}}function g(e){return function(t){return A.disabled?!1:"move"!==e||A.allowMove?(T=c(X),it=!0,l(e,u(t)),t.stopPropagation(),t.preventDefault(),!1):!1}}function b(e,t,n){var r=e.width(),o=e.height()
r>t&&t>0&&(r=t,o=t/e.width()*e.height()),o>n&&n>0&&(o=n,r=n/e.height()*e.width()),rt=e.width()/r,ot=e.height()/o,e.width(r).height(o)}function w(e){return{x:e.x*rt,y:e.y*ot,x2:e.x2*rt,y2:e.y2*ot,w:e.w*rt,h:e.h*ot}}function v(){var e=ht.getFixed()
e.w>A.minSelect[0]&&e.h>A.minSelect[1]?(gt.enableHandles(),gt.done()):gt.release(),bt.setCursor(A.allowSelect?"crosshair":"default")}function y(e){if(!A.disabled&&A.allowSelect){it=!0,T=c(X),gt.disableHandles(),bt.setCursor("crosshair")
var t=u(e)
return ht.setPressed(t),gt.update(),bt.activateHandlers(m,v,"touch"===e.type.substring(0,5)),wt.watchKeys(),e.stopPropagation(),e.preventDefault(),!1}}function m(e){ht.setCurrent(e),gt.update()}function x(){var t=e("<div></div>").addClass(a("tracker"))
return E&&t.css({opacity:0,backgroundColor:"white"}),t}function C(e){V.removeClass().addClass(a("holder")).addClass(e)}function S(e,t){function n(){window.setTimeout(v,l)}var r=e[0]/rt,o=e[1]/ot,i=e[2]/rt,a=e[3]/ot
if(!at){var s=ht.flipCoords(r,o,i,a),c=ht.getFixed(),u=[c.x,c.y,c.x2,c.y2],d=u,l=A.animationDelay,f=s[0]-u[0],h=s[1]-u[1],p=s[2]-u[2],g=s[3]-u[3],b=0,w=A.swingSpeed
r=d[0],o=d[1],i=d[2],a=d[3],gt.animMode(!0)
var v=function(){return function(){b+=(100-b)/w,d[0]=Math.round(r+b/100*f),d[1]=Math.round(o+b/100*h),d[2]=Math.round(i+b/100*p),d[3]=Math.round(a+b/100*g),b>=99.8&&(b=100),100>b?(O(d),n()):(gt.done(),gt.animMode(!1),"function"==typeof t&&t.call(vt))}}()
n()}}function k(e){O([e[0]/rt,e[1]/ot,e[2]/rt,e[3]/ot]),A.onSelect.call(vt,w(ht.getFixed())),gt.enableHandles()}function O(e){ht.setPressed([e[0],e[1]]),ht.setCurrent([e[2],e[3]]),gt.update()}function z(){return w(ht.getFixed())}function M(){return ht.getFixed()}function j(e){d(e),J()}function F(){A.disabled=!0,gt.disableHandles(),gt.setCursor("default"),bt.setCursor("default")}function H(){A.disabled=!1,J()}function I(){gt.done(),bt.activateHandlers(null,null)}function D(){V.remove(),Y.show(),Y.css("visibility","visible"),e(t).removeData("Jcrop")}function B(e,t){gt.release(),F()
var n=new Image
n.onload=function(){var r=n.width,o=n.height,i=A.boxWidth,a=A.boxHeight
X.width(r).height(o),X.attr("src",e),Q.attr("src",e),b(X,i,a),G=X.width(),N=X.height(),Q.width(G).height(N),ut.width(G+2*ct).height(N+2*ct),V.width(G).height(N),pt.resize(G,N),H(),"function"==typeof t&&t.call(vt)},n.src=e}function P(e,t,n){var r=t||A.bgColor
A.bgFade&&s()&&A.fadeTime&&!n?e.animate({backgroundColor:r},{queue:!1,duration:A.fadeTime}):e.css("backgroundColor",r)}function J(e){A.allowResize?e?gt.enableOnly():gt.enableHandles():gt.disableHandles(),bt.setCursor(A.allowSelect?"crosshair":"default"),gt.setCursor(A.allowMove?"move":"default"),A.hasOwnProperty("trueSize")&&(rt=A.trueSize[0]/G,ot=A.trueSize[1]/N),A.hasOwnProperty("setSelect")&&(k(A.setSelect),gt.done(),delete A.setSelect),pt.refresh(),A.bgColor!=dt&&(P(A.shade?pt.getShades():V,A.shade?A.shadeColor||A.bgColor:A.bgColor),dt=A.bgColor),lt!=A.bgOpacity&&(lt=A.bgOpacity,A.shade?pt.refresh():gt.setBgOpacity(lt)),_=A.maxSize[0]||0,et=A.maxSize[1]||0,tt=A.minSize[0]||0,nt=A.minSize[1]||0,A.hasOwnProperty("outerImage")&&(X.attr("src",A.outerImage),delete A.outerImage),gt.refresh()}var T,A=e.extend({},e.Jcrop.defaults),R=navigator.userAgent.toLowerCase(),E=r(R),K=o(R)
"object"!=typeof t&&(t=e(t)[0]),"object"!=typeof n&&(n={}),d(n)
var W={border:"none",visibility:"visible",margin:0,padding:0,position:"absolute",top:0,left:0},Y=e(t),q=!0
if("IMG"==t.tagName){if(0!=Y[0].width&&0!=Y[0].height)Y.width(Y[0].width),Y.height(Y[0].height)
else{var L=new Image
L.src=Y[0].src,Y.width(L.width),Y.height(L.height)}var X=Y.clone().removeAttr("id").css(W).show()
X.width(Y.width()),X.height(Y.height()),Y.after(X).hide()}else X=Y.css(W).show(),q=!1,null===A.shade&&(A.shade=!0)
b(X,A.boxWidth,A.boxHeight)
var G=X.width(),N=X.height(),V=e("<div />").width(G).height(N).addClass(a("holder")).css({position:"relative",backgroundColor:A.bgColor}).insertAfter(Y).append(X)
A.addClass&&V.addClass(A.addClass)
var Q=e("<div />"),U=e("<div />").width("100%").height("100%").css({zIndex:310,position:"absolute",overflow:"hidden"}),Z=e("<div />").width("100%").height("100%").css("zIndex",320),$=e("<div />").css({position:"absolute",zIndex:600}).dblclick(function(){var e=ht.getFixed()
A.onDblClick.call(vt,e)}).insertBefore(X).append(U,Z)
q&&(Q=e("<img />").attr("src",X.attr("src")).css(W).width(G).height(N),U.append(Q)),K&&$.css({overflowY:"hidden"})
var _,et,tt,nt,rt,ot,it,at,st,ct=A.boundary,ut=x().width(G+2*ct).height(N+2*ct).css({position:"absolute",top:i(-ct),left:i(-ct),zIndex:290}).mousedown(y),dt=A.bgColor,lt=A.bgOpacity
T=c(X)
var ft=function(){function e(){var e,t={},n=["touchstart","touchmove","touchend"],r=document.createElement("div")
try{for(e=0;e<n.length;e++){var o=n[e]
o="on"+o
var i=o in r
i||(r.setAttribute(o,"return;"),i="function"==typeof r[o]),t[n[e]]=i}return t.touchstart&&t.touchend&&t.touchmove}catch(a){return!1}}function t(){return A.touchSupport===!0||A.touchSupport===!1?A.touchSupport:e()}return{createDragger:function(e){return function(t){return A.disabled?!1:"move"!==e||A.allowMove?(T=c(X),it=!0,l(e,u(ft.cfilter(t)),!0),t.stopPropagation(),t.preventDefault(),!1):!1}},newSelection:function(e){return y(ft.cfilter(e))},cfilter:function(e){return e.pageX=e.originalEvent.changedTouches[0].pageX,e.pageY=e.originalEvent.changedTouches[0].pageY,e},isSupported:e,support:t()}}(),ht=function(){function e(e){e=a(e),p=f=e[0],g=h=e[1]}function t(e){e=a(e),d=e[0]-p,l=e[1]-g,p=e[0],g=e[1]}function n(){return[d,l]}function r(e){var t=e[0],n=e[1]
0>f+t&&(t-=t+f),0>h+n&&(n-=n+h),g+n>N&&(n+=N-(g+n)),p+t>G&&(t+=G-(p+t)),f+=t,p+=t,h+=n,g+=n}function o(e){var t=i()
switch(e){case"ne":return[t.x2,t.y]
case"nw":return[t.x,t.y]
case"se":return[t.x2,t.y2]
case"sw":return[t.x,t.y2]}}function i(){if(!A.aspectRatio)return c()
var e,t,n,r,o=A.aspectRatio,i=A.minSize[0]/rt,a=A.maxSize[0]/rt,d=A.maxSize[1]/ot,l=p-f,b=g-h,w=Math.abs(l),v=Math.abs(b),y=w/v
return 0===a&&(a=10*G),0===d&&(d=10*N),o>y?(t=g,n=v*o,e=0>l?f-n:n+f,0>e?(e=0,r=Math.abs((e-f)/o),t=0>b?h-r:r+h):e>G&&(e=G,r=Math.abs((e-f)/o),t=0>b?h-r:r+h)):(e=p,r=w/o,t=0>b?h-r:h+r,0>t?(t=0,n=Math.abs((t-h)*o),e=0>l?f-n:n+f):t>N&&(t=N,n=Math.abs(t-h)*o,e=0>l?f-n:n+f)),e>f?(i>e-f?e=f+i:e-f>a&&(e=f+a),t=t>h?h+(e-f)/o:h-(e-f)/o):f>e&&(i>f-e?e=f-i:f-e>a&&(e=f-a),t=t>h?h+(f-e)/o:h-(f-e)/o),0>e?(f-=e,e=0):e>G&&(f-=e-G,e=G),0>t?(h-=t,t=0):t>N&&(h-=t-N,t=N),u(s(f,h,e,t))}function a(e){return e[0]<0&&(e[0]=0),e[1]<0&&(e[1]=0),e[0]>G&&(e[0]=G),e[1]>N&&(e[1]=N),[Math.round(e[0]),Math.round(e[1])]}function s(e,t,n,r){var o=e,i=n,a=t,s=r
return e>n&&(o=n,i=e),t>r&&(a=r,s=t),[o,a,i,s]}function c(){var e,t=p-f,n=g-h
return _&&Math.abs(t)>_&&(p=t>0?f+_:f-_),et&&Math.abs(n)>et&&(g=n>0?h+et:h-et),nt/ot&&Math.abs(n)<nt/ot&&(g=n>0?h+nt/ot:h-nt/ot),tt/rt&&Math.abs(t)<tt/rt&&(p=t>0?f+tt/rt:f-tt/rt),0>f&&(p-=f,f-=f),0>h&&(g-=h,h-=h),0>p&&(f-=p,p-=p),0>g&&(h-=g,g-=g),p>G&&(e=p-G,f-=e,p-=e),g>N&&(e=g-N,h-=e,g-=e),f>G&&(e=f-N,g-=e,h-=e),h>N&&(e=h-N,g-=e,h-=e),u(s(f,h,p,g))}function u(e){return{x:e[0],y:e[1],x2:e[2],y2:e[3],w:e[2]-e[0],h:e[3]-e[1]}}var d,l,f=0,h=0,p=0,g=0
return{flipCoords:s,setPressed:e,setCurrent:t,getOffset:n,moveOffset:r,getCorner:o,getFixed:i}}(),pt=function(){function t(e,t){p.left.css({height:i(t)}),p.right.css({height:i(t)})}function n(){return r(ht.getFixed())}function r(e){p.top.css({left:i(e.x),width:i(e.w),height:i(e.y)}),p.bottom.css({top:i(e.y2),left:i(e.x),width:i(e.w),height:i(N-e.y2)}),p.right.css({left:i(e.x2),width:i(G-e.x2)}),p.left.css({width:i(e.x)})}function o(){return e("<div />").css({position:"absolute",backgroundColor:A.shadeColor||A.bgColor}).appendTo(h)}function a(){f||(f=!0,h.insertBefore(X),n(),gt.setBgOpacity(1,0,1),Q.hide(),s(A.shadeColor||A.bgColor,1),gt.isAwake()?u(A.bgOpacity,1):u(1,1))}function s(e,t){P(l(),e,t)}function c(){f&&(h.remove(),Q.show(),f=!1,gt.isAwake()?gt.setBgOpacity(A.bgOpacity,1,1):(gt.setBgOpacity(1,1,1),gt.disableHandles()),P(V,0,1))}function u(e,t){f&&(A.bgFade&&!t?h.animate({opacity:1-e},{queue:!1,duration:A.fadeTime}):h.css({opacity:1-e}))}function d(){A.shade?a():c(),gt.isAwake()&&u(A.bgOpacity)}function l(){return h.children()}var f=!1,h=e("<div />").css({position:"absolute",zIndex:240,opacity:0}),p={top:o(),left:o().height(N),right:o().height(N),bottom:o()}
return{update:n,updateRaw:r,getShades:l,setBgColor:s,enable:a,disable:c,resize:t,refresh:d,opacity:u}}(),gt=function(){function t(t){var n=e("<div />").css({position:"absolute",opacity:A.borderOpacity}).addClass(a(t))
return U.append(n),n}function n(t,n){var r=e("<div />").mousedown(g(t)).css({cursor:t+"-resize",position:"absolute",zIndex:n}).addClass("ord-"+t)
return ft.support&&r.bind("touchstart.jcrop",ft.createDragger(t)),Z.append(r),r}function r(e){var t=A.handleSize,r=n(e,M++).css({opacity:A.handleOpacity}).addClass(a("handle"))
return t&&r.width(t).height(t),r}function o(e){return n(e,M++).addClass("jcrop-dragbar")}function s(e){var t
for(t=0;t<e.length;t++)H[e[t]]=o(e[t])}function c(e){var n,r
for(r=0;r<e.length;r++){switch(e[r]){case"n":n="hline"
break
case"s":n="hline bottom"
break
case"e":n="vline right"
break
case"w":n="vline"}j[e[r]]=t(n)}}function u(e){var t
for(t=0;t<e.length;t++)F[e[t]]=r(e[t])}function d(e,t){A.shade||Q.css({top:i(-t),left:i(-e)}),$.css({top:i(t),left:i(e)})}function l(e,t){$.width(Math.round(e)).height(Math.round(t))}function f(){var e=ht.getFixed()
ht.setPressed([e.x,e.y]),ht.setCurrent([e.x2,e.y2]),h()}function h(e){return z?p(e):void 0}function p(e){var t=ht.getFixed()
l(t.w,t.h),d(t.x,t.y),A.shade&&pt.updateRaw(t),z||v(),e?A.onSelect.call(vt,w(t)):A.onChange.call(vt,w(t))}function b(e,t,n){(z||t)&&(A.bgFade&&!n?X.animate({opacity:e},{queue:!1,duration:A.fadeTime}):X.css("opacity",e))}function v(){$.show(),A.shade?pt.opacity(lt):b(lt,!0),z=!0}function y(){S(),$.hide(),A.shade?pt.opacity(1):b(1),z=!1,A.onRelease.call(vt)}function m(){I&&Z.show()}function C(){return I=!0,A.allowResize?(Z.show(),!0):void 0}function S(){I=!1,Z.hide()}function k(e){e?(at=!0,S()):(at=!1,C())}function O(){k(!1),f()}var z,M=370,j={},F={},H={},I=!1
A.dragEdges&&e.isArray(A.createDragbars)&&s(A.createDragbars),e.isArray(A.createHandles)&&u(A.createHandles),A.drawBorders&&e.isArray(A.createBorders)&&c(A.createBorders),e(document).bind("touchstart.jcrop-ios",function(t){e(t.currentTarget).hasClass("jcrop-tracker")&&t.stopPropagation()})
var D=x().mousedown(g("move")).css({cursor:"move",position:"absolute",zIndex:360})
return ft.support&&D.bind("touchstart.jcrop",ft.createDragger("move")),U.append(D),S(),{updateVisible:h,update:p,release:y,refresh:f,isAwake:function(){return z},setCursor:function(e){D.css("cursor",e)},enableHandles:C,enableOnly:function(){I=!0},showHandles:m,disableHandles:S,animMode:k,setBgOpacity:b,done:O}}(),bt=function(){function t(t){ut.css({zIndex:450}),t?e(document).bind("touchmove.jcrop",a).bind("touchend.jcrop",s):f&&e(document).bind("mousemove.jcrop",r).bind("mouseup.jcrop",o)}function n(){ut.css({zIndex:290}),e(document).unbind(".jcrop")}function r(e){return d(u(e)),!1}function o(e){return e.preventDefault(),e.stopPropagation(),it&&(it=!1,l(u(e)),gt.isAwake()&&A.onSelect.call(vt,w(ht.getFixed())),n(),d=function(){},l=function(){}),!1}function i(e,n,r){return it=!0,d=e,l=n,t(r),!1}function a(e){return d(u(ft.cfilter(e))),!1}function s(e){return o(ft.cfilter(e))}function c(e){ut.css("cursor",e)}var d=function(){},l=function(){},f=A.trackDocument
return f||ut.mousemove(r).mouseup(o).mouseout(o),X.before(ut),{activateHandlers:i,setCursor:c}}(),wt=function(){function t(){A.keySupport&&(i.show(),i.focus())}function n(){i.hide()}function r(e,t,n){A.allowMove&&(ht.moveOffset([t,n]),gt.updateVisible(!0)),e.preventDefault(),e.stopPropagation()}function o(e){if(e.ctrlKey||e.metaKey)return!0
st=e.shiftKey?!0:!1
var t=st?10:1
switch(e.keyCode){case 37:r(e,-t,0)
break
case 39:r(e,t,0)
break
case 38:r(e,0,-t)
break
case 40:r(e,0,t)
break
case 27:A.allowSelect&&gt.release()
break
case 9:return!0}return!1}var i=e('<input type="radio" />').css({position:"fixed",left:"-120px",width:"12px"}).addClass("jcrop-keymgr"),a=e("<div />").css({position:"absolute",overflow:"hidden"}).append(i)
return A.keySupport&&(i.keydown(o).blur(n),K||!A.fixedSupport?(i.css({position:"absolute",left:"-20px"}),a.append(i).insertBefore(X)):i.insertBefore(X)),{watchKeys:t}}()
ft.support&&ut.bind("touchstart.jcrop",ft.newSelection),Z.hide(),J(!0)
var vt={setImage:B,animateTo:S,setSelect:k,setOptions:j,tellSelect:z,tellScaled:M,setClass:C,disable:F,enable:H,cancel:I,release:gt.release,destroy:D,focus:wt.watchKeys,getBounds:function(){return[G*rt,N*ot]},getWidgetSize:function(){return[G,N]},getScaleFactor:function(){return[rt,ot]},getOptions:function(){return A},ui:{holder:V,selection:$}}
return E&&V.bind("selectstart",function(){return!1}),Y.data("Jcrop",vt),vt},e.fn.Jcrop=function(t,n){var r
return this.each(function(){if(e(this).data("Jcrop")){if("api"===t)return e(this).data("Jcrop")
e(this).data("Jcrop").setOptions(t)}else"IMG"==this.tagName?e.Jcrop.Loader(this,function(){e(this).css({display:"block",visibility:"hidden"}),r=e.Jcrop(this,t),e.isFunction(n)&&n.call(r)}):(e(this).css({display:"block",visibility:"hidden"}),r=e.Jcrop(this,t),e.isFunction(n)&&n.call(r))}),this},e.Jcrop.Loader=function(t,n,r){function o(){a.complete?(i.unbind(".jcloader"),e.isFunction(n)&&n.call(a)):window.setTimeout(o,50)}var i=e(t),a=i[0]
i.bind("load.jcloader",o).bind("error.jcloader",function(){i.unbind(".jcloader"),e.isFunction(r)&&r.call(a)}),a.complete&&e.isFunction(n)&&(i.unbind(".jcloader"),n.call(a))},e.Jcrop.defaults={allowSelect:!0,allowMove:!0,allowResize:!0,trackDocument:!0,baseClass:"jcrop",addClass:null,bgColor:"black",bgOpacity:.6,bgFade:!1,borderOpacity:.4,handleOpacity:.5,handleSize:null,aspectRatio:0,keySupport:!0,createHandles:["n","s","e","w","nw","ne","se","sw"],createDragbars:["n","s","e","w"],createBorders:["n","s","e","w"],drawBorders:!0,dragEdges:!0,fixedSupport:!0,touchSupport:null,shade:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onDblClick:function(){},onRelease:function(){}}}(jQuery)