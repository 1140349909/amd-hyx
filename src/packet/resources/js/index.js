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

    define(['jquery', 'wxShare', 'apis', 'loading'], function ($, wxShare, apis, loading) {

        // 初始化微信分享
        wxShare.weixinShare(function () {
            // 统计分享
            //console.log('wxConfig');
            apis.recordShareTimes();
        });

        loading.init(function () {

            var w = window.innerWidth;
            var h = window.innerHeight;

            var $maskContainer1 = $('#maskContainer1');
            var $maskContainer2 = $('#maskContainer2');

            var $mask1 = $('#mask1');
            var $mask2 = $('#mask2');

            var $dialogIndex = $('#dialogIndex');

            /*$mask1.css({
                'width': w + 'px',
                'height': h + 'px'
            });*/

            /*$mask2.css({
                'width': w + 'px',
                'height': h + 'px'
            });*/

            $maskContainer1.on('click', function () {
                $maskContainer1.hide();
            });

            var $indexBg = $('.indexBg');
            var $goRule = $('#goRule');
            var $goPacket = $('#goPacket');

            $goRule.on('click', function () {
                location.href = 'rule.html'
            });

            /*$indexBg.css({
                'width': w + 'px',
                'height': h + 'px'
            });*/

            //判断应用状态
            $.when(apis.getBaseInfo())
                .then(function (result) {

                    switch (result.data.appStatus){
                        case 'notstarted':
                        case 'suspend':
                        case 'finished':
                        case 'closed':
                            $goPacket.removeClass('animated');
                            $maskContainer2.show();
                            alert('该应用已下线，感谢您的参与！');
                            break;
                        case 'testing':
                        case 'opening':

                            //获取当前玩家可玩次数，只有拥有参与次数才允许继续游戏
                            $.when(apis.getPlayTimes())

                                .then(function (result) {

                                    if (result.data.perTimes != 0) {

                                        /*不在此页面检测是否会员登录会员*/

                                        //跳转packet页面执行脚本！
                                        $goPacket.on('click', function () {

                                            var random = Math.random();

                                            if(random <= 0.4){
                                                location.href = 'packet.html' + '?status=success'
                                            }else{

                                                //伪
                                                $.when(apis.drawAward())

                                                    .then(function (result) {

                                                        location.href = 'packet.html' + '?status=failure'

                                                    },function (result) {

                                                    });



                                            }

                                            //生成随机数

                                            //进入抽奖逻辑
                                            /*$.when(apis.drawAward())

                                                .then(function (result) {

                                                    if (result.data) {
                                                        location.href = 'packet.html' + '?status=success'
                                                    } else {
                                                        location.href = 'packet.html' + '?status=failure'
                                                    }

                                                }, function (result) {

                                                });*/

                                        });

                                    } else {
                                        $goPacket.removeClass('animated');

                                        $maskContainer1.show();

                                        // alert('今日抽奖次数已经用完，请明天再来吧！');

                                    }


                                }, function (result) {
                                    // $maskContainer1.show();
                                });

                            break;
                    }
                },function (result) {

                });





        });

    });
})();
