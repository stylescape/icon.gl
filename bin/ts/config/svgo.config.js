export default {



    multipass: true,
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
    
    {
      name: 'removeAttributesBySelector',
      params: {
        selector: 'svg',
        attributes: ['xml:space', 'id'],
      },
    },
    {
      name: 'sortAttrs',
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-*', 'data.*'],
      },
    },
    {
      name: 'removeDimensions',
    },
    {
      name: 'convertStyleToAttrs',
      params: {
        keepImportant: true,
      },
    },
  ],






    // js2svg: {
    //     pretty: true,
    //     indent: 2,
    //     eol: 'lf'
    // },
    // plugins: [
    //     {
    //         name: 'preset-default',
    //         params: {
    //             overrides: {
    //                 removeUnknownsAndDefaults: {
    //                     // remove all `data` attributes
    //                     keepDataAttrs: false,
    //                     // keep the `role` attribute
    //                     keepRoleAttr: true,
    //                 },

    //                 // keep the `viewBox` attribute
    //                 removeViewBox: false,
        
    //                 // customize the params of a default plugin
    //                 inlineStyles: {
    //                     onlyMatchedOnce: false,
    //                 }
    //             }
    //         }
    //     },
    //     // The next plugins are included in svgo but are not part of preset-default,
    //     // so we need to explicitly enable them
    //     'cleanupListOfValues',
    //     {
    //         name: 'removeAttrs',
    //         params: {
    //             attrs: [
    //                 'clip-rule',
    //                 'fill'
    //             ]
    //         }
    //     },
    //     // Custom plugin which resets the SVG attributes to explicit values
    //     {
    //         name: 'explicitAttrs',
    //         type: 'visitor',
    //         params: {
    //             attributes: {
    //                 xmlns: 'http://www.w3.org/2000/svg',
    //                 width: '16',
    //                 height: '16',
    //                 fill: 'currentColor',
    //                 class: '', // We replace the class with the correct one based on filename later
    //                 viewBox: '0 0 16 16'
    //             }
    //         },
    //         fn(_root: any, params: { attributes: { [s: string]: unknown; } | ArrayLike<unknown>; }, info: { path: string; }) {
    //             if (!params.attributes) {
    //                 return null
    //             }
    //             const pathname = info.path
    //             const basename = path.basename(pathname, '.svg')
        
    //             return {
    //                 element: {
    //                     enter(node: { name; attributes: { [x: string]: unknown; }; }, parentNode: { type: string; }) {
    //                         if (node.name === 'svg' && parentNode.type === 'root') {
    //                             // We set the `svgAttributes` in the order we want to,
    //                             // hence why we remove the attributes and add them back
    //                             node.attributes = {}
    //                             for (const [key, value] of Object.entries(params.attributes)) {
    //                                 node.attributes[key] = key === 'class' ? `igl igl-${basename}` : value
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // ]




};