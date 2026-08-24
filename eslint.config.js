import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist/**', 'dist', '.next/**', '.next', 'out/**', 'node_modules/**', 'src/old_pages/**', 'src/App.jsx', 'src/main.jsx']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-hooks/purity': ['warn'],
      'react-hooks/set-state-in-effect': ['warn'],
      'react-hooks/preserve-manual-memoization': ['off'],
      'react-hooks/exhaustive-deps': ['warn'],
    },
  },
])
