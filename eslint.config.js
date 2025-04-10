import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals, { node } from "globals";
import tseslint from "typescript-eslint";
import js from "eslint/js";
import tsParser from "@typescript-eslint/parser";
import { globals } from "eslint-plugin-browser";
import unusedImports from "eslint-plugin-unused-imports";
import airbnbBase from "eslint-config-airbnb-base";
import airbnbTypescript from "eslint-config-airbnb-typescript/base";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "unsed.imports": unusedImports,
    },
    rules: {
      ...airbnbBase.rules,
      ...airbnbTypescript.rules,
      "no-unused-vars": off,
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          coughtErrorsIgnorePattern: "^_",
        },
      ],
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
]);

