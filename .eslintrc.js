module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:vue/vue3-recommended", "eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
  plugins: ["vue", "@typescript-eslint", "prettier"],
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        "max-len": "off", // disables line length check
        "vue/max-attributes-per-line": "off",
        "vue/max-len": "off",
      },
    },
  ],
};
