"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var svgoConfig = {
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
            fn: function (_root, params, info) {
                if (!params.attributes) {
                    return null;
                }
                var pathname = info.path;
                var basename = node_path_1.default.basename(pathname, '.svg');
                return {
                    element: {
                        enter: function (node, parentNode) {
                            if (node.name === 'svg' && parentNode.type === 'root') {
                                // We set the `svgAttributes` in the order we want to,
                                // hence why we remove the attributes and add them back
                                node.attributes = {};
                                for (var _i = 0, _a = Object.entries(params.attributes); _i < _a.length; _i++) {
                                    var _b = _a[_i], key = _b[0], value = _b[1];
                                    node.attributes[key] = key === 'class' ? "igl igl-".concat(basename) : value;
                                }
                            }
                        }
                    }
                };
            }
        }
    ]
};
exports.default = svgoConfig;
