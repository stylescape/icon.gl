// script/class/StyleProcessor.ts

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

import * as sass from 'sass'
import postcss from 'postcss';
import fs from 'fs';
import postcssConfigExpanded from '../config/postcss.config.expanded.js';
import postcssConfigCompressed from '../config/postcss.config.compressed.js';


// ============================================================================
// Classes
// ============================================================================

/**
 * Class responsible for processing styles, including compiling SCSS and
 * applying PostCSS transformations.
 */
class StyleProcessor {

    /**
     * Processes the given CSS with PostCSS based on the provided style option.
     * @param css The CSS string to process.
     * @param styleOption The style option, either 'expanded' or 'compressed'.
     * @returns Processed CSS string.
     */
    async processPostCSS(
        css: string,
        styleOption: 'expanded' | 'compressed'
    ) {
        const config = styleOption === 'expanded' ? postcssConfigExpanded : postcssConfigCompressed;
        return postcss(config.plugins).process(css, { from: undefined, map: { inline: false } });
    }

    /**
     * Compiles SCSS to CSS and processes it using PostCSS.
     * @param inputFile Path to the input SCSS file.
     * @param outputFile Path to the output CSS file.
     * @param styleOption Style option for the output.
     */
    async processStyles(
        inputFile: string,
        outputFile: fs.PathOrFileDescriptor,
        styleOption: 'expanded' | 'compressed'
    ) {
        try {

            // Compile SCSS to CSS
            const result = await sass.compileAsync(
                inputFile, { style: styleOption }
            );

            // Process the compiled CSS with PostCSS and Autoprefixer
            const processed = await this.processPostCSS(
                result.css,
                styleOption
            );

            // Write the processed CSS to a file
            fs.writeFileSync(outputFile, processed.css);

            // Write the source map file
            if (processed.map) {
                fs.writeFileSync(`${outputFile}.map`, processed.map.toString());
            }
        } catch (err) {
            // Handle errors in the compilation or processing
            console.error(`Error processing styles from ${inputFile}:`, err);
        }
    }
}


// ============================================================================
// Export
// ============================================================================

export default StyleProcessor;
