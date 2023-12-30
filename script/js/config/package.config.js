import * as pack_object from '../../../package.json' assert { type: 'json' };
const pack = JSON.parse(JSON.stringify(pack_object)).default;
const packageConfig = {
    name: pack.name,
    version: pack.version,
    description: pack.description,
    main: 'index.js',
};
export default packageConfig;
//# sourceMappingURL=package.config.js.map