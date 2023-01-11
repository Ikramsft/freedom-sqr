const aliasPlugin = [
  [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: ['./src/'],
      alias: {
        components: './src/components',
        theme: './src/theme',
        navigation: './src/navigation',
        api: './src/api',
        utils: './src/utils',
      },
    },
  ],
];

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    development: {
      plugins: [...aliasPlugin, 'react-native-reanimated/plugin'],
    },
    production: {
      plugins: [
        ...aliasPlugin,
        ['babel-plugin-jsx-remove-data-test-id', {attributes: ['testID']}],
        'transform-remove-console',
        'react-native-reanimated/plugin',
      ],
    },
  },
};
