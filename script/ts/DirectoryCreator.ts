// script/DirectoryGenerator.ts

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


// ============================================================================
// Export
// ============================================================================

export default DirectoryCreator;