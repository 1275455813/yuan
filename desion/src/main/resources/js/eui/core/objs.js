+function(namespace, EUI) {
    var browser = EUI.browser;
    var isie = browser.isie;
    var XUI_IMAGES_ROOT_PATH = "eweb/images/";
    function CallBackFunc(clsinstance, method) {
        if (typeof (clsinstance) == "object" && typeof (method) == "function") {
            this.clsinstance = clsinstance;
            this.method = method;
        } else {
            if (typeof (clsinstance) == "string") {
                this.exestr = clsinstance;
            } else {
                if (typeof (clsinstance) == "function") {
                    this.method = method;
                } else {
                    EUI.throwError("传递给函数CallBackFunc的参数不正确");
                }
            }
        }
    }
    CallBackFunc.prototype.invoke = function() {
        if (this.clsinstance) {
            return this.method.apply(this.clsinstance, arguments);
        } else {
            if (this.method) {
                return this.method.apply(null, arguments);
            } else {
                return eval(this.exestr);
            }
        }
    }
    ;
    CallBackFunc.doCallBack = EUI.doCallBack;
    function CallBackFuncs() {
        this.listeners = new Array();
    }
    CallBackFuncs.prototype.add = function(cb) {
        this.listeners.push(cb);
    }
    ;
    CallBackFuncs.prototype.remove = function(cb) {
        this.listeners.remove(cb);
    }
    ;
    CallBackFuncs.prototype.invoke = function() {
        if (this.listeners.length == 0) {
            return;
        }
        var args = new Array();
        args.push(null);
        for (var i = 0; (arguments) && (i < arguments.length); i++) {
            args.push(arguments[i]);
        }
        for (var i = 0; i < this.listeners.length; i++) {
            args[0] = this.listeners[i];
            doCallBack.apply(null, args);
        }
    }
    ;
    CallBackFuncs.prototype.clear = function() {
        return this.listeners.clear();
    }
    ;
    CallBackFuncs.prototype.size = function() {
        return this.listeners.length;
    }
    ;
    CallBackFuncs.prototype.dispose = function() {
        this.listeners = null;
    }
    ;
    function extractQuotedStr(s, quote, startIndex) {
        this.s = s;
        this.quote = quote;
        this.startIndex = startIndex;
        this.value = "";
        this.endIndex = -1;
    }
    extractQuotedStr.prototype = {
        getValue: function() {
            if ((this.s == null) || (this.s.length <= this.startIndex) || this.s.charAt(this.startIndex) != this.quote) {
                this.endIndex = -1;
                this.value = this.s;
                return this.value;
            }
            var i1 = this.startIndex + 1;
            var i = this.s.indexOf(this.quote, i1);
            while (i != -1) {
                if ((this.s.length > i + 1) && (this.s.charAt(i + 1) == this.quote)) {
                    i++;
                    this.value = this.value + this.s.substring(i1, i);
                } else {
                    this.value = this.value + this.s.substring(i1, i);
                    break;
                }
                i1 = i + 1;
                i = this.s.indexOf(this.quote, i1);
            }
            i = i == -1 ? this.startIndex + 1 : i;
            this.endIndex = (i1 == -1) ? -1 : i + 1;
            return this.value;
        },
        getEndIndex: function() {
            return this.endIndex;
        },
        toString: function() {
            return this.getValue();
        }
    };
    function Map(content, sep, equal) {
        this.elements = {};
        this.len = 0;
        this.separator = sep ? sep : ";";
        this.equal = equal ? equal : "=";
        this.merge(content);
    }
    Map.prototype.merge = function(str) {
        var s = str;
        if (!s || s.length == 0) {
            return;
        }
        var sep = this.separator;
        if (sep == "\r\n") {
            sep = "\n";
        } else {
            if (sep == null || sep.length == 0) {
                sep = ";";
            }
        }
        var equal = this.equal;
        var i1 = 0;
        var i2 = s.indexOf(equal, i1);
        while (i2 != -1) {
            while (i1 < i2 && (s.charAt(i1) == sep || s.charAt(i1) == "\r")) {
                i1++;
            }
            var key = s.substring(i1, i2);
            var value;
            i1 = i2 + equal.length;
            if (i1 < s.length && s.charAt(i1) == '"') {
                var func = new extractQuotedStr(s,'"',i1);
                value = func.getValue();
                i1 = func.getEndIndex() + sep.length;
            } else {
                i2 = s.indexOf(sep, i1);
                if (i2 == -1) {
                    i2 = s.length;
                }
                value = s.substring(i1, sep == "\n" && s.charAt(i2 - 1) == "\r" ? i2 - 1 : i2);
                i1 = i2 + sep.length;
            }
            i2 = s.indexOf(equal, i1);
            this.setValue(key, value);
        }
    }
    ;
    Map.prototype.put = function(key, value) {
        if (EUI.isUndefined(value)) {
            value = null;
        }
        var v = this.elements[key];
        this.elements[key] = value;
        if (EUI.isUndefined(v)) {
            this.len++;
            return value;
        } else {
            return v;
        }
    }
    ;
    Map.prototype.push = Map.prototype.put;
    Map.prototype.renameKey = function(oldKey, newKey) {
        if (this.containsKey(oldKey)) {
            var oldValue = this.removeValue(oldKey);
            if (!this.containsKey(newKey)) {
                this.setValue(newKey, oldValue);
            }
        }
    }
    ;
    Map.prototype.containsKey = function(key) {
        return key in this.elements;
    }
    ;
    Map.prototype.putMap = function(map) {
        for (var key in map.elements) {
            this.put(key, map.elements[key]);
        }
    }
    ;
    Map.prototype.putMapIgnoreCase = function(map) {
        var keys = this.keySet();
        for (var key in map.elements) {
            if (this.contains(key)) {
                this.put(key, map.elements[key]);
            } else {
                var idx = keys.indexOfIgnoreCase(key);
                if (idx > -1) {
                    this.remove(keys[idx]);
                }
                this.put(key, map.elements[key]);
            }
        }
    }
    ;
    Map.prototype.remove = function(_key) {
        var value = this.elements[_key];
        if (EUI.isUndefined(value)) {
            return null;
        }
        delete this.elements[_key];
        this.len--;
        return value;
    }
    ;
    Map.prototype.size = function() {
        return this.len;
    }
    ;
    Map.prototype.length = Map.prototype.size;
    Map.prototype.get = function(_key) {
        var i = 0;
        var value = null;
        if (EUI.isNumber(_key)) {
            for (var key in this.elements) {
                if (i++ == _key) {
                    value = this.elements[key];
                    break;
                }
            }
        } else {
            value = this.elements[_key];
        }
        return EUI.isUndefined(value) ? null : value;
    }
    ;
    Map.prototype.contains = function(_key) {
        var value = this.elements[_key];
        return !EUI.isUndefined(value);
    }
    ;
    Map.prototype.clear = function() {
        for (var key in this.elements) {
            delete this.elements[key];
        }
        this.len = 0;
    }
    ;
    Map.prototype.keySet = function() {
        var keys = new Array();
        for (var key in this.elements) {
            if (!EUI.isUndefined(key)) {
                keys.push(key);
            }
        }
        return keys;
    }
    ;
    Map.prototype.valueSet = function() {
        var rs = new Array();
        for (var key in this.elements) {
            if (EUI.isUndefined(key)) {
                continue;
            }
            var s = this.elements[key];
            rs.push(s);
        }
        return rs;
    }
    ;
    Map.prototype.export2str2 = function(isKey, sep) {
        var arr = new Array();
        for (var key in this.elements) {
            if (EUI.isUndefined(key)) {
                continue;
            }
            if (isKey) {
                arr.push(key);
            } else {
                arr.push(this.elements[key]);
            }
        }
        return arr.join(sep ? sep : ";");
    }
    ;
    Map.prototype.export2str = function(separator, equal) {
        var arr = new Array();
        var value = "";
        if (!equal) {
            equal = "=";
        }
        for (var key in this.elements) {
            value = key;
            value += equal;
            var s = this.elements[key];
            if (s == null) {
                s = "";
            }
            if (EUI.isString(s) && ((s.indexOf(separator) != -1) || (s.indexOf(equal) != -1) || (s.indexOf('"') != -1))) {
                s = EUI.quotedStr(s, '"');
            }
            value += s;
            arr.push(value);
        }
        return arr.join(separator ? separator : ";");
    }
    ;
    Map.prototype.clone = function() {
        var map = new Map();
        map.len = this.len;
        map.separator = this.separator;
        map.equal = this.equal;
        map.elements = {};
        for (var key in this.elements) {
            map.elements[key] = this.elements[key];
        }
        return map;
    }
    ;
    Map.prototype.export2uri = function() {
        return this.toString2(null, "&", true);
    }
    ;
    Map.prototype.toString2 = function(equal, separator, encode) {
        var rs = [];
        var value = "";
        if (!equal) {
            equal = "=";
        }
        if (!separator) {
            separator = ";";
        }
        var length = this.size();
        var cc;
        for (var key in this.elements) {
            value = key;
            value += equal;
            cc = this.elements[key];
            if (cc == undefined || cc == null) {
                cc = "";
            }
            value += (!encode ? cc : encodeURIComponent(cc));
            rs.push(value);
        }
        return rs.join(separator);
    }
    ;
    Map.prototype.toArray = function(encode) {
        encode = typeof (encode) == "boolean" ? encode : true;
        var rs = [];
        var s;
        for (var key in this.elements) {
            s = this.elements[key];
            if (!s) {
                s = "";
            }
            rs.push([key, !encode ? s : encodeURIComponent(s)]);
        }
        return rs;
    }
    ;
    Map.prototype.getValue = function(key, def) {
        var v = this.get(key);
        return v == null ? def : v;
    }
    ;
    Map.prototype.getInt = function(key, def) {
        var s = this.getValue(key);
        return s ? parseInt(s) : (def != null ? def : 0);
    }
    ;
    Map.prototype.getFloat = function(key, def) {
        var s = this.getValue(key);
        return s ? parseFloat(s) : (def != null ? def : 0);
    }
    ;
    Map.prototype.getBool = function(key, def) {
        var s = this.getValue(key);
        return EUI.parseBool(s, def);
    }
    ;
    Map.prototype.dispose = function() {}
    ;
    Map.prototype.setValue = function(key, value) {
        this.put(key, value);
    }
    ;
    Map.prototype.removeValue = function(key, def) {
        var v = this.remove(key);
        if (v == null) {
            return def;
        } else {
            return v;
        }
    }
    ;
    Map.prototype.listEntry = function() {
        return this.elements;
    }
    ;
    Map.prototype.toJson = function() {
        return this.elements;
    }
    ;
    Map.prototype.formJson = function(jsonobj) {
        this.clear();
        this.putJson(jsonobj);
    }
    ;
    Map.prototype.putJson = function(jsonobj) {
        for (var key in jsonobj) {
            this.put(key, jsonobj[key]);
        }
    }
    ;
    Map.prototype.toString = function() {
        return this.export2str(this.separator);
    }
    ;
    Map.create = function(json) {
        var map = new Map();
        if (json) {
            map.putJson(json);
        }
        return map;
    }
    ;
    function OrderMap(content, sep, equal) {
        this.arr = new Array();
        Map.call(this, content, sep, equal);
    }
    EUI.extendClass(OrderMap, Map, "OrderMap");
    OrderMap.prototype.put = function(key, value) {
        var oldlen = this.size();
        Map.prototype.put.call(this, key, value);
        var newlen = this.size();
        if (oldlen != newlen) {
            this.arr[oldlen] = key;
        }
    }
    ;
    OrderMap.prototype.export2str2 = function(isKey, sep) {
        var arr = new Array();
        for (var i = 0; i < this.size(); i++) {
            var key = this.getKey(i);
            if (EUI.isUndefined(key)) {
                continue;
            }
            if (isKey) {
                arr.push(key);
            } else {
                arr.push(this.get(key));
            }
        }
        return arr.join(sep ? sep : ";");
    }
    ;
    OrderMap.prototype.getByIndex = function(i) {
        return Map.prototype.get.call(this, this.arr[i]);
    }
    ;
    OrderMap.prototype.get = function(i) {
        if (EUI.isNumber(i)) {
            return this.getByIndex(i);
        } else {
            if (EUI.isString(i)) {
                return Map.prototype.get.call(this, i);
            } else {
                return null;
            }
        }
    }
    ;
    OrderMap.prototype.remove = function(i) {
        if (EUI.isNumber(i)) {
            if (i > this.arr.length) {
                EUI.throwError(I18N.getString("xui.util.js.3", "Map中的数组越界"));
            }
            var key = this.arr[i];
            Map.prototype.remove.call(this, key);
            this.arr.splice(i, 1);
        } else {
            if (EUI.isString(i)) {
                if (this.contains(i)) {
                    Map.prototype.remove.call(this, i);
                    var idx = this.getKeyIndex(i);
                    if (idx == -1) {
                        EUI.throwError(I18N.getString("xui.util.js.4", "map中存在，记录关键字的数组中不存在！"));
                    }
                    this.arr.splice(idx, 1);
                }
            }
        }
        return true;
    }
    ;
    OrderMap.prototype.getKey = function(idx) {
        return this.arr[idx];
    }
    ;
    OrderMap.prototype.key2str = function(sep) {
        return this.arr.join(sep);
    }
    ;
    OrderMap.prototype.clear = function() {
        Map.prototype.clear.call(this);
        this.arr.splice(0, this.arr.length);
    }
    ;
    OrderMap.prototype.getKeyIndex = function(key) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i] == key) {
                return i;
            }
        }
        return -1;
    }
    ;
    function StringBuffer(value) {
        this._buffer = [];
        this.append(value);
    }
    StringBuffer.prototype = {
        append: function(value) {
            if (value) {
                this._buffer.push(value);
            }
        },
        toString: function(split) {
            return this._buffer.join(split ? split : "");
        },
        clear: function() {
            this._buffer.length = 0;
        },
        length: function() {
            return this._buffer.length;
        },
        insert: function(index, value) {
            var len = this.length();
            if (index > len || len < index) {
                return false;
            }
            this._buffer = this._buffer.slice(0, index).concat([value]).concat(this._buffer.slice(index));
            return true;
        },
        reverse: function() {
            this._buffer.reverse();
        }
    };
    function TxtLoader(content) {
        this.sectionArray = new Array();
        this.content = content;
        this.sectionCount = 0;
        this.arglen = arguments.length;
        this.args = arguments;
        this.init();
    }
    TxtLoader.prototype._canAdd = function(sectionName, fnMap, include) {
        if (fnMap == null) {
            return true;
        }
        return (fnMap.contains(sectionName) == include);
    }
    ;
    TxtLoader.prototype._initFilterMap = function(filterName) {
        var arr = filterName.split(",");
        var map = new Map();
        for (var i = 0, len = arr.length; i < len; i++) {
            map.put(arr[i].toUpperCase(), arr[i]);
        }
        return map;
    }
    ;
    TxtLoader.prototype.init = function() {
        if (this.content == null || this.content.length == 0) {
            return;
        }
        var filterName = "", include = false, fnMap = null, sectionStr, head, sp, i1 = 0, i2 = this.content.indexOf("<", i1);
        if (this.arglen == 3) {
            filterName = this.args[1];
            include = this.args[2];
            fnMap = this._initFilterMap(filterName);
        }
        while (i2 != -1) {
            i1 = this.content.indexOf(">", i2);
            if (i1 == -1) {
                alert('位于第{0}个字符位置的"<"不匹配', [i2]);
                break;
            }
            if (this.content.charAt(i1 - 1) == "/") {
                sectionStr = this.content.substring(i2, i1 + 1);
                head = sectionStr.substring(i2 + 1, i1 - 1);
                sp = head.indexOf(" ");
                if (sp > -1) {
                    head = head.substring(i2 + 1, sp);
                }
                if (!this._canAdd(head.toUpperCase(), fnMap, include)) {
                    i2 = this.content.indexOf("<", i1);
                    continue;
                }
                this.sectionArray.push({
                    name: head.toUpperCase(),
                    value: sectionStr
                });
                i2 = this.content.indexOf("<", i1);
                continue;
            }
            head = this.content.substring(i2 + 1, i1);
            sp = head.indexOf(" ");
            if (sp > -1) {
                head = head.substring(0, sp);
            }
            var headStart = "<" + head
              , headEnd = "</" + head + ">"
              , i = searchIndex(this.content, headStart, headEnd, i2);
            if (i == -1) {
                break;
            }
            if (!this._canAdd(head.toUpperCase(), fnMap, include)) {
                i2 = this.content.indexOf("<", i + headEnd.length);
                continue;
            }
            sectionStr = this.content.substring(i2, i) + headEnd;
            this.sectionArray.push({
                name: head.toUpperCase(),
                value: sectionStr
            });
            i2 = this.content.indexOf("<", i + headEnd.length);
        }
    }
    ;
    TxtLoader.prototype.getSectionCount = function() {
        return this.sectionArray.length;
    }
    ;
    TxtLoader.prototype.getSection = function(i) {
        if (EUI.isString(i)) {
            var upstr = i.toUpperCase();
            for (var j = 0, len = this.sectionArray.length; j < len; j++) {
                if (this.sectionArray[j].name == upstr) {
                    return new TxtSection(this.sectionArray[j].value);
                }
            }
            return null;
        } else {
            if (EUI.isNumber(i)) {
                return new TxtSection(this.sectionArray[i].value);
            } else {
                alert(I18N.getString("xui.util.js.25", "{0}输入的参数错误!", [i]));
            }
        }
    }
    ;
    TxtLoader.prototype.getSections = function(name) {
        if (!EUI.isString(name)) {
            EUI.throwError(I18N.getString("xui.util.js.26", "输入的参数错误，这里只识别字符串参数"));
        }
        var sections = new Array()
          , upstr = name.toUpperCase();
        for (var j = 0, len = this.sectionArray.length; j < len; j++) {
            if (this.sectionArray[j].name == upstr) {
                sections.push(new TxtSection(this.sectionArray[j].value));
            }
        }
        return sections;
    }
    ;
    TxtLoader.prototype.toString = function() {
        return "TxtLoader";
    }
    ;
    function searchIndex(content, headStart, end, index) {
        var firstEnd = content.indexOf(end, index);
        if (firstEnd == -1) {
            alert(I18N.getString("xui.util.js.22", "没有匹配", [headStart]));
            return firstEnd;
        }
        var i0 = content.lastIndexOf(headStart, firstEnd);
        if (i0 == index) {
            return firstEnd;
        }
        var b = false
          , stack = 0
          , i1 = index;
        i0 = index;
        while (i0 > -1) {
            i2 = content.indexOf(">", i0);
            var ch1 = content.charAt(i2 - 1);
            var ch = content.charAt(i0 + headStart.length);
            if (ch1 == "/" || (ch != ">" && ch != " ")) {
                i0 = content.indexOf(headStart, i2);
                continue;
            }
            if (i0 < firstEnd) {
                stack++;
            } else {
                i2 = content.lastIndexOf(end, i0);
                firstEnd = i2;
                i1 = i0;
                while (i2 > index && i2 != -1) {
                    stack--;
                    if (stack == 0) {
                        b = true;
                        break;
                    }
                    i2 = content.lastIndexOf(end, i2 - 1);
                }
                index = i0;
                if (b) {
                    break;
                }
                stack++;
                firstEnd = content.indexOf(end, i0);
            }
            i0 = content.indexOf(headStart, i0 + 1);
        }
        if (i0 == -1) {
            i0 = i1;
            for (var i = 1; i <= stack; i++) {
                firstEnd = content.indexOf(end, i0);
                i0 = firstEnd + end.length;
            }
        }
        if (firstEnd == -1) {
            alert(I18N.getString("xui.util.js.23", "没有匹配，检查相同段名的嵌套情况!", [headStart]));
        }
        return firstEnd;
    }
    function TxtSection(content) {
        this.content = content;
        this.name = "";
        this.attribsinit = false;
        this.attribs = "";
        this.attribsmap = new EUI.StringMap(""," ");
        this.contentStr = "";
        this.strmap = new EUI.StringMap("","\r\n");
        this.strmapinit = false;
        this.recinit = false;
        this.txtLoad;
        this.init();
    }
    TxtSection.prototype.init = function() {
        var i1 = 0;
        var i2 = this.content.indexOf("<", i1);
        var i1 = this.content.indexOf(">", i2);
        var attrline;
        var tmpi;
        if (this.content.charAt(i1 - 1) == "/") {
            this.contentStr = "";
            attrline = this.content.substring(i2 + 1, i1 - 1);
            tmpi = attrline.indexOf(" ");
            if ((attrline.length > 0) && (tmpi > -1)) {
                this.name = attrline.substring(0, tmpi);
                this.attribs = attrline.substring(tmpi + 1);
            } else {
                this.name = attrline;
                this.attribs = "";
            }
            this.contentStr = "";
            return;
        }
        var head = this.content.substring(i2 + 1, i1);
        var sp = head.indexOf(" ");
        if (sp > 0) {
            this.attribs = head.substring(sp + 1, i1);
            head = head.substring(0, sp);
        }
        this.name = head;
        i2 = searchIndex(this.content, "<" + head, "</" + head + ">", 0);
        if (i2 != -1) {
            var ln = "\r\n";
            var tmpStr = this.content.substring(i1 + 1, i2);
            for (var c = 0; tmpStr.charCodeAt(c) < 33; c++) {}
            this.contentStr = tmpStr.slice(c);
        }
    }
    ;
    TxtSection.prototype.getName = function() {
        return this.name;
    }
    ;
    TxtSection.prototype.getAttribs = function() {
        if (!this.attribsinit) {
            this.attribsmap.merge(this.attribs);
        }
        this.attribsinit = true;
        return this.attribsmap;
    }
    ;
    TxtSection.prototype.getContents = function() {
        if (!this.strmapinit) {
            this.strmap.merge(this.contentStr);
        }
        this.strmapinit = true;
        return this.strmap;
    }
    ;
    TxtSection.prototype.getContentStr = function() {
        return this.contentStr;
    }
    ;
    TxtSection.prototype.getSectionCount = function() {
        if (!this.recinit) {
            this.txtLoad = new TxtLoader(this.contentStr);
        }
        this.recinit = true;
        return this.txtLoad.getSectionCount();
    }
    ;
    TxtSection.prototype.getSection = function(i) {
        if (!this.recinit) {
            this.txtLoad = new TxtLoader(this.contentStr);
        }
        this.recinit = true;
        return this.txtLoad.getSection(i);
    }
    ;
    TxtSection.prototype.getSections = function(name) {
        if (!this.recinit) {
            this.txtLoad = new TxtLoader(this.contentStr);
        }
        this.recinit = true;
        return this.txtLoad.getSections(name);
    }
    ;
    TxtSection.prototype.toString = function() {
        return "TxtSection";
    }
    ;
    function Download(wnd, url) {
        this.wnd = wnd && wnd.document ? wnd : window;
        this.doc = this.wnd.document;
        this.url = url;
        this._initDownload();
    }
    Download.create = function(wnd, url, isdispose) {
        var rs = new Download(wnd,url);
        if (typeof (isdispose) != "boolean") {
            isdispose = false;
        }
        if (isdispose) {
            EUI.addDispose(rs);
        }
        return rs;
    }
    ;
    Download.getInstance = function() {
        return EUI.getObjectFromRoot("Download", "__DownloadInstance__", true, "xui/util.js");
    }
    ;
    Download.prototype.dispose = function() {
        this.wnd = null;
        this.doc = null;
        if (this._downloadAttachForm) {
            this.doc.removeChild(this._downloadAttachForm);
            this._downloadAttachForm = null;
        }
    }
    ;
    Download.prototype._initDownload = function() {
        this._downloadAttachForm = new HtmlElementFactory(this.wnd,this.doc.body).form("downloadForm" + Math.floor(Math.random() * 9999), null, "post", this.url, true);
    }
    ;
    Download.prototype.getForm = function() {
        return this._downloadAttachForm;
    }
    ;
    Download.prototype.setAction = function(url, issubmit) {
        this._downloadAttachForm.setAction(url);
        if (typeof (issubmit) != "boolean") {
            issubmit = false;
        }
        if (issubmit) {
            this.submit();
        }
    }
    ;
    Download.prototype.submit = function() {
        this._downloadAttachForm.submit();
    }
    ;
    function AutoPlay(wnd, delay) {
        this.wnd = wnd && wnd.document ? wnd : window;
        this.doc = this.wnd.document;
        this.setDelay(delay);
    }
    AutoPlay.prototype.dispose = function() {
        this.__userdata = null;
        this.stop();
        this._autoCallback = null;
        this.wnd = null;
        this.doc = null;
    }
    ;
    AutoPlay.prototype.toString = function() {
        return "AutoPlay";
    }
    ;
    AutoPlay.prototype.setDelay = function(delay) {
        this.delay = typeof (delay) == "number" ? (delay * 1000) : (15 * 60 * 1000);
    }
    ;
    AutoPlay.prototype.stop = function() {
        if (this.autoPlayTimer) {
            this.wnd.clearTimeout(this.autoPlayTimer);
        }
    }
    ;
    AutoPlay.prototype.setAutoCallback = function(p) {
        this._autoCallback = p;
    }
    ;
    AutoPlay.prototype.play = function(delay) {
        this.autoPlayTimer = this.wnd.setTimeout(this._func_AutoPlay_callback.bind(this), typeof (delay) == "number" ? (delay * 1000) : this.delay);
    }
    ;
    AutoPlay.prototype._func_AutoPlay_callback = function() {
        if (typeof (this._autoCallback) == "function") {
            this._autoCallback(this, this.__userdata);
        }
        this.stop();
        this.play();
    }
    ;
    function LineReader(s) {
        this.s = s;
        this.index = 0;
    }
    LineReader.prototype.readLine = function() {
        var oldi = this.index;
        if (oldi == -1) {
            return null;
        }
        var s = this.s;
        var i = s.indexOf("\n", oldi);
        if (i == -1) {
            this.index = i;
            return s.substring(oldi);
        } else {
            this.index = i + 1;
            if (s.charAt(i - 1) == "\r") {
                i--;
            }
            return s.substring(oldi, i);
        }
    }
    ;
    LineReader.prototype.eof = function() {
        return this.index == -1;
    }
    ;
    LineReader.prototype.readLineUtil = function(aline) {
        var ln = this.readLine();
        var r = "";
        while (ln != aline && !this.eof()) {
            r += ln + "\r\n";
            ln = this.readLine();
        }
        return r.trim();
    }
    ;
    LineReader.prototype.skipLineUtil = function() {
        this.readLineUtil();
    }
    ;
    LineReader.prototype.getRemain = function() {
        return this.s.substring(this.index);
    }
    ;
    function HtmlElementFactory(wnd, eparent) {
        this.wnd = wnd ? wnd : window;
        this.doc = this.wnd.document;
        this.eparent = typeof (eparent) == "string" ? this.doc.getElementById(eparent) : (typeof (eparent) == "object" ? eparent : null);
        this.disabledRecord(false);
    }
    HtmlElementFactory.prototype.dispose = function() {
        this._disposeDoms();
        this.doc = null;
        this.wnd = null;
    }
    ;
    HtmlElementFactory.prototype._disposeDoms = function() {
        if (!this._buf) {
            return;
        }
        var tmp;
        while (this._buf.length > 0) {
            tmp = this._buf.pop();
            if (tmp.dispose) {
                tmp.dispose();
            }
        }
        this._buf = null;
    }
    ;
    HtmlElementFactory.prototype.disabledRecord = function(f) {
        if (f) {
            this._buf = null;
        } else {
            if (!this._buf) {
                this._buf = [];
            }
        }
    }
    ;
    function _HtmlElementFactory$SetCaption(p) {
        EUI.setTextContent(this, p ? p : "");
    }
    function _HtmlElementFactory$SetColor(p) {
        this.style.color = p;
    }
    function _HtmlElementFactory$SetVisible(f) {
        if (typeof (f) != "boolean") {
            f = false;
        }
        var s = f ? "" : "none";
        if (this.style.display == s) {
            return;
        }
        this.style.display = s;
    }
    function _HtmlElementFactory$Resize(w, h) {
        this.style.cssText += "; width: " + EUI.toPerNumber(w) + "; height: " + EUI.toPerNumber(h);
    }
    function _HtmlElementFactory$SetSrc(p) {
        this.src = p;
    }
    function _HtmlElementFactory$GetSrc() {
        return this.src;
    }
    function _HtmlElementFactory$SetDisabled(f, p) {
        if (typeof (f) != "boolean") {
            f = false;
        }
        if (!p) {
            p = this;
        }
        if (p.disabled == f) {
            return;
        }
        p.disabled = f;
    }
    function _HtmlElementFactory$SetDisabled2(f) {
        _HtmlElementFactory$SetDisabled(f, this);
        this.className = this.className.replace(/ ?(elementDisabled|elementEnabled)/g, "") + (f ? " elementDisabled" : " elementEnabled");
    }
    function _HtmlElementFactory$GetValue() {
        return this.value;
    }
    function _HtmlElementFactory$SetValue(p) {
        this.value = p ? p : "";
    }
    function _HtmlElementFactory$ClearOption() {
        for (var i = this.getCount() - 1; i > -1; i--) {
            this.removeOption(i);
        }
    }
    function _HtmlElementFactory$AddOption(value, text) {
        if (this.findOption(value, false) == -1) {
            var o = this.ownerDocument.createElement("option");
            o.value = value;
            o.text = text;
            o.title = text;
            this.options.add(o);
            return o;
        }
    }
    function _HtmlElementFactory$AddOptions(opts) {
        if (!EUI.isArray(opts)) {
            return;
        }
        var tmp;
        for (var i = 0; i < opts.length; i++) {
            tmp = opts[i];
            if (!EUI.isArray(tmp)) {
                this.addOption(tmp, tmp);
                continue;
            }
            if (tmp.length == 1) {
                this.addOption(tmp[0], tmp[0]);
            } else {
                if (tmp.length >= 2) {
                    this.addOption(tmp[0], tmp[1]);
                }
            }
        }
    }
    function _HtmlElementFactory$RemoveOption(index, isText) {
        if (typeof (index) == "string") {
            index = this.findOption(index, isText);
        }
        if (typeof (index) == "number" && index != -1) {
            this.remove(index);
        }
    }
    function _HtmlElementFactory$GetCount() {
        return this.options.length;
    }
    function _HtmlElementFactory$GetOption(index, isText) {
        if (typeof (index) == "string") {
            index = this.findOption(index, isText);
        }
        if (typeof (index) == "number" && index != -1) {
            return this.options[index];
        }
    }
    function _HtmlElementFactory$SetSelected(index, isText) {
        if (typeof (index) == "string") {
            if (!isText && this.value == index) {
                return;
            }
            index = this.findOption(index, isText);
        }
        if (typeof (index) == "number" && index != -1) {
            var option = this.options[index];
            if (option) {
                option.selected = true;
                return true;
            }
        }
        return false;
    }
    function _HtmlElementFactory$FindOption(text, isText) {
        isText = typeof (isText) == "boolean" ? isText : true;
        var count = this.options.length;
        var tmp = null;
        for (var i = 0; i < count; i++) {
            tmp = this.options[i];
            if (isText ? tmp.text == text : tmp.value == text) {
                return i;
            }
        }
        return -1;
    }
    function _HtmlElementFactory$GetCurrentOption() {
        for (var i = 0; i < this.options.length; i++) {
            if (this.options[i].selected) {
                return this.options[i];
            }
        }
        return null;
    }
    function _HtmlElementFactory$GetValue4Combobox() {
        var rs = this.getCurrentOption();
        return rs ? rs.value : "";
    }
    function _HtmlElementFactory$SetValue4Combobox(p) {
        this.setSelected(p, false);
    }
    function _HtmlElementFactory$GetCaption4Combobox() {
        var rs = this.getCurrentOption();
        return rs ? rs.text : "";
    }
    function _HtmlElementFactory$SetCaption4Combobox(p) {
        this.setSelected(p, true);
    }
    function _HtmlElementFactory$Form_GetIFrame() {
        return this.iframe;
    }
    function _HtmlElementFactory$SetAction(p) {
        if (!isie) {
            this.setAttribute("action", p);
        } else {
            this.action = p;
        }
    }
    function _HtmlElementFactory$GetDocument() {
        return this.contentWindow.document;
    }
    function _HtmlElementFactory$GetBody() {
        return this.contentWindow.document.body;
    }
    function _HtmlElementFactory$Link_SetCaption(c) {
        var r = this.firstChild;
        var rs = r.nodeType == 3 ? r : r.nextSibling;
        rs.nodeValue = c;
    }
    function _HtmlElementFactory$Link_SetImage(p) {
        var r = this.firstChild;
        if (r.nodeType == 1 && r.tagName.toLowerCase() == "img") {
            r.src = p;
        }
    }
    function _HtmlElementFactory$Dispose() {
        if (this.setVisible) {
            this.setVisible = null;
            this.removeAttribute("setVisible");
        }
        if (this.setDisabled) {
            this.setDisabled = null;
            this.removeAttribute("setDisabled");
        }
        if (this.setCaption) {
            this.setCaption = null;
            this.removeAttribute("setCaption");
        }
        if (typeof (this.dispose) == "function") {
            this.dispose = null;
            this.removeAttribute("dispose");
        }
    }
    function _HtmlElementFactory$EditDispose() {
        if (this.setDisabled) {
            this.setDisabled = null;
            this.removeAttribute("setDisabled");
        }
        if (this.setValue) {
            this.setValue = null;
            this.removeAttribute("setValue");
        }
        if (this.getValue) {
            this.getValue = null;
            this.removeAttribute("getValue");
        }
        if (typeof (this.dispose) == "function") {
            this.dispose = null;
            this.removeAttribute("dispose");
        }
    }
    function _HtmlElementFactory$AddlinkDispose() {
        if (this.setCaption) {
            this.setCaption = null;
            this.removeAttribute("setCaption");
        }
        if (this.setColor) {
            this.setColor = null;
            this.removeAttribute("setColor");
        }
        if (this.setImage) {
            this.setImage = null;
            this.removeAttribute("setImage");
        }
        if (typeof (this.dispose) == "function") {
            this.dispose = null;
            this.removeAttribute("dispose");
        }
    }
    function _HtmlElementFactory$ImgDispose() {
        if (this.setImg) {
            this.setImg = null;
            this.removeAttribute("setImg");
        }
        if (this.getImg) {
            this.getImg = null;
            this.removeAttribute("getImg");
        }
        if (this.resize) {
            this.resize = null;
            this.removeAttribute("resize");
        }
        if (typeof (this.dispose) == "function") {
            this.dispose = null;
            this.removeAttribute("dispose");
        }
    }
    function _HtmlElementFactory$IframeDispose() {
        if (this.getBody) {
            this.getBody = null;
            this.removeAttribute("getBody");
        }
        if (this.getDocument) {
            this.getDocument = null;
            this.removeAttribute("getDocument");
        }
        if (typeof (this.visible) == "function") {
            this.visible = null;
            this.removeAttribute("visible");
        }
        if (typeof (this.url) == "function") {
            this.url = null;
            this.removeAttribute("url");
        }
        if (typeof (this.size) == "function") {
            this.size = null;
            this.removeAttribute("size");
        }
        if (typeof (this.dispose) == "function") {
            this.dispose = null;
            this.removeAttribute("dispose");
        }
    }
    function _HtmlElementFactory$FormDispose() {
        if (this.getIFrame) {
            this.getIFrame = null;
            this.removeAttribute("getIFrame");
        }
        if (this.setAction) {
            this.setAction = null;
            this.removeAttribute("setAction");
        }
        if (this.iframe) {
            this.iframe.dispose();
            this.iframe = null;
            this.removeAttribute("iframe");
        }
        if (typeof (this.dispose) == "function") {
            this.dispose = null;
            this.removeAttribute("dispose");
        }
    }
    function _HtmlElementFactory$ComboboxDispose() {
        if (this.clearOption) {
            this.clearOption = null;
            this.removeAttribute("clearOption");
        }
        if (this.addOption) {
            this.addOption = null;
            this.removeAttribute("addOption");
        }
        if (this.addOptions) {
            this.addOptions = null;
            this.removeAttribute("addOptions");
        }
        if (this.removeOption) {
            this.removeOption = null;
            this.removeAttribute("removeOption");
        }
        if (this.getCount) {
            this.getCount = null;
            this.removeAttribute("getCount");
        }
        if (this.getOption) {
            this.getOption = null;
            this.removeAttribute("getOption");
        }
        if (this.setSelected) {
            this.setSelected = null;
            this.removeAttribute("setSelected");
        }
        if (this.findOption) {
            this.findOption = null;
            this.removeAttribute("findOption");
        }
        if (this.getCurrentOption) {
            this.getCurrentOption = null;
            this.removeAttribute("getCurrentOption");
        }
        if (typeof (this.dispose) == "function") {
            this.dispose = null;
            this.removeAttribute("dispose");
        }
    }
    HtmlElementFactory.prototype._appendChild = function(childElement) {
        var rs = this.eparent ? this.eparent.appendChild(childElement) : childElement;
        if (this._buf) {
            this._buf.push(rs);
        }
        return rs;
    }
    ;
    HtmlElementFactory.prototype.addLink = function(img, caption, ptitle, underline) {
        caption = caption ? caption : "";
        ptitle = ptitle ? ptitle : "";
        underline = typeof (underline) == "boolean" ? underline : true;
        var span = this.doc.createElement("span");
        span.style.paddingLeft = "2px";
        this._appendChild(span);
        var _link = this._appendChild(this.doc.createElement("a"));
        _link.isListViewExLink = true;
        _link.className = "html_link";
        if (!underline) {
            _link.style.textDecoration = "none";
        }
        var _icon;
        if (img) {
            _icon = _link.appendChild(this.doc.createElement("img"));
            _icon.isListViewExLink = true;
            _icon.src = img;
            _icon.border = 0;
            _icon.align = "absmiddle";
            _icon.title = ptitle;
        }
        var textNode = _link.appendChild(this.doc.createTextNode(caption));
        _link.setCaption = _HtmlElementFactory$Link_SetCaption;
        _link.setColor = _HtmlElementFactory$SetColor;
        _link.setImage = _HtmlElementFactory$Link_SetImage;
        _link.dispose = _HtmlElementFactory$AddlinkDispose;
        return _link;
    }
    ;
    HtmlElementFactory.prototype.table = function() {
        var r = this._appendChild(this.doc.createElement("table"));
        r.border = 0;
        r.cellPadding = 0;
        r.cellSpacing = 0;
        return r;
    }
    ;
    HtmlElementFactory.prototype.div = function() {
        var r = this._appendChild(this.doc.createElement("div"));
        r.setVisible = _HtmlElementFactory$SetVisible;
        r.dispose = _HtmlElementFactory$Dispose;
        return r;
    }
    ;
    HtmlElementFactory.prototype.span = function() {
        return this._appendChild(this.doc.createElement("span"));
    }
    ;
    HtmlElementFactory.prototype.label = function(t) {
        var r = this._appendChild(this.doc.createElement("label"));
        r.setCaption = _HtmlElementFactory$SetCaption;
        r.dispose = _HtmlElementFactory$Dispose;
        r.setCaption(t);
        return r;
    }
    ;
    HtmlElementFactory.prototype.img = function(src) {
        var r = this._appendChild(this.doc.createElement("img"));
        r.setImg = _HtmlElementFactory$SetSrc;
        r.getImg = _HtmlElementFactory$GetSrc;
        r.resize = _HtmlElementFactory$Resize;
        r.dispose = _HtmlElementFactory$ImgDispose;
        r.setImg(src);
        return r;
    }
    ;
    HtmlElementFactory.prototype.space = function() {
        var r = this._appendChild(this.doc.createElement("nobr"));
        r.className = "html_space";
        return r;
    }
    ;
    HtmlElementFactory.prototype.file = function() {
        var t = this._appendChild(EUI.inputElement(this.doc, "file"));
        if (!t) {
            return;
        }
        t.setDisabled = _HtmlElementFactory$SetDisabled;
        t.dispose = _HtmlElementFactory$Dispose;
        return t;
    }
    ;
    HtmlElementFactory.prototype.fileinput = function(id, name, title, needtitle, parentElement) {
        var temp = this.doc.createElement("div");
        var id = id || "file";
        var name = name || "file";
        if (typeof needtitle != "boolean") {
            needtitle = true;
        }
        title = needtitle ? (title || I18N.getString("xui.util.js.45", "选择文件")) : "";
        temp.innerHTML = title ? title + ":" : "";
        temp.className = needtitle ? "html_file_con" : "html_importing_content";
        var _dom = temp.appendChild(this.doc.createElement("div"));
        _dom.className = needtitle ? "medium_tableright html_file_con2" : "html_file_con2";
        var _dom2 = _dom.appendChild(EUI.inputElement(this.doc, "text"));
        _dom2.className = needtitle ? "filepath_area" : "filepath_content";
        _dom2.readOnly = "true";
        _dom2 = _dom.appendChild(this.doc.createElement("div"));
        _dom2.className = needtitle ? "html_file_con3" : "html_file_content";
        _dom2.title = title;
        if (browser.isSafari) {
            _dom2.style.top = "0px";
        }
        var _dom3 = _dom2.appendChild(this.doc.createElement("img"));
        _dom3.className = "html_file_img";
        _dom3.src = EUI.sys.getImgPath("add.gif");
        var file = _dom2.appendChild(EUI.inputElement(this.doc, "file"));
        file.title = title || I18N.getString("xui.util.js.45", "选择文件");
        file.id = id;
        file.name = name;
        file.className = "html_file";
        var t = parentElement && parentElement.appendChild ? parentElement.appendChild(temp) : this._appendChild(temp);
        file.onchange = function() {
            file.parentNode.previousSibling.value = this.value;
        }
        ;
        t.setDisabled = _HtmlElementFactory$SetDisabled;
        t.dispose = _HtmlElementFactory$Dispose;
        return file;
    }
    ;
    HtmlElementFactory.prototype.edit = function(initText, name) {
        var t = this._appendChild(EUI.inputElement(this.doc, "text", name, initText));
        if (!t) {
            return;
        }
        t.className = "html_edit";
        t.setDisabled = _HtmlElementFactory$SetDisabled2;
        t.getValue = _HtmlElementFactory$GetValue;
        t.setValue = _HtmlElementFactory$SetValue;
        t.dispose = _HtmlElementFactory$EditDispose;
        return t;
    }
    ;
    HtmlElementFactory.prototype.hidden = function(initText, name) {
        return this._appendChild(EUI.inputElement(this.doc, "hidden", name, initText));
    }
    ;
    HtmlElementFactory.prototype.password = function(initText, name) {
        var t = this._appendChild(EUI.inputElement(this.doc, "password", name, initText));
        if (!t) {
            return;
        }
        t.className = "html_password";
        t.setDisabled = _HtmlElementFactory$SetDisabled2;
        t.dispose = _HtmlElementFactory$Dispose;
        return t;
    }
    ;
    HtmlElementFactory.prototype.checkbox = function(name, value, ischecked) {
        var t = this._appendChild(EUI.inputElement(this.doc, "checkbox", name, value, ischecked));
        t.className = "UICheckbox";
        t.setDisabled = _HtmlElementFactory$SetDisabled;
        t.dispose = _HtmlElementFactory$Dispose;
        return t;
    }
    ;
    HtmlElementFactory.prototype.radio = function(name, value, ischecked) {
        var t = this._appendChild(EUI.inputElement(this.doc, "radio", name, value, ischecked));
        t.className = "UIRadio";
        t.setDisabled = _HtmlElementFactory$SetDisabled;
        t.dispose = _HtmlElementFactory$Dispose;
        return t;
    }
    ;
    HtmlElementFactory.prototype.textarea = function(initText, name) {
        var _id = "Textarea$" + Math.floor(Math.random() * 99999999);
        var t = this._appendChild(this.doc.createElement("textarea"));
        t.setAttribute("name", name ? name : _id);
        t.setAttribute("id", _id);
        t.value = initText ? initText : "";
        t.className = "html_textarea";
        t.setDisabled = _HtmlElementFactory$SetDisabled2;
        t.dispose = _HtmlElementFactory$Dispose;
        return t;
    }
    ;
    HtmlElementFactory.prototype.form = function(name, enctype, method, action, target, callback) {
        var _t = null;
        var _target = null;
        name = typeof (name) == "string" ? name : null;
        var _id = "Form$" + Math.floor(Math.random() * 99999999);
        if (typeof (target) == "boolean") {
            if (target) {
                _t = this.iframe(callback);
                _t.size(0, 0);
                _target = _t.name;
            }
        } else {
            if (typeof (target) == "string") {
                _target = target;
            }
        }
        var temp = this.doc.createElement("div")
          , html = ['<form style="margin: 0px; padding: 0px; *zoom:1;" method="' + (method || "post") + '" name="' + (name || _id) + '" id="' + _id + '" '];
        if (action) {
            html.push('action="' + action + '" ');
        }
        if (enctype) {
            html.push('enctype="' + enctype + '" ');
        }
        if (_target) {
            html.push('target="' + _target + '" ');
        }
        html.push("/>");
        temp.innerHTML = html.join("");
        var t = temp.firstChild;
        if (_t) {
            t.appendChild(_t);
            t.iframe = _t;
        }
        this._appendChild(t);
        t.getIFrame = _HtmlElementFactory$Form_GetIFrame;
        t.setAction = _HtmlElementFactory$SetAction;
        t.dispose = _HtmlElementFactory$FormDispose;
        return t;
    }
    ;
    HtmlElementFactory.prototype.combobox = function() {
        var doc = this.doc;
        var cb = this._appendChild(doc.createElement("select"));
        cb.style.fontSize = "12px";
        cb.clearOption = _HtmlElementFactory$ClearOption;
        cb.addOption = _HtmlElementFactory$AddOption;
        cb.addOptions = _HtmlElementFactory$AddOptions;
        cb.removeOption = _HtmlElementFactory$RemoveOption;
        cb.getCount = _HtmlElementFactory$GetCount;
        cb.getOption = _HtmlElementFactory$GetOption;
        cb.setSelected = _HtmlElementFactory$SetSelected;
        cb.findOption = _HtmlElementFactory$FindOption;
        cb.getCurrentOption = _HtmlElementFactory$GetCurrentOption;
        cb.setDisabled = _HtmlElementFactory$SetDisabled;
        cb.getValue = _HtmlElementFactory$GetValue4Combobox;
        cb.setValue = _HtmlElementFactory$SetValue4Combobox;
        cb.getCaption = _HtmlElementFactory$GetCaption4Combobox;
        cb.setCaption = _HtmlElementFactory$SetCaption4Combobox;
        cb.dispose = _HtmlElementFactory$ComboboxDispose;
        return cb;
    }
    ;
    HtmlElementFactory.prototype.button = function(caption) {
        var bt = this._appendChild(EUI.inputElement(this.doc, "button", null, caption ? caption : ""));
        bt.style.cssText += "font-size:12px; border-width:0;";
        bt.setDisabled = _HtmlElementFactory$SetDisabled;
        bt.dispose = _HtmlElementFactory$Dispose;
        return bt;
    }
    ;
    HtmlElementFactory.prototype.iframe = function(callback) {
        var _id = "Iframe$" + Math.floor(Math.random() * 99999999);
        var temp = this.doc.createElement("div");
        temp.innerHTML = '<iframe name="' + _id + '" id="' + _id + '" frameborder="0" marginheight="0" marginwidth="0" style="width: 100%; height: 100%; margin: 0; border: none"' + "/>";
        var fo = temp.firstChild;
        this._appendChild(fo);
        fo.size = _HtmlElementFactory$Resize;
        fo.url = _HtmlElementFactory$SetSrc;
        fo.visible = _HtmlElementFactory$SetVisible;
        fo.getDocument = _HtmlElementFactory$GetDocument;
        fo.getBody = _HtmlElementFactory$GetBody;
        fo.dispose = _HtmlElementFactory$IframeDispose;
        if (typeof (callback) == "function") {
            if (!fo._callbackFunc) {
                fo._callbackFunc = function() {
                    callback(fo);
                }
                ;
            }
            if (fo.attachEvent) {
                fo.attachEvent("onload", fo._callbackFunc);
            } else {
                fo.onload = fo._callbackFunc;
            }
        }
        return fo;
    }
    ;
    HtmlElementFactory.prototype._separator = function(ep, width) {
        var obj = this.doc.createElement("hr");
        obj.size = 1;
        obj.noShade = true;
        if (typeof (width) == "number") {
            obj.style.width = width + "px";
        } else {
            if (typeof (width) == "string") {
                if (width.lastIndexOf("%") != -1) {
                    obj.style.width = width;
                } else {
                    obj.style.width = width + "px";
                }
            } else {
                obj.style.width = "100%";
            }
        }
        return ep ? ep.appendChild(obj) : obj;
    }
    ;
    HtmlElementFactory.prototype.separator = function(caption) {
        if (caption) {
            var obj = this._appendChild(this.doc.createElement("table"));
            obj.border = 0;
            obj.width = "100%";
            obj.cellPadding = 0;
            obj.cellSpacing = 0;
            var line = obj.insertRow(-1);
            var t0 = line.insertCell(-1);
            t0.width = "1%";
            t0.noWrap = true;
            this._separator(t0, 10);
            var t1 = line.insertCell(-1);
            t1.width = "1%";
            t1.noWrap = true;
            t1.style.fontSize = "12px";
            t1.style.padding = "0 4px 0";
            if (typeof (caption) == "object") {
                t1.appendChild(caption);
            } else {
                t1.innerHTML = caption ? caption : "&nbsp;";
            }
            var t2 = line.insertCell(-1);
            t2.width = "98%";
            this._separator(t2);
            return obj;
        }
        return this._separator(this.eparent);
    }
    ;
    HtmlElementFactory.prototype.textnode = function(caption) {
        return this._appendChild(this.doc.createTextNode(caption));
    }
    ;
    function AbstractReqObj() {
        this.wnd = window;
        this.options = new Map();
    }
    AbstractReqObj.prototype.setProperty = function(nm, v) {
        this.options.put(nm, v);
    }
    ;
    AbstractReqObj.prototype.addProperties = function(mapOrStr) {
        if (!mapOrStr) {
            return;
        }
        if (typeof (mapOrStr) == "string") {
            mapOrStr = new Map(mapOrStr,";");
        }
        this.options.putMap(mapOrStr);
    }
    ;
    AbstractReqObj.prototype.getProperty = function(nm, def) {
        return this.options.get(nm, def);
    }
    ;
    AbstractReqObj.prototype.start = function() {
        this.asynStart();
    }
    ;
    AbstractReqObj.prototype.asynStart = function() {}
    ;
    AbstractReqObj.prototype.finish = function() {}
    ;
    AbstractReqObj.prototype.finishWithError = function() {}
    ;
    AbstractReqObj.prototype.query = function() {
        if (this.isCanceled()) {
            return;
        }
        var params = new Map();
        params.put("action", "query");
        if (this.status) {
            this.status.setQueryParams(params);
        }
        this.asynQuery(params);
    }
    ;
    AbstractReqObj.prototype.asynQuery = function(params) {}
    ;
    AbstractReqObj.prototype.cancel = function() {
        if (this.isCanceled()) {
            return;
        }
        this._canceled = true;
        var params = new Map();
        params.put("action", "cancel");
        if (this.status) {
            this.status.setQueryParams(params);
        }
        this.asynQuery(params);
    }
    ;
    AbstractReqObj.prototype.isCanceled = function() {
        return this._canceled ? true : false;
    }
    ;
    AbstractReqObj.prototype.getId = function() {
        return this._id;
    }
    ;
    AbstractReqObj.prototype.setId = function(p) {
        this._id = p;
    }
    ;
    AbstractReqObj.prototype.getStatusStr = function() {
        if (!this.status) {
            return I18N.getString("xui.util.js.36", "执行未开始");
        } else {
            if (this.status.isFinished()) {
                return I18N.getString("xui.util.js.37", "执行完毕");
            } else {
                if (this.status.isCanceled()) {
                    return I18N.getString("xui.util.js.38", "执行取消");
                } else {
                    if (this.status.isWaiting()) {
                        return I18N.getString("xui.util.js.39", "正在等待执行...");
                    } else {
                        return I18N.getString("xui.util.js.40", "正在执行...");
                    }
                }
            }
        }
    }
    ;
    AbstractReqObj.prototype.showError = function(e) {
        if (typeof (EUI.showError) == "function") {
            EUI.showError(e);
        } else {
            EUI.showMessage(isie ? e.description : e.message);
        }
    }
    ;
    AbstractReqObj.prototype.onqueryobjfinish = function(xmlhttp, err) {
        if (err instanceof Error) {
            if (this.finishWithError) {
                this.finishWithError(err);
            }
            if (!xmlhttp.isResultException() && !xmlhttp.isResultError()) {
                this.showError(err);
                return;
            }
        }
        this._loadStatus(xmlhttp.getDetail());
        var status = this.status;
        if (xmlhttp.isResultException() || xmlhttp.isResultError()) {
            try {
                var detailmsg = status.getLogs();
                if (!detailmsg) {
                    detailmsg = xmlhttp.getDetail();
                }
                detailmsg += I18N.getString("xui.util.js.41", "\r\n\r\n页面地址为：【{0}】", ["<a errurl=true>" + xmlhttp.url + (xmlhttp.params ? "?" + xmlhttp.params : "") + "</a>"]);
                EUI.throwError(xmlhttp.getMessage(), detailmsg);
            } catch (abcd) {
                if (!EUI.browser.isMobile) {
                    this.showError(abcd);
                }
            }
            return;
        }
        if (!this._id) {
            this._id = this.status.getId();
            if (!this._id) {
                EUI.throwError(I18N.getString("xui.util.js.43", "提交计算请求后无法从服务器获得id"));
            }
            if (!status.isFinished() && this.isCanceled()) {
                this.cancel();
            }
        }
        if (this.showStatus) {
            this.showStatus();
        }
        this.querynext();
    }
    ;
    AbstractReqObj.prototype.querynext = function() {
        var status = this.status;
        if (status.isFinished() || this.isCanceled()) {
            this.finish();
        } else {
            this.timerid = EUI.mySetTimeout(this.wnd, new CallBackFunc(this,this.query), this.getTimeInterval());
        }
    }
    ;
    AbstractReqObj.prototype.getTimeInterval = function() {
        if (typeof (this.timeInterval) == "undefined") {
            this.timeInterval = 500;
        }
        if (this.timeInterval >= 505 && this.timeInterval < 1000 * 2) {
            this.timeInterval += 500;
        } else {
            this.timeInterval += 1;
        }
        return this.timeInterval;
    }
    ;
    function _AbstractReqObj_onQueryFinish(xmlhttp, userdata, err) {
        if (xmlhttp instanceof Error) {
            err.onqueryobjfinish(userdata, xmlhttp);
        } else {
            userdata.onqueryobjfinish(xmlhttp, err);
        }
    }
    AbstractReqObj.prototype.queryserver = function(action, param) {
        if (param == null) {
            param = "";
        }
        if (this.getId()) {
            if (typeof (param) == "string") {
                param += ("&id=" + this.getId());
            } else {
                param.put("id", this.getId());
            }
        }
        return EUI.ajax({
            url: action,
            data: param,
            callback: _AbstractReqObj_onQueryFinish,
            error: _AbstractReqObj_onQueryFinish,
            userdata: this
        });
    }
    ;
    AbstractReqObj.prototype._loadStatus = function(s) {
        if (!this.status) {
            this.status = new ReqObjExeStatus();
        }
        this.status._load(s);
    }
    ;
    AbstractReqObj.prototype.reset = function() {
        this._canceled = false;
        this._id = null;
        this.options.clear();
        if (this.status) {
            this.status.reset();
        }
    }
    ;
    function ReqObjExeStatus() {
        this._logs = "";
    }
    ReqObjExeStatus.prototype._load = function(s) {
        var map = new EUI.StringMap(s,"\r\n");
        this._status = map.getValue("status");
        this._hasException = map.getValue("hasexception") == "true";
        this._exceptionmsg = unescape(map.getValue("exceptionmsg"));
        this._startTime = map.getValue("starttime");
        if (!this._caclId) {
            this._caclId = map.getValue("id");
        }
        this._canceled = map.getValue("canceled");
        this._resultIsReport = map.getValue("reportresult") != "false";
        var logscount = map.getValue("logscount");
        if (logscount) {
            this.logscount = logscount;
        }
        var lastlog = map.getValue("lastlog");
        if (typeof (lastlog) == "string" && this._logs) {
            this._logs = this._logs.substring(0, this._logs.length - this.lastlog_len - 2) + unescape(lastlog) + "\r\n";
        }
        var lastlog_hash = map.getValue("lastlog_hash");
        if (lastlog_hash) {
            this.lastlog_hash = lastlog_hash;
            this.lastlog_len = parseInt(map.getValue("lastlog_len"));
        }
        var inclogs = map.getValue("inclogs");
        if (inclogs) {
            if (this._logs) {
                this._logs = this._logs + unescape(inclogs);
            } else {
                this._logs = unescape(inclogs);
            }
        }
        this.options = map;
    }
    ;
    ReqObjExeStatus.prototype.setQueryParams = function(params) {
        if (this.logscount) {
            params.put("last_getlogs_count", this.logscount);
        }
        if (this.lastlog_hash) {
            params.put("lastlog_hash", this.lastlog_hash);
        }
    }
    ;
    ReqObjExeStatus.prototype.resultIsReport = function() {
        return this._resultIsReport;
    }
    ;
    ReqObjExeStatus.prototype.isWaiting = function() {
        return this._status == "waiting";
    }
    ;
    ReqObjExeStatus.prototype.isExecuting = function() {
        return this._status == "executing";
    }
    ;
    ReqObjExeStatus.prototype.isFinished = function() {
        return this._status == "finished";
    }
    ;
    ReqObjExeStatus.prototype.hasException = function() {
        return this._hasException;
    }
    ;
    ReqObjExeStatus.prototype.getExceptionMsg = function() {
        return this._exceptionmsg;
    }
    ;
    ReqObjExeStatus.prototype.isCanceled = function() {
        return this._canceled == "true";
    }
    ;
    ReqObjExeStatus.prototype.getRequestStartTime = function() {
        return this._startTime;
    }
    ;
    ReqObjExeStatus.prototype.getLogs = function() {
        return this._logs;
    }
    ;
    ReqObjExeStatus.prototype.getId = function() {
        return this._caclId;
    }
    ;
    ReqObjExeStatus.prototype.getOwner = function() {
        return null;
    }
    ;
    ReqObjExeStatus.prototype.getProgress = function() {
        return null;
    }
    ;
    ReqObjExeStatus.prototype.getOptions = function() {
        return this.options;
    }
    ;
    ReqObjExeStatus.prototype.reset = function() {
        this.options.clear();
        this._caclId = null;
        this._logs = null;
        this._canceled = false;
        this._hasException = false;
        this._resultIsReport = false;
        this._startTime = false;
    }
    ;
    function Sys() {
        this.lib = new Library();
    }
    Sys.XUITAG_JSFILES_MAP = {
        edialog: "eui/modules/edialog.js",
        edialogbutton: "eui/modules/edialog.js",
        elist: "eui/modules/elist.js",
        esplitter: "eui/modules/epanelsplitter.js",
        etree: "eui/modules/etree.js",
        eprogress: "eui/modules/eprogress.js",
        etabctrl: "eui/modules/etabctrl.js",
        efontlink: "eui/modules/efontctrls.js",
        ethumbnail: "eui/modules/ethumbnail.js",
        ecolorpicker: "eui/modules/epicker.js",
        espinner: "eui/modules/ecommonctrls.js",
        ebutton: "eui/modules/ecommonctrls.js",
        eeditbrowser: "eui/modules/ecommonctrls.js",
        eeditslider: "eui/modules/ecommonctrls.js",
        elistboxcombobox: "eui/modules/ecombobox.js",
        elistbox: "eui/modules/elistbox.js",
        ecoolbar: "eui/modules/ecoolbar.js",
        elistcombox: "eui/modules/ecombobox.js",
        eimagestylepicker: "eui/modules/epicker.js"
    };
    Sys.prototype.gc = function() {
        if (!isie) {
            return;
        }
        CollectGarbage();
        setTimeout("CollectGarbage();", 1);
    }
    ;
    Sys.prototype.regTag = function(key, value) {
        Sys.XUITAG_JSFILES_MAP[key] = value;
    }
    ;
    Sys.prototype.getContextPath = function(wnd) {
        wnd = wnd || window;
        if (wnd) {
            var relpath = wnd["$relpath"];
            if (relpath) {
                return relpath;
            }
        }
        var local = (wnd || window).location
          , pathname = local.pathname;
        if (!pathname || pathname == "" || pathname == "null") {
            return "/";
        }
        var base = /\/([^\/]+)\//.exec(pathname);
        if (base && base[1]) {
            base = "/" + base[1] + "/";
            return base;
        }
        return "";
    }
    ;
    Sys.prototype.getImgPath = function(imgName) {
        return EUI.sys.getContextPath() + XUI_IMAGES_ROOT_PATH + imgName;
    }
    ;
    Sys.prototype.setJsIncluded = function(jsName) {
        window[jsName] = true;
    }
    ;
    Sys.prototype.getRequestURL = function() {
        var lct = window.location;
        return lct.protocol + "//" + lct.host + this.getContextPath();
    }
    ;
    Sys.prototype.getServerName = function() {
        var requrl = "<%=request.getRequestURL()%>";
        var svrpath = "<%=request.getServletPath()%>";
        var svrpathlen = svrpath == null ? 0 : svrpath.length;
        var rootpath = requrl.substring(0, requrl.length - svrpathlen);
        if (rootpath.charAt(rootpath.length - 1) != "/") {
            rootpath += "/";
        }
        return rootpath;
    }
    ;
    function Library() {
        this.https = [];
    }
    Library.prototype.dispose = function() {
        this.https = null;
    }
    ;
    Library.prototype._getNeedIncludeFiles = function(jses, wnd, fnsneed) {
        var fns = typeof (jses.push) == "function" ? jses : jses.split(/,|;/img);
        if (!fnsneed) {
            fnsneed = new Array();
        }
        for (var i = 0; i < fns.length; i++) {
            var fn = fns[i];
            if (!fn) {
                continue;
            }
            if (fn.indexOf(".") == -1) {
                var componentsjs = this.getComponentJs(fn);
                if (!componentsjs) {
                    throw new Error("不存在控件:" + fn + "\nThe control doesn't exist:" + fn);
                }
                fnsneed = this._getNeedIncludeFiles(componentsjs, wnd, fnsneed);
                continue;
            }
            if (!this._findScript(fn, wnd) && fn.indexOf("/sys.js") == -1 && this._arrayIndexOf(fnsneed, fn) == -1) {
                fnsneed.push(fn);
            }
        }
        return fnsneed;
    }
    ;
    Library.prototype.getComponentJs = function(componenttag) {
        return Sys.XUITAG_JSFILES_MAP[componenttag.toLowerCase()];
    }
    ;
    Library.prototype.setComponentJs = function(componenttag, jses) {
        Sys.XUITAG_JSFILES_MAP[componenttag.toLowerCase()] = jses;
    }
    ;
    Library.prototype._arrayIndexOf = function(ar, element) {
        for (var i = 0; i < ar.length; i++) {
            if (ar[i] == element) {
                return i;
            }
        }
        return -1;
    }
    ;
    Library.prototype._makeJsUrl = function(js) {
        return EUI.formatUrl(js);
    }
    ;
    Library.prototype._isLoading = function(js, wnd) {
        var i = wnd[js];
        return i == 0;
    }
    ;
    Library.prototype._isLoaded = function(js, wnd) {
        var i = wnd[js];
        return i ? true : false;
    }
    ;
    Library.prototype._isScriptsLoaded = function(fns, wnd) {
        for (var i = 0; i < fns.length; i++) {
            if (!this._findScript(fns[i], wnd)) {
                return false;
            }
        }
        return true;
    }
    ;
    Library.prototype._finishLoadJs = function(js, wnd) {
        wnd[js] = true;
        this._checkAsyncTasks(js, wnd);
    }
    ;
    Library.prototype._checkAsyncTasks = function(js, wnd) {
        var tsks = this.asyncIncludes;
        if (!tsks || tsks.length == 0) {
            this._stopCheckAsyncTasksTimer();
            return;
        }
        var tsk = null
          , len = tsks.length;
        for (var i = 0; i < len; i++) {
            if (!(tsk = tsks[i])) {
                continue;
            }
            if (tsk.checkFinish(js, wnd)) {
                tsks.splice(i--, 1);
                len--;
            }
        }
        if (len == 0) {
            this._stopCheckAsyncTasksTimer();
        }
    }
    ;
    Library.prototype._startCheckAsyncTasksTimer = function() {
        if (this._checkAsyncTasksTimer) {
            return;
        }
        var self = this;
        if (!this._checkAsyncTasksTimerFunc) {
            this._checkAsyncTasksTimerFunc = function() {
                self._checkAsyncTasksTimer = 0;
                self._checkAsyncTasks();
                if (self.asyncIncludes && self.asyncIncludes.length > 0) {
                    self._startCheckAsyncTasksTimer();
                }
            }
            ;
        }
        self._checkAsyncTasksTimer = setTimeout(this._checkAsyncTasksTimerFunc, 1000);
    }
    ;
    Library.prototype._stopCheckAsyncTasksTimer = function() {
        if (this._checkAsyncTasksTimer) {
            clearTimeout(this._checkAsyncTasksTimer);
            this._checkAsyncTasksTimer = 0;
        }
    }
    ;
    Library.prototype.includeExtjs = function(callback, userdata) {
        if (typeof (Ext) != "undefined") {
            if (typeof (callback) == "function") {
                callback(userdata);
            }
            return;
        }
        this.includeAsync("xui/ext.css;xui/third/ext/adapter/ext/ext-base.js;xui/third/ext/ext-all.js", null, function() {
            if (typeof (callback) == "function") {
                callback(userdata);
            }
        });
    }
    ;
    Library.prototype.includeSync = function(jses, wnd) {
        wnd = wnd ? wnd : window;
        var fns = this._getNeedIncludeFiles(jses, wnd);
        if (fns.length > 0) {
            var tsk = new _SyncIncludeTask(this,fns,wnd);
            tsk.doInclude();
        }
    }
    ;
    Library.prototype.includeAsync = function(jses, wnd, onfinish, onstart, userdata) {
        wnd = wnd ? wnd : window;
        if (!wnd.document.body) {
            this.includeSync(jses, wnd);
            if (onfinish) {
                onfinish(userdata);
            }
            return;
        }
        jses = this._convertComponentInJses(jses);
        if (typeof (jses) == "string" && jses.indexOf(";") >= 0) {
            var jsgrps = jses.split(";");
            var tsk = new _AsyncIncludeTaskGrp(this,jsgrps,wnd,onfinish,onstart,userdata);
            tsk.doInclude();
            return;
        }
        var fns = this._getNeedIncludeFiles(jses, wnd);
        if (fns && fns.length > 0) {
            if (onstart) {
                onstart(fns, userdata);
            }
            var tsk = new _AsyncIncludeTask(this,fns,wnd,onfinish,userdata);
            if (!this.asyncIncludes) {
                this.asyncIncludes = new Array();
            }
            this.asyncIncludes.push(tsk);
            this._startCheckAsyncTasksTimer();
            tsk.doInclude();
        } else {
            if (onfinish) {
                onfinish(userdata);
            }
        }
    }
    ;
    Library.prototype._convertComponentInJses = function(jses) {
        if (jses instanceof Array) {
            jses = jses.join(",");
        }
        if (jses == "") {
            return "";
        }
        var jsgrps = jses.split(";");
        var newjsgrps = new Array();
        var hasComponentJs = false;
        for (var i = 0; i < jsgrps.length; i++) {
            var arr = jsgrps[i].split(",");
            var componentAllJsArr = [];
            var newjs = "";
            for (var j = 0; j < arr.length; j++) {
                var curjs = arr[j];
                if (!curjs.endsWith(".css") && !curjs.endsWith(".js")) {
                    hasComponentJs = true;
                    var curjs = Sys.XUITAG_JSFILES_MAP[curjs.toLowerCase()];
                    if (!curjs) {
                        throw new Error("不存在控件：" + curjs + "\nThe control doesn't exist:" + curjs);
                    }
                    if (curjs.indexOf(";") > 0) {
                        var componentjsArr = curjs.split(";");
                        curjs = componentjsArr[0];
                        componentjsArr.splice(0, 1);
                        componentAllJsArr = componentAllJsArr.concat(componentjsArr);
                    }
                }
                newjs = newjs ? newjs + "," + curjs : curjs;
            }
            newjsgrps.push(newjs);
            newjsgrps = newjsgrps.concat(componentAllJsArr);
        }
        if (hasComponentJs) {
            newjsgrps = ["eui/modules/uibase.js"].concat(newjsgrps);
        }
        return newjsgrps.join(";");
    }
    ;
    Library.prototype.include = function(jses, wnd, onfinish, onstart, userdata) {
        if (arguments.length <= 2) {
            this.includeSync(jses, wnd);
            return;
        }
        this.includeAsync.apply(this, arguments);
    }
    ;
    Library.prototype._findScript = function(fn, wnd) {
        if (wnd[fn]) {
            return true;
        }
        var domnd = this._findScriptInDom(fn, wnd.document);
        if (domnd) {
            if (this._isScriptDomReady(domnd)) {
                wnd[fn] = true;
                return true;
            } else {
                wnd[fn] = 0;
                return false;
            }
        }
        return false;
    }
    ;
    Library.prototype._isScriptDomReady = function(domnd) {
        if (domnd.readyState === undefined) {
            return true;
        }
        if (domnd.attachEvent) {
            return (domnd.xuisrc && domnd.readyState == "loaded") || (!domnd.xuisrc && domnd.readyState == "complete");
        } else {
            return domnd.readyState != "loading";
        }
    }
    ;
    Library.prototype._findScriptInDom = function(fn, doc) {
        try {
            var nds = doc.getElementsByTagName("script");
            if (!nds) {
                return;
            }
            var count = nds.length;
            for (var i = 0; i < count; i++) {
                var nd = nds[i];
                if (nd.src.indexOf(fn) != -1) {
                    return nd;
                }
            }
        } catch (e) {}
    }
    ;
    function _SyncIncludeTask(lib, fns, wnd) {
        this.lib = lib;
        this.fns = fns;
        this.wnd = wnd ? wnd : window;
    }
    _SyncIncludeTask.prototype.doInclude = function() {
        for (var i = 0; i < this.fns.length; i++) {
            this._loadScript(this.fns[i]);
        }
    }
    ;
    _SyncIncludeTask.prototype._loadScript = function(jsuri) {
        if (this.lib._isLoaded(jsuri, this.wnd)) {
            return;
        }
        if (this.lib._isLoading(jsuri, this.wnd)) {
            throw new Error("js:" + jsuri + " 正在异步装载" + "\njs:" + jsuri + " is loading asynchronously");
        }
        var jscontent = "";
        try {
            var requrl = this.lib._makeJsUrl(jsuri);
            jscontent = EUI.getFileContent(jsuri);
            if (!jscontent || jscontent.length == 0) {
                return;
            }
            if (this.wnd.execScript) {
                if (!this.wnd.execScripting) {
                    this.wnd.execScripting = 0;
                }
                this.wnd.execScripting++;
                try {
                    this.wnd.execScript(jscontent);
                } finally {
                    this.wnd.execScripting--;
                }
            } else {
                this.wnd.eval(jscontent);
            }
            this.wnd[jsuri] = true;
        } catch (e) {
            var errMsg = (e.description ? e.description : e.message) + " \n脚本'" + jsuri + "'加载失败!" + " \nScript'" + jsuri + "'loading failed!";
            throw new Error(errMsg);
        }
    }
    ;
    function _AsyncIncludeTaskGrp(lib, fns, wnd, onfinish, onstart, userdata) {
        this.lib = lib;
        this.fns = fns;
        this.wnd = wnd ? wnd : window;
        this.onfinish = onfinish;
        this.onstart = onstart;
        this.__userdata = userdata;
        this.currentIndex = 0;
    }
    _AsyncIncludeTaskGrp.prototype.doInclude = function() {
        this.lib.includeAsync(this.fns[this.currentIndex], this.wnd, this.myonfinish, this.myonstart, this);
    }
    ;
    _AsyncIncludeTaskGrp.prototype.myonfinish = function(self) {
        self.currentIndex++;
        if (self.currentIndex >= self.fns.length) {
            var onfinish = self.onfinish;
            var userdata = self.__userdata;
            self.onfinish = null;
            self.__userdata = null;
            self.wnd = null;
            if (onfinish) {
                onfinish(userdata);
            }
        } else {
            self.doInclude();
        }
    }
    ;
    _AsyncIncludeTaskGrp.prototype.myonstart = function(fns, self) {
        var onstart = self.onstart;
        if (onstart) {
            self.onstart = null;
            onstart(fns, self.__userdata);
        }
    }
    ;
    function _AsyncIncludeTask(lib, fns, wnd, onfinish, userdata) {
        this.lib = lib;
        this.fns = fns;
        this.wnd = wnd ? wnd : window;
        this.onfinish = onfinish;
        this.__userdata = userdata;
    }
    function _onAsyncIncludeError() {
        throw new Error("include js failed :" + this.src);
    }
    _AsyncIncludeTask.prototype.doInclude = function() {
        var self = this;
        var onload = function() {
            if (this.attachEvent) {
                if (this.readyState != "loaded" && this.readyState != "complete") {
                    return;
                }
                this.onreadystatechange = null;
            } else {
                this.onload = null;
                this.readyState = "loaded";
            }
            this.onerror = null;
            self.lib._finishLoadJs(this.xuisrc, self.wnd);
        };
        setTimeout(function() {
            for (var i = 0; i < self.fns.length; i++) {
                self._loadScriptAsync(self.fns[i], onload);
            }
        }, 0);
    }
    ;
    _AsyncIncludeTask.prototype._loadScriptAsync = function(js, onload) {
        if (this.lib._isLoading(js, this.wnd)) {
            return;
        }
        if (js.endsWith(".css")) {
            this._loadStyle(js);
            return;
        }
        var doc = this.wnd.document;
        var node = doc.createElement("script");
        if (node.attachEvent) {
            node.onreadystatechange = onload;
        } else {
            node.onload = onload;
        }
        node.onerror = _onAsyncIncludeError;
        node.type = "text/javascript";
        if (/(sanlib\/|ebi\/|xui\/).+/g.test(js)) {
            node.charset = "UTF-8";
        }
        node.xuisrc = js;
        if (!node.attachEvent) {
            node.readyState = "loading";
        }
        node.src = this.lib._makeJsUrl(js);
        doc.body.appendChild(node);
    }
    ;
    _AsyncIncludeTask.prototype._loadStyle = function(css) {
        var doc = this.wnd.document;
        var node = doc.getElementsByTagName("head")[0].appendChild(doc.createElement("link"));
        node.rel = "stylesheet";
        node.type = "text/css";
        node.href = this.lib._makeJsUrl(css);
        node.xuisrc = css;
        var slf = this;
        this.wnd.setTimeout(function() {
            slf.lib._finishLoadJs(css, slf.wnd);
        }, 0);
    }
    ;
    _AsyncIncludeTask.prototype.checkFinish = function(js, wnd) {
        if (wnd && this.wnd != wnd) {
            return;
        }
        if (this.lib._isScriptsLoaded(this.fns, this.wnd)) {
            this.doFinish();
            return true;
        }
    }
    ;
    _AsyncIncludeTask.prototype.doFinish = function() {
        if (this._hasDoFinish) {
            return;
        }
        this._hasDoFinish = true;
        if (this.onfinish) {
            this.onfinish(this.__userdata);
            this.__userdata = null;
            this.onfinish = null;
        }
    }
    ;
    var TimeoutQueue = (function() {
        var queue = []
          , firing = false;
        function fire() {
            for (var i = 0, len = queue.length; i < len; i++) {
                var opt = queue[i]
                  , context = opt["context"];
                if (opt["callback"].apply(context, opt["args"]) === false || opt["once"]) {
                    var onfinish = opt["onfinish"];
                    if (typeof (onfinish) === "function") {
                        var args4finish = opt["args4finish"];
                        onfinish.apply(context, EUI.isArray(args4finish) ? args4finish : [args4finish]);
                    }
                    queue.splice(i, 1);
                    i--;
                    len--;
                }
                if (opt["single"]) {
                    break;
                }
            }
            if (queue.length) {
                setTimeout(fire, 15);
            } else {
                firing = false;
            }
        }
        function _checkUnique(callback, context, args) {
            for (var i = 0, len = queue.length; i < len; i++) {
                var opt = queue[i];
                if (opt["callback"] === callback && opt["context"] === context) {
                    queue.splice(i, 1);
                    opt["args"] = args;
                    queue.push(opt);
                    return true;
                }
            }
            return false;
        }
        return {
            add: function(callback, options) {
                if (typeof (callback) === "function") {
                    options = options || {};
                    var context = options["context"]
                      , args = options["args"];
                    args = EUI.isArray(args) ? args : [args];
                    if (options["unique"] && _checkUnique(callback, context, args)) {
                        return;
                    }
                    var oninit = options["oninit"]
                      , onfinish = options["onfinish"]
                      , args4finish = options["args4finish"];
                    if (typeof (oninit) === "function") {
                        var args4init = options["args4init"];
                        oninit.apply(context, EUI.isArray(args4init) ? args4init : [args4init]);
                    }
                    if (options["fire"] === true && callback.apply(context, args) === false) {
                        if (typeof (onfinish) === "function") {
                            onfinish.apply(context, EUI.isArray(args4finish) ? args4finish : [args4finish]);
                        }
                        return;
                    }
                    var id = options["id"] || EUI.rndIdentity("timeout_");
                    queue.push({
                        id: id,
                        callback: callback,
                        context: context,
                        args: args,
                        once: options["once"] !== false,
                        onfinish: onfinish,
                        args4finish: args4finish,
                        single: options["single"] === true
                    });
                    if (!firing) {
                        firing = true;
                        setTimeout(fire, 15);
                    }
                    return id;
                }
            },
            remove: function(callback, name) {
                if (!name) {
                    name = typeof (callback) === "function" ? "callback" : "id";
                }
                for (var i = queue.length - 1; i >= 0; i--) {
                    if (queue[i][name] === callback) {
                        queue.splice(i, 1);
                    }
                }
            }
        };
    }
    )();
    function Cookie() {
        this.doc = document;
        this.enabled = window.navigator.cookieEnabled;
    }
    Cookie.prototype = {
        setCookie: function(sName, sValue, nDays) {
            if (!this.enabled) {
                return;
            }
            var expires = "";
            if (typeof (nDays) == "number") {
                var d = new Date();
                d.setTime(d.getTime() + nDays * 24 * 60 * 60 * 1000);
                expires = "; expires=" + d.toGMTString();
            }
            this.doc.cookie = sName + "=" + escape(sValue) + expires + "; path=/";
        },
        getCookie: function(sName) {
            if (!this.enabled) {
                return;
            }
            var re = new RegExp("(;|^)[^;]*(" + sName + ")=([^;]*)(;|$)");
            var res = re.exec(this.doc.cookie);
            return res != null ? unescape(res[3]) : "";
        },
        removeCookie: function(name) {
            if (!this.enabled) {
                return;
            }
            this.setCookie(name, "", -1);
        }
    };
    function EsClipboard() {
        this._data = null;
    }
    EsClipboard.getInstace = function() {
        if (!this._esclipboard) {
            this._esclipboard = new EsClipboard();
        }
        return this._esclipboard;
    }
    ;
    EsClipboard.prototype.getAreaDom = function(id) {
        var area = document.getElementById(id);
        if (!area) {
            area = document.createElement("textarea");
            area.id = id;
            area.style.cssText += ";opacity: 0;position:absolute;top:-10000px;right:0;";
            document.body.appendChild(area);
        }
        return area;
    }
    ;
    EsClipboard.prototype.setData = function(text) {
        this._data = text;
        if (namespace.clipboardData) {
            try {
                namespace.clipboardData.clearData();
                namespace.clipboardData.setData("Text", text);
            } catch (e) {}
        } else {
            var area = this.getAreaDom("esrpt_special_copy");
            area.value = text;
            if (document.createRange) {
                area.focus();
                area.setSelectionRange(0, text.length);
            }
        }
    }
    ;
    EsClipboard.prototype.getData = function(callbackFunc) {
        if (window.clipboardData) {
            if (typeof callbackFunc == "function") {
                callbackFunc(window.clipboardData.getData("text") || "");
            }
        } else {
            if (typeof callbackFunc == "function") {
                var self = this;
                this._getData = false;
                var area = this.getAreaDom("esrpt_special_paste");
                if (document.createRange) {
                    area.focus();
                }
                $(area).bind("keyup", function(evt) {
                    if (!evt.ctrlKey && evt.keyCode != 17) {
                        return;
                    }
                    self._getData = true;
                    var pastedText = area.value;
                    self._data = pastedText;
                    area.value = "";
                    area.blur();
                    if (typeof callbackFunc == "function") {
                        callbackFunc(pastedText);
                        $(area).unbind("keyup");
                    }
                });
                setTimeout(function() {
                    if (!self._getData && typeof callbackFunc == "function") {
                        callbackFunc(self._data);
                        $(area).unbind("keyup");
                    }
                }, 200);
            }
        }
    }
    ;
    function TableSequence(options) {
        this.reset(options);
    }
    TableSequence.prototype.next = function() {
        throw new Error("The method 'TableSequence.next()' Unimplemented!");
    }
    ;
    TableSequence.prototype.reset = function(options) {
        if (!options) {
            throw new Error("缺少初始化参数.");
        }
    }
    ;
    function CopySequence(options) {
        CopySequence._superClass.call(this, options);
    }
    EUI.extendClass(CopySequence, TableSequence, "CopySequence");
    CopySequence.prototype.next = function() {
        this._index = (this._index + this._offset) % this._length;
        return this._items[this._index];
    }
    ;
    CopySequence.prototype.reset = function(options) {
        CopySequence._superClass.prototype.reset.call(this, options);
        var items = options["items"]
          , index = parseInt(options["index"]);
        if (!items || !$.isArray(items) || items.length < 1) {
            throw new Error("CopySequence参数非法【缺少数据项】.");
        }
        this._items = items;
        var len = this._length = items.length;
        if (isNaN(index) || index < 0) {
            index = 0;
        } else {
            if (index >= len) {
                index = index % len;
            }
        }
        this._index = index;
        this._offset = (options["offset"] || 1) + len;
    }
    ;
    function FormulaSequence(options) {
        FormulaSequence._superClass.call(this, options);
    }
    EUI.extendClass(FormulaSequence, TableSequence, "FormulaSequence");
    FormulaSequence.prototype.next = function() {
        this._curnum += this._offset;
        return this._formula.call(null, this._curnum);
    }
    ;
    FormulaSequence.prototype.reset = function(options) {
        FormulaSequence._superClass.prototype.reset.call(this, options);
        var formula = options["formula"];
        if (typeof (formula) != "function") {
            throw new Error("FormulaSequence【缺少计算公式】.");
        }
        var curnum = parseInt(options["index"]);
        if (isNaN(curnum) || curnum < 0) {
            curnum = 0;
        }
        this._curnum = curnum;
        this._formula = formula;
        this._offset = parseInt(options["offset"]) || 1;
    }
    ;
    function FormatSequence(options) {
        TableSequence.call(this, options);
        this.reset(options);
    }
    EUI.extendClass(FormatSequence, TableSequence, "FormatSequence");
    FormatSequence.prototype.next = function() {
        var rt = this._sequence.next();
        if (this._format) {
            rt = this._format.call(null, rt);
        }
        return rt;
    }
    ;
    FormatSequence.prototype.reset = function(options) {
        FormatSequence._superClass.prototype.reset.call(this, options);
        var sequence = options["sequence"]
          , format = options["format"];
        if (!(sequence instanceof TableSequence)) {
            throw new Error("FormatSequence参数非法【不是TableSequence对象】.");
        }
        this._sequence = sequence;
        this._format = typeof (format) == "function" ? format : null;
    }
    ;
    function ComplexSequence(options) {
        TableSequence.call(this, options);
        this.reset(options);
    }
    EUI.extendClass(ComplexSequence, TableSequence, "ComplexSequence");
    ComplexSequence.prototype.next = function() {
        if (this._format) {
            return this._format.call(null, this._sequences);
        } else {
            var _sequences = this._sequences
              , rt = [];
            for (var i = 0, len = _sequences.length; i < len; i++) {
                rt.push(_sequences[i].next());
            }
            return rt.join("");
        }
    }
    ;
    ComplexSequence.prototype.reset = function(options) {
        ComplexSequence._superClass.prototype.reset.call(this, options);
        var sequences = options["sequences"]
          , format = options["format"];
        if (!$.isArray(sequences)) {
            throw new Error("ComplexSequence参数非法【不是TableSequence对象数组】.");
        }
        this._format = typeof (format) == "function" ? format : null;
        this._sequences = sequences;
    }
    ;
    function SequenceFactory() {}
    SequenceFactory.ITEMS4COPY = [{
        item: ["日", "一", "二", "三", "四", "五", "六"],
        prefix: "周"
    }, {
        item: ["天", "一", "二", "三", "四", "五", "六"],
        prefix: "星期"
    }, {
        item: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        prefix: "\\b",
        suffix: "\\b"
    }, {
        item: ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
        prefix: "\\b",
        suffix: "\\b"
    }, {
        item: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    }, {
        item: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        prefix: "\\b",
        suffix: "\\b"
    }, {
        item: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        prefix: "\\b",
        suffix: "\\b"
    }, ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"], ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"], ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"], {
        item: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
        strict: true
    }, {
        item: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        strict: true
    }, {
        item: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"],
        prefix: "[^=]?",
        suffix: "([\\s|\\.].*)?",
        strict: true
    }];
    SequenceFactory.createStringSequence = function(values, options) {
        var sort4Array = function(a, b) {
            return b.length - a.length;
        };
        var checkValueInItem = function(value, items, strict) {
            if (typeof (value) !== "string") {
                return;
            }
            var prefix = null
              , suffix = null;
            if (!$.isArray(items)) {
                prefix = items["prefix"],
                suffix = items["suffix"],
                strict = strict || items["strict"],
                items = items["item"];
            }
            var itemvalue = new RegExp((items.concat().sort(sort4Array)).join("|")).exec(value);
            if (!itemvalue) {
                return;
            }
            var reg = itemvalue[0]
              , index = items.indexOf(reg);
            if (prefix) {
                reg = "(?:" + ($.isArray(prefix) ? prefix.join("|") : prefix) + ")" + reg;
            }
            if (suffix) {
                reg += "(?:" + ($.isArray(suffix) ? suffix.join("|") : suffix) + ")";
            }
            reg = strict ? new RegExp("^" + reg + "$") : new RegExp(reg);
            return reg.test(value) ? [items, index] : null;
        };
        var resolveSequence = function(items, values, itemindex, vcount, reverse, strict) {
            var value = values[0].substr(0, vcount);
            if (!value) {
                return null;
            }
            var ckrt = null
              , newitemindex = 0;
            for (var i = itemindex, len = items.length; i < len; i++) {
                ckrt = checkValueInItem(value, items[i], strict);
                if (ckrt) {
                    newitemindex = i + 1;
                    break;
                }
            }
            if (!ckrt) {
                return null;
            }
            var item = ckrt[0]
              , index = ckrt[1]
              , itemvalue = item[index]
              , pindex = value.indexOf(itemvalue)
              , prefix = "";
            if (pindex > 0) {
                var sequence = resolveSequence(items, values, 0, pindex, reverse, strict);
                if (sequence) {
                    return sequence;
                }
                prefix = value.substr(0, pindex);
            }
            var count = pindex + itemvalue.length
              , suffix = values[0].substr(count)
              , newvalues = [suffix]
              , newvalue = null
              , len = values.length
              , itemlen = item.length;
            for (var i = 1; i < len; i++) {
                itemvalue = item[(index + i) % itemlen];
                count = pindex + itemvalue.length;
                newvalue = values[i];
                if (newvalue.substr(0, count) != (prefix + itemvalue)) {
                    return resolveSequence(items, values, newitemindex, vcount, reverse, strict);
                }
                newvalue = newvalue.substr(count);
                newvalues.push(newvalue);
                if (suffix && suffix != newvalue) {
                    suffix = false;
                }
            }
            if (len === 1 && suffix || suffix === false) {
                var nextsequence = resolveSequence(items, newvalues, 0, undefined, reverse, strict);
                if (nextsequence) {
                    var sequence = SequenceFactory.createCopySequence(item, reverse, index, len);
                    return new ComplexSequence({
                        sequences: [prefix ? new FormatSequence({
                            sequence: sequence,
                            format: function(rt) {
                                return prefix + rt;
                            }
                        }) : sequence, nextsequence]
                    });
                } else {
                    if (suffix === false) {
                        return null;
                    }
                }
            }
            var sequence = SequenceFactory.createCopySequence(item, reverse, index, len);
            return new FormatSequence({
                sequence: sequence,
                format: prefix ? function(rt) {
                    return prefix + rt + suffix;
                }
                : function(rt) {
                    return rt + suffix;
                }
            });
        };
        SequenceFactory.createStringSequence = function(values, options) {
            if (!$.isArray(values) || values.length < 1) {
                return null;
            }
            options = options || {};
            var reverse = options["reverse"];
            return resolveSequence(SequenceFactory.ITEMS4COPY, values, 0, undefined, reverse, options["strict"]) || SequenceFactory.createCopySequence(values, reverse);
        }
        ;
        return SequenceFactory.createStringSequence.call(this, values, options);
    }
    ;
    SequenceFactory.createNumberSequence = function(values, options) {
        var resolveByNormalInterpolation = function(values) {
            var len = values.length;
            for (var i = 0; i < len; i++) {
                values[i] = parseFloat(values[i], 10);
                if (isNaN(values[i])) {
                    return function(n) {
                        return values[(n - 1) % len];
                    }
                    ;
                }
            }
            if (len === 1) {
                var value = values[0] - 1;
                return function(n) {
                    return value + n;
                }
                ;
            }
            if (len === 2) {
                var reduce = values[1] - values[0]
                  , v = values[0] - reduce;
                return function(n) {
                    return v + reduce * n;
                }
                ;
            }
            var v0 = values[0]
              , v1 = values[1];
            if (v0 !== 0 && v1 !== 0) {
                var equ = v1 / v0
                  , i = 1
                  , ilen = len - 1;
                for (; i < ilen; i++) {
                    if (values[i + 1] / values[i] !== equ) {
                        break;
                    }
                }
                if (i == ilen) {
                    var value = values[0] / equ;
                    return function(n) {
                        return value * Math.pow(equ, n);
                    }
                    ;
                }
            }
            v1 = v1 - v0;
            for (var i = 1, llen = len - 1; i < llen; i++) {
                v0 = v1;
                v1 = values[i + 1] - values[i];
                if (v0 * v1 < 0) {
                    return function(n) {
                        return values[(n - 1) % len];
                    }
                    ;
                }
            }
        };
        var resolveByNewtonInterpolation = function(values) {
            var generateParam = function(ys, xs, level) {
                var len = ys.length - 1;
                if (len == 0) {
                    return ys[0];
                }
                var cys = [];
                for (var i = 0; i < len; i++) {
                    cys.push((ys[i + 1] - ys[i]) / (xs[i + level] - xs[i]));
                }
                return [ys[0]].concat(generateParam(cys, xs, level + 1));
            };
            resolveByNewtonInterpolation = function(values) {
                var xs = [];
                for (var i = 0, len = values.length; i < len; i++) {
                    xs.push(i + 1);
                }
                var params = generateParam(values, xs, 1);
                return function(n) {
                    var rt = 0;
                    for (var i = 0, len = params.length; i < len; i++) {
                        var k = params[i];
                        for (var j = 0; j < i; j++) {
                            k *= (n - xs[j]);
                        }
                        rt += k;
                    }
                    return rt;
                }
                ;
            }
            ;
            return resolveByNewtonInterpolation.call(this, values);
        };
        SequenceFactory.createNumberSequence = function(values, options) {
            var interpolation = resolveByNormalInterpolation(values);
            if (!interpolation) {
                interpolation = resolveByNewtonInterpolation(values);
            }
            return (options && options["reverse"]) ? new FormulaSequence({
                formula: interpolation,
                index: 1,
                offset: -1
            }) : new FormulaSequence({
                formula: interpolation,
                index: values.length,
                offset: 1
            });
        }
        ;
        return SequenceFactory.createNumberSequence(values, options);
    }
    ;
    SequenceFactory.createCopySequence = function(values, reverse, index, len) {
        if (isNaN(index)) {
            index = 0;
        }
        if (reverse) {
            return new CopySequence({
                items: values,
                index: index,
                offset: -1
            });
        } else {
            if (isNaN(len)) {
                len = values.length;
            }
            return new CopySequence({
                items: values,
                index: index + len - 1,
                offset: 1
            });
        }
    }
    ;
    SequenceFactory.createSequence = function(values, options) {
        if (!values) {
            return null;
        }
        var len = values.length;
        if (!len) {
            return null;
        }
        var reverse = options && options["reverse"];
        if (options["copy"]) {
            return SequenceFactory.createCopySequence(values, reverse);
        }
        var parseValues = []
          , value = null;
        for (var i = 0; i < len; i++) {
            value = parseFloat(values[i], 10);
            if (isNaN(value)) {
                for (i = 0; i < len; i++) {
                    if (typeof (values[i]) !== "string") {
                        return SequenceFactory.createCopySequence(values, reverse);
                    }
                }
                return SequenceFactory.createStringSequence(values, options);
            }
            parseValues[i] = value;
        }
        return SequenceFactory.createNumberSequence(parseValues, options);
    }
    ;
    EUI.extendObj(EUI, {
        CallBackFunc: CallBackFunc,
        CallBackFuncs: CallBackFuncs,
        extractQuotedStr: extractQuotedStr,
        Map: Map,
        StringMap: Map,
        OrderMap: OrderMap,
        StringBuffer: StringBuffer,
        TxtLoader: TxtLoader,
        TxtSection: TxtSection,
        Download: Download,
        AutoPlay: AutoPlay,
        LineReader: LineReader,
        HtmlElementFactory: HtmlElementFactory,
        AbstractReqObj: AbstractReqObj,
        ReqObjExeStatus: ReqObjExeStatus,
        sys: new Sys(),
        TimeoutQueue: TimeoutQueue,
        Cookie: Cookie,
        EsClipboard: EsClipboard,
        SequenceFactory: SequenceFactory
    });
}(window, EUI);
