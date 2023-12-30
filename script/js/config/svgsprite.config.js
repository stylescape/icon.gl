const svgspriteConfig = {
    dest: './dist/sprite',
    shape: {
        id: {
            separator: '--',
            generator: 'icon-%s',
            pseudo: '~'
        },
        dimension: {
            maxWidth: 2000,
            maxHeight: 2000,
            precision: 2,
            attributes: false,
        },
        spacing: {
            padding: 0,
            box: 'content'
        },
        transform: ['svgo'],
    },
    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: true,
        namespaceIDs: true,
        namespaceClassnames: false,
        dimensionAttributes: true
    },
    variables: {},
    mode: {
        css: {
            render: {
                css: true
            }
        },
        view: true,
        defs: true,
        symbol: {
            sprite: "icon.gl.svg"
        },
        stack: true,
    }
};
export default svgspriteConfig;
//# sourceMappingURL=svgsprite.config.js.map