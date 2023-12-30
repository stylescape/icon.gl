import { __awaiter } from "tslib";
import * as sass from 'sass';
import postcss from 'postcss';
import fs from 'fs';
import postcssConfigExpanded from '../config/postcss.config.expanded.js';
import postcssConfigCompressed from '../config/postcss.config.compressed.js';
class StyleProcessor {
    processPostCSS(css, styleOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = styleOption === 'expanded' ? postcssConfigExpanded : postcssConfigCompressed;
            return postcss(config.plugins).process(css, { from: undefined, map: { inline: false } });
        });
    }
    processStyles(inputFile, outputFile, styleOption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield sass.compileAsync(inputFile, { style: styleOption });
                const processed = yield this.processPostCSS(result.css, styleOption);
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
}
export default StyleProcessor;
//# sourceMappingURL=StyleProcessor.js.map