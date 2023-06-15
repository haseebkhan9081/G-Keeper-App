const path = require('path');

module.exports = {
    mode: 'development',
  entry: '../src/index.js',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devServer: {
    contentBase: './public', // Directory to serve static files from
    port: 3000, // Port to run the dev server on
    hot: true, // Enable Hot Module Replacement (HMR)
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
  
};
