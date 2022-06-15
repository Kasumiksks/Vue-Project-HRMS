import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// 遍历获取指定目录下的指定文件
// const req = require.context('指定获取文件的目录', 是否递归获取, /正则匹配指定的文件/)
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
