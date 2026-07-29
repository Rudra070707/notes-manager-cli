import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      'coverage/**',
      'node_modules/**',
      'backups/**',
      'archive/**',
      '*.db',
      '*.sqlite',
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',

      globals: {
        ...globals.node,
      },
    },

    rules: {
      eqeqeq: 'error',

      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      semi: ['error', 'always'],

      'no-trailing-spaces': 'error',

      'eol-last': ['error', 'always'],

      'no-debugger': 'error',
    },
  },

  {
    files: ['tests/**/*.js'],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]);
