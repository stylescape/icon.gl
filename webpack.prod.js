// webpack.prod.js

import path from "path"
import { fileURLToPath } from "url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Config | Production
export const configProduction = {

    // Set the mode to development or production
    mode: "production",

    performance: {
        maxAssetSize: 5000000,
        maxEntrypointSize: 5000000,
        hints: 'error',

    },
    // context: path.join(__dirname, "your-app"),

    entry: "./src/scss/index.scss",

    // output: {
    //     path: path.resolve(__dirname, "dist"),
    // },

    output: {
        library: "Stylescape",
        libraryTarget: "umd",
        libraryExport: "default",
        path: path.resolve(__dirname, "dist"),
        filename: "js/stylescape.js",
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            // modules: false,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            // modules: false,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            // modules: false,
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: "css/stylescape.css",
            }
        ),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: "src/font",
                        to: "font"
                    }
                ]
            }
        ),
    ],

    devtool: 'source-map'
};


export default configProduction
