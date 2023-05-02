const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	important: true,
	theme: {
		colors: {
			primary: "#f27125",
			secondary: "#0d51a1",

			error: "#f87171",
			success: "#4eb849",
			disabled: "#9ca3af",
			...colors,
		},
		screens: {
			sm: {
				min: "375px",
				max: "767px",
			},
			md: {
				min: "768px",
				max: "1365px",
			},
			lg: {
				min: "1366px",
				max: "1920px",
			},
			xl: { min: "1921px" },
		},
		extends: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [require("prettier-plugin-tailwindcss")],
};
