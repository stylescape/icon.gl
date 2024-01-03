import { __awaiter } from "tslib";
import path from 'path';
import { DirectoryCleaner, DirectoryCopier, DirectoryCreator, FileCopier, FileRenamer, FontGenerator, StyleProcessor, SvgPackager, SvgSpriteGenerator, PackageCreator, VersionWriter, TypeScriptCompiler, JavaScriptMinifier } from 'pack.gl';
import { CONFIG } from './config/config.js';
import svgspriteConfig from "./config/svgsprite.config.js";
import packageConfig from "./config/package.config.js";
import tsConfig from "./config/ts.config.js";
import tensorConfig from "./config/terser.config.js";
const directories = Object.values(CONFIG.path);
const spriteGenerator = new SvgSpriteGenerator(svgspriteConfig);
const tsCompiler = new TypeScriptCompiler(tsConfig);
const jsMinifier = new JavaScriptMinifier(tensorConfig);
const packageCreator = new PackageCreator(packageConfig);
const svgPackager = new SvgPackager("./script/ts/config/svgo.config.ts");
const fontGenerator = new FontGenerator();
const styleProcessor = new StyleProcessor();
const versionWriter = new VersionWriter();
const fileCopier = new FileCopier();
const fileRenamer = new FileRenamer();
const directoryCopier = new DirectoryCopier();
const directoryCleaner = new DirectoryCleaner();
const directoryCreator = new DirectoryCreator();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            directoryCleaner.cleanDirectory(CONFIG.path.dist);
            console.log(`Directory cleaned: ${CONFIG.path.dist}`);
            console.log('Starting Directory creation...');
            yield directoryCreator.createDirectories('.', directories);
            try {
                yield svgPackager.processSvgFiles(CONFIG.path.svg_input, CONFIG.path.svg_output, CONFIG.path.ts_output_icons, CONFIG.path.json_output);
            }
            catch (error) {
                console.error('Failed to process SVG files:', error);
            }
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
                    path.join(CONFIG.path.ts_input, 'index.ts'),
                ];
                const outputDir = './dist/js';
                console.log('Starting TypeScript compilation...');
                tsCompiler.compile(tsFiles, outputDir);
                console.log('TypeScript compilation completed.');
            }
            catch (error) {
                console.error('An error occurred:', error);
            }
            yield fileRenamer.renameFile(path.join(CONFIG.path.js_output, 'index.js'), path.join(CONFIG.path.js_output, 'icon.gl.js'));
            yield jsMinifier.minifyFile(path.join(CONFIG.path.js_output, 'icon.gl.js'), path.join(CONFIG.path.js_output, 'icon.gl.min.js'))
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