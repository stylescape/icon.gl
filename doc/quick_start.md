# Quick Start

## Installation

```sh
npm i icon.gl
```

## SVG Usage (TypeScript)

```ts
import { Icon } from "icon.gl";
document.getElementById("target")!.innerHTML = Icon.getIcon({ name: "icon_ui_media_play", size: 24 });
```

## Font + CSS

```html
<link rel="stylesheet" href="node_modules/icon.gl/css/icon.gl.min.css">

<span class="i i_ui_media_play i-2x"></span>
```

## SVG Sprite

The build emits `dist/svg/icongl.sprite.svg` with one `<symbol id="icon_<name>">` per icon.

```html
<svg class="si"><use href="node_modules/icon.gl/svg/icongl.sprite.svg#icon_ui_media_play"></use></svg>
```

Or register the `<svg-icon>` element once and use it anywhere:

```ts
import { defineSvgIconElement } from "icon.gl";
defineSvgIconElement();
```

```html
<svg-icon url="node_modules/icon.gl/svg/icongl.sprite.svg" type="icon_ui_media_play"></svg-icon>
```
