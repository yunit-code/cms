import Vue from 'vue'
import SvgIcon from '@/icons/SvgIcon'// svg component
import './font_menu/iconfont.css'
// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
