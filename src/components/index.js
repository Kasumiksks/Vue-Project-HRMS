import PageTools from '@/components/PageTools'
import UploadExcel from './UploadExcel'
import UploadImg from './UploadImg'
import Calendar from '@/views/dashboard/calendar.vue'
import Lang from './Lang'
import ScreenFull from './ScreenFull'

export default {
  install(p) {
    // p接收的是Vue的构造器
    // console.log('install.......', p)
    // console.log('install.......', p === Vue)
    p.component('PageTools', PageTools)
    p.component('UploadExcel', UploadExcel)// 注册导入excel组件
    p.component('UploadImg', UploadImg) // 注册导入上传头像组件
    p.component('Calendar', Calendar) // 注册日历组件
    p.component('Lang', Lang) // 注册多语言切换组件
    p.component('ScreenFull', ScreenFull) // 注册全屏组件
  }
}
