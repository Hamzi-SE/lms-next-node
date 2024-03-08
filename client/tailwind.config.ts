import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: ["class"],
    theme: {
        extend: {
            fontFamily: {
                Poppins: ["var(--font-Poppins)"],
                Josefin: ["var(--font-Josefin)"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            keyframes: {
                shake: {
                    "0%": { transform: "translate(1px, 1px) rotate(0deg)" },
                    "10%": { transform: "translate(-1px, -2px) rotate(-1deg)" },
                    "20%": { transform: "translate(-3px, 0px) rotate(1deg)" },
                    "30%": { transform: "translate(3px, 2px) rotate(0deg)" },
                    "40%": { transform: "translate(1px, -1px) rotate(1deg)" },
                    "50%": { transform: "translate(-1px, 2px) rotate(-1deg)" },
                    "60%": { transform: "translate(-3px, 1px) rotate(0deg)" },
                    "70%": { transform: "translate(3px, 1px) rotate(-1deg)" },
                    "80%": { transform: "translate(-1px, -1px) rotate(1deg)" },
                    "90%": { transform: "translate(1px, 2px) rotate(0deg)" },
                    "100%": { transform: "translate(1px, -2px) rotate(-1deg)" },
                },
            },
            animation: {
                shake: "shake 0.25s",
            },
            screens: {
                "1000px": "1000px",
                "1100px": "1100px",
                "1200px": "1200px",
                "1300px": "1300px",
                "1500px": "1500px",
                "800px": "800px",
                "400px": "400px",
            },
        },
    },
    plugins: [],
};
export default config;
