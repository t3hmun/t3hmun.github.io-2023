module.exports = {
    //Need this due to a prettier-vscode-pnpm issue https://www.npmjs.com/package/prettier-plugin-astro#pnpm-support
    plugins: [require.resolve("prettier-plugin-astro")],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
    ],
};
