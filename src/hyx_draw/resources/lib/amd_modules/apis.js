/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery', 'rest', 'utils'], function ($, rest, utils) {

    /*定义sit,uat,prd环境*/
    var hostname = location.hostname;
    var type;

    //console.log(hostname);+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    if (hostname.indexOf('sit') != -1) {
        type = 'sit'
    } else if (hostname.indexOf('uat') != -1) {
        type = 'uat'
    } else if (hostname.indexOf('localhost') != -1) {
        type = 'dev'
    } else if (hostname.indexOf('127.0.0.1') != -1) {
        type = 'dev'
    } else if (hostname.indexOf('dev') != -1) {
        type = 'dev'
    } else {
        type = 'prd'
    }

    //抢红包：
    //uat：57ce60900f93d57a2a10b727
    //prd：
    // $.get('http://api.dev.vveshow.com/interact/api/wechat/openid/hyx1927/hyx_coupon');
    //debug
    /*
     $.get('http://api.sit.vveshow.com/interact/api/wechat/openid/hyx1927/battle?openid=ozM_asozqxCKzR2iaAzeehA5TLkE');
     $.get('http://api.uat.vveshow.com/interact/api/wechat/openid/hyx1927/battle?openid=ozM_asozqxCKzR2iaAzeehA5TLkE');
     $.get('http://api.linkin.mobi/interact/api/wechat/openid/hyx1927/battle?openid=ozM_asozqxCKzR2iaAzeehA5TLkE');
     */

    var apiUrl = '',
        appId,
        formId,
        mallUrl = '';

    switch (type) {
        default:
            apiUrl = 'http://api.dev.vveshow.com/interact';
            appId = "58847d230f93d5097871f32d";
            formId = "";
            mallUrl = 'http://m.dev.vveshow.com';
            break;
        case 'sit':
            apiUrl = 'http://api.sit.vveshow.com/interact';
            appId = "58847d230f93d5097871f32d";
            formId = "";
            mallUrl = 'http://m.sit.vveshow.com';
            break;
        case 'uat':
            apiUrl = 'http://api.uat.vveshow.com/interact';
            appId = "58847d230f93d5097871f32d";
            formId = "";
            mallUrl = 'http://m.uat.vveshow.com';
            break;
        case 'prd':
            apiUrl = 'http://api.linkin.mobi/interact';
            appId = "58847d230f93d5097871f32d";
            formId = "";
            mallUrl = 'http://m.iloka.me';
            break;
    }

    var client = 'm',
        channel = 'linkin';
    var UIN = 'hyx1927',
        ACTIVE_CODE = 'hyx_draw',
        MALL_CODE = 'mall';

    return {
        getMallEntry: getMallEntry,
        getImgUrl: getImgUrl,
        getShareLink: getShareLink,
        getWeixinConfig: getWeixinConfig,
        recordShareTimes: recordShareTimes,
        formSubmit: formSubmit,
        getShareSetting: getShareSetting,
        postUserInfo: postUserInfo,
        getUserInfo: getUserInfo,
        getBaseInfo: getBaseInfo,
        getPlayTimes: getPlayTimes,
        drawAward: drawAward,
        getAward: getAward,
        getUserLogin: getUserLogin,
        sendMessage: sendMessage,
        registerInfo: registerInfo,
        getMemberBasicInfo: getMemberBasicInfo,
        getMemberDetailInfo: getMemberDetailInfo,
        putIntegral: putIntegral
    };

    //根据商城code返回入口地址
    function getMallEntry() {

        var buyApiUrl = apiUrl.replace('interact', 'buy');

        var mallRootUrl = buyApiUrl + '/entry/{uin}/{code}/{channel}',

            params2 = {
                channel: ACTIVE_CODE,
                uin: UIN,
                code: MALL_CODE
            };

        return rest.urlTransform(mallRootUrl, params2);
    }

    //根据mediaId返回src地址
    function getImgUrl(mediaId) {

        return rest.getImg(
            apiUrl + '/api/v1/{client}/{channel}/media/image/{mediaId}',
            {
                client: client,
                channel: channel,
                mediaId: mediaId
            }
        );
    }

    // 获取微信注入统一入口（分享链接）
    function getShareLink() {

        var href = location.protocol + '//' + location.hostname + '/{uin}/{intercode}/index.html',

            params1 = {
                uin: UIN,
                intercode: ACTIVE_CODE
            };

        var url = apiUrl + '/api/wechat/entry/{uin}/{intercode}/{channel}',

            params2 = {
                channel: 'lkshare',
                uin: UIN,
                intercode: ACTIVE_CODE
            };

        href = rest.urlTransform(href, params1);

        var param = utils.paramsSerialize({
            'url': encodeURIComponent(href)
        });

        return rest.urlTransform(url, params2) + '?' + param;
    }

    // 获取微信config接口注入权限验证配置
    function getWeixinConfig() {
        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/wechat/jsapi/{channel}/{uin}/{intercode}' + '?url=' + encodeURIComponent(top.location.href),
            {
                channel: channel,
                uin: UIN,
                intercode: ACTIVE_CODE
            },
            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },
            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();
    }

    // 统计微信分享（转发）次数
    function recordShareTimes() {
        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/countly/{type}/{code}/{id}',
            {
                client: client,
                channel: channel,
                type: 'forward',
                code: ACTIVE_CODE,
                id: appId
            },
            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },
            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();
    }

    // 用户信息提交
    function formSubmit(data) {
        var defer = $.Deferred();
        //console.log('apis:' + data);
        rest.post(
            apiUrl + '/api/v1/{client}/{channel}/app/collect/data',

            {
                client: client,
                channel: channel
            },

            data,

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();
    }


    //获取分享设置
    function getShareSetting() {
        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/app/action/share/{id}',
            {
                client: client,
                channel: channel,
                id: appId
            },


            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },
            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();

    }

    //用户积分保存
    function postUserInfo(data) {

        var defer = $.Deferred();

        rest.post(
            apiUrl + '/api/v1/{client}/{channel}/member/interact/integral',

            {
                client: client,
                channel: channel
            },

            data,

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();

    }

    //根据mobile返回会员身份信息
    function getUserInfo(mobile) {
        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/member/interact/userinfo/{mobile}',
            {
                client: client,
                channel: channel,
                mobile: mobile
            },
            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },
            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();

    }

    //获取当前玩家可玩游戏次数
    function getPlayTimes() {

        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/app/action/times/{appid}',
            {
                client: client,
                channel: channel,
                appid: appId
            },

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },
            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();

    }

    //获取应用基本信息
    function getBaseInfo() {

        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/app/action/baseinfo/{id}',
            {
                client: client,
                channel: channel,
                id: appId
            },

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },
            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();
    }

    //抽奖
    function drawAward() {
        var defer = $.Deferred();

        rest.post(
            apiUrl + '/api/v1/{client}/{channel}/app/action/award/extract',

            {
                client: client,
                channel: channel
            },

            {
                appId: appId
            },

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();
    }

    //领奖
    function getAward(prizeToken) {
        var defer = $.Deferred();

        rest.post(
            apiUrl + '/api/v1/{client}/{channel}/app/action/award/get',

            {
                client: client,
                channel: channel
            },

            {
                appId: appId,
                prizeToken: prizeToken
            },

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();
    }

    /*用户检测相关接口*/

    //检测用户是否登录
    function getUserLogin() {

        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/user/logged',

            {
                client: client,
                channel: channel
            },

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();

    }

    //注册验证码短信发送
    function sendMessage(mobile) {
        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/sms/captcha/{mobile}',

            {
                client: client,
                channel: channel,
                mobile: mobile
            },

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();

    }

    //提供用户在微信里快速绑定手机号成为会员服务
    //interact废弃，改用buy
    function registerInfo(data) {

        var defer = $.Deferred();

        var buyApiUrl = apiUrl.replace('interact', 'buy');

        rest.post(
            buyApiUrl + '/api/v1/{client}/{channel}/member/wechat/mobile/{mobile}/{code}',

            {
                client: client,
                channel: channel,
                mobile: data.mobile,
                code: data.code
            },
            null,
            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();

    }

    //提供获取当前登陆会员基本信息服务
    function getMemberBasicInfo() {

        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/member/info/basic',

            {
                client: client,
                channel: channel
            },

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                console.log(123);
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();
    }

    //提供获取当前登陆会员详细信息服务
    function getMemberDetailInfo() {
        var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/member/info/detail',

            {
                client: client,
                channel: channel
            },

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();
    }

    //会员互动应用积分(临时使用)
    function putIntegral(score) {
        var defer = $.Deferred();

        rest.put(
            apiUrl + '/api/v1/{client}/{channel}/member/interact/integral/{v}',

            {
                client: client,
                channel: channel,
                v: score
            },

            {},

            function (data, textStatus, jqXHR) {
                defer.resolve(data, textStatus, jqXHR);
            },

            function (data, textStatus, jqXHR) {
                defer.reject(data, textStatus, jqXHR);
            }
        );

        return defer.promise();

    }

});
