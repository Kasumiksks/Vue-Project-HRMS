import Layout from '@/layout'

export default { // 员工管理
  path: '/employees', // 路径
  component: Layout, // 组件
  // 设置为layout的二级路由
  children: [
    {
      path: '', // 这里当二级路由的path什么都不写的时候 表示当前路由为默认路由直接渲染对应组件
      name: 'employees', // 给路由规则加一个name
      component: () => import('@/views/employees/employees.vue'),
      // 路由元信息 , 其实就是存储数据的对象, 我们可以在这里放置一些信息
      meta: { title: '员工管理', icon: 'employees' }
    },
    { // 查看员工详情子路由
      path: 'detail',
      // 打包之后的名字:employee
      component: () => import(/* webpackChunkName:"employee"*/ '@/views/employees/detail'),
      name: 'employeesDetail',
      hidden: true
    }
  ]
}
