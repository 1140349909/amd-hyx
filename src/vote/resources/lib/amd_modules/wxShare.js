/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery', 'apis', 'wx'], function ($, apis, wx) {

    return {
        weixinShare:weixinShare
    };

    function weixinShare(fnSuccess, fnFail, isHiddenFavBtn) {

        $.when(apis.getWeixinConfig())
            .done(function (data, textStatus, jqXHR) {

                var configData = data.data;

                configData.debug = false;// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                configData.jsApiList = [
                    'checkJsApi',
                    'onMenuShareTimeline', 'onMenuShareAppMessage',
                    'onMenuShareQQ', 'onMenuShareWeibo',
                    'hideMenuItems', 'showMenuItems',
                    'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
                    'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd',
                    'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice',
                    'chooseImage', 'previewImage', 'uploadImage', 'downloadImage',
                    'getNetworkType', 'openLocation', 'getLocation',
                    'hideOptionMenu', 'showOptionMenu', 'closeWindow',
                    'scanQRCode', 'chooseWXPay', 'openProductSpecificView',
                    'addCard', 'chooseCard', 'openCard'
                ]; // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

                // 微信config信息验证
                wx.config(configData);

                //
                wx.ready(function () {
                    // alert('weixin config信息验证成功！')
                    $.when(apis.getShareSetting())
                        .done(function (data, textStatus, jqXHR) {
                            var shareData = data.data;

                            var shareTitle = shareData.title,
                                shareDesc = '昂羊中国、+YOU未来',
                                // shareImg = apis.getImgUrl(shareData.imgId),
                                shareImg = location.origin + location.pathname + 'resources/images/573ade3b0f93d544f400dc05.jpg',
                                shareLink = apis.getShareLink();

                            // 隐藏按钮
                            if (isHiddenFavBtn) {
                                wx.hideMenuItems({
                                    menuList: [
                                        'menuItem:favorite'
                                    ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                                });
                            }

                            // 分享到朋友圈
                            wx.onMenuShareTimeline({
                                title: shareTitle,
                                link: shareLink,
                                imgUrl: shareImg,
                                success: function (data) {
                                    fnSuccess && fnSuccess();
                                },
                                cancel: function () {
                                    fnFail && fnFail();
                                }
                            });

                            // 分享给朋友
                            wx.onMenuShareAppMessage({
                                title: shareTitle,
                                desc: shareDesc,
                                link: shareLink,
                                imgUrl: shareImg,
                                type: 'link', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function (successData) {
                                    fnSuccess && fnSuccess();
                                },
                                cancel: function () {
                                    fnFail && fnFail();
                                }
                            });

                            /*$.when(apis.getShareLink())
                                .done(function (data, textStatus, jqXHR) {
                                    var shareLink = data.data;

                                    if('uat' in shareLink){
                                        shareLink =  'http://api.sit.vveshow.com/interact/api/wechat/entry/hyx1927/vote/linkin?url=http%3A%2F%2Fproject.uat.vveshow.com%2Fhyx1927%2Fvote%2Findex.html';
                                    }else if ('sit' in shareLink){
                                        shareLink =  'http://api.sit.vveshow.com/interact/api/wechat/entry/hyx1927/vote/linkin?url=http%3A%2F%2Fproject.sit.vveshow.com%2Fhyx1927%2Fvote%2Findex.html';
                                    }else{
                                        shareLink =  'http://interact.vveshow.com/api/wechat/entry/hyx1927/vote/linkin?url=http%3A%2F%2Finteract.vveshow.com%2Fhyx1927%2Fvote%2Findex.html';
                                    }

                                    // 分享到朋友圈
                                    wx.onMenuShareTimeline({
                                        title: shareTitle,
                                        link: shareLink,
                                        imgUrl: shareImg,
                                        success: function (data) {
                                            fnSuccess && fnSuccess();
                                        },
                                        cancel: function () {
                                            fnFail && fnFail();
                                        }
                                    });

                                    // 分享给朋友
                                    wx.onMenuShareAppMessage({
                                        title: shareTitle,
                                        desc: shareDesc,
                                        link: shareLink,
                                        imgUrl: shareImg,
                                        type: 'link', // 分享类型,music、video或link，不填默认为link
                                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                        success: function (successData) {
                                            fnSuccess && fnSuccess();
                                        },
                                        cancel: function () {
                                            fnFail && fnFail();
                                        }
                                    });


                                });*/


                        });
                });

                wx.error(function (res) {
                    // alert('weixin config信息验证失败！')
                    top.location.reload();
                });

            });
    }

});
