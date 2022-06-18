import Layout from '@/layout'

export default { // 权限管理
  path: '/permissions',
  component: Layout,
  // 设置为layout的二级路由
  children: [
    {
      path: '', // 作为默认渲染路由
      name: 'permissions',
      component: () => import('@/views/permissions/permissions.vue'),
      meta: { title: '权限管理', icon: 'permissions' }
    }
  ]
}
