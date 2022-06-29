import router, { asyncRoutes } from './router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条css
import getPageTitle from '@//utils/get-page-title'

router.beforeEach(async(to, from, next) => {
  NProgress.start() // 进度条开始
  // console.log(`从${from.path}跳到${to.path}`)
  const token = store.state.user.token
  const whiteList = ['/login', '/404'] // 白名单

  document.title = getPageTitle(to.meta.title)

  // 如果登录
  if (token) {
    if (to.path === '/login') {
      Message.info('您已登录,跳转到首页')
      next('/')
      NProgress.done() // 进度条结束
    } else {
      if (!store.getters.userId) { // 如果没有userId, 才需要重新请求用户信息
        const menuList = await store.dispatch('user/getUserInfo')
        console.log(menuList)

        // 根据获得的用户信息里的权限实现动态路由
        // 动态添加所有的动态路由
        console.log(asyncRoutes)
        // 根据用户的信息实现过滤,拿到过滤之后的结果
        const filterRouters = asyncRoutes.filter(item => {
          const routeName = item.children[0].name
          return menuList.includes(routeName)
        })

        // 动态处理404路由,让它位于动态路由之后
        filterRouters.push({ path: '*', redirect: '/404', hidden: 'true' })

        router.addRoutes(filterRouters)
        // 将路由列表存储到vuex中实现左侧边栏菜单渲染
        store.commit('menu/setMenuList', filterRouters)

        // 路由守卫是异步的,动态添加路由会产生一个bug, 包括vuex中数据的渲染,没有完成就直接跳转页面了
        // 解决刷新出现的白屏bug
        next({
          ...to, // next({ ...to })的目的,是保证路由添加完了再进入页面 (可以理解为重进一次)
          replace: true // 重进一次, 不保留重复历史
        })
      }
      next()
    }
  } else { // 没有登录
    // 判断是否白名单
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

// 页面跳转完成的钩子函数
router.afterEach(() => {
  NProgress.done()
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
