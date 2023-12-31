import { __awaiter } from "tslib";
import { minify } from 'terser';
import { promises as fs } from 'fs';
class JavaScriptMinifier {
    constructor(config) {
        this.config = config;
    }
    minifyFile(inputPath, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inputCode = yield fs.readFile(inputPath, 'utf8');
                const result = yield minify(inputCode, this.config);
                if (result.code) {
                    yield fs.writeFile(outputPath, result.code);
                }
                else {
                    throw new Error('Minification resulted in empty output.');
                }
            }
            catch (error) {
                console.error(`Error minifying JavaScript file ${inputPath}:`, error);
                throw error;
            }
        });
    }
}
export default JavaScriptMinifier;
//# sourceMappingURL=JavaScriptMinifier.js.map