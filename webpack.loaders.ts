import path from 'path';

export const loaders = {
  rules: [
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader'],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader'],
    },
    {
      // set the type to javascript/auto to bypass webpack's built-in json importing
      type: 'javascript/auto',
      test: /\.json$/,
      // include: [path.resolve(__dirname, 'src')],
      // file-loader resolves imports on a file and emits that file to dist/
      loader: 'file-loader',
      // use filename runtimeConfig.json instead of a hashed filename
      // options: {
      //   name: '[path][name].[ext]',
      //   // outputPath: 'static',
      // },
    },
    {
      test: /\.(csv|tsv)$/,
      use: ['csv-loader'],
    },
    {
      test: /\.xml$/,
      use: ['xml-loader'],
    },
    {
      test: /\.mp3$/,
      loader: 'file-loader',
    },
  ],
};
