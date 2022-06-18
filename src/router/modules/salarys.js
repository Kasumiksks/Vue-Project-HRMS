import Layout from '@/layout'

export default { // 工资管理
  path: '/salarys',
  component: Layout,
  // 设置为layout的二级路由
  children: [
    {
      path: '', // 作为默认渲染路由
      name: 'salarys',
      component: () => import('@/views/salarys/salarys.vue'),
      meta: { title: '工资管理', icon: 'salarys' }
    }
  ]
}
