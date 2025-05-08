// ============================================================================
// Import
// ============================================================================

"use strict";

import "./style/svg-icon-element.less";


// ============================================================================
// Classes
// ============================================================================

class SvgIconElement extends HTMLElement {

    private generateSvgIcon(url: string, id: string): string {
        return `<svg class="si"><use xlink:href="${url}#${id}"></use></svg>`;
    }

    private setContent(): void {
        const url = this.getAttribute("url") || "";
        const type = this.getAttribute("type") || "";
        this.innerHTML = this.generateSvgIcon(url, type);
    }

    connectedCallback(): void {
        this.setContent();
    }

    attributeChangedCallback(): void {
        this.setContent();
    }
}

window.customElements.define("svg-icon", SvgIconElement);
