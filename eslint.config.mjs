// eslint.config.mjs (Revised, more robust approach)
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint"; // Correct import style

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Use FlatCompat for legacy configs
  ...compat.extends("next/core-web-vitals"),

  // Configuration for TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    ...tseslint.configs.recommendedTypeChecked[0], // Use type-checked recommended for better linting
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json", // Ensure this path is correct
        tsconfigRootDir: __dirname, // Important for FlatCompat with tsconfig
      },
    },
    rules: {
      // Add/override TypeScript-specific rules here
    },
  },
  // Optional: Configuration for JavaScript files if you have any
  {
    files: ["**/*.{js,jsx}"],
    // You might need a parser for JS files if not covered by next/core-web-vitals
    // For example, if you use Babel:
    // languageOptions: {
    //   parser: compat.plugins['@babel/eslint-parser'].parser, // This might not work directly this way
    //   parserOptions: {
    //     ecmaVersion: 2021,
    //     sourceType: 'module',
    //     babelOptions: {
    //       presets: ["@babel/preset-react"],
    //     },
    //   },
    // },
    rules: {
      // Add/override JavaScript-specific rules here
    },
  },
  // General rules that apply to all files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Your custom general rules
    },
  },
];
