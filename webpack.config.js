const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PRODUCTION = "production";
const DEVELOPMENT = "development";
const MODE = process.env.NODE_ENV || PRODUCTION;
const IS_PRODUCTION = MODE === PRODUCTION;
const IS_DEVELOPMENT = MODE === DEVELOPMENT;

module.exports = {
    mode: MODE,
    watch: IS_DEVELOPMENT,
    entry: {
        index: './src/index.jsx',
        login: './src/login.jsx'
    },
    output: {
        path: path.resolve(__dirname, "public/dist")
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-react"
                    ],
                    plugins: [
                        "@babel/plugin-proposal-class-properties"
                    ],
                    comments: IS_DEVELOPMENT
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    { loader: 'css-loader', options: { sourceMap: true, import: false } },
                    // Compiles Sass to CSS
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css"
        })
    ]
};