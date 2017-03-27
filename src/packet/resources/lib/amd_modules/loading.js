/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery', 'utils'], function ($, utils) {

    var formList = [
        'resources/images/form/button.png',
        'resources/images/form/form.png'
    ];
    
    var indexList = [
        'resources/images/index/bg.jpg',
        'resources/images/index/button.png',
        'resources/images/index/mask.png',
        'resources/images/index/packet.png'
    ];

    var loadingList = [
        'resources/images/loading/bg.png',
        'resources/images/loading/logo.png'
    ];

    var packetList = [
        'resources/images/packet/bg.jpg',
        'resources/images/packet/goForm.png',
        'resources/images/packet/goIndex.png',
        'resources/images/packet/lose.png'
    ];

    var resultList = [
        'resources/images/result/goIndex.png',
        'resources/images/result/goMall.png',
        'resources/images/result/qrcode.png',
        'resources/images/result/result.png',
        'resources/images/result/text.png'
    ];

    var ruleList = [
        'resources/images/rule/button.png',
        'resources/images/rule/dialog.png'
    ];

    var imgList = [];
    
    imgList = imgList.concat(formList,indexList,loadingList,packetList,resultList,ruleList);

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
            document.title = '恒源祥抢红包';
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