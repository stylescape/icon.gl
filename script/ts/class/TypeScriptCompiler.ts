// script/class/TypeScriptCompiler.ts

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

// import * as ts from 'typescript';
import ts from 'typescript';

import fs from 'fs';
import path from 'path';

class TypeScriptCompiler {

    compile(filePaths: string[], outDir: string): void {
        const options: ts.CompilerOptions = {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2015,
            outDir,
            // other necessary compiler options
        };

        const host = ts.createCompilerHost(options);
        const program = ts.createProgram(filePaths, options, host);

        program.emit();
    }
}

export default TypeScriptCompiler;
