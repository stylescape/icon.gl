"use strict";
// Import
// ============================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const Icons = __importStar(require("../icons"));
// Class
// ============================================================================
class Icon {
    /**
     * Retrieves the SVG markup of an icon by its key.
     * @param {string} key - The key representing the icon.
     * @returns {string | null} The SVG markup of the icon if found, otherwise null.
     */
    static getIconByKey(key) {
        const svgMarkup = Icons[key];
        return svgMarkup || null;
    }
    /**
     * Generates an SVG string with applied styles, classes, and other attributes.
     * @param {IconProps} props - Icon properties including name, size, color, className, and otherAttributes.
     * @returns {string} The SVG string with styles, class, and other attributes.
     */
    static getIcon(props) {
        const { name, size, color, className, otherAttributes } = props;
        const svgString = Icons[name];
        if (!svgString)
            return "";
        let attributes = `style="${this.getStyleAttribute(size, color)}"`;
        attributes += className ? ` class="${className}"` : "";
        if (otherAttributes) {
            for (const [attr, value] of Object.entries(otherAttributes)) {
                attributes += ` ${attr}="${value}"`;
            }
        }
        return svgString.replace("<svg", `<svg ${attributes}`);
    }
    // /**
    //  * Retrieves an icon with a preset size.
    //  * @param {string} key - The key representing the icon.
    //  * @param {"small" | "medium" | "large"} preset - The preset size of the icon.
    //  * @returns {string | null} The SVG markup of the icon with the preset size.
    //  */
    // static getIconWithPreset(key: string, preset: "small" | "medium" | "large"): string | null {
    //     const sizeMap = { small: 16, medium: 32, large: 48 };
    //     return this.getIcon({ name: key, size: sizeMap[preset] });
    // }
    /**
     * Applies accessibility attributes to the SVG icon.
     * @param {string} svgString - The SVG string.
     * @param {string} label - Accessibility label for the icon.
     * @returns {string} The SVG string with accessibility attributes.
     */
    static withAccessibility(svgString, label) {
        return svgString.replace("<svg", `<svg aria-label="${label}" role="img"`);
    }
    /**
     * Retrieves an icon from cache or generates it if not cached.
     * @param {IconProps} props - Icon properties.
     * @returns {string} The SVG string of the icon.
     */
    static getCachedIcon(props) {
        const cacheKey = JSON.stringify(props);
        if (!this.cache[cacheKey]) {
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
    static getStyleAttribute(size, color) {
        const sizeStyle = size ? `width: ${size}px; height: ${size}px;` : "";
        const colorStyle = color ? `fill: ${color};` : "";
        return `${sizeStyle} ${colorStyle}`.trim();
    }
    /**
     * Applies styles to an SVG string.
     * @param {string} svgString - The SVG string to which styles will be applied.
     * @param {Record<string, string>} styles - The styles to apply.
     * @returns {string} The SVG string with applied styles.
     */
    static applyStylesToSvg(svgString, styles) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        const svgElement = doc.querySelector("svg");
        if (svgElement) {
            for (const [key, value] of Object.entries(styles)) {
                svgElement.style[key] = value;
            }
            return svgElement.outerHTML;
        }
        return svgString;
    }
}
Icon.cache = {};
// Export
// ============================================================================
exports.default = Icon;
