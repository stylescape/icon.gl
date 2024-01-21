"use strict";
// Copyright 2024 Scape Agency BV
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// Import
// ============================================================================
var Icons = __importStar(require("../icons"));
// Class
// ============================================================================
class Icon {
    static { this.cache = {}; }
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
            return '';
        let attributes = `style="${this.getStyleAttribute(size, color)}"`;
        attributes += className ? ` class="${className}"` : '';
        if (otherAttributes) {
            for (const [attr, value] of Object.entries(otherAttributes)) {
                attributes += ` ${attr}="${value}"`;
            }
        }
        return svgString.replace('<svg', `<svg ${attributes}`);
    }
    // /**
    //  * Retrieves an icon with a preset size.
    //  * @param {string} key - The key representing the icon.
    //  * @param {'small' | 'medium' | 'large'} preset - The preset size of the icon.
    //  * @returns {string | null} The SVG markup of the icon with the preset size.
    //  */
    // static getIconWithPreset(key: string, preset: 'small' | 'medium' | 'large'): string | null {
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
        return svgString.replace('<svg', `<svg aria-label="${label}" role="img"`);
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
        const sizeStyle = size ? `width: ${size}px; height: ${size}px;` : '';
        const colorStyle = color ? `fill: ${color};` : '';
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
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        if (svgElement) {
            for (const [key, value] of Object.entries(styles)) {
                svgElement.style[key] = value;
            }
            return svgElement.outerHTML;
        }
        return svgString;
    }
}
// Export
// ============================================================================
exports.default = Icon;
