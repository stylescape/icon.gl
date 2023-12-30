import { __awaiter } from "tslib";
import path from 'path';
import FontGenerator from './class/FontGenerator.js';
import SvgPackager from "./class/SvgPackager.js";
import StyleProcessor from "./class/StyleProcessor.js";
import SvgSpriteGenerator from "./class/SvgSpriteGenerator.js";
import PackageCreator from './class/PackageCreator.js';
import VersionWriter from './class/VersionWriter.js';
import FileCopier from './class/FileCopier.js';
import DirectoryCreator from './class/DirectoryCreator.js';
import DirectoryCopier from './class/DirectoryCopier.js';
import DirectoryCleaner from './class/DirectoryCleaner.js';
import TypeScriptCompiler from './class/TypeScriptCompiler.js';
import JavaScriptMinifier from './class/JavaScriptMinifier.js';
import { CONFIG } from './config/config.js';
import svgspriteConfig from "./config/svgsprite.config.js";
import packageConfig from "./config/package.config.js";
const directories = Object.values(CONFIG.path);
const dirCreator = new DirectoryCreator();
const svgPackager = new SvgPackager();
const fontGenerator = new FontGenerator();
const spriteGenerator = new SvgSpriteGenerator(svgspriteConfig);
const styleProcessor = new StyleProcessor();
const versionWriter = new VersionWriter();
const packageCreator = new PackageCreator(packageConfig);
const fileCopier = new FileCopier();
const directoryCopier = new DirectoryCopier();
const dirCleaner = new DirectoryCleaner();
const tsCompiler = new TypeScriptCompiler();
const jsMinifier = new JavaScriptMinifier();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            dirCleaner.cleanDirectory(CONFIG.path.dist);
            console.log(`Directory cleaned: ${CONFIG.path.dist}`);
            console.log('Starting Directory creation...');
            yield dirCreator.createDirectories('.', directories);
            console.log('Starting SVG processing...');
            yield svgPackager.processSvgFiles(CONFIG.path.svg_input, CONFIG.path.svg_output, CONFIG.path.ts_output_icons, CONFIG.path.json_output);
            console.log('SVG processing completed.');
            console.log('Starting font generation...');
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output);
            console.log('Font generation completed.');
            console.log('Starting SVG Sprite generation...');
            yield spriteGenerator.generateSprite(CONFIG.path.sprite_input, CONFIG.path.sprite_output);
            console.log('SVG Sprite generation completed.');
            console.log('Processing SASS...');
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, 'icon.gl.css'), 'expanded');
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, 'icon.gl.min.css'), 'compressed');
            console.log('SASS Processing completed.');
            try {
                yield directoryCopier.copyFiles(CONFIG.path.ts_input, CONFIG.path.ts_output);
                console.log('Files copied successfully.');
            }
            catch (error) {
                console.error('Error while copying files:', error);
            }
            try {
                yield directoryCopier.copyFiles(CONFIG.path.scss_input, CONFIG.path.scss_output);
                console.log('Files copied successfully.');
            }
            catch (error) {
                console.error('Error while copying files:', error);
            }
            yield versionWriter.writeVersionToFile('VERSION', packageConfig.version);
            yield packageCreator.createPackageJson(CONFIG.path.dist);
            try {
                const tsFiles = [
                    './src/ts/index.ts',
                ];
                const outputDir = './dist/js';
                console.log('Starting TypeScript compilation...');
                tsCompiler.compile(tsFiles, outputDir);
                console.log('TypeScript compilation completed.');
            }
            catch (error) {
                console.error('An error occurred:', error);
            }
            const inputJsFile = './path/to/your/script.js';
            const outputMinJsFile = './path/to/your/script.min.js';
            yield jsMinifier.minifyFile(inputJsFile, outputMinJsFile)
                .then(() => console.log('JavaScript minification completed.'))
                .catch(console.error);
        }
        catch (error) {
            console.error('An error occurred:', error);
        }
    });
}
main();
//# sourceMappingURL=index.js.map