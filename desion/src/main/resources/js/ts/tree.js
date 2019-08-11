define(["require", "exports", "./item", "./ajax"], function (require, exports, item, ajax_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tree = /** @class */ (function () {
        function Tree(pdom) {
            this.pdom = pdom;
        }
        Tree.prototype.createRootItem = function () {
            var subItem = new item.Item(0, "root");
            this.pdom.appendChild(subItem.baseDom);
            subItem.baseDom.style.display = "none";
            subItem.setTree(this);
            return subItem;
        };
        Tree.prototype.onClick = function (subItem) {
            var arr = subItem.child;
            var len = arr.length;
            var isExpend = subItem.isExpend;
            for (var i = 0; i < len; i++) {
                var dom = arr[i].baseDom;
                if (isExpend) {
                    dom.style.display = "none";
                }
                else {
                    dom.style.display = "block";
                }
            }
            subItem.isExpend = !isExpend;
        };
        Tree.prototype.ajaxGetData = function () {
            var a = new ajax_1.ajax();
            var self = this;
            a.post("http://localhost:8080/fileSystem/root", [{ username: "wang", password: "123456" }], function (jd) {
                self.setExpendFunc(function (item) {
                    item.loadJson(jd);
                });
            });
        };
        Tree.prototype.setExpendFunc = function (expendFunc) {
            this.expendFunc = expendFunc;
        };
        Tree.prototype.setCloseFunc = function (closeFunc) {
            this.closeFunc = closeFunc;
        };
        return Tree;
    }());
    exports.Tree = Tree;
});
