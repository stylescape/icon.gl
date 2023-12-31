const terserCofig = {
    compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
    },
    mangle: {
        properties: true,
    },
    format: {
        comments: false,
        beautify: false,
    },
    keep_classnames: false,
    keep_fnames: false,
    toplevel: true,
};
export default terserCofig;
//# sourceMappingURL=terser.config.js.map