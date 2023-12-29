// script/index.ts

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

import SvgPackager from "./SvgPackager.js";


const svgPackager = new SvgPackager();


async function processSvgFiles() {
    try {
 
        await svgPackager.processSvgFiles(
            // './path/to/svg/dir',
            // './path/to/output/dir'
            './src/svg',
            './dist/svg'
        );


        console.log('SVG files processed successfully');

    } catch (error) {
        console.error('Error processing SVG files:', error);
    }
}

processSvgFiles();
