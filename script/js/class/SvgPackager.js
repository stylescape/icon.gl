import { __awaiter } from "tslib";
import * as fs from 'fs/promises';
import * as path from 'path';
import * as glob from 'glob';
import SVGO from 'svgo';
import { loadConfig } from 'svgo';
class SvgPackager {
    constructor(svgoConfigPath) {
        this.svgoConfigPath = svgoConfigPath;
    }
    processSvgFiles(inputDirectory, outputDirectory, ts_output_directory, json_output_directory) {
        return __awaiter(this, void 0, void 0, function* () {
            const iconNames = [];
            try {
                console.log(`Processing directory: ${inputDirectory}`);
                const svgFiles = glob.sync(`${inputDirectory}/**/*.svg`);
                for (const file of svgFiles) {
                    console.log(`Processing file: ${file}`);
                    const iconName = this.sanitizeFileName(path.basename(file, '.svg'));
                    iconNames.push(iconName);
                    console.log(`Processing icon: ${iconName}`);
                    const svgContent = yield this.readSvgFile(file);
                    const optimizedSvg = yield this.optimizeSvg(svgContent);
                    const resultSvg = optimizedSvg.trim();
                    yield this.writeSvgFile(iconName, resultSvg, outputDirectory);
                    yield this.writeTypeScriptFile(iconName, resultSvg, ts_output_directory);
                }
                yield this.writeIconsJson(iconNames, json_output_directory);
                console.log(`Successfully processed ${svgFiles.length} SVG files.`);
            }
            catch (error) {
                console.error('Error processing SVG files:', error);
                throw error;
            }
        });
    }
    readSvgFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return fs.readFile(filePath, 'utf8');
        });
    }
    sanitizeFileName(fileName) {
        return fileName.replace(/[^a-zA-Z0-9_]/g, '_');
    }
    writeFiles(iconName, svgContent, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeSvgFile(iconName, svgContent, outputDirectory);
            yield this.writeTypeScriptFile(iconName, svgContent, outputDirectory);
        });
    }
    optimizeSvg(svgContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield loadConfig(this.svgoConfigPath);
            const result = yield SVGO.optimize(svgContent, Object.assign({}, config));
            return result.data.trim();
        });
    }
    writeTypeScriptFile(iconName, svgContent, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const tsContent = `export const icon_${iconName} = \`${svgContent}\`;\n`;
            const outputPath = path.join(outputDirectory, `${iconName}.ts`);
            yield fs.writeFile(outputPath, tsContent);
        });
    }
    writeSvgFile(iconName, svgContent, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputPath = path.join(outputDirectory, `${iconName}.svg`);
            yield fs.writeFile(outputPath, svgContent);
        });
    }
    writeIconsJson(iconNames, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jsonContent = JSON.stringify(iconNames, null, 2);
                const outputPath = path.join(outputDirectory, 'icons.json');
                yield fs.writeFile(outputPath, jsonContent);
                console.log('Icons JSON file created successfully');
            }
            catch (error) {
                console.error('Error writing icons JSON file:', error);
                throw error;
            }
        });
    }
}
export default SvgPackager;
//# sourceMappingURL=SvgPackager.js.map