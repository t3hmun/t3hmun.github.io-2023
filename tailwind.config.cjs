/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [...defaultTheme.fontFamily.sans],
                serif: [...defaultTheme.fontFamily.sans],
                mono: [...defaultTheme.fontFamily.mono],
            },
            colors: {
                dark: { text: colors.zinc["200"] },
                light: { text: colors.zinc["700"] },
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
