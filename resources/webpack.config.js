const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const PlonePlugin = require('plonetheme-webpack-plugin');

const SITENAME = process.env.SITENAME || 'Plone';
const THEMENAME = process.env.THEMENAME || 'reclastheme';
const PUBLICPATH = process.env.PUBLICPATH || '/' + SITENAME + '/++theme++' + THEMENAME + '/';

const PATHS = {
  src: path.join(__dirname, 'src', THEMENAME),
  build: path.join(__dirname, 'theme', THEMENAME),
  mosaic: path.join(
    __dirname, 'node_modules', 'plone-mosaic',
    'src', 'plone', 'app', 'mosaic', 'browser', 'static', 'js')
};

const PLONE = new PlonePlugin({
  portalUrl: 'http://localhost:8080/' + SITENAME,
  publicPath: PUBLICPATH,
  sourcePath: PATHS.src,
  momentLocales: ['fi'],
  ignore: [
    path.join(THEMENAME, 'icons', '*'),
    path.join(THEMENAME, 'designs', '**', '*'),
    path.join(THEMENAME, 'fragments', '**', '*'),
    path.join(THEMENAME, '?(*.js|*.jsx|*.css|*.less|*.scss)')
  ],
  debug: false
});

const common = {
  entry: {
   'default': path.join(PATHS.src, 'default'),
   'logged-in': path.join(PATHS.src, 'logged-in')
  },
  output: {
    path: PATHS.build
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'mosaic': path.join(PATHS.mosaic, 'mosaic.pattern'),
      'mosaic-url': path.join(PATHS.mosaic)
    }
  },
  module: {
    exprContextCritical: false,  // structure pattern has dynamic requires
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: { cacheDirectory: true }
          }
        ],
        include: PATHS.src
      }
    ]
  }
};

switch(path.basename(process.argv[1])) {
  case 'webpack':
    module.exports = merge(PLONE.production, common);
    break;

  case 'webpack-dev-server':
    module.exports = merge(PLONE.development, common, {
      entry: [
        path.join(PATHS.src, 'default'),
        path.join(PATHS.src, 'logged-in')
      ]
    });
    break;
}
