import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#1E1E1C",
          2: "#262624",
          3: "#2A2A28",
          4: "#323230",
        },
        sage: {
          DEFAULT: "#8B9B7A",
          light: "#A3B192",
          dim: "rgba(139,155,122,0.1)",
          border: "rgba(139,155,122,0.25)",
        },
        fg: {
          DEFAULT: "#E8E6E0",
          2: "#9C9A92",
          3: "#6B6960",
          4: "#4A4940",
        },
        border: {
          DEFAULT: "rgba(232,230,224,0.08)",
          2: "rgba(232,230,224,0.15)",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["DM Sans", "Helvetica Neue", "sans-serif"],
      },
      keyframes: {
        "scroll-line": {
          to: { top: "48px" },
        },
      },
      animation: {
        "scroll-line": "scroll-line 2.2s cubic-bezier(0.25, 0, 0.15, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
