// webpack.prod.js


// ============================================================================
// Imports
// ============================================================================

import path from "path"
import { fileURLToPath } from "url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";


// ============================================================================
// Constants
// ============================================================================

// Resolve current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * Production Webpack Configuration
 * 
 */
export const configProduction = {

    // Configuration | mode
    // ========================================================================
    // Set the mode to development or production

    mode: "production",


    // Configuration | Entry Points
    // ========================================================================
    // Entry points for the application
    // Where webpack looks to start building the bundle
    entry: "./src/scss/index.scss",


    // Configuration | Output
    // ========================================================================
    // output: {
    //     library: "Stylescape",
    //     libraryTarget: "umd",
    //     libraryExport: "default",
    //     path: path.resolve(__dirname, "dist"),
    //     // path: path.resolve(__dirname, "dist"),
    //     filename: "js/stylescape.js",
    //     clean: true, // Clean the output directory before emit
    // },


    // Configuration | Module Rules
    // ========================================================================
    // Module rules for handling different file types.
    // Determine how modules within the project are treated.
    // module: {
    //     rules: [

    //         // CSS and SCSS Rules
    //         // ----------------------------------------------------------------
    //         // Handles importing CSS and SCSS files. Use MiniCssExtractPlugin
    //         // in production and style-loader in development
    //         {
    //             test: /\.(scss|css)$/,
    //             exclude: /node_modules/,
    //             use: [
    //                 // Extract CSS into separate files
    //                 MiniCssExtractPlugin.loader,
    //             ]
    //         },
    //     ],
    // },


    // Configuration | Plugins
    // ========================================================================

    plugins: [
        // Extracts CSS into separate files for production
        new MiniCssExtractPlugin(
            {
                // filename: "css/stylescape.css",
                filename: "[name].[contenthash].css"
            }
        ),
        // Clean the output directory before build.
        // Removes/cleans build folders and unused assets when rebuilding
        new CleanWebpackPlugin(),
        // Copies files from target to destination folder
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: "src/font",
                        to: "font",
                        globOptions: {
                            ignore: ["*.DS_Store"],
                        },
                        noErrorOnMissing: true,
                    }
                ]
            }
        ),
    ],


    // Configuration | Optimization
    // ========================================================================

    optimization: {
        minimizer: [
            // Minify CSS
            new CssMinimizerPlugin(),
            // Minify JavaScript
            new TerserPlugin(
                {
                    terserOptions: {
                        format: {
                            // Remove comments in the minified output
                            comments: false,
                        },
                    },
                    extractComments: false,
                },
            ),
        ],
    },


    // Configuration | Performance
    // ========================================================================
    // Performance settings to control webpack"s hints

    // In production, performance is a key factor, and you want to ensure that
    // your assets are optimized and not excessively large. You can enforce
    // size limits and configure warnings or errors for assets that exceed
    // these limits.

    performance: {
        // Maximum size (in bytes) for a single asset.
        maxAssetSize: 5000000,
        // Maximum size (in bytes) for the entry point"s assets.
        maxEntrypointSize: 5000000,
        // Show an error for assets or entry points exceeding limits.
        // hints: "error",
        // Warns when assets or entry points exceed the set limits.
        hints: "warning",
    },


    // Configuration | Devtool
    // ========================================================================
    // Control how source maps are generated.

    // In production, you may choose to disable source maps for performance
    // and security reasons. However, if you need them for debugging, use a
    // setting that minimizes the impact on performance:

    // Turn off source maps in production for better performance
    devtool: false,

    // This option omits column mappings for smaller file sizes, but preserves
    // line mappings for error reports.
    // devtool: "source-map",


};


// ============================================================================
// Exports
// ============================================================================

export default configProduction
