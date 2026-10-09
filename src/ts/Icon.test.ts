import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the icon map - must be at top level for Vitest
vi.mock('./icon-map', () => ({
    iconMap: {
        testIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>',
    },
}));

import Icon from './utils/Icon';
import { renderIcon } from './utils/svg';

describe('Icon', () => {
    beforeEach(() => {
        Icon.clearCache();
    });

    describe('getIconByKey', () => {
        it('should return icon SVG when key exists', () => {
            const result = Icon.getIconByKey('testIcon');
            expect(result).toContain('<svg');
        });

        it('should return null when key does not exist', () => {
            expect(Icon.getIconByKey('missingIcon')).toBeNull();
        });

        it('should return null for inherited object keys', () => {
            expect(Icon.getIconByKey('toString')).toBeNull();
            expect(Icon.getIconByKey('constructor')).toBeNull();
        });
    });

    describe('getIcon', () => {
        it('should return the plain SVG when no props provided', () => {
            const result = Icon.getIcon({ name: 'testIcon' as any });
            expect(result).toContain('<svg');
            expect(result).not.toContain('style=');
        });

        it('should return an empty string for an unknown icon', () => {
            expect(Icon.getIcon({ name: 'missingIcon' as any })).toBe('');
        });

        it('should apply size style when size is provided', () => {
            const result = Icon.getIcon({ name: 'testIcon' as any, size: 32 });
            expect(result).toContain('width: 32px; height: 32px;');
        });

        it('should apply color style when color is provided', () => {
            const result = Icon.getIcon({ name: 'testIcon' as any, color: '#FF0000' });
            expect(result).toContain('fill: #FF0000;');
            expect(result).toContain('color: #FF0000;');
        });

        it('should escape attribute values', () => {
            const result = Icon.getIcon({
                name: 'testIcon' as any,
                className: 'a" onload="alert(1)',
                otherAttributes: { title: '<b>&</b>' },
            });
            expect(result).toContain('class="a&quot; onload=&quot;alert(1)"');
            expect(result).toContain('title="&lt;b&gt;&amp;&lt;/b&gt;"');
            expect(result).not.toContain('onload="');
        });

        it('should reject invalid attribute names', () => {
            expect(() =>
                Icon.getIcon({
                    name: 'testIcon' as any,
                    otherAttributes: { 'onload="x" a': '1' },
                })
            ).toThrow(/Invalid SVG attribute name/);
        });

        it('should apply className when provided', () => {
            const result = Icon.getIcon({ name: 'testIcon' as any, className: 'custom-icon' });
            expect(result).toContain('class="custom-icon"');
        });

        it('should apply custom attributes when provided', () => {
            const result = Icon.getIcon({
                name: 'testIcon' as any,
                otherAttributes: { 'data-testid': 'icon-test', 'aria-hidden': 'true' },
            });
            expect(result).toContain('data-testid="icon-test"');
            expect(result).toContain('aria-hidden="true"');
        });

        it('should combine all props correctly', () => {
            const result = Icon.getIcon({
                name: 'testIcon' as any,
                size: 48,
                color: 'blue',
                className: 'icon-large',
                otherAttributes: { 'data-icon': 'test' },
            });
            expect(result).toContain('width: 48px; height: 48px;');
            expect(result).toContain('fill: blue;');
            expect(result).toContain('class="icon-large"');
            expect(result).toContain('data-icon="test"');
        });
    });

    describe('renderIcon', () => {
        it('should render an SVG string without the icon set', () => {
            const svg = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>';
            const result = renderIcon(svg, { size: 24, color: 'red', className: 'x' });
            expect(result).toBe(
                '<svg style="width: 24px; height: 24px; fill: red; color: red;" class="x" viewBox="0 0 24 24"><path d="M0 0"/></svg>'
            );
        });

        it('should match getIcon for the same SVG', () => {
            const svg = Icon.getIconByKey('testIcon') as string;
            const options = { size: 32, otherAttributes: { 'data-a': '1' } };
            expect(renderIcon(svg, options)).toBe(Icon.getIcon({ name: 'testIcon' as any, ...options }));
        });

        it('should return the SVG unchanged without options', () => {
            expect(renderIcon('<svg></svg>')).toBe('<svg></svg>');
        });
    });

    describe('withAccessibility', () => {
        it('should add accessibility attributes to SVG', () => {
            const svgString = '<svg><path d="M0 0"/></svg>';
            const result = Icon.withAccessibility(svgString, 'Test Icon');
            expect(result).toContain('aria-label="Test Icon"');
            expect(result).toContain('role="img"');
        });

        it('should preserve existing SVG content', () => {
            const svgString = '<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>';
            const result = Icon.withAccessibility(svgString, 'Triangle');
            expect(result).toContain('viewBox="0 0 24 24"');
            expect(result).toContain('<path d="M12 2L2 22h20L12 2z"/>');
        });

        it('should escape the label', () => {
            const result = Icon.withAccessibility('<svg></svg>', 'Say "hi"');
            expect(result).toContain('aria-label="Say &quot;hi&quot;"');
        });

        it('should mark the icon decorative when the label is empty', () => {
            const result = Icon.withAccessibility('<svg></svg>', '');
            expect(result).toContain('aria-hidden="true"');
            expect(result).not.toContain('role="img"');
        });
    });

    describe('getCachedIcon', () => {
        it('should cache icon on first call', () => {
            const props = { name: 'testIcon' as any, size: 24 };
            const result1 = Icon.getCachedIcon(props);
            const result2 = Icon.getCachedIcon(props);

            expect(result1).toBe(result2);
            expect(result1).toContain('width: 24px; height: 24px;');
        });

        it('should create different cache entries for different props', () => {
            const props1 = { name: 'testIcon' as any, size: 24 };
            const props2 = { name: 'testIcon' as any, size: 48 };

            const result1 = Icon.getCachedIcon(props1);
            const result2 = Icon.getCachedIcon(props2);

            expect(result1).not.toBe(result2);
            expect(result1).toContain('width: 24px; height: 24px;');
            expect(result2).toContain('width: 48px; height: 48px;');
        });

        it('should use same cache entry for identical props', () => {
            const props = { name: 'testIcon' as any, color: 'red', className: 'test' };
            const getIcon = vi.spyOn(Icon, 'getIcon');

            Icon.getCachedIcon(props);
            Icon.getCachedIcon({ ...props });

            expect(getIcon).toHaveBeenCalledTimes(1);
            getIcon.mockRestore();
        });

        it('should render again after clearCache', () => {
            const props = { name: 'testIcon' as any, size: 16 };
            const getIcon = vi.spyOn(Icon, 'getIcon');

            Icon.getCachedIcon(props);
            Icon.clearCache();
            Icon.getCachedIcon(props);

            expect(getIcon).toHaveBeenCalledTimes(2);
            getIcon.mockRestore();
        });
    });

    describe('applyStylesToSvg', () => {
        it('should apply inline styles to SVG element', () => {
            const svgString = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>';
            const styles = { width: '100px', height: '100px', fill: 'red' };

            const result = Icon.applyStylesToSvg(svgString, styles);

            expect(result).toContain('<svg');
            expect(result).toContain('width: 100px');
            expect(result).toContain('fill: red');
        });

        it('should apply camelCase and kebab-case properties', () => {
            const svgString = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>';

            const result = Icon.applyStylesToSvg(svgString, {
                strokeWidth: '2',
                'stroke-linecap': 'round',
            });

            expect(result).toContain('stroke-width: 2');
            expect(result).toContain('stroke-linecap: round');
        });

        it('should fall back to a style attribute without DOMParser', () => {
            vi.stubGlobal('DOMParser', undefined);
            try {
                const result = Icon.applyStylesToSvg('<svg viewBox="0 0 1 1"></svg>', {
                    strokeWidth: '2',
                });
                expect(result).toBe('<svg style="stroke-width: 2;" viewBox="0 0 1 1"></svg>');
            } finally {
                vi.unstubAllGlobals();
            }
        });

        it('should return original string if SVG parsing fails', () => {
            const invalidSvg = 'not an svg';
            const styles = { width: '100px' };

            const result = Icon.applyStylesToSvg(invalidSvg, styles);

            expect(result).toBe(invalidSvg);
        });

        it('should handle empty styles object', () => {
            const svgString = '<svg><path d="M0 0"/></svg>';
            const styles = {};

            const result = Icon.applyStylesToSvg(svgString, styles);

            expect(result).toContain('<svg');
        });
    });
});
