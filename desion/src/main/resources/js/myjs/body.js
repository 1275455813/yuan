define(["eui/modules/ecoolbar", "eui/modules/epanelsplitter", "eui/modules/etree", "eui/modules/elist","eui/modules/eform"],
	function(ecoolbar, epanelsplitter, etree, elist,eform) {
    
    var ECoolBar = ecoolbar.ECoolBar;
    var Eps = epanelsplitter.EPanelSplitter;
    var ETree = etree.ETree;
    var list = elist.EList;
    /**
     * 主界面
     */
    function Body(){
	this.initTop();
	// this.initSplitPanel();
	this.createPanel();
	this.initLeftTree();
	this.initList();
    }
    
    /**
     * 初始化导航栏
     */
    Body.prototype.initTop = function(){
	var coolbar = new ECoolBar({wnd: window, width: "100%", height:"100%", parentElement: document.getElementById("topbar")});
	var band = coolbar.addBand("band_name1", true, false);
	// band.addSpace();
	var btn1 = band.addButton("", "信息库", "");
	var btn2 = band.addButton("", "数据库","");
	var rb = band.addButton("", "个人中心","");
	var rbDom = rb.getContainer();
	rbDom.style.float = "right";
	
	band.addCheckAbleButtonGroups([btn1, btn2], false);
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
    
    Body.prototype.initLeftTree = function(){
	var treedata = [
	        {id:"level11", caption:"第1级1", level: 1},
	        {id:"level12", caption:"第1级2", level: 1}
	        ];
	this.tree = new ETree({
	    wnd: window,
	    parentElement: this.leftcontainer,
	    width: "100%",
	    height: "100%",
	    baseCss : "eui-tree-accordion"
	});
	var rootitem = this.tree.getRootItem();
	rootitem.loadFrom(treedata);
    }
    
    Body.prototype.initList = function(){
	var self = this;
	var datasobj = [
	    {name:"AAA",resid:"ES$11$AAA",jdbcpool:"缺省链接池",tablename:"DIM_AAA", isslowgrow:"否", isiscache:"否"},
	    {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            {name:"",resid:"ES$11$报表户类型",jdbcpool:"ds1",tablename:"Q_DIM_BTYPE", isslowgrow:"否", isiscache:"否"},
            ];
	var btnsconfig = [{caption: "添加", id: "add"},
	    {caption: "删除selectRow", id: "del"},
	    {caption: "删除CheckRow", id: "multdel"},
	    {caption: "插入", id: "insert"},
	    {caption: "上移", id: "moveup"},
	    {caption: "下移", id: "movedown"},
	    ];
	var coolbarobj = new ECoolBar({
	    parentElement: this.rightcontainer,
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
	    parentElement: this.rightcontainer,
	    width: "100%",
	    height: "100%",
	    columnResize: true,
	    autoTotalWidth: false,
	    columns: [{
		checkbox: true
		},{
	  	    caption: "资源ID",
	  	    width: "15%",
	  	    id: "resid",
	            hint: true,
	            dataRener: function(span, data){
	                data = data || "";
	                span.innerHTML = data;
	                EUI.addClassName(span,"eui-link");
	            }
	  	},{
	  	    caption: "数据库链接池",
	  	    width: "15%",
	  	    id: "jdbcpool",
	  	    hint: true
	  	},{
	  	    caption: "表名",
	  	    width: "15%",
	  	    id: "tablename"
	  	},{
	  	    caption: "是否缓慢增长维",
	  	    width: "15%",
	  	    id: "isslowgrow",
	  	    align: "center"
	  	},{
	  	    caption: "是否缓存到内存",
	  	    width: "15%",
	  	    id: "isiscache",
	  	    align: "center"
	  	},{
	  	    caption: "操作",
	  	    width: "100%",
	  	    dataRener: function(cell){
	  		var strhtml = '<a class="eui-btn eui-btn-m">编辑</a>';
	  		strhtml += '<a class="eui-btn eui-btn-m">设置结构</a>';
	  		strhtml += '<a class="eui-btn eui-btn-m" name="del">删除</a>';
	  		cell.innerHTML = strhtml;
	  		},
	  		onCellClick: function(rowdata, td, evt){
	  		    debugger
	  		    var target = evt.target;
	  		    if(target.name === "del"){
	  			self.list.deleteRow(td.parentNode.rowIndex);
	  			alert(target.innerHTML)
	  			}
	  		    }
	  	}],
	  datas: datasobj
	});
    }
    
    return {
	Body : Body
    };
});