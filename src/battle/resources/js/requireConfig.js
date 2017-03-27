/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

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

    requirejs(['resources/js/check.js','resources/js/index.js']);

}());
