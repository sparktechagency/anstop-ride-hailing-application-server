import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		ignores: ["node_modules", "dist"],
		languageOptions: { 
			globals: { ...globals.browser, ...globals.node } 
		},
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.{ts,mts,cts}"],
		rules: {
			// Type safety
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/explicit-function-return-type": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],

			// Style & consistency
			semi: ["error", "always"],
			"comma-dangle": ["error", "always-multiline"],
			"no-multiple-empty-lines": ["error", { max: 1 }],
			"object-curly-spacing": ["error", "always"],
			"arrow-spacing": ["error", { before: true, after: true }],
			"space-before-function-paren": ["error", "never"],

			// Clean code
			"no-console": "warn",
			"no-debugger": "error",
			eqeqeq: ["error", "always"],
			curly: "error",
			"no-var": "error",
			"prefer-const": "error",

			// TS-specific
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/explicit-module-boundary-types": "warn",
			"@typescript-eslint/no-import-type-side-effects": "error",
			"@typescript-eslint/no-useless-empty-export": "error",
		},
	},
	{
		files: ["**/index.d.ts"],
		rules: {
			"@typescript-eslint/consistent-type-definitions": "off",
		},
	},
	prettier,
];