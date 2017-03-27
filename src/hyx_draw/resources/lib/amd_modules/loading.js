/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery', 'utils'], function ($, utils) {
    
    var indexList = [
        'resources/images/index/bg.png',
        'resources/images/index/button.png',
        'resources/images/index/draw.png'
    ];

    var drawList = [
        'resources/images/draw/1.png',
        'resources/images/draw/2.png',
        'resources/images/draw/3.png',
        'resources/images/draw/4.png',
        'resources/images/draw/5.png',
        'resources/images/draw/6.png',
        'resources/images/draw/7.png',
        'resources/images/draw/8.png',
        'resources/images/draw/9.png',
        'resources/images/draw/10.png',
        'resources/images/draw/11.png',
        'resources/images/draw/12.png',
        'resources/images/draw/13.png',
        'resources/images/draw/14.png',
        'resources/images/draw/15.png'
    ];

    var resultList = [
        'resources/images/result/bg.png',
        'resources/images/result/mask1.png',
        'resources/images/result/mask2.png',
        'resources/images/result/mask3.png',
        'resources/images/result/mask4.png'
    ];

    var imgList = [];
    
    imgList = imgList.concat(indexList,drawList,resultList);

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
            document.title = '恒源祥抽签抢红包';
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