// Import
// ============================================================================

import { iconMap } from "../icon-map";
import { applyStylesToSvg, renderIcon, withAccessibility, type IconOptions } from "./svg";


// Types
// ============================================================================

type IconName = keyof typeof iconMap;

type IconProps = IconOptions & {
    name: IconName;
};

type IconCache = {
    [key: string]: string;
};


// Cache
// ============================================================================

// Module state rather than a static field: es2020 output lowers static fields
// to a call, which keeps the class (and every icon) in bundles that never
// use it.
let cache: IconCache = {};


// Class
// ============================================================================

/**
 * Icon utilities for retrieving and customizing SVG strings from the bundled
 * icon set by name. Using `Icon` bundles every icon; to ship only the icons an
 * app uses, import them by name and pass them to `renderIcon`.
 */
class Icon {


    /**
     * Retrieves the SVG markup of an icon by its key.
     * @param {string} key - The key representing the icon, e.g. "icon_ui_media_play".
     * @returns {string | null} The SVG markup of the icon if found, otherwise null.
     */
    static getIconByKey(key: string): string | null {
        if (!Object.prototype.hasOwnProperty.call(iconMap, key)) return null;
        const svgMarkup: unknown = iconMap[key as IconName];
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
        const { name, ...options } = props;
        const svgString = this.getIconByKey(name);
        return svgString ? renderIcon(svgString, options) : "";
    }


    /**
     * Applies accessibility attributes to the SVG icon. An empty label marks
     * the icon as decorative (`aria-hidden="true"`).
     * @param {string} svgString - The SVG string.
     * @param {string} label - Accessibility label for the icon.
     * @returns {string} The SVG string with accessibility attributes.
     */
    static withAccessibility(svgString: string, label: string): string {
        return withAccessibility(svgString, label);
    }


    /**
     * Retrieves an icon from cache or generates it if not cached.
     * @param {IconProps} props - Icon properties.
     * @returns {string} The SVG string of the icon.
     */
    static getCachedIcon(props: IconProps): string {
        const cacheKey = JSON.stringify(props);
        if (!(cacheKey in cache)) {
            cache[cacheKey] = this.getIcon(props);
        }
        return cache[cacheKey];
    }


    /**
     * Empties the cache of `getCachedIcon`.
     */
    static clearCache(): void {
        cache = {};
    }


    /**
     * Applies styles to an SVG string. Accepts camelCase (`strokeWidth`),
     * kebab-case (`stroke-width`) and custom (`--name`) properties.
     * @param {string} svgString - The SVG string to which styles will be applied.
     * @param {Record<string, string>} styles - The styles to apply.
     * @returns {string} The SVG string with applied styles, or the input unchanged if it isn't valid SVG.
     */
    static applyStylesToSvg(svgString: string, styles: Record<string, string>): string {
        return applyStylesToSvg(svgString, styles);
    }

}


// Export
// ============================================================================

export default Icon;
export type { IconName, IconProps };
