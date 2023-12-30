import * as pack_object from '../../../package.json' assert { type: 'json' };

const pack = JSON.parse(JSON.stringify(pack_object)).default; // req.body = [Object: null prototype] { title: 'product' }


const packageConfig = {
    name: pack.name,
    version: pack.version,
    description: pack.description,
    main: 'index.js',
    // ... other properties
}

// ============================================================================
// Export
// ============================================================================

export default packageConfig;
