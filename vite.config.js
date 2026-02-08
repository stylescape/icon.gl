import { exec } from 'child_process';
import { promisify } from 'util';
import { defineConfig } from 'vite';

const execAsync = promisify(exec);

let lastBuild = 0;

async function runKist(server) {
    const now = Date.now();
    if (now - lastBuild < 500) return;
    lastBuild = now;

    console.log('[Kist] 🛠️ Running build...');
    try {
        const { stdout, stderr } = await execAsync('npx kist --config ./kist.dev.yml');
        if (stdout) console.log('[Kist] stdout:', stdout);
        if (stderr) console.error('[Kist] stderr:', stderr);
        console.log('[Kist] Build complete');

        setTimeout(() => {
            server?.ws.send({
                type: 'full-reload',
                path: '*'
            });
        }, 200);

    } catch (err) {
        console.error('[Kist] Build failed:', err.stderr || err.message);
    }
}

export default defineConfig({
    root: '.',
    publicDir: false,
    server: {
        port: 3001,
        open: true,
        fs: { strict: false },
    },
    plugins: [
        {
            name: 'kist-watch',
            configureServer(server) {
                runKist(server);

                // Watch for file changes to trigger kist rebuild
                server.watcher.on('change', (file) => {
                    if (file.includes('/src/') || file.includes('kist.')) {
                        runKist(server);
                    }
                });
            },
        },
    ],
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.{test,spec}.{js,ts}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/ts/**/*.ts'],
        },
    },
});
