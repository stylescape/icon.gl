import { __awaiter } from "tslib";
import path from 'path';
import { DirectoryScanner, DirectoryCleaner, DirectoryCopier, DirectoryCreator, FileCopier, FontGenerator, FilenameExtractor, StyleProcessor, SvgPackager, SvgSpriteGenerator, PackageCreator, VersionWriter, TypeScriptCompiler, JavaScriptMinifier, StylizedLogger, SvgToPngConverter, readPackageJson, SvgReader, } from 'pack.gl';
const CONFIG = {
    path: {
        root: '.',
        src: './src',
        dist: './dist',
        svg_input: './src/svg',
        svg_output: './dist/svg',
        sprite_input: './dist/svg',
        sprite_output: './dist/sprite',
        font_input: './dist/svg',
        font_output: './dist/font',
        scss_input: './src/scss',
        scss_output: './dist/scss',
        css_output: './dist/css',
        json_output: './dist',
        ts_input: './src/ts',
        ts_output: './dist/ts',
        ts_output_icons: './src/ts/icons',
        js_output: './dist/js',
    },
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const logger = new StylizedLogger();
            logger.header('Install .gl libraries');
            const directoryCleaner = new DirectoryCleaner();
            logger.header('Clean Directories');
            directoryCleaner.cleanDirectory(CONFIG.path.dist);
            logger.body(`Directory cleaned: ${CONFIG.path.dist}`);
            const localPackageConfig = yield readPackageJson('./package.json');
            const packageCreator = new PackageCreator(localPackageConfig);
            const packageConfig = packageCreator.config;
            packageCreator.createPackageJson(CONFIG.path.dist);
            const directoryCreator = new DirectoryCreator();
            yield directoryCreator.createDirectories(CONFIG.path.dist, ['svg']);
            const svgPackager = new SvgPackager(path.join(CONFIG.path.root, 'bin/ts/config/svgo.config.js'));
            try {
                yield svgPackager.processSvgFiles(CONFIG.path.svg_input, CONFIG.path.svg_output, CONFIG.path.ts_output_icons, CONFIG.path.json_output);
            }
            catch (error) {
                console.error('Failed to process SVG files:', error);
            }
            const directoryScanner = new DirectoryScanner();
            const svgReader = new SvgReader();
            const converter = new SvgToPngConverter();
            const extractor = new FilenameExtractor();
            const svg_paths = yield directoryScanner.scanDirectory(CONFIG.path.svg_input, true);
            console.log(svg_paths);
            for (const svg_path of svg_paths) {
                console.log(svg_path);
                if (path.extname(svg_path) == 'svg') {
                    const filenameWithoutExtension = extractor.getFilenameWithoutExtension(svg_path);
                    const svgContent = yield svgReader.readSVG(svg_path);
                    const sizes = [16, 32, 64, 128, 256, 512, 720];
                    for (const size of sizes) {
                        const pngOutputPath = path.join(CONFIG.path.dist, 'png', `${size}`, `${filenameWithoutExtension}.png`);
                        yield converter.convert(svgContent, pngOutputPath, size, size);
                        console.log(`Converted to PNG: ${pngOutputPath}`);
                    }
                }
                ;
            }
            console.log('Starting font generation...');
            yield directoryCreator.createDirectories(CONFIG.path.dist, ['font']);
            const fontGenerator = new FontGenerator({
                name: 'icon',
                prefix: 'icon',
                fontsUrl: './fonts',
                selector: '.i',
                fontTypes: [],
                assetTypes: [],
            });
            const font_custom_config = {
                templates: {
                    css: path.join(CONFIG.path.src, 'hbs', 'icon.gl.css.hbs'),
                    scss: path.join(CONFIG.path.src, 'hbs', 'icon.gl.scss.hbs'),
                },
            };
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output, {
                fontTypes: [
                    "ttf", "woff", "woff2", "eot", "svg",
                ],
                pathOptions: {
                    ttf: path.join(CONFIG.path.src, 'font', 'icon.gl.ttf'),
                    woff: path.join(CONFIG.path.src, 'font', 'icon.gl.woff'),
                    woff2: path.join(CONFIG.path.src, 'font', 'icon.gl.woff2'),
                    eot: path.join(CONFIG.path.src, 'font', 'icon.gl.eot'),
                    svg: path.join(CONFIG.path.src, 'font', 'icon.gl.svg'),
                },
            });
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output, {
                assetTypes: ["scss",],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_face.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_face.scss.hbs'), },
            });
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output, {
                assetTypes: ["scss",],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_map.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_map.scss.hbs'), },
            });
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output, {
                assetTypes: ["scss",],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_var.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_var.scss.hbs'), },
            });
            console.log('Font generation completed.');
            const spriteGenerator = new SvgSpriteGenerator();
            console.log('Starting SVG Sprite generation...');
            yield spriteGenerator.generateSprite(CONFIG.path.sprite_input, CONFIG.path.sprite_output);
            console.log('SVG Sprite generation completed.');
            const styleProcessor = new StyleProcessor();
            logger.header('Processing SASS...');
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, `${packageConfig.name}.css`), 'expanded');
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, `${packageConfig.name}.min.css`), 'compressed');
            logger.body('SASS Processing completed.');
            const fileCopier = new FileCopier();
            fileCopier.copyFileToDirectory(path.join('.', 'README.md'), CONFIG.path.dist);
            fileCopier.copyFileToDirectory(path.join('.', 'LICENSE'), CONFIG.path.dist);
            const directoryCopier = new DirectoryCopier();
            yield directoryCopier.recursiveCopy(CONFIG.path.ts_input, CONFIG.path.ts_output);
            yield directoryCopier.recursiveCopy(CONFIG.path.scss_input, CONFIG.path.scss_output);
            yield directoryCopier.recursiveCopy(path.join(CONFIG.path.src, 'font'), path.join(CONFIG.path.dist, 'font'));
            console.log('Files copied successfully.');
            const versionWriter = new VersionWriter();
            yield versionWriter.writeVersionToFile('VERSION', packageConfig.version);
            const tsCompiler = new TypeScriptCompiler();
            const tsFiles = [
                path.join(CONFIG.path.ts_input, 'index.ts'),
            ];
            const outputDir = './dist/js';
            yield tsCompiler.compile(tsFiles, outputDir);
            const jsMinifier = new JavaScriptMinifier();
            yield jsMinifier.minifyFile(path.join(CONFIG.path.js_output, 'index.js'), path.join(CONFIG.path.js_output, `${packageConfig.name}.min.js`))
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