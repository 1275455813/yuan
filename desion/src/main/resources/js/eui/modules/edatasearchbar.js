define(["eui/modules/uibase"], function(k) {
    var a = k.EComponent;
    function d(u) {
        u = u || {};
        u.width = u["width"] || 260;
        a.call(this, u);
        var t = this.parentElement
          , p = this.wnd
          , s = this.doc;
        var m = t.appendChild(s.createElement("div"));
        m.className = "eui-form-datasearch";
        m.style.cssText += (u["csstext4container"] || "") + "; width: " + this.width;
        var l = ['<input type="text"/>'];
        l.push('<span class="eui-form-datasearch-tip"></span>');
        l.push('<i class="eui-icon eui-form-datasearch-previous" title="上一个"></i>');
        l.push('<i class="eui-icon eui-form-datasearch-next" title="下一个"></i>');
        m.innerHTML = l.join("");
        var q = m.lastChild
          , n = q.previousSibling
          , o = n.previousSibling
          , r = o.previousSibling;
        $(r).bind("keyup.searchbar", this, g);
        $(m).bind("mousemove.searchbar", this, j).bind("mousedown.searchbar", this, c).bind("mouseup.searchbar", this, f).bind("mouseleave.searchbar", this, i);
        this._property = {
            container: m,
            btnprevious: n,
            btnnext: q,
            searchtip: o,
            edit: r,
            autosearch: EUI.parseBool(u["autosearch"], true),
            keywords: u["keywords"],
            datalist: u["datalist"],
            strict: EUI.parseBool(u["strict"], false),
            pattern: EUI.parseBool(u["ignore"], true) ? "i" : "",
            searchidxs: [],
            viewidx: -1
        };
    }
    EUI.extendClass(d, a, "EDataSearchBar");
    d.prototype.dispose = function() {
        var m = this._property
          , l = m["container"];
        $(l).add(m["edit"]).unbind(".searchbar");
        l.parentNode.removeChild(l);
        this._property = null;
        a.prototype.dispose.call(this);
    }
    ;
    d.prototype.setValue = function(m) {
        var l = this._property;
        l.edit.value = m || "";
        h(l);
    }
    ;
    d.prototype.getValue = function(l) {
        return this._property.edit.value;
    }
    ;
    d.prototype.search = function() {
        var r = this._property
          , q = r["datalist"];
        if (!q) {
            return;
        }
        if (r["__timeout_search__"]) {
            this.wnd.clearTimeout(r["__timeout_search__"]);
            r["__timeout_search__"] = false;
        }
        var p = r["edit"].value;
        if (!p) {
            h(r);
            return;
        }
        if (p === r["searchvalue"]) {
            this.next();
            return;
        }
        h(r);
        r["searchvalue"] = p;
        p = p.replace(/[\^\$\*\+\?\{\}\[\]\(\)\|\.\\]/g, "\\$&");
        p = r["strict"] ? new RegExp("^" + p + "$",r["pattern"]) : new RegExp(p,r["pattern"]);
        var m = r["searchidxs"]
          , o = r["searchtip"]
          , l = -1
          , n = r["keywords"];
        while (true) {
            if ((l = q.getIndex(p, n, l + 1, true)) === -1) {
                break;
            }
            m.push(l);
            q.setRowStyle(l, q.isEList ? "eui-elist-matchrow" : "eui-datalist-matchrow");
        }
        r["viewidx"] = -1;
        if (m.length) {
            this.next();
        } else {
            EUI.addClassName(o, "datasearch-tip-error");
            o.innerHTML = I18N.getString("eui.modules.edatasearchbar.js.countinfo", "{0}/{1}", [0, 0]);
        }
    }
    ;
    d.prototype.next = function() {
        return b(this, 1);
    }
    ;
    d.prototype.previous = function() {
        return b(this, -1);
    }
    ;
    d.prototype.setDataList = function(m) {
        var l = this._property;
        l["datalist"] = m;
        l["searchvalue"] = null;
        this.search();
    }
    ;
    d.prototype.setKeywords = function(l) {
        var m = this._property;
        m["keywords"] = l;
        m["searchvalue"] = null;
        this.search();
    }
    ;
    function h(m) {
        var l = m["searchtip"];
        EUI.removeClassName(l, "datasearch-tip-error");
        l.innerHTML = "";
        m["searchvalue"] = "";
        m["searchidxs"].length = 0;
        m["datalist"].setRowStyle();
    }
    function b(o, s) {
        var r = o._property
          , n = r["searchidxs"]
          , m = n.length;
        if (m === 0) {
            return;
        }
        var q = r["datalist"]
          , p = r["viewidx"];
        if (p !== -1) {
            q.setRowStyle(n[p], q.isEList ? "eui-elist-matchrow" : "eui-datalist-matchrow");
        }
        var l = n[p = r["viewidx"] = (p + s + m) % m];
        r["searchtip"].innerHTML = I18N.getString("eui.modules.edatasearchbar.js.countinfo", "{0}/{1}", [p + 1, m]);
        q.setRowStyle(l, q.isEList ? "eui-elist-activerow" : "eui-datalist-activerow");
        q.scrollToView(l);
        return l;
    }
    function g(l) {
        var m = l.data
          , o = m._property
          , p = l.keyCode;
        if (p === 13) {
            m.search();
        } else {
            if (o["autosearch"]) {
                if (o["searchvalue"] !== this.value) {
                    if (o["__timeout_search__"]) {
                        m.wnd.clearTimeout(o["__timeout_search__"]);
                    }
                    var n = o["__doSearch__"];
                    if (!n) {
                        n = o["__doSearch__"] = m.search.bind(m);
                    }
                    o["__timeout_search__"] = m.wnd.setTimeout(n);
                }
            }
        }
    }
    function j(m) {
        var o = m.data
          , p = o._property;
        if (p["__mousedown__"]) {
            return;
        }
        var q = m.target
          , l = p["__hovertarget__"];
        if (q.nodeType !== 1) {
            q = q.parentNode;
        }
        if (q === l) {
            return;
        }
        var n = 0;
        if (q === p["searchtip"]) {
            n = 1;
        } else {
            if (q === p["btnprevious"]) {
                n = 2;
            } else {
                if (q === p["btnnext"]) {
                    n = 3;
                }
            }
        }
        p["__hoverstate__"] = n;
        p["__hovertarget__"] = q;
    }
    function c(l) {
        var n = l.data
          , o = n._property
          , m = o["__hoverstate__"];
        if (m === 0) {
            return;
        }
        o["__mousedown__"] = true;
        e(o["edit"]);
        return false;
    }
    function f(l) {
        var n = l.data
          , o = n._property;
        if (o["__mousedown__"]) {
            o["__mousedown__"] = false;
            var m = o["__hoverstate__"];
            if (m === 2) {
                n.previous();
            } else {
                if (m === 3) {
                    n.next();
                }
            }
        }
    }
    var e = EUI.browser.isie ? function(l) {
        var m = l.value;
        l.value = "";
        l.focus();
        l.value = m;
    }
    : function(l) {
        l.focus();
    }
    ;
    function i(l) {
        var m = l.data
          , n = m._property;
        n["__mousedown__"] = false;
    }
    return {
        EDataSearchBar: d
    };
});
