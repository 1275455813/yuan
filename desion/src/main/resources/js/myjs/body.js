define(["eui/modules/ecoolbar", "eui/modules/epanelsplitter", "eui/modules/etree", "eui/modules/elist","eui/modules/eform",
    "eui/modules/etabctrl","eui/modules/edialog"],
    function(ecoolbar, epanelsplitter, etree, elist,eform,etabctrl,edialog) {
    
    var ECoolBar = ecoolbar.ECoolBar;
    var Eps = epanelsplitter.EPanelSplitter;
    var ETree = etree.ETree;
    var list = elist.EList;
    var ETabCtrl = etabctrl.ETabCtrl;
    var EDialog = edialog.EDialog;
    
    /**
     * 主界面
     */
    function Body(){
	this.initTop();
	// this.initSplitPanel();
	this.createPanel();
	this.initLeftTree();
	this.initTab();
	this.initList();
    }
    
    /**
     * 初始化导航栏
     */
    Body.prototype.initTop = function(){
	var coolbar = new ECoolBar({wnd: window, width: "100%", height:"100%", parentElement: document.getElementById("topbar")});
	var band = coolbar.addBand("band_name1", true, false);
	// band.addSpace();
	var btn1 = band.addButton("", "事件列表", "");
	var btn2 = band.addButton("", "维修人员","");
	var btn3 = band.addButton("", "用户信息","");
	var rb = band.addButton("", "个人中心","");
	var rbDom = rb.getContainer();
	rbDom.style.float = "right";
	
	band.addCheckAbleButtonGroups([btn1, btn2, btn3], false);
    }
    
    Body.prototype.initSplitPanel = function(){
	
    }
    /**
     * 初始化一个分割面板
     */
    Body.prototype.createPanel = function(){
	this.panel = new Eps({
	    wnd : window,
	    ishorizontal: true,
	    parentElement : document.getElementById("base"),
	    fixedSize: 200,
	    splitbarvisible: true
	    });
	this.leftcontainer = this.panel.getLeftComponentContainer(),
        this.rightcontainer = this.panel.getRightComponentContainer();
    }
    
    Body.prototype.initTab = function(){
	this.tabctrl = new ETabCtrl({
	    wnd : window,
	    parentElement : this.rightcontainer
	});
    }
    
    Body.prototype.initLeftTree = function(){
	var treedata = [
	        {id:"level11", caption:"待解决事件", level: 1},
	        {id:"level12", caption:"已解决事件", level: 1},
	        {id:"level12", caption:"无效事件", level: 1},
	        {id:"level12", caption:"全部事件", level: 1}
	        ];
	this.tree = new ETree({
	    wnd: window,
	    parentElement: this.leftcontainer,
	    width: "100%",
	    height: "100%",
	    baseCss : "eui-tree-accordion"
	});
	var rootitem = this.tree.getRootItem();
	rootitem.loadFrom(treedata, function(item){
	    item.setHasChildren(true);
	    item.setOnClick(function(ETreeItem,event){
		if(ETreeItem.isExpanded()){
		    ETreeItem.setExpanded(false);
		}
		else{
		    ETreeItem.setExpanded(true);
		}
	    });
	});
    }
    
    Body.prototype.initList = function(){
	var index = this.tabctrl.add("事件");
	var sheet = this.tabctrl.getBodyDom(index);
	var self = this;
	var btnsconfig = [{caption: "添加", id: "add"},
	    {caption: "删除选中的记录", id: "del"},
	    {caption: "分配选中的记录", id: "multdel"},
	    {caption: "插入", id: "insert"},
	    {caption: "上移", id: "moveup"},
	    {caption: "下移", id: "movedown"},
	    ];
	var coolbarobj = new ECoolBar({
	    parentElement: sheet,
	    width : "100%",
	    height : "100%",
	    baseCss : "eui-coolbar-btn"
		}),
	band = coolbarobj.addBand("band_1_name", true, true);
	for(var i = 0, len = btnsconfig.length; i < len; i++){
	    var info = btnsconfig[i],
	        item = band.addButton(null, info.caption);
	    item.setName(info.id);
	    //item.setOnClick();
	}
	 
	var searchItem =  band.addButton(),
	    seatchdom = searchItem.getContainer();
	seatchdom.className = "eui-float-right";
	searchItem.enableCollapse(false); // 表示不能被收到菜单中去
	 
	var searchbtn = eform.eform.search({
	    wnd: window,
	    parentElement: seatchdom,
	    baseCss: "eui-form-search-radius",
	    onsearch: function(formsearch, value){
	    // alert(value);
	    }
	});
	this.list = new list({
	    parentElement: sheet,
	    width: "100%",
	    height: "100%",
	    columnResize: true,
	    autoTotalWidth: false,
	    columns: [{
		checkbox: true
		},{
	  	    caption: "事件编号",
	  	    width: "15%",
	  	    id: "id",
	            hint: true,
	            dataRener: function(span, data){
	                data = data || "";
	                span.innerHTML = data;
	                EUI.addClassName(span,"eui-link");
	            }
	  	},{
	  	    caption: "备注",
	  	    width: "15%",
	  	    id: "note",
	  	    hint: true
	  	},{
	  	    caption: "图片",
	  	    width: "15%",
	  	    dataRener: function(cell){
	  		cell.innerHTML = '<a class="eui-btn eui-btn-m" name="pic">点击查看图片</a>';
	  	    },
	  	    onCellClick: function(rowdata, td, evt){
	  		var target = evt.target;
	  		if(target.name === "pic"){
	  		    var arr = self.list.getSelectDatas();
	  		    self.showPic(arr[0].id);
	  		    //console.log(self.list.getSelectDatas());
	  		}
	  	    }
	  	},{
	  	    caption: "位置",
	  	    width: "15%",
	  	    id: "place",
	  	},{
	  	    caption: "用户名",
	  	    width: "15%",
	  	    id: "userId"
	  	},{
	  	    caption: "时间",
	  	    width: "15%",
	  	    id: "_time"
	  	},{
	  	    caption: "操作",
	  	    width: "100%",
	  	    dataRener: function(cell){
	  		var strhtml = '<a class="eui-btn eui-btn-m">编辑</a>';
	  		strhtml += '<a class="eui-btn eui-btn-m">分配</a>';
	  		strhtml += '<a class="eui-btn eui-btn-m" name="del">删除</a>';
	  		cell.innerHTML = strhtml;
	  	    },
	  	    onCellClick: function(rowdata, td, evt){
	  		//debugger
	  		var target = evt.target;
	  		if(target.name === "del"){
	  		self.list.deleteRow(td.parentNode.rowIndex);
	  		//alert(target.innerHTML)
	  		}
	  	    }
	  	}]
	});
	//this.list.setDatas(datas);
	this.ajaxPost({},"mark/getAllMarks",function(jd){
	    self.list.setDatas(jd);
	});
    }
    
    Body.prototype.showPic = function(id){
	var self = this;
	EUI.post({
	    url:"mark/getPic",
	    data: {"id" : id},
	    callback: function(queryObj){
	    var jd = queryObj.getResponseText();
	    	self.showImageDlg(jd);
	    }
	})
    }
    
    Body.prototype.showImageDlg = function(image){
	debugger
	if(!this.imageDlg){
	    this.imageDlg = new EDialog({
		wnd: EUI.getRootWindow(),
		height: 400,
		width: 800,
		caption: "事件信息"
	    });
	    //this.imageDlg.isMaxButtonVisible(true);
	    var content = this.imageDlg.getContent();
	    this.imageDlg.img = document.createElement("img");
	    content.appendChild(this.imageDlg.img);
	}
	this.imageDlg.img.src = "data:image/jpeg;base64," + image;
	this.imageDlg.showModal();
    }
    
    Body.prototype.ajaxPost= function(data,url,func){
	EUI.post({
	    url:url,
	    data: data,
	    callback: function(queryObj){
	    var jd = queryObj.getResponseJSON();
		func(jd);
	    }
	})
    }
    
    return {
	Body : Body
    };
});