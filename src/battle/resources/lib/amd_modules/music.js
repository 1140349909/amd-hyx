/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */
define([], function () {
    return {changeClass: changeClass}

    function changeClass(target, id) {
        var className = $(target).attr('class');
        var ids = document.getElementById(id);
        (className == 'on')
            ? $(target).removeClass('on').addClass('off')
            : $(target).removeClass('off').addClass('on');
        (className == 'on')
            ? ids.pause()
            : ids.play();
    }

});