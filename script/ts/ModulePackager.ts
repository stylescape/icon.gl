// script/ModulePackager.ts

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

interface Svg {
    metadata: {
      name: string;
      // ... other metadata properties
    };
    source: string;
    // ... other Svg properties
  }
  
  interface File {
    filepath: string;
    source: string;
  }


// ============================================================================
// Classes
// ============================================================================

class ModulePackager {

    private svgs: Svg[];
    private version: string;

    constructor(svgs: Svg[], version: string) {
        if (!svgs || !version) {
            throw new Error("Invalid constructor arguments");
        }

        this.svgs = svgs;
        this.version = version;
    }

    private getSVGContent(source: string): string {
        // More robust string manipulation if needed
        return source.slice(source.indexOf('>') + 1).slice(0, -6);
    }

    public createModulePackage(): { name: string, files: File[] } {
        try {
            const files: File[] = this.svgs.map(svg => {
            const source = this.getSVGContent(svg.source);
            const json = JSON.stringify({ ...svg, source });

            return {
                filepath: `${svg.metadata.name}.js`,
                source: `export default ${json};`
            };
            });

            files.push({
                filepath: 'package.json',
                source: `{
                    "name": "@acme/module-icons",
                    "version": "${this.version}"
                }`
            });

            return {
                name: 'module-icons',
                files
            };
        } catch (error) {
            console.error('Error creating module package:', error);
            throw error;
        }
    }
}
  

// ============================================================================
// Export
// ============================================================================

  export default ModulePackager;
  