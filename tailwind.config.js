/** @type {import('tailwindcss').Config} */
export default {
	content: [],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [require('prettier-plugin-tailwindcss')],
};
