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
import { promises as fs } from 'fs';

import {
    DirectoryScanner,
    DirectoryCleaner,
    DirectoryCopier,
    DirectoryCreator,
    FileCopier,
    FileRenamer,
    FontGenerator,
    FilenameExtractor,
    StyleProcessor,
    SvgPackager,
    SvgSpriteGenerator,
    PackageCreator,
    VersionWriter,
    TypeScriptCompiler,
    JavaScriptMinifier,
    StylizedLogger,
    // TemplateWriter,
    SvgToPngConverter,
    gl_installer,
    readPackageJson,
    SvgReader,
    // svgspriteConfig
} from 'pack.gl';


// ============================================================================
// Constants
// ============================================================================

const CONFIG = {
    path: {
        root:      '.',
        src:      './src',
        dist:      './dist',

        svg_input:          './src/svg',
        svg_output:         './dist/svg',
        sprite_input:       './dist/svg',
        sprite_output:      './dist/sprite',
        font_input:         './dist/svg',
        font_output:        './dist/font',
        scss_input:         './src/scss',
        scss_output:        './dist/scss',
        css_output:         './dist/css',
        json_output:        './dist',
        ts_input:           './src/ts',
        ts_output:          './dist/ts',
        ts_output_icons:    './src/ts/icons',
        js_output:          './dist/js',

    },

};






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


        // Init Logger
        // --------------------------------------------------------------------

        const logger = new StylizedLogger();


        // Install .gl libraries
        // --------------------------------------------------------------------

        logger.header('Install .gl libraries');
        // await gl_installer();


        // Dirs Clean
        // --------------------------------------------------------------------

        const directoryCleaner = new DirectoryCleaner();
        logger.header('Clean Directories');
        directoryCleaner.cleanDirectory(CONFIG.path.dist);
        logger.body(`Directory cleaned: ${CONFIG.path.dist}`);


        // Package JSON
        // --------------------------------------------------------------------

        const localPackageConfig = await readPackageJson('./package.json');
        const packageCreator = new PackageCreator(localPackageConfig);
        const packageConfig = packageCreator.config
        packageCreator.createPackageJson(CONFIG.path.dist);


        // SVG
        // --------------------------------------------------------------------

        const directoryCreator = new DirectoryCreator();
        await directoryCreator.createDirectories(CONFIG.path.dist,  ['svg']);
        const svgPackager = new SvgPackager(
            path.join(CONFIG.path.root, 'bin/ts/config/svgo.config.js'),    
        );
        try {
            await svgPackager.processSvgFiles(
                CONFIG.path.svg_input,
                CONFIG.path.svg_output,
                CONFIG.path.ts_output_icons,
                CONFIG.path.json_output,
            );
        } catch (error) {
            console.error('Failed to process SVG files:', error);
        }

        
        // PNG
        // --------------------------------------------------------------------

        const directoryScanner = new DirectoryScanner();
        const svgReader = new SvgReader();
        const converter = new SvgToPngConverter();
        const extractor = new FilenameExtractor();
        const svg_paths = await directoryScanner.scanDirectory(CONFIG.path.svg_input, true)

        console.log(svg_paths);
        for (const svg_path of svg_paths) {
            console.log(svg_path);
            if (path.extname(svg_path) == 'svg'){
                const filenameWithoutExtension = extractor.getFilenameWithoutExtension(svg_path);
                const svgContent = await svgReader.readSVG(svg_path);
                // Define the desired sizes for the PNG files
                const sizes = [16, 32, 64, 128, 256, 512, 720];
                for (const size of sizes) {
                    const pngOutputPath = path.join(CONFIG.path.dist, 'png', `${size}`, `${filenameWithoutExtension}.png`);
                    await converter.convert(svgContent, pngOutputPath, size, size);
                    console.log(`Converted to PNG: ${pngOutputPath}`);
                }
            };
        }


        // Font
        // --------------------------------------------------------------------
    
        console.log('Starting font generation...');
        await directoryCreator.createDirectories(CONFIG.path.dist, ['font']);
        const fontGenerator = new FontGenerator(
            {
                name: 'icon',
                prefix: 'icon',
                fontsUrl: './font',
                // fontHeight: number;
                // descent: number;
                // normalize: boolean;
                // round: number;
                selector: '.i',
                // tag: string;

                fontTypes: [
                    // FontAssetType.TTF,      // TTF = "ttf"
                    // FontAssetType.WOFF,     // WOFF = "woff"
                    // FontAssetType.WOFF2,    // WOFF2 = "woff2"
                    // FontAssetType.EOT,      // EOT = "eot"
                    // FontAssetType.SVG,      // SVG = "svg"
                ],
                assetTypes: [
                    // OtherAssetType.CSS,     // CSS = "css",
                    // OtherAssetType.SCSS,    // SCSS = "scss",
                    // OtherAssetType.SASS,    // SASS = "sass",
                    // OtherAssetType.HTML,    // HTML = "html",
                    // OtherAssetType.JSON,    // JSON = "json",
                    // OtherAssetType.TS,      // TS = "ts"    
                ],
            }

        );


        // Fonts
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
            {
                fontTypes: ["ttf", "woff", "woff2", "eot", "svg",],
                pathOptions: {
                    ttf:    path.join(CONFIG.path.src, 'font', 'icon.ttf'),
                    woff:   path.join(CONFIG.path.src, 'font', 'icon.woff'),
                    woff2:  path.join(CONFIG.path.src, 'font', 'icon.woff2'),
                    eot:    path.join(CONFIG.path.src, 'font', 'icon.eot'),
                    svg:    path.join(CONFIG.path.src, 'font', 'icon.svg'),
                },
            }
        );
        // SCSS Font Face
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
            {
                assetTypes: [ "scss", ],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_face.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_face.scss.hbs'), }, 
            }
        );
        // SCSS Font Base
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
            {
                assetTypes: [ "scss", ],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_base.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_base.scss.hbs'), }, 
            }
        );
        // SCSS Font Map
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
            {
                assetTypes: [ "scss", ],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_map.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_map.scss.hbs'), }, 
            }
        );
        // SCSS Font Classes
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
            {
                assetTypes: [ "scss", ],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_class.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_class.scss.hbs'), }, 
            }
        );

        // HTML
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
            {
                assetTypes: [ "html", ],
                pathOptions: { html: path.join(CONFIG.path.src, 'html', 'test.html'), },
                templates: { html: path.join(CONFIG.path.src, 'hbs', 'test.html.hbs'), }, 
            }
        );


        // JSON
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
            {
                assetTypes: [ "json", ],
                pathOptions: { json: path.join(CONFIG.path.src, 'json', 'icon.json'), },
                // templates: { json: path.join(CONFIG.path.src, 'hbs', 'test.html.hbs'), }, 
            }
        );

        console.log('Font generation completed.');


        // Sprite
        // --------------------------------------------------------------------

        // const spriteGenerator = new SvgSpriteGenerator(svgspriteConfig);
        const spriteGenerator = new SvgSpriteGenerator();
        console.log('Starting SVG Sprite generation...');
        await spriteGenerator.generateSprite(
            CONFIG.path.sprite_input,
            CONFIG.path.sprite_output,
        );
        console.log('SVG Sprite generation completed.');


        // SASS
        // --------------------------------------------------------------------

        const styleProcessor = new StyleProcessor();
        logger.header('Processing SASS...');
        // Process with expanded style
        await styleProcessor.processStyles(
            path.join(CONFIG.path.scss_input, 'index.scss'),
            // path.join(CONFIG.path.css_output, `${packageConfig.name}.css`),
            path.join(CONFIG.path.css_output, `icon.css`),
            'expanded'
        );
        // Process with compressed style
        await styleProcessor.processStyles(
            path.join(CONFIG.path.scss_input, 'index.scss'),
            // path.join(CONFIG.path.css_output, `${packageConfig.name}.min.css`),
            path.join(CONFIG.path.css_output, `icon.min.css`),
            'compressed'
        );
        logger.body('SASS Processing completed.');


        // Copy files
        // --------------------------------------------------------------------

        const fileCopier = new FileCopier();
        fileCopier.copyFileToDirectory(
            path.join('.', 'README.md'),
            CONFIG.path.dist,
        )
        fileCopier.copyFileToDirectory(
            path.join('.', 'LICENSE'),
            CONFIG.path.dist,
        )
        // fileCopier.copyFileToDirectory(
        //     path.join('.', 'LICENSE-CODE'),
        //     CONFIG.path.dist,
        // )
        fileCopier.copyFileToDirectory(
            path.join(CONFIG.path.src, 'html', 'test.html'),
            CONFIG.path.dist,
        )

        // Copy Dirs
        // --------------------------------------------------------------------

        const directoryCopier = new DirectoryCopier();
        await directoryCopier.recursiveCopy(
            CONFIG.path.ts_input,
            CONFIG.path.ts_output,
        );
        await directoryCopier.recursiveCopy(
            CONFIG.path.scss_input,
            CONFIG.path.scss_output,
        );
        await directoryCopier.recursiveCopy(
            path.join(CONFIG.path.src, 'font'),
            path.join(CONFIG.path.dist, 'font'),
        );
        await directoryCopier.recursiveCopy(
            path.join(CONFIG.path.src, 'html'),
            path.join(CONFIG.path.dist, 'html'),
        );
        await directoryCopier.recursiveCopy(
            path.join(CONFIG.path.src, 'json'),
            path.join(CONFIG.path.dist, 'json'),
        );

        console.log('Files copied successfully.');


        // Version
        // --------------------------------------------------------------------

        const versionWriter = new VersionWriter();
        await versionWriter.writeVersionToFile('VERSION', packageConfig.version);


        // Compile TypeScript to JavaScript
        // --------------------------------------------------------------------
        const tsCompiler = new TypeScriptCompiler();
        const tsFiles = [
            path.join(CONFIG.path.ts_input, 'index.ts'),
        ];
        const outputDir = './dist/js';
        // console.log('Starting TypeScript compilation...');
        await tsCompiler.compile(tsFiles, outputDir);
        // console.log('TypeScript compilation completed.');


        // Minify JavaScript
        // --------------------------------------------------------------------
        const jsMinifier = new JavaScriptMinifier();
        await jsMinifier.minifyFile(
            path.join(CONFIG.path.js_output, 'index.js'),
            path.join(CONFIG.path.js_output, `${packageConfig.name}.min.js`),
        )
        .then(() => console.log('JavaScript minification completed.'))
        .catch(console.error);


    } catch (error) {
        console.error('An error occurred:', error);
    }

}


// ============================================================================
// Main
// ============================================================================

// Execute the main function
main();
