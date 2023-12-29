import { __awaiter } from "tslib";
import SvgPackager from "./SvgPackager.js";
const svgPackager = new SvgPackager();
function processSvgFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield svgPackager.processSvgFiles('./src/svg', './dist/svg');
            console.log('SVG files processed successfully');
        }
        catch (error) {
            console.error('Error processing SVG files:', error);
        }
    });
}
processSvgFiles();
//# sourceMappingURL=index.js.map