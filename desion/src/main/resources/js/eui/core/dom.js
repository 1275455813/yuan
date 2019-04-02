+function(namespace, EUI) {
    var browser = EUI.browser, addEvent = null, removeEvent = null, setEvent = null, banBackSpace, SPACE_CHAR = "&#xA0;", _domscrollwidth;
    if (document.addEventListener) {
        addEvent = function(node, type, handler) {
            node.addEventListener(type, handler, false);
        }
        ;
        removeEvent = function(node, type, handler) {
            node.removeEventListener(type, handler, false);
        }
        ;
    } else {
        addEvent = function(node, type, handler) {
            node.attachEvent("on" + type, handler);
        }
        ;
        removeEvent = function(node, type, handler) {
            node.detachEvent("on" + type, handler);
        }
        ;
    }
    function _getDomscrollwidth() {
        var div = document.createElement("div")
          , div2 = div.appendChild(document.createElement("div"));
        div.style.cssText += ";width: 50px;height: 50px;overflow:auto;";
        div2.style.cssText += ";width: 100px;height: 100px;";
        document.body.appendChild(div);
        _domscrollwidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
    }
    banBackSpace = function(evt) {
        var evt = evt || window.event;
        if (evt.keyCode == 8) {
            var obj = evt.target || evt.srcElement;
            var t = obj.type || obj.getAttribute("type");
            if (t != "password" && t != "text" && t != "textarea") {
                evt.preventDefault();
                evt.returnValue = false;
                return false;
            }
            var isreadonly = obj.readOnly || obj.getAttribute("readonly");
            var isenable = obj.getAttribute("enabled");
            isreadonly = isreadonly == null ? false : isreadonly;
            isenable = isenable == null ? true : isenable;
            if (isreadonly === true || isenable === false) {
                evt.preventDefault();
                evt.returnValue = false;
                return false;
            }
        }
    }
    ;
    if (browser.isie || browser.isChrome) {
        addEvent(document, "keydown", banBackSpace);
    } else {
        addEvent(document, "keypress", banBackSpace);
    }
    setEvent = function(obj, eventType, callback, userdata, ignore) {
        if (!callback) {
            if (eventType == "load" && browser.isie && typeof (obj.onreadystatechange) != "undefined") {
                eventType = "readystatechange";
            }
            obj["on" + eventType] = null;
            return;
        }
        var _doit = function() {
            if (typeof (callback) == "function") {
                callback(obj, userdata);
            }
        };
        if (obj.nodeName && obj.nodeName.toLowerCase() == "link" && eventType == "load") {
            setTimeout(_doit, 0);
            return;
        }
        var _doReadyStateChange;
        if (eventType == "load") {
            if (browser.isSafari || browser.isOpera) {
                obj["on" + eventType] = new _doit;
                return;
            }
            if (browser.isie && obj.onreadystatechange) {
                _doReadyStateChange = function() {
                    if (ignore || (!isNaN(this.readyState) && this.readyState == 4) || this.readyState == "complete" || (this.navigator && this.document && this.document.readyState == "complete") || (this.contentWindow && this.contentWindow.document.readyState == "complete")) {
                        _doit();
                    }
                }
                ;
                eventType = "readystatechange";
            }
        }
        obj["on" + eventType] = _doReadyStateChange ? _doReadyStateChange : _doit;
    }
    ;
    es_tryfetch_getEvent = function() {
        if (document.all) {
            return window.event;
        }
        var func = es_tryfetch_getEvent.caller;
        while (func != null) {
            var arg0 = func.arguments[0];
            if (arg0) {
                if ((arg0.constructor == Event) || (arg0.constructor == MouseEvent) || ((typeof (arg0) == "object") && !!arg0.preventDefault && !!arg0.stopPropagation)) {
                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    }
    ;
    var InputValidate = {};
    InputValidate._initObject = function(dom, func) {
        if (typeof (dom) == "string" && dom.length > 0) {
            dom = document.getElementById(dom);
        }
        if (typeof (dom) == "object" && dom.tagName && "INPUT".equalsIgnoreCase(dom.tagName)) {
            dom.onkeydown = function(e) {
                if (!e) {
                    e = EUI.getWndOfDom(dom).event;
                }
                if (typeof (func) == "function") {
                    return func(e);
                }
            }
            ;
            dom.oncontextmenu = EUI.returnfalse;
        }
    }
    ;
    InputValidate.Number = function(dom) {
        InputValidate._initObject(dom, function(e) {
            if ((e.ctrlKey && e.keyCode == 86) || (e.keyCode > 57 && e.keyCode > 48)) {
                return false;
            }
        });
    }
    ;
    InputValidate.English = function(dom) {
        InputValidate._initObject(dom, function(e) {
            if (e.keyCode > 128) {
                return false;
            }
        });
    }
    ;
    InputValidate.Chinese = function(dom) {
        InputValidate._initObject(dom, function(e) {
            if (e.keyCode > 32 && e.keyCode < 128) {
                return false;
            }
        });
    }
    ;
    InputValidate.Replace = function(dom, reg, s) {
        if (typeof (dom) == "string" && dom.length > 0) {
            dom = document.getElementById(dom);
        }
        if (typeof (dom) == "object" && dom.tagName && "INPUT".equalsIgnoreCase(dom.tagName)) {
            if (typeof (reg) != "object" && typeof (reg) != "function") {
                reg = /[^A-Z^a-z^0-9^\-^\_^\.]/g;
            }
            if (dom.value != null && dom.value.length > 0) {
                dom.value = dom.value.replace(reg, s ? s : "");
            }
        }
    }
    ;
    InputValidate.test = function(dom, reg) {
        if (typeof (dom) == "string" && dom.length > 0) {
            dom = document.getElementById(dom);
        }
        if (typeof (dom) == "object" && dom.tagName && "INPUT".equalsIgnoreCase(dom.tagName)) {
            if (typeof (reg) != "object" && typeof (reg) != "function") {
                reg = /[^A-Z^a-z^0-9^\-^\_^\.]/g;
            }
            return reg.test(dom.value);
        }
    }
    ;
    EUI.extendObj(EUI, {
        addEvent: addEvent,
        removeEvent: removeEvent,
        setEvent: setEvent,
        InputValidate: InputValidate,
        attacheEvent4Iframes: function(method, doc, e, func) {
            if (method == "add") {
                EUI.addEvent(doc, e, func, false);
            } else {
                EUI.removeEvent(doc, e, func, false);
            }
            var _tmp, _wnd, _doc, _body, _pn;
            var _ifms = doc.getElementsByTagName("iframe");
            for (var i = 0; _ifms && i < _ifms.length; i++) {
                try {
                    _tmp = _ifms[i];
                    _pn = _tmp.parentNode;
                    if (_tmp.id && _tmp.id.indexOf("SAN_BACKGROUND_IFRAME_ID") >= 0) {
                        continue;
                    }
                    if (_tmp.style.visibility == "hidden" || _tmp.style.display == "none" || (_pn && _pn.style.visibility == "hidden") || (_pn && _pn.style.display == "none")) {
                        continue;
                    }
                    _wnd = _tmp.contentWindow;
                    _doc = _wnd.document;
                    _body = _doc.body;
                    if (!_wnd || !_doc || !_body) {
                        continue;
                    }
                    EUI.attacheEvent4Iframes(method, _doc, e, func);
                } catch (e) {}
            }
            EUI.attacheEvent4Frames(method, doc, e, func);
        },
        attacheEvent4Frames: function(method, doc, e, func) {
            var _tmp, _wnd, _doc, _body, _pn;
            var _fms = doc.getElementsByTagName("frame");
            for (var i = 0; i < _fms.length; i++) {
                try {
                    _tmp = _fms[i];
                    _pn = _tmp.parentNode;
                    if (_tmp.style.visibility == "hidden" || _tmp.style.display == "none") {
                        continue;
                    }
                    _wnd = _tmp.contentWindow;
                    _doc = _wnd.document;
                    _body = _doc.body;
                    if (!_wnd || !_doc || !_body) {
                        continue;
                    }
                    EUI.attacheEvent4Iframes(method, _doc, e, func);
                } catch (e) {}
            }
        },
        attacheEvent4TopIframes: function(method, e, func) {
            if (typeof (func) != "function") {
                return;
            }
            EUI.attacheEvent4Iframes(method, EUI.getRootWindow().document, e, func);
        },
        bindResize: function(resizedom, options) {
            var elems = []
              , datas = []
              , delay = 500
              , time_id = null
              , name_height = "clientHeight"
              , name_width = "clientWidth";
            var doCheckResize = function() {
                var len = elems.length;
                if (len === 0) {
                    return false;
                }
                for (var i = 0; i < len; i++) {
                    var elem = elems[i]
                      , data = datas[i];
                    var resizewh = data["resizewh"]
                      , width = null
                      , oriwidth = null
                      , height = null
                      , oriheight = null;
                    if (resizewh !== "h") {
                        oriwidth = data["width"];
                        width = elem[name_width] - data["offsetw"];
                    }
                    if (resizewh !== "w") {
                        oriheight = data["height"];
                        height = elem[name_height] - data["offseth"];
                    }
                    if (width === oriwidth && height === oriheight) {
                        continue;
                    }
                    try {
                        data["callback"].call(data["context"], data["width"] = width, data["height"] = height, data["extArgs"]);
                    } catch (e) {}
                }
            };
            var loopy = function() {
                if (time_id) {
                    clearTimeout(time_id);
                }
                time_id = setTimeout(function() {
                    if (doCheckResize() !== false) {
                        loopy();
                    }
                }, delay);
            };
            var setChildSize = function(width, height, childNodes) {
                var cssText = ";" + (width !== null ? "width: " + width + "px;" : "") + (height !== null ? "height: " + height + "px;" : "");
                for (var i = 0, len = childNodes.length; i < len; i++) {
                    childNodes[i].style.cssText += cssText;
                }
            };
            EUI.addDispose(function() {
                if (time_id) {
                    clearTimeout(time_id);
                }
                elems = null;
                datas = null;
            });
            bindResize = function(resizedom, options) {
                if (!resizedom || !elems) {
                    return;
                }
                if (!options) {
                    var idx = elems.indexOf(resizedom);
                    if (idx !== -1) {
                        elems.splice(idx, 1);
                        datas.splice(idx, 1);
                        if (elems.length === 0 && time_id) {
                            clearTimeout(time_id);
                        }
                    }
                } else {
                    var callback = options["callback"]
                      , extArgs = null
                      , context = null;
                    if (typeof (callback) !== "function") {
                        var targets = options["targets"];
                        if (!targets) {
                            return;
                        }
                        callback = setChildSize;
                        extArgs = targets;
                    } else {
                        extArgs = options["extArgs"];
                        context = options["context"];
                    }
                    var resizewh = options["resizewh"]
                      , width = resizedom[name_width]
                      , height = resizedom[name_height]
                      , w = null
                      , h = null
                      , offsetw = null
                      , offseth = null;
                    resizewh = resizewh === "w" || resizewh === "h" ? resizewh : null;
                    if (resizewh !== "h") {
                        offsetw = parseInt(options["offsetw"]) || 0;
                        w = width - offsetw;
                    }
                    if (resizewh !== "w") {
                        offseth = parseInt(options["offseth"]) || 0;
                        h = height - offseth;
                    }
                    if (!options["defer"]) {
                        callback.call(context, w, h, extArgs);
                    }
                    elems.push(resizedom);
                    datas.push({
                        width: width,
                        height: height,
                        offsetw: offsetw,
                        offseth: offseth,
                        resizewh: resizewh,
                        extArgs: extArgs,
                        context: context,
                        callback: callback
                    });
                    if (elems.length === 1 && !time_id) {
                        loopy();
                    }
                }
            }
            ;
            bindResize.apply(this, arguments);
        },
        showDisablePane: function(parentDom, visible, istransparent) {
            if (EUI.isString(parentDom)) {
                parentDom = document.getElementById(parentDom);
            }
            if (!EUI.isHtmlElement(parentDom)) {
                parentDom = document.body;
            }
            var doc = parentDom.ownerDocument
              , _gname = parentDom.slk_disablePane_id;
            if (!visible && !_gname) {
                return;
            }
            var wnd = EUI.getWndOfDoc(doc);
            if (wnd.onBefore_ShowDisablePane) {
                wnd.onBefore_ShowDisablePane();
            }
            var pane = _gname ? doc.getElementById(_gname) : null
              , ishide = !pane || EUI.hasClassName(pane, "eui-hide");
            if (!ishide && visible) {
                pane.visibleid += 1;
                if (!istransparent) {
                    EUI.removeClassName(pane, "eui-shade-transparent");
                }
                return;
            }
            if (ishide && !visible) {
                return;
            }
            if (!pane) {
                pane = parentDom.appendChild(doc.createElement("div"));
                pane.visibleid = 0;
                pane.className = "eui-shade";
                pane.id = EUI.idRandom("slk_disablePane");
                parentDom.slk_disablePane_id = pane.id;
                pane.oncontextmenu = EUI.returnfalse;
                var inpane = pane.appendChild(doc.createElement("img"));
                inpane.src = EUI.xuiimg("null.gif");
                inpane.style.cssText += ";position:absolute;width:100%;height:100%;z-index:1;";
                inpane.oncontextmenu = EUI.returnfalse;
                inpane.onmousedown = EUI.returnfalse;
                EUI.disableDocTextSelect(pane, false);
            }
            if (EUI.parseBool(istransparent, false)) {
                EUI.addClassName(pane, "eui-shade-transparent");
            } else {
                EUI.removeClassName(pane, "eui-shade-transparent");
            }
            pane.visibleid += visible ? 1 : -1;
            if (pane.visibleid > 0) {
                pane.style.zIndex = typeof (zindex) != "number" ? 9 : zindex;
                EUI.removeClassName(pane, "eui-hide");
            } else {
                pane.visibleid = 0;
                EUI.addClassName(pane, "eui-hide");
            }
            if (wnd.onAfter_ShowDisablePane) {
                wnd.onAfter_ShowDisablePane(pane.visibleid > 0, pane);
            }
            return pane;
        },
        getHtmlBody: function(html) {
            if (!html) {
                return html;
            }
            var i = html.indexOf("<body");
            if (i > -1) {
                i = html.indexOf(">", i);
                var e = html.lastIndexOf("</body>");
                html = html.substr(i + 1, e - i - 1);
            }
            if (browser.isie) {
                return html;
            }
            return html.replace(/(&nbsp;)/g, SPACE_CHAR);
        },
        getScriptBody: function(html) {
            if (!html) {
                return html;
            }
            var i = html.indexOf("<script");
            if (i > -1) {
                i = html.indexOf(">", i);
                var e = html.lastIndexOf("<\/script>");
                html = html.substr(i + 1, e - i - 1);
                return html;
            }
            return null;
        },
        getRealLeft: function(o) {
            var l = o.offsetLeft - o.scrollLeft
              , o = o.offsetParent;
            while (o && o.tagName != "BODY") {
                l += o.offsetLeft - o.scrollLeft + o.clientLeft;
                o = o.offsetParent;
            }
            return l;
        },
        getRealTop: function(o) {
            var t = o.offsetTop - o.scrollTop
              , o = o.offsetParent;
            while (o && !"BODY".equalsIgnoreCase(o.tagName)) {
                t += o.offsetTop - o.scrollTop + o.clientTop;
                o = o.offsetParent;
            }
            return t;
        },
        getDomTop: function(dom, parentNode, ignoreScroll) {
            var _baseDom = dom;
            if (!parentNode) {
                return EUI.getDomOffsetTop(_baseDom);
            }
            var _pNode = _baseDom.offsetParent;
            var r = EUI.getDomOffsetTop(_baseDom, ignoreScroll);
            while (_pNode != null && _pNode != parentNode) {
                r += EUI.getDomOffsetTop(_pNode, ignoreScroll);
                _pNode = _pNode.offsetParent;
            }
            return r;
        },
        getDomOffsetTop: function(dom, ignoreScroll) {
            return dom.offsetTop - (ignoreScroll ? dom.scrollTop : 0) + dom.clientTop;
        },
        getDomLeft: function(dom, parentNode, ignoreScroll) {
            var _baseDom = dom;
            if (!parentNode) {
                return EUI.getDomOffsetLeft(_baseDom);
            }
            var _pNode = _baseDom.offsetParent;
            var r = EUI.getDomOffsetLeft(_baseDom, ignoreScroll);
            while (_pNode != null && _pNode != parentNode) {
                r += EUI.getDomOffsetLeft(_pNode, ignoreScroll);
                _pNode = _pNode.offsetParent;
            }
            return r;
        },
        getDomOffsetLeft: function(dom, ignoreScroll) {
            return dom.offsetLeft - (ignoreScroll ? dom.scrollLeft : 0) + dom.clientLeft;
        },
        getAbsScrollPosition: function(p, parentnode) {
            if (!p) {
                return;
            }
            var doc = parentnode ? parentnode : p.ownerDocument;
            var left = p.scrollLeft;
            var top = p.scrollTop;
            p = p.offsetParent;
            while (p && p != doc) {
                left += p.scrollLeft;
                top += p.scrollTop;
                p = p.offsetParent;
            }
            return {
                x: left,
                y: top
            };
        },
        getAbsPosition: function(win, elem, offsetNode) {
            var doc = elem.ownerDocument || win.document
              , box = elem.getBoundingClientRect()
              , offsetbox = null;
            if (!offsetNode) {
                offsetNode = doc.documentElement;
                offsetbox = {
                    left: 0,
                    top: 0
                };
            } else {
                offsetbox = offsetNode.getBoundingClientRect();
            }
            return {
                x: box["left"] - offsetbox["left"] + offsetNode.scrollLeft - (offsetNode.clientLeft || 0),
                y: box["top"] - offsetbox["top"] + offsetNode.scrollTop - (offsetNode.clientTop || 0)
            };
        },
        setTextContent: function(p, text, istospace) {
            if (!p) {
                return;
            }
            text = typeof (text) == "string" || typeof (text) == "number" ? text : (istospace == false ? "" : " ");
            if (p.nodeType == 3) {
                p.data = text;
            } else {
                if (browser.isie) {
                    p.style.display = "none";
                    p.innerText = text;
                    p.style.display = "";
                } else {
                    p.textContent = text;
                }
            }
        },
        getTextContent: function(p) {
            if (!p) {
                return null;
            }
            var nodeType = p.nodeType;
            if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                if (typeof p.textContent === "string") {
                    return p.textContent;
                } else {
                    var rt = [];
                    for (var elem = p.firstChild; elem; elem = elem.nextSibling) {
                        rt.push(EUI.getTextContent(elem));
                    }
                    return rt.join("");
                }
            } else {
                if (nodeType === 3 || nodeType === 4) {
                    return p.nodeValue;
                }
            }
            return "";
        },
        clearAllContent: function(node, filter) {
            var childnode = node.firstChild
              , tmpchild = null;
            if (typeof (filter) === "function") {
                while (tmpchild = childnode) {
                    childnode = childnode.nextSibling;
                    if (filter(tmpchild, node) !== true) {
                        node.removeChild(tmpchild);
                    }
                }
            } else {
                while (tmpchild = childnode) {
                    childnode = childnode.nextSibling;
                    node.removeChild(tmpchild);
                }
            }
            return node;
        },
        clearNode: EUI.isie ? function(node) {
            if (!node) {
                return;
            }
            var tmp = getDocument(node).createElement("div");
            var cnode = node.firstChild
              , tmpnode = null;
            while (cnode) {
                cnode = (tmpnode = cnode).nextSibling;
                tmp.appendChild(tmpnode);
            }
            tmp.innerHTML = "";
        }
        : function(node) {
            if (!node) {
                return;
            }
            var cnode = node.firstChild
              , tmpnode = null;
            while (cnode) {
                cnode = (tmpnode = cnode).nextSibling;
                node.removeChild(tmpnode);
            }
        }
        ,
        getChildNodes: function(p, index) {
            var cns = p.childNodes
              , tmp = null
              , j = 0;
            for (var i = 0, len = cns.length; i < len; i++) {
                tmp = cns[i];
                if (tmp.nodeType != 3 || tmp.nodeValue.indexOf("\n") != 0) {
                    if (j++ == index) {
                        return tmp;
                    }
                }
            }
        },
        getCDATASectionValue: function(node) {
            var length = node.childNodes.length;
            if (length == 0) {
                return node.nodeName == "#cdata-section" ? node.nodeValue : "";
            }
            var _node;
            var str = null;
            for (var i = 0; i < node.childNodes.length; i++) {
                _node = node.childNodes[i];
                if (_node.nodeName == "#cdata-section") {
                    str = (str == null ? "" : str) + _node.nodeValue;
                } else {
                    if (str != null) {
                        break;
                    }
                }
            }
            return str == null ? "" : str;
        },
        getChildDomByAttrib: function(parentobj, attrib, value, recur) {
            if (parentobj == null || value == null) {
                return null;
            }
            var childs = parentobj.childNodes;
            var len = childs.length;
            var child;
            for (var i = 0; i < len; i++) {
                child = childs[i];
                if (child.nodeType !== 1) {
                    continue;
                }
                if (value.equalsIgnoreCase(child[attrib]) || (value.equalsIgnoreCase(child.getAttribute(attrib)))) {
                    return child;
                }
                if (recur) {
                    child = EUI.getChildDomByAttrib(child, attrib, value, recur);
                    if (child != null) {
                        return child;
                    }
                }
            }
            return null;
        },
        getChildDomByAttribWithIndex: function(parentobj, attrib, value, index) {
            if (parentobj == null) {
                return null;
            }
            if (!index) {
                index = 0;
            }
            var childs = parentobj.childNodes;
            var len = childs.length;
            var child;
            var cur = -1;
            for (var i = 0; i < len; i++) {
                child = childs[i];
                if (child.nodeType !== 1) {
                    continue;
                }
                if (value.equalsIgnoreCase(child[attrib]) || (value.equalsIgnoreCase(child.getAttribute(attrib)))) {
                    cur++;
                    if (cur == index) {
                        return child;
                    }
                }
            }
            return null;
        },
        setInnerHTML: function(obj, html) {
            var start = "<script";
            var end = "<\/script>";
            var i1 = html.indexOf(start, 0);
            var arr = [];
            var _body, _script;
            while (i1 != -1) {
                var i2 = html.indexOf(end, i1);
                var i3 = html.indexOf(">", i1);
                var str = html.substring(i3 + 1, i2);
                if (str != "") {
                    arr.push(str);
                }
                i1 = html.indexOf(start, i2);
            }
            obj.innerHTML = EUI.getHtmlBody(html);
            eval(arr.join("\r\n"));
        },
        setHtmlContent: function(node, html) {
            if (!node) {
                return;
            }
            var wnd = EUI.getWndOfDom(node);
            if (!wnd) {
                return;
            }
            var doc = wnd.document;
            var _exp = /<script.*?>[\s\S]*?<\/script>/gi;
            var _scripts = html.match(_exp);
            html = html.replace(_exp, "");
            if (browser.isie) {
                html = "<span style=display:none>MSIE</span>" + html;
                node.innerHTML = html;
                node.removeChild(node.firstChild);
            } else {
                var node1 = node.nextSibling;
                var node2 = node.parentNode;
                if (node2.nodeType != 1) {
                    return;
                }
                node2.removeChild(node);
                var _exp = /<style.*?>[\s\S]*?<\/style>/gi;
                var _styles = html.match(_exp);
                if (_styles && _styles.length > 0) {
                    var _head = doc.getElementsByTagName("head")[0];
                    var _pstyle = doc.getElementById("style4InnerHtml");
                    if (!_pstyle) {
                        _pstyle = _head.appendChild(doc.createElement("style"));
                        _pstyle.id = "style4InnerHtml";
                    }
                    if (_pstyle.parentNode != _head) {
                        _head.appendChild(_pstyle);
                    }
                    EUI.clearAllContent(_pstyle);
                    _pstyle.innerHTML = EUI._styles2String4HtmlContent(_styles);
                    html = html.replace(_exp, "");
                }
                node.innerHTML = html.replace(/(&nbsp;)/g, SPACE_CHAR);
                node1 && node1.nodeType == 1 ? node2.insertBefore(node, node1) : node2.appendChild(node);
            }
            EUI.exeDomScriptJs(node, _scripts, wnd);
        },
        exeDomScriptJs: function(node, _scripts, wnd) {
            var _script, ndx, doc = wnd.document;
            for (var i = 0; _scripts && i < _scripts.length; i++) {
                _script = _scripts[i];
                ndx = _script.indexOf(">");
                if (ndx == -1) {
                    continue;
                }
                if (_script.substring(0, ndx + 1).indexOf("src=") != -1) {
                    EUI._sysIncludeJs4HtmlContent(_script);
                } else {
                    if (_script.indexOf("/*rptclientjs*/") > -1) {
                        var tempdiv = doc.createElement("div");
                        tempdiv.innerHTML = _script;
                        node.appendChild(tempdiv.firstChild);
                        tempdiv = null;
                        continue;
                    }
                    _script = _script.substring(ndx + 1, _script.length - "<\/script>".length);
                    EUI.execJavaScript(_script, wnd);
                }
            }
        },
        setDivPos: function(div, x, y) {
            if (browser.isie) {
                div.style.pixelTop = y;
                div.style.pixelLeft = x;
            } else {
                div.style.top = y + "px";
                div.style.left = x + "px";
            }
        },
        getCursorPosition: function(e, wnd) {
            wnd = wnd && typeof (wnd) == "object" ? wnd : window;
            if (!e) {
                e = wnd.event;
            }
            if (!e) {
                e = es_tryfetch_getEvent();
            }
            if (!!e) {
                return {
                    x: e.clientX,
                    y: e.clientY
                };
            }
            return null;
        },
        addScript: function(doc, src, scriptLoaded) {
            var _head = doc.getElementsByTagName("head");
            var hasHead = _head && _head.length > 0;
            if (hasHead) {
                if (EUI.findScript(doc, src) != -1) {
                    return;
                }
                var __head = _head[0];
                var _script = doc.createElement("script");
                if (scriptLoaded) {
                    _script.onload = scriptLoaded;
                    __head.appendChild(_script);
                    _script.src = src;
                } else {
                    __head.appendChild(_script);
                    _script.src = src;
                }
            }
        },
        addScripts: function(doc, jsurl, needpath) {
            if (!jsurl) {
                return;
            }
            needpath = EUI.parseBool(needpath, true);
            if (!EUI.isArray(jsurl)) {
                jsurl = jsurl.split(",");
            }
            jsurl.forEach(function(url, index) {
                jsurl[index] = url.ensureNotEndWith(".js");
            });
            if (window.define.amd) {
                require(jsurl);
            } else {
                jsurl.forEach(function(url, index) {
                    EUI.addScript(doc, (needpath ? EUI.getContextPath() : "") + url + ".js");
                });
            }
        },
        addStyle: function(doc, name, callback) {
            var _head = doc.getElementsByTagName("head");
            var hasHead = _head && _head.length > 0;
            if (hasHead) {
                if (EUI.findStyle(doc, name) != -1) {
                    return;
                }
                var __head = _head[0];
                var _link = __head.appendChild(doc.createElement("link"));
                _link.rel = "stylesheet";
                _link.type = "text/css";
                if (typeof (callback) === "function") {
                    _link.onload = callback;
                }
                _link.href = name;
            }
        },
        addStyleSheet: function(css, id, wnd) {
            if (!wnd) {
                wnd = window;
            }
            var doc = wnd.document
              , rules = doc.getElementById(id)
              , ss = null;
            if (!rules) {
                var head = doc.getElementsByTagName("head")[0];
                rules = doc.createElement("style");
                rules.setAttribute("type", "text/css");
                if (id) {
                    rules.setAttribute("id", id);
                }
                head.appendChild(rules);
            }
            if (rules.styleSheet) {
                ss = rules.styleSheet;
                ss.cssText += css;
            } else {
                try {
                    rules.appendChild(doc.createTextNode(css));
                } catch (e) {
                    rules.cssText += css;
                }
                ss = rules.styleSheet ? rules.styleSheet : (rules.sheet || doc.styleSheets[doc.styleSheets.length - 1]);
            }
            return ss;
        },
        findScript: function(doc, src) {
            var _script = doc.getElementsByTagName("script");
            if (!_script) {
                return;
            }
            var count = _script.length;
            for (var i = 0; i < count; i++) {
                if (_script[i].src.indexOf(src) != -1) {
                    return i;
                }
            }
            return -1;
        },
        findStyle: function(doc, name) {
            var _link = doc.getElementsByTagName("link");
            if (!_link) {
                return;
            }
            var count = _link.length;
            for (var i = 0; i < count; i++) {
                if (_link[i].href.indexOf(name) != -1) {
                    return i;
                }
            }
            return -1;
        },
        addClassName: function(dom, className) {
            if (!dom || !className) {
                return;
            }
            var clsNames = dom.className;
            if (arguments[2] === true) {
                if (clsNames) {
                    if (clsNames.split(" ").indexOf(className) !== -1) {
                        return;
                    }
                    className = clsNames + " " + className;
                }
                dom.className = className;
            } else {
                clsNames = clsNames ? clsNames.split(" ") : [];
                className.split(" ").forEach(function(clsName) {
                    if (clsName && this.indexOf(clsName) === -1) {
                        this.push(clsName);
                    }
                }, clsNames);
                dom.className = clsNames.join(" ");
            }
        },
        removeClassName: function(dom, className) {
            if (!dom || !className) {
                return;
            }
            var clsNames = dom.className;
            if (!clsNames) {
                return;
            }
            clsNames = clsNames.split(" ");
            if (arguments[2] === true) {
                var index = clsNames.indexOf(className);
                if (index === -1) {
                    return;
                }
                clsNames.splice(index, 1);
            } else {
                className.split(" ").forEach(function(clsName) {
                    var index = this.indexOf(clsName);
                    if (index !== -1) {
                        this.splice(index, 1);
                    }
                }, clsNames);
            }
            dom.className = clsNames.join(" ");
        },
        hasClassName: function(dom, className) {
            if (!dom || !className) {
                return;
            }
            var clsNames = dom.className;
            if (!clsNames) {
                return false;
            }
            return clsNames.split(" ").indexOf(className) !== -1;
        },
        toggleClassName: function(dom, className) {
            if (!dom || !className) {
                return;
            }
            var toggleClsNames = className.split(" ");
            if (toggleClsNames.length > 1) {
                toggleClsNames.forEach(function(className) {
                    toggleClassName(this, className);
                }, dom);
                return;
            }
            var clsNames = (dom.className || "").split(" ")
              , index = clsNames.indexOf(className)
              , rt = null;
            if (index === -1) {
                clsNames.push(className);
                rt = true;
            } else {
                clsNames.splice(index, 1);
                rt = false;
            }
            dom.className = clsNames.join(" ");
            return rt;
        },
        getChildNodeAt: function(node, tagName, index) {
            if (!node) {
                return null;
            }
            index = parseInt(index) || 0;
            var child = node.firstChild
              , idx = -1;
            if (!tagName) {
                tagName = false;
            }
            while (child) {
                var nodeName = child.tagName;
                if (nodeName && (!tagName || nodeName.equalsIgnoreCase(tagName))) {
                    idx++;
                    if (idx === index) {
                        return child;
                    }
                }
                child = child.nextSibling;
            }
            return null;
        },
        getActiveElement: function(doc, e) {
            if (!doc) {
                doc = document;
            }
            if (!e) {
                e = window.event;
            }
            return doc.activeElement ? doc.activeElement : e.explicitOriginalTarget;
        },
        domIsParent: function(p, c) {
            if (!c || !p || c == p) {
                return false;
            }
            var pp = c.parentNode;
            var body = p.ownerDocument.body;
            while (pp && pp != p && pp != body) {
                pp = pp.parentNode;
            }
            return pp == p;
        },
        getFirstChild: function(dom) {
            if (!dom) {
                return null;
            }
            var firstChild = dom.firstChild;
            if (!firstChild) {
                return null;
            }
            if (firstChild.nodeType == 1) {
                return firstChild;
            }
            return EUI.getNextElementSibling(firstChild);
        },
        getDomChildNodes: function(dom) {
            var arr = new Array();
            if (!dom) {
                return arr;
            }
            var cs = dom.childNodes;
            for (var i = 0; i < cs.length; i++) {
                var node = cs[i];
                if (node.nodeType != 1) {
                    continue;
                }
                arr.push(node);
            }
            return arr;
        },
        getWndOfDom: function(dom) {
            return dom && dom.ownerDocument ? (browser.isie ? dom.ownerDocument.parentWindow : dom.ownerDocument.defaultView) : window;
        },
        getWndOfDoc: function(doc) {
            return doc ? (browser.isie ? doc.parentWindow : doc.defaultView) : window;
        },
        getCurrentStyle: function(obj, prop) {
            var index = null;
            if (obj.currentStyle) {
                prop = prop.replace(/-[a-z]/g, function($) {
                    return $.charAt(1).toUpperCase();
                });
                index = obj.currentStyle[prop];
            } else {
                if (window.getComputedStyle) {
                    var cst = EUI.getWndOfDom(obj).getComputedStyle(obj, "");
                    if (cst) {
                        prop = prop.replace(/[A-Z]/g, "-$&").toLowerCase();
                        index = cst.getPropertyValue(prop);
                    }
                }
            }
            return index;
        },
        execDomEvent: function(node, evtType) {
            try {
                if (node[evtType]) {
                    node[evtType]();
                } else {
                    var doc = node.ownerDocument
                      , wnd = doc.parentWindow || doc.defaultView;
                    var evObj = doc.createEvent("MouseEvents");
                    evObj.initMouseEvent(evtType, true, true, wnd);
                    node.dispatchEvent(evObj);
                }
            } catch (e) {}
        },
        getKeyCode: function(e, wnd) {
            wnd = wnd && typeof (wnd) == "object" ? wnd : window;
            if (!e) {
                e = wnd.event;
            }
            return e.keyCode;
        },
        getTarget: function(wnd, e) {
            wnd = wnd ? wnd : window;
            e = e ? e : wnd.event;
            if (!e) {
                return null;
            }
            return e.srcElement ? e.srcElement : e.target;
        },
        getTargetId: function(e, wnd) {
            var target = EUI.getTarget(wnd, e);
            if (!target) {
                return null;
            }
            return target.id;
        },
        moveCursorTo: function(p, callback) {
            if (typeof (p) != "object") {
                return;
            }
            var _pos = 0;
            var ctr = p.createTextRange();
            if (callback && typeof (callback) == "function") {
                _pos = callback(ctr);
            }
            ctr.moveStart("character", typeof (_pos) == "number" ? _pos : 0);
            ctr.collapse(true);
            ctr.select();
            return ctr;
        },
        setFocus: function(focusid) {
            if (typeof (focusid) == "string") {
                focusid = document.getElementById(focusid);
            }
            if (typeof (focusid) == "object") {
                try {
                    focusid.focus();
                } catch (e) {}
            }
        },
        onFocus: function(id, focusid) {
            if (id && typeof (id) == "string" && id.lenght > 0) {
                id = document.getElementById(id);
            }
            if (focusid && typeof (focusid) == "string" && focusid.lenght > 0) {
                focusid = document.getElementById(focusid);
            }
            if (typeof (id) != "object" || typeof (focusid) != "object") {
                return;
            }
            id.onkeydown = function(e) {
                if (!e) {
                    e = EUI.getWndOfDom(id).event;
                }
                if (e.keyCode == 13) {
                    try {
                        focusid.focus();
                    } catch (e) {}
                }
            }
            ;
        },
        onEnter: function(id, func) {
            if (id && typeof (id) == "string" && id.length > 0) {
                id = document.getElementById(id);
            }
            if (typeof (id) != "object") {
                return;
            }
            id.onkeydown = function(e) {
                if (!e) {
                    e = EUI.getWndOfDom(id).event;
                }
                if (e.keyCode == 13) {
                    if (typeof (func) == "function") {
                        func();
                    } else {
                        if (typeof (func) == "string") {
                            eval(func);
                        }
                    }
                }
            }
            ;
        },
        isChildNode: function(pnode, cnode, same, level) {
            if (!pnode || !cnode) {
                return false;
            }
            if (pnode === cnode) {
                return !!same;
            }
            level = parseInt(level);
            if (isNaN(level)) {
                do {
                    cnode = cnode.parentNode;
                    if (cnode === pnode) {
                        return true;
                    }
                } while (cnode);
            } else {
                do {
                    cnode = cnode.parentNode;
                    if (cnode === pnode) {
                        return true;
                    }
                } while (cnode && (--level) > 0);
            }
            return false;
        },
        getNextElementSibling: function(node) {
            var next = node.nextElementSibling;
            if (next) {
                return next;
            }
            next = node.nextSibling;
            while (next && next.nodeType !== 1) {
                next = next.nextSibling;
            }
            return next;
        },
        getZoomnumFromWin: function(wnd) {
            wnd = wnd ? wnd : window;
            var w = wnd.screen.width;
            var zoomnum = 0;
            return zoomnum = w / 1024;
        },
        getDomValue: function(dom) {
            switch (dom.tagName.toUpperCase()) {
            case "INPUT":
            case "TEXTAREA":
                return dom.value;
            case "DIV":
            case "TD":
            case "A":
            case "SPAN":
            case "NOBR":
                return EUI.getTextContent(dom);
            case "SELECT":
                return dom.options[dom.selectedIndex].text;
            default:
                EUI.throwError(I18N.getString("xui.util.js.21", "不能识别的dom元素"));
            }
        },
        setDomValue: function(dom, value, enabled, isSelectValue) {
            switch (dom.tagName.toUpperCase()) {
            case "INPUT":
            case "TEXTAREA":
                if (value != null) {
                    dom.value = value;
                }
                break;
            case "DIV":
            case "TD":
            case "A":
            case "SPAN":
            case "NOBR":
                if (value != null) {
                    if (value == null || value.length == 0 || value.equalsIgnoreCase("null")) {
                        EUI.setTextContent(dom, "");
                    } else {
                        EUI.setTextContent(dom, value);
                    }
                }
                break;
            case "SELECT":
                if (value != null) {
                    if (EUI.isNumber(value)) {
                        dom.selectedIndex = value;
                    } else {
                        var options = dom.options;
                        var len = options.length;
                        var option;
                        for (var i = 0; i < len; i++) {
                            option = options[i];
                            if ((isSelectValue ? option.value : option.text) == value) {
                                dom.selectedIndex = i;
                                break;
                            }
                        }
                    }
                }
                break;
            default:
                EUI.throwError(I18N.getString("xui.util.js.11", "不能识别的dom元素"));
            }
            if (EUI.isBoolean(enabled)) {
                dom.disabled = !enabled;
            }
        },
        getBackGroundIFrame: function(doc) {
            if (!doc) {
                doc = document;
            }
            var ifms = doc.getElementsByTagName("iframe");
            var ifm;
            for (var i = 0; ifms && i < ifms.length; i++) {
                ifm = ifms[i];
                if (ifm.id == "SAN_BACKGROUND_IFRAME_ID" && ifm.style.left == "-99999px" && ifm.style.top == "0px") {
                    return ifm;
                }
            }
            ifm = doc.createElement("iframe");
            ifm.id = "SAN_BACKGROUND_IFRAME_ID";
            ifm.setAttribute("frameborder", "0", 0);
            ifm.setAttribute("marginheight", "0", 0);
            ifm.setAttribute("marginwidth", "0", 0);
            ifm.style.cssText += ";position:absolute; left:-99999px; top:0; zIndex:-1;";
            ifm.style.display = "";
            doc.body.appendChild(ifm);
            return ifm;
        },
        showBackGroundIFrame: function(dom, visible, extsize) {
            if (!browser.isie) {
                return;
            }
            if (visible) {
                var ifm = dom._back_ground_iframe;
                if (!ifm) {
                    ifm = EUI.getBackGroundIFrame(dom.ownerDocument);
                }
                if (ifm.parentNode != dom.parentNode) {
                    ifm.parentNode.removeChild(ifm);
                    dom.parentNode.appendChild(ifm);
                }
                extsize = parseInt(extsize, 10) || 0;
                var zIndex = EUI.getCurrentStyle(dom, "zIndex");
                var _sty = ifm.style;
                _sty.cssText += ";left: " + dom.offsetLeft + "px;top:" + dom.offsetTop + "px;width:" + (extsize + dom.offsetWidth) + "px;height:" + (extsize + dom.offsetHeight) + "px;";
                _sty.display = "";
                _sty.zIndex = EUI.isNumber(zIndex) ? zIndex - 1 : -1;
                dom._back_ground_iframe = ifm;
                ifm._in_used = true;
                return ifm;
            } else {
                var ifm = dom._back_ground_iframe;
                dom._back_ground_iframe = null;
                if (!ifm) {
                    return;
                }
                ifm._in_used = false;
                var _sty = ifm.style;
                _sty.cssText += ";left: -99999px;top:0;width:0;height:0;z-index:0;";
                _sty.display = "";
                if (ifm.parentNode != ifm.ownerDocument.body) {
                    ifm.parentNode.removeChild(ifm);
                    ifm.ownerDocument.body.appendChild(ifm);
                }
            }
        },
        disableDocTextSelect: function(container, can) {
            container = container || document.body;
            if (EUI.isUndefined(can)) {
                can = false;
            }
            if (container.getAttribute("_selectabletype_") === (EUI.isBoolean(can) ? (can + "") : (can || ""))) {
                return false;
            }
            container.setAttribute("_selectabletype_", can);
            if (can === "text" || can === "all") {
                container.style.cssText += ["; -moz-user-select:", "; -o-user-select: ", "; -khtml-user-select: ", "; -webkit-user-select: ", "; -ms-user-select:", "; user-select:", ";"].join(can);
                if (browser.isie) {
                    container.setAttribute("_selectable_", true);
                    container.onselectstart = null;
                }
            } else {
                if (can = can && can !== "none") {
                    container.style.cssText = container.style.cssText.replace(/(?:[; ]+|^)(?:-moz-|-o-|-khtml-|-webkit-|-ms-)?(?:user-select):[^;]+(;|$)/gi, ";");
                    if (browser.isie) {
                        container.removeAttribute("_selectable_");
                        container.onselectstart = null;
                    }
                } else {
                    container.style.cssText += ["; -moz-user-select:", "; -o-user-select: ", "; -khtml-user-select: ", "; -webkit-user-select: ", "; -ms-user-select:", "; user-select:", ";"].join("none");
                    if (browser.isie) {
                        container.removeAttribute("_selectable_");
                        container.onselectstart = function(evt) {
                            if (!evt) {
                                evt = getWndOfDom(this).event;
                            }
                            if (!evt) {
                                return;
                            }
                            var target = evt.srcElement || evt.target;
                            if (target.nodeType === 3) {
                                target = target.parentNode;
                            }
                            if (["input", "textarea"].indexOf(target.nodeName.toLowerCase()) !== -1) {
                                return;
                            }
                            while (target !== this) {
                                if (target.getAttribute("_selectable_")) {
                                    return;
                                }
                                target = target.parentNode;
                            }
                            return false;
                        }
                        ;
                    }
                }
            }
        },
        setCursorPosition: function(ctrl, pos, end) {
            if (ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(pos, end ? end : pos);
            } else {
                if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd("character", end ? end : pos);
                    range.moveStart("character", pos);
                    range.select();
                }
            }
        },
        insertAtCursor: function(edit, value) {
            try {
                edit.focus();
            } catch (e) {}
            if (document.selection) {
                document.selection.createRange().text = value;
            } else {
                if (edit.selectionStart || edit.selectionStart == 0) {
                    var oldSelectionStart = edit.selectionStart + value.length;
                    edit.value = edit.value.substring(0, edit.selectionStart) + value + edit.value.substring(edit.selectionEnd);
                    edit.setSelectionRange(oldSelectionStart, oldSelectionStart);
                } else {
                    edit.value += value;
                }
            }
        },
        selectValue: function(dom) {
            if (dom.disabled) {
                return;
            }
            try {
                if (!browser.isChrome) {
                    dom.focus();
                }
                dom.select();
            } catch (e) {}
        },
        maxDomSize: function(id) {
            var dom = document.getElementById(id);
            var p = dom.parentNode;
            if (p.clientWidth == 0 || p.clientHeight == 0) {
                return;
            }
            if (dom.width == null) {
                dom.style.width = p.clientWidth;
                dom.style.height = p.clientHeight;
            } else {
                dom.width = p.clientWidth;
                dom.height = p.clientHeight;
            }
        },
        appendTable: function(doc, pe) {
            var obj = doc.createElement("table");
            obj.border = 0;
            obj.cellPadding = 0;
            obj.cellSpacing = 0;
            return pe ? pe.appendChild(obj) : obj;
        },
        appendTbody: function(doc, table) {
            var obj = doc.createElement("tbody");
            return table ? table.appendChild(obj) : obj;
        },
        appendRow: function(doc, tbody) {
            var obj = doc.createElement("tr");
            return tbody ? tbody.appendChild(obj) : obj;
        },
        appendCell: function(doc, row) {
            var obj = doc.createElement("td");
            return row ? row.appendChild(obj) : obj;
        },
        getActiveTdElement: function() {
            if (!browser.isie) {
                return null;
            }
            var e = document.activeElement;
            if (!"TD".equalsIgnoreCase(e.tagName)) {
                e = e.parentElement;
                if (e && !"TD".equalsIgnoreCase(e.tagName)) {
                    e = e.parentElement;
                    if (e && !"TD".equalsIgnoreCase(e.tagName)) {
                        return null;
                    }
                }
            }
            return e;
        },
        getRowColFromName: function(name) {
            var col = -1;
            var len = name.length;
            var i = 0;
            for (; i < len; i++) {
                var c = name.charCodeAt(i);
                if (c <= 57 && c >= 48) {
                    break;
                }
                col = (col + 1) * 26 + (c - 65);
            }
            var row = i - 1 < len ? parseInt(name.substring(i)) - 1 : -1;
            return [row, col];
        },
        getRowFromName: function(name) {
            return EUI.getRowColFromName(name)[0];
        },
        getColFromName: function(name) {
            return EUI.getRowColFromName(name)[1];
        },
        getEventSpecialKey: function(evt) {
            if (!evt) {
                return 0;
            }
            var keyByte = 0;
            if (evt.ctrlKey) {
                keyByte = keyByte | 1;
            }
            if (evt.shiftKey) {
                keyByte = keyByte | 2;
            }
            if (evt.altKey) {
                keyByte = keyByte | 4;
            }
            return keyByte;
        },
        transStr2Function: function(evtstr, option) {
            var getHandler = function(obj, names) {
                names = names.split(".");
                for (var i = 0, len = names.length; obj && i < len; i++) {
                    obj = obj[names[i]];
                }
                return typeof (obj) == "function" ? obj : null;
            };
            transStr2Function = function(evtstr, option) {
                if (!evtstr) {
                    return null;
                }
                var type = typeof (evtstr);
                if (type != "string") {
                    return type == "function" ? evtstr : null;
                }
                if (!evtstr.trim()) {
                    return null;
                }
                var func = null;
                try {
                    if (/^\w+(\.\w+)*$/.test(evtstr)) {
                        var objs = null;
                        if (option) {
                            objs = option["objs"];
                        }
                        if (!objs) {
                            objs = [window];
                        } else {
                            if (!EUI.isArray(objs)) {
                                objs = [objs];
                            }
                        }
                        for (var i = 0, len = objs.length; !func && i < len; i++) {
                            func = getHandler(objs[i], evtstr);
                        }
                    } else {
                        evtstr = evtstr.replace(/^\/\/.*(\r\n|\n|$)/mg, "");
                        if (/^function\s*\(/.test(evtstr)) {
                            func = window.eval("(function(){\r\n return " + evtstr + "\r\n})()");
                        } else {
                            var args = null;
                            if (option) {
                                args = option["args"];
                            }
                            if (!args) {
                                args = ["p"];
                            } else {
                                if (Object.prototype.toString.call(args) != "[object Array]") {
                                    args = [args];
                                }
                            }
                            args.push(evtstr);
                            func = Function.apply(this, args);
                        }
                    }
                } catch (e) {
                    e.message = I18N.getString("esmain.pagedesigner.js.portalutil.js.wrongis", "错误：") + '<span style="color: red">' + e.message + "</span>\r\n" + '<div style="padding: 0px 30px;color:#666">' + I18N.getString("esmain.pagedesigner.js.portalutil.js.checkformat", "请检查自定义事件格式，内容如下：") + "\r\n" + '<pre style="padding: 3px 10px;color: #333;font-family:Verdana !important">' + evtstr + "</pre></div>";
                    EUI.showError(e);
                }
                return func || null;
            }
            ;
            return transStr2Function(evtstr, option);
        },
        getTextContent4Xml: function(p) {
            if (!p) {
                return null;
            }
            return (browser.isie ? (p.text || p.nodeTypedValue || p.textContent) : p.textContent) || "";
        },
        serialize2String: function(node, charset) {
            var xmlrs = charset ? '<?xml version="1.0" encoding="' + charset + '"?>' : "", xmlstr;
            try {
                xmlstr = new XMLSerializer().serializeToString(node);
            } catch (e) {
                xmlstr = node.xml;
            }
            if (EUI.isString(xmlstr) && xmlstr.startsWith("<?")) {
                xmlstr = xmlstr.substring(xmlstr.indexOf("<", 1));
            }
            return xmlrs + xmlstr;
        },
        getXmlNodeProperty: function(xmlnode, name, defvalue) {
            if (!xmlnode) {
                return;
            }
            if (typeof (xmlnode) == "string") {
                xmlnode = EUI.loadXMLString(null, xmlnode);
            }
            var rs = xmlnode.getAttribute(name);
            return rs ? rs : defvalue;
        },
        createPngImg: function(imgurl, pdom) {
            var rs = document.createElement("img");
            rs.src = img;
            rs.border = 0;
            return pdom ? pdom.appendChild(rs) : rs;
        },
        InnerHTML2Edit: function(p, editdom, isExtInfo) {
            if (typeof (p) == "string" && p.length > 0) {
                p = document.getElementById(p);
            }
            if (typeof (editdom) == "string" && editdom.length > 0) {
                editdom = document.getElementById(editdom);
            }
            if (typeof (editdom) == "object" && editdom.tagName && "INPUT".equalsIgnoreCase(editdom.tagName) && typeof (p) == "object") {
                isExtInfo = EUI.parseBool(isExtInfo, false);
                editdom.style.color = "#000000";
                editdom.value = isExtInfo ? p.extInfo : p.innerHTML;
            }
        },
        inputElement: function(doc, type, name, initValue, ischecked) {
            doc = doc ? doc : document;
            type = !type ? "text" : type.toLowerCase();
            var canChecked = type == "radio" || type == "checkbox";
            var _chk = typeof (ischecked) == "boolean" ? ischecked : false;
            var id = EUI.idRandom(type);
            var tmp = doc.createElement("div");
            tmp.innerHTML = '<input type="' + type + '" name="' + (name ? name : id) + '" id="' + id + '"' + (canChecked && _chk ? " checked" : "") + (initValue ? ' value="' + initValue + '"' : "") + "/>";
            var t = tmp.firstChild;
            tmp = null;
            return t;
        },
        buttonElement: function(doc, text, type, click, cls) {
            var tmp = doc.createElement("div");
            tmp.innerHTML = '<button class="eui-btn ' + (cls || "") + '" type="' + (type || "button") + '">' + (text || "") + "</button>";
            var btn = tmp.firstChild;
            tmp = null;
            if (click) {
                btn.onclick = click;
            }
            return btn;
        },
        showHintMessage: function(dom, icon, msg, detaillogs) {
            var doc = document;
            var parentElement = typeof (dom) == "string" ? doc.getElementById(dom) : (typeof (dom) == "object" ? dom : doc.body);
            if (parentElement._showmessage == null) {
                var table = doc.createElement("table");
                table.border = 0;
                table.cellSpacing = 2;
                table.cellPadding = 0;
                table.style.cssText += ";width:100%; border:1px dashed #aca899; background-color:#fffff1;";
                var row = table.insertRow(-1);
                var cell = row.insertCell(-1);
                cell.vAlign = "top";
                cell.style.cssText += ";height:1%; padding:2px; background-color:#ffcccc;";
                var img = cell.appendChild(doc.createElement("img"));
                img.align = "absMiddle";
                img.style.cssText += ";float:left;";
                if (icon != null) {
                    src = icon;
                } else {
                    src = "ebi/images/warning.gif";
                }
                img.onclick = function() {
                    eval("hideHintMessage(parentElement)");
                }
                ;
                table.img = img;
                var a = cell.appendChild(doc.createElement("a"));
                a.className = "Blink";
                a.href = "javascript:;";
                a.style.cssText += ";float:left;";
                a.onclick = function() {
                    var style = a.parentNode.parentNode.parentNode.parentNode.rows[1].style;
                    style.display = style.display == "none" ? "" : "none";
                }
                ;
                table.a = a;
                var div = cell.appendChild(doc.createElement("div"));
                table.text = div;
                row = table.insertRow(-1);
                table.row = row;
                row.style.display = "none";
                cell = row.insertCell(-1);
                cell.vAlign = "top";
                cell.style.cssText += ";height:150px;padding:2px;";
                div = cell.appendChild(doc.createElement("div"));
                div.style.cssText += ";position:relative; width:100%; height:100%; overflow:hidden;";
                div = div.appendChild(doc.createElement("div"));
                div.style.cssText += ";position:absolute; width:100%; height:100%; overflow:auto;";
                table.detail = div;
                parentElement._showmessage = table;
                parentElement.appendChild(table);
            }
            var setvalue = function(dom, value) {
                if (value == null || value.length == 0) {
                    dom.innerHTML = "&nbsp;";
                } else {
                    EUI.setTextContent(dom, value);
                }
            };
            var table = parentElement._showmessage;
            if (detaillogs == null) {
                table.a.style.display = "none";
                table.text.style.display = "";
                setvalue(table.text, msg);
            } else {
                table.a.style.display = "";
                table.text.style.display = "none";
                setvalue(table.a, msg);
                setvalue(table.detail, detaillogs);
            }
            table.row.style.display = "none";
            table.style.display = "";
        },
        hideHintMessage: function(dom) {
            var parentElement = typeof (dom) == "string" ? document.getElementById(dom) : (typeof (dom) == "object" ? dom : this.doc.body);
            if (parentElement._showmessage != null) {
                parentElement._showmessage.style.display = "none";
            }
        },
        openIframeUrl: function(url, wnd, params) {
            var contextPath = EUI.getContextPath();
            url = url.ensureStartWith(contextPath);
            wnd = wnd || EUI.getRootWindow();
            var doc = wnd.document
              , body = wnd.document.body
              , hef = new EUI.HtmlElementFactory(wnd)
              , rs = wnd["__OpenIframeUrlForm__"];
            if (!rs) {
                rs = wnd["__OpenIframeUrlForm__"] = body.appendChild(hef.form("$openIframeUrlForm", null, "post", null, true));
                rs.style.display = "none";
            }
            var iframeDoc = rs.getIFrame().contentWindow.document;
            if (browser.isie && iframeDoc.charset.toLowerCase() != "utf-8") {
                iframeDoc.charset = "utf-8";
            }
            var count = rs.childNodes.length;
            if (count > 0) {
                var pnode;
                for (var i = count - 1; i >= 0; i--) {
                    pnode = rs.childNodes[i];
                    if (pnode.nodeType != 1 || pnode.tagName.toLowerCase() == "iframe") {
                        continue;
                    }
                    rs.removeChild(pnode);
                }
            }
            rs.setAction(url);
            if (params) {
                var keys = params.keySet();
                var key;
                for (var i = 0, len = keys.length; i < len; i++) {
                    key = keys[i];
                    if (!key) {
                        continue;
                    }
                    rs.appendChild(hef.hidden(params.get(key), key));
                }
            }
            rs.submit();
        },
        autoCloseBrowser: function(wnd) {
            if (!wnd || !wnd.navigator) {
                wnd = window;
            }
            wnd.close();
        },
        addVerticalLine: function(doc, parentElement, size, color, notInner) {
            notInner = EUI.parseBool(notInner, false);
            var _color = typeof (color) == "string" && color.length > 0 ? color : "#ACA899";
            var lineContainer = doc.createElement("div");
            if (_color == "#ACA899") {
                lineContainer.className = "verticalline_container verticalline_container_color";
            } else {
                lineContainer.className = "verticalline_container";
                lineContainer.style.borderLeftColor = _color;
            }
            lineContainer.style.height = size ? (EUI.isNumber(size) ? size + "px" : size) : "100%";
            if (!notInner) {
                var line = lineContainer.appendChild(lineContainer.cloneNode(false));
                line.className = "verticalline_line_notinner";
            }
            return parentElement ? parentElement.appendChild(lineContainer) : lineContainer;
        },
        getEComponentByDom: function(relEl, classobj) {
            if (!relEl) {
                return null;
            }
            var isnull = !classobj
              , isfunc = !isnull && EUI.isFunction(classobj)
              , sancomponent = null;
            while (relEl) {
                if (sancomponent = relEl._sancomponent) {
                    if (isnull || (isfunc ? sancomponent instanceof classobj : typeof (sancomponent[classobj]) == "function")) {
                        return sancomponent;
                    }
                }
                relEl = relEl.parentNode;
            }
        },
        setTagIcon: function(dom, icon) {
            if (!icon) {
                dom.innerHTML = "";
                return;
            }
            if (/^.+\.\w{2,4}$/.test(icon)) {
                EUI.addClassName(dom, "eui-icon-img");
                dom.innerHTML = "";
                dom.style.backgroundImage = "url('" + EUI.formatUrl(icon) + "')";
                return;
            }
            dom.style.backgroundImage = "";
            EUI.removeClassName(dom, "eui-icon-img");
            if (icon.startsWith("svg-")) {
                dom.innerHTML = '<svg class="eui-icon-svg" aria-hidden="true"><use xlink:href="#eui-icon-' + icon + '"></use></svg>';
            } else {
                if (icon.startsWith("#")) {
                    dom.id = icon.substring(1);
                } else {
                    if (icon.startsWith(".")) {
                        EUI.addClassName(dom, icon.substring(1));
                    } else {
                        if (/^&#\w{5};$/.test(icon) || icon.length === 1) {
                            dom.innerHTML = icon;
                        }
                    }
                }
            }
        },
        getScrollbarWidth: function() {
            if (!EUI.isNumber(_domscrollwidth)) {
                _getDomscrollwidth();
            }
            return _domscrollwidth || 0;
        },
        _styles2String4HtmlContent: function(p) {
            if (!p || p.length < 1) {
                return "";
            }
            var rs;
            var tmp;
            for (var i = 0; i < p.length; i++) {
                tmp = p[i];
                if (!rs) {
                    rs = [];
                }
                rs.push(tmp.substring(tmp.indexOf(">") + 1, tmp.indexOf("</style>")));
            }
            return rs.join("\n");
        },
        _sysIncludeJs4HtmlContent: function(p) {
            if (!p) {
                return;
            }
            var _exp = /src=("|')([^\"]*?.js)("|')/gi;
            var _scripts = p.match(_exp);
            var tmp;
            for (var i = 0; _scripts && i < _scripts.length; i++) {
                tmp = _scripts[i];
                EUI.include(tmp.substring(5, tmp.length - 1));
            }
        },
        _getMouseEventTarget: function(e) {
            return e.srcElement ? e.srcElement : e.target;
        },
        _getBorderSize: function(dom, idx) {
            var names = ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"];
            return (parseInt(EUI.getCurrentStyle(dom, names[idx])) || 0) + (parseInt(EUI.getCurrentStyle(dom, names[idx + 2])) || 0);
        },
        _getMouseEventEComponent: function(e, classobj) {
            var relEl;
            if (!e.target) {
                if (e.type == "mouseover") {
                    relEl = e.fromElement;
                } else {
                    if (e.type == "mouseout") {
                        relEl = e.toElement;
                    } else {
                        relEl = e.srcElement;
                    }
                }
            } else {
                relEl = e.target;
            }
            try {
                return EUI.getEComponentByDom(relEl, classobj);
            } catch (ex) {
                return null;
            }
        },
        _recoverHiddenParents: function(hiddens) {
            if (!hiddens) {
                return;
            }
            for (var i = 0, len = hiddens.length; i < len; i++) {
                var hide = hiddens[i];
                hide["dom"].style.display = hide["disp"];
            }
            return true;
        },
        _getHiddenParents: function(dom) {
            var rt = []
              , STYLE_NAME = "display"
              , STYLE_VALUE = "none";
            while (dom && dom.nodeType === 1) {
                if (STYLE_VALUE === EUI.getCurrentStyle(dom, STYLE_NAME)) {
                    rt.push({
                        dom: dom,
                        disp: dom.style.display
                    });
                    dom.style.display = "block";
                }
                dom = dom.parentNode;
            }
            return rt;
        },
        _getPaddingSize: function(dom, idx) {
            var names = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];
            return (parseInt(EUI.getCurrentStyle(dom, names[idx])) || 0) + (parseInt(EUI.getCurrentStyle(dom, names[idx + 2])) || 0);
        }
    });
    EUI.DomUtil = (function($, _) {
        var CHAR_NEWLINE = "\r\n"
          , CHAR_TAB = "\t"
          , CHAR_BLANK = " "
          , CHAR_EQU = "="
          , CHAR_QUOT = "'"
          , CHAR_LT = "<"
          , CHAR_LTR = "</"
          , CHAR_GT = ">"
          , CHAR_GTR = "/>"
          , CDATA_BEGIN = "<![CDATA["
          , CDATA_END = "]]>";
        function getSpace(num) {
            return CHAR_NEWLINE + (new Array((num || 0) + 1).join(CHAR_TAB));
        }
        function saveCDATA(array, value, index) {
            var space = getSpace(index || 0);
            array.push(space, CDATA_BEGIN, CHAR_NEWLINE, value, space, CDATA_END);
        }
        function saveAttr(array, name, value) {
            array.push(CHAR_BLANK, name, CHAR_EQU, CHAR_QUOT, value.toHTML(), CHAR_QUOT);
        }
        function saveTag(array, tagName, index, attributes, options) {
            if (!array) {
                array = [];
            }
            var space = getSpace(index);
            array.push(space, CHAR_LT, tagName);
            if (attributes) {
                for (var i = 0, attr = null, len = attributes.length; i < len; i++) {
                    attr = attributes[i];
                    saveAttr(array, attr["name"], attr["value"]);
                }
            }
            array.push(CHAR_GT);
            var startLen = array.length
              , childLen = 0;
            if (options) {
                var func = options["func"]
                  , args = options["args"] || [];
                if (typeof (func) === "function") {
                    if (args[0] !== array) {
                        args.unshift(array);
                    }
                    func.apply(options["scope"], args);
                }
                childLen = array.length - startLen;
                if (!childLen && options["fulltag"]) {
                    childLen = 1;
                }
            }
            if (!childLen) {
                array.pop();
                array.push(CHAR_GTR);
                return array;
            }
            if (childLen != 1) {
                array.push(space);
            }
            array.push(CHAR_LTR, tagName, CHAR_GT);
            return array;
        }
        var r_blankhtml = /\r|\n|\t/g;
        function doSaveChild(htmls, node, index, filter) {
            var childNode = node.firstChild
              , gt_one = index && childNode && (childNode.nextSibling !== null);
            while (childNode) {
                doSaveNode(htmls, childNode, index, filter, gt_one);
                childNode = childNode.nextSibling;
            }
        }
        function doSaveNode(htmls, node, index, filter, _) {
            if (typeof (filter) === "function" && filter(node, _) === false) {
                return;
            }
            switch (node.nodeType) {
            case 1:
                saveTag(htmls, node.tagName.toLowerCase(), index, node.attributes, {
                    func: doSaveChild,
                    args: [htmls, node, index + 1, filter],
                    scope: this
                });
                break;
            case 3:
                var nodeValue = node.nodeValue.replace(r_blankhtml, "");
                if (nodeValue) {
                    if (_ === true) {
                        htmls.push(getSpace(index));
                    }
                    htmls.push(nodeValue.toHTML());
                }
                break;
            }
        }
        function getChildHTML(node, filter) {
            var htmls = [];
            doSaveChild(htmls, node, 0, filter);
            return htmls.join("");
        }
        function getNodeHTML(node, filter) {
            var htmls = [];
            doSaveNode(htmls, node, 0, filter);
            return htmls.join("");
        }
        return {
            getNodeHTML: getNodeHTML,
            getChildHTML: getChildHTML
        };
    }
    )(window, "DomUtil");
}(window, EUI);
