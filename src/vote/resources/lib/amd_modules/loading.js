/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery', 'utils'], function ($, utils) {

    var imgList = [
      "./resources/images/bg1.png",
      "./resources/images/bg2.png",
      "./resources/images/bg3.png",
      "./resources/images/bg4.png"
    ];

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
            document.title = '恒源祥联合体年度十佳经营者';
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="fixTitle.html"></iframe>');
            $iframe.on('load', function () {
                console.log('loading iframe loaded');
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
