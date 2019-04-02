Function.prototype.bind2 = function(e) {
    if (!window.__objs) {
        window.__objs = [];
        window.__funs = [];
    }
    var a = this;
    var d = e.__objId;
    if (!d) {
        __objs[d = e.__objId = __objs.length] = e;
    }
    var f = a.__funId;
    if (!f) {
        __funs[f = a.__funId = __funs.length] = a;
    }
    if (!e.__closures) {
        e.__closures = [];
    }
    var g = e.__closures[f];
    if (g) {
        return g;
    }
    e = null;
    a = null;
    var c = arguments.length > 1;
    var b = arguments;
    return __objs[d].__closures[f] = function() {
        return __funs[f].apply(__objs[d], c ? Array.prototype.slice.call(b, 1) : arguments);
    }
    ;
}
;
Function.prototype.bind2EventListener = function(b) {
    var a = this;
    return function(c) {
        a.call(b, c || window.event);
    }
    ;
}
;
String.prototype.equalsIgnoreCase = function(a) {
    a = a == null ? "" : a;
    return this.toUpperCase() === a.toUpperCase();
}
;
String.prototype.compareTo = function(c) {
    var b = this.toString();
    var a = c.toString();
    if (b === a) {
        return 0;
    } else {
        if (b > a) {
            return 1;
        } else {
            return -1;
        }
    }
}
;
String.prototype.compareToIgnoreCase = function(c) {
    var b = this.toUpperCase();
    var a = c.toUpperCase();
    if (b === a) {
        return 0;
    } else {
        if (b > a) {
            return 1;
        } else {
            return -1;
        }
    }
}
;
String.prototype.toCharArray = function() {
    var b = new Array();
    for (var a = 0; a < this.length; a++) {
        b[a] = this.charAt(a);
    }
    return b;
}
;
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(a, b) {
        return this.substr(!b || b < 0 ? 0 : +b, a.length) === a;
    }
    ;
}
String.prototype.ensureNotStartWith = function(a) {
    var c = this.toString();
    if (!c || (len = this.length) == 0) {
        return c;
    } else {
        if (a.length == 0 || a.length > this.length) {
            return c;
        }
    }
    var b = c;
    while (b.startsWith(a)) {
        b = b.substring(a.length);
    }
    return b;
}
;
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(b, a) {
        if (a === undefined || a > this.length) {
            a = this.length;
        }
        return this.substring(a - b.length, a) === b;
    }
    ;
}
String.prototype.ensureStartWith = function(a) {
    var b = this.toString();
    if (!a || (a.length == 0)) {
        return b;
    }
    if (this.startsWith(a)) {
        return b;
    }
    return a + b;
}
;
String.prototype.ensureNotEndWith = function(a) {
    var c = this.toString();
    if (!c || (end = this.length) == 0) {
        return c;
    }
    if (a.length == 0) {
        return c;
    }
    var b = c;
    while (b.endsWith(a)) {
        b = b.substring(0, b.length - a.length);
    }
    return b;
}
;
String.prototype.ensureEndWith = function(a) {
    var b = this.toString();
    if (!a || (a.length === 0)) {
        return b;
    }
    return b.endsWith(a) ? b : (b + a);
}
;
String.prototype.replaceAll = function(a, b) {
    return this.replace(new RegExp(a,"gm"), b);
}
;
if (!String.prototype.trimStart) {
    String.prototype.trimStart = function() {
        return this.replace(/^\s+/, "");
    }
    ;
}
if (!String.prototype.trimEnd) {
    String.prototype.trimEnd = function() {
        return this.replace(/\s+$/, "");
    }
    ;
}
String.prototype.toArray = function(b) {
    var a = this.trim();
    if (!b) {
        b = ",";
    }
    if (a < " ") {
        return new Array();
    } else {
        return a.split(b);
    }
}
;
String.prototype.toHTML = function() {
    return this.toString().replace(/\&/g, "&amp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;");
}
;
String.prototype.unHTML = function() {
    return this.toString().replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&quot;/g, '"').replace(/\&#39;/g, "'").replace(/\&amp;/g, "&");
}
;
String.prototype.cnString2Unicode = function(a) {
    if (!a) {
        return a;
    }
    return escape(a).replace(/%/g, "\\");
}
;
String.prototype.charCodes2CnString = function(a, b) {
    if (!a) {
        return a;
    }
    return a.replace(b, function(d, c, e) {
        return String.fromCharCode(parseInt(e, 16));
    });
}
;
if (!String.prototype.repeat) {
    String.prototype.repeat = function(c) {
        if (this == null) {
            throw new TypeError("can't convert " + this + " to object");
        }
        var d = "" + this;
        c = +c;
        if (c != c) {
            c = 0;
        }
        if (c < 0) {
            throw new RangeError("repeat count must be non-negative");
        }
        if (c == Infinity) {
            throw new RangeError("repeat count must be less than infinity");
        }
        c = Math.floor(c);
        if (d.length == 0 || c == 0) {
            return "";
        }
        if (d.length * c >= 1 << 28) {
            throw new RangeError("repeat count must not overflow maximum string size");
        }
        var a = "";
        for (var b = 0; b < c; b++) {
            a += d;
        }
        return a;
    }
    ;
}
Array.prototype.putAll = function(b) {
    if (b) {
        for (var c = 0, a = b.length; c < a; c++) {
            this.push(b[c]);
        }
    }
}
;
Array.prototype.insertAt = function(b, a) {
    this.splice(a, 0, b);
}
;
Array.prototype.removeAt = function(a) {
    this.splice(a, 1);
}
;
Array.prototype.clear = function() {
    this.splice(0, this.length);
}
;
Array.prototype.compareToStr = function(a) {
    if (this.length == a.length) {
        for (var c = 0; c < this.length; c++) {
            var b = a[c];
            if (this.indexOfIgnoreCase(b) == -1) {
                return false;
            }
        }
        return true;
    }
    return false;
}
;
Array.prototype.indexOfIgnoreCase = function(c) {
    var b = c.toUpperCase();
    for (var a = 0; a < this.length; a++) {
        if (this[a].toUpperCase() == b) {
            return a;
        }
    }
    return -1;
}
;
Array.prototype.remove = function(b) {
    var a = this.indexOf(b);
    if (a >= 0) {
        this.splice(a, 1);
        return true;
    }
    return false;
}
;
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function(b) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var f = Object(this);
            var a = f.length >>> 0;
            if (typeof b !== "function") {
                throw new TypeError("predicate must be a function");
            }
            var c = arguments[1];
            var d = 0;
            while (d < a) {
                var e = f[d];
                if (b.call(c, e, d, f)) {
                    return e;
                }
                d++;
            }
            return undefined;
        },
        configurable: true,
        writable: true
    });
}
if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, "findIndex", {
        value: function(b) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var f = Object(this);
            var a = f.length >>> 0;
            if (typeof b !== "function") {
                throw new TypeError("predicate must be a function");
            }
            var c = arguments[1];
            var d = 0;
            while (d < a) {
                var e = f[d];
                if (b.call(c, e, d, f)) {
                    return d;
                }
                d++;
            }
            return -1;
        },
        configurable: true,
        writable: true
    });
}
Number.prototype.equals = function(a) {
    return this.toString() == a.toString();
}
;
Number.prototype.compareTo = function(a) {
    return this - a;
}
;
Number.prototype.toRound = function(b) {
    var a = Math.pow(10, b || 0);
    return Math.round(this * a) / a;
}
;
Number.prototype.toCeil = function(b) {
    var a = Math.pow(10, b || 0);
    return Math.ceil(this * a) / a;
}
;
Number.toHexString = function(a) {
    return a.toString(16);
}
;
Number.toBinaryString = function(a) {
    return a.toString(2);
}
;
Number.isInteger = Number.isInteger || function(a) {
    return typeof a === "number" && isFinite(a) && Math.floor(a) === a;
}
;
Date.prototype.hashCode = function() {
    var b = this.getTime();
    var c = Number.toHexString(b);
    var d = 0;
    if (c.length > 8) {
        d = parseInt(c.substring(0, c.length - 8), 16);
    }
    var a = b & 4294967295;
    return a ^ d;
}
;
Date.prototype.compareTo = function(a) {
    return (this.getTime() - a.getTime()) & 4294967295;
}
;
if (EUI.browser.isFirefox) {
    Event.prototype.__defineGetter__("srcElement", function() {
        var a = this.target;
        while (a && a.nodeType != 1) {
            a = a.parentNode;
        }
        return a;
    });
    Event.prototype.__defineSetter__("returnValue", function(a) {
        return a ? a : this.preventDefault();
    });
}