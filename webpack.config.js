const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PRODUCTION = "production";
const DEVELOPMENT = "development";
const MODE = process.env.NODE_ENV || PRODUCTION;
const IS_PRODUCTION = MODE === PRODUCTION;
const IS_DEVELOPMENT = MODE === DEVELOPMENT;

const htmlFiles = [];

// Get all html files in ./src
fs.readdirSync(path.resolve(__dirname, "src")).forEach( file => {
    if (file.endsWith('.html')) {
        htmlFiles.push(file.substring(0, file.length - 5));
    }
});

const htmlWebpackPlugins = [];
const htmlEntry = {};

for (let name of htmlFiles) {
    htmlEntry[name] = `./src/${name}.jsx`;
    htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: `./src/${name}.html`,
            chunks: [name]
        })
    );
}

module.exports = {
    mode: MODE,
    watch: IS_DEVELOPMENT,
    entry: htmlEntry,
    output: {
        path: path.resolve(__dirname, "public")
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
    ].concat(htmlWebpackPlugins)
};