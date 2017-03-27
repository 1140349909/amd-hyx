(function () {

    window.__uri = function (uri) {
        return uri;
    };

    requirejs.config(
        {
            baseUrl: "resources",
            paths: {
                jquery: '//cdn.bootcss.com/jquery/2.2.3/jquery.min',

                utils: 'lib/amd_modules/utils',
                tip: 'lib/amd_modules/tip',
                rest: 'lib/amd_modules/rest',
                apis: 'lib/amd_modules/apis',
                music: 'lib/amd_modules/music',
                loading: 'lib/amd_modules/loading',

                wx: 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
                wxShare: 'lib/amd_modules/wxShare'

            },
            waitSeconds: 0,
            urlArgs: "bust=" + (new Date()).getTime()
        }
    );

    define(['jquery', 'wxShare', 'apis', 'utils'], function ($, wxShare, apis, utils) {

        // 初始化微信分享
        wxShare.weixinShare(function () {
            // 统计分享
            //console.log('wxConfig');
            apis.recordShareTimes();
        });

        var w = window.innerWidth;
        var h = window.innerHeight;

        var $packetBg = $('.packetBg');

        /*$packetBg.css({
            'width': w + 'px',
            'height': h + 'px'
        });*/

        var $goResult = $('#goResult');
        var $score = $('#score');
        var $errMsg = $('#errMsg');
        var $win = $('#win');
        var $lose = $('#lose');
        var $goIndex = $('#goIndex');
        var $commonBg = $('.f');
        var $loseBg = $('.loseBg');

        /*$commonBg.css({
            'width': w + 'px',
            'height': h + 'px'
        });*/

        /*$loseBg.css({
            'width': w + 'px',
            'height': h + 'px'
        });*/

        $goIndex.on('click', function () {
            location.href = 'index.html';
        });

        //获取url参数
        var status = utils.urlUnserialize(location.href);

        switch (status.status) {
            case 'success':
                $win.show();
                var value = 10;
                $score.text(value);
                break;
            case 'failure':
                $lose.show();
                var errMsg = '未中奖';
                $errMsg.text(errMsg);
                break;
            default:
                alert('参数错误，自动返回首页');
                location.href = 'index.html';
        }

        /*逻辑待确认*/
        $goResult.on('click', function () {

            //在这里判断是否登录会员
            $.when(apis.getUserLogin())

                .then(function (result) {

                    if (result.errCode == 0) {

                        /*var data = {
                            "type": "interact",
                            "v": value
                        };*/

                        //在这个页面进行积分的提交操作，提交积分还需要读取手机号码吗？还是构造新的接口？
                        $.when(apis.putIntegral(value))
                            .then(function (result) {
                                console.log(result);
                                location.href = 'result.html'

                            }, function (result) {
                                console.log(result);
                                alert('提交积分失败，请重试');

                            });

                    } else {
                        location.href = 'form.html'
                    }


                }, function (result) {
                    location.href = 'form.html'
                });


        });

    });
})();
