const path = require('path');

module.exports = {
	addons: ['@storybook/preset-typescript'],
	webpackFinal: async (config, { configType }) => {
		config.module.rules.push({
			test: /\.scss$/,
			use: [
				'style-loader',
				'css-loader',
				{
					loader: 'sass-loader',
					options: {
						sassOptions: {
							includePaths: [
								path.resolve(__dirname, '..', 'node_modules'),
								path.resolve(
									__dirname,
									'..',
									'..',
									'..',
									'node_modules'
								),
							],
						},
						implementation: require('sass'),
					},
				},
			],
		});

		return config;
	},
};
