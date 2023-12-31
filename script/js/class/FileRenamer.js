import { __awaiter } from "tslib";
import fs from 'fs';
class FileRenamer {
    renameFile(srcPath, targetPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.promises.rename(srcPath, targetPath);
                console.log(`File renamed from ${srcPath} to ${targetPath}`);
            }
            catch (error) {
                console.error('Error renaming file:', error);
                throw error;
            }
        });
    }
}
export default FileRenamer;
//# sourceMappingURL=FileRenamer.js.map