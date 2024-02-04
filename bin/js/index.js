import { __awaiter } from "tslib";
import path from 'path';
import { promises as fs } from 'fs';
import { DirectoryScanner, DirectoryCleaner, DirectoryCopier, DirectoryCreator, FileCopier, FontGenerator, FilenameExtractor, StyleProcessor, SvgPackager, SvgSpriteGenerator, PackageCreator, VersionWriter, TypeScriptCompiler, JavaScriptMinifier, StylizedLogger, TemplateWriter, SvgToPngConverter, readPackageJson, SvgReader, } from 'pack.gl';
class JSONLoader {
    loadJSON(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fs.readFile(filePath, 'utf8');
                return JSON.parse(data);
            }
            catch (error) {
                console.error(`Error reading JSON file: ${filePath}`, error);
                throw error;
            }
        });
    }
    loadJSONFromDirectory(dirPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield fs.readdir(dirPath);
                const jsonFiles = files.filter(file => file.endsWith('.json'));
                const jsonData = yield Promise.all(jsonFiles.map(file => this.loadJSON(path.join(dirPath, file))));
                return jsonData;
            }
            catch (error) {
                console.error(`Error reading JSON files from directory: ${dirPath}`, error);
                throw error;
            }
        });
    }
    mergeJSONObjects(objects) {
        return __awaiter(this, void 0, void 0, function* () {
            return objects.reduce((acc, obj) => (Object.assign(Object.assign({}, acc), obj)), {});
        });
    }
}
function getSubdirectories(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dirents = yield fs.readdir(directory, { withFileTypes: true });
            return dirents
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
        }
        catch (error) {
            console.error('Error reading directory:', error);
            throw error;
        }
    });
}
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
        jinja_input: './src/jinja',
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
                const subdirectories = yield getSubdirectories(CONFIG.path.svg_input);
                for (const subfolder of subdirectories) {
                    yield svgPackager.processSvgFiles(path.join(CONFIG.path.svg_input, subfolder), CONFIG.path.svg_output, CONFIG.path.ts_output_icons, CONFIG.path.json_output);
                }
            }
            catch (error) {
                console.error('Error listing subdirectories:', error);
            }
            const directoryScanner = new DirectoryScanner();
            const svgReader = new SvgReader();
            const converter = new SvgToPngConverter();
            const extractor = new FilenameExtractor();
            const svg_paths = yield directoryScanner.scanDirectory(CONFIG.path.svg_input, true);
            yield directoryCreator.createDirectories(CONFIG.path.dist, ['png']);
            for (const svg_path of svg_paths) {
                if (path.extname(svg_path) == '.svg') {
                    const filenameWithoutExtension = extractor.getFilenameWithoutExtension(svg_path);
                    const svgContent = yield svgReader.readSVG(svg_path);
                    const sizes = [512];
                    for (const size of sizes) {
                        const pngOutputPath = path.join(CONFIG.path.dist, 'png', `${size}`, `${filenameWithoutExtension}.png`);
                        yield converter.convert(svgContent, pngOutputPath, size, size);
                    }
                }
                ;
            }
            console.log('Starting font generation...');
            yield directoryCreator.createDirectories(CONFIG.path.dist, ['font']);
            const jsonLoader = new JSONLoader();
            const codepoint_data = yield jsonLoader.loadJSONFromDirectory(path.join(CONFIG.path.src, 'json', 'codepoint'));
            const codepoints = yield jsonLoader.mergeJSONObjects(codepoint_data);
            const fontGenerator = new FontGenerator({
                name: 'icongl',
                prefix: 'i',
                fontsUrl: './font',
                selector: '.i',
                fontTypes: [],
                assetTypes: [],
                codepoints: codepoints,
            });
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output, {
                fontTypes: ["ttf", "woff", "woff2", "eot", "svg",],
                pathOptions: {
                    ttf: path.join(CONFIG.path.src, 'font', 'icongl.ttf'),
                    woff: path.join(CONFIG.path.src, 'font', 'icongl.woff'),
                    woff2: path.join(CONFIG.path.src, 'font', 'icongl.woff2'),
                    eot: path.join(CONFIG.path.src, 'font', 'icongl.eot'),
                    svg: path.join(CONFIG.path.src, 'font', 'icongl.svg'),
                },
            });
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output, {
                assetTypes: ["scss",],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'font', '_font_face.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_face.scss.hbs'), },
            });
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output, {
                assetTypes: ["scss",],
                pathOptions: { scss: path.join(CONFIG.path.src, 'scss', 'variables', '_font.scss'), },
                templates: { scss: path.join(CONFIG.path.src, 'hbs', '_font_variables.scss.hbs'), },
            });
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output, {
                assetTypes: ["html",],
                pathOptions: { html: path.join(CONFIG.path.src, 'html', 'test.html'), },
                templates: { html: path.join(CONFIG.path.src, 'hbs', 'test.html.hbs'), },
            });
            yield fontGenerator.generateFonts(CONFIG.path.font_input, CONFIG.path.font_output, {
                assetTypes: ["json",],
                pathOptions: { json: path.join(CONFIG.path.src, 'json', 'icon.json'), },
            });
            console.log('Font generation completed.');
            const spriteGenerator = new SvgSpriteGenerator();
            console.log('Starting SVG Sprite generation...');
            yield spriteGenerator.generateSprite(CONFIG.path.sprite_input, CONFIG.path.sprite_output);
            console.log('SVG Sprite generation completed.');
            logger.header('MD Writer');
            try {
                const subdirectories = yield getSubdirectories(CONFIG.path.svg_input);
                const groups = [];
                for (const subfolder of subdirectories) {
                    const svg_paths = yield directoryScanner.scanDirectory(path.join(CONFIG.path.svg_input, subfolder), false);
                    console.log(svg_paths);
                    const names = [];
                    for (const svg_path of svg_paths) {
                        if (path.extname(svg_path) == '.svg') {
                            let name = extractor.getFilenameWithoutExtension(svg_path);
                            names.push(name);
                        }
                    }
                    groups.push({
                        group: subfolder,
                        icons: names,
                    });
                }
                const template_context = {
                    groups: groups,
                };
                const templater_md = new TemplateWriter(CONFIG.path.jinja_input, template_context);
                yield templater_md.generateToFile('icon.gl.md.jinja', path.join(CONFIG.path.dist, 'md', 'icon.gl.md'));
            }
            catch (error) {
                console.error('Error listing subdirectories:', error);
            }
            const styleProcessor = new StyleProcessor();
            logger.header('Processing SASS...');
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, `icon.css`), 'expanded');
            yield styleProcessor.processStyles(path.join(CONFIG.path.scss_input, 'index.scss'), path.join(CONFIG.path.css_output, `icon.min.css`), 'compressed');
            logger.body('SASS Processing completed.');
            const fileCopier = new FileCopier();
            fileCopier.copyFileToDirectory(path.join('.', 'README.md'), CONFIG.path.dist);
            fileCopier.copyFileToDirectory(path.join('.', 'LICENSE'), CONFIG.path.dist);
            const directoryCopier = new DirectoryCopier();
            yield directoryCopier.recursiveCopy(CONFIG.path.ts_input, CONFIG.path.ts_output);
            yield directoryCopier.recursiveCopy(CONFIG.path.scss_input, CONFIG.path.scss_output);
            yield directoryCopier.recursiveCopy(path.join(CONFIG.path.src, 'font'), path.join(CONFIG.path.dist, 'font'));
            yield directoryCopier.recursiveCopy(path.join(CONFIG.path.src, 'html'), path.join(CONFIG.path.dist, 'html'));
            yield directoryCopier.recursiveCopy(path.join(CONFIG.path.src, 'json'), path.join(CONFIG.path.dist, 'json'));
            console.log('Files copied successfully.');
            const versionWriter = new VersionWriter();
            yield versionWriter.writeVersionToFile('VERSION', packageConfig.version);
            function generateExports() {
                return __awaiter(this, void 0, void 0, function* () {
                    const iconsDir = CONFIG.path.ts_output_icons;
                    const exportFilePath = path.join(CONFIG.path.ts_input, 'icons.ts');
                    let exportStatements = '';
                    try {
                        const files = yield fs.readdir(iconsDir);
                        files.forEach(file => {
                            if (file.endsWith('.ts') && file !== 'index.ts') {
                                const moduleName = path.basename(file, '.ts');
                                exportStatements += `export * from './icons/${moduleName}';\n`;
                            }
                        });
                        yield fs.writeFile(exportFilePath, exportStatements);
                        console.log('Export file created successfully');
                    }
                    catch (error) {
                        console.error('Error generating exports:', error);
                    }
                });
            }
            generateExports();
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