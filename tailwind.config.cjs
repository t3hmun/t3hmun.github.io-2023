/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/defaultTheme");
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                main: colors.amber,
                stone: {
                    50: "#F8F8F7",
                    150: "#EEEDEC",
                    850: "#231F1E",
                    950: "#0E0D0C",
                },
            },
        },
    },
    plugins: [],
};
