# Changelog

All notable changes to **icon.gl** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - Unreleased

Fix pass of 2026-10-07/08 (base `c571a572`) and the TODO pass of
2026-10-09. Open follow-ups are in `TODO.md`.

### Breaking

- **24 icon exports removed** whose SVGs had already been deleted, so
  importing them now fails: `icon_chart_pie_01`–`04`,
  `icon_chart_pyramid_01`–`03`, `icon_chart_radar_01`,
  `icon_file_type_w0ff2`, `icon_game`, `icon_people_01`–`04`,
  `icon_people_18`, `icon_symbol_01`–`04`, `icon_symbol_09`–`12` and
  `icon_type_01`.
- **18 SVGs renamed** so their ids work as CSS class names: hyphens became
  underscores (`shape-29.svg` → `shape_29.svg`,
  `file_type_iso-80.svg` → `file_type_iso_80.svg`, …) and the two
  `… copy.svg` files became `…_copy.svg`.
- **Size classes renamed** `.i_1x` … `.i_10x` → `.i-1x` … `.i-10x`, so they
  no longer match the glyph selector `[class^='i_']` or share a namespace
  with icon names. The Sass variable `$icongl_prefix` is replaced by
  `$icongl_size_prefix` (default `'i-'`).
- **Package layout:** `main`, `module`, `types`, `sass`, `style` and
  `exports` point at the published `dist/` root (`./js/index.mjs`,
  `./scss/index.scss`, …). `./svg/*` and `./font/*` are exported.

### Fixed

- **`import { Icon } from "icon.gl"` failed:** the published package
  shipped no `js/index.cjs` or `js/index.mjs` because `files` only matched
  `*.js`. `tst/build.test.ts` now checks the packed tarball, which installs
  and imports with both `require` and `import`.
- **`npm install` failed** on the unused Babel 7/8 presets; Babel is removed.
- **Font glyphs that differed from their SVG:**
  - 121 SVGs drew their letter with `<text>` in Barlow (all
    `letters_circle_*` / `letters_square_*`, `file_type_iso`), so the font
    glyph was an empty circle or square and the SVG showed the letter only
    where Barlow was installed. The letters are now outlines (Barlow 1.408,
    OFL); white letters on the `*_fill_*` shapes are cut out, so they stay
    transparent on any background.
  - 7 stroked SVGs (`file_type_iso`, `solid_cube*`, `solid_pyramid`) were
    filled silhouettes in the font. `file_type_iso`'s strokes are outlined;
    the `solid_*` files keep only their existing outlined layer.
  - `places` and `ui_edit_pen` used `fill-rule: evenodd`, which the font
    fills as nonzero (`places` was a solid block); `ui_media_fill_pause`
    overlapped shapes of opposite winding, which cancelled out to an outline.
    All three are now single nonzero paths.
- **Named icon exports did not tree-shake:** `import { icon_ui_media_play }`
  bundled all 4,923 icons (~4.7 MB) because `Icon` used
  `import * as Icons`, which esbuild compiles to a side-effecting
  `__export()` call. `Icon` now looks names up in the generated object
  literal `src/ts/icon-map.ts`; the package declares `sideEffects` (CSS and
  SCSS only). Importing one icon with `renderIcon` now bundles to about
  1 kB; `tst/build.test.ts` checks this with Vite.
- **Font codepoints are stable across builds:** `bin/build-font.mjs`
  reuses the codepoints from `src/scss/variables/_font.scss`, so existing
  icons keep their glyph and only new icons get new codepoints.
- **`Icon`:** `getIconByKey` no longer returns inherited properties such as
  `constructor`; `withAccessibility` escapes the label and marks icons
  without a label as decorative (`aria-hidden`); `applyStylesToSvg` accepts
  camelCase, kebab-case and custom properties, leaves invalid SVG unchanged
  and works without a DOM; `color` also sets `color`, so `currentColor`
  icons follow it; `getCachedIcon` caches empty results.
- **`<svg-icon>`** builds its markup with DOM APIs instead of `innerHTML`
  (no attribute injection), uses `href` instead of the deprecated
  `xlink:href`, is `aria-hidden`, and no longer touches `window` on import.
- **165 font glyphs were solid blobs** (`number_circle_*`, `time_*`,
  `badge_country_*`, …): helper shapes hidden with CSS (`style="fill: none"`
  or a `<style>` class) were filled in the font. `build-font.mjs` now marks
  them `fill="none"` before the font is generated; the SVGs are unchanged.
- **Docs:** the MkDocs build works again (Templates page, nav, quick start).
- **Demo pages** (`index.html`, `exa/index.html`, `exa/font_demo.html`) load
  the current build; search input is no longer injected as HTML. Checked
  in headless Chromium on 2026-10-09: no console errors or 404s, all 1,532
  font glyphs render as text (no emoji or tofu), search works. The dev
  gallery no longer loses the white cut-outs of 12 icons
  (`app_*_delete`, …) to `<style>` rules of other inlined SVGs, and its
  dead "Browse SVGs" link now opens the SVG sprite.
- **Demo pages** use stylescape 0.5.1 (was 0.4.1): the footer links failed
  colour contrast (about 2.4:1); axe reports no violations now.
- **Quick start** linked `node_modules/icon.gl/dist/…`; the package root is
  `dist/`, so the paths are `node_modules/icon.gl/css/…` and `…/svg/…`.
- `npm run lint` hid failures with `|| true`.

### Added

- `bin/build-icons.mjs` (`npm run build:icons`) generates the TS icon
  modules, `src/ts/icons.ts`, `src/json/icongl/index.json`, the SVG sprite
  `dist/svg/icongl.sprite.svg` and the docs gallery `doc/icons/index.md`
  from `src/svg`, so exports can no longer drift from the SVG sources.
- 51 icon exports for SVGs that had no module, among them the
  `icon_app_compare` … `icon_app_study_update` family,
  `icon_app_questions_add_copy` and `icon_lucide_chart_pie_demography`.
- `renderIcon(svg, options)`, `withAccessibility(svg, label)` and
  `applyStylesToSvg(svg, styles)` as standalone functions that don't pull in
  the icon set (the `Icon` methods of the same names delegate to them), the
  `IconOptions` type, and `Icon.clearCache()`.
- `src/html/test.html` (published as `html/test.html`, every font glyph on
  one page) is generated by `bin/build-icons.mjs` instead of kept by hand;
  the hand-kept page missed 114 icons.
- `defineSvgIconElement()` registers `<svg-icon>`; safe to call more than
  once and a no-op outside the browser. `IconName` and `IconProps` types are
  exported.
- ESLint flat config (`npm run lint` over `src/ts`, `scripts`, `test`),
  `npm run typecheck`, and tests for `Icon`, `<svg-icon>`, the build output
  and the packed tarball.

### Changed

- `files` no longer lists `jinja/**/*.jinja` and `md/**/*.md` (nothing
  matched), and the build no longer creates an empty `dist/md/`.
- The published `package.json` now includes `sideEffects`, and `types` is
  copied from `package.json` (`./js/index.d.ts`).
- Prettier skips the generated files (`src/ts/icons/`, `src/ts/icons.ts`,
  `src/ts/icon-map.ts`, `src/scss/variables/_font.scss`,
  `src/json/icongl/index.json`, `src/html/test.html`, `doc/icons/index.md`).
