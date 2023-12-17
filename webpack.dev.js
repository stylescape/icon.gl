// webpack.dev.js

import webpack from "webpack";
import paths from './webpack.paths.js'


// Config | Development
export const configDevelopment = {

    // Set the mode to development or production
    mode: "development",
    // Control how source maps are generated
    // devtool: "inline-source-map",
    // Spin up a server for quick development
    devServer: {
        historyApiFallback: true,
        watchFiles: [
            paths.src + "/*",
            paths.public + "/*",
        ],
        port: 4040,
        open: true,
        compress: true,
        hot: true,
        static: {
            directory: paths.public + "/"
        },
    },
    // module: {
    //     rules: [
    //         // Styles: Inject CSS into the head with source maps
    //         {
    //             test: /\.(sass|scss|css)$/,
    //             use: [
    //                 "style-loader",
    //                 {
    //                     loader: "css-loader",
    //                     options: { sourceMap: true, importLoaders: 1, modules: false },
    //                 },
    //                 { loader: "postcss-loader", options: { sourceMap: true } },
    //                 { loader: "sass-loader", options: { sourceMap: true } },
    //             ],
    //         },
    //     ],
    // },

    plugins: [
        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin()
    ]
};

export default configDevelopment
