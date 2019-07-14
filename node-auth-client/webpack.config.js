const webpack = require('webpack');
let pkg = require("./package.json");
let license = `
 ${pkg.name} v${pkg.version}
 
 Copyright (c) 2016-2018, shu mai <ansiboy@163.com>
 Licensed under the MIT License.
`;
module.exports = {
    entry: __dirname + "/out/public/_main.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/dist",//打包后的文件存放的地方
        filename: "index.js",//打包后输出文件的文件名
        libraryTarget: 'amd'
    },
    mode: 'development',
    devtool: 'source-map',
    externals: ['react', 'react-dom', 'less',
        'maishu-chitu', 'maishu-chitu-react', 'maishu-dilu',
        'maishu-services-sdk', 'maishu-ui-toolkit'],
    plugins: [
        new webpack.BannerPlugin(license),
    ],
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: 'raw-loader',
            }
        ]
    }
}