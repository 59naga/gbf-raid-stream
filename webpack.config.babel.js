import webpack from 'webpack'
import { version } from './package'
import VueLoaderPlugin from 'vue-loader/lib/plugin'

export default {
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    contentBase: 'dist'
  },
  resolve: {
    alias: {
      // https://qiita.com/magaya0403/items/3fbe9aa20c6a66b76662
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version)
    })
  ]
}
