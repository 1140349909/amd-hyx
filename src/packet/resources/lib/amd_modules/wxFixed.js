/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery'], function ($) {
    function title(title) {
        var $body = $('body');
        document.title = title;
        // hack在微信等webview中无法修改document.title的情况
        var $iframe = $('<iframe src=""></iframe>').on('load', function () {
            setTimeout(function () {
                $iframe.off('load').remove()
            }, 0)
        }).appendTo($body)
    }


    return {title: title}


});