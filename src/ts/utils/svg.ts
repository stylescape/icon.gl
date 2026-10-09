// SVG string helpers. This module must not import the icon set, so apps that
// pass the SVG string themselves (`renderIcon(icon_ui_media_play, …)`) only
// bundle the icons they import.
// ============================================================================


// Types
// ============================================================================

type IconOptions = {
    size?: number;
    color?: string;
    className?: string;
    otherAttributes?: Record<string, string>;
};


// Helpers
// ============================================================================

const ATTRIBUTE_NAME = /^[a-zA-Z_:][-a-zA-Z0-9_:.]*$/;

function escapeAttribute(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function addAttributes(svgString: string, attributes: string): string {
    return attributes ? svgString.replace("<svg", `<svg ${attributes}`) : svgString;
}

function toKebabCase(property: string): string {
    return property.startsWith("--")
        ? property
        : property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

function getStyleAttribute(size?: number, color?: string): string {
    const sizeStyle = size ? `width: ${size}px; height: ${size}px;` : "";
    const colorStyle = color ? `fill: ${color}; color: ${color};` : "";
    return `${sizeStyle} ${colorStyle}`.trim();
}


// Functions
// ============================================================================

/**
 * Adds size, colour, class and other attributes to an SVG string.
 * `color` sets both `fill` (solid icons) and `color` (stroke icons that use
 * `currentColor`). Attribute values are escaped.
 * @param {string} svgString - The SVG markup, e.g. `icon_ui_media_play`.
 * @param {IconOptions} options - Size, color, className and otherAttributes.
 * @returns {string} The SVG string with the attributes added.
 */
function renderIcon(svgString: string, options: IconOptions = {}): string {
    const { size, color, className, otherAttributes } = options;
    const attributes: string[] = [];
    const style = getStyleAttribute(size, color);
    if (style) attributes.push(`style="${escapeAttribute(style)}"`);
    if (className) attributes.push(`class="${escapeAttribute(className)}"`);
    if (otherAttributes) {
        for (const [attr, value] of Object.entries(otherAttributes)) {
            if (!ATTRIBUTE_NAME.test(attr)) {
                throw new Error(`Invalid SVG attribute name: "${attr}"`);
            }
            attributes.push(`${attr}="${escapeAttribute(value)}"`);
        }
    }
    return addAttributes(svgString, attributes.join(" "));
}

/**
 * Applies accessibility attributes to the SVG icon. An empty label marks
 * the icon as decorative (`aria-hidden="true"`).
 * @param {string} svgString - The SVG string.
 * @param {string} label - Accessibility label for the icon.
 * @returns {string} The SVG string with accessibility attributes.
 */
function withAccessibility(svgString: string, label: string): string {
    const attributes = label
        ? `aria-label="${escapeAttribute(label)}" role="img"`
        : `aria-hidden="true" focusable="false"`;
    return addAttributes(svgString, attributes);
}

/**
 * Applies styles to an SVG string. Accepts camelCase (`strokeWidth`),
 * kebab-case (`stroke-width`) and custom (`--name`) properties.
 * @param {string} svgString - The SVG string to which styles will be applied.
 * @param {Record<string, string>} styles - The styles to apply.
 * @returns {string} The SVG string with applied styles, or the input unchanged if it isn't valid SVG.
 */
function applyStylesToSvg(svgString: string, styles: Record<string, string>): string {
    const declarations = Object.entries(styles).map(
        ([key, value]) => [toKebabCase(key), value] as const
    );

    // Without a DOM (SSR, workers) fall back to prepending a style attribute.
    if (typeof DOMParser === "undefined") {
        if (!/^\s*<svg[\s>]/.test(svgString) || declarations.length === 0) return svgString;
        const style = declarations.map(([key, value]) => `${key}: ${value};`).join(" ");
        return addAttributes(svgString, `style="${escapeAttribute(style)}"`);
    }

    const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
    const svgElement = doc.documentElement;
    if (
        !svgElement ||
        svgElement.nodeName.toLowerCase() !== "svg" ||
        doc.getElementsByTagName("parsererror").length > 0
    ) {
        return svgString;
    }
    for (const [key, value] of declarations) {
        (svgElement as unknown as SVGElement).style.setProperty(key, value);
    }
    return svgElement.outerHTML;
}


// Export
// ============================================================================

export { applyStylesToSvg, renderIcon, withAccessibility };
export type { IconOptions };
