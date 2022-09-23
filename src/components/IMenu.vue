<template>
    <!-- 根目录规范(必须不能为空)： idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件 id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换 idm-ctrl-id：组件的id，这个必须不能为空 -->
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="IMenu_app">
        <div id="menu_block" class="flex_between IMenu_app_main">
            <div v-if="is_show_move_button && propData.showSwitchButton" @click="toLeftMove" class="next_button next_button_left">
                <SvgIcon icon-class="left"></SvgIcon>
            </div>
            <el-menu id="menu" :default-active="activeIndex2" class="el-menu-demo" :class="getMenuStyleClassName()" mode="horizontal" @select="handleSelect" :menu-trigger="propData.triggerType">
                <MenuNavItem v-for="(item,index) in menu_list" :key="index" :menu_data="item" :prop_data="propData"></MenuNavItem>
            </el-menu>
            <div v-if="is_show_move_button && propData.showSwitchButton" @click="toRightMove" class="next_button next_button_right">
                <SvgIcon icon-class="right"></SvgIcon>
            </div>
        </div>
        
    </div>
</template>

<script>
import MenuNavItem from '../commonComponent/MenuNavItem.vue'
import { Menu,Button } from 'element-ui'
import { menuList } from '../mock/IMenu.js'
import SvgIcon from '../icons/SvgIcon.vue';

export default {
    name: 'IMenu',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                // styleForm: 3,
                // triggerType: 1,
                // showIcon: true
            },
            menu_list: [ ],
            activeIndex2: '',
            left_number: 0,
            every_menu_width: 100,
            is_show_move_button: false,
        }
    },
    components: {
        MenuNavItem,
        [Menu.name]: Menu,
        [Button.name]: Button,
        SvgIcon
    },
    props: { },
    created() {
        this.moduleObject = this.$root.moduleObject;
        this.convertAttrToStyleObject();
        this.reload()
    },
    watch: {
        'propData.selectColumn': {
            handler(value) {
                this.reload()
            },
            deep: true
        },
        'propData.limit': {
            handler(value) {
                this.reload()
            }
        }
    },
    mounted() {
        
    },
    destroyed() { },
    methods: {
        getMoveButtonStatus() {
            if ( (!this.menu_list) || !this.menu_list.length ) {
                this.is_show_move_button = false;
                return 
            }
            let menu_width = document.getElementById('menu').scrollWidth;
            let menu_contain_width = document.getElementById('menu_block').offsetWidth;
            this.every_menu_width = menu_width / this.menu_list.length;
            if ( menu_width > menu_contain_width ) {
                this.is_show_move_button = true;
            } else {
                this.is_show_move_button = false;
            }
        },
        toLeftMove() {
            let menuScrollLeft = document.getElementById('menu').scrollLeft;
            if ( menuScrollLeft > this.every_menu_width ) {
                document.getElementById('menu').scrollLeft -= this.every_menu_width;
            } else {
                document.getElementById('menu').scrollLeft = 0;
            }
        },
        toRightMove() {
            let menuScrollLeft = document.getElementById('menu').scrollLeft;
            if ( menuScrollLeft == 0 ) {
                document.getElementById('menu').scrollLeft = this.every_menu_width;
            } else {
                document.getElementById('menu').scrollLeft += this.every_menu_width;
            }
        },
        translate() {
            this.left_number++;
            let number = 100 * this.left_number;
            console.log(number)
            document.getElementById('menu').scrollLeft = number;
        },
        getMenuStyleClassName() {
            let name = ''
            if ( this.propData.styleForm == '1' ) {
                name = 'menu_button_style'
            } else if ( this.propData.styleForm == '2' ) {
                name = 'menu_line_style'
            } else if ( this.propData.styleForm == '3' ) {
                name = 'menu_line_triangle'
            }
            return name
        },
        getInitDataApi() {
            if( !this.propData.customInterfaceUrl ){
                this.menu_list = menuList;
                this.activeIndex2 = menuList[0].id;
                this.$nextTick(() => {
                    this.getMoveButtonStatus()
                })
                return;
            }
            let urlParam = this.commonParam()
            IDM.http.get(this.propData.customInterfaceUrl,{
                pageId: urlParam.pageId,
                componentId: this.moduleObject.comId,
                columnId: this.propData.selectColumn ? this.propData.selectColumn.id : '0',
                limit: this.propData.limit || ''
            }).then((res) => {
                if (res && res.data && res.data.code == '200' && res.data.data ) {
                    let result = this.propData.dataFiled ? this.getExpressData('resultData',this.propData.dataFiled,res.data.data) : res.data.data.rows;
                    this.menu_list = result || [];
                   
                    let queryData = IDM.url.queryObject();
                    if ( queryData && queryData.menuId ) {
                        this.activeIndex2 = queryData.menuId;
                    } else if ( this.menu_list && this.menu_list.length && this.menu_list[0] && this.menu_list[0].id ) {
                        this.activeIndex2 = this.menu_list[0].id;
                    }
                    this.$nextTick(() => {
                        this.getMoveButtonStatus()
                    })
                }
            })
        },
        handleSelect(index,indexPath) {
            if ( this.moduleObject.env == 'develop' ) {
                return
            }
            let item = this.getSelectedItem(index,this.menu_list)
            if ( item && item.jumpUrl ) {
                window.location.href = item.jumpUrl
            }
        },
        getSelectedItem(id,data) {
            let result = {};
            for( let i = 0,maxi = data.length;i < maxi;i++ ) {
                if ( data[i].id == id ) {
                    result = data[i]
                    return result
                }
                if ( data[i].children && data[i].children.length ) {
                    result = this.getSelectedItem(id,data[i].children)
                }
            }
            return result
        },
        convertThemeListAttrToStyleObject() {
            const themeList = this.propData.themeList;
            if ( (!themeList) || !themeList.length ) {
                return
            }
            const themeNamePrefix = IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : "idm-theme-";
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i];
                
                if(item.key!=IDM.theme.getCurrentThemeInfo()){
                    //此处比对是不渲染输出不用的样式，如果页面会刷新就可以把此处放开
                    continue;
                }
                let fontStyleObject = {
                    "color": item.mainColor ? item.mainColor.hex8 : "",
                }
                let fontStyleObjectButton = {
                    "color": '#fff',
                }
                let borderStyleObject = {
                    'border-color': item.mainColor ? item.mainColor.hex8 : "",
                }
                let backgroundBorderObject = {
                    'color': '#fff',
                    'background-color': item.mainColor ? item.mainColor.hex8 : "",
                    'border-color': item.mainColor ? item.mainColor.hex8 : ""
                }
                let backgroundBorderObjectHover = {
                    'color': '#fff',
                    'background-color': item.minorColor ? item.minorColor.hex8 : "",
                    'border-color': item.minorColor ? item.minorColor.hex8 : "",
                }
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .IHeaderBar_app .search_block .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled)", borderStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .IHeaderBar_app .search_block .ant-input:focus", borderStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .IHeaderBar_app .search_block .ant-input:hover", borderStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .IHeaderBar_app .search_block .ant-input-group-addon", backgroundBorderObject );
            }
        },
        /**
         * 提供父级组件调用的刷新prop数据组件
         */
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            this.convertAttrToStyleObject();
            this.reload()
        },
        /**
         * 把属性转换成样式对象
         */
        convertAttrToStyleObjectMenu() {
            var styleObject = {};
            var styleFont = {};
            var styleColor = {};
            var styleObjectIcon = {};
            var styleObjectTriangle = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "heightMenu":
                            styleObject['height'] = element;
                            styleObject['line-height'] = element;
                            break;
                        case "fontMenu":
                            styleFont["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleFont["color"] = element.fontColors.hex8;
                                styleColor["color"] = element.fontColors.hex8;
                            }
                            styleFont["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleFont["font-style"] = element.fontStyle;
                            styleFont["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleFont["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleFont["text-align"] = element.fontTextAlign;
                            styleFont["text-decoration"] = element.fontDecoration;
                            break;
                        case "widthIcon":
                            styleObjectIcon['width'] = element;
                            break;
                        case "heightIcon":
                            styleObjectIcon['height'] = element;
                            break;
                        case "bgColorTriangle":
                            if (element && element.hex8 && this.propData.styleForm == '3') {
                                styleObjectTriangle['border-bottom-color'] = element.hex8;
                            }
                    }
                }
            }
            
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-item .menu_text,.el-submenu__title i', styleColor);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-submenu:focus .el-submenu__title .menu_text', styleFont);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-item .menu_text,.el-submenu__title .menu_text', styleFont);

            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo>.el-menu-item', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo>.el-submenu>.el-submenu__title', styleObject);

            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo img', styleObjectIcon);

            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo .triangle', styleObjectTriangle);
        },
        convertAttrToStyleObjectMenuButton() {
            var styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "fontSizeSwitchButton":
                            styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
                            break;
                        case "fontColorSwitchButton":
                            if (element && element.hex8) {
                                styleObject["color"] = element.hex8 + ' !important';
                            }
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .next_button .svg-icon', styleObject);
        },
        convertAttrToStyleObjectMenuHover() {
            var styleBg = {};
            var styleFont = {};
            var styleFontIcon = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "fontHover":
                            styleFont["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleFont["color"] = element.fontColors.hex8 + ' !important';
                                styleFontIcon["color"] = element.fontColors.hex8;
                            }
                            styleFont["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleFont["font-style"] = element.fontStyle;
                            styleFont["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleFont["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleFont["text-align"] = element.fontTextAlign;
                            styleFont["text-decoration"] = element.fontDecoration;
                            break;
                        case "bgColorHover":
                            if (element && element.hex8 && this.propData.styleForm == '1') {
                                styleBg["background-color"] = element.hex8 + ' !important';
                            }
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo .el-menu-item:hover,.el-submenu>.el-submenu__title:hover', styleBg);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo .el-menu-item:hover .menu_text,.el-submenu>.el-submenu__title:hover .menu_text', styleFont);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo .el-submenu>.el-submenu__title:hover>i', styleFontIcon);
        },
        convertAttrToStyleObjectMenuActive() {
            var styleBg = {};
            var styleFont = {};
            var styleFontIcon = {};
            var styleBorder = {};
            
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "fontActive":
                            styleFont["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleFont["color"] = element.fontColors.hex8 + ' !important';
                                styleFontIcon["color"] = element.fontColors.hex8;
                                styleBorder['border-bottom'] = '2px solid ' + element.fontColors.hex8;
                            }
                            styleFont["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleFont["font-style"] = element.fontStyle;
                            styleFont["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleFont["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleFont["text-align"] = element.fontTextAlign;
                            styleFont["text-decoration"] = element.fontDecoration;
                            break;
                        case "bgColorActive":
                            if (element && element.hex8 && this.propData.styleForm == '1') {
                                styleBg["background-color"] = element.hex8 + ' !important';
                            }
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo .el-menu-item.is-active,.el-submenu.is-active>.el-submenu__title', styleBg);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo .el-menu-item.is-active .menu_text,.el-submenu.is-active>.el-submenu__title .menu_text', styleFont);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu-demo .el-submenu.is-active>.el-submenu__title>i', styleFontIcon);
            if ( this.propData.styleForm == '2' ) {
                window.IDM.setStyleToPageHead(this.moduleObject.id + ' .menu_line_style>.el-menu-item.is-active', styleBorder);
                window.IDM.setStyleToPageHead(this.moduleObject.id + ' .menu_line_style>.el-submenu.is-active .el-submenu__title', styleBorder);
            }
        },
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectMenu()
            this.convertAttrToStyleObjectMenuHover()
            this.convertAttrToStyleObjectMenuActive()
            this.convertThemeListAttrToStyleObject()
            this.convertAttrToStyleObjectMenuButton()
            var styleObject = {};
            var styleObjectMenuPop = {};
            if (this.propData.bgSize && this.propData.bgSize == "custom") {
                styleObject["background-size"] = (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") + " " + (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto")
            } else if (this.propData.bgSize) {
                styleObject["background-size"] = this.propData.bgSize;
            }
            if (this.propData.positionX && this.propData.positionX.inputVal) {
                styleObject["background-position-x"] = this.propData.positionX.inputVal + this.propData.positionX.selectVal;
            }
            if (this.propData.positionY && this.propData.positionY.inputVal) {
                styleObject["background-position-y"] = this.propData.positionY.inputVal + this.propData.positionY.selectVal;
            }
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "width":
                        case "height":
                            styleObject[key] = element;
                            break;
                        case "bgColor":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                                styleObjectMenuPop["background-color"] = element.hex8;
                            }
                            break;
                        case "box":
                            if (element.marginTopVal) {
                                styleObject["margin-top"] = `${element.marginTopVal}`;
                            }
                            if (element.marginRightVal) {
                                styleObject["margin-right"] = `${element.marginRightVal}`;
                            }
                            if (element.marginBottomVal) {
                                styleObject["margin-bottom"] = `${element.marginBottomVal}`;
                            }
                            if (element.marginLeftVal) {
                                styleObject["margin-left"] = `${element.marginLeftVal}`;
                            }
                            if (element.paddingTopVal) {
                                styleObject["padding-top"] = `${element.paddingTopVal}`;
                            }
                            if (element.paddingRightVal) {
                                styleObject["padding-right"] = `${element.paddingRightVal}`;
                            }
                            if (element.paddingBottomVal) {
                                styleObject["padding-bottom"] = `${element.paddingBottomVal}`;
                            }
                            if (element.paddingLeftVal) {
                                styleObject["padding-left"] = `${element.paddingLeftVal}`;
                            }
                            break;
                        case "bgImgUrl":
                            styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
                            break;
                        case "positionX":
                            //背景横向偏移

                            break;
                        case "positionY":
                            //背景纵向偏移

                            break;
                        case "bgRepeat":
                            //平铺模式
                            styleObject["background-repeat"] = element;
                            break;
                        case "bgAttachment":
                            //背景模式
                            styleObject["background-attachment"] = element;
                            break;
                        case "border":
                            if (element.border.top.width > 0) {
                                styleObject["border-top-width"] = element.border.top.width + element.border.top.widthUnit;
                                styleObject["border-top-style"] = element.border.top.style;
                                if (element.border.top.colors.hex8) {
                                    styleObject["border-top-color"] = element.border.top.colors.hex8;
                                }
                            }
                            if (element.border.right.width > 0) {
                                styleObject["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                                styleObject["border-right-style"] = element.border.right.style;
                                if (element.border.right.colors.hex8) {
                                    styleObject["border-right-color"] = element.border.right.colors.hex8;
                                }
                            }
                            if (element.border.bottom.width > 0) {
                                styleObject["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                                styleObject["border-bottom-style"] = element.border.bottom.style;
                                if (element.border.bottom.colors.hex8) {
                                    styleObject["border-bottom-color"] = element.border.bottom.colors.hex8;
                                }
                            }
                            if (element.border.left.width > 0) {
                                styleObject["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                                styleObject["border-left-style"] = element.border.left.style;
                                if (element.border.left.colors.hex8) {
                                    styleObject["border-left-color"] = element.border.left.colors.hex8;
                                }
                            }

                            styleObject["border-top-left-radius"] = element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
                            styleObject["border-top-right-radius"] = element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
                            styleObject["border-bottom-left-radius"] = element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
                            styleObject["border-bottom-right-radius"] = element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
                            break;
                        
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu--popup', styleObjectMenuPop);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu--popup .el-menu-item', styleObjectMenuPop);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .el-menu--popup .el-submenu__title', styleObjectMenuPop);
        },
        /**
         * 通用的url参数对象
         * 所有地址的url参数转换
         */
        commonParam() {
            let urlObject = IDM.url.queryObject();
            var params = {
                pageId:
                    window.IDM.broadcast && window.IDM.broadcast.pageModule
                        ? window.IDM.broadcast.pageModule.id
                        : "",
                urlData: JSON.stringify(urlObject),
            };
            return params;
        },
        /**
         * 重新加载
         */
        reload() {
            //请求数据源
            this.initData();
        },
        /**
         * 加载动态数据
         */
        initData() {
            let that = this;
            //所有地址的url参数转换
            var params = that.commonParam();
            switch (this.propData.dataSourceType) {
                case "customInterface":
                    this.getInitDataApi()
                    break;
                case "pageCommonInterface":
                    //使用通用接口直接跳过，在setContextValue执行
                    break;
                case "customFunction":
                    if (this.propData.customFunction && this.propData.customFunction.length > 0) {
                        var resValue = "";
                        try {
                            resValue = window[this.propData.customFunction[0].name] && window[this.propData.customFunction[0].name].call(this, { ...params, ...this.propData.customFunction[0].param, moduleObject: this.moduleObject });
                        } catch (error) {

                        }
                        this.menu_list = resValue || [];
                    }
                    break;
                default:
                    this.getInitDataApi()
                    break;
            }
        },
        /**
         * 通用的获取表达式匹配后的结果
         */
        getExpressData(dataName, dataFiled, resultData) {
            //给defaultValue设置dataFiled的值
            var _defaultVal = undefined;
            if (dataFiled) {
                var filedExp = dataFiled;
                filedExp =
                    dataName +
                    (filedExp.startsWiths("[") ? "" : ".") +
                    filedExp;
                var dataObject = { IDM: window.IDM };
                dataObject[dataName] = resultData;
                _defaultVal = window.IDM.express.replace.call(
                    this,
                    "@[" + filedExp + "]",
                    dataObject
                );
            }
            //对结果进行再次函数自定义
            if (this.propData.customFunction && this.propData.customFunction.length > 0) {
                var params = this.commonParam();
                var resValue = "";
                try {
                    resValue = window[this.propData.customFunction[0].name] && window[this.propData.customFunction[0].name].call(this, {
                        ...params,
                        ...this.propData.customFunction[0].param,
                        moduleObject: this.moduleObject,
                        expressData: _defaultVal, interfaceData: resultData
                    });
                } catch (error) {
                }
                _defaultVal = resValue;
            }

            return _defaultVal;
        },
        
        /**
         * 组件通信：接收消息的方法
         * @param {
         *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
         * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
         *  message:{发送的时候传输的消息对象数据}
         *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
         *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
         * } object 
         */
        receiveBroadcastMessage(object) {
            console.log("组件收到消息", object)
            
        },
        /**
         * 组件通信：发送消息的方法
         * @param {
         *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
         * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
         *  message:{实际的消息对象},
         *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
         *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
         *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
         * } object 
         */
        sendBroadcastMessage(object) {
            window.IDM.broadcast && window.IDM.broadcast.send(object);
        },
        /**
         * 交互功能：设置组件的上下文内容值
         * @param {
         *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
         *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
         *  data:"数据集，内容为：字符串 or 数组 or 对象"
         * }
         */
        setContextValue(object) {
            console.log("统一接口设置的值", object);
            if (object.type != "pageCommonInterface") {
                return;
            }
            //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
            if (object.key == this.propData.dataName) {
                this.menu_list = this.getExpressData(this.propData.dataName, this.propData.dataFiled, object.data)
            }
        }
    }
}
</script>
<style lang="scss">
.IMenu_app{
    padding: 0 300px;
    .IMenu_app_main{
        position: relative;
        .next_button{
            position: absolute;
            .svg-icon{
                color: white;
                cursor: pointer;
            }
        }
        .next_button_left{
            left: -40px;
        }
        .next_button_right{
            right: -40px;
        }
        .el-menu-demo{
            overflow: hidden;
        }
    }
}
.IMenu_app{
    background: blue;
    .el-menu.el-menu--horizontal{
        border-bottom: none;
    }
    // background: blue;
    .el-menu:after, .el-menu:before {
        display: none;
        content: "";
    }
    .el-menu-demo{
        display: flex;
        justify-content: space-between;
        background: none;
        img{
            width: 30px;
            height: 30px;
        }
        // &>.el-menu-item{
        //     height: 50px;
        //     line-height: 50px;
        // }
        // &>.el-submenu>.el-submenu__title{
        //     height: 50px;
        //     line-height: 50px;
        // }
        .triangle{
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -10px;
            width: 0;
            height: 0;
            border-bottom: 10px solid #1B60A4;
            border-top: 10px solid transparent;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            display: none;
        }
    }
    .menu_button_style{
        .el-submenu__title,.el-menu-item{
            border-bottom: none !important;
        }
        .el-menu-item.is-active{
            border-bottom: none !important;
        }
        .el-submenu.is-active .el-submenu__title{
            border-bottom: none !important;
        }
        // .el-menu-item.is-active{
        //     color: white !important;
        //     background: #1f8bf7;
        // }
        // .el-submenu.is-active>.el-submenu__title{
        //     color: white !important;
        //     background: #1f8bf7;
        // }
        // .el-submenu.is-active>.el-submenu__title>i{
        //     color: white !important;
        // }

        // .el-submenu:focus .el-submenu__title{
        //     color: red !important;
        // }

        // .el-menu-item:hover{
        //     color: white !important;
        //     background: #1f8bf7;
        // }
        // .el-submenu>.el-submenu__title:hover{
        //     color: white !important;
        //     background: #1f8bf7;
        // }
        // .el-submenu>.el-submenu__title:hover>i{
        //     color: white;
        // }
    }
    .menu_line_style{
        // &>.el-menu-item.is-active{
        //     border-bottom: 2px solid red !important;
        // }
        // &>.el-submenu.is-active .el-submenu__title{
        //     border-bottom: 2px solid red !important;
        // }
        .el-menu-item:not(.is-disabled):focus, .el-menu-item:not(.is-disabled):hover{
            background: none;
        }
        .el-submenu .el-submenu__title:hover{
            background: none;
        }

        .el-menu--popup{
            .el-submenu.is-active .el-submenu__title{
                border-bottom: none !important;
            }
        }
    }
    .menu_line_triangle{
        .el-menu-item,.el-submenu__title{
            border-bottom: none !important;
            border-bottom-color: none;
        }
        .el-menu-item.is-active{
            border-bottom: none !important;
        }
        .el-submenu.is-active .el-submenu__title{
            border-bottom: none !important;
        }
        .is-active{
            .triangle{
                display: block;
            }
        }
    }
}
</style>>