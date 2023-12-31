import ts from 'typescript';
class TypeScriptCompiler {
    constructor(config) {
        this.config = config;
    }
    compile(filePaths, outDir) {
        return new Promise((resolve, reject) => {
            const options = Object.assign({ module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2015, outDir }, this.config);
            const host = ts.createCompilerHost(options);
            const program = ts.createProgram(filePaths, options, host);
            const emitResult = program.emit();
            const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
            allDiagnostics.forEach(diagnostic => {
                if (diagnostic.file) {
                    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                    console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                }
                else {
                    console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
                }
            });
            const exitCode = emitResult.emitSkipped ? 1 : 0;
            if (exitCode === 0) {
                console.log('Compilation completed successfully.');
                resolve();
            }
            else {
                console.error('Compilation failed.');
                reject(new Error('TypeScript compilation failed'));
            }
        });
    }
}
export default TypeScriptCompiler;
//# sourceMappingURL=TypeScriptCompiler.js.map