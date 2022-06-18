import Layout from '@/layout'

export default { // 审批管理
  path: '/approvals',
  component: Layout,
  // 设置为layout的二级路由
  children: [
    {
      path: '', // 作为默认渲染路由
      name: 'approvals',
      component: () => import('@/views/approvals/approvals.vue'),
      meta: { title: '审批管理', icon: 'approvals' }
    }
  ]
}
