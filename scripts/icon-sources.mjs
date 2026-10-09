// ============================================================================
// icon.gl | Icon Sources
// ============================================================================
// Shared discovery of src/svg/**/*.svg for the build scripts. The icon id is
// the SVG basename (folder names are NOT prefixed), so it has to be usable
// verbatim as a CSS class suffix (.i_<id>) and a JS identifier (icon_<id>).
// ============================================================================

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SVG_DIR = path.join(ROOT, "src/svg");

const VALID_ID = /^[a-z0-9_]+$/;

/**
 * Walks src/svg and returns every icon as { id, folder, file }, sorted by id.
 * Throws on ids that are not valid class/identifier suffixes and on
 * duplicate ids across folders.
 */
export async function collectIcons() {
    const byId = new Map();
    const invalid = [];

    async function walk(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const file = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(file);
                continue;
            }
            if (!entry.isFile() || !entry.name.endsWith(".svg")) continue;

            const id = path.basename(entry.name, ".svg");
            if (!VALID_ID.test(id)) {
                invalid.push(path.relative(ROOT, file));
                continue;
            }
            if (byId.has(id)) {
                throw new Error(
                    `Duplicate icon id "${id}":\n  ${byId.get(id).file}\n  ${file}`
                );
            }
            const folder = path.relative(SVG_DIR, dir).split(path.sep)[0];
            byId.set(id, { id, folder, file });
        }
    }

    await walk(SVG_DIR);

    if (invalid.length) {
        throw new Error(
            `${invalid.length} SVG file name(s) must match ${VALID_ID} ` +
                `(lowercase letters, digits and underscores):\n  ` +
                invalid.join("\n  ")
        );
    }

    return [...byId.values()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
