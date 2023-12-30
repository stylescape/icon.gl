import { __awaiter } from "tslib";
import fs from 'fs';
import path from 'path';
class FileCopier {
    copyFileToDirectory(srcFile, destDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileName = path.basename(srcFile);
                const destFilePath = path.join(destDir, fileName);
                yield fs.promises.copyFile(srcFile, destFilePath);
                console.log(`File copied from ${srcFile} to ${destFilePath}`);
            }
            catch (error) {
                console.error('Error copying file:', error);
                throw error;
            }
        });
    }
}
export default FileCopier;
//# sourceMappingURL=FileCopier.js.map