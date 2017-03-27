/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define(['jquery'], function($){

    var tipTplBtn = '<div class="tipWrap">\
                      <div class="mainWrap">\
                        <div class="tip">\
                           <div class="tip-msg">{{tipMsg}}</div>\
                            <div class="btnSure">确定</div>\
                        </div>\
                      </div>\
                    </div>';
    var defaults = {
        msg: '',
        btn: true,
        fn: null,
    };


    function open(options){
        var opts = $.extend({}, defaults, options);

        var tipTplLocal, tip;

        if(opts.btn){
            tipTplLocal = tipTplBtn
                            .replace('{{tipMsg}}', opts.msg);
        }

        // 提示之前，删除已有的提示框
        $('.tipWrap').remove();
        tip = $(tipTplLocal).appendTo('body');

        tip.fadeIn();

        tip.on('click', function(){
            return false;
        });

        // 绑定按钮关闭弹窗事件
        tip.find('.btnSure').on('click', function(){
            close(opts.fn);
        });

    }

    function close(callback){
        var tip = $('.tipWrap');
        
        $('body').off('click', close);
       
        tip.fadeOut(400, function(){
            $(this).remove();
            callback && callback();
        });

    }

    function openMsg(msg,fn){
        open({
            msg:msg,
            fn:fn
        });
    }

    
    return {
        open: open,
        close: close,
        openMsg: openMsg,
    }

});