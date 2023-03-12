/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/defaultTheme");
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [...defaultTheme.fontFamily.sans],
                serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
            },
            colors: {
                main: colors.amber,
                stone: {
                    50: "#F8F8F7",
                    150: "#EEEDEC",
                    850: "#231F1E",
                    950: "#0E0D0C",
                },
            },
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
            },
            animation: {
                wiggle: "wiggle 200ms ease-in-out",
            },
        },
    },
    plugins: [],
};
