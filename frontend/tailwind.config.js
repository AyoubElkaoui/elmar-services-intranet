// tailwind.config.js
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#003366",
                    light:   "#004080",
                    dark:    "#002952",
                },
                accent: {
                    DEFAULT: "#FF6600",
                    light:   "#FF7F2A",
                    dark:    "#CC5200",
                },
            },
        },
    },
    plugins: [],
};
