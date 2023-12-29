"use strict";
// Copyright 2023 Scape Agency BV
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
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
// import * as fs from 'fs';
var fs_extra = require("fs-extra");
var fs_1 = require("fs"); // Using promisified fs
var glob = require("glob");
var path = require("path");
var url_1 = require("url");
var svgo_1 = require("svgo");
var svgo_2 = require("svgo");
// Convert the current file's URL to a file path
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
// Derive the directory name of the current module
var __dirname = path.dirname(__filename);
// ============================================================================
// Classes
// ============================================================================
/**
 * Class for packaging SVG files.
 * This class reads SVG files from a specified directory, optimizes them,
 * and creates corresponding TypeScript files.
 */
var SvgPackager = /** @class */ (function () {
    function SvgPackager() {
    }
    /**
     * Processes all SVG files in a given directory.
     * @param directory The directory containing SVG files to process.
     * @param outputDirectory The directory where optimized SVGs will be output as TypeScript files.
     */
    SvgPackager.prototype.processSvgFiles = function (directory, outputDirectory) {
        return __awaiter(this, void 0, void 0, function () {
            var iconNames, svgFiles, _i, svgFiles_1, file, iconName, svgContent, optimizedSvg, resultSvg, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iconNames = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        svgFiles = glob.sync("".concat(directory, "/**/*.svg"));
                        _i = 0, svgFiles_1 = svgFiles;
                        _a.label = 2;
                    case 2:
                        if (!(_i < svgFiles_1.length)) return [3 /*break*/, 8];
                        file = svgFiles_1[_i];
                        iconName = this.sanitizeFileName(path.basename(file, '.svg'));
                        iconNames.push(iconName);
                        console.log("Processing icon: ".concat(iconName));
                        return [4 /*yield*/, this.readSvgFile(file)];
                    case 3:
                        svgContent = _a.sent();
                        return [4 /*yield*/, this.optimizeSvg(file, svgContent)];
                    case 4:
                        optimizedSvg = _a.sent();
                        resultSvg = optimizedSvg.trim();
                        // Write the optimized SVG file
                        return [4 /*yield*/, this.writeSvgFile(file, iconName, resultSvg, outputDirectory)];
                    case 5:
                        // Write the optimized SVG file
                        _a.sent();
                        // Write the optimized TypeScript file
                        return [4 /*yield*/, this.writeTypeScriptFile(file, iconName, resultSvg, outputDirectory)];
                    case 6:
                        // Write the optimized TypeScript file
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [4 /*yield*/, this.writeIconsJson(iconNames, outputDirectory)];
                    case 9:
                        _a.sent();
                        console.log("Successfully processed ".concat(svgFiles.length, " SVG files."));
                        return [3 /*break*/, 11];
                    case 10:
                        error_1 = _a.sent();
                        console.error('Error processing SVG files:', error_1);
                        throw error_1;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reads the content of an SVG file.
     * @param filePath The path to the SVG file.
     * @returns The content of the SVG file.
     */
    SvgPackager.prototype.readSvgFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var absolutePath, svgContent, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        absolutePath = path.resolve(filePath);
                        return [4 /*yield*/, fs_1.promises.readFile(absolutePath, 'utf8')];
                    case 1:
                        svgContent = _a.sent();
                        return [2 /*return*/, svgContent];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error reading file:', filePath, error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sanitizes a file name to be a valid TypeScript identifier.
     * @param fileName The original file name.
     * @returns A sanitized version of the file name.
     */
    SvgPackager.prototype.sanitizeFileName = function (fileName) {
        // Implement more robust sanitization logic if necessary
        return fileName.replace(/[^a-zA-Z0-9_]/g, '_');
    };
    /**
     * Optimizes SVG content using SVGO.
     * @param svgContent The raw SVG content.
     * @returns The optimized SVG content.
     */
    SvgPackager.prototype.optimizeSvg = function (filePath, svgContent) {
        return __awaiter(this, void 0, void 0, function () {
            var config, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, svgo_2.loadConfig)(path.join(__dirname, 'svgo.config.js'))
                            // const config = await loadConfig(configFile, cwd);
                        ];
                    case 1:
                        config = _a.sent();
                        return [4 /*yield*/, svgo_1.default.optimize(svgContent, __assign({ path: filePath }, config))];
                    case 2:
                        result = _a.sent();
                        // const result = await SVGO.optimize(svgContent, config); // Add SVGO options if needed
                        return [2 /*return*/, result.data];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error optimizing SVG:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a TypeScript file from SVG content.
     * @param filePath The path of the SVG file.
     * @param svgContent The optimized SVG content.
     * @param outputDirectory The directory to output the TypeScript file.
     */
    SvgPackager.prototype.writeTypeScriptFile = function (filePath, iconName, svgContent, outputDirectory) {
        return __awaiter(this, void 0, void 0, function () {
            var tsContent, outputPath, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        tsContent = "export const icon_".concat(iconName, " = `").concat(svgContent, "`;\n");
                        outputPath = path.join(outputDirectory, "".concat(iconName, ".ts"));
                        return [4 /*yield*/, fs_extra.outputFile(outputPath, tsContent)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Error creating TypeScript file for ".concat(filePath, ":"), error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Writes the SVG content to a file.
     * @param filePath The original file path of the SVG.
     * @param svgContent The SVG content to be written.
     * @param outputDirectory The directory to output the SVG file.
     */
    SvgPackager.prototype.writeSvgFile = function (filePath, iconName, svgContent, outputDirectory) {
        return __awaiter(this, void 0, void 0, function () {
            var outputPath, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        outputPath = path.join(outputDirectory, "".concat(iconName, ".svg"));
                        return [4 /*yield*/, fs_extra.outputFile(outputPath, svgContent)];
                    case 1:
                        _a.sent();
                        console.log("SVG file written successfully for ".concat(iconName));
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Error writing SVG file for ".concat(iconName, ":"), error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Writes a JSON file containing the names of processed icons.
     * This method creates a JSON file that lists all icon names which have been processed,
     * making it easier to reference or index these icons in other parts of an application.
     *
     * @param iconNames An array of strings containing the names of the icons.
     * @param outputDirectory The directory where the JSON file will be saved.
     */
    SvgPackager.prototype.writeIconsJson = function (iconNames, outputDirectory) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonContent, outputPath, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        jsonContent = JSON.stringify(iconNames, null, 2);
                        outputPath = path.join(outputDirectory, 'icons.json');
                        return [4 /*yield*/, fs_extra.outputFile(outputPath, jsonContent)];
                    case 1:
                        _a.sent();
                        console.log('Icons JSON file created successfully');
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error writing icons JSON file:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SvgPackager;
}());
// ============================================================================
// Export
// ============================================================================
exports.default = SvgPackager;
