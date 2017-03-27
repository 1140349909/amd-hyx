(function () {

    window.__uri = function (uri) {
        return uri;
    };

    var ENV = '@ENV@';

    requirejs.config(
        {
            baseUrl: "resources",
            paths: {
                jquery: '//cdn.bootcss.com/jquery/2.2.3/jquery.min',
                swipe: '//cdn.bootcss.com/jquery.touchswipe/1.6.16/jquery.touchSwipe.min',
                progressbar: '//cdn.bootcss.com/progressbar.js/1.0.1/progressbar.min',

                easel: '//code.createjs.com/easeljs-0.8.2.min',
                tween: '//code.createjs.com/tweenjs-0.6.2.min',
                preload: '//code.createjs.com/preloadjs-0.6.2.min',
                sound: '//code.createjs.com/soundjs-0.6.2.min',
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
                },
                'sound': {
                    deps: ['easel'],
                    exports: 'Sound'
                }
            },
            waitSeconds: 0,
            urlArgs: "bust=" + (new Date()).getTime()
        }
    );

    define(['jquery', 'wxShare', 'easel', 'tween', 'sound', 'preload', 'check', 'progressbar', 'apis'],
        function ($, wxShare, cjs, Tween, Sound, preload, check, progressbar, apis) {



            //横竖屏检测
            check.autoFullscreen();

            // 初始化微信分享，本机调试时关闭
            wxShare.weixinShare(function () {
                // 统计分享
                //console.log('wxConfig');
                apis.recordShareTimes();
            });

            var canvas,
                stage,
                staticCtr,
                dynamicCtr,
                readyCtr,
                w = window.innerWidth,
                h = window.innerHeight,
                scaleX,
                scaleY,
                result;

            var $isHorizontal = $('.isHorizontal');
            var $loadingBg = $('.loadingBg');

            if (w < h) {

                $isHorizontal.css({
                    '-webkit-transform': 'rotate(90deg)',
                    '-ms-transform': 'rotate(90deg)',
                    'transform': 'rotate(90deg)'
                });
            }

            $(window).resize(function () {

                if (w < h) {

                    $isHorizontal.css({

                        '-webkit-transform': 'rotate(90deg)',
                        '-ms-transform': 'rotate(90deg)',
                        'transform': 'rotate(90deg)'
                    });

                }

            });

            $loadingBg.css({
                'width': w > h ? w + 'px' : h + 'px',
                'height': w > h ? h + 'px' : w + 'px'
            });

            $isHorizontal.show();

            function resolveResources(list) {
                //for (var i = 0; i < list.length; i++) {
                //    if (ENV == 'prd') {
                //        list[i].src = 'http://cdn.vveshow.com/cloud/interact/hyx1927/battle/' + list[i].src;
                //    }
                //}
                return list;
            }

            //alert(w + ',' + h);

            //素材列表：静态图和动态图分离！
            function getImgResources() {

                //初期素材可以复用，只需更改相应坐标
                var dynamicList = [
                    {
                        src: ('resources/images/game/dynamicList/tomato.png'),
                        id: 'tomato'
                    }, {
                        src: ('resources/images/game/dynamicList/tomatoShadow.png'),
                        id: 'tomatoShadow'
                    }, {
                        src: ('resources/images/game/dynamicList/tomatoDamaged.png'),
                        id: 'tomatoDamaged'
                    }, {
                        src: ('resources/images/game/dynamicList/tomatoWin.gif'),
                        id: 'tomatoWin'
                    }, {
                        src: ('resources/images/game/dynamicList/tomatoLose.gif'),
                        id: 'tomatoLose'
                    }, {
                        src: ('resources/images/game/dynamicList/tomatoResultWin.png'),
                        id: 'tomatoResultWin'
                    }, {
                        src: ('resources/images/game/dynamicList/tomatoResultLose.png'),
                        id: 'tomatoResultLose'
                    }, {
                        src: ('resources/images/game/dynamicList/tomatoAngry.png'),
                        id: 'tomatoAngry'
                    }, {
                        src: ('resources/images/game/dynamicList/tomatoEnd.png'),
                        id: 'tomatoEnd'
                    }, {
                        src: ('resources/images/game/dynamicList/coopShadow.png'),
                        id: 'coopShadow'
                    }, {
                        src: ('resources/images/game/dynamicList/coop.png'),
                        id: 'coop'
                    }, {
                        src: ('resources/images/game/dynamicList/egg.png'),
                        id: 'egg'
                    }, {
                        src: ('resources/images/game/dynamicList/eggOverlay.png'),
                        id: 'eggOverlay'
                    }, {
                        src: ('resources/images/game/dynamicList/eggDamaged.png'),
                        id: 'eggDamaged'
                    }, {
                        src: ('resources/images/game/dynamicList/eggWin.gif'),
                        id: 'eggWin'
                    }, {
                        src: ('resources/images/game/dynamicList/eggLose.gif'),
                        id: 'eggLose'
                    }, {
                        src: ('resources/images/game/dynamicList/eggResultWin.png'),
                        id: 'eggResultWin'
                    }, {
                        src: ('resources/images/game/dynamicList/eggResultLose.png'),
                        id: 'eggResultLose'
                    }, {
                        src: ('resources/images/game/dynamicList/eggAngry.png'),
                        id: 'eggAngry'
                    }, {
                        src: ('resources/images/game/dynamicList/eggEnd.png'),
                        id: 'eggEnd'
                    }, /*{
                     src: ('resources/images/game/dynamicList/dialog1.png'),
                     id: 'dialog1'
                     }, {
                     src: ('resources/images/game/dynamicList/dialog2.png'),
                     id: 'dialog2'
                     }, {
                     src: ('resources/images/game/dynamicList/dialog3.png'),
                     id: 'dialog3'
                     }, {
                     src: ('resources/images/game/dynamicList/dialog4.png'),
                     id: 'dialog4'
                     }*/
                    //番茄
                    {
                        src: ('resources/images/game/dynamicList/dialogTA1.png'),
                        id: 'dialogTA1'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogTA2.png'),
                        id: 'dialogTA2'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogTA3.png'),
                        id: 'dialogTA3'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogTN1.png'),
                        id: 'dialogTN1'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogTN2.png'),
                        id: 'dialogTN2'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogTN3.png'),
                        id: 'dialogTN3'
                    },
                    //鸡蛋
                    {
                        src: ('resources/images/game/dynamicList/dialogEA1.png'),
                        id: 'dialogEA1'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogEA2.png'),
                        id: 'dialogEA2'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogEA3.png'),
                        id: 'dialogEA3'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogEN1.png'),
                        id: 'dialogEN1'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogEN2.png'),
                        id: 'dialogEN2'
                    }, {
                        src: ('resources/images/game/dynamicList/dialogEN3.png'),
                        id: 'dialogEN3'
                    },
                    //动态分值
                    {
                        src: ('resources/images/game/dynamicList/plus01.png'),
                        id: 'plus01'
                    }, {
                        src: ('resources/images/game/dynamicList/plus02.png'),
                        id: 'plus02'
                    }, {
                        src: ('resources/images/game/dynamicList/plus03.png'),
                        id: 'plus03'
                    }, {
                        src: ('resources/images/game/dynamicList/plus04.png'),
                        id: 'plus04'
                    }, {
                        src: ('resources/images/game/dynamicList/plus05.png'),
                        id: 'plus05'
                    }, {
                        src: ('resources/images/game/dynamicList/plus06.png'),
                        id: 'plus06'
                    }, {
                        src: ('resources/images/game/dynamicList/plus07.png'),
                        id: 'plus07'
                    }, {
                        src: ('resources/images/game/dynamicList/plus08.png'),
                        id: 'plus08'
                    }, {
                        src: ('resources/images/game/dynamicList/plus09.png'),
                        id: 'plus09'
                    }, {
                        src: ('resources/images/game/dynamicList/plus10.png'),
                        id: 'plus10'
                    }

                ];
                //坐标无关的静态素材
                var staticList = [
                    {
                        src: ('resources/images/game/staticList/banner.png'),
                        id: 'banner'
                    }, {
                        src: ('resources/images/game/staticList/bg.png'),
                        id: 'bg'
                    }, /*{
                     src: ('resources/images/game/staticList/menu.png'),
                     id: 'menu'
                     }, {
                     src: ('resources/images/game/staticList/stones.png'),
                     id: 'stones'
                     }, {
                     src: ('resources/images/game/staticList/sheep1.png'),
                     id: 'sheep1'
                     }, {
                     src: ('resources/images/game/staticList/sheep2.png'),
                     id: 'sheep2'
                     }, */{
                        src: ('resources/images/game/staticList/ready.png'),
                        id: 'ready'
                    }, {
                        src: ('resources/images/game/staticList/start.png'),
                        id: 'start'
                    }


                ];
                //玩家选择番茄时所需的素材，木桶番茄和母鸡窝不可复用
                var playerTomatoList = [
                    {
                        src: ('resources/images/game/playerTomatoList/tomatoRightAttack.png'),
                        id: 'tomatoAttack'
                    }, {
                        src: ('resources/images/game/playerTomatoList/tomatoRightHand.png'),
                        id: 'tomatoHand'
                    }, {
                        src: ('resources/images/game/playerTomatoList/tomatoRightWeapon.png'),
                        id: 'tomatoWeapon'
                    }, {
                        src: ('resources/images/game/playerTomatoList/tomatoRightCask.png'),
                        id: 'tomatoCask'
                    }, {
                        src: ('resources/images/game/playerTomatoList/tomatoRightCaskShadow.png'),
                        id: 'tomatoCaskShadow'
                    }, {
                        src: ('resources/images/game/playerTomatoList/eggLeftAttack.png'),
                        id: 'eggAttack'
                    }, {
                        src: ('resources/images/game/playerTomatoList/eggLeftHand.png'),
                        id: 'eggHand'
                    }, {
                        src: ('resources/images/game/playerTomatoList/eggLeftWeapon.png'),
                        id: 'eggWeapon'
                    }, {
                        src: ('resources/images/game/playerTomatoList/eggLeftHenShadow.png'),
                        id: 'eggHenShadow'
                    }, {
                        src: ('resources/images/game/playerTomatoList/eggLeftHen.png'),
                        id: 'eggHen'
                    }
                ];
                //玩家选择鸡蛋时所需的素材，木桶番茄和母鸡窝不可复用
                var playerEggList = [
                    {
                        src: ('resources/images/game/playerEggList/eggRightAttack.png'),
                        id: 'eggAttack'
                    }, {
                        src: ('resources/images/game/playerEggList/eggRightHand.png'),
                        id: 'eggHand'
                    }, {
                        src: ('resources/images/game/playerEggList/eggRightWeapon.png'),
                        id: 'eggWeapon'
                    }, {
                        src: ('resources/images/game/playerEggList/eggRightHenShadow.png'),
                        id: 'eggHenShadow'
                    }, {
                        src: ('resources/images/game/playerEggList/eggRightHen.png'),
                        id: 'eggHen'
                    }, {
                        src: ('resources/images/game/playerEggList/tomatoLeftCask.png'),
                        id: 'tomatoCask'
                    }, {
                        src: ('resources/images/game/playerEggList/tomatoLeftCaskShadow.png'),
                        id: 'tomatoCaskShadow'
                    }, {
                        src: ('resources/images/game/playerEggList/tomatoLeftAttack.png'),
                        id: 'tomatoAttack'
                    }, {
                        src: ('resources/images/game/playerEggList/tomatoLeftHand.png'),
                        id: 'tomatoHand'
                    }, {
                        src: ('resources/images/game/playerEggList/tomatoLeftWeapon.png'),
                        id: 'tomatoWeapon'
                    }

                ];
                //结果页所需素材
                var resultList = [
                    {
                        src: ('resources/images/game/result/getAward.png'),
                        id: 'getAward'
                    }, {
                        src: ('resources/images/game/result/getAwardDisabled.png'),
                        id: 'getAwardDisabled'
                    }, {
                        src: ('resources/images/game/result/retry.png'),
                        id: 'retry'
                    }, {
                        src: ('resources/images/game/result/viewScore.png'),
                        id: 'viewScore'
                    }, {
                        src: ('resources/images/game/result/viewScoreDisabled.png'),
                        id: 'viewScoreDisabled'
                    }, {
                        src: ('resources/images/game/result/tomatoAndEgg.png'),
                        id: 'tomatoAndEgg'
                    }, {
                        src: ('resources/images/game/result/tomatoLoseLogo.png'),
                        id: 'tomatoLoseLogo'
                    }, {
                        src: ('resources/images/game/result/eggLoseLogo.png'),
                        id: 'eggLoseLogo'
                    }, {
                        src: ('resources/images/game/result/playerWinBg.png'),
                        id: 'playerWinBg'
                    }, {
                        src: ('resources/images/game/result/playerLoseBg.png'),
                        id: 'playerLoseBg'
                    }, {
                        src: ('resources/images/game/result/showWinText.png'),
                        id: 'showWinText'
                    }, {
                        src: ('resources/images/game/result/showLoseText.png'),
                        id: 'showLoseText'
                    }, {
                        src: ('resources/images/game/result/confirm.png'),
                        id: 'confirm'
                    }, {
                        src: ('resources/images/game/result/return.png'),
                        id: 'return'
                    }, {
                        src: ('resources/images/game/result/form.png'),
                        id: 'form'
                    }, {
                        src: ('resources/images/game/result/score.png'),
                        id: 'score'
                    }, {
                        src: ('resources/images/game/result/continue.png'),
                        id: 'continue'
                    }, /* {
                     src: ('resources/images/game/result/qrCode.png'),
                     id: 'qrCode'
                     },*/ {
                        src: ('resources/images/game/result/text.png'),
                        id: 'text'
                    }, {
                        src: ('resources/images/game/result/tip.png'),
                        id: 'tip'
                    }, {
                        src: ('resources/images/game/result/showWinText2.png'),
                        id: 'showWinText2'
                    }
                ];


                return {
                    dynamicList: resolveResources(dynamicList),
                    staticList: resolveResources(staticList),
                    playerTomatoList: resolveResources(playerTomatoList),
                    playerEggList: resolveResources(playerEggList),
                    resultList: resolveResources(resultList)
                }
            }

            //音频列表：
            function getAudioResources() {

                var musicList = [
                    {
                        src: 'resources/audio/music.mp3',
                        id: 'sound'
                    }, {
                        src: 'resources/audio/click.mp3',
                        id: 'click'
                    }, {
                        src: 'resources/audio/throw.mp3',
                        id: 'throw'
                    }, {
                        src: 'resources/audio/se.mp3',
                        id: 'se'
                    }, {
                        src: 'resources/audio/wind.mp3',
                        id: 'wind'
                    }, {
                        src: 'resources/audio/laugh.mp3',
                        id: 'laugh'
                    }, {
                        src: 'resources/audio/angry.mp3',
                        id: 'angry'
                    }
                ];

                return {
                    musicList: resolveResources(musicList)
                }
            }

            var manifest = [];

            var player, computer,
                imgResourcesList, audioResourcesList,
                imgPlayer, imgPlayerAttr,
                imgComputer, imgComputerAttr,
                imgTomatoAttr, imgEggAttr;

            //素材缩放处理函数
            function staticImage(loader, id, x, y, userScaleX, userScaleY) {

                var imageId = loader.getResult(id);
                var image = new cjs.Bitmap(imageId);
                var width = image.getBounds().width;
                var height = image.getBounds().height;

                /*if(userScaleX){
                 alert(userScaleX+','+scaleX);
                 alert(userScaleY+','+scaleY);
                 }*/

                image.scaleX = userScaleX ? userScaleX * scaleX : scaleX;
                image.scaleY = userScaleY ? userScaleY * scaleY : scaleY;
                image.x = (x) * scaleX;
                image.y = (y) * scaleY;
                //console.log(id, image.scaleX, image.scaleY);
                return image;
            }

            //形状缩放处理函数
            function staticShape(data, x, y, userScaleX, userScaleY) {

                var tmpGraphics = new cjs.Graphics();

                tmpGraphics.beginFill(data.color)
                    .drawRoundRectComplex(0, 0, data.w, data.h, data.radiusTL, data.radiusTR, data.radiusBR, data.radiusBL)
                    .endFill();

                var shape = new cjs.Shape(tmpGraphics);

                shape.scaleX = userScaleX ? userScaleX : scaleX;
                shape.scaleY = userScaleY ? userScaleY : scaleY;
                shape.x = (x) * scaleX;
                shape.y = (y) * scaleY;
                //console.log(id, image.scaleX, image.scaleY);
                return shape;
            }

            //描边处理函数
            function staticShapeStroke(data, x, y, userScaleX, userScaleY) {

                var tmpGraphics = new cjs.Graphics();

                tmpGraphics
                    .beginStroke(data.strokeColor).setStrokeStyle(data.strokeStyle)
                    .beginFill(data.color).drawRect(0, 0, data.w, data.h)
                    .endFill();

                var shape = new cjs.Shape(tmpGraphics);

                shape.scaleX = userScaleX ? userScaleX : scaleX;
                shape.scaleY = userScaleY ? userScaleY : scaleY;
                shape.x = (x) * scaleX;
                shape.y = (y) * scaleY;
                //console.log(id, image.scaleX, image.scaleY);
                return shape;
            }

            //指示物处理函数
            function staticShapePolyStar(data, x, y, userScaleX, userScaleY) {

                var tmpGraphics = new cjs.Graphics();

                tmpGraphics
                    .beginStroke(data.strokeColor).setStrokeStyle(data.strokeStyle)
                    .beginFill(data.color).drawPolyStar(data.x, data.y, data.radius, data.sides, data.pointSize, data.angle)
                    .endFill();

                var shape = new cjs.Shape(tmpGraphics);

                shape.scaleX = userScaleX ? userScaleX : scaleX;
                shape.scaleY = userScaleY ? userScaleY : scaleY;
                shape.x = (x) * scaleX;
                shape.y = (y) * scaleY;
                //console.log(id, image.scaleX, image.scaleY);
                return shape;
            }

            //初始化入口
            function init() {

                try {
                    //alert(1)
                    imgResourcesList = getImgResources();
                    /*audioResourcesList = {
                     musicList:[]
                     };*/
                    audioResourcesList = getAudioResources();

                    canvas = document.getElementById('game');
                    canvas.width = w;
                    canvas.height = h;

                    result = $('#result');
                    result.css({
                        'width': w + 'px',
                        'height': h + 'px'
                    });
                    //alert(2)
                    //安装运动插件
                    cjs.MotionGuidePlugin.install();

                    stage = new cjs.Stage(canvas);

                    //开启触摸事件
                    cjs.Touch.enable(stage);

                    // 在这里就得进行角色判断！
                    player = getParam('player');
                    //console.log(player);

                    var tomatoLifeColor = '#e50012',
                        eggLifeColor = '#f9be00';
                    //alert(3)
                    switch (player) {
                        default:
                            alert('未定义角色，请回到首页重新选择！');
                            window.location.href = 'index.html';
                            break;
                        case 'tomato': //我选择番茄，则番茄在右，鸡蛋在左
                            //
                            computer = 'egg';

                            manifest = manifest.concat(imgResourcesList.playerTomatoList);

                            imgPlayerAttr = {
                                color: tomatoLifeColor,

                                character: {
                                    x: 1115,
                                    y: 463
                                },
                                characterShadow: {
                                    x: 1115,
                                    y: 578
                                },
                                coop: {
                                    x: undefined,
                                    y: undefined
                                },
                                coopShadow: {
                                    x: undefined,
                                    y: undefined
                                },
                                weapon: {
                                    x: 1257,
                                    y: 403
                                },
                                weaponShadow: {
                                    x: 1246,
                                    y: 513
                                },

                                Weapon: {
                                    x: 1115 + 95,
                                    y: 463 - 15
                                },
                                Hand: {
                                    x: 1115 + 80,
                                    y: 463
                                }

                            };

                            imgComputerAttr = {
                                color: eggLifeColor,

                                character: {
                                    x: 85,
                                    y: 446
                                },
                                characterShadow: {
                                    x: 91,
                                    y: 545
                                },
                                coop: {
                                    x: 61,
                                    y: 526
                                },
                                coopShadow: {
                                    x: 75,
                                    y: 582
                                },
                                weapon: {
                                    x: 156,
                                    y: 423
                                },
                                weaponShadow: {
                                    x: 133,
                                    y: 519
                                },
                                Weapon: {
                                    x: 85 + 45,
                                    y: 446 - 30
                                },
                                Hand: {
                                    x: 85 + 25,
                                    y: 446 - 20
                                }
                            };

                            imgTomatoAttr = imgPlayerAttr;
                            imgEggAttr = imgComputerAttr;
                            break;
                        case 'egg': //我选择鸡蛋，则鸡蛋在右，番茄在左，等待定义
                            computer = 'tomato';

                            manifest = manifest.concat(imgResourcesList.playerEggList);

                            imgPlayerAttr = {
                                color: eggLifeColor,

                                character: {
                                    x: 1133,
                                    y: 446
                                },
                                characterShadow: {
                                    x: 1139,
                                    y: 545
                                },
                                coop: {
                                    x: 1109,
                                    y: 526
                                },
                                coopShadow: {
                                    x: 1123,
                                    y: 582
                                },
                                weapon: {
                                    x: 1257,
                                    y: 409
                                },
                                weaponShadow: {
                                    x: 1265,
                                    y: 505
                                },
                                Weapon: {
                                    x: 1133 + 70,
                                    y: 446 - 45
                                },
                                Hand: {
                                    x: 1133 + 55,
                                    y: 446 - 30
                                }
                            };

                            imgComputerAttr = {
                                color: tomatoLifeColor,

                                character: {
                                    x: 124,
                                    y: 463
                                },
                                characterShadow: {
                                    x: 134,
                                    y: 578
                                },
                                coop: {
                                    x: undefined,
                                    y: undefined
                                },
                                coopShadow: {
                                    x: undefined,
                                    y: undefined
                                },
                                weapon: {
                                    x: 104,
                                    y: 422
                                },
                                weaponShadow: {
                                    x: 93,
                                    y: 532
                                },
                                Weapon: {
                                    x: 124 + 35,
                                    y: 463 - 10
                                },
                                Hand: {
                                    x: 124 + 30,
                                    y: 463
                                }
                            };

                            imgTomatoAttr = imgComputerAttr;
                            imgEggAttr = imgPlayerAttr;
                            break;
                    }
                    //alert(4)
                    manifest = manifest.concat(
                        audioResourcesList.musicList,
                        imgResourcesList.dynamicList,
                        imgResourcesList.staticList,
                        imgResourcesList.resultList);

                    //alert(5)
                    // preloadJS：预加载素材
                    preloadRes(manifest);

                    //alert(6)
                } catch (ex) {
                    alert(ex.message);
                }
            }

            //preloadJS：预加载素材
            function preloadRes(manifest) {

                var $percentBox = $('.loading-percent'),
                    $percentTxt = $('.loading-percent-txt');
                //contentWp = $('#index-content'),
                //contentHtml = contentWp.html();


                // 1. 实例化 LoadQueue 对象：实例化时传入一个参数，标识以使用什么加载器加载资源。true 为使用 XHRLoader，false 将使用 TagLoader。

                var loader = new cjs.LoadQueue(false);
                // var loader = new cjs.LoadQueue(true,null,true);
                //安装插件
                loader.installPlugin(cjs.Sound);

                loader.loadTimeout = 30000;
                //cjs.Sound.alternateExtensions = ["mp3"];

                //不开启异步，很容易出错
                //loader.setMaxConnections(10);
                //loader.maintainScriptOrder = true;

                loader.on('loadstart', loadstart);
                loader.on('process', process);
                loader.on('error', error);
                loader.on('complete', complete);

                loader.on('fileload', fileload);
                loader.on('fileerror', fileerror);
                loader.on('fileprogress', fileprogress);
                loader.on('filestart', filestart);

                var line = new progressbar.Line('.loading-process-bar', {
                    color: 'green',
                    strokeWidth: 28 * 100 / 522,
                    fill: 'rgba(0, 0, 0, 0.5)',
                    text: {
                        value: '0%',
                        style: {
                            // Text color.
                            // Default: same as stroke color (options.color)
                            'font-size': '28px',
                            color: '#690f10',
                            position: 'absolute',
                            right: '15px',
                            top: '-2px',
                            padding: 0,
                            margin: 0,
                            'z-index': 1
                        }
                    }
                });

                //加载素材
                loader.loadManifest(manifest);

                function loadstart() {
                    //alert('素材载入中，请稍候');
                    //console.log('loadstart');
                }

                function process() {

                }

                function complete() {

                    line.animate(loader.progress, {
                        duration: 0
                    }, function () {

                        $isHorizontal.hide();

                        main(loader);

                        /*$percentBox.fadeOut(500, function () {
                         //$percentBox.hide();
                         //素材加载完毕后回调主函数
                         console.log('complete');
                         //主函数
                         main(loader);
                         });*/
                    });


                }

                function error() {
                    alert("网络连接中断，请在网络连接恢复后刷新重试");
                    //return;
                    //console.log('error');
                    //window.location.reload();
                }

                function fileload() {
                    //console.log('fileload');

                    //parseInt(loader.progress * 100, 10) + '%'

                    line.animate(loader.progress);

                    line.setText((parseInt(loader.progress * 100, 10) + '%'));

                    $percentTxt.text(parseInt(loader.progress * 100, 10) + '%');

                    //console.log("Progress:", (parseInt(loader.progress * 100, 10) + '%');
                }

                function fileerror() {
                    //console.log('fileerror');
                }

                function fileprogress() {
                    //console.log("fileprogress");
                }

                function filestart() {
                    //console.log('filestart');

                }

            }

            function main(loader) {

                //声音测试：导入id就可以播放了
                var ppc = cjs.Sound.setDefaultPlayProps("sound", {
                    interrupt: cjs.Sound.INTERRUPT_ANY,
                    loop: -1,
                    volume: 0.5
                });
                //var instance = cjs.Sound.play('sound');
                //声音测试：结束

                /*背景*/
                var bgId = loader.getResult('bg');
                var bg = new cjs.Bitmap(bgId);

                //缩放
                if (w > h) {
                    bg.scaleX = w / bg.getBounds().width;
                    bg.scaleY = h / bg.getBounds().height;
                } else {
                    bg.scaleX = h / bg.getBounds().width;
                    bg.scaleY = w / bg.getBounds().height;

                    //bg.regX = w/2*bg.scaleX;
                    //bg.regY = h/2*bg.scaleY;
                    stage.rotation += 90;
                    stage.x = w;
                    stage.y = 0;
                }

                //console.log(bg);

                //console.log(bg);
                scaleX = bg.scaleX;
                scaleY = bg.scaleY;
                stage.addChild(bg);

                //容器：挂载静态素材
                staticCtr = new cjs.Container();
                //容器：挂载动态素材
                dynamicCtr = new cjs.Container();
                //容器：挂载动态素材
                readyCtr = new cjs.Container();

                /*静态资源*/

                // 血量槽
                var imgBanner = staticImage(loader, 'banner', 118, 27);
                // 风向条颜色
                var windColor = '#42af35';
                //动态改变的量有：血槽颜色，番茄鸡蛋图片对象，番茄木桶和母鸡窝
                var minusLife = (518 * scaleX / 10);

                // 右侧血条：玩家
                var imgPlayerLifeBanner = staticShape({
                    color: imgPlayerAttr.color,
                    w: 518,
                    h: 16,
                    radiusTL: 0,
                    radiusTR: 10,
                    radiusBR: 10,
                    radiusBL: 0
                }, 694, 33);

                // 左侧血条：电脑
                var imgComputerLifeBanner = staticShape({
                    color: imgComputerAttr.color,
                    w: 518,
                    h: 16,
                    /*radiusTL: 10,
                     radiusTR: 0,
                     radiusBR: 0,
                     radiusBL: 10*/
                    radiusTL: 0,
                    radiusTR: 10,
                    radiusBR: 10,
                    radiusBL: 0
                }, 122, 33);

                //旋转设置
                imgComputerLifeBanner.rotation += 180;
                imgComputerLifeBanner.regX = 518;
                imgComputerLifeBanner.regY = 16;

                //风向示意标志
                //五段式：
                var windTest = {
                    '-2': 582,
                    '-1': 616,
                    '0': 650,
                    '1': 684,
                    '2': 718
                };

                var imgWindSign = staticShape({
                    color: windColor,
                    w: 170 / 5,
                    h: 17,
                    radiusTL: 0,
                    radiusTR: 0,
                    radiusBR: 5,
                    radiusBL: 5
                }, windTest['0'], 75);


                //菜单
                //var imgMenu = staticImage(loader, 'menu', 377, 330);
                //石头
                //var imgStones = staticImage(loader, 'stones', 1207, 543);
                //羊1
                //var imgSheep1 = staticImage(loader, 'sheep1', 918, 346);
                //羊2
                //var imgSheep2 = staticImage(loader, 'sheep2', 1016, 346);
                /*静态资源：完*/

                /*动态资源*/
                var tomatoAttackValue = 0.32,
                    tomatoStatusValue = 0.63;

                //番茄
                var imgTomato = staticImage(loader, 'tomato', imgTomatoAttr.character.x, imgTomatoAttr.character.y);
                //残血番茄
                var imgTomatoDamaged = staticImage(loader, 'tomatoDamaged', imgTomatoAttr.character.x, imgTomatoAttr.character.y);

                //番茄阴影
                var imgTomatoShadow = staticImage(loader, 'tomatoShadow', imgTomatoAttr.characterShadow.x, imgTomatoAttr.characterShadow.y);
                //木桶番茄
                var imgTomatoCask = staticImage(loader, 'tomatoCask', imgTomatoAttr.weapon.x, imgTomatoAttr.weapon.y);
                //木桶番茄阴影
                var imgTomatoCaskShadow = staticImage(loader, 'tomatoCaskShadow', imgTomatoAttr.weaponShadow.x, imgTomatoAttr.weaponShadow.y);

                //进攻番茄
                var imgTomatoWeapon = staticImage(loader, 'tomatoWeapon', imgTomatoAttr.Weapon.x, imgTomatoAttr.Weapon.y, tomatoAttackValue, tomatoAttackValue);
                var imgTomatoHand = staticImage(loader, 'tomatoHand', imgTomatoAttr.Hand.x, imgTomatoAttr.Hand.y, tomatoAttackValue, tomatoAttackValue);
                var imgTomatoAttack = staticImage(loader, 'tomatoAttack', imgTomatoAttr.character.x, imgTomatoAttr.character.y, tomatoAttackValue, tomatoAttackValue);
                //砸在地上的番茄
                var imgTomatoEnd = staticImage(loader, 'tomatoEnd', w / 2, imgTomatoAttr.characterShadow.y);

                //番茄赢
                var imgTomatoWin = staticImage(loader, 'tomatoWin', imgTomatoAttr.character.x, imgTomatoAttr.character.y, tomatoStatusValue, tomatoStatusValue);
                //番茄输
                var imgTomatoLose = staticImage(loader, 'tomatoLose', imgTomatoAttr.character.x, imgTomatoAttr.character.y, tomatoStatusValue, tomatoStatusValue);
                //愤怒的番茄
                var imgTomatoAngry = staticImage(loader, 'tomatoAngry', imgTomatoAttr.character.x, imgTomatoAttr.character.y, tomatoAttackValue, tomatoAttackValue);

                //0.31,0.38
                var eggAttackValue = 0.32,
                    eggStatusValue = 0.63;

                //鸡窝阴影
                var imgCoopShadow1 = staticImage(loader, 'coopShadow', imgEggAttr.coopShadow.x, imgEggAttr.coopShadow.y);
                //鸡窝
                var imgCoop = staticImage(loader, 'coop', imgEggAttr.coop.x, imgEggAttr.coop.y);
                //鸡蛋
                var imgEgg = staticImage(loader, 'egg', imgEggAttr.character.x, imgEggAttr.character.y);
                //残血鸡蛋
                var imgEggDamaged = staticImage(loader, 'eggDamaged', imgEggAttr.character.x, imgEggAttr.character.y);
                //鸡蛋覆盖层
                var imgEggOverlay = staticImage(loader, 'eggOverlay', imgEggAttr.characterShadow.x, imgEggAttr.characterShadow.y);

                //鸡窝阴影2
                var imgCoopShadow2 = staticImage(loader, 'eggHenShadow', imgEggAttr.weaponShadow.x, imgEggAttr.weaponShadow.y);
                //母鸡
                var imgHen = staticImage(loader, 'eggHen', imgEggAttr.weapon.x, imgEggAttr.weapon.y);

                //进攻鸡蛋
                var imgEggWeapon = staticImage(loader, 'eggWeapon', imgEggAttr.Weapon.x, imgEggAttr.Weapon.y, eggAttackValue, eggAttackValue);
                var imgEggHand = staticImage(loader, 'eggHand', imgEggAttr.Hand.x, imgEggAttr.Hand.y, eggAttackValue, eggAttackValue);
                var imgEggAttack = staticImage(loader, 'eggAttack', imgEggAttr.character.x, imgEggAttr.character.y, eggAttackValue, eggAttackValue);
                //砸在地上的鸡蛋
                var imgEggEnd = staticImage(loader, 'eggEnd', w / 2, imgEggAttr.coopShadow.y);

                //鸡蛋赢
                var imgEggWin = staticImage(loader, 'eggWin', imgEggAttr.character.x, imgEggAttr.character.y, eggStatusValue, eggStatusValue);
                //鸡蛋输
                var imgEggLose = staticImage(loader, 'eggLose', imgEggAttr.character.x, imgEggAttr.character.y, eggStatusValue, eggStatusValue);
                //愤怒的鸡蛋
                var imgEggAngry = staticImage(loader, 'eggAngry', imgEggAttr.character.x, imgEggAttr.character.y, eggAttackValue, eggAttackValue);

                // 对话框系列
                /*var imgComputerDialog1 = staticImage(loader, 'dialog1', 206, 350);
                 var imgComputerDialog2 = staticImage(loader, 'dialog2', 214, 352);
                 var imgComputerDialog3 = staticImage(loader, 'dialog3', 214, 330);
                 var imgComputerDialog4 = staticImage(loader, 'dialog4', 207, 342);*/

                var imgComputerDialogEA1 = staticImage(loader, 'dialogEA1', 206, 350);
                var imgComputerDialogEA2 = staticImage(loader, 'dialogEA2', 206, 350);
                var imgComputerDialogEA3 = staticImage(loader, 'dialogEA3', 206, 350);
                var imgComputerDialogEN1 = staticImage(loader, 'dialogEN1', 206, 350);
                var imgComputerDialogEN2 = staticImage(loader, 'dialogEN2', 206, 350);
                var imgComputerDialogEN3 = staticImage(loader, 'dialogEN3', 206, 350);

                var imgComputerDialogTA1 = staticImage(loader, 'dialogTA1', 214, 330);
                var imgComputerDialogTA2 = staticImage(loader, 'dialogTA2', 214, 330);
                var imgComputerDialogTA3 = staticImage(loader, 'dialogTA3', 214, 330);
                var imgComputerDialogTN1 = staticImage(loader, 'dialogTN1', 214, 330);
                var imgComputerDialogTN2 = staticImage(loader, 'dialogTN2', 214, 330);
                var imgComputerDialogTN3 = staticImage(loader, 'dialogTN3', 214, 330);


                //提示页面
                var imgGameReady = staticImage(loader, 'ready', 0, 0);
                var imgGameStart = staticImage(loader, 'start', 570, 492);

                //动态分值页面
                var imgPlayerScore01 = staticImage(loader, 'plus01', 502, 127);
                var imgPlayerScore02 = staticImage(loader, 'plus02', 502, 127);
                var imgPlayerScore03 = staticImage(loader, 'plus03', 502, 127);
                var imgPlayerScore04 = staticImage(loader, 'plus04', 502, 127);
                var imgPlayerScore05 = staticImage(loader, 'plus05', 502, 127);
                var imgPlayerScore06 = staticImage(loader, 'plus06', 502, 127);
                var imgPlayerScore07 = staticImage(loader, 'plus07', 502, 127);
                var imgPlayerScore08 = staticImage(loader, 'plus08', 502, 127);
                var imgPlayerScore09 = staticImage(loader, 'plus09', 502, 127);
                var imgPlayerScore10 = staticImage(loader, 'plus10', 502, 127);

                // 文本设置
                /*var txtTomatoAttackedList = [
                 '混蛋！', '啊哟~', '痛死啦'
                 ];
                 var txtTomatoNotAttackedList = [
                 '臭蛋哦~', '打不到！', '嘿嘿'
                 ];
                 var txtEggAttackedList = [
                 '好晕', '额。。。', '算你狠'
                 ];
                 var txtEggNotAttackedList = [
                 '烂番茄哟', '蠢死！', '好Low'
                 ];*/

                var imgTomatoAttackedList = [
                    imgComputerDialogTA1, imgComputerDialogTA2, imgComputerDialogTA3
                ];
                var imgTomatoNotAttackedList = [
                    imgComputerDialogTN1, imgComputerDialogTN2, imgComputerDialogTN3
                ];
                var imgEggAttackedList = [
                    imgComputerDialogEA1, imgComputerDialogEA2, imgComputerDialogEA3
                ];
                var imgEggNotAttackedList = [
                    imgComputerDialogEN1, imgComputerDialogEN2, imgComputerDialogEN3
                ];

                var imgPlayerScoreList = [
                    imgPlayerScore01,
                    imgPlayerScore02,
                    imgPlayerScore03,
                    imgPlayerScore04,
                    imgPlayerScore05,
                    imgPlayerScore06,
                    imgPlayerScore07,
                    imgPlayerScore08,
                    imgPlayerScore09,
                    imgPlayerScore10
                ];


                var imgPlayerWeapon, imgComputerWeapon,
                    imgPlayerHand, imgComputerHand,
                    imgPlayerAttack, imgComputerAttack,
                    imgPlayerWin, imgComputerWin,
                    imgPlayerLose, imgComputerLose,
                    imgPlayerDamaged, imgComputerDamaged,
                    imgPlayerEnd, imgComputerEnd,
                    imgPlayerStart, imgComputerStart,
                    imgPlayerAngry, imgComputerAngry,
                    imgComputerAttackedList, imgComputerNotAttackedList,
                    txtComputerAttackedList, txtComputerNotAttackedList;

                var characterSetting = {
                    'tomato': '番茄',
                    'egg': '鸡蛋'
                };

                switch (player) {
                    case undefined:
                        alert('未定义角色，请回到首页重新选择！');
                        window.location.href = 'index.html';
                        break;
                    case 'tomato': //我选择番茄，则番茄在右，鸡蛋在左
                        imgPlayer = imgTomato;
                        imgPlayerWeapon = imgTomatoWeapon;
                        imgPlayerHand = imgTomatoHand;
                        imgPlayerAttack = imgTomatoAttack;
                        imgPlayerWin = imgTomatoWin;
                        imgPlayerLose = imgTomatoLose;
                        imgPlayerDamaged = imgTomatoDamaged;
                        imgPlayerEnd = imgTomatoEnd;
                        imgPlayerStart = {
                            x: imgTomatoWeapon.x,
                            y: imgTomatoWeapon.y
                        };
                        imgPlayerAngry = imgTomatoAngry;

                        imgComputer = imgEgg;
                        imgComputerWeapon = imgEggWeapon;
                        imgComputerHand = imgEggHand;
                        imgComputerAttack = imgEggAttack;
                        imgComputerWin = imgEggWin;
                        imgComputerLose = imgEggLose;
                        imgComputerDamaged = imgEggDamaged;
                        imgComputerEnd = imgEggEnd;
                        imgComputerStart = {
                            x: imgEggWeapon.x,
                            y: imgEggWeapon.y
                        };
                        imgComputerAngry = imgEggAngry;
                        imgComputerAttackedList = imgEggAttackedList;
                        imgComputerNotAttackedList = imgEggNotAttackedList;
                        /*txtComputerAttackedList = txtEggAttackedList;
                         txtComputerNotAttackedList = txtEggNotAttackedList;*/

                        break;
                    case 'egg': //我选择鸡蛋，则鸡蛋在右，番茄在左
                        imgPlayer = imgEgg;
                        imgPlayerWeapon = imgEggWeapon;
                        imgPlayerHand = imgEggHand;
                        imgPlayerAttack = imgEggAttack;
                        imgPlayerWin = imgEggWin;
                        imgPlayerLose = imgEggLose;
                        imgPlayerDamaged = imgEggDamaged;
                        imgPlayerEnd = imgEggEnd;
                        imgPlayerStart = {
                            x: imgEggWeapon.x,
                            y: imgEggWeapon.y
                        };
                        imgPlayerAngry = imgEggAngry;

                        imgComputer = imgTomato;
                        imgComputerWeapon = imgTomatoWeapon;
                        imgComputerHand = imgTomatoHand;
                        imgComputerAttack = imgTomatoAttack;
                        imgComputerWin = imgTomatoWin;
                        imgComputerLose = imgTomatoLose;
                        imgComputerDamaged = imgTomatoDamaged;
                        imgComputerEnd = imgTomatoEnd;
                        imgComputerStart = {
                            x: imgTomatoWeapon.x,
                            y: imgTomatoWeapon.y
                        };
                        imgComputerAngry = imgTomatoAngry;
                        imgComputerAttackedList = imgTomatoAttackedList;
                        imgComputerNotAttackedList = imgTomatoNotAttackedList;
                        /* txtComputerAttackedList = txtTomatoAttackedList;
                         txtComputerNotAttackedList = txtTomatoNotAttackedList;*/
                        break;
                }

                //玩家指示物
                var imgPlayerSign = staticShapePolyStar({
                    strokeColor: '#6a1217',
                    strokeStyle: 5,
                    color: imgPlayerAttr.color,
                    x: 495,
                    y: 350,
                    radius: 20,
                    sides: 3,
                    pointSize: 0,
                    angle: 90
                }, 694, 33);

                imgPlayerSign.alpha = 1;

                cjs.Tween.get(imgPlayerSign, {
                        loop: true
                    })
                    .to({alpha: 0.5}, 500)
                    .to({alpha: 0}, 500)
                    .to({alpha: 0.5}, 500)
                    .to({alpha: 1}, 500)
                    .call(function () {

                    });

                //玩家事件
                var listenerPlayer1, listenerPlayer2;

                //右侧力度条：debug
                var imgTestPowerBanner = staticShapeStroke({
                    color: 'white',
                    strokeColor: '#6a1217',
                    strokeStyle: 5,
                    w: 200,
                    h: 25
                }, 1075, 400);

                //右侧力度条满格，宽度随按压力度变化！
                //满格：w = 195
                //debug
                var imgTestUsePowerBanner = staticShape({
                    color: imgPlayerAttr.color,
                    w: 100,
                    h: 20,
                    radiusTL: 0,
                    radiusTR: 0,
                    radiusBR: 0,
                    radiusBL: 0
                }, 1077.5, 402.5);

                dynamicCtr.addChild(imgTestPowerBanner);
                dynamicCtr.addChild(imgTestUsePowerBanner);

                //全容器事件绑定
                readyCtr.on('mousedown', function () {

                    //三角显示
                    dynamicCtr.addChild(imgPlayerSign);
                    //移除
                    dynamicCtr.removeChild(imgTestPowerBanner);
                    dynamicCtr.removeChild(imgTestUsePowerBanner);
                    //玩家事件放置
                    listenerPlayer1 = imgPlayer.addEventListener('mousedown', handlePlayer1);
                    listenerPlayer2 = imgPlayer.addEventListener('pressup', handlePlayer2);
                    //移除遮罩
                    stage.removeChild(readyCtr);

                    //声音测试：导入id就可以播放了
                    /* var ppc = cjs.Sound.setDefaultPlayProps("bg", {
                     interrupt: cjs.Sound.INTERRUPT_ANY,
                     loop: -1,
                     volume: 0.5
                     });
                     var soundBg = cjs.Sound.play('bg');*/
                    //声音测试：结束
                });
                //提示页面结束


                // 事件
                var stop, flag = false, soundWind,
                    indexPlayer, indexComputer, indexWind, powerWind,
                    PlayerScore = 0, valuePlayer,
                    playerHits = 0, computerHits = 0,
                    powerPlayer, powerComputer, pause1, pause2, playerStep;

                var playerPlusValue = 1;

                var powerPlayerList, powerComputerList;

                if (w > h) {
                    powerPlayerList = [0, 3 * w / 16, 6 * w / 16, 9 * w / 16, 12 * w / 16];
                    powerComputerList = [0, 3 * w / 16, 6 * w / 16, 9 * w / 16, 12 * w / 16];
                } else {
                    powerPlayerList = [0, 3 * h / 16, 6 * h / 16, 9 * h / 16, 12 * h / 16];
                    powerComputerList = [0, 3 * h / 16, 6 * h / 16, 9 * h / 16, 12 * h / 16];
                }


                var powerWindList = [-2, -1, 0, 1, 2];

                //玩家的回调函数
                var imgPlayerPowerBanner, imgPlayerUsePowerBanner,
                    imgComputerPowerBanner, imgComputerUsePowerBanner;

                function handlePlayer1() {

                    //强行清除指示物
                    dynamicCtr.removeChild(imgPlayerSign);

                    //var pt1 = imgPlayer.globalToLocal(stage.mouseX, stage.mouseY);

                    //console.log(stage.mouseX+','+stage.mouseY);
                    //console.log(pt1);

                    //console.log('按住矩形，此时需要更新双方表情（1）');
                    //player.graphics.beginFill('green').endFill();

                    //声音测试：导入id就可以播放了
                    var ppc = cjs.Sound.setDefaultPlayProps("mousedown", {
                        interrupt: cjs.Sound.INTERRUPT_ANY,
                        loop: 0,
                        volume: 0.5
                    });
                    var soundClick = cjs.Sound.play('mousedown');
                    //声音测试：结束

                    //风向设置
                    indexWind = Math.floor((Math.random() * powerWindList.length));
                    //indexWind = 2,powerWind=0
                    powerWind = powerWindList[indexWind];
                    // debug
                    //imgWindSign.graphics.command.x = windTest[powerWind];
                    imgWindSign.x = windTest[powerWind] * scaleX;

                    //右侧力度条
                    imgPlayerPowerBanner = staticShapeStroke({
                        color: 'white',
                        strokeColor: '#6a1217',
                        strokeStyle: 5,
                        w: 200,
                        h: 25
                    }, 1075, 350);

                    //右侧力度条满格，宽度随按压力度变化！
                    //满格：w = 195
                    imgPlayerUsePowerBanner = staticShape({
                        color: imgPlayerAttr.color,
                        w: 0,
                        h: 20,
                        radiusTL: 0,
                        radiusTR: 0,
                        radiusBR: 0,
                        radiusBL: 0
                    }, 1077.5, 352.5);

                    //力度槽测试
                    dynamicCtr.addChild(imgPlayerPowerBanner);
                    dynamicCtr.addChild(imgPlayerUsePowerBanner);

                    //移除玩家备战
                    dynamicCtr.removeChild(imgPlayer);
                    staticCtr.removeChild(imgPlayer);
                    //接入抬手表情
                    dynamicCtr.addChild(imgPlayerWeapon);
                    dynamicCtr.addChild(imgPlayerHand);
                    dynamicCtr.addChild(imgPlayerAttack);

                    dynamicCtr.addChild(imgEggOverlay);

                    //默认不按就以0处理
                    powerPlayer = 0;
                    indexPlayer = 0;
                    valuePlayer = 0;
                    /*var x = 0,
                     factor = 1;*/

                    //声音测试：导入id就可以播放了
                    var ppc = cjs.Sound.setDefaultPlayProps("wind", {
                        interrupt: cjs.Sound.INTERRUPT_ANY,
                        loop: -1,
                        volume: 0.5
                    });
                    soundWind = cjs.Sound.play('wind');
                    //声音测试：结束

                    stop = setTimeout(function () {//down 1s，才运行。
                        //flag = true;
                        //console.log('按住矩形，此时需要更新力度大小变化');
                        var x = 0;
                        var factor = 1;

                        function sum() {
                            factor = x == 0 ? 1 : (x == 195 ? -1 : factor);
                            //console.log(factor);
                            x += factor;
                            return x;
                        }

                        //indexWind = 2,powerWind=0
                        playerStep = setInterval(function () {

                            //console.log(sum());

                            imgPlayerUsePowerBanner.graphics.instructions[1].w = sum();
                            indexPlayer = Math.floor((x * powerPlayerList.length / 195));
                            valuePlayer = indexPlayer - powerWind;

                            if (valuePlayer >= powerPlayerList.length) {
                                valuePlayer = powerPlayerList.length - 1
                            } else if (valuePlayer < 0) {
                                valuePlayer = 0;
                            }
                            powerPlayer = powerPlayerList[valuePlayer];

                        }, 10);

                    }, 100);
                }

                function handlePlayer2() {

                    //音效停止播放
                    soundWind.stop();

                    //清除计时器
                    clearInterval(playerStep);
                    clearTimeout(stop);

                    //完成一次投掷后关闭触摸事件
                    imgPlayer.off('mousedown', listenerPlayer1);
                    imgPlayer.off('pressup', listenerPlayer2);

                    //console.log('松开矩形，只要松开立马更新双方表情（2），力度显示隐藏，');

                    /*玩家投掷中*/
                    // debug
                    //indexPlayer = 3;
                    //powerPlayer = powerPlayerList[indexPlayer];

                    //移除力度槽测试
                    dynamicCtr.removeChild(imgPlayerPowerBanner);
                    dynamicCtr.removeChild(imgPlayerUsePowerBanner);

                    //初始化武器的坐标
                    //alert(indexPlayer);
                    //powerPlayer = 3 * w / 8;

                    var startX = (imgPlayerStart.x);
                    var startY = (imgPlayerStart.y);
                    var endX = w > h ? (w / 2 - powerPlayer) * scaleX : (h / 2 - powerPlayer) * scaleX;
                    var endY = (imgPlayerAttr.characterShadow.y) * scaleY;
                    //至少要扔过界
                    var centerX = (startX + endX) / 2;
                    var centerY = w > h ? (-h / 2) * scaleY : (-w / 2) * scaleY;

                    //powerPlayer = 3 * w / 8;
                    //console.log(h, startX, startY, centerX, centerY, endX, endY);

                    //定义最终位置
                    imgPlayerEnd.x = endX;
                    imgPlayerEnd.y = endY;

                    //声音测试：导入id就可以播放了
                    var ppc = cjs.Sound.setDefaultPlayProps("throw", {
                        interrupt: cjs.Sound.INTERRUPT_ANY,
                        loop: 0,
                        volume: 0.5
                    });
                    var soundThrow1 = cjs.Sound.play('throw');
                    //声音测试：结束

                    //测试曲线
                    cjs.Tween.get(imgPlayerWeapon, {
                        loop: false
                    }).to({guide: {path: [startX, startY, centerX, centerY, endX, endY]}}, 1000)
                        .call(function () {

                            //声音测试：导入id就可以播放了
                            var ppc = cjs.Sound.setDefaultPlayProps("se", {
                                interrupt: cjs.Sound.INTERRUPT_ANY,
                                loop: 0,
                                volume: 0.5
                            });
                            var soundSe1 = cjs.Sound.play('se');
                            //声音测试：结束

                            //恢复至初始位置
                            imgPlayerWeapon.x = imgPlayerStart.x;
                            imgPlayerWeapon.y = imgPlayerStart.y;

                            //console.log('运动完成！事件已禁用！');

                            //计算是否碰撞，血条是否减少，双方表情变化

                            //移除抬手表情
                            dynamicCtr.removeChild(imgPlayerWeapon);
                            dynamicCtr.removeChild(imgPlayerHand);
                            dynamicCtr.removeChild(imgPlayerAttack);
                            //移除电脑备战
                            dynamicCtr.removeChild(imgComputer);

                            //根据是否击中改变表情：备战或得意
                            //console.log(indexPlayer);

                            var debugPlayerHit = (valuePlayer == 2);
                            var imgPlayerStatus, imgComputerStatus;
                            var indexDialog, indexPlusValue,
                                imgComputerList,
                                indexAttacked, indexNotAttacked,
                                txtComputer;

                            /*var fix = {
                             x: 10,
                             y: -10
                             };

                             imgComputerList = [
                             {
                             dialog: imgComputerDialog1,
                             x: 235 + fix.x,
                             y: 399 + fix.y
                             }, {
                             dialog: imgComputerDialog2,
                             x: 235 + fix.x,
                             y: 399 + fix.y
                             }, {
                             dialog: imgComputerDialog3,
                             x: 235 + fix.x,
                             y: 399 + fix.y
                             }, {
                             dialog: imgComputerDialog4,
                             x: 235 + fix.x,
                             y: 399 + fix.y
                             }
                             ];*/
                            indexDialog = Math.floor((Math.random() * 3));
                            indexPlusValue = playerPlusValue - 1;
                            // stage.addChild(imgComputerList[indexDialog].dialog);


                            if (debugPlayerHit) {

                                //显示分值
                                stage.addChild(imgPlayerScoreList[indexPlusValue]);
                                //显示对话框
                                stage.addChild(imgComputerAttackedList[indexDialog]);

                                /*电脑显示文字*/
                                /*indexAttacked = Math.floor((Math.random() * txtComputerAttackedList.length));
                                 console.log(txtComputerAttackedList[indexAttacked]);
                                 txtComputer = new createjs.Text(txtComputerAttackedList[indexAttacked], "bold 24px Arial", "#6a1217");
                                 //var bounds = txtComputer.getBounds();

                                 txtComputer.x = imgComputerList[indexDialog].x * scaleX;
                                 txtComputer.y = imgComputerList[indexDialog].y * scaleY;
                                 txtComputer.scaleX = scaleX;
                                 txtComputer.scaleY = scaleY;

                                 stage.addChild(txtComputer);*/
                                /*文本显示结束*/

                                playerHits += 1;

                                //debug:不再加入连击系数
                                PlayerScore += playerPlusValue;

                                //可能会插入动画：类似马里奥撞金币
                                //连击系数
                                //playerPlusValue += 1;
                                playerPlusValue = 1;

                                imgPlayerStatus = imgPlayerWin;
                                imgComputerStatus = imgComputerLose;
                                imgComputerLifeBanner.graphics.instructions[1].w -= minusLife;

                                if (playerHits == 10) {
                                    /*stage.removeChild(txtComputer);
                                     stage.removeChild(imgComputerList[indexDialog].dialog);*/

                                    stage.removeChild(imgPlayerScoreList[indexPlusValue]);

                                    stage.removeChild(imgComputerAttackedList[indexDialog]);
                                    staticCtr.removeChild(imgComputerLifeBanner);
                                    dynamicCtr.addChild(imgPlayerStatus);
                                    dynamicCtr.addChild(imgComputerStatus);
                                    dynamicCtr.addChild(imgEggOverlay);
                                    //
                                    dynamicCtr.addChild(imgPlayerEnd);
                                    //调用结果页处理函数
                                    resultPageBuild(PlayerScore, 'win');
                                    return;

                                }

                                //声音测试：导入id就可以播放了
                                var ppc = cjs.Sound.setDefaultPlayProps("laugh", {
                                    interrupt: cjs.Sound.INTERRUPT_ANY,
                                    loop: 0,
                                    volume: 0.5
                                });
                                var soundLaugh1 = cjs.Sound.play('laugh');
                                //声音测试：结束

                            } else {

                                stage.addChild(imgComputerNotAttackedList[indexDialog]);

                                // 没击中恢复默认值1
                                playerPlusValue = 1;

                                /*电脑显示文字*/
                                /*indexNotAttacked = Math.floor((Math.random() * txtComputerNotAttackedList.length));
                                 txtComputer = new createjs.Text(txtComputerNotAttackedList[indexNotAttacked], "bold 24px Arial", "#6a1217");
                                 //var bounds = text.getBounds();

                                 txtComputer.x = imgComputerList[indexDialog].x * scaleX;
                                 txtComputer.y = imgComputerList[indexDialog].y * scaleY;
                                 txtComputer.scaleX = scaleX;
                                 txtComputer.scaleY = scaleY;

                                 stage.addChild(txtComputer);*/
                                /*文本显示结束*/

                                imgPlayerStatus = imgPlayerAngry;
                                imgComputerStatus = imgComputerWin;

                                //声音测试：导入id就可以播放了
                                var ppc = cjs.Sound.setDefaultPlayProps("angry", {
                                    interrupt: cjs.Sound.INTERRUPT_ANY,
                                    loop: 0,
                                    volume: 0.5
                                });
                                var soundAngry1 = cjs.Sound.play('angry');
                                //声音测试：结束


                            }

                            //显示得分
                            //console.log(PlayerScore);

                            dynamicCtr.addChild(imgPlayerStatus);
                            dynamicCtr.addChild(imgComputerStatus);
                            dynamicCtr.addChild(imgEggOverlay);
                            //
                            dynamicCtr.addChild(imgPlayerEnd);

                            pause1 = setTimeout(function () {

                                //移除文本
                                /* stage.removeChild(txtComputer);
                                 stage.removeChild(imgComputerList[indexDialog].dialog);*/

                                //显示分值
                                stage.removeChild(imgPlayerScoreList[indexPlusValue]);

                                stage.removeChild(imgComputerAttackedList[indexDialog]);
                                stage.removeChild(imgComputerNotAttackedList[indexDialog]);

                                //移除
                                dynamicCtr.removeChild(imgPlayerEnd);

                                dynamicCtr.removeChild(imgPlayerStatus);
                                dynamicCtr.removeChild(imgComputerStatus);

                                dynamicCtr.addChild(imgPlayer);
                                dynamicCtr.addChild(imgComputer);
                                dynamicCtr.addChild(imgEggOverlay);

                                //移除电脑备战
                                dynamicCtr.removeChild(imgComputer);
                                //电脑投掷开始,接入抬手表情（注：副攻一定是外侧手，所以渲染顺序是武器——角色——手）
                                dynamicCtr.addChild(imgComputerWeapon);
                                dynamicCtr.addChild(imgComputerAttack);
                                dynamicCtr.addChild(imgComputerHand);
                                dynamicCtr.addChild(imgEggOverlay);

                                //风向设置
                                indexWind = Math.floor((Math.random() * powerWindList.length));
                                powerWind = powerWindList[indexWind];

                                //debug
                                //imgWindSign.graphics.command.x = windTest[powerWind];
                                imgWindSign.x = windTest[powerWind] * scaleX;

                                //左侧力度条
                                imgComputerPowerBanner = staticShapeStroke({
                                    color: 'white',
                                    strokeColor: '#6a1217',
                                    strokeStyle: 5,
                                    w: 200,
                                    h: 25
                                }, 50, 350);

                                //左侧力度条满格
                                // 195
                                imgComputerUsePowerBanner = staticShape({
                                    color: imgComputerAttr.color,
                                    w: 0,
                                    h: 20,
                                    radiusTL: 0,
                                    radiusTR: 0,
                                    radiusBR: 0,
                                    radiusBL: 0
                                }, 52.5, 352.5);

                                dynamicCtr.addChild(imgComputerPowerBanner);
                                dynamicCtr.addChild(imgComputerUsePowerBanner);

                                var debugPower,
                                    m, n;

                                // JS生成[m,n]之间的随机数
                                // parseInt(Math.random())*(n-m)+m;

                                //电脑随机力度
                                if (powerWind <= 0) {
                                    m = 0.5;
                                    n = 1;
                                } else {
                                    m = 0;
                                    n = 0.5;
                                }

                                debugPower = parseFloat(Math.random()) * (n - m) + m;


                                //var debugPower = Math.random();
                                imgComputerUsePowerBanner.graphics.instructions[1].w = debugPower * 195;
                                indexComputer = Math.floor((debugPower * powerComputerList.length));

                                // powerWind = [-2,-1,0,1,2];
                                // indexComputer = [0,1,2,3,4]

                                var valueComputer = indexComputer + powerWind;

                                if (valueComputer >= powerComputerList.length) {
                                    valueComputer = powerComputerList.length - 1
                                } else if (valueComputer < 0) {
                                    valueComputer = 0;
                                }


                                powerComputer = powerComputerList[valueComputer];
                                //console.log(powerComputer);

                                //初始化武器的坐标
                                //alert(indexComputer);
                                //console.log(imgComputerWeapon);
                                //powerComputer = 3 * w / 8;

                                var startX = (imgComputerStart.x);
                                var startY = (imgComputerStart.y);
                                var endX = w > h ? (w / 2 + powerComputer) * scaleX : (h / 2 + powerComputer) * scaleX;
                                var endY = (imgComputerAttr.characterShadow.y) * scaleY;
                                //至少要扔过界
                                var centerX = (startX + endX) / 2;
                                var centerY = w > h ? (-h / 2) * scaleY : (-w / 2) * scaleY;

                                imgComputerEnd.x = endX;
                                imgComputerEnd.y = endY;

                                //声音测试：导入id就可以播放了
                                var ppc = cjs.Sound.setDefaultPlayProps("throw", {
                                    interrupt: cjs.Sound.INTERRUPT_ANY,
                                    loop: 0,
                                    volume: 0.5
                                });
                                var soundThrow2 = cjs.Sound.play('throw');
                                //声音测试：结束

                                cjs.Tween.get(imgComputerWeapon, {
                                    loop: false
                                }).to({guide: {path: [startX, startY, centerX, centerY, endX, endY]}}, 1000).call(function () {

                                    //声音测试：导入id就可以播放了
                                    var ppc = cjs.Sound.setDefaultPlayProps("se", {
                                        interrupt: cjs.Sound.INTERRUPT_ANY,
                                        loop: 0,
                                        volume: 0.5
                                    });
                                    var soundSe2 = cjs.Sound.play('se');
                                    //声音测试：结束


                                    //电脑的力度条在投掷完之后再移除
                                    dynamicCtr.removeChild(imgComputerPowerBanner);
                                    dynamicCtr.removeChild(imgComputerUsePowerBanner);

                                    //恢复至初始位置
                                    imgComputerWeapon.x = imgComputerStart.x;
                                    imgComputerWeapon.y = imgComputerStart.y;

                                    //console.log('运动完成！事件已禁用！');

                                    //计算是否碰撞，血条是否减少，双方表情变化

                                    //移除抬手表情
                                    dynamicCtr.removeChild(imgComputerWeapon);
                                    dynamicCtr.removeChild(imgComputerHand);
                                    dynamicCtr.removeChild(imgComputerAttack);
                                    //移除玩家备战
                                    dynamicCtr.removeChild(imgPlayer);
                                    //console.log(indexComputer);
                                    //根据是否击中改变表情：备战或得意
                                    var debugComputerHit = (valueComputer == 2);

                                    /*indexDialog = Math.floor((Math.random() * imgComputerList.length));
                                     stage.addChild(imgComputerList[indexDialog]);*/

                                    if (debugComputerHit) {

                                        /*电脑显示文字*/
                                        /*indexAttacked = Math.floor((Math.random() * txtComputerAttackedList.length));
                                         txtComputer = new createjs.Text(txtComputerAttackedList[indexAttacked], "bold 24px Arial", "#6a1217");
                                         //var bounds = text.getBounds();

                                         txtComputer.x = 282 * scaleX;
                                         txtComputer.y = 409 * scaleY;
                                         txtComputer.scaleX = scaleX;
                                         txtComputer.scaleY = scaleY;

                                         stage.addChild(txtComputer);*/


                                        computerHits += 1;
                                        imgPlayerStatus = imgPlayerLose;
                                        imgComputerStatus = imgComputerWin;
                                        imgPlayerLifeBanner.graphics.instructions[1].w -= minusLife;
                                        //imgPlayerLifeBanner.graphics.instructions[1].w = parseFloat((imgPlayerLifeBanner.graphics.instructions[1].w - minusLife).toFixed(1));

                                        if (computerHits == 10) {
                                            /*stage.removeChild(txtComputer);
                                             stage.removeChild(imgComputerList[indexDialog]);*/
                                            staticCtr.removeChild(imgPlayerLifeBanner);
                                            dynamicCtr.addChild(imgPlayerStatus);
                                            dynamicCtr.addChild(imgComputerStatus);
                                            dynamicCtr.addChild(imgEggOverlay);
                                            //
                                            dynamicCtr.addChild(imgComputerEnd);
                                            //调用结果页处理函数
                                            resultPageBuild(PlayerScore, 'lose');
                                            return;

                                        }

                                    } else {

                                        /*电脑显示文字*/
                                        /*indexNotAttacked = Math.floor((Math.random() * txtComputerNotAttackedList.length));
                                         txtComputer = new createjs.Text(txtComputerNotAttackedList[indexNotAttacked], "bold 24px Arial", "#6a1217");
                                         //var bounds = text.getBounds();

                                         txtComputer.x = 282 * scaleX;
                                         txtComputer.y = 409 * scaleY;
                                         txtComputer.scaleX = scaleX;
                                         txtComputer.scaleY = scaleY;

                                         stage.addChild(txtComputer);*/


                                        imgPlayerStatus = imgPlayerWin;
                                        imgComputerStatus = imgComputerAngry;

                                        //声音测试：导入id就可以播放了
                                        var ppc = cjs.Sound.setDefaultPlayProps("laugh", {
                                            interrupt: cjs.Sound.INTERRUPT_ANY,
                                            loop: 0,
                                            volume: 0.5
                                        });
                                        var soundLaugh2 = cjs.Sound.play('laugh');
                                        //声音测试：结束
                                    }

                                    dynamicCtr.addChild(imgPlayerStatus);
                                    dynamicCtr.addChild(imgComputerStatus);
                                    dynamicCtr.addChild(imgEggOverlay);
                                    dynamicCtr.addChild(imgComputerEnd);

                                    //是否扣血
                                    //console.log(imgPlayerStatus,imgComputerStatus);


                                    pause2 = setTimeout(function () {

                                        /*stage.removeChild(txtComputer);
                                         stage.removeChild(imgComputerList[indexDialog]);*/

                                        //移除
                                        dynamicCtr.removeChild(imgComputerEnd);
                                        //alert('判定结束，双方恢复默认备战');
                                        dynamicCtr.removeChild(imgPlayerStatus);
                                        dynamicCtr.removeChild(imgComputerStatus);
                                        dynamicCtr.addChild(imgPlayer);
                                        dynamicCtr.addChild(imgComputer);
                                        dynamicCtr.addChild(imgEggOverlay);

                                        //风向恢复原值
                                        //imgWindSign.x = windTest['0'] * scaleX;

                                        //stage.update();
                                        //console.log('电脑回击完成！开启触摸事件！');
                                        //cjs.Touch.enable(stage);
                                        listenerPlayer1 = imgPlayer.on('mousedown', handlePlayer1);
                                        listenerPlayer2 = imgPlayer.on('pressup', handlePlayer2);

                                        //重新指示
                                        dynamicCtr.addChild(imgPlayerSign);

                                        imgPlayerSign.alpha = 1;
                                        cjs.Tween.get(imgPlayerSign, {
                                                loop: true
                                            })
                                            .to({alpha: 0.5}, 500)
                                            .to({alpha: 0}, 500)
                                            .to({alpha: 0.5}, 500)
                                            .to({alpha: 1}, 500)
                                            .call(function () {

                                            });

                                        //缩短反应时间
                                    }, 1000);


                                });

                                //缩短反应时间
                            }, 1000);


                        });

                    //console.log(h, startX, startY, centerX, centerY, endX, endY);


                }

                //结果页处理函数
                function resultPageBuild(playerScore, sign) {

                    var $qrCodeContainer = $('#qrCodeContainer'), $qrCode = $('#qrCode');
                    $qrCodeContainer.show();
                    $qrCode.show();

                    /*$qrCodeContainer.on('click',function () {
                     alert('233');
                     });*/

                    if (w < h) {
                        $qrCodeContainer.css({
                            'transform': 'rotate(90deg)',
                            'left': '250px',
                            'top': '6%'
                        });
                        /*$qrCode.css({
                         'transform': 'rotate(90deg)'

                         });*/
                    }


                    var imgResultBg, imgGetAward, imgViewScore, imgShowText;

                    var imgqrCode, imgText, imgTip;

                    //imgqrCode = staticImage(loader, 'qrCode', 1133, 364-290);
                    imgText = staticImage(loader, 'text', 80, 440);
                    imgTip = staticImage(loader, 'tip', 549, 439);

                    var imgRetry = staticImage(loader, 'retry', 339, 472);

                    //三个按钮绑定事件
                    imgRetry.on('mousedown', function () {
                        window.location.href = 'index.html';
                    });

                    var imgTomatoResultWin = staticImage(loader, 'tomatoResultWin', 172, 16);
                    var imgEggResultLose = staticImage(loader, 'eggResultLose', 1003, 399);

                    var imgEggResultWin = staticImage(loader, 'eggResultWin', 199, 24);
                    var imgTomatoResultLose = staticImage(loader, 'tomatoResultLose', 999, 373);

                    //玩家显示文字
                    var textPlayer = new cjs.Text(characterSetting[player], "bold 36px Arial", "#e50012"),
                        boundsPlayer = textPlayer.getBounds();

                    textPlayer.x = 418 * scaleX;
                    textPlayer.y = 327 * scaleY;
                    textPlayer.scaleX = scaleX;
                    textPlayer.scaleY = scaleY;

                    //电脑显示文字
                    var textComputer = new cjs.Text(characterSetting[computer], "bold 36px Arial", "#e50012"),
                        boundsPlayer = textComputer.getBounds();

                    textComputer.x = 380 * scaleX;
                    textComputer.y = 370 * scaleY;
                    textComputer.scaleX = scaleX;
                    textComputer.scaleY = scaleY;

                    //积分显示文字
                    var textScore = new cjs.Text(playerScore, "bold 36px Arial", "#e50012"),
                        boundsScore = textScore.getBounds();

                    textScore.x = 740 * scaleX;
                    textScore.y = 340 * scaleY;
                    /*textScore.x = 334 * scaleX;
                     textScore.y = 368 * scaleY;*/
                    textScore.scaleX = scaleX;
                    textScore.scaleY = scaleY;

                    //积分显示文字2
                    /*var textScore2 = new cjs.Text(playerScore, "bold 36px Arial", "#e50012"),
                     boundsScore2 = textScore.getBounds();

                     textScore2.x = 334 * scaleX;
                     textScore2.y = 368 * scaleY;
                     textScore2.scaleX = scaleX;
                     textScore2.scaleY = scaleY;*/

                    if (sign == 'win') {

                        imgResultBg = staticImage(loader, 'playerWinBg', 0, 0);
                        imgGetAward = staticImage(loader, 'getAward', 566, 472);
                        imgViewScore = staticImage(loader, 'viewScore', 793, 472);
                        var imgTomatoAndEgg = staticImage(loader, 'tomatoAndEgg', 503, 143);
                        //  绘制文字
                        //imgShowText = staticImage(loader, 'showWinText', 330, 327);

                        //  绘制文字2
                        var imgShowText2 = staticImage(loader, 'showWinText2', 466, 341);

                        staticCtr.addChild(imgResultBg);
                        staticCtr.addChild(imgRetry);
                        staticCtr.addChild(imgGetAward);
                        staticCtr.addChild(imgViewScore);

                        // staticCtr.addChild(imgShowText);
                        staticCtr.addChild(imgShowText2);

                        //staticCtr.addChild(textPlayer);
                        staticCtr.addChild(imgTomatoAndEgg);
                        staticCtr.addChild(textScore);

                        if (player == 'tomato') {
                            staticCtr.addChild(imgTomatoResultWin);
                            staticCtr.addChild(imgEggResultLose);
                        } else {
                            staticCtr.addChild(imgTomatoResultLose);
                            staticCtr.addChild(imgEggResultWin);
                        }

                        //staticCtr.addChild(imgqrCode);
                        staticCtr.addChild(imgText);

                        //如果存在手机号则查询积分
                        if (window.localStorage.mobile != '' && window.localStorage.mobile != undefined) {
                            $.when(apis.getUserInfo(window.localStorage.mobile))
                                .then(function (result) {

                                    var score = result.data.asset.integral;

                                    //积分显示文字
                                    var textResultScore = new cjs.Text(score, "bold 36px Arial", "#e50012"),
                                        boundsScore = textResultScore.getBounds();

                                    //根据数值的位数决定文本渲染坐标
                                    var length = playerScore.toString().length;
                                    var value = 760;

                                    textResultScore.x = (value) * scaleX;
                                    textResultScore.y = 395 * scaleY;
                                    textResultScore.scaleX = scaleX;
                                    textResultScore.scaleY = scaleY;

                                    staticCtr.addChild(textResultScore);

                                    //兑换礼品事件
                                    imgGetAward.on('mousedown', function () {

                                        staticCtr.removeChild(textResultScore);
                                        staticCtr.removeChild(imgShowText2);

                                        //移除鸡蛋，番茄和炒蛋
                                        staticCtr.removeChild(imgTomatoResultWin);
                                        staticCtr.removeChild(imgEggResultLose);
                                        staticCtr.removeChild(imgEggResultWin);
                                        staticCtr.removeChild(imgTomatoResultLose);
                                        staticCtr.removeChild(imgTomatoAndEgg);

                                        //移除按钮
                                        staticCtr.removeChild(imgRetry);
                                        staticCtr.removeChild(imgGetAward);
                                        staticCtr.removeChild(imgViewScore);

                                        //staticCtr.removeChild(textPlayer);
                                        staticCtr.removeChild(imgShowText);
                                        staticCtr.removeChild(textScore);

                                        //显示输入框
                                        var $inputForm = $('.inputForm');
                                        $inputForm.show();
                                        var $inputMobile = $('#mobile');
                                        var $inputName = $('#name');

                                        if (w < h) {
                                            $inputMobile.css({
                                                'transform': 'rotate(90deg)',
                                                'left': '18%',
                                                'top': '740px',
                                                'fontSize': '36px !important'
                                            });
                                            $inputName.css({
                                                'transform': 'rotate(90deg)',
                                                'left': '33%',
                                                'top': '740px',
                                                'fontSize': '36px !important'
                                            });
                                        }

                                        //确认和返回
                                        var imgConfirm = staticImage(loader, 'confirm', 733, 472);
                                        var imgReturn = staticImage(loader, 'return', 394, 472);
                                        var imgForm = staticImage(loader, 'form', 336, 235);

                                        staticCtr.addChild(imgConfirm);
                                        staticCtr.addChild(imgReturn);
                                        staticCtr.addChild(imgForm);

                                        var storage = window.localStorage;

                                        if (storage.nickname != '' && storage.nickname != undefined) {
                                            //console.log('!');
                                            $inputName.val(storage.nickname);
                                        }

                                        if (storage.mobile != '' && storage.mobile != undefined) {
                                            //console.log('!');
                                            $inputMobile.val(storage.mobile);
                                        }

                                        //事件监控
                                        var listenerConfirm = imgConfirm.addEventListener('mousedown', confirm);

                                        function confirm() {

                                            /*表单检验*/

                                            if ($inputName.val().length == 0) {
                                                alert('昵称不能为空！');
                                                return;
                                            }

                                            if ($inputName.val().length > 20) {
                                                alert('昵称不能超过20个字符！');
                                                return;
                                            }

                                            if ($inputMobile.val().length == 0) {
                                                alert('手机号码不能为空！');
                                                return;
                                            }

                                            if ($inputMobile.val().length != 11) {
                                                alert('请输入11位的手机号码！');
                                                return;
                                            }

                                            //var storage = window.localStorage;
                                            if (storage.mobile == '' || storage.mobile == undefined) {
                                                storage.mobile = $inputMobile.val();
                                            }

                                            if (storage.nickname == '' || storage.nickname == undefined) {
                                                storage.nickname = $inputName.val();
                                            }

                                            //playerScore = 10

                                            //点击后提交数据
                                            var data = {
                                                "extData": {
                                                    'player': player
                                                },
                                                "mobile": $inputMobile.val(),
                                                "nickname": $inputName.val(),
                                                "type": "h5",
                                                "v": playerScore
                                            };

                                            //console.log(data);

                                            //只允许点击一次，不允许重复提交
                                            imgConfirm.off('mousedown', listenerConfirm);

                                            //callback(100);

                                            //回调
                                            $.when(apis.postUserInfo(data))

                                                .then(function (result) {

                                                    //result.errCode == 0

                                                    //console.log(result);

                                                    imgConfirm.on('mousedown', listenerConfirm);

                                                    var score = result.data;

                                                    callback(score);

                                                }, function (result) {

                                                    //result.errCode != 0

                                                    //console.log(result); // result

                                                    imgConfirm.on('mousedown', listenerConfirm);

                                                    //超过三次以后查询之前积分
                                                    $.when(apis.getUserInfo($inputMobile.val()))
                                                        .then(function (result) {

                                                            var score = result.data.asset.integral;

                                                            callback(score);

                                                        }, function (result) {
                                                            //console.log(result);
                                                            //imgConfirm.on('mousedown', listenerConfirm);
                                                            //alert(result.errMsg); // Not Found
                                                            alert('无效手机号码或不存在此用户，请重新输入！');
                                                        });

                                                });

                                            //callback(playerScore);

                                            //回调函数
                                            function callback(score) {

                                                //恢复
                                                staticCtr.addChild(imgTip);
                                                //移除
                                                staticCtr.removeChild(imgConfirm);
                                                staticCtr.removeChild(imgReturn);
                                                staticCtr.removeChild(imgForm);

                                                $inputForm.hide();

                                                //积分页面
                                                var imgScore = staticImage(loader, 'score', 543, 178 - 10);
                                                var imgContinue = staticImage(loader, 'continue', 394, 472);
                                                var imgFake = staticImage(loader, 'getAward', 733, 472);

                                                //积分显示文字
                                                var textResultScore = new cjs.Text(score, "bold 36px Arial", "#e50012"),
                                                    boundsScore = textResultScore.getBounds();

                                                //根据数值的位数决定文本渲染坐标
                                                var length = score.toString().length;
                                                var value = 640;

                                                textResultScore.x = (value - length * 18) * scaleX;
                                                textResultScore.y = 390 * scaleY;
                                                textResultScore.scaleX = scaleX;
                                                textResultScore.scaleY = scaleY;

                                                staticCtr.addChild(imgScore);
                                                staticCtr.addChild(imgContinue);
                                                staticCtr.addChild(imgFake);
                                                staticCtr.addChild(textResultScore);

                                                //剩余事件
                                                imgFake.on('mousedown', function () {
                                                    window.location.href = apis.getMallEntry();
                                                });

                                                imgContinue.on('mousedown', function () {
                                                    window.location.href = 'index.html';
                                                });
                                            }


                                        }

                                        //绑定事件
                                        //imgConfirm.on('mousedown', confirm);

                                        imgReturn.on('mousedown', function () {

                                            //console.log('test');

                                            $inputForm.hide();

                                            if (player == 'tomato') {
                                                if (sign == 'win') {
                                                    staticCtr.addChild(imgTomatoResultWin);
                                                    staticCtr.addChild(imgEggResultLose);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    //staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText2);
                                                    staticCtr.addChild(textScore);

                                                    staticCtr.addChild(textResultScore);
                                                } else {
                                                    staticCtr.addChild(imgTomatoLoseLogo);

                                                    staticCtr.addChild(imgTomatoResultLose);
                                                    staticCtr.addChild(imgEggResultWin);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText);
                                                    staticCtr.addChild(textScore);

                                                }

                                            } else {
                                                if (sign == 'win') {
                                                    staticCtr.addChild(imgTomatoResultLose);
                                                    staticCtr.addChild(imgEggResultWin);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    //staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText2);
                                                    staticCtr.addChild(textScore);

                                                    staticCtr.addChild(textResultScore);
                                                } else {
                                                    staticCtr.addChild(imgEggLoseLogo);

                                                    staticCtr.addChild(imgTomatoResultWin);
                                                    staticCtr.addChild(imgEggResultLose);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText);
                                                    staticCtr.addChild(textScore);
                                                }
                                            }

                                            /*staticCtr.addChild(imgTomatoAndEgg);

                                             staticCtr.removeChild(imgConfirm);
                                             staticCtr.removeChild(imgReturn);
                                             staticCtr.removeChild(imgForm);

                                             //移除按钮
                                             staticCtr.addChild(imgRetry);
                                             staticCtr.addChild(imgGetAward);
                                             staticCtr.addChild(imgViewScore);

                                             staticCtr.addChild(textPlayer);
                                             staticCtr.addChild(imgShowText);
                                             staticCtr.addChild(textScore);*/


                                        });


                                    });

                                    //查看积分事件
                                    imgViewScore.on('mousedown', function () {

                                        staticCtr.removeChild(textResultScore);
                                        staticCtr.removeChild(imgShowText2);

                                        //移除鸡蛋，番茄和炒蛋
                                        staticCtr.removeChild(imgTomatoResultWin);
                                        staticCtr.removeChild(imgEggResultLose);
                                        staticCtr.removeChild(imgEggResultWin);
                                        staticCtr.removeChild(imgTomatoResultLose);
                                        staticCtr.removeChild(imgTomatoAndEgg);

                                        //移除按钮
                                        staticCtr.removeChild(imgRetry);
                                        staticCtr.removeChild(imgGetAward);
                                        staticCtr.removeChild(imgViewScore);

                                        staticCtr.removeChild(textPlayer);
                                        staticCtr.removeChild(imgShowText);
                                        staticCtr.removeChild(textScore);

                                        //显示输入框
                                        var $inputForm = $('.inputForm');
                                        $inputForm.show();
                                        var $inputMobile = $('#mobile');
                                        var $inputName = $('#name');

                                        if (w < h) {
                                            $inputMobile.css({
                                                'transform': 'rotate(90deg)',
                                                'left': '18%',
                                                'top': '740px',
                                                'fontSize': '36px !important'
                                            });
                                            $inputName.css({
                                                'transform': 'rotate(90deg)',
                                                'left': '33%',
                                                'top': '740px',
                                                'fontSize': '36px !important'
                                            });
                                        }

                                        /*if (w < h) {
                                         $inputMobile.css({
                                         'transform': 'rotate(90deg)',
                                         'left': '18%',
                                         'top': '740px'
                                         });
                                         $inputName.css({
                                         'transform': 'rotate(90deg)',
                                         'left': '32%',
                                         'top': '740px'
                                         });
                                         }*/

                                        //确认和返回
                                        var imgConfirm = staticImage(loader, 'confirm', 733, 472);
                                        var imgReturn = staticImage(loader, 'return', 394, 472);
                                        var imgForm = staticImage(loader, 'form', 336, 235);

                                        staticCtr.addChild(imgConfirm);
                                        staticCtr.addChild(imgReturn);
                                        staticCtr.addChild(imgForm);

                                        var storage = window.localStorage;

                                        if (storage.nickname != '' && storage.nickname != undefined) {
                                            //console.log('!');
                                            $inputName.val(storage.nickname);
                                        }

                                        if (storage.mobile != '' && storage.mobile != undefined) {
                                            //console.log('!');
                                            $inputMobile.val(storage.mobile);
                                        }

                                        //事件监控
                                        var listenerConfirm = imgConfirm.addEventListener('mousedown', confirm);

                                        function confirm() {

                                            /*表单检验*/

                                            if ($inputName.val().length == 0) {
                                                alert('昵称不能为空！');
                                                return;
                                            }

                                            if ($inputName.val().length > 20) {
                                                alert('昵称不能超过20个字符！');
                                                return;
                                            }

                                            if ($inputMobile.val().length == 0) {
                                                alert('手机号码不能为空！');
                                                return;
                                            }

                                            if ($inputMobile.val().length != 11) {
                                                alert('请输入11位的手机号码！');
                                                return;
                                            }

                                            //var storage = window.localStorage;
                                            if (storage.mobile == '' || storage.mobile == undefined) {
                                                storage.mobile = $inputMobile.val();
                                            }

                                            if (storage.nickname == '' || storage.nickname == undefined) {
                                                storage.nickname = $inputName.val();
                                            }

                                            //playerScore = 10

                                            //点击后提交数据
                                            var data = {
                                                "extData": {
                                                    'player': player
                                                },
                                                "mobile": $inputMobile.val(),
                                                "nickname": $inputName.val(),
                                                "type": "h5",
                                                "v": playerScore
                                            };

                                            //console.log(data);

                                            //只允许点击一次，不允许重复提交
                                            imgConfirm.off('mousedown', listenerConfirm);

                                            //callback(100);

                                            //回调
                                            $.when(apis.postUserInfo(data))

                                                .then(function (result) {

                                                    //result.errCode == 0

                                                    //console.log(result);

                                                    imgConfirm.on('mousedown', listenerConfirm);

                                                    var score = result.data;

                                                    callback(score);

                                                }, function (result) {

                                                    //result.errCode != 0

                                                    //console.log(result); // result

                                                    imgConfirm.on('mousedown', listenerConfirm);

                                                    //超过三次以后查询之前积分
                                                    $.when(apis.getUserInfo($inputMobile.val()))
                                                        .then(function (result) {

                                                            var score = result.data.asset.integral;

                                                            callback(score);

                                                        }, function (result) {
                                                            //console.log(result);
                                                            //imgConfirm.on('mousedown', listenerConfirm);
                                                            //alert(result.errMsg); // Not Found
                                                            alert('无效手机号码或不存在此用户，请重新输入！');
                                                        });

                                                });

                                            //callback(playerScore);

                                            //回调函数
                                            function callback(score) {

                                                //恢复
                                                staticCtr.addChild(imgTip);
                                                //移除
                                                staticCtr.removeChild(imgConfirm);
                                                staticCtr.removeChild(imgReturn);
                                                staticCtr.removeChild(imgForm);

                                                $inputForm.hide();

                                                //积分页面
                                                var imgScore = staticImage(loader, 'score', 543, 178 - 10);
                                                var imgContinue = staticImage(loader, 'continue', 394, 472);
                                                var imgFake = staticImage(loader, 'getAward', 733, 472);

                                                //积分显示文字
                                                var textResultScore = new cjs.Text(score, "bold 36px Arial", "#e50012"),
                                                    boundsScore = textResultScore.getBounds();

                                                //根据数值的位数决定文本渲染坐标
                                                var length = score.toString().length;
                                                var value = 640;

                                                textResultScore.x = (value - length * 18) * scaleX;
                                                textResultScore.y = 390 * scaleY;
                                                textResultScore.scaleX = scaleX;
                                                textResultScore.scaleY = scaleY;

                                                staticCtr.addChild(imgScore);
                                                staticCtr.addChild(imgContinue);
                                                staticCtr.addChild(imgFake);
                                                staticCtr.addChild(textResultScore);

                                                //剩余事件
                                                imgFake.on('mousedown', function () {
                                                    window.location.href = apis.getMallEntry();
                                                });

                                                imgContinue.on('mousedown', function () {
                                                    window.location.href = 'index.html';
                                                });
                                            }


                                        }

                                        //绑定事件
                                        //imgConfirm.on('mousedown', confirm);

                                        imgReturn.on('mousedown', function () {

                                            //console.log('test');

                                            $inputForm.hide();

                                            if (player == 'tomato') {
                                                if (sign == 'win') {
                                                    staticCtr.addChild(imgTomatoResultWin);
                                                    staticCtr.addChild(imgEggResultLose);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    //staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText2);
                                                    staticCtr.addChild(textScore);

                                                    staticCtr.addChild(textResultScore);
                                                } else {
                                                    staticCtr.addChild(imgTomatoLoseLogo);

                                                    staticCtr.addChild(imgTomatoResultLose);
                                                    staticCtr.addChild(imgEggResultWin);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText);
                                                    staticCtr.addChild(textScore);
                                                }

                                            } else {
                                                if (sign == 'win') {
                                                    staticCtr.addChild(imgTomatoResultLose);
                                                    staticCtr.addChild(imgEggResultWin);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    //staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText2);
                                                    staticCtr.addChild(textScore);

                                                    staticCtr.addChild(textResultScore);
                                                } else {
                                                    staticCtr.addChild(imgEggLoseLogo);

                                                    staticCtr.addChild(imgTomatoResultWin);
                                                    staticCtr.addChild(imgEggResultLose);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText);
                                                    staticCtr.addChild(textScore);
                                                }
                                            }

                                            /*staticCtr.addChild(imgTomatoAndEgg);

                                             staticCtr.removeChild(imgConfirm);
                                             staticCtr.removeChild(imgReturn);
                                             staticCtr.removeChild(imgForm);

                                             //移除按钮
                                             staticCtr.addChild(imgRetry);
                                             staticCtr.addChild(imgGetAward);
                                             staticCtr.addChild(imgViewScore);

                                             staticCtr.addChild(textPlayer);
                                             staticCtr.addChild(imgShowText);
                                             staticCtr.addChild(textScore);*/

                                        });


                                    });

                                }, function (result) {
                                    //console.log(result);
                                    //imgConfirm.on('mousedown', listenerConfirm);
                                    //alert(result.errMsg); // Not Found
                                    //alert('无效手机号码或不存在此用户，请重新输入！');
                                    //积分显示文字
                                    var textResultScore = new cjs.Text(playerScore, "bold 36px Arial", "#e50012"),
                                        boundsScore = textResultScore.getBounds();

                                    //根据数值的位数决定文本渲染坐标
                                    var length = playerScore.toString().length;
                                    var value = 760;

                                    textResultScore.x = (value) * scaleX;
                                    textResultScore.y = 395 * scaleY;
                                    textResultScore.scaleX = scaleX;
                                    textResultScore.scaleY = scaleY;

                                    staticCtr.addChild(textResultScore);

                                    //兑换礼品事件
                                    imgGetAward.on('mousedown', function () {

                                        staticCtr.removeChild(textResultScore);
                                        staticCtr.removeChild(imgShowText2);

                                        //移除鸡蛋，番茄和炒蛋
                                        staticCtr.removeChild(imgTomatoResultWin);
                                        staticCtr.removeChild(imgEggResultLose);
                                        staticCtr.removeChild(imgEggResultWin);
                                        staticCtr.removeChild(imgTomatoResultLose);
                                        staticCtr.removeChild(imgTomatoAndEgg);

                                        //移除按钮
                                        staticCtr.removeChild(imgRetry);
                                        staticCtr.removeChild(imgGetAward);
                                        staticCtr.removeChild(imgViewScore);

                                        //staticCtr.removeChild(textPlayer);
                                        staticCtr.removeChild(imgShowText);
                                        staticCtr.removeChild(textScore);

                                        //显示输入框
                                        var $inputForm = $('.inputForm');
                                        $inputForm.show();
                                        var $inputMobile = $('#mobile');
                                        var $inputName = $('#name');

                                        if (w < h) {
                                            $inputMobile.css({
                                                'transform': 'rotate(90deg)',
                                                'left': '18%',
                                                'top': '740px',
                                                'fontSize': '36px !important'
                                            });
                                            $inputName.css({
                                                'transform': 'rotate(90deg)',
                                                'left': '33%',
                                                'top': '740px',
                                                'fontSize': '36px !important'
                                            });
                                        }

                                        //确认和返回
                                        var imgConfirm = staticImage(loader, 'confirm', 733, 472);
                                        var imgReturn = staticImage(loader, 'return', 394, 472);
                                        var imgForm = staticImage(loader, 'form', 336, 235);

                                        staticCtr.addChild(imgConfirm);
                                        staticCtr.addChild(imgReturn);
                                        staticCtr.addChild(imgForm);

                                        var storage = window.localStorage;

                                        if (storage.nickname != '' && storage.nickname != undefined) {
                                            //console.log('!');
                                            $inputName.val(storage.nickname);
                                        }

                                        if (storage.mobile != '' && storage.mobile != undefined) {
                                            //console.log('!');
                                            $inputMobile.val(storage.mobile);
                                        }

                                        //事件监控
                                        var listenerConfirm = imgConfirm.addEventListener('mousedown', confirm);

                                        function confirm() {

                                            /*表单检验*/

                                            if ($inputName.val().length == 0) {
                                                alert('昵称不能为空！');
                                                return;
                                            }

                                            if ($inputName.val().length > 20) {
                                                alert('昵称不能超过20个字符！');
                                                return;
                                            }

                                            if ($inputMobile.val().length == 0) {
                                                alert('手机号码不能为空！');
                                                return;
                                            }

                                            if ($inputMobile.val().length != 11) {
                                                alert('请输入11位的手机号码！');
                                                return;
                                            }

                                            //var storage = window.localStorage;
                                            if (storage.mobile == '' || storage.mobile == undefined) {
                                                storage.mobile = $inputMobile.val();
                                            }

                                            if (storage.nickname == '' || storage.nickname == undefined) {
                                                storage.nickname = $inputName.val();
                                            }

                                            //playerScore = 10

                                            //点击后提交数据
                                            var data = {
                                                "extData": {
                                                    'player': player
                                                },
                                                "mobile": $inputMobile.val(),
                                                "nickname": $inputName.val(),
                                                "type": "h5",
                                                "v": playerScore
                                            };

                                            //console.log(data);

                                            //只允许点击一次，不允许重复提交
                                            imgConfirm.off('mousedown', listenerConfirm);

                                            //callback(100);

                                            //回调
                                            $.when(apis.postUserInfo(data))

                                                .then(function (result) {

                                                    //result.errCode == 0

                                                    //console.log(result);

                                                    imgConfirm.on('mousedown', listenerConfirm);

                                                    var score = result.data;

                                                    callback(score);

                                                }, function (result) {

                                                    //result.errCode != 0

                                                    //console.log(result); // result

                                                    imgConfirm.on('mousedown', listenerConfirm);

                                                    //超过三次以后查询之前积分
                                                    $.when(apis.getUserInfo($inputMobile.val()))
                                                        .then(function (result) {

                                                            var score = result.data.asset.integral;

                                                            callback(score);

                                                        }, function (result) {
                                                            //console.log(result);
                                                            //imgConfirm.on('mousedown', listenerConfirm);
                                                            //alert(result.errMsg); // Not Found
                                                            alert('无效手机号码或不存在此用户，请重新输入！');
                                                        });

                                                });

                                            //callback(playerScore);

                                            //回调函数
                                            function callback(score) {

                                                //恢复
                                                staticCtr.addChild(imgTip);
                                                //移除
                                                staticCtr.removeChild(imgConfirm);
                                                staticCtr.removeChild(imgReturn);
                                                staticCtr.removeChild(imgForm);

                                                $inputForm.hide();

                                                //积分页面
                                                var imgScore = staticImage(loader, 'score', 543, 178 - 10);
                                                var imgContinue = staticImage(loader, 'continue', 394, 472);
                                                var imgFake = staticImage(loader, 'getAward', 733, 472);

                                                //积分显示文字
                                                var textResultScore = new cjs.Text(score, "bold 36px Arial", "#e50012"),
                                                    boundsScore = textResultScore.getBounds();

                                                //根据数值的位数决定文本渲染坐标
                                                var length = score.toString().length;
                                                var value = 640;

                                                textResultScore.x = (value - length * 18) * scaleX;
                                                textResultScore.y = 390 * scaleY;
                                                textResultScore.scaleX = scaleX;
                                                textResultScore.scaleY = scaleY;

                                                staticCtr.addChild(imgScore);
                                                staticCtr.addChild(imgContinue);
                                                staticCtr.addChild(imgFake);
                                                staticCtr.addChild(textResultScore);

                                                //剩余事件
                                                imgFake.on('mousedown', function () {
                                                    window.location.href = apis.getMallEntry();
                                                });

                                                imgContinue.on('mousedown', function () {
                                                    window.location.href = 'index.html';
                                                });
                                            }


                                        }

                                        //绑定事件
                                        //imgConfirm.on('mousedown', confirm);

                                        imgReturn.on('mousedown', function () {

                                            //console.log('test');

                                            $inputForm.hide();

                                            if (player == 'tomato') {
                                                if (sign == 'win') {
                                                    staticCtr.addChild(imgTomatoResultWin);
                                                    staticCtr.addChild(imgEggResultLose);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    //staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText2);
                                                    staticCtr.addChild(textScore);

                                                    staticCtr.addChild(textResultScore);
                                                } else {
                                                    staticCtr.addChild(imgTomatoLoseLogo);

                                                    staticCtr.addChild(imgTomatoResultLose);
                                                    staticCtr.addChild(imgEggResultWin);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText);
                                                    staticCtr.addChild(textScore);

                                                }

                                            } else {
                                                if (sign == 'win') {
                                                    staticCtr.addChild(imgTomatoResultLose);
                                                    staticCtr.addChild(imgEggResultWin);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    //staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText2);
                                                    staticCtr.addChild(textScore);

                                                    staticCtr.addChild(textResultScore);
                                                } else {
                                                    staticCtr.addChild(imgEggLoseLogo);

                                                    staticCtr.addChild(imgTomatoResultWin);
                                                    staticCtr.addChild(imgEggResultLose);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText);
                                                    staticCtr.addChild(textScore);
                                                }
                                            }

                                            /*staticCtr.addChild(imgTomatoAndEgg);

                                             staticCtr.removeChild(imgConfirm);
                                             staticCtr.removeChild(imgReturn);
                                             staticCtr.removeChild(imgForm);

                                             //移除按钮
                                             staticCtr.addChild(imgRetry);
                                             staticCtr.addChild(imgGetAward);
                                             staticCtr.addChild(imgViewScore);

                                             staticCtr.addChild(textPlayer);
                                             staticCtr.addChild(imgShowText);
                                             staticCtr.addChild(textScore);*/


                                        });


                                    });

                                    //查看积分事件
                                    imgViewScore.on('mousedown', function () {

                                        staticCtr.removeChild(textResultScore);
                                        staticCtr.removeChild(imgShowText2);

                                        //移除鸡蛋，番茄和炒蛋
                                        staticCtr.removeChild(imgTomatoResultWin);
                                        staticCtr.removeChild(imgEggResultLose);
                                        staticCtr.removeChild(imgEggResultWin);
                                        staticCtr.removeChild(imgTomatoResultLose);
                                        staticCtr.removeChild(imgTomatoAndEgg);

                                        //移除按钮
                                        staticCtr.removeChild(imgRetry);
                                        staticCtr.removeChild(imgGetAward);
                                        staticCtr.removeChild(imgViewScore);

                                        staticCtr.removeChild(textPlayer);
                                        staticCtr.removeChild(imgShowText);
                                        staticCtr.removeChild(textScore);

                                        //显示输入框
                                        var $inputForm = $('.inputForm');
                                        $inputForm.show();
                                        var $inputMobile = $('#mobile');
                                        var $inputName = $('#name');

                                        if (w < h) {
                                            $inputMobile.css({
                                                'transform': 'rotate(90deg)',
                                                'left': '18%',
                                                'top': '740px',
                                                'fontSize': '36px !important'
                                            });
                                            $inputName.css({
                                                'transform': 'rotate(90deg)',
                                                'left': '33%',
                                                'top': '740px',
                                                'fontSize': '36px !important'
                                            });
                                        }

                                        /*if (w < h) {
                                         $inputMobile.css({
                                         'transform': 'rotate(90deg)',
                                         'left': '18%',
                                         'top': '740px'
                                         });
                                         $inputName.css({
                                         'transform': 'rotate(90deg)',
                                         'left': '32%',
                                         'top': '740px'
                                         });
                                         }*/

                                        //确认和返回
                                        var imgConfirm = staticImage(loader, 'confirm', 733, 472);
                                        var imgReturn = staticImage(loader, 'return', 394, 472);
                                        var imgForm = staticImage(loader, 'form', 336, 235);

                                        staticCtr.addChild(imgConfirm);
                                        staticCtr.addChild(imgReturn);
                                        staticCtr.addChild(imgForm);

                                        var storage = window.localStorage;

                                        if (storage.nickname != '' && storage.nickname != undefined) {
                                            //console.log('!');
                                            $inputName.val(storage.nickname);
                                        }

                                        if (storage.mobile != '' && storage.mobile != undefined) {
                                            //console.log('!');
                                            $inputMobile.val(storage.mobile);
                                        }

                                        //事件监控
                                        var listenerConfirm = imgConfirm.addEventListener('mousedown', confirm);

                                        function confirm() {

                                            /*表单检验*/

                                            if ($inputName.val().length == 0) {
                                                alert('昵称不能为空！');
                                                return;
                                            }

                                            if ($inputName.val().length > 20) {
                                                alert('昵称不能超过20个字符！');
                                                return;
                                            }

                                            if ($inputMobile.val().length == 0) {
                                                alert('手机号码不能为空！');
                                                return;
                                            }

                                            if ($inputMobile.val().length != 11) {
                                                alert('请输入11位的手机号码！');
                                                return;
                                            }

                                            //var storage = window.localStorage;
                                            if (storage.mobile == '' || storage.mobile == undefined) {
                                                storage.mobile = $inputMobile.val();
                                            }

                                            if (storage.nickname == '' || storage.nickname == undefined) {
                                                storage.nickname = $inputName.val();
                                            }

                                            //playerScore = 10

                                            //点击后提交数据
                                            var data = {
                                                "extData": {
                                                    'player': player
                                                },
                                                "mobile": $inputMobile.val(),
                                                "nickname": $inputName.val(),
                                                "type": "h5",
                                                "v": playerScore
                                            };

                                            //console.log(data);

                                            //只允许点击一次，不允许重复提交
                                            imgConfirm.off('mousedown', listenerConfirm);

                                            //callback(100);

                                            //回调
                                            $.when(apis.postUserInfo(data))

                                                .then(function (result) {

                                                    //result.errCode == 0

                                                    //console.log(result);

                                                    imgConfirm.on('mousedown', listenerConfirm);

                                                    var score = result.data;

                                                    callback(score);

                                                }, function (result) {

                                                    //result.errCode != 0

                                                    //console.log(result); // result

                                                    imgConfirm.on('mousedown', listenerConfirm);

                                                    //超过三次以后查询之前积分
                                                    $.when(apis.getUserInfo($inputMobile.val()))
                                                        .then(function (result) {

                                                            var score = result.data.asset.integral;

                                                            callback(score);

                                                        }, function (result) {
                                                            //console.log(result);
                                                            //imgConfirm.on('mousedown', listenerConfirm);
                                                            //alert(result.errMsg); // Not Found
                                                            alert('无效手机号码或不存在此用户，请重新输入！');
                                                        });

                                                });

                                            //callback(playerScore);

                                            //回调函数
                                            function callback(score) {

                                                //恢复
                                                staticCtr.addChild(imgTip);
                                                //移除
                                                staticCtr.removeChild(imgConfirm);
                                                staticCtr.removeChild(imgReturn);
                                                staticCtr.removeChild(imgForm);

                                                $inputForm.hide();

                                                //积分页面
                                                var imgScore = staticImage(loader, 'score', 543, 178 - 10);
                                                var imgContinue = staticImage(loader, 'continue', 394, 472);
                                                var imgFake = staticImage(loader, 'getAward', 733, 472);

                                                //积分显示文字
                                                var textResultScore = new cjs.Text(score, "bold 36px Arial", "#e50012"),
                                                    boundsScore = textResultScore.getBounds();

                                                //根据数值的位数决定文本渲染坐标
                                                var length = score.toString().length;
                                                var value = 640;

                                                textResultScore.x = (value - length * 18) * scaleX;
                                                textResultScore.y = 390 * scaleY;
                                                textResultScore.scaleX = scaleX;
                                                textResultScore.scaleY = scaleY;

                                                staticCtr.addChild(imgScore);
                                                staticCtr.addChild(imgContinue);
                                                staticCtr.addChild(imgFake);
                                                staticCtr.addChild(textResultScore);

                                                //剩余事件
                                                imgFake.on('mousedown', function () {
                                                    window.location.href = apis.getMallEntry();
                                                });

                                                imgContinue.on('mousedown', function () {
                                                    window.location.href = 'index.html';
                                                });
                                            }


                                        }

                                        //绑定事件
                                        //imgConfirm.on('mousedown', confirm);

                                        imgReturn.on('mousedown', function () {

                                            //console.log('test');

                                            $inputForm.hide();

                                            if (player == 'tomato') {
                                                if (sign == 'win') {
                                                    staticCtr.addChild(imgTomatoResultWin);
                                                    staticCtr.addChild(imgEggResultLose);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    //staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText2);
                                                    staticCtr.addChild(textScore);

                                                    staticCtr.addChild(textResultScore);
                                                } else {
                                                    staticCtr.addChild(imgTomatoLoseLogo);

                                                    staticCtr.addChild(imgTomatoResultLose);
                                                    staticCtr.addChild(imgEggResultWin);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText);
                                                    staticCtr.addChild(textScore);
                                                }

                                            } else {
                                                if (sign == 'win') {
                                                    staticCtr.addChild(imgTomatoResultLose);
                                                    staticCtr.addChild(imgEggResultWin);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    //staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText2);
                                                    staticCtr.addChild(textScore);

                                                    staticCtr.addChild(textResultScore);
                                                } else {
                                                    staticCtr.addChild(imgEggLoseLogo);

                                                    staticCtr.addChild(imgTomatoResultWin);
                                                    staticCtr.addChild(imgEggResultLose);

                                                    staticCtr.addChild(imgTomatoAndEgg);

                                                    staticCtr.removeChild(imgConfirm);
                                                    staticCtr.removeChild(imgReturn);
                                                    staticCtr.removeChild(imgForm);

                                                    //移除按钮
                                                    staticCtr.addChild(imgRetry);
                                                    staticCtr.addChild(imgGetAward);
                                                    staticCtr.addChild(imgViewScore);

                                                    staticCtr.addChild(textPlayer);
                                                    staticCtr.addChild(imgShowText);
                                                    staticCtr.addChild(textScore);
                                                }
                                            }

                                            /*staticCtr.addChild(imgTomatoAndEgg);

                                             staticCtr.removeChild(imgConfirm);
                                             staticCtr.removeChild(imgReturn);
                                             staticCtr.removeChild(imgForm);

                                             //移除按钮
                                             staticCtr.addChild(imgRetry);
                                             staticCtr.addChild(imgGetAward);
                                             staticCtr.addChild(imgViewScore);

                                             staticCtr.addChild(textPlayer);
                                             staticCtr.addChild(imgShowText);
                                             staticCtr.addChild(textScore);*/

                                        });


                                    });
                                });
                        } else {
                            //积分显示文字
                            var textResultScore = new cjs.Text(playerScore, "bold 36px Arial", "#e50012"),
                                boundsScore = textResultScore.getBounds();

                            //根据数值的位数决定文本渲染坐标
                            var length = playerScore.toString().length;
                            var value = 760;

                            textResultScore.x = (value) * scaleX;
                            textResultScore.y = 395 * scaleY;
                            textResultScore.scaleX = scaleX;
                            textResultScore.scaleY = scaleY;

                            staticCtr.addChild(textResultScore);

                            //兑换礼品事件
                            imgGetAward.on('mousedown', function () {

                                staticCtr.removeChild(textResultScore);
                                staticCtr.removeChild(imgShowText2);

                                //移除鸡蛋，番茄和炒蛋
                                staticCtr.removeChild(imgTomatoResultWin);
                                staticCtr.removeChild(imgEggResultLose);
                                staticCtr.removeChild(imgEggResultWin);
                                staticCtr.removeChild(imgTomatoResultLose);
                                staticCtr.removeChild(imgTomatoAndEgg);

                                //移除按钮
                                staticCtr.removeChild(imgRetry);
                                staticCtr.removeChild(imgGetAward);
                                staticCtr.removeChild(imgViewScore);

                                //staticCtr.removeChild(textPlayer);
                                staticCtr.removeChild(imgShowText);
                                staticCtr.removeChild(textScore);

                                //显示输入框
                                var $inputForm = $('.inputForm');
                                $inputForm.show();
                                var $inputMobile = $('#mobile');
                                var $inputName = $('#name');

                                if (w < h) {
                                    $inputMobile.css({
                                        'transform': 'rotate(90deg)',
                                        'left': '18%',
                                        'top': '740px',
                                        'fontSize': '36px !important'
                                    });
                                    $inputName.css({
                                        'transform': 'rotate(90deg)',
                                        'left': '33%',
                                        'top': '740px',
                                        'fontSize': '36px !important'
                                    });
                                }

                                //确认和返回
                                var imgConfirm = staticImage(loader, 'confirm', 733, 472);
                                var imgReturn = staticImage(loader, 'return', 394, 472);
                                var imgForm = staticImage(loader, 'form', 336, 235);

                                staticCtr.addChild(imgConfirm);
                                staticCtr.addChild(imgReturn);
                                staticCtr.addChild(imgForm);

                                var storage = window.localStorage;

                                if (storage.nickname != '' && storage.nickname != undefined) {
                                    //console.log('!');
                                    $inputName.val(storage.nickname);
                                }

                                if (storage.mobile != '' && storage.mobile != undefined) {
                                    //console.log('!');
                                    $inputMobile.val(storage.mobile);
                                }

                                //事件监控
                                var listenerConfirm = imgConfirm.addEventListener('mousedown', confirm);

                                function confirm() {

                                    /*表单检验*/

                                    if ($inputName.val().length == 0) {
                                        alert('昵称不能为空！');
                                        return;
                                    }

                                    if ($inputName.val().length > 20) {
                                        alert('昵称不能超过20个字符！');
                                        return;
                                    }

                                    if ($inputMobile.val().length == 0) {
                                        alert('手机号码不能为空！');
                                        return;
                                    }

                                    if ($inputMobile.val().length != 11) {
                                        alert('请输入11位的手机号码！');
                                        return;
                                    }

                                    //var storage = window.localStorage;
                                    if (storage.mobile == '' || storage.mobile == undefined) {
                                        storage.mobile = $inputMobile.val();
                                    }

                                    if (storage.nickname == '' || storage.nickname == undefined) {
                                        storage.nickname = $inputName.val();
                                    }

                                    //playerScore = 10

                                    //点击后提交数据
                                    var data = {
                                        "extData": {
                                            'player': player
                                        },
                                        "mobile": $inputMobile.val(),
                                        "nickname": $inputName.val(),
                                        "type": "h5",
                                        "v": playerScore
                                    };

                                    //console.log(data);

                                    //只允许点击一次，不允许重复提交
                                    imgConfirm.off('mousedown', listenerConfirm);

                                    //callback(100);

                                    //回调
                                    $.when(apis.postUserInfo(data))

                                        .then(function (result) {

                                            //result.errCode == 0

                                            //console.log(result);

                                            imgConfirm.on('mousedown', listenerConfirm);

                                            var score = result.data;

                                            callback(score);

                                        }, function (result) {

                                            //result.errCode != 0

                                            //console.log(result); // result

                                            imgConfirm.on('mousedown', listenerConfirm);

                                            //超过三次以后查询之前积分
                                            $.when(apis.getUserInfo($inputMobile.val()))
                                                .then(function (result) {

                                                    var score = result.data.asset.integral;

                                                    callback(score);

                                                }, function (result) {
                                                    //console.log(result);
                                                    //imgConfirm.on('mousedown', listenerConfirm);
                                                    //alert(result.errMsg); // Not Found
                                                    alert('无效手机号码或不存在此用户，请重新输入！');
                                                });

                                        });

                                    //callback(playerScore);

                                    //回调函数
                                    function callback(score) {

                                        //恢复
                                        staticCtr.addChild(imgTip);
                                        //移除
                                        staticCtr.removeChild(imgConfirm);
                                        staticCtr.removeChild(imgReturn);
                                        staticCtr.removeChild(imgForm);

                                        $inputForm.hide();

                                        //积分页面
                                        var imgScore = staticImage(loader, 'score', 543, 178 - 10);
                                        var imgContinue = staticImage(loader, 'continue', 394, 472);
                                        var imgFake = staticImage(loader, 'getAward', 733, 472);

                                        //积分显示文字
                                        var textResultScore = new cjs.Text(score, "bold 36px Arial", "#e50012"),
                                            boundsScore = textResultScore.getBounds();

                                        //根据数值的位数决定文本渲染坐标
                                        var length = score.toString().length;
                                        var value = 640;

                                        textResultScore.x = (value - length * 18) * scaleX;
                                        textResultScore.y = 390 * scaleY;
                                        textResultScore.scaleX = scaleX;
                                        textResultScore.scaleY = scaleY;

                                        staticCtr.addChild(imgScore);
                                        staticCtr.addChild(imgContinue);
                                        staticCtr.addChild(imgFake);
                                        staticCtr.addChild(textResultScore);

                                        //剩余事件
                                        imgFake.on('mousedown', function () {
                                            window.location.href = apis.getMallEntry();
                                        });

                                        imgContinue.on('mousedown', function () {
                                            window.location.href = 'index.html';
                                        });
                                    }


                                }

                                //绑定事件
                                //imgConfirm.on('mousedown', confirm);

                                imgReturn.on('mousedown', function () {

                                    //console.log('test');

                                    $inputForm.hide();

                                    if (player == 'tomato') {
                                        if (sign == 'win') {
                                            staticCtr.addChild(imgTomatoResultWin);
                                            staticCtr.addChild(imgEggResultLose);

                                            staticCtr.addChild(imgTomatoAndEgg);

                                            staticCtr.removeChild(imgConfirm);
                                            staticCtr.removeChild(imgReturn);
                                            staticCtr.removeChild(imgForm);

                                            //移除按钮
                                            staticCtr.addChild(imgRetry);
                                            staticCtr.addChild(imgGetAward);
                                            staticCtr.addChild(imgViewScore);

                                            //staticCtr.addChild(textPlayer);
                                            staticCtr.addChild(imgShowText2);
                                            staticCtr.addChild(textScore);

                                            staticCtr.addChild(textResultScore);
                                        } else {
                                            staticCtr.addChild(imgTomatoLoseLogo);

                                            staticCtr.addChild(imgTomatoResultLose);
                                            staticCtr.addChild(imgEggResultWin);

                                            staticCtr.addChild(imgTomatoAndEgg);

                                            staticCtr.removeChild(imgConfirm);
                                            staticCtr.removeChild(imgReturn);
                                            staticCtr.removeChild(imgForm);

                                            //移除按钮
                                            staticCtr.addChild(imgRetry);
                                            staticCtr.addChild(imgGetAward);
                                            staticCtr.addChild(imgViewScore);

                                            staticCtr.addChild(textPlayer);
                                            staticCtr.addChild(imgShowText);
                                            staticCtr.addChild(textScore);

                                        }

                                    } else {
                                        if (sign == 'win') {
                                            staticCtr.addChild(imgTomatoResultLose);
                                            staticCtr.addChild(imgEggResultWin);

                                            staticCtr.addChild(imgTomatoAndEgg);

                                            staticCtr.removeChild(imgConfirm);
                                            staticCtr.removeChild(imgReturn);
                                            staticCtr.removeChild(imgForm);

                                            //移除按钮
                                            staticCtr.addChild(imgRetry);
                                            staticCtr.addChild(imgGetAward);
                                            staticCtr.addChild(imgViewScore);

                                            //staticCtr.addChild(textPlayer);
                                            staticCtr.addChild(imgShowText2);
                                            staticCtr.addChild(textScore);

                                            staticCtr.addChild(textResultScore);
                                        } else {
                                            staticCtr.addChild(imgEggLoseLogo);

                                            staticCtr.addChild(imgTomatoResultWin);
                                            staticCtr.addChild(imgEggResultLose);

                                            staticCtr.addChild(imgTomatoAndEgg);

                                            staticCtr.removeChild(imgConfirm);
                                            staticCtr.removeChild(imgReturn);
                                            staticCtr.removeChild(imgForm);

                                            //移除按钮
                                            staticCtr.addChild(imgRetry);
                                            staticCtr.addChild(imgGetAward);
                                            staticCtr.addChild(imgViewScore);

                                            staticCtr.addChild(textPlayer);
                                            staticCtr.addChild(imgShowText);
                                            staticCtr.addChild(textScore);
                                        }
                                    }

                                    /*staticCtr.addChild(imgTomatoAndEgg);

                                     staticCtr.removeChild(imgConfirm);
                                     staticCtr.removeChild(imgReturn);
                                     staticCtr.removeChild(imgForm);

                                     //移除按钮
                                     staticCtr.addChild(imgRetry);
                                     staticCtr.addChild(imgGetAward);
                                     staticCtr.addChild(imgViewScore);

                                     staticCtr.addChild(textPlayer);
                                     staticCtr.addChild(imgShowText);
                                     staticCtr.addChild(textScore);*/


                                });


                            });

                            //查看积分事件
                            imgViewScore.on('mousedown', function () {

                                staticCtr.removeChild(textResultScore);
                                staticCtr.removeChild(imgShowText2);

                                //移除鸡蛋，番茄和炒蛋
                                staticCtr.removeChild(imgTomatoResultWin);
                                staticCtr.removeChild(imgEggResultLose);
                                staticCtr.removeChild(imgEggResultWin);
                                staticCtr.removeChild(imgTomatoResultLose);
                                staticCtr.removeChild(imgTomatoAndEgg);

                                //移除按钮
                                staticCtr.removeChild(imgRetry);
                                staticCtr.removeChild(imgGetAward);
                                staticCtr.removeChild(imgViewScore);

                                staticCtr.removeChild(textPlayer);
                                staticCtr.removeChild(imgShowText);
                                staticCtr.removeChild(textScore);

                                //显示输入框
                                var $inputForm = $('.inputForm');
                                $inputForm.show();
                                var $inputMobile = $('#mobile');
                                var $inputName = $('#name');

                                if (w < h) {
                                    $inputMobile.css({
                                        'transform': 'rotate(90deg)',
                                        'left': '18%',
                                        'top': '740px',
                                        'fontSize': '36px !important'
                                    });
                                    $inputName.css({
                                        'transform': 'rotate(90deg)',
                                        'left': '33%',
                                        'top': '740px',
                                        'fontSize': '36px !important'
                                    });
                                }

                                /*if (w < h) {
                                 $inputMobile.css({
                                 'transform': 'rotate(90deg)',
                                 'left': '18%',
                                 'top': '740px'
                                 });
                                 $inputName.css({
                                 'transform': 'rotate(90deg)',
                                 'left': '32%',
                                 'top': '740px'
                                 });
                                 }*/

                                //确认和返回
                                var imgConfirm = staticImage(loader, 'confirm', 733, 472);
                                var imgReturn = staticImage(loader, 'return', 394, 472);
                                var imgForm = staticImage(loader, 'form', 336, 235);

                                staticCtr.addChild(imgConfirm);
                                staticCtr.addChild(imgReturn);
                                staticCtr.addChild(imgForm);

                                var storage = window.localStorage;

                                if (storage.nickname != '' && storage.nickname != undefined) {
                                    //console.log('!');
                                    $inputName.val(storage.nickname);
                                }

                                if (storage.mobile != '' && storage.mobile != undefined) {
                                    //console.log('!');
                                    $inputMobile.val(storage.mobile);
                                }

                                //事件监控
                                var listenerConfirm = imgConfirm.addEventListener('mousedown', confirm);

                                function confirm() {

                                    /*表单检验*/

                                    if ($inputName.val().length == 0) {
                                        alert('昵称不能为空！');
                                        return;
                                    }

                                    if ($inputName.val().length > 20) {
                                        alert('昵称不能超过20个字符！');
                                        return;
                                    }

                                    if ($inputMobile.val().length == 0) {
                                        alert('手机号码不能为空！');
                                        return;
                                    }

                                    if ($inputMobile.val().length != 11) {
                                        alert('请输入11位的手机号码！');
                                        return;
                                    }

                                    //var storage = window.localStorage;
                                    if (storage.mobile == '' || storage.mobile == undefined) {
                                        storage.mobile = $inputMobile.val();
                                    }

                                    if (storage.nickname == '' || storage.nickname == undefined) {
                                        storage.nickname = $inputName.val();
                                    }

                                    //playerScore = 10

                                    //点击后提交数据
                                    var data = {
                                        "extData": {
                                            'player': player
                                        },
                                        "mobile": $inputMobile.val(),
                                        "nickname": $inputName.val(),
                                        "type": "h5",
                                        "v": playerScore
                                    };

                                    //console.log(data);

                                    //只允许点击一次，不允许重复提交
                                    imgConfirm.off('mousedown', listenerConfirm);

                                    //callback(100);

                                    //回调
                                    $.when(apis.postUserInfo(data))

                                        .then(function (result) {

                                            //result.errCode == 0

                                            //console.log(result);

                                            imgConfirm.on('mousedown', listenerConfirm);

                                            var score = result.data;

                                            callback(score);

                                        }, function (result) {

                                            //result.errCode != 0

                                            //console.log(result); // result

                                            imgConfirm.on('mousedown', listenerConfirm);

                                            //超过三次以后查询之前积分
                                            $.when(apis.getUserInfo($inputMobile.val()))
                                                .then(function (result) {

                                                    var score = result.data.asset.integral;

                                                    callback(score);

                                                }, function (result) {
                                                    //console.log(result);
                                                    //imgConfirm.on('mousedown', listenerConfirm);
                                                    //alert(result.errMsg); // Not Found
                                                    alert('无效手机号码或不存在此用户，请重新输入！');
                                                });

                                        });

                                    //callback(playerScore);

                                    //回调函数
                                    function callback(score) {

                                        //恢复
                                        staticCtr.addChild(imgTip);
                                        //移除
                                        staticCtr.removeChild(imgConfirm);
                                        staticCtr.removeChild(imgReturn);
                                        staticCtr.removeChild(imgForm);

                                        $inputForm.hide();

                                        //积分页面
                                        var imgScore = staticImage(loader, 'score', 543, 178 - 10);
                                        var imgContinue = staticImage(loader, 'continue', 394, 472);
                                        var imgFake = staticImage(loader, 'getAward', 733, 472);

                                        //积分显示文字
                                        var textResultScore = new cjs.Text(score, "bold 36px Arial", "#e50012"),
                                            boundsScore = textResultScore.getBounds();

                                        //根据数值的位数决定文本渲染坐标
                                        var length = score.toString().length;
                                        var value = 640;

                                        textResultScore.x = (value - length * 18) * scaleX;
                                        textResultScore.y = 390 * scaleY;
                                        textResultScore.scaleX = scaleX;
                                        textResultScore.scaleY = scaleY;

                                        staticCtr.addChild(imgScore);
                                        staticCtr.addChild(imgContinue);
                                        staticCtr.addChild(imgFake);
                                        staticCtr.addChild(textResultScore);

                                        //剩余事件
                                        imgFake.on('mousedown', function () {
                                            window.location.href = apis.getMallEntry();
                                        });

                                        imgContinue.on('mousedown', function () {
                                            window.location.href = 'index.html';
                                        });
                                    }


                                }

                                //绑定事件
                                //imgConfirm.on('mousedown', confirm);

                                imgReturn.on('mousedown', function () {

                                    //console.log('test');

                                    $inputForm.hide();

                                    if (player == 'tomato') {
                                        if (sign == 'win') {
                                            staticCtr.addChild(imgTomatoResultWin);
                                            staticCtr.addChild(imgEggResultLose);

                                            staticCtr.addChild(imgTomatoAndEgg);

                                            staticCtr.removeChild(imgConfirm);
                                            staticCtr.removeChild(imgReturn);
                                            staticCtr.removeChild(imgForm);

                                            //移除按钮
                                            staticCtr.addChild(imgRetry);
                                            staticCtr.addChild(imgGetAward);
                                            staticCtr.addChild(imgViewScore);

                                            //staticCtr.addChild(textPlayer);
                                            staticCtr.addChild(imgShowText2);
                                            staticCtr.addChild(textScore);

                                            staticCtr.addChild(textResultScore);
                                        } else {
                                            staticCtr.addChild(imgTomatoLoseLogo);

                                            staticCtr.addChild(imgTomatoResultLose);
                                            staticCtr.addChild(imgEggResultWin);

                                            staticCtr.addChild(imgTomatoAndEgg);

                                            staticCtr.removeChild(imgConfirm);
                                            staticCtr.removeChild(imgReturn);
                                            staticCtr.removeChild(imgForm);

                                            //移除按钮
                                            staticCtr.addChild(imgRetry);
                                            staticCtr.addChild(imgGetAward);
                                            staticCtr.addChild(imgViewScore);

                                            staticCtr.addChild(textPlayer);
                                            staticCtr.addChild(imgShowText);
                                            staticCtr.addChild(textScore);
                                        }

                                    } else {
                                        if (sign == 'win') {
                                            staticCtr.addChild(imgTomatoResultLose);
                                            staticCtr.addChild(imgEggResultWin);

                                            staticCtr.addChild(imgTomatoAndEgg);

                                            staticCtr.removeChild(imgConfirm);
                                            staticCtr.removeChild(imgReturn);
                                            staticCtr.removeChild(imgForm);

                                            //移除按钮
                                            staticCtr.addChild(imgRetry);
                                            staticCtr.addChild(imgGetAward);
                                            staticCtr.addChild(imgViewScore);

                                            //staticCtr.addChild(textPlayer);
                                            staticCtr.addChild(imgShowText2);
                                            staticCtr.addChild(textScore);

                                            staticCtr.addChild(textResultScore);
                                        } else {
                                            staticCtr.addChild(imgEggLoseLogo);

                                            staticCtr.addChild(imgTomatoResultWin);
                                            staticCtr.addChild(imgEggResultLose);

                                            staticCtr.addChild(imgTomatoAndEgg);

                                            staticCtr.removeChild(imgConfirm);
                                            staticCtr.removeChild(imgReturn);
                                            staticCtr.removeChild(imgForm);

                                            //移除按钮
                                            staticCtr.addChild(imgRetry);
                                            staticCtr.addChild(imgGetAward);
                                            staticCtr.addChild(imgViewScore);

                                            staticCtr.addChild(textPlayer);
                                            staticCtr.addChild(imgShowText);
                                            staticCtr.addChild(textScore);
                                        }
                                    }

                                    /*staticCtr.addChild(imgTomatoAndEgg);

                                     staticCtr.removeChild(imgConfirm);
                                     staticCtr.removeChild(imgReturn);
                                     staticCtr.removeChild(imgForm);

                                     //移除按钮
                                     staticCtr.addChild(imgRetry);
                                     staticCtr.addChild(imgGetAward);
                                     staticCtr.addChild(imgViewScore);

                                     staticCtr.addChild(textPlayer);
                                     staticCtr.addChild(imgShowText);
                                     staticCtr.addChild(textScore);*/

                                });


                            });
                        }


                    } else {

                        imgResultBg = staticImage(loader, 'playerLoseBg', 0, 0);
                        imgGetAward = staticImage(loader, 'getAward', 566, 472);
                        imgViewScore = staticImage(loader, 'viewScore', 793, 472);

                        //imgGetAward = staticImage(loader, 'getAwardDisabled', 566, 472);
                        //imgViewScore = staticImage(loader, 'viewScoreDisabled', 793, 472);
                        var imgTomatoLoseLogo = staticImage(loader, 'tomatoLoseLogo', 461, 182);
                        var imgEggLoseLogo = staticImage(loader, 'eggLoseLogo', 481, 162);

                        //  绘制文字
                        imgShowText = staticImage(loader, 'showLoseText', 330, 327);

                        staticCtr.addChild(imgResultBg);
                        staticCtr.addChild(imgRetry);
                        staticCtr.addChild(imgGetAward);
                        staticCtr.addChild(imgViewScore);
                        staticCtr.addChild(imgShowText);

                        staticCtr.addChild(textComputer);

                        if (player == 'tomato') {
                            staticCtr.addChild(imgTomatoLoseLogo);

                            staticCtr.addChild(imgTomatoResultLose);
                            staticCtr.addChild(imgEggResultWin);
                        } else {
                            staticCtr.addChild(imgEggLoseLogo);

                            staticCtr.addChild(imgTomatoResultWin);
                            staticCtr.addChild(imgEggResultLose);
                        }

                        //staticCtr.addChild(imgqrCode);
                        staticCtr.addChild(imgText);

                        //兑换礼品事件
                        imgGetAward.on('mousedown', function () {
                            window.location.href = apis.getMallEntry();
                        });
                        /*imgGetAward.on('mousedown', function () {

                         staticCtr.removeChild(imgTomatoLoseLogo);
                         staticCtr.removeChild(imgEggLoseLogo);

                         //移除鸡蛋，番茄和炒蛋
                         staticCtr.removeChild(imgTomatoResultWin);
                         staticCtr.removeChild(imgEggResultLose);
                         staticCtr.removeChild(imgEggResultWin);
                         staticCtr.removeChild(imgTomatoResultLose);
                         staticCtr.removeChild(imgTomatoAndEgg);

                         //移除按钮
                         staticCtr.removeChild(imgRetry);
                         staticCtr.removeChild(imgGetAward);
                         staticCtr.removeChild(imgViewScore);

                         staticCtr.removeChild(textComputer);
                         staticCtr.removeChild(imgShowText);
                         //staticCtr.removeChild(textScore);

                         /!*!//提示显示文字
                         var textInputName = new createjs.Text('请输入姓名', "bold 36px Arial", "#e50012"),
                         boundsInputName = textInputName.getBounds();

                         textInputName.x = 320 * scaleX;
                         textInputName.y = 330 * scaleY;
                         textInputName.scaleX = scaleX;
                         textInputName.scaleY = scaleY;

                         //提示显示文字
                         var textInputMobile = new createjs.Text('请输入手机号', "bold 36px Arial", "#e50012"),
                         boundsMobileInput = textInputMobile.getBounds();

                         textInputMobile.x = 320 * scaleX;
                         textInputMobile.y = 390 * scaleY;
                         textInputMobile.scaleX = scaleX;
                         textInputMobile.scaleY = scaleY;

                         staticCtr.addChild(textInputName);
                         staticCtr.addChild(textInputMobile);*!/

                         //显示输入框
                         var $inputForm = $('.inputForm');
                         $inputForm.show();
                         var $inputMobile = $('#mobile');
                         var $inputName = $('#name');

                         if (w < h) {
                         $inputMobile.css({
                         'transform': 'rotate(90deg)',
                         'left': '18%',
                         'top': '740px'
                         });
                         $inputName.css({
                         'transform': 'rotate(90deg)',
                         'left': '32%',
                         'top': '740px'
                         });

                         }

                         //确认和返回
                         var imgConfirm = staticImage(loader, 'confirm', 733, 472);
                         var imgReturn = staticImage(loader, 'return', 394, 472);
                         var imgForm = staticImage(loader, 'form', 336, 235);

                         staticCtr.addChild(imgConfirm);
                         staticCtr.addChild(imgReturn);
                         staticCtr.addChild(imgForm);

                         var storage = window.localStorage;

                         if (storage.nickname != '' && storage.nickname != undefined){
                         //console.log('!');
                         $inputName.val(storage.nickname);
                         }

                         if (storage.mobile != '' && storage.mobile != undefined){
                         //console.log('!');
                         $inputMobile.val(storage.mobile);
                         }

                         //事件监控
                         var listenerConfirm = imgConfirm.addEventListener('mousedown', confirm);

                         function confirm() {

                         /!*表单检验*!/

                         if ($inputName.val().length == 0) {
                         alert('昵称不能为空！');
                         return;
                         }

                         if ($inputName.val().length > 20) {
                         alert('昵称不能超过20个字符！');
                         return;
                         }

                         if ($inputMobile.val().length == 0) {
                         alert('手机号码不能为空！');
                         return;
                         }

                         if ($inputMobile.val().length != 11) {
                         alert('请输入11位的手机号码！');
                         return;
                         }

                         //var storage = window.localStorage;
                         if (storage.mobile == '' || storage.mobile == undefined){
                         storage.mobile = $inputMobile.val();
                         }

                         if (storage.nickname == '' || storage.nickname == undefined){
                         storage.nickname = $inputName.val();
                         }

                         //playerScore = 10

                         //点击后提交数据
                         var data = {
                         "extData": {
                         'player': player
                         },
                         "mobile": $inputMobile.val(),
                         "nickname": $inputName.val(),
                         "type": "h5",
                         "v": playerScore
                         };

                         //console.log(data);

                         //只允许点击一次，不允许重复提交
                         imgConfirm.off('mousedown', listenerConfirm);

                         //callback(100);

                         //输的情况下查询之前积分不算进参与次数
                         $.when(apis.getUserInfo($inputMobile.val()))
                         .then(function (result) {

                         //console.log(result);

                         imgConfirm.on('mousedown', listenerConfirm);

                         var score = result.data.balance;

                         callback(score);

                         }, function (result) {
                         //console.log(result);
                         imgConfirm.on('mousedown', listenerConfirm);
                         //alert(result.errMsg); // Not Found
                         alert('无效手机号码或不存在此用户，请重新输入！');
                         });

                         //回调
                         /!*$.when(apis.postUserInfo(data))

                         .then(function (result) {

                         //result.errCode == 0

                         console.log(result);

                         imgConfirm.on('mousedown', listenerConfirm);

                         var score = result.data;

                         callback(score);

                         }, function (result) {

                         //result.errCode != 0

                         console.log(result); // result

                         imgConfirm.on('mousedown', listenerConfirm);



                         });*!/

                         //callback(playerScore);

                         //回调函数
                         function callback(score) {

                         staticCtr.addChild(imgTip);
                         //移除
                         staticCtr.removeChild(imgConfirm);
                         staticCtr.removeChild(imgReturn);
                         staticCtr.removeChild(imgForm);

                         $inputForm.hide();

                         //积分页面
                         var imgScore = staticImage(loader, 'score', 543, 178);
                         var imgContinue = staticImage(loader, 'continue', 394, 472);
                         var imgFake = staticImage(loader, 'getAward', 733, 472);

                         //积分显示文字
                         var textResultScore = new cjs.Text(score, "bold 36px Arial", "#e50012"),
                         boundsScore = textResultScore.getBounds();

                         //根据数值的位数决定文本渲染坐标
                         var length = score.toString().length;
                         var value = 640;

                         textResultScore.x = (value - length * 18) * scaleX;
                         textResultScore.y = 390 * scaleY;
                         textResultScore.scaleX = scaleX;
                         textResultScore.scaleY = scaleY;

                         staticCtr.addChild(imgScore);
                         staticCtr.addChild(imgContinue);
                         staticCtr.addChild(imgFake);
                         staticCtr.addChild(textResultScore);

                         //剩余事件
                         imgFake.on('mousedown', function () {
                         window.location.href = apis.getMallEntry();
                         });

                         imgContinue.on('mousedown', function () {
                         window.location.href = 'index.html';
                         });
                         }


                         }

                         //绑定事件
                         //imgConfirm.on('mousedown', confirm);

                         imgReturn.on('mousedown', function () {

                         //console.log('test');

                         $inputForm.hide();

                         if (player == 'tomato') {
                         if (sign == 'win') {
                         staticCtr.addChild(imgTomatoResultWin);
                         staticCtr.addChild(imgEggResultLose);
                         } else {
                         staticCtr.addChild(imgTomatoLoseLogo);

                         staticCtr.addChild(imgTomatoResultLose);
                         staticCtr.addChild(imgEggResultWin);
                         }

                         } else {
                         if (sign == 'win') {
                         staticCtr.addChild(imgTomatoResultLose);
                         staticCtr.addChild(imgEggResultWin);
                         } else {
                         staticCtr.addChild(imgEggLoseLogo);

                         staticCtr.addChild(imgTomatoResultWin);
                         staticCtr.addChild(imgEggResultLose);
                         }
                         }

                         staticCtr.addChild(imgTomatoAndEgg);

                         staticCtr.removeChild(imgConfirm);
                         staticCtr.removeChild(imgReturn);
                         staticCtr.removeChild(imgForm);

                         //移除按钮
                         staticCtr.addChild(imgRetry);
                         staticCtr.addChild(imgGetAward);
                         staticCtr.addChild(imgViewScore);

                         //staticCtr.addChild(textPlayer);
                         staticCtr.addChild(imgShowText);
                         //staticCtr.addChild(textScore);

                         staticCtr.addChild(textComputer);

                         });


                         });*/

                        //查看积分事件
                        imgViewScore.on('mousedown', function () {
                            window.location.href = apis.getMallEntry();
                        });
                        /*imgViewScore.on('mousedown', function () {

                         staticCtr.removeChild(imgTomatoLoseLogo);
                         staticCtr.removeChild(imgEggLoseLogo);

                         //移除鸡蛋，番茄和炒蛋
                         staticCtr.removeChild(imgTomatoResultWin);
                         staticCtr.removeChild(imgEggResultLose);
                         staticCtr.removeChild(imgEggResultWin);
                         staticCtr.removeChild(imgTomatoResultLose);
                         staticCtr.removeChild(imgTomatoAndEgg);

                         //移除按钮
                         staticCtr.removeChild(imgRetry);
                         staticCtr.removeChild(imgGetAward);
                         staticCtr.removeChild(imgViewScore);

                         staticCtr.removeChild(textComputer);
                         staticCtr.removeChild(imgShowText);
                         //staticCtr.removeChild(textScore);

                         /!*!//提示显示文字
                         var textInputName = new createjs.Text('请输入姓名', "bold 36px Arial", "#e50012"),
                         boundsInputName = textInputName.getBounds();

                         textInputName.x = 320 * scaleX;
                         textInputName.y = 330 * scaleY;
                         textInputName.scaleX = scaleX;
                         textInputName.scaleY = scaleY;

                         //提示显示文字
                         var textInputMobile = new createjs.Text('请输入手机号', "bold 36px Arial", "#e50012"),
                         boundsMobileInput = textInputMobile.getBounds();

                         textInputMobile.x = 320 * scaleX;
                         textInputMobile.y = 390 * scaleY;
                         textInputMobile.scaleX = scaleX;
                         textInputMobile.scaleY = scaleY;

                         staticCtr.addChild(textInputName);
                         staticCtr.addChild(textInputMobile);*!/

                         //显示输入框
                         var $inputForm = $('.inputForm');
                         $inputForm.show();
                         var $inputMobile = $('#mobile');
                         var $inputName = $('#name');

                         if (w < h) {
                         $inputMobile.css({
                         'transform': 'rotate(90deg)',
                         'left': '18%',
                         'top': '740px'
                         });
                         $inputName.css({
                         'transform': 'rotate(90deg)',
                         'left': '32%',
                         'top': '740px'
                         });

                         }

                         //确认和返回
                         var imgConfirm = staticImage(loader, 'confirm', 733, 472);
                         var imgReturn = staticImage(loader, 'return', 394, 472);
                         var imgForm = staticImage(loader, 'form', 336, 235);

                         staticCtr.addChild(imgConfirm);
                         staticCtr.addChild(imgReturn);
                         staticCtr.addChild(imgForm);

                         var storage = window.localStorage;

                         if (storage.nickname != '' && storage.nickname != undefined){
                         //console.log('!');
                         $inputName.val(storage.nickname);
                         }

                         if (storage.mobile != '' && storage.mobile != undefined){
                         //console.log('!');
                         $inputMobile.val(storage.mobile);
                         }

                         //事件监控
                         var listenerConfirm = imgConfirm.addEventListener('mousedown', confirm);

                         function confirm() {

                         /!*表单检验*!/

                         if ($inputName.val().length == 0) {
                         alert('昵称不能为空！');
                         return;
                         }

                         if ($inputName.val().length > 20) {
                         alert('昵称不能超过20个字符！');
                         return;
                         }

                         if ($inputMobile.val().length == 0) {
                         alert('手机号码不能为空！');
                         return;
                         }

                         if ($inputMobile.val().length != 11) {
                         alert('请输入11位的手机号码！');
                         return;
                         }

                         //var storage = window.localStorage;
                         if (storage.mobile == '' || storage.mobile == undefined){
                         storage.mobile = $inputMobile.val();
                         }

                         if (storage.nickname == '' || storage.nickname == undefined){
                         storage.nickname = $inputName.val();
                         }

                         //playerScore = 10

                         //点击后提交数据
                         var data = {
                         "extData": {
                         'player': player
                         },
                         "mobile": $inputMobile.val(),
                         "nickname": $inputName.val(),
                         "type": "h5",
                         "v": playerScore
                         };

                         //console.log(data);

                         //只允许点击一次，不允许重复提交
                         imgConfirm.off('mousedown', listenerConfirm);

                         //callback(100);

                         //输的情况下查询之前积分不算进参与次数
                         $.when(apis.getUserInfo($inputMobile.val()))
                         .then(function (result) {

                         //console.log(result);

                         imgConfirm.on('mousedown', listenerConfirm);

                         var score = result.data.balance;

                         callback(score);

                         }, function (result) {
                         //console.log(result);
                         imgConfirm.on('mousedown', listenerConfirm);
                         //alert(result.errMsg); // Not Found
                         alert('无效手机号码或不存在此用户，请重新输入！');
                         });

                         //回调
                         /!*$.when(apis.postUserInfo(data))

                         .then(function (result) {

                         //result.errCode == 0

                         console.log(result);

                         imgConfirm.on('mousedown', listenerConfirm);

                         var score = result.data;

                         callback(score);

                         }, function (result) {

                         //result.errCode != 0

                         console.log(result); // result

                         imgConfirm.on('mousedown', listenerConfirm);



                         });*!/

                         //callback(playerScore);

                         //回调函数
                         function callback(score) {

                         staticCtr.addChild(imgTip);
                         //移除
                         staticCtr.removeChild(imgConfirm);
                         staticCtr.removeChild(imgReturn);
                         staticCtr.removeChild(imgForm);

                         $inputForm.hide();

                         //积分页面
                         var imgScore = staticImage(loader, 'score', 543, 178);
                         var imgContinue = staticImage(loader, 'continue', 394, 472);
                         var imgFake = staticImage(loader, 'getAward', 733, 472);

                         //积分显示文字
                         var textResultScore = new cjs.Text(score, "bold 36px Arial", "#e50012"),
                         boundsScore = textResultScore.getBounds();

                         //根据数值的位数决定文本渲染坐标
                         var length = score.toString().length;
                         var value = 640;

                         textResultScore.x = (value - length * 18) * scaleX;
                         textResultScore.y = 390 * scaleY;
                         textResultScore.scaleX = scaleX;
                         textResultScore.scaleY = scaleY;

                         staticCtr.addChild(imgScore);
                         staticCtr.addChild(imgContinue);
                         staticCtr.addChild(imgFake);
                         staticCtr.addChild(textResultScore);

                         //剩余事件
                         imgFake.on('mousedown', function () {
                         window.location.href = apis.getMallEntry();
                         });

                         imgContinue.on('mousedown', function () {
                         window.location.href = 'index.html';
                         });
                         }


                         }

                         //绑定事件
                         //imgConfirm.on('mousedown', confirm);

                         imgReturn.on('mousedown', function () {

                         //console.log('test');

                         $inputForm.hide();

                         if (player == 'tomato') {
                         if (sign == 'win') {
                         staticCtr.addChild(imgTomatoResultWin);
                         staticCtr.addChild(imgEggResultLose);
                         } else {
                         staticCtr.addChild(imgTomatoLoseLogo);

                         staticCtr.addChild(imgTomatoResultLose);
                         staticCtr.addChild(imgEggResultWin);
                         }

                         } else {
                         if (sign == 'win') {
                         staticCtr.addChild(imgTomatoResultLose);
                         staticCtr.addChild(imgEggResultWin);
                         } else {
                         staticCtr.addChild(imgEggLoseLogo);

                         staticCtr.addChild(imgTomatoResultWin);
                         staticCtr.addChild(imgEggResultLose);
                         }
                         }

                         staticCtr.addChild(imgTomatoAndEgg);

                         staticCtr.removeChild(imgConfirm);
                         staticCtr.removeChild(imgReturn);
                         staticCtr.removeChild(imgForm);

                         //移除按钮
                         staticCtr.addChild(imgRetry);
                         staticCtr.addChild(imgGetAward);
                         staticCtr.addChild(imgViewScore);

                         //staticCtr.addChild(textPlayer);
                         staticCtr.addChild(imgShowText);
                         //staticCtr.addChild(textScore);

                         staticCtr.addChild(textComputer);

                         });


                         });*/
                    }
                }


                //静态素材
                staticCtr.addChild(imgBanner);
                //血量槽设置
                staticCtr.addChild(imgPlayerLifeBanner);
                staticCtr.addChild(imgComputerLifeBanner);
                staticCtr.addChild(imgWindSign);
                //其余静态素材
                //staticCtr.addChild(imgMenu);
                //staticCtr.addChild(imgStones);
                //staticCtr.addChild(imgSheep1);
                //staticCtr.addChild(imgSheep2);
                //先阴影
                dynamicCtr.addChild(imgTomatoCaskShadow);
                dynamicCtr.addChild(imgTomatoCask);
                //先阴影
                dynamicCtr.addChild(imgTomatoShadow);
                dynamicCtr.addChild(imgTomato);
                /*debug*/
                //dynamicCtr.removeChild(imgTomato);
                //dynamicCtr.addChild(imgTomatoWeapon);

                //dynamicCtr.addChild(imgTomatoHand);
                //dynamicCtr.addChild(imgTomatoAttack);
                //dynamicCtr.addChild(imgTomatoWin);
                //dynamicCtr.addChild(imgTomatoLose);
                //dynamicCtr.addChild(imgTomatoDamaged);
                //dynamicCtr.addChild(imgTomatoEnd);
                //dynamicCtr.addChild(imgTomatoAngry);

                //先阴影
                dynamicCtr.addChild(imgCoopShadow2);
                dynamicCtr.addChild(imgHen);
                //先阴影
                dynamicCtr.addChild(imgCoopShadow1);
                dynamicCtr.addChild(imgCoop);

                dynamicCtr.addChild(imgEgg);

                /*debug*/
                //dynamicCtr.removeChild(imgEgg);
                //dynamicCtr.addChild(imgEggWeapon);
                //dynamicCtr.addChild(imgEggAttack);
                //dynamicCtr.addChild(imgEggHand);
                //dynamicCtr.addChild(imgEggWin);
                //dynamicCtr.addChild(imgEggLose);
                //dynamicCtr.addChild(imgEggDamaged);
                //dynamicCtr.addChild(imgEggEnd);
                //dynamicCtr.addChild(imgEggAngry);

                dynamicCtr.addChild(imgEggOverlay);

                //resultPageBuild(10, 'win');

                readyCtr.addChild(imgGameReady);
                readyCtr.addChild(imgGameStart);

                //先静后动
                stage.addChild(dynamicCtr);
                stage.addChild(staticCtr);

                //debug ready
                stage.addChild(readyCtr);

                //开启触摸事件
                cjs.Touch.enable(stage);

                //console.log()


                //
                cjs.Ticker.setFPS(60);
                cjs.Ticker.on('tick', function () {

                    //var pt1 = imgPlayer.localToLocal(0, 0, circle);
                    //var pt2 = imgComputer.localToLocal(0, 0, circle);


                    //var pt1 = imgPlayer.globalToLocal(stage.mouseX, stage.mouseY);
                    //imgPlayer.alpha = 0.2;

                    //var pt2 = imgComputer.globalToLocal(stage.mouseX, stage.mouseY);
                    //imgComputer.alpha = 0.2;


                    /*if (imgPlayer.hitTest(pt1.x, pt1.y)) {
                     imgPlayer.alpha = 1.0;
                     //alert('呵呵！');
                     }

                     if (imgComputer.hitTest(pt2.x, pt2.y)) {
                     imgComputer.alpha = 1.0;
                     //alert('呵呵！');
                     }*/

                    //横竖屏检测
                    check.autoFullscreen();

                    if (computerHits >= 5) {
                        imgPlayer = imgPlayerDamaged;
                    }

                    if (playerHits >= 5) {
                        imgComputer = imgComputerDamaged;
                    }

                    //更新舞台场景
                    /*if(window.innerWidth < window.innerHeight){
                     //缩放
                     bg.scaleX = h / bg.getBounds().width;
                     bg.scaleY = w / bg.getBounds().height;
                     stage.regX = 0;
                     stage.regY = h;
                     stage.rotation = 90;
                     }*/


                    stage.update();
                })

            }

            //获取url传来的参数
            function getParam(paramName) {
                var paramValue = "", isFound = !1;
                if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
                    var arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
                    while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
                }
                return paramValue == "" && (paramValue = null), paramValue
            }

            init();

        });

}());





