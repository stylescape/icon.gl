// script/class/class/FileRenamer.ts

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
 * A class for renaming files.
 */
 class FileRenamer {

    /**
     * Renames a file from the source path to the target path.
     * @param srcPath The current path of the file.
     * @param targetPath The new path of the file after renaming.
     * @returns Promise<void>
     */
     async renameFile(srcPath: string, targetPath: string): Promise<void> {
        try {
            await fs.promises.rename(srcPath, targetPath);
            console.log(`File renamed from ${srcPath} to ${targetPath}`);
        } catch (error) {
            console.error('Error renaming file:', error);
            throw error;
        }
    }

}


// ============================================================================
// Export
// ============================================================================

export default FileRenamer;
