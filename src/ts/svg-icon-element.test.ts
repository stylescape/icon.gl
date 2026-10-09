import { describe, expect, it } from 'vitest';

import { defineSvgIconElement } from './svg-icon-element';

describe('defineSvgIconElement', () => {
    it('should register <svg-icon> once', () => {
        defineSvgIconElement();
        defineSvgIconElement();
        expect(customElements.get('svg-icon')).toBeDefined();
    });

    it('should render a sprite reference and react to attribute changes', () => {
        defineSvgIconElement();
        const element = document.createElement('svg-icon');
        element.setAttribute('url', '/sprite.svg');
        element.setAttribute('type', 'icon_a');
        document.body.appendChild(element);

        expect(element.querySelector('use')?.getAttribute('href')).toBe('/sprite.svg#icon_a');

        element.setAttribute('type', 'icon_b');
        expect(element.querySelector('use')?.getAttribute('href')).toBe('/sprite.svg#icon_b');

        element.remove();
    });

    it('should not inject markup from attributes', () => {
        defineSvgIconElement();
        const element = document.createElement('svg-icon');
        element.setAttribute('type', '"></use><img src=x onerror=alert(1)>');
        document.body.appendChild(element);

        expect(element.querySelector('img')).toBeNull();

        element.remove();
    });
});
