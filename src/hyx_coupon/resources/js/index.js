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

        // 表单校验
        function confirm($inputMobile,$inputCaptcha) {

            /*表单检验*/
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

            return {
                "mobile": $inputMobile.val(),
                "code":$inputCaptcha.val()
            };
        }

        loading.init(function () {

            // console.log(apis.getMallEntry());

            var $maskContainer1 = $('#maskContainer1');
            var $maskContainer2 = $('#maskContainer2');
            var $maskContainer3 = $('#maskContainer3');
            var $maskContainer4 = $('#maskContainer4');

           /* $maskContainer1.on('click', function () {
                $maskContainer1.hide();
            });*/

            var $goPacket = $('#goPacket');

            function getBaseInfo(success,failure) {
                $.when(apis.getBaseInfo())
                    .then(success,failure)
            }

            function getPlayTimes(success,failure) {
                $.when(apis.getPlayTimes())
                    .then(success,failure)
            }

            function getUserLogin(success,failure) {
                $.when(apis.getUserLogin())
                    .then(success,failure)
            }

            // 抽奖
            function drawAward(success,failure) {
                $.when(apis.drawAward())
                    .then(success,failure)
            }

            // 领奖
            function getAward(prizeToken,success,failure) {
                $.when(apis.getAward(prizeToken))
                    .then(success,failure)
            }

            function registerInfo(data,success,failure) {
                $.when(apis.registerInfo(data))
                    .then(success,failure)
            }

            function commonFailure(result) {
                alert(result.errMsg);
            }

            // 奖品已领完的回调
            function commonAwardFailure(result) {
                $maskContainer4.show();

                var $goMall = $('.goMall');

                $goMall.on('click',function () {
                    getAwardSuccess();
                });
                // alert(result.errMsg);
            }

            function getUserLoginFailure(result) {
                //显示表单页面
                $maskContainer2.show();

                var $sendMessage = $('#sendMessage');
                var $inputMobile = $('#inputMobile');
                var $inputCaptcha = $('#inputCaptcha');

                //获取url参数
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
                    sendMessage($inputMobile.val(),function (result) {
                        alert('短信验证码已发送！');
                    },function (result) {
                        alert('发送失败，请重试！');
                    })

                });

                var $submit = $('#submit');

                $submit.on('click',function () {

                    var data = confirm($inputMobile,$inputCaptcha);

                    registerInfo(data,registerInfoSuccess,commonFailure)

                });
            }

            function sendMessage(data,success,failure) {
                $.when(apis.sendMessage(data))
                    .then(success,failure)
            }

            // 业务逻辑1：获取应用状态成功
            function getBaseInfoSuccess(result) {
                switch (result.data.appStatus) {
                    case 'notstarted':
                    case 'suspend':
                    case 'finished':
                    case 'closed':
                        var $goRule = $('#goRule');
                        $goRule.removeClass('animated');
                        // $maskContainer2.show();
                        // alert('该应用已下线，感谢您的参与！');
                        $maskContainer3.show();
                        var $goMall = $('.goMall');

                        $goMall.on('click',function () {
                            getAwardSuccess();
                        });
                        break;
                    case 'testing':
                    case 'opening':
                        getPlayTimes(getPlayTimesSuccess,function (result) {
                            alert('请在微信里打开')
                        });
                        break;
                }
            }

            // 业务逻辑2：获取参与次数成功
            function getPlayTimesSuccess(result) {
                if (result.data.perTimes != 0) {
                    var $goRule = $('#goRule');
                    $goRule.removeClass('animated');
                    drawAward(drawAwardSuccess,commonAwardFailure);
                }else{
                    commonAwardFailure();
                }
            }

            // 业务逻辑3：抽奖成功后判断是否为会员
            function drawAwardSuccess(result) {

                var $score = $('.score');
                $score.text(result.data.value);

                localStorage.setItem('prizeToken',result.data.prizeToken);

                getUserLogin(getUserLoginSuccess,getUserLoginFailure);

            }

            // 业务逻辑4：是会员请求领奖接口，不是则显示表单页面
            function getUserLoginSuccess(result) {

                var prizeToken = localStorage.getItem('prizeToken');

                // debug
                // result.errCode = -1;

                if (result.errCode == 0) {

                    $maskContainer1.show();

                    var $goMall = $('.goMall');

                    $goMall.on('click',function () {
                        getAward(prizeToken,getAwardSuccess,commonAwardFailure);
                    });
                    // 可能已领完
                }else{
                    //显示表单页面
                    $maskContainer2.show();

                    var $sendMessage = $('#sendMessage');
                    var $inputMobile = $('#inputMobile');
                    var $inputCaptcha = $('#inputCaptcha');

                    //获取url参数
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
                        sendMessage($inputMobile.val(),function (result) {
                            alert('短信验证码已发送！');
                        },function (result) {
                            alert('发送失败，请重试！');
                        })

                    });

                    var $submit = $('#submit');

                    $submit.on('click',function () {

                        var data = confirm($inputMobile,$inputCaptcha);

                        registerInfo(data,registerInfoSuccess,commonFailure)

                    });
                }
            }

            // 业务逻辑5-1：请求领奖接口后跳转商城
            function getAwardSuccess(result) {

                location.href = apis.getMallEntry();

            }

            // 业务逻辑5-2：注册完后跳转商城
            function registerInfoSuccess(result){

                $maskContainer2.hide();
                $maskContainer1.show();

                var prizeToken = localStorage.getItem('prizeToken');

                // 可能已领完
                var $goMall = $('.goMall');

                $goMall.on('click',function () {
                    getAward(prizeToken,getAwardSuccess,commonAwardFailure);
                });
            }

            //主线逻辑开始
            //debug
            /*$.get('http://api.dev.vveshow.com/interact/api/wechat/openid/hyx1927/hyx_coupon',
                getBaseInfo(getBaseInfoSuccess,commonFailure)
            );*/

            //跳转packet页面执行脚本！
            $goPacket.on('click', function () {
                // 可能已领完
                getBaseInfo(getBaseInfoSuccess,commonFailure);
            });

        });

    });
})();
