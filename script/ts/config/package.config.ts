import * as pack_object from '../../../package.json' assert { type: 'json' };

const pack = JSON.parse(JSON.stringify(pack_object)).default; // req.body = [Object: null prototype] { title: 'product' }


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
    // repository: {
    //     type: pack.repository.type,
    //     url: pack.repository.url,
    // },

    // author?: string | {
    //     name: string;
    //     email?: string;
    //     url?: string;
    // };
    // bugs?: {
    //     url?: string;
    //     email?: string;
    // };

    // contributors?: Array<string | {
    //     name: string;
    //     email?: string;
    //     url?: string;
    // }>;
    // funding?: string | {
    //     type: string;
    //     url: string;
    // };


}

// ============================================================================
// Export
// ============================================================================

export default packageConfig;
