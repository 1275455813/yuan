define(["eui/modules/uibase", "eui/modules/elist", "eui/modules/eform", "eui/modules/ecombobox", "eui/modules/efloathint"], function(t, j, q, k, g) {
    var u = t.CtrlResize, p = t.EComponent, r = j.EListBox, v, z = g.EFloatHint, q = q.eform, E = EUI.browser, F = "EUI$Dialog", h = 1, a = 0, m = EUI.getRootWindow();
    function n(H) {
        H = H || {};
        p.call(this, H);
        this._initEDialog(H);
    }
    EUI.extendClass(n, p, "EDialog");
    n.prototype.dispose = function() {
        if (this.isVisible()) {
            this.close();
        }
        if (this._ctrlresize) {
            this._ctrlresize.dispose();
            this._ctrlresize = null;
        }
        this._owner = null;
        this._contentIframe = null;
        this.unBindEvent();
        this.onclose = null;
        this.onopen = null;
        this.ondblclick = null;
        this.onmax = null;
        this.onresizing = null;
        this.onresized = null;
        n._superClass.prototype.dispose.call(this);
    }
    ;
    n.prototype.isEDialog = true;
    n.prototype._initEDialog = function(K) {
        var I = []
          , L = K
          , N = this.doc.createElement("div");
        N.id = EUI.idRandom(F);
        this.basedom = N;
        N.className = "eui-dialog-container " + (EUI.browser.isMobile ? "eui-mobile " : "") + (EUI.browser.isie ? "" : "eui-anim eui-anim-scale ") + " eui-panel-hide " + (K.baseCss ? K.baseCss : "");
        N.style.cssText += ";width: " + L.width + "px; height: " + L.height + "px;";
        I.push('<div class="eui-dialog-header"></div>');
        I.push('<div class="eui-dialog-body"></div>');
        I.push('<div class="eui-dialog-footer"></div>');
        N.innerHTML = I.join("");
        this.parentElement.appendChild(N);
        var J = N.childNodes
          , H = J[0];
        this.options = {
            _windom: N,
            _winHeader: H,
            _winBody: J[1],
            _winFooter: J[2],
            isVisible: false,
            canResizable: true
        };
        this.onclose = L.onclose;
        this.onopen = L.onopen;
        this.ondblclick = L.ondblclick;
        this.onmax = L.onmax;
        this.onresizing = L.onresizing;
        this.onresized = L.onresized;
        this._initSize();
        var M = H.appendChild(this.doc.createElement("span"));
        this.options.captionNode = M;
        this.addHeadButton("关闭", "eui-icon-close", this.close.bind(this));
        this.addHeadButton("最大化", "eui-icon-max", this.maxBtnHandle.bind(this));
        this.setCaption(L.caption);
        this.setVisible(false);
        this.setCanResizable(EUI.parseBool(L.canResizable, true));
        this.isenabled = true;
        this.bindEvent();
    }
    ;
    n.prototype._initSize = function() {
        var I = this.options
          , H = this;
        this._ctrlresize = new u({
            wnd: this.wnd,
            node: I._windom,
            moveHandle: I._winHeader,
            enableresize: I.canResizable,
            enablemove: true,
            onresizing: function(M, L, N, J, K) {
                if (!H.movestar) {
                    EUI.showDisablePane(H.options._windom, true, true);
                    H.movestar = true;
                }
                H.resize(J, K);
                if (EUI.isFunction(H.onresizing)) {
                    H.onresizing(H, M, L, N, J, K);
                }
            },
            onresized: function(M, L, N, J, K) {
                if (H.movestar) {
                    EUI.showDisablePane(H.options._windom, false, true);
                    H.movestar = false;
                }
                if (EUI.isFunction(H.onresized)) {
                    H.onresized(H, M, L, N, J, K);
                }
            },
            onmoving: function() {
                if (!H.movestar) {
                    EUI.showDisablePane(H.options._windom, true, true);
                    H.movestar = true;
                }
                H._adjustBackgroundIframe();
            },
            onmoved: function() {
                if (H.movestar) {
                    EUI.showDisablePane(H.options._windom, false, true);
                    H.movestar = false;
                }
            }
        });
    }
    ;
    n.prototype.addHeadButton = function(M, K, J) {
        var I = this.options
          , H = I._winHeader;
        var L = this.doc.createElement("i");
        L.className = "eui-icon " + K;
        L.title = M;
        L.setAttribute("nomove", "true");
        $(L).data("handle", J);
        H.appendChild(L);
        if (!I.headBtns) {
            I.headBtns = [];
        }
        I.headBtns.push(L);
        return L;
    }
    ;
    n.prototype.addButton = function(Q, O, P, K, N) {
        var H = this.options
          , M = H._winFooter;
        var L = this.doc.createElement("button");
        L.type = "button";
        L.className = "eui-btn eui-btn-m " + (P ? "eui-float-left " : "") + (K ? "eui-btn-primary " : "");
        $(L).data("handle", N);
        if (O) {
            var J = this.doc.createElement("i");
            if ((O || "").startsWith("eui-") !== -1) {
                J.className = "eui-icon " + O;
            } else {
                J.className = "eui-icon";
                EUI.setTagIcon(J, O);
            }
            L.appendChild(J);
        }
        if (Q) {
            var I = this.doc.createElement("span");
            I.innerHTML = Q;
            L.appendChild(I);
            L._span = I;
        }
        M.appendChild(L);
        if (!H.footBtns) {
            H.footBtns = [];
        }
        H.footBtns.push(L);
        return L;
    }
    ;
    n.prototype.setButtonArrow = function(I, J) {
        var H = I.arrowDom;
        if (!H) {
            H = I.arrowDom = this.doc.createElement("i");
            H.className = "eui-icon eui-icon-arrow2";
            I.appendChild(H);
            EUI.addClassName(I, "eui-btn-menu");
        }
        if (J === "up") {
            EUI.removeClassName(H, "eui-icon-arrow3");
        } else {
            EUI.addClassName(H, "eui-icon-arrow3");
        }
    }
    ;
    n.prototype.removeButton = function(I) {
        var J = this.options
          , H = J._winFooter
          , K = J.footBtns;
        if (K) {
            var L = K.splice(I, 1);
            H.removeChild(L[0]);
        }
    }
    ;
    n.prototype.getButton = function(H) {
        return this.options.footBtns[H];
    }
    ;
    n.prototype.getButtonIndex = function(H) {
        if (H == null) {
            return -1;
        }
        var I = this.options.footBtns;
        if (EUI.isString(H)) {
            return I.findIndex(function(J) {
                return EUI.getTextContent(J) === H;
            });
        } else {
            if (!EUI.isNumber(H)) {
                return I.indexOf(H);
            }
        }
        return I[H] ? H : -1;
    }
    ;
    n.prototype.setHeadButtonVisible = function(H, I) {
        H = EUI.parseBool(H, false);
        this._setButtonVisible(this.options.headBtns, H, I);
    }
    ;
    n.prototype.setButtonVisible = function(H, I) {
        H = EUI.parseBool(H, false);
        this._setButtonVisible(this.options.footBtns, H, I);
    }
    ;
    n.prototype.setButtonCaption = function(H, I) {
        var J = this.options.footBtns[I];
        if (J) {
            J._span.innerHTML = H;
            J.setAttribute("title", H);
        }
    }
    ;
    n.prototype.getButtonCaption = function(H) {
        var I = this.options.footBtns[H];
        if (I) {
            return I._span.innerText;
        }
        return "";
    }
    ;
    n.prototype.setButtonEvent = function(J, H) {
        var I = this.options.footBtns[H];
        if (I) {
            $(I).data("handle", J);
        }
    }
    ;
    n.prototype.showClose = function() {
        this.setCloseButtonVisible(true);
    }
    ;
    n.prototype.hideClose = function() {
        this.setCloseButtonVisible(false);
    }
    ;
    n.prototype.setCloseButtonVisible = function(H) {
        this.setHeadButtonVisible(H, a);
    }
    ;
    n.prototype.isCloseButtonVisible = function(H) {
        var I = this.options.headBtns;
        return I[a].style.display !== "none";
    }
    ;
    n.prototype.setMaxButtonVisible = function(H) {
        this.setHeadButtonVisible(H, h);
    }
    ;
    n.prototype.isMaxButtonVisible = function(H) {
        var I = this.options.headBtns;
        return I[h].style.display !== "none";
    }
    ;
    n.prototype.__changeMaxBtnInfo = function(J) {
        var L = this.options.headBtns
          , H = L[h];
        if (!H) {
            return;
        }
        var I, K;
        if (J) {
            I = "eui-icon eui-icon-min";
            K = "向下还原";
        } else {
            I = "eui-icon eui-icon-max";
            K = "最大化";
        }
        H.className = I;
        H.setAttribute("title", K);
    }
    ;
    n.prototype._setButtonVisible = function(J, H, I) {
        var K;
        if (EUI.isNumber(I)) {
            if (!J) {
                return;
            }
            K = J[I];
        } else {
            if (I.tagName === "BUTTON") {
                K = I;
            }
        }
        if (K) {
            K.style.display = H ? "" : "none";
        }
    }
    ;
    n.prototype.getHeadDom = function() {
        return this.options._winHeader;
    }
    ;
    n.prototype.setHeadVisible = function(I) {
        I = EUI.parseBool(I, true);
        var H = this.options;
        H._winHeader.style.display = I ? "" : "none";
        H._winBody.style.top = I ? "" : "0px";
    }
    ;
    n.prototype.showHead = function() {
        this.setHeadVisible(true);
    }
    ;
    n.prototype.hideHead = function() {
        this.setHeadVisible(false);
    }
    ;
    n.prototype.getFootDom = function() {
        return this.options._winFooter;
    }
    ;
    n.prototype.setBottomVisible = function(I) {
        I = EUI.parseBool(I, true);
        var H = this.options;
        H._winFooter.style.display = I ? "" : "none";
        H._winBody.style.bottom = I ? "" : "0px";
    }
    ;
    n.prototype.showBottom = function() {
        this.setBottomVisible(true);
    }
    ;
    n.prototype.hideBottom = function() {
        this.setBottomVisible(false);
    }
    ;
    n.prototype.bindEvent = function() {
        var J = this.options
          , I = J._winHeader
          , H = J._winFooter;
        this._onHeaderClickBind = this._onHeaderClick.bind(this);
        this._onHeaderDblclickBind = this._onHeaderDblclick.bind(this);
        this._onFooterClickBind = this._onFooterClick.bind(this);
        EUI.addEvent(I, "click", this._onHeaderClickBind);
        EUI.addEvent(I, "dblclick", this._onHeaderDblclickBind);
        EUI.addEvent(H, "click", this._onFooterClickBind);
    }
    ;
    n.prototype.unBindEvent = function() {
        var J = this.options
          , I = J._winHeader
          , H = J._winFooter;
        EUI.removeEvent(I, "click", this._onHeaderClickBind);
        this._onHeaderClickBind = null;
        EUI.removeEvent(I, "dblclick", this._onHeaderDblclickBind);
        this._onHeaderDblclickBind = null;
        EUI.removeEvent(H, "click", this._onFooterClickBind);
        this._onFooterClickBind = null;
    }
    ;
    n.prototype._onHeaderClick = function(L) {
        L = L || this.wnd.event;
        var K = L.srcElememnt || L.target
          , H = K.tagName
          , I = 0;
        while (H !== "DIV" && I <= 3) {
            if (K.tagName === "BUTTON") {
                break;
            }
            if (K.tagName === "I" && K.parentNode.tagName !== "BUTTON") {
                break;
            }
            I++;
            K = K.parentNode;
            H = K.tagName;
        }
        if (H === "I" || H === "BUTTON") {
            var J = $(K).data("handle");
            if (EUI.isFunction(J)) {
                J(this, K, L);
            }
        }
    }
    ;
    n.prototype._onHeaderDblclick = function(I) {
        if (!this.isMaxButtonVisible()) {
            return;
        }
        var H = this.maxBtnHandle();
        if (EUI.isFunction(this.ondblclick)) {
            this.ondblclick(this, H);
        }
    }
    ;
    n.prototype._onFooterClick = function(H) {
        H = H || this.wnd.event;
        this._onHeaderClick(H);
    }
    ;
    n.prototype.maxBtnHandle = function() {
        var H;
        if (this.options.maxInfo) {
            this.max2Normal();
            H = false;
        } else {
            this.normal2Max();
            H = true;
        }
        return H;
    }
    ;
    n.prototype.normal2Max = function() {
        var I = this.options
          , J = I._windom
          , H = J.style
          , K = I.maxInfo;
        if (K) {
            return;
        }
        this.__changeMaxBtnInfo(true);
        I.maxInfo = {
            left: H.left,
            top: H.top,
            width: H.width || (J.offsetWidth + "px"),
            height: H.height || (J.offsetHeight + "px")
        };
        H.cssText += ";left:0px;top:0px;width:100%;height:100%;";
        if (EUI.isFunction(this.onmax)) {
            this.onmax(this, true);
        }
        this._adjustBackgroundIframe();
    }
    ;
    n.prototype.max2Normal = function() {
        var H = this.options
          , I = H.maxInfo;
        if (!I) {
            return;
        }
        this.__changeMaxBtnInfo(false);
        H.maxInfo = undefined;
        H._windom.style.cssText += ";left:" + I.left + ";top:" + I.top + ";width:" + I.width + ";height:" + I.height + ";";
        if (!I.width) {
            H._windom.style.width = "";
        }
        if (EUI.isFunction(this.onmax)) {
            this.onmax(this, false);
        }
        this._adjustBackgroundIframe();
    }
    ;
    n.prototype.getBaseDom = function() {
        return this.options._windom;
    }
    ;
    n.prototype.getContent = function() {
        return this.options._winBody;
    }
    ;
    n.prototype.setContentIFrameUrl = function(J, L) {
        var K = this.getContent()
          , H = this._contentIframe;
        if (!H) {
            H = this._contentIframe = this.doc.createElement("iframe");
            H.width = "100%";
            H.setAttribute("frameborder", "0", 0);
            H.border = "0";
            H.marginWidth = "0";
            H.marginHeight = "0";
            H.scrolling = "auto";
            H.allowTransparency = "false";
            K.appendChild(this._contentIframe);
            K.style.cssText += ";padding-bottom: 2px;overflow: hidden;";
        }
        H.height = "0";
        var I = this;
        if (!this.getCaption() && !L) {
            L = function(M) {
                try {
                    I.setCaption(M.contentWindow.document.title);
                } catch (N) {}
            }
            ;
        }
        if (H.attachEvent) {
            H.onreadystatechange = function(M) {
                if (this.readyState == "complete") {
                    H.height = "100%";
                    EUI.isFunction(L) && L(H);
                    H.onreadystatechange = null;
                }
            }
            ;
        } else {
            H.onload = function() {
                H.height = "100%";
                EUI.isFunction(L) && L(H);
                H.onload = null;
            }
            ;
        }
        H.src = J;
    }
    ;
    n.prototype.setIcon = function(H) {}
    ;
    n.prototype.setCaption = function(H) {
        var I = this.options
          , J = I.captionNode;
        J.innerHTML = H || "";
        I.caption = H;
    }
    ;
    n.prototype.getCaption = function() {
        return this.options.caption;
    }
    ;
    n.prototype.moveTo = function(H, I) {
        var J = this.doc.body;
        if (!EUI.isNumber(H) || isNaN(H)) {
            H = J.scrollLeft + ((this._pcw || (this._pcw = J.clientWidth)) - this.getWidth()) / 2;
        }
        if (!EUI.isNumber(I) || isNaN(I)) {
            I = J.scrollTop + ((this._pch || (this._pch = J.clientHeight)) - this.getHeight()) / 2;
        }
        if (this.getLeft() != H) {
            this.setLeft(H);
        }
        if (this.getTop() != I) {
            this.setTop(I);
        }
        this._adjustBackgroundIframe();
    }
    ;
    n.prototype.setVisible = function(J) {
        var H = this.options
          , I = H._windom;
        J = EUI.parseBool(J, false);
        if (H.isVisible === J) {
            return;
        }
        H.isVisible = J;
        if (J) {
            this.mgrLayer("show");
            EUI.removeClassName(I, "eui-panel-hide");
            if (!EUI.browser.isie) {
                EUI.addClassName(I, "eui-anim-scale");
            }
        } else {
            this.max2Normal();
            this.mgrLayer();
            EUI.addClassName(I, "eui-panel-hide");
            if (!EUI.browser.isie) {
                EUI.removeClassName(I, "eui-anim-scale");
            }
            !this.isEnabled() && this.setEnabled(true);
        }
        this._adjustBackgroundIframe();
    }
    ;
    n.prototype.setBaseCss = function(H) {
        if (!H) {
            return;
        }
        EUI.addClassName(this.options._windom, H);
    }
    ;
    n.prototype.isVisible = function() {
        return this.options.isVisible;
    }
    ;
    n.prototype._adjustBackgroundIframe = function() {
        if (!E.isie) {
            return;
        }
        EUI.TimeoutQueue.add(EUI.showBackGroundIFrame, {
            unique: true,
            context: this,
            args: [this.options._windom, this.isVisible(), 1]
        });
    }
    ;
    n.prototype.setWidth = function(H) {
        if (EUI.isNumber(H)) {
            this.options._windom.style.width = H + "px";
            if (arguments[1] !== true) {
                this._adjustBackgroundIframe();
            }
        }
    }
    ;
    n.prototype.getWidth = function() {
        return this.options._windom.offsetWidth;
    }
    ;
    n.prototype.setHeight = function(H) {
        if (EUI.isNumber(H)) {
            this.options._windom.style.height = H + "px";
            if (arguments[1] !== true) {
                this._adjustBackgroundIframe();
            }
        }
    }
    ;
    n.prototype.getHeight = function() {
        return this.options._windom.offsetHeight;
    }
    ;
    n.prototype.setLeft = function(H) {
        if (EUI.isNumber(H)) {
            this.options._windom.style.left = H + "px";
            if (arguments[1] !== true) {
                this._adjustBackgroundIframe();
            }
        }
    }
    ;
    n.prototype.getLeft = function() {
        return this.options._windom.offsetLeft;
    }
    ;
    n.prototype.setTop = function(H) {
        if (EUI.isNumber(H)) {
            this.options._windom.style.top = H + "px";
            if (arguments[1] !== true) {
                this._adjustBackgroundIframe();
            }
        }
    }
    ;
    n.prototype.getTop = function() {
        return this.options._windom.offsetTop;
    }
    ;
    n.prototype.setCanResizable = function(I) {
        I = EUI.parseBool(I, true);
        var H = this.options.canResizable;
        if (I === H) {
            return;
        }
        this.options.canResizable = I;
        this.setHeadButtonVisible(I, h);
        if (this._ctrlresize) {
            this._ctrlresize.setEnableResize(I);
        }
    }
    ;
    n.prototype.resize = function(H, I, J) {
        if (!J && !this.options.canResizable) {
            return;
        }
        this.setWidth(H, true);
        this.setHeight(I, true);
        this._adjustBackgroundIframe();
    }
    ;
    n.prototype.setBounds = function(H, K, I, J) {
        this.moveTo(H, K);
        this.resize(I, J);
    }
    ;
    n.prototype.fireResizing = function() {
        if (typeof (this.onresizing) == "function") {
            this.onresizing(this, this.options._windom, this.getLeft(), this.getTop(), this.getWidth(), this.getHeight());
        }
    }
    ;
    n.prototype.fireResized = function() {
        if (typeof (this.onresized) == "function") {
            this.onresized(this, this.options._windom, this.getLeft(), this.getTop(), this.getWidth(), this.getHeight());
        }
    }
    ;
    n.prototype.close = function() {
        if (this._owner) {
            this._owner.setEnabled(true);
            this._owner = null;
        }
        if (this._isModel) {
            EUI.showDisablePane(this.doc.body, false, "#FFFFFF");
            this._isModel = false;
        }
        this.setVisible(false);
        if (EUI.isFunction(this.onclose) && this.onclose(this) === false) {
            return;
        }
        this.setLayer();
    }
    ;
    n.prototype.open = function(M, I, K, H) {
        if (M && M.isEDialog) {
            var J = M;
            this._owner = J;
            J.setEnabled(false);
            I = Math.abs((J.getLeft() + (J.getWidth() / 2)) - (this.getWidth() / 2));
            K = Math.abs((J.getTop() + (J.getHeight() / 2)) - (this.getHeight() / 2));
        }
        var L = this.getBaseDom();
        if (EUI.isBoolean(M)) {
            if (M && !this._isModel) {
                EUI.showDisablePane(this.doc.body, true, H);
            }
            this._isModel = M;
            M ? EUI.removeClassName(L, "eui-dialog-shadow") : EUI.addClassName(L, "eui-dialog-shadow");
        }
        this.setVisible(true);
        this.moveTo(I, K);
        if (EUI.isFunction(this.onopen)) {
            this.onopen(this);
        }
    }
    ;
    n.prototype.isModel = function() {
        return !!this._isModel;
    }
    ;
    n.prototype.setEnabled = function(H) {
        H = EUI.parseBool(H, true);
        this.isenabled = H;
        EUI.showDisablePane(this.options._windom, !H, true);
    }
    ;
    n.prototype.isEnabled = function() {
        return this.isenabled;
    }
    ;
    n.prototype.show = function(H, I) {
        this.open(false, H, I);
    }
    ;
    n.prototype.showModal = function(H, I) {
        this.open(true, H, I);
    }
    ;
    n.prototype.setOnClose = function(H) {
        this.onclose = H;
    }
    ;
    n.prototype.setOnOpen = function(H) {
        this.onopen = H;
    }
    ;
    n.prototype.setOnDblClick = function(H) {
        this.ondblclick = H;
    }
    ;
    n.prototype.setOnMax = function(H) {
        this.onmax = H;
    }
    ;
    n.prototype.setOnResizing = function(H) {
        this.onresizing = H;
    }
    ;
    n.prototype.setOnResized = function(H) {
        this.onresized = H;
    }
    ;
    function b(H) {
        n.call(this, {
            caption: I18N.getString("xui.ctrls.EDialog.js.4", "提示"),
            width: 400,
            height: 200
        });
        this.setMaxButtonVisible(false);
        this.__ex = H;
        this._msg = I18N.getString("xui.ctrls.EDialog.js.unauthorizederror", "您没有权限或者登录超时。请重新登录!");
        this._initEShowHttpError();
    }
    EUI.extendClass(b, n, "EShowHttpError");
    b.prototype.dispose = function() {
        $(this.getContent()).unbind("keydown.eshowhttperror contextmenu.eshowhttperror");
        this.msgcell = null;
        this.__ex = null;
        n.prototype.dispose.call(this);
    }
    ;
    b.prototype._initEShowHttpError = function() {
        var I = []
          , J = this.getContent()
          , H = this;
        I.push('<div class="eui-layout-container eui-padding-top-15 eui-padding-left-15 eui-scroll-auto">');
        I.push('<div class="eui-row">');
        I.push('<div style=";width:65px;display:inline-block;">');
        I.push('<i title="提示图标" class="eui-icon eui-icon-xl eui-icon-primary">&#xe0cd;</i>');
        I.push("</div>");
        I.push('<div class="eui-padding-top-10 eui-breakword" id="msgcell" style="position:absolute;display:inline-block;left:65px;right:0;top:16px;"></div>');
        I.push("</div>");
        I.push("</div>");
        J.innerHTML = I.join("");
        this.msgcell = $(J).find("#msgcell")[0];
        this.addButton(I18N.getString("xui.ctrls.EDialog.js.relogin", "重新登录"), null, false, true, function() {
            m.location.reload();
        });
        this.addButton(I18N.getString("XUI.COMMON.CLOSE", "关闭"), null, false, false, function() {
            H.close();
        });
        this.setMessage(this._msg);
        EUI.disableDocTextSelect(J, "text");
        $(J).bind("keydown.eshowhttperror", function(K) {
            K.stopPropagation();
        }).bind("contextmenu.eshowhttperror", function(K) {
            K.stopPropagation();
            return true;
        });
    }
    ;
    b.prototype.setMessage = function(H) {
        this.msgcell.innerHTML = H ? H.replace(/\t/g, "&nbsp;&nbsp;").replace(/\n/g, "<br/>") : "";
    }
    ;
    b.prototype.setParams = function(H) {
        this.__ex = H;
        this._msg = E.isie ? this.__ex.description : this.__ex.message;
        this.setMessage(this._msg);
    }
    ;
    function s() {}
    s.prototype.getMsgFromDialog = function() {
        var H = getRootWindow()["__ESEN$XShowError__"];
        return H ? H.msg : null;
    }
    ;
    s.prototype.getDetailMsgFromDialog = function() {
        var H = getRootWindow()["__ESEN$XShowError__"];
        return H ? H.detailmsg : null;
    }
    ;
    s.prototype.guessQueryUrl = function(L) {
        var I = "<a errurl=true>";
        var J = "</a>";
        var K = L.indexOf(I);
        if (K == -1) {
            return null;
        }
        K += I.length;
        var M = L.indexOf(J, K);
        if (M == -1) {
            return null;
        }
        var H = L.substring(K, M);
        return H;
    }
    ;
    function C(H) {
        n.call(this, {
            width: C.DEF_WIDTH,
            height: "auto",
            wnd: H
        });
        this.autoResize = false;
        this.count = 0;
        this._initEProgressDialog2();
    }
    EUI.extendClass(C, n, "EProgressDialog2");
    C.DEF_WIDTH = 200;
    C.MAX_WIDTH = 800;
    C.prototype.dispose = function() {
        this.dsbar = null;
        if (this.mainRcp) {
            this.mainRcp.ondblclick = null;
            this.mainRcp = null;
        }
        if (this.cancelBt) {
            this.cancelBt.onclick = null;
            this.cancelBt = null;
        }
        if (this.detailBt) {
            this.detailBt.onclick = null;
            this.detailBt = null;
        }
        this.oncancel = null;
        this.max = null;
        this.count = null;
        this._func4timeout_resetsize = null;
        this.wnd.clearTimeout(this._reretsizeTimeout);
        this._reretsizeTimeout = null;
        n.prototype.dispose.call(this);
    }
    ;
    C.prototype.setMaxCount = function(H) {
        this.max = H;
    }
    ;
    C.prototype._initEProgressDialog2 = function() {
        this.hideHead();
        this.hideBottom();
        this.mainRcp = this.getContent().appendChild(this.doc.createElement("div"));
        this.mainRcp.ondblclick = this._onDblClickEvent.bind(this);
        this.mainRcp.className = "eui-layout-container";
        var H = ['<div class="eui-layout-row-1 eui-layout-row-first eui-dialog-text eui-elip">'];
        H.push('<span class="eui-padding-right-15"></span>');
        H.push('<i class="eui-icon eui-icon-primary eui-hide"></i>');
        H.push('<div class="eui-dialog-icon-animation"></div>');
        H.push('<i class="eui-icon eui-icon-sub eui-icon-arrow-down" title="' + I18N.getString("xui.ctrls.EDialog.js.17", "显示详细内容") + '"></i>');
        H.push('<i class="eui-icon eui-icon-danger eui-icon-close" title="' + I18N.getString("XUI.COMMON.CANCEL", "取消") + '"></i>');
        H.push("</div>");
        H.push('<div class="eui-layout-row-3 eui-layout-row-last eui-layout-row-offset-1 eui-dialog-details eui-scroll-auto eui-weaken eui-padding-10 eui-margin-left-10 eui-margin-right-10"></div>');
        this.mainRcp.innerHTML = H.join("");
        this.msgCellContainer = this.mainRcp.firstChild;
        this.msgCell = this.msgCellContainer.firstChild;
        this.msgIconCell = this.msgCell.nextSibling;
        this.cancelBt = this.msgCellContainer.lastChild;
        this.cancelBt.onclick = this._cancelBtOnClick.bind(this);
        this.detailBt = this.cancelBt.previousSibling;
        this.detailBt.onclick = this._detailBtOnClick.bind(this);
        this.detailMsg = this.mainRcp.lastChild;
        this.setHasDetailButton(false);
        this.setHeight(50);
    }
    ;
    C.prototype._onDblClickEvent = function(H) {
        H = H || this.wnd.event;
        H.ctrlKey && this.close();
    }
    ;
    C.prototype._cancelBtOnClick = function() {
        EUI.isFunction(this.oncancel) && this.oncancel(this);
        this.hide();
    }
    ;
    C.prototype._detailBtOnClick = function() {
        var H = this._detailButtonIsDown();
        this.setDetailVisible(H);
        this._setDetailButtonStatus(!H);
        this.moveTo();
    }
    ;
    C.prototype._setDetailButtonStatus = function(I) {
        I = EUI.parseBool(I, false);
        var H = this.detailBt;
        if (I) {
            H.title = I18N.getString("xui.ctrls.EDialog.js.17", "显示详细内容");
            EUI.removeClassName(H, "eui-icon-arrow-up");
            EUI.addClassName(H, "eui-icon-arrow-down");
        } else {
            this.detailBt.title = I18N.getString("xui.ctrls.EDialog.js.18", "隐藏详细内容");
            EUI.removeClassName(H, "eui-icon-arrow-down");
            EUI.addClassName(H, "eui-icon-arrow-up");
        }
    }
    ;
    C.prototype._detailButtonIsDown = function() {
        return EUI.hasClassName(this.detailBt, "eui-icon-arrow-down");
    }
    ;
    C.prototype.show = function() {
        if (this._hide_timeout) {
            this.wnd.clearTimeout(this._hide_timeout);
            this._hide_timeout = null;
            this._clearIcon();
        }
        if (this.isVisible()) {
            return;
        }
        this.open(true);
    }
    ;
    C.prototype.hide = function() {
        this.close();
    }
    ;
    C.prototype._clearIcon = function() {
        this.msgIconCell.className = "eui-icon eui-icon-primary eui-hide";
        EUI.clearAllContent(this.msgIconCell);
    }
    ;
    C.prototype.close = function() {
        if (this._hide_timeout) {
            this.wnd.clearTimeout(this._hide_timeout);
            this._hide_timeout = null;
        }
        this.msgCell.innerHTML = null;
        this.detailMsg.innerHTML = null;
        this.count = 0;
        this.max = null;
        this._clearIcon();
        this._setDetailButtonStatus(true);
        this.setDetailVisible(false);
        this.oncancel = null;
        n.prototype.close.call(this);
    }
    ;
    C.prototype.hideDialog = function(I, J, H) {
        if (!I) {
            this.close();
            return;
        }
        if (J) {
            this._clearIcon();
            if (H) {
                EUI.removeClassName(this.msgIconCell, "eui-hide");
                EUI.setTagIcon(this.msgIconCell, H);
            }
            this.setParams(J);
            if (this.model) {
                EUI.showDisablePane(this.doc.body, false, "#FFFFFF");
            }
        }
        return this._hide_timeout = this.wnd.setTimeout(this.close.bind(this), I);
    }
    ;
    C.prototype._adjust_size = function(J) {
        var H = this.doc.body.appendChild(this.doc.createElement("span"));
        H.style.whiteSpace = "nowrap";
        H.style.visibility = "visible";
        EUI.setTextContent(H, J);
        var I = H.offsetWidth;
        this.doc.body.removeChild(H);
        if (I && I < C.MAX_WIDTH) {
            this.setWidth(this.msgIconCell.childNodes.length > 0 ? I + this.msgIconCell.offsetWidth + 80 : Math.max(I, C.DEF_WIDTH));
            if (this.isVisible()) {
                this.moveTo();
            }
            if (!this.isDetailVisible()) {
                this._orgW = this.getWidth();
                this._orgH = this.getHeight();
            }
        }
    }
    ;
    C.prototype.setMessage = function(H) {
        EUI.TimeoutQueue.add(this._adjust_size, {
            unique: true,
            context: this,
            args: [H]
        });
        EUI.setTextContent(this.msgCell, H);
    }
    ;
    C.prototype.addLog = function(H) {
        if (typeof (H) == "string" && H.length > 0) {
            if (this.count === this.max) {
                this.count -= 1;
                this.detailMsg.removeChild(this.detailMsg.firstChild);
                this.detailMsg.removeChild(this.detailMsg.firstChild);
            }
            this.detailMsg.appendChild(this.doc.createTextNode(H));
            this.detailMsg.appendChild(this.doc.createElement("br"));
            this.count++;
        }
    }
    ;
    C.prototype.setLogs = function(H) {
        this.count = 0;
        if (typeof (H) == "string" && H != this.detailMsg.value) {
            H = H.replaceAll("\r\n", "<br/>");
            this.detailMsg.innerHTML = H;
        }
    }
    ;
    C.prototype.getLogs = function() {
        return this.detailMsg.outerText;
    }
    ;
    C.prototype.setCanCancel = function(H, I) {
        this.oncancel = I;
        H = EUI.parseBool(H, false);
        H ? EUI.removeClassName(this.cancelBt, "eui-hide") : EUI.addClassName(this.cancelBt, "eui-hide");
    }
    ;
    C.prototype.setHasDetailButton = function(I) {
        I = EUI.parseBool(I, false);
        if (this.isDetailVisible() === I) {
            return;
        }
        if (I) {
            EUI.removeClassName(this.detailBt, "eui-hide");
        } else {
            EUI.addClassName(this.detailBt, "eui-hide");
        }
        var H = this;
        this.wnd.setTimeout(function() {
            H.setDetailVisible(I ? !H._detailButtonIsDown() : false);
        }, 0);
    }
    ;
    C.prototype.isDetailVisible = function() {
        return !EUI.hasClassName(this.detailBt, "eui-hide");
    }
    ;
    C.prototype.setDetailVisible = function(H) {
        H = EUI.parseBool(H, false);
        if (H) {
            EUI.removeClassName(this.detailMsg, "eui-hide");
            EUI.removeClassName(this.options._windom, "eui-dialog-loading");
        } else {
            EUI.addClassName(this.detailMsg, "eui-hide");
            this.setBaseCss("eui-dialog-loading");
        }
        this.resize(H ? 380 : 200, H ? 260 : 50);
    }
    ;
    C.prototype.showUnknownProgress = function() {}
    ;
    C.prototype.setParams = function(H) {
        this.setMessage(H);
        this.setHasDetailButton(false);
        this.setCanCancel(false);
    }
    ;
    C.prototype.open = function(J, H, I) {
        C._superClass.prototype.open.call(this, J, H, I, true);
    }
    ;
    function l(H, I) {
        if (_biInPrototype) {
            return;
        }
        n.call(this, {
            width: 300,
            height: 400
        });
        this.setHasScrollbar(false);
        this._initEMemoDialog();
        this.setContent(H, I);
    }
    EUI.extendClass(l, n, "EMemoDialog");
    l.DEF_BORDER_COLOR = "#E8F2FE";
    l.prototype.dispose = function() {
        if (this.closeBt) {
            this.closeBt.onclick = null;
            this.closeBt = null;
        }
        if (this.dsb) {
            this.dsb.dispose();
            this.dsb = null;
        }
        if (this.ctrls) {
            this.ctrls.dispose();
            this.ctrls = null;
        }
        n.prototype.dispose.call(this);
    }
    ;
    l.prototype.setContent = function(H, I) {
        if (!H) {
            return;
        }
        if (typeof (I) != "boolean") {
            I = false;
        }
        this._urlFrame.style.display = I ? "" : "none";
        this._htmlTable.style.display = !I ? "" : "none";
        I ? this._urlFrame.src = H : setHtmlContent(this._htmlContainer, H);
    }
    ;
    l.prototype.setTitle = function(J, I) {
        var H = (J ? J + " - " : "") + (I ? I : I18N.getString("xui.ctrls.EDialog.js.19", "备注"));
        if (EUI.getTextContent(this._hTitle) == H) {
            return;
        }
        EUI.setTextContent(this._hTitle, H);
    }
    ;
    l.prototype.setIcon = function(H) {
        if (!H || this._hIcon.src.indexOf(H) != -1) {
            return;
        }
        this._hIcon.src = H;
    }
    ;
    l.prototype._initEMemoDialog = function() {
        this.resize(300, 400);
        this.hideHead();
        this.hideBottom();
        var K = this.getContent();
        K.align = "center";
        K.vAlign = "middle";
        K.style.border = "2px solid " + l.DEF_BORDER_COLOR;
        K.style.borderLeftWidth = "2px";
        this._hlpContainer = K.appendChild(this.doc.createElement("table"));
        this._hlpContainer.border = 0;
        this._hlpContainer.cellPadding = 0;
        this._hlpContainer.cellSpacing = 2;
        this._hlpContainer.style.width = "100%";
        this._hlpContainer.style.height = "100%";
        this._mdHeaderRow = this._hlpContainer.insertRow(-1);
        var J = this._mdHeaderRow.insertCell(-1);
        J.style.borderBottom = "2px dotted " + l.DEF_BORDER_COLOR;
        var P = J.appendChild(this.doc.createElement("table"));
        P.border = 0;
        P.cellPadding = 0;
        P.cellSpacing = 5;
        P.style.width = "100%";
        P.style.height = "100%";
        var M = P.insertRow(-1);
        var H = M.insertCell(-1);
        H.style.width = "1%";
        this._hIcon = H.appendChild(this.doc.createElement("img"));
        this._hIcon.src = EUI.sys.getImgPath("null.gif");
        this._hTitle = M.insertCell(-1);
        this._hTitle.noWrap = true;
        this._hTitle.style.width = "98%";
        var I = M.insertCell(-1);
        I.noWrap = true;
        I.style.width = "1%";
        I.style.cursor = "pointer";
        this.closeBt = I.appendChild(this.doc.createElement("img"));
        this.closeBt.src = EUI.sys.getImgPath("exit.gif");
        this.closeBt.title = I18N.getString("XUI.COMMON.CLOSE", "关闭");
        this.closeBt.onclick = this.close.bind(this);
        var O = this._hlpContainer.insertRow(-1);
        O.style.height = "99%";
        var N = O.insertCell(-1)
          , L = J.clientHeight + 22;
        (this.onresized = function(V, U, T, S, Q, R) {
            N.style.height = (R - L) + "px";
        }
        )(this, null, null, null, null, this._windom.offsetHeight);
        N.align = "left";
        N.vAlign = "top";
        N.style.height = "100%";
        this.dsb = N.appendChild(doc.createElement("div"));
        this.dsb.className = "eui-container-scroll";
        this._urlFrame = this.doc.createElement("iframe");
        this._urlFrame.setAttribute("frameborder", "0", 0);
        this._urlFrame.height = "100%";
        this._urlFrame.width = "100%";
        this._urlFrame.marginheight = 0;
        this._urlFrame.marginwidth = 0;
        this._urlFrame.border = 0;
        this._urlFrame.styleborder = "none";
        this._urlFrame.styleoverflow = "hidden";
        this._urlFrame.styledisplay = "none";
        this.dsb.appendChild(this._urlFrame);
        if (E.isie) {
            this._urlFrame.style.position = "absolute";
        }
        this._urlFrame.onreadystatechange = function() {
            try {
                if (this.contentWindow.document.readyState == "complete") {
                    var Q = ";border: none; width: 100%;height:100%;padding 2px 5px; margin 0; overflow: auto;";
                    this.contentWindow.document.body.style.cssText += Q;
                    this.contentWindow.document.body.focus();
                }
            } catch (R) {}
        }
        ;
        this._htmlTable = this.dsb.appendChild(this.doc.createElement("table"));
        this._htmlTable.border = 0;
        this._htmlTable.cellPadding = 0;
        this._htmlTable.cellSpacing = 4;
        this._htmlTable.style.width = "100%";
        this._htmlTable.style.height = "100%";
        this._htmlContainer = this._htmlTable.insertRow(-1).insertCell(-1);
        this._htmlContainer.vAlign = "top";
        this._htmlContainer.align = "left";
        this.setTitle();
    }
    ;
    l.prototype.open = function(H, J, I) {
        n.prototype.open.call(this, H, J, I);
        this._ctrlresize.setMoveHandle(this._mdHeaderRow);
    }
    ;
    function e() {
        n.call(this, {
            width: e.W,
            height: e.H
        });
        var H = this.getBaseDom();
        H.style.cssText += ";min-width:" + e.W + "px;min-height:" + e.H + "px";
        this.setCanResizable(false);
        this._initEFloatHintMsg();
    }
    EUI.extendClass(e, n, "EFloatHintMsg");
    e.W = 200;
    e.H = 60;
    e.MAX_WIDTH = 300;
    e.prototype.dispose = function() {
        this.onclose = null;
        this._closeEvent = null;
        this.closeBt = null;
        this._clearAllTimer();
        if (this._ahpContainer) {
            this._ahpContainer.onmouseover = null;
            this._ahpContainer.onmouseou = null;
            this._ahpContainer = null;
        }
        n.prototype.dispose.call(this);
    }
    ;
    e.prototype.getMessage = function() {
        return this.msgContainer.innerHTML;
    }
    ;
    e.prototype.isStay = function() {
        return this._isStay;
    }
    ;
    e.prototype.setMessage = function(I) {
        EUI.setHtmlContent(this.msgContainer, I);
        var H = this.getBaseDom();
        if (parseInt(H.style.height, 10) != H.offsetHeight) {
            H.style.height = H.offsetHeight + "px";
            H.style.top = (this.doc.body.clientHeight - H.offsetHeight) + "px";
        }
    }
    ;
    e.prototype._reOpen = function(K, I) {
        var J = K ? e.MAX_WIDTH : e.W;
        this.resize(J, e.H, true);
        n.prototype.open.call(this, false, this.doc.body.clientWidth - J - 4, this.doc.body.clientHeight + e.H);
        if (I) {
            var H = this.getBaseDom();
            n.prototype.open.call(this, false, this.doc.body.clientWidth - H.offsetWidth - 4, this.doc.body.clientHeight + H.offsetHeight);
        }
    }
    ;
    e.prototype._clearAllTimer = function() {
        this._clearCloseTimer();
        this._clearDownTimer();
        this._clearUpTimer();
    }
    ;
    e.prototype._clearCloseTimer = function() {
        if (this._closeTimer) {
            this.wnd.clearTimeout(this._closeTimer);
            this._closeTimer = 0;
        }
    }
    ;
    e.prototype._clearDownTimer = function() {
        if (this._mDownTimer) {
            this.wnd.clearInterval(this._mDownTimer);
            this._mDownTimer = 0;
        }
    }
    ;
    e.prototype._clearUpTimer = function() {
        if (this._mUpTimer) {
            this.wnd.clearInterval(this._mUpTimer);
            this._mUpTimer = 0;
        }
    }
    ;
    e.prototype.open = function(I, H) {
        this._stayTime = I;
        this._animationTime = H;
        this.msgContainer.noWrap = true;
        this._reOpen(false, true);
        this.msgContainer.noWrap = this.msgContainer.offsetWidth < e.MAX_WIDTH;
        if (!this.msgContainer.noWrap) {
            this._reOpen(true);
        }
        if (this._ctrlresize) {
            this._ctrlresize.dispose();
            this._ctrlresize = null;
        }
        this._clearAllTimer();
        if (typeof (this._animationTime) == "number" && this._animationTime > 0) {
            this._interval_ = Math.max(Math.floor(this.getBaseDom().offsetHeight / Math.max(Math.floor(this._animationTime / 10)), 1), 1);
        }
        this._isStay = true;
        this._mUpTimer = this.wnd.setInterval(this._mUp.bind(this), 10);
    }
    ;
    e.prototype.close = function() {
        this.msgContainer.innerHTML = null;
        this.setHintCss();
        this._isOver = false;
        this._clearDownTimer();
        this._mDownTimer = this.wnd.setInterval(this._mDown.bind(this), 10);
    }
    ;
    e.prototype._mDown = function() {
        var H = this.getBaseDom();
        var J = this.doc.body.clientHeight + H.offsetHeight;
        var I = !this._animationTime || H.offsetHeight == this._interval_ ? J : this.getTop() + this._interval_;
        if (I >= J) {
            this._clearDownTimer();
            n.prototype.close.call(this);
            this._isStay = false;
            if (typeof (this.onclose) == "function") {
                this.onclose(this);
            }
        }
        this.setTop(I);
    }
    ;
    e.prototype._mUp = function() {
        var H = this.getBaseDom();
        var J = this.doc.body.clientHeight - H.offsetHeight - 8;
        var I = !this._animationTime || H.offsetHeight == this._interval_ ? J : this.getTop() - this._interval_;
        this.setTop(Math.max(I, J));
        if (I <= J) {
            this._clearUpTimer();
            if (!this._stayTime) {
                return;
            }
            this._closeTimer = this.wnd.setTimeout(this._closeEvent, this._stayTime);
        }
    }
    ;
    e.prototype._initEFloatHintMsg = function() {
        this.hideHead();
        this.hideBottom();
        var I = this.getContent()
          , H = [];
        H.push('<div class="eui-tips-container">');
        H.push('<i class="eui-icon"></i>');
        H.push('<span class=""></span>');
        H.push("</div>");
        H.push('<i class="eui-icon"></i>');
        I.innerHTML = H.join("");
        this._tipContainer = I.firstChild;
        this._tipContainer.onmouseover = this._func_OnMouseOver.bind(this);
        this._tipContainer.onmouseout = this._func_OnMouseOut.bind(this);
        this.msgContainer = this._tipContainer.lastChild;
        this._hint = this._tipContainer.firstChild;
        this.closeBt = I.lastChild;
        if (!this._closeEvent) {
            this._closeEvent = this.close.bind(this);
        }
        this.closeBt.onclick = this._closeEvent;
    }
    ;
    e.prototype.setHintCss = function(H) {
        this._tipContainer.className = "eui-tips-container " + H;
        this.msgContainer.className = H;
        this._hint.className = "eui-icon " + H;
    }
    ;
    e.prototype.setCloseCss = function(H) {
        this.closeBt.className = "eui-icon " + (H || "eui-error");
    }
    ;
    e.prototype.setHint = function(H) {
        this._hint.innerHTML = H;
    }
    ;
    e.prototype.setHintVisible = function(H) {
        H = EUI.parseBool(H, false);
        this._hint.style.display = H ? "" : "none";
    }
    ;
    e.prototype._func_OnMouseOver = function(I) {
        if (!I) {
            I = this.wnd.event;
        }
        var H = this;
        if (H && H == this && !this._mUpTimer && !this._mDownTimer) {
            this._isOver = true;
            this._clearAllTimer();
        }
    }
    ;
    e.prototype._func_OnMouseOut = function(H) {
        if (this._isOver) {
            this._closeTimer = this.wnd.setTimeout(this._closeEvent, Math.max(this._stayTime, 500));
        }
    }
    ;
    e.prototype.setTextAlign = function(H, I) {
        this.msgContainer.vAlign = I ? I : "top";
        this.msgContainer.align = H ? H : "left";
    }
    ;
    function o(H) {
        H.caption = H.caption || "字体设置";
        H.height = H.height || 280;
        n.call(this, H);
        this.onok = H.onok;
        this.oncancel = H.oncancel;
        this.setCanResizable(false);
        this.setMaxButtonVisible(false);
        this.isCanApplyDemo = true;
        this._initFontDialogDom();
        this.applyDemo();
    }
    EUI.extendClass(o, n, "EFontDialog");
    o.FONTSTYLES = [I18N.getString("xui.ctrls.xdialog.js.41", "常规"), I18N.getString("xui.ctrls.xdialog.js.42", "斜体"), I18N.getString("xui.ctrls.xdialog.js.43", "粗体"), I18N.getString("xui.ctrls.xdialog.js.44", "粗斜体")];
    o.DEF_SAMPLE = I18N.getString("xui.ctrls.xdialog.js.dog", "Cara is a dog. 卡拉是条狗。");
    o.prototype.dispose = function() {
        if (this.fontnameobj) {
            this.fontnameobj.dispose();
            this.fontnameobj = null;
        }
        if (this.fontsizeobj) {
            this.fontsizeobj.dispose();
            this.fontsizeobj = null;
        }
        if (this.fonttool) {
            this.fonttool.dispose();
            this.fonttool = null;
            this.styleitems = null;
            this.fontcolor = null;
        }
        this.demodom = null;
        n.prototype.dispose.call(this);
    }
    ;
    o.show = function(J, I, H) {}
    ;
    o.prototype._initFontDialogDom = function() {
        var H = [];
        H.push('<div class="eui-layout-container eui-form-label-xs eui-padding-10">');
        H.push('<div class="eui-form-container">');
        H.push('<div class="eui-form-item">');
        H.push('<label class="eui-form-label">字体：</label>');
        H.push('<div class="eui-input-inline" id="fontname"></div>');
        H.push("</div>");
        H.push('<div class="eui-form-item">');
        H.push('<label class="eui-form-label">字号：</label>');
        H.push('<div class="eui-input-inline" id="fontsize"></div>');
        H.push("</div>");
        H.push('<div class="eui-form-item" style="margin-bottom: 0;padding-left: 60px;">');
        H.push('<div class="eui-input-inline" id="fonttool"></div>');
        H.push("</div>");
        H.push('<div class="eui-form-item" id="fontdemo"></div>');
        H.push("</div>");
        H.push("</div>");
        var N = this.getContent();
        N.innerHTML = H.join("");
        var M = N.firstChild.firstChild
          , L = M.lastChild
          , I = L.previousSibling.lastChild
          , O = M.firstChild
          , K = O.lastChild
          , J = O.nextSibling.lastChild;
        this._initFontName(K);
        this._initFontSize(J);
        this._initFontTool(I);
        this._initFontDemo(L);
        this._initFontDialogBtns();
    }
    ;
    o.prototype._initFontName = function(I) {
        this.fontnameobj = new k.EFontCombobox({
            wnd: this.wnd,
            parentElement: I,
            height: "100%",
            floatBasecss: "eui-panel-font"
        });
        var H = this;
        this.fontnameobj.setOnChange(function() {
            H.applyDemo();
        });
        this.fontnameobj.getBaseDom().style.width = "";
    }
    ;
    o.prototype._initFontSize = function(I) {
        this.fontsizeobj = new k.EFontSizeCombobox({
            wnd: this.wnd,
            parentElement: I,
            width: 240,
            height: "100%",
            floatBasecss: "eui-panel-fontsize"
        });
        var H = this;
        this.fontsizeobj.setOnChange(function() {
            H.applyDemo();
        });
        this.fontsizeobj.getBaseDom().style.width = "";
    }
    ;
    o.prototype._initFontTool = function(J) {
        var L = require("eui/modules/ecoolbar");
        this.fonttool = new L.ECoolBar({
            wnd: this.wnd,
            parentElement: J,
            width: "100%",
            height: "100%",
            baseCss: "eui-coolbar-iconmini"
        });
        var I = this;
        var N = this.fonttool.addBand("band_1_name", true, false);
        var O = N.addButton("&#xe79c;");
        O.setName("B");
        O.setOnAfterClick(function() {
            I.applyDemo();
        });
        var M = N.addButton("&#xe79d;");
        M.setName("I");
        M.setOnAfterClick(function() {
            I.applyDemo();
        });
        var K = N.addButton("&#xe79e;");
        K.setName("U");
        K.setOnAfterClick(function() {
            I.applyDemo();
        });
        var H = N.addButton("&#xe79f;");
        H.setName("T");
        H.setOnAfterClick(function() {
            I.applyDemo();
        });
        this.styleitems = [O, M, K, H];
        N.addCheckAbleButtonGroups(this.styleitems, true);
        this.fontcolor = N.addButtonWithColorMenu("&#xe798;", function() {
            I.applyDemo();
        }).getCustomComponent();
    }
    ;
    o.prototype._initFontDemo = function(I) {
        var H = [];
        H.push('<fieldset style="height: 78px;"><legend>示例</legend>');
        H.push('<div class="eui-align-center"></div></fieldset>');
        I.innerHTML = H.join("");
        this.demodom = I.firstChild.lastChild;
    }
    ;
    o.prototype._initFontDialogBtns = function() {
        var H = this;
        this.addButton(I18N.getString("XUI.COMMON.CONFIRM", "确定"), null, null, true, function() {
            EUI.doCallBack(H.onok, H);
            H.close();
        });
        this.addButton(I18N.getString("XUI.COMMON.CANCEL", "取消"), null, null, false, function() {
            EUI.doCallBack(H.oncancel, H);
            H.close();
        });
    }
    ;
    o.prototype.setOnOk = function(H) {
        this.onok = H;
    }
    ;
    o.prototype.setOnCancel = function(H) {
        this.oncancel = H;
    }
    ;
    o.prototype.getFontName = function() {
        return this.fontnameobj.getFontName();
    }
    ;
    o.prototype.setFontName = function(H) {
        this.fontnameobj.setFontName(H);
    }
    ;
    o.prototype.getFontSize = function() {
        return parseInt(this.fontsizeobj.getFontSize(), 10);
    }
    ;
    o.prototype.setFontSize = function(H) {
        this.fontsizeobj.setFontSize(H);
    }
    ;
    o.prototype.getFontStyle = function() {
        var H = this.styleitems
          , J = [];
        for (var I = 0; I < 4; I++) {
            var K = H[I];
            if (K.isChecked()) {
                J.push(K.getName());
            }
        }
        return J.join("");
    }
    ;
    o.prototype.setFontStyle = function(K) {
        K = K || "";
        var H = this.styleitems;
        for (var J = 0; J < 4; J++) {
            var L = H[J]
              , I = L.getName();
            L.setChecked(K.indexOf(I) !== -1);
        }
    }
    ;
    o.prototype.getFontColor = function() {
        return this.fontcolor.getColor();
    }
    ;
    o.prototype.setFontColor = function(H) {
        this.fontcolor.setColor(H);
    }
    ;
    o.prototype.getFont = function() {
        return {
            name: this.getFontName(),
            size: this.getFontSize(),
            color: this.getFontColor(),
            stl: this.getFontStyle()
        };
    }
    ;
    o.prototype.setFont = function(H) {
        if (!H) {
            return;
        }
        this.isCanApplyDemo = false;
        try {
            this.setFontName(H.name);
            this.setFontSize(H.size);
            this.setFontStyle(H.stl);
            this.setFontColor(H.color);
        } finally {
            this.isCanApplyDemo = true;
        }
    }
    ;
    o.prototype.applyDemo = function() {
        if (this.isCanApplyDemo) {
            var K = this.demodom
              , I = this.getFont()
              , H = I.stl
              , J = "";
            J += "font-family: " + I.name + ";";
            J += "font-size: " + I.size + "px;";
            J += "color: " + I.color + ";";
            if (H) {
                J += "font-weight: " + (H.indexOf("B") !== -1 ? "bold" : "") + ";";
                J += "font-style: " + (H.indexOf("I") !== -1 ? "italic" : "") + ";";
                J += "text-decoration: " + (H.indexOf("U") !== -1 ? "underline" : "") + ((H.indexOf("T") !== -1 ? " line-through" : "")) + ";";
            }
            this.demodom.innerHTML = '<span style="' + J + '">' + I.name + "</span>";
        }
    }
    ;
    function w(H) {
        if (!H) {
            H = {};
        }
        H.width = !EUI.isNumber(H["width"]) ? 400 : H["width"];
        H.height = !EUI.isNumber(H["height"]) ? 150 : H["height"];
        H.caption = H["caption"] || I18N.getString("xui.ctrls.EDialog.js.2", "消息");
        H.baseCss = (H.baseCss || "") + " eui-dialog-nopadding";
        n.call(this, H);
        this.msg = H["msg"] || "";
        this._initEShowMessage();
    }
    EUI.extendClass(w, n, "EShowMessage");
    w.prototype.dispose = function() {
        $(this.getContent()).unbind("keydown.eshowmessag contextmenu.eshowmessag");
        this.msg = null;
        this.msgcell = null;
        this._img = null;
        n.prototype.dispose.call(this);
    }
    ;
    w.prototype._initEShowMessage = function() {
        this.setCanResizable(false);
        var L = this.doc
          , K = this.getContent()
          , J = $(K)
          , I = this
          , H = [];
        H.push('<div class="eui-layout-container eui-padding-top-15 eui-padding-left-15 eui-scroll-auto">');
        H.push('<div class="eui-row">');
        H.push('<div style=";width:65px;display:inline-block;">');
        H.push('<i title="提示图标" class="eui-icon eui-icon-xl eui-icon-primary">&#xe0cd;</i>');
        H.push("</div>");
        H.push('<div class="eui-padding-top-10 eui-breakword" style="position:absolute;display:inline-block;left:65px;right:0;top:16px;"></div>');
        H.push("</div>");
        H.push("</div>");
        K.innerHTML = H.join("");
        this._img = J.find("i")[0];
        this.msgcell = J.find(".eui-padding-top-10")[0];
        this.setMessage(this.msg);
        this.btn = this.addButton(I18N.getString("XUI.COMMON.CONFIRM", "确定"), null, false, true, function() {
            I.close();
        });
        EUI.disableDocTextSelect(K, "text");
        K.setAttribute("tabindex", 1);
        K.style.outline = "none";
        J.bind("keydown.eshowmessag", function(M) {
            M.stopPropagation();
        }).bind("contextmenu.eshowmessag", function(M) {
            M.stopPropagation();
            return true;
        });
    }
    ;
    w.prototype.getButton = function() {
        return this.btn;
    }
    ;
    w.prototype.setImg = function(H) {
        EUI.setTagIcon(this._img, H);
    }
    ;
    w.prototype.setMessage = function(J, H) {
        var I = E.isie ? "&nbsp;" : EUI.SPACE_CHAR;
        J = J.toString();
        this.msg = J ? J.replace(/\t/g, (I + I + I + I)).replace(/\n/g, "<br/>") : "";
        this.msgcell.innerHTML = this.msg;
    }
    ;
    w.prototype.setParams = function(K, I, J, H) {
        this.setMessage(K ? K : "", H);
        if (J) {
            this.setImg(J);
        }
        if (!I) {
            I = I18N.getString("xui.ctrls.EDialog.js.2", "消息");
        }
        this.setCaption(I);
        this.adjustHeight();
    }
    ;
    w.prototype.adjustHeight = function() {
        var H = this.msgcell.offsetHeight + 65;
        H = Math.min(H, this.getWidth());
        this.setHeight(H);
    }
    ;
    function c(H) {
        H = H || {};
        H.caption = H.caption || I18N.getString("xui.ctrls.EDialog.js.4", "提示");
        H.width = H.width || 400;
        H.height = H.height || 200;
        H.baseCss = (H.baseCss || "") + " eui-dialog-nopadding";
        n.call(this, H);
        this.__ex = H["e"];
        this.__caller = H["caller"];
        this.msg = "";
        this.detailmsg = "";
        if (this.__ex) {
            this.__initParams();
        }
        this._initEShowError();
    }
    EUI.extendClass(c, n, "EShowError");
    c.prototype.dispose = function() {
        $(this.getContent()).unbind("keydown.eshowerror contextmenu.eshowerror");
        this.msg = null;
        this.detailmsg = null;
        this.__ex = null;
        this.__caller = null;
        this.errorPpt = null;
        this._infoSd = null;
        this._sd = null;
        this.__btok = null;
        this.detailBt = null;
        this._msgContent = null;
        n.prototype.dispose.call(this);
    }
    ;
    c.prototype._initEShowError = function() {
        var N = this.getContent()
          , K = $(N)
          , I = [];
        I.push('<div class="eui-layout-row-2 eui-layout-row-first eui-padding-top-15 eui-padding-left-15 eui-scroll-auto" style="height: 118px;">');
        I.push("<div>");
        I.push('<div style=";width:65px;display:inline-block;">');
        I.push('<i title="提示图标" class="eui-icon eui-icon-xl eui-icon-primary">&#xe0cd;</i>');
        I.push("</div>");
        I.push('<div class="eui-breakword" style="position:absolute;display:inline-block;left:65px;right:0;top:26px;"></div>');
        I.push("</div>");
        I.push("</div>");
        I.push('<div class="eui-dialog-details eui-layout-row-3 eui-layout-row-last eui-layout-row-offset-2 eui-scroll-auto eui-weaken eui-padding-10 eui-margin-left-10" style="top:118px;"></div>');
        N.innerHTML = I.join("");
        this._msgContent = N.firstChild;
        this._infoContent = this._msgContent.firstChild.lastChild;
        this._detailContent = K.find(".eui-dialog-details")[0];
        this.setMessage(this.msg);
        this.setDetailMessage(this.detailmsg);
        EUI.disableDocTextSelect(N, "text");
        N.setAttribute("tabindex", 1);
        N.style.outline = "none";
        $(N).bind("keydown.eshowerror", function(O) {
            O.stopPropagation();
        }).bind("contextmenu.eshowerror", function(O) {
            O.stopPropagation();
            return true;
        });
        var H = this
          , J = H.options
          , L = H._msgContent.offsetHeight
          , M = H._detailContent.offsetHeight;
        this.onresizing = function(V, T, Q, U, O, Y) {
            var X = parseInt(H.height)
              , P = Math.abs(Y - X)
              , W = H.basedom
              , S = H._msgContent;
            if (P == 0) {
                return;
            }
            if (H.hasDetail) {
                var R = S.offsetHeight + 40 + 42;
                if (H._detailContent.style.display == "none") {
                    if (X > Y) {
                        S.style.height = Math.max(L - P, 118) + "px";
                        W.style.height = Math.max(Y, 200) + "px";
                    } else {
                        S.style.height = L + P + "px";
                    }
                } else {
                    if (Y < R) {
                        W.style.height = R + "px";
                        return;
                    }
                }
            } else {
                if (X > Y) {
                    S.style.height = Math.max(L - P, 118) + "px";
                    W.style.height = Math.max(Y, 200) + "px";
                } else {
                    S.style.height = L + P + "px";
                }
            }
        }
        ,
        this.onmax = function(O, P) {
            var Q = O._msgContent;
            if (!P) {
                if (O._detailContent.style.display == "none") {
                    Q.style.height = J.oldMsgHeight;
                }
            } else {
                J.oldMsgHeight = Q.style.height;
                if (O.hasDetail) {
                    if (O._detailContent.style.display == "none") {
                        Q.style.height = J._winBody.clientHeight + "px";
                    }
                } else {
                    Q.style.height = J._winBody.clientHeight - 40 + "px";
                }
            }
        }
        ;
    }
    ;
    c.prototype.setParams = function(I, H) {
        this.__ex = I;
        this.__caller = H;
        this.msg = "";
        this.detailmsg = "";
        this.errorCalls = [];
        if (this.__ex) {
            this.__initParams();
        }
        this.setMessage(this.msg);
        this.setDetailMessage(this.detailmsg);
        this.adjustHeight();
    }
    ;
    c.prototype.adjustHeight = function(J) {
        var H = this._infoContent.offsetHeight + 115;
        H = Math.max(H, 200);
        H = Math.min(H, this.getWidth());
        this.setHeight(H);
        this._msgrowheight = H - 84;
        var I = this.getContent().firstChild;
        I.style.height = this._msgrowheight + "px";
    }
    ;
    c.prototype.setMessage = function(H) {
        this._infoContent.innerHTML = H ? H.replace(/\t/g, "&nbsp;&nbsp;").replace(/\n/g, "<br/>") : "";
    }
    ;
    c.prototype._doDetail = function() {
        if (this._detailContent.style.display == "none") {
            this.showDetail(true);
        } else {
            this.showDetail(false);
        }
    }
    ;
    c.prototype.showDetail = function(L) {
        if (!this.detailBt) {
            return;
        }
        var K = this.getContent().firstChild;
        var I = this.options.maxInfo;
        L = !!L;
        if (L) {
            K.className = "eui-layout-row-2 eui-layout-row-first eui-padding-top-15 eui-padding-left-15 eui-scroll-auto eui-scroll-show";
            EUI.removeClassName(K, "eui-layout-container");
            this._detailContent.style.top = this._msgrowheight + "px";
            this._detailContent.style.display = "";
            this.setButtonArrow(this.detailBt, "up");
        } else {
            K.className = "eui-layout-row-3 eui-layout-row-first eui-layout-row-last eui-padding-15 eui-scroll-auto";
            this._detailContent.style.display = "none";
            this.setButtonArrow(this.detailBt, "down");
        }
        if (I) {
            I.height = (L ? (this._msgrowheight + 84 + 170) : (this._msgrowheight + 84)) + "px";
            K.style.height = this._msgrowheight + "px";
            this._detailContent.style.top = this._msgrowheight + "px";
        } else {
            var H = this.basedom.offsetHeight
              , J = this._msgrowheight;
            if (J == 118) {
                this.resize(400, L ? H + 140 : 200, true);
            } else {
                this.resize(400, L ? H + 140 : Math.max(J + 82, 200), true);
            }
        }
    }
    ;
    c.prototype.setDetailMessage = function(H) {
        if (this.hasDetail) {
            this._detailContent.innerHTML = H.replace(/\t/g, "&nbsp;&nbsp;").replace(/\n/g, "<br/>");
        }
        if (!this.__btok) {
            this.__btok = this.addButton(I18N.getString("XUI.COMMON.CONFIRM", "确定"), null, false, true, function(L, K, J) {
                if (L.errorCalls && L.errorCalls.length > 0) {
                    L.close();
                    var I = L.errorCalls.pop();
                    L = I[0];
                    L.setParams(I[1], I[2]);
                    L.showModal();
                    return;
                }
                L.close();
            });
        }
        if (!this.detailBt) {
            this.detailBt = this.addButton(I18N.getString("xui.ctrls.EDialog.js.6", "详情"), "", false, false, this._doDetail.bind(this));
        }
        if (this.hasDetail) {
            this.setButtonVisible(true, this.detailBt);
        } else {
            this._detailContent.style.display = "none";
            this.setButtonVisible(false, this.detailBt);
        }
    }
    ;
    c.prototype.close = function(H) {
        this._infoContent.innerHTML = "";
        this._detailContent.innerHTML = "";
        n.prototype.close.call(this);
        this.basedom.style.height = "200px";
    }
    ;
    c.prototype.__initParams = function() {
        this.errormsg = E.isie ? this.__ex.description : this.__ex.message;
        this.isobject = typeof (this.__ex) == "object";
        this.errorPpt = null;
        this.dmstr = "--detailmessage--";
        var L = this.dmstr.length;
        var J = -1;
        J = this.isobject ? this.errormsg.indexOf(this.dmstr) : this.__ex.indexOf(this.dmstr);
        this.hasDetail = J != -1;
        if (this.hasDetail) {
            var H = J + L;
            if (this.isobject) {
                this.msg = E.isie ? this.__ex.description.substring(0, J) : this.__ex.message.substring(0, J);
                this.detailmsg = E.isie ? this.__ex.description.substring(H) : this.__ex.message.substring(H);
            } else {
                this.msg = this.__ex.substring(0, J);
                this.detailmsg = this.__ex.substring(H);
            }
            var M = "--messageInfo--\r\n";
            var N = this.detailmsg.indexOf(M);
            if (N >= 0) {
                var I = this.detailmsg.substring(N + M.length);
                this.detailmsg = this.detailmsg.substring(0, N);
                this.errorPpt = new EUI.Map(I,"\r\n");
            }
            if (!E.isie) {
                this.msg = unescape(this.msg);
                this.detailmsg = unescape(this.detailmsg);
            }
        } else {
            if (this.isobject) {
                this.msg = E.isie ? this.__ex.description : this.__ex.message;
            } else {
                this.msg = this.__ex;
            }
            if (!E.isie) {
                this.msg = unescape(this.msg);
            }
        }
        if (this.__ex.stack) {
            this.detailmsg += "\r\n\r\nJavaScript StackTrace:\r\n" + this.__ex.stack.toString();
            this.hasDetail = true;
        } else {
            if (Object.prototype.toString.call(this.__ex) === "[object Error]") {
                this.hasDetail = true;
            }
        }
        if (this.errorPpt != null) {
            var K = this.errorPpt.getValue("rootExceptionClass") == "com.sanlink.util.InfoException";
            if (K) {
                this.setCaption(I18N.getString("xui.ctrls.EDialog.js.2", "消息"));
            }
        }
    }
    ;
    c.getJsStackTrace = function(L) {
        if (EUI.isString(L)) {
            return L;
        }
        if (E.isie) {
            var I = 0;
            var H = new Array();
            var J = L;
            var M = L.caller;
            H.push(J);
            while (M && I < 50) {
                H.push(M);
                M = M.caller;
                I++;
            }
            return H.join("\r\n\r\n");
        }
        try {
            EUI.throwError("test");
        } catch (K) {
            return K.stack.toString();
        }
    }
    ;
    function G(H) {
        if (!H) {
            H = {};
        }
        H.caption = H["caption"] || I18N.getString("XUI.COMMON.CONFIRM", "确定");
        H.width = !EUI.isNumber(H["width"]) ? 400 : H["width"];
        H.height = !EUI.isNumber(H["height"]) ? 150 : H["height"];
        n.call(this, H);
        this.msg = H["msg"] ? H["msg"] : I18N.getString("xui.ctrls.EDialog.js.12", "您确定要这样做吗？");
        this._isYesNo = EUI.parseBool(H["isyesno"], true);
        this._initEConfirmDialog();
    }
    EUI.extendClass(G, n, "EConfirmDialog");
    G.prototype._initEConfirmDialog = function() {
        this.setCanResizable(false);
        this._btYes = this.addButton(I18N.getString("xui.ctrls.EDialog.js.13", "是(Y)"), null, false, true, this._doYes.bind(this));
        this._btNo = this.addButton(I18N.getString("xui.ctrls.EDialog.js.14", "否(N)"), null, false, false, this._doNo.bind(this));
        this._btOK = this.addButton(I18N.getString("XUI.COMMON.CONFIRM", "确定"), null, false, true, this._doOk.bind(this));
        if (this._isYesNo) {
            this.setButtonVisible(false, this._btOK);
        } else {
            this.setButtonVisible(false, this._btYes);
            this.setButtonVisible(false, this._btNo);
        }
        this._btCancel = this.addButton(I18N.getString("XUI.COMMON.CANCEL", "取消"), null, false, false, this._doCancel.bind(this));
        var I = []
          , K = this.getContent()
          , J = $(K);
        I.push('<div class="eui-layout-container eui-padding-top-15 eui-padding-left-15 eui-scroll-auto">');
        I.push('<div class="eui-row">');
        I.push('<div style=";width:65px;display:inline-block;">');
        I.push('<i title="确认图标" class="eui-icon eui-icon-xl eui-icon-primary">&#xef12;</i>');
        I.push("</div>");
        I.push('<div class="eui-padding-top-10 eui-breakword" id="msgcell" style="position:absolute;display:inline-block;left:65px;right:0;top:16px;"></div>');
        I.push("</div>");
        I.push("</div>");
        K.innerHTML = I.join("");
        this._img = J.find("i")[0];
        this.msgcell = J.find("#msgcell")[0];
        this.setMessage(this.msg);
        var H = this;
        this.onclose = function() {
            H.onyes = null;
            H.onno = null;
            H.onok = null;
            H.oncancel = null;
            var L = H._onclose;
            H._onclose = null;
            if (L) {
                L(H);
            }
        }
        ;
    }
    ;
    G.prototype._do_callback = function(I) {
        if (typeof (I) === "function") {
            I(this);
        } else {
            if (I) {
                var H = I["callback"];
                if (typeof (H) === "function") {
                    H.apply(I["context"], [this].concat(I["args"]));
                }
            }
        }
    }
    ;
    G.prototype.open = function(J, H, I) {
        this.__isShow = true;
        G._superClass.prototype.open.call(this, J, H, I);
    }
    ;
    G.prototype._doYes = function() {
        this.__isShow = false;
        this._do_callback(this.onyes);
        if (this.__isShow == false) {
            this.close();
        }
    }
    ;
    G.prototype._doNo = function() {
        this.__isShow = false;
        this._do_callback(this.onno);
        if (this.__isShow == false) {
            this.close();
        }
    }
    ;
    G.prototype._doOk = function() {
        this.__isShow = false;
        this._do_callback(this.onok);
        if (this.__isShow == false) {
            this.close();
        }
    }
    ;
    G.prototype._doCancel = function() {
        this._do_callback(this.oncancel);
        this.close();
    }
    ;
    G.prototype.dispose = function() {
        this.onyes = null;
        this.onno = null;
        this.onok = null;
        this.oncancel = null;
        this._img = null;
        if (this._btYes) {
            this._btYes.dispose();
            this._btYes = null;
        }
        if (this._btNo) {
            this._btNo.dispose();
            this._btNo = null;
        }
        if (this._btOK) {
            this._btOK.dispose();
            this._btOK = null;
        }
        if (this._btCancel) {
            this._btCancel.dispose();
            this._btCancel = null;
        }
        n.prototype.dispose.call(this);
    }
    ;
    G.prototype.setMessage = function(H) {
        var I = E.isie ? "&nbsp;" : EUI.SPACE_CHAR;
        this.msgcell.innerHTML = H ? H.replace(/\t/g, (I + I + I + I)).replace(/\n/g, "<br/>") : "";
    }
    ;
    G.prototype.setImg = function(H) {
        this._img.style.backgroundImage = "url(" + H + ")";
    }
    ;
    G.prototype.setOnYes = function(H) {
        this.onyes = this._isYesNo ? H : null;
    }
    ;
    G.prototype.setOnNo = function(H) {
        this.onno = this._isYesNo ? H : null;
    }
    ;
    G.prototype.setOnOK = function(H) {
        this.onok = !this._isYesNo ? H : null;
    }
    ;
    G.prototype.setOnCancel = function(H) {
        this.oncancel = H;
    }
    ;
    G.prototype.setOnClose = function(H) {
        this._onclose = H;
    }
    ;
    G.prototype.setParams = function(K, J, H, I) {
        if (!K) {
            K = I18N.getString("xui.ctrls.EDialog.js.16", "确认");
        }
        this.setCaption(K);
        this.msg = J ? J : I18N.getString("xui.ctrls.EDialog.js.12", "您确定要这样做吗？");
        this._isYesNo = typeof (H) == "boolean" ? H : true;
        this.setMessage(this.msg);
        if (I) {
            this.setImg(I);
        }
        this.setButtonVisible(this._isYesNo, this._btYes);
        this.setButtonVisible(this._isYesNo, this._btNo);
        this.setButtonVisible(!this._isYesNo, this._btOK);
        this.adjustHeight();
    }
    ;
    G.prototype.adjustHeight = function() {
        var H = this.msgcell.offsetHeight + 107;
        H = Math.min(H, this.getWidth());
        this.setHeight(H);
    }
    ;
    function B(H) {
        H = H || {};
        H.width = 350;
        H.height = H.height || 150;
        n.call(this, H);
        this.prompt = H["prompt"] || "";
        this.onok = H["onok"];
        this.defValue = H["value"] || "";
        this.required = EUI.parseBool(H.required, true);
        this._initXInputDialog();
    }
    EUI.extendClass(B, n, "EInputDialog");
    B.prototype.dispose = function() {
        this.onok = null;
        this.__textnode = null;
        if (this.__edit) {
            this.__edit._sancomponent = null;
            this.__edit.onkeydown = null;
            this.__edit = null;
        }
        if (this.__btok) {
            this.__btok.onclick = null;
            this.__btok = null;
        }
        if (this.__btcancel) {
            this.__btcancel.onclick = null;
            this.__btcancel = null;
        }
        n.prototype.dispose.call(this);
    }
    ;
    B.prototype._initXInputDialog = function() {
        this.setCanResizable(false);
        var K = this.getContent()
          , J = $(K)
          , H = [];
        H.push('<div class="eui-layout-container eui-form eui-padding-top-35 eui-scroll-auto" style="padding-top:34px;">');
        H.push('<div class="eui-form-item">');
        H.push('<label class="eui-form-label"></label>');
        H.push('<div class="eui-input-block"></div>');
        H.push('<div class="eui-form-mid eui-input-block eui-clear">');
        H.push('<div class="eui-tips-container eui-error"><i class="eui-icon eui-error">&#xe0cd;</i><span></span></div>');
        H.push("</div>");
        H.push("</div>");
        H.push("</div>");
        K.innerHTML = H.join("");
        this.__textnode = J.find("label")[0];
        this.required ? EUI.addClassName(this.__textnode, "eui-form-required") : "";
        var I = this.__textnode.nextSibling;
        this.__edit = I.appendChild(this._createInputElem());
        this._hint = J.find(".eui-clear")[0];
        this._hintcaption = J.find("span")[0];
        this.input = J.find("input")[0];
        this.textarea = J.find("textarea")[0];
        this.__edit.onkeydown = this._XInputDialog$OnKeyDownEvent.bind(this);
        this.__textnode.innerHTML = this.prompt;
        this.setValue(this.defValue);
        this.__btok = this.addButton(I18N.getString("XUI.COMMON.CONFIRM", "确定"), null, null, true);
        this.__btok.onclick = this._doOK.bind(this);
        this.__btcancel = this.addButton(I18N.getString("XUI.COMMON.CANCEL", "取消"));
        this.__btcancel.onclick = this.close.bind(this);
    }
    ;
    B.prototype._createInputElem = function() {
        y();
        return q.text();
    }
    ;
    B.prototype._doOK = function() {
        if (this.onok && typeof (this.onok) == "function") {
            if (this.onok(this)) {
                this.close();
            }
        }
    }
    ;
    B.prototype.setPrompt = function(H) {
        this.prompt = H ? H : "";
        this.__textnode.innerHTML = this.prompt;
    }
    ;
    B.prototype.setValue = function(H) {
        this.defValue = H ? H : "";
        this.__edit.value = this.defValue;
    }
    ;
    B.prototype.getEditDom = function() {
        return this.__edit;
    }
    ;
    B.prototype.setHintVisible = function(H) {
        H = EUI.parseBool(H, false);
        this._hint.style.display = H ? "" : "none";
    }
    ;
    B.prototype.setHintCaption = function(H) {
        this._hintcaption.innerHTML = H || "";
    }
    ;
    B.prototype.setHintCss = function(H) {
        this._hint.firstChild.className = "eui-tips-container " + (H || "eui-error");
        this._hint.firstChild.firstChild.className = "eui-icon " + (H || "eui-error");
    }
    ;
    B.prototype.setPlaceHolder = function(H) {
        if (!this.input) {
            this.textarea.setAttribute("placeholder", H);
        } else {
            this.input.setAttribute("placeholder", H);
        }
    }
    ;
    B.prototype.setRquiredVisiable = function(H) {
        H = EUI.parseBool(H, true);
        H ? EUI.addClassName(this.__textnode, "eui-form-required") : EUI.removeClassName(this.__textnode, "eui-form-required");
    }
    ;
    B.prototype._XInputDialog$OnKeyDownEvent = function(I) {
        var H = this;
        if (!I) {
            I = H.wnd.event;
        }
        if ((I.keyCode == 13 && !"TEXTAREA".equalsIgnoreCase(this.tagName)) || (I.ctrlKey && I.keyCode == 13 && "TEXTAREA".equalsIgnoreCase(this.tagName))) {
            H._doOK();
            if (I.stopPropagation) {
                I.stopPropagation();
            } else {
                I.cancelBubble = true;
            }
            if (I.preventDefault) {
                I.preventDefault();
            } else {
                I.returnValue = false;
            }
            return false;
        } else {
            if (I.keyCode == 27) {
                H.close();
            }
        }
    }
    ;
    B.prototype.setFocus = function() {
        if (this.__edit) {
            try {
                this.__edit.focus();
            } catch (H) {}
        }
    }
    ;
    B.prototype.getValue = function() {
        return this.__edit ? this.__edit.value : "";
    }
    ;
    B.prototype.setParams = function(H, J, I, K, M, L) {
        this.onok = I;
        this.setPrompt(H);
        this.setCaption(J);
        this.setValue(K);
        this.setPlaceHolder("请输入");
        if (!this.isEnabled()) {
            this.setEnabled(true);
        }
        this.setHintCaption("");
        this.setHintVisible(false);
        L = EUI.parseBool(L, true);
        this.setRquiredVisiable(L);
    }
    ;
    B.prototype.close = function() {
        try {
            if (this.__edit) {
                this.__edit.blur();
            }
        } catch (I) {}
        var H = this._hint.firstChild;
        H.className = "eui-tips-container eui-error";
        H.firstChild.className = "eui-icon eui-error";
        this.onok = null;
        this.__edit.value = null;
        this.required = null;
        this.options.captionNode.innerHTML = null;
        this.__textnode.innerHTML = null;
        this._hint.style.display = "none";
        n.prototype.close.call(this);
    }
    ;
    function A(H) {
        if (!H) {
            H = {};
        }
        H.width = 350;
        H.height = 165;
        n.call(this, H);
        this.prompt1 = H["prompt1"] ? H["prompt1"] : "";
        this.defValue1 = H["value1"] ? H["value1"] : "";
        this.prompt2 = H["prompt2"] ? H["prompt2"] : "";
        this.defValue2 = H["value2"] ? H["value2"] : "";
        this.onok = H["onok"];
        this._initInputDialog2();
    }
    EUI.extendClass(A, n, "EInputDialog2");
    A.prototype.dispose = function() {
        this.onok = null;
        this.__textnode = null;
        this._hef = null;
        if (this.__edit) {
            this.__edit._sancomponent = null;
            this.__edit.onkeydown = null;
            this.__edit = null;
        }
        if (this.__btok) {
            this.__btok.onclick = null;
            this.__btok = null;
        }
        if (this.__btcancel) {
            this.__btcancel.onclick = null;
            this.__btcancel = null;
        }
        n.prototype.dispose.call(this);
    }
    ;
    A.prototype._initInputDialog2 = function() {
        this.setCanResizable(false);
        var M = this.getContent()
          , J = $(M)
          , I = [];
        I.push('<div class="eui-layout-container eui-form eui-padding-top-15 eui-scroll-auto">');
        I.push('<div class="eui-form-item">');
        I.push('<label class="eui-form-label eui-form-required"></label>');
        I.push('<div class="eui-input-block"><input type="text" class="eui-form-input" placeholder = "请输入"></div>');
        I.push('<div class="eui-form-mid eui-input-block eui-clear">');
        I.push('<div class="eui-tips-container eui-error"><i class="eui-icon eui-icon-danger">&#xe0cd;</i><span></span></div>');
        I.push("</div>");
        I.push("</div>");
        I.push('<div class="eui-form-item">');
        I.push('<label class="eui-form-label eui-form-required"></label>');
        I.push('<div class="eui-input-block"><input type="text" class="eui-form-input" placeholder = "请输入"></div>');
        I.push('<div class="eui-form-mid eui-input-block eui-clear">');
        I.push('<div class="eui-tips-container eui-error"><i class="eui-icon eui-icon-danger">&#xe0cd;</i><span></span></div>');
        I.push("</div>");
        I.push("</div>");
        I.push("</div>");
        M.innerHTML = I.join("");
        var H = J.find("label")
          , K = J.find("input")
          , N = J.find(".eui-clear")
          , L = J.find("span");
        this.__textnode1 = H[0];
        this.__edit1 = K[0];
        this._hint1 = N[0];
        this._hintcaption1 = L[0];
        this.__edit1.onkeydown = this._InputDialog2$OnKeyDownEvent.bind(this);
        this.__edit1.value = this.defValue1;
        this.__textnode2 = H[1];
        this.__edit2 = K[1];
        this._hint2 = N[1];
        this._hintcaption2 = L[1];
        this.__edit2.onkeydown = this._InputDialog2$OnKeyDownEvent.bind(this);
        this.__edit2.value = this.defValue2;
        this.__btok = this.addButton(I18N.getString("XUI.COMMON.CONFIRM", "确定"), null, null, true);
        this.__btok.onclick = this._doOK.bind(this);
        this.__btcancel = this.addButton(I18N.getString("XUI.COMMON.CANCEL", "取消"));
        this.__btcancel.onclick = this.close.bind(this);
    }
    ;
    A.prototype.setHintVisible = function(I, H) {
        I = EUI.parseBool(I, false);
        switch (H) {
        case 1:
            this._hint1.style.display = I ? "" : "none";
            this._hint2.style.display = !I ? "" : "none";
            break;
        case 2:
            this._hint2.style.display = I ? "" : "none";
            this._hint1.style.display = !I ? "" : "none";
            break;
        default:
            this._hint1.style.display = I ? "" : "none";
            this._hint2.style.display = I ? "" : "none";
            break;
        }
    }
    ;
    A.prototype.setHintCaption = function(I, H) {
        switch (H) {
        case 1:
            this._hintcaption1.innerHTML = I;
            break;
        case 2:
            this._hintcaption2.innerHTML = I;
            break;
        default:
            this.setHintVisible(false);
            break;
        }
    }
    ;
    A.prototype._doOK = function() {
        if (this.onok && typeof (this.onok) == "function") {
            if (this.onok(this)) {
                this.close();
            }
        }
    }
    ;
    A.prototype.setValue1 = function(H) {
        this.defValue1 = H ? H : "";
        this.__edit1.value = this.defValue1;
    }
    ;
    A.prototype.setValue2 = function(H) {
        this.defValue2 = H ? H : "";
        this.__edit2.value = this.defValue2;
    }
    ;
    A.prototype._InputDialog2$OnKeyDownEvent = function(I) {
        var H = this;
        if (!I) {
            I = H.wnd.event;
        }
        if ((I.keyCode == 13 && !"TEXTAREA".equalsIgnoreCase(this.tagName)) || (I.ctrlKey && I.keyCode == 13 && "TEXTAREA".equalsIgnoreCase(this.tagName))) {
            H._doOK();
        } else {
            if (I.keyCode == 27) {
                H.close();
            }
        }
    }
    ;
    A.prototype.setFocus = function() {
        if (this.__edit1) {
            try {
                this.__edit1.focus();
            } catch (H) {}
        }
    }
    ;
    A.prototype.getValue1 = function() {
        return this.__edit1 ? this.__edit1.value : "";
    }
    ;
    A.prototype.getValue2 = function() {
        return this.__edit2 ? this.__edit2.value : "";
    }
    ;
    A.prototype.setParams = function(M, L, J, I, K, H, O, N) {
        this.prompt1 = L ? L : "";
        this.defValue1 = K ? K : "";
        this.prompt2 = J ? J : "";
        this.defValue2 = H ? H : "";
        this.onok = I;
        this.setCaption(M);
        this.__edit1.value = this.defValue1;
        this.__textnode1.innerHTML = this.prompt1;
        this.__edit2.value = this.defValue2;
        this.__textnode2.innerHTML = this.prompt2;
        this.__edit1.readOnly = !EUI.parseBool(O, true);
        this.__edit2.readOnly = !EUI.parseBool(N, true);
        this.setHintCaption("", 1);
        this.setHintCaption("", 2);
        this.setHintVisible(false);
    }
    ;
    A.prototype.close = function() {
        try {
            if (this.__edit1) {
                this.__edit1.blur();
            }
            if (this.__edit2) {
                this.__edit2.blur();
            }
        } catch (J) {}
        var I = this._hint1.firstChild;
        var H = this._hint2.firstChild;
        I.className = "eui-tips-container eui-error";
        I.firstChild.className = "eui-icon eui-icon-danger";
        H.className = "eui-tips-container eui-error";
        H.firstChild.className = "eui-icon eui-icon-danger";
        this.onok = null;
        this.__edit1.value = null;
        this.__edit2.value = null;
        this.__edit1.readOnly = false;
        this.__edit2.readOnly = false;
        this.__textnode1.innerHTML = null;
        this.__textnode2.innerHTML = null;
        this.options.captionNode.innerHTML = null;
        this._hint1.style.display = "none";
        this._hint2.style.display = "none";
        n.prototype.close.call(this);
    }
    ;
    function D(H) {
        n.call(this, H);
        this.data = H || {};
        this._initUploadDialog();
    }
    EUI.extendClass(D, n, "UploadDialog");
    D.prototype.dispose = function() {
        this.mouseoverbind = null;
        this.mouseoutbind = null;
        this.file = null;
        this.zipDom = null;
        this.coverDom = null;
        this.fileCapDom = null;
        this.hintDom = null;
        this._attachform = null;
        this.iframe = null;
        this.isunzipDom = null;
        this.iscoverDom = null;
        this.hideDom = null;
        this.data = null;
        n.prototype.dispose.call(this);
    }
    ;
    D.prototype._initUploadDialog = function() {
        y();
        var N = this.getContent()
          , L = $(N)
          , K = [];
        K.push('<form class="eui-padding-top-15" style="*zoom:1;" method="post" enctype="multipart/form-data" target="__uploaddlgframe__"');
        if (this.data["action"]) {
            K.push('action="' + this.data["action"] + '" ');
        }
        K.push(">");
        K.push('<div class="eui-form-item eui-upload-hint eui-hide">');
        K.push('<i class="eui-icon"></i>');
        K.push(this.data["hint"] || "");
        K.push("</div>");
        K.push('<div class="eui-form-item">');
        K.push('<label class="eui-form-label">');
        K.push(this.data["fileCaption"] || "选择文件：");
        K.push("</label>");
        K.push('<div class="eui-input-block">');
        K.push("</div>");
        K.push("</div>");
        K.push('<div class="eui-form-item">');
        K.push('<label class="eui-form-label"></label>');
        K.push('<div class="eui-input-block">');
        K.push("</div>");
        K.push('<input type="hidden" name="isunzip" value="">');
        K.push('<input type="hidden" name="iscover" value="">');
        K.push("</div>");
        K.push('<div class="eui-form-item eui-hide eui-input-hidden">');
        K.push("</div>");
        K.push('<iframe name="__uploaddlgframe__" id="__uploaddlgframe__" style="display:none;" ></iframe>');
        K.push("</form>");
        N.innerHTML = K.join("");
        var O = L.find(".eui-input-block");
        this.file = q.file();
        O[0].appendChild(this.file);
        var H = this.doc.createElement("i");
        H.className = "eui-icon eui-vertical-bottom eui-outer-margin-left-5 eui-hide";
        H.innerHTML = "&#xe0ce;";
        O[0].appendChild(H);
        this.tipicon = O[0].lastChild;
        this.zipDom = q.checkbox({
            caption: "解压"
        });
        O[1].appendChild(this.zipDom);
        this.coverDom = q.checkbox({
            caption: "覆盖"
        });
        O[1].appendChild(this.coverDom);
        this.isunzipDom = O[1].nextSibling;
        this.iscoverDom = this.isunzipDom.nextSibling;
        this.fileCapDom = L.find("label")[0];
        this.hintDom = L.find(".eui-upload-hint")[0];
        this._attachform = L.children("form");
        this.iframe = L.find("iframe")[0];
        this.hideDom = L.find(".eui-input-hidden");
        this.setHint(this.data["hint"]);
        this.setZipVisible(this.data["zipVisible"]);
        this.setCoverVisible(this.data["coverVisible"]);
        var I = this;
        this.setCanResizable(false);
        var J = this.addButton(this.data["buttonCaption"] || "上传", null, null, true, function() {
            if (!I.data.action) {
                EUI.showMessage("必须设置文件上传URL！");
                return;
            }
            var Q = q.getValueByDom(I.file);
            var P = I.data.checkFunc;
            if (Q) {
                if (EUI.isFunction(P) && (P(I, Q) === false)) {
                    return;
                }
                I.isunzipDom.value = q.getValueByDom(I.zipDom);
                I.iscoverDom.value = q.getValueByDom(I.coverDom);
                if (I.data.onok && EUI.isFunction(I.data.onok)) {
                    if (I.data.onok(I)) {
                        I.__setOnload();
                        I._attachform.submit();
                    }
                } else {
                    I.__setOnload();
                    I._attachform.submit();
                }
            } else {
                EUI.showMessage("请选择需要上传文件！");
                return;
            }
        });
        var M = this.addButton("取消", null, null, false, function() {
            I.close();
        });
        this.onclose = function() {
            I.setHint("");
            I.cleanDatas();
            I._attachform[0].reset();
            this._attachform[0].className = "eui-padding-top-15";
            q.getComponentObjByDom(I.file).clear();
            q.getComponentObjByDom(I.zipDom).setChecked(false, true);
            q.getComponentObjByDom(I.coverDom).setChecked(false, true);
            I.data.checkFunc = null;
            var P = I._onclose;
            I._onclose = null;
            if (P) {
                return P(I);
            }
        }
        ;
    }
    ;
    D.prototype.setCheckFunc = function(H) {
        this.data.checkFunc = H;
    }
    ;
    D.prototype.getFileName = function() {
        y();
        var H = q.getValueByDom(this.file).split("\\");
        return H[H.length - 1];
    }
    ;
    D.prototype.setDatas = function(H) {
        this.cleanDatas();
        if (EUI.isObject(H)) {
            var I = [];
            for (var J in H) {
                I.push('<input type="hidden" name="' + J + '" value="' + H[J] + '">');
            }
            this.hideDom.append(I.join(""));
        }
    }
    ;
    D.prototype.cleanDatas = function() {
        this.hideDom.empty();
    }
    ;
    D.prototype.setOnClose = function(H) {
        this._onclose = H;
    }
    ;
    D.prototype.setZipVisible = function(H) {
        H = this.data["zipVisible"] = EUI.parseBool(H, false);
        if (H) {
            EUI.removeClassName(this.zipDom, "eui-hide");
        } else {
            EUI.addClassName(this.zipDom, "eui-hide");
        }
    }
    ;
    D.prototype.setCoverVisible = function(H) {
        H = this.data["coverVisible"] = EUI.parseBool(H, false);
        if (H) {
            EUI.removeClassName(this.coverDom, "eui-hide");
        } else {
            EUI.addClassName(this.coverDom, "eui-hide");
        }
    }
    ;
    D.prototype.setAction = function(H) {
        this.data.action = H;
        this._attachform.attr("action", H);
    }
    ;
    D.prototype.setFileCaption = function(H) {
        H = H ? H : "选择文件：";
        this.data["fileCaption"] = H;
        this.fileCapDom.innerHTML = H;
    }
    ;
    D.prototype.setButtonCaption = function(H) {
        H = H ? H : "上传";
        this.data["buttonCaption"] = H;
        D._superClass.prototype.setButtonCaption.call(this, H, 0);
    }
    ;
    D.prototype.setHint = function(J) {
        if (this.data["hint"] === J) {
            return;
        }
        this.data["hint"] = J;
        var I = this.tipicon;
        if (!z) {
            z = require("eui/modules/efloathint").EFloatHint;
        }
        if (!this.mouseoutbind) {
            this.mouseoverbind = function() {
                z.showFloatHintOnDom(I, this.data["hint"], 300, 0);
            }
            ;
            this.mouseoutbind = function() {
                z.hideFloatHint(100, 0, true);
            }
            ;
        }
        if (J) {
            var H = z.getFloatHint();
            H.setButtonsPaneVisible(false);
            EUI.removeClassName(I, "eui-hide");
            EUI.addEvent(I, "mouseover", this.mouseoverbind.bind(this));
            EUI.addEvent(I, "mouseout", this.mouseoutbind.bind(this));
        } else {
            EUI.removeEvent(I, "mouseover", this.mouseoverbind.bind(this));
            EUI.removeEvent(I, "mouseout", this.mouseoutbind.bind(this));
            z.hideFloatHint(10, 0, false);
            EUI.addClassName(I, "eui-hide");
        }
    }
    ;
    D.prototype.setAfterSubmit = function(H) {
        this.data.onfinish = H;
    }
    ;
    D.prototype.__setOnload = function() {
        var H = this
          , I = this.data.onfinish
          , J = this.iframe;
        if (EUI.isFunction(I)) {
            if (J.attachEvent) {
                J.onreadystatechange = function(K) {
                    if (this.readyState == "complete") {
                        var L = K.currentTarget.contentDocument ? K.currentTarget.contentDocument.body.innerText : "";
                        I(H, L);
                        J.onload = null;
                    }
                }
                ;
            } else {
                J.onload = function(K) {
                    var L = K.currentTarget.contentDocument ? K.currentTarget.contentDocument.body.innerText : "";
                    I(H, L);
                    J.onload = null;
                }
                ;
            }
        }
    }
    ;
    D.prototype.setParams = function(P, K, L, O, I, H, J, N, M) {
        this.setCaption(P);
        this.setHint(K);
        this.setFileCaption(L);
        this.setButtonCaption(O);
        this.setZipVisible(I);
        this.setCoverVisible(H);
        this.setAction(J);
        this.setAfterSubmit(N);
        this.setCheckFunc(M);
        if (!I && !H) {
            this._attachform[0].className = "eui-padding-top-35";
        }
    }
    ;
    function i(H) {
        H = H || {};
        H.height = 210;
        B.call(this, H);
    }
    EUI.extendClass(i, B, "ETextAreaDialog");
    i.prototype.dispose = function() {
        B.prototype.dispose.call(this);
    }
    ;
    i.prototype._createInputElem = function() {
        var I = this.getContent()
          , J = I.firstChild;
        EUI.removeClassName(J, "eui-padding-top-35");
        EUI.addClassName(J, "eui-padding-top-15");
        J.style.paddingTop = "";
        y();
        var H = q.textarea();
        H.style.width = "200px";
        H.style.overflow = "auto";
        return H;
    }
    ;
    function x(H) {
        H = H || {};
        B.call(this, H);
    }
    EUI.extendClass(x, B, "ENumberDialog");
    x.prototype.dispose = function() {
        if (this._spinner) {
            this._spinner.dispose();
            this._spinner = null;
        }
        x._superClass.prototype.dispose.call(this);
    }
    ;
    x.prototype._createInputElem = function() {
        y();
        var J = q.spinner()
          , I = q.getComponentObjByDom(J)
          , H = this.defValue;
        I.setMax(100);
        I.setMin(1);
        this._spinner = I;
        return J;
    }
    ;
    x.prototype.setFocus = function() {}
    ;
    x.prototype.setParams = function(H, J, I, M, K, L) {
        if (EUI.isNumber(K)) {
            this._spinner.setMax(K);
        }
        if (EUI.isNumber(L)) {
            this._spinner.setMin(L);
        }
        x._superClass.prototype.setParams.call(this, H, J, I, M);
    }
    ;
    x.prototype.setValue = function(H) {
        this._spinner.setValue(H);
    }
    ;
    x.prototype.getValue = function() {
        return this._spinner.getValue();
    }
    ;
    x.prototype.close = function() {
        this._spinner.edit.value = null;
        this._spinner.maxData = null;
        this._spinner.minData = null;
        B.prototype.close.call(this);
    }
    ;
    function f(H) {
        H = H || {};
        B.call(this, H);
    }
    EUI.extendClass(f, B, "EListComboboxDialog");
    f.prototype.dispose = function() {
        if (this._combobox) {
            this._combobox.dispose();
            this._combobox = null;
        }
        d._superClass.prototype.dispose.call(this);
    }
    ;
    f.prototype.setValue = function(H) {
        var I = this._combobox;
        if (EUI.isArray(H)) {
            I.setDatas(H);
        } else {
            if (EUI.isObject(H)) {
                I.setDatas(H["options"], H["value"]);
            } else {
                I.setDatas([[H]]);
            }
        }
    }
    ;
    f.prototype.getValue = function() {
        return this._combobox.getValue();
    }
    ;
    f.prototype._createInputElem = function() {
        y();
        var H = q.combobox()
          , J = q.getComponentObjByDom(H)
          , I = this.defValue;
        this._combobox = J;
        return H;
    }
    ;
    f.prototype.setFocus = function() {}
    ;
    f.prototype.close = function() {
        this._combobox.clearValue();
        this._combobox.clearOption();
        B.prototype.close.call(this);
    }
    ;
    function d(H) {
        H = H || {};
        f.call(this, H);
    }
    EUI.extendClass(d, f, "EEditComboboxDialog");
    d.prototype._createInputElem = function() {
        y();
        var H = q.combobox({
            isedit: true
        })
          , J = q.getComponentObjByDom(H)
          , I = this.defValue;
        this._combobox = J;
        return H;
    }
    ;
    function y() {
        if (!q) {
            q = require("eui/modules/eform").eform;
        }
    }
    return {
        EDialog: n,
        EShowMessage: w,
        EShowHttpError: b,
        EShowError: c,
        ErrorMsgGetter: s,
        EProgressDialog2: C,
        EConfirmDialog: G,
        EMemoDialog: l,
        EFloatHintMsg: e,
        EFontDialog: o,
        EInputDialog: B,
        EInputDialog2: A,
        EUploadDialog: D,
        ETextAreaDialog: i,
        ENumberDialog: x,
        EListComboboxDialog: f,
        EEditComboboxDialog: d
    };
});
