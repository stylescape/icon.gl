import fs from 'fs';
import path from 'path';
class DirectoryCleaner {
    cleanDirectory(dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach(file => {
                const curPath = path.join(dirPath, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    this.cleanDirectory(curPath);
                }
                else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dirPath);
        }
    }
}
export default DirectoryCleaner;
//# sourceMappingURL=DirectoryCleaner.js.map