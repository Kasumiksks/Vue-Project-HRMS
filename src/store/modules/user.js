// 引入cookie方法
import { getInfo, login, getStaffInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    // 本地取一下token
    token: getToken() || null,
    userInfo: {}
  },
  mutations: {
    // 更新token
    setToken(state, newToken) {
      state.token = newToken
      // 本地存储token
      setToken(newToken)
    },
    // 清空token
    removeToken(state) {
      state.token = null
      // 删除本地token
      removeToken()
    },

    // 更新用户信息
    updateInfo(state, payload) {
      state.userInfo = payload
    },
    // 清除用户信息
    removeInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 实现登录的函数
    // context 是 store 的实例对象
    async userLogin(context, formData) {
      // 发送请求获取token
      const res = await login(formData)
      // console.log('发送请求成功,获取token')
      // 将res.data --> token 存储到 vuex 中
      context.commit('setToken', res.data)
    },

    // 获取用户信息的函数
    async getUserInfo(context) {
      const res = await getInfo()
      // console.log(res.data)

      // 获取员工的信息
      const staffInfo = await getStaffInfo(res.data.userId)
      // 利用展开运算符, 合并两个对象
      context.commit('updateInfo', { ...res.data, ...staffInfo.data })

      // 返回用户页面的权限列表
      return res.data.roles.menus
    },

    // 退出登录功能
    logout(context) {
      context.commit('removeToken') // 清空token
      context.commit('removeInfo') // 清空用户信息
    }
  }
}

