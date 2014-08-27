var $ = function(obj){
	if(!obj){ return null; }
	
	if(typeof(obj) === "object"){
		return new B(obj);
	}
	else if(typeof(obj) === "string"){
		if(obj.indexOf("#") === 0){
			return new B(document.querySelector(obj));
		}
		else{
			return new B(document.querySelectorAll(obj));
		}
	}
}
var $$ = function(obj){
	if(obj.indexOf("#") === 0){
		return document.querySelector(obj);
	}
	else{
		return document.querySelectorAll(obj);
	}
}
var B = function(DOM){
    this.dom = DOM;
	this.parent = function(){
		return new B(DOM.parentNode);
	}
	this.children = function(){
		return new B(DOM.children);
	}
	this.eq = function(i){
		return new B(DOM[i]);
	}
	this.length = function(){
		if(DOM){
			if(DOM.length){
				return DOM.length;
			}
			else{
				if(DOM.innerHTML || DOM.value || DOM.tagName){/*value for input tagName for empty element*/
					return 1;
				}
				else{
					return 0;
				}
			}
		}
		else{
			return 0;
		}
	}
	this.css = function(cssName,cssVal){
		/*$(dom).css({"":"","":""})->$(dom).css("","")->$(dom).css("")*/
		if(typeof(cssName) === "object"){
            console.log(cssName)
			for(var v in cssName){
				var x = v;/*临时记录*/
				var _split = v.indexOf("-");
				if(_split != -1){
					var a = v.substring(_split + 1,_split + 2);
					v = v.replace("-" + a,a.toUpperCase());
				}
				DOM.style[v] = cssName[x];
			}
			return this;
		}
		else{
			var _split = cssName.indexOf("-");
			if(_split != -1){
				var a = cssName.substring(_split + 1,_split + 2);
				cssName = cssName.replace("-" + a,a.toUpperCase());
			}
			if(cssName && !cssVal){
				return DOM.style[cssName];
			}
			else{/*background-color to backgroundColor*/
				DOM.style[cssName] = cssVal;
				return this;
			}
		}
	},
	this.attr = function(attrName,attrVal){
		/*$(dom).attr({"":"","":""})->$(dom).attr("","")->$(dom).attr("")*/
		if(typeof(attrName) === "object"){
			for(var v in attrName){
				DOM.setAttribute(v,attrName[v]);
			}
			return this;
		}
		else{
			if(attrName && !attrVal){
				return DOM.getAttribute(attrName);
			}
			else{
				DOM.setAttribute(attrName,attrVal);
				return this;
			}
		}
	},
	this.val = function(val){
		/*$(dom).val()*/
		if(val || typeof(val) === "string"){/*val("")*/
			DOM.value = val;
			return this;
		}
		else{
			return DOM.value;
		}
	},
	this.html = function(_val){
		/*$(dom).html("")->$(dom).html()->*/
		var val = typeof(_val) == "number" ? _val.toString() : _val;
		if(val){
			DOM.innerHTML = val;
			return this;
		}
		else{
			if(DOM.length){
				return DOM[0].innerHTML;
			}
			else{
				return DOM.innerHTML;
			}
		}
	},
	this.prev = function(){
		return new B(DOM.previousElementSibling);
	},
	this.next = function(){
		return new B(DOM.nextElementSibling);
	},
	this.addClass = function(cls){
		/*$(dom).addClass("")*/
		//var clsSome = cls.indexOf(" ") ? true : false;/*addClass("a b c")*/
		var _l = this.length();
		if( _l == 1){
			if(DOM.length){
				if(DOM[0].classList){
					DOM[0].classList.add(cls);
				}
				else{
					var current_className = DOM[0].className;
					if(current_className.indexOf(cls) == -1){
						DOM[0].className = current_className + " " + cls;
					}
				}
			}
			else{
				if(DOM.classList){
					DOM.classList.add(cls);
				}
				else{
					var current_className = DOM.className;
					if(current_className.indexOf(cls) == -1){
						DOM.className = current_className + " " + cls;
					}
				}
			}
			return this;
		}
		else if(_l > 1){
			if(DOM[0].classList){
				for(var i = _l; i--;){
					DOM[i].classList.add(cls);
				}
			}
			else{
				for(var i = _l; i--;){
					var current_className = DOM[i].className;
					if(current_className.indexOf(cls) == -1){
						DOM[i].className = current_className + " " + cls;
					}
				}
			}
			return DOM[_l - 1];
		}
	},
	this.removeClass = function(cls){
		/*$(dom).removeClass("")*/
		//var clsSome = cls.indexOf(" ") ? true : false;/*removeClass("a b c")*/
		var _l = this.length();
		if(_l == 1){
			if(DOM.length){/*class*/
				if(DOM[0].classList){
					DOM[0].classList.remove(cls);
				}
				else{
					var current_className = DOM[0].className;
					if(current_className.indexOf(cls) != -1){
						DOM[0].className = current_className.replace(cls,"");
					}
				}
			}
			else{/*id*/
				if(DOM.classList){
					DOM.classList.remove(cls);
				}
				else{
					var current_className = DOM.className;
					if(current_className.indexOf(cls) != -1){
						DOM.className = current_className.replace(cls,"");
					}
				}
			}
			return this;
		}
		else if(_l > 1){
			if(DOM[0].classList){
				for(var i = _l; i--;){
					DOM[i].classList.remove(cls);
				}
			}
			else{
				for(var i = _l; i--;){
					var current_className = DOM[i].className;
					if(current_className.indexOf(cls) != -1){
						DOM[i].className = current_className.replace(cls,"");
					}
				}
			}
			return DOM[_l - 1];
		}
	},
	this.clearClass = function(){
		/*$(dom).clearClass()*/
		var _l = DOM.length;
		if(_l){
			for(var i = _l; i--;){
				DOM[i].className = "";
			}
			return DOM[_l - 1];
		}
		else{
			DOM.className = "";
			return this;
		}
	}
	this.hasClass = function(cls){
		/*if( $(dom).hasClass("") )*/
		if(DOM.classList){
			return DOM.classList.contains(cls);
		}
		else{
			if(DOM.className.indexOf(cls) != -1){
				return true;
			}
			else{
				return false;
			}
		}
	},
	this.show = function(){
		/*$(dom).show()*/
		DOM.style.display = "block";
		return this;
	},
	this.hide = function(){
		/*$(dom).hide()*/
		DOM.style.display = "none";
		return this;
	},
	this.remove = function(){
		/*$(dom).remove()*/
		DOM.parentNode.removeChild(DOM);
	},
	this.trigger = function(type){
		/*$(dom).trigger("touchend")*/
		var _event = document.createEvent("Event");
		_event.initEvent(type,true,true);
		DOM.dispatchEvent(_event);
		return this;
	},
	this.bind = function(type,fun){
		/*$(dom).bind("click",function(){})*/
		/*if(!DOM) return false;*/
		if(DOM.length){/*class*/
			if(DOM.length == 1){
				DOM[0].addEventListener(type,function(){
					fun.call(this);
				},false)
			}
			else{
				var _l = this.length();
				for(var i = _l; i--;){
					DOM[i].addEventListener(type,function(){
						fun.call(this);
					},false)
				}
				return DOM[_l - 1];
			}
		}
		else{/*id || window.length == 0*/
			if(DOM.innerHTML || DOM === window || DOM.value || DOM.tagName){/*tagName for empty element*/
				DOM.addEventListener(type,function(){
					fun.call(this);
				},false)
			}
			else{
				return null;
			}
		}			
		return this;
		/*
		if(type === "tap"){
			DOM.addEventListener("touchstart",function(){
				event.preventDefault();
			},false)
			DOM.addEventListener("touchend",function(){
				event.preventDefault();
				fun.call(this);
			},false)
		}
		*/
	},
	this.unbind = function(type,fun){
		/*$(dom).unbind("click",fun)*/
		DOM.removeEventListener(type,fun,false);
		return this;
	},
	this.width = function(){
		/*$(dom).width()*/
		return DOM.offsetWidth;
	},
	this.height = function(){
		/*$(dom).height()*/
		return DOM.offsetHeight;
	},
	this.offset = function(){
		/*$(dom).offset().top*/
		return {
			top : DOM.offsetTop,
			left : DOM.offsetLeft
		}
	},
	this.find = function(options){
		/*$(dom).find("p")*/
		return new B(DOM.querySelectorAll(options));
	}
	this.append = function(ele){
		if(typeof(ele) === "string"){
			DOM.innerHTML += ele;
		}
		else{
			DOM.appendChild(ele);
		}
		return this;
	}
	/*以下为动效*/
	this.fadeIn = function(second,callback,fadeOut){
		//var dummyStyle = document.createElement("div").style;
       //console.log(dummyStyle);
		/*$(DOM).fadeIn(200,function(){ alert("ok"); })*/
		var t = this;
		var _second;
		var _second_callback = false;
		if(typeof(second) === "function"){
			_second = 200;
			_second_callback = true;
		}
		else{
			_second = second > 200 ? second : 200;
		}

		if(fadeOut){
			t.css("webkitTransition","opacity 200ms ease");
			//t.css("transition","opacity 200ms ease");
			setTimeout(function(){
				t.css("opacity",0.1);
				var transEndOut = function(){
					$(this).hide();
					_second_callback ? second.call(this) : (callback && callback.call(this));
					DOM.removeEventListener("webkitTransitionEnd",transEndOut,false);
					//DOM.removeEventListener("transitionend",transEndOut,false);
				}
				DOM.addEventListener("webkitTransitionEnd",transEndOut,false);
			},100)
		}
		else{
			t.css({"opacity":0,"display":"block","webkitTransition":"opacity "+ _second +"ms ease"});
			//t.css({"opacity":0,"display":"block","transition":"opacity "+ _second +"ms ease"});
			setTimeout(function(){
				t.css("opacity",1);
				var transEndIn = function(){
					_second_callback ? second.call(this) : (callback && callback.call(this));
					DOM.removeEventListener("webkitTransitionEnd",transEndIn,false);
				}
				DOM.addEventListener("webkitTransitionEnd",transEndIn,false);
				//DOM.addEventListener("transitionend",transEndIn,false);
			},100)
		}
	},
	this.fadeOut = function(second,callback){
		this.fadeIn(second,callback,true);
	},

    this.toggleClass = function(classname){
//        classname?$(DOM).addClass(classname)
        if(classname){
            $(DOM).hasClass(classname) ? $(DOM).removeClass(classname) : $(DOM).addClass(classname)
        }
    },
	
	this.animate = function(params,dur,callback,eas,delay){
		/*
		检测浏览器类型 webkit moz o IE
		left,right,top,bottom
		fadeIn,fadeOut,
		*/
		var dummyStyle = document.createElement("div").style;
		var prefix = (function () {
			var prefixs = "webkitT,msT,OT".split(","), t, i = 0, l = prefixs.length;
			for ( ; i < l; i++ ) {
				t = prefixs[i] + "ransform";
				if ( t in dummyStyle ) {
					return prefixs[i].substr(0, prefixs[i].length - 1);
				}
			}
			return false;
		}());
		var cssPrefix = prefix ? "-" + prefix.toLowerCase() + "-" : "";/*-webkit-  webkitTransition = cssPrefix + 'transform',1s,linear*/
		var transEnd = (function(){
			if (!prefix) return false;
			var transitionEnd = {
					''			: 'transitionend',
					'webkit'	: 'webkitTransitionEnd',
					'O'			: 'otransitionend',
					'ms'		: 'MSTransitionEnd'
				};
			return transitionEnd[prefix];
		}());
		var prefixStyle = function(style){/*style = transform  return = webkitTransform*/
			if (!prefix) return style;
			style = style.charAt(0).toUpperCase() + style.substr(1);
			return prefix + style;
		}
		var	transform = prefixStyle('transform'),
			transitionProperty = prefixStyle('transitionProperty'),
			transitionDuration = prefixStyle('transitionDuration'),
			transitionTimingFunction = prefixStyle('transitionTimingFunction'),
			transitionDelay = prefixStyle('transitionDelay');
			/*transformOrigin = prefixStyle('transformOrigin'),*/
		
		var paramArray = new Array();
		for(var param in params){
			paramArray.push(param);
		}
		/*
		需要变换的属性 width height font-size      left right=transform translateX top bottom=translateY 放大 缩小=scale 旋转=rotate
		translate的属性都不影响周边 都是浮着改变
		left top jquery也是不影响周边 而且不给父级加position属性
		*/
		var transEndFun = function(e){
			callback ? callback.call(this) : "";
			e.target.removeEventListener(transEnd,transEndFun,false);
		}
		this.css({
				"webkitTransitionProperty	"	:	paramArray.join(","),
				"webkitTransitionDuration"		:	dur ? dur/1000 + "s" : ".2s",
				"webkitTransitionTimingFunction":	eas ? eas : "ease",
				"webkitTransitionDelay"			:	delay ? delay/1000 + "s" : "0s",
                /*
				transitionProperty		:	paramArray.join(","),
				transitionDuration		:	dur ? dur/1000 + "s" : ".2s",
				transitionTimingFunction:	eas ? eas : "ease",
				transitionDelay			:	delay ? delay/1000 + "s" : "0s",
                */
		}).dom.addEventListener(transEnd,transEndFun,false);
		
		/*设置CSS 此时已经有了动画参数 根据参数的长度*/
		var iCss = 0, param_l = paramArray.length;
		for(; iCss < param_l; iCss++){
			var i = paramArray[iCss];
			this.css(i,params[i]);
		}
		return this;
	}
}

var M = {  
    baseDomain : "http://"+ document.domain,
    baseUrl : "http://s.test.youshop.com/ushop",
    baseUrl : "http://wd.test.youshop.com/vshop/1/H5",
    h5Port : "http://wd.test.youshop.com/vshop/1/H5",
    pubPort : "http://wd.test.youshop.com/vshop/1/public",
    pubPort2 :"http://wd.test.youshop.com/ushop",
    
    version : "2014.7.7",
    
    doc : document,
    win : window,
    w : document.body.offsetWidth,
    h : document.body.offsetHeight,
    
    sUrl : function(a,b,c){//a=>userid b=>itemid c=>param
        //var baseUrl = window.location.host.indexOf("test") > -1 ? ".test" : "";
        return "http://"+ a +".test.youshop.com/"+ (b ? b : "") + (c ? "?"+ c : "");
        //return window.location.host+"/"+ (b ? b : "") + (c ? "?"+ c : "");

            /*
        if(a){
            if(b){
                return M.h5Port +"/item.html?itemID="+ b +(c ? "&"+ c : "");
            }
            else{
                return M.h5Port +"/?userid="+ a +(c ? "&"+ c : "");
            }
        }*/

    },
	toJSON : function(obj){
		return JSON.stringify(obj);
	},
    post : function(href,param,callback){
        //M.post("1.php",M.toJSON({"a":"1","b":"1"}),function(data){ console.log(data) })
        var date_start = new Date();
        var _t = date_start.getTime() + "_" + Math.random().toString().substr(2);//后缀防重复
        var a = "post_" + _t;
        window[a] = function(data){
            window[a] = undefined;
            callback(data);
            b.removeChild(temp);
            b.removeChild(iframe);
        }

        var d = document;
        var b = d.body;
        var iframe = d.createElement("iframe");
        iframe.style.display = "none";
        iframe.name = "post_iframe";
        iframe.src = "about:blank";
        b.appendChild(iframe);
        
        var temp = d.createElement("form");
        temp.action = href;
        temp.method = "post";
        temp.target = "post_iframe";
        temp.style.display = "none";

        var _param = d.createElement("textarea");
        _param.name = "param";
        _param.value = param;
        temp.appendChild(_param);

        var callbackName = d.createElement("textarea");
        callbackName.name = "callback";
        callbackName.value = a;
        temp.appendChild(callbackName);
        
        var callbackURL = d.createElement("textarea");
        callbackURL.name = "callbackURL";
        callbackURL.value = "http://"+ location.host + M.baseUrl +"/post_callback.html";
        temp.appendChild(callbackURL);
        
        b.appendChild(temp);
        temp.submit();
    },
	jsonp : function(href,_callback,_err){
		var date_start = new Date();
		var _t = date_start.getTime() + "_" + Math.random().toString().substr(2);/*后缀防重复*/
		var a = "jsonpcallback_" + _t;
		var b = "interval_" + _t;
		window[a] = function(json){
			window[a] = undefined;
			_callback && _callback(json);
		}
		window[b] = setInterval(function(){
			if(new Date() - date_start > 8000){
				clearInterval(window[b]);
				_err && _err();
			}
		},100);
		M.loadScript(href + (href.indexOf("?") == -1 ? "?callback=" : "&callback=") + a,function(){
			/*
			如果地址不对 不会触发onload事件 也就不考虑了
			如果地址对 并且 已经加载了 那就是已经返回值了
			*/
			clearInterval(window[b]);
		});
	},
	get : function(href,callback,error_callback){
		var ajax = new XMLHttpRequest();
		ajax.open("GET",href,true);
		ajax.send();
		var date_start = new Date();
		var ajax_notice = setInterval(function(){
			if( new Date() - date_start > 8000){
				alert("网络不给力，一会再试试吧");
				error_callback && error_callback();
			}
		},100);
		ajax.onreadystatechange = function(){
			if(ajax.readyState == 4){
				clearInterval(ajax_notice);
				switch (ajax.status){
					case 200:
					callback(ajax.responseText);
					break;
					case 404:
					alert("404--URL地址未找到");
					ajax_error();
					break;
					case 500:
					alert("500--服务器错误");
					ajax_error();
					break;
				}
			}
		}
		function ajax_error(){
			ajax.abort();
			error_callback && error_callback();
		}
	},
	lazyLoad : function(){/*原生 非B*/
		var img = M.doc.getElementsByClassName("lazy_load"), img_l = img.length;
		if(img_l){
			var img_arr = [];
			var lazy_src = M.baseUrl + "/images/default_img.png";
			for(var i = 0; i < img_l; i++){
				(function(i){
					var z = i, that = img[z], src = that.getAttribute("data-src"), thatClass = that.className;
					that.src = lazy_src; 
					img_arr[z] = new Image();
					img_arr[z].src = src;
					img_arr[z].onload = function(){
						that.src = src;
						that.className = thatClass.replace("lazy_load","");
					}
				}(i));
			}
		}
	},
	loadScript : function(url,callback){
		var script = document.createElement("script");
		if(script.readyState){
			script.onreadystatechange = function(){
				if(script.readyState == "loaded" || script.readyState == "complete"){ script.onreadystatechange = null; callback && callback(); }
			}
		}
		else{ script.onload = function(){ callback && callback(); } }
		script.src = (url.indexOf("?") > 0) ? (url +"&ver="+ M.version) : (url +"?ver="+ M.version);
		var _s = document.getElementsByTagName("script")[0];
		_s.parentNode.insertBefore(script,_s);
	},
	json : function(data){
		return JSON.parse(data);
	},
	urlQuery : function(name){
        var href = location.search;
        href = href.replace(/#[^&]*$/,'');
        var _index = href.indexOf(name);
        if(_index != -1){
            var a = href.substr(_index);
            var b = new Array();
            if(a.indexOf("&") == -1){
                b = a.split("=");
            }
            else{
                b = a.substr(0,a.indexOf("&")).split("=");
            }
            return b[1];
        }
        else{
            return "";
        }
	},
	getCookie : function(name){
        var cookie_start = document.cookie.indexOf(name+"=");
        var cookie_end = document.cookie.indexOf(";",cookie_start);
        return cookie_start == -1 ? "" : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
	},
	setCookie : function(name,value,isSession){
        var expires = new Date();
        expires.setTime(expires.getTime() + 2592000000);
        var path_domain = "; path=/"+ (document.domain.indexOf("youshop.com") != -1 ? "; domain=youshop.com" :"");
        var cookie_content = escape(name) +"="+ escape(value);
        document.cookie = cookie_content + (isSession ? "" : ("; expires=" + expires.toGMTString())) + path_domain;
	},
	delCookie : function(name){
        var path_domain = "; path=/"+ (document.domain.indexOf("youshop.com") != -1 ? "; domain=youshop.com" :"");
        document.cookie = escape(name) +"=; expires="+ new Date(0).toUTCString() + path_domain;
	},
	clearCookie : function(){
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g); 
        if (keys){
            var l = keys.length;
            for(var i = l; i--;){ M.delCookie(keys[i]); }
        } 
	},
    switchCookie : function(){
        var WD_a = M.getCookie("WD_a"), buyer_id = M.getCookie("buyer_id"), guid = M.getCookie("WD_guid"), close_favor = M.getCookie("WD_close_favor"), b_id = M.getCookie("WD_b_id"), b_wduss = M.getCookie("WD_b_wduss"), b_kduss = M.getCookie("WD_b_kduss");
        
        if(!WD_a){
            var temp_nam = M.getCookie("WD_temp_nam"), temp_tele = M.getCookie("WD_temp_tele"), temp_province = M.getCookie("WD_temp_province"), temp_city = M.getCookie("WD_temp_city"), temp_district = M.getCookie("WD_temp_district"), temp_add = M.getCookie("WD_temp_add"), temp_remark = M.getCookie("WD_temp_remark"), temp_wxID = M.getCookie("WD_temp_wxID");
        }
        var Market_go_market = M.getCookie("Market_go_market");
        if(Market_go_market){
            var Market_userid = M.getCookie("Market_userid"), Market_client = M.getCookie("Market_client"), Market_wduss = M.getCookie("Market_wduss"), Market_viewedPage = M.getCookie("Market_viewedPage"), Market_viewedPX = M.getCookie("Market_viewedPX"), Market_items_viewedPage = M.getCookie("Market_items_viewedPage"), Market_items_viewedPX = M.getCookie("Market_items_viewedPX");
        }
        var bbs_action = M.getCookie("bbs_action");
        if(bbs_action){
            var bbs_viewedPage = M.getCookie("bbs_viewedPage"), bbs_viewedPX = M.getCookie("bbs_viewedPX"), bbs_action = M.getCookie("bbs_action"), bbs_type = M.getCookie("bbs_type");
        }
        
        M.clearCookie();
        
        M.setCookie("buyer_id",buyer_id);
        M.setCookie("WD_guid",guid);
        M.setCookie("WD_close_favor",close_favor);
        M.setCookie("WD_b_id",b_id);
        M.setCookie("WD_b_wduss",b_wduss);
        M.setCookie("WD_b_kduss",b_kduss);
        if(!WD_a){
            M.setCookie("WD_temp_nam",temp_nam);
            M.setCookie("WD_temp_tele",temp_tele);
            M.setCookie("WD_temp_province",temp_province);
            M.setCookie("WD_temp_city",temp_city);
            M.setCookie("WD_temp_district",temp_district);
            M.setCookie("WD_temp_add",temp_add);
            M.setCookie("WD_temp_remark",temp_remark);
            M.setCookie("WD_temp_wxID",temp_wxID);
        }
        else{
            M.setCookie("WD_a",WD_a);
        }
        if(Market_go_market){
            M.setCookie("Market_go_market",Market_go_market);
            M.setCookie("Market_userid",Market_userid);
            M.setCookie("Market_client",Market_client);
            M.setCookie("Market_wduss",Market_wduss);
            M.setCookie("Market_viewedPage",Market_viewedPage);
            M.setCookie("Market_viewedPX",Market_viewedPX);
            M.setCookie("Market_items_viewedPage",Market_items_viewedPage);
            M.setCookie("Market_items_viewedPX",Market_items_viewedPX);
        }
        if(bbs_action){
            M.setCookie("bbs_viewedPage",bbs_viewedPage);
            M.setCookie("bbs_viewedPX",bbs_viewedPX);
            M.setCookie("bbs_action",bbs_action);
            M.setCookie("bbs_type",bbs_type);        
        }
    },
	ua : function(){
		return navigator.userAgent.toLowerCase();
	},
	isMobile : function(){
		return M.ua().match(/iPhone|iPad|iPod|Android|IEMobile/i);
	},
	isAndroid : function(){
		return M.ua().indexOf("android") != -1 ? 1 : 0;
	},
	isIOS : function(){
		var a  = M.ua();
		return (a.indexOf("iphone") != -1 || a.indexOf("ipad") != -1 || a.indexOf("ipod") != -1) ? 1 : 0;
	},
	platform : function(){
		if(M.isMobile()){/*移动端*/
			if(M.isIOS()){
				return "IOS";
			}
			else if(M.isAndroid()){
				return "Android";
			}
			else{
				return "other-mobile";
			}
		}
		else{/*PC端*/
			return "PC";
		}
	},
	isWeixin : function(){
		return M.ua().indexOf("micromessenger") != -1 ? 1 : 0;
	},
	isWeixinPay : function(){//support weixinPay
		if(M.isWeixin()){
			var a = M.ua();
			var b = a.substr(a.indexOf("micromessenger"),18).split("/");
			if(Number(b[1]) >= 5){
				return 1;
			}
			else{
				return 0;
			}
		}
		else{
			return 0;
		}
	},
	_alert : function(txt,callback,noClose){
        var _d = window.top.document;
        var _alert_bg = _d.createElement("div");
        _alert_bg.setAttribute("id","_alert_bg");
        _d.body.appendChild(_alert_bg);
        
        var _alert_content = _d.createElement("div");
        _alert_content.setAttribute("id","_alert_content");
        _alert_bg.appendChild(_alert_content);
        
        var _this = $(_alert_content);
        _this.html(txt).fadeIn(function(){
            if(noClose){
                callback && callback();
            }
            else{
                setTimeout(function(){                
                    _this.fadeOut(function(){
                        $(_alert_bg).fadeOut(function(){ $(this).remove(); });
                        callback && callback();
                    })
                },1500)
            }
        });
    },
    _remove_alert : function(callback){
        $("#_alert_bg").fadeOut(function(){
            $(this).remove();
            callback && callback();
        })
    },
	_confirm : function(tle,btnA,btnB,submit_fun,cancel_fun){
		var _d = document;
		var _confirm_bg = _d.createElement("div");
		_confirm_bg.setAttribute("id","_confirm_bg");
		_d.body.appendChild(_confirm_bg);
				
		var _confirm_content = _d.createElement("div");
		_confirm_content.setAttribute("id","_confirm_content");
		_confirm_bg.appendChild(_confirm_content);
		
		var _wrap = $("#_confirm_content");
		
		var _temp = "";
		_temp = _temp + "<p>"+ tle +"</p>";
		_temp = _temp + "<em id='_confirm_shadowA'>&nbsp;</em>";
		_temp = _temp + "<em id='_confirm_shadowB'>&nbsp;</em>";
		_temp = _temp + "<div id='_confirm_btnW'>";
			if(btnB[0]){//B按钮有
				_temp = _temp + "<div id='_confirm_btnA' class='"+ btnA[1] +"'>"+ btnA[0] +"</div>";
				_temp = _temp + "<em id='_confirm_shadowC'>&nbsp;</em>";
				_temp = _temp + "<em id='_confirm_shadowD'>&nbsp;</em>";
				_temp = _temp + "<div id='_confirm_btnB' class='"+ btnB[1] +"'>"+ btnB[0] +"</div>";
			}
			else{
				_temp = _temp + "<div id='_confirm_btnA' class='"+ btnA[1] +"' style='width:100%'>"+ btnA[0] +"</div>";
			}
		_temp = _temp + "</div>";
	
		_wrap.html(_temp).fadeIn();
		
		$("#_confirm_btnA").bind("click",function(){/*cancel*/
			cancel_fun && cancel_fun();
			_wrap.fadeOut(function(){
				$("#_confirm_bg").remove();
			})
		})
		if(btnB[0]){//B按钮有
			$("#_confirm_btnB").bind("click",function(){/*submit*/
				submit_fun();
				_wrap.fadeOut(function(){
					$("#_confirm_bg").remove();
				})
			})
		}
	},
	//删除左右两端的空格  尹刘胜
	trimVal :function(str){ //删除左右两端的空格
　　     //return str.replace(/(^\s*)|(\s*$)/g, "");
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g,"");
        result = result.replace(/\s/g,"");
        return result;
　　},
	//判断手机号的正确性  尹刘胜
	checkform : function(moneyNum){
        var errortxt=errortxt,
            moneyNum =moneyNum;

        if(moneyNum.length!=11){
           return false;
        }

        var reg0=/^13\d{5,9}$/; //130--139。至少7位
        var reg1=/^15\d{5,9}$/; //15至少7位
        var reg2=/^18\d{5,9}$/; //18
        var reg3=/^14\d{5,9}$/; //18

        var my=false;
        if(reg0.test(moneyNum)) my=true;
        if(reg1.test(moneyNum)) my=true;
        if(reg2.test(moneyNum)) my=true;
        if(reg3.test(moneyNum)) my=true;

        if (!my){
           return false;
        }

        return true;
    },
    gaq : function(des){ _gaq.push(['_trackEvent',des,'click',M.platform()]); },
	init : function(){
        try{ localStorage.setItem('_justfortest',1); }
        catch(e){ M._confirm("请关闭无痕浏览模式以获得更好的浏览体验",["我知道了",""]); }
        M.getCookie("WD_guid") || M.setCookie("WD_guid",new Date().getTime() + "_" + Math.random().toString().substr(2));
        $(".for_gaq").bind("click",function(){ M.gaq($(this).attr("data-for-gaq")); })
        
        setTimeout(function(){
            if($("#cart").length()){			
                if(M.getCookie("WD_i")){
                    var count = M.getCookie("WD_i").split("|").length;
                    $("#cart_bg").addClass("orange_bg").parent().append("<i id='cart_count' class='abs c_txt'>"+ count +"</i>");
                }
                $("#cart").fadeIn();
            }
        },100)
	}
}
M.init(); var _gaq = _gaq || []; _gaq.push(['_setAccount','UA-23269961-12']); _gaq.push(['_trackPageview']); (function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })();