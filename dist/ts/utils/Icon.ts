// Copyright 2024 Scape Agency BV

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

import * as Icons from '../icons';


// Types
// ============================================================================

type IconProps = {
    name: keyof typeof Icons;
    size?: number;
    color?: string;
    className?: string;
    otherAttributes?: Record<string, string>;
};

type IconCache = {
    [key: string]: string;
};
  

// Class
// ============================================================================

class Icon {


    private static cache: IconCache = {};


    /**
     * Retrieves the SVG markup of an icon by its key.
     * @param {string} key - The key representing the icon.
     * @returns {string | null} The SVG markup of the icon if found, otherwise null.
     */
    static getIconByKey(key: string): string | null {
        const svgMarkup = Icons[key as keyof typeof Icons];
        return svgMarkup || null;
    }
  
    /**
     * Generates an SVG string with applied styles, classes, and other attributes.
     * @param {IconProps} props - Icon properties including name, size, color, className, and otherAttributes.
     * @returns {string} The SVG string with styles, class, and other attributes.
     */
    static getIcon(props: IconProps): string {
        const { name, size, color, className, otherAttributes } = props;
        const svgString = Icons[name];
        if (!svgString) return '';
    
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
    static withAccessibility(svgString: string, label: string): string {
        return svgString.replace('<svg', `<svg aria-label="${label}" role="img"`);
    }


    /**
     * Retrieves an icon from cache or generates it if not cached.
     * @param {IconProps} props - Icon properties.
     * @returns {string} The SVG string of the icon.
     */
    static getCachedIcon(props: IconProps): string {
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
    private static getStyleAttribute(size?: number, color?: string): string {
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
    static applyStylesToSvg(svgString: string, styles: Record<string, string>): string {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        if (svgElement) {
            for (const [key, value] of Object.entries(styles)) {
                svgElement.style[key as any] = value;
            }
            return svgElement.outerHTML;
        }
        return svgString;
    }




}
  

// Export
// ============================================================================

export default Icon;