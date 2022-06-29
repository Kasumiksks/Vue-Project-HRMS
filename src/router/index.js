import Vue from 'vue'
import Router from 'vue-router'
import employees from './modules/employees'
import departments from './modules/departments'
import settings from './modules/settings'
import salarys from './modules/salarys'
import social_securitys from './modules/social_securitys'
import attendances from './modules/attendances'
import approvals from './modules/approvals'
import permissions from './modules/permissions'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 所有的动态路由规则
export const asyncRoutes = [
  employees,
  departments,
  settings,
  permissions,
  salarys,
  social_securitys,
  attendances,
  approvals
]

// 所有的静态路由规则
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  { // 导入Excel文件的路由
    path: '/import',
    component: Layout,
    hidden: true,
    children: [{
      path: '',
      name: 'import',
      component: () => import('@/views/import/index.vue')
    }]

  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes] // 利用展开运算符合并静态和动态路由规则
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
