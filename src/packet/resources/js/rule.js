(function () {

    window.__uri = function (uri) {
        return uri;
    };

    requirejs.config(
        {
            baseUrl: "resources",
            paths: {
                jquery: '//cdn.bootcss.com/jquery/2.2.3/jquery.min',
                weui: '//cdn.bootcss.com/jquery-weui/0.8.2/js/jquery-weui.min',

                utils: 'lib/amd_modules/utils',
                tip: 'lib/amd_modules/tip',
                rest: 'lib/amd_modules/rest',
                apis: 'lib/amd_modules/apis',
                music: 'lib/amd_modules/music',
                loading: 'lib/amd_modules/loading',

                wx: 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
                wxShare: 'lib/amd_modules/wxShare'

            },
            shim: {
                'weui': {
                    deps: ['jquery']
                }
            },
            waitSeconds: 0,
            urlArgs: "bust=" + (new Date()).getTime()
        }
    );

    define(['jquery', 'wxShare', 'apis', 'weui'], function ($, wxShare, apis, weui) {

        // 初始化微信分享
        wxShare.weixinShare(function () {
            // 统计分享
            //console.log('wxConfig');
            apis.recordShareTimes();
        });

        var w = window.innerWidth;
        var h = window.innerHeight;

        var $commonBg = $('.commonBg');

        /*$commonBg.css({
            'width': w + 'px',
            'height': h + 'px'
        });*/

        var $goIndex = $('#goIndex');

        $goIndex.on('click', function () {
            location.href = 'index.html';
        });

    });
})();
