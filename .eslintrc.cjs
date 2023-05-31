/* eslint-disable no-undef */
module.exports = {
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'eslint-config-prettier',
		'prettier'
	],
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	settings: { react: { version: '18.2' } },
	plugins: ['react-refresh', 'prettier'],
	rules: {
		'react-refresh/only-export-components': 'warn',
		'react/jsx-no-undef': 'warn',
		'react/jsx-uses-react': 'warn',
		'react/jsx-uses-vars': 'off',
		'react/jsx-key': 'off',
		'react/prop-types': 'off',
		'react/no-unknown-property': 'off',
		'react/display-name': 'off',
		'no-unused-vars': 'off',
		'no-useless-escape': 'off',
		'no-undef': 'off',
		// ... any rules you want
		'prettier/prettier': [
			'warn',
			{
				printWidth: 120,
				useTabs: true,
				bracketSameLine: true,
				jsxSingleQuote: true,
				singleQuote: true,
				tabWidth: 3,
				trailingComma: 'none'
			}
		]
	}
};
