import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';



const postcssConfigCompressed = {
    plugins: [
        autoprefixer,
        cssnano({ preset: 'default' }), // Minification for compressed output
    ]
};
export default postcssConfigCompressed;
