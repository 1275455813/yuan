define(["eui/modules/uibase"], function(i) {
    var f = i.EComponent;
    var t = i.EDivScrollbar;
    var y = EUI.browser;
    var p = y.isMobile;
    function h(B) {
        f.call(this, B);
        this.showblank = EUI.parseBool(B.showblank, false);
        this.width = EUI.toPerNumber(B["width"]);
        this.height = EUI.toPerNumber(B["height"]);
        this._arrowKeyOccurClick = false;
        this.dontInsertBlankNode = true;
        this._treeLinesOn = true;
        this.displayIcon = true;
        this.selectedItems = [];
        this._createSelf();
        if (B.baseCss) {
            EUI.addClassName(this.basedom, B.baseCss);
        }
        this.rootItem = this.__createXTreeItem("", null, this);
        this.rootItem._expanded = true;
        this.setStyle(0);
        this.enableCheckBoxes(EUI.parseBool(B.enableCheckBoxes, false));
        this.enableAutoCheckSubItems(EUI.parseBool(B.enableAutoCheckSubItems, false));
        this.enableAutoCheckGrayParent(EUI.parseBool(B.enableAutoCheckGrayParent, false));
        this.setOnClick(B.onclick);
        this.setOnDblClick(B.ondblclick);
        this.setOnExpand(B.onexpand);
        this.setOnContextMenu(B.oncontextmenu);
        this.setOnMouseMove(B.onmousemove);
        this.setOnCheck(B.oncheck);
        this.setOnKeydown(B.onkeydown);
        this.refreshNav(this.getRootItem());
    }
    EUI.extendClass(h, f, "ETree");
    h.SHOW_STYLE = [{
        checkCls: ["", "eui-form-checked", "eui-form-checked-off", "eui-form-checkbox-on", "eui-form-checkbox-off"],
        lineCls: ["xtree_line2", "xtree_line3", "xtree_line4", "xtree_blank", "xtree_blank"],
        minusCls: ["xtree_minus2", "xtree_minus3", "xtree_minus4", "xtree_minus1", "xtree_minus5"],
        minusCls_hl: ["xtree_minus7", "xtree_minus8", "xtree_minus9", "xtree_minus6", "xtree_minus10"],
        plusCls: ["xtree_plus2", "xtree_plus3", "xtree_plus4", "xtree_plus1", "xtree_plus5"],
        plusCls_hl: ["xtree_plus7", "xtree_plus8", "xtree_plus9", "xtree_plus6", "xtree_plus10"],
        lineVert: "xtree_line1"
    }, {
        checkCls: ["xtree_uncheck", "xtree_checked", "xtree_grayChecked", "xtree_checked2", "xtree_grayChecked2"],
        lineCls: ["xtree_blank", "xtree_blank", "xtree_blank", "xtree_blank", "xtree_blank"],
        minusCls: ["xtree_arrow_minus", "xtree_arrow_minus", "xtree_arrow_minus", "xtree_arrow_minus", "xtree_arrow_minus"],
        minusCls_hl: ["xtree_arrow_minus3", "xtree_arrow_minus3", "xtree_arrow_minus3", "xtree_arrow_minus3", "xtree_arrow_minus3"],
        plusCls: ["xtree_arrow_plus", "xtree_arrow_plus", "xtree_arrow_plus", "xtree_arrow_plus", "xtree_arrow_plus"],
        plusCls_hl: ["xtree_arrow_plus1", "xtree_arrow_plus1", "xtree_arrow_plus1", "xtree_arrow_plus1", "xtree_arrow_plus1"],
        lineVert: "xtree_blank"
    }];
    h.prototype.dispose = function() {
        if (this.treeDiv) {
            EUI.removeEvent(this.treeDiv, "mousedown", w);
            EUI.removeEvent(this.treeDiv, "click", z);
            EUI.removeEvent(this.treeDiv, "dblclick", n);
            EUI.removeEvent(this.treeDiv, "contextmenu", e);
            EUI.removeEvent(this.treeDiv, "keydown", A);
            EUI.removeEvent(this.treeDiv, "mousemove", b);
            $(this.treeNav).unbind("mousedown");
            if (this._widthreizeTimer) {
                this.wnd.clearTimeout(this._widthreizeTimer);
            }
            this.treeDiv.onselectstart = null;
            this.treeDiv._sancomponent = null;
            this.treeDiv.onscroll = null;
            this.treeDiv = null;
        }
        this.getRootItem().dispose();
        this._siftSelectSourceItem = null;
        this._lastShiftSelectedItems = null;
        this.__createItem = null;
        this._lastOverNode = null;
        this.onexpand = null;
        this.onexpand2 = null;
        this.oncontextmenu = null;
        this.onmousemove = null;
        this.oncheck = null;
        this.ondblclick = null;
        this.onkeydown = null;
        this._onDragStart = null;
        this._onDragOver = null;
        this._onDragDrop = null;
        this._onDragMoveOut = null;
        this._onDragDropFromTo = null;
        this._onDragDropAtTreeItem = null;
        this._onDragDropIntoTree = null;
        this._has_autoopenitem = null;
        this._focusItem = null;
        this.selectedItems.clear();
        this._style = null;
        this._expandedItem = null;
        this.treeNav = null;
        f.prototype.dispose.call(this);
    }
    ;
    h.prototype.setStyle = function(B) {
        this._style = h.SHOW_STYLE[B];
    }
    ;
    h.prototype._initXTree = function() {}
    ;
    h.prototype.setOnClick = function(B) {
        this.onclick = B;
    }
    ;
    h.prototype.setOnDblClick = function(B) {
        this.ondblclick = B;
    }
    ;
    h.prototype.setOnContextMenu = function(B) {
        this.oncontextmenu = B;
    }
    ;
    h.prototype.setOnMousedown = function(B, C) {
        this.onmousedown = B;
        this.args_mousedown = C;
    }
    ;
    h.prototype.setOnMouseMove = function(B) {
        this.onmousemove = B;
    }
    ;
    h.prototype.setOnSelecting = function(B) {
        this.onselecting = B;
    }
    ;
    h.prototype.setOnCheck = function(B) {
        this.oncheck = B;
    }
    ;
    h.prototype.setOnBeforeCheck = function(B) {
        this.onbeforecheck = B;
    }
    ;
    h.prototype.setOnExpand = function(B) {
        this.onexpand = B;
    }
    ;
    h.prototype.setOnCollapsed = function(B) {
        this.oncollapsed = B;
    }
    ;
    h.prototype.setOnKeydown = function(B) {
        this.onkeydown = B;
    }
    ;
    h.prototype.getOnExpand = function() {
        return this.onexpand;
    }
    ;
    h.prototype.enableArrowKeyOccurClick = function(B) {
        this._arrowKeyOccurClick = EUI.parseBool(B);
    }
    ;
    h.prototype.enableTreeImages = function(B) {
        if (this.displayIcon != EUI.parseBool(B)) {
            this.displayIcon = EUI.parseBool(B);
            this.__createItem = null;
        }
    }
    ;
    h.prototype.enableCheckBoxes = function(B) {
        if (this._enableCheckBox != EUI.parseBool(B)) {
            this._enableCheckBox = EUI.parseBool(B);
            this.__createItem = null;
        }
    }
    ;
    h.prototype.enableTreeLines = function(B) {
        this._treeLinesOn = EUI.parseBool(B);
    }
    ;
    h.prototype.enableCtrlSelect = function(B) {
        this._ctrlSelect = EUI.parseBool(B, false);
    }
    ;
    h.prototype.enableShiftSelect = function(B) {
        this._shiftSelect = EUI.parseBool(B, false);
    }
    ;
    h.prototype.enableAutoCheckSubItems = function(B) {
        this._autoCheckSubItems = EUI.parseBool(B);
    }
    ;
    h.prototype.enableAutoCheckGrayParent = function(B) {
        this._autoCheckGrayParent = EUI.parseBool(B);
    }
    ;
    h.prototype.getBaseDom = function() {
        return this.basedom;
    }
    ;
    h.prototype._onDragDropFromTo = function(D, C, B) {}
    ;
    h.prototype._onDragDropAtTreeItem = function(D, C, B) {}
    ;
    h.prototype._onDragDropIntoTree = function(C, B) {}
    ;
    h.prototype._onDragMoveOut = function(C, B) {
        this._clearDragLastOverItem();
    }
    ;
    h.prototype._getDragMoveDom = function(B) {
        var H = this.doc;
        var G = H._san_drag_dom_followcursor_default;
        if (!G) {
            G = H.body.appendChild(H.createElement("div"));
            G.className = "dragmoveDom";
            var F = [];
            var E = this.getSelectedItemCount();
            for (var D = 0; D < E && D < 8; D++) {
                var C = this.getSelectedItem(D);
                if (C) {
                    var I = C.span;
                    F.push(I.innerHTML);
                }
            }
            if (F.length > 0) {
                if (E > F.length) {
                    F.push("......");
                }
                G.innerHTML = F.join("<br/>");
                G.style.width = I.offsetWidth + "px";
                G.style.height = I.offsetHeight + "px";
                G.style.padding = "2px 4px";
                G.style.whiteSpace = "nowrap";
            } else {
                return null;
            }
            H._san_drag_dom_followcursor_default = G;
        }
        return G;
    }
    ;
    h.prototype._onDragStart = function(E, B) {
        this._thisEventIsForDrag = true;
        this._lastOverNode = null;
        var D = l(B);
        if (D) {
            var C = x(D, B);
            if (C != "icon" && C != "text" && C != "texttail") {
                return "stop";
            }
        }
        if (!this._onCanDrag(D, B)) {
            return "stop";
        }
        if (D && !D.isSelected()) {
            D.selectSelf(true, false, false, true);
        }
    }
    ;
    h.prototype._onDragEnd = function(B) {
        this._thisEventIsForDrag = false;
        this._clearDragLastOverItem();
    }
    ;
    h.prototype._onDragOver = function(F, C) {
        this._clearDragLastOverItem();
        if (F._clearDragLastOverItem) {
            F._clearDragLastOverItem();
        }
        var D = l(C);
        if (D && this._onCanDrop(F, D, C)) {
            D.setHighlight(true);
            this._lastOverNode = D;
            if (this._has_autoopenitem) {
                this.wnd.clearTimeout(this._has_autoopenitem);
            }
            if (D.hasChildren() && !D.isExpanded()) {
                this._has_autoopenitem = this.wnd.setTimeout(function() {
                    D.setExpanded(true);
                }, 500);
            }
        }
        if (D) {
            var E = D.getPosY();
            var B = this.getScrollTop();
            if (E + 60 > this.getHeight() + B) {
                this._onDragOver_setScrollTop(B + 30);
            } else {
                if (E - 30 < B) {
                    this._onDragOver_setScrollTop(Math.max(0, B - 30));
                }
            }
        }
    }
    ;
    h.prototype._onDragOver_setScrollTop = function(D) {
        var B = this.__onDragOver_setScrollTop_time;
        var C = new Date().getTime();
        if (B && C - B < 120) {
            return;
        }
        this.__onDragOver_setScrollTop_time = C;
        this.setScrollTop(D);
    }
    ;
    h.prototype._clearDragLastOverItem = function() {
        var B = this._lastOverNode;
        if (B) {
            if (!B.isSelected()) {
                B.setHighlight(false);
            }
            this._lastOverNode = null;
        }
    }
    ;
    h.prototype._onDragDrop = function(E, B) {
        if (this._has_autoopenitem) {
            this.wnd.clearTimeout(this._has_autoopenitem);
        }
        var C = l(B);
        if (this == E) {
            var D = this.getSelectedItem();
            if (D && D != C && this._onCanDrop(E, C, B)) {
                this._onDragDropFromTo(D, C, B);
            }
        } else {
            if (E._clearDragLastOverItem) {
                E._clearDragLastOverItem();
            }
            if (this._onCanDrop(E, C, B)) {
                if (C) {
                    this._onDragDropAtTreeItem(E, C, B);
                } else {
                    this._onDragDropIntoTree(E, B);
                }
            }
        }
        this._clearDragLastOverItem();
    }
    ;
    h.prototype._onCanDrop = function(D, C, B) {
        return true;
    }
    ;
    h.prototype._onCanDrag = function(C, B) {
        return C != null;
    }
    ;
    h.prototype.getRootItem = function() {
        return this.rootItem;
    }
    ;
    h.prototype.getItemObj = function(B) {
        if (typeof (B) == "string") {
            return this.getRootItem().getItemById(B);
        }
        return B;
    }
    ;
    h.prototype.loadFromArray = function(C) {
        if (!C) {
            return;
        }
        var B = new Object();
        for (var D = 0; D < C.length; D++) {
            var E = C[D];
            var F = B[E.pid];
            if (!F) {
                F = this.getRootItem();
            }
            var F = F.appendChild(E.caption);
            F.id = E.id;
            F.setUserObj(E);
            B[E.id] = F;
        }
    }
    ;
    h.prototype.clearTree = function(B) {
        this.setFocusItem(null);
        this.clearSelectedItems();
        this.getRootItem().clearChildren();
        if (B) {
            return;
        }
        this.autoShowBlank();
    }
    ;
    h.prototype.autoShowBlank = function() {
        var B = this.blankBody;
        if (this.showblank) {
            B.firstChild.style.visibility = "";
            if (this.isEmpty()) {
                EUI.removeClassName(B, "eui-hide");
            } else {
                EUI.addClassName(B, "eui-hide");
            }
        } else {
            B.firstChild.style.visibility = "hidden";
        }
    }
    ;
    h.prototype.setBlankHint = function(C) {
        var B = this.blankBody.firstChild;
        B.innerText = C;
    }
    ;
    h.prototype.isEmpty = function() {
        return this.getRootItem().getChildrenCount() == 0;
    }
    ;
    h.prototype._createSelf = function() {
        this.basedom = this.parentElement.appendChild(this.doc.createElement("div"));
        this.basedom.className = "eui-tree-container";
        this.basedom.style.cssText += ";width: " + this.width + ";height: " + this.height + ";";
        this.basedom.innerHTML = '<div class="eui-tree-nav eui-hide"></div><div class="eui-tree-content"></div><div class="eui-tree-tips eui-hide"><span>无数据</span></div>';
        this.treeNav = this.basedom.firstChild;
        this.treeDiv = this.treeNav.nextSibling;
        this.blankBody = this.treeDiv.nextSibling;
        if (p) {
            this.treeContent = this.basedom.appendChild(this.doc.createElement("div"));
            this.treeContent.className = "eui-tree-pcontent";
            this.treeContent.appendChild(this.treeDiv);
        }
        if (!y.isie) {
            this.treeDiv.tabIndex = 0;
        }
        EUI.addEvent(this.treeDiv, "mousedown", w);
        EUI.addEvent(this.treeDiv, "click", z);
        EUI.addEvent(this.treeDiv, "dblclick", n);
        EUI.addEvent(this.treeDiv, "contextmenu", e);
        EUI.addEvent(this.treeDiv, "keydown", A);
        EUI.addEvent(this.treeDiv, "mousemove", b);
        EUI.bindResize(this.basedom, {
            callback: this.resizeWidth,
            context: this
        });
        if (p) {
            var B = this;
            $(this.treeNav).bind("mousedown", function(C) {
                B.treeNavMousedown(C);
            });
        }
        this.treeDiv._sancomponent = this;
        this.treeDiv.onselectstart = EUI.returnfalse;
    }
    ;
    h.prototype.treeNavMousedown = function(H) {
        H.stopPropagation();
        var J = this.activeItemGroup;
        if (!J) {
            return;
        }
        var L = J === this.treeDiv;
        var G = !L ? J._sancomponent : this.getRootItem();
        if (!G) {
            return;
        }
        var B = !L ? G.id : "root";
        var E = H.target;
        if (E.tagName !== "LI") {
            return;
        }
        if (B === E.id) {
            return;
        }
        var I = this.treeNav;
        var F = Array.prototype.slice.call(I.firstChild.childNodes);
        this.navclick = true;
        for (var D = F.length - 1; D >= 0; D--) {
            var C = F[D];
            var K = C.id === "root" ? this.getRootItem() : this.getItemObj(C.id);
            if (C === E) {
                this.navclick = undefined;
                this.refreshNav(K);
                return;
            }
            K.setExpanded(false);
        }
        this.navclick = undefined;
    }
    ;
    h.prototype.refreshNav = function(E) {
        if (!p) {
            return;
        }
        var G = this.treeNav;
        EUI.removeClassName(G, "eui-hide");
        var B = this.getRootItem();
        if (this.activeItemGroup) {
            EUI.removeClassName(this.activeItemGroup, "eui-tree-active-group");
            this.activeItemGroup = null;
        }
        if (this.navclick) {
            return;
        }
        G.innerHTML = '<ul class="eui-tree-nav-ul"><ul>';
        var D = G.firstChild;
        var C = [];
        var F = E;
        if (E !== B) {
            while (E && E !== B) {
                var I = E.id;
                var H = E.getItemText();
                C.push('<li class="eui-tree-nav-li' + (F === E ? " eui-tree-nav-active" : "") + '" id="' + I + '">' + H + "</li>");
                E = E.getParentItem();
            }
            C.reverse();
            C.splice(0, 0, '<li id="root" class="eui-tree-nav-li">全部</li>');
        } else {
            C.splice(0, 0, '<li id="root" class="eui-tree-nav-li eui-tree-nav-active">全部</li>');
        }
        D.innerHTML = C.join("");
        this.activeItemGroup = F === B ? this.treeDiv : F.getTrInParentItemTable();
        EUI.addClassName(this.activeItemGroup, "eui-tree-active-group");
    }
    ;
    h.prototype.clearReszieTimer = function() {
        if (this._widthreizeTimer) {
            this.wnd.clearTimeout(this._widthreizeTimer);
            this._widthreizeTimer = null;
        }
    }
    ;
    h.prototype.resizeWidth = function() {
        this.clearReszieTimer();
        var B = this.treeContent ? this.treeContent : this.basedom
          , D = this.treeDiv;
        this.checkHideScrollBarX();
        if (this.immediately) {
            var C = B.scrollWidth;
            if (C === 0) {
                return;
            }
            this.treeDiv.style.width = "";
            this.treeDiv.style.width = B.scrollWidth - 1 + "px";
            this.blankBody.width = this.treeDiv.style.width;
            this.immediately = false;
        } else {
            this._widthreizeTimer = this.wnd.setTimeout(function() {
                if (!this.treeDiv) {
                    return;
                }
                this.hideXscrollBar = false;
                B.style.overflowX = "";
                var E = B.scrollWidth;
                if (E === 0) {
                    return;
                }
                D.style.width = "";
                D.style.width = B.scrollWidth - 1 + "px";
                this.blankBody.width = this.treeDiv.style.width;
            }
            .bind(this), 100);
        }
    }
    ;
    h.prototype.checkHideScrollBarX = function() {
        var B = this.basedom;
        if (!this.hideXscrollBar && (B.offsetHeight - B.clientHeight) !== EUI.getScrollbarWidth()) {
            B.style.overflowX = "hidden";
            this.hideXscrollBar = true;
        }
    }
    ;
    h.prototype.reiszeImmediately = function() {
        this.immediately = true;
    }
    ;
    h.prototype.doEtreeClickEvent = function(B) {
        z(B);
    }
    ;
    function b(E) {
        if (!E) {
            E = window.event;
        }
        var D = l(E);
        var C = D ? D.owner : d(E);
        if (!C) {
            return;
        }
        var B = D ? x(D, E) : null;
        if (!C._lastMouseOverItem || !D || C._lastMouseOverItem != D || C._lastMouseOverItemHitTarget != B) {
            C._lastMouseOverItem = D;
            C._lastMouseOverItemHitTarget = B;
            C.doMouseMove(D, E, B);
        }
    }
    function r(B) {
        var C;
        C = B.getFocusItem();
        if (C) {
            C = C.getNextVisibleItem();
        } else {
            C = B.getRootItem().getFirstChild();
        }
        if (!C) {
            return;
        }
        C.selectSelf(true, B._arrowKeyOccurClick, true, true);
        return true;
    }
    function q(B) {
        var C;
        C = B.getFocusItem();
        if (C) {
            C = C.getPrevVisibleItem();
        } else {
            C = B.getRootItem().getLastChild();
        }
        if (!C) {
            return;
        }
        C.selectSelf(true, B._arrowKeyOccurClick, true, true);
    }
    function A(C) {
        if (!C) {
            C = window.event;
        }
        var B = d(C);
        if (!B) {
            return;
        }
        return B.doKeyDown(C);
    }
    function e(E) {
        if (!E) {
            E = window.event;
        }
        var D = l(E);
        if (!D) {
            var C = d(E);
            if (C) {
                return C.doContextmenu(null, E, C) ? true : false;
            } else {
                return true;
            }
        }
        var B = !!D.doContextmenu(E);
        !B && E.preventDefault();
        E.returnValue = B;
        return B;
    }
    function n(E) {
        if (!E) {
            E = window.event;
        }
        var D = l(E);
        if (!D) {
            var C = d(E);
            C.clearSelectedItems();
            C.setFocusItem(null);
            return;
        }
        var B = x(D, E);
        switch (B) {
        case "expand":
            break;
        case "icon":
        case "text":
        case "texttail":
        case "other":
            D.focus();
            D.doDblClick(E);
            break;
        }
    }
    function w(E) {
        E = E || window.event;
        var C = d(E);
        if (!C) {
            return;
        }
        var B = C.onmousedown;
        if (B) {
            B.apply(C, [E].concat(C.args_mousedown));
        }
        var D = C.treeDiv;
        if ((E.srcElement || E.target) !== D) {
            return;
        }
    }
    function z(E) {
        if (!E) {
            E = window.event;
        }
        var D = l(E);
        var C = D ? D.owner : d(E);
        if (!C) {
            return;
        }
        if (C._thisEventIsForDrag) {
            C._thisEventIsForDrag = false;
            return;
        }
        if (!D) {
            if (!E.ctrlKey && !E.shiftKey) {
                C.doClick(null, E);
                C.clearSelectedItems();
                C.setFocusItem(null);
            }
            return;
        }
        var B = D ? x(D, E) : null;
        switch (B) {
        case "expand":
            D.toggleExpand();
            break;
        case "checkbox":
            D._onclick_checkboximg(D, E);
            break;
        case "icon":
        case "text":
        case "texttail":
        case "other":
            D._onclick_texticon(D, E);
            break;
        }
    }
    function d(B) {
        return EUI._getMouseEventEComponent(B, "_initXTree");
    }
    function l(B) {
        return EUI._getMouseEventEComponent(B, "_initXTreeItem");
    }
    function x(E, F) {
        var D = EUI._getMouseEventTarget(F);
        var B = E.nodeTable
          , C = D.tagName;
        if (C === "IMG") {
            D = D.parentNode;
            C = D.tagName;
        }
        if (C === "I" && D === E.expanddom) {
            return "expand";
        }
        if (C === "I" && D === E.checkdom) {
            return "checkbox";
        }
        if (C === "I" && D === E.icondom) {
            return "icon";
        }
        if (C === "DIV" && D === E.span) {
            return "text";
        }
        return "other";
    }
    function s(C, B) {
        if (C == B || C.parentNode == B || C.parentNode.parentNode == B) {
            return true;
        }
        return false;
    }
    function u(B) {
        return (!y.isCSS1Compat && y.isFirefox) ? B.rows[0].childNodes[0] : B.rows[0].childNodes[0].childNodes[0];
    }
    function v(B) {
        return B.rows[0].childNodes[1].childNodes[0];
    }
    function o(B) {
        return B.rows[0].childNodes[2].childNodes[0];
    }
    function c(B) {
        return B.rows[0].childNodes[3].childNodes[0];
    }
    function k(B) {
        return B.rows[0].childNodes[3];
    }
    h.prototype._getItemDom_for_clone = function() {
        if (this.__createItem) {
            return this.__createItem;
        }
        var C = this.doc.createElement("div")
          , B = [];
        B.push('<li class="eui-tree-item">');
        B.push('<div class="eui-tree-node">');
        B.push('<i class="eui-tree-empty"></i>');
        B.push('<i class="eui-icon eui-form-checkbox ');
        if (!this._enableCheckBox) {
            B.push("eui-hide");
        }
        B.push('"></i>');
        B.push('<i class="eui-icon eui-tree-icon"></i>');
        B.push('<div class="eui-tree-text">一级菜单</div>');
        B.push("</div>");
        B.push("</li>");
        C.innerHTML = B.join("");
        this.__createItem = C.firstChild;
        return this.__createItem;
    }
    ;
    h.prototype.getFocusItem = function() {
        return this._focusItem;
    }
    ;
    h.prototype.setFocusItem = function(B) {
        this._focusItem = B;
        if (this._focusItem) {
            this._focusItem.focus();
        }
    }
    ;
    h.prototype.getSelectedItem = function(B) {
        if (B == undefined) {
            return this.selectedItems.length == 0 ? null : this.selectedItems[0];
        }
        return this.selectedItems[B];
    }
    ;
    h.prototype.removeSelectedItems = function() {
        var B = this.getSelectedItems();
        while (B && B.length > 0) {
            B.pop().remove();
        }
    }
    ;
    h.prototype.getSelectedItems = function() {
        return this.selectedItems && this.selectedItems.length > 0 ? this.selectedItems : null;
    }
    ;
    h.prototype.getTopSelectedItems = function(B) {
        return this.getRootItem().getTopSelectedItems(B);
    }
    ;
    h.prototype.getSelectedItemCount = function() {
        return this.selectedItems.length;
    }
    ;
    h.prototype.getCheckClassName = function(B) {
        switch (B) {
        case 0:
            return "eui-icon eui-form-checkbox";
        case 1:
            return "eui-icon eui-form-checkbox eui-form-checked";
        case 2:
            return "eui-icon eui-form-checkbox eui-form-checked-off";
        case 3:
            return "eui-icon eui-form-checkbox eui-form-checkbox-on";
        case 4:
            return "eui-icon eui-form-checkbox eui-form-checkbox-off";
        case 5:
            return "eui-icon eui-form-checkbox eui-form-checkbox-partial";
        default:
            return "";
        }
    }
    ;
    h.prototype.getLevel = function(B) {
        return B ? B.getLevel() : 0;
    }
    ;
    h.prototype.getTopCheckedItems = function(B) {
        return this.getRootItem().getTopCheckedItems(B);
    }
    ;
    h.prototype.getCheckedItems = function(B) {
        return this.getRootItem().getCheckedItems(B);
    }
    ;
    h.prototype.selectItem = function(C, D, B) {
        if (!C) {
            return;
        }
        if (this.selectedItems.indexOf(C) != -1) {
            return;
        }
        C.setHighlight(true);
        this.selectedItems.push(C);
        if (D) {
            this.doSelectingItem(C);
            C.doClick(B);
        }
    }
    ;
    h.prototype.selectItemSingleMode = function(B, C) {
        this.clearSelectedItems();
        this.selectItem(B, C);
        B.focus();
    }
    ;
    h.prototype.selectItems = function(B) {
        if (!B) {
            return;
        }
        for (var C = 0; C < B.length; C++) {
            this.selectItem(B[C], false);
        }
    }
    ;
    h.prototype.getScrollWidth = function() {
        var C = this.getSelectedItems()
          , B = null;
        if (C) {
            C = C.concat();
            this.clearSelectedItems();
            B = h._superClass.prototype.getScrollWidth.call(this);
            this.selectItems(C);
        } else {
            B = h._superClass.prototype.getScrollWidth.call(this);
        }
        return B;
    }
    ;
    h.prototype.search = function(H, B, C, E) {
        if (this._search_txt_ != B) {
            this._search_txt_ = B;
            this._search_isMatch = false;
        }
        var G = this.getFocusItem();
        if (!G) {
            G = this.getRootItem();
        }
        var F = G.getNextVisibleItem(true);
        while (F) {
            if (H(F, B)) {
                this._search_isMatch = true;
                F.selectSelf(true, true, true, true);
                return;
            }
            F = F.getNextVisibleItem(true);
        }
        if (this._search_isMatch) {
            if (this.isNotFirstComfirm) {
                return;
            }
            var D = this;
            this.isNotFirstComfirm = true;
            EUI.confirmDialog(I18N.getString("xui.ctrls.xtree.js.1", "提示"), "已搜索至末尾,是否需要重新开始搜索?", false, function(J) {
                var I = J.onclose;
                J.setOnClose(function() {
                    D.isNotFirstComfirm = false;
                    J.setOnClose(I);
                });
            }, function() {
                if (C) {
                    C();
                }
                D._search_isMatch = false;
                D.setFocusItem(D.getRootItem());
                D.search(H, B, C);
            });
            return;
        } else {
            var F = this.getRootItem();
            while (F && F !== G) {
                if (H(F, B)) {
                    this._search_isMatch = true;
                    F.selectSelf(true, true, true, true);
                    return;
                }
                F = F.getNextVisibleItem(true);
            }
        }
        E = EUI.parseBool(E, true);
        if (E) {
            EUI.showMessage(I18N.getString("xui.ctrls.xtree.js.3", "搜索已完毕未找到符合条件的节点"), I18N.getString("xui.ctrls.xtree.js.1", "提示"));
        }
    }
    ;
    h.prototype.unSelectItem = function(D, B) {
        if (this._focusItem == D) {
            this._focusItem = null;
        }
        if (this.selectedItems.length == 0) {
            return;
        }
        this.selectedItems.remove(D);
        D.setHighlight(false);
        if (B && this.selectedItems.length > 0) {
            for (var C = 0; C < D.getChildrenCount(); C++) {
                var E = D.getChildItem(C);
                this.unSelectItem(E, B);
            }
        }
    }
    ;
    h.prototype.unSelectItems = function(B) {
        if (!B) {
            return;
        }
        if (this.selectedItems.length == 0) {
            return;
        }
        for (var C = 0; C < B.length; C++) {
            var D = B[C];
            this.selectedItems.remove(D);
            D.setHighlight(false);
        }
    }
    ;
    h.prototype.clickItem = function(B, C) {
        if (!B) {
            return;
        }
        if (C.ctrlKey && this._ctrlSelect) {
            if (B.isSelected()) {
                this.unSelectItem(B);
            } else {
                this.selectItem(B, false);
            }
            this._siftSelectSourceItem = B;
            this._lastShiftSelectedItems = null;
            return;
        }
        if (C.shiftKey && this._shiftSelect) {
            this._doShiftSelect(B, C);
            return;
        }
        if (!B.isSelected() || this.getSelectedItemCount() > 1) {
            B.selectSelf(true, true, false, true, C);
        } else {
            B.doClick(C);
        }
        this._siftSelectSourceItem = B;
        this._lastShiftSelectedItems = null;
    }
    ;
    h.prototype._afterRightClickItem = function(B, C) {
        this._siftSelectSourceItem = B;
        this._lastShiftSelectedItems = null;
    }
    ;
    h.prototype._doShiftSelect = function(F, H) {
        var D = this._siftSelectSourceItem;
        var G = F;
        if (!D || !G) {
            return;
        }
        if (D.getRowIndexInTree() > G.getRowIndexInTree()) {
            var C = D;
            D = G;
            G = C;
        }
        this.unSelectItems(this._lastShiftSelectedItems);
        var B = [];
        var E = D;
        while (E && E != G) {
            B.push(E);
            var C = E.isExpanded() ? E.getFirstChild() : E.getNextSibling();
            if (!C) {
                E = E.getParentItem();
                C = E.getNextSibling();
                while (!C) {
                    E = E.getParentItem();
                    C = E.getNextSibling();
                }
            }
            E = C;
        }
        B.push(G);
        this.selectItems(B);
        this._lastShiftSelectedItems = B;
    }
    ;
    h.prototype.clearSelectedItems = function() {
        while (this.selectedItems.length > 0) {
            this.selectedItems.pop().setHighlight(false);
        }
        this._siftSelectSourceItem = null;
    }
    ;
    h.prototype.doContextmenu = function(B, C) {
        if (this.oncontextmenu) {
            return this.oncontextmenu(B, C, this);
        }
        return true;
    }
    ;
    h.prototype.doMouseMove = function(C, D, B) {
        if (this.onmousemove) {
            this.onmousemove(C, D, this, B);
        }
    }
    ;
    h.prototype.doClick = function(B, C) {
        if (this.onclick) {
            this.onclick(B, C, this);
        }
    }
    ;
    h.prototype.doDblClick = function(B, C) {
        if (this.ondblclick) {
            this.ondblclick(B, C, this);
        }
    }
    ;
    h.prototype.doKeyDown = function(C) {
        if (this.onkeydown) {
            var B = this.onkeydown(C, this);
            if (typeof (B) == "boolean" && !B) {
                return B;
            }
        }
        var D = this.doKeyDownDefaultAction(C);
        if (D === false) {
            C.stopPropagation ? C.stopPropagation() : (C.cancelBubble = true);
            C.preventDefault ? C.preventDefault() : (C.returnValue = false);
        }
        return D;
    }
    ;
    h.prototype.doKeyDownDefaultAction = function(C) {
        var B;
        switch (C.keyCode) {
        case 38:
            q(this);
            return false;
        case 40:
            r(this);
            return false;
        case 37:
            B = this.getFocusItem();
            if (!B) {
                break;
            }
            if (B.isExpanded()) {
                B.setExpanded(false);
            } else {
                q(this);
            }
            return false;
        case 39:
            B = this.getFocusItem();
            if (!B) {
                break;
            }
            if (!B.isExpanded() && B.hasChildren()) {
                B.setExpanded(true);
            } else {
                r(this);
            }
            return false;
        case 13:
            B = this.getFocusItem();
            if (B) {
                B.doClick();
            }
            break;
        default:
            return true;
        }
    }
    ;
    h.prototype.doSelectingItem = function(B, C) {
        if (this.onselecting) {
            this.onselecting(B, C, this);
        }
    }
    ;
    h.prototype.doExpandItem = function(B, C) {
        if (this.onexpand) {
            this.onexpand(B);
        }
        if (this.onexpand2) {
            this.onexpand2(B);
        }
    }
    ;
    h.prototype.doCollapsedItem = function(B, C) {
        if (this.oncollapsed) {
            this.oncollapsed(B);
        }
    }
    ;
    h.prototype.doCheckItem = function(B, C) {
        if (this.oncheck) {
            this.oncheck(B, C, this);
        }
    }
    ;
    h.prototype.doBeforeCheckItem = function(B, C) {
        return (this.onbeforecheck) ? this.onbeforecheck(B, C, this) : true;
    }
    ;
    h.prototype.getXmlLoader = function() {
        var B = this.xmlloader;
        if (!B) {
            B = new j(this);
            this.xmlloader = B;
        }
        return B;
    }
    ;
    h.prototype.setXmlLoader = function(B) {
        var C = this.xmlloader;
        if (C) {
            C.dispose();
        }
        this.xmlloader = B;
    }
    ;
    h.prototype.refresh = function(B, D, C) {
        this._siftSelectSourceItem = null;
        this.getXmlLoader().refreshTreeItem(B, D, C);
    }
    ;
    h.prototype.__createXTreeItem = function(B, D, C) {
        return new m({
            itemText: B,
            parentObject: D,
            ownerTree: C
        });
    }
    ;
    h.prototype.__getStandartTreeRowCls = function() {
        return "standartTreeRow";
    }
    ;
    h.prototype.__getSelectedTreeRowCls = function() {
        return "selectedTreeRow";
    }
    ;
    h.prototype.appendChild = function(B) {
        return this.rootItem.appendChild(B);
    }
    ;
    h.prototype.setRootChilderOnlyExpandedOne = function(E) {
        if (this._rootChilderOnlyExpandedOne === (E = E === true)) {
            return;
        }
        if (this._rootChilderOnlyExpandedOne = E) {
            var F = this.getRootItem().childItems
              , D = null;
            for (var C = 0, B = F.length; C < B; C++) {
                if ((D = F[C]).isExpanded()) {
                    if (this._expandedItem) {
                        D.setExpanded(false);
                    } else {
                        this._expandedItem = D;
                    }
                }
            }
        } else {
            this._expandedItem = null;
        }
    }
    ;
    h.prototype.setHighlightStyle = function(E, D) {
        this.highlightbgcolor = E == null ? false : E;
        this.highlightbgimg = D == null ? false : (D ? "url(" + D + ")" : "");
        if (E === false && D === false) {
            return;
        }
        var G = this.getSelectedItems();
        if (!G) {
            return;
        }
        for (var F = 0, C = G.length; F < C; F++) {
            var B = G[F].nodeTable.firstChild.style;
            if (E !== false) {
                B.backgroundColor = E;
            }
            if (D !== false) {
                B.backgroundImage = D;
            }
        }
    }
    ;
    h.prototype.setItemColor = function(B, C) {
        this.acolor = B;
        this.scolor = C;
        this.rootItem.browseAllChildrenItems(function(D, E) {
            D.setItemColor(E.acolor, E.scolor);
        }, this, true);
    }
    ;
    function m(B) {
        this.owner = B["ownerTree"];
        this.parentObject = B["parentObject"];
        if (!this.owner.rootItem) {
            this.owner.treeDiv.innerHTML = "<div><span></span></div>";
            this._createItemGroup(this.owner.treeDiv);
            this.span = this.owner.treeDiv.firstChild.firstChild;
            return;
        }
        this._createTableNode(this);
        this.setItemText(B["itemText"]);
        this.setItemColor(this.owner.acolor, this.owner.scolor);
    }
    m.prototype._initXTreeItem = function() {}
    ;
    m.prototype._createTableNode = function() {
        var B = this.owner._getItemDom_for_clone().cloneNode(true);
        B._sancomponent = this;
        this.row = B;
        this.nodeTable = B;
        var C = B.firstChild;
        this.expanddom = C.firstChild;
        this.checkdom = this.expanddom.nextSibling;
        this.icondom = this.checkdom.nextSibling;
        this.span = C.lastChild;
    }
    ;
    m.prototype._createItemGroup = function(B) {
        this.groupdom = (B || this.nodeTable).appendChild(this.owner.doc.createElement("ul"));
        this.groupdom.className = "eui-tree-group";
    }
    ;
    m.prototype.getGroupDom = function() {
        if (!this.groupdom) {
            this._createItemGroup();
        }
        return this.groupdom;
    }
    ;
    m.prototype.getDragSrcCompoment_forDragStart = function() {
        return this.owner;
    }
    ;
    m.prototype.setVisible = function(B) {
        B ? EUI.removeClassName(this.nodeTable, "eui-hide") : EUI.addClassName(this.nodeTable, "eui-hide");
        if (this.parentObject) {
            this.parentObject.adjustExpandIcon();
        }
    }
    ;
    m.prototype.isVisible = function() {
        return !EUI.hasClassName(this.nodeTable, "eui-hide");
    }
    ;
    m.prototype.setDisabled = function(C) {
        C = EUI.parseBool(C, false);
        var B = this.nodeTable;
        if (C) {
            EUI.addClassName(B, "eui-tree-disabled");
        } else {
            EUI.removeClassName(B, "eui-tree-disabled");
        }
    }
    ;
    m.prototype.setEnabled = function(B) {
        B = EUI.parseBool(B, true);
        this.setDisabled(!B);
    }
    ;
    m.prototype.isDisabled = function() {
        return EUI.hasClassName(this.nodeTable, "eui-tree-disabled");
    }
    ;
    m.prototype.isEnabled = function() {
        return !this.isDisabled();
    }
    ;
    m.prototype.isSelected = function() {
        return this.owner && this.owner.selectedItems.indexOf(this) >= 0;
    }
    ;
    m.prototype.getUserObj = function() {
        return this.userObj;
    }
    ;
    m.prototype.setUserObj = function(B) {
        this.userObj = B;
    }
    ;
    m.prototype.getOwner = function() {
        return this.owner;
    }
    ;
    m.prototype.getParentItem = function() {
        return this.parentObject;
    }
    ;
    m.prototype.hasChildren = function() {
        return this._shouldHasChildren || this.getChildrenCount() > 0;
    }
    ;
    m.prototype.setHasChildren = function(B) {
        if (this.getChildrenCount() > 0) {
            return;
        }
        this._shouldHasChildren = B;
        this.adjustExpandIcon();
    }
    ;
    m.prototype.getChildrenCount = function() {
        return this.childItems ? this.childItems.length : 0;
    }
    ;
    m.prototype.hasVisibleChildren = function() {
        var C = this.getChildrenCount();
        if (!C) {
            return false;
        }
        for (var B = 0; B < C; B++) {
            if (this.getChildItem(B).isVisible()) {
                return true;
            }
        }
        return false;
    }
    ;
    m.prototype.hasMultiVisibleChildren = function() {
        var D = this.getChildrenCount();
        if (!D) {
            return false;
        }
        var B = 0;
        for (var C = 0; C < D; C++) {
            if (this.getChildItem(C).isVisible() && B++ > 0) {
                return true;
            }
        }
        return false;
    }
    ;
    m.prototype.getChildItem = function(B) {
        return this.childItems ? this.childItems[B] : null;
    }
    ;
    m.prototype.getAllChildItem = function(B) {
        if (!B) {
            B = [];
        }
        for (var C = 0; C < this.getChildrenCount(); C++) {
            var D = this.getChildItem(C);
            B.push(D);
            D.getCheckedItems(B);
        }
        return B;
    }
    ;
    m.prototype.dispose = function() {
        this._focusBind = null;
        this.onclick = undefined;
        this.ondblclick = undefined;
        this.oncontextmenu = undefined;
        this.userObj = undefined;
        this.owner = undefined;
        this.parentObject = undefined;
        this.span = undefined;
        if (this.nodeTable) {
            this.nodeTable._sancomponent = undefined;
            this.nodeTable = undefined;
        }
        this.xmlDom = undefined;
        if (this._icon) {
            this._icon.onload = null;
            this._icon.imgDom = null;
            this._icon = null;
        }
        this._disposeChildren();
    }
    ;
    m.prototype._disposeChildren = function() {
        var C = this.childItems;
        if (!C) {
            return;
        }
        var B = C.length;
        for (var D = 0; D < B; D++) {
            C[D].dispose();
        }
        this.childItems = null;
    }
    ;
    m.prototype.appendChild = function(B) {
        var C = this._appendChildNode(this, B);
        if (!this.childItems) {
            this.childItems = [];
        }
        this.childItems.push(C);
        this.setExpanded(true);
        if (this.getChildrenCount() === 1) {
            this.adjustExpandIcon();
        }
        if (C.getParentItem() == C.owner.getRootItem()) {
            C._ignoreSelectedTreeRow = true;
        }
        if (this.getCheckState() === 1 && this.owner._autoCheckSubItems) {
            C.setChecked(1);
        }
        this.owner.autoShowBlank();
        return C;
    }
    ;
    m.prototype.insertChild = function(B, C, D) {
        if (!C) {
            return this.appendChild(B);
        }
        if (D) {
            C = C.getNextSibling();
        }
        if (!C) {
            return this.appendChild(B);
        }
        var E = this._appendChildNode(this, B, C);
        if (!this.childItems) {
            this.childItems = [];
        }
        var F = C.getRowIndexInParent();
        this.childItems.insertAt(E, F);
        this.setExpanded(true);
        E.adjustExpandIcon();
        if (this.getChildrenCount() === 1) {
            this.adjustExpandIcon();
        }
        return E;
    }
    ;
    m.prototype.insertChildBefore = function(B, C) {
        return this.insertChild(B, C);
    }
    ;
    m.prototype.insertChildAfter = function(B, C) {
        return this.insertChild(B, C, true);
    }
    ;
    m.prototype._appendChildNode = function(F, C, D) {
        if (D) {
            F = D.parentObject;
        }
        var E = this.owner.__createXTreeItem(C, F, this.owner);
        var B = F.getGroupDom();
        if (D) {
            B.insertBefore(E.nodeTable, D.nodeTable);
        } else {
            B.appendChild(E.nodeTable);
        }
        if (this.owner._enableCheckBox && this.owner._autoCheckSubItems && this.checkstate == 1) {
            E.setSelfChecked(1);
        }
        return E;
    }
    ;
    m.prototype.loadFrom = function(B, C) {
        if (typeof (B) == "string") {
            EUI.parseXML(B, function(E, D) {
                D.loadFromXml(E, C);
            }, this);
            return;
        }
        if (B.ownerDocument || B.documentElement) {
            this.loadFromXml(B, C);
        } else {
            if (typeof (B) == "object" && B["indexOfIgnoreCase"] != null) {
                this.loadFromArray(B, C);
            }
        }
    }
    ;
    m.prototype.loadFromXml = function(H, F, G, C, B, E) {
        var D = this.owner.getXmlLoader();
        D.onitem = F;
        D.isIncrementalLoadData = false;
        D.delayLoadXmlChildNodes = G;
        D.limitOnceLoadItemCount = B;
        D.loadXmlChildNodes(this, H, C, E);
    }
    ;
    m.prototype.loadFromArray = function(H, E) {
        if (!this.owner) {
            return;
        }
        var F = this.getWaitingChildItem();
        if ((!H || H.length == 0)) {
            this.showWaitingImage(false);
            this._addNullItem(F);
            return;
        }
        var J;
        var K = H.length;
        for (var G = 0; G < K; G++) {
            var M = H[G];
            var N = M.caption;
            var L = M.userObj ? M.userObj : M;
            var D = M.img0;
            var C = M.img1;
            var B = M.img2;
            var I = M.haschild;
            if (F) {
                J = F;
                F = null;
                J.setItemText(N);
                J.showWaitingImage(false);
                J.showCheckBox(this.owner._enableCheckBox);
                if (this.owner._enableCheckBox) {
                    J.setSelfChecked(this.owner._autoCheckSubItems && this.checkstate == 1 ? 1 : 0);
                }
            } else {
                J = this.appendChild(N);
            }
            if (D || C || B) {
                J.setItemImage(D, C, B);
            }
            J.setUserObj(L);
            J.setHasChildren(EUI.parseBool(I, false));
            if (E) {
                E(J, M);
            }
        }
        this.showWaitingImage(false);
    }
    ;
    m.prototype._addNullItem = function(C) {
        if (!C) {
            C = this.getWaitingChildItem();
        }
        if (!C && this.getChildrenCount() > 0) {
            return;
        }
        if (this.getChildrenCount() > 1 && C.getParentItem() == this) {
            if (C) {
                C.remove();
            }
            return;
        }
        if (this.owner.dontInsertBlankNode) {
            if (C) {
                C.remove();
            }
            this.setExpanded(false);
            this.setHasChildren(false);
            return;
        }
        var B = C ? C : this.appendChild(I18N.getString("xui.ctrls.xtree.js.4", "空"));
        B.setItemText(I18N.getString("xui.ctrls.xtree.js.4", "空"));
        B.clearChildren();
        B.showCheckBox(false);
        B.setHasChildren(false);
        B.setUserObj(null);
        B.setItemImage(EUI.sys.getImgPath("treeexception.gif"));
        B.showWaitingImage(false);
        this.showWaitingImage(false);
    }
    ;
    m.prototype.appendFriend = function(B) {
        return this.parentObject.insertChildBefore(B, this);
    }
    ;
    m.prototype.appendFriendAfter = function(B) {
        return this.parentObject.insertChildAfter(B, this);
    }
    ;
    m.prototype._checkMoveable = function(B) {
        if (!B) {
            return false;
        }
        while (B) {
            if (B == this) {
                return false;
            }
            B = B.parentObject;
        }
        return true;
    }
    ;
    m.prototype.moveTo = function(G) {
        if (!this._checkMoveable(G)) {
            return;
        }
        var D = this.isSelected();
        if (D) {
            this.owner.unSelectItem(this);
        }
        var C = G.getGroupDom();
        var E = G.getLastChild();
        var B = this.getPrevSibling();
        var F = this.getTrInParentItemTable();
        F.parentNode.removeChild(F);
        C.appendChild(F);
        this.parentObject.childItems.remove(this);
        if (!this.parentObject.childItems.length) {
            this.parentObject.setHasChildren(false);
        }
        if (!G.childItems) {
            G.childItems = [];
        }
        G.childItems.push(this);
        this.parentObject = G;
        this.owner = G.owner;
        G.setExpanded(true);
        G.adjustExpandIcon();
    }
    ;
    m.prototype.moveToBefore = function(E) {
        if (!this._checkMoveable(E)) {
            return;
        }
        if (E.getPrevSibling() == this) {
            return;
        }
        var D = this.isSelected();
        if (D) {
            this.owner.unSelectItem(this);
        }
        var C = E.getTrInParentItemTable();
        var B = this.getPrevSibling();
        C.parentNode.insertBefore(this.getTrInParentItemTable(), C);
        this.parentObject.childItems.remove(this);
        this.parentObject.adjustExpandIcon();
        E.parentObject.childItems.insertAt(this, E.getRowIndexInParent());
        this.parentObject = E.parentObject;
    }
    ;
    m.prototype.moveToAfter = function(C) {
        if (this == C) {
            return;
        }
        var B = C.getNextSibling();
        if (B == this) {
            return;
        }
        if (B) {
            this.moveToBefore(B);
            return;
        }
        this.moveTo(C.getParentItem());
    }
    ;
    m.prototype.remove = function(D) {
        if (!this.parentObject) {
            return;
        }
        this.setHighlight(false);
        this.owner.unSelectItem(this, true);
        if (D) {
            var B = null;
            switch (D) {
            case 2:
                B = this.getNextSibling();
                if (!B) {
                    B = this.getPrevSibling();
                }
                if (B) {
                    break;
                }
            case 1:
                if (this.getParentItem() != this.owner.getRootItem()) {
                    B = this.getParentItem();
                }
                break;
            }
            if (B) {
                this.owner.selectItem(B);
            }
        }
        var C = this.getPrevSibling();
        var F = this.getNextSibling();
        this.parentObject.childItems.remove(this);
        this.parentObject.adjustExpandIcon();
        var E = this.getTrInParentItemTable();
        E.parentNode.removeChild(E);
        this.owner.autoShowBlank();
        this.dispose();
    }
    ;
    m.prototype.setIsLoaded = function(B) {
        this._isLoaded = B;
    }
    ;
    m.prototype.getIsLoaded = function() {
        return this._isLoaded;
    }
    ;
    m.prototype.clearChildren = function() {
        if (this._isLoaded) {
            this._isLoaded = false;
        }
        var B = this.childItems;
        if (!B) {
            return;
        }
        while (B.length > 0) {
            B.pop().remove();
        }
        this.setHasChildren(false);
    }
    ;
    m.prototype.setItemText = function(B) {
        B = this.itemText = B || "";
        var C = B.unHTML();
        this.span.innerHTML = C.toHTML().replace(/ /g, "&nbsp;");
        this.span.title = C;
    }
    ;
    m.prototype.getItemText = function() {
        return this.itemText;
    }
    ;
    m.prototype.getItemPlainText = function() {
        return EUI.getTextContent(this.span);
    }
    ;
    m.prototype.getItemDom = function() {
        return this.getTextDom();
    }
    ;
    m.prototype.getTextDom = function() {
        return this.span;
    }
    ;
    m.prototype.getTrInParentItemTable = function() {
        return this.nodeTable;
    }
    ;
    m.prototype.setOnContextMenu = function(B) {
        this.oncontextmenu = B;
    }
    ;
    m.prototype.setOnClick = function(B) {
        this.onclick = B;
    }
    ;
    m.prototype.setItemColor = function(C, D) {
        this.scolor = D;
        this.acolor = C;
        var B = this.isSelected();
        if (B) {
            if (this.scolor) {
                this.span.style.color = this.scolor;
            } else {
                this.span.style.color = "";
            }
        }
        if (!B && this.acolor) {
            this.span.style.color = this.acolor;
        }
    }
    ;
    m.prototype.setItemImage = function(B, D, C) {
        if (!D && !C) {
            D = B;
            C = B;
        } else {
            if (!C) {
                C = D;
            }
        }
        if (this.imageOpen == D && this.imageClose == C && this.imageLeaf == B) {
            return;
        }
        this.imageOpen = D;
        this.imageClose = C;
        this.imageLeaf = B;
        this.adjustExpandIcon();
    }
    ;
    m.prototype.adjustExpandIcon = function() {
        if (!this.expanddom) {
            return;
        }
        var B;
        if (this._shouldHasChildren || this.hasVisibleChildren()) {
            B = this.isExpanded() ? 1 : 2;
        } else {
            B = 0;
        }
        var C = this.expanddom, D = this.icondom, F, E;
        switch (B) {
        case 0:
            E = "eui-tree-empty";
            F = this.imageLeaf;
            break;
        case 1:
            E = "eui-icon eui-tree-shrink";
            F = this.imageOpen;
            break;
        case 2:
            E = "eui-icon eui-tree-expand";
            F = this.imageClose;
            break;
        default:
            E = "";
            break;
        }
        C.className = E;
        if (F) {
            EUI.setTagIcon(D, F);
            EUI.removeClassName(D, "eui-hide");
        } else {
            EUI.addClassName(D, "eui-hide");
        }
        this.owner.resizeWidth();
    }
    ;
    m.prototype.setExpanded = function(C) {
        var B = this.owner;
        if (this === B.getRootItem() && C === false) {
            return;
        }
        if (this._expanded == C) {
            return;
        }
        if (C && (!this.hasChildren())) {
            return;
        }
        this._expanded = C;
        if (C) {
            if (B._rootChilderOnlyExpandedOne && this.getParentItem() == B.getRootItem()) {
                if (B._expandedItem && B._expandedItem != this) {
                    B._expandedItem.setExpanded(false);
                }
                B._expandedItem = this;
            }
            B.checkHideScrollBarX();
            this._showChildrenDoms(true);
            this.doExpandEvent();
            if ((this.parentObject) && (!this.parentObject.isExpanded())) {
                this.parentObject.setExpanded(true);
            }
            B.refreshNav(this);
        } else {
            if (B.rootItem == this) {
                return;
            }
            this._showChildrenDoms(false);
            this.doCollapsedEvent();
            B.refreshNav(this.getParentItem());
        }
    }
    ;
    m.prototype._showChildrenDoms = function(B) {
        if (this.groupdom) {
            B ? EUI.removeClassName(this.groupdom, "eui-hide") : EUI.addClassName(this.groupdom, "eui-hide");
        }
        this.adjustExpandIcon();
    }
    ;
    m.prototype.toggleExpand = function() {
        if (!this.hasChildren()) {
            return;
        }
        this.setExpanded(!this.isExpanded());
    }
    ;
    m.prototype.setItemHighlightImage = function(B) {
        this.highlightimg = B;
    }
    ;
    m.prototype.setHighlight = function(G) {
        var B = this.owner;
        if (!B) {
            return;
        }
        if (!this.nodeTable) {
            return;
        }
        var I = this.nodeTable.firstChild;
        if (!I) {
            return;
        }
        var C = this.highlightimg;
        var F = this.owner.highlightbgcolor
          , H = this.owner.highlightbgimg;
        if (!C) {
            C = B.highlightimg;
        }
        if (C) {
            if (G) {
                var E = this.icondom;
                EUI.setTagIcon(E, C);
            } else {
                this.adjustExpandIcon();
            }
        }
        if (!G) {
            if (this.acolor || this.scolor) {
                this.span.style.color = this.acolor || "";
            }
            if (F) {
                I.style.backgroundColor = "";
            }
            if (H) {
                I.style.backgroundImage = "";
            }
            EUI.removeClassName(I, "eui-tree-focus");
        } else {
            if (F) {
                I.style.backgroundColor = F;
            }
            if (H) {
                I.style.backgroundImage = H;
            }
            var D = this.span.style.color;
            if (D) {
                this.acolor = D;
            }
            this.span.style.color = this.scolor || "";
            EUI.addClassName(I, "eui-tree-focus");
        }
    }
    ;
    m.prototype.doDblClick = function(B) {
        if (this.ondblclick) {
            this.ondblclick(this, B);
            if (!this.owner) {
                return;
            }
        }
        this.toggleExpand();
        this.owner.doDblClick(this, B);
    }
    ;
    m.prototype.doContextmenu = function(B) {
        if (!this.isSelected()) {
            this.selectSelf(true, false, false, true);
            this.owner._afterRightClickItem(this, B);
        }
        if (this.oncontextmenu) {
            return this.oncontextmenu(this, B);
        }
        return this.owner.doContextmenu(this, B, this.owner);
    }
    ;
    m.prototype.doClick = function(B) {
        if (this.onclick) {
            this.onclick(this, B);
        }
        this.owner.doClick(this, B, this.owner);
    }
    ;
    m.prototype.doExpandEvent = function() {
        this.owner.doExpandItem(this);
    }
    ;
    m.prototype.doCollapsedEvent = function() {
        this.owner.doCollapsedItem(this);
    }
    ;
    m.prototype.isExpanded = function() {
        return this._expanded;
    }
    ;
    m.prototype.getLevel = function() {
        var C = 0;
        var B = this;
        while (B.parentObject) {
            C++;
            B = B.parentObject;
        }
        return C;
    }
    ;
    m.prototype.showCheckBox = function(C) {
        var B = this.checkdom;
        if (C) {
            B.className = this.owner.getCheckClassName(0);
        } else {
            EUI.addClassName(B, "eui-hide");
        }
    }
    ;
    m.prototype.isChecked = function() {
        return !!this.checkstate;
    }
    ;
    m.prototype.getCheckState = function() {
        return this.checkstate;
    }
    ;
    m.prototype.setChecked = function(C) {
        if (!C) {
            C = 0;
        }
        this.setSelfChecked(C);
        if ((C == 0 || C == 1) && this.owner._autoCheckSubItems && this.hasChildren()) {
            this.setChildrenChecked(C);
        }
        if (this.owner._autoCheckGrayParent && this.parentObject != this.owner.rootItem) {
            var D = this.owner._autoCheckSubItems;
            this.owner._autoCheckSubItems = false;
            var B = this.parentObject.getCheckedCountInfo();
            if (B[0] == this.parentObject.getChildrenCount()) {
                this.parentObject.setChecked(1);
            } else {
                if (B[0] + B[1] > 0) {
                    this.parentObject.setChecked(2);
                } else {
                    this.parentObject.setChecked(0);
                }
            }
            this.owner._autoCheckSubItems = D;
        }
        this.owner.doCheckItem(this);
    }
    ;
    m.prototype.setSelfChecked = function(B) {
        if (!B) {
            B = 0;
        }
        this.checkstate = B;
        this.checkdom.className = this.owner.getCheckClassName(B);
    }
    ;
    m.prototype.getCheckedCountInfo = function() {
        var D = 0;
        var B = 0;
        for (var C = 0; C < this.getChildrenCount(); C++) {
            var E = this.getChildItem(C);
            var F = E.getCheckState();
            if (F == 1) {
                D++;
            } else {
                if (F == 2) {
                    B++;
                }
            }
        }
        return [D, B];
    }
    ;
    m.prototype.getCheckedChildrenCount = function() {
        var D = 0;
        for (var B = 0; B < this.getChildrenCount(); B++) {
            var C = this.getChildItem(B);
            if (C.getCheckState() == 1) {
                D++;
            }
        }
        return D;
    }
    ;
    m.prototype.setChildrenChecked = function(D) {
        for (var B = 0; B < this.getChildrenCount(); B++) {
            var C = this.getChildItem(B);
            C.setChecked(D);
        }
    }
    ;
    m.prototype.getTopCheckedItems = function(C) {
        if (!C) {
            C = [];
        }
        for (var E = 0, B = this.getChildrenCount(); E < B; E++) {
            var F = this.getChildItem(E);
            var D = F.getCheckState();
            if (D == 1) {
                C.push(F);
            } else {
                if (D == 2) {
                    F.getTopCheckedItems(C);
                }
            }
        }
        return C;
    }
    ;
    m.prototype.getTopSelectedItems = function(C) {
        if (!C) {
            C = [];
        }
        for (var D = 0, B = this.getChildrenCount(); D < B; D++) {
            var E = this.getChildItem(D);
            if (E.isSelected()) {
                C.push(E);
            } else {
                E.getTopSelectedItems(C);
            }
        }
        return C;
    }
    ;
    m.prototype.getTopMostItem = function() {
        var C = this.getOwner().getRootItem();
        if (this === C) {
            return null;
        }
        var D = this;
        var B = D.getParentItem();
        while (!!B) {
            if (B === C) {
                return D;
            }
            D = B;
            B = D.getParentItem();
        }
        return null;
    }
    ;
    m.prototype.getCheckedItems = function(B) {
        if (!B) {
            B = [];
        }
        for (var C = 0; C < this.getChildrenCount(); C++) {
            var D = this.getChildItem(C);
            if (D.isChecked()) {
                B.push(D);
            }
            D.getCheckedItems(B);
        }
        return B;
    }
    ;
    m.prototype.getAllChildrenItems = function(B, D, F) {
        if (!B) {
            B = [];
        }
        if (this.getChildrenCount() == 0) {
            return B;
        }
        for (var C = 0; C < this.getChildrenCount(); C++) {
            var E = this.getChildItem(C);
            B.push(E);
            if (D && E.hasChildren()) {
                E.getAllChildrenItems(B, D, F);
            }
            if (EUI.isFunction(F)) {
                F(E);
            }
        }
        return B;
    }
    ;
    m.prototype.browseAllChildrenItems = function(G, B, D) {
        if (!G) {
            return;
        }
        for (var C = 0, F = this.getChildrenCount(); C < F; C++) {
            var E = this.getChildItem(C);
            if (G(E, B) !== false && D && E.hasChildren()) {
                E.browseAllChildrenItems(G, B, D);
            }
        }
    }
    ;
    m.prototype.getItemById = function(E) {
        for (var B = 0; B < this.getChildrenCount(); B++) {
            var D = this.getChildItem(B);
            if (D.id == E) {
                return D;
            }
            if (D.hasChildren()) {
                var C = D.getItemById(E);
                if (C) {
                    return C;
                }
            }
        }
    }
    ;
    m.prototype.getItemByPrep = function(F, E) {
        for (var B = 0; B < this.getChildrenCount(); B++) {
            var D = this.getChildItem(B);
            if (D[F] == E) {
                return D;
            }
            if (D.hasChildren()) {
                var C = D.getItemByPrep(F, E);
                if (C) {
                    return C;
                }
            }
        }
    }
    ;
    m.prototype._onclick_checkboximg = function(B, C) {
        if (C && C.shiftKey) {
            this._doShiftcheck(B, C);
        } else {
            this.owner._siftcheckSourceItem = this;
            this.toggleChecked();
        }
    }
    ;
    m.prototype._onclick_texticon = function(B, C) {
        this.focus();
        this.owner.clickItem(B, C);
    }
    ;
    m.prototype.toggleChecked = function() {
        if (!this.owner.doBeforeCheckItem(this)) {
            return;
        }
        switch (this.getCheckState()) {
        case 1:
            this.setChecked(0);
            break;
        case 2:
            this.setChecked(0);
            break;
        default:
            this.setChecked(1);
            break;
        }
    }
    ;
    m.prototype._doShiftcheck = function(E, H) {
        var C = this.owner._siftcheckSourceItem;
        var G = E;
        if (!C || !G || (C.getParentItem() != G.getParentItem())) {
            return;
        }
        var F = G.getCheckState() ? 0 : 1;
        if (C.getRowIndexInTree() > G.getRowIndexInTree()) {
            var B = C;
            C = G;
            G = B;
        }
        var D = C;
        while (D && D != G) {
            D.setChecked(F);
            D = D.getNextSibling();
        }
        G.setChecked(F);
    }
    ;
    m.prototype.getFirstChild = function() {
        return this.getChildItem(0);
    }
    ;
    m.prototype.getFirstVisibleChild = function(F) {
        var D = this.getChildrenCount();
        if (!D) {
            return null;
        }
        if (typeof (F) != "boolean") {
            F = false;
        }
        var E, C;
        for (var B = 0; B < D; B++) {
            C = this.getChildItem(B);
            if (!C.isVisible()) {
                continue;
            }
            if (C.hasChildren() && F) {
                C.setExpanded(true);
                E = C.getFirstVisibleChild(F);
                if (!E) {
                    continue;
                }
                return E;
            }
            return C;
        }
        return null;
    }
    ;
    m.prototype.getLastChild = function() {
        return this.getChildItem(this.getChildrenCount() - 1);
    }
    ;
    m.prototype.getLastVisibleChild = function() {
        var C = this.getChildrenCount();
        if (!C) {
            return null;
        }
        for (var B = C - 1; B >= 0; B--) {
            var D = this.getChildItem(B);
            if (D.isVisible()) {
                return D;
            }
        }
        return null;
    }
    ;
    m.prototype.getRowIndexInTree = function() {
        var B = function(G) {
            if (!G.isExpanded()) {
                return 0;
            }
            var D = G.childItems;
            if (!D) {
                return 0;
            }
            var C = 0
              , F = D.length;
            for (var E = 0; E < F; E++) {
                C += B(D[E]);
            }
            return C + F;
        };
        m.prototype.getRowIndexInTree = function() {
            var D = 1
              , C = this.getPrevSibling();
            while (C) {
                D = D + B(C) + 1;
                C = C.getPrevSibling();
            }
            var E = this.parentObject;
            return E ? D + E.getRowIndexInTree() : D;
        }
        ;
        return m.prototype.getRowIndexInTree.call(this);
    }
    ;
    m.prototype.getRowIndexInParent = function() {
        var B = this.parentObject;
        return B ? B.childItems.indexOf(this) : 0;
    }
    ;
    m.prototype.getNextSibling = function() {
        var C = this.parentObject;
        if (!C) {
            return;
        }
        var B = C.childItems.indexOf(this);
        return B >= 0 && B < C.getChildrenCount() - 1 ? C.getChildItem(B + 1) : null;
    }
    ;
    m.prototype.getNextVisibleSibling = function() {
        var E = this.parentObject;
        if (!E) {
            return;
        }
        var C = E.childItems.indexOf(this);
        if (C < 0) {
            return;
        }
        var B = E.getChildrenCount();
        for (C++; C < B; C++) {
            var D = E.getChildItem(C);
            if (D.isVisible()) {
                return D;
            }
        }
        return;
    }
    ;
    m.prototype.getPrevSibling = function() {
        var C = this.parentObject;
        if (!C) {
            return;
        }
        var B = C.childItems.indexOf(this);
        return B > 0 ? C.getChildItem(B - 1) : null;
    }
    ;
    m.prototype.getPrevVisibleSibling = function() {
        var D = this.parentObject;
        if (!D) {
            return;
        }
        var B = D.childItems.indexOf(this);
        if (B <= 0) {
            return;
        }
        for (B--; B >= 0; B--) {
            var C = D.getChildItem(B);
            if (C.isVisible()) {
                return C;
            }
        }
        return;
    }
    ;
    m.prototype.getNextVisibleItem = function(D) {
        var B;
        if ((D || this.isExpanded()) && this.getChildrenCount() > 0) {
            B = this.getFirstVisibleChild();
        }
        if (!B) {
            B = this.getNextVisibleSibling();
        }
        if (!B) {
            var C = this;
            while (C && C.parentObject) {
                C = C.parentObject;
                B = C.getNextVisibleSibling();
                if (B) {
                    break;
                }
            }
        }
        return B;
    }
    ;
    m.prototype.getPrevVisibleItem = function() {
        var B = this.getPrevVisibleSibling();
        if (!B) {
            return (this.parentObject && this.parentObject != this.owner.rootItem) ? this.getParentItem() : null;
        }
        while (B && B.isExpanded() && B.hasVisibleChildren()) {
            B = B.getLastVisibleChild();
        }
        return B;
    }
    ;
    m.prototype.isLastChild = function() {
        var B = this.parentObject;
        return B && B.getLastChild() == this;
    }
    ;
    m.prototype.isLastVisibleChild = function() {
        var B = this.parentObject;
        return this.isVisible() && B && B.getLastVisibleChild() == this;
    }
    ;
    m.prototype.isFirstChild = function() {
        var B = this.parentObject;
        return B && B.getFirstChild() == this;
    }
    ;
    m.prototype.isFirstVisibleChild = function() {
        var B = this.parentObject;
        return this.isVisible() && B && B.getFirstVisibleChild() == this;
    }
    ;
    m.prototype.openAllItems = function(C) {
        this.setExpanded(true);
        for (var B = 0; B < this.getChildrenCount(); B++) {
            var D = this.getChildItem(B);
            if (C) {
                D.openAllItems(true);
            } else {
                D.setExpanded(true);
            }
        }
    }
    ;
    m.prototype.closeAllItems = function(C) {
        if (this.owner.rootItem != this) {
            this.setExpanded(false);
        }
        for (var B = 0; B < this.getChildrenCount(); B++) {
            var D = this.getChildItem(B);
            if (C) {
                D.closeAllItems(true);
            } else {
                D.setExpanded(false);
            }
        }
    }
    ;
    m.prototype._getExpandImgIndex = function() {
        var C = this.owner;
        if (!C._treeLinesOn) {
            return 3;
        }
        var B = this.parentObject;
        if (!B) {
            return 4;
        }
        if (!B.hasMultiVisibleChildren()) {
            return (B == C.rootItem) ? 4 : 0;
        }
        if (this.isFirstVisibleChild()) {
            return (B == C.rootItem) ? 2 : 1;
        }
        if (this.isLastVisibleChild()) {
            return 0;
        }
        return 1;
    }
    ;
    m.prototype.getPosX = function() {
        var B = this.owner.treeDiv;
        return this.nodeTable.getBoundingClientRect().right - B.getBoundingClientRect().left + B.scrollLeft;
    }
    ;
    m.prototype.getPosY = function() {
        var B = this.owner.treeDiv;
        return this.nodeTable.getBoundingClientRect().top - B.getBoundingClientRect().top + B.scrollTop;
    }
    ;
    m.prototype.findItem = function(B) {
        for (var C = 0; C < this.getChildrenCount(); C++) {
            var D = this.getChildItem(C);
            if (D.getItemText() == B) {
                return D;
            }
        }
    }
    ;
    m.prototype.getVisibleWidth = function() {
        return this.nodeTable.offsetWidth + this.span.offsetWidth - this.span.parentNode.offsetWidth;
    }
    ;
    m.prototype.openParentItems = function() {
        var B = this.getParentItem();
        if (B && B != this.owner.rootItem) {
            B.openParentItems();
        }
        this.setExpanded(true);
    }
    ;
    m.prototype.ensureVisible = function() {
        var D = this.getParentItem();
        if (!D) {
            return;
        }
        D.openParentItems();
        var G = this.getPosY()
          , C = this.owner
          , F = C.basedom
          , E = F.scrollTop;
        if (G + 30 > C.getHeight() + E) {
            this.owner.setScrollTop(G);
        } else {
            if (G < E) {
                this.owner.setScrollTop(G);
            }
        }
        var B = EUI.getCurrentStyle(this.nodeTable.childNodes[0], "padding-left");
        B = EUI.toPixNumber(B);
        if (B > F.clientWidth - 19) {
            this.owner.setScrollLeft(B);
        } else {
            this.owner.setScrollLeft(0);
        }
    }
    ;
    m.prototype.showWaitingChildItem = function(B) {
        var C = this.getLastChild();
        if (C && C.__isloadingItem) {
            if (B) {
                C.setItemText(B);
            }
            return C;
        }
        C = this.appendChild(B ? B : I18N.getString("xui.ctrls.xtree.js.5", "正在装入..."));
        C.showWaitingImage(true);
        C.showCheckBox(false);
        C.__isloadingItem = true;
        return C;
    }
    ;
    m.prototype.getWaitingChildItem = function() {
        var B = this.getLastChild();
        if (B) {
            if (B.__isloadingItem) {
                B.__isloadingItem = false;
            } else {
                B = null;
            }
        }
        return B;
    }
    ;
    m.prototype.showWaitingImage = function(C) {
        if (this._waitingImageVisible == C) {
            return;
        }
        this._waitingImageVisible = C;
        var D = this.span.parentNode;
        if (C) {
            if (!this.getWaitingImage()) {
                var E = this.owner.doc;
                var B = D.appendChild(E.createElement("i"));
                B._waitingImage = true;
                B.className = "eui-icon " + (EUI.browser.isie ? "" : "eui-anim eui-anim-rotate eui-anim-loop");
                B.innerHTML = "&#xefa1;";
            }
        } else {
            var B = this.getWaitingImage();
            if (B) {
                D.removeChild(B);
            }
        }
    }
    ;
    m.prototype.getWaitingImage = function() {
        var B = EUI.getNextElementSibling(this.span);
        if (B && B._waitingImage) {
            return B;
        }
    }
    ;
    m.prototype.focus = function() {
        if (!this.owner) {
            return;
        }
        this.owner._focusItem = this;
        try {
            var B = this.owner.treeDiv.scrollLeft;
            var C = this.owner.treeDiv.scrollTop;
            if (y.isie) {
                if (B != this.owner.treeDiv.scrollLeft) {
                    this.owner.treeDiv.scrollLeft = B;
                }
                if (C != this.owner.treeDiv.scrollTop) {
                    this.owner.treeDiv.scrollTop = C;
                }
            } else {
                this.nodeTable.focus();
            }
        } catch (D) {}
    }
    ;
    m.prototype.setFocus = function(B) {
        if (!this._focusBind) {
            this._focusBind = this.focus.bind(this);
        }
        this.owner.wnd.setTimeout(this._focusBind, typeof (B) != "number" ? 0 : B);
    }
    ;
    m.prototype.isFocus = function() {
        return this.owner._focusItem == this;
    }
    ;
    m.prototype.selectSelf = function(D, E, C, F, B) {
        if (D) {
            this.owner.clearSelectedItems();
        }
        if (F) {
            this.focus();
        }
        if (C) {
            this.ensureVisible();
        }
        this.owner.selectItem(this, E, B);
    }
    ;
    m.prototype.getChildByUid = function(D) {
        var E;
        var B = this.getChildrenCount();
        for (var C = 0; C < B; C++) {
            E = this.getChildItem(C);
            if (D === E.uid) {
                return E;
            }
        }
    }
    ;
    m.prototype.__getMinusCls = function() {
        if (!this.owner._style) {
            return null;
        }
        return this.owner.__getSelectedTreeRowCls() != this.getTextDom().className ? this.owner._style.minusCls : this.owner._style.minusCls_hl;
    }
    ;
    m.prototype.__getPlusCls = function() {
        if (!this.owner._style) {
            return null;
        }
        return this.owner.__getSelectedTreeRowCls() != this.getTextDom().className ? this.owner._style.plusCls : this.owner._style.plusCls_hl;
    }
    ;
    function j(B) {
        this.xtree = B;
        this.isIncrementalLoadData = false;
        this.delayLoadXmlChildNodes = true;
        this.limitOnceLoadItemCount = 300;
        this.onitem = null;
        this._asyncLoadingCount = 0;
        this.init_xtree_onexpandevent();
        this.afterexpand = null;
    }
    j.prototype.init_xtree_onexpandevent = function() {
        if (this._onexpandevent_has_inited) {
            return;
        }
        this._onexpandevent_has_inited = true;
        var B = this;
        this.xtree.onexpand2 = this._xtree_onexpanded.bind(this);
    }
    ;
    j.prototype.dispose = function() {
        if (this._onexpandevent_has_inited) {
            this.xtree.onexpand2 = null;
            this._onexpandevent_has_inited = false;
            return;
        }
        this.onitem = null;
        this.xtree = null;
    }
    ;
    j.prototype._xtree_onexpanded = function(C) {
        if (!C._isLoaded) {
            var B = C._delay_load_node;
            if (B) {
                C._delay_load_node = null;
                this.loadXmlChildNodes(C, B, 0, C._isLoaded);
            } else {
                this.refreshTreeItem(C);
            }
        }
    }
    ;
    j.prototype._getItemChildren = function(B, C) {}
    ;
    j.prototype._getItemChildren_onfinish = function(C, B) {
        this.loadXmlChildNodes(C, B, 0, C._isLoaded);
        this.finishAsyncLoadItem(C);
    }
    ;
    j.prototype.refreshTreeItem = function(B, E, C) {
        if (!B) {
            B = this.xtree.getRootItem();
        }
        if (this.isItemAsyncLoading(B)) {
            if (E) {
                B.__onfinish_load = this._mergeFunc(B.__onfinish_load, E);
            }
            if (C) {
                this._on_finishloadallitems = this._mergeFunc(this._on_finishloadallitems, C);
            }
            return;
        }
        var D = this._getItemChildren_onfinish_bindthis;
        if (!D) {
            D = this._getItemChildren_onfinish.bind(this);
            this._getItemChildren_onfinish_bindthis = D;
        }
        if (C) {
            this._on_finishloadallitems = C;
        }
        if (!B._isLoaded) {
            B.showWaitingChildItem();
        }
        this.addAsyncLoadingItem(B);
        this._getItemChildren(B, D);
    }
    ;
    j.prototype._mergeFunc = function(C, B) {
        if (!C) {
            return B;
        }
        if (!B) {
            return C;
        }
        return function() {
            C.apply(null, arguments);
            C = null;
            B.apply(null, arguments);
            B = null;
        }
        ;
    }
    ;
    j.prototype.addAsyncLoadingItem = function(B, C) {
        B.__onfinish_load = C;
        B._asyncLoading = true;
        this._asyncLoadingCount++;
    }
    ;
    j.prototype.finishAsyncLoadItem = function(B) {
        B._asyncLoading = false;
        if (B.__onfinish_load) {
            var C = B.__onfinish_load;
            B.__onfinish_load = null;
            C(B);
        }
        if (B.__auto_expanded_level) {
            var D = B.__auto_expanded_level;
            B.__auto_expanded_level = null;
            this.openTreeItemChildren(B, D - 1);
        }
        if (--this._asyncLoadingCount == 0 && this._on_finishloadallitems) {
            var C = this._on_finishloadallitems;
            this._on_finishloadallitems = null;
            C(B);
        }
    }
    ;
    j.prototype.isItemAsyncLoading = function(B) {
        return B._asyncLoading;
    }
    ;
    j.prototype.openTreeItem = function(B, C, D) {
        if (B == this.xtree.getRootItem()) {
            this._xtree_onexpanded(B);
        } else {
            B.setExpanded(true);
        }
        if (D >= 1) {
            if (C) {
                this._on_finishloadallitems = this._mergeFunc(this._on_finishloadallitems, C.bind(null, B));
            }
            if (!B._asyncLoading) {
                this.openTreeItemChildren(B, D - 1);
            } else {
                B.__auto_expanded_level = D;
            }
            return;
        }
        if (C) {
            if (!B._asyncLoading) {
                C(B);
            } else {
                B.__onfinish_load = this._mergeFunc(B.__onfinish_load, C);
            }
        }
    }
    ;
    j.prototype.setNodeFilter = function(B) {
        this.filter = B;
    }
    ;
    j.prototype.openTreeItemChildren = function(C, E) {
        for (var B = 0; B < C.getChildrenCount(); B++) {
            var D = C.getChildItem(B);
            if (D.hasChildren()) {
                this.openTreeItem(D, null, E);
            }
        }
    }
    ;
    j.prototype.openTreeItems = function(C, D) {
        if (!C || C.length == 0) {
            throw new Error(I18N.getString("xui.ctrls.xtree.js.6", "必须传递有效的参数itemids"));
        }
        var B = this.xtree.getRootItem();
        this.openTreeItems1(C, D, B, 0);
    }
    ;
    j.prototype.openTreeItems1 = function(D, E, F, C) {
        var B = this;
        this.openTreeItem(F, function(H) {
            var J = H.getChildByUid(D[C]);
            if (J) {
                if (C >= D.length - 1) {
                    J.selectSelf(true, false, true, true);
                    if (E) {
                        E(J);
                    }
                    return;
                } else {
                    if (J) {
                        J.ensureVisible();
                    }
                    B.openTreeItems1(D, E, J, C + 1);
                }
            } else {
                var G = H.getLastChild();
                if (G && G._ismorenode) {
                    G.ondblclick = null;
                    G._ismorenode = undefined;
                    var I = G.getParentItem();
                    G.remove();
                    B.loadXmlChildNodes(I, G._xmlnode, G._fromi, false);
                    B.openTreeItems1(D, E, F, C);
                } else {
                    if (E) {
                        E(H, D, C, E);
                    }
                }
            }
        });
    }
    ;
    j.prototype._onLoadATreeItem = function(B, D) {
        var C = this.onitem;
        if (C) {
            C(B, D);
        }
    }
    ;
    j.prototype._getXmlNodeAtrribute = function(F, B) {
        if (B) {
            return F.getAttribute(B);
        } else {
            var D = []
              , C = F.attributes;
            for (var E = 0; E < C.length; E++) {
                D.push(C[E]["name"]);
            }
            return D;
        }
    }
    ;
    j.prototype._getXmlNodeDoc = function(B) {
        return B.documentElement || B;
    }
    ;
    j.prototype._getXmlDomNodes = function(B) {
        return B ? B.childNodes : [];
    }
    ;
    j.prototype._isXmlElem = function(B) {
        return B.nodeType == 1;
    }
    ;
    j.prototype._getXmlNodeChilds = function(B) {
        return B ? B.childNodes : [];
    }
    ;
    j.prototype.loadXmlChildNodes = function(N, ac, E, I) {
        ac = this._getXmlNodeDoc(ac);
        N._isLoaded = true;
        var T = N.getWaitingChildItem();
        if (!ac || this._getXmlDomNodes(ac).length == 0) {
            N.showWaitingImage(false);
            if (I) {
                N.clearChildren();
                N._isLoaded = true;
                N._addNullItem(null);
            } else {
                N._addNullItem(T);
            }
            return;
        }
        var G = this._onLoadATreeItem;
        var D = this.delayLoadXmlChildNodes;
        var ab = this.limitOnceLoadItemCount ? this.limitOnceLoadItemCount : 0;
        E = E ? E : 0;
        var F;
        var J;
        var B = I ? (N.childItems ? N.childItems.slice(0) : []) : null;
        var O = this._getXmlDomNodes(ac);
        var C = O.length;
        if (ab > 0 && E == 0 && I && ab <= N.getChildrenCount()) {
            ab = N.getChildrenCount();
            if (N.getLastChild()._ismorenode) {
                ab--;
            }
        }
        var R = E;
        var V = 0;
        var Q = 0;
        var M = N.owner;
        var ag = M._enableCheckBox;
        var aa = M._autoCheckSubItems && N.checkstate == 1 ? 1 : 0;
        for (; R < C; R++) {
            var P = O[R];
            if (!this._isXmlElem(P) && !EUI.isPlainObject(P)) {
                continue;
            }
            if (this.filter && typeof (this.filter) == "function" && this.filter(P)) {
                if ((R == C - 1) && T) {
                    T.remove();
                }
                continue;
            }
            var Z = this._getXmlNodeAtrribute(P, "caption") || this._getXmlNodeAtrribute(P, "name");
            var af = this._getXmlNodeAtrribute(P, "img0");
            var ae = this._getXmlNodeAtrribute(P, "img1");
            var ad = this._getXmlNodeAtrribute(P, "img2");
            var L = EUI.parseBool(this._getXmlNodeAtrribute(P, "haschild"), this._getXmlNodeChilds(P).length > 0);
            if (I) {
                F = this.loadXmlChildNodes_fetchExistsNode(N, B, P, Z, L, J);
            } else {
                if (T) {
                    F = T;
                    T = null;
                    F.setItemText(Z);
                    F.showWaitingImage(false);
                } else {
                    F = N.appendChild(Z);
                }
            }
            if (af || ae || ad) {
                F.setItemImage(af, ae, ad);
            }
            F.setHasChildren(L);
            F.showCheckBox(ag);
            if (ag) {
                F.setSelfChecked(aa);
            }
            F.setUserObj(P);
            var H = this._getXmlNodeAtrribute(P)
              , K = null
              , Y = null
              , S = ["caption", "name", "img0", "img1", "img2", "haschild"];
            for (var W = 0, X = H.length; W < X; W++) {
                Y = H[W];
                if (S.indexOf(Y) != -1) {
                    continue;
                }
                F[Y] = this._getXmlNodeAtrribute(P, Y);
            }
            if (L) {
                this.loadXmlChildNodes_SubXmlNodeChildren(F, P, I);
            }
            G.call(this, F, P);
            J = F;
            V++;
            if (ab > 0 && V >= ab) {
                for (var U = R + 1; U < C; U++) {
                    if (O[U].nodeType == 1 || EUI.isPlainObject(O[U])) {
                        Q++;
                    }
                }
                if (Q < 3) {
                    ab = 0;
                    Q = 0;
                } else {
                    break;
                }
            }
        }
        if (Q > 0) {
            this.loadXmlChildNodes_addMoreNode(N, ac, R + 1, Q);
        }
        if (B && B.length > 0) {
            var X = B.length;
            for (var W = 0; W < X; W++) {
                B[W].remove();
            }
        }
        if (this._getXmlNodeAtrribute(ac, "expand") === "false") {
            N.setExpanded(false);
        }
        N.showWaitingImage(false);
        if (this.afterexpand) {
            this.afterexpand(N, ac, this);
        }
    }
    ;
    j.prototype.loadXmlChildNodes_addMoreNode = function(G, E, C, B) {
        var D = G.appendChild(I18N.getString("xui.ctrls.xtree.js.7", "更多({0})...", [B]));
        D.showCheckBox(false);
        var F = this;
        D._ismorenode = true;
        D._fromi = C;
        D._xmlnode = E;
        if (!y.isIpad) {
            D.ondblclick = function(H) {
                H.ondblclick = null;
                H._ismorenode = undefined;
                var I = H.getParentItem();
                H.remove();
                F.loadXmlChildNodes(I, E, C, false);
            }
            ;
        } else {
            D._onclick_texticon = function(H) {
                H._onclick_texticon = null;
                H._ismorenode = undefined;
                var I = H.getParentItem();
                H.remove();
                F.loadXmlChildNodes(I, E, C, false);
            }
            ;
        }
    }
    ;
    j.prototype.loadXmlChildNodes_SubXmlNodeChildren = function(D, B, C) {
        if (this.isIncrementalLoadData) {
            if (D._isLoaded) {
                this.refreshTreeItem(D);
            }
            return;
        }
        if (this.delayLoadXmlChildNodes && !D._isLoaded) {
            D._isLoaded = false;
            D._delay_load_node = B;
        } else {
            this.loadXmlChildNodes(D, B, 0, C);
        }
    }
    ;
    j.prototype._findTreeItem4XmlNode = function(F, G) {
        var E;
        var B = F.length;
        var D = this._getXmlNodeAtrribute(G, "uid");
        for (var C = 0; C < B; C++) {
            E = F[C];
            if (D === E.uid) {
                F.splice(C, 1);
                return E;
            }
        }
    }
    ;
    j.prototype.loadXmlChildNodes_fetchExistsNode = function(H, F, G, C, B, E) {
        var D = this._findTreeItem4XmlNode(F, G);
        if (D) {
            D.setItemText(C);
            if (!B) {
                D.clearChildren();
                if (D.isExpanded()) {
                    D.setExpanded(false);
                }
            }
            if (E) {
                if (E.getRowIndexInParent() > D.getRowIndexInParent()) {
                    D.moveToAfter(E);
                }
            } else {
                D.moveToBefore(D.parentObject.getFirstChild());
            }
        } else {
            D = H.insertChild(C, E || H.getFirstChild(), E != null);
        }
        return D;
    }
    ;
    function g(B) {
        h.call(this, B);
        this.treeDiv.className = "accordionXtree_bg";
        this.rootItem.nodeTable.className = "accordionXtree";
        this.setStyle(1);
        this.setRootChilderOnlyExpandedOne(true);
    }
    EUI.extendClass(g, h, "AccordionETree");
    g.prototype.dispose = function() {
        if (this.owner._bar) {
            this.owner._bar.owner = null;
            this.owner._bar = null;
        }
        h.prototype.dispose.call(this);
    }
    ;
    g.prototype.__createXTreeItem = function(B, D, C) {
        return new AccordionXTreeItem({
            itemText: B,
            parentObject: D,
            ownerTree: C
        });
    }
    ;
    g.prototype.__getStandartTreeRowCls = function() {
        return "accordionXtree_standartTreeRow";
    }
    ;
    g.prototype.__getSelectedTreeRowCls = function() {
        return "accordionXtree_selectedTreeRow";
    }
    ;
    g.prototype._createSelf = function() {
        h.prototype._createSelf.call(this);
        if (!this._bar) {
            this._bar = this.treeDiv.appendChild(this.doc.createElement("div"));
        }
        this._bar.className = "accordionXtree_selectedTreeRowBg";
    }
    ;
    function a(B) {
        m.call(this, B["itemText"], B["parentObject"], B["ownerTree"]);
    }
    EUI.extendClass(a, m, "AccordionETreeItem");
    a.prototype.appendChild = function(C) {
        var B = m.prototype.appendChild.call(this, C);
        if (B.getParentItem() == B.owner.getRootItem()) {
            B._ignoreSelectedTreeRow = true;
            B.row.className = B.owner.getRootItem().getChildItem(0) == B ? "accordionXtree_rootFirst_bg" : "accordionXtree_rootNext_bg";
        }
        return B;
    }
    ;
    a.prototype.setHighlight = function(E) {
        if (!this.owner) {
            return;
        }
        var B = E && !this._ignoreSelectedTreeRow ? this.owner.__getSelectedTreeRowCls() : this.owner.__getStandartTreeRowCls();
        if (this.getTextDom().className != B) {
            this.getTextDom().className = B;
        }
        this.owner._bar.owner = this;
        var C = EUI.getAbsScrollPosition(this.getTextDom());
        var D = (E ? (EUI.getRealTop(this.getTextDom()) - EUI.getRealTop(this.owner.parentElement)) + C.y : "-9999") + "px";
        if (this.owner._bar.style.top != D) {
            this.owner._bar.style.top = D;
        }
    }
    ;
    a.prototype._onclick_texticon = function(B, C) {
        if (this.hasChildren()) {
            this.toggleExpand();
        }
        if (new RegExp("^(accordionXtree_root)").test(this.row.className)) {
            return;
        }
        m.prototype._onclick_texticon.call(this, B, C);
    }
    ;
    a.prototype.__getMinusCls = function() {
        if (this.getParentItem() == this.owner.getRootItem()) {
            return m.prototype.__getMinusCls.call(this);
        }
        return ["xtree_arrow_minus2", "xtree_arrow_minus2", "xtree_arrow_minus2", "xtree_arrow_minus2", "xtree_arrow_minus2"];
    }
    ;
    return {
        ETree: h,
        ETreeItem: m,
        ETreeXmlLoader: j,
        AccordionETree: g,
        AccordionETreeItem: a
    };
});
