const path = require('path')
// const paths = require('./paths');
const chalk = require("chalk");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.tsx'
    },
    plugins: [
        new ProgressBarPlugin({
            format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html',
            favicon: './public/favicon.ico',
            inject: true,
            hash: true
        }),
        new WindiCSSWebpackPlugin()
    ],
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve('./', 'build'),
        publicPath: './',
        clean: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        },
        extensions: ['.tsx', '.js', '.ts'],
        // modules: [
        //     'node_modules',
        //     paths.appSrc,
        // ],
        symlinks: false,
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.(js|ts|jsx|tsx)$/,
                use: [
                    {
                        loader: 'esbuild-loader',
                        options: {
                            loader: 'tsx',
                            target: 'es2015',
                        },
                    }
                ],
                exclude: path.resolve('./', 'node_modules') //排除node_modules，该目录不参与编译
            },
        ],
    },
    cache: {
        type: "filesystem", // 使用文件缓存
    },
}