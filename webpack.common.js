// webpack.common.js


// ============================================================================
// Imports
// ============================================================================
import path from "path"
import paths from "./webpack.paths.js";
import params from "./webpack.params.js";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";


// ============================================================================
// Constants
// ============================================================================

// Convert the current file's URL to a file path
const __filename = fileURLToPath(import.meta.url);

// Derive the directory name of the current module
const __dirname = path.dirname(__filename);

const isDevelopment = process.env.NODE_ENV !== "production";


/**
 * Common Webpack Configuration
 * 
 * This configuration file is the base for both development and production
 * environments. It includes configurations that are common across both.
 */
const configCommon = {

    // Configuration | Context
    // ========================================================================

    // Set the base directory for resolving entry points and loaders
    // context: path.join(__dirname, "your-app"),
    // context: path.resolve(__dirname, "../"), // Adjust the path as per your project structure


    // Configuration | Target Environment
    // ========================================================================
    // target: "web",
    target: ["web", "es5"],


    // Configuration | Entry Points
    // ========================================================================
    // Entry points for the application
    // Where webpack looks to start building the bundle
    entry: {
        index: `${paths.src}/ts/index.ts`,
        index_scss: `${paths.src}/scss/index.scss`,
        // index: paths.src + "/ts/index.ts"
        // index_scss: "./src/scss/index.scss",

    },


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
        filename: "js/[name].bundle.js",
        // Public URL of the output directory when referenced in a browser
        // Adjust if your app is served from a specific path
        publicPath: "/",
        // Clean the output directory before emit
        clean: true,
    },


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
                            transpileOnly: isDevelopment,

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
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                use: [
                    isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
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


    // Configuration | Resolve
    // ========================================================================
    // Simplifies module resolution
    resolve: {
        // Modules directories
        modules: [
            paths.src,
            "node_modules"
        ],
        // Extensions that are used
        extensions: [
            ".ts", ".tsx",
            ".js", ".jsx",
            ".json",
            ".scss"
        ],
        // Alias for directories (to simplify imports)
        alias: {
            // Alias for source and assets paths
            "@": paths.src,
            assets: paths.public,
        },
    },


    // Plugins
    // ========================================================================
    // Add any common plugins for both development and production here
    // Customize the webpack build process
    plugins: [
        // Generates an HTML file from a template
        // new HtmlWebpackPlugin(
        //     {
        //         // Title for the generated HTML document
        //         title: params.name,
        //         // Template for generating the main HTML file
        //         template: paths.src + "/html/index.html",
        //         filename: "index.html",
        //         // favicon: paths.public + "/favicon.ico" // Optional: Specify a favicon

        //     }
        // ),

    ],


    // Configuration | Performance
    // ========================================================================
    // Performance settings to control webpack"s hints

    // In the common configuration, you might not set specific performance
    // settings, as these are typically more relevant for production. 
    // However, you can set a baseline that can be overridden in 
    // environment-specific configurations.

    // Basic performance hints can be set here
    performance: {
        hints: false
    },


    // Configuration | Devtool
    // ========================================================================
    // Control how source maps are generated.

    // In the common configuration, you don"t typically specify devtool. 
    // Instead, defer this setting to the environment-specific configurations.

};


// ============================================================================
// Exports
// ============================================================================

export default configCommon
