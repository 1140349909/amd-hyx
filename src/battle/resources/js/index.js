(function () {

    window.__uri = function(uri) {
        return uri;
    };

    requirejs.config(
        {
            baseUrl: "resources",
            paths: {
                jquery: '//cdn.bootcss.com/jquery/2.2.3/jquery.min',
                swipe: '//cdn.bootcss.com/jquery.touchswipe/1.6.16/jquery.touchSwipe.min',
                easel: '//cdn.bootcss.com/EaselJS/0.8.0/easeljs.min',
                tween: '//cdn.bootcss.com/tweenjs/0.6.1/tweenjs.min',
                preload: '//cdn.bootcss.com/PreloadJS/0.6.0/preloadjs.min',
                iscroll: '//cdn.bootcss.com/iScroll/5.2.0/iscroll.min',

                utils: 'lib/amd_modules/utils',
                Shake: 'lib/amd_modules/shake',
                tip: 'lib/amd_modules/tip',
                rest: 'lib/amd_modules/rest',
                apis: 'lib/amd_modules/apis',
                music: 'lib/amd_modules/music',
                loading: 'lib/amd_modules/loading',
                check: 'lib/amd_modules/check',

                wx: 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
                wxShare: 'lib/amd_modules/wxShare'

            },
            shim: {
                'swipe': {
                    deps: ['jquery']
                },
                'easel': {
                    exports: 'createjs'
                },
                'tween': {
                    deps: ['easel'],
                    exports: 'Tween'
                }
            },
            waitSeconds: 0,
            urlArgs: "bust=" + (new Date()).getTime()
        }
    );

    define(['jquery', 'wxShare', 'apis', 'loading', 'check'], function ($, wxShare, apis, loading, check) {

        //横竖屏检测
        check.autoFullscreen();

        // 初始化微信分享
        wxShare.weixinShare(function () {
            // 统计分享
            //console.log('wxConfig');
            apis.recordShareTimes();
        });

        loading.init(function () {
            var w = window.innerWidth;
            var h = window.innerHeight;

            //var orientation = window.orientation;
            //console.log(orientation);

            var $isHorizontal = $('.isHorizontal');

            $isHorizontal.show();

            var plusValue = 128;

            var $logo = $('#logo');
            var $logo2 = $('#logo2');
            var $logo3 = $('#logo3');
            var $help = $('#help');
            var $start = $('#start');

            var $dialog = $('#dialog');
            var $tomato = $('#tomato');
            var $egg = $('#egg');
            var $grass = $('#grass');
            var $home = $('#home');

            var $chooseDialog = $('#chooseDialog');
            var $banner = $('#banner');
            var $playerTomato = $('#playerTomato');
            var $playerEgg = $('#playerEgg');

            if (w < h) {
                h = window.innerWidth;
                w = window.innerHeight;

                $isHorizontal.css({
                    '-webkit-transform': 'rotate(90deg)',
                    '-ms-transform': 'rotate(90deg)',
                    'transform': 'rotate(90deg)'
                });

                $logo.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $logo2.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $logo3.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $help.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $start.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });

                $dialog.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $tomato.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $egg.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $grass.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $home.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });

                $chooseDialog.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $banner.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $playerTomato.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
                $playerEgg.css({
                    'top': function (index, value) {
                        return parseFloat(value) + plusValue;
                    }
                });
            }

            $(window).resize(function () {

                if (w < h) {
                    h = window.innerWidth;
                    w = window.innerHeight;

                    $isHorizontal.css({
                        '-webkit-transform': 'rotate(90deg)',
                        '-ms-transform': 'rotate(90deg)',
                        'transform': 'rotate(90deg)'
                    });

                    $logo.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $logo2.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $logo3.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $help.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $start.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });

                    $dialog.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $tomato.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $egg.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $grass.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $home.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });

                    $chooseDialog.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $banner.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $playerTomato.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                    $playerEgg.css({
                        'top': function (index, value) {
                            return parseFloat(value) + plusValue;
                        }
                    });
                }

            });

            var $audio = $('#click'),
                audio = $audio[0];
            var $op = $('#op'),
                op = $op[0];

            //默认进来时是index
            var $indexBg = $('.indexBg');
            var $helpBg = $('.helpBg');
            var $chooseBg = $('.chooseBg');

            var $maskContainer = $('#maskContainer');

            var $stars = $('#stars');
            var $mask = $('#mask');
            var $dialogIndex = $('#dialogIndex');

            var $close = $('#close');
            var $link = $('#link');

            $close.on('click',function () {
                $maskContainer.hide();
            });

            $link.on('click',function () {
                window.location.href = apis.getMallEntry();
            });

            $stars.css({
                'width': w + 'px',
                'height': h + 'px'
            });


            $mask.css({
                'width': w + 'px',
                'height': h + 'px'
            });

            $indexBg.css({
                'width': w + 'px',
                'height': h + 'px'
            });

            $helpBg.css({
                'width': w + 'px',
                'height': h + 'px'
            });

            $chooseBg.css({
                'width': w + 'px',
                'height': h + 'px'
            });

            $indexBg.show();
            $helpBg.hide();
            $chooseBg.hide();

            //index：2个跳转
            // var $help = $('#help');
            // var $start = $('#start');

            $help.on('click', function () {
                audio.play();

                setTimeout(function () {
                    $indexBg.hide();
                    $helpBg.show();
                    $chooseBg.hide();
                }, 1000);

            });

            $start.on('click', function () {
                audio.play();

                setTimeout(function () {
                    $indexBg.hide();
                    $helpBg.hide();
                    $chooseBg.show();
                }, 1000);


            });

            $home.on('click', function () {
                audio.play();

                setTimeout(function () {
                    $indexBg.show();
                    $helpBg.hide();
                    $chooseBg.hide();
                }, 1000);


            });

            //choose：2个跳转
            // var $playerTomato = $('#playerTomato');
            // var $playerEgg = $('#playerEgg');

            function playerCommon(player) {
                audio.play();
                op.pause();

                setTimeout(function () {
                    window.location.href = 'game.html?player=' + player;
                },1000);

                $indexBg.hide();
                $helpBg.hide();
                $chooseBg.hide();
            }

            $playerTomato.on('click', function () {
                playerCommon('tomato');
            });

            $playerEgg.on('click', function(){
                playerCommon('egg');
            });
        });

    });
})();
