const path = require('path');

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
    babelPresets.push("minify");
}

module.exports = {
    mode: MODE,
    watch: IS_DEVELOPMENT,
    entry: './src/main.jsx',
    output: {
        path: path.resolve(__dirname, "public"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                options: {
                    presets: babelPresets,
                    comments: IS_DEVELOPMENT,
                    sourceMaps: "inline"
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
            },
        ]
    }
};