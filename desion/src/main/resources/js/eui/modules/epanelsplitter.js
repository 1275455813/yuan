define(["eui/modules/uibase"], function(c) {
    var b = c.EComponent;
    function a(g) {
        b.call(this, g);
        this.width = EUI.toPerNumber(g["width"]);
        this.height = EUI.toPerNumber(g["height"]);
        this._splitbarvisible = true;
        this._splitbarsize = 4;
        if (g["fixedSize"]) {
            this._fixedSize = g["fixedSize"];
        }
        this.setFixedMaxsize(g["maxsize"]);
        this.setFixedMinsize(g["minsize"]);
        this._initSplitPane(g.container || g.coantainer);
        var e = g["ishorizontal"];
        if (typeof (e) != "boolean") {
            e = true;
        }
        this.setAlign(e ? 0 : 1);
        var d = g["splitbarvisible"];
        if (typeof (d) != "boolean") {
            d = true;
        }
        this.setSplitbarVisible(d);
        var f = g["fixedright"];
        if (typeof (f) != "boolean") {
            f = false;
        }
        this.setFixedPanel(f ? 2 : 1);
        var h = g["isExpanded"];
        if (typeof (h) != "boolean") {
            h = false;
        }
        this.setCollapse(h ? h : 0);
        this._initEvent();
    }
    EUI.extendClass(a, b, "EPanelSplitter");
    a.create = function(d) {
        return new a(d);
    }
    ;
    a.prototype.dispose = function() {
        $(this.container).unbind("mousedown.drag mousemove.drag");
        this.onresized = null;
        this.onExpanded = null;
        this._leftComponentContainer = null;
        this._rightComponentContainer = null;
        this.isHorizontal = null;
        this._fixedWhere = null;
        this._fixedSize = null;
        this._hiddenWhere = null;
        this._splitbarsize = null;
        this._splitbarvisible = null;
        b.prototype.dispose.call(this);
    }
    ;
    a.prototype._initSplitPane = function(d) {
        if (d) {
            if (EUI.isString(d)) {
                d = this.doc.getElementById(d);
            }
            this.container = d;
        } else {
            EUI.clearAllContent(this.parentElement);
            var f = "<div class='eui-panelsplitter-container'>" + "<div class='eui-panelsplitter-panel eui-panelsplitter-panel-left'></div>" + "<div class='eui-panelsplitter-btn'></div>" + "<div class='eui-panelsplitter-panel eui-panelsplitter-panel-right'></div>" + "</div>";
            $(this.parentElement).append(f);
            this.container = $(this.parentElement).children()[0];
        }
        this.basedom = this.container;
        this.container.style.width = this.width;
        this.container.style.height = this.height;
        var e = $(this.container).children();
        this._leftComponentContainer = e[0];
        this._splitbar = e[1];
        this._rightComponentContainer = e[2];
    }
    ;
    a.prototype._initEvent = function() {
        var d = this;
        $(this.container).bind("mousedown.drag", function(e) {
            d._onMouseDownDrag(e);
        });
        $(this.container).bind("mousemove.drag", function(e) {
            d._onMouseMoveDrag(e);
        });
    }
    ;
    a.prototype._onClick = function(d) {
        if (this.isExpanded) {
            if (this._hiddenWhere) {
                this.setPanelVisible(this._fixedWhere, true);
            } else {
                this.setPanelVisible(this._fixedWhere, false);
            }
            if (typeof (this.onExpanded) == "function") {
                this.onExpanded(this);
            }
            var e = this._splitbar;
            if (e.className == "hsplit2_top") {
                e.className = "hsplit2_bottom";
            } else {
                if (e.className == "hsplit2_bottom") {
                    e.className = "hsplit2_top";
                } else {
                    if (e.className == "vsplit2_left") {
                        e.className = "vsplit2_right";
                    } else {
                        if (e.className == "vsplit2_right") {
                            e.className = "vsplit2_left";
                        }
                    }
                }
            }
        }
    }
    ;
    a.prototype._onMouseDownDrag = function(d) {
        if (this.canmoving) {
            this.__getsplitdom();
            this.setShadeVisible(true);
            this.canmoving = false;
            this.startmoving = true;
            EUI.disableDocTextSelect(this.container, false);
            var e = this;
            $(this.container).bind("mouseup.drag", function(f) {
                e._onMouseUpDrag(f);
            });
        }
        if (this.canexpanding) {
            this.canexpanding = false;
            this._onClick(d);
        }
    }
    ;
    a.prototype.__getsplitdom = function() {
        if (!this._ctrlsplitbar) {
            this._ctrlsplitbar = this.container.appendChild(this.doc.createElement("div"));
            this._ctrlsplitbar.unselectable = "on";
            this._ctrlsplitbar.className = "eui-panelsplitter-splitbar";
            this._ctrlsplitbar.style.cssText += ";";
        }
        var f, d, h, g;
        if (this.isHorizontal) {
            f = this._splitbarsize + "px";
            d = "100%";
            h = this._leftComponentContainer.offsetWidth;
            g = 0;
        } else {
            f = "100%";
            d = this._splitbarsize + "px";
            h = 0;
            g = this._leftComponentContainer.offsetHeight;
        }
        var e = this._ctrlsplitbar.style;
        e.cssText += ";left:" + h + "px;top: " + g + "px;width: " + f + ";height:" + d + ";";
        e.display = "";
    }
    ;
    a.prototype.setShadeVisible = function(f) {
        var d = this._shadedom
          , e = this.container;
        if (!d) {
            d = this._shadedom = e.appendChild(this.doc.createElement("div"));
            d.className = "eui-shade eui-shade-transparent";
            d.style.cssText += ";cursor:" + (this.isHorizontal ? "e-resize" : "n-resize") + ";";
        }
        d.style.display = f ? "" : "none";
    }
    ;
    a.prototype._onMouseMoveDrag = function(o) {
        if (this.startmoving) {
            var f = this.container;
            var q = EUI.getAbsPosition(this.wnd, f);
            if (this.isHorizontal) {
                var n = o.clientX > q.x ? o.clientX - q.x : q.x - o.clientX;
                var d = f.offsetWidth;
                var l = this._ctrlsplitbar.offsetWidth;
                var p = q.x;
                var h = (q.x + d) - l;
                if (o.clientX < p) {
                    n = 0;
                } else {
                    if (o.clientX > h) {
                        n = d - l;
                    }
                }
                this._ctrlsplitbar.style.left = n + "px";
            } else {
                var j = o.clientY > q.y ? o.clientY - q.y : q.y - o.clientY;
                var m = f.offsetHeight;
                var g = this._ctrlsplitbar.offsetHeight;
                var e = q.y;
                var i = (q.y + m) - g;
                if (o.clientY < e) {
                    j = 0;
                } else {
                    if (o.clientY > i) {
                        j = m - g;
                    }
                }
                this._ctrlsplitbar.style.top = j + "px";
            }
            return;
        }
        var k = EUI.getTarget(this.wnd, o);
        if (k && (k == this.container || k === this._splitbar)) {
            this.canmoving = true;
        } else {
            this.canmoving = false;
        }
        if (k && k == this._splitbar) {
            this.canexpanding = true;
        } else {
            this.canexpanding = false;
        }
    }
    ;
    a.prototype._onMouseUpDrag = function(e) {
        if (this.startmoving) {
            this.startmoving = false;
            var d = this.container;
            if (this.isHorizontal) {
                var g = this._ctrlsplitbar.offsetLeft;
                this.setFixedPanel(null, this._fixedWhere === 2 ? d.offsetWidth - g : g, true);
            } else {
                var f = this._ctrlsplitbar.offsetTop;
                this.setFixedPanel(null, this._fixedWhere === 2 ? d.offsetHeight - f : f, true);
            }
            this._ctrlsplitbar.style.display = "none";
            this.setShadeVisible(false);
            $(this.container).unbind("mouseup");
            EUI.disableDocTextSelect(this.container, true);
        }
    }
    ;
    a.prototype.setAlign = function(d) {
        this.isHorizontal = d == 0;
        var e = this._leftComponentContainer
          , g = this._rightComponentContainer;
        if (this.isHorizontal) {
            EUI.removeClassName(e, "eui-panelsplitter-panel-top");
            EUI.removeClassName(g, "eui-panelsplitter-panel-bottom");
            EUI.addClassName(e, "eui-panelsplitter-panel-left");
            EUI.addClassName(g, "eui-panelsplitter-panel-right");
            this._splitbar.style.width = this._splitbarsize + "px";
        } else {
            EUI.removeClassName(e, "eui-panelsplitter-panel-left");
            EUI.removeClassName(g, "eui-panelsplitter-panel-right");
            EUI.addClassName(e, "eui-panelsplitter-panel-top");
            EUI.addClassName(g, "eui-panelsplitter-panel-bottom");
            this._splitbar.style.height = this._splitbarsize + "px";
        }
        var f = this.isHorizontal ? "e-resize" : "n-resize";
        this.container.style.cursor = f;
        this._splitbar.style.cursor = f;
    }
    ;
    a.prototype.setCollapse = function(e, d) {
        this.isExpanded = true;
        this.onExpanded = d;
        if (typeof (e) == "boolean") {
            e = e ? this._fixedWhere : 0;
        }
        this._collapseType = typeof (e) != "number" || (e != 0 && e != 1 && e != 2) ? 0 : e;
        if (this._collapseType == 0) {
            this.setCss4Splitbar(this.barClass ? this.barClass : (this.isHorizontal ? "eui-panelsplitter-btn" : "eui-panelsplitter-btnvertical"));
            this.isExpanded = false;
        } else {
            if (this._collapseType == 1) {
                this.setCss4Splitbar(this.barClass ? this.barClass : (this.isHorizontal ? "eui-panelsplitter-btn-left" : "eui-panelsplitter-btnvertical-top"));
            } else {
                if (this._collapseType == 2) {
                    this.setCss4Splitbar(this.barClass ? this.barClass : (this.isHorizontal ? "eui-panelsplitter-btn-right" : "eui-panelsplitter-btnvertical-bottom"));
                }
            }
        }
    }
    ;
    a.prototype.setFixedPanel = function(d, e, f) {
        if (d === 1 || d === 2) {
            this._fixedWhere = d;
        } else {
            if (this._fixedWhere == null) {
                this._fixedWhere = 1;
            }
        }
        if (isNaN(e = parseFloat(e)) || e < 0) {
            if ((e = this._fixedSize) == null) {
                e = 200;
            }
        }
        if (typeof this._maxsize == "number") {
            e = Math.min(this._maxsize, e);
        }
        if (typeof this._minsize == "number") {
            e = Math.max(this._minsize, e);
        }
        this._fixedSize = e;
        if (f !== false) {
            this.doLayout(f !== true);
        }
    }
    ;
    a.prototype.doLayout = function(h) {
        var i = this._leftComponentContainer
          , k = this._rightComponentContainer
          , g = null
          , e = null;
        var f = 0;
        if (this._splitbarvisible) {
            f = this._splitbarsize;
        }
        if (this.isHorizontal) {
            var d = this.container.offsetWidth;
            if (this._hiddenWhere === 1) {
                k.style.width = d + "px";
                this._splitbar.style.display = "none";
            } else {
                if (this._hiddenWhere === 2) {
                    i.style.width = d + "px";
                    this._splitbar.style.display = "none";
                } else {
                    if (d < this._fixedSize) {
                        var l = Math.max(Math.floor(d / 2), 0);
                        i.style.width = l + "px";
                        k.style.left = (l + f) + "px";
                        this._splitbar.style.left = l + "px";
                    } else {
                        if (this._fixedWhere === 2) {
                            i.style.right = (this._fixedSize + f) + "px";
                            k.style.width = this._fixedSize + "px";
                            this._splitbar.style.right = this._fixedSize + "px";
                        } else {
                            i.style.width = this._fixedSize + "px";
                            k.style.left = (this._fixedSize + f) + "px";
                            this._splitbar.style.left = this._fixedSize + "px";
                        }
                    }
                    this._splitbar.style.display = "";
                }
            }
        } else {
            var j = this.container.offsetHeight;
            if (this._hiddenWhere === 1) {
                k.style.height = j + "px";
                this._splitbar.style.display = "none";
            } else {
                if (this._hiddenWhere === 2) {
                    i.style.height = j + "px";
                    this._splitbar.style.display = "none";
                } else {
                    if (j < this._fixedSize) {
                        var l = Math.max(Math.floor(j / 2), 0);
                        i.style.height = l + "px";
                        k.style.top = (l + f) + "px";
                        this._splitbar.style.top = l + "px";
                    } else {
                        if (this._fixedWhere === 2) {
                            i.style.bottom = (this._fixedSize + f) + "px";
                            k.style.height = this._fixedSize + "px";
                            this._splitbar.style.bottom = this._fixedSize + "px";
                        } else {
                            i.style.height = this._fixedSize + "px";
                            k.style.top = (this._fixedSize + f) + "px";
                            this._splitbar.style.top = this._fixedSize + "px";
                        }
                    }
                    this._splitbar.style.display = "";
                }
            }
        }
        if (typeof (this.onresized) == "function") {
            this.onresized(this, g, e);
        }
    }
    ;
    a.prototype.setPanelVisible = function(g, j) {
        g = g === 1 || g === 2 ? g : 1;
        if (j === true) {
            if (this._hiddenWhere !== g) {
                return;
            }
            this._hiddenWhere = null;
            var d = g === 1 ? this._leftComponentContainer : this._rightComponentContainer;
            d.style.display = "";
            this.setSplitbarVisible(true);
        } else {
            if (this._hiddenWhere === g) {
                return;
            }
            if (this._hiddenWhere) {
                var i = null
                  , h = null
                  , e = this._splitbar;
                if (this._hiddenWhere === 1) {
                    i = this._leftComponentContainer;
                    h = this._rightComponentContainer;
                } else {
                    i = this._rightComponentContainer;
                    h = this._leftComponentContainer;
                }
                i.style.display = "";
                h.style.display = "none";
            } else {
                var d = g === 1 ? this._leftComponentContainer : this._rightComponentContainer;
                d.style.display = "none";
            }
            if (arguments[1] !== true) {
                this.setSplitbarVisible(false);
            }
            this._hiddenWhere = g;
        }
        this.doLayout();
    }
    ;
    a.prototype.getContainer = function() {
        return this.container;
    }
    ;
    a.prototype.getBaseDom = a.prototype.getContainer;
    a.prototype.getFixedSize = function() {
        return this._fixedSize;
    }
    ;
    a.prototype.getAlign = function() {
        return this.isHorizontal ? 0 : 1;
    }
    ;
    a.prototype.setComponent = function(h, g, e) {
        if (typeof (g) != "boolean") {
            g = false;
        }
        if (typeof (e) != "number" || (e != 1 && e != 2)) {
            e = 1;
        }
        var d = e == 1 ? this._leftComponentContainer : this._rightComponentContainer;
        if (g) {
            this.scrollContainer = d.appendChild(this.doc.createElement("div"));
            this.scrollContainer.style.cssText += ";position:relative; width:100%; height:100%; overflow:hidden; display:block;";
            d = this.scrollContainer.appendChild(this.scrollContainer.cloneNode(false));
            d.style.cssText += ";position:absolute; padding:0; font-size:12px; white-space:nowrap; overflow:auto; display:block;";
            var f = this.scrollContainer.appendChild(this.doc.createElement("div"));
            f.style.cssText += ";font-size:0; clear:both; display:block;";
        }
        if (h && typeof (h) == "string") {
            h = this.doc.getElementById(h);
        }
        if (h && typeof (h) == "object") {
            h = h.getBaseDom ? h.getBaseDom() : h;
        }
        while (d.firstChild) {
            d.removeChild(d.firstChild);
        }
        d.appendChild(h);
    }
    ;
    a.prototype.getRegion = function(d) {
        if (typeof (d) != "number" || (d != 1 && d != 2)) {
            d = 1;
        }
        return d == 1 ? this._leftComponentContainer : this._rightComponentContainer;
    }
    ;
    a.prototype.getComponent = a.prototype.getRegion;
    a.prototype.getPanelIsVisible = function(d) {
        if (d !== 1 && d !== 2) {
            return;
        }
        return this._hiddenWhere !== d;
    }
    ;
    a.prototype.setFixedMaxsize = function(d) {
        this._maxsize = isNaN(d = parseInt(d)) || d < 0 ? null : d;
    }
    ;
    a.prototype.setFixedMinsize = function(d) {
        this._minsize = isNaN(d = parseInt(d)) || d < 0 ? null : d;
    }
    ;
    a.prototype.setSplitbarWidth = function(e) {
        e = typeof (e) == "number" && e > 4 ? e : 4;
        if (this._splitbarsize === e) {
            return;
        }
        if (this.isHorizontal) {
            this._splitbar.style.width = e + "px";
        } else {
            this._splitbar.style.height = e + "px";
        }
        this._splitbarsize = e;
        var d = this._fixedSize + e;
        if (this._hiddenWhere) {
            d = 0;
        }
        this.__setSplitBarSize(d);
    }
    ;
    a.prototype.getSplitbarWidth = function() {
        return this._splitbarsize;
    }
    ;
    a.prototype.setSplitbarVisible = function(e) {
        e = EUI.parseBool(e, false);
        if (this._splitbarvisible === e) {
            return;
        }
        this._splitbarvisible = e;
        if (e) {
            var d = this._fixedSize + this._splitbarsize;
            if (this._hiddenWhere) {
                d = this._splitbarsize;
            }
        } else {
            var d = this._fixedSize;
            if (this._hiddenWhere) {
                d = 0;
            }
        }
        this.__setSplitBarSize(d);
    }
    ;
    a.prototype.__setSplitBarSize = function(e) {
        var d = this._fixedWhere == 1 ? this._rightComponentContainer : this._leftComponentContainer;
        if (this.isHorizontal) {
            if (this._fixedWhere === 2) {
                d.style.right = e + "px";
            } else {
                d.style.left = e + "px";
            }
        } else {
            if (this._fixedWhere === 2) {
                d.style.bottom = e + "px";
            } else {
                d.style.top = e + "px";
            }
        }
    }
    ;
    a.prototype.setSplitbarPos = function(d) {
        this.setFixedPanel(null, d);
    }
    ;
    a.prototype.setSplitbarBgColor = function(d) {
        if (typeof (d) == "string" && d.length > 0) {
            this.setCss4SplitbarBg("");
            this._splitbar.style.background = d;
            return;
        }
        this._initSplitbar();
    }
    ;
    a.prototype.setCss4SplitbarBg = function(d) {
        var e = this._splitbar;
        if (e.className = d) {
            e.setAttribute("barBgClass", d);
        } else {
            e.removeAttribute("barBgClass");
        }
    }
    ;
    a.prototype.setCss4Splitbar = function(d) {
        this._splitbar.className = d;
    }
    ;
    a.prototype.setVisibleLeftComponent = function(d) {
        this.setPanelVisible(1, d);
        this.setSplitbarVisible(d && this.getPanelIsVisible(2));
    }
    ;
    a.prototype.setVisibleRightComponent = function(d) {
        this.setPanelVisible(2, d);
        this.setSplitbarVisible(d && this.getPanelIsVisible(1));
    }
    ;
    a.prototype.setLeftComponent = function(e, d) {
        this.setComponent(e, d, 1);
    }
    ;
    a.prototype.setRightComponent = function(e, d) {
        this.setComponent(e, d, 2);
    }
    ;
    a.prototype.getLeftComponent = function() {
        return this.getComponent(1);
    }
    ;
    a.prototype.getRightComponent = function() {
        return this.getComponent(2);
    }
    ;
    a.prototype.getLeftComponentContainer = function() {
        return this.getRegion(1);
    }
    ;
    a.prototype.getRightComponentContainer = function() {
        return this.getRegion(2);
    }
    ;
    a.prototype.setFixedLeftComponent = function() {
        this.setFixedPanel(1);
    }
    ;
    a.prototype.setFixedRightComponent = function() {
        this.setFixedPanel(2);
    }
    ;
    return {
        EPanelSplitter: a
    };
});
