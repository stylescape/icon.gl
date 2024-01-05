// config/svgo.config.ts

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

import path from 'node:path'


// ============================================================================
// Constants
// ============================================================================

const svgoConfig = {

    multipass: true,
    js2svg: {
        pretty: true,
        indent: 2,
        eol: 'lf'
    },
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    removeUnknownsAndDefaults: {
                        // remove all `data` attributes
                        keepDataAttrs: false,
                        // keep the `role` attribute
                        keepRoleAttr: true,
                    },

                    // keep the `viewBox` attribute
                    removeViewBox: false,
        
                    // customize the params of a default plugin
                    inlineStyles: {
                        onlyMatchedOnce: false,
                    }
                }
            }
        },
        // The next plugins are included in svgo but are not part of preset-default,
        // so we need to explicitly enable them
        'cleanupListOfValues',
        {
            name: 'removeAttrs',
            params: {
                attrs: [
                    'clip-rule',
                    'fill'
                ]
            }
        },
        // Custom plugin which resets the SVG attributes to explicit values
        {
            name: 'explicitAttrs',
            type: 'visitor',
            params: {
                attributes: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '16',
                    height: '16',
                    fill: 'currentColor',
                    class: '', // We replace the class with the correct one based on filename later
                    viewBox: '0 0 16 16'
                }
            },
            fn(_root: any, params: { attributes: { [s: string]: unknown; } | ArrayLike<unknown>; }, info: { path: string; }) {
                if (!params.attributes) {
                    return null
                }
                const pathname = info.path
                const basename = path.basename(pathname, '.svg')
        
                return {
                    element: {
                        enter(node: { name: string; attributes: { [x: string]: unknown; }; }, parentNode: { type: string; }) {
                            if (node.name === 'svg' && parentNode.type === 'root') {
                                // We set the `svgAttributes` in the order we want to,
                                // hence why we remove the attributes and add them back
                                node.attributes = {}
                                for (const [key, value] of Object.entries(params.attributes)) {
                                    node.attributes[key] = key === 'class' ? `igl igl-${basename}` : value
                                }
                            }
                        }
                    }
                }
            }
        }
    ]
};


// ============================================================================
// Export
// ============================================================================

export default svgoConfig;
