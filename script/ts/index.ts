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

import SvgPackager from "./SvgPackager.js";
// import * as fantasticon from 'fantasticon';
import path from 'path';
import fs from 'fs';
import { FontAssetType, generateFonts, OtherAssetType } from 'fantasticon';

import svgSprite from 'svg-sprite';


import sass from 'sass';
import postcss from 'postcss';

import postcssConfigCompressed from "./postcss.config.compressed.js";
import postcssConfigExpanded from "./postcss.config.expanded.js";
import svgspriteConfig from "./svg-sprite.config.js";


// SVG
// ============================================================================

const svgPackager = new SvgPackager();


async function generateSvgFiles() {
    console.log('Current directory: ' + process.cwd());

    try {
        await svgPackager.processSvgFiles(
            './src/svg',
            './dist/svg'
        );
        console.log('SVG files processed successfully');
    } catch (error) {
        console.error('Error processing SVG files:', error);
    }
}

generateSvgFiles();





// ============================================================================
// Fonts
// ============================================================================

generateFonts( {

    // RunnerMandatoryOptions
    inputDir: './dist/svg', // (required)
    outputDir: './dist/font', // (required)

    // RunnerOptionalOptions
    name: 'icon.gl',
    fontTypes: [
        FontAssetType.TTF,      // TTF = "ttf"
        FontAssetType.WOFF,     // WOFF = "woff"
        FontAssetType.WOFF2,    // WOFF2 = "woff2"
        FontAssetType.EOT,      // EOT = "eot"
        FontAssetType.SVG,      // SVG = "svg"
    ],
    assetTypes: [
        OtherAssetType.CSS,     // CSS = "css",
        OtherAssetType.SCSS,    // SCSS = "scss",
        OtherAssetType.SASS,    // SASS = "sass",
        OtherAssetType.HTML,    // HTML = "html",
        OtherAssetType.JSON,    // JSON = "json",
        OtherAssetType.TS,      // TS = "ts"    
    ],
    formatOptions: {
        // woff: {
        //   // Woff Extended Metadata Block - see https://www.w3.org/TR/WOFF/#Metadata
        //   metadata: '...'
        // },
        // ttf?: TtfOptions; // type TtfOptions = svg2ttf.FontOptions;
        // svg?: SvgOptions;  // type SvgOptions = Omit<SvgIcons2FontOptions, 'fontName' | 'fontHeight' | 'descent' | 'normalize'>;
        json: { indent: 4 } ,
        ts: {
          // select what kind of types you want to generate
          // (default `['enum', 'constant', 'literalId', 'literalKey']`)
          types: ['enum', 'constant', 'literalId', 'literalKey'],
          // render the types with `'` instead of `"` (default is `"`)
          singleQuotes: false,
          // customise names used for the generated types and constants
          enumName: 'icon_gl',
          constantName: 'MY_CODEPOINTS'
          // literalIdName: 'IconId',
          // literalKeyName: 'IconKey'
        }
    },
    pathOptions: {
        json:   './dist/font/icon.gl.json',
        css:    './dist/font/icon.gl.css',
        scss:   './dist/font/icon.gl.scss',
        woff:   './dist/font/icon.gl.woff',
        woff2:  './dist/font/icon.gl.woff2',
    },
    // codepoints: {
    //     'chevron-left':     57344, // decimal representation of 0xe000
    //     'chevron-right':    57345,
    //     'thumbs-up':        57358,
    //     'thumbs-down':      57359,
    // },
    // fontHeight: number;
    // descent: number;
    // normalize: boolean;
    // round: number;
    selector: '.igl',
    // tag: string;
    // Use our custom Handlebars templates
    // templates: {
    //     css: './build/font/icon.gl.css.hbs',
    //     scss: './build/font/icon.gl.scss.hbs'
    // }, 
    prefix: 'igl',
    fontsUrl: './fonts',

    // Customize generated icon IDs (unavailable with `.json` config file)
    // getIconId: ({
    //     basename, // `string` - Example: 'foo';
    //     relativeDirPath, // `string` - Example: 'sub/dir/foo.svg'
    //     absoluteFilePath, // `string` - Example: '/var/icons/sub/dir/foo.svg'
    //     relativeFilePath, // `string` - Example: 'foo.svg'
    //     index // `number` - Example: `0`
    // }) => [index, basename].join('_') // '0_foo'
    
} );
// }).then(results => console.log('Done', results));



// Sprite
// ============================================================================




function generateSvgSprite(sourceDir: string, outputDir: string, config: any) {


    fs.readdir(sourceDir, (err, files) => {
        if (err) {
            console.error('Error reading SVG files:', err);
            return;
        }

        const sprite = new svgSprite(config);

        // Add SVG source files
        files.forEach(file => {
            if (path.extname(file) === '.svg') {
                let svgPath = path.resolve(sourceDir, file)
                console.log(svgPath);
                sprite.add(svgPath, null, fs.readFileSync(path.resolve(sourceDir, file), 'utf8'));
            }
        });

        // Compile the sprite
        sprite.compile((error, result) => {
            // console.log(result);
            /* Write `result` files to disk (or do whatever with them ...) */
            for (const mode in result) {
                for (const resource in result[mode]) {
                    // let outputPath = path.resolve(outputDir, result[mode].sprite.filename);
                    let outputPath = path.resolve(outputDir, result[mode][resource].path);
                    console.log(outputPath);
                    // fs.writeFileSync(outputPath, result[mode].sprite.contents);
                    fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
                    fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
                }
            }
        });
    });
}

// generateSvgSprite('./dist/svg', './dist/sprite', svgspriteConfig);


(async () => {
    await generateSvgFiles(); // Ensure SVG files are generated first
    await generateSvgSprite('./dist/svg', './dist/sprite', svgspriteConfig);
})();


// SASS
// ============================================================================

async function processPostCSS(css: string, styleOption: 'expanded' | 'compressed') {
    const config = styleOption === 'expanded' ? postcssConfigExpanded : postcssConfigCompressed;
    return postcss(config.plugins).process(css, { from: undefined, map: { inline: false } });
}

async function processStyles(inputFile: string, outputFile: fs.PathOrFileDescriptor, styleOption: 'expanded' | 'compressed') {
    try {
        // Compile SCSS to CSS
        const result = await sass.compileAsync(inputFile, { style: styleOption });
        // Process the compiled CSS with PostCSS and Autoprefixer
        const processed = await processPostCSS(result.css, styleOption);
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


// Process with expanded style
processStyles('./src/scss/index.scss', './dist/css/icon.gl.css', 'expanded');
// Process with compressed style
processStyles('./src/scss/index.scss', './dist/css/icon.gl.min.css', 'compressed');
