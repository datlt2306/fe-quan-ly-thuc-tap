const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	important: true,
	theme: {
		colors: {
			primary: "#fb923c",
			secondary: "#0ea5e9",
			info: "#22d3ee",
			error: "#f43f5e",
			success: "#10b981",
			warning: "#f59e0b",
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
	plugins: [
		require("prettier-plugin-tailwindcss"),
		require("@tailwindcss/forms"),
		require("tailwind-scrollbar")({ nocompatible: true }),
	],
};
