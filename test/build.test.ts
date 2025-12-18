import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';

describe('Build Process Tests', () => {
    const rootDir = path.resolve(__dirname, '..');
    const packageJsonPath = path.join(rootDir, 'package.json');
    
    it('should have valid package.json', async () => {
        const content = await fs.readFile(packageJsonPath, 'utf-8');
        const pkg = JSON.parse(content);
        
        expect(pkg.name).toBe('icon.gl');
        expect(pkg.version).toBeTruthy();
        expect(pkg.license).toBe('MIT');
    });

    it('should have required build scripts', async () => {
        const content = await fs.readFile(packageJsonPath, 'utf-8');
        const pkg = JSON.parse(content);
        
        expect(pkg.scripts.build).toBeTruthy();
        expect(pkg.scripts['build-compile']).toBeTruthy();
        expect(pkg.scripts['build-process']).toBeTruthy();
    });

    it('should have test scripts configured', async () => {
        const content = await fs.readFile(packageJsonPath, 'utf-8');
        const pkg = JSON.parse(content);
        
        expect(pkg.scripts.test).toBeTruthy();
        expect(pkg.scripts['test:coverage']).toBeTruthy();
    });
});

describe('TypeScript Configuration', () => {
    const tsconfigPath = path.resolve(__dirname, '../tsconfig.json');

    it('should have valid tsconfig.json', async () => {
        const exists = await fs.access(tsconfigPath).then(() => true).catch(() => false);
        expect(exists).toBe(true);
        
        // Just verify it exists and can be read, parsing JSONC is complex
        const content = await fs.readFile(tsconfigPath, 'utf-8');
        expect(content).toContain('compilerOptions');
        expect(content).toContain('target');
    });
});

describe('Source Directory Structure', () => {
    const srcDir = path.resolve(__dirname, '../src');

    it('should have required source directories', async () => {
        const tsDir = path.join(srcDir, 'ts');
        const scssDir = path.join(srcDir, 'scss');
        const svgDir = path.join(srcDir, 'svg');
        
        const tsDirExists = await fs.access(tsDir).then(() => true).catch(() => false);
        const scssDirExists = await fs.access(scssDir).then(() => true).catch(() => false);
        const svgDirExists = await fs.access(svgDir).then(() => true).catch(() => false);
        
        expect(tsDirExists).toBe(true);
        expect(scssDirExists).toBe(true);
        expect(svgDirExists).toBe(true);
    });

    it('should have main TypeScript entry point', async () => {
        const indexPath = path.join(srcDir, 'ts', 'index.ts');
        const exists = await fs.access(indexPath).then(() => true).catch(() => false);
        
        expect(exists).toBe(true);
        
        if (exists) {
            const content = await fs.readFile(indexPath, 'utf-8');
            expect(content).toContain('export');
        }
    });

    it('should have SCSS entry point', async () => {
        const indexPath = path.join(srcDir, 'scss', 'index.scss');
        const exists = await fs.access(indexPath).then(() => true).catch(() => false);
        
        expect(exists).toBe(true);
    });
});

describe('Configuration Files', () => {
    const rootDir = path.resolve(__dirname, '..');

    it('should have required config files', async () => {
        const configFiles = [
            '.gitignore',
            '.prettierrc',
            '.eslintrc',
            'tsconfig.json',
            'vitest.config.ts',
        ];

        for (const file of configFiles) {
            const filePath = path.join(rootDir, file);
            const exists = await fs.access(filePath).then(() => true).catch(() => false);
            expect(exists).toBe(true);
        }
    });

    it('should have documentation files', async () => {
        const docFiles = ['README.md', 'LICENSE', 'CHANGELOG.md'];

        for (const file of docFiles) {
            const filePath = path.join(rootDir, file);
            const exists = await fs.access(filePath).then(() => true).catch(() => false);
            expect(exists).toBe(true);
        }
    });
});
