// ============================================================================
// Interfaces
// ============================================================================

interface PackageJson {
    name: string;
    version: string;
    description?: string;
    main?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    repository?: {
        type: string;
        url: string;
    };
    keywords?: string[];
    author?: string | {
        name: string;
        email?: string;
        url?: string;
    };
    license?: string;
    bugs?: {
        url?: string;
        email?: string;
    };
    homepage?: string;
    private?: boolean;
    peerDependencies?: Record<string, string>;
    engines?: {
        node?: string;
        npm?: string;
    };
    bin?: Record<string, string>;
    types?: string;
    contributors?: Array<string | {
        name: string;
        email?: string;
        url?: string;
    }>;
    funding?: string | {
        type: string;
        url: string;
    };
    files?: string[];
    browserslist?: string[] | Record<string, string[]>;
    publishConfig?: Record<string, any>;
    config?: Record<string, any>;
    typings?: string;
    exports?: Record<string, any>;
    module?: string;
    sideEffects?: boolean | string[];

    optionalDependencies?: Record<string, string>;
    bundledDependencies?: string[]; // or bundleDependencies
    peerDependenciesMeta?: Record<string, { optional?: boolean }>;
    resolutions?: Record<string, string>;
    workspaces?: string[] | {
      packages: string[];
    };
    eslintConfig?: Record<string, any>;
    babel?: Record<string, any>;
    prettier?: Record<string, any>;
    husky?: Record<string, any>;
    jest?: Record<string, any>;
    enginesStrict?: boolean;
    os?: string[];
    cpu?: string[];
}
