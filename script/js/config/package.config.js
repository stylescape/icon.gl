import * as pack_object from '../../../package.json' assert { type: 'json' };
const pack = JSON.parse(JSON.stringify(pack_object)).default;
const packageConfig = {
    name: pack.name,
    version: pack.version,
    description: pack.description,
    keywords: pack.keywords,
    license: pack.license,
    homepage: pack.homepage,
    main: 'index.js',
    files: [
        "svg/**/*.{svg}",
        "js/**/*.{js,map}",
        "ts/**/*.ts",
        "css/**/*.{css,map}",
        "scss/**/*.{scss}",
        "font/**/*.{eot,otf,ttf,woff,woff2}",
        "!.DS_Store"
    ],
};
export default packageConfig;
//# sourceMappingURL=package.config.js.map