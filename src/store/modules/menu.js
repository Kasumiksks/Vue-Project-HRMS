import { constantRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    // 存储menulist路由列表, 静态路由作为初始值
    menuList: [...constantRoutes]
  },
  mutations: {
    // 添加动态的路由
    setMenuList(state, asyncRoutes) {
      // 存储了静态和动态的路由
      state.menuList = [...constantRoutes, ...asyncRoutes]
    }
  }
}
