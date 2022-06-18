import Layout from '@/layout'

export default { // 组织架构
  path: '/departments',
  component: Layout,
  // 设置为layout的二级路由
  children: [
    {
      path: '', // 作为默认渲染路由
      name: 'departments',
      component: () => import('@/views/departments/departments.vue'),
      meta: { title: '组织架构', icon: 'departments' }
    }
  ]
}
