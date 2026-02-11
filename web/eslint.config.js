import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] }, // Don't lint build folder
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'], // Apply these rules to TS/TSX files
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],      
      // Add custom "Show off" rules here
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage 'any'
      '@typescript-eslint/no-unused-vars': ['error'], // Keep code clean
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // Does this file contain <div> fragments? YES -> .tsx NO -> .ts
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.tsx'] }
      ],
    },
    settings: {
      react: { version: 'detect' }, // Automatically detect React version
    },
  },
);