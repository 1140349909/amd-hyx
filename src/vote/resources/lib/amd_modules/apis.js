/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery', 'rest','utils'], function ($, rest,utils) {

    /*定义sit,uat,prd环境*/

    var type = '@ENV@',
        apiUrl = '',
        appId,
        formId;

    switch (type) {
        default:
            appId = "572b185a7ec6136c9f6eda8e";
            formId = "573abf110f93d544f4755f40";
            apiUrl = 'http://api.dev.vveshow.com/interact';
            break;
        case 'sit':
            appId = "572b185a7ec6136c9f6eda8e";
            formId = "573abf110f93d544f4755f40";
            apiUrl = 'http://api.sit.vveshow.com/interact';
            break;
        case 'uat':
            appId = "572b185a7ec6136c9f6eda8e";
            formId = "573abf110f93d544f4755f40";
            apiUrl = 'http://api.uat.vveshow.com/interact';
            break;
        case 'prd':
            apiUrl = 'http://api.linkin.mobi/interact';
            appId = "572b18a5ac81f63ebddb9cf5";
            formId = "573aeda2ac81f63ebddba403";
            break;
    }

    var client = 'm',
        channel = 'wechat';
    var UIN = 'hyx1927',
        ACTIVE_CODE = 'vote';


    // $.get('http://api.sit.vveshow.com/interact/api/wechat/openid/hyx1927/vote')

    return {
        getImgUrl: getImgUrl,
        getWeixinConfig: getWeixinConfig,
        getShareLink: getShareLink,
        recordShareTimes: recordShareTimes,
        formSubmit: formSubmit,
        getJoinTotalTimes: getJoinTotalTimes,
        getAward: getAward,
        getShareSetting: getShareSetting,
        // getFormInfo: getFormInfo,
        formId: formId
    };

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
        /*var defer = $.Deferred();

        rest.get(
            apiUrl + '/api/v1/{client}/{channel}/admin/app/url/{id}',
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

        return defer.promise();*/

        var href = (top.location.href).split('?')[0];

        var url = apiUrl + '/api/wechat/entry/{uin}/{intercode}/{channel}' + '?url=' + encodeURIComponent(href),

            params = {
                channel: channel,
                uin: UIN,
                intercode: ACTIVE_CODE
            };

        //var shareUrl = rest.urlTransform(url, params);
        return rest.urlTransform(url, params);

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
            apiUrl + '/api/v1/{client}/{channel}/countly/{type}/{id}',
            {
                client: client,
                channel: channel,
                type: 'forward',
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

    // 获取当前玩家可玩游戏次数
    function getJoinTotalTimes() {
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

    //抽奖
    function getAward() {
        var defer = $.Deferred();

        rest.post(

            apiUrl + '/api/v1/{client}/{channel}/app/action/award/extract',

            {
                client: client,
                channel: channel
            },

            {
                "appId": appId
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

    //获取用户数据收集应用详情定义服务（不需要）
    /*function getFormInfo() {
     var defer = $.Deferred();

     rest.get(
     apiUrl + '/api/v1/' + client + '/' + channel + '/app/collect/{id}',
     {
     id: formId
     },
     function (data, textStatus, jqXHR) {
     defer.resolve(data, textStatus, jqXHR);
     },
     function (data, textStatus, jqXHR) {
     defer.reject(data, textStatus, jqXHR);
     }
     );

     return defer.promise();
     }*/

    // 用户信息提交
    function formSubmit(data) {
        var defer = $.Deferred();
        console.log('apis:' + data);
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

});
