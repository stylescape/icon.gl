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

/**
 * A class for copying files from one location to another.
 */
 class FileCopier {

    /**
     * Copies a single file to a specified destination directory.
     * @param {string} srcFile - The path of the source file to copy.
     * @param {string} destDir - The destination directory where the file should be copied.
     * @throws Will throw an error if the file copy operation fails.
     */
    async copyFileToDirectory(
        srcFile: string,
        destDir: string
    ): Promise<void> {
        try {
            const fileName = path.basename(srcFile);
            const destFilePath = path.join(destDir, fileName);
            await fs.promises.copyFile(srcFile, destFilePath);
            console.log(`File copied from ${srcFile} to ${destFilePath}`);
        } catch (error) {
            console.error('Error copying file:', error);
            throw error;
        }
    }

}


// ============================================================================
// Export
// ============================================================================

export default FileCopier;
