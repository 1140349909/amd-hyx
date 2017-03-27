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

    define(['jquery', 'wxShare', 'apis'], function ($, wxShare, apis) {

        // 初始化微信分享
        wxShare.weixinShare(function () {
            // 统计分享
            //console.log('wxConfig');
            apis.recordShareTimes();
        });

        var w = window.innerWidth;
        var h = window.innerHeight;

        //解决输入被遮挡问题
        /*$(window).resize(function () {
            var w = window.innerWidth;
            var h = window.innerHeight;

            $commonBg.css({
                'width': w + 'px',
                'height': h + 'px'
            });
        });*/

        var $commonBg = $('.commonBg');
        var $inputMobile = $('#mobile');
        var $inputName = $('#name');
        var $inputCaptcha = $('#captcha');

        var $sendMessage = $('#sendMessage');

        $sendMessage.on('click',function () {

            if ($inputMobile.val().length == 0) {
                alert('手机号码不能为空！');
                return;
            }

            if ($inputMobile.val().length != 11) {
                alert('请输入11位的手机号码！');
                return;
            }

            //回调
            $.when(apis.sendMessage($inputMobile.val()))

                .then(function (result) {

                    alert('短信验证码已发送！');

                }, function (result) {
                    alert('发送失败，请重试！');
                });

        });

        /*$commonBg.css({
            'width': w + 'px',
            'height': h + 'px'
        });*/

        function confirm() {

            /*表单检验*/

            if ($inputName.val().length == 0) {
                alert('昵称不能为空！');
                return;
            }

            if ($inputName.val().length > 20) {
                alert('昵称不能超过20个字符！');
                return;
            }

            if ($inputMobile.val().length == 0) {
                alert('手机号码不能为空！');
                return;
            }

            if ($inputMobile.val().length != 11) {
                alert('请输入11位的手机号码！');
                return;
            }

            //验证码规则
            if($inputCaptcha.val().length != 4){
                alert('请输入4位的验证码！');
                return;
            }

            //注：form页不再接管提交积分，转为注册会员数据
            var data = {
                "name":$inputName.val(),
                "mobile": $inputMobile.val(),
                "code":$inputCaptcha.val()
            };

            return data;
        }

        var $submit = $('#submit');

        $submit.on('click',function () {

            var data = confirm();

            //回调
            $.when(apis.registerInfo(data))

                .then(function (result) {

                    //注册成功后跳转首页
                    //location.href = 'index.html';

                    //在这个页面进行积分的提交操作，提交积分还需要读取手机号码吗？还是构造新的接口？
                    $.when(apis.putIntegral(10))
                        .then(function (result) {
                            console.log(result);
                            location.href = 'result.html'

                        }, function (result) {
                            console.log(result);
                            alert('提交积分失败，请重试');

                        });

                }, function (result) {

                    alert('注册失败，请重试！');

                });

        });
    });
})();
