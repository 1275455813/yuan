define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ajax = /** @class */ (function () {
        function ajax() {
        }
        ajax.prototype.post = function (url, data, func) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", url, true);
            //设置Content-type
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //4.发送请求
            xmlhttp.send(this.getParam(data));
            xmlhttp.onreadystatechange = function () {
                //等待服务器响应
                if (xmlhttp.readyState == 4) {
                    //当请求状态为4时，说明请求完成
                    if (xmlhttp.status == 200) {
                        //判断服务器响应状态吗是否正常
                        //取出响应的数据
                        var result = JSON.parse(xmlhttp.responseText);
                        func(result);
                    }
                }
            };
        };
        ajax.prototype.getParam = function (data) {
            var param = "";
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var d = data[i];
                param += Object.keys(d).map(function (key) {
                    return encodeURIComponent(key) + "=" + encodeURIComponent(d[key]);
                }).join("&");
            }
            return param;
        };
        return ajax;
    }());
    exports.ajax = ajax;
});
