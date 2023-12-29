// webpack.dev.js


// ============================================================================
// Imports
// ============================================================================

import webpack from "webpack";
import paths from "./webpack.paths.js"
import HtmlWebpackPlugin from "html-webpack-plugin"


// ============================================================================
// Constants
// ============================================================================

// Config | Development
export const configDevelopment = {

    // Configuration | Mode
    // ========================================================================
    // Set the mode to development or production
    mode: "development",


    // Development Server Configuration
    // ========================================================================
    // Spin up a server for quick development

    devServer: {
        historyApiFallback: true, // Fallback to index.html for Single Page Applications
        watchFiles: [ // Watch for changes in these directories
            paths.src + "/*",
            paths.public + "/*",
        ],
        port: 4040,
        open: true, // Open the browser after server has been started
        compress: true, // Enable gzip compression
        hot: true, // Enable Hot Module Replacement (HMR)
        static: {
            directory: paths.public // Serve files from this directory
            // directory: paths.public + "/"
        },
    },


    // Configuration | Module Rules
    // ========================================================================
    // Module rules for handling different file types.
    // Determine how modules within the project are treated.
    // module: {
    //     rules: [
    //         {
    //             test: /\.(scss|css)$/,
    //             use: [
    //                 // Injects styles into the DOM for hot reloading
    //                 "style-loader",
    //             ]
    //         },
    //     ],
    // },


    // Plugins
    // ========================================================================
    plugins: [
        // Enable hot reloading
        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin(),

        // Serve test page
        new HtmlWebpackPlugin({
            template: "./test/index.html",
            // template: paths.src + "/index.html", // Specify the HTML template to use
            // title: "Development Mode", // Optional: Specify a title for the HTML document
            // favicon: paths.public + "/favicon.ico" // Optional: Specify a favicon
        }),
    ],



    // Configuration | Performance
    // ========================================================================
    // Performance settings to control webpack"s hints

    // For development, you generally want to minimize build time and
    // maximize speed. Performance hints are usually not as critical in
    // development and can be turned off to reduce noise.

    performance: {
        hints: false
    },


    // Configuration | Devtool
    // ========================================================================
    // Control how source maps are generated.

    // For development, you want source maps that offer a good balance between
    // rebuild speed and quality. The eval-source-map is often recommended for
    // development:

    // Enable high-quality source maps for better debugging experience.
    devtool: "eval-source-map",

    // devtool: "inline-source-map",

};


// ============================================================================
// Exports
// ============================================================================

export default configDevelopment
