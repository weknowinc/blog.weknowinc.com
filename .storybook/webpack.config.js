const path = require("path");
const context = path.resolve(__dirname, "../src");
const configPostCss = path.resolve(__dirname, "../");
const getLocalIdent = require('css-loader/lib/getLocalIdent');

module.exports = {
  context,
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(s(a|c)ss)$/,
        loaders: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              minimize: true,
              importLoaders: 1,
              modules: true,
              sourceMap: true,
              localIdentName: "[local]",
              getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                const fileName = path.basename(loaderContext.resourcePath);
                return (fileName.indexOf('nucleon.scss') !== -1) ?
                  localName :
                  getLocalIdent(loaderContext, localIdentName, localName, options);
              }
            }
          },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: configPostCss
              }
            }
          },
          {
            loader: "sass-loader",
            options:{
              sourceMap: false,
              outputStyle: 'compressed',
              sourceMapEmbed: false
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              // Provide path to the file with resources
              resources: path.resolve(__dirname, '../src/nucleon/protons.scss')
            },
          },
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          plugins: [
            [
              "react-css-modules",
              {
                context,
                generateScopedName: "[local]",
                filetypes: {
                  ".scss": {
                    "syntax": "postcss-scss"
                  }
                }
              },
            ]
          ]
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        include: configPostCss,
        use: 'url-loader'
      },
    ]
  },
};
