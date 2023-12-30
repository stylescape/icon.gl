import { __awaiter } from "tslib";
import fs from 'fs';
import path from 'path';
class PackageCreator {
    constructor(packageJson) {
        this.packageJson = packageJson;
    }
    createPackageJson(outputDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.join(outputDir, 'package.json');
            const data = JSON.stringify(this.packageJson, null, 2);
            fs.writeFileSync(filePath, data, 'utf-8');
            console.log(`package.json created at ${filePath}`);
        });
    }
}
export default PackageCreator;
//# sourceMappingURL=PackageCreator.js.map