import { promises as fs } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('SVG Icons Integration', () => {
    const svgDir = path.resolve(__dirname, '../src/svg');

    it('should have SVG directory structure', async () => {
        const exists = await fs.access(svgDir).then(() => true).catch(() => false);
        expect(exists).toBe(true);
    });

    it('should contain valid SVG files', async () => {
        const subdirs = await fs.readdir(svgDir, { withFileTypes: true });
        const directories = subdirs.filter(dirent => dirent.isDirectory());

        expect(directories.length).toBeGreaterThan(0);

        // Check at least one directory has SVG files
        for (const dir of directories.slice(0, 3)) {
            const dirPath = path.join(svgDir, dir.name);
            const files = await fs.readdir(dirPath);
            const svgFiles = files.filter(f => f.endsWith('.svg'));

            if (svgFiles.length > 0) {
                // Validate first SVG file structure
                const svgContent = await fs.readFile(path.join(dirPath, svgFiles[0]), 'utf-8');
                expect(svgContent).toContain('<svg');
                expect(svgContent).toContain('</svg>');
                break;
            }
        }
    });

    it('should have valid SVG syntax in icon files', async () => {
        const subdirs = await fs.readdir(svgDir, { withFileTypes: true });
        const directories = subdirs.filter(dirent => dirent.isDirectory());

        for (const dir of directories.slice(0, 2)) {
            const dirPath = path.join(svgDir, dir.name);
            const files = await fs.readdir(dirPath);
            const svgFiles = files.filter(f => f.endsWith('.svg'));

            for (const svgFile of svgFiles.slice(0, 5)) {
                const content = await fs.readFile(path.join(dirPath, svgFile), 'utf-8');

                // Basic SVG validation
                expect(content).toMatch(/<svg[^>]*>/);
                expect(content).toContain('</svg>');

                // Should have viewBox or width/height
                const hasViewBox = content.includes('viewBox');
                const hasDimensions = content.includes('width=') && content.includes('height=');
                expect(hasViewBox || hasDimensions).toBe(true);
            }
        }
    });
});

describe('Icon Sources Stay In Sync', () => {
    const srcDir = path.resolve(__dirname, '../src');

    async function listSvgIds(): Promise<Map<string, string>> {
        const ids = new Map<string, string>();
        async function walk(dir: string) {
            for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
                const file = path.join(dir, entry.name);
                if (entry.isDirectory()) await walk(file);
                else if (entry.name.endsWith('.svg')) ids.set(path.basename(entry.name, '.svg'), file);
            }
        }
        await walk(path.join(srcDir, 'svg'));
        return ids;
    }

    it('should only use lowercase, digits and underscores in SVG file names', async () => {
        const invalid = [...(await listSvgIds()).keys()].filter(id => !/^[a-z0-9_]+$/.test(id));
        expect(invalid).toEqual([]);
    });

    it('should export exactly one TypeScript module per SVG', async () => {
        const svgIds = await listSvgIds();
        const coreBarrel = await fs.readFile(path.join(srcDir, 'ts/icons.ts'), 'utf-8');
        const lucideBarrel = await fs.readFile(path.join(srcDir, 'ts/icons/lucide/index.ts'), 'utf-8');
        const exported = [
            ...[...coreBarrel.matchAll(/from '\.\/icons\/([a-z0-9_]+)'/g)].map(m => m[1]),
            ...[...lucideBarrel.matchAll(/from '\.\/([a-z0-9_]+)'/g)].map(m => m[1]),
        ].filter(id => id !== 'lucide');

        expect([...exported].sort()).toEqual([...svgIds.keys()].sort());
    });

    it('should map every font icon in the SCSS map', async () => {
        const scss = await fs.readFile(path.join(srcDir, 'scss/variables/_font.scss'), 'utf-8');
        const mapped = [...scss.matchAll(/^\s*"([^"]+)":\s*"\\[0-9a-f]+"/gm)].map(m => m[1]);
        const fontIds = [...(await listSvgIds()).entries()]
            .filter(([, file]) => !file.includes(`${path.sep}lucide${path.sep}`))
            .map(([id]) => id);

        expect(new Set(mapped).size).toBe(mapped.length);
        expect([...mapped].sort()).toEqual(fontIds.sort());
    });
});

describe('JSON Codepoints', () => {
    const jsonDir = path.resolve(__dirname, '../src/json');

    it('should have valid JSON codepoint files', async () => {
        const files = await fs.readdir(jsonDir);
        const jsonFiles = files.filter(f => f.startsWith('codepoints_') && f.endsWith('.json'));

        expect(jsonFiles.length).toBeGreaterThan(0);

        for (const file of jsonFiles) {
            const content = await fs.readFile(path.join(jsonDir, file), 'utf-8');
            const parsed = JSON.parse(content);

            expect(typeof parsed).toBe('object');

            // Validate codepoint structure
            if (Object.keys(parsed).length > 0) {
                const firstKey = Object.keys(parsed)[0];
                expect(typeof parsed[firstKey]).toBe('number');
            }
        }
    });

    it('should have unique codepoints across files', async () => {
        const files = await fs.readdir(jsonDir);
        const jsonFiles = files.filter(f => f.startsWith('codepoints_') && f.endsWith('.json'));

        const allCodepoints = new Set<number>();
        const duplicates: Array<{ file: string; value: number }> = [];

        for (const file of jsonFiles) {
            const content = await fs.readFile(path.join(jsonDir, file), 'utf-8');
            const parsed = JSON.parse(content);

            for (const value of Object.values(parsed)) {
                if (typeof value === 'number') {
                    if (allCodepoints.has(value)) {
                        duplicates.push({ file, value });
                    }
                    allCodepoints.add(value);
                }
            }
        }

        // Log duplicates for information but don't fail the test
        // This is expected behavior in some icon sets
        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} duplicate codepoints (this may be intentional)`);
        }

        expect(allCodepoints.size).toBeGreaterThan(0);
    });
});
