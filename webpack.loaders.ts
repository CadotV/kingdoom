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
