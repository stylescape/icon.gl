// Copyright 2023 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// ============================================================================
// Import
// ============================================================================

'use strict';

import './style/svg-icon-element.less';


// ============================================================================
// Classes
// ============================================================================

class SvgIconElement extends HTMLElement {

    private generateSvgIcon(url: string, id: string): string {
        return `<svg class="si"><use xlink:href="${url}#${id}"></use></svg>`;
    }

    private setContent(): void {
        const url = this.getAttribute('url') || '';
        const type = this.getAttribute('type') || '';
        this.innerHTML = this.generateSvgIcon(url, type);
    }

    connectedCallback(): void {
        this.setContent();
    }

    attributeChangedCallback(): void {
        this.setContent();
    }
}

window.customElements.define('svg-icon', SvgIconElement);
