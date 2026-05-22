module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.turbo/', '.next/', '.vercel/', 'coverage/', 'apps/*/build', 'apps/*/dist', 'packages/*/dist'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
