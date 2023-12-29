// webpack.config.js


// ============================================================================
// Imports
// ============================================================================

import { merge } from "webpack-merge";
import configCommon from "./webpack.common.js";
import configDevelopment from "./webpack.dev.js";
import configProduction from "./webpack.prod.js";


// ============================================================================
// Constants
// ============================================================================

/**
 * Merge Webpack Configuration
 * 
 * Merges the common configuration with environment-specific configurations
 * based on the build mode (development or production).
 * 
 * @param {object} env - The environment variables passed to the Webpack configuration.
 * @param {object} args - Arguments and options passed via the command line or scripts.
 * @return {object} - The merged Webpack configuration object.
 * @throws {Error} - Throws an error if an invalid build mode is specified.
 */
//  export const config = (env, args) => {
const config = (env, args) => {
    switch (args.mode) {

        case "development":
            console.info("Merging common configuration with development settings...");
            return merge(configCommon, configDevelopment);

        case "production":
            console.info("Merging common configuration with production settings...");
            return merge(configCommon, configProduction);

        default:
            throw new Error("No matching configuration was found! Please specify 'development' or 'production' mode.");
    }
};


// ============================================================================
// Exports
// ============================================================================

export default config
