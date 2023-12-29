// webpack.paths.js


// ============================================================================
// Imports
// ============================================================================

import path from "path"
import { fileURLToPath } from "url";


// ============================================================================
// Constants
// ============================================================================

// Convert the current file's URL to a file path
const __filename = fileURLToPath(import.meta.url);

// Derive the directory name of the current module
const __dirname = path.dirname(__filename);


/**
 * Paths Webpack Configuration
 * 
 * Defines common paths used throughout the Webpack configuration.
 * 
 * - `src`: Path to the source files.
 * - `build`: Path where production build files will be placed.
 * - `public`: Path to public/static files to be copied to the build folder.
 * - `test`: Path to test files.
 */
const configPaths = {

    // Path to source files
    src: path.resolve(__dirname, "/src"),

    // Path for production build files
    build: path.resolve(__dirname, "/dist"),
    
    // Path to public/static files
    public: path.resolve(__dirname, "/public"),

    // Path for test files
    test: path.resolve(__dirname, "/test"),

};


// ============================================================================
// Exports
// ============================================================================

export default configPaths
