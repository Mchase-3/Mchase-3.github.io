var a_idx = 0;
jQuery(document).ready(function($) {
    $("body").click(function(e) {
        var a = new Array
        ("推开窗灯花儿", "晃晃人影长", "摇落了希望", "摇不到你的心上", "那是我", "耿耿于怀的念想", "风浪中", "最安心的避风港", "生命中", "年华晃晃遗憾长", "摇走了风霜", "摇不回当年模样", "那是我", "心塌地的倔强", "最疯狂", "的信仰", "哪怕风浪再晃", "夜再长", "微弱的光芒", "也为我指引方向", "回想最初", "对答案的渴望" ,"历尽沧桑" ,"早已紧握在手掌");
        var $i = $("<span/>").text(a[a_idx]);
        a_idx = (a_idx + 1) % a.length;
        var x = e.pageX,
        y = e.pageY;
        $i.css({
            "z-index": 5,
            "top": y - 20,
            "left": x,
            "position": "absolute",
            "font-weight": "bold",
            "color": "#50246E"
        });
        $("body").append($i);
        $i.animate({
            "top": y - 180,
            "opacity": 0
        },
            3000,
            function() {
                $i.remove();
            });
    });
    setTimeout('delay()', 2000);
});

function delay() {
    $(".buryit").removeAttr("onclick");
}