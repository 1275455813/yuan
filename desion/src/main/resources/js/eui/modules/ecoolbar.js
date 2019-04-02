define(
	[ "eui/modules/uibase", "eui/modules/emenu" ],
	function(uibase, emenu) {
	    var EComponent = uibase.EComponent, EPopupMenu = emenu.EPopupMenu, EColorPicker, ELineStylePicker, ELineWidthPicker, EImageListPanel, EFontCombobox, EFontSizeCombobox;
	    var parseBool = EUI.parseBool;
	    function _initObj() {
	    }
	    function ECoolBar(options) {
		EComponent.call(this, options);
		this._initXCoolBar(options);
	    }
	    EUI.extendClass(ECoolBar, EComponent, "ECoolBar");
	    ECoolBar.prototype._initXCoolBar = function(options) {
		this.isvert = EUI.parseBool(options.isVertical);
		var clsnm = !options.baseCss ? "eui-coolbar-container"
			: "eui-coolbar-container " + options.baseCss;
		var $container = $('<div class="' + clsnm + '"></div>');
		if (this.parentElement) {
		    $container.appendTo(this.parentElement);
		}
		this.container = $container[0];
		this.basedom = this.container;
		this.container._sancomponent = this;
		EUI.disableDocTextSelect(this.container);
		var sizewh = this.isvert ? "h" : "w";
		EUI.bindResize(this.container, {
		    resizewh : sizewh,
		    callback : function() {
			var bands = this.cbs;
			if (!bands) {
			    return;
			}
			for (var i = 0, len = bands.length; i < len; i++) {
			    bands[i].checkBtnMore();
			}
		    }.bind(this)
		});
		if (options.disabled) {
		    this.setDisabled(true);
		}
	    };
	    ECoolBar.prototype._dispose = function() {
		if (this.currentPopup) {
		    this.currentPopup.dispose();
		    this.currentPopup = null;
		}
		if (this.currentButton) {
		    this.currentButton.dispose();
		    this.currentButton = null;
		}
		if (this.cbs) {
		    while (this.cbs.length > 0) {
			this.cbs.pop().dispose();
		    }
		    this.cbs = null;
		}
	    };
	    ECoolBar.prototype.dispose = function() {
		this._dispose();
		this.onfinish = null;
		this.userdata = null;
		this.container._sancomponent = null;
		if (this._popmenu) {
		    this._popmenu.dispose();
		    this._popmenu = null;
		    this._popelems = null;
		    this._btnMore.onclick = null;
		    this._btnMore = null;
		}
		this.checkMore = null;
		EComponent.prototype.dispose.call(this);
	    };
	    ECoolBar.prototype.getContainer = function() {
		return this.container;
	    };
	    ECoolBar.prototype.getBaseDom = ECoolBar.prototype.getContainer;
	    ECoolBar.prototype.addBand = function(nm, istoolbar, newline) {
		var cbb = new ECoolBarBand(this, nm, istoolbar, newline);
		if (!this.cbs) {
		    this.cbs = [];
		}
		this.cbs.push(cbb);
		return cbb;
	    };
	    ECoolBar.prototype.getBandCount = function() {
		return this.cbs ? this.cbs.length : 0;
	    };
	    ECoolBar.prototype.getBand = function(iorname) {
		if (!this.cbs) {
		    return null;
		}
		if (iorname && typeof (iorname) == "string") {
		    if (isNaN(iorname)) {
			var tmp;
			for (var i = 0, n = this.cbs.length; i < n; i++) {
			    tmp = this.cbs[i];
			    if (tmp.name == iorname) {
				return tmp;
			    }
			}
			return null;
		    }
		    iorname = parseInt(iorname, 10);
		}
		if (typeof (iorname) == "number" && iorname < this.cbs.length) {
		    return this.cbs[iorname];
		}
		return null;
	    };
	    ECoolBar.prototype.getAllElements = function() {
		if (!this.cbs) {
		    return null;
		}
		var rs = [];
		for (var i = 0, n = this.cbs.length; i < n; i++) {
		    var _cbs = this.cbs[i];
		    if (!_cbs.els) {
			continue;
		    }
		    for (var j = 0, k = _cbs.els.length; j < k; j++) {
			rs.push(_cbs.els[j]);
		    }
		}
		return rs.length > 0 ? rs : null;
	    };
	    ECoolBar.prototype.getElement = function(nm) {
		var aly = this.getAllElements();
		if (!aly) {
		    return null;
		}
		var rs, tmp;
		for (var i = 0; i < aly.length; i++) {
		    tmp = aly[i];
		    if (tmp.getName() === nm) {
			rs = tmp;
			break;
		    }
		}
		aly = null;
		return rs;
	    };
	    ECoolBar.prototype.getItemById = function(id) {
		if (!id || (id && typeof (id) != "string")) {
		    return;
		}
		var rs = this.getElement(id);
		if (rs) {
		    return rs;
		}
		var aly = this.getAllElements();
		if (!aly) {
		    return null;
		}
		var tmpmenu;
		for (var i = 0; i < aly.length; i++) {
		    tmpmenu = aly[i].getPopupMenu();
		    if (tmpmenu) {
			rs = tmpmenu.getMenuItem(id);
			if (rs) {
			    break;
			}
		    }
		}
		return rs;
	    };
	    ECoolBar.prototype.hidden = function() {
		if (this.currentPopup && this.currentPopup.isVisible()) {
		    this.currentPopup.hidden();
		}
		if (this.currentButton) {
		    this.currentButton._mouseOutTheme();
		}
	    };
	    ECoolBar.prototype.clear = function() {
		this.container.innerHTML = "";
		this._dispose();
	    };
	    ECoolBar.prototype._clearCurrentButton = function() {
		if (!this.currentButton) {
		    return;
		}
		if (!this.currentButton.checked) {
		    this.currentButton._mouseOutTheme();
		}
		this.currentButton = null;
	    };
	    ECoolBar.prototype._clearCurrentPopup = function() {
		if (!this.currentPopup) {
		    return;
		}
		this.currentPopup.hidden();
		this.currentPopup = null;
	    };
	    ECoolBar.prototype.setDisabled = function(f) {
		this.setEnabled(!f);
	    };
	    ECoolBar.prototype.setEnabled = function(f) {
		var els = this.getAllElements();
		if (!els) {
		    return;
		}
		for (var i = 0, n = els.length; i < n; i++) {
		    els[i].setEnabled(f);
		}
	    };
	    ECoolBar.prototype._callEvent = function(func, p) {
		if (typeof (func) == "string") {
		    if (func.length > 4 && func.lastIndexOf("(") != -1) {
			new Function("p", func)(p);
			return true;
		    } else {
			var names = func.split(".");
			func = window;
			for (var i = 0, len = names.length; i < len; i++) {
			    if (!(func = func[names[i]])) {
				return false;
			    }
			}
			func(p);
			return true;
		    }
		}
		if (typeof (func) == "function") {
		    func(p);
		    return true;
		}
		return false;
	    };
	    ECoolBar.prototype.enableCheckMore = function(enable) {
		this.checkMore = enable;
	    };
	    ECoolBar.prototype.loadBands = function(p, onfinish, userdata) {
		if (!p) {
		    return;
		}
		this.onfinish = onfinish;
		this.userdata = userdata;
		EUI.parseXML(p, _XCoolBar$LoadBands$XmlNode2BandCallback, this);
	    };
	    function _XCoolBar$LoadBands$XmlNode2BandCallback(p, coolbar) {
		coolbar.clear();
		if (p && p.nodeType === 1) {
		    var jsurl = p.getAttribute("jsurl");
		    if (jsurl) {
			EUI.addScripts(coolbar.doc, jsurl);
		    }
		}
		_XCoolBar$LoadBands$LoadXmlNode2XCoolBar(p, coolbar);
		if (!coolbar.onfinish) {
		    return;
		}
		coolbar.wnd.setTimeout(function() {
		    coolbar._callEvent(coolbar.onfinish,
			    coolbar.userdata ? coolbar.userdata : coolbar);
		}, 0);
	    }
	    function _XCoolBar$LoadBands$LoadXmlNode2XCoolBar(rs, coolbar) {
		if (!rs) {
		    return;
		}
		var bands = rs.getElementsByTagName("band");
		if (!bands || bands.length == 0) {
		    return;
		}
		for (var i = 0; i < bands.length; i++) {
		    _XCoolBar$LoadBands$XmlNode2Band(rs, bands[i], coolbar);
		}
	    }
	    function _XCoolBar$LoadBands$XmlNode2Band(rs, bandnode, coolbar) {
		if (!bandnode) {
		    return;
		}
		var id = bandnode.getAttribute("id"), istoolbar = EUI
			.parseBool(bandnode.getAttribute("toolbar"), true), isnewline = EUI
			.parseBool(bandnode.getAttribute("newline"), false), isvisible = EUI
			.parseBool(bandnode.getAttribute("visible"), true);
		var _band = coolbar.addBand(id, istoolbar, isnewline);
		_band.setVisible(isvisible);
		_XCoolBar$LoadBands$XmlNode2Band2(rs, bandnode, _band);
	    }
	    function _XCoolBar$LoadBands$XmlNode2Band2(rs, node, _band) {
		var tmp;
		for (var i = 0, n = node.childNodes.length; i < n; i++) {
		    tmp = node.childNodes[i];
		    if (!tmp.tagName || tmp.nodeType != 1) {
			continue;
		    }
		    if (tmp.tagName == "group") {
			_XCoolBar$LoadBands$XmlNode2Group(rs, tmp, _band);
		    } else {
			if (tmp.tagName == "item") {
			    _band.owner.loadBands_xmlNode2Element(rs, tmp,
				    _band);
			}
		    }
		}
	    }
	    function _XCoolBar$LoadBands$XmlNode2Group(rs, node, _band) {
		var _tmp, _bt, _tmpary = [];
		for (var i = 0; i < node.childNodes.length; i++) {
		    _tmp = node.childNodes[i];
		    if (!_tmp.tagName || _tmp.nodeType != 1) {
			continue;
		    }
		    _bt = _band.owner
			    .loadBands_xmlNode2Element(rs, _tmp, _band);
		    if (!_bt) {
			continue;
		    }
		    _tmpary.push(_bt);
		}
		if (_tmpary) {
		    _band.addCheckAbleButtonGroups(_tmpary, EUI.parseBool(node
			    .getAttribute("allowallup"), false));
		    _tmpary = null;
		}
	    }
	    ECoolBar.prototype.loadBands_xmlNode2Element = function(rs, node,
		    _band) {
		var id = node.getAttribute("id");
		var caption = node.getAttribute("caption");
		if (caption == "-") {
		    var btn = _band.addSpace();
		    if (id) {
			btn.setAttribute("name", id);
		    }
		    return;
		}
		var bt = null;
		var onclick = node.getAttribute("onclick")
			|| node.getAttribute("cmd");
		var type = node.getAttribute("type");
		var options = node.getAttribute("options");
		var icon = node.getAttribute("icon");
		var onarrowclick = node.getAttribute("onarrowclick");
		var oninit = node.getAttribute("oninit");
		if (oninit && typeof (oninit) == "string") {
		    oninit = eval(oninit);
		}
		switch (type && type.toLowerCase()) {
		case "colorpick":
		    bt = _band.addButtonWithColorMenu(icon, onclick,
			    onarrowclick, oninit);
		    onarrowclick = null;
		    break;
		case "font":
		    bt = _band.addFontCombobox(onclick, oninit);
		    onclick = null;
		    break;
		case "fontsize":
		    bt = _band.addFontSizeCombobox(onclick, oninit);
		    onclick = null;
		    break;
		case "linestyle":
		    bt = _band.addButtonWithLineStyle(onclick, oninit, node
			    .getAttribute("linestyle"));
		    onclick = null;
		    break;
		case "linewidth":
		    bt = _band.addButtonWithLineWidth(onclick, oninit);
		    onclick = null;
		    break;
		case "imagelist":
		    bt = _band.addButtonWithImageList(icon, null,
			    eval(options), onclick, oninit);
		    onclick = null;
		    break;
		default:
		    break;
		}
		if (!bt) {
		    bt = _band.addButton(icon, caption, oninit);
		}
		if (id) {
		    bt.setName(id);
		}
		var attrs = node.attributes, pname = null;
		for (var i = 0, len = attrs.length; i < len; i++) {
		    var attr = attrs.item(i);
		    switch (pname = attr.name) {
		    case "caption":
		    case "id":
		    case "type":
		    case "oninit":
		    case "onclick":
		    case "cmd":
		    case "onarrowclick":
		    case "options":
		    case "icon":
			break;
		    case "hint":
			bt.setHint(attr.value);
			break;
		    case "css":
			bt.setCss(attr.value);
			break;
		    case "menu":
			_XCoolBar$LoadBands$XmlNode2PopupMenu(rs, attr.value,
				bt, type);
			break;
		    case "visible":
			bt.setVisible(EUI.parseBool(attr.value, true));
			break;
		    case "enabled":
			bt.setEnabled(EUI.parseBool(attr.value, true));
			break;
		    default:
			bt[pname] = attr.value;
		    }
		}
		if (onarrowclick) {
		    bt.showRightArrowButton(true);
		    bt.setOnArrowButtonClick(onarrowclick);
		}
		if (onclick) {
		    bt.setOnClick(onclick);
		}
		return bt;
	    };
	    function _XCoolBar$LoadBands$FindXmlNode4PopupMenu(rs, id) {
		var menus = rs.getElementsByTagName("menu");
		if (!menus || menus.length == 0) {
		    return null;
		}
		var menu;
		for (var i = 0, n = menus.length; i < n; i++) {
		    menu = menus[i];
		    if (menu.getAttribute("id") === id) {
			return menu;
		    }
		}
		return null;
	    }
	    function _XCoolBar$LoadBands$XmlNode2PopupMenu(rs, menu, bt, type) {
		var isDropdownmenu = type && typeof (type) == "string"
			&& type.toLowerCase() == "dropdownmenu";
		var menuNode = _XCoolBar$LoadBands$FindXmlNode4PopupMenu(rs,
			menu);
		if (!menuNode) {
		    return;
		}
		bt._menuXml = menuNode;
		var lazyload = menuNode.getAttribute("lazy") !== "false";
		if (isDropdownmenu) {
		    bt.showDropdownMenuArrow(true);
		    if (lazyload) {
			bt.setOnClick(function(p) {
			    p.setOnClick(null);
			    p.loadPopupMenu(p._menuXml);
			});
		    } else {
			bt.loadPopupMenu(menuNode);
		    }
		} else {
		    bt.showRightArrowButton(true);
		    if (lazyload) {
			bt.setOnArrowButtonClick(function(p) {
			    p.setOnArrowButtonClick(null);
			    p.loadPopupMenu(p._menuXml);
			});
		    } else {
			bt.loadPopupMenu(menuNode);
		    }
		}
	    }
	    function ECoolBarBand(owner, nm, istoolbar, newline) {
		this.owner = owner;
		this._initECoolBarBand(nm, istoolbar, newline);
		this.enableMouseTheme(false);
	    }
	    ECoolBarBand.DEFAULT_ID_PREFIX = "ESEN$ECoolBarBand";
	    ECoolBarBand.IMG_BACKGROUND = EUI.xuiimg("barbg.gif");
	    ECoolBarBand.prototype.dispose = function() {
		if (this._timeout_check) {
		    this.owner.wnd.clearTimeout(this._timeout_check);
		}
		this.__userdata = null;
		this.owner = null;
		if (this.els) {
		    while (this.els.length > 0) {
			this.els.pop().dispose();
		    }
		    this.els = null;
		}
	    };
	    ECoolBarBand.prototype._initECoolBarBand = function(nm, istoolbar,
		    newline) {
		this.visible = true;
		this.setName(nm);
		this.isToolbarBand = EUI.parseBool(istoolbar, true);
		newline = newline || false;
		var clsName = "eui-coolbar-group"
			+ (this.isToolbarBand ? "" : " menu-group")
			+ (!!newline ? " newline" : "");
		var pnode = this.owner.container;
		this.container = $(
			"<ul id = " + this.name + ' class="' + clsName
				+ '"></ul>').appendTo(pnode)[0];
	    };
	    ECoolBarBand.prototype.getName = function() {
		return this.name;
	    };
	    ECoolBarBand.prototype.setName = function(nm) {
		this.name = typeof (nm) == "string" ? nm : EUI.getUniqueHtmlId(
			"ECoolBarBand", ECoolBarBand.DEFAULT_ID_PREFIX);
		if (this.container && this.container.id != this.name) {
		    this.container.id = this.name;
		}
	    };
	    ECoolBarBand.prototype.enableMouseTheme = function(enable) {
		this._enabletheme = !!enable;
	    };
	    ECoolBarBand.prototype.remove = function() {
		$(this.container).remove();
		this.dispose();
	    };
	    ECoolBarBand.prototype.setBackground = function(color, img) {
		this.container.style.background = color
			+ (typeof (img) == "string" && img.length > 4 ? " url("
				+ img + ") repeat left top" : "");
	    };
	    ECoolBarBand.prototype.setVisible = function(f) {
		this.visible = f || false;
		var s = this.visible ? "" : "none";
		if (this.container.style.display !== s) {
		    this.container.style.display = s;
		}
	    };
	    ECoolBarBand.prototype.isVisible = function() {
		return this.visible || false;
	    };
	    ECoolBarBand.prototype.getAllElements = function() {
		return this.els;
	    };
	    ECoolBarBand.prototype.getElementCount = function() {
		return this.els ? this.els.length : 0;
	    };
	    ECoolBarBand.prototype.getElement = function(iorname) {
		if (!this.els) {
		    return null;
		}
		if (iorname && typeof (iorname) == "string") {
		    if (isNaN(iorname)) {
			var tmp;
			for (var i = 0; i < this.els.length; i++) {
			    tmp = this.els[i];
			    if (tmp.name == iorname) {
				return tmp;
			    }
			}
			return null;
		    }
		    iorname = parseInt(iorname, 10);
		}
		if (typeof (iorname) == "number" && iorname < this.els.length) {
		    return this.els[iorname];
		}
		return null;
	    };
	    ECoolBarBand.prototype.addButton = function(img, caption, oninit) {
		var ce = new ECoolElement(this);
		ce.setImg(img);
		ce.setCaption(caption);
		if (typeof (oninit) == "function") {
		    ce.setOnInit(oninit);
		    oninit(ce);
		}
		if (!this.els) {
		    this.els = [];
		}
		this.els.push(ce);
		this.checkBtnMore();
		return ce;
	    };
	    ECoolBarBand.prototype.checkBtnMore = function() {
		if (this._timeout_check) {
		    this.owner.wnd.clearTimeout(this._timeout_check);
		}
		if (this.owner.checkMore === false) {
		    return;
		}
		this._timeout_check = this.owner.wnd.setTimeout(
			this._checkBtnMore.bind(this), 200);
	    };
	    ECoolBarBand.prototype._checkBtnMore = function() {
		var eles = this.els, popelems = this._popelems, popmenu = this._popmenu;
		var isvert = this.owner.isvert;
		if (eles) {
		    if (popelems) {
			popmenu.setVisible(false);
			for (var i = 0, len = popelems.length; i < len; i++) {
			    var menu = popelems[i].getPopupMenu();
			    if (menu) {
				menu.setParentActiveEMenuItem(null);
				menu.setParent(null);
			    }
			    popelems[i]._setVisible(true);
			}
			popelems.length = 0;
			popmenu.clear(true);
		    } else {
			popelems = this._popelems = [];
			ensureEPopupMenu();
			popmenu = this._popmenu = new EPopupMenu({
			    wnd : this.owner.wnd
			});
			var btnMore = this._btnMore = $(
				'<span class="eui-coolbar-more" title="'
					+ I18N
						.getString(
							"eui.modules.ecoolbar.js.moretitle",
							"显示列表") + '"></span>')
				.appendTo(this.container.parentElement)[0];
			btnMore.onclick = function(evt) {
			    popmenu.popupAtCursor(evt);
			};
		    }
		    var offheight = 0;
		    if (isvert) {
			offheight = this.container.offsetHeight;
		    }
		    var willHidden = false, conChilds = this.container.childNodes;
		    for (var i = eles.length - 1; i >= 0; i--) {
			var ele = eles[i], container = ele.getContainer();
			if (ele._enablecollapse === false) {
			    container.style.cssText += ";float:left !important;";
			    if (!this.arr) {
				this.arr = [];
			    }
			    this.arr.push(i);
			    this.container.insertBefore(container,
				    conChilds[this.arr.length - 1]);
			    willHidden = false;
			} else {
			    var offtop = container.offsetTop;
			    willHidden = isvert ? (offtop + container.offsetHeight) > offheight
				    : offtop > 10;
			}
			if (willHidden) {
			    ele._setVisible(false);
			    ele._doArrowButtonClick();
			    if (ele.getCaption() === "-") {
				popmenu.addHr();
				continue;
			    }
			    var item = null;
			    if (ele.getCustomComponent()) {
				item = popmenu.addEMenuItem("", ele.getImg(),
					function() {
					    ele.doOnClick();
					}, ele.onmenuinit);
			    } else {
				item = popmenu.addEMenuItem(ele.getCaption()
					|| ele.getHint(), ele.getImg(),
					(function(_ele) {
					    return function() {
						_ele.doOnClick();
					    };
					})(ele));
			    }
			    popelems.push(ele);
			    item.setEnabled(ele.isEnabled());
			    item.setVisible(ele.isVisible());
			    item.setName(ele.getName());
			    item.setOnPopupMenu(ele.onpopupmenu);
			    item.addMenus(ele.getPopupMenu());
			    item.setUserObj(ele.getUserObj());
			}
		    }
		    if (this.arr) {
			for (var i = this.arr.length - 1; i >= 0; i--) {
			    var liIndex = this.arr[i];
			    var nextdom = conChilds[liIndex + i + 1];
			    if (nextdom) {
				this.container.insertBefore(conChilds[i],
					nextdom);
			    } else {
				this.container.appendChild(conChilds[i]);
			    }
			    conChilds[liIndex + i].style["float"] = "none";
			}
			this.arr = [];
		    }
		    var lastLi = eles[eles.length - 1].getContainer();
		    var btnMore = this._btnMore, len = popelems.length;
		    btnMore.style.display = len ? "" : "none";
		    btnMore.innerHTML = "" + len;
		}
		this._timeout_check = false;
	    };
	    ECoolBarBand.prototype.addSpace = function(item) {
		if (item && item.getContainer) {
		    return $('<li class="eui-coolbar-line"></li>').insertAfter(
			    item.getContainer());
		}
		return $('<li class="eui-coolbar-line"></li>').appendTo(
			this.container)[0];
	    };
	    ECoolBarBand.prototype.addButtonWithColorMenu = function(img,
		    callback, onarrowclick, oninit, type) {
		var ce = this.addCustomElement("", oninit), name;
		ce.isCustomElement = false;
		if (!EColorPicker) {
		    EColorPicker = require("eui/modules/epicker").EColorPicker;
		}
		var coolbar = this.owner;
		if (type == "expedit") {
		    var showCancel = true, showApply = false;
		    img = null;
		    name = null;
		} else {
		    name = "tool";
		}
		ce.customElement = new EColorPicker({
		    wnd : coolbar.wnd,
		    parentElement : ce.container,
		    onclick : function(p) {
			coolbar._callEvent(callback, p);
		    },
		    type : name,
		    icon : img,
		    fromP : type,
		    showCancel : showCancel,
		    showApply : showApply
		});
		ce.customElement.setColor(ce.customElement.getColor());
		return ce;
	    };
	    ECoolBarBand.prototype.addButtonWithImageList = function(img, hint,
		    options, callback, oninit) {
		var bt = this.addButton(img, "", oninit);
		bt.setHint(hint);
		bt.showDropdownMenuArrow(true);
		bt.setOnClick(function(p) {
		    if (p.popupMenu) {
			return;
		    }
		    ensureEPopupMenu();
		    p.popupMenu = new EPopupMenu(p.owner.owner.wnd);
		    p.setDropdownMenu(p.popupMenu);
		    if (p.popupMenu.getMenuItemCount() > 0) {
			return;
		    }
		    bt.customElement.__userdata = p.popupMenu;
		    bt.customElement.setVisible(true);
		    p.popupMenu.addEMenuItem("ImageList").insertDOM(
			    bt.customElement.getBaseDom());
		});
		if (!EImageListPanel) {
		    EImageListPanel = require("eui/modules/epanel").EImageListPanel;
		}
		bt.customElement = new EImageListPanel({
		    wnd : bt.wnd,
		    parentElement : null,
		    options : options
		});
		bt.customElement.setVisible(false);
		var coolbar = this.owner;
		bt.customElement.onclick = function(p, value) {
		    coolbar._callEvent(callback, p);
		    p.__userdata.hidden();
		};
		return bt;
	    };
	    ECoolBarBand.prototype.addFontCombobox = function(callback, oninit) {
		var ce = this.addCustomElement("", oninit);
		if (!EFontCombobox) {
		    EFontCombobox = require("eui/modules/ecombobox").EFontCombobox;
		}
		ce.customElement = new EFontCombobox({
		    wnd : this.owner.wnd,
		    parentElement : ce.container,
		    width : 60,
		    height : null,
		    hasicon : false
		});
		ce.customElement.setFontName(I18N.getString("DEFAULTFONTNAME",
			"宋体"), false);
		var coolbar = this.owner;
		ce.customElement.setOnChange(function(p) {
		    coolbar._callEvent(callback, p);
		});
		return ce;
	    };
	    ECoolBarBand.prototype.addFontSizeCombobox = function(callback,
		    oninit) {
		var ce = this.addCustomElement("", oninit);
		if (!EFontSizeCombobox) {
		    EFontSizeCombobox = require("eui/modules/ecombobox").EFontSizeCombobox;
		}
		ce.customElement = new EFontSizeCombobox({
		    wnd : this.owner.wnd,
		    parentElement : ce.container,
		    width : 50,
		    height : 55,
		    hasicon : false
		});
		ce.customElement.setFontSize(12, false);
		var coolbar = this.owner;
		ce.customElement.setOnChange(function(p) {
		    coolbar._callEvent(callback, p);
		});
		return ce;
	    };
	    ECoolBarBand.prototype.addButtonWithLineStyle = function(callback,
		    oninit, linestyle) {
		var ce = this.addCustomElement("", oninit);
		if (!ELineStylePicker) {
		    ELineStylePicker = require("eui/modules/epicker").ELineStylePicker;
		}
		var coolbar = this.owner;
		ce.customElement = new ELineStylePicker({
		    wnd : this.owner.wnd,
		    parentElement : ce.container,
		    linestyle : linestyle,
		    onclick : function(p) {
			coolbar._callEvent(callback, p);
		    },
		    type : "tool"
		});
		return ce;
	    };
	    ECoolBarBand.prototype.addButtonWithLineWidth = function(callback,
		    oninit) {
		var ce = this.addCustomElement("", oninit);
		if (!ELineWidthPicker) {
		    ELineWidthPicker = require("eui/modules/epicker").ELineWidthPicker;
		}
		var coolbar = this.owner;
		ce.customElement = new ELineWidthPicker({
		    wnd : this.owner.wnd,
		    parentElement : ce.container,
		    onclick : function(p) {
			coolbar._callEvent(callback, p);
		    },
		    type : "tool"
		});
		return ce;
	    };
	    ECoolBarBand.prototype.addCustomElement = function(element, oninit,
		    onmenuinit) {
		var ce;
		if (element) {
		    if (typeof (element) == "string"
			    || typeof (element) == "number") {
			ce = this.getElement(element);
		    } else {
			if (typeof (element._initCoolElement) == "function") {
			    ce = element;
			}
		    }
		}
		if (!ce) {
		    ce = this.addButton("", "", oninit);
		}
		ce.isCustomElement = true;
		var container = ce.container;
		container.removeChild(ce.captionNode);
		EUI.removeClassName(container, "eui-coolbar-item");
		EUI.addClassName(container, "eui-coolbar-item-form");
		ce.captionNode = undefined;
		ce.onmenuinit = onmenuinit;
		return ce;
	    };
	    ECoolBarBand.prototype.addCheckAbleButtonGroups = function(groups,
		    allowallup) {
		if (!groups || typeof (groups) != "object") {
		    return;
		}
		if (this._findCheckAbleButtonForGroups(groups)) {
		    return;
		}
		if (!this.groups) {
		    this.groups = {};
		    this.groupsid = 0;
		}
		if (EUI.isArray(groups) && groups.length > 0) {
		    for (var i = 0, n = groups.length; i < n; i++) {
			var item = groups[i];
			item.setCheckAble(true);
			EUI.addClassName(item.getContainer(),
				"eui-coolbar-item-group");
		    }
		    var itemFirst = groups[0];
		    var itemLast = groups[groups.length - 1];
		    EUI.addClassName(itemFirst.getContainer(),
			    "eui-coolbar-item-group-first");
		    EUI.addClassName(itemLast.getContainer(),
			    "eui-coolbar-item-group-last");
		    this.addSpace(itemLast);
		}
		this.groups[this.groupsid] = groups;
		this.groups[this.groupsid].allowallup = allowallup || false;
		this.groupsid += 1;
	    };
	    ECoolBarBand.prototype._findCheckAbleButtonForGroups = function(p) {
		if (!this.groups || this.groupsid == 0) {
		    return false;
		}
		var tmp;
		for (var i = 0, n = p.length; i < n; i++) {
		    for (var ii = 0; ii < this.groupsid; ii++) {
			tmp = this.groups[ii];
			for (var iii = 0; iii < tmp.length; iii++) {
			    if (tmp[iii] == p[i]) {
				return true;
			    }
			}
		    }
		}
		return false;
	    };
	    function ECoolElement(owner, nm) {
		this.owner = owner;
		this.setName(nm);
		this._initCoolElement();
		this._addEventListener();
	    }
	    ECoolElement.DEFAULT_ID_PREFIX = "ESEN$ECoolElement";
	    ECoolElement.IMG_ARROW = EUI.xuiimg("downarrow.gif");
	    ECoolElement.prototype.dispose = function() {
		this.__userdata = null;
		this._removeEventListener();
		this._menuXml = null;
		this.owner = null;
		this.onclick = null;
		this.onarrowbuttonclick = null;
		if (this.customElement) {
		    if (this.customElement.dispose) {
			this.customElement.dispose();
		    }
		    this.customElement = null;
		}
		if (this.btContainer) {
		    this.btContainer.coolelement = null;
		    this.btContainer.onclick = null;
		    this.btContainer = null;
		}
		if (this.rightArrowButtonContainer) {
		    this.rightArrowButtonContainer.coolelement = null;
		    this.rightArrowButtonContainer.onclick = null;
		    this.rightArrowButtonContainer = null;
		}
		if (this.popupMenu) {
		    this.popupMenu.dispose();
		    this.popupMenu = null;
		}
		this.onmenuinit = null;
		this.oninit = null;
		this.onclick = null;
		this.onhover = null;
		this.onleave = null;
	    };
	    ECoolElement.prototype.enableMouseTheme = function(enable) {
		this._enabletheme = !!enable;
	    };
	    ECoolElement.prototype.enableCollapse = function(enable) {
		this._enablecollapse = EUI.parseBool(enable, true);
	    };
	    ECoolElement.prototype.loadPopupMenu = function(node) {
		this._loadPopupMenuAsync(node || this._menuXml);
	    };
	    ECoolElement.prototype._loadPopupMenuAsync = function(node) {
		this._initEPopupMenu();
		if (this.popupMenu.loaded) {
		    return;
		}
		this.popupMenu.loadMenus(node);
		this.popupMenu.loaded = true;
	    };
	    ECoolElement.prototype._initEPopupMenu = function() {
		if (this.popupMenu) {
		    return;
		}
		ensureEPopupMenu();
		this.popupMenu = new EPopupMenu({
		    wnd : this.owner.owner.wnd
		});
		if (this.isDropdownMenuArrow) {
		    this.setDropdownMenu(this.popupMenu);
		} else {
		    this.setRightDropdownMenu(this.popupMenu);
		}
	    };
	    ECoolElement.prototype.moveTo = function(p) {
		if (p && typeof (p._initCoolElement) == "function") {
		    this.owner.container.insertBefore(this.container,
			    p.container);
		}
	    };
	    ECoolElement.prototype._initCoolElement = function() {
		this.enabled = true;
		this.visible = true;
		var band = this.owner, hasMore = !!band._btnMore;
		var $container = $('<li id="'
			+ this.name
			+ '"class="eui-coolbar-item"><span class="eui-coolbar-item-text"></span></li>');
		if (hasMore) {
		    $container.insertBefore(band._btnMore);
		} else {
		    $container.appendTo(this.owner.container);
		}
		this.container = $container[0];
		this.container.coolelement = this;
		this.captionNode = this.container.firstChild;
		this.isDropdownMenuArrow = false;
		this.isRightButtonArrow = false;
	    };
	    ECoolElement.prototype.getName = function() {
		return this.name;
	    };
	    ECoolElement.prototype.setWidth = function(p) {
		if (typeof (p) != "number" || !p) {
		    p = 23;
		}
		this.container.style.width = p + "px";
	    };
	    ECoolElement.prototype.setName = function(nm) {
		this.name = typeof (nm) == "string" ? nm : EUI.getUniqueHtmlId(
			"CoolElement", ECoolElement.DEFAULT_ID_PREFIX);
		if (this.container && this.container.id != this.name) {
		    this.container.id = this.name;
		}
	    };
	    ECoolElement.prototype.getUserObj = function() {
		return this.userObj;
	    };
	    ECoolElement.prototype.setUserObj = function(userObj) {
		this.userObj = userObj;
	    };
	    ECoolElement.prototype.remove = function() {
		$(this.container).remove();
		this.dispose();
	    };
	    ECoolElement.prototype.isChecked = function() {
		return this.checked || false;
	    };
	    ECoolElement.prototype.setChecked = function(f) {
		this.checked = f || false;
		if (this.checked) {
		    this._mouseDownTheme(true);
		} else {
		    this._mouseOutTheme(true);
		}
	    };
	    ECoolElement.prototype.setCheckAble = function(f) {
		this.checkAble = f || false;
	    };
	    ECoolElement.prototype.isEnabled = function() {
		return this.enabled || false;
	    };
	    ECoolElement.prototype.setEnabled = function(f) {
		f = EUI.parseBool(f, false);
		if (f) {
		    EUI.removeClassName(this.container, "eui-disabled");
		} else {
		    EUI.addClassName(this.container, "eui-disabled");
		}
		this.enabled = f;
		var cusel = this.getCustomComponent();
		if (cusel) {
		    if (cusel.setEnabled) {
			cusel.setEnabled(this.enabled);
		    } else {
			if (cusel.setDisabled) {
			    cusel.setDisabled(!this.enabled);
			}
		    }
		}
	    };
	    ECoolElement.prototype.setVisible = function(visi) {
		visi = EUI.parseBool(visi, false);
		if (visi === this.visible) {
		    return;
		}
		this.visible = visi;
		if (visi) {
		    EUI.removeClassName(this.container, "eui-hide");
		} else {
		    EUI.addClassName(this.container, "eui-hide");
		}
		this.owner.checkBtnMore();
	    };
	    ECoolElement.prototype._setVisible = function(visi) {
		var s = visi ? "" : "none";
		if (this.container.style.display != s) {
		    this.container.style.display = s;
		}
	    };
	    ECoolElement.prototype.isVisible = function() {
		return this.visible || false;
	    };
	    ECoolElement.prototype.setOnHoverPanelEvent = function(func) {
		this.onhovepanel = func;
	    };
	    ECoolElement.prototype.doOnHoverPanelEvent = function(e) {
		this._notShowDropPanelForOthers();
		if (typeof this.onhovepanel !== "function") {
		    return;
		}
		if (typeof this.dropPanelObj === "undefined") {
		    this.dropPanelObj = this.onhovepanel(e, this) || null;
		}
		if (!this.dropPanelObj || !this.dropPanelObj.setVisible) {
		    return;
		}
		this.dropPanelObj.setVisible(true, e, this);
	    };
	    ECoolElement.prototype._notShowDropPanelForOthers = function() {
		var band = this.owner, els = band.els;
		for (var i = 0, k = els.length; i < k; i++) {
		    var tmp = els[i];
		    if (tmp === this) {
			continue;
		    }
		    if (tmp.dropPanelObj && tmp.dropPanelObj.setVisible) {
			tmp.dropPanelObj.setVisible(false);
		    }
		}
	    };
	    ECoolElement.prototype.setOnLeave = function(p) {
		this.onleave = p;
	    };
	    ECoolElement.prototype.doOnLeave = function(e) {
		if (typeof (this.onleave) === "function") {
		    this.onleave(this, e);
		}
	    };
	    ECoolElement.prototype.setOnClick = function(p) {
		this.onclick = p;
	    };
	    ECoolElement.prototype.setOnAfterClick = function(p) {
		this.onafterclick = p;
	    };
	    ECoolElement.prototype.doOnClick = function(p) {
		$(this.container).click();
	    };
	    ECoolElement.prototype.setOnInit = function(p) {
		if (typeof (p) === "function") {
		    this.oninit = p;
		}
	    };
	    ECoolElement.prototype.doOnInit = function() {
		if (typeof (this.oninit) === "function") {
		    this.oninit(this);
		}
	    };
	    ECoolElement.prototype.setCaption = function(p) {
		if (!p) {
		    return;
		}
		if (p === "-") {
		    this.caption = p;
		    return;
		}
		this.caption = p.toString();
		this.captionNode.innerHTML = this.caption;
	    };
	    ECoolElement.prototype.getCaption = function() {
		return this.caption;
	    };
	    ECoolElement.prototype.setImg = function(p, hint) {
		if (!p || typeof (p) !== "string") {
		    return;
		}
		this.image = p;
		if (!this.btImg) {
		    this.btImg = $('<i class="eui-icon"></i>').insertBefore(
			    this.captionNode)[0];
		}
		EUI.setTagIcon(this.btImg, p);
		this.setHint(hint);
	    };
	    ECoolElement.prototype.getImg = function() {
		return this.image;
	    };
	    ECoolElement.prototype.setHint = function(hint) {
		if (hint && typeof (hint) == "string" && this.btImg) {
		    this.btImg.title = hint;
		}
	    };
	    ECoolElement.prototype.getHint = function() {
		return this.btImg ? this.btImg.title : "";
	    };
	    ECoolElement.prototype.setCss = function(css) {
		this.container.style.cssText += ";" + css;
	    };
	    ECoolElement.prototype.showDropdownMenuArrow = function(f) {
		if (this.btImg || this.captionNode) {
		    this.isDropdownMenuArrow = f || false;
		    if (!this.dropdownArrow) {
			this.dropdownArrow = $(
				'<span class="eui-coolbar-more" '
					+ (this.isDropdownMenuArrow ? ""
						: 'style="display:none;"')
					+ "></span>").insertAfter(
				this.captionNode)[0];
			return;
		    }
		    var visible = this.dropdownArrow.style.display != "none";
		    if (this.isDropdownMenuArrow !== visible) {
			this.dropdownArrow.style.display = this.isDropdownMenuArrow ? ""
				: "none";
		    }
		}
	    };
	    ECoolElement.prototype.setDropdownMenu = function(menu) {
		if (this.isRightButtonArrow) {
		    return;
		}
		if (typeof (menu) == "object" && menu._initEPopupMenu) {
		    this.showDropdownMenuArrow(true);
		    this.popupMenu = menu;
		}
	    };
	    ECoolElement.prototype.showRightArrowButton = function(f) {
		if (!this.owner.isToolbarBand) {
		    return;
		}
		this.isRightButtonArrow = f || false;
		if (!this.rightArrow) {
		    this.rightArrow = $(
			    '<i class="eui-coolbar-more alone" ></i>')
			    .appendTo(this.container)[0];
		    return;
		}
		var visible = this.rightArrow.style.display != "none";
		if (this.isRightButtonArrow != visible) {
		    this.rightArrow.style.display = this.isRightButtonArrow ? ""
			    : "none";
		}
	    };
	    ECoolElement.prototype.setRightDropdownMenu = function(menu) {
		if (!this.owner.isToolbarBand) {
		    return;
		}
		if (this.isDropdownMenuArrow) {
		    return;
		}
		if (typeof (menu) == "object" && menu._initEPopupMenu) {
		    this.showRightArrowButton(true);
		    this.popupMenu = menu;
		}
	    };
	    ECoolElement.prototype.getPopupMenu = function() {
		return this.popupMenu;
	    };
	    function _XCoolElement$OnClick(e, _self) {
		var self = _self;
		if (!self) {
		    self = this.coolelement;
		}
		if (!self) {
		    return;
		}
		if (!self.enabled) {
		    return;
		}
		if (self.onclick) {
		    self.owner.owner._callEvent(self.onclick, self);
		} else {
		    if (self.isRightButtonArrow) {
			_XCoolElement$RightArrowButton$OnClick(e, self);
		    }
		}
	    }
	    function _XCoolElement$RightArrowButton$OnClick(e, _self) {
		var self = _self;
		if (!self) {
		    self = this.coolelement;
		}
		if (!self) {
		    return;
		}
		if (!self.enabled) {
		    return;
		}
		self._doArrowButtonClick();
		if (self.popupMenu && self.isRightButtonArrow) {
		    self.popupMenu.popupDownAt(self.container);
		    self.owner.owner._callEvent(self.onpopupmenu, self);
		    if (self.owner.owner.currentPopup
			    && self.owner.owner.currentPopup != self.popupMenu) {
			self.owner.owner.currentPopup.hidden();
		    }
		    self.owner.owner.currentPopup = self.popupMenu;
		    if (self.owner.owner.currentButton
			    && self.owner.owner.currentButton != self) {
			self.owner.owner.currentButton._mouseOutTheme();
		    }
		    self.owner.owner.currentButton = self;
		}
		self._mouseDownTheme();
	    }
	    ECoolElement.prototype.setOnArrowButtonClick = function(p) {
		if (this.isRightButtonArrow) {
		    this.onarrowbuttonclick = p;
		}
	    };
	    ECoolElement.prototype._doArrowButtonClick = function() {
		if (this.onarrowbuttonclick) {
		    this.owner.owner._callEvent(this.onarrowbuttonclick, this);
		}
	    };
	    ECoolElement.prototype.setOnPopupMenu = function(p) {
		this.onpopupmenu = p;
	    };
	    ECoolElement.prototype.getContainer = function() {
		return this.container;
	    };
	    ECoolElement.prototype.getCustomComponent = function() {
		return this.customElement ? this.customElement : null;
	    };
	    ECoolElement.prototype._getGroup = function() {
		if (this.owner.groups) {
		    var tmp;
		    for (var i = 0; i < this.owner.groupsid; i++) {
			tmp = this.owner.groups[i];
			for (var j = 0; j < tmp.length; j++) {
			    if (tmp[j] == this) {
				return tmp;
			    }
			}
		    }
		}
		return null;
	    };
	    ECoolElement.prototype._notCheckForGroup = function(p) {
		if (!p || p.length == 0 || p.allowallup) {
		    return;
		}
		var tmp;
		for (var i = 0; i < p.length; i++) {
		    tmp = p[i];
		    if (tmp != this) {
			tmp.setChecked(false);
		    }
		}
	    };
	    ECoolElement.prototype._mouseDownTheme = function(enable) {
		if (!(this.owner._enabletheme || enable)) {
		    return;
		}
		if (this._enabletheme === false) {
		    return;
		}
		$(this.container).addClass("eui-coolbar-active");
	    };
	    ECoolElement.prototype._mouseOutTheme = function(enable) {
		if (!(this.owner._enabletheme || enable)) {
		    return;
		}
		$(this.container).removeClass("eui-coolbar-active");
	    };
	    function _XCoolElement$OnMouseOverEvent(e, _self) {
		var self = _self;
		if (!self) {
		    self = this.coolelement;
		}
		if (!self) {
		    return;
		}
		if (!self.enabled) {
		    return;
		}
		if (self.owner.owner.isDisabled()) {
		    return;
		}
		var band = self.owner, coolbar = band.owner;
		if (self.isCustomElement) {
		    coolbar._clearCurrentPopup();
		    coolbar._clearCurrentButton();
		    return;
		}
		self.doOnHoverPanelEvent();
		if (band.isToolbarBand) {
		    return;
		}
		if (coolbar.currentPopup === self.popupMenu) {
		    return;
		}
		coolbar._clearCurrentPopup();
		if (coolbar.currentButton) {
		    coolbar.currentButton._mouseOutTheme();
		    coolbar.currentButton = self;
		    self._mouseDownTheme();
		}
		if (!self.owner.isToolbarBand
			&& $(self.container).hasClass("eui-coolbar-active")) {
		    if (!self.popupMenu && self._menuXml) {
			self.loadPopupMenu(self._menuXml);
		    }
		    if (self.popupMenu) {
			var methodname = coolbar.isvert ? "popupRightAt"
				: "popupDownAt";
			self.popupMenu[methodname](self.container);
			coolbar.currentPopup = self.popupMenu;
		    }
		}
	    }
	    function _XCoolElement$OnMouseOutEvent(e, _self) {
		var self = _self;
		if (!self) {
		    self = this.coolelement;
		}
		if (!self) {
		    return;
		}
		if (self.isCustomElement) {
		    return;
		}
		if (self.owner.owner.isDisabled()) {
		    return;
		}
		if (!self.checked) {
		    self._mouseOutTheme();
		}
		self.doOnLeave();
		var rs = self._getGroup();
		if (!rs) {
		    var owner = self.owner.owner, curBtn = owner.currentButton;
		    if (curBtn && !curBtn.checked) {
			if (curBtn == self) {
			    self._mouseDownTheme();
			} else {
			    curBtn._mouseOutTheme();
			    owner.currentButton = null;
			    if (!curBtn.owner._enabletheme) {
				return;
			    }
			    owner._clearCurrentPopup();
			}
		    }
		}
	    }
	    function _XCoolElement$OnClickEvent(e, _self) {
		var self = _self;
		if (!self) {
		    self = this.coolelement;
		}
		if (!self) {
		    return;
		}
		if (!self.enabled) {
		    return;
		}
		if (self.isCustomElement) {
		    return;
		}
		if (self.owner.owner.isDisabled()) {
		    return;
		}
		var target = e.target;
		if (self.isRightButtonArrow) {
		    if (!$(target).hasClass("eui-coolbar-more")) {
			_XCoolElement$OnClick(e, self);
		    } else {
			_XCoolElement$RightArrowButton$OnClick(e, self);
		    }
		    return;
		}
		self.owner.owner._callEvent(self.onclick, self);
		self.owner.owner._clearCurrentButton();
		var rs = self._getGroup();
		if (!rs) {
		    self._mouseDownTheme();
		    self.owner.owner._clearCurrentPopup();
		    if (self.popupMenu) {
			self.owner.owner._callEvent(self.onpopupmenu, self);
			self.popupMenu.popupDownAt(self.container);
			self.owner.owner.currentPopup = self.popupMenu;
		    }
		    self.owner.owner.currentButton = self;
		} else {
		    if (rs.allowallup || !self.checked) {
			self.setChecked(!self.checked);
			self._notCheckForGroup(rs);
		    }
		}
		self.owner.owner._callEvent(self.onafterclick, self);
	    }
	    ECoolElement.prototype._addEventListener = function() {
		this.container.onmouseover = _XCoolElement$OnMouseOverEvent;
		this.container.onmouseout = _XCoolElement$OnMouseOutEvent;
		this.container.onclick = _XCoolElement$OnClickEvent;
	    };
	    ECoolElement.prototype._removeEventListener = function() {
		if (!this.container) {
		    return;
		}
		if (this.container.coolelement) {
		    this.container.coolelement = null;
		}
		this.container.onmouseover = null;
		this.container.onmouseout = null;
		this.container.onclick = null;
		this.container = null;
	    };
	    function ensureEPopupMenu() {
		if (!EPopupMenu) {
		    EPopupMenu = require("eui/modules/emenu").EPopupMenu;
		}
	    }
	    return {
		ECoolBar : ECoolBar,
		ECoolElement : ECoolElement
	    };
	});