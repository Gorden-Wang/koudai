/**
 * Created by gorden on 14-8-25.
 */
var Index = {
    userid: function () {
        if (M.urlQuery("userid")) {
            return parseInt(M.urlQuery("userid"));
        }
        else {
            var a = location.hostname;
            var b = a.split(".");
            return Number(b[0]);
        }
    },
    pageNum: 0,
    pageSize: 10, /*根据网络环境不同判断加载可以加多少*/
    locaHref: "<<$url>>",
    getShopInfo: function () {
        M.jsonp(M.h5Port + "/H5ShopInfo.php?userid=" + Index.userid(), function (data) {
            console.log(data);
            var status = data.status;
            if (status == 0 || status == 1) {
                //document.title = data.shopName || "YouShop";
                var pre_seller = Number(M.getCookie("WD_seller"));
                if (pre_seller != Index.userid()) {/*更换卖家了记录下地址和buyer_id*/
                    M.switchCookie();
                    M.setCookie("WD_seller", Index.userid());
                }
                $("#hd_name").html(data.shopName || "YouShop");
                $("#vshop_icon").children().eq(0).attr("src", data.logo);
                $("#hd_bg").css("background-image", "url(" + data.shopImg + ")");

                if (data.note) {
                    $("#hd_bg").html("<em id='hd_bg_em_a' class='abs over_hidden'>&nbsp;</em><em id='hd_bg_em_b' class='abs over_hidden'>&nbsp;</em>");
                    $("#hd_intro").html(data.note).show();
                }
                if (Number(data.hasItem)) {
                    switch (data.hasItem) {
                        case 1:
                            Index.item_hot();
                            break;

                        case 2:
                            Index.item_top();
                            break;

                        case 3:
                            Index.item_top();
                            Index.item_hot();
                            break;
                    }
                }
                else {
                    Index.item_empty();
                }
                Index.doWeixinShare();
                //开始sns信息
                var share_data = data.share_data;
                var FBdata = share_data[0];
                var TWdata = share_data[1];
                var showFB = Number(FBdata.isShow);
                var showTW = Number(TWdata.isShow);

                if (showFB || showTW) {
                    M.loadScript("http://s.test.youshop.com/ushop/script/index/index_sns.js", function () {
                        $("#showSNSBtn").show();
                        showFB && Index.doFBLike();//like
                        showTW && Index.Tweet(TWdata.account_name, TWdata.account_link);//tweet
                    })
                }
            }
            else if (status == 2 || status == 3) {
                Index.noShop();
            }
        })
    },
    doWeixinShare: function () {
        if (M.isWeixin()) {
            if (Index.weixinShareHandle) {
                Index.weixinShare();
            }
            else {
                M.loadScript("http://s.test.youshop.com/ushop/script/index/index_wx_share.js", function () {
                    Index.weixinShareHandle = true;
                    Index.weixinShare();
                });
            }
        }
    },
    item_empty: function () {
        $("#index_loading").hide();
        $("#item_empty").show().addClass("item_empty_icon");
    },
    item_top: function () {/*推荐*/
        M.jsonp(M.h5Port + "/H5GetTopItems.php?userid=" + Index.userid() + "&pageNum=0&pageSize=0", function (data) {
            $("#index_loading").hide();
            var l = data.length;
            var top_list = $("#top_ul");
            var arr = "";
            for (var i = 0; i < l; i++) {
                var d = data[i];
                arr = arr + "<li class='i_li left'><a href='" + M.sUrl(Index.userid(), d.itemID, "p=-1") + "'><img src='" + d.img + "' width='137' height='137'><p class='i_txt'>" + d.itemName + "</p><p class='i_pri'>$" + d.price + "</p></a></li>";
            }
            top_list.html(arr).parent().show();
        })
    },
    item_hot: function () {/*热卖 当前只有热卖需要滚动加载*/
        var size = Index.pageSize;
        if (Index.scrollToHot) {
            if (!Index.scrollToHotLoaded) {
                size = (Number(M.getCookie("WD_viewedPage")) + 1) * size;
            }
        }
        //Index.scroll_loading_txt.show();
        Index.scroll_loading_txt.removeClass("hide");
        $(window).bind("scroll", function () {
            var hc = document.body.scrollTop || document.documentElement.scrollTop;
            /*已经滚动了 不可能为0*/
            M.setCookie("WD_scrollToViewed", hc, true);
            /*记录用户滚动到的具体像素位置*/
            if (Index.item_hot_handle && !Index.scroll_loading) {
                var self = this;
                var ha = document.documentElement.clientHeight;
                var hb = document.body.offsetHeight;
                if (hc > Index.max_top) {
                    Index.max_top = hc;
                    //var hd = ha + hc + Index.frdHeight + 600;
                    var hd = ha + hc + 600;
                    if (hd >= hb && Index.item_hot_handle) {
                        Index.item_hot();
                    }
                }
            }
        })
        if (Index.item_hot_handle && !Index.scroll_loading) {
            Index.scroll_loading = true;
            /*加载中 关闭滚动加载开关*/
            /*Index.pageNum*/
            M.jsonp(M.h5Port + "/H5GetCommonItems.php?userid=" + Index.userid() + "&pageNum=" + Index.pageNum + "&pageSize=" + size, function (data) {
                Index.scroll_loading = false;
                /*打开滚动加载开关*/
                $("#index_loading").hide();
                var l = data.data.length;
                var hot_list = $("#hot_ul");
                var arr = "";
                //var data = data.data;
                if (Index.scrollToHot && !Index.scrollToHotLoaded && Number(M.getCookie("WD_viewedPage"))) {
                    for (var i = 0; i < l; i++) {
                        var d = data.data[i];
                        arr = arr + "<li class='i_li left'><a href='" + M.sUrl(Index.userid(), d.itemID, "p=" + Math.floor(i / Index.pageSize)) + "'><img src='" + d.img + "' width='137' height='137'><p class='i_txt'>" + d.itemName + "</p><p class='i_pri'>" + data.currencySign + d.price + "</p></a></li>";//nothing
                    }
                }
                else {
                    for (var i = 0; i < l; i++) {
                        var d = data.data[i];
                        arr = arr + "<li class='i_li left'><a href='" + M.sUrl(Index.userid(), d.itemID, "p=" + Index.pageNum) + "'><img src='" + d.img + "' width='137' height='137'><p class='i_txt'>" + d.itemName + "</p><p class='i_pri'>" + data.currencySign + d.price + "</p></a></li>";
                    }
                }
                hot_list.append(arr).parent().show();//添加元素
                if (Index.pageNum == 0) {/*优先判断变量*/
                    if (Index.scrollToTop) {
                        setTimeout(function () {
                            window.scroll(0, M.getCookie("WD_scrollToViewed"));
                            /*恢复 避免刷新还是跑*/
                            M.setCookie("WD_viewedPage", -1, true);
                            M.setCookie("WD_scrollToViewed", 0, true);
                        }, 200)
                    }
                    else if (Index.scrollToHot) {
                        Index.scrollToHotLoaded = true;
                        Index.pageNum = Number(M.getCookie("WD_viewedPage"));
                        setTimeout(function () {
                            window.scroll(0, M.getCookie("WD_scrollToViewed"));
                            /*恢复 避免刷新还是跑*/
                            M.setCookie("WD_viewedPage", -1, true);
                            M.setCookie("WD_scrollToViewed", 0, true);
                        }, 200)
                    }
                }
                /*用户购物车的返回位置*/
                $("#cart").attr("href", M.baseUrl + "/cart.html?p=" + Index.pageNum);
                Index.pageNum++;
                if (l < Index.pageSize) {/*已经不足一页了 那么就是到最后了*/
                    Index.scroll_loading_txt.html("&nbsp;");
                    Index.item_hot_handle = false;
                    $(window).unbind("scroll");
                }
            })
        }
    },
    item_hot_handle: true, /*true 可以继续加载 false 已经到头 不能在加载了*/
    scroll_loading: false, /*滚动加载控制 false可以触发 true不触发*/
    max_top: 0, /*记录滚动的顶部最大值 用于判断是往上滚了 还是往下滚了*/
    scroll_loading_txt: $("#scroll_loading_txt"),
    noShop: function () {
        $("#wd_show").hide();
        $("#noShop").show();
        $("#noShopShow").addClass("noShopShow_icon");
    },
    scrollToTop: false,
    scrollToHot: false,
    scrollToHotLoaded: false,
    weixinShareHandle: false,
    init: function () {
        this.renderUi();

        $("#cart").attr("href", M.baseUrl + "/cart.html");
        if (Index.userid() === Number(M.getCookie("WD_seller"))) {
            if (Number(M.getCookie("WD_scrollToViewed"))) {//需要滚动的数值 大于0
                if (Number(M.getCookie("WD_viewedPage")) == -1) {
                    Index.scrollToTop = true;//alert("上次点的是推"+" 要滚"+Number(M.getCookie("WD_scrollToViewed")));
                }
                else {
                    Index.scrollToHot = true;//alert("上次点的是热"+" 要滚"+Number(M.getCookie("WD_scrollToViewed"))+" 要加"+M.getCookie("WD_viewedPage")+"页");
                }
            }
        }

        if (!Index.userid()) {
            Index.noShop();
        }
        else {
            Index.getShopInfo();
            if (M.isWeixin()) {
                M.loadScript("http://s.test.youshop.com/ushop/script/index/index_wx_share.js", function () {
                    Index.weixinShareHandle = true;
                });
                if (!Number(M.getCookie("WD_close_favor"))) {
                    M.loadScript("http://s.test.youshop.com/ushop/script/common/favor_weixin.js", function () {
                        console.log("favor_weixin is loaded");
                    });
                }
            }
        }
        setTimeout(function () {
            M.jsonp(M.h5Port + "/H5TrackVisit.php?buyer_id=" + M.getCookie("buyer_id") + "&track_type=1&item_id=&user_id=" + Index.userid() + "&guid=" + M.getCookie("WD_guid") + "&frid=" + M.urlQuery("frid"));//frid=从其他店过来得流量统计
            if (M.isMobile()) {
                $("#iWantAShopIndex").attr("href", "http://www.youshop.com/weidian_offical_H5_en/?from=iWantIndex");
            }
            else {
                $("#iWantAShopIndex").attr("href", "http://www.youshop.com/weidian_offical_PC_en/?from=iWantIndex");
            }
        }, 200);


    },
    renderUi: function () {
        var that = this,
            juicerWrapper = $("#index_sec"),
            tpl = $("#tpl").html(),
            data = LANG[M.getCookie("Lang") || that.queryLang()],
            tplNoShop = $("#tpl-noShop").html(),
            tplNoshopWrapper = $("#noShop");

        M.setCookie("Lang", that.queryLang());
        var html = juicer(tpl, data);
        juicerWrapper.html(html);
        tplNoshopWrapper.html(juicer(tplNoShop, data));
        console.log(LANG[that.queryLang()]);

        this.scroll_loading_txt = $("#scroll_loading_txt");


    },
    queryLang: function () {
        var lang = navigator.language.toLowerCase();
        return (lang in LANG) && lang != "zh-cn" ? lang : "en-us";
    }
}
Index.init();