var _d = document;
var _b = _d.body;

var favor = _d.createElement("div");
favor.setAttribute("id","favor_weixin");
_b.appendChild(favor);

$(favor).html("<p id='float_knowed' class='abs c_txt'>知道了</p>").fadeIn(function(){
    $(this).bind("click",function(){
        $(this).fadeOut();
        M.setCookie("WD_close_favor",1);
    });
});