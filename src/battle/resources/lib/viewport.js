/**
 * @author iris_wu@linkin.mobi
 * @copyright  2016-03-30
 */
(function (deps, mod) {
    // 兼容AMD模块
    if (typeof define === 'function' && define.amd) {
        define(deps, mod);
    } else {
        window.mobileAdapter = mod();
    }
})([], function () {
    var viewportContent =
        'width={{pageWidth}}, user-scalable=no,' +
        'initial-scale={{pageScale}}, minimum-scale={{pageScale}}, maximum-scale={{pageScale}}';

    return {
        setAdapterZoom: setAdapterZoom,
        setAdapterViewport: setAdapterViewport,
        setAdapterTransform: setAdapterTransform,

        setTransform: setTransform,
        getViewportSize: getViewportSize,
        getScale: getScale
    };

    // 适配方式一：对html设置zoom属性
    // *iOS下的微信中二维码识别没问题
    // *手机端视频缩放没问题
    // *完美适配
    // *推荐使用
    function setAdapterZoom(appWidth, appHeight, scale) {
        var html = document.querySelector('html');
        setViewportDefault();
        if ('zoom' in document.documentElement.style) {
            scale = getScale(appWidth, appHeight, scale);
            html.style.zoom = scale;
        } else {
            setTransform(html, appWidth, appHeight, scale);
        }
    }

    // 适配方式二：对meta[name=viewport] content中的scale进行设置
    // *iOS下的微信中二维码识别有问题
    // *手机视频缩放没测试
    // *安卓微信中此种适配方式下，app的宽度永远等于viewport的宽度
    function setAdapterViewport(appWidth, appHeight, scale) {

        var userWidth, userHeight;
        /*竖屏下调整缩放*/
        var w = window.innerWidth;
        var h = window.innerHeight;

        userWidth = w > h ? appWidth :appHeight;
        userHeight = w > h ? appHeight : appWidth;

        //console.log(userWidth, userHeight);

        var viewport = setViewportDefault();
        viewport.setAttribute('content', getViewportHtmlAdapter(userWidth, userHeight, scale));
    }

    // 适配方式三：对html或body transform的scale进行设置
    // *iOS下的微信中二维码识别没测试
    // *手机视频缩放没测试
    // *设置html的高为100%，并设置transform进行整体缩放，会出现滚条
    function setAdapterTransform(appWidth, appHeight, scale) {
        var html = document.querySelector('html');

        setViewportDefault();

        setTransform(html, appWidth, appHeight, scale);
    }

    // 对指定的元素进行适配
    function setTransform(elem, appWidth, appHeight, scale) {
        var viewportSize = getViewportSize(),
            offsetX = (viewportSize.width - appWidth) / 2,
            offsetY = (viewportSize.height - appHeight) / 2;

        scale = getScale(appWidth, appHeight, scale);

        css(elem, {
            transform: 'translate(' + offsetX + 'px, ' + offsetY + 'px) ' + 'scale(' + scale + ')',
            width: appWidth + 'px',
            height: appHeight + 'px'
        });
    }

    // 设置默认veiwport并反馈viewport元素
    function setViewportDefault() {
        var viewport = document.querySelector('meta[name=viewport]');

        if (!viewport) {
            viewport = createViewport();
        }

        return viewport;
    }

    // 创建veiwport元素
    function createViewport() {
        var viewport = document.createElement('meta');

        document.querySelector('head').appendChild(viewport);

        viewport.setAttribute('name', 'viewport');
        viewport.setAttribute('content', getViewportHtmlOrigin());

        return viewport;
    }

    // 获取适配的缩放比
    function getScale(appWidth, appHeight, scale) {
        if (!isNaN(parseInt(scale, 10))) return scale;

        var viewportSize = getViewportSize(),
            viewportRatio = viewportSize.width / viewportSize.height,
            appRatio = appWidth / appHeight,
            scale = 1;

        if (viewportRatio > appRatio) {
            scale = viewportSize.height / appHeight;
        } else {
            scale = viewportSize.width / appWidth;
        }

        return scale;
    }

    // 获取viewport的尺寸
    function getViewportSize() {
        var clientSize = document.documentElement;

        return {
            width: clientSize.clientWidth,
            height: clientSize.clientHeight
        };
    }

    // 获取指定的viewport content内容
    function getViewportHtmlAdapter(appWidth, appHeight, scale) {
        scale = getScale(appWidth, appHeight, scale);

        return viewportContent
            .replace(/{{pageWidth}}/, appWidth)
            .replace(/{{pageScale}}/g, scale);
    }

    // 获取默认的viewport content内容
    function getViewportHtmlOrigin() {
        return viewportContent
            .replace(/{{pageWidth}}/, 'device-width')
            .replace(/{{pageScale}}/g, 1);
    }

    // 设置css样式
    function css(elem, propertyName, propertyValue) {
        // 如果传入属性名和属性值
        if (getType(propertyName) === '[object String]') {

            elem.style[fixCssName(elem, propertyName)] = propertyValue;

        }
        // 如果传入属性集合
        else if (getType(propertyName) === '[object Object]') {

            for (name in propertyName) {
                if (propertyName.hasOwnProperty(name)) {
                    elem.style[fixCssName(elem, name)] = propertyName[name];
                }
            }

        }

        return elem;
    }

    // 修正要设置的css属性值
    function fixCssName(elem, propertyName) {
        var prefixs = ['', "Webkit", "O", "Moz", "ms"]
        styleCollection = elem.style;

        var propertyNameReal = propertyNameTemp = propertyName;

        if (getType(propertyName) === '[object String]') {
            for (var i = 0, l = prefixs.length; i < l; i++) {
                if (i > 0) {
                    propertyNameTemp = prefixs[i] + camelCase(propertyName);
                }

                if (propertyNameTemp in styleCollection) {
                    propertyNameReal = propertyNameTemp;
                    break;
                }
            }
        }

        return propertyNameReal;
    }

    // 获取js对象类型
    function getType(obj) {
        return Object.prototype.toString.call(obj);
    }

    // 将字符串转换为驼峰形式
    function camelCase(str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1);
    }
});