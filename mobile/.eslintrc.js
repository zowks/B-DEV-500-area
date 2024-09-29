// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    env: {
        node: true
    },
    extends: "expo",
    rules: {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["warn", "double"],
        "semi": ["error", "always"],
        "object-curly-spacing": ["warn", "always"]
    },
    overrides: [
        {
            // Test files only
            files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
            extends: ["plugin:testing-library/react"]
        }
    ]
};
