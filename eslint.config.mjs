import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prettier/prettier": "error",
      "linebreak-style": "off",
      eqeqeq: "error",
      "object-shorthand": "error",
      "consistent-return": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "separate-type-imports", prefer: "type-imports" },
      ],
      // --- Built-in ---

      // Disabled in favor of @typescript-eslint/no-unused-vars
      "no-unused-vars": "off",
      // Disabled in favor of @typescript-eslint/no-use-before-define
      "no-use-before-define": "off",
      // Disabled in favor of @typescript-eslint/no-throw-literal
      "no-throw-literal": "off",
      "no-debugger": "error",
      // Disabled in favor of @typescript-eslint/no-restricted-imports
      "no-restricted-imports": "off",
      // Disabled in favor of @typescript-eslint/no-loop-func
      "no-loop-func": "off",

      // --- Typescript ESLint ---

      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        { selector: "property", filter: "^__html$", format: null },
      ],
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-misused-promises": [
        2,
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowAny: false,
          allowArray: false,
          allowBoolean: true,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
      "@typescript-eslint/method-signature-style": ["error", "property"],
      "@typescript-eslint/sort-type-constituents": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/prefer-regexp-exec": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-find": "error",
      "@typescript-eslint/prefer-enum-initializers": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-unsafe-unary-minus": "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["fp-ts/lib/*"],
              message: "Import form 'fp-ts/*' directly instead.",
            },
          ],
        },
      ],
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/member-ordering": [
        "error",
        {
          default: { optionalityOrder: "required-first", order: "as-written" },
          classes: { optionalityOrder: "required-first", order: "as-written" },
          classExpressions: {
            optionalityOrder: "required-first",
            order: "as-written",
          },
          interfaces: {
            optionalityOrder: "required-first",
            order: "as-written",
          },
          typeLiterals: {
            optionalityOrder: "required-first",
            order: "as-written",
          },
        },
      ],
      // --- Imports ---

      // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
      "import/prefer-default-export": "off",
      "import/prefer-named-export": "off",
      "import/no-default-export": "off",
    },
  },
];
