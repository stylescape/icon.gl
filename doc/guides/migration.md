# Migration Guide

This guide helps migrate from early `v0.0.1` docs to the current `v0.0.35` package.

## Key Changes

- Module type is ESM (`"type": "module"` in `package.json`).
- Public TypeScript entry uses `Icon` helper and named icon exports.
- CSS classes standardized: base `.i` and glyph classes `.i_<name>`.
- Size utilities available: `.i-1x` through `.i-10x` (`.i_1x` … `.i_10x`
  before 0.1.0).

## Recommended Usage

### TypeScript / SVG

```ts
import { Icon } from 'icon.gl'
const svg = Icon.getIcon({ name: 'icon_ui_media_play', size: 24, color: '#000' })
```

### CSS Font Icons

```html
<span class="i i_ui_media_play i-2x"></span>
```

## Notes

- Entry points may change in future minor versions to compiled `dist` files. Prefer importing from `icon.gl` directly rather than deep paths.
- Check release notes for any renames in icon names; classes mirror export names (e.g., `icon_ui_media_play` → `.i_ui_media_play`).
