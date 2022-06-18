import Layout from '@/layout'

export default { // 考勤管理
  path: '/attendances',
  component: Layout,
  // 设置为layout的二级路由
  children: [
    {
      path: '', // 作为默认渲染路由
      name: 'attendances',
      component: () => import('@/views/attendances/attendances.vue'),
      meta: { title: '考勤管理', icon: 'attendances' }
    }
  ]
}
