(function () {

    window.__uri = function(uri) {
        return uri;
    };

    requirejs.config(
        {
            baseUrl: "resources",
            paths: {
                jquery: '//cdn.bootcss.com/jquery/2.2.3/jquery.min',
                swipe: '//cdn.bootcss.com/jquery.touchswipe/1.6.16/jquery.touchSwipe.min',
                easel: '//cdn.bootcss.com/EaselJS/0.8.0/easeljs.min',
                tween: '//cdn.bootcss.com/tweenjs/0.6.1/tweenjs.min',
                preload: '//cdn.bootcss.com/PreloadJS/0.6.0/preloadjs.min',
                iscroll: '//cdn.bootcss.com/iScroll/5.2.0/iscroll.min',

                utils: 'lib/amd_modules/utils',
                Shake: 'lib/amd_modules/shake',
                tip: 'lib/amd_modules/tip',
                rest: 'lib/amd_modules/rest',
                apis: 'lib/amd_modules/apis',
                music: 'lib/amd_modules/music',
                loading: 'lib/amd_modules/loading',
                check: 'lib/amd_modules/check',

                wx: 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
                wxShare: 'lib/amd_modules/wxShare'

            },
            shim: {
                'swipe': {
                    deps: ['jquery']
                },
                'easel': {
                    exports: 'createjs'
                },
                'tween': {
                    deps: ['easel'],
                    exports: 'Tween'
                }
            },
            urlArgs: "bust=" + (new Date()).getTime()
        }
    );

    define(['jquery', 'wxShare', 'check','apis'], function ($, wxShare, check,apis) {

        //横竖屏检测
        check.autoFullscreen();

        // 初始化微信分享
        wxShare.weixinShare(function () {
            // 统计分享
            console.log('wxConfig');
            apis.recordShareTimes();
        });

        var w = window.innerWidth;
        var h = window.innerHeight;

        var $home = $('#home');
        var $bg = $('#bg');
        var $audio = $('#click'),
            audio = $audio[0];

        $bg.css({
            'width': w + 'px',
            'height': h + 'px'
        });

        $home.on('click', function () {
            audio.play();
            setTimeout(function () {
                window.location.href = 'index.html';
            },1000);
        });

    });
})();
