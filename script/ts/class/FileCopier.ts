// script/class/class/FileCopier.ts

// Copyright 2023 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// ============================================================================
// Import
// ============================================================================

import fs from 'fs';
import path from 'path';


// ============================================================================
// Classes
// ============================================================================


// class FileCopier {

//     async copyFiles(srcDir: string, destDir: string): Promise<void> {
//         const resolvedSrcDir = path.resolve(srcDir);
//         const resolvedDestDir = path.resolve(destDir);
//         this.copyDirectory(resolvedSrcDir, resolvedDestDir);
//     }

//     private copyDirectory(srcDir: string, destDir: string): void {
//         if (!fs.existsSync(destDir)) {
//             fs.mkdirSync(destDir, { recursive: true });
//         }

//         const files = fs.readdirSync(srcDir);

//         files.forEach(file => {
//             const srcFile = path.join(srcDir, file);
//             const destFile = path.join(destDir, file);

//             if (fs.statSync(srcFile).isDirectory()) {
//                 this.copyDirectory(srcFile, destFile);
//             } else {
//                 console.log(`Copying file: ${srcFile}`);
//                 fs.copyFileSync(srcFile, destFile);
//             }
//         });
//     }
// }


// class FileCopier {

//     async copyFiles(srcDir: string, destDir: string): Promise<void> {
//         try {
//             const files = fs.readdirSync(srcDir);
//             console.log("FILES");
//             console.log(files);

//             files.forEach(file => {

//                 const srcFile = path.join(".", srcDir, file);
//                 const destFile = path.join(".", destDir, file);
//                 console.log("FILE");
//                 console.log(srcFile);
//                 fs.copyFileSync(srcFile, destFile);
//             });

//             console.log(`Files copied from ${srcDir} to ${destDir}`);
//             } catch (error) {
//             console.error('Error copying files:', error);
//             throw error;
//         }
//     }
// }


class FileCopier {

    async copyFiles(srcDir: string, destDir: string): Promise<void> {
        try {
            const resolvedSrcDir = path.resolve(srcDir);
            const resolvedDestDir = path.resolve(destDir);

            const files = fs.readdirSync(resolvedSrcDir);
            console.log("FILES:", files);

            files.forEach(file => {
                const srcFile = path.join(resolvedSrcDir, file);
                const destFile = path.join(resolvedDestDir, file);

                if (fs.statSync(srcFile).isFile()) {
                    console.log("Copying file:", srcFile);
                    fs.copyFileSync(srcFile, destFile);
                }
            });

            console.log(`Files copied from ${resolvedSrcDir} to ${resolvedDestDir}`);
        } catch (error) {
            console.error('Error copying files:', error);
            throw error;
        }
    }
}

// ============================================================================
// Export
// ============================================================================

export default FileCopier;
