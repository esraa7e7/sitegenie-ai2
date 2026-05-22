import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes("node_modules")) {
                        return id
                            .toString()
                            .split("node_modules/")[1]
                            .split("/visualization/")[0]
                            .split("/")[0];
                    }
                },
            },
        },
    },
    server: {
        port: 5173,
        allowedHosts: ['.trycloudflare.com'] // السطر ده اللي هيفتح لكِ الموقع أونلاين فوراً!
    }
});
