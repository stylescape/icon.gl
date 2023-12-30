import { FontAssetType, OtherAssetType } from 'fantasticon';
const fantasticonConfig = {
    inputDir: './dist/svg',
    outputDir: './dist/font',
    name: 'icon.gl',
    fontTypes: [
        FontAssetType.TTF,
        FontAssetType.WOFF,
        FontAssetType.WOFF2,
        FontAssetType.EOT,
        FontAssetType.SVG,
    ],
    assetTypes: [
        OtherAssetType.CSS,
        OtherAssetType.SCSS,
        OtherAssetType.SASS,
        OtherAssetType.HTML,
        OtherAssetType.JSON,
        OtherAssetType.TS,
    ],
    formatOptions: {
        json: { indent: 4 },
        ts: {
            types: ['enum', 'constant', 'literalId', 'literalKey'],
            singleQuotes: false,
            enumName: 'icon_gl',
            constantName: 'MY_CODEPOINTS'
        }
    },
    pathOptions: {
        json: './dist/font/icon.gl.json',
        css: './dist/font/icon.gl.css',
        scss: './dist/font/icon.gl.scss',
        woff: './dist/font/icon.gl.woff',
        woff2: './dist/font/icon.gl.woff2',
    },
    selector: '.igl',
    prefix: 'igl',
    fontsUrl: './fonts',
};
export default fantasticonConfig;
//# sourceMappingURL=fantasticon.config.js.map