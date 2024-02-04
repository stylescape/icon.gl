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
import { PathLike, promises as fs } from 'fs';

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
    TemplateWriter,
    SvgToPngConverter,
    gl_installer,
    readPackageJson,
    SvgReader,
    // svgspriteConfig
} from 'pack.gl';

class JSONLoader {
    /**
     * Asynchronously loads JSON data from a file and returns it as an object.
     * @param filePath The path to the JSON file.
     * @returns A promise that resolves to an object containing the JSON data.
     */
    async loadJSON<T>(filePath: string): Promise<T> {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data) as T;
        } catch (error) {
            console.error(`Error reading JSON file: ${filePath}`, error);
            throw error;
        }
    }

    /**
     * Asynchronously loads all JSON files from a given directory.
     * @param dirPath The path to the directory containing JSON files.
     * @returns A promise that resolves to an array of objects containing the JSON data.
     */
     async loadJSONFromDirectory<T>(dirPath: string): Promise<T[]> {
        try {
            const files = await fs.readdir(dirPath);
            const jsonFiles = files.filter(file => file.endsWith('.json'));

            const jsonData = await Promise.all(
                jsonFiles.map(file =>
                    this.loadJSON<T>(path.join(dirPath, file))
                )
            );

            return jsonData;
        } catch (error) {
            console.error(`Error reading JSON files from directory: ${dirPath}`, error);
            throw error;
        }
    }

    /**
     * Merges an array of objects into a single object.
     * @param objects An array of objects to merge.
     * @returns A single object containing all properties from the input objects.
     */
    async mergeJSONObjects<T>(objects: T[]): Promise<T> {
        return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {} as T);
    }
}

// export default JSONLoader;



async function getSubdirectories(directory: PathLike) {
    try {
        const dirents = await fs.readdir(directory, { withFileTypes: true });
        return dirents
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch (error) {
        console.error('Error reading directory:', error);
        throw error; // or handle it as needed
    }
}



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
        jinja_input:        './src/jinja',

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
            const subdirectories = await getSubdirectories(CONFIG.path.svg_input);
            // console.log(subdirectories);

            // const subfolders = getSubdirectories(CONFIG.path.svg_input);

            for (const subfolder of subdirectories) {
                await svgPackager.processSvgFiles(
                    path.join(CONFIG.path.svg_input, subfolder),
                    CONFIG.path.svg_output,
                    CONFIG.path.ts_output_icons,
                    CONFIG.path.json_output,
                );
            }
            // console.log(subdirectories);
        } catch (error) {
            console.error('Error listing subdirectories:', error);
        }

        // await svgPackager.processSvgFiles(
        //     CONFIG.path.svg_input,
        //     CONFIG.path.svg_output,
        //     CONFIG.path.ts_output_icons,
        //     CONFIG.path.json_output,
        // );


        // PNG
        // --------------------------------------------------------------------

        const directoryScanner = new DirectoryScanner();
        const svgReader = new SvgReader();
        const converter = new SvgToPngConverter();
        const extractor = new FilenameExtractor();
        const svg_paths = await directoryScanner.scanDirectory(CONFIG.path.svg_input, true)
        await directoryCreator.createDirectories(CONFIG.path.dist,  ['png']);
        for (const svg_path of svg_paths) {
            if (path.extname(svg_path) == '.svg'){
                const filenameWithoutExtension = extractor.getFilenameWithoutExtension(svg_path);
                const svgContent = await svgReader.readSVG(svg_path);
                // Define the desired sizes for the PNG files
                // const sizes = [16, 32, 64, 128, 256, 512, 720];
                const sizes = [512];
                for (const size of sizes) {
                    const pngOutputPath = path.join(CONFIG.path.dist, 'png', `${size}`, `${filenameWithoutExtension}.png`);
                    await converter.convert(svgContent, pngOutputPath, size, size);
                    // console.log(`Converted to PNG: ${pngOutputPath}`);
                }
            };
        }


        // Font
        // --------------------------------------------------------------------
    
        console.log('Starting font generation...');
        await directoryCreator.createDirectories(CONFIG.path.dist, ['font']);

        const jsonLoader = new JSONLoader();
        const codepoint_data = await jsonLoader.loadJSONFromDirectory(path.join(CONFIG.path.src, 'json', 'codepoint'));
        const codepoints = await jsonLoader.mergeJSONObjects(codepoint_data);

        const fontGenerator = new FontGenerator(
            {
                name: 'icongl',
                prefix: 'i',
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
                codepoints: codepoints,
            }

        );


        // Fonts
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
            {
                fontTypes: ["ttf", "woff", "woff2", "eot", "svg",],
                pathOptions: {
                    ttf:    path.join(CONFIG.path.src, 'font', 'icongl.ttf'),
                    woff:   path.join(CONFIG.path.src, 'font', 'icongl.woff'),
                    woff2:  path.join(CONFIG.path.src, 'font', 'icongl.woff2'),
                    eot:    path.join(CONFIG.path.src, 'font', 'icongl.eot'),
                    svg:    path.join(CONFIG.path.src, 'font', 'icongl.svg'),
                },
            }
        );

        // SCSS Font Variables
        // await fontGenerator.generateFonts(
        //     CONFIG.path.font_input,
        //     CONFIG.path.font_output,
        //     {
        //         assetTypes: [ "scss", ],
        //         pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'variables', '_font.scss'), },
        //         templates: { scss: path.join(CONFIG.path.src, 'hbs', '_variables_font.scss.hbs'), }, 
        //     }
        // );
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
        // await fontGenerator.generateFonts(
        //     CONFIG.path.font_input,
        //     CONFIG.path.font_output,
        //     {
        //         assetTypes: [ "scss", ],
        //         pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_base.scss'), },
        //         templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_base.scss.hbs'), }, 
        //     }
        // );
        // SCSS Font Map
        await fontGenerator.generateFonts(
            CONFIG.path.font_input,
            CONFIG.path.font_output,
            {
                assetTypes: [ "scss", ],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'variables', '_font.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_variables.scss.hbs'), }, 
            }
        );
        // SCSS Font Classes
        // await fontGenerator.generateFonts(
        //     CONFIG.path.font_input,
        //     CONFIG.path.font_output,
        //     {
        //         assetTypes: [ "scss", ],
        //         pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_class.scss'), },
        //         templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_class.scss.hbs'), }, 
        //     }
        // );

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



        // MD Writer
        // --------------------------------------------------------------------

        logger.header('MD Writer');

        try {
            const subdirectories = await getSubdirectories(CONFIG.path.svg_input);
            // console.log(subdirectories);
            // const subfolders = getSubdirectories(CONFIG.path.svg_input);
            const groups = []
            for (const subfolder of subdirectories) {
                const svg_paths = await directoryScanner.scanDirectory(path.join(CONFIG.path.svg_input, subfolder), false)
                console.log(svg_paths)
                const names = []

                for (const svg_path of svg_paths) {
                    if (path.extname(svg_path) == '.svg'){
        
                        let name = extractor.getFilenameWithoutExtension(svg_path);
                        names.push(name);
                    }
                }
                groups.push(
                    {
                        group: subfolder,
                        icons: names,
                    }
                );

            //     await svgPackager.processSvgFiles(
            //         path.join(CONFIG.path.svg_input, subfolder),
            //         CONFIG.path.svg_output,
            //         CONFIG.path.ts_output_icons,
            //         CONFIG.path.json_output,
            //     );
            }
            const template_context = {
                groups: groups,
            }
            const templater_md = new TemplateWriter(CONFIG.path.jinja_input, template_context);
            await templater_md.generateToFile('icon.gl.md.jinja', path.join(CONFIG.path.dist, 'md', 'icon.gl.md'));
    
        } catch (error) {
            console.error('Error listing subdirectories:', error);
        }




        // const png_paths = await directoryScanner.scanDirectory(path.join(CONFIG.path.dist, 'png', '512'), true)
        // let png_names = []
        // for (const png_path of png_paths) {
        //     if (path.extname(png_path) == '.png'){

        //         let png_name = extractor.getFilenameWithoutExtension(png_path);
        //         png_names.push(png_name);
        //     }
        // }
        // const template_context = {
        //     names: png_names,
        // }
        // const templater_md = new TemplateWriter(CONFIG.path.jinja_input, template_context);
        // await templater_md.generateToFile('icon.gl.md.jinja', path.join(CONFIG.path.dist, 'md', 'icon.gl.md'));


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
        // fileCopier.copyFileToDirectory(
        //     path.join(CONFIG.path.src, 'html', 'test.html'),
        //     CONFIG.path.dist,
        // )

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



        // TypeScript Icon Export File
        // --------------------------------------------------------------------
        async function generateExports() {
            const iconsDir = CONFIG.path.ts_output_icons;
            const exportFilePath = path.join(CONFIG.path.ts_input, 'icons.ts');
            let exportStatements = '';
          
            try {
                const files = await fs.readdir(iconsDir);
                files.forEach(file => {
                  if (file.endsWith('.ts') && file !== 'index.ts') {
                    const moduleName = path.basename(file, '.ts');
                    exportStatements += `export * from './icons/${moduleName}';\n`;
                  }
                });
            
                await fs.writeFile(exportFilePath, exportStatements);
                console.log('Export file created successfully');
              } catch (error) {
                console.error('Error generating exports:', error);
              }
            }
          
        generateExports();
        

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
