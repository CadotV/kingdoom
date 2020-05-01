import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { loaders } from './webpack.loaders';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, './'),
  entry: {
    app: './src/game.ts',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
  target: 'web',
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'],
    }),
    new HtmlWebpackPlugin({
      title: 'KingDoom',
    }),
    new TypedocWebpackPlugin({
      name: 'KingDoom',
      entryPoint: './src/game.ts',
      out: './doc',
      mode: 'modules',
      theme: './typedoc-theme/',
      includeDeclarations: false,
      ignoreCompilerErrors: true,
    }),
  ],
  module: loaders,
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@scenes': path.resolve(__dirname, 'src/scenes'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@controls': path.resolve(__dirname, 'src/controls'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@map': path.resolve(__dirname, 'src/map'),
    },
    extensions: ['.ts', '.js'],
  },
};
