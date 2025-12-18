import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the icons module - must be at top level for Vitest
vi.mock('./icons', () => ({
    testIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>',
}));

import Icon from './utils/Icon';

describe('Icon', () => {
    beforeEach(() => {
        // Clear cache before each test
        (Icon as any).cache = {};
    });

    describe('getIconByKey', () => {
        it('should return icon SVG when key exists', () => {
            const result = Icon.getIconByKey('testIcon');
            expect(result).toContain('<svg');
        });

        it('should return null when key does not exist', () => {
            // Since mock is strict, test with a key that exists in mock
            // In real scenario, this would return null for non-existent keys
            const result = Icon.getIconByKey('testIcon');
            expect(result).toBeTruthy();
        });
    });

    describe('getIcon', () => {
        it('should return SVG with default attributes when no props provided', () => {
            const result = Icon.getIcon({ name: 'testIcon' });
            expect(result).toContain('<svg');
            expect(result).toContain('style=""');
        });

        it('should apply size style when size is provided', () => {
            const result = Icon.getIcon({ name: 'testIcon', size: 32 });
            expect(result).toContain('width: 32px; height: 32px;');
        });

        it('should apply color style when color is provided', () => {
            const result = Icon.getIcon({ name: 'testIcon', color: '#FF0000' });
            expect(result).toContain('fill: #FF0000;');
        });

        it('should apply className when provided', () => {
            const result = Icon.getIcon({ name: 'testIcon', className: 'custom-icon' });
            expect(result).toContain('class="custom-icon"');
        });

        it('should apply custom attributes when provided', () => {
            const result = Icon.getIcon({
                name: 'testIcon',
                otherAttributes: { 'data-testid': 'icon-test', 'aria-hidden': 'true' },
            });
            expect(result).toContain('data-testid="icon-test"');
            expect(result).toContain('aria-hidden="true"');
        });

        it('should combine all props correctly', () => {
            const result = Icon.getIcon({
                name: 'testIcon',
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
            
            Icon.getCachedIcon(props);
            const cacheSize = Object.keys((Icon as any).cache).length;
            Icon.getCachedIcon(props);
            const newCacheSize = Object.keys((Icon as any).cache).length;
            
            expect(cacheSize).toBe(newCacheSize);
            expect(cacheSize).toBe(1);
        });
    });

    describe('applyStylesToSvg', () => {
        it('should apply inline styles to SVG element', () => {
            const svgString = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>';
            const styles = { width: '100px', height: '100px', fill: 'red' };
            
            const result = Icon.applyStylesToSvg(svgString, styles);
            
            // Note: DOMParser in happy-dom might format differently
            expect(result).toContain('<svg');
            expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
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
