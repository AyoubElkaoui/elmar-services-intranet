// frontend/eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Disable problematic rules for build
    "@next/next/no-img-element": "off",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "prefer-const": "warn",
    "no-console": "off"
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "dist/",
    "build/"
  ]
};

export default eslintConfig;