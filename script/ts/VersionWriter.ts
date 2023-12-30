// script/VersionWriter.ts

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
// import * as pack from '../../package.json' assert { type: 'json' };


// ============================================================================
// Classes
// ============================================================================

class VersionWriter {

    // private getVersion(pack: { version: string; }): string {
    //     console.log('Version from package.json:', pack.version); // For debugging
    //     return pack.version;
    // }


    async writeVersionToFile(filePath: string, version: string): Promise<void> {
        try {
            // const version = this.getVersion(pack);
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
