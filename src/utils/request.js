// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
const service = axios.create({ // 创建一个axios的实例
  baseURL: 'http://ihrm-java.itheima.net',
  timeout: 5000
})
// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // 在发送响应之前做些什么
  // 针对当前项目来说, 这里是错误的响应  data ==> success:false
  console.log(response)
  if (!response.data.success) return Promise.reject(response.data.message)
  return response
}, function(error) {
  return Promise.reject(error) // 对响应错误做些什么
})
export default service // 导出axios实例
