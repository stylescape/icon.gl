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


// ============================================================================
// Classes
// ============================================================================

/**
 * TypeScriptCompiler class for compiling TypeScript files to JavaScript.
 */
 class TypeScriptCompiler {

    private config: any;

    /**
     * Constructs an instance with the provided configuration.
     * @param {any} config - Configuration object
     */
    constructor(config: any) {
        this.config = config;
    }

    /**
     * Compiles TypeScript files to JavaScript.
     * 
     * @param {string[]} filePaths - The paths of TypeScript files to be compiled.
     * @param {string} outDir - The directory where the compiled JavaScript files will be saved.
     * @param {ts.CompilerOptions} customOptions - Optional custom TypeScript compiler options.
     * 
     * This method sets up a TypeScript program with given file paths and compiler options.
     * It handles the compilation of TypeScript files into JavaScript, considering any provided custom options.
     * Compilation errors and diagnostics are logged for debugging purposes.
     * The method returns a promise that resolves when compilation is successful or rejects in case of errors.
     */
    compile(
        filePaths: string[],
        outDir: string,
        // customOptions: ts.CompilerOptions = {}
    ): Promise<void> {
        return new Promise((resolve, reject) => {

            // Merge default options with custom options
            const options: ts.CompilerOptions = {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2015,
                outDir,
                // ...customOptions, // Merges custom compiler options
                ...this.config, // Merges custom compiler options
            };

            // Create a TypeScript compiler host
            const host = ts.createCompilerHost(options);

            // Create a program with the specified files and options
            const program = ts.createProgram(filePaths, options, host);
            
            // Emit the compiled JavaScript files
            const emitResult = program.emit();

            // Check for compilation errors
            const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
            allDiagnostics.forEach(diagnostic => {
                // Handle and print diagnostics
                if (diagnostic.file) {
                    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
                    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                    console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                } else {
                    console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
                }
            });

            const exitCode = emitResult.emitSkipped ? 1 : 0;
            if (exitCode === 0) {
                console.log('Compilation completed successfully.');
                resolve();
            } else {
                console.error('Compilation failed.');
                reject(new Error('TypeScript compilation failed'));
            }
        });
    }
}


// ============================================================================
// Export
// ============================================================================

export default TypeScriptCompiler;
