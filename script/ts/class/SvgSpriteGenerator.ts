// script/class/SvgSpriteGenerator.ts

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

import svgSprite from 'svg-sprite';
import fs from 'fs';
import path from 'path';


// ============================================================================
// Classes
// ============================================================================

/**
 * A class for generating SVG sprites from individual SVG files.
 */
class SvgSpriteGenerator {
 
    private config: any;

    /**
     * Constructs an instance of SvgSpriteGenerator with the provided configuration.
     * @param {any} config - Configuration object for svg-sprite.
     */
    constructor(config: any) {
        this.config = config;
    }

    /**
     * Generates an SVG sprite from SVG files in a specified directory.
     * @param {string} sourceDir - Directory containing source SVG files.
     * @param {string} outputDir - Directory where the generated sprite will be saved.
     */
    async generateSprite(sourceDir: string, outputDir: string) {
        try {
            const files = fs.readdirSync(sourceDir);
            const sprite = new svgSprite(this.config);

            files.forEach(file => {
                if (path.extname(file) === '.svg') {
                    const svgPath = path.resolve(sourceDir, file);
                    const content = fs.readFileSync(svgPath, 'utf8');
                    sprite.add(svgPath, null, content);
                }
            });

            sprite.compile((error, result) => {
                if (error) {
                    throw error;
                }

                for (const mode in result) {
                    for (const resource in result[mode]) {
                        const outputPath = path.resolve(
                            outputDir,
                            result[mode][resource].path
                        );
                        fs.mkdirSync(
                            path.dirname(outputPath),
                            { recursive: true }
                        );
                        fs.writeFileSync(
                            outputPath,
                            result[mode][resource].contents
                        );
                    }
                }
            });

        } catch (err) {
            console.error('Error generating SVG sprite:', err);
        }
    }
}


// ============================================================================
// Export
// ============================================================================

export default SvgSpriteGenerator;
