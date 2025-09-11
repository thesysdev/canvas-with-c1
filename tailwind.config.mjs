/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      xs: [
        "12px",
        {
          lineHeight: "16px",
        },
      ],
      sm: [
        "14px",
        {
          lineHeight: "20px",
        },
      ],
      lg: [
        "18px",
        {
          lineHeight: "24px",
        },
      ],
      xl: [
        "20px",
        {
          lineHeight: "22px",
        },
      ],
      "icon-sm": "14px",
      "icon-md": "16px",
    },
    opacity: {
      0: "0",
      2: "0.02",
      4: "0.04",
      6: "0.06",
      8: "0.08",
      10: "0.1",
      12: "0.12",
      16: "0.16",
      20: "0.2",
      30: "0.3",
      40: "0.4",
      50: "0.5",
      60: "0.6",
      70: "0.7",
      80: "0.8",
      90: "0.9",
      100: "1",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        sm: "4px",
        xs: "2px",
      },
      textColor: {
        primary: "var(--primary-text)",
        secondary: "var(--secondary-text)",
        disabled: "var(--disabled-text)",
        danger: "var(--danger-text)",
        success: "var(--success-text)",
        info: "var(--info-text)",
        link: "var(--link-text)",
      },
      backgroundColor: {
        elevated: "var(--elevated-fill)",
        fill: "var(--background-fill)",
        "brand-el": "var(--brand-el-fill)",
        "brand-el-hover": "var(--brand-el-hover-fill)",
        container: "var(--container-fill)",
        "container-hover": "var(--container-fill-hover)",
        overlay: "var(--overlay-fill)",
        sunk: "var(--sunk-fill)",
        "danger-container": "var(--danger-container-fill)",
        "success-container": "var(--success-container-fill)",
        "clickable-element": "var(--clickable-element-fill)",
      },
      borderColor: {
        default: "var(--border-default)",
        interactiveEl: "var(--border-interactive-el)",
        interactiveElHover: "var(--border-interactive-el-hover)",
        interactiveElSelected: "var(--border-interactive-el-selected)",
        canvasElementSelected: "var(--canvas-element-selected-border)",
      },
      spacing: {
        "3xs": "0.125rem",
        "2xs": "0.25rem",
        xs: "0.375rem",
        s: "0.5rem",
        m: "0.75rem",
        l: "1.125rem",
        xl: "1.5rem",
        "2xl": "2.25rem",
        "3xl": "3rem",
      },
      outlineColor: {
        "canvas-selection": "#3B82F6",
      },
    },
    boxShadow: {
      modal: "0px 4px 4px 0px rgba(0, 0, 0, 0.04)",
      sm: "0 1px 2px 0 rgba(0 0 0 / 0.05)",
      md: "0 5px 12.1px 0 rgba(0 0 0 / 0.06), 0 1px 4.5px 0 rgba(0 0 0 / 0.08)",
      lg: "0 2px 4px -1px rgba(0 0 0 / 0.06), 0 4px 6px -1px rgba(0 0 0 / 0.1)",
      xl: "0 4px 6px -2px rgba(0 0 0 / 0.05), 0 10px 15px -3px rgba(0 0 0 / 0.1)",
      "2xl":
        "0 10px 10px -5px rgba(0 0 0 / 0.04), 0 20px 25px -5px rgba(0 0 0 / 0.1)",
      "3xl": "0 25px 50px -12px rgba(0 0 0 / 0.25)",
      none: "0 0 #0000",
    },
  },
  plugins: [],
};

export default config;
