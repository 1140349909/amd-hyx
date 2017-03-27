(function () {

    window.__uri = function(uri) {
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

    define(['jquery', 'wxShare', 'apis' ], function ($, wxShare, apis) {

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
        var $goMall = $('#goMall');
        var $total = $('#total');
        var $resultScore = $('.resultScore');

        /*$resultScore.css({
           'fontSize':'48px'
        });*/

        $goIndex.on('click',function () {
            location.href = 'index.html';
        });

        $goMall.on('click',function () {
            location.href = apis.getMallEntry();
        });

        //如何查询之前积分，通过获取会员信息即可
        $.when(apis.getMemberDetailInfo())
            .then(function (result) {

                if(result.data.hasOwnProperty('asset')){
                    var score = result.data.asset.integral;
                    $total.text(score);
                }else{
                    alert('您还不是积分商城的会员，请前往商城注册！');
                    location.href = apis.getMallEntry();
                }

            }, function (result) {
                alert('无效手机号码或不存在此用户，请重新开始游戏！');
                location.href = 'index.html';
            });

    });
})();
