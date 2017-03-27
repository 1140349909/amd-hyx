/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

require(['jquery', 'swipe', 'apis', 'wxShare', 'music', 'loading', 'tip'],
    function ($, swipe, apis, wxShare, music, loading, tip) {

        // 初始化微信分享
        wxShare.weixinShare(function () {
            // 统计分享
            console.log('wxConfig');
            apis.recordShareTimes();
        });

        // loading
        loading.init(function () {

            var $cover = $('#cover');
            var $cover1 = $('#cover1');
            var $cover2 = $('#cover2');
            var $cover3 = $('#cover3');
            var $share = $('#share');
            var $cover_background = '<div class="coverBackground"></div>';
            var $loading = $('<div class="loading-ajax"><div class="loading-ajax-box"><div class="loading-ajax-box-text">正在投票中</div><div class="loading-ajax-box-animation loader-inner ball-pulse"><div></div><div></div><div></div></div></div></div>');
            var mp3Link = location.origin + location.pathname + 'resources/mp3/2015090704513AA8EEFF5A32955BC3F43D4D97FB.mp3';
            var mp3Ele = '<audio id="back_img" autoplay=“autoplay” controls="controls"><source src='+ mp3Link +' type="audio/mp3" /></audio>';
            var isSubmit = false;

            //弹窗隐藏
            $cover.hide();
            $cover1.hide();
            $cover2.hide();
            $cover3.hide();
            $share.hide();

            $('body').append(mp3Ele);

            /*$.when(apis.getFormInfo())
             .then(function (result) {

             }, function (result) {

             console.log(result);
             });*/

            // hack在微信等webview中无法修改document.title的情况
            var $body = $('body');
            document.title = '恒源祥联合体年度十佳经营者';
            var $iframe = $('<iframe src="fixTitle.html"></iframe>');
            $iframe.on('load', function () {
                setTimeout(function () {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo($body);

            // 加载音乐
            /*var media = document.getElementById('media');
             media.onclick = function () {
             music.changeClass(this, 'mp3');
             };*/

            var num = 99;

            function Toswipe(el) {
                this.ww = $(window).width();
                this.wh = $(window).height();
                this.move = false;
                //  this.zIndex = 99;
                this.el = el;
            }

            var $arrow = $('.arrow');
            var $linkin = $('.linkin');

            function hideArrow() {
                $arrow.hide().fadeIn();
                $linkin.hide().fadeIn();
            }

            Toswipe.prototype = {
                constructor: Toswipe,
                tourl: 'index.html',

                handlerSwipeUp: function (el, event, phase, distance, duration, fingerCount) {
                    var target = $(el).data('vn'),
                        that = this;
                    hideArrow();


                    // if ($(el).attr('id') == 'page-5') {
                    if ($(el).attr('id') == 'page-4') {
                        $arrow.fadeIn().hide();
                        $linkin.fadeIn().hide();
                    }

                    if (target) {
                        if (!this.move) {
                            $(target).css({
                                left: 0,
                                top: that.wh,
                                'z-index': num
                            }).removeClass('hide').addClass('ani');
                        }

                        if (phase === 'move') {
                            this.move = true;
                            var top = parseInt($(target).css('top'));
                            $(target).css('top', that.wh - distance);
                        }
                        else if (phase === 'end' || phase === 'cancel') {
                            this.move = false;
                            if (distance > 100) {
                                $(target).animate({top: 0}, 300, function () {
                                    $(el).addClass('hide').removeClass('ani');
                                    num++;
                                });
                            } else {
                                $(target).animate({top: that.wh}, 100, function () {
                                    $(target).addClass('hide').removeClass('ani');
                                });
                            }
                        }
                    }
                },

                handlerSwipeDown: function (el, event, phase, distance, duration, fingerCount) {
                    var target = $(el).data('vp'), that = this;


                    if (target) {
                        if (!this.move) {
                            $(target).css({
                                left: 0,
                                top: -that.wh,
                                'z-index': num
                            }).removeClass('hide').addClass('ani');
                        }

                        if (phase === 'move') {
                            this.move = true;
                            var top = parseInt($(target).css('top'));
                            $(target).css('top', distance - that.wh);
                        } else if (phase === 'end' || phase === 'cancel') {
                            this.move = false;
                            if (distance > 100) {
                                $(target).animate({top: 0}, 300, function () {
                                    $(el).addClass('hide').removeClass('ani');

                                    num++;
                                });
                            } else {
                                $(target).animate({top: -that.wh}, 100, function () {
                                    $(target).addClass('hide').removeClass('ani');
                                });
                            }
                        }
                    }
                },

                init: function (el) {
                    var that = this;
                    el = that.el;

                    $(el).swipe({
                        swipeStatus: function (event, phase, direction, distance, duration, fingerCount) {
                            switch (direction) {
                                case 'up':
                                    that.handlerSwipeUp(this, event, phase, distance, duration, fingerCount);
                                    break;
                                case 'down':
                                    that.handlerSwipeDown(this, event, phase, distance, duration, fingerCount);
                                    break;
                                case 'right':
                                    break;
                                case 'left':
                                    break;
                            }
                        }
                    });
                }
            };

            /*
             ** 单页切换 各个元素fixed 控制body高度
             */
            var v_h = null;   //记录设备的高度
            var v_w = null;

            function init_pageH() {

                var Node;
                var $mPage = $(".m-page");
                var $pIndex = $(".p-index");

                var fn_h = function () {
                    if (document.compatMode == "BackCompat")
                        Node = document.body;
                    else
                        Node = document.documentElement;
                    return Math.max(Node.scrollHeight, Node.clientHeight);
                };

                var fn_w = function () {
                    if (document.compatMode == "BackCompat")
                        Node = document.body;
                    else
                        Node = document.documentElement;
                    return Math.max(Node.scrollWidth, Node.clientWidth);
                };

                var page_h = fn_h();
                var m_h = $mPage.height();

                //设置各种模块页面的高度，扩展到整个屏幕高度
                v_h = page_h >= m_h ? page_h : m_h;
                $mPage.height(v_h);
                $pIndex.height(v_h);

                //hack
                v_w = fn_w();
                //$mPage.width(v_w);
                //$pIndex.width(v_w);
            }

            init_pageH();

            var toswipe = new Toswipe('.page');
            toswipe.init();

            /*$(".messageInput").on('focus', function () {
             $(".tipMessage").hide();
             });

             $(".btnRuler").on('touchend', function () {
             $(".mask").show();
             });

             $(".btnClose").on('touchend', function () {
             $(".mask").hide();
             });

             $(".shareWrap").on('touchend', function () {
             $(this).hide();
             });*/

            //构造数据
            var data = [
                {
                    "name": "韩胜辉",
                    "identity": "服饰",
                    "value": "a"
                },
                {
                    "name": "侯定云",
                    "identity": "服饰",
                    "value": "b"
                },
                {
                    "name": "王海港",
                    "identity": "服饰",
                    "value": "c"
                },
                {
                    "name": "丁建良",
                    "identity": "服饰",
                    "value": "d"
                },
                {
                    "name": "毛文灏",
                    "identity": "服饰",
                    "value": "e"
                },
                {
                    "name": "陈晓明",
                    "identity": "服饰",
                    "value": "f"
                },
                {
                    "name": "刘　炜",
                    "identity": "服饰",
                    "value": "g"
                },
                {
                    "name": "史红梅",
                    "identity": "家纺",
                    "value": "h"
                },
                {
                    "name": "陈佳亮",
                    "identity": "家纺",
                    "value": "i"
                },
                {
                    "name": "黄　磊",
                    "identity": "家纺",
                    "value": "j"
                },
                {
                    "name": "张云萍",
                    "identity": "商超",
                    "value": "k"
                },
                {
                    "name": "毛彩娅",
                    "identity": "商超",
                    "value": "l"
                },
                {
                    "name": "李泉忠",
                    "identity": "商超",
                    "value": "m"
                },
                {
                    "name": "谢相宇",
                    "identity": "彩羊",
                    "value": "n"
                },
                {
                    "name": "杨　成",
                    "identity": "彩羊",
                    "value": "o"
                },
                {
                    "name": "范　宁",
                    "identity": "绒线",
                    "value": "p"
                },
                {
                    "name": "张学录",
                    "identity": "绒线",
                    "value": "q"
                },
                {
                    "name": "沈昌明",
                    "identity": "羊绒",
                    "value": "r"
                },
                {
                    "name": "郑旭锋",
                    "identity": "羊绒",
                    "value": "s"
                },
                {
                    "name": "管引贤",
                    "identity": "儿童",
                    "value": "t"
                }
            ];

            var $checkBox = $('.checkbox-list');

            for (var i = 0; i < data.length; i++) {

                var $selection_item_box = $('<div>');
                $selection_item_box.addClass('selection_item_box');

                var $selection_item_box_bg = $('<div>');
                $selection_item_box_bg.addClass('selection_item_box_bg');

                var $label = $('<label>');
                $label.attr('for', i);
                $label.css({
                    width: "100%",
                    height: "100%"
                });
                var $input = $('<input type="checkbox">');
                $input.attr('value', data[i].value);
                $input.attr('id', i);
                $input.css({
                    display: "none"
                });

                $label.append($input);
                $selection_item_box_bg.append($label);

                $selection_item_box_bg.attr('data-value', data[i].value);

                var $selection_item_box_h1 = $('<h1>');
                var $selection_item_box_p = $('<p>');

                $selection_item_box_h1.text(data[i].name + '/' );
                $selection_item_box_h1.append('<span>' + data[i].identity + '</span>')
                // $selection_item_box_p.text(data[i].identity);

                $selection_item_box.append($selection_item_box_bg);
                $selection_item_box.append($selection_item_box_h1);
                $selection_item_box.append($selection_item_box_p);

                $checkBox.append($selection_item_box);
            }


            //点击弹框隐藏
            $cover1.on('touchstart', function () {
                $(this).hide();
                $('.coverBackground').remove();
            });

            $cover2.on('touchstart', function () {
                $(this).hide();
                $('.coverBackground').remove();
            });

            $cover3.on('touchstart', function () {
                $(this).hide();
                $('.coverBackground').remove();
            });

            $cover.on('touchstart', function () {
                $(this).hide();
                $share.show();
            });

            $share.on("touchstart", function () {
                $(this).hide();
                $('.coverBackground').remove();
            })

            //点击选择项
            $('.selection_item_box div').each(function () {

                $(this).on('touchstart', function () {

                    $(this).toggleClass('selected');
                })
            });

            //提交按钮
            $(".submit").on('touchstart', function () {

                var nameData = [];

                var $selection = $('.selected');

                var selection_item_box_length = $selection.length;

                console.log(selection_item_box_length);
                if (selection_item_box_length == 0) {

                    $cover2.show();
                    $('#page-4').append($cover_background);

                    console.log('请选择十位候选人！');
                } else if (selection_item_box_length > 10) {

                    $cover1.show();
                    $('#page-4').append($cover_background);

                    console.log('候选人已经超过十位！');
                } else {
                    $selection.each(function (index, value) {

                        console.log($(value).attr('data-value'));

                        nameData.push($(value).attr('data-value'));

                    });

                    console.log(nameData.toString());

                    var data = {
                        "appId": apis.formId,
                        "form": [
                            {
                                "data": [
                                    {
                                        "name": "tenBest",
                                        "text": "十佳候选人",
                                        "value": nameData.toString()
                                    }
                                ],
                                "formId": "hv",
                                "formName": "hvForm"
                            }
                        ]
                    };

                    if (isSubmit) return false;
                    isSubmit = true;
                    $('body').append($loading);
                    //判断是否有可玩次数
                    $.when(apis.getJoinTotalTimes()).then(function (result) {

                        //提交数据
                        if (result.data.perTimes == 1) {
                            // $cover.show();

                            $.when(apis.getAward()).then(function (result) {
                                console.log(result);

                                $.when(apis.formSubmit(data))
                                    .then(function (result) {

                                        $cover.show();
                                        $('#page-4').append($cover_background);
                                        $('.loading-ajax').remove();
                                        isSubmit = false;


                                    }, function (result) {

                                        $cover3.show();
                                        $('#page-4').append($cover_background);
                                        $('.loading-ajax').remove();
                                          isSubmit = false;

                                    });

                            }, function (result) {

                                $.when(apis.formSubmit(data))
                                    .then(function (result) {

                                        $cover.show();
                                        $('#page-4').append($cover_background);
                                        $('.loading-ajax').remove();
                                        isSubmit = false;

                                    }, function (result) {

                                        $cover3.show();
                                        $('#page-4').append($cover_background);
                                        $('.loading-ajax').remove();
                                        isSubmit = false;

                                    });
                            });

                        } else {
                            $cover3.show();
                            $('#page-4').append($cover_background);
                            $('.loading-ajax').remove();
                            isSubmit = false;
                        }

                    }, function (result) {
                        $cover3.show();
                        $('#page-4').append($cover_background);
                        $('.loading-ajax').remove();
                        isSubmit = false;
                    });


                }
            });


        });


    });
