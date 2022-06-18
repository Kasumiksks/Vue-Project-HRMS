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
      console.log('发送请求成功,获取token')
      // 将res.data --> token 存储到 vuex 中
      context.commit('setToken', res.data)
    },

    // 获取用户信息的函数
    async getUserInfo(context) {
      const res = await getInfo()
      console.log(res.data)

      // 获取员工的信息
      const staffInfo = await getStaffInfo(res.data.userId)
      // 利用展开运算符, 合并两个对象
      context.commit('updateInfo', { ...res.data, ...staffInfo.data })
    },

    // 退出登录功能
    logout(context) {
      context.commit('removeToken') // 清空token
      context.commit('removeInfo') // 清空用户信息
    }
  }
}
// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

