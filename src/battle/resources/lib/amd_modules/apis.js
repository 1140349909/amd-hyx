/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery', 'rest', 'utils'], function ($, rest, utils) {

    /*定义sit,uat,prd环境*/
    var hostname = location.hostname;
    var type;

    //console.log(hostname);

    if (hostname.indexOf('sit') != -1) {
        type = 'sit'
    } else if (hostname.indexOf('uat') != -1) {
        type = 'uat'
    } else if (hostname.indexOf('localhost') != -1) {
        type = 'sit'
    } else if (hostname.indexOf('127.0.0.1') != -1) {
        type = 'sit'
    } else {
        type = 'prd'
    }

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
            appId = "573e84230f93d5782eb18c5a";
            formId = "";
            mallUrl = 'http://mall.dev.vveshow.com';
            break;
        case 'sit':
            apiUrl = 'http://api.sit.vveshow.com/interact';
            appId = "573e84230f93d5782eb18c5a";
            formId = "";
            mallUrl = 'http://mall.sit.vveshow.com';
            break;
        case 'uat':
            apiUrl = 'http://api.uat.vveshow.com/interact';
            appId = "573e84230f93d5782eb18c5a";
            formId = "";
            mallUrl = 'http://mall.uat.vveshow.com';
            break;
        case 'prd':
            apiUrl = 'http://api.linkin.mobi/interact';
            appId = "573e8561ac81f67282f784d9";
            formId = "";
            mallUrl = 'http://mall.iloka.me';
            break;
    }

    var client = 'm',
        channel = 'linkin';
    var UIN = 'hyx1927',
        ACTIVE_CODE = 'battle',
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
        getBaseInfo: getBaseInfo
    };

    //根据商城code返回入口地址
    function getMallEntry() {

        var buyApiUrl = apiUrl.replace('interact', 'buy');

        var mallRootUrl = buyApiUrl + '/entry/{uin}/{code}/{channel}',

            params2 = {
                channel: channel,
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
                channel: channel,
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

});
