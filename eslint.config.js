// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintPluginSimpleImportSort = require('eslint-plugin-simple-import-sort');
const eslintPluginImport = require('eslint-plugin-import');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    ignores: ['**/dist', '**/public'],
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
      import: eslintPluginImport,
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
        {
          selector: 'property',
          format: null,
          filter: {
            regex: '^(host)$',
            match: false,
          },
        },
      ],
      complexity: 'error',
      'max-len': ['error', { code: 140 }],
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'sort-imports': 'off',
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/first': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000'], ['^@?(?!amz)\\w'], ['^@amz?\\w'], ['^\\w'], ['^[^.]'], ['^\\.']],
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-invalid-this': 'off',
      '@typescript-eslint/no-invalid-this': ['warn'],
      '@angular-eslint/no-host-metadata-property': 'off',
      'no-extra-semi': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
  eslintConfigPrettier,
);
