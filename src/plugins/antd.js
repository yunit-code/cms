// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue'
import 'ant-design-vue/lib/breadcrumb/style/css'
import 'ant-design-vue/lib/row/style/css'
import 'ant-design-vue/lib/col/style/css'
import 'ant-design-vue/lib/modal/style/css'
import 'ant-design-vue/lib/input/style/css'
import 'ant-design-vue/lib/button/style/css'
import { Breadcrumb, Row, Col, Modal, Input, Button } from 'ant-design-vue'

/* v1.1.3+ registration methods */
Vue.use(Breadcrumb)
Vue.use(Breadcrumb.Item)
Vue.use(Row)
Vue.use(Col)
Vue.use(Modal)
Vue.use(Input)
Vue.use(Input.TextArea)
Vue.use(Button)
