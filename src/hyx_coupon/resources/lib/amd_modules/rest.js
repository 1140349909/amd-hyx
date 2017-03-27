/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery', 'utils'], function ($, utils) {

    var ajaxBase = function (type, url, data, success, error, ext) {

        //console.log(type, url, data, success, error, ext);

        $.ajax({
            url: url,
            type: type,
            dataType: 'json',
            timeout: 30000,
            async: true,
            contentType: 'application/json',
            data: 'GET' != type ? JSON.stringify(data) : null,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            success: function (data, textStatus, jqXHR) {

                var codesSuccess = ['A1000', 'A1009', 'A1012', 'A1016', 'hyx_coupon'],
                    codesFail = ['A1001', 'A1002', 'A1003', 'A1004', 'A1005', 'A1006', 'A1007', 'A1008', 'A1010', 'A1011', 'A1013', 'A1014', 'A1015', 'A1017', 'A1018', 'A1019'];


                if (0 != data.errCode) {
                    // console.dir('error');
                    //alert(JSON.stringify(data));
                    error && error(data, textStatus, jqXHR);
                    //top.location="http://projects.linkin.mobi/api/wechat/entry/hyx1927/vote/index.html";
                }

                // console.dir(1);


                if (!data.data) {
                    // console.log('success1');
                    success && success(data, textStatus, jqXHR);
                    return;
                }

                // console.dir(2);


                if (codesSuccess.indexOf(data.data.code) > -1 || !data.data.code /*微信接口没有data.code字段*/) {
                    // console.log('success2');
                    success && success(data, textStatus, jqXHR);
                } else if (codesFail.indexOf(data.data.code) > -1) {
                    // console.log('error');
                    error && error(data, textStatus, jqXHR);
                }

                // console.dir(3);

            },
            error: function (response, textStatus, errorThrown) {
                if (0 == response.status) {
                    alert("网络连接中断，请在网络连接恢复后重试");
                    return;
                } else {
                    error({}, textStatus, response);
                    /*if(JSON.parse(response.responseText).errCode == '40003'){
                        error({}, textStatus, response);
                    }else{
                        alert(JSON.parse(response.responseText).errMsg);
                    }*/

                    //
                    //top.location="http://projects.linkin.mobi/api/wechat/entry/hyx1927/vote/index.html";
                }

            }
        });
    };

    return {
        post: function (url, params, data, success, error, ext) {

            url = urlTransform(url, params);

            ajaxBase('POST', url, data, success, error, ext);
        },

        put: function (url, params, data, success, error, ext) {

            url = urlTransform(url, params);

            ajaxBase('PUT', url, data, success, error, ext);
        },

        get: function (url, params, success, error, ext) {

            url = urlTransform(url, params);

            ajaxBase('GET', url, params, success, error, ext);
        },
        getImg: function (url, data) {
            url = urlTransform(url, data);

            return url;
        },
        del: function (url, data, success, error, ext) {
            ajaxBase('DELETE', url, data, success, error, ext);
        },
        urlTransform:urlTransform
    };

    function urlTransform(url, data) {
        var params = null;

        $.each(data, function (key, value) {
            var replaceStr = '{' + key + '}';

            if (url.indexOf(replaceStr) > -1) {
                url = url.replace('{' + key + '}', value);
            } else {
                if (!params) params = {};
                params[key] = value;
            }

        });

        if (params) {
            url = utils.urlSerialize(url, params);
        }

        return url;
    }

});


// A1000("成功"),
// A1001("商户不存在"),
// A1002("用户未登记"),
// A1003("活动不存在"),
// A1004("此游戏过期"),
// A1005("今天游戏已经结束，请明天再来玩"),
// A1006("你的游戏积分不足"),
// A1007("系统繁忙，请稍后再试"),
// A1008("你不能参与此游戏"),
// A1009("兑换成功"),
// A1010("不能兑换"),
// A1011("未找到此活动类型"),
// A1012("操作成功"),
// A1013("操作失败");
// A1014("当前用户没有权限"),
// A1015( "奖券已经使用，不可兑换"),
// A1016("兑奖成功"),
// A1017("客服已过期")
// A1018("手慢啦！奖券被大家抢完咯！")
// A1019("您已兑奖，请明天继续哦！");
