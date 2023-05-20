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
		'prettier/prettier': [
			'warn',
			{
				printWidth: 150,
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
