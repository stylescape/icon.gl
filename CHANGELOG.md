# Changelog

All notable changes to **icon.gl** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Fix pass of 2026-10-07/08 (base `c571a572`). Open follow-ups are in `TODO.md`.

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
- **Package layout:** `main`, `module`, `types`, `sass`, `style` and
  `exports` point at the published `dist/` root (`./js/index.mjs`,
  `./scss/index.scss`, …). `./svg/*` and `./font/*` are exported.

### Fixed

- **`import { Icon } from "icon.gl"` failed:** the published package
  shipped no `js/index.cjs` or `js/index.mjs` because `files` only matched
  `*.js`. `test/build.test.ts` now checks the packed tarball, which installs
  and imports with both `require` and `import`.
- **`npm install` failed** on the unused Babel 7/8 presets; Babel is removed.
- **Font codepoints are stable across builds:** `scripts/build-font.mjs`
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
- `npm run lint` hid failures with `|| true`.

### Added

- `scripts/build-icons.mjs` (`npm run build:icons`) generates the TS icon
  modules, `src/ts/icons.ts`, `src/json/icongl/index.json`, the SVG sprite
  `dist/svg/icongl.sprite.svg` and the docs gallery `doc/icons/index.md`
  from `src/svg`, so exports can no longer drift from the SVG sources.
- 51 icon exports for SVGs that had no module, among them the
  `icon_app_compare` … `icon_app_study_update` family,
  `icon_app_questions_add_copy` and `icon_lucide_chart_pie_demography`.
- `defineSvgIconElement()` registers `<svg-icon>`; safe to call more than
  once and a no-op outside the browser. `IconName` and `IconProps` types are
  exported.
- ESLint flat config (`npm run lint` over `src/ts`, `scripts`, `test`),
  `npm run typecheck`, and tests for `Icon`, `<svg-icon>`, the build output
  and the packed tarball.

### Changed

- Prettier skips the generated files (`src/ts/icons/`, `src/ts/icons.ts`,
  `src/scss/variables/_font.scss`, `src/json/icongl/index.json`,
  `doc/icons/index.md`).
