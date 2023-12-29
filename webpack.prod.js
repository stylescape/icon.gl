// webpack.prod.js


// ============================================================================
// Imports
// ============================================================================

import path from "path"
import paths from "./webpack.paths.js";
import params from "./webpack.params.js";
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
    // entry: "./src/scss/index.scss",


    // Configuration | Output
    // ========================================================================

    output: {
        library: paths.name,
        libraryTarget: "umd",
        libraryExport: "default",
        // Output directory
        path: path.resolve(__dirname, "dist"),
        // path: paths.build,
        // Filename pattern
        filename: `js/${params.name}.min.js`,
        // filename: "js/[name].bundle.js",
        // Public URL of the output directory when referenced in a browser
        // Adjust if your app is served from a specific path
        publicPath: "/",
        // Clean the output directory before emit
        // clean: true,
    },

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


    // Configuration | Module Rules
    // ========================================================================
    // Module rules for handling different file types.
    // Determine how modules within the project are treated.
    module: {
        // entry: "./js/index.js",
        // ...
        // target: ["web", "es5"],
        rules: [

            // TypeScript Rules
            // ----------------------------------------------------------------
            // Compiles TypeScript (.ts) files to JavaScript and enables 
            // additional features for development
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    // Babel Loader
                    // Transpiles TypeScript to JavaScript with Babel.
                    // This allows for the use of the latest JavaScript
                    // features and ensures compatibility with older browsers.
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                // Preset for compiling modern JavaScript to
                                // a more compatible version
                                ["@babel/preset-env", {
                                    // Define target environments
                                    targets: "> 0.25%, not dead",
                                    // Only include polyfills and transforms
                                    // needed for target environments
                                    useBuiltIns: "usage",
                                    // Specify the core-js version for polyfills
                                    corejs: 3,
                                    // Preserve ECMAScript modules for tree
                                    // shaking in Webpack
                                    // modules: true
                                    modules: false
                                }],
                                // Preset for handling TypeScript
                                "@babel/preset-typescript"
                            ],
                            caller: {
                                supportsStaticESM: true
                            },
                            plugins: [
                                // Add any necessary Babel plugins here
                                // Enables dynamic import syntax in JavaScript
                                // (important for code splitting in ESM)
                                "@babel/plugin-syntax-dynamic-import",
                                
                                // Other plugins that your project might need
                            ],
                        },
                    },
                    // TypeScript Loader
                    // Handles the TypeScript compilation
                    {
                        loader: "ts-loader",
                        options: {
                            // Enable transpileOnly to speed up compilation in
                            // development mode
                            // Note: This disables type checking during Webpack
                            // compilation.
                            // Type checking can be done separately (e.g., via
                            // a script or in the IDE).
                            transpileOnly: true,

                            // Configure additional ts-loader options as needed
                            // For example, specify a custom tsconfig.json or
                            // enable/disable certain compiler options
                        },
                    },
                ],
            },

            // JavaScript Rules
            // ----------------------------------------------------------------
            // Use Babel Loader to transpile JavaScript file
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },

            // CSS and SCSS Rules
            // ----------------------------------------------------------------
            // Handles importing CSS and SCSS files. Use MiniCssExtractPlugin
            // in production and style-loader in development
            {
                // test: /\.(scss|css)$/,
                test: /.s?css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    
                    {
                        loader: "css-loader",
                        options: {
                            // Enable source maps.
                            sourceMap: true,
                            // Enable CSS Modules if needed.
                            // modules: true,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    // Automatically add vendor prefixes.
                                    "autoprefixer"
                                ]
                            }
                        }
                    },
                    // "sass-to-string",
                    {
                        loader: "sass-loader",
                        options: {
                            // Enable source maps.
                            sourceMap: true,
                            // modules: false,
                            sassOptions: {
                                // More readable output in development
                                // outputStyle: "expanded",
                                outputStyle: "compressed"
                            }
                        },
                    },
                ]
            },

            // Nunjucks Rules
            // ----------------------------------------------------------------
            // Processes Nunjucks templates
            {
                test: /\.(njk|nunjucks|jinja)$/,
                use: [
                    {
                        loader: "nunjucks-loader",
                        options: {
                            // Specify the path to the Nunjucks configuration file
                            // Adjust the path as per your project structure
                            // config: path.join(__dirname, "src/nunjucks.config.js"),
            
                            // Set to true if you are using Jinja compatibility features
                            jinjaCompat: true,
            
                            // Define the root directory for Nunjucks templates
                            // This is where Nunjucks will look for template files
                            // root: path.resolve(__dirname, "path/to/templates"),
            
                            // Optional: Suppress the "Cannot configure nunjucks
                            // environment before precompile" warning
                            quiet: true,
            
                            // Other Nunjucks loader specific options can be added here
                        }
                    }
                ],
            },

            // Font Rules
            // ----------------------------------------------------------------
            {
                // Handles font files (woff, woff2, eot, ttf, otf)
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                type: "asset/resource",
                generator: {
                    // Output directory and naming format for fonts
                    filename: "fonts/[name][ext][query]",
                    // Optionally, customize the public path for the fonts
                    // publicPath: "../",
                },
            },

            // SVG Rules
            // ----------------------------------------------------------------
            // Handles SVG files
            {
                test: /\.svg$/,
                type: "asset/resource",
                // Handles SVGs with different strategies based on file size
                // type: "asset",
                // parser: {
                //     dataUrlCondition: {
                //         // Inline SVGs smaller than 8kb as data URIs
                //         maxSize: 8192,
                //     },
                // },
                generator: {
                    // Output directory and naming format for SVGs
                    filename: "images/[name][ext][query]",
                    // Optionally, customize the public path for the SVGs
                    // publicPath: "../",
                },
            },

            // Image Rules
            // ----------------------------------------------------------------
            // Manages image files and optimizes them for web
            {
                test: /\.(ico|gif|png|jpg|jpeg)$/i,
                type: "asset/resource",
                // type: "asset",
                // parser: {
                //     dataUrlCondition: {
                //         // Inline images smaller than 8kb as data URIs
                //         maxSize: 8192,
                //     },
                // },
                generator: {
                    // Output directory and naming format for images
                    filename: "images/[name][ext][query]",
                    // Optionally, customize the public path for the images
                    // publicPath: "../",
                },
            },

        ],
    },


    // Configuration | Plugins
    // ========================================================================

    plugins: [
        // Extracts CSS into separate files for production
        new MiniCssExtractPlugin(
            {
                filename: `css/${params.name}.css`,
                // filename: "css/icon.css",
                // filename: "[name].[contenthash].css"
            }
        ),
        // Clean the output directory before build.
        // Removes/cleans build folders and unused assets when rebuilding
        // new CleanWebpackPlugin(),
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
        minimize: false,
        // minimize: true,
        minimizer: [
            // Minify CSS
            new CssMinimizerPlugin(),
            // new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { map: { inline: false, annotation: true } } }),

            // Minify JavaScript
            new TerserPlugin(
                {
                    // Use multi-process parallel running to improve the build speed
                    // Default number of concurrent runs: os.cpus().length - 1
                    parallel: true,
                    // Enable file caching
                    // cache: true,
                    // sourceMap: true,
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
    // devtool: false,

    // This option omits column mappings for smaller file sizes, but preserves
    // line mappings for error reports.
    devtool: "source-map",


};


// ============================================================================
// Exports
// ============================================================================

export default configProduction
