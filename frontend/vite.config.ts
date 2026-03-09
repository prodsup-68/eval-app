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
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const target = options.target;
            console.log(
              `[vite-proxy] ${req.method} ${req.url} -> ${target}${proxyReq.path}`,
            );
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(
              `[vite-proxy] ${req.method} ${req.url} <- ${proxyRes.statusCode}`,
            );
          });
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
      },
    },
  },
});
