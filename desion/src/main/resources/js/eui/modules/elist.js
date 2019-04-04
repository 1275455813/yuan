define(["eui/modules/uibase"], function(g, d) {
    var b = g.EComponent;
    function h(j) {
        if (!j) {
            return;
        }
        b.call(this, j);
        this.init(j);
    }
    EUI.extendClass(h, b, "EList");
    h.prototype.dispose = function() {
        if (this.resizePrecentColumnTimer) {
            this.wnd.clearTimeout(this.resizePrecentColumnTimer);
        }
        this.wnd.clearTimeout(this._filterTimer);
        this.unBindEvent();
        this.options = null;
        this.movespan = null;
        this.moveline = null;
        h._superClass.prototype.dispose.call(this);
    }
    ;
    h.prototype.isEList = true;
    h.prototype.init = function(w) {
        var j = []
          , v = w.parentElement
          , l = v.appendChild(this.doc.createElement("div"));
        this.basedom = l;
        l.className = "eui-elist-container " + (w.baseCss || "");
        j.push('<div class="eui-elist-header">');
        j.push('<table  cellspacing="0" cellpadding="0" border="0" class="eui-elist-headertable">');
        j.push("<thead></thead>");
        j.push("</table>");
        j.push("</div>");
        j.push('<div class="eui-elist-data">');
        j.push('<table cellspacing="0" cellpadding="0" border="0" class="eui-elist-datatable">');
        j.push("<colgroup></colgroup>");
        j.push("<tbody></tbody>");
        j.push("</table>");
        j.push('<div class="eui-elist-tips eui-hide"><span>无数据</span></div>');
        j.push("</div>");
        l.innerHTML = j.join("");
        var k = l.firstChild
          , t = k.nextSibling
          , n = t.firstChild
          , p = n.firstChild
          , r = p.nextSibling
          , u = n.nextSibling
          , s = k.firstChild
          , q = s.firstChild.insertRow(-1)
          , m = EUI.parseBool(w.ctrlMultSelect, false)
          , o = EUI.parseBool(w.shiftMultSelect, false);
        this.options = {
            container: l,
            headerContainer: k,
            headerTable: s,
            headerRow: q,
            dataContainer: t,
            dataTable: n,
            datacolgroup: p,
            dataBody: r,
            blankBody: u,
            columns: w.columns,
            needResizeColumns: EUI.parseBool(w.needResizeColumns, true),
            columnResize: EUI.parseBool(w.columnResize, false),
            autoTotalWidth: w.autoTotalWidth,
            nullShow: w.nullShow || "",
            minwidth: w.minwidth || 50,
            headervisible: true,
            onclickHead: w.onclickHead,
            onCellClick: w.onCellClick,
            onContextmenu: w.onContextmenu,
            onDblclick: w.onDblclick,
            onSelectRow: w.onSelectRow,
            onCheck: w.onCheck,
            onMoreData: w.onmoredata,
            ctrlMultSelect: m,
            shiftMultSelect: o,
            hlCheckRow: EUI.parseBool(w.hlCheckRow, false),
            showblank: EUI.parseBool(w.showblank, false),
            checkrows: [],
            selectrow: [],
            fixedcol: w.fixedcol
        };
        this.initColumns();
        if (EUI.isNumber(w.fixedcol)) {
            this.initColumnFixed(w.fixedcol);
        }
        this.setDatas(w.datas);
        this.bindEvent();
    }
    ;
    h.prototype.initColumns = function(l) {
        l = l || this.options.columns;
        if (!l) {
            return;
        }
        var k = this.options
          , B = this.doc
          , r = k.dataTable
          , o = k.datacolgroup
          , C = k.headerRow
          , s = k.blankBody
          , q = 0;
        for (var x = 0, y = l.length; x < y; x++) {
            var m = l[x];
            if (m.checkbox === false) {
                l.removeAt(x);
                x--;
                y--;
                continue;
            }
            if (m.indexColumn === false) {
                l.removeAt(x);
                x--;
                y--;
                continue;
            }
            var j = C.insertCell(-1), p = o.appendChild(B.createElement("col")), v = m.width, z = m.caption, A = m.render, t = EUI.parseBool(m.checkbox, false), u = EUI.parseBool(m.isvisible, true), w;
            if (t) {
                m.checkbox = t;
                j.className = "eui-elist-checkbox";
                p.className = "eui-elist-checkbox";
                j.innerHTML = '<i class="eui-icon eui-anmin eui-form-checkbox"/>';
                k.headcheckdom = j.firstChild;
                m.width = j.offsetWidth;
                q += parseInt(m.width, 10);
                this.checkbox$column = x;
                continue;
            } else {
                if (m.indexColumn) {
                    m.start = m.start || 1;
                    j.className = "eui-elist-index";
                    p.className = "eui-elist-index";
                    m.width = j.offsetWidth;
                    q += parseInt(m.width, 10);
                    w = j.appendChild(B.createElement("span"));
                    w.className = "eui-elist-caption";
                    w.innerHTML = m.caption === undefined ? "序号" : m.caption;
                    this.index$column = x;
                    continue;
                }
            }
            if (u) {
                if ((v + "").endsWith("%")) {
                    k.hasPrecentCol = true;
                } else {
                    m.width = v = parseInt(v, 10);
                    var n = m.minwidth ? m.minwidth : k.minwidth;
                    v = Math.max(n, v);
                    q += v;
                    v += "px";
                    j.style.width = v;
                    p.style.width = v;
                }
            } else {
                j.style.width = 0;
                p.style.width = 0;
            }
            if (z) {
                w = j.appendChild(B.createElement("span"));
                w.className = "eui-elist-caption";
                w.innerHTML = z || "";
            }
            if (m.sort && m.sort !== false) {
                w = j.appendChild(B.createElement("span"));
                w.className = "eui-elist-sort";
                w.innerHTML = '<i class="eui-icon eui-elist-asc" sort="asc"></i><i class="eui-icon eui-elist-desc" sort="desc"></i>';
            }
            if (EUI.isFunction(A)) {
                A(j);
            }
        }
        s.style.width = q + "px";
        this.options.columns = l;
        k.datacols = o.childNodes;
        if (k.hasPrecentCol) {
            this._realReiszePrecentColumn();
            EUI.bindResize(k.container, {
                callback: this.resizePrecentColumn,
                context: this
            });
        }
    }
    ;
    h.prototype.initColumnFixed = function(n) {
        if (!EUI.isNumber(n)) {
            return;
        }
        var p = this.options
          , k = p.columns.length;
        p.hasFixed = true;
        p.fixdContainer = p.container.cloneNode(true);
        p.fixdContainer.className = "eui-list-fixed-container";
        p.fixdContainer.style.cssText += ";position: absolute;left: 0;top: 0;box-shadow: 0 -1px 8px rgba(0,0,0,.08);";
        p.fixedHeader = p.fixdContainer.firstChild;
        p.fixedDataContainer = p.fixedHeader.nextSibling;
        p.fixedTable = p.fixedDataContainer.firstChild;
        p.fixedTBody = p.fixedTable.lastChild;
        p.headChilds = $(p.fixedHeader).find("tr")[0];
        p.groupChilds = $(p.fixedDataContainer).find("colgroup")[0];
        var q = $(p.fixedDataContainer).find("tbody")[0]
          , m = $(p.headChilds).find("i")[0];
        p.fixHeadCheckdom = EUI.hasClassName(m, "eui-form-checkbox") ? m : null;
        for (var o = k - 1; o >= n; o--) {
            p.headChilds.removeChild(p.headChilds.childNodes[o]);
            p.groupChilds.removeChild(p.groupChilds.childNodes[o]);
        }
        var j = p.dataContainer.offsetHeight - 10;
        p.fixedDataContainer.style.cssText += ";height:" + j + "px;position:relative;overflow:hidden;background:#fff;";
        p.fixedTable.style.position = "relative";
        p.container.appendChild(p.fixdContainer);
        var l = this;
        $(p.fixedTBody).bind("click.fixcol", function(r) {
            l.clickEventHandle(r);
        }).bind("dbclick.fixcol", function(r) {
            l.clickEventHandle(r);
        });
        $(p.headChilds).bind("mousedown.fixcol", function(r) {
            l.downEventHandle(r);
        }).bind("mousemove.fixcol", function(r) {
            if (l._startresize) {
                return;
            }
            l.moveEventHandle(r);
        }).bind("mouseleave.fixcol", function(r) {
            if (l._startresize) {
                return;
            }
            l.options.container.style.cursor = "";
            l._resizeInfo = null;
            l.showDomAtPosition(l.movespan);
        });
        $(p.fixedDataContainer).bind("contextmenu.fixcol", function(r) {
            l.contextmenuEventHandle(r);
        });
    }
    ;
    h.prototype.setEventHandle = function(j, k) {
        if (!this.options) {
            return;
        }
        this.options[j] = k;
    }
    ;
    h.prototype.getColumn = function(j) {
        if (!EUI.isNumber(j) || !this.options.columns) {
            return;
        }
        return this.options.columns[j];
    }
    ;
    h.prototype.hasCheckCol = function() {
        var k = this.options.columns;
        if (!k) {
            return false;
        }
        for (var l = 0, j = k.length; l < j; l++) {
            if (k[l].checkbox) {
                return true;
            }
        }
        return false;
    }
    ;
    h.prototype.hasIndexkCol = function() {
        var k = this.options.columns;
        if (!k) {
            return false;
        }
        for (var l = 0, j = k.length; l < j; l++) {
            if (k[l].indexColumn) {
                return true;
            }
        }
        return false;
    }
    ;
    h.prototype.getCheckCol = function() {
        return this.checkbox$column;
    }
    ;
    h.prototype.setIndexStart = function(m, j) {
        var k = this.index$column;
        if (k < 0) {
            return;
        }
        var l = this.getColumn(k);
        if (l) {
            l.start = m;
            j = EUI.parseBool(j, false);
            if (j) {
                this._refreshRowStyle(0);
            }
        }
    }
    ;
    h.prototype.setDatas = function(j) {
        var m = this.options
          , l = m.columns
          , k = m.blankBody;
        if (!l) {
            return;
        }
        if (EUI.isArray(j) && j.length > 0) {
            var o = j.length;
            for (var n = 0; n < o; n++) {
                this.addRow(j[n]);
            }
        } else {
            this.autoShowBlank();
        }
    }
    ;
    h.prototype.autoShowBlank = function() {
        var m = this.options
          , j = m.datas
          , l = m.columns
          , k = m.blankBody;
        if (m.showblank) {
            k.firstChild.style.visibility = "";
        } else {
            k.firstChild.style.visibility = "hidden";
        }
        if (EUI.isArray(l) && (!j || j.length == 0)) {
            EUI.removeClassName(k, "eui-hide");
        } else {
            EUI.addClassName(k, "eui-hide");
        }
    }
    ;
    h.prototype.setBlankHint = function(l) {
        var j = this.options.blankBody;
        var k = j.firstChild;
        k.innerText = l;
    }
    ;
    h.prototype.addRow = function(y, u) {
        if (!y) {
            return;
        }
        var k = this.options, o = k.datas, q = k.dataBody, z, m = k.columns, l, x = this.getCount(), w, t = k.fixedTBody, s = k.fixedcol;
        if (!o) {
            o = k.datas = [];
        }
        if (EUI.isNumber(u) && u < x) {
            z = q.rows[u];
            z.innerHTML = "";
            k.datas[u] = y;
            if (k.hasFixed) {
                w = t.rows[u];
                w.innerHTML = "";
            }
        } else {
            z = q.insertRow(-1);
            k.datas.push(y);
            if (k.hasFixed) {
                w = t.insertRow(-1);
            }
        }
        var v = EUI.isArray(y);
        for (var n = 0, r = 0, p = m.length; n < p; n++,
        r++) {
            l = m[n];
            if (l.checkbox || l.indexColumn) {
                r -= 1;
                this.createCell(l, z);
                if (k.hasFixed && n < s) {
                    this.createCell(l, w);
                }
                continue;
            }
            if (v) {
                this.createCell(l, z, y[r]);
                if (k.hasFixed && n < s) {
                    this.createCell(l, w, y[r]);
                }
            } else {
                var j = l.id;
                this.createCell(l, z, y[j]);
                if (k.hasFixed && n < s) {
                    this.createCell(l, w, y[j]);
                }
            }
        }
        this.resizePrecentColumn();
        this.autoShowBlank();
        return z;
    }
    ;
    h.prototype.refreshRow = function(m, l) {
        if (!EUI.isNumber(m)) {
            return;
        }
        var j = this.isSelectRow(m)
          , k = this.isCheckRow(m);
        this.addRow(l, m);
        if (j) {
            this.selectRow(m);
        }
        if (k) {
            EUI.addClassName(this.getCheckDom(m), "eui-form-checked");
        }
    }
    ;
    h.prototype.createCell = function(k, s, l) {
        var p = k.dataRener
          , r = s.insertCell(-1);
        if (k.checkbox) {
            r.className = "eui-elist-checkbox";
            r.innerHTML = '<i class="eui-icon eui-anmin eui-form-checkbox"/>';
            return;
        } else {
            if (k.indexColumn) {
                var m = s.rowIndex + k.start;
                r.innerHTML = '<span class="eui-elist-text">' + m + "</span>";
                r.setAttribute("title", m);
                return;
            }
        }
        var n = k.align || "left";
        r.className = "eui-align-" + n;
        var q = r.appendChild(this.doc.createElement("span"));
        q.className = "eui-elist-text";
        var j = EUI.isObject(l) ? l.caption : l;
        if (!EUI.isBoolean(j) && !j && j !== 0) {
            var o = this.options.nullShow;
            if (EUI.isFunction(o)) {
                j = o(j);
            } else {
                j = o;
            }
        }
        if (k.hint === true) {
            r.setAttribute("title", j);
        }
        if (EUI.isFunction(p)) {
            p(q, l, s.rowIndex, this);
            return;
        }
        q.appendChild(this.doc.createTextNode(j));
    }
    ;
    h.prototype.getCellCaption = function(n, j) {
        var m, k = this.getCheckCol(), l = this.getColumn(j);
        j = (k < j && k !== -1) ? j - 1 : j;
        if (EUI.isArray(n)) {
            m = n[j];
        } else {
            m = n[n.id];
        }
        var o = EUI.isObject(m) ? m.caption : m;
        return o;
    }
    ;
    h.prototype.getRowData = function(k) {
        if (!EUI.isNumber(k)) {
            return;
        }
        var j = this.options.datas;
        if (!j) {
            return;
        }
        return j[k];
    }
    ;
    h.prototype.getRow = function(j) {
        if (!EUI.isNumber(j)) {
            return;
        }
        return this.options.dataBody.rows[j];
    }
    ;
    h.prototype.getDatas = function() {
        return this.options.datas;
    }
    ;
    h.prototype.getCount = function() {
        var j = this.options.datas;
        return j ? j.length : 0;
    }
    ;
    h.prototype.getColumnCount = function() {
        if (!this.options.columns) {
            return 0;
        }
        return this.options.columns.length;
    }
    ;
    h.prototype.setColWidth = function(m, k, j) {
        var l = this.options
          , p = l.columns
          , o = p[m];
        if (!o) {
            return;
        }
        var q = l.datacolGroup
          , r = l.headerRow
          , n = o.minwidth;
        if (isNaN(n)) {
            n = l.minwidth;
        }
        if (o.indexColumn) {
            j = false;
        }
        if (EUI.isString(k) && k.endsWith("px")) {
            k = parseInt(k);
        }
        if (EUI.isNumber(k)) {
            k = Math.max(k, n);
            l.datacols[m].style.width = k + "px";
            r.cells[m].style.width = k + "px";
            if (j !== true) {
                o.width = k;
            }
            if (l.hasFixed && m < l.fixedcol) {
                l.groupChilds.childNodes[m].style.width = k + "px";
                l.headChilds.cells[m].style.width = k + "px";
            }
        }
    }
    ;
    h.prototype.checkHideScrollBarX = function() {
        var j = this.options.dataContainer;
        if (!this.hideXscrollBar && (j.offsetHeight - j.clientHeight) !== EUI.getScrollbarWidth()) {
            j.style.overflowX = "hidden";
            this.hideXscrollBar = true;
        }
    }
    ;
    h.prototype.resizePrecentColumn = function(j) {
        if (this.resizePrecentColumnTimer) {
            this.wnd.clearTimeout(this.resizePrecentColumnTimer);
        }
        if (!this.options.needResizeColumns) {
            return;
        }
        if (j === true) {
            this._realReiszePrecentColumn();
            return;
        }
        if (!this.options.hasPrecentCol) {
            return;
        }
        this.checkHideScrollBarX();
        if (this.options.hasPrecentCol) {
            this.resizePrecentColumnTimer = this.wnd.setTimeout(this._realReiszePrecentColumn.bind(this), 100);
        }
    }
    ;
    h.prototype._realReiszePrecentColumn = function() {
        if (!this.options || !this.options.needResizeColumns) {
            return;
        }
        var l = this.options, o = l.columns, t = l.dataContainer, u, r = EUI.getScrollbarWidth(), s = t.clientWidth, j, v = this.changeWidth || 0;
        if (s === 0 || this.changeWidth === s) {
            t.style.overflowX = "";
            this.hideXscrollBar = false;
            return;
        }
        this.changeWidth = s;
        j = s - v;
        if (Math.abs(j) === r) {
            this.__changeScrollBarWidth(j);
            return;
        }
        var w = l.headerRow.cells;
        u = 0;
        for (var p = 0, q = o.length; p < q; p++) {
            var n = o[p]
              , k = n.width;
            if (n.checkbox || n.indexColumn) {
                if (k === 0) {
                    k = n.width = w[p].offsetWidth;
                }
                s -= k;
                u += k;
            } else {
                if (l.autoTotalWidth === false && EUI.isNumber(k)) {
                    s -= k;
                    u += k;
                }
            }
        }
        l.hasPrecentCol = false;
        for (var p = 0, q = o.length; p < q; p++) {
            var n = o[p]
              , m = n.minwidth
              , k = n.width;
            if (isNaN(m)) {
                m = l.minwidth;
            }
            if ((k + "").endsWith("%")) {
                l.hasPrecentCol = true;
                k = Math.floor(parseInt(k, 10) / 100 * s, 10);
                k = Math.max(k, m);
                u += k;
                this.setColWidth(p, k, true);
            }
        }
        t.style.overflowX = "";
        this.hideXscrollBar = false;
        l.blankBody.style.width = u + "px";
    }
    ;
    h.prototype.__changeScrollBarWidth = function(k) {
        var n = this.options
          , t = n.dataContainer
          , p = n.columns;
        t.style.overflowX = "";
        this.hideXscrollBar = false;
        for (var q = p.length - 1; q >= 0; q--) {
            var o = p[q];
            if (!o) {
                continue;
            }
            var m = o.width || "";
            if ((m + "").endsWith("%")) {
                var s = n.datacols[q].style
                  , r = parseInt(s.width, 10)
                  , j = n.blankBody.style
                  , l = parseInt(j.width, 10);
                s.width = (r + k) + "px";
                n.headerRow.cells[q].style.width = (r + k) + "px";
                j.width = (l + k) + "px";
                return;
            }
        }
    }
    ;
    h.prototype.getVisibleColumn = function() {}
    ;
    h.prototype.refreshData = function(j) {
        if (!j) {
            return;
        }
        var l = false
          , k = this.options
          , n = k.dataContainer;
        if (j.length > 0) {
            l = true;
        }
        this.clear(l);
        this.setDatas(j);
        var m = n.scrollLeft;
        k["headerContainer"].style.left = (0 - (k["_scrollLeft"] = m)) + "px";
    }
    ;
    h.prototype.browseRows = function(k) {
        if (!EUI.isFunction(k)) {
            return;
        }
        var j = this.getDatas();
        if (j && j.length > 0) {
            j.forEach(function(m, l) {
                k.call(null, m, l);
            });
        }
    }
    ;
    h.prototype.clearCheckRows = function() {
        this.setCheckRows(this.options.checkrows, false);
    }
    ;
    h.prototype.deleteCheckRows = function() {
        var k = this.options
          , l = k.checkrows;
        if (!l) {
            return;
        }
        for (var j = 0; j < l.length; ) {
            var m = l[0];
            this.deleteRow(m.rowIndex);
        }
    }
    ;
    h.prototype.isCheckRow = function(k) {
        var m = this.options.checkrows;
        if (!m) {
            return false;
        }
        if (EUI.isNumber(k)) {
            for (var l = 0, j = m.length; l < j; l++) {
                if (m[l].rowIndex === k) {
                    return true;
                }
            }
            return false;
        }
        return m.indexOf(k) !== -1;
    }
    ;
    h.prototype.getCheckRows = function() {
        var j = this.options.checkrows;
        return j && j.length > 0 ? j : null;
    }
    ;
    h.prototype.getCheckDatas = function() {
        var m = this.options.checkrows;
        if (!m) {
            return;
        }
        var k = [];
        for (var l = 0, j = m.length; l < j; l++) {
            k.push(this.getRowData(m[l].rowIndex));
        }
        return k.length > 0 ? k : null;
    }
    ;
    h.prototype.setCheckRows = function(n, l) {
        if (!n) {
            return;
        }
        if (EUI.isArray(n)) {
            n = n.slice();
        }
        var k = this.options.datas;
        if (!k || k.length === 0) {
            return;
        }
        if (n === "all") {
            for (var m = 0, j = k.length; m < j; m++) {
                this.setCheckRow(m, l);
            }
        } else {
            if (EUI.isArray(n)) {
                for (var m = 0, j = n.length; m < j; m++) {
                    this.setCheckRow(n[m], l);
                }
            }
        }
    }
    ;
    h.prototype.getCheckDom = function(n) {
        var l = this.options;
        if (!l.headcheckdom) {
            return;
        }
        var k = l.headcheckdom.parentNode.cellIndex
          , m = l.dataBody.rows[n]
          , j = m.cells[k];
        return j.firstChild;
    }
    ;
    h.prototype.setCheckRow = function(p, j) {
        var k = this.options;
        if (!k.headcheckdom) {
            return;
        }
        var n;
        if (EUI.isNumber(p)) {
            n = k.dataBody.rows[p];
        } else {
            n = p;
            p = n.rowIndex;
        }
        var l = k.checkrows
          , m = l ? l.indexOf(n) : -1;
        if ((m === -1 && !j) || (m !== -1 && j)) {
            return;
        }
        var o = this.getCheckDom(p);
        if (!o) {
            return;
        }
        this.checkRow(p, o, o.parentNode);
    }
    ;
    h.prototype.isCheckAll = function() {
        var j = this.options.checkrows;
        if (!j) {
            return false;
        }
        return j.length === this.getCount();
    }
    ;
    h.prototype.checkRow = function(u, r, o) {
        var l = this.options, j = l.hlCheckRow, k = l.checkrows, s = l.dataBody, m, n = this.getColumn(o.cellIndex), x = l.dataBody.rows, t = x[u], p = l.hasFixed;
        if (p) {
            x = l.fixedTBody.rows;
            var q = x[u];
            var v = q.firstChild.firstChild;
            r = t.firstChild.firstChild;
        }
        if (EUI.hasClassName(r, "eui-form-checked")) {
            EUI.removeClassName(r, "eui-form-checked");
            p ? EUI.removeClassName(v, "eui-form-checked") : null;
            if (j) {
                EUI.removeClassName(t, "eui-elist-checkbox-active");
                p ? EUI.removeClassName(q, "eui-elist-checkbox-active") : null;
            }
            m = false;
        } else {
            EUI.addClassName(r, "eui-form-checked");
            p ? EUI.addClassName(v, "eui-form-checked") : null;
            if (j) {
                EUI.addClassName(t, "eui-elist-checkbox-active");
                p ? EUI.addClassName(q, "eui-elist-checkbox-active") : null;
            }
            m = true;
        }
        if (n && n.checkbox) {
            if (!k) {
                k = l.checkrows = [];
            }
            var w = s.rows[u];
            if (m) {
                k.push(w);
            } else {
                k.splice(k.indexOf(w), 1);
            }
            k.sort(function(z, y) {
                return z.rowIndex - y.rowIndex;
            });
            this.checkHeadCheckState();
        }
    }
    ;
    h.prototype.checkHeadCheckState = function() {
        var l = this.options;
        if (!l.headcheckdom) {
            return;
        }
        var m = l.checkrows
          , k = m ? m.length : 0
          , j = l.datas
          , n = j ? j.length : 0;
        l.headcheckdom.className = "eui-icon eui-form-checkbox " + (k === 0 ? "" : (k === n ? "eui-form-checked" : "eui-form-checkbox-partial"));
        if (l.hasFixed) {
            l.fixHeadCheckdom.className = "eui-icon eui-form-checkbox " + (k === 0 ? "" : (k === n ? "eui-form-checked" : "eui-form-checkbox-partial"));
        }
    }
    ;
    h.prototype.checkHead = function(k) {
        var j = this.options, l;
        if (j.hasFixed) {
            if (j.fixHeadCheckdom !== k) {
                return;
            }
        } else {
            if (j.headcheckdom !== k) {
                return;
            }
        }
        this.setCheckRows("all", !EUI.hasClassName(k, "eui-form-checked"));
    }
    ;
    h.prototype.clearSelectRow = function() {
        var m = this.options;
        var l = m.selectrow;
        if (!l) {
            m.selectrow = [];
            return;
        }
        l = l.slice();
        for (var k = 0, j = l.length; k < j; k++) {
            this.unSelectRow(l[k].rowIndex);
        }
    }
    ;
    h.prototype.unSelectRow = function(p) {
        if (!EUI.isNumber(p)) {
            return;
        }
        var j = this.options
          , o = j.dataBody
          , l = j.hasFixed;
        var r = o.rows[p];
        var k = j.selectrow;
        var q = k ? k.indexOf(r) : -1;
        if (q !== -1) {
            EUI.removeClassName(r, "eui-elist-active");
            j.selectrow.splice(k.indexOf(r), 1);
            if (l) {
                var n = j.fixedTable.lastChild
                  , m = n.rows[p];
                EUI.removeClassName(m, "eui-elist-active");
            }
        }
    }
    ;
    h.prototype.selectRow = function(q, m) {
        var n = this.options
          , o = n.dataBody
          , l = n.hasFixed;
        var p = o.rows[q];
        this.clearSelectRow();
        if (!p) {
            return;
        }
        if (EUI.isNumber(q)) {
            EUI.addClassName(p, "eui-elist-active");
            n.selectrow.push(p);
            this.startindex = q;
            if (l) {
                var k = n.fixedTable.lastChild
                  , j = k.rows[q];
                EUI.addClassName(j, "eui-elist-active");
            }
        }
        if (EUI.isFunction(n.onSelectRow) && EUI.parseBool(m, true)) {
            n.onSelectRow(q, this);
        }
    }
    ;
    h.prototype._highlightRow = function(q, m) {
        var n = this.options
          , o = n.dataBody
          , l = n.hasFixed;
        var p = o.rows[q];
        if (!p) {
            return;
        }
        if (EUI.isNumber(q)) {
            EUI.addClassName(p, "eui-elist-active");
            n.selectrow.push(p);
            if (l) {
                var k = n.fixedTable.lastChild
                  , j = k.rows[q];
                EUI.addClassName(j, "eui-elist-active");
            }
        }
        if (EUI.isFunction(n.onSelectRow) && EUI.parseBool(m, true)) {
            n.onSelectRow(q, this);
        }
    }
    ;
    h.prototype.multSelectRow = function(t, s, v) {
        var k = this.options
          , p = k.selectrow
          , q = k.dataBody;
        if (p.length === 0) {
            this.startindex = 0;
        }
        var l = k.ctrlMultSelect
          , n = k.shiftMultSelect;
        if (l && t.ctrlKey) {
            var m = p ? p.indexOf(v) : -1;
            if (m === -1) {
                this._highlightRow(s, true);
            } else {
                this.unSelectRow(s);
            }
            this.startindex = s;
        } else {
            if (n && t.shiftKey) {
                var j = this.startindex;
                var r = s;
                this.clearSelectRow();
                if (j > r) {
                    var u = j;
                    j = r;
                    r = u;
                }
                for (var o = j; o <= r; o++) {
                    this._highlightRow(o, q.rows[o]);
                }
            } else {
                this.selectRow(s);
                this.startindex = s;
            }
        }
    }
    ;
    h.prototype.isSelectRow = function(j) {
        var l = this.options.selectrow;
        var n;
        if (!EUI.isArray(l)) {
            return false;
        }
        var k = this.options
          , m = k.dataBody;
        if (EUI.isNumber(j)) {
            n = m.rows[j];
        } else {
            n = j;
        }
        return l.indexOf(n) !== -1;
    }
    ;
    h.prototype.getSelectRow = function() {
        var m = this.options
          , j = m.ctrlMultSelect
          , k = m.shiftMultSelect
          , l = this.options.selectrow;
        if (j || k) {
            return l;
        }
        return l.length > 0 ? l[0] : null;
    }
    ;
    h.prototype.getSelectDatas = function() {
        var l = this.options.selectrow;
        var m = [];
        if (!EUI.isArray(l)) {
            return;
        }
        for (var k = 0, j = l.length; k < j; k++) {
            m.push(this.getRowData(l[k].rowIndex));
        }
        return m;
    }
    ;
    h.prototype.deleteSelectRow = function() {
        var l = this.options
          , k = l.selectrow;
        if (!k) {
            return;
        }
        for (var j = 0; j < k.length; ) {
            var m = k[j].rowIndex;
            this.deleteRow(m);
        }
        this.startindex = 0;
    }
    ;
    h.prototype.deleteRow = function(l) {
        if (!EUI.isNumber(l)) {
            return;
        }
        var n = this.options
          , k = n.datas;
        if (!k) {
            return;
        }
        var q = n.dataBody.rows[l], p = n.checkrows, m = n.selectrow, o, j;
        if (p && (o = p.indexOf(q)) !== -1) {
            p.splice(o, 1);
        }
        if (m && (j = m.indexOf(q)) !== -1) {
            if (q == m[0]) {
                this.startindex = 0;
            }
            m.splice(j, 1);
        }
        k.splice(l, 1);
        n.dataBody.deleteRow(l);
        if (n.hasFixed) {
            n.fixedTBody.deleteRow(l);
        }
        this.checkHeadCheckState();
        this._refreshRowStyle(l);
        this.resizePrecentColumn();
        this.autoShowBlank();
    }
    ;
    h.prototype.insertRow = function(n, m) {
        if (!n) {
            return;
        }
        var k = this.getCount();
        if (!EUI.isNumber(m) || m >= k || m === -1) {
            this.addRow(n);
        } else {
            var j = this.options
              , l = j.dataBody;
            l.insertRow(m);
            if (j.hasFixed) {
                j.fixedTBody.insertRow(m);
            }
            if (!j.datas) {
                j.datas = [];
            }
            j.datas.splice(m, 0, n);
            this.addRow(n, m);
            this._refreshRowStyle(m);
        }
    }
    ;
    h.prototype.moveRow = function(p, t) {
        if (t == 0) {
            return;
        }
        var k = this.options, o = this.getCount(), l, y;
        var s = Math.abs(t);
        var j = [];
        if (p == null) {
            p = this.options.selectrow;
        } else {
            if (!EUI.isArray(p)) {
                p = [p];
            }
        }
        if (!p || p.length <= 0) {
            return;
        }
        for (var v = 0, x = p.length; v < x; v++) {
            var n = p[v];
            if (EUI.isNumber(n.rowIndex)) {
                j.push(n.rowIndex);
            } else {
                j.push(p[v].rowIndex);
            }
        }
        if (t > 0) {
            j.sort(function(D, C) {
                return C - D;
            });
        } else {
            j.sort(function(D, C) {
                return D - C;
            });
        }
        for (var v = 0, x = j.length; v < x; v++) {
            if (t < 0) {
                if (j[v] == 0) {
                    continue;
                } else {
                    if (j[v] < s) {
                        var m = Math.min(j[v], s);
                        var A = -m;
                    }
                }
            } else {
                if (t > 0) {
                    if (j[v] == o - 1) {
                        continue;
                    } else {
                        if (o - 1 < j[v] + s) {
                            var A = Math.min(o - 1 - j[v], s);
                        }
                    }
                }
            }
            var z = k.datas
              , B = k.dataBody
              , q = k.fixedTBody
              , u = k.hasFixed;
            l = z[j[v]];
            z.removeAt(j[v]);
            y = B.rows[j[v]];
            B.removeChild(y);
            if (u == true) {
                var r = q.rows[j[v]];
                q.removeChild(r);
            }
            if ((t < 0 && j[v] < s) || (t > 0 && j[v] > o - 1 - s)) {
                z.insertAt(l, j[v] + A);
                B.insertBefore(y, B.rows[j[v] + A]);
                if (u == true) {
                    q.insertBefore(r, q.rows[j[v] + A]);
                }
            } else {
                z.insertAt(l, j[v] + t);
                B.insertBefore(y, B.rows[j[v] + t]);
                if (u == true) {
                    q.insertBefore(r, q.rows[j[v] + t]);
                }
            }
        }
        this.checkHeadCheckState();
        var w = Math.min.apply(null, j);
        if (t > 0) {
            this._refreshRowStyle(w);
        } else {
            this._refreshRowStyle(0);
        }
        this.resizePrecentColumn();
    }
    ;
    h.prototype.setRowVisible = function(k, j) {
        j = EUI.parseBool(j, true);
        var l = this.getRow(k);
        if (!l) {
            return;
        }
        if (j) {
            EUI.removeClassName(l, "eui-hide");
        } else {
            EUI.addClassName(l, "eui-hide");
        }
    }
    ;
    h.prototype.setRowStyle = function(j, k) {
        var l = this.options;
        var n = l["extrowstyles"] || [];
        if (j == null) {
            f(n);
        } else {
            var m = this.getRow(j);
            if (!m) {
                return;
            }
            f(n, m);
            if (!k) {
                return;
            }
            i(n, m, k);
        }
        this.options["extrowstyles"] = n;
    }
    ;
    function i(l, k, j) {
        EUI.addClassName(k, j);
        l.push({
            row: k,
            style: j
        });
    }
    function f(n, m) {
        if (m) {
            for (var l = 0, j = n.length; l < j; l++) {
                var k = n[l];
                if (k["row"] === m) {
                    EUI.removeClassName(m, k["style"]);
                    n.splice(l, 1);
                    return;
                }
            }
        } else {
            for (var l = 0, j = n.length; l < j; l++) {
                var k = n[l];
                EUI.removeClassName(k["row"], k["style"]);
            }
            n.length = 0;
        }
    }
    h.prototype.scrollToView = function(k) {
        k = this.getIndex.apply(this, arguments);
        if (k === -1) {
            return;
        }
        var l = this.options
          , p = this.getRow(k);
        var o = p.offsetTop
          , n = l["dataContainer"]
          , m = n.scrollTop
          , j = n.clientHeight;
        if (o < m || o + p.cells[0].clientHeight > m + j) {
            return (n.scrollTop = o - j / 2);
        }
    }
    ;
    h.prototype.getIndex = function(t, q, p) {
        if (t == null) {
            return -1;
        }
        var o = this.options
          , B = o["datas"] || null
          , l = o["columns"];
        if (!B) {
            return -1;
        }
        if (EUI.isNumber(t)) {
            var r = parseInt(t, 10);
            if (!isNaN(r) && r >= 0 && r < B.length) {
                return r;
            }
        }
        var w = parseInt(p) || 0
          , y = B.length
          , k = q ? q.split(/,|，/) : []
          , A = -1;
        for (; w < y; w++) {
            var n = B[w];
            var v = false;
            for (var u = 0, x = 0, s = l.length; u < s; u++,
            x++) {
                var m = l[u];
                if (m.checkbox || m.indexColumn) {
                    x -= 1;
                    continue;
                }
                if (!k || (k && k.length > 0 && k.indexOf(x + "") == -1)) {
                    continue;
                }
                var z = a(n, x, m.id, 0);
                if (z == null) {
                    continue;
                }
                if (EUI.isRegExp(t)) {
                    if (t.test(z)) {
                        v = true;
                    }
                } else {
                    if (EUI.isFunction(t)) {
                        if (t(z, x) === true) {
                            v = true;
                        }
                    } else {
                        if (z === t) {
                            v = true;
                        }
                    }
                }
                if (v) {
                    break;
                }
            }
            if (v) {
                A = w;
                break;
            }
        }
        return A;
    }
    ;
    h.prototype.clear = function(m) {
        var l = this.options
          , n = l.dataBody
          , j = l.datas;
        if (j) {
            for (var k = j.length - 1; k >= 0; k--) {
                n.deleteRow(k);
                if (l.hasFixed) {
                    l.fixedTBody.deleteRow(k);
                }
            }
            l.datas = undefined;
        }
        l.checkrows = [];
        l.selectrow = [];
        l.startindex = null;
        this.checkHeadCheckState();
        this.resizePrecentColumn();
        if (m) {
            return;
        }
        this.autoShowBlank();
    }
    ;
    h.prototype.sort = function(k) {
        var m = this.options, n = this.getColumn(k), l = n.sort, j = n.sorttype || "", p = m.headerRow.cells[k], o;
        if (EUI.isFunction(l)) {
            o = j === "asc" ? "desc" : (j === "desc" ? "desc" : "asc");
            l(j, o, p, this);
        } else {
            j = j || "desc";
            o = j === "desc" ? "asc" : "desc";
            this.setSortState(o, p);
            c.call(this, m.datas, k, n.id, o);
            this.refreshData(m.datas);
        }
    }
    ;
    h.prototype.setSortState = function(k, q) {
        var j = $(q).find("span i")
          , n = this.options;
        if (n.hasFixed) {
            var m = n.headChilds.childNodes[q.cellIndex];
            j = $(m).find("span i");
        }
        if (!j || j.length !== 2) {
            return;
        }
        var p = j[0]
          , l = j[1]
          , o = this.getColumn(q.cellIndex);
        if (k === "asc") {
            EUI.addClassName(p, "eui-elist-sort-active");
            EUI.removeClassName(l, "eui-elist-sort-active");
        } else {
            if (k === "desc") {
                EUI.removeClassName(p, "eui-elist-sort-active");
                EUI.addClassName(l, "eui-elist-sort-active");
            } else {
                EUI.removeClassName(p, "eui-elist-sort-active");
                EUI.removeClassName(l, "eui-elist-sort-active");
            }
        }
        o.sorttype = k;
    }
    ;
    h.prototype.filter = function(o, l, n, j, m) {
        if (l) {
            this.wnd.clearTimeout(this._filterTimer);
            var k = this;
            this._filterTimer = this.wnd.setTimeout(function() {
                k._doFilter(o, n, j, m);
            }, l);
        } else {
            this._doFilter(o, n, j, m);
        }
    }
    ;
    h.prototype._doFilter = function(q, p, k) {
        if (EUI.isString(q)) {
            q = q.replace(/[\^\$\*\+\?\{\}\[\]\(\)\|\.\\]/g, "\\$&");
            q = new RegExp(q,"i");
        }
        var j = -1
          , m = [];
        while (true) {
            if ((j = this.getIndex(q, null, j + 1, true)) === -1) {
                break;
            }
            m.push(j);
        }
        var o = this.getCount();
        for (var n = 0; n < o; n++) {
            var l = m[n];
            if (m.indexOf(n) === -1) {
                this.setRowVisible(n, false);
            } else {
                this.setRowVisible(n, true);
            }
        }
        EUI.isFunction(p) && p(k, this, m);
    }
    ;
    h.prototype.setHeaderVisible = function(j) {
        j = EUI.parseBool(j, true);
        var k = this.options;
        if (j) {
            k.dataContainer.style.top = "";
            k.headerContainer.style.display = "";
            k.headervisible = true;
        } else {
            k.dataContainer.style.top = "0px";
            k.headerContainer.style.display = "none";
            k.headervisible = false;
        }
    }
    ;
    h.prototype.setHeaderVisable = h.prototype.setHeaderVisible;
    h.prototype.isHeadVisible = function() {
        return this.options.headervisible;
    }
    ;
    h.prototype.getBaseDom = function() {
        return this.options.container;
    }
    ;
    h.prototype.getDataContainer = function() {
        return this.options.dataContainer;
    }
    ;
    h.prototype.getRealHeight = function() {
        var k = this.options
          , l = k.headerContainer
          , m = k.dataTable
          , j = 0;
        if (this.isHeadVisible()) {
            j += l.offsetHeight;
        }
        j += m.offsetHeight;
        return j;
    }
    ;
    h.prototype.enableCtrlMultSelect = function(j) {
        this.options.ctrlMultSelect = EUI.parseBool(j, false);
    }
    ;
    h.prototype.enableShiftMultSelect = function(j) {
        this.options.shiftMultSelect = EUI.parseBool(j, false);
    }
    ;
    h.prototype.showDomAtPosition = function(m, k) {
        if (this._resizeInfo) {
            var j = this.getBaseDom()
              , l = $(j).offset();
            EUI.removeClassName(m, "eui-hide");
            m.style.left = (k - l.left - 7) + "px";
        } else {
            EUI.addClassName(m, "eui-hide");
        }
    }
    ;
    h.prototype._refreshRowStyle = function(t) {
        if (!EUI.isNumber(this.index$column)) {
            return;
        }
        var j = this.options
          , r = j.dataBody
          , m = j.datas
          , k = j.columns[this.index$column];
        if (!m) {
            return;
        }
        for (var l = t, q = m.length; l < q; l++) {
            var v = r.rows[l]
              , u = v.cells[this.index$column]
              , p = l + k.start;
            u.innerHTML = '<span class="eui-elist-text">' + p + "</span>";
            u.setAttribute("title", p);
            if (j.hasFixed) {
                var s = j.fixedTBody
                  , n = s.rows[l]
                  , o = n.cells[this.index$column];
                o.innerHTML = '<span class="eui-elist-text">' + p + "</span>";
                o.setAttribute("title", p);
            }
        }
    }
    ;
    h.prototype.bindEvent = function() {
        var k = this.options
          , l = k.headerRow
          , m = k.dataBody
          , j = this;
        $(l).bind("mousemove.elist", function(n) {
            if (j._startresize) {
                return;
            }
            j.moveEventHandle(n);
        }).bind("mouseleave.elist", function(n) {
            if (j._startresize) {
                return;
            }
            j.options.container.style.cursor = "";
            j._resizeInfo = null;
            j.showDomAtPosition(j.movespan);
        }).bind("mousedown.elist", function(n) {
            j.downEventHandle(n);
        });
        this.startindex = null;
        $(m).bind("mousedown.elist", function(n) {
            j.dataDownEventHandle(n);
        }).bind("click.elist", function(n) {
            j.clickEventHandle(n);
        }).bind("dblclick.elist", function(n) {
            j.dblclickEventHandle(n);
        }).bind("mousemove.elist", function(n) {
            if (!k.hasFixed) {
                return;
            }
            j.moveHoverEvent(n);
        });
        $(k.dataContainer).bind("contextmenu.elist", function(n) {
            return j.contextmenuEventHandle(n);
        }).bind("scroll.elist", function(n) {
            j.scrollEventHandle(n);
        });
    }
    ;
    h.prototype.unBindEvent = function() {
        var j = this.options
          , k = j.headerRow;
        $(k).unbind("mousemove.elist mouseleave.elist mousedown.elist");
        $(j.dataBody).unbind("mousedown.elist click.elist contextmenu.elist dblclick.elist mousemove.elist");
        $(j.dataContainer).unbind("scroll.elist contextmenu.elist");
        if (j.hasFixed) {
            $(j.fixedTBody).unbind("click.fixcol dblclick.fixcol");
            $(j.headChilds).unbind("mousemove.fixcol mouseleave.fixcol mousedown.fixcol");
            $(j.fixedDataContainer).unbind("contextmenu.fixcol");
        }
    }
    ;
    h.prototype.scrollEventHandle = function(j) {
        var l = this.options
          , q = l["dataContainer"]
          , o = q.scrollTop
          , k = q.clientHeight
          , m = q.scrollHeight
          , n = l["onMoreData"];
        if (EUI.isFunction(n) && o + k + 60 >= m && !this.loading) {
            this.loading = true;
            n(this);
        }
        var p = q.scrollLeft;
        if (l["_scrollLeft"] !== p) {
            l["headerContainer"].style.left = (0 - (l["_scrollLeft"] = p)) + "px";
        }
        if (l.hasFixed) {
            l.fixedTable.style.top = "-" + o + "px";
        }
    }
    ;
    h.prototype.moreDataLoaded = function() {
        this.loading = false;
    }
    ;
    h.prototype.setOnMoreData = function(j) {
        this.options.onMoreData = j;
    }
    ;
    h.prototype.moveEventHandle = function(u) {
        if (this.options.columnResize !== true) {
            return;
        }
        var o = e(u.target)
          , m = o.tagName;
        if (m !== "TD") {
            return;
        }
        var v = o.cellIndex
          , l = this.options
          , q = l.headerRow.childNodes.length;
        if (v === this.checkbox$column || v === q - 1) {
            return;
        }
        var k = $(o)
          , j = this.getBaseDom()
          , l = this.options
          , p = k.offset()
          , s = u.clientX
          , t = o.offsetWidth
          , n = p.left
          , r = this.options.headerRow.lastChild;
        if (t - (s - n) <= 10) {
            this._resizeInfo = {
                colIndex: o.cellIndex,
                startX: s,
                width: t,
                left: n,
                lastcolumwidth: r.offsetWidth,
                datatablewidth: l.dataTable.clientWidth
            };
            if (!this.movespan) {
                this.movespan = this.doc.createElement("div");
                this.movespan.className = "eui-elist-col-resize eui-hide";
                j.appendChild(this.movespan);
            }
            this.showDomAtPosition(this.movespan, s);
            this.options.container.style.cursor = "col-resize";
        } else {
            if (this._resizeInfo) {
                this.options.container.style.cursor = "";
                this._resizeInfo = null;
                this.showDomAtPosition(this.movespan);
            }
        }
    }
    ;
    h.prototype.bodyMoveEventHandle = function(x) {
        if (this.options.columnResize !== true) {
            return;
        }
        var r = x.target
          , l = this.options;
        if (this._resizeInfo) {
            var y = this._resizeInfo
              , j = x.clientX
              , k = Math.max((j - y.startX + y.width), l.minwidth);
            var t = l.headerRow.lastChild
              , m = t.offsetWidth
              , u = this.getColumnCount() - 1
              , v = l.dataContainer;
            var w = k - y.width
              , p = this.getColumn(u)
              , q = p.width
              , o = y.lastcolumwidth
              , n = EUI.isNumber(q) ? q : (p.minwidth || l.minwidth);
            if (u == y.colIndex) {
                return;
            }
            if (w > 0) {
                m = Math.max((o - w), n);
                this.setColWidth(u, m, true);
            } else {
                var s = y.datatablewidth - v.clientWidth;
                if (s > 0) {
                    w = k - y.width;
                    w = Math.abs(w);
                    if (s < w) {
                        s = Math.abs(s);
                        w = w - s;
                        m = Math.max((o + w), n);
                        this.setColWidth(u, m, true);
                    }
                } else {
                    m = Math.max((o - w), n);
                    this.setColWidth(u, m, true);
                }
            }
            this.setColWidth(y.colIndex, k);
            this.showDomAtPosition(this.movespan, j);
            this.showDomAtPosition(this.moveline, j);
        }
    }
    ;
    h.prototype.hasScrollBar = function() {
        var j = this.options
          , k = j.dataContainer;
        if ((k.offsetHeight - k.clientHeight) !== EUI.getScrollbarWidth()) {
            return false;
        } else {
            return true;
        }
    }
    ;
    h.prototype.downEventHandle = function(q) {
        if (!this._resizeInfo) {
            var n = e(q.target)
              , m = n.tagName;
            if (m !== "TD") {
                return;
            }
            var p = n.cellIndex
              , o = this.options.columns[p];
            if (o.checkbox && EUI.hasClassName(q.target, "eui-form-checkbox")) {
                this.checkHead(q.target, n);
                var k = this.options.onCheck;
                EUI.isFunction(k) && k(EUI.hasClassName(this.options.headcheckdom, "eui-form-checked"), n, this);
            }
            if (q.target.getAttribute("sort")) {
                this.sort(p, q.target);
            }
            if (EUI.isFunction(o.onHeadClick)) {
                o.onHeadClick(n, q);
            }
            EUI.isFunction(this.options.onclickHead) && this.options.onclickHead(n, q.target, q);
            return;
        }
        if (this._resizeInfo) {
            var l = q.clientX
              , r = this;
            this._startresize = true;
            EUI.disableDocTextSelect(this.doc.body, false);
            if (!this.moveline) {
                var j = this.getBaseDom();
                this.moveline = this.doc.createElement("div");
                this.moveline.className = "eui-elist-col-resizeguide eui-hide";
                j.appendChild(this.moveline);
            }
            this.showDomAtPosition(this.moveline, l);
            $(this.doc).bind("mousemove.elist", function(s) {
                r.bodyMoveEventHandle(s);
            }).bind("mouseup.elist", function(s) {
                r.upEventHandle(s);
            });
            return;
        }
    }
    ;
    h.prototype.upEventHandle = function(j) {
        var m = this.options
          , l = m.blankBody
          , k = m.headerRow.clientWidth
          , p = this._resizeInfo
          , o = this.getColumn(p.colIndex)
          , n = parseInt(o.width, 10);
        l.style.width = k + "px";
        EUI.disableDocTextSelect(this.doc.body, true);
        $(this.doc).unbind("mousemove.elist mouseup.elist");
        this.options.container.style.cursor = "";
        this._resizeInfo = undefined;
        this._startresize = undefined;
        this.showDomAtPosition(this.movespan);
        this.showDomAtPosition(this.moveline);
    }
    ;
    h.prototype.dataDownEventHandle = function(j) {
        var l = this.options;
        var k = l.shiftMultSelect;
        if (j.shiftKey && k) {
            l.disableselect = EUI.disableDocTextSelect(this.getBaseDom(), false);
        }
    }
    ;
    h.prototype.clickEventHandle = function(q) {
        var l = e(q.target)
          , k = l.tagName;
        if (k !== "TD") {
            return;
        }
        var o = l.cellIndex
          , m = this.getColumn(o)
          , r = l.parentNode
          , p = r.rowIndex;
        if (m.checkbox && EUI.hasClassName(q.target, "eui-form-checkbox")) {
            this.checkRow(p, q.target, l);
            var j = this.options.onCheck;
            EUI.isFunction(j) && j(EUI.hasClassName(q.target, "eui-form-checked"), l, this);
        }
        if (p !== -1) {
            this.multSelectRow(q, p, r);
            if (this.options.disableselect !== false) {
                EUI.disableDocTextSelect(this.getBaseDom(), true);
            }
        }
        var n = m.onCellClick || this.options.onCellClick;
        EUI.isFunction(n) && n(this.getRowData(p), l, q);
    }
    ;
    h.prototype.contextmenuEventHandle = function(q) {
        var l = e(q.target);
        var k = this.options.onContextmenu;
        if (!l || l.tagName !== "TD") {
            if (EUI.isFunction(k)) {
                return k(null, null, q);
            }
            return;
        }
        var o = l.cellIndex
          , m = this.getColumn(o)
          , r = l.parentNode
          , p = r.rowIndex
          , j = this.options
          , n = j.selectrow;
        if (EUI.hasClassName(q.target, "eui-form-checkbox")) {
            this.checkRow(p, q.target, l);
        }
        if (p !== -1) {
            if (n.indexOf(r) === -1) {
                this.selectRow(p, r);
            }
        }
        if (EUI.isFunction(k)) {
            return k(this.getRowData(p), l, q);
        }
        return true;
    }
    ;
    h.prototype.dblclickEventHandle = function(j) {
        var q = e(j.target)
          , m = q.tagName;
        if (m !== "TD") {
            return;
        }
        var l = q.cellIndex
          , n = this.getColumn(l)
          , o = q.parentNode
          , p = o.rowIndex;
        var k = this.options.onDblclick;
        if (EUI.isFunction(k)) {
            if (k(this.getRowData(p), q, j, this) === false) {
                return;
            }
        }
        if (n.checkbox && EUI.hasClassName(j.target, "eui-form-checkbox")) {
            this.checkRow(p, j.target, q);
        }
        if (p !== -1) {
            this.selectRow(p, o);
        }
    }
    ;
    h.prototype.moveHoverEvent = function(q) {
        var l = e(q.target)
          , k = l.tagName;
        if (k !== "TD") {
            return;
        }
        var j = this.options
          , r = l.parentNode
          , p = r.rowIndex
          , n = j.fixedTable
          , o = n.rows[p]
          , m = j.trHoverDom;
        EUI.removeClassName(m, "eui-elist-hover");
        EUI.addClassName(o, "eui-elist-hover");
        j.trHoverDom = o;
    }
    ;
    function a(n, j, k, l) {
        var m;
        if (EUI.isObject(n)) {
            m = n[k];
        } else {
            if (EUI.isArray(n)) {
                if (EUI.isObject(n[0])) {
                    m = n[j].caption;
                } else {
                    m = n[j - l];
                }
            }
        }
        if (m === null || m === undefined) {
            m = "";
        }
        return m.toString();
    }
    function c(j, k, l, n) {
        if (!j) {
            return;
        }
        var p = this.hasCheckCol()
          , m = this.hasIndexkCol()
          , o = 0;
        if (p) {
            o++;
        }
        if (m) {
            o++;
        }
        if (n === "asc") {
            j.sort(function(r, q) {
                return (a(r, k, l, o)).localeCompare(a(q, k, l, o));
            });
        } else {
            if (n === "desc") {
                j.sort(function(r, q) {
                    return (a(q, k, l, o)).localeCompare(a(r, k, l, o));
                });
            }
        }
    }
    function e(k) {
        var j;
        while (k && j !== "TD" && j !== "TABLE") {
            j = k.tagName;
            if (j === "TD") {
                break;
            }
            k = k.parentNode;
        }
        return k;
    }
    return {
        EList: h
    };
});
