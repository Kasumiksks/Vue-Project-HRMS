import Layout from '@/layout'

export default { // 员工管理
  path: '/employees',
  component: Layout,
  // 设置为layout的二级路由
  children: [
    {
      path: '', // 作为默认渲染路由
      name: 'employees',
      component: () => import('@/views/employees/employees.vue'),
      meta: { title: '员工管理', icon: 'employees' }
    }
  ]
}
