//自动判断设备横屏or竖屏


define(['jquery'], function ($) {

    //自动判断设备横屏or竖屏
    function autoFullscreen() {

        var supportsOrientationChange = "onorientationchange" in window,
            orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

        window.addEventListener(orientationEvent, function () {

            if(orientationEvent == "resize"){
                resizeWindow();
            }else{
                window.location.reload();
            }

            function resizeWindow() {
                var winH = $(window).height();
                var winW = $(window).width();
                $('body').css({
                    'width':winW + 'px',
                    'height':winH + 'px'
                });//这里的div，选择你的那个div
            }

            //不管你干什么，总之事件发生后自动刷新
            window.location.reload();

            var ua = navigator.userAgent.toLowerCase();
            console.log(ua);
            var deviceType = "";

            //determine device type
            if (ua.indexOf("ipad") > 0) {
                deviceType = "isIpad";
            } else if (ua.indexOf("android") > 0) {
                deviceType = "isAndroid";
            } else if (ua.indexOf("iphone") > 0) {
                deviceType = "isIphone";
            } else {
                deviceType = "isPC";
            }

            console.log(deviceType);

            // 判断横竖屏
            if ("isIpad" == deviceType) {
                if (Math.abs(window.orientation) == 90) {
                    console.log("我是ipad的横屏");
                }
                else {
                    console.log("我是ipad的竖屏");
                }
            } else if ("isAndroid" == deviceType) {
                //纵屏 90 or -90 横屏 0
                if (Math.abs(window.orientation) == 90) {
                    console.log("我是Android的纵屏");
                }
                else {
                    //document.webkitCancelFullScreen();

                    console.log("我是Android的横屏");
                }
            } else if ("isIphone" == deviceType) {
                if (Math.abs(window.orientation) == 90) {
                    console.log("我是iphone的竖屏");
                }
                else {
                    console.log("我是iphone的纵屏");
                    $('body').css({
                        'transform':'rotate(0)'
                    })

                }
            } else {
                console.log(deviceType);
            }
        }, false);
    }

    return {
        autoFullscreen: autoFullscreen
    };
});



