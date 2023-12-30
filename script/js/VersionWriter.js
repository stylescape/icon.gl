import { __awaiter } from "tslib";
import { promises as fs } from 'fs';
class VersionWriter {
    writeVersionToFile(filePath, version) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.writeFile(filePath, version, 'utf8');
                console.log(`Version ${version} written to ${filePath}`);
            }
            catch (error) {
                console.error(`Error writing version to file: ${error}`);
            }
        });
    }
}
export default VersionWriter;
//# sourceMappingURL=VersionWriter.js.map