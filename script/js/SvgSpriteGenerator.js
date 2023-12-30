import { __awaiter } from "tslib";
import svgSprite from 'svg-sprite';
import fs from 'fs';
import path from 'path';
class SvgSpriteGenerator {
    constructor(config) {
        this.config = config;
    }
    generateSprite(sourceDir, outputDir) {
        return __awaiter(this, void 0, void 0, function* () {
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
                            const outputPath = path.resolve(outputDir, result[mode][resource].path);
                            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                            fs.writeFileSync(outputPath, result[mode][resource].contents);
                        }
                    }
                });
            }
            catch (err) {
                console.error('Error generating SVG sprite:', err);
            }
        });
    }
}
export default SvgSpriteGenerator;
//# sourceMappingURL=SvgSpriteGenerator.js.map