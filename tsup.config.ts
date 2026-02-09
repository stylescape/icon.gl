import { defineConfig } from 'tsup';

export default defineConfig([
    // Main library build (ESM + CJS)
    {
        entry: { 'index': 'src/ts/index.ts' },
        format: ['esm', 'cjs'],
        dts: true,
        outDir: 'dist/js',
        outExtension({ format }) {
            return {
                js: format === 'esm' ? '.mjs' : '.cjs',
            };
        },
        target: 'es2020',
        splitting: false,
        sourcemap: true,
        clean: false,
        minify: false,
    },
]);
