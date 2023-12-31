


const terserCofig = {
    compress: {
        drop_console: true, // Remove console.log statements
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.info', 'console.debug', 'console.warn'], // Remove specific console functions
    },
    mangle: {
        // Mangle names for obfuscation and size reduction
        properties: true, // Mangle property names
    },
    format: {
        comments: false, // Remove comments
        beautify: false, // Disable beautification for smaller file size
    },
    keep_classnames: false, // Remove class names
    keep_fnames: false, // Remove function names
    toplevel: true, // Enable top-level variable and function name mangling
};


// ============================================================================
// Export
// ============================================================================

export default terserCofig;
