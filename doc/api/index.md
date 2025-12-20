# API Reference

## Icon Class

The `Icon` helper provides static utilities to render and manipulate SVG icons.

### `Icon.getIcon(props)`
- props: `{ name: keyof Icons; size?: number; color?: string; className?: string; otherAttributes?: Record<string,string> }`
- returns: `string` — SVG string with attributes applied.

Example:

```ts
import { Icon } from "icon.gl";
const svg = Icon.getIcon({ name: "icon_ui_media_play", size: 24, color: "#000" });
```

### `Icon.getIconByKey(key)`
- key: `string`
- returns: `string | null` — raw SVG string for the icon or `null` if not found.

### `Icon.applyStylesToSvg(svgString, styles)`
- svgString: `string`
- styles: `Record<string,string>` (e.g., `{ width: "24px", fill: "#333" }`)
- returns: `string` — SVG string with inline styles applied.

### `Icon.withAccessibility(svgString, label)`
- svgString: `string`
- label: `string` — ARIA label
- returns: `string` — SVG with `aria-label` and `role="img"` applied.

### `Icon.getCachedIcon(props)`
- props: same as `getIcon`
- returns: `string` — Cached SVG string for identical props.

## Icon Exports

All icons are exported as string constants from `icon.gl` under `Icons`.
Import any icon by name:

```ts
import { icon_ui_media_play, icon_people_circle } from "icon.gl";
```

## Web Component

`SvgIconElement` registers the `<svg-icon>` element for external sprite usage.

```html
<svg-icon url="/assets/icons.svg" type="icon_ui_media_play"></svg-icon>
```

## CSS & Font Utilities

- Base container: `.i`
- Glyph classes: `.i_<name>`
- Sizes: `.icon1x` … `.icon10x`

```html
<span class="i i_ui_media_play icon2x"></span>
```