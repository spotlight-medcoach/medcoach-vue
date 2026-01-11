module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
  // add your custom rules here
  rules: {
    'unicorn/escape-case': 'off',
    'no-console': 'off',
    'no-tabs': 0,
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', 'always'],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'arrow-parens': ['error', 'always'],
  },
};
