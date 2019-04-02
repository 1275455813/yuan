+function(b) {
    var a;
    a = {
	LANGUAGE_CODES : [ "zh_CN", "zh_TW", "en", "ja" ],
	LANGUAGE_NAMES : [ "简体中文", "繁體中文", "English", "日本語" ],
	getLanguageName : function(c) {
	    return a.LANGUAGE_NAMES[a.LANGUAGE_CODES.indexOf(c)];
	},
	detectLanguage : function(d) {
	    var h = b.navigator, e = h.userLanguage || h.language || d, f = e
		    .toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/), g = f[1], c = f[2];
	    if (g && c) {
		g = g + "_" + c.toUpperCase();
	    } else {
		if (!g) {
		    g = null;
		}
	    }
	    return g;
	},
	getLang : function() {
	    if (!!a._lang) {
		return a._lang;
	    } else {
		var d = new EUI.Map();
		d.put("action", "getLang");
		var c = EUI.queryObj(EUI.getContextPath() + "i18n.do", d);
		if (!!c) {
		    a._lang = c;
		    return a._lang;
		}
	    }
	},
	loadResource : function(h) {
	    try {
		var d = EUI.getRootWindow();
		if (h || !d.i18n_properties) {
		    var g = "__t__=" + new Date().getTime(), f = EUI.get({
			url : EUI.formatUrl(EUI.getContextPath()
				+ "i18n.do?action=loadLang&" + g),
			async : false
		    }), c = f.getResponseText();
		    if (c) {
			d.i18n_properties = new d.EUI.Map(c, "\n", "=");
		    }
		}
	    } catch (i) {
		d.i18n_properties = new d.EUI.Map();
		if (!!window["console"] && !!window["console"].log) {
		    window["console"].log(i);
		}
	    }
	},
	getString : function(f, g, d) {
	    return d;
	    var c = EUI.getRootWindow();
	    if (!c.i18n_properties) {
		a.loadResource();
	    }
	    var j = c.i18n_properties.get(f);
	    if (!j && !c.i18n_properties.containsKey(f)) {
		if (!g) {
		    return f;
		} else {
		    j = g;
		}
	    }
	    j = EUI.text2Str(!j ? "" : j);
	    if (!d) {
		return j;
	    }
	    var h = j.match(/{\d+}/g);
	    if (!h) {
		return j;
	    }
	    for (var e = 0; e < h.length; e++) {
		j = j.replace(h[e], d[e]);
	    }
	    return j;
	}
    };
    window.I18N = a;
}(window);