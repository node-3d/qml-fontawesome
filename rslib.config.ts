import { defineConfig } from '@rslib/core';

export default defineConfig({
	lib: [
		{
			format: 'esm',
			bundle: false,
			autoExtension: false,
			syntax: 'es2024',
			dts: {
				tsgo: true,
			},
			outBase: './ts',
			source: {
				entry: {
					index: ['./ts/**/*.ts'],
				},
				tsconfigPath: './tsconfig.json',
			},
			output: {
				target: 'node',
				distPath: {
					root: './dist',
				},
			},
		},
	],
});
