'use strict'
// 打包时的配置文件

const path = require('path') // 导入path模块
const defaultSettings = require('./src/settings.js') // 加载配置文件

function resolve(dir) {
  return path.join(__dirname, dir) // 将传入的路径变成绝对路径
}

const name = defaultSettings.title || 'vue Admin Template' // page title

const port = process.env.port || process.env.npm_config_port || 9528 // dev port

let externals = {}
let cdn = { css: [], js: [] }
const isProduction = process.env.NODE_ENV === 'production' // 判断是否是生产环境
if (isProduction) {
  externals = {
    /**
      * externals 对象属性解析：
      * '包名' : '在项目中引入的名字'
    */
    'vue': 'Vue',
    'element-ui': 'ELEMENT',
    'xlsx': 'XLSX'
  }
  cdn = {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css' // element-ui css 样式表
    ],
    js: [
      // vue must at first!
      'https://unpkg.com/vue@2.6.12/dist/vue.js', // vuejs
      'https://unpkg.com/element-ui/lib/index.js', // element-ui js
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js' // xlsx
    ]
  }
}

module.exports = { // vue-cli 脚手架相关配置
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
        target: 'http://60.205.245.110:3010' // 代理的真实接口地址
        // target: 'http://ihrm-java.itheima.net'
        // target: 'http://192.168.81.102:3000'
      }
    }
  },
  configureWebpack: { // webpack{对象配置}
    name: name,
    externals: externals,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) { // webpack{函数配置}
    // 去掉控制台的console.log()打印信息
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',

        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 注入cdn变量 (打包时会执行)
    config.plugin('html').tap(args => {
      args[0].cdn = cdn // 配置cdn给插件
      return args
    })

    config.plugins.delete('prefetch')

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
                  chunks: 'initial'
                },
                elementUI: {
                  name: 'chunk-elementUI',
                  priority: 20,
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'),
                  minChunks: 3,
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
