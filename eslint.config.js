import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import { flatConfigs as importXFlatConfigs, createNodeResolver } from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';
import vitestPlugin from '@vitest/eslint-plugin';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

// eslint-plugin-react and eslint-plugin-jsx-a11y still use the legacy
// (pre-flat-config) plugin API that ESLint 10 removed (context.getFilename,
// context.getSourceCode, ...), so both need @eslint/compat's
// fixupPluginRules to keep working. The package.json "overrides" pin their
// peer eslint range past ESLint 9 for the same reason. Drop both once these
// plugins declare their own ESLint 10 support.
const fixedReactPlugin = fixupPluginRules(react);
const fixedJsxA11yPlugin = fixupPluginRules(jsxA11y);

export default defineConfig([
  globalIgnores(['dist', 'coverage']),

  js.configs.recommended,

  // react.configs.flat.recommended and ['jsx-runtime'] both declare a
  // `react` plugin under the same reference; reuse that ONE fixed plugin
  // object in both configs below, otherwise ESLint throws "Cannot redefine
  // plugin react".
  {
    ...react.configs.flat.recommended,
    plugins: { react: fixedReactPlugin },
  },
  {
    ...react.configs.flat['jsx-runtime'],
    plugins: { react: fixedReactPlugin },
  },
  {
    settings: { react: { version: 'detect' } },
  },

  {
    ...jsxA11y.flatConfigs.recommended,
    plugins: { 'jsx-a11y': fixedJsxA11yPlugin },
  },

  reactHooks.configs.flat.recommended,

  {
    ...importXFlatConfigs.recommended,
    settings: {
      // '.js' stays: vite.config.js and this file are still plain JavaScript.
      'import-x/resolver-next': [createNodeResolver({ extensions: ['.js', '.ts', '.tsx'] })],
      // Lets import-x parse .ts/.tsx modules with the TypeScript parser
      // instead of the default one, which cannot read TS syntax — needed if a
      // plain .js file (e.g. this config or vite.config.js) ever imports one
      // directly. `@typescript-eslint/parser` comes from the
      // `typescript-eslint` dependency, so no separate resolver package is
      // needed.
      'import-x/extensions': ['.js', '.ts', '.tsx'],
      'import-x/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    },
    rules: {
      ...importXFlatConfigs.recommended.rules,
      // styled-components (and this plugin itself) export their default as
      // a same-named export too, purely for CJS/ESM interop; importing the
      // default as `styled` (the whole codebase's idiom) is correct, not a
      // mistake, so this rule is a false positive for that pattern here.
      'import-x/no-named-as-default': 'off',
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/game/domain',
              from: ['./src/game/components', './src/game/hooks', './src/game/infrastructure'],
              message:
                'The domain layer must stay pure: it cannot depend on components, hooks or infrastructure.',
            },
          ],
        },
      ],
    },
  },

  {
    // '.js' stays for vite.config.js and this file; '.jsx' no longer matches
    // anything now that src/ is all TypeScript.
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-param-reassign': ['error', { props: true }],
      'default-param-last': 'error',
      'no-nested-ternary': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'react/require-default-props': [
        'error',
        {
          forbidDefaultForRequired: true,
          functions: 'defaultArguments',
        },
      ],
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: false }],
    },
  },

  // Type-aware linting for TypeScript files only, using the project service
  // (finds each file's tsconfig automatically instead of listing paths).
  // recommendedTypeChecked, not strictTypeChecked: the stricter preset's
  // no-unnecessary-condition would flag this project's intentional runtime
  // guards around untrusted DOM/localStorage values.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript already checks component props at compile time.
      'react/prop-types': 'off',
    },
  },

  // Test files: vitest's own recommended rules and globals replace the old
  // hand-listed test globals, and may import devDependencies freely.
  {
    files: ['**/*.test.{ts,tsx}', 'src/setupTests.ts'],
    plugins: { vitest: vitestPlugin },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
      // Type-level tests assert with expectTypeOf/assertType instead of expect;
      // without this, expect-expect can't see those as real assertions.
      'vitest/expect-expect': [
        'error',
        { assertFunctionNames: ['expect', 'expectTypeOf', 'assertType'] },
      ],
    },
    languageOptions: {
      globals: globals.vitest,
    },
  },

  // Root config files run under Node, not the browser, and may also import
  // devDependencies.
  {
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },

  // Must stay last: turns off every stylistic rule Prettier already owns,
  // so ESLint and Prettier never disagree about formatting.
  eslintConfigPrettier,
]);
