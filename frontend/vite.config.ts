import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': resolve(__dirname, 'src/components'),
            '@lib': resolve(__dirname, 'src/lib'),
            src: resolve(__dirname, 'src'),
        },
    },
});
