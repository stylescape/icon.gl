// script/class/class/DirectoryCopier.ts

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

/**
 * A class for copying files from one directory to another.
 */
class DirectoryCopier {

    /**
     * Copies all files from a source directory to a destination directory.
     * @param {string} srcDir - The source directory path.
     * @param {string} destDir - The destination directory path.
     * @description This method iterates over all files in the source directory 
     *              and copies each file to the destination directory. It resolves 
     *              the absolute paths of the source and destination directories to 
     *              handle relative paths correctly. This is useful for duplicating 
     *              files or setting up similar directory structures in different locations.
     * @throws Will throw an error if copying fails for any file.
     */
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

export default DirectoryCopier;
