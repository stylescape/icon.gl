// script/class/VersionWriter.ts

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

import { promises as fs } from 'fs';


// ============================================================================
// Classes
// ============================================================================

/**
 * A class for writing version information to a file.
 */
 class VersionWriter {

    /**
     * Writes the specified version string to a file.
     * @param {string} filePath - The file path where the version will be written.
     * @param {string} version - The version string to write to the file.
     */
    async writeVersionToFile(
        filePath: string,
        version: string,
    ): Promise<void> {
        try {
            await fs.writeFile(filePath, version, 'utf8');
            console.log(`Version ${version} written to ${filePath}`);
        } catch (error) {
            console.error(`Error writing version to file: ${error}`);
        }
    }
}


// ============================================================================
// Export
// ============================================================================

export default VersionWriter;
