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
            waitSeconds: 0,
            urlArgs: "bust=" + (new Date()).getTime()
        }
    );

    define(['jquery'], function ($) {

        var w = window.innerWidth;
        var h = window.innerHeight;

        var $fake = $('#mall');
        var $dialog = $('#dialog');
        var $button = $('#button');
        var $mask = $('#mask');
        var $bg = $('#bg');

        $fake.css({
            'width': w + 'px',
            'height': h + 'px'
        });

        $bg.on('click',function () {

            $mask.show();

            $dialog.show();

            $button.on('click',function () {
                window.location.href = 'index.html';
            });


            /*$fake.css({
                'background-color':'black',


                'opacity':'1',
                'z-index':'10'
            });*/
            //alert('商城暂未开放，请等待后续消息！');

        })




    });
})();
