define(["eui/modules/uibase"],function(d){var b=d.EComponent;function c(r){r=r||{};b.call(this,r);var i=this.wnd,m=this.doc;var g=m.createElement("li"),p=r["tip4close"];g.className="eui-tabctrl-header-item";g.innerHTML='<i class="eui-icon"></i><span class="eui-tabctrl-header-text"></span><i title="'+(p||"关闭")+'" class="eui-icon eui-icon-close" style="display: none"></i>';var k=m.createElement("div");k.style.cssText+="; width: 100%; height: 100%; border: none";k.className="eui-tabctrl-body-content";EUI.parseBool(r["nopadding"],false)&&(k.style.padding="0");var n=parseInt(r["max4caption"]);if(isNaN(n)){n=c.CAPTION_MAX_LEN;}var o=this._property={tabs:[],tabcount:0,fixedtabcount:0,activeindex:-1,overhidden:[],max4caption:n,enablereverse:false,headervisible:true,enableclosed:EUI.parseBool(r["enableclosed"],true),disableadjust:EUI.parseBool(r["disableadjust"],false),header4clone:g,body4clone:k,headContextmenu:r.headContextmenu};var j=r["dom"];if(!j){var h=o["container"]=(r["parentElement"]||m.body).appendChild(m.createElement("div"));h.className="eui-tabctrl-container";h.style.cssText+="; position: relative; width: "+this.width+"; height: "+this.height;h.innerHTML='<div class="eui-tabctrl-header"><ul></ul></div><div class="eui-tabctrl-body"></div>';var q=o["headerDom"]=h.firstChild;o["headerlist"]=q.firstChild;o["bodyDom"]=h.lastChild;o["container"]=h;}else{c.helper.bindDom(this,j,p);}$(o["headerlist"]).bind("click.xtabctrl",this,c.helper["evt_onclick"]).bind("contextmenu.xtabctrl",this,c.helper["evt_contextmenu"]);this.setStyle(r["style"]||o["style"]||c.DEFAULT_STYLE);this.setFixedCount(r["fixedtabcount"]);this.enableReverse(r["enablereverse"]);["OnAdding","OnAdded","OnRemoving","OnRemoved","OnSwitching","OnSwitched","OnBeforeReverse","OnResize"].forEach(function(s){this["set"+s](r[s.toLowerCase()]);},this);var l=parseInt(r["padding"]);if(!isNaN(l)&&l>=0){o["bodyDom"].style.padding=l+"px";}EUI.bindResize(o["container"],{callback:c.helper["evt_onresize"],context:this,extArgs:this});EUI.disableDocTextSelect(o["headerDom"]);o["confirm4close"]=r["confirm4close"]===true;}EUI.extendClass(c,b,"ETabCtrl");c.PREFIX_DATA="xtabdata_";c.DEFAULT_STYLE="greenelf";c.CAPTION_MAX_LEN=8;c.helper={bindDom:function(s,k,t){try{var r=s._property,w=r["headerDom"]=EUI.getFirstChild(k),l=r["bodyDom"]=EUI.getNextElementSibling(w),q=r["headerlist"]=EUI.getFirstChild(w);r["headervisible"]=w.style.display!=="none";var h=EUI.getFirstChild(q);if(h){var o=r["tabs"],j=0,v=r["enableclosed"]?"":"none";for(var g=EUI.getFirstChild(l);h!=null&&g!=null;){var w=h,p=g;h=EUI.getNextElementSibling(h);g=EUI.getNextElementSibling(g);if(w.tagName.toLowerCase()==="li"&&!EUI.hasClassName(w,"eui-tabctrl-header-btn")&&p.tagName.toLowerCase()==="div"&&EUI.hasClassName(p,"eui-tabctrl-body-content")){var i=w.getElementsByTagName("i")[0];var n=EUI.getNextElementSibling(i);var u=EUI.getNextElementSibling(n);if(i&&n&&u){o.push({visible:w.style.display!=="none",caption:w.title||n.innerHTML,icon:i.getAttribute("src")||i.src,captionDom:n,iconDom:i,closeDom:u,headerDom:w,bodyDom:p});if(EUI.hasClassName(w,"eui-tabctrl-header-active")){if(r["activeindex"]!==-1){throw new Error("有多个活动标签项.");}r["activeindex"]=j;}u.style.display=v;if(t){u.title=t;}j++;continue;}}q.removeChild(w);l.removeChild(p);}if(j){r["tabcount"]=j;if(r["activeindex"]===-1){s.setActive(0);}else{s.adjustTabs();}}}r["container"]=k;EUI.addClassName(k,"eui-tabctrl-container");}catch(m){throw new Error(I18N.getString("esmain.pagedesigner.js.xtabctrl.js.1","创建XTabCtrl对象时所传DOM结构不正确，创建失败."));}},fireEvent:function(l,k,h){var j=l._property,g=j[k];if(g){if(!h){h=[];}var i=j["args4"+k];if(i){h.push(i);}return g.apply(l,h);}},adjustTabs:(function(){var k=document.defaultView?function(n,l){var m=document.defaultView.getComputedStyle(n,"");return m?m[l]:null;}:function(m,l){return m.currentStyle[l];};var h=function(n,l){var m=parseInt(k(n,l));return isNaN(m)?0:m;};var i=function(l){return l.offsetWidth+h(l,"marginLeft")+h(l,"marginRight");};var j=function(n){var m=null;if(n.style.display==="none"){var l=n.style.cssText;n.style.cssText=l+"; position: absolute; left: -999px; display: block";m=i(n);n.style.cssText=l.replace(/([; ]+|^)(position|left|display):[^;]+(;|$)/gi,";")+"; display: none;";}else{m=i(n);}return m;};var g=function(E,B,t,v,x,A,n){var D=E.length,m=null;if(D>B.length){v+=18;if(v>x){B.pop();if(n){v-=n["width"];}}if(n){var s=n["index"],o=n["end"],q=n["step"];while(s!==o){m=E[s];if(m["visible"]){var z=j(E[s]["headerDom"]),y=z+v;if(y>x){break;}B.push(s);v=y;}s=s+q;}}}var r=A._property,F=r["overhiddenspan"],l=null;if(!F){F=r["overhiddenspan"];if(!F){var u=require("eui/modules/emenu");if(!u){return;}l=r["overhiddenmenu"]=new u.EPopupMenu({wnd:A.wnd});l.setOnClickItem(function(G){this.setActive(G.getName());}.bind(A));F=r["overhiddenspan"]=r["headerDom"].appendChild(A.doc.createElement("span"));F.className="eui-tabctrl-more";F.innerHTML=D;F.onclick=function(G){l.popupAtCursor(G);};}else{l=r["overhiddenmenu"];}}else{l=r["overhiddenmenu"];l.clear();}var w=r["overhidden"]=[],p=null;for(var C=0;C<D;C++){m=E[C];if(!m["visible"]){continue;}p=t.indexOf(C)!==-1;if(B.indexOf(C)!==-1){if(p){m["headerDom"].style.display="";}}else{if(!p){m["headerDom"].style.display="none";}w.push(C);l.addEMenuItem(m["caption"],m["icon"]).name=C;}}var D=w.length;if(D){F.style.display="";F.innerHTML=D;}else{F.style.display="none";}c.helper.fireEvent(A,"onadjusttabs",[A]);};return function(){var o=this._property,n=o["headerlist"],r=o["overhidden"],u=n.offsetWidth;if((n.scrollHeight<=n.offsetHeight)&&!r.length){return;}var E=o["tabcount"];if(E===0){return;}var B=o["tabs"],s=o["activeindex"],p=j(B[s]["headerDom"]),C=o["headerBtn"];if(C){p+=j(C);}var q=o["fixedtabcount"],z=[s];u-=20;if(q){if(q>s){for(var A=0;A<E;A++){if(A===s){continue;}var m=B[A];if(!m["visible"]){continue;}var x=j(m["headerDom"]),v=x+p;if(v<=u){z.push(A);p=v;}else{return g(B,z,r,p,u,this);}}return g(B,z,r,p,u,this);}for(var A=0;A<q;A++){if(A===s){continue;}var m=B[A];if(!m["visible"]){continue;}var x=j(m["headerDom"]),v=x+p;if(v<=u){z.push(A);p=v;}else{return g(B,z,r,p,u,this);}}}var w=s,y=s,l=true,D=true,t=false;while(l||D){if(l){do{if((--w)<q){l=false;break;}if(B[w]["visible"]){var x=j(B[w]["headerDom"]),v=x+p;if(v<=u){z.push(w);p=v;}else{l=false;if(!D){t={index:y,end:E,step:1,width:x};}}break;}}while(true);}if(D){do{if((++y)>=E){D=false;break;}if(B[y]["visible"]){var x=j(B[y]["headerDom"]),v=x+p;if(v<=u){z.push(y);p=v;}else{D=false;if(!l){t={index:w,end:q-1,step:-1,width:x};}}break;}}while(true);}}return g(B,z,r,p,u,this,t);};})(),getHeaderIndex:function(l,k){while(k){if(/^li$/i.test(k.tagName)){break;}k=k.parentNode;}if(!k){return -1;}var j=l._property["tabs"];for(var h=0,g=j.length;h<g;h++){if(j[h]["headerDom"]!=k){continue;}return h;}return -1;},evt_onresize:function(){c.helper.fireEvent(this,"onresize",arguments);this.adjustTabs();},evt_contextmenu:function(h){var m=h.target,l=h.data,k=l._property,j=k.headContextmenu;if(!j){return;}var i=c.helper["getHeaderIndex"](l,m);if(i===-1){return;}var g;if(j===true){g=e.call(l,i,h);}else{if(EUI.isFunction(j)){g=j(l,i,h);}else{g=true;}}!g&&h.preventDefault();h.returnValue=g;},evt_onclick:function(g){var n=g.target,m=g.data,l=m._property["onclick4btns"];if(l&&(EUI.hasClassName(n,"eui-icon-close")||EUI.hasClassName(n,"eui-tabctrl-header-btn-dom"))){for(var k in l){var j=l[k];if(j["dom"]===n){j["func"].apply(m,j["args"]);return;}}}var h=c.helper["getHeaderIndex"](m,n);if(h===-1){return;}EUI.hasClassName(n,"eui-icon-close")?f.call(m,h):m.setActive(h);},evt_ondrag:function(g){return !EUI.hasClassName(g.target,"eui-tabctrl-header-btn-dom");},evt_onmousedown:function(h){var l=h.target,k=h.data,i=c.helper["getHeaderIndex"](k,l);if(i===-1||i<k._property["fixedtabcount"]){return;}var j={xtab:k,index:i,offsetX:h.pageX,offsetY:h.pageY},g=k.doc.body;j["disableselect"]=EUI.disableDocTextSelect(g,false);$(g).bind("mousemove.xtabctrl",j,c.helper["evt_onmousemove"]).bind("mouseup.xtabctrl",j,c.helper["evt_onmouseup"]).bind("mouseleave.xtabctrl",j,c.helper["evt_onmouseleave"]);},evt_onmousemove:function(x){var L=x.data,K=L["xtab"],q=K._property,r=L["dragDom"],h=x.pageX,g=x.pageY;if(!r){var E=L["offsetX"],C=L["offsetY"];if(Math.abs(h-E)<5&&Math.abs(g-C)<5){return;}var D=q["tabs"],H=D[L["index"]]["captionDom"],k=H.getBoundingClientRect(),m=k["left"],y=k["top"];r=L["dragDom"]=this.appendChild(H.cloneNode(true));r.style.cssText="; position: absolute; cursor: pointer; background: #CCC; border: 1px solid #666; z-index: 9999999;";var j=L["splitDom"]=this.appendChild(K.doc.createElement("div"));j.style.cssText="; position: absolute; width: 2px; height: "+(k["bottom"]-y)+"px; left: -999px; top: "+y+"px; z-index: 9999999; background: blue;";L["offsetX"]=m-E;L["offsetY"]=y-C;L["rect"]=q["headerlist"].getBoundingClientRect();var B=L["visibletabs"]=[],I=L["visibleindexs"]=[],u=q["overhidden"];for(var z=0,A=D.length;z<A;z++){var l=D[z];if(!l["visible"]||u.indexOf(z)!==-1){continue;}B.push(l);I.push(z);}}var k=L["rect"],o=null,J=null;if(!(h<k["left"]||h>k["right"]||g<k["top"]||g>k["bottom"])){var D=L["visibletabs"],t=D.length-1,F=t,m=0,G=null,v=null,n=null;while(true){if(m>F){break;}G=Math.floor((m+F)/2);k=D[G]["headerDom"].getBoundingClientRect();v=k["left"],n=k["right"];if(h<v){F=G-1;}else{if(h>n){m=G+1;}else{var p=L["index"],s=q["fixedtabcount"],I=L["visibleindexs"];if(h-v>n-h){var w=I[G]+1;if(w===p||w===p+1||w<s){break;}J=w>p?w-1:w;o=G===t?n:((n+D[G+1]["headerDom"].getBoundingClientRect()["left"])/2);}else{var w=I[G];if(w===p||w===p+1||w<s){break;}J=w>p?w-1:w;o=G===0?v:((v+D[G-1]["headerDom"].getBoundingClientRect()["right"])/2);}break;}}}}L["splitDom"].style.left=(o!==null?o:-999)+"px";L["dragIndex"]=J;h+=L["offsetX"];g+=L["offsetY"];r.style.cssText+="; left: "+h+"px; top :"+g+"px;";},evt_onmouseup:function(g){var j=g.data,i=j["dragIndex"];if(i!=null){var h=j["index"];if(c.helper.fireEvent(j["xtab"],"onbeforereverse",[h,i,j["xtab"]])!==false){j["xtab"].reverseTab(h,{newindex:i});}}c.helper["evt_onmouseleave"].call(this,g);},evt_onmouseleave:function(g){$(this).unbind(".xtabctrl");var h=g.data,i=h["dragDom"];if(h["disableselect"]!==false){EUI.disableDocTextSelect(this,true);}if(i){this.removeChild(i);this.removeChild(h["splitDom"]);}}};c.prototype.dispose=function(g){var j=this._property;if(j["adjusttimeout"]){this.wnd.clearTimeout(j["adjusttimeout"]);}$(j["headerlist"]).unbind(".xtabctrl");var i=j["headerDom"];if(j["overhiddenmenu"]){j["overhiddenmenu"].dispose();}EUI.disableDocTextSelect(i,true);if(g){var h=j["container"];h.parentNode.removeChild(h);}this._property=null;b.prototype.dispose.call(this);};c.prototype.add=function(t,o,v){var q=this._property,s=q["header4clone"].cloneNode(true),h=s.firstChild,n=h.nextSibling,u=n.nextSibling,j=q["body4clone"].cloneNode(true),i=q["tabcount"];t=t||(I18N.getString("esmain.pagedesigner.js.xtabctrl.js.3","新标签{0}",[i]));v=v||{};var k=parseInt(v["index"]);if(isNaN(k)||k<0||k>i){k=i;}var p=c.helper.fireEvent;if(p(this,"onadding",[k,this])===false){return;}q["tabs"].splice(k,0,{visible:true,captionDom:n,iconDom:h,closeDom:u,headerDom:s,bodyDom:j});q["tabcount"]=i+1;this.setCaption(k,t);this.setIcon(k,o);this.setData(k,v["data"]);var r=q["fixedtabcount"];if(r>k){if(r<i){q["fixedtabcount"]+=1;}}else{if(q["enableclosed"]){u.style.display="";}}if(k===i){var m=q["headerBtn"];if(m){q["headerlist"].insertBefore(s,m);}else{q["headerlist"].appendChild(s);}q["bodyDom"].appendChild(j);}else{var l=q["tabs"][k+1];q["headerlist"].insertBefore(s,l["headerDom"]);q["bodyDom"].insertBefore(j,l["bodyDom"]);}var g=q["activeindex"];if(g>=k){q["activeindex"]+=1;p(this,"onswitched",[g+1,g,false,this]);}if(v["resetactive"]!==false||g===-1){this.setActive(k);}else{j.style.display="none";}p(this,"onadded",[k,this]);this.adjustTabs();return k;};c.prototype.remove=function(p){p=this.getIndex(p,true);if(p===-1){return;}var t=c.helper.fireEvent;if(t(this,"onremoving",[p,this])===false){return;}var s=this._property,q=s["tabs"],k=q.splice(p,1)[0],j=s["activeindex"];s["headerlist"].removeChild(k["headerDom"]);s["bodyDom"].removeChild(k["bodyDom"]);var u=s["overhidden"];for(var m=0,o=u.length;m<o;m++){if(u[m]>=p){u[m]-=1;}}if(k["visible"]){var r=u.indexOf(p-1);if(r!==-1){var h=s["overhiddenmenu"],n=s["overhiddenspan"];h.removeMenuItem(h.getMenuItem(r));u.splice(r,1);var o=n.lastChild.innerHTML=u.length;if(o===0){n.style.display="none";}}else{this.adjustTabs();}}if(s["fixedtabcount"]>p){s["fixedtabcount"]-=1;}s["tabcount"]-=1;if(j===p){s["activeindex"]=-1;var l=s["tabcount"];if(l===j){this.setActive(j-1);}else{this.nextActive((j===0?s["tabcount"]:j)-1);}}else{if(j>p){var g=s["activeindex"]=j-1;t(this,"onswitched",[g,j,false,this]);}}t(this,"onremoved",[p,k,this]);return k;};c.prototype.setActive=function(h){h=this.getIndex(h);if(h===-1){return;}var n=this._property,m=n["activeindex"];if(m===h){return;}var j=c.helper.fireEvent;if(j(this,"onswitching",[h,m,this])===false){return;}var i=n["tabs"];if(m!==-1){var l=i[m];EUI.removeClassName(l["headerDom"],"eui-tabctrl-header-active");l["bodyDom"].style.display="none";}n["activeindex"]=h;l=i[h];EUI.addClassName(l["headerDom"],"eui-tabctrl-header-active");l["bodyDom"].style.display="";l["headerDom"].style.display="";if(!l["visible"]){this.setTabVisible(h,true);}else{var k=n["overhidden"],g=k.indexOf(h);if(g!==-1){k.splice(g,1);if(k.length===0){n["overhiddenspan"].style.display="none";}this.adjustTabs();}}j(this,"onswitched",[h,m,true,this]);};c.prototype.previousActive=function(g){g=this.getIndex(g,true);if(g===-1){return;}var k=this._property,j=k["tabs"];for(var h=g-1;h>=0;h--){if(j[h]["visible"]){this.setActive(h);return h;}}for(var h=k["tabcount"]-1;h>g;h--){if(j[h]["visible"]){this.setActive(h);return h;}}if(k["activeindex"]===-1){this.setActive(g);return g;}return -1;};c.prototype.nextActive=function(h){h=this.getIndex(h,true);if(h===-1){return;}var l=this._property,k=l["tabs"];for(var j=h+1,g=l["tabcount"];j<g;j++){if(k[j]["visible"]){this.setActive(j);return j;}}for(var j=0;j<h;j++){if(k[j]["visible"]){this.setActive(j);return j;}}if(l["activeindex"]===-1){this.setActive(h);return h;}return -1;};c.prototype.getActiveIndex=function(){return this._property["activeindex"];};c.prototype.getContainer=function(){return this._property["container"];};c.prototype.getBaseDom=c.prototype.getContainer;c.prototype.getHeaderContainer=function(){return this._property["headerDom"];};c.prototype.getBodyContainer=function(){return this._property["bodyDom"];};c.prototype.setWidth=function(g){if(!g){return;}this.getContainer().style.width=EUI.toPerNumber(g);};c.prototype.setHeight=function(g){if(!g){return;}this.getContainer().style.height=EUI.toPerNumber(g);};c.prototype.getCount=function(){return this._property["tabcount"];};c.prototype.setIcon=function(i,k,g){i=this.getIndex(i,true);if(i===-1){return;}var j=this._property["tabs"][i],h=j["iconDom"];if(g){if(!j["suficonDom"]){j["suficonDom"]=$('<i class="eui-icon"></i>').insertBefore(j["closeDom"])[0];}h=j["suficonDom"];if(k){j["suficon"]=k;h.style.display="";EUI.setTagIcon(h,k);}else{j["suficon"]=null;h.style.display="none";}}else{if(k){j["icon"]=k;h.style.display="";EUI.setTagIcon(h,k);}else{j["icon"]=null;h.style.display="none";}}this.adjustTabs();};c.prototype.setCaption=function(i,h){if(!h){return;}i=this.getIndex(i,true);if(i===-1){return;}var k=this._property,j=k["tabs"][i],m=j["captionDom"],g=k["max4caption"];j["caption"]=h;m.style.display="none";EUI.clearAllContent(m);var l=/(<[^>]+>)([^<]*)(<\/[^>]+>)/g.test(h);if(!l&&g>1&&h.length>g){j["headerDom"].title=h;m.appendChild(this.doc.createTextNode(h.substring(0,g-1)+"..."));}else{j["headerDom"].title="";m.innerHTML=h;}m.style.display="";this.adjustTabs();};c.prototype.getData=function(j,h){j=this.getIndex(j,true);if(j===-1){return;}var l=this._property["tabs"][j];if(!EUI.isString(h)){var g={};for(var k in l){if(k.startsWith(c.PREFIX_DATA)){g[k.substr(c.PREFIX_DATA.length)]=l[k];}}return g;}return l[h.ensureStartWith(c.PREFIX_DATA)];};c.prototype.setData=function(h,g,l){if(!g){return;}h=this.getIndex(h,true);if(h===-1){return;}var k=this._property["tabs"][h];if(EUI.isString(g)){if(l==null){delete k[g.ensureStartWith(c.PREFIX_DATA)];}else{k[g.ensureStartWith(c.PREFIX_DATA)]=l;}}else{for(var j in g){k[(""+j).ensureStartWith(c.PREFIX_DATA)]=g[j];}}};c.prototype.getProperty=function(g){if(!g){return;}return this._property[g.ensureStartWith(c.PREFIX_DATA)];};c.prototype.setProperty=function(g,i){if(!g){return;}g=g.ensureStartWith(c.PREFIX_DATA);var h=this._property;if(i==null){delete h[g];}else{h[g]=i;}};c.prototype.getIndex=function(k,h){var p=this._property;if(EUI.isString(k)&&!/^\d+$/.test(k)){var m=p["tabs"],g=null,o=null;if(arguments.length===1){g="caption";o=k;}else{g=k.ensureStartWith(c.PREFIX_DATA);o=arguments[1];}for(var j=0,l=m.length;j<l;j++){if(m[j][g]===o){return j;}}return -1;}else{var n=parseInt(k);if(!isNaN(n)&&n>=0&&n<p["tabcount"]){return n;}return h===true?p["activeindex"]:-1;}};c.prototype.setTabVisible=function(l,i){l=this.getIndex(l,true);if(l===-1){return;}i=i!==false;var n=this._property,h=n["tabs"][l];if(h["visible"]===i){return;}h["visible"]=i;if(i){h["headerDom"].style.display="";if(n["activeindex"]===-1){this.setActive(l);}else{this.adjustTabs();}}else{var o=n["overhidden"],m=o.indexOf(l);if(m===-1){h["headerDom"].style.display="none";if(n["activeindex"]===l){if(this.nextActive()===-1){n["activeindex"]=-1;h["bodyDom"].style.display="none";}}else{this.adjustTabs();}}else{var g=n["overhiddenmenu"],k=n["overhiddenspan"];g.removeMenuItem(item=g.getMenuItem(m));o.splice(m,1);var j=k.lastChild.innerHTML=o.length;if(j===0){k.style.display="none";}}}};c.prototype.isVisible=function(g){g=this.getIndex(g,true);if(g===-1){return;}return this._property["tabs"][g]["visible"];};c.prototype.setHeaderVisible=function(j){var i=this._property;j=j!==false;if(i["headervisible"]===j){return;}i["headervisible"]=j;var h=i["headerDom"],g=i["bodyDom"];if(j){h.style.display="";g.style.cssText=g.style.cssText.replace(/([; ]+|^)(left|right|top|bottom|border):[^;]+(;|$)/gi,";");}else{h.style.display="none";g.style.cssText+="; left: 0; top: 0; right: 0; bottom: 0; border: none;";}};c.prototype.isHeaderVisible=function(){return this._property["headervisible"];};c.prototype.addButton=function(l,j,i){if(!l||typeof(j)!=="function"){return;}i=i?(EUI.isArray(i)?i:[i]):[];var m=this._property,g=m["headerBtn"],n=null;if(!g){g=m["headerBtn"]=m["headerlist"].appendChild(this.doc.createElement("li"));g.className="eui-tabctrl-header-item eui-tabctrl-header-btn";n=m["onclick4btns"]={};}else{n=m["onclick4btns"];var h=n[l];if(h){h["func"]=j;h["args"]=i;return;}}var k=g.appendChild(this.doc.createElement("i"));k.className="eui-icon eui-tabctrl-header-btn-dom";EUI.setTagIcon(k,l);n[l]={func:j,args:i,dom:k};};c.prototype.removeButton=function(h){if(!h){return;}var i=this._property,j=i["onclick4btns"];if(!j){return;}var g=j["icon"];if(!g){return;}i["headerBtn"].removeChild(g["dom"]);delete j["icon"];};c.prototype.enableClosable=function(m){m=m!==false;var l=this._property;if(l["enableclosed"]===m){return;}l["enableclosed"]=m;var k=l["tabs"],h=l["fixedtabcount"];if(m){for(var j=h,g=k.length;j<g;j++){k[j]["closeDom"].style.display="";}}else{for(var j=h,g=k.length;j<g;j++){k[j]["closeDom"].style.display="none";}}this.adjustTabs();return true;};c.prototype.setFixedCount=function(h){h=parseInt(h);if(isNaN(h)){return;}if(h<0){h=0;}var m=this._property,l=m["fixedtabcount"];if(h===l){return;}if(m["enableclosed"]){var k=m["tabs"];if(l>h){for(var j=h,g=Math.min(l,k.length);j<g;j++){k[j]["closeDom"].style.display="";}}else{for(var j=l,g=Math.min(h,k.length);j<g;j++){k[j]["closeDom"].style.display="none";}}}m["fixedtabcount"]=h;};c.prototype.reverseTab=function(l,q){l=this.getIndex(l,true);if(l===-1){return false;}var o=this._property,k=o["tabcount"],i=o["activeindex"];var g=parseInt(q["newindex"]);if(isNaN(g)){if(q["next"]){g=(l+1)%k;}else{g=(l==0?k:l)-1;}}else{if(g<0||g>=k){g=k-1;}}if(l===g){return false;}var n=o["tabs"];var j=n.splice(l,1)[0];if(g===k-1){var m=o["headerBtn"];if(m){o["headerlist"].insertBefore(j["headerDom"],m);}else{o["headerlist"].appendChild(j["headerDom"]);}o["bodyDom"].appendChild(j["bodyDom"]);}else{var h=n[g];o["headerlist"].insertBefore(j["headerDom"],h["headerDom"]);o["bodyDom"].insertBefore(j["bodyDom"],h["bodyDom"]);}n.splice(g,0,j);if((i-g)*(i-l)<=0){l=o["activeindex"]=l==i?g:i+(l<i?-1:1);c.helper.fireEvent(this,"onswitched",[l,i,false,this]);}var p=o["overhidden"];if(p.indexOf(l)!==-1||p.indexOf(g)!==-1){this.adjustTabs();}return[l,g];};c.prototype.enableReverse=function(g){var h=this._property;g=g===true;if(h["enablereverse"]===g){return;}h["enablereverse"]=g;if(g){$(h["headerlist"]).bind("mousedown.xtabctrl",this,c.helper["evt_onmousedown"]);}else{$(h["headerlist"]).unbind("mousedown.xtabctrl");}return true;};c.prototype.adjustTabs=function(g){var h=this._property;if(h["disableadjust"]){return;}if(h["adjusttimeout"]){this.wnd.clearTimeout(h["adjusttimeout"]);}var i=h["adjustTabs4this"];if(!i){i=h["adjustTabs4this"]=c.helper["adjustTabs"].bind(this);}if(g){i();}else{h["adjusttimeout"]=this.wnd.setTimeout(i,200);}};c.prototype.setStyle=function(j){if(!j){return;}var l=this._property,k=l["style"],i=l["headerDom"],g=l["container"],h=l["bodyDom"];if(k){if(k===j){return;}EUI.removeClassName(g,"eui-tabctrl-"+k);}EUI.addClassName(g,"eui-tabctrl-"+j);l["style"]=j;c.helper.fireEvent(this,"onstylechange",[j,k,this]);this.adjustTabs();};c.prototype.getStyle=function(){return this._property["style"];};c.prototype.getTabInfo=function(g,h){g=this.getIndex(g,true);if(g===-1){return;}return this._property["tabs"][g][h];};c.prototype.getCaption=function(g){return this.getTabInfo(g,"caption");};c.prototype.getIcon=function(g){return this.getTabInfo(g,"icon");};c.prototype.getCaptionDom=function(g){return this.getTabInfo(g,"captionDom");};c.prototype.getIconDom=function(g){return this.getTabInfo(g,"iconDom");};c.prototype.getHeaderDom=function(g){return this.getTabInfo(g,"headerDom");};c.prototype.getBodyDom=function(g){return this.getTabInfo(g,"bodyDom");};c.prototype.setOnAdding=function(h,g){return this._setOnEventFunc("onadding",h,g);};c.prototype.setOnAdded=function(h,g){return this._setOnEventFunc("onadded",h,g);};c.prototype.setOnRemoving=function(h,g){return this._setOnEventFunc("onremoving",h,g);};c.prototype.setOnRemoved=function(h,g){return this._setOnEventFunc("onremoved",h,g);};c.prototype.setOnSwitching=function(h,g){return this._setOnEventFunc("onswitching",h,g);};c.prototype.setOnSwitched=function(h,g){return this._setOnEventFunc("onswitched",h,g);};c.prototype.setOnStyleChange=function(h,g){return this._setOnEventFunc("onstylechange",h,g);};c.prototype.setOnAdjustTabs=function(h,g){return this._setOnEventFunc("onadjusttabs",h,g);};c.prototype.setOnBeforeReverse=function(h,g){return this._setOnEventFunc("onbeforereverse",h,g);};c.prototype.setOnResize=function(h,g){return this._setOnEventFunc("onresize",h,g);};c.prototype._setOnEventFunc=function(i,k,g){var j=this._property,i=i.toLowerCase(),h=j[i];j[i]=EUI.isFunction(k)?k:null;j["args4"+i]=g;return h;};c.prototype._getVisibleTabIndexs=function(){var l=this._property,m=l["tabcount"],j=l["tabs"];if(m===0){return;}var g=[];for(var h=0;h<m;h++){var k=j[h];if(k["visible"]){g.push(h);}}return g;};c.prototype.closeByType=function(o,p){var j=[],n=this.getCount(),g,k,h;switch(p){case"other":h=o;g=o===0?1:0;k=n-1;break;case"right":g=o+1;k=n-1;break;case"left":g=0;k=o-1;break;case"all":g=0;k=n-1;break;default:this.remove(o);return;}if(g>k){return;}var l=0;for(var m=g;m<=k;m++){if(m===h){continue;}this.remove(m-l);l++;}};function f(g){if(this._property["confirm4close"]){EUI.confirmDialog("删除","确定要删除吗",false,null,this.remove.bind(this,g));}else{this.remove(g);}}function e(i,g){var k=this._property["_headContextmenu"],j=this.getCount();if(!j||j.length<=0){return true;}if(!k){var l=require("eui/modules/emenu");if(!l){return;}k=this._property["_headContextmenu"]=new l.EPopupMenu({wnd:this.wnd,checkHr:true});k.addMenuItem("关闭").id="close";k.addMenuItem("关闭其它").id="close_other";k.addMenuItem("关闭右侧").id="close_right";k.addMenuItem("关闭左侧").id="close_left";k.addMenuItem("-");k.addMenuItem("关闭全部").id="close_all";}var h=this;k.setOnClickItem(function(m){var n=m.id;if(!n){return;}h.closeByType(i,n.split("_")[1]);});a(i,j,k);k.popupAtCursor(g);return false;}function a(h,i,k){if(i<=0){return;}var g=k.getItems(),j=i>1;g[1].setVisible(j);g[4].setVisible(j);g[2].setVisible(h<(i-1));g[3].setVisible(0<h);}function f(g){if(this._property["confirm4close"]){EUI.confirmDialog("删除","确定要删除吗",false,null,this.remove.bind(this,g));}else{this.remove(g);}}return{ETabCtrl:c};});