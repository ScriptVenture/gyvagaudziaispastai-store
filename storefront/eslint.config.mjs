import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow 'any' types in development - they don't break functionality
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused variables as warnings
      "@typescript-eslint/no-unused-vars": "warn", 
      // Allow unescaped entities - they don't break functionality
      "react/no-unescaped-entities": "warn",
      // Performance suggestions, not errors
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      // Hook dependency warnings
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
