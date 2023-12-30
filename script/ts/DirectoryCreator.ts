import fs from 'fs';
import path from 'path';

class DirectoryCreator {

    async createDirectories(basePath: string, directories: string[]): Promise<void> {
        console.log(`directories: ${directories}`);

        directories.forEach(dir => {
            const dirPath = path.join(basePath, dir);
            console.log(`creating ${dirPath}`);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`Directory created: ${dirPath}`);
            } else {
                console.log(`Directory already exists: ${dirPath}`);
            }
        });
    }

}

export default DirectoryCreator;