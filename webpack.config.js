const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PRODUCTION = "production";
const DEVELOPMENT = "development";
const MODE = process.env.NODE_ENV || PRODUCTION;
const IS_PRODUCTION = MODE === PRODUCTION;
const IS_DEVELOPMENT = MODE === DEVELOPMENT;

let babelPresets = [
    "@babel/preset-env",
    "@babel/preset-react"
];

if (IS_PRODUCTION) {
    babelPresets.unshift("minify");
}

module.exports = {
    mode: MODE,
    watch: IS_DEVELOPMENT,
    entry: './src/main.jsx',
    output: {
        path: path.resolve(__dirname, "public/dist"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: babelPresets,
                    comments: IS_DEVELOPMENT,
                    //sourceMaps: "inline"
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