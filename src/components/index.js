import PageTools from '@/components/PageTools'
import UploadExcel from './UploadExcel'

export default {
  install(p) {
    // p接收的是Vue的构造器
    // console.log('install.......', p)
    // console.log('install.......', p === Vue)
    p.component('PageTools', PageTools)
    p.component('UploadExcel', UploadExcel)// 注册导入excel组件
  }
}
