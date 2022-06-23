// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
const service = axios.create({ // 创建一个axios的实例
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 添加请求拦截器
service.interceptors.request.use(function(config) {
// 在发送请求之前做些什么
  const token = store.state.user.token
  // 如果当前有token, 就加在请求头上
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function(error) {
  return Promise.reject(error) // 对请求错误做些什么
})
// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // 在发送响应之前做些什么
  // 针对当前项目来说, 这里是错误的响应  data ==> success:false
  // console.log(response)

  // success = false 手动抛出一个错误 ,返回给浏览器
  if (!response.data.success) return Promise.reject(response.data.message)

  // success = true 正常的业务请求, 对数据解包, 去掉data
  return response.data
},
function(error) {
  // 10002: 后端约定的token失效状态码
  if (error.response.data.code === 10002) {
    // token失效, 跳转到登录页 ,清空token和用户信息
    store.dispatch('user/logout')
    // router.currentRoute: 在js文件中获取当前的组件对象
    router.push('/login/return_url=' + encodeURIComponent(router.currentRoute.fullPath))
  }
  return Promise.reject(error) // 对响应错误做些什么
})
export default service // 导出axios实例

