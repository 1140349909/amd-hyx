/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

(function () {

    var version = '@VERSION@';
    var urlArgs = '@VERSION@'.indexOf('VERSION') == -1 ? version : (new Date()).getTime();
    requirejs.config(
        {
            baseUrl: "./resources/",
            paths: {
                jquery: 'http://cdn.bootcss.com/jquery/2.2.3/jquery.min',
                swipe: 'http://cdn.bootcss.com/jquery.touchswipe/1.6.16/jquery.touchSwipe.min',
                wx: 'http://res.wx.qq.com/open/js/jweixin-1.1.0',
                iscroll: 'vendor/iscroll-5.1.3/iscroll',
                utils: 'lib/amd_modules/utils',
                tip: 'lib/amd_modules/tip',
                rest: 'lib/amd_modules/rest',
                apis: 'lib/amd_modules/apis',
                music: 'lib/amd_modules/music',
                loading: 'lib/amd_modules/loading',
                wxShare: 'lib/amd_modules/wxShare'
            },
            shim: {
                swipe: {
                    deps: ['jquery']
                }
            },
            urlArgs: "v=" + urlArgs
        }
    );

})();
