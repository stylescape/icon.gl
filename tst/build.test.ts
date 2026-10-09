import { execFileSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

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
        expect(pkg.scripts['build:ts']).toBeTruthy();
    });

    it('should have test scripts configured', async () => {
        const content = await fs.readFile(packageJsonPath, 'utf-8');
        const pkg = JSON.parse(content);

        expect(pkg.scripts.test).toBeTruthy();
        expect(pkg.scripts['test:coverage']).toBeTruthy();
    });
});

describe('Published Package Manifest', () => {
    // The release workflow runs `npm publish` from inside dist/, so every path
    // in the manifest must resolve relative to dist/.
    const distDir = path.resolve(__dirname, '../dist');
    const distPackageJson = path.join(distDir, 'package.json');

    function manifestPaths(pkg: Record<string, any>): string[] {
        const paths = ['main', 'module', 'types', 'style', 'sass'].map((key) => pkg[key]);
        const collect = (value: unknown) => {
            if (typeof value === 'string') paths.push(value);
            else if (value && typeof value === 'object') Object.values(value).forEach(collect);
        };
        collect(pkg.exports);
        return paths.filter(Boolean);
    }

    it('should point every entry point at a file inside dist/', async (context) => {
        const built = await fs.access(distPackageJson).then(() => true).catch(() => false);
        if (!built) context.skip();

        const pkg = JSON.parse(await fs.readFile(distPackageJson, 'utf-8'));
        const missing: string[] = [];
        for (const entry of manifestPaths(pkg)) {
            // Subpath patterns ("./svg/*") must at least have their directory.
            const target = path.join(distDir, entry.replace(/\/\*$/, ''));
            const exists = await fs.access(target).then(() => true).catch(() => false);
            if (!exists) missing.push(entry);
        }

        expect(missing).toEqual([]);
    });

    it('should ship every entry point in the npm tarball', async (context) => {
        const built = await fs.access(distPackageJson).then(() => true).catch(() => false);
        if (!built) context.skip();

        // `files` decides what is packed; an entry point it misses 404s for users.
        const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
            cwd: distDir,
            encoding: 'utf-8',
            maxBuffer: 64 * 1024 * 1024,
        });
        const packed = new Set(
            JSON.parse(output)[0].files.map((file: { path: string }) => file.path),
        );
        const pkg = JSON.parse(await fs.readFile(distPackageJson, 'utf-8'));
        const unpacked = manifestPaths(pkg)
            .filter((entry) => !entry.endsWith('/*'))
            .map((entry) => entry.replace(/^\.\//, ''))
            .filter((entry) => !packed.has(entry));

        expect(unpacked).toEqual([]);
    }, 60_000);
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
            'eslint.config.js',
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

describe('Font Preparation', () => {
    const load = async () => import('../bin/icon-sources.mjs');

    it('marks shapes hidden by inline style as fill="none"', async () => {
        const { markUnpaintedShapes } = await load();
        const svg = '<svg><path d="M0 0" style="fill: none; stroke-width: 0px;"/><path d="M1 1"/></svg>';
        expect(markUnpaintedShapes(svg)).toBe(
            '<svg><path d="M0 0" style="fill: none; stroke-width: 0px;" fill="none"/><path d="M1 1"/></svg>',
        );
    });

    it('marks shapes hidden by a <style> class rule', async () => {
        const { markUnpaintedShapes } = await load();
        const svg =
            '<svg><style>.cls-1 { fill: none; }</style><rect class="cls-1" x="1" width="2" height="2"/></svg>';
        expect(markUnpaintedShapes(svg)).toContain('<rect class="cls-1" x="1" width="2" height="2" fill="none"/>');
    });

    it('leaves stroked, white-filled and explicitly filled shapes alone', async () => {
        const { markUnpaintedShapes } = await load();
        const svg = [
            '<svg><style>.cls-1 { fill: #fff; }</style>',
            '<polygon points="0 0" style="fill: none; stroke: #000; stroke-width: 24px;"/>',
            '<path class="cls-1" d="M0 0"/>',
            '<path d="M0 0" fill="none"/>',
            '<path d="M0 0" style="fill: none" class="x" fill="#000"/>',
            '</svg>',
        ].join('');
        expect(markUnpaintedShapes(svg)).toBe(svg);
    });

    it('lets the inline style override a class rule', async () => {
        const { markUnpaintedShapes } = await load();
        const svg = '<svg><style>.cls-1 { fill: none; }</style><path class="cls-1" style="fill: #000" d="M0 0"/></svg>';
        expect(markUnpaintedShapes(svg)).toBe(svg);
    });
});
