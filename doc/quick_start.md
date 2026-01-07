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
<span class="i i_ui_media_play icon2x"></span>
```

## SVG Sprite

```html
<svg-icon url="/assets/icons.svg" type="icon_ui_media_play"></svg-icon>
```
