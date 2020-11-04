module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'consistent-return': 0,
    'object-curly-newline': 0,
    'no-console': 0,
    'no-unused-vars': 1,
  },
  overrides: [
    {
      files: '*.spec.*',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
