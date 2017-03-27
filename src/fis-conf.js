var package = require('../package.json');
var domain = 'http://cdn.vveshow.com/cloud/interact/' + package.name;
fis.config.set("project", {
    md5Length: 6,
    md5Connector: '-'
});

// 启用插件 npm install -g fis3-hook-relative
fis.hook('relative');

// 让所有文件，都使用相对路径。
fis.match('*', {
    relative: true
})

fis.match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css'),
    useHash: true
});

// 自动打包合并
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: true
    })
});

fis.media('prd')
    .match('::image', {
        relative: false,
        domain: domain
    })
    .match(/\.js$/i, {
        // 指定压缩插件 fis-optimizer-uglify-js
        optimizer: fis.plugin('uglify-js', {
            // option of uglify-js
        })
    })
    .match(/\.(css|scss)$/i, {
        optimizer: fis.plugin('clean-css')
    });
