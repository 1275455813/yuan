+function(namespace, EUI) {
    var pool_https = []
      , isunload = false
      , hasAddDispose = false
      , XMLHttp = (namespace.XMLHttpRequest ? function() {
        return new XMLHttpRequest();
    }
    : function() {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
    )
      , getHttp = function() {
        if (isunload) {
            return;
        }
        var http = pool_https.shift();
        if (!http) {
            http = XMLHttp();
            if (!hasAddDispose) {
                hasAddDispose = true;
                EUI.addDispose(function() {
                    isunload = true;
                    pool_https.forEach(function(_queryobj, _index) {
                        _queryobj.onreadystatechange = null;
                        _queryobj.abort();
                    });
                    pool_https = null;
                });
            }
        }
        return http;
    }
      , releaseHttp = function(http) {
        if (isunload) {
            return;
        }
        pool_https.push(http);
    };
    function QueryObj(actionurl, params, onfinish, userdata, autodispose, requestMethod, onError, waitMessage) {
        autodispose = EUI.parseBool(autodispose, true);
        this.async = onfinish != null;
        this.userdata = userdata;
        this.url = EUI.formatUrl(actionurl);
        this.params = params;
        this.onfinish = onfinish;
        this.autodispose = autodispose;
        this.requestMethod = requestMethod;
        this.isOnError = onError;
        this._startMessage(waitMessage);
        this._sendRequest();
    }
    QueryObj.prototype.dispose = function() {
        this.__cleanMessageTimer();
        this.onfinish = undefined;
        this.userdata = undefined;
        this.isOnError = undefined;
        if (this.hp) {
            this.hp.onreadystatechange = null;
            releaseHttp(this.hp);
            this.hp = undefined;
        }
    }
    ;
    QueryObj.prototype.abort = function() {
        var hp = this.hp;
        if (!hp) {
            return;
        }
        this.hp.onreadystatechange = null;
        this.hp.removeEventListener("abort", this.__onAbortbind, false);
        this.hp.abort();
    }
    ;
    QueryObj.prototype._startMessage = function(waitMessage) {
        if (waitMessage) {
            var message = waitMessage.message
              , timer = waitMessage.timer;
            this.__cleanMessageTimer();
            if (message) {
                if (EUI.isNumber(timer)) {
                    this.waitMessagetimer = window.setTimeout(function() {
                        this.waitMessagetimer = undefined;
                        EUI.showWaitDialog(message);
                    }
                    .bind(this), timer);
                } else {
                    EUI.showWaitDialog(message);
                }
            } else {
                delete waitMessage.finish;
                delete waitMessage.timer;
            }
        }
        this.waitMessage = waitMessage;
    }
    ;
    QueryObj.prototype.__cleanMessageTimer = function() {
        if (this.waitMessagetimer) {
            window.clearTimeout(this.waitMessagetimer);
            this.waitMessagetimer = undefined;
        }
    }
    ;
    QueryObj.prototype._onreadystatechange = function() {
        var state, self = this;
        state = this._lastReadyState = this.hp.readyState;
        var finishmsg = this.waitMessage && this.waitMessage.finish
          , errormsg = this.waitMessage && this.waitMessage.error;
        if (state == 4) {
            var onfinish = this.onfinish;
            try {
                this.checkResult();
                if (EUI.isFunction(onfinish)) {
                    onfinish(this, this.userdata);
                } else {
                    if (typeof onfinish === "string") {
                        eval(onfinish);
                    }
                }
                if (this.waitMessage) {
                    if (this.waitMessagetimer) {
                        this.__cleanMessageTimer();
                        if (finishmsg) {
                            EUI.showWaitDialogAutoHidden(1000, finishmsg, "&#xef16;", finishmsg);
                        }
                    } else {
                        if (finishmsg) {
                            setTimeout(function() {
                                EUI.hideWaitDialogWithComplete(1000, finishmsg);
                            }, 500);
                        } else {
                            EUI.hideWaitDialog(300);
                        }
                    }
                }
                if (this.autodispose) {
                    this.dispose();
                }
            } catch (e) {
                if (errormsg) {
                    EUI.hideWaitDialogWithComplete(1000, errormsg);
                } else {
                    EUI.hideWaitDialog();
                }
                if (EUI.isFunction(this.isOnError)) {
                    this.isOnError(e, this, this.userdata);
                } else {
                    EUI.showError(e);
                }
                if (this.autodispose) {
                    this.dispose();
                }
            }
        }
    }
    ;
    QueryObj.prototype.__onAbort = function() {
        EUI.hideShowError();
    }
    ;
    QueryObj.prototype._sendRequest = function() {
        this.hp = getHttp();
        this._lastReadyState = 0;
        var self = this, params = this.params, async = this.async, autodispose = this.autodispose, reqMethod = !!this.requestMethod ? this.requestMethod.toUpperCase() : ((params) ? "POST" : "GET"), timestamp = "__t__=" + new Date().getTime(), reqUrl;
        if (async) {
            this.hp.onreadystatechange = function() {
                self._onreadystatechange();
            }
            ;
            if (!this.__onAbortbind) {
                this.__onAbortbind = this.__onAbort.bind(this);
            }
            this.hp.addEventListener("abort", this.__onAbortbind, false);
        }
        if (!this.hp) {
            return;
        }
        if (reqMethod === "GET") {
            reqUrl = !!params ? (this.url + (this.url.indexOf("?") > 0 ? "&" : "?") + this._makeParams()) : this.url;
        } else {
            if (reqMethod === "POST") {
                reqUrl = this.url;
            }
        }
        this.hp.open(reqMethod, reqUrl, async);
        this.hp.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
        if (params) {
            this.hp.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded;charset=utf-8");
            var p = this._makeParams();
            params = p ? p + "&" + timestamp : timestamp;
        } else {
            params = timestamp;
        }
        this.hp.send(params);
        if (!async && (this.hp.getResponseHeader("SANLINK-DATA-LENGTH") || this.hp.getResponseHeader("ESEN-DATA-LENGTH"))) {
            this._parseResult();
            if (autodispose) {
                this.dispose();
            }
        }
    }
    ;
    QueryObj.prototype.checkHttpResult = function() {
        var hp = this.hp, status = hp.status, httpStatus, responseText = "", statusText = "";
        try {
            if (status !== undefined && status !== 0) {
                httpStatus = status;
            } else {
                httpStatus = 13030;
            }
        } catch (e) {
            httpStatus = 13030;
        }
        if (!(httpStatus >= 200 && httpStatus < 300 || httpStatus === 1223)) {
            try {
                responseText = hp.responseText;
            } catch (ex) {}
            try {
                statusText = hp.statusText;
            } catch (ex) {}
            if (httpStatus >= 12000 || httpStatus == 0) {
                EUI.throwError("无法访问服务器，服务器可能已经停止！", "\r\n" + this.url, null, null, httpStatus);
                return;
            }
            if (httpStatus == 500) {
                EUI.throwError("服务器端发生异常！" + "\r\n" + this.url, responseText, null, httpStatus);
                return;
            }
            if (httpStatus == 401) {
                EUI.throwError("您没有权限或者登录超时。请重新登录!", null, null, httpStatus);
                return;
            }
            if (httpStatus == 600) {
                EUI.throwError("系统处于维护状态！", statusText, null, httpStatus);
                return;
            }
            EUI.throwError("当请求url:" + this.url + " 时服务器返回错误状态:", "\r\n" + httpStatus + " " + statusText, responseText, null, httpStatus);
        }
    }
    ;
    QueryObj.prototype._parseResult = function() {
        var hp = this.hp;
        this.resultparsed = true;
        this.checkHttpResult();
        this._result = hp.getResponseHeader("X-ESEN-HEADER-RESULT");
        if (!this._result) {
            this._result = "OK";
        }
        this._message = unescape(hp.getResponseHeader("X-ESEN-HEADER-MESSAGE"));
        this._javascript = unescape(hp.getResponseHeader("X-ESEN-HEADER-JS"));
        if (this.isResultException()) {
            this._exception = hp.responseText;
        }
        var rootExceptionClass = unescape(hp.getResponseHeader("X-ESEN-HEADER-EXCEPTIONCLASSNAME"));
        if (rootExceptionClass) {
            this._option = "rootExceptionClass=" + rootExceptionClass;
        }
    }
    ;
    QueryObj.prototype.isResultOk = function() {
        return this._result == "OK";
    }
    ;
    QueryObj.prototype.isResultException = function() {
        return this._result == "EXCEPTION";
    }
    ;
    QueryObj.prototype.isResultError = function() {
        return this._result == "ERROR";
    }
    ;
    QueryObj.prototype.getMessage = function() {
        return this._message;
    }
    ;
    QueryObj.prototype.getException = function() {
        return this._exception;
    }
    ;
    QueryObj.prototype.getDetail = function() {
        return this.getResponseText();
    }
    ;
    QueryObj.prototype.getResponseXML = function() {
        return this.hp.responseXML;
    }
    ;
    QueryObj.prototype.getResponseJSON = function() {
        var text = this.getResponseText();
        return text ? JSON.parse(text) : null;
    }
    ;
    QueryObj.prototype.getResponseText = function() {
        return this.hp.responseText;
    }
    ;
    QueryObj.prototype._makeParams = function() {
        var params = this.params;
        if (!params) {
            return null;
        }
        if (EUI.isString(params)) {
            return encodeURI(params);
        }
        if (params.export2uri) {
            return params.export2uri();
        }
        if (EUI.isPlainObject(params)) {
            var array = [];
            for (var key in params) {
                var v = params[key];
                if (v) {
                    v = encodeURIComponent(v);
                }
                array.push(key + "=" + v);
            }
            return array.join("&");
        }
        EUI.throwError("queryObj方法的params只能为null，string，HashMap或StringMap");
    }
    ;
    QueryObj.prototype.checkResult = function() {
        if (!this.resultparsed) {
            this._parseResult();
        }
        if (this._javascript) {
            eval(this._javascript);
        }
        if (!this.isResultOk()) {
            var params = this._makeParams();
            var paramsStr = (params ? "?" + params : "");
            if (paramsStr.length > 1000) {
                paramsStr = paramsStr.substring(0, 1000);
            }
            var detailmsg = "QueryObj ERROR:" + this.url + paramsStr + "\r\n" + this.getException();
            EUI.throwError(this.getMessage(), detailmsg, this._option);
        }
    }
    ;
    QueryObj.create = function(actionurl, params, onfinish, userdata, autodispose) {
        return new QueryObj(actionurl,params,onfinish,userdata,autodispose);
    }
    ;
    function queryObj(actionurl, params) {
        var q = QueryObj.create(actionurl, params, null, null, false);
        q.checkResult();
        return q.getDetail();
    }
    function queryXml(actionurl, params) {
        var q = QueryObj.create(actionurl, params, null, null, false);
        q.checkResult();
        return q.getResponseXML();
    }
    var doAjax = function(opts) {
        var url = opts.url
          , params = opts.data
          , onfinish = opts.callback
          , userdata = opts.userdata
          , autodispose = opts.autodispose
          , requestMethod = opts.type
          , async = opts.async;
        if (async === false) {
            var q = QueryObj.create(url, params, null, null, false);
            q.checkResult();
            return q;
        }
        return new QueryObj(url,params,onfinish,userdata,autodispose,requestMethod,opts.error,opts.waitMessage);
    };
    EUI.extendObj(EUI, {
        post: function(opts) {
            opts.type = "POST";
            return doAjax(opts);
        },
        get: function(opts) {
            opts.type = "GET";
            return doAjax(opts);
        },
        ajax: function(opts) {
            return doAjax(opts);
        },
        formAjax: function(opts) {
            var data = opts.data
              , target = opts.target
              , iframeid = EUI.idRandom("formAjax")
              , enctype = opts.enctype
              , name = opts.name || ""
              , type = opts.type || "post"
              , id = opts.id || ""
              , _target = target || iframeid
              , url = opts.url || ""
              , callback = opts.callback
              , doc = document;
            if (!url) {
                return;
            }
            var htmlstr = ['<form name="' + name + '"'];
            htmlstr.push(' method="' + type + '"');
            htmlstr.push(' id="' + id + '"');
            htmlstr.push(' action="' + url + '"');
            htmlstr.push(' target="' + _target + '"');
            if (enctype) {
                htmlstr.push(' enctype="' + enctype + '"');
            }
            htmlstr.push(" ></form>");
            var temp = doc.createElement("div");
            temp.innerHTML = '<input type="hidden" />';
            var inputdom = temp.firstChild;
            temp.innerHTML = htmlstr.join("");
            var formdom = temp.firstChild, framedom;
            if (EUI.isObject(data)) {
                for (var key in data) {
                    var _hiddeninput = inputdom.cloneNode();
                    _hiddeninput.setAttribute("name", key);
                    _hiddeninput.setAttribute("value", data[key]);
                    formdom.appendChild(_hiddeninput);
                }
            }
            if (!target) {
                framedom = formdom.appendChild(doc.createElement("iframe"));
                framedom.setAttribute("name", iframeid);
                framedom.setAttribute("id", iframeid);
                framedom.style.display = "none";
            }
            doc.body.appendChild(formdom);
            if (EUI.isFunction(callback) && framedom) {
                if (framedom.attachEvent) {
                    framedom.onreadystatechange = function(e) {
                        if (this.readyState == "complete") {
                            callback(e, e.currentTarget.contentDocument ? e.currentTarget.contentDocument.body.innerText : null, opts.userdata);
                            framedom.onload = null;
                            doc.body.removeChild(formdom);
                        }
                    }
                    ;
                } else {
                    framedom.onload = function(e) {
                        callback(e, e.currentTarget.contentDocument ? e.currentTarget.contentDocument.body.innerText : null, opts.userdata);
                        framedom.onload = null;
                        doc.body.removeChild(formdom);
                    }
                    ;
                }
            }
            formdom.submit();
            return formdom;
        },
        xml: function(opts) {},
        getFileContent: function(jsuri) {
            var jscontent = "", http;
            try {
                http = EUI.get({
                    url: jsuri,
                    async: false
                });
                var hp = http.hp;
                if (hp.status < 200 || hp.status >= 400) {
                    EUI.throwError(I18N.getString("xui.util.js.29", "当请求文件:{0} 时服务器返回错误状态:{1} {2}", [jsuri, hp.status, hp.statusText]));
                }
                return http.getDetail();
            } catch (e) {
                var errMsg = (e.description ? e.description : e.message) + I18N.getString("xui.util.js.30", "\n脚本''{0}''加载失败!", [jsuri]);
                throw new Error(errMsg);
            }
        },
        QueryObj: QueryObj,
        queryObj: queryObj,
        queryXml: queryXml
    });
}(window, EUI);
