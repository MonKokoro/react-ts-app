const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require("./common.js")
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({
            "BUILD_ENV": JSON.stringify('dev')
        })
    ],
    output: {
        filename: '[name]-[contenthash].bundle.js',
        path: path.resolve('./', 'build'),
        publicPath: '/',
        clean: true
    },
    devServer: {
        host: '127.0.0.1',
        historyApiFallback: true
    }
}))