// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    env: {
        node: true
    },
    extends: "expo",
    rules: {
        "indent": ["error", 4],
        "linebreak-style": "off",
        "quotes": ["warn", "double"],
        "semi": ["error", "always"],
        "object-curly-spacing": ["warn", "always"],
        "no-restricted-imports": [
            "error",
            {
                "name": "react-use",
                "message": "Please import the specific function from react-use instead of the whole library (e.g. `import useMount from \"react-use/lib/useMount\"`)"
            }
        ]
    },
    overrides: [
        {
            // Test files only
            files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
            extends: ["plugin:testing-library/react"]
        }
    ]
};
