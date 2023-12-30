import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';



const postcssConfigExpanded = {
    plugins: [
        autoprefixer,
        // Include other plugins suited for the expanded output
    ]
};

export default postcssConfigExpanded;
