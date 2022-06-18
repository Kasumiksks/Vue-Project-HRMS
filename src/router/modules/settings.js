import Layout from '@/layout'

export default { // 公司设置
  path: '/settings',
  component: Layout,
  // 设置为layout的二级路由
  children: [
    {
      path: '', // 作为默认渲染路由
      name: 'settings',
      component: () => import('@/views/settings/settings.vue'),
      meta: { title: '公司设置', icon: 'settings' }
    }
  ]
}
