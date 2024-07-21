const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // File extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match .ts and .tsx files
        use: 'ts-loader', // Use ts-loader for TypeScript files
        exclude: /node_modules/, // Exclude node_modules directory
      },
      {
        test: /\.css$/, // Match .css files
        use: ['style-loader', 'css-loader'], // Use style-loader and css-loader for CSS files
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template HTML file
    }),
  ],
  devServer: {
    static: {
        contentBase: path.join(__dirname, 'dist'), // Serve content from the output directory
    },
    compress: true, // Enable gzip compression
    port: 3000, // Port for the development server
    historyApiFallback: true, // Serve index.html for all 404 routes (for React Router)
  },
  mode: 'development', // Set the mode to development
};
