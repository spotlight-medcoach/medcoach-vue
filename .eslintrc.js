module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    "requireConfigFile": false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'unicorn/escape-case': 'off',
    'no-console': 'off',
    'no-tabs': 0,
    'indent': 'off',
    // 'indent': ['error', 'tab'],
    // 'vue/html-indent': ['error', 'tab'],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off'
  }
}
