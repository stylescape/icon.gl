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

// ----------------------------------------------------------------------------
// Font preparation
// ----------------------------------------------------------------------------

const SHAPE_TAG = /<(path|rect|circle|ellipse|polygon|polyline|line)\b([^>]*?)(\/?)>/g;

/** Reads `name` from a style declaration list (`fill: none; stroke: #000`). */
function cssValue(declarations, name) {
    const match = new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`, "i").exec(declarations);
    return match ? match[1].trim().toLowerCase() : undefined;
}

/**
 * Adds `fill="none"` to shapes that are unpainted through CSS only
 * (`style="fill: none"` or a `<style>` class rule) and have no visible
 * stroke. svgicons2svgfont reads only the `fill` attribute, so without this
 * such helper shapes (Illustrator's invisible bounding circles and boxes)
 * are filled in the font and turn outline icons into solid blobs.
 * Stroked shapes are left alone: a font cannot carry strokes, and dropping
 * them would leave the glyph empty.
 */
export function markUnpaintedShapes(svg) {
    const classDecls = new Map();
    for (const [, block] of svg.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
        for (const [, selectors, body] of block.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
            for (const sel of selectors.split(",")) {
                const cls = /^\s*\.([\w-]+)\s*$/.exec(sel)?.[1];
                if (cls) classDecls.set(cls, `${classDecls.get(cls) ?? ""};${body}`);
            }
        }
    }
    return svg.replace(SHAPE_TAG, (tag, name, attrs, selfClosing) => {
        if (/\sfill\s*=/.test(attrs)) return tag;
        const classes = /\sclass\s*=\s*"([^"]*)"/.exec(attrs)?.[1].split(/\s+/) ?? [];
        const style = /\sstyle\s*=\s*"([^"]*)"/.exec(attrs)?.[1] ?? "";
        // Inline style wins over class rules, so it goes last.
        const decls = [...classes.map((c) => classDecls.get(c) ?? ""), style].join(";");
        const read = (prop) => {
            const values = decls
                .split(";")
                .map((d) => cssValue(d, prop))
                .filter((v) => v !== undefined);
            return values.at(-1) ?? /\s${prop}\s*=\s*"([^"]*)"/.exec(attrs)?.[1]?.trim().toLowerCase();
        };
        if (read("fill") !== "none") return tag;
        const stroke = read("stroke");
        const strokeWidth = parseFloat(read("stroke-width") ?? "1");
        if (stroke && stroke !== "none" && strokeWidth > 0) return tag;
        return `<${name}${attrs} fill="none"${selfClosing}>`;
    });
}
