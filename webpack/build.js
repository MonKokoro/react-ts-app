const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require("./common.js")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
// const WebpackBundleAnalyzer = require("webpack-bundle-analyzer");

// const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin;

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            "BUILD_ENV": JSON.stringify('online')
        })
    ],
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve('./', 'docs'),
        publicPath: '/react-ts-app',
        clean: true
    },
})