import { __awaiter } from "tslib";
import path from 'path';
import { CONFIG } from './config/config.js';
import FontGenerator from './FontGenerator.js';
import SvgPackager from "./SvgPackager.js";
import StyleProcessor from "./StyleProcessor.js";
import SvgSpriteGenerator from "./SvgSpriteGenerator.js";
import PackageCreator from './PackageCreator.js';
import DirectoryCreator from './DirectoryCreator.js';
import svgspriteConfig from "./config/svgsprite.config.js";
const svgPackager = new SvgPackager();
const fontGenerator = new FontGenerator();
const spriteGenerator = new SvgSpriteGenerator(svgspriteConfig);
const styleProcessor = new StyleProcessor();
const dirCreator = new DirectoryCreator();
const directories = Object.values(CONFIG.path);
const creator = new PackageCreator({
    name: 'your-package-name',
    version: '1.0.0',
    description: 'Your package description',
    main: 'index.js',
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting createDirectories processing...');
            yield dirCreator.createDirectories('.', directories);
            console.log('Starting SVG processing...');
            yield svgPackager.processSvgFiles(CONFIG.path.svg_input, CONFIG.path.svg_output, CONFIG.path.ts_output, CONFIG.path.json_output);
            console.log('SVG processing completed.');
            console.log('Starting font generation...');
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output);
            console.log('Font generation completed.');
            console.log('Starting SVG Sprite generation...');
            yield spriteGenerator.generateSprite(CONFIG.path.sprite_input, CONFIG.path.sprite_output);
            console.log('SVG Sprite generation completed.');
            console.log('Processing SASS...');
            yield styleProcessor.processStyles(path.join(CONFIG.path.style_input, 'index.scss'), path.join(CONFIG.path.style_output, 'icon.gl.css'), 'expanded');
            yield styleProcessor.processStyles(path.join(CONFIG.path.style_input, 'index.scss'), path.join(CONFIG.path.style_output, 'icon.gl.min.css'), 'compressed');
            console.log('SASS Processing completed.');
            yield creator.createPackageJson(CONFIG.path.dist);
        }
        catch (error) {
            console.error('An error occurred:', error);
        }
    });
}
main();
//# sourceMappingURL=index.js.map