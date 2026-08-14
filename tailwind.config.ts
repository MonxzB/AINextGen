import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { ink: "#f4f7ff", brand: { 50: "#111b35", 100: "#17284c", 500: "#7c5cff", 600: "#6847f5", 700: "#9a85ff" } }, boxShadow: { soft: "0 20px 70px rgba(0,0,0,.35)" } } }, plugins: [] } satisfies Config;
