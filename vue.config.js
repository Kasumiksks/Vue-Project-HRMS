'use strict'
// 打包时的配置文件

const path = require('path') // 导入path模块
const defaultSettings = require('./src/settings.js') // 加载配置文件

function resolve(dir) {
  return path.join(__dirname, dir) // 将传入的路径变成绝对路径
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = { // vue-cli 脚手架相关配置
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  /*  publicPath: 设置打包后的静态资源目录可以访问的方式
    1. '/': 以服务器的方式才能打开里面的静态文件
    2. './': 可以使用相对路径的方式访问里面的静态文件
   */
  // 设置静态资源的加载模式, '/'为服务器根路径, './'为相对index.html路径
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
  outputDir: 'dist', // 打包输出目录
  assetsDir: 'static', // 静态资源的输出目录  静态资源(js,css,img,fonts)的(相对于outputDir)的目录
  lintOnSave: process.env.NODE_ENV === 'development', // 是否eslint检查
  productionSourceMap: false, // 关闭map文件
  devServer: {
    port: port,
    open: true,
    overlay: { // eslint检查代码出错或者警告登录是否在浏览器显示
      warnings: false,
      errors: true
    },
    // 代理设置
    proxy: {
      // 如果请求地址以/api打头,就触发代理机制
      '/api': {
        target: 'http://60.205.245.110:3000' // 代理的真实接口地址
        // target: 'http://ihrm-java.itheima.net'
      }
    }
    /*     // 在启动服务之前加载mock服务
    before: require('./mock/mock-server.js') */
  },
  configureWebpack: { // webpack{对象配置}
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) { // webpack{函数配置}
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
