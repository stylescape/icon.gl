// Import
// ============================================================================

import * as Icons from "../icons";


// Types
// ============================================================================

type IconName = keyof typeof Icons;

type IconProps = {
    name: IconName;
    size?: number;
    color?: string;
    className?: string;
    otherAttributes?: Record<string, string>;
};

type IconCache = {
    [key: string]: string;
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


// Class
// ============================================================================

/**
 * Icon utilities for retrieving and customizing SVG strings from the bundled icon set.
 */
class Icon {


    private static cache: IconCache = {};


    /**
     * Retrieves the SVG markup of an icon by its key.
     * @param {string} key - The key representing the icon, e.g. "icon_ui_media_play".
     * @returns {string | null} The SVG markup of the icon if found, otherwise null.
     */
    static getIconByKey(key: string): string | null {
        if (!Object.prototype.hasOwnProperty.call(Icons, key)) return null;
        const svgMarkup: unknown = Icons[key as IconName];
        return typeof svgMarkup === "string" ? svgMarkup : null;
    }

    /**
     * Generates an SVG string with applied styles, classes, and other attributes.
     * `color` sets both `fill` (solid icons) and `color` (stroke icons that use
     * `currentColor`). Attribute values are escaped.
     * @param {IconProps} props - Icon properties including name, size, color, className, and otherAttributes.
     * @returns {string} The SVG string with styles, class, and other attributes, or "" for an unknown name.
     */
    static getIcon(props: IconProps): string {
        const { name, size, color, className, otherAttributes } = props;
        const svgString = this.getIconByKey(name);
        if (!svgString) return "";

        const attributes: string[] = [];
        const style = this.getStyleAttribute(size, color);
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
    static withAccessibility(svgString: string, label: string): string {
        const attributes = label
            ? `aria-label="${escapeAttribute(label)}" role="img"`
            : `aria-hidden="true" focusable="false"`;
        return addAttributes(svgString, attributes);
    }


    /**
     * Retrieves an icon from cache or generates it if not cached.
     * @param {IconProps} props - Icon properties.
     * @returns {string} The SVG string of the icon.
     */
    static getCachedIcon(props: IconProps): string {
        const cacheKey = JSON.stringify(props);
        if (!(cacheKey in this.cache)) {
            this.cache[cacheKey] = this.getIcon(props);
        }
        return this.cache[cacheKey];
    }


    /**
     * Constructs a style attribute string.
     * @param {number | undefined} size - The size of the icon.
     * @param {string | undefined} color - The color of the icon.
     * @returns {string} The style attribute string.
     */
    private static getStyleAttribute(size?: number, color?: string): string {
        const sizeStyle = size ? `width: ${size}px; height: ${size}px;` : "";
        const colorStyle = color ? `fill: ${color}; color: ${color};` : "";
        return `${sizeStyle} ${colorStyle}`.trim();
    }


    /**
     * Applies styles to an SVG string. Accepts camelCase (`strokeWidth`),
     * kebab-case (`stroke-width`) and custom (`--name`) properties.
     * @param {string} svgString - The SVG string to which styles will be applied.
     * @param {Record<string, string>} styles - The styles to apply.
     * @returns {string} The SVG string with applied styles, or the input unchanged if it isn't valid SVG.
     */
    static applyStylesToSvg(svgString: string, styles: Record<string, string>): string {
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

}


// Export
// ============================================================================

export default Icon;
export type { IconName, IconProps };
