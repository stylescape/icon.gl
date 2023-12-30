import { __awaiter } from "tslib";
import fs from 'fs';
import path from 'path';
class DirectoryCreator {
    createDirectories(basePath, directories) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`directories: ${directories}`);
            directories.forEach(dir => {
                const dirPath = path.join(basePath, dir);
                console.log(`creating ${dirPath}`);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                    console.log(`Directory created: ${dirPath}`);
                }
                else {
                    console.log(`Directory already exists: ${dirPath}`);
                }
            });
        });
    }
}
export default DirectoryCreator;
//# sourceMappingURL=DirectoryCreator.js.map