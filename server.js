/* eslint-disable */
const express = require('express');
const webpack = require('webpack');

const webpackConfig = require('./webpack/webpack.dev.config.js');

const config = require('./config');

const compiler = webpack(webpackConfig);

let app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  hot: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use((req, res) => {
  res.status(200)
    .sendFile(__dirname + '/index.html')
});

app.listen(config.localPort, () => {
  console.info(`==> Open up http://${ config.localIp }:${ config.localPort }/ in your browser.`)
});
