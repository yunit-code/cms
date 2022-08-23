<template>
    <el-submenu v-if="menu_data.children && menu_data.children.length" :index="menu_data.key" :key="menu_data.key" :popper-append-to-body="false">
        <template slot="title"><span class="menu_text">{{ menu_data.name }}</span></template>
        <MenuNavItem v-for="(item,index) in menu_data.children" :key="index" :menu_data="item"></MenuNavItem>
    </el-submenu>
    <el-menu-item v-else :index="menu_data.key"><span class="menu_text">{{ menu_data.name }}</span></el-menu-item>
</template>

<script>
import { Submenu, MenuItem } from 'element-ui'
export default {
    name: 'MenuNavItem',
    props: [ 'menu_data' ],
    data() {
        return {

        }
    },
    components: {
        [Submenu.name]: Submenu,
        [MenuItem.name]: MenuItem
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style lang="scss">
.el-icon-arrow-right,.el-icon-arrow-left{
    position: absolute !important;
}
</style>