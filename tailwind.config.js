/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			transitionProperty: {
				width: "width",
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["business", "corporate"],
	},
};
