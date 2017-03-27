/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

(function(){

    var doc = document,
        win = window;

    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    recalc();
    // doc.addEventListener('DOMContentLoaded', recalc, false);

})();