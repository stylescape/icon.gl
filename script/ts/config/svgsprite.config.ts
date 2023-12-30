// script/config/svg-sprite.config.ts

// Copyright 2023 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// ============================================================================
// Import
// ============================================================================

import svgSprite from "svg-sprite";


// ============================================================================
// Constants
// ============================================================================

const svgspriteConfig: svgSprite.Config = {
    dest: './dist/sprite', // Main output directory
    // log: null, // Logging verbosity (default: no logging)
    shape: {  // SVG shape related options
        id: {
            separator: '--', // Separator for directory name traversal
            generator: 'icon-%s',
            // generator: function () { /*...*/ }, // SVG shape ID generator callback
            pseudo: '~' // File name separator for shape states (e.g. ':hover')
        },
        dimension: {// Dimension related options
            maxWidth: 2000, // Max. shape width
            maxHeight: 2000, // Max. shape height
            precision: 2, // Floating point precision
            attributes: false, // Width and height attributes on embedded shapes
        },
        spacing: { // Spacing related options
            padding: 0, // Padding around all shapes
            box: 'content' // Padding strategy (similar to CSS `box-sizing`)
        },
        transform: ['svgo'], // List of transformations / optimizations
        // meta: null, // Path to YAML file with meta / accessibility data
        // align: null, // Path to YAML file with extended alignment data
        // dest: null // Output directory for optimized intermediate SVG shapes
    },
    svg: { // General options for created SVG files
        xmlDeclaration: false, // Add XML declaration to SVG sprite
        // xmlDeclaration: true, // Add XML declaration to SVG sprite
        doctypeDeclaration: true, // Add DOCTYPE declaration to SVG sprite
        namespaceIDs: true, // Add namespace token to all IDs in SVG shapes
        // namespaceIDPrefix: '', // Add a prefix to the automatically generated namespaceIDs
        // namespaceClassnames: true, // Add namespace token to all CSS class names in SVG shapes
        namespaceClassnames: false, // Add namespace token to all CSS class names in SVG shapes
        dimensionAttributes: true // Width and height attributes on the sprite
    },
    variables: {}, // Custom Mustache templating variables and functions
    mode: {
        css: { // CSS sprite mode
            render: {
                css: true // Render CSS stylesheet
            }
        },
        view: true, // Create a «view» sprite
        defs: true, // Create a «defs» sprite
        // symbol: true, // Create a «symbol» sprite
        symbol: {        // Create a «symbol» sprite
            // dest: ".",
            // inline: true, // Prepare for inline embedding
            sprite: "icon.gl.svg"
        },
        stack: true, // Create a «stack» sprite
        // symbol: true // Symbol sprite mode

    }
};


// ============================================================================
// Export
// ============================================================================

export default svgspriteConfig;

        // "svgo": {
        //     "multipass": true,
        //     "plugins": [
        //         {
        //             "name": "preset-default",
        //             "params": {
        //             "overrides": {
        //                 "removeUnknownsAndDefaults": {
        //                     "keepDataAttrs": false,
        //                     "keepRoleAttr": true
        //                 },
        //                 "removeViewBox": false
        //             }
        //             }
        //         },
        //         "cleanupListOfValues",
        //         "removeXMLNS",
        //         {
        //             "name": "removeAttrs",
        //             "params": {
        //                 "attrs": [
        //                     "clip-rule",
        //                     "fill"
        //                 ]
        //             }
        //         }
        //     ]
        // }
    
                // <mode>: {
        //     dest: "<mode>", // Mode specific output directory
        //     prefix: "svg-%s", // Prefix for CSS selectors
        //     dimensions: "-dims", // Suffix for dimension CSS selectors
        //     sprite: "svg/sprite.<mode>.svg", // Sprite path and name
        //     bust: true || false, // Cache busting (mode dependent default value)
        //     render: { // Stylesheet rendering definitions
        //         /* -------------------------------------------
        //         css: false, // CSS stylesheet options
        //         scss: false, // Sass stylesheet options
        //         less: false, // LESS stylesheet options
        //         styl: false, // Stylus stylesheet options
        //         <custom>: ... // Custom stylesheet options
        //         -------------------------------------------    */
        //     },
        //     example: false // Create an HTML example document
        // }