define(["eui/modules/ecoolbar"],function(ecoolbar) {
    
    var ECoolBar = ecoolbar.ECoolBar;

    function Body(pdom){
	var coolbar = new ECoolBar({wnd: window, parentElement: document.getElementById("topbar")});
	var band = coolbar.addBand("band_name1", true, false);
	//band.addSpace();
	band.addButton("", "信息库", "");
	band.addButton("", "数据库","");
	var rb = band.addButton("", "个人中心","");
	var rbDom = rb.getContainer();
	rbDom.style.float = "right";
    }
    
    return {
	Body : Body
    };
});