<template>
    <el-submenu v-if="menu_data.children && menu_data.children.length" :index="menu_data.id" :popper-append-to-body="false">
        <template slot="title">
            <i v-if="prop_data && prop_data.showIcon && menu_data.iconImgUrl" class="iconfont" :class="'icon-cms' + menu_data.iconImgUrl"></i>
            <span class="menu_text">{{ getMenuName }}</span>
            <span class="triangle"></span>
        </template>
        <MenuNavItem v-for="(item,index) in menu_data.children" :key="index" :menu_data="item" :prop_data="prop_data"></MenuNavItem>
    </el-submenu>
    <el-menu-item v-else :index="menu_data.id">
        <i v-if="prop_data && prop_data.showIcon && menu_data.iconImgUrl" class="iconfont" :class="'icon-cms' + menu_data.iconImgUrl"></i>
        <span class="menu_text">{{ getMenuName }}</span>
        <span class="triangle"></span>
    </el-menu-item>
</template>

<script>
import { Submenu, MenuItem } from 'element-ui'
export default {
    name: 'MenuNavItem',
    props: [ 'menu_data','prop_data' ],
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
    computed: {
        getMenuName() {
            if ( this.prop_data && this.prop_data.useShortName ) {
                return this.menu_data[this.prop_data.dataFiledShortTitle ? this.prop_data.dataFiledShortTitle : 'shortTitle']
            } else if ( this.prop_data ) {
                return this.menu_data[this.prop_data.dataFiledTitle ? this.prop_data.dataFiledTitle : 'title']
            } else {
                return '菜单'
            }
        }
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