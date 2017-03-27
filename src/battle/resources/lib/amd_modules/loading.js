/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery', 'utils'], function ($, utils) {
    
    var indexList = [
        // 'resources/images/index/bg.png',
        // 'resources/images/index/help.png',
        'resources/images/index/gift.png',
        'resources/images/index/logo.png',
        'resources/images/index/logo2.png',
        'resources/images/index/start.png',
        'resources/images/index/dialog.png',
        'resources/images/index/dialogGift.png'
    ];

    var helpList = [
        'resources/images/help/dialog.png',
        'resources/images/help/egg.png',
        'resources/images/help/home.png',
        'resources/images/help/tomato.png'
    ];

    var chooseList = [
        'resources/images/choose/banner.png',
        'resources/images/choose/chooseEgg.png',
        'resources/images/choose/chooseTomato.png',
        'resources/images/choose/dialog.png'
    ];

    var loadingList = [
        'resources/images/loading/bg.png',
        'resources/images/loading/logo.png'
    ];

    var imgList = [];
    
    imgList = imgList.concat(indexList,helpList,chooseList,loadingList);

    function init(callback) {
        var body = $('body'),
            percentBox = $('.loading-percent'),
            percentTxt = $('.loading-percent-txt'),
            contentWp = $('#index-content'),
            contentHtml = contentWp.html();

        utils.loadImgGroup(imgList, function (allImgArray) {
            contentWp.replaceWith(contentHtml);
            percentBox.fadeOut(400, function () {
                callback && callback();
            });

            var $body = $('body');
            // document.title = '番茄鸡蛋大战——首页';
            document.title = '恒源祥番茄炒蛋大战';
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="fixTitle.html"></iframe>');
            $iframe.on('load', function () {
                //console.log('loading iframe loaded');
                setTimeout(function () {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo($body);

        }, function (i, loadPercent, loadResultObj) {
            percentTxt.text(parseInt(loadPercent * 100, 10) + '%');
        });
    }

    return {
        init: init
    }

});