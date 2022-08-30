// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue';
import 'ant-design-vue/lib/button/style/css';
import 'ant-design-vue/lib/tabs/style/css';
import 'ant-design-vue/lib/input/style/css';
import 'ant-design-vue/lib/spin/style/css';
import 'ant-design-vue/lib/empty/style/css';
import 'ant-design-vue/lib/icon/style/css';
import {
  Button,
  Tabs,
  Input,
  Spin,
  Empty,
  Icon
} from 'ant-design-vue';

/* v1.1.3+ registration methods */
 Vue.use(Button);
 Vue.use(Tabs);
 Vue.use(Input);
 Vue.use(Spin);
 Vue.use(Empty);
 Vue.use(Icon);
