// script/index.ts

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

// Import necessary modules and classes
import path from 'path';
import { CONFIG } from './config/config.js';
import FontGenerator from './FontGenerator.js';
import SvgPackager from "./SvgPackager.js";
import StyleProcessor from "./StyleProcessor.js";
import SvgSpriteGenerator from "./SvgSpriteGenerator.js";
import svgspriteConfig from "./config/svgsprite.config.js";


// ============================================================================
// Constants
// ============================================================================

// Initialize instances of necessary classes
const svgPackager = new SvgPackager();
const fontGenerator = new FontGenerator();
const spriteGenerator = new SvgSpriteGenerator(svgspriteConfig);
const styleProcessor = new StyleProcessor();


// ============================================================================
// Functions
// ============================================================================

/**
 * Main function to orchestrate the various processes.
 * It handles SVG processing, font generation, SVG sprite generation, and SASS
 * processing.
 */
async function main() {

    try {

        // SVG
        // --------------------------------------------------------------------
        console.log('Starting SVG processing...');
        await svgPackager.processSvgFiles(
            CONFIG.path.svg_input,
            CONFIG.path.svg_output,
            CONFIG.path.ts_output,
            CONFIG.path.json_output,
        );
        console.log('SVG processing completed.');


        // Font
        // --------------------------------------------------------------------
        console.log('Starting font generation...');
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
        );
        console.log('Font generation completed.');


        // Sprite
        // --------------------------------------------------------------------
        console.log('Starting SVG Sprite generation...');
        await spriteGenerator.generateSprite(
            CONFIG.path.sprite_input,
            CONFIG.path.sprite_output,
        );
        console.log('SVG Sprite generation completed.');


        // SASS
        // --------------------------------------------------------------------
        console.log('Processing SASS...');
        // Process with expanded style
        await styleProcessor.processStyles(
            path.join(CONFIG.path.style_input, 'index.scss'),
            path.join(CONFIG.path.style_output, 'icon.gl.css'),
            'expanded'
        );
        // Process with compressed style
        await styleProcessor.processStyles(
            path.join(CONFIG.path.style_input, 'index.scss'),
            path.join(CONFIG.path.style_output, 'icon.gl.min.css'),
            'compressed'
        );
        console.log('SASS Processing completed.');


        // --------------------------------------------------------------------

    } catch (error) {
        console.error('An error occurred:', error);
    }

}

// Execute the main function
main();
