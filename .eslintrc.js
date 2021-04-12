module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    "class-methods-use-this": 0,
    // "import/first": 0 // this and import/order together make it impossible to have a require(), which is necessary for importing classes and functions
    "no-console": 0,
    "no-underscore-dangle": 0,
    "no-unused-vars": 0,
    "import/prefer-default-export": 0,
    "arrow-parens": 0
  }
}
