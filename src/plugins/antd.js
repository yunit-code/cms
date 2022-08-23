// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue';
import 'ant-design-vue/lib/breadcrumb/style/css';
import 'ant-design-vue/lib/row/style/css';
import 'ant-design-vue/lib/col/style/css';
import {
    Breadcrumb,
    Row,
    Col
} from 'ant-design-vue';

/* v1.1.3+ registration methods */
Vue.use(Breadcrumb);
Vue.use(Breadcrumb.Item);
Vue.use(Row);
Vue.use(Col);