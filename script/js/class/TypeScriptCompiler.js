import ts from 'typescript';
class TypeScriptCompiler {
    compile(filePaths, outDir) {
        const options = {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2015,
            outDir,
        };
        const host = ts.createCompilerHost(options);
        const program = ts.createProgram(filePaths, options, host);
        program.emit();
    }
}
export default TypeScriptCompiler;
//# sourceMappingURL=TypeScriptCompiler.js.map