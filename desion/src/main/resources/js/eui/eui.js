+function(namespace, name) {
    var SPACE_CHAR = "&#xA0;", XUI_IMAGES_ROOT_PATH = "eui/images/icon/", ESCAPE_REGEX = /^[_0-9a-zA-Z@.\*\/\+\$\-]+$/ig, r_namespace = /^\w+(\.\w+)*$/, r_func_prefix = /^function\s*\(/, r_func_comment = /^\/\/.*(\r|\n|$)/mg, fileNameRegexZH = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|\w|\-|\+|\(|\)|\.|（|）|&|%|=)+$/, fileNameRegexEN = /^(\w|\-|\(|\))+$/, HEXCHAR = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"], RANDOM_MATH_SEED = new Date().getTime(), MONTH_NAMES = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], DAY_NAMES = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "日", "一", "二", "三", "四", "五", "六"], FILE_ICON = {
        "htm": "&#xee6c;",
        "html": "&#xee6c;",
        "asp": "&#xee6c;",
        "jsp": "&#xee6c;",
        "ftl": "&#xee6c;",
        "txt": "&#xee70;",
        "conf": "&#xee70;",
        "json": "&#xee70;",
        "css": "&#xee6f;",
        "js": "&#xee6e;",
        "xml": "&#xee6d;",
        "gif": "&#xee66;",
        "jpg": "&#xee65;",
        "jpeg": "&#xee65;",
        "pdf": "&#xee5d;",
        "png": "&#xee64;",
        "bmp": "&#xee67;",
        "portal": "&#xee6a;",
        "bat": "&#xee72;",
        "cmd": "&#xee72;",
        "exe": "&#xee72;",
        "com": "&#xee72;",
        "doc": "&#xee5f;",
        "docx": "&#xee5f;",
        "dot": "&#xee5f;",
        "xls": "&#xee5c;",
        "ppt": "&#xee5e;",
        "ldb": "&#xee60;",
        "mdb": "&#xee60;",
        "mpp": "&#xee60;",
        "npf": "&#xee6a;",
        "rpt": "&#xee6a;",
        "olap": "&#xee6b;",
        "qbe": "&#xee6b;",
        "csv": "&#xee61;",
        "zip": "&#xee62;",
        "rar": "&#xee62;",
        "esp": "&#xee69;",
        "class": "&#xee71;",
        "avi": "&#xe8ce;",
        "wmv": "&#xe8ce;",
        "rm": "&#xe8ce;",
        "rmvb": "&#xe8ce;",
        "mpeg1": "&#xe8ce;",
        "mpeg2": "&#xe8ce;",
        "mp4": "&#xe8ce;",
        "3gp": "&#xe8ce;",
        "asf": "&#xe8ce;",
        "swf": "&#xe8ce;",
        "vob": "&#xe8ce;",
        "dat": "&#xe8ce;",
        "mov": "&#xe8ce;",
        "m4v": "&#xe8ce;",
        "flv": "&#xe8ce;",
        "f4v": "&#xe8ce;",
        "mkv": "&#xe8ce;",
        "mts": "&#xe8ce;",
        "ts": "&#xe8ce;"
    }, _DPI, DPI = function(index) {
        var x, y;
        if (window.screen.deviceXDPI) {
            x = window.screen.deviceXDPI;
            y = window.screen.deviceYDPI;
        } else {
            var tmp = document.body.appendChild(document.createElement("div"));
            tmp.style.cssText += ";height: 1in; width: 1in; left: -100%; position: absolute; top: -100%;";
            x = tmp.offsetWidth;
            y = tmp.offsetHeight;
        }
        _DPI = [x, y];
    };
    function LZ(x) {
        return (x < 0 || x > 9 ? "" : "0") + x;
    }
    function _createActiveXWithClsid(parentDom, w, h, clsid) {
        var doc = parentDom.ownerDocument;
        var plugin = parentDom.appendChild(doc.createElement("object"));
        try {
            plugin.width = w;
            pluginheight = h;
            plugin.classid = clsid;
            if (plugin.readyState == 4) {
                return plugin;
            } else {
                parentDom.removeChild(plugin);
            }
        } catch (e) {}
        return null;
    }
    function _createActiveXObject(parentDom, width, height, clsid, codebase, onfinish) {
        var root = EUI.getRootWindow();
        var wnd = EUI.getWndOfDom(parentDom)
          , doc = wnd.document
          , ifrm = doc.createElement("iframe");
        ifrm.style.display = "none";
        doc.body.appendChild(ifrm);
        ifrm.onreadystatechange = function() {
            if (ifrm.readyState == "complete") {
                var plugin = _createActiveXWithClsid(parentDom, width, height, clsid);
                if (onfinish) {
                    wnd.__createActiveX_onfinish = onfinish;
                    wnd.__createActiveX_onfinish_plugin = plugin;
                    wnd.eval("__createActiveX_onfinish(__createActiveX_onfinish_plugin)");
                    wnd.__createActiveX_onfinish = null;
                    wnd.__createActiveX_onfinish_plugin = null;
                }
                root.activexupdatelog[clsid] = true;
                ifrm.onreadystatechange = null;
                ifrm.src = "about:blank";
                ifrm.style.display = "none";
                doc.body.removeChild(ifrm);
            }
        }
        ;
        var idoc = ifrm.contentWindow.document;
        idoc.open();
        idoc.writeln('<html><body><object id="plugin" codebase="' + codebase + '" classid="' + clsid + '"></object></body></html>');
        idoc.close();
    }
    function _onWindowUnLoad() {
        disposeObjectInWnd(this);
        EUI.removeEvent(this, "unload", _onWindowUnLoad);
    }
    function disposeObjectInWnd(wnd) {
        var disposeList = wnd.__disposeObjList;
        wnd.__disposeObjList = null;
        if (!disposeList) {
            return;
        }
        var obj = null;
        while (disposeList.length > 0) {
            obj = disposeList.pop();
            if (!obj) {
                continue;
            }
            try {
                if (typeof (obj.dispose) == "function") {
                    obj.dispose(true);
                } else {
                    if (typeof (obj.invoke) == "function") {
                        obj.invoke();
                    } else {
                        if (typeof (obj) == "function") {
                            obj();
                        } else {
                            wnd.eval(obj);
                        }
                    }
                }
            } catch (ex) {
                EUI.sys.gc();
            }
        }
        EUI.sys.gc();
    }
    function isArray(target) {
        return Object.prototype.toString.call(target) === "[object Array]";
    }
    function isBoolean(target) {
        return Object.prototype.toString.call(target) === "[object Boolean]";
    }
    function isFunction(target) {
        return Object.prototype.toString.call(target) === "[object Function]";
    }
    function isPlainObject(obj) {
        if (!obj || typeof (obj) !== "object" || obj.nodeType || obj.window === obj) {
            return false;
        }
        try {
            if (obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    function extendObj() {
        var target = arguments[0]
          , i = 1
          , deep = false
          , len = arguments.length;
        if (isBoolean(target)) {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (i === len) {
            target = isArray(target) ? [] : {};
            i--;
        } else {
            if (typeof target !== "object" && !isFunction(target)) {
                target = {};
            }
        }
        var options = null
          , name = null
          , src = null
          , copy = null
          , clone = null
          , copyIsArray = false;
        for (; i < len; i++) {
            if ((options = arguments[i]) == null) {
                continue;
            }
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (src === copy) {
                    continue;
                }
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = isArray(src) ? src : [];
                    } else {
                        clone = isPlainObject(src) ? src : {};
                    }
                    target[name] = extendObj(deep, clone, copy);
                } else {
                    if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
    var EUI = null;
    EUI = namespace[name] = {};
    extendObj(EUI, {
        extendObj: extendObj,
        extendClass: function(fConstr, fSuperConstr, sName) {
            if (!fSuperConstr || fConstr._superClass === fSuperConstr) {
                return;
            }
            var f = function() {};
            f.prototype = fSuperConstr.prototype;
            fConstr._superClass = fSuperConstr;
            var p = fConstr.prototype = new f();
            if (sName) {
                p._className = sName;
            }
            p.constructor = fConstr;
            return p;
        },
        extendClass_runtime: function(fConstr, fSuperConstr, sName, jses) {
            if (fConstr._superClass == fSuperConstr) {
                return;
            }
            if (typeof (fSuperConstr) == "string") {
                var ooo = window[fSuperConstr];
                if (!ooo && jses) {
                    EUI.sys.lib.includeSync(jses);
                    ooo = window[fSuperConstr];
                }
                if (!ooo) {
                    throw new Error("父类不存在：" + fSuperConstr + "\nSuperclass does not exist:" + fSuperConstr);
                }
                fSuperConstr = ooo;
            }
            if (fConstr._superClass == fSuperConstr) {
                return;
            }
            fConstr._superClass = fSuperConstr;
            var dp = fConstr.prototype;
            var sp = fSuperConstr.prototype;
            for (var i in sp) {
                if (!dp[i]) {
                    dp[i] = sp[i];
                }
            }
            if (sName) {
                dp._className = sName;
            }
            dp.constructor = fConstr;
            return dp;
        },
        isPlainObject: isPlainObject,
        isEmptyObject: function(obj) {
            if (!isPlainObject(obj)) {
                return false;
            }
            for (var key in obj) {
                return false;
            }
            return true;
        },
        empty: function(obj, names) {
            if (!obj) {
                return;
            }
            if (!names) {
                for (var key in obj) {
                    delete obj[key];
                }
            } else {
                if (EUI.isArray(names)) {
                    if (!EUI.isString(names)) {
                        return;
                    }
                    names = [names];
                }
                for (var i = 0, len = names.length; i < len; i++) {
                    delete obj[names[i]];
                }
            }
        },
        rndIdentity: function(prefix, suffix) {
            RANDOM_MATH_SEED = (RANDOM_MATH_SEED * 69069) % 2147483648;
            var rt = (RANDOM_MATH_SEED / 2147483648).toString().replace(/\w\./, "");
            if (prefix) {
                rt = prefix + rt;
            }
            if (suffix) {
                rt = rt + suffix;
            }
            return rt;
        },
        round: function(num, unit) {
            if (isNaN(num = parseFloat(num, 10))) {
                return 0;
            }
            if (isNaN(parseInt(unit, 10)) || unit <= 0) {
                return Math.round(num);
            }
            var rate = Math.pow(10, unit);
            return Math.round(num * rate) / rate;
        },
        toDecimalN: function(x, n) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return false;
            }
            var f = Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
            var s = f.toString();
            var rs = s.indexOf(".");
            if (n == 0) {
                return s;
            }
            if (rs < 0) {
                rs = s.length;
                s += ".";
            }
            while (s.length <= rs + n) {
                s += "0";
            }
            return s;
        },
        asString: function(str) {
            if (EUI.isString(str)) {
                return str;
            }
            if (str === null || str === undefined) {
                return "";
            }
            return str.toString ? str.toString() : "" + str;
        },
        parseFunc: function(str, args) {
            if (EUI.isFunction(str)) {
                return str;
            }
            if (!EUI.isString(str)) {
                return null;
            }
            var func = null;
            if (r_namespace.test(str)) {
                if (!EUI.isArray(args)) {
                    args = [args || window];
                }
                var names = str.split(".")
                  , namelen = names.length
                  , obj = null;
                for (var i = 0, len = args.length; i < len; i++) {
                    obj = args[i];
                    if (!obj) {
                        continue;
                    }
                    for (var j = 0; j < namelen; j++) {
                        if (!(obj = obj[names[j]])) {
                            break;
                        }
                    }
                    if (EUI.isFunction(obj)) {
                        func = obj;
                        break;
                    }
                }
            } else {
                str = str.replace(r_func_comment, "");
                if (r_func_prefix.test(str)) {
                    func = EUI.execJavaScript("(function(){\r\n return " + str + "\r\n})()");
                } else {
                    if (EUI.isArray(args)) {
                        for (var i = args.length - 1; i >= 0; i--) {
                            if (!EUI.isString(args[i])) {
                                args.splice(i, 1);
                            }
                        }
                    } else {
                        args = EUI.isString(args) ? [args] : [];
                    }
                    args.push(str);
                    func = Function.apply(null, args);
                }
            }
            return func;
        },
        execJavaScript: function(js, wnd) {
            if (!wnd) {
                wnd = window;
            }
            return wnd.execScript ? wnd.execScript(js) : wnd.eval(js);
        },
        parseReg: function(str, pattern) {
            if (!str) {
                return null;
            }
            if (EUI.isRegExp(str)) {
                return str;
            }
            var regstr = null;
            if (!EUI.isArray(str)) {
                if (!EUI.isString(str)) {
                    return null;
                }
                regstr = str;
            } else {
                var texts = []
                  , str_ = null;
                for (var i = 0, len = str.length; i < len; i++) {
                    if ((str_ = str[i]) && EUI.isString(str_)) {
                        texts.push(str_);
                    }
                }
                if (!texts.length) {
                    return null;
                }
                regstr = "(?:" + texts.join(")|(?:") + ")";
            }
            return new RegExp(arguments[2] === true ? ("^(?:" + regstr + ")$") : regstr,pattern || "");
        },
        parseJson: function(data) {
            if (!data) {
                return;
            }
            try {
                if (EUI.isString(data)) {
                    return JSON.parse(data);
                }
                return (EUI.isObject(data) || EUI.isArray(data)) ? data : null;
            } catch (e) {
                try {
                    return eval(data);
                } catch (e) {}
            }
        },
        parseBool: function(s, def) {
            if (EUI.isBoolean(s)) {
                return s;
            }
            if (!EUI.isString(s)) {
                return (def != null && def != undefined) ? def : false;
            }
            s = s.toUpperCase();
            if (s == "TRUE" || s == "T" || s == "1") {
                return true;
            } else {
                if (s == "FALSE" || s == "F" || s == "0") {
                    return false;
                } else {
                    return (def != null && def != undefined) ? def : false;
                }
            }
        },
        parseDate: function(date) {
            if (date && typeof (date) == "object" && date.toLocaleDateString) {
                return date;
            }
            var rs = new Date();
            var _year = rs.getFullYear()
              , _month = rs.getMonth() + 1
              , _date = rs.getDate();
            if (typeof (date) == "string" && date.length >= 4) {
                if (!isNaN(date)) {
                    _year = new Number(date.substring(0, 4)).valueOf();
                    try {
                        var _m = date.substring(4, 6);
                        var _d = date.substring(6, 8);
                        _month = _m.length > 0 ? new Number(_m).valueOf() : 1;
                        _date = _d.length > 0 ? new Number(_d).valueOf() : 1;
                    } catch (e) {}
                } else {
                    if (new RegExp("(----)","").test(date)) {
                        _year = new Number(date.substring(0, 4)).valueOf();
                        _date = 1;
                    } else {
                        if (new RegExp("(--)","").test(date)) {
                            _year = new Number(date.substring(0, 4)).valueOf();
                            _month = new Number(date.substring(4, 6)).valueOf();
                            _date = 1;
                        } else {
                            var exps = date.split(new RegExp("[-\\/\\.(年|月|日)]",""));
                            if (!exps[exps.length - 1]) {
                                exps.splice(exps.length - 1, 1);
                            }
                            if (exps.length == 3) {
                                _year = new Number(exps[0]).valueOf();
                                _month = new Number(exps[1]).valueOf();
                                _date = new Number(exps[2]).valueOf();
                            }
                            if (exps.length == 2) {
                                _year = new Number(exps[0]).valueOf();
                                _month = new Number(exps[1]).valueOf();
                                _date = 1;
                            }
                            if (exps.length == 1) {
                                var tmp = exps[0];
                                _year = new Number(tmp.substring(0, 4)).valueOf();
                                var _m = tmp.substring(4, 6);
                                _month = _m.length > 0 ? new Number(_m).valueOf() : 1;
                                _date = 1;
                            }
                        }
                    }
                }
                rs.setFullYear(_year);
                rs.setMonth(_month - 1, _date);
            }
            return rs;
        },
        parsePercent: function(value) {
            if (typeof value === "string") {
                if (value.replace(/^\s+/, "").replace(/\s+$/, "").match(/%$/)) {
                    return parseFloat(value) / 100;
                }
                return parseFloat(value);
            }
            return value;
        },
        parseXML: function(xmlstrORxmlurl, onfinish, userdata) {
            if (!xmlstrORxmlurl) {
                return;
            }
            if (typeof (xmlstrORxmlurl) == "object") {
                if (typeof (onfinish) == "function") {
                    onfinish(xmlstrORxmlurl, userdata);
                }
                return xmlstrORxmlurl;
            }
            if (typeof xmlstrORxmlurl !== "string") {
                return;
            }
            var isXmlFile = new RegExp("(.xml)$","ig").test(xmlstrORxmlurl)
              , isxmlstr = EUI.isXML(xmlstrORxmlurl) && !isXmlFile;
            if (isxmlstr) {
                var xmldom = EUI.loadXMLString(xmlstrORxmlurl);
                if (onfinish) {
                    onfinish(xmldom.documentElement ? xmldom.documentElement : xmldom, userdata);
                }
                return xmldom.documentElement ? xmldom.documentElement : xmldom;
            }
            var async = typeof (onfinish) == "function";
            if (isXmlFile) {
                if (async) {
                    EUI.get({
                        url: xmlstrORxmlurl,
                        async: async,
                        callback: function(queryObj) {
                            onfinish(queryObj.getResponseXML(), userdata);
                        }
                    });
                } else {
                    var xht = EUI.get({
                        url: xmlstrORxmlurl,
                        async: async
                    });
                    return xht.getResponseXML();
                }
            }
        },
        getXMLDOMInstance: function() {
            if (document.implementation && document.implementation.createDocument) {
                return document.implementation.createDocument("", "", null);
            }
            var axO = ["Microsoft.XMLDOM", "MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument"];
            for (var i = 0; i < axO.length; i++) {
                try {
                    return new ActiveXObject(axO[i]);
                } catch (e) {}
            }
            return null;
        },
        loadXMLString: function(data) {
            var xml, tmp;
            try {
                var r = data.indexOf("<");
                if (r > 0) {
                    data = data.substring(r);
                }
                if (window.DOMParser) {
                    tmp = new DOMParser();
                    xml = data ? tmp.parseFromString(data, "text/xml") : EUI.getXMLDOMInstance();
                } else {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                    xml = xml.documentElement;
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || xml.getElementsByTagName("parsererror").length) {
                xml = null;
            }
            return xml;
        },
        date2String: function(date, templet) {
            var year, month, day, hour, minutes, seconds, short_year, full_month, full_day, full_hour, full_minutes, full_seconds;
            if (!templet) {
                templet = "yyyy-mm-dd";
            }
            year = date.getFullYear().toString();
            if (year.length < 4) {
                if (year.length == 0) {
                    year = "0000";
                } else {
                    if (year.length == 1) {
                        year = "000" + year;
                    } else {
                        if (year.length == 2) {
                            year = "00" + year;
                        } else {
                            if (year.length == 3) {
                                year = "0" + year;
                            }
                        }
                    }
                }
            }
            short_year = year.substring(2, 4);
            month = (date.getMonth() + 1);
            full_month = month < 10 ? "0" + month : month;
            day = date.getDate();
            full_day = day < 10 ? "0" + day : day;
            hour = date.getHours();
            full_hour = hour < 10 ? "0" + hour : hour;
            minutes = date.getMinutes();
            full_minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = date.getSeconds();
            full_seconds = seconds < 10 ? "0" + seconds : seconds;
            return templet.replace("yyyy", year).replace("mm", full_month).replace("dd", full_day).replace("yy", short_year).replace("m", month).replace("d", day).replace("hh", full_hour).replace("ii", full_minutes).replace("ss", full_seconds).replace("h", hour).replace("i", minutes).replace("s", seconds);
        },
        doCallBack: function(cb) {
            if (!cb) {
                return true;
            }
            var args = null;
            if (arguments.length > 1) {
                args = Array.prototype.slice.call(arguments, 1);
            }
            try {
                if (typeof (cb.invoke) == "function") {
                    if (args) {
                        return cb.invoke.apply(cb, args);
                    } else {
                        return cb.invoke.call(cb);
                    }
                } else {
                    if (typeof (cb) == "function") {
                        if (args) {
                            return cb.apply(null, args);
                        } else {
                            return cb();
                        }
                    } else {
                        return eval(cb);
                    }
                }
            } catch (e) {
                EUI.throwError(e.description || e.message);
            }
        },
        mySetInterval: function(wnd, func, interval, userdata1, userdata2, userdata3) {
            var timmer = wnd.setInterval(function() {
                EUI.doCallBack(func, userdata1, userdata2, userdata3);
            }, interval);
            return timmer;
        },
        mySetTimeout: function(wnd, func, interval, userdata1, userdata2, userdata3) {
            var timmer = wnd.setTimeout(function() {
                EUI.doCallBack(func, userdata1, userdata2, userdata3);
            }, interval);
            return timmer;
        },
        callFuncInWnd_Eval: function(win, funcname, defresult) {
            try {
                win = win || window;
                var func = win[funcname];
                if (!func) {
                    return defresult;
                }
                var args = new Array();
                if (arguments.length > 3) {
                    for (var i = 3; i < arguments.length; i++) {
                        var arg = arguments[i];
                        if (typeof (arg) == "string") {
                            arg = "'" + arg + "'";
                        }
                        args.push(arg);
                    }
                }
                return win.eval(funcname + "(" + args.join(",") + ")") || defresult;
            } catch (e) {
                return defresult;
            }
        },
        callFuncInWnd: function(win, funcname) {
            win = win || window;
            var func = win[funcname];
            if (!func) {
                return;
            }
            return EUI._callFuncWithArgs(func, arguments, 2);
        },
        callFuncInWnd_Async: function(js, win, funcname) {
            win = win || window;
            var func = win[funcname];
            if (func) {
                return EUI._callFuncWithArgs(func, arguments, 3);
            }
            var args = arguments;
            EUI.includeAsync(js, win, function() {
                EUI._callFuncWithArgs(callFuncInWnd, args, 1);
            }, EUI.dlgs.showWaitDialog);
        },
        _callFuncWithArgs: function(func, args, startindex) {
            if (args.length < startindex) {
                return func();
            }
            try {
                return func.apply(null, Array.prototype.slice.call(args, startindex));
            } catch (e) {
                EUI.throwError(e.description || e.message);
            }
        },
        convert2Regex: function(str) {
            if (typeof (str) != "string" || str == null || str.length == 0) {
                return null;
            }
            var arr = new Array()
              , temp = str.split(";");
            for (var x = 0; x < temp.length; x++) {
                var w = temp[x];
                if (x > 0) {
                    arr.push("|");
                }
                arr.push("^");
                for (var i = 0, is = w.length; i < is; i++) {
                    var c = w.charAt(i);
                    switch (c) {
                    case "*":
                        arr.push(".*");
                        break;
                    case "?":
                        arr.push(".");
                        break;
                    case "(":
                    case ")":
                    case "[":
                    case "]":
                    case "$":
                    case "^":
                    case ".":
                    case "{":
                    case "}":
                    case "|":
                    case "\\":
                        arr.push("\\");
                        arr.push(c);
                        break;
                    default:
                        arr.push(c);
                        break;
                    }
                }
                arr.push("$");
            }
            return arr.join("");
        },
        str2Text: function(s) {
            if (s == null || s.length == 0) {
                return s;
            }
            var result = [];
            var i, k = 0, len;
            for (i = 0,
            len = s.length; i < len; i++) {
                var c = s.charAt(i);
                var cd = s.charCodeAt(i);
                switch (c) {
                case "\t":
                    result.push("\\");
                    result.push("t");
                    break;
                case "\r":
                    result.push("\\");
                    result.push("r");
                    break;
                case "\n":
                    result.push("\\");
                    result.push("n");
                    break;
                case "\\":
                    result.push("\\");
                    result.push("\\");
                    break;
                default:
                    if ((cd >= 1 && cd <= 8) || (cd >= 14 && cd <= 32) || (cd == 11) || (c == 12)) {
                        result.push("\\");
                        result.push("u");
                        result.push(new String(cd / 16).charAt(0));
                        result.push(HEXCHAR[cd % 16]);
                    } else {
                        result.push(c);
                    }
                }
            }
            return result.join("");
        },
        text2Str: function(txt) {
            if ((txt == null) || (txt.indexOf("\\") == -1)) {
                return txt;
            }
            var result = [];
            for (var i = 0, len = txt.length; i < len; ) {
                if (i == txt.length) {
                    break;
                }
                var c = txt.charAt(i);
                if (c == "\\") {
                    if (i + 1 == txt.length) {
                        return result;
                    }
                    var c2 = txt.charAt(i + 1);
                    switch (c2) {
                    case "\\":
                        result.push("\\");
                        break;
                    case "r":
                        result.push("\r");
                        break;
                    case "n":
                        result.push("\n");
                        break;
                    case "t":
                        result.push("\t");
                        break;
                    case "u":
                        if (i + 3 < txt.length) {
                            var c3 = txt.charAt(i + 2);
                            var c4 = txt.charAt(i + 3);
                            var n3 = EUI.hexToInt(c3);
                            var n4 = EUI.hexToInt(c4);
                            if ((n4 != -1) && (n3 != -1)) {
                                result.push(String.fromCharCode(n3 * 16 + n4));
                            }
                            i += 2;
                        }
                    }
                    i += 2;
                } else {
                    result.push(c);
                    i += 1;
                }
            }
            return result.join("");
        },
        hexToInt: function(s) {
            var i = -1;
            s = s.toUpperCase();
            for (var j = 0; j < HEXCHAR.length; j++) {
                if (HEXCHAR[j] == s) {
                    i = j;
                    break;
                }
            }
            return i;
        },
        quotedStr: function(s, quote) {
            if (s == null) {
                return null;
            }
            if (quote == null) {
                quote = '"';
            }
            var i = s.indexOf(quote);
            if (i == -1) {
                return quote + s + quote;
            }
            var i1 = 0;
            var value = quote;
            while (i != -1) {
                value = value + s.substring(i1, i) + quote + quote;
                i1 = i + 1;
                i = s.indexOf(quote, i1);
            }
            value = value + s.substring(i1) + quote;
            return value;
        },
        isChineseChar: function(ch) {
            return (ch >= 13312 && ch < 40959) || (ch >= 63744);
        },
        isStrEmpty: function(str) {
            return str == undefined || str == null || str == "" || str.trim().length == 0;
        },
        isXML: function(xmlstr) {
            return typeof (xmlstr) == "string" && new RegExp("<.+>","g").test(xmlstr);
        },
        ensureStrNotEmpty: function(str) {
            return (str == undefined || str == null) ? "" : str;
        },
        fileNameRegexZH: fileNameRegexZH,
        validateFileNameZH: function(text) {
            return fileNameRegexZH.test(text);
        },
        fileNameRegexEN: fileNameRegexEN,
        validateFileNameEN: function(text) {
            return fileNameRegexEN.test(text);
        },
        validateFileName: function(p, len) {
            if (p == null) {
                return false;
            }
            var exp = new RegExp("^[^/\\\\<>*?:\"|~$&'=!,\t;[\\]+%@]+$");
            var f1 = exp.test(p) && checkLen(p, len);
            if (!f1) {
                return false;
            }
            for (var i = 0; i < p.length; i++) {
                var c = p.charAt(i);
                if (c != "." && c != "\n" && c != "\r" && c != "\t" && c != " ") {
                    return true;
                }
            }
            function checkLen(t, l) {
                if (l === false) {
                    return true;
                }
                if (EUI.isNumber(l)) {
                    return t.length < l;
                }
                return t.length < 255;
            }
        },
        seperateStr: function(str, seperate) {
            if (EUI.isStrEmpty(str)) {
                return str;
            }
            var arr = [""];
            var j = 0;
            for (var i = 0, len = str.length; i < len; i++) {
                var ch = str.charAt(i);
                if (ch == seperate) {
                    if (i + 1 < len && str.charAt(i + 1) == seperate) {
                        arr[j] += ch;
                        i++;
                    } else {
                        arr[++j] = "";
                    }
                } else {
                    arr[j] += ch;
                }
            }
            return arr;
        },
        escapeURIComponent: function(str) {
            if (str == null) {
                return "";
            }
            if (typeof (str) != "string") {
                str += "";
            }
            if (str.length == 0) {
                return "";
            }
            ESCAPE_REGEX.lastIndex = 0;
            if (ESCAPE_REGEX.test(str)) {
                return str;
            } else {
                return encodeURIComponent(escape(str));
            }
        },
        unescapeURIComponent: function(str) {
            return str && str.length > 0 ? unescape(decodeURIComponent(str)) : "";
        },
        object2String: function(p, includefunc, singleQuotes) {
            if (!p || typeof (p) != "object") {
                return null;
            }
            if (typeof (singleQuotes) != "boolean") {
                singleQuotes = false;
            }
            var tmp;
            var rs = [];
            for (var key in p) {
                tmp = p[key];
                if (!tmp || (!includefunc && typeof (tmp) == "function")) {
                    continue;
                }
                rs.push(key + ":" + (singleQuotes ? "'" : '"') + tmp + (singleQuotes ? "'" : '"'));
            }
            return "{" + rs.join(",") + "}";
        },
        isValidSymbol: function(name) {
            if (name == null || name.length == 0 || name.length > 100) {
                return false;
            }
            var re = /^[a-z]+[a-z_0-9\$]*$/i;
            return re.test(name);
        },
        extractFileExt: function(fn) {
            var index = fn.lastIndexOf(".");
            return index != -1 ? fn.substring(index) : "";
        },
        extractFileName: function(fn, incext) {
            var start = fn.lastIndexOf("\\");
            if (start == -1) {
                start = fn.lastIndexOf("/");
            }
            start += 1;
            var end;
            if (incext) {
                end = fn.length;
            } else {
                end = fn.lastIndexOf(".");
                if (end == -1) {
                    end = fn.length;
                }
            }
            return fn.substring(start, end);
        },
        isAlien: function(a) {
            return !EUI.isFunction(a) && /\{\s*\[native code\]\s*\}/.test(String(a));
        },
        isPercent: function(wh) {
            return wh ? wh.trim().match(/%$/) : false;
        },
        hasValue: function(p, notrim) {
            if (p == undefined || p == null) {
                return false;
            }
            if (!notrim && typeof (p) == "string") {
                if (p.trim().length == 0) {
                    return false;
                }
            }
            return true;
        },
        getLeftTree: function(wnd) {
            var i = 0;
            var w = wnd || window;
            while (i++ < 4) {
                try {
                    var r = w.__esen_bi_lefttree;
                    if (r) {
                        return r;
                    }
                } catch (e) {}
                w = w.parent;
            }
        },
        refreshLeftTree: function(wnd) {
            var lt = EUI.getLeftTree(wnd);
            if (lt) {
                lt.refresh();
            }
        },
        refreshCrumbs: function(rid, crumbs) {
            var workspace = EUI.getWorkspace();
            if (workspace && EUI.isFunction(workspace.refreshCrumbs)) {
                workspace.refreshCrumbs(rid, crumbs);
            }
        },
        addCrumbs: function(crumbs) {
            var workspace = EUI.getWorkspace();
            if (workspace && EUI.isFunction(workspace.addCrumbs)) {
                workspace.addCrumbs(crumbs);
            }
        },
        backCrumbs: function() {
            var workspace = EUI.getWorkspace();
            if (workspace && EUI.isFunction(workspace.backCrumbs)) {
                workspace.backCrumbs();
            }
        },
        showWorkspaceUrl: function(resid, url, wnd) {
            var workspace = EUI.getWorkspace(wnd);
            if (workspace && EUI.isFunction(workspace.showURL)) {
                workspace.showURL(resid, url);
            } else {
                (wnd || window).location.href = EUI.formatUrl(url);
            }
        },
        getWorkspace: function(wnd) {
            var i = 0;
            var w = wnd || window;
            while (i++ < 4) {
                try {
                    var r = w.__esen_bi_workspace;
                    if (r) {
                        return r;
                    }
                } catch (e) {}
                w = w.parent;
            }
        },
        returnfalse: function() {
            return false;
        },
        returntrue: function() {
            return true;
        },
        returnNull: function() {},
        getHost: function() {
            var url = window.location.href;
            var idx = url.indexOf("?");
            if (idx > -1) {
                url = url.substring(0, idx);
            }
            var index = url.lastIndexOf("/");
            return index != -1 ? url.substring(0, index + 1) : "";
        },
        setParameterOfUrl: function(parameter, value, url) {
            var p = url;
            if (p && typeof (p) == "string" && p.length > 0 && p.charAt(0) == "?") {
                var ary2 = [];
                var ary = p.substring(1).split("&");
                if (ary == null || ary.length == 0) {
                    return "";
                }
                var tmp, tmpp;
                var isAdd = false;
                for (var i = 0; i < ary.length; i++) {
                    tmp = ary[i];
                    tmpp = tmp.split("=");
                    if (tmpp != null && tmpp.length == 2 && tmpp[0] == parameter) {
                        tmpp[1] = value;
                        tmp = tmpp.join("=");
                        isAdd = true;
                    }
                    ary2.push(tmp);
                }
                if (!isAdd) {
                    ary2.push(parameter + "=" + value);
                }
                return ("?" + ary2.join("&"));
            } else {
                var arr = [];
                arr.push(parameter + "=" + value);
                return ("?" + arr.join("&"));
            }
        },
        getParameterOfUrl: function(parameter, url) {
            url = EUI.unescapeURIComponent(url);
            var index = url.indexOf("?");
            if (index >= 0) {
                url = url.substring(index + 1);
            }
            var arySearch = url.split("&");
            try {
                var index, tmp, lenPar;
                for (var i = 0; i < arySearch.length; i++) {
                    lenPar = parameter.length;
                    tmp = arySearch[i];
                    if (tmp.substring(0, lenPar + 1) != parameter + "=") {
                        continue;
                    }
                    index = tmp.indexOf(parameter + "=");
                    if (index != -1) {
                        return (tmp.substring(index + lenPar + 1));
                    }
                }
                return "";
            } catch (e) {
                return "";
            }
        },
        getParameter: function(parameter, wnd) {
            wnd = wnd ? wnd : window;
            return EUI.getParameterOfUrl(parameter, window.location.search);
        },
        setParameter: function(parameter, value, win) {
            return EUI.setParameterOfUrl(parameter, value, window.location.search);
        },
        getParameterMap: function() {
            var map = new EUI.Map();
            var url = window.location.search;
            url = EUI.unescapeURIComponent(url);
            var index = url.indexOf("?");
            if (index >= 0) {
                url = url.substring(index + 1);
            }
            var arySearch = url.split("&");
            var index, tmp, lenPar;
            for (var i = 0; i < arySearch.length; i++) {
                tmp = arySearch[i];
                tmpp = tmp.split("=");
                if (tmpp != null && tmpp.length == 2) {
                    map.put(tmpp[0], tmpp[1]);
                }
            }
            return map;
        },
        bigRandom: function(n) {
            return Math.floor(Math.random() * (n ? n : 9999999999));
        },
        idRandom: function(id) {
            return id + "$" + EUI.bigRandom();
        },
        toPerNumber: function(p) {
            p = typeof (p) == "string" ? (p.lastIndexOf("%") != -1 ? p : ((p = p.toLowerCase()) && p.lastIndexOf("px") != -1 ? p : (p ? p + "px" : p))) : (typeof (p) == "number" ? p + "px" : "100%");
            return p.charAt(0) == "-" ? 0 : p;
        },
        toPixNumber: function(p, def) {
            if (typeof (p) == "number") {
                return p;
            }
            if (typeof (p) != "string") {
                return def;
            }
            return parseInt(p, 10);
        },
        getUniqueHtmlId: function(classnm, prefix) {
            var rootWindow = EUI.getRootWindow();
            var rs = rootWindow["ESEN$UniqueHtmlId4" + classnm];
            rootWindow["ESEN$UniqueHtmlId4" + classnm] = rs = rs ? rs + 1 : 1;
            return prefix ? prefix + rs : rs;
        },
        getFileIcon: function(suffix) {
            var s = !!suffix ? suffix.toLowerCase() : suffix
              , icon = FILE_ICON[s] || "&#xee63;";
            return icon;
        },
        getStrWidth: function(str) {
            var len = str.length;
            var reLen = 0;
            for (var i = 0; i < len; i++) {
                if (str.charCodeAt(i) >= 255) {
                    reLen += 2;
                } else {
                    reLen += 1;
                }
            }
            return reLen;
        },
        getSwfVersion: function(wnd) {
            wnd = wnd || window;
            var version = 0;
            try {
                var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10");
                if (swf) {
                    version = 10;
                }
            } catch (e) {
                var plugins = wnd.navigator.plugins;
                if (plugins && plugins.length > 0) {
                    var swf = plugins["Shockwave Flash"];
                    if (swf) {
                        version = parseInt(swf.description.split(" ")[2].split(".")[0], 10);
                    }
                }
            }
            return version;
        },
        getContextPath: function(wnd) {
            return EUI.sys.getContextPath(wnd);
        },
        setTimeout_killExistFirst: function(func, timeout, wnd, timerusrid) {
            if (!wnd) {
                wnd = window;
            }
            var timerusrid = "_timer_of_setTimeout_killExistFirst" + timerusrid;
            var timer = wnd[timerusrid];
            if (timer) {
                wnd.clearTimeout(timer);
                wnd[timerusrid] = 0;
            }
            wnd[timerusrid] = wnd.setTimeout(func, timeout);
        },
        setTimeoutCached: function(me, funcname, time) {
            var tmpfuncname = "__bindme_" + funcname;
            var func = me[tmpfuncname];
            if (typeof (func) != "function") {
                var __method = me[funcname];
                func = function() {
                    return __method.apply(me);
                }
                ;
                me[tmpfuncname] = func;
            }
            return setTimeout(func, time);
        },
        formatDate: function(date, format) {
            format = format + "";
            var result = "", i_format = 0, c = "", token = "", y = date.getFullYear() + "", M = date.getMonth() + 1, d = date.getDate(), E = date.getDay(), H = date.getHours(), m = date.getMinutes(), s = date.getSeconds(), value;
            value = {
                y: y,
                yyyy: y,
                yy: y.substring(2, 4),
                M: M,
                MM: LZ(M),
                MMM: MONTH_NAMES[M - 1],
                NNN: MONTH_NAMES[M + 11],
                d: d,
                dd: LZ(d),
                E: DAY_NAMES[E + 7],
                EE: DAY_NAMES[E],
                H: H,
                HH: LZ(H)
            };
            value["h"] = H == 0 ? 12 : (H > 12 ? H - 12 : H);
            value["hh"] = LZ(value["h"]);
            value["K"] = H > 11 ? H - 12 : H;
            value["k"] = H + 1;
            value["KK"] = LZ(value["K"]);
            value["kk"] = LZ(value["k"]);
            value["a"] = H > 11 ? "PM" : "AM";
            value["m"] = m;
            value["mm"] = LZ(m);
            value["s"] = s;
            value["ss"] = LZ(s);
            while (i_format < format.length) {
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                    token += format.charAt(i_format++);
                }
                if (value[token] != null) {
                    result = result + value[token];
                } else {
                    result = result + token;
                }
            }
            return result;
        },
        formatTime: function(value) {
            var timetxt = "";
            var f = 30 * 24 * 60 * 60 * 1000
              , time = Math.floor(value / f);
            if (time) {
                timetxt += time + "月";
            }
            value -= time * f;
            if (value) {
                f = 24 * 60 * 60 * 1000,
                time = Math.floor(value / f);
                if (time) {
                    timetxt += time + "天";
                    value -= time * f;
                }
            }
            if (value) {
                f = 60 * 60 * 1000,
                time = Math.floor(value / f);
                if (time) {
                    timetxt += time + "小时";
                    value -= time * f;
                }
            }
            if (value) {
                f = 60 * 1000,
                time = Math.floor(value / f);
                if (time) {
                    timetxt += time + "分钟";
                    value -= time * f;
                }
            }
            if (value) {
                f = 1000,
                time = Math.floor(value / f);
                if (time) {
                    timetxt += time + "秒";
                    value -= time * f;
                }
            }
            if (value < 1000 && value > 0) {
                timetxt += value + "毫秒";
            }
            return timetxt || "";
        },
        formatUrl: function(url) {
            if (/^http(s)?:/g.test(url)) {
                return url;
            }
            if (url.indexOf("../") == 0) {
                return url;
            }
            if (url.indexOf("/") == -1) {
                var hh = window.location.pathname;
                var i = hh.lastIndexOf("/");
                if (i >= 0) {
                    return hh.substring(0, i + 1) + url;
                }
            }
            /*var contextPath = EUI.getContextPath();
            if (contextPath != "/" && url.indexOf(contextPath) == 0) {
                return url;
            }
            url = url.replace(new RegExp("^/+"), "");*/
            return url;
        },
        formatColor: function(color, defcolor) {
            var temp = document.createElement("div");
            var getComputedColor = window.getComputedStyle ? function() {
                return window.getComputedStyle(temp)["color"];
            }
            : temp.currentStyle ? function() {
                return temp.currentStyle["color"];
            }
            : function() {
                return null;
            }
            ;
            var transInt2HexString = function(num) {
                var hex = num.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            };
            var int2rgb = function(color) {
                var c = parseInt(color, 10);
                return ("#" + transInt2HexString((c >> 16) & 255) + transInt2HexString((c >> 8) & 255) + transInt2HexString(c & 255)).toUpperCase();
            };
            var transIntOrStrColor = function(color, defcolor) {
                if (!isNaN(color) || /\d+/.test(color)) {
                    return int2rgb(color);
                } else {
                    temp.style.color = color;
                    color = getComputedColor();
                    return color ? color.toUpperCase() : defcolor;
                }
            }
              , formatColor = function(color, defcolor, strict) {
                if (!color) {
                    return defcolor;
                }
                if ("transparent" === color) {
                    return color;
                }
                if (/^#(\d|[a-f]|[A-F]){6}$/.test(color)) {
                    return color.toUpperCase();
                }
                if (/^#(\d|[a-f]|[A-F]){3}$/.test(color)) {
                    return color.replace(/([^#])/g, "$1" + "$1").toUpperCase();
                }
                if (/rgb/.test(color)) {
                    var array = color.split(",");
                    if (array.length < 3) {
                        return defcolor;
                    }
                    var rt = "#"
                      , v = null;
                    for (var i = 0; i < 3; i++) {
                        rt += transInt2HexString(parseInt(array[i].replace(/[^\d]/gi, ""), 10) & 255);
                    }
                    return rt.toUpperCase();
                }
                if (strict) {
                    return defcolor;
                }
                return transIntOrStrColor(color, defcolor);
            };
            return formatColor(color, defcolor);
        },
        loadMergeJs: function(js, wnd, onfinish, userdata) {
            var wnd = wnd || window
              , doc = wnd.document
              , node = doc.createElement("script")
              , onFinishEvent = function() {
                if (onfinish) {
                    onfinish(userdata);
                }
                if (isie) {
                    node.onreadystatechange = null;
                } else {
                    node.onload = null;
                }
            };
            if (isie) {
                node.onreadystatechange = onFinishEvent;
            } else {
                node.onload = onFinishEvent;
            }
            node.type = "text/javascript";
            node.charset = "UTF-8";
            if (!isie) {
                node.readyState = "loading";
            }
            node.src = js;
            doc.body.appendChild(node);
        },
        loadMergeJsSyn: function(jsuri, wnd) {
            var wnd = wnd || window
              , jscontent = EUI.getFileContent(jsuri);
            if (!jscontent) {
                return;
            }
            if (wnd.execScript) {
                if (!EUI.execScripting) {
                    EUI.execScripting = 0;
                }
                EUI.execScripting++;
                try {
                    wnd.execScript(jscontent);
                } finally {
                    EUI.execScripting--;
                }
            } else {
                wnd.eval(jscontent);
            }
        },
        include: function() {
            var context = EUI.sys.lib;
            context.include.apply(context, arguments);
        },
        xuiimg: function(imgName) {
            return EUI.sys.getContextPath() + XUI_IMAGES_ROOT_PATH + imgName;
        },
        _createActiveX: function(parentDom, width, height, clsid, codebase, onfinish) {
            if (!clsid) {
                return;
            }
            if (clsid.indexOf("CLSID:") == -1) {
                clsid = "CLSID:" + clsid;
            }
            var root = EUI.getRootWindow();
            if (!root.activexupdatelog) {
                root.activexupdatelog = {};
            }
            if (root.activexupdatelog[clsid] || !codebase) {
                var plugin = _createActiveXWithClsid(parentDom, width, height, clsid);
                if (plugin != null) {
                    alert("插件（" + clsid + "）已经存在，不需要安装！" + "\npluginmgr（" + clsid + "）already exists, no installation！");
                }
                if (onfinish) {
                    onfinish(plugin);
                }
                return plugin;
            }
            _createActiveXObject(parentDom, width, height, clsid, codebase, onfinish);
            return null;
        },
        _isXUIWindow: function(w) {
            var pathname;
            try {
                if (w["_is_not_xui_window_"]) {
                    return false;
                }
                if (w["EUI"]) {
                    return w.EUI.sys.getContextPath() == EUI.sys.getContextPath() && w.location.port == window.location.port;
                }
                pathname = w.location.pathname;
            } catch (e) {
                return false;
            }
            var cp = EUI.sys.getContextPath()
              , f = cp != "/" && pathname.indexOf(cp) == 0;
            if (f || (f && (pathname.indexOf("/eui/") == 0 || pathname.indexOf("/ebi/") == 0 || pathname.indexOf("/vfs/") == 0 || /\w+\.do$/ig.test(pathname)))) {
                return true;
            }
            return false;
        },
        getParentWindow: function(win) {
            try {
                win = win || window;
                var w = win.parent;
                if (EUI._isXUIWindow(w)) {
                    return w;
                }
            } catch (e) {
                return win;
            }
            return win;
        },
        getRootWindow: function() {
            try {
                var w = top.document.getElementsByTagName("frameset").length > 0 ? null : top;
                if (EUI._isXUIWindow(w)) {
                    return w;
                }
                throw new Error("impossible");
            } catch (e) {
                var i = 0, obj = window, pobj;
                while (i < 10) {
                    pobj = obj.parent;
                    try {
                        if (!EUI._isXUIWindow(pobj) || pobj.document.getElementsByTagName("frameset").length > 0) {
                            return obj;
                        }
                    } catch (e) {
                        return obj;
                    }
                    obj = pobj;
                    i++;
                }
                return obj;
            }
        },
        getPropertyFromParent: function(pname, wnd) {
            wnd = wnd || window;
            var pwnd;
            while (pwnd !== wnd) {
                pwnd = wnd;
                if (pwnd[pname] !== undefined) {
                    return pwnd[pname];
                }
                wnd = EUI.getParentWindow(wnd);
            }
            return null;
        },
        getObjectFromWindow: function(wnd, cls, saveid, disposeit, jssrc) {
            var obj = null;
            if (saveid) {
                obj = wnd[saveid];
                if (obj) {
                    return obj;
                } else {
                    if (jssrc) {
                        EUI.include(jssrc, wnd);
                    }
                    obj = wnd.eval("window." + saveid + "= new " + cls + "()");
                    if (disposeit) {
                        wnd.eval("EUI.addDispose('window." + saveid + ".dispose();window." + saveid + "=null')");
                    }
                }
            } else {
                if (jssrc) {
                    EUI.include(jssrc, wnd);
                }
                obj = wnd.eval("new " + cls + "()");
            }
            return obj;
        },
        getObjectFromWindowAsync: function(wnd, cls, saveid, disposeit, jssrc, onfinish, dontshowWaitDialog, userdata) {
            if (saveid) {
                var dlg = wnd[saveid];
                if (dlg) {
                    if (onfinish) {
                        onfinish(dlg);
                    }
                    return dlg;
                }
            }
            if (onfinish) {
                setTimeout(function() {
                    EUI.sys.lib.includeAsync(jssrc, wnd, function() {
                        if (!dontshowWaitDialog) {
                            EUI.hideWaitDialog();
                        }
                        onfinish(EUI.getObjectFromWindow(wnd, cls, saveid, disposeit));
                    }, dontshowWaitDialog ? null : function() {
                        EUI.showWaitDialog();
                    }
                    , userdata);
                }, 0);
            } else {
                return EUI.getObjectFromWindow(wnd, cls, saveid, disposeit, jssrc);
            }
        },
        getObjectFromRoot: function(cls, saveid, disposeit, jssrc) {
            var root = EUI.getRootWindow();
            return EUI.getObjectFromWindow(root, cls, saveid, disposeit, jssrc);
        },
        getObjectFromRootAsync: function(cls, saveid, disposeit, jssrc, onfinish, dontshowWaitDialog, userdata) {
            var root = EUI.getRootWindow();
            return EUI.getObjectFromWindowAsync(root, cls, saveid, disposeit, jssrc, onfinish, dontshowWaitDialog, userdata);
        },
        addDispose: function(obj, wnd) {
            wnd = wnd || window;
            var disposeList = wnd.__disposeObjList;
            if (!disposeList) {
                disposeList = new Array();
                wnd.__disposeObjList = disposeList;
                wnd.EUI.addEvent(wnd, "unload", _onWindowUnLoad);
            }
            disposeList.push(obj);
        },
        disposeIframes: function(wnd) {
            wnd = wnd || window;
            var wdfrms = wnd.document.frames, frm;
            if (wdfrms && wdfrms.length > 0) {
                for (var i = 0; i < wdfrms.length; i++) {
                    try {
                        frm = wdfrms[i];
                        disposeObjectInWnd(frm.contentWindow ? frm.contentWindow : frm);
                        frm = null;
                    } catch (e) {
                        sys.gc();
                    }
                }
            }
        },
        throwError: function(msg, detailmsg, option, httpstatus) {
            var s = msg + (detailmsg ? "\r\n--detailmessage--\r\n" + detailmsg : "");
            if (option) {
                s += "\r\n--messageInfo--\r\n" + option;
            }
            var error = new Error(s);
            if (!!httpstatus) {
                error.httpstatus = httpstatus;
            }
            throw error;
        },
        openWindow: function(url, needContextPath) {
            var a = document.createElement("a")
              , body = document.body;
            body.appendChild(a);
            if (!EUI.browser.isMobile) {
                a.target = "_blank";
            }
            a.href = (needContextPath === true ? EUI.getContextPath() : "") + url;
            a.click();
            body.removeChild(a);
        },
        closeWindow: function(wnd) {
            wnd = wnd || window;
            wnd.opener = null;
            wnd.open("", "_self");
            wnd.close();
        },
        isBoolean: isBoolean,
        isNumber: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Number]";
        },
        isString: function(obj) {
            return Object.prototype.toString.call(obj) === "[object String]";
        },
        isFunction: isFunction,
        isArray: isArray,
        isDate: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Date]";
        },
        isRegExp: function(obj) {
            return Object.prototype.toString.call(obj) === "[object RegExp]";
        },
        isObject: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Object]";
        },
        isHtmlElement: function(obj) {
            var type = Object.prototype.toString.call(obj);
            return /[object HTML[A-Za-z]*Element]/.test(type);
        },
        isUndefined: function(obj) {
            return ((obj == undefined) && (typeof (obj) == "undefined"));
        },
        SPACE_CHAR: SPACE_CHAR,
        XDPI: function() {
            if (!isArray(_DPI)) {
                DPI();
            }
            return _DPI[0];
        },
        YDPI: function() {
            if (!isArray(_DPI)) {
                DPI();
            }
            return _DPI[1];
        },
        isApp: function() {
            return "undefined" != typeof JsInterface;
        }
    });
    var userAgent = window.navigator.userAgent
      , isie = /MSIE/g.test(window.navigator.userAgent) || /Trident\/7.0/g.test(userAgent)
      , ieVersion = Number.MAX_VALUE
      , isFirefox = /Firefox/g.test(userAgent)
      , isChrome = /Chrome/g.test(userAgent)
      , isOpera = /(Opera)/g.test(userAgent)
      , isSafari = !isChrome && ((/(Safari)/g.test(userAgent)) || (/(AppleWebkit)/ig.test(userAgent)))
      , isEdge = !isChrome && !isSafari && /Edge/g.test(userAgent)
      , isCSS1Compat = document.compatMode == "CSS1Compat";
    if (isie) {
        ieVersion = isie && (function(doc) {
            var v = 3;
            if (/rv:11/g.test(userAgent)) {
                v = 11;
            } else {
                if (/(MSIE 10)/g.test(userAgent)) {
                    v = 10;
                } else {
                    var div = doc.createElement("div")
                      , all = div.getElementsByTagName("i");
                    while (div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->",
                    all[0]) {}
                }
            }
            return v > 4 ? v : Number.MAX_VALUE;
        }
        )(document);
    }
    var lowerUserAgent = userAgent.toLowerCase()
      , isIpad = lowerUserAgent.match(/ipad/i) == "ipad"
      , isIphone = lowerUserAgent.match(/iphone/i) == "iphone"
      , isAndroid = lowerUserAgent.match(/android/i) == "android"
      , isWeiXin = lowerUserAgent.match(/MicroMessenger/i) == "micromessenger"
      , isMobile = isIpad || isIphone || isAndroid;
    EUI.browser = {
        isie: isie,
        ieVersion: ieVersion,
        isFirefox: isFirefox,
        isChrome: isChrome,
        isSafari: isSafari,
        isEdge: isEdge,
        isOpera: isOpera,
        isCSS1Compat: isCSS1Compat,
        isIpad: isIpad,
        isIphone: isIphone,
        isAndroid: isAndroid,
        isMobile: isMobile,
        isWeiXin: isWeiXin
    };
    window.DLGLayerMgr = [];
    if (!(EUI.isFunction(window.define) && window.define.amd)) {
        window.require = window.requirejs = function(url) {
            var UI = window.UI;
            if (!UI) {
                UI = window.UI = {};
            }
            var urls;
            if (arguments.length === 2 && EUI.isArray(url)) {
                urls = url;
            } else {
                if (EUI.isString(url)) {
                    urls = [url];
                }
            }
            if (!urls) {
                return;
            }
            var deps = [];
            for (var i = 0, len = urls.length; i < len; i++) {
                var modules = UI.modules;
                if (!modules) {
                    modules = UI.modules = [];
                }
                var _url = urls[i];
                if (!_url) {
                    continue;
                }
                _url = _url.ensureNotEndWith(".js");
                if (modules.indexOf(_url) === -1) {
                    modules.push(_url);
                    try {
                        EUI.include(_url + ".js");
                        deps.push(UI);
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    deps.push(UI);
                }
            }
            var handle = arguments[1];
            if (EUI.isFunction(handle)) {
                handle.apply(null, deps);
            }
            return UI;
        }
        ;
        window.define = function(deps, handle) {
            var args = []
              , UI = window.UI;
            if (!UI) {
                UI = window.UI = {};
            }
            if (EUI.isArray(deps)) {
                for (var i = 0, len = deps.length; i < len; i++) {
                    args.push(UI);
                }
            } else {
                if (EUI.isFunction(deps)) {
                    handle = deps;
                }
            }
            if (!EUI.isFunction(handle)) {
                return;
            }
            var objs = handle.apply(null, args);
            if (objs) {
                EUI.extendObj(UI, objs);
            }
        }
        ;
    }
}(window, "EUI");