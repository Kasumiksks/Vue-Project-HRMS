import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入语言包
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control(路由守卫)

// // 全局导入公共组件
// import PageTools from '@/components/PageTools'
// // //方法一: 注册组件
// // Vue.component('PageTools', PageTools)

// // 方法二: obj就是插件
// const obj = {
//   install(p) {
//     // p接收的是Vue的构造器
//     console.log('install.......', p)
//     console.log('install.......', p === Vue)
//     p.component('PageTools', PageTools)
//   }
// }

// 方法三: 注册自己的组件
import myUI from '@/components/index'
Vue.use(myUI)

/* mock相关
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
} */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
