import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        }
    },
    {
        files: ["src/lib/components/ui/**/*.svelte"],
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^\\$\\$(Props|Events|Slots|Generic)$"
                }
            ]
        }
    },
    {
        ignores: ["build/", ".svelte-kit/", "dist/"]
    },
    {
        rules: {
            "indent": ["error", 4],
            "linebreak-style": ["error", "unix"],
            "quotes": ["warn", "double"],
            "semi": ["error", "always"],
            "object-curly-spacing": ["warn", "always"]
        }
    }
];
