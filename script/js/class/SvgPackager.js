import { __awaiter } from "tslib";
import * as fs_extra from 'fs-extra';
import { promises as fs } from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { fileURLToPath } from "url";
import SVGO from 'svgo';
import { loadConfig } from 'svgo';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class SvgPackager {
    processSvgFiles(directory, outputDirectory, ts_output_directory, json_output_directory) {
        return __awaiter(this, void 0, void 0, function* () {
            const iconNames = [];
            try {
                console.log(`Processing directory: ${directory}`);
                const svgFiles = glob.sync(`${directory}/**/*.svg`);
                for (const file of svgFiles) {
                    console.log(`Processing file: ${file}`);
                    const iconName = this.sanitizeFileName(path.basename(file, '.svg'));
                    iconNames.push(iconName);
                    console.log(`Processing icon: ${iconName}`);
                    const svgContent = yield this.readSvgFile(file);
                    const optimizedSvg = yield this.optimizeSvg(file, svgContent);
                    const resultSvg = optimizedSvg.trim();
                    yield this.writeSvgFile(file, iconName, resultSvg, outputDirectory);
                    yield this.writeTypeScriptFile(file, iconName, resultSvg, ts_output_directory);
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
            try {
                const absolutePath = path.resolve(filePath);
                const svgContent = yield fs.readFile(absolutePath, 'utf8');
                return svgContent;
            }
            catch (error) {
                console.error('Error reading file:', filePath, error);
                throw error;
            }
        });
    }
    sanitizeFileName(fileName) {
        return fileName.replace(/[^a-zA-Z0-9_]/g, '_');
    }
    optimizeSvg(filePath, svgContent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield loadConfig(path.join(__dirname, '../config/svgo.config.js'));
                const result = yield SVGO.optimize(svgContent, Object.assign({ path: filePath }, config));
                return result.data;
            }
            catch (error) {
                console.error('Error optimizing SVG:', error);
                throw error;
            }
        });
    }
    writeTypeScriptFile(filePath, iconName, svgContent, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tsContent = `export const icon_${iconName} = \`${svgContent}\`;\n`;
                const outputPath = path.join(outputDirectory, `${iconName}.ts`);
                yield fs_extra.outputFile(outputPath, tsContent);
            }
            catch (error) {
                console.error(`Error creating TypeScript file for ${filePath}:`, error);
                throw error;
            }
        });
    }
    writeSvgFile(filePath, iconName, svgContent, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const outputPath = path.join(outputDirectory, `${iconName}.svg`);
                yield fs_extra.outputFile(outputPath, svgContent);
                console.log(`SVG file written successfully for ${iconName}`);
            }
            catch (error) {
                console.error(`Error writing SVG file for ${iconName}:`, error);
                throw error;
            }
        });
    }
    writeIconsJson(iconNames, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jsonContent = JSON.stringify(iconNames, null, 2);
                const outputPath = path.join(outputDirectory, 'icons.json');
                yield fs_extra.outputFile(outputPath, jsonContent);
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