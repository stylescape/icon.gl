import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'dist/',
                'bin/',
                'doc/',
                'res/',
                'test/',
                '**/*.config.*',
                '**/*.d.ts',
                '**/types.ts',
                '**/*.test.ts',
                '**/*.spec.ts',
            ],
            include: ['src/**/*.ts'],
            all: true,
            lines: 80,
            functions: 80,
            branches: 80,
            statements: 80,
        },
        include: ['src/**/*.{test,spec}.{ts,tsx}', 'test/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'dist', 'bin'],
        setupFiles: [],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
