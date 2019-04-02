define(function() {
    var k = EUI.browser.isie;
    var e = EUI.Map;
    function d(r) {
	r = r || {};
	this.width = EUI.toPerNumber(r["width"] || "");
	this.height = EUI.toPerNumber(r["height"] || "");
	var s = r["wnd"];
	var t = s ? s.document : null;
	var q = r["parentElement"];
	if (typeof (q) === "string") {
	    if (!s) {
		s = window;
		t = s.document;
	    }
	    q = t.getElementById(q);
	}
	if (!s && q) {
	    s = EUI.getWndOfDom(q);
	    t = s.document;
	}
	if (!s) {
	    s = window;
	    t = window.document;
	}
	this.wnd = s, this.doc = t;
	this.parentElement = q && typeof (q) == "object" ? q : this.doc.body;
    }
    d.create = function(q) {
	return new d(q);
    };
    d.prototype.toString = function() {
	return this._className;
    };
    d.prototype.getParentElement = function() {
	return this.parentElement;
    };
    d.prototype.setParentElement = function(q) {
	this.parentElement = q;
	var r = this.getBaseDom();
	if (r) {
	    this.parentElement.appendChild(r);
	}
    };
    d.prototype.getDocument = function() {
	return this.doc;
    };
    d.prototype.createElement = function(q) {
	return this.doc.createElement(q);
    };
    d.prototype.getWindow = function() {
	return this.wnd;
    };
    d.prototype.__getBaseDom = function() {
	return this.getBaseDom();
    };
    d.prototype.getBaseDom = function() {
	EUI.throwError("not implements");
    };
    d.prototype.addBaseCss = function(r) {
	var q = this.getBaseDom();
	if (q) {
	    EUI.addClassName(q, r);
	}
    };
    d.prototype.__getBaseScrollDom = function() {
	return this.getBaseDom();
    };
    d.prototype.getTop = function(q) {
	if (!q) {
	    return this._getDomTop(this.getBaseDom());
	}
	var u = this.getBaseDom();
	var t = u.offsetParent;
	var s = this._getDomTop(u, true);
	while (t != null && t != q) {
	    s += this._getDomTop(t, true);
	    t = t.offsetParent;
	}
	return s;
    };
    d.prototype.__doCustomEvent = function(t, q, s) {
	if (!t) {
	    return;
	}
	var r = EUI.parseFunc(t);
	return r.apply(s, q);
    };
    d.prototype._getDomTop = function(r, q) {
	return r.offsetTop - (q ? r.scrollTop : 0);
    };
    d.prototype.getLeft = function(q) {
	if (!q) {
	    return this._getDomLeft(this.getBaseDom());
	}
	var u = this.getBaseDom();
	var t = u.offsetParent;
	var s = this._getDomLeft(u, true);
	while (t != null && t != q) {
	    s += this._getDomLeft(t, true);
	    t = t.offsetParent;
	}
	return s;
    };
    d.prototype._getDomLeft = function(r, q) {
	return r.offsetLeft - (q ? r.scrollLeft : 0);
    };
    d.prototype.getHeight = function() {
	return this.getBaseDom().offsetHeight;
    };
    d.prototype.setHeight = function(q) {
	return this.getBaseDom().style.height = EUI.toPerNumber(q);
    };
    d.prototype.getScrollTop = function() {
	return this.__getBaseScrollDom().scrollTop;
    };
    d.prototype.getScrollLeft = function() {
	return this.__getBaseScrollDom().scrollLeft;
    };
    d.prototype.setScrollTop = function(q) {
	this.__getBaseScrollDom().scrollTop = q;
    };
    d.prototype.setScrollLeft = function(q) {
	this.__getBaseScrollDom().scrollLeft = q;
    };
    d.prototype.getScrollWidth = function() {
	var s = this.__getBaseScrollDom(), q = s.style.width || "";
	s.style.width = "1px";
	var r = s.scrollWidth;
	s.style.width = q;
	return r;
    };
    d.prototype.getScrollHeight = function() {
	var s = this.__getBaseScrollDom(), q = s.style.height || "";
	s.style.height = "1px";
	var r = s.scrollHeight;
	s.style.height = q;
	return r;
    };
    d.prototype.getWidth = function() {
	return this.getBaseDom().offsetWidth;
    };
    d.prototype.setWidth = function(q) {
	return this.getBaseDom().style.width = EUI.toPerNumber(q);
    };
    d.prototype.setVisible = function(q) {
	q = EUI.parseBool(q, false);
	if (q) {
	    EUI.removeClassName(this.getBaseDom(), "eui-hide");
	} else {
	    EUI.addClassName(this.getBaseDom(), "eui-hide");
	}
    };
    d.prototype.isVisible = function() {
	return !EUI.hasClassName(this.getBaseDom(), "eui-hide");
    };
    d.prototype.mgrLayer = function(v) {
	var w = this.wnd.DLGLayerMgr;
	if (!w) {
	    w = this.wnd.DLGLayerMgr = new this.wnd.Array();
	}
	if (w.length === 0 && !this.isEDialog) {
	    return;
	}
	var r = w.indexOf(this, v);
	if (v === "show") {
	    if (r !== -1) {
		w.splice(r, 1);
	    }
	    var q = w.length;
	    if (q > 0 && this.isEDialog && this.isModel()) {
		for (var u = q - 1; u >= 0; u--) {
		    var t = w[u];
		    if (t && t.isEDialog) {
			t.setEnabled(false);
			break;
		    }
		}
	    }
	    w.push(this);
	    var q = w.length, s = 10;
	    if (q > 1) {
		s = w[q - 2].getLayer() || 10;
		this.setLayer(s + 1);
	    }
	} else {
	    if (r !== -1) {
		this.setLayer("");
		for (var u = r - 1; u >= 0; u--) {
		    var t = w[u];
		    if (t && t.isEDialog) {
			t.setEnabled(true);
			break;
		    }
		}
		w.splice(r, 1);
	    }
	}
    };
    d.prototype.getLayer = function() {
	var q = this.getBaseDom();
	if (q) {
	    return q.style.zIndex;
	}
    };
    d.prototype.setLayer = function(r) {
	var q = this.getBaseDom();
	if (q) {
	    q.style.zIndex = r;
	}
    };
    d.prototype.setOpacity = function(r) {
	this._baseOpacity = this._baseOpacity || 1;
	if (this._baseOpacity == r) {
	    return;
	}
	this._baseOpacity = r;
	var q = r == 100 || r > 100;
	this.getBaseDom().style.opacity = q ? "" : "0." + (r > 9 ? r : "0" + r);
    };
    d.prototype.setDisabled = function(q) {
	q = EUI.parseBool(q, false);
	if (q) {
	    EUI.addClassName(this.getBaseDom(), "eui-disabled");
	} else {
	    EUI.removeClassName(this.getBaseDom(), "eui-disabled");
	}
    };
    d.prototype.setEnabled = function(q) {
	q = EUI.parseBool(q, true);
	this.setDisabled(!q);
    };
    d.prototype.isDisabled = function() {
	return EUI.hasClassName(this.getBaseDom(), "eui-disabled");
    };
    d.prototype.isEnabled = function() {
	return !this.isDisabled();
    };
    d.prototype.dispose = function() {
	if (this._draggable) {
	    this._unregisterDragAndDrop();
	}
	if (this._onDragStart) {
	    this._onDragStart = null;
	}
	if (this._onDragOver) {
	    this._onDragOver = null;
	}
	if (this._onDragMoveOut) {
	    this._onDragMoveOut = null;
	}
	if (this._onDragDrop) {
	    this._onDragDrop = null;
	}
	if (this.wnd) {
	    this.wnd = null;
	}
	if (this.doc) {
	    this.doc = null;
	}
	if (this.basedom && this.basedom.parentNode) {
	    this.basedom.parentNode.removeChild(this.basedom);
	    this.basedom = null;
	}
	if (this.parentElement) {
	    this.parentElement = null;
	}
	this.userdata = null;
    };
    d.prototype.setDraggable = function(q) {
	this._draggable = q;
	if (q) {
	    this._registerDragAndDrop();
	} else {
	    this._unregisterDragAndDrop();
	}
    };
    d.prototype.isDraggable = function() {
	return this._draggable;
    };
    d.prototype.setCssStyle = function(q) {
	if (!q) {
	    return;
	}
	return typeof (q) == "object" && typeof (q.putMap) == "function" ? q
		: new e(q, ";", ":");
    };
    d.prototype.isDraging = function() {
	return this == this.doc._san_drag_obj_srccomponent;
    };
    d.prototype.setDropable = function(q) {
	this._dropable = q;
    };
    d.prototype.isDropable = function() {
	return this._dropable;
    };
    d.prototype._registerDragAndDrop = function() {
	EUI.addEvent(this.getBaseDom(), "mousedown", h, false);
    };
    d.prototype._unregisterDragAndDrop = function() {
	EUI.removeEvent(this.getBaseDom(), "mousedown", h);
    };
    function b(q) {
	var r = EUI._getMouseEventEComponent(q);
	if (r && typeof (r.getDragSrcCompoment_forDragStart) == "function") {
	    r = r.getDragSrcCompoment_forDragStart();
	}
	return r;
    }
    function h(t) {
	var r = EUI.getRootWindow();
	c(false);
	var q = t || event || r["event"];
	var u = b(q);
	if (!u) {
	    return;
	}
	var s = r["__event_document__"] = u.doc || document;
	s._san_drag_startx_offset = q.clientX - q.screenX;
	s._san_drag_starty_offset = q.clientY - q.screenY;
	s._san_drag_startx = q.clientX;
	s._san_drag_starty = q.clientY;
	s._san_drag_start_mouseDownEvent = EUI.extendObj({}, q);
	s._san_drag_obj_srccomponent = u;
	s._san_drag_dragstart = false;
	j(s);
    }
    function j(r) {
	var q = (r || document).body;
	EUI.addEvent(q, "mousemove", i, false);
	EUI.addEvent(q, "mouseup", c, false);
    }
    function i(s) {
	var q = s || event || EUI.getRootWindow()["event"];
	var u = b(q);
	if (!u) {
	    return;
	}
	var r = u.doc || document;
	if (!r._san_drag_obj_srccomponent || q.button != 0) {
	    c(s);
	    return;
	}
	if (q.clientX < 0 || q.clientY < 0
		|| q.clientX > r.body.clientWidth + 15
		|| q.clientY > r.body.clientHeight + 15) {
	    return;
	}
	if (!r._san_drag_dragstart) {
	    if (Math.abs(r._san_drag_startx - q.clientX) >= 3
		    || Math.abs(r._san_drag_starty - q.clientY) >= 3) {
		var t = r._san_drag_obj_srccomponent;
		if (t._onDragStart) {
		    if (t._onDragStart(t, r._san_drag_start_mouseDownEvent) == "stop") {
			c(s);
			return;
		    }
		    r._san_drag_dom_followcursor = t._getDragMoveDom(q);
		}
		if (!r._san_drag_dom_followcursor) {
		    c(s);
		    return;
		}
		r.body.onselectstart = EUI.returnfalse;
		if (k) {
		    r.body.releaseCapture();
		} else {
		    n(r, false);
		}
		r._san_drag_dragstart = true;
		EUI.attacheEvent4Iframes("add", r, "mousemove", a);
		EUI.attacheEvent4Iframes("add", r, "mouseup", c);
	    } else {
		return;
	    }
	}
	if (r._san_drag_obj_oldtarget
		&& r._san_drag_obj_oldtarget._onDragMoveOut
		&& u != r._san_drag_obj_oldtarget) {
	    r._san_drag_obj_oldtarget._onDragMoveOut(
		    r._san_drag_obj_srccomponent, q);
	}
	if (!u.isDropable) {
	    return;
	}
	if (!u.isDropable()) {
	    r._san_drag_obj_oldtarget = null;
	    return;
	}
	r._san_drag_obj_oldtarget = u;
	u._onDragOver(r._san_drag_obj_srccomponent, q);
    }
    function a(s) {
	var q = s || event || EUI.getRootWindow()["event"];
	var t = b(q);
	if (!t) {
	    return;
	}
	var r = t.doc || document;
	if (r._san_drag_dom_followcursor) {
	    r._san_drag_dom_followcursor.style.cssText += "; z-index: 9999px; display: block; left: "
		    + (q.screenX + r._san_drag_startx_offset + 5)
		    + "px; top: "
		    + (q.screenY + r._san_drag_starty_offset + 5) + "px";
	}
    }
    function c(u) {
	var s = EUI.getRootWindow();
	var t = s["__event_document__"];
	if (!t) {
	    return;
	}
	s["__event_document__"] = null;
	var q = t.body;
	if (t._san_drag_dragstart === true) {
	    if (u !== false) {
		var r = u || event || s["event"];
		var v = b(r);
		if (t._san_drag_obj_oldtarget
			&& t._san_drag_obj_oldtarget._onDragMoveOut
			&& v != t._san_drag_obj_oldtarget) {
		    t._san_drag_obj_oldtarget._onDragMoveOut(
			    t._san_drag_obj_srccomponent, r);
		}
		if (v && v._onDragDrop && v.isDropable()) {
		    v._onDragDrop(t._san_drag_obj_srccomponent, r);
		}
		if (t._san_drag_obj_srccomponent) {
		    t._san_drag_obj_srccomponent._onDragEnd(r);
		}
	    }
	    EUI.attacheEvent4Iframes("remove", t, "mousemove", a);
	    EUI.attacheEvent4Iframes("remove", t, "mouseup", c);
	}
	if (t._san_drag_dom_followcursor) {
	    t._san_drag_dom_followcursor.style.display = "none";
	    t._san_drag_dom_followcursor = null;
	}
	if (t._san_drag_dom_followcursor_default) {
	    q.removeChild(t._san_drag_dom_followcursor_default);
	    t._san_drag_dom_followcursor_default = null;
	}
	t._san_drag_obj_srccomponent = null;
	t._san_drag_obj_oldtarget = null;
	t._san_drag_start_mouseDownEvent = null;
	if (t._san_drag_dragstart) {
	    if (k) {
		q.releaseCapture();
	    } else {
		n(t, false);
	    }
	}
	t._san_drag_dragstart = null;
	t._san_drag_startx = null;
	t._san_drag_starty = null;
	q.onselectstart = null;
	EUI.removeEvent(q, "mousemove", i);
	EUI.removeEvent(q, "mouseup", c);
    }
    d.prototype.setFollowCursorText = function(q) {
	if (this.doc._san_drag_dom_followcursor_default) {
	    EUI.setTextContent(this.doc._san_drag_dom_followcursor_default, q);
	}
    };
    d.prototype._getDragMoveDom = function(q) {
	var t = this.doc;
	var s = t._san_drag_dom_followcursor_default;
	if (!s) {
	    s = t.body.appendChild(t.createElement("div"));
	    s.className = "dragmoveDom";
	    s.style.cssText += ";width:10px;height:22px;white-space:nowrap; padding:2px 4px;";
	    t._san_drag_dom_followcursor_default = s;
	}
	return s;
    };
    d.prototype._onDragStart = function(r, q) {
    };
    d.prototype._onDragEnd = function(q) {
    };
    d.prototype._onDragOver = function(r, q) {
    };
    d.prototype._onDragDrop = function(r, q) {
    };
    d.prototype._onDragMoveOut = function(r, q) {
    };
    function g(q) {
	d.call(this, q);
	this.onVisible = q.onVisible;
	this.RESIZE_BORDER = 3;
	this.div1 = this.createElement("div");
	if (this.parentElement) {
	    this.parentElement.appendChild(this.div1);
	}
	this.div1.id = g.DEFAULT_ID + Math.floor(Math.random() * 999999);
	this.div1.className = "eui-panel "
		+ (EUI.browser.isie ? "" : "eui-anim eui-anim-upbit")
		+ " eui-panel-hide " + (q.baseCss ? q.baseCss : "");
	if (this.width) {
	    this.div1.style.width = this.width;
	}
	if (this.height) {
	    this.div1.style.height = this.height;
	}
	this.div2 = this.div1.appendChild(this.createElement("div"));
	this.div2.className = "eui-panel-container";
	this.div2.cssText += ";width:100%;height:100%;";
	this.resize_minwidth = 10;
	this.resize_minheight = 10;
	this.onresize = null;
	this.div1._sancomponent = this;
	this._isResize = true;
	this.moveHandle = q.moveHandle;
	this._initSize();
    }
    g.DEFAULT_ID = "_SLK$EFloatDiv_";
    EUI.extendClass(g, d, "EFloatDiv");
    g.prototype.dispose = function() {
	if (this._ctrlresize) {
	    this._ctrlresize.dispose();
	    this._ctrlresize = null;
	}
	if (this.parentElement) {
	    this.parentElement.removeChild(this.div1);
	}
	if (this.div1) {
	    this.div1._sancomponent = null;
	    this.div1 = null;
	}
	this.onresize = null;
	d.prototype.dispose.call(this);
    };
    g.prototype._initSize = function() {
	this._ctrlresize = new f({
	    wnd : this.wnd,
	    node : this.div1,
	    moveHandle : this.moveHandle,
	    enableresize : true,
	    enablemove : !!this.moveHandle
	});
    };
    g.prototype.setResizeMinWidth = function(q) {
	if (!q) {
	    return;
	}
	q = parseInt(q);
	this.resize_minwidth = q;
    };
    g.prototype.setResizeMinHeight = function(q) {
	if (!q) {
	    return;
	}
	q = parseInt(q);
	this.resize_minheight = q;
    };
    g.prototype.getDom = function() {
	return this.div2;
    };
    g.prototype.getBaseDom = function() {
	return this.div1;
    };
    g.prototype.setVisible = function(q) {
	if (q) {
	    this.mgrLayer("show");
	    EUI.removeClassName(this.div1, "eui-panel-hide");
	    if (!EUI.browser.isie) {
		EUI.addClassName(this.div1, "eui-anim-upbit");
	    }
	} else {
	    this.mgrLayer();
	    EUI.addClassName(this.div1, "eui-panel-hide");
	    if (!EUI.browser.isie) {
		EUI.removeClassName(this.div1, "eui-anim-upbit");
	    }
	}
	var r = this.onVisible;
	if (EUI.isFunction(r)) {
	    r(this, q);
	}
	this.adjustBackgroundIframe();
    };
    g.prototype.isVisible = function() {
	return !EUI.hasClassName(this.div1, "eui-panel-hide");
    };
    g.prototype.setBounds = function(q, u, r, t) {
	var s = false;
	if (typeof (q) == "number") {
	    this.div1.style.left = q + "px";
	}
	if (typeof (u) == "number") {
	    this.div1.style.top = u + "px";
	}
	if (typeof (r) == "number") {
	    this._setDiv1Width(r);
	    s = true;
	}
	if (typeof (t) == "number") {
	    this._setDiv1Height(t);
	    s = true;
	}
	if (s) {
	    this._doOnResize();
	}
    };
    g.prototype._setDiv1Height = function(q) {
	if (k) {
	    this.div2.style.height = (q) + "px";
	}
	this.div1.style.height = q + "px";
	this.adjustBackgroundIframe();
    };
    g.prototype.adjustBackgroundIframe = function() {
	if (k) {
	    EUI.showBackGroundIFrame(this.div1, this.isVisible());
	}
    };
    g.prototype._setDiv1Width = function(q) {
	this.div1.style.width = q + "px";
	this.adjustBackgroundIframe();
	return parseInt(this.div1.style.width, 10) == q;
    };
    g.prototype.setResize = function(q) {
	q = EUI.parseBool(q, true);
	this._isResize = q;
	if (this._ctrlresize) {
	    this._ctrlresize.setEnableResize(q);
	}
    };
    g.prototype.setOnResize = function(q) {
	this.onresize = q;
    };
    g.prototype._doOnResize = function() {
	EUI.doCallBack(this.onresize, this);
    };
    function p(q) {
	d.call(this, q);
	this.width = EUI.toPerNumber(q["width"]);
	this.height = EUI.toPerNumber(q["height"]);
	this._initDivScrollbar();
    }
    EUI.extendClass(p, d, "EDivScrollbar");
    p.create = function(q) {
	return new p(q);
    };
    p.prototype._initDivScrollbar = function() {
	this.dOutdiv = this.doc.createElement("div");
	if (this.parentElement) {
	    this.parentElement.appendChild(this.dOutdiv);
	}
	this.basedom = this.dOutdiv;
	this.dOutdiv.style.cssText += ";position:relative;width:" + this.width
		+ ";height:" + this.height + ";overflow:hidden;display:block;";
	this.dContent = this.dOutdiv.appendChild(this.dOutdiv.cloneNode(false));
	var q = k ? "relative" : "absolute";
	this.dContent.style.cssText += ";position:"
		+ q
		+ ";width:100%;height:100%;overflow:auto;display:block;white-space:nowrap;";
	var r = this.dOutdiv.appendChild(this.doc.createElement("div"));
	r.style.cssText += ";font-size:0;clear:both;display:block;";
    };
    p.prototype.dispose = function() {
	this.dOutdiv = null;
	this.dContent = null;
	d.prototype.dispose.call(this);
    };
    p.prototype.setHasBorder = function(q) {
	q = q || false;
	if (q) {
	    this.dOutdiv.style.cssText += ";border:1px solid #ACA899;border-right-color:#FFFFFF;border-bottom-color:#FFFFFF;";
	} else {
	    this.dOutdiv.style.border = 0;
	}
    };
    p.prototype.setBorder = function(q) {
	this.dOutdiv.style.border = q;
    };
    p.prototype.setHasScrollbar = function(q) {
	if (typeof (q) == "boolean") {
	    this.dContent.style.overflow = q ? "auto" : "hidden";
	}
    };
    p.prototype.getContent = function() {
	return this.dContent;
    };
    p.prototype.setCssStyle = function(r) {
	var v = d.prototype.setCssStyle.call(this, r);
	if (!v || v.size() == 0) {
	    return;
	}
	var x = "";
	var u = v.get("border");
	if (u) {
	    x += ";border:" + u;
	}
	var s = v.get("background");
	if (s) {
	    x += ";background:" + s;
	}
	var y = v.get("background-color");
	if (y) {
	    x += ";background-color:" + y;
	}
	var q = v.get("background-image");
	if (q) {
	    x += ";background-image:" + q;
	}
	this.getBaseDom().style.cssText += x;
	x = "";
	var t = v.get("overflow");
	if (t) {
	    x += ";overflow:" + t;
	}
	var w = v.get("line-height");
	if (w) {
	    x += ";line-height:" + w;
	}
	this.getContent().style.cssText += x;
    };
    p.prototype.getBaseDom = function() {
	return this.dOutdiv;
    };
    p.prototype.getDom = p.prototype.getBaseDom;
    p.prototype.__getBaseScrollDom = p.prototype.getContent;
    function o(u, v, y, r, t) {
	if (typeof (t) != "boolean") {
	    t = false;
	}
	var q = y ? (typeof (y) == "number" ? y + "px" : y) : "100%";
	var s = typeof (r) == "string" && r.length > 0 ? r : "#ACA899";
	var w = u.createElement("div");
	w.style.cssText += ";position:relative;font-size:1px;width:" + q
		+ ";height:2px;overflow:hidden;border-top:1px solid " + s + ";";
	if (!t) {
	    var x = w.appendChild(w.cloneNode(false));
	    x.style.cssText += ";position:absolute;;height:1px;top:0;left:0;border-top-color:#FFFFFF;";
	}
	return v ? v.appendChild(w) : w;
    }
    function n(r, s) {
	if (k) {
	    return;
	}
	var q;
	q = r.getElementById("slk_firePane");
	if (!q) {
	    q = r.body.appendChild(r.createElement("div"));
	    q.id = "slk_firePane";
	    q.oncontextmenu = EUI.returnfalse;
	    q.style.cssText += "; position: absolute; left: 0; top: 0; right: 0; bottom: 0; MozUserSelect: none";
	}
	q.style.display = s ? "" : "none";
    }
    function l(t, q) {
	if (!t) {
	    return null;
	}
	if (!q) {
	    q = "_sancomponent";
	}
	var r = t[q];
	while (!r && t) {
	    t = t.parentNode;
	    r = t ? t[q] : null;
	}
	return r;
    }
    function m(z) {
	d.call(this, z);
	var s = z.wnd || window, w = s.document, x = w.createElement("div");
	x.id = "panel_" + EUI.bigRandom();
	x.className = "eui-panel "
		+ (EUI.browser.isie ? "" : "eui-anim eui-anim-upbit")
		+ " eui-panel-hide " + (z.baseCss || "");
	this.parentElement.appendChild(x);
	var u = "";
	if (z.width) {
	    u += ";width:" + z.width + "px";
	}
	if (z.height) {
	    u += ";height:" + z.height + "px";
	}
	x.style.cssText += u;
	this.isvisible = false;
	this.basedom = x;
	var v = EUI.parseBool(z.enableresize, false), t = EUI.parseBool(
		z.enablemove, false), r = z.moveHandle, q = z.minWidth, y = z.minHeight;
	this.onresize = z.onresize;
	if (v || (t && r)) {
	    this._ctrlresize = new f({
		wnd : s,
		node : x,
		moveHandle : r,
		enableresize : t ? (v || x) : null,
		enablemove : t,
		minWidth : q,
		minHeight : y
	    });
	}
	this._eventbind_handler = this.handlerCloseEvent.bind(this);
	this.options = {
	    minWidth : q,
	    minHeight : y,
	    handleClose : EUI.parseBool(z.handleClose, false)
	};
    }
    EUI.extendClass(m, d, "EPanel");
    m.prototype.dispose = function() {
	if (this._ctrlresize) {
	    this._ctrlresize.dispose();
	    this._ctrlresize = null;
	}
	this.options = null;
	m._superClass.prototype.dispose.call(this);
    };
    m.prototype.isVisible = function() {
	return this.isvisible;
    };
    m.prototype.setVisible = function(r) {
	r = EUI.parseBool(r, true);
	var q = this.options.handleClose;
	if (this.isvisible === r) {
	    return;
	}
	this.isvisible = r;
	if (r) {
	    this.mgrLayer("show");
	    EUI.removeClassName(this.basedom, "eui-panel-hide");
	    if (!EUI.browser.isie) {
		EUI.addClassName(this.basedom, "eui-anim-upbit");
	    }
	    if (q) {
		EUI.attacheEvent4TopIframes("add", "mousedown",
			this._eventbind_handler);
		EUI.attacheEvent4TopIframes("add", "mousewheel",
			this._eventbind_handler);
	    }
	} else {
	    this.mgrLayer();
	    EUI.addClassName(this.basedom, "eui-panel-hide");
	    if (!EUI.browser.isie) {
		EUI.removeClassName(this.basedom, "eui-anim-upbit");
	    }
	    if (q) {
		EUI.attacheEvent4TopIframes("remove", "mousedown",
			this._eventbind_handler);
		EUI.attacheEvent4TopIframes("remove", "mousewheel",
			this._eventbind_handler);
	    }
	}
    };
    m.prototype.holdPanleState = function(q) {
	this.options.handerCloseHold = EUI.parseBool(q, false);
    };
    m.prototype.handlerCloseEvent = function(r) {
	if (this.options.handerCloseHold) {
	    return;
	}
	if (!this.isvisible) {
	    return;
	}
	r = r || widnow.event;
	var q = r.srcElement || r.target;
	if (!q) {
	    return;
	}
	if (EUI.isChildNode(this.basedom, q, true)) {
	    r.stopPropagation ? r.stopPropagation() : (r.cancelBubble = true);
	    return;
	}
	this.setVisible(false);
    };
    m.prototype.setResizeMinWidth = function(q) {
	if (!q) {
	    return;
	}
	q = parseInt(q);
	this.resize_minwidth = q;
    };
    m.prototype.setResizeMinHeight = function(q) {
	if (!q) {
	    return;
	}
	q = parseInt(q);
	this.resize_minheight = q;
    };
    m.prototype.getBaseDom = function() {
	return this.basedom;
    };
    m.prototype.moveTo = function(q, r) {
	if (typeof (q) == "number") {
	    this.basedom.style.left = q + "px";
	}
	if (typeof (r) == "number") {
	    this.basedom.style.top = r + "px";
	}
    };
    m.prototype.show = function(q, r) {
	this.moveTo(q, r);
	this.setVisible(true);
    };
    m.prototype.setBounds = function(q, u, r, t) {
	var s = false;
	if (typeof (q) == "number") {
	    this.basedom.style.left = q + "px";
	}
	if (typeof (u) == "number") {
	    this.basedom.style.top = u + "px";
	}
	if (typeof (r) == "number") {
	    this.basedom.style.width = r + "px";
	    s = true;
	}
	if (typeof (t) == "number") {
	    this.basedom.style.height = t + "px";
	    s = true;
	}
	if (s) {
	    this._doOnResize();
	}
    };
    m.prototype._doOnResize = function() {
	EUI.doCallBack(this.onresize, this);
    };
    m.prototype.setOnResize = function(q) {
	this.onresize = q;
    };
    function f(q) {
	var s = q.wnd || window, t = s.document;
	this.options = {
	    wnd : s,
	    doc : t,
	    minWidth : q.minwidth || 80,
	    minHeight : q.minHeight || 50,
	    enableresize : EUI.parseBool(q.enableresize, true),
	    enablemove : EUI.parseBool(q.enablemove, false),
	    onmoving : q.onmoving,
	    onmoved : q.onmoved,
	    onresizing : q.onresizing,
	    onresized : q.onresized
	};
	this.__mouseMoveEvent = this._OnMouseMove.bind(this);
	this.__mouseUpEvent = this._OnMouseUp.bind(this);
	this.__domMouseMoveEvent = this._OnDomMouseMove.bind(this);
	this.__domMouseDownEvent = this._OnDomMouseDown.bind(this);
	var r = q.node;
	if (r) {
	    this.attach(r, q.moveHandle);
	}
    }
    f.prototype.dispose = function() {
	this.detach();
	this.options = null;
	this.moveinfo = null;
	this.attachinfo = null;
	this.__mouseMoveEvent = null;
	this.__mouseUpEvent = null;
	this.__domMouseMoveEvent = null;
	this.__domMouseDownEvent = null;
    };
    f.prototype.setEnableResize = function(r) {
	var q = this.options.enableresize;
	this.options.enableresize = EUI.parseBool(r, q);
    };
    f.prototype.setEnableMove = function(q) {
	var r = this.options.enablemove;
	this.options.enablemove = EUI.parseBool(q, r);
    };
    f.prototype.setOnMoving = function(q) {
	this.options.onmoving = q;
    };
    f.prototype.setOnMoved = function(q) {
	this.options.onmoved = q;
    };
    f.prototype.setOnResizing = function(q) {
	this.options.onresizing = q;
    };
    f.prototype.setOnResized = function(q) {
	this.options.onresized = q;
    };
    f.prototype.setMoveHandle = function(s) {
	var q = this.moveinfo;
	if (q) {
	    var r = q.handle;
	    if (r) {
		r.style.cursor = q.cursor;
	    }
	}
	if (!s) {
	    this.moveinfo = null;
	    this.setEnableMove(false);
	    return;
	}
	if (EUI.isString(s)) {
	    s = this.options.doc.getElementById(s);
	}
	if (!s || typeof (s) != "object") {
	    return;
	}
	this.moveinfo = {
	    handle : s,
	    cursor : s.style.cursor
	};
	this.setEnableMove(true);
    };
    f.prototype.setLimit = function(q, s) {
	var r = this.options;
	if (typeof (q) == "number" && !isNaN(q)) {
	    r.minWidth = q;
	}
	if (typeof (s) == "number" && !isNaN(s)) {
	    r.minHeight = s;
	}
    };
    f.prototype.setBounds = function(v, r, s, q, u) {
	this.resizeTo(v, q, u);
	this.moveTo(v, r, s);
    };
    f.prototype.resizeTo = function(t, q, s) {
	var r = this.options;
	if (typeof (q) != "number" || isNaN(q)) {
	    q = r.minWidth;
	}
	if (typeof (s) != "number" || isNaN(q)) {
	    s = r.minHeight;
	}
	t.style.cssText += ";width:" + q + "px;height:" + s + "px;";
    };
    f.prototype.moveTo = function(w, s, A) {
	var x = w.style, r = this.options, z = r.doc;
	if (x.display == "none" || x.visibility == "hidden") {
	    return;
	}
	if (typeof (s) == "number" && !isNaN(s) && typeof (A) == "number"
		&& !isNaN(A)) {
	    var u = w.offsetParent;
	    s += u.scrollLeft;
	    A += u.scrollTop;
	    var y = z.body, v = y.clientWidth - 15, q = y.clientHeight - 15;
	    x.cssText += ";left:" + (s > 0 ? (s > v ? v : s) + "px" : 0)
		    + ";top:" + (A > 0 ? (A > q ? q : A) + "px" : 0);
	}
    };
    f.prototype.attach = function(q, s) {
	var t = this.options.doc;
	if (EUI.isString(q)) {
	    q = t.getElementById(q);
	}
	if (!q || typeof (q) != "object") {
	    return;
	}
	var r = this.attachinfo;
	if (r && r.node !== q) {
	    this.detach();
	}
	r = this.attachinfo = {
	    node : q,
	    cursor : q.style.node || ""
	};
	EUI.addEvent(q, "mousemove", this.__domMouseMoveEvent);
	EUI.addEvent(q, "mousedown", this.__domMouseDownEvent);
	this.setMoveHandle(s);
    };
    f.prototype.detach = function() {
	var r = this.attachinfo;
	if (!r) {
	    return;
	}
	var q = r.node;
	EUI.removeEvent(q, "mousemove", this.__domMouseMoveEvent);
	EUI.removeEvent(q, "mousedown", this.__domMouseDownEvent);
	if (this.moveinfo) {
	    this.setMoveHandle();
	}
	this.attachinfo = null;
	var s = this.options.doc;
	EUI.removeEvent(s, "mousemove", this.__mouseMoveEvent);
	EUI.removeEvent(s, "mouseup", this.__mouseUpEvent);
    };
    f.prototype._OnDomMouseMove = function(v) {
	var u = this.attachinfo, t = u.node, r = this.options, s = r.wnd;
	v = v || s.event;
	var q = f.getCursor(v, t);
	if (q != "" && r.enableresize) {
	    t.style.cursor = q + "-resize";
	    u.attachcursor = q;
	    if (r.enablemove) {
		this.moveinfo.handle.style.cursor = q + "-resize";
	    }
	} else {
	    u.attachcursor = undefined;
	    t.style.cursor = u.cursor;
	    if (r.enablemove) {
		this.moveinfo.handle.style.cursor = "";
	    }
	}
    };
    f.prototype._OnDomMouseDown = function(A) {
	var y = this.attachinfo, w = y.node, t = this.moveinfo, r = this.options, x = r.wnd, B = x.document, s = false;
	A = A || x.event;
	if (t && !y.attachcursor) {
	    var z = A.srcElement ? A.srcElement : A.target, u = t.handle;
	    if (!z.getAttribute("nomove")) {
		while (!s && z) {
		    s = (z && z === u);
		    if (z === w) {
			break;
		    }
		    z = z.parentNode;
		}
	    }
	}
	if (s) {
	    y.attachcursor = undefined;
	    t.attach = true;
	} else {
	    if (y.attachcursor) {
	    } else {
		return;
	    }
	}
	this._cursorX = A.clientX;
	this._cursorY = A.clientY;
	this._oLeft = w.offsetLeft - w.offsetParent.scrollLeft;
	this._oTop = w.offsetTop - w.offsetParent.scrollTop;
	this._oWidth = parseInt(w.offsetWidth);
	this._oHeight = parseInt(w.offsetHeight);
	this._segX = Math.abs(this._cursorX - this._oLeft);
	this._segY = Math.abs(this._cursorY - this._oTop);
	EUI.disableDocTextSelect(w);
	this.isshowDisablePane = false;
	var q = B.body.slk_disablePane_id, v = q ? B.getElementById(q) : null;
	if (!v || EUI.hasClassName(v, "eui-hide")) {
	    this.isshowDisablePane = true;
	    EUI.showDisablePane(B.body, true, true);
	}
	EUI.addEvent(B, "mousemove", this.__mouseMoveEvent);
	EUI.addEvent(B, "mouseup", this.__mouseUpEvent);
	EUI.removeEvent(w, "mousemove", this.__domMouseMoveEvent);
	if (A.preventDefault) {
	    A.preventDefault();
	} else {
	    A.returnValue = false;
	}
    };
    f.prototype._OnMouseMove = function(G) {
	var u = this.attachinfo, B = u.node, E = u.attachcursor, r = this.options, z = r.minWidth, w = r.minHeight, s = r.wnd, J = r.doc;
	if (!B || B.style.display == "none" || B.style.visibility == "hidden") {
	    return;
	}
	G = G || s.event;
	if (r.enableresize && E) {
	    var x, D, t = B.offsetParent, F = B.offsetLeft - t.scrollLeft, C = B.offsetTop
		    - t.scrollTop, v = parseInt(B.offsetWidth), I = parseInt(B.offsetHeight);
	    if (isNaN(v)) {
		v = parseInt(B.style.width);
		if (isNaN(v)) {
		    v = parseInt(B.width);
		}
	    }
	    if (isNaN(I)) {
		I = parseInt(B.style.height);
		if (isNaN(I)) {
		    I = parseInt(B.height);
		}
	    }
	    if (E.indexOf("w") !== -1) {
		x = "w";
		F = this._oLeft + G.clientX - this._cursorX;
		v = this._oWidth + this._cursorX - G.clientX;
		if (F < 0) {
		    v += F;
		    F = 0;
		}
		if (v < z) {
		    F = F + v - z;
		    v = z;
		}
	    } else {
		if (E.indexOf("e") !== -1) {
		    x = "e";
		    v = this._oWidth + G.clientX - this._cursorX;
		    v = Math.max(v, z);
		}
	    }
	    if (E.indexOf("n") !== -1) {
		D = "n";
		C = this._oTop + G.clientY - this._cursorY;
		I = this._oHeight + this._cursorY - G.clientY;
		if (C < 0) {
		    I += C;
		    C = 0;
		}
		if (I < w) {
		    C = C + I - w;
		    I = w;
		}
	    } else {
		if (E.indexOf("s") !== -1) {
		    D = "s";
		    I = this._oHeight + G.clientY - this._cursorY;
		    I = Math.max(I, w);
		}
	    }
	    var A = isNaN(v) ? z : parseInt(v), y = isNaN(I) ? w : parseInt(I);
	    A = A < z ? z : v;
	    y = y < w ? w : I;
	    if ((x == "e" || x == "w") && D == null) {
		this.setBounds(B, F, C, A, this._oHeight);
	    } else {
		if ((D == "s" || D == "n") && x == null) {
		    this.setBounds(B, F, C, this._oWidth, y);
		} else {
		    this.setBounds(B, F, C, v, I);
		}
	    }
	    if (EUI.isFunction(r.onresizing)) {
		r.onresizing(B, F, C, v, I);
	    }
	    return;
	}
	if (r.enablemove && this.moveinfo.attach) {
	    var q = G.clientX - this._segX, H = G.clientY - this._segY;
	    this.moveTo(B, q, H);
	    if (EUI.isFunction(r.onmoving)) {
		r.onmoving(B, EUI.getRealLeft(B), EUI.getRealTop(B), q, H);
	    }
	}
    };
    f.prototype._OnMouseUp = function(x) {
	var w = this.attachinfo, s = w.node, q = this.options, t = q.wnd, y = q.doc;
	if (!s) {
	    return;
	}
	EUI.disableDocTextSelect(s, true);
	if (this.isshowDisablePane) {
	    EUI.showDisablePane(y.body, false);
	}
	EUI.removeEvent(y, "mousemove", this.__mouseMoveEvent);
	EUI.removeEvent(y, "mouseup", this.__mouseUpEvent);
	EUI.addEvent(s, "mousemove", this.__domMouseMoveEvent);
	this._cursorX = null;
	this._cursorY = null;
	this._oLeft = null;
	this._oTop = null;
	this._oWidth = null;
	this._oHeight = null;
	this._segX = null;
	this._segY = null;
	var u = s.offsetParent, v = s.style;
	if (!u || v.display === "none" || v.visibility === "hidden") {
	    return;
	}
	x = x || t.event;
	var A = s.offsetLeft - u.scrollLeft, z = s.offsetTop - u.scrollTop, r = w.cursor;
	if (q.enableresize) {
	    s.style.cursor = r || "";
	    w.attachcursor = undefined;
	    if (q.enablemove) {
		this.moveinfo.handle.style.cursor = "";
	    }
	    if (EUI.isFunction(q.onresized)) {
		q.onresized(s, A, z, s.offsetWidth, s.offsetHeight);
	    }
	}
	if (this.moveinfo) {
	    this.setMoveHandle(this.moveinfo.handle);
	    if (EUI.isFunction(q.onmoved)) {
		q.onmoved(s, s.offsetLeft, s.offsetTop);
	    }
	}
    };
    f.getCursor = function(v, u) {
	var x = 5, r = "", t = EUI.getRealLeft(u), w = EUI.getRealTop(u), q = parseInt(u.offsetWidth), s = parseInt(u.offsetHeight);
	if (v.clientY - w < x) {
	    r += "n";
	}
	if (w + s - v.clientY < x) {
	    r += "s";
	}
	if (v.clientX - t < x) {
	    r += "w";
	}
	if (t + q - v.clientX < x) {
	    r += "e";
	}
	return r;
    };
    return {
	EComponent : d,
	EFloatDiv : g,
	EDivScrollbar : p,
	CtrlResize : f,
	EPanel : m
    };
});