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
import FontGenerator from './FontGenerator.js';
import SvgPackager from "./SvgPackager.js";
import StyleProcessor from "./StyleProcessor.js";
import SvgSpriteGenerator from "./SvgSpriteGenerator.js";
import PackageCreator from './PackageCreator.js';
import DirectoryCreator from './DirectoryCreator.js'; // Adjust the import path as needed
import VersionWriter from './VersionWriter.js'; // Adjust the path as needed


import { CONFIG } from './config/config.js';
import svgspriteConfig from "./config/svgsprite.config.js";
import packageConfig from "./config/package.config.js"


// ============================================================================
// Constants
// ============================================================================

// Initialize instances of necessary classes
const svgPackager = new SvgPackager();
const fontGenerator = new FontGenerator();
const spriteGenerator = new SvgSpriteGenerator(svgspriteConfig);
const styleProcessor = new StyleProcessor();
const dirCreator = new DirectoryCreator();
const directories = Object.values(CONFIG.path);
const versionWriter = new VersionWriter();
const packageCreator = new PackageCreator(packageConfig);

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



        // Dirs
        // --------------------------------------------------------------------
        console.log('Starting Directory creation...');
        // Assuming the base path is the current directory
        await dirCreator.createDirectories('.', directories);


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


        // Version
        // --------------------------------------------------------------------
        await versionWriter.writeVersionToFile('VERSION', packageConfig.version);


        // Package JSON
        // --------------------------------------------------------------------

        await packageCreator.createPackageJson(CONFIG.path.dist);


        // --------------------------------------------------------------------

    } catch (error) {
        console.error('An error occurred:', error);
    }

}


// Execute the main function
main();
