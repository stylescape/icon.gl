import * as Icons from '../icons';
type IconProps = {
    name: keyof typeof Icons;
    size?: number;
    color?: string;
    className?: string;
    otherAttributes?: Record<string, string>;
};
declare class Icon {
    private static cache;
    /**
     * Retrieves the SVG markup of an icon by its key.
     * @param {string} key - The key representing the icon.
     * @returns {string | null} The SVG markup of the icon if found, otherwise null.
     */
    static getIconByKey(key: string): string | null;
    /**
     * Generates an SVG string with applied styles, classes, and other attributes.
     * @param {IconProps} props - Icon properties including name, size, color, className, and otherAttributes.
     * @returns {string} The SVG string with styles, class, and other attributes.
     */
    static getIcon(props: IconProps): string;
    /**
     * Applies accessibility attributes to the SVG icon.
     * @param {string} svgString - The SVG string.
     * @param {string} label - Accessibility label for the icon.
     * @returns {string} The SVG string with accessibility attributes.
     */
    static withAccessibility(svgString: string, label: string): string;
    /**
     * Retrieves an icon from cache or generates it if not cached.
     * @param {IconProps} props - Icon properties.
     * @returns {string} The SVG string of the icon.
     */
    static getCachedIcon(props: IconProps): string;
    /**
     * Constructs a style attribute string.
     * @param {number | undefined} size - The size of the icon.
     * @param {string | undefined} color - The color of the icon.
     * @returns {string} The style attribute string.
     */
    private static getStyleAttribute;
    /**
     * Applies styles to an SVG string.
     * @param {string} svgString - The SVG string to which styles will be applied.
     * @param {Record<string, string>} styles - The styles to apply.
     * @returns {string} The SVG string with applied styles.
     */
    static applyStylesToSvg(svgString: string, styles: Record<string, string>): string;
}
export default Icon;
