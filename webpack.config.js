// webpack.config.js

import { merge } from "webpack-merge";
import configCommon from "./webpack.common.js";
import configDevelopment from "./webpack.dev.js";
import configProduction from "./webpack.prod.js";


// Config | Merge
export const config = (env, args) => {
    switch(args.mode) {
        case "development":
            return merge(configCommon, configDevelopment);
        case "production":
            return merge(configCommon, configProduction);
        default:
            throw new Error("No matching configuration was found!");
    }
}


// Config | Export
export default config
