/**
 * @author Frey_fug@linkin.mobi
 * @copyright linkin.mobi 2015
 */

define([], function(){
    // $.get('http://192.168.16.115:8080/api/wechat/openid/guangzhoujiujia/act_00001')

    return {
        paramsSerialize: paramsSerialize,
        urlSerialize: urlSerialize,
        urlUnserialize: urlUnserialize,
        random: random,
        randomInt: randomInt,
        zeroize: zeroize,
        loadImg: loadImg,
        loadImgGroup: loadImgGroup
    };

    //拼装params
    function paramsSerialize(obj){
        var paramString = '';

        for(key in obj){
            var value = obj[key];

            paramString += ( '&' + key + '=' + value );
        }

        return paramString.substring(1);
    }

    //url序列化
    function urlSerialize(url, obj){
        return url + '?' + paramsSerialize(obj);
    }

    // url反序列化
    function urlUnserialize(url){
        var pattern = new RegExp("[?&](.*?\=?[^&]+)", "g");
            matcher = url.match(pattern);

        var obj = {};

        if( matcher && (matcher.length > 0) ){
            for(var i = 0, l = matcher.length; i < l; i++){
                var paramArr = matcher[i].substring(1).split('=');
                obj[paramArr[0]] = paramArr[1];
            }
        }

        return obj;
    }

    // 生成[min, max)间的浮点数
    function random(min, max) {
        return min + Math.random() * (max - min);
    }

    // 生成[min, max]间的整数
    function randomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    /**
     * 补零
     * @method
     * @param {Number，String} number 需要补零的数字
     * @param {Number} n 补零后的位数
     * @return {Number，String} 补零后的数字
     * @todo 未验证n是否为数字类型
     */
    function zeroize(number, n){
        var numberLength = ("" + number).length;

        // 如果number本身的字符串长度大于n+1则返回number本身，不再补零
        if( numberLength > ( n + 1 ) ) return number;

        return Array(n - numberLength + 1).join(0) + number;
    }

    function loadImg(url, callback) {
        var img = new Image();

        img.src = url;
        if (img.complete) {
            callback(img.width, img.height, null);
        } else {
            img.onload = function () {
                callback && callback(img.width, img.height, null);
                img.onload = null;
            };
        };
        img.onerror = function(){
            callback && callback(0, 0, "error");
        };
    };
        
    //load a group of images and return an array with images' size
    // eg: loadImgGroup(urlArr, function(allImgArray){ some code });
    function loadImgGroup(urlArr, callback, everyLoadedCallback){
        var len = urlArr.length;
        var loadNum = 0;
        var allImgArray = [];
        for(var i=0; i<len; i++){
            (function(i){
                loadImg(urlArr[i], function(w, h, msg){
                    loadNum++;
                    allImgArray[i] = {w:w, h:h, msg: msg};
                    // i为第n个要加载的图片，loadNum是加载了多少张图片，len是要加载的图片张数
                    everyLoadedCallback && everyLoadedCallback(i, loadNum/len, allImgArray[i]);
                    if(loadNum == len)
                    {
                        callback && callback(allImgArray);
                    }
                });
            })(i);
        }
    };


});