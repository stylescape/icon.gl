import { __awaiter } from "tslib";
import SvgPackager from "./SvgPackager.js";
import path from 'path';
import fs from 'fs';
import { FontAssetType, generateFonts, OtherAssetType } from 'fantasticon';
import svgSprite from 'svg-sprite';
import sass from 'sass';
import postcss from 'postcss';
import postcssConfigCompressed from "./postcss.config.compressed.js";
import postcssConfigExpanded from "./postcss.config.expanded.js";
import svgspriteConfig from "./svg-sprite.config.js";
const svgPackager = new SvgPackager();
function generateSvgFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Current directory: ' + process.cwd());
        try {
            yield svgPackager.processSvgFiles('./src/svg', './dist/svg');
            console.log('SVG files processed successfully');
        }
        catch (error) {
            console.error('Error processing SVG files:', error);
        }
    });
}
generateSvgFiles();
generateFonts({
    inputDir: './dist/svg',
    outputDir: './dist/font',
    name: 'icon.gl',
    fontTypes: [
        FontAssetType.TTF,
        FontAssetType.WOFF,
        FontAssetType.WOFF2,
        FontAssetType.EOT,
        FontAssetType.SVG,
    ],
    assetTypes: [
        OtherAssetType.CSS,
        OtherAssetType.SCSS,
        OtherAssetType.SASS,
        OtherAssetType.HTML,
        OtherAssetType.JSON,
        OtherAssetType.TS,
    ],
    formatOptions: {
        json: { indent: 4 },
        ts: {
            types: ['enum', 'constant', 'literalId', 'literalKey'],
            singleQuotes: false,
            enumName: 'icon_gl',
            constantName: 'MY_CODEPOINTS'
        }
    },
    pathOptions: {
        json: './dist/font/icon.gl.json',
        css: './dist/font/icon.gl.css',
        scss: './dist/font/icon.gl.scss',
        woff: './dist/font/icon.gl.woff',
        woff2: './dist/font/icon.gl.woff2',
    },
    selector: '.igl',
    prefix: 'igl',
    fontsUrl: './fonts',
});
function generateSvgSprite(sourceDir, outputDir, config) {
    fs.readdir(sourceDir, (err, files) => {
        if (err) {
            console.error('Error reading SVG files:', err);
            return;
        }
        const sprite = new svgSprite(config);
        files.forEach(file => {
            if (path.extname(file) === '.svg') {
                let svgPath = path.resolve(sourceDir, file);
                console.log(svgPath);
                sprite.add(svgPath, null, fs.readFileSync(path.resolve(sourceDir, file), 'utf8'));
            }
        });
        sprite.compile((error, result) => {
            for (const mode in result) {
                for (const resource in result[mode]) {
                    let outputPath = path.resolve(outputDir, result[mode][resource].path);
                    console.log(outputPath);
                    fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
                    fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
                }
            }
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield generateSvgFiles();
    yield generateSvgSprite('./dist/svg', './dist/sprite', svgspriteConfig);
}))();
function processPostCSS(css, styleOption) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = styleOption === 'expanded' ? postcssConfigExpanded : postcssConfigCompressed;
        return postcss(config.plugins).process(css, { from: undefined, map: { inline: false } });
    });
}
function processStyles(inputFile, outputFile, styleOption) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield sass.compileAsync(inputFile, { style: styleOption });
            const processed = yield processPostCSS(result.css, styleOption);
            fs.writeFileSync(outputFile, processed.css);
            if (processed.map) {
                fs.writeFileSync(`${outputFile}.map`, processed.map.toString());
            }
        }
        catch (err) {
            console.error(`Error processing styles from ${inputFile}:`, err);
        }
    });
}
processStyles('./src/scss/index.scss', './dist/css/icon.gl.css', 'expanded');
processStyles('./src/scss/index.scss', './dist/css/icon.gl.min.css', 'compressed');
//# sourceMappingURL=index.js.map