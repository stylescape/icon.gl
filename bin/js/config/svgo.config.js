import path from 'node:path';
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
                        keepDataAttrs: false,
                        keepRoleAttr: true,
                    },
                    removeViewBox: false,
                    inlineStyles: {
                        onlyMatchedOnce: false,
                    }
                }
            }
        },
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
        {
            name: 'explicitAttrs',
            type: 'visitor',
            params: {
                attributes: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '16',
                    height: '16',
                    fill: 'currentColor',
                    class: '',
                    viewBox: '0 0 16 16'
                }
            },
            fn(_root, params, info) {
                if (!params.attributes) {
                    return null;
                }
                const pathname = info.path;
                const basename = path.basename(pathname, '.svg');
                return {
                    element: {
                        enter(node, parentNode) {
                            if (node.name === 'svg' && parentNode.type === 'root') {
                                node.attributes = {};
                                for (const [key, value] of Object.entries(params.attributes)) {
                                    node.attributes[key] = key === 'class' ? `igl igl-${basename}` : value;
                                }
                            }
                        }
                    }
                };
            }
        }
    ]
};
export default svgoConfig;
//# sourceMappingURL=svgo.config.js.map