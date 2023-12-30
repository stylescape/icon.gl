class ModulePackager {
    constructor(svgs, version) {
        if (!svgs || !version) {
            throw new Error("Invalid constructor arguments");
        }
        this.svgs = svgs;
        this.version = version;
    }
    getSVGContent(source) {
        return source.slice(source.indexOf('>') + 1).slice(0, -6);
    }
    createModulePackage() {
        try {
            const files = this.svgs.map(svg => {
                const source = this.getSVGContent(svg.source);
                const json = JSON.stringify(Object.assign(Object.assign({}, svg), { source }));
                return {
                    filepath: `${svg.metadata.name}.js`,
                    source: `export default ${json};`
                };
            });
            files.push({
                filepath: 'package.json',
                source: `{
                    "name": "@acme/module-icons",
                    "version": "${this.version}"
                }`
            });
            return {
                name: 'module-icons',
                files
            };
        }
        catch (error) {
            console.error('Error creating module package:', error);
            throw error;
        }
    }
}
export default ModulePackager;
//# sourceMappingURL=ModulePackager.js.map