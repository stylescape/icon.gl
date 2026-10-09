// ============================================================================
// icon.gl | Icon Module + Sprite Build Script
// ============================================================================
// Regenerates the TypeScript icon modules from src/svg/**/*.svg so the
// exports can't drift from the SVG sources:
//   - src/ts/icons/<id>.ts           export const icon_<id> = `<svg …>`;
//   - src/ts/icons/lucide/<id>.ts    (Lucide icons, plus a barrel index.ts)
//   - src/ts/icons.ts                barrel of everything above
//   - src/json/icongl/index.json     icon ids per category (dev gallery)
//   - doc/icons/index.md             icon gallery for the docs site
// and writes dist/svg/icongl.sprite.svg with one <symbol id="icon_<id>"> per
// icon for <use href="…#icon_<id>"> / <svg-icon>.
// ============================================================================

import fs from "node:fs/promises";
import path from "node:path";
import { optimize } from "svgo";
import { collectIcons, ROOT, SVG_DIR } from "./icon-sources.mjs";

const TS_DIR = path.join(ROOT, "src/ts/icons");
const BARREL = path.join(ROOT, "src/ts/icons.ts");
const SPRITE = path.join(ROOT, "dist/svg/icongl.sprite.svg");
const CATEGORIES = path.join(ROOT, "src/json/icongl/index.json");
const GALLERY = path.join(ROOT, "doc/icons/index.md");
// Served from the repo so new icons appear without waiting for an npm release.
const GALLERY_SVG_BASE = "https://raw.githubusercontent.com/stylescape/icon.gl/dev/src/svg";
const GALLERY_COLUMNS = 6;

// Lucide icons are emitted into their own sub-barrel; most are already clean
// stroke-based SVGs, so only their whitespace is collapsed.
const LUCIDE = "lucide";

const SVGO_CONFIG = {
    multipass: true,
    plugins: [
        // Illustrator exports put fills/strokes in style="", keep them as
        // attributes so preset-default can drop the useless ones.
        "convertStyleToAttrs",
        "preset-default",
        "removeDimensions",
        { name: "removeAttrs", params: { attrs: ["data-name", "class"] } },
    ],
};

function toMarkup(icon, source) {
    // Lucide sources that were re-exported from Illustrator still need svgo.
    if (icon.folder === LUCIDE && !source.startsWith("<?xml")) {
        return source
            .split("\n")
            .map((line) => line.trim())
            .join("");
    }
    return optimize(source, { ...SVGO_CONFIG, path: icon.file }).data;
}

function toModule(id, markup) {
    if (markup.includes("`") || markup.includes("${")) {
        throw new Error(`SVG for "${id}" can't be embedded in a template literal`);
    }
    return `export const icon_${id} = \`${markup}\`;\n`;
}

// Ids inside a symbol (gradients, clip paths, …) share one document in the
// sprite, so namespace them per icon.
function toSymbol(id, markup) {
    const match = markup.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
    if (!match) throw new Error(`Unexpected SVG markup for "${id}"`);
    const viewBox = match[1].match(/\bviewBox="([^"]*)"/);
    const body = match[2]
        .replace(/\bid="([^"]+)"/g, `id="${id}__$1"`)
        .replace(/url\(#([^)]+)\)/g, `url(#${id}__$1)`)
        .replace(/href="#([^"]+)"/g, `href="#${id}__$1"`);
    const viewBoxAttr = viewBox ? ` viewBox="${viewBox[1]}"` : "";
    return `<symbol id="icon_${id}"${viewBoxAttr}>${body}</symbol>`;
}

async function writeIfChanged(file, content) {
    const current = await fs.readFile(file, "utf8").catch(() => null);
    if (current === content) return false;
    await fs.writeFile(file, content, "utf8");
    return true;
}

async function removeStale(dir, keep) {
    let removed = 0;
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith(".ts") && !keep.has(entry.name)) {
            await fs.rm(path.join(dir, entry.name));
            removed++;
        }
    }
    return removed;
}

// Only rewritten when the categories change, so the timestamp doesn't churn.
async function writeCategories(icons) {
    const categories = {};
    for (const { id, folder } of icons) {
        if (folder === LUCIDE) continue;
        (categories[folder] ??= []).push(id);
    }
    const previous = JSON.parse(await fs.readFile(CATEGORIES, "utf8").catch(() => "{}"));
    if (JSON.stringify(previous.categories) === JSON.stringify(categories)) return false;

    const totalIcons = Object.values(categories).reduce((sum, ids) => sum + ids.length, 0);
    const index = { generated: new Date().toISOString(), source: "icon.gl", categories, totalIcons };
    await fs.mkdir(path.dirname(CATEGORIES), { recursive: true });
    await fs.writeFile(CATEGORIES, `${JSON.stringify(index, null, 2)}\n`, "utf8");
    return true;
}

// Font icons only; the Lucide set is documented upstream.
function renderGallery(icons) {
    const byFolder = new Map();
    for (const icon of icons) {
        if (icon.folder === LUCIDE) continue;
        if (!byFolder.has(icon.folder)) byFolder.set(icon.folder, []);
        byFolder.get(icon.folder).push(icon);
    }

    const lines = [
        "<!-- AUTO-GENERATED by scripts/build-icons.mjs — do not edit by hand. -->",
        "",
        "# Icons",
        "",
        "Use an icon as a font glyph (`<span class=\"i i_<name>\"></span>`), from the",
        "sprite (`#icon_<name>`), or as an SVG string (`icon_<name>` in TypeScript).",
    ];
    for (const folder of [...byFolder.keys()].sort()) {
        const cells = byFolder.get(folder).map(({ id, file }) => {
            const src = `${GALLERY_SVG_BASE}/${path.relative(SVG_DIR, file).split(path.sep).join("/")}`;
            return `<img src="${src}" alt="${id}" width="48" height="48"><br><small>${id}</small>`;
        });
        while (cells.length % GALLERY_COLUMNS) cells.push("");
        lines.push("", `## ${folder}`, "");
        lines.push(`|${" |".repeat(GALLERY_COLUMNS)}`);
        lines.push(`|${" --- |".repeat(GALLERY_COLUMNS)}`);
        for (let i = 0; i < cells.length; i += GALLERY_COLUMNS) {
            lines.push(`| ${cells.slice(i, i + GALLERY_COLUMNS).join(" | ")} |`);
        }
    }
    return `${lines.join("\n")}\n`;
}

async function main() {
    const icons = await collectIcons();
    const lucideDir = path.join(TS_DIR, LUCIDE);
    await fs.mkdir(lucideDir, { recursive: true });

    const core = [];
    const lucide = [];
    const symbols = [];
    let written = 0;

    for (const icon of icons) {
        const markup = toMarkup(icon, await fs.readFile(icon.file, "utf8"));
        const isLucide = icon.folder === LUCIDE;
        const dir = isLucide ? lucideDir : TS_DIR;
        if (await writeIfChanged(path.join(dir, `${icon.id}.ts`), toModule(icon.id, markup))) {
            written++;
        }
        (isLucide ? lucide : core).push(icon.id);
        symbols.push(toSymbol(icon.id, markup));
    }

    const lucideBarrel = lucide.map((id) => `export * from './${id}';\n`).join("");
    await writeIfChanged(path.join(lucideDir, "index.ts"), lucideBarrel);

    const barrel =
        core.map((id) => `export * from './icons/${id}';\n`).join("") +
        "\n// Lucide Icons (normal + bold variants)\n" +
        `export * from './icons/${LUCIDE}';\n`;
    await writeIfChanged(BARREL, barrel);

    const removed =
        (await removeStale(TS_DIR, new Set(core.map((id) => `${id}.ts`)))) +
        (await removeStale(lucideDir, new Set([...lucide.map((id) => `${id}.ts`), "index.ts"])));

    if (await writeIfChanged(GALLERY, renderGallery(icons))) {
        console.log(`[build-icons] wrote ${path.relative(ROOT, GALLERY)}`);
    }

    if (await writeCategories(icons)) {
        console.log(`[build-icons] wrote ${path.relative(ROOT, CATEGORIES)}`);
    }

    await fs.mkdir(path.dirname(SPRITE), { recursive: true });
    await fs.writeFile(
        SPRITE,
        `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join("")}</svg>\n`,
        "utf8"
    );

    console.log(
        `[build-icons] ${icons.length} icons (${core.length} core, ${lucide.length} lucide): ` +
            `${written} module(s) written, ${removed} stale module(s) removed`
    );
    console.log(`[build-icons] wrote ${path.relative(ROOT, SPRITE)}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
