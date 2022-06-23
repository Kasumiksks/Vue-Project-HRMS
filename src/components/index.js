import PageTools from '@/components/PageTools'

export default {
  install(p) {
    // p接收的是Vue的构造器
    // console.log('install.......', p)
    // console.log('install.......', p === Vue)
    p.component('PageTools', PageTools)
  }
}
