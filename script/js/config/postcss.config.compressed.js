import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
const postcssConfigCompressed = {
    plugins: [
        autoprefixer,
        cssnano({
            preset: 'default'
        }),
    ]
};
export default postcssConfigCompressed;
//# sourceMappingURL=postcss.config.compressed.js.map