define(["eui/modules/uibase"],function(l){var b=l.EComponent;var e=EUI.browser,i=e.isie,j=e.isMobile;function k(o){b.call(this,o);this._isadjustsize=true;this._arrowvisible=true;this._opacity=100;this._btnpanelvisible=true;this.visible=false;this._initFloatHint();this.setAnchored(false);this.setOpacity(100);}EUI.extendClass(k,b,"FloatHint");k.prototype.dispose=function(){this.__userdata=null;this.onclose=null;this.onposition=null;this._target=null;this._anchoredparentnode=null;this._btnpanelvisible=null;if(this.container){this.container._sancomponent=null;this.container.onmouseover=null;this.container.onmouseout=null;this.container=null;}EUI.removeEvent(this._btpane,"click",this._onBtnClickBind);this._onBtnClickBind=null;this.ha=null;this._btpane=null;this._mc=null;this.btPosition=null;this.btClose=null;b.prototype.dispose.call(this);};k.prototype._initFloatHint=function(){var o=[];o.push('<div class="eui-messagehint-arrow-left"></div>');o.push('<div class="eui-messagehint-head">');o.push('<i id="fix" title="'+I18N.getString("eui.modules.efloathint.js.stop","停靠")+'" class="eui-icon eui-icon-fixed"></i>');o.push('<i id="close" title="'+I18N.getString("EUI.COMMON.CLOSE","关闭")+'" class="eui-icon eui-icon-close"></i>');o.push("</div>");o.push('<div class="eui-messagehint-body eui-scroll-auto"></div>');this.container=this.doc.createElement("div");this.container.className="eui-messagehint-container eui-hide";this.container.style.zIndex=2;this.container.innerHTML=o.join("");this.container.onmouseover=g;this.container.onmouseout=d;this.parentElement.appendChild(this.container);this.basedom=this.container;this.ha=this.container.firstChild;this._btpane=this.ha.nextSibling;this._mc=this.container.lastChild;this.btPosition=this._btpane.firstChild;this.btClose=this._btpane.lastChild;this._onBtnClickBind=this.onBtnClick.bind(this);EUI.addEvent(this._btpane,"click",this._onBtnClickBind);if(EUI.browser.isMobile){this.btPosition.style.display="none";}EUI.disableDocTextSelect(this._mc,"text");this.container._sancomponent=this;this.btPosition._sancomponent=this;};k.prototype.setArrow=function(q,p,o){this.align=q;this.vAlign=p;this.setAlign(q,p);this.setArrowPosition(o);};k.prototype.setAlign=function(p,o){if(p==="left"){this.ha.className="eui-messagehint-arrow-right";}else{if(p==="right"){this.ha.className="eui-messagehint-arrow-left";}}if(o==="bottom"){this.setArrowPosition((this.container.offsetHeight-26)+"px");}else{this.setArrowPosition("10px");}};k.prototype.setArrowPosition=function(o){this.ha.style.top=o;};k.prototype.setArrowVisible=function(o){o=!!o;if(this._arrowvisible===o){return;}this._arrowvisible=o;this.ha.style.display=o?"":"none";};k.prototype.setPosition=function(o,s,q){if(!q){this._adjustArrow(o,s);}var r=this._getContainerPositionByArrow(o,s,this.align,this.vAlign);this.container.style.cssText+="left:"+r.x+"px; top:"+r.y+"px;";EUI.showBackGroundIFrame(this.container,true,1);};k.prototype.setWidth=function(o){this.container.style.width=Math.max(parseInt(o,10),50)+"px";};k.prototype.setCanAdjustSize=function(o){this._isadjustsize=typeof(o)=="boolean"?o:false;};k.prototype.setButtonsPaneVisible=function(o){if(this._btnpanelvisible===(o=(o===true))){return;}this._btpane.style.display=(this._btnpanelvisible=o)?"":"none";return o;};k.prototype.isButtonsPaneVisible=function(){return this._btnpanelvisible;};k.prototype._getAnchoredParentNode=function(){var o=this._anchoredparentnode;if(o){return o;}o=this._target;while(o){o=o.parentNode;if(!o){break;}if((o.tagName.toUpperCase()=="DIV"&&EUI.getCurrentStyle(o,"overflow")=="auto")||o.tagName.toUpperCase()=="BODY"){break;}}return this._anchoredparentnode=(o||this.doc.body);};k.prototype._adjustArrow=function(E,A){if(!this._arrowvisible){return;}var F=this.container.offsetWidth+1;var t=this.container.offsetHeight;var C=this._anchoredparentnode||this.doc.body;var B=C.getBoundingClientRect(),r=B["left"],G=B["top"];var s=B["width"]||(B["right"]-r);var o=B["height"]||(B["bottom"]-G);var D=r-C.scrollLeft;var z=G-C.scrollTop;var q=this._getContainerPositionByArrow(E,A,"right","bottom");if(q.x>=D&&q.x+F<=D+s&&q.y>=z&&q.y+t<=z+o){this.setArrow("right","bottom");return;}q=this._getContainerPositionByArrow(E,A,"left","bottom");if(q.x>=D&&q.x+F<=D+s&&q.y>=z&&q.y+t<=z+o){this.setArrow("left","bottom");return;}q=this._getContainerPositionByArrow(E,A,"right","top");if(q.x>=D&&q.x+F<=D+s&&q.y>=z&&q.y+t<=z+o){this.setArrow("right","top");return;}q=this._getContainerPositionByArrow(E,A,"left","top");if(q.x>=D&&q.x+F<=D+s&&q.y>=z&&q.y+t<=z+o){this.setArrow("left","top");return;}var u,v;if(E-D>D+s-E){u="left";}else{u="right";}if(A-z>z+o-A){v="bottom";}else{v="top";}this.setArrow(u,v);};k.prototype._getContainerPositionByArrow=function(u,r,q,t){if(!this._arrowvisible){return{x:u,y:r};}var o=this.container.style.left;this.container.style.left="-99999px";var v=this.container.offsetWidth+1;var p=this.container.offsetHeight;this.container.style.left=o;if(isNaN(v)){v=0;}if(isNaN(p)){p=0;}var s={x:0,y:0,height:0,width:0},z=0;if(this._target){s=m(this._target);z=this._target.getBoundingClientRect().height;}if(q=="right"&&t=="bottom"){if(s.height){r=r-p+Math.min(20,s.height/2);}else{r=r-p+Math.min(20,z/2);}}else{if(q=="left"&&t=="bottom"){u=u-v-10;if(s.height){r=r-p+Math.min(20,s.height/2);}else{r=r-p+Math.min(20,z/2);}}else{if(q=="right"&&t=="top"){}else{if(q=="left"&&t=="top"){u=u-v-10;}}}}return{x:u,y:r};};k.prototype.getBaseDom=function(){return this.container;};function g(){var o=this._sancomponent;if(o._whenDelayHideAcceptMouse&&o._delayHideTimer){o._clearDelayHideTimmer();}}function d(){var o=this._sancomponent;if(o._whenDelayHideAcceptMouse&&!o.isAnchored){o.hide(100,0,true);}}function h(){if(!this._sancomponent){return;}this._sancomponent._btPositionOver=true;}function a(){if(!this._sancomponent){return;}this._sancomponent._btPositionOver=false;}k.prototype.onBtnClick=function(p){p=p||window.event;var o=p.target||p.srcElement,q=o.id;if(q==="fix"){this._overBtPositionClickEvent(p);}else{if(q==="close"){this._overBtCloseClickEvent(p);}}};k.prototype._overBtCloseClickEvent=function(o){this.hide();if(typeof(this.onclose)=="function"){this.onclose(this);}};k.prototype._overBtPositionClickEvent=function(o){this.setAnchored(!this.isAnchored);if(typeof(this.onposition)=="function"){this.onposition(this);}};k.prototype.cacheAnchoredHint=function(){var o=this.wnd["__ESEN$XFloatHint__anchoreds"];if(!o){o=this.wnd["__ESEN$XFloatHint__anchoreds"]=[];EUI.addEvent(this.wnd,"unload",k._disposeAnchoredHintsCache,false);}if(o.indexOf(this)===-1){o.push(this);}if(this.wnd["__ESEN$XFloatHint__"]==this){this.wnd["__ESEN$XFloatHint__"]=null;}};k.removeAnchoredHints=function(q,o){var p=q||window;var r=p["__ESEN$XFloatHint__anchoreds"];if(!r){return;}var s=null;while(r.length>0){s=r.pop();k.removeAHint(s,o);}};k.removeAHint=function(p,o){if(p){if(o){p.container.parentNode.removeChild(p.container);}p.dispose();p=null;}};k._disposeAnchoredHintsCache=function(){var o=this||window;k.removeAnchoredHints(o,false);o["__ESEN$XFloatHint__"]=null;o["__ESEN$XFloatHint__anchoreds"]=null;EUI.removeEvent(o,"unload",k._disposeAnchoredHintsCache);};k.prototype.setAnchored=function(t){this.isAnchored=t;if(this.isAnchored){EUI.removeClassName(this.btPosition,"eui-icon-fixed");EUI.addClassName(this.btPosition,"eui-icon-unfixed");this.btPosition.setAttribute("title",I18N.getString("xui.ctrls.xfloathint.js.3","悬浮"));}else{EUI.removeClassName(this.btPosition,"eui-icon-unfixed");EUI.addClassName(this.btPosition,"eui-icon-fixed");this.btPosition.setAttribute("title",I18N.getString("xui.ctrls.xfloathint.js.2","停靠"));var s=this.wnd["__ESEN$XFloatHint__anchoreds"];if(EUI.isArray(s)&&s.indexOf(this)!==-1){this.hide(1000,null,true);}}if(arguments[1]=="anchorfixed"){var q=this._getAnchoredParentNode();if(q&&this.container.parentNode!=q){var o=EUI.getAbsPosition(this.wnd,this.container,q);q.appendChild(this.container).style.cssText+="; left: "+o.x+"px; top: "+o.y+"px;";}}if(true===this.isAnchored){this.cacheAnchoredHint();}};k.prototype.getContainer=function(){return this._mc;};k.prototype.setInnerHTML=function(t){var s=/(<[^>]+>)([^<]*)(<\/[^>]+>)/g.test(t.replace(/<br\/>|<br \/>|<br>/ig,"\n"));if(!s){t=t.unHTML().replace(/<br\/>|<br \/>|<br>|\\r\\n|\\r|\\n/ig,"\n");}if(t){var r=t.split("\n");r=r.sort(function(u,p){return EUI.getStrWidth(p)-EUI.getStrWidth(u);});var o=this.doc.createElement("div");o.style.cssText+=";position: absolute;display: inline-block;visibility: hidden;word-wrap: break-word;word-break: break-all;";EUI.setTextContent(o,r[0]);this.doc.body.appendChild(o);var q=Math.floor(o.offsetWidth)+21;this.doc.body.removeChild(o);this.setWidth(Math.min(q,500));}if(s){this._mc.innerHTML=t;}else{this._mc.innerText=t;}};k.prototype.setMessage=k.prototype.setInnerHTML;k.prototype.setIconStyle=function(o){if(!o){return;}EUI.addClassName(this._mc,o);};k.prototype._adjustSize=function(C,A,r){var s=this.isVisible(),p=this.container,t=this.container.style.left;var z=this._mc.style;z.maxHeight="";z.maxWidth="";this.container.style.width="";var u=this.doc.body.clientWidth,o=this.doc.body.clientHeight,F=null;if(!(C==null||isNaN(C)||A==null||isNaN(A))){F=u-C-10;var E=o-A-50;if(this._arrowvisible){F=Math.max(F,C-10);E=Math.max(E,A-50);}z.cssText+="; max-width: "+F+"px; max-height: "+E+"px;";}var B=false;var D=p.offsetWidth+1,v=p.offsetHeight;if(B){this.setButtonsPaneVisible(false);}if(D>u/3||v>o/3||v>3*D||D>4*v){var q=Math.pow(D*v/0.618,0.5);this.setWidth(Math.min(this._mc.scrollHeight>v?D+20:D,F==null?q:Math.min(q,F)));z.maxWidth="";}else{this.setWidth(D);}if(!s){this.setVisible(r||false);}p.style.left=t;};k.prototype._setSizePosition=function(A,v){var r=this.isVisible(),p=this.container;var u=this._mc.style;u.maxHeight="";u.maxWidth="";this.container.style.width="";var s=this.doc.body.clientWidth,o=this.doc.body.clientHeight,D=null,C=null;if(!(A==null||isNaN(A)||v==null||isNaN(v))){D=s-A-30;C=o-v-50;if(this._arrowvisible){D=Math.max(D,A-10);C=Math.max(C,v-50);}u.cssText+="; max-width: "+D+"px;";}var z=false;var B=p.offsetWidth+1,t=p.offsetHeight;if(z){this.setButtonsPaneVisible(false);}if(B>s/3||t>o/3||t>3*B||B>4*t){var q=Math.pow(B*t/0.618,0.5);this.setWidth(Math.min(this._mc.scrollHeight>t?B+20:B,D==null?q:Math.min(q,D)));u.maxWidth="";}else{this.setWidth(B);}if(t>C+10){if(v<t){if(v>(o-v)){u.cssText+="; max-height: "+(v-60)+"px; overflow: auto; ";v=50;}else{u.cssText+="; max-height: "+C+"px; overflow: auto; ";}}else{v-=t;}}this.container.style.cssText+="left:"+A+"px; top:"+v+"px;";EUI.showBackGroundIFrame(this.container,true,1);};k.prototype._clearDelayShowTimmer=function(){if(this._delayShowTimer){this.wnd.clearTimeout(this._delayShowTimer);this._delayShowTimer=0;}};k.prototype._clearDelayHideTimmer=function(){if(this._delayHideTimer){this.wnd.clearTimeout(this._delayHideTimer);this._delayHideTimer=0;}};k.prototype.show=function(o,v,s,r,p,t,q,u){if(this.isVisible()){this.setVisible(false);}this._whenDelayHideAcceptMouse=false;this._clearDelayShowTimmer();this._clearDelayHideTimmer();if(r){this._delayShowTimer=this.wnd.setTimeout(this.showImmediately.bind(this,o,v,s,p,t,q,u),r);}else{this.showImmediately(o,v,s,p,t,q,u);}};k.prototype.showMessage=function(p,q,o){if(!!o){this.setIconStyle(o);}if(q){if(EUI.isArray(q)){this.show(q[0],q[1],p);}else{this.showOnDom(q,p);}}};k.prototype.showOnDom=function(v,r,q,o,s,p,u){this._target=v;this._anchoredparentnode=null;var t=n(v,"",this.parentElement);if(t){this.show(Math.max(5,t.x),Math.max(5,t.y),r,q,o,s,p,u);}};function c(s){if("AREA".equalsIgnoreCase(s.tagName)){var q=s.parentNode;var o=q.nextSibling;while(o){if(o.useMap&&o.useMap=="#"+q.id){var p=EUI.getAbsPosition(window,o);p.x+=s.offsetLeft;p.y+=s.offsetTop;return p;}o=o.nextSibling;}}else{if("rect".equalsIgnoreCase(s.tagName)&&(!!window.SVGRectElement&&s instanceof SVGRectElement)){var t=s.parentNode;while(t){if("div".equalsIgnoreCase(t.tagName)){var p=EUI.getAbsPosition(window,t);p.x+=s.x.baseVal.value;p.y+=s.y.baseVal.value;p.width=s.width.baseVal.value;p.height=s.height.baseVal.value;return p;}t=t.parentNode;}}}return arguments[1]?EUI.getAbsPosition(window,s,arguments[1]):EUI.getAbsPosition(window,s);}function m(t){if(i||!"AREA".equalsIgnoreCase(t.tagName)){return{x:0,y:0,width:t.offsetWidth,height:t.offsetHeight};}else{var o=0,u=0,s=0,r=0;var q=t.coords.split(",");for(var p=0;p<q.length;p++){q[p]=parseInt(q[p]);}o=s=q[0];u=r=q[1];for(var p=2;p<q.length;p+=2){o=q[p]<o?q[p]:o;s=q[p]>s?q[p]:s;u=q[p+1]<u?q[p+1]:u;r=q[p+1]>r?q[p+1]:r;}return{x:o,y:u,width:s-o,height:r-u};}}function n(r,q){var x;if(typeof(_autoFloatHint_getPoint)=="function"){x=_autoFloatHint_getPoint(r);if(x){return x;}}var u=arguments[2]?c(r,arguments[2]):c(r);var y=r.getAttribute("point");if(y){y=y.split(",");u.x+=parseInt(y[0]);u.y+=parseInt(y[1]);if("AREA".equalsIgnoreCase(r.tagName)){u.x-=r.offsetLeft;u.y-=r.offsetTop;}return u;}if(!u||isNaN(u.x)||isNaN(u.y)){u=q?{x:q.clientX,y:q.clientY}:null;}else{var w=r.tagName.toUpperCase();var o=0;var v=0;if(i){o=r.offsetWidth;v=r.offsetHeight;}else{var p=m(r);u.x+=p.x;u.y+=p.y;o=p.width;v=p.height;}if(!o&&u.width){o=u.width;}if(!v&&u.height){v=u.height;}if(w=="OVAL"||w=="SHAPE"){u.x=u.x+o/2;u.y=u.y+(v>20?10:v/2);}else{if(w=="AREA"&&r.shape.toUpperCase()!="RECT"){u.x=u.x+o/2;u.y=u.y+v/2;}else{if(o&&v){u.x=u.x+o;u.y=u.y+(v>20?10:v/2);}}}}return u;}k.prototype.showImmediately=function(v,t,w,q,u,r,s){this._clearDelayHideTimmer();this._delayShowTimer=0;if(EUI.isString(w)){this.setInnerHTML(w);}var z=window["hint_bgcolor"];if(z){this.setColor(z);}v=Math.max(5,v);t=Math.max(5,t);var p=this.doc.body.clientWidth;var o=this.doc.body.clientHeight;if(s!="anchorfixed"){if(p-20<v){v=p-20;}if(o-20<t){t=o-20;}}this.setVisible(true);if(this._arrowvisible){this._adjustSize(v,t,true);this.setPosition(v,t,r);}else{this._setSizePosition(v,t);}this.setOpacity(100);if(typeof(this.onshow)=="function"){this.onshow(this);}if(u){this.hide(u,30,false);}};k.prototype.hide=function(p,o,q){this._clearDelayShowTimmer();if(!this.isVisible()){return;}this._clearDelayHideTimmer();if(p){this._whenDelayHideAcceptMouse=q;this._delayHideTimer=this.wnd.setTimeout(this.hideImmediately.bind(this,o),p);}else{this.hideImmediately(o);}};k.prototype.hideImmediately=function(){this.setVisible(false);};k.prototype.hidden=k.prototype.hideImmediately;k.prototype.setOpacity=function(q){this._opacity=typeof(q)!="number"?100:q;var o=this._opacity==100||this._opacity>100;this.container.style.opacity=(o?"1":"."+this._opacity);};k.prototype.setVisible=function(p){if((p=p===true)===this.visible){return;}this.visible=p;var o=this.container;if(p){this.mgrLayer("show");EUI.removeClassName(o,"eui-hide");}else{this.mgrLayer();EUI.addClassName(o,"eui-hide");o.style.cssText="";}EUI.showBackGroundIFrame(this.container,p,1);};k.prototype.isVisible=function(){return this.visible;};k.prototype.setColor=function(o,p){if(o){this.setBgColor(o);}if(p){this.setBorderColor(p);}};k.prototype.setBgColor=function(o){this.container.style.backgroundColor=o;};k.prototype.setBorderColor=function(o){this.container.style.borderColor=o;};k.getFloatHint=function(q,o){if(!q){q=window;}var p=q["__ESEN$XFloatHint__"];if(!p||p.isAnchored){p=new k({wnd:q,parentElement:o});q["__ESEN$XFloatHint__"]=p;}return p;};k.showFloatHint=function(u,s,r,o,t,q){var p=k.getFloatHint();p.show(u[0],u[1],s,r,o,t,q);return p;};k.showFloatHintOnDom=function(t,r,q,o,s){var p=k.getFloatHint();p.showOnDom(t,r,q,o,s);return p;};k.anchorFloatHint=function(s,r,q,o){var p=k.getFloatHint(window,s);p.showOnDom(s,r,q,o,"","","anchorfixed");p.setAnchored(true,"anchorfixed");return p;};k.hideFloatHint=function(q,o,r){var p=k.getFloatHint();p.hide(q,o,r);return p;};k.regAutoFloatHint=function(u,s,r,t){if(!u||u.nodeType!=1){return;}var p=function(y){var v=y.target?y.target:y.srcElement;var A=f(v,y);if(!A){k.hideFloatHint(50,30,t).hintTarget=null;return;}var z=A.getAttribute("hint");var x=n(A,y);if(!x){return;}var w=k.getFloatHint();if(w.hintTarget!=A||!w.isVisible()){w.hintTarget=A;w._target=A;w.show(x.x,x.y,z,s,r);w._anchoredparentnode=null;}};var o=function(x){var w=x.target?x.target:x.srcElement;var v=k.getFloatHint();if((v.hintTarget||v.isVisible())&&!EUI.domIsParent(v.hintTarget,w)){v.hintTarget=null;v.hide(50,30,t);}};if(!j){EUI.addEvent(u,"mouseover",p,false);EUI.addEvent(u,"mouseout",o,false);}else{EUI.addEvent(u,"touchstart",p,false);}var q=function(){if(!j){EUI.removeEvent(u,"mouseover",p);EUI.removeEvent(u,"mouseout",o);}else{EUI.removeEvent(u,"touchstart",p);}u=null;};EUI.addDispose(q);};function f(p,q){if(!p||p.nodeType!=1){return;}var t=p;var o=t.ownerDocument.body;var s=0;var r=t.getAttribute("hint");while(t&&o!=t&&!r&&s<15){t=t.parentNode;r=t.getAttribute("hint");s++;}if(!r){return;}return t;}return{EFloatHint:k};});