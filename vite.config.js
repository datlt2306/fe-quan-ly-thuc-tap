import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import path from "path";

export default defineConfig({
	resolve: {
		alias: [
			{
				find: "@",
				// eslint-disable-next-line no-undef
				replacement: path.resolve(__dirname, "src"),
			},
		],
	},
	plugins: [
		react({
			include: "**/*.jsx",
			babel: {
				plugins: ["babel-plugin-macros", "babel-plugin-styled-components"],
			},
		}),
	],

	server: {
		port: 3000,
		proxy: {
			'/api': {
				target: 'https://polytuts.website/api',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			}
		}
	},
});
