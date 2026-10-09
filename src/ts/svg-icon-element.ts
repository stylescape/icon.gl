// ============================================================================
// Constants
// ============================================================================

const TAG_NAME = "svg-icon";

// Defined lazily so importing the library never touches `HTMLElement` outside
// a browser (SSR, tests without a DOM).
let SvgIconElementClass: CustomElementConstructor | undefined;


// ============================================================================
// Classes
// ============================================================================

/**
 * Builds the element class that renders a symbol from the icon.gl sprite.
 * @example <svg-icon url="/node_modules/icon.gl/dist/svg/icongl.sprite.svg" type="icon_ui_media_play"></svg-icon>
 */
function createSvgIconElement(): CustomElementConstructor {
    return class SvgIconElement extends HTMLElement {

        static get observedAttributes(): string[] {
            return ["url", "type"];
        }

        private render(): void {
            const url = this.getAttribute("url") || "";
            const type = this.getAttribute("type") || "";

            const svgNs = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNs, "svg");
            svg.setAttribute("class", "si");
            svg.setAttribute("aria-hidden", "true");
            const use = document.createElementNS(svgNs, "use");
            use.setAttribute("href", `${url}#${type}`);
            svg.appendChild(use);

            this.replaceChildren(svg);
        }

        connectedCallback(): void {
            this.render();
        }

        attributeChangedCallback(): void {
            if (this.isConnected) this.render();
        }
    };
}


// ============================================================================
// Functions
// ============================================================================

/**
 * Registers the `<svg-icon>` custom element. Safe to call more than once and
 * a no-op outside the browser.
 */
export function defineSvgIconElement(): void {
    if (typeof window === "undefined" || !window.customElements) return;
    if (window.customElements.get(TAG_NAME)) return;
    SvgIconElementClass ??= createSvgIconElement();
    window.customElements.define(TAG_NAME, SvgIconElementClass);
}
