import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		proxy: {
			'/green-api': {
				target: 'https://api.green-api.com',
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/green-api/, ''),
			},
		},
	},
});
