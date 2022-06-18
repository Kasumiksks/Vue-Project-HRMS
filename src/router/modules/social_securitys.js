import Layout from '@/layout'

export default { // 社保管理
  path: '/social_securitys',
  component: Layout,
  // 设置为layout的二级路由
  children: [
    {
      path: '', // 作为默认渲染路由
      name: 'social_securitys',
      component: () => import('@/views/social_securitys/social_securitys.vue'),
      meta: { title: '社保管理', icon: 'social_securitys' }
    }
  ]
}
