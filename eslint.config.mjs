// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint"; // Import if using TypeScript

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  ...tseslint.configs.recommended, // Example: for recommended TypeScript rules and parser
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Apply to relevant files
    languageOptions: {
      parser: tseslint.parser, // Explicitly use the TypeScript parser
      parserOptions: {
        project: "./tsconfig.json", // Point to your tsconfig
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {},
  },
];

export default eslintConfig;
