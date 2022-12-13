<template>
    <div idm-ctrl="idm_module" ref="module_ref" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" :idm-refresh-container="activeTab">
        <div class="ITabHeader_app">
            
            <a-tabs class="idm_itableslayout" :activeKey="activeTab" :size="propData.size || 'default'" :tabPosition="propData.tabPosition || 'top'" :type="propData.type || 'line'"
                :tabBarGutter="propData.tabBarGutter == 0 ? 0 : propData.tabBarGutter || null"
                :animated="propData.animated !== false ? true : false" @change="changeCallback"
                @nextClick="nextClickCallback" @prevClick="prevClickCallback" @tabClick="tabClickCallback">
                <a-tab-pane v-for="item in allTabList" :key="item.key" forceRender>
                    <div v-show="activeTab == item.key" class="drag_container" :class="`idm-tab-inner-${item.key}`" :idm-ctrl-id="moduleObject.id" :idm-container-index="item.key">
                    </div>
                    <div slot="tab" :class="{ 'ant-tabs-tab-divider': propData.tabShowDivider }" :style="setFontStyle(item.tableFont)">
                        <div v-if="item.tabSlotFunction && item.tabSlotFunction.length > 0" v-html="getTabCustomRender(item)">
                        </div>
                        <template v-else>
                            <span class="flex_start">
                                <div v-if="item.tabLeftShowType == '1'" class="header_line"></div>
                                <div v-if="item.tabLeftShowType == '2'" class="header_icon">
                                    <svg class="idm_button_svg_icon" v-if="item.leftIconSvg && item.leftIconSvg.length > 0" aria-hidden="true" >
                                        <use :xlink:href="`#${item.leftIconSvg[0]}`"></use>
                                    </svg >
                                </div>
                                <div v-if="item.tabLeftShowType == '3'" class="header_img">
                                    <img v-if="item.leftImgSrc" :src="IDM.url.getWebPath(item.leftImgSrc)" />
                                    <img v-else :src="IDM.url.getModuleAssetsWebPath(require('../assets/tab_left_img.png'),moduleObject)" />
                                </div>
                                <span>{{ item.tab }}</span>
                            </span>
                        </template>
                        <label class="ant-tabs-tab-remind" v-show="item.cnt > 0" :class="{ 'ant-tabs-tab-remind-reddot': propData.remindShowDot && item.key != activeTab, }">
                            {{ item.cnt > propData.remindNumberMax && propData.remindNumberMax ? propData.remindNumberMax + "+" : item.cnt }}
                        </label>
                        <!-- <span class="triangle"></span> -->
                    </div>
                </a-tab-pane>
                <!--右侧按钮-->
                <div class="idm_itodotabslist_tabbarextra_box" slot="tabBarExtraContent">
                    <div class="idm_itodotabslist_search_box" v-if="propData.showSearch" :class="{ 'open-search': searchOpen }">
                        <input type="text" ref="searchInputRef" @blur="searchBlurHandle" @keyup.enter="searchHandle"
                            v-model="searchText" />
                        <svg @click="searchHandle" class="idm_button_svg_icon idm-icon-searchOutline" aria-hidden="true">
                            <use :xlink:href="`#icon-searchOutline`"></use>
                        </svg>
                    </div>
                    <template v-for="(bitem, bindex) in extraBtnList || []">
                        <div v-if="bitem.showStatus" @click="tabBarExtraClickHandle(bitem, bindex)" :key="bindex">
                            <a-tooltip :title="bitem.tip">
                                {{ bitem.name }}
                                <svg class="idm_button_svg_icon" v-if="bitem.icon && bitem.icon.length > 0"
                                    aria-hidden="true">
                                    <use :xlink:href="`#${bitem.icon[0]}`"></use>
                                </svg>
                            </a-tooltip>
                        </div>
                    </template>
                    <div @click="jumpMorePage" v-if="propData.isShowMore" class="more">
                        <SvgIcon v-if="(propData.showMoreType == '1' || propData.showMoreType == '2')" icon-class="more" ></SvgIcon>
                        <span v-if="propData.showMoreType == '3'" class="text">更多</span>
                    </div>
                </div>
            </a-tabs>
        </div>
        
    </div>
</template>

<script>
import SvgIcon from '../icons/SvgIcon.vue';
import adaptationScreenMixin from '../mixins/adaptationScreen'

export default {
    name: 'ITabHeader',
    components: {SvgIcon},
    mixins: [adaptationScreenMixin],
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                remindShowDot: true,
                remindNumberMax: 9,
                extraBtnList: [
                    {
                        key: "1",
                        name: "设置",
                        icon: ["icon-settingOutline"],
                        tip: "这里是提示",
                        showType: "default",
                        dataFiled: "",
                        dataFunction: [
                            {
                                name: "tabchangeClick",
                                param: {},
                            },
                        ],
                    },
                    {
                        key: "2",
                        name: "",
                        icon: ["icon-settingOutline"],
                        tip: "点击可以进行个性化定制",
                        showType: "toggle",
                        dataFiled: "key==1",
                    },
                ],
                chooseBorder: {
                    border: {
                        // top: {
                        //     style: "solid",
                        //     width: 0,
                        //     widthUnit: "px",
                        //     colors: {
                        //         hex: '#f00'
                        //     }
                        // },
                        // right: {
                        //     style: "solid",
                        //     width: 0,
                        //     widthUnit: "px",
                        //     colors: {
                        //         hex: '#f00'
                        //     }
                        // },
                        // bottom: {
                        //     style: "solid",
                        //     width: 1,
                        //     widthUnit: "px",
                        //     colors: {
                        //         hex: '#f00'
                        //     }
                        // },
                        // left: {
                        //     style: "solid",
                        //     width: 0,
                        //     widthUnit: "px",
                        //     colors: {
                        //         hex: '#f00'
                        //     }
                        // }
                    },
                    radius: {
                        leftTop: {
                            radius: 0,
                            radiusUnit: "px"
                        },
                        rightTop: {
                            radius: 0,
                            radiusUnit: "px"
                        },
                        leftBottom: {
                            radius: 0,
                            radiusUnit: "px"
                        },
                        rightBottom: {
                            radius: 0,
                            radiusUnit: "px"
                        }
                    }
                },
                chooseShowBorder: false,
                tabPosition: 'top',
                type: 'line',
                size: 'default',
                tabBarGutter: 20,
                animated: true,
                bgColorChoose: null,
                isShowMore: true,
                showLeftIcon: true,
                tabLeftShowType: '3'
            },
            //当前所有的tab集合
            allTabList: [
                {
                    key: '1',
                    tab: '通知公告',
                    tableFont: {
                        fontSize: 16,
                        fontSizeUnit: 'px'
                    }
                },
                {
                    key: '2',
                    tab: '我的资源',
                    tableFont: {
                        fontSize: 16,
                        fontSizeUnit: 'px'
                    }
                }
            ],
            //当前选中的tab
            activeTab: '1',
            // 搜索的内容
            searchText: "",
            // 搜索框是否打开
            searchOpen: false,
            //扩展按钮集合
            extraBtnList: []
        }
    },
    created() {
        this.moduleObject = this.$root.moduleObject;
        this.initAttrToModule();
    },
    mounted() {
        //赋值给window提供跨页面调用
        this.$nextTick(function (params) {
            this.moduleObject && this.moduleObject.packageid ? (window[this.moduleObject.packageid] = this) : null;
            this.resizeContentWrapperHeight()
        });
    },
    methods: {
        /** * 主题颜色 */
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
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITabHeader_app .idm_itodotabslist_tabbarextra_box .more .svg-icon", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITabHeader_app .idm_itodotabslist_tabbarextra_box .idm_button_svg_icon", fontStyleObject );
            }
        },
        getActiveItemData() {
            let item = this.allTabList.find((item) => {
                return item.key == this.activeTab
            })
            return item
        },
        jumpMorePage() {
            let item = this.getActiveItemData()
            if ( item && item.selectColumn && item.moreJumpUrl ) {
                let url = IDM.url.getWebPath(item.moreJumpUrl) + '?columnId=' + item.selectColumn.id;
                window.open(url, item.jumpStyle || '_self')
            }
        },
        setFontStyle(item) {
            let obj = {};
            if (item) {
                item.fontColors && (obj['color'] = item.fontColors.hex8);
                item.fontFamily && (obj['font-family'] = item.fontFamily);
                item.fontWeight && (obj['font-weight'] = item.fontWeight.split(" ")[0]);
                item.fontStyle && (obj['font-style'] = item.fontStyle);
                item.fontSize && (obj['font-size'] = this.getAdaptiveSize(item.fontSize) + item.fontSizeUnit);
                item.fontLineHeight && (obj['line-height'] = item.fontLineHeight + (item.fontLineHeightUnit == "-" ? "" : item.fontLineHeightUnit));
                item.fontTextAlign && (obj['text-align'] = item.fontTextAlign);
                item.fontDecoration && (obj['text-decoration'] = item.fontDecoration);
            }
            return obj;
        },
        initAttrToModule() {
            this.initBaseAttrToModule();
            this.convertAttrToStyleObject();
            this.convertTabAttrToStyleObject();
            this.convertChooseTabAttrToStyleObject();
            this.convertAttrToStyleObjectLeftIcon();
            this.convertAttrToStyleObjectMoreIcon()
            this.convertThemeListAttrToStyleObject()
            this.convertAttrToStyleObjectLeftLine()
            this.convertAttrToStyleObjectLeftImg()
        },
        convertAttrToStyleObjectMoreIcon() {
            let styleObject = {};
            let styleObjectText = {};
            let propData = this.propData;
            for (const key in propData) {
                if (propData.hasOwnProperty.call(propData, key)) {
                    const element = propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "moreIconFontSize":
                             styleObject['font-size'] = element;
                             styleObject['width'] = element;
                            break;
                        case "colorMoreIcon":
                            if (propData.colorMoreIcon && propData.colorMoreIcon.hex8) {
                                styleObject["color"] = propData.colorMoreIcon.hex8 + ' !important';
                            }
                            break;
                        case "moreIconTop":
                            styleObject['top'] = element;
                            break;
                        case "boxMoreIcon":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "fontMoreText":
                            IDM.style.setFontStyle(styleObjectText,element)
                    }
                }
            }
            IDM.setStyleToPageHead(this.moduleObject.id + ' .more .svg-icon',styleObject);
            IDM.setStyleToPageHead(this.moduleObject.id + ' .more .text',styleObjectText);
        },
        convertAttrToStyleObjectLeftLine() {
            let styleObject = {};
            let propData = this.propData;
            for (const key in propData) {
                if (propData.hasOwnProperty.call(propData, key)) {
                    const element = propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthLeftLine":
                             styleObject['width'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                        case "heightLeftLine":
                            styleObject['height'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                        case "boxLeftLine":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "bgColorLeftLine":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "widthLeftLinePositionY":
                            styleObject['top'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                        case "widthLeftLinePositionX":
                            styleObject['left'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                    }
                }
            }
            IDM.setStyleToPageHead(this.moduleObject.id + ' .header_line',styleObject);
        },
        convertAttrToStyleObjectLeftIcon() {
            let styleObject = {};
            let propData = this.propData;
            for (const key in propData) {
                if (propData.hasOwnProperty.call(propData, key)) {
                    const element = propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthLeftIcon":
                             styleObject['width'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                        case "heightLeftIcon":
                            styleObject['height'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            styleObject['line-height'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                        case "fontColorLeftIcon":
                            if (element && element.hex8) {
                                styleObject["color"] = element.hex8;
                            }
                            break;
                        case "boxLeftIcon":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "widthLeftIconPositionY":
                            styleObject['top'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                        case "widthLeftIconPositionX":
                            styleObject['left'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                    }
                }
            }
            IDM.setStyleToPageHead(this.moduleObject.id + ' .header_icon',styleObject);
        },
        convertAttrToStyleObjectLeftImg() {
            let styleObject = {};
            let propData = this.propData;
            for (const key in propData) {
                if (propData.hasOwnProperty.call(propData, key)) {
                    const element = propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthLeftImg":
                             styleObject['width'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                        case "heightLeftImg":
                            styleObject['height'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            styleObject['line-height'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                        case "boxLeftImg":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "widthLeftImgPositionY":
                            styleObject['top'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                        case "widthLeftImgPositionX":
                            styleObject['left'] = this.getAdaptiveSize(element.inputVal) + element.selectVal;
                            break;
                    }
                }
            }
            IDM.setStyleToPageHead(this.moduleObject.id + ' .header_img',styleObject);
        },
        /**
        * 提供父级组件调用的刷新prop数据组件
        */
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            console.log(this.propData, '接收propData');
            this.initAttrToModule();
        },
        /** 
         * 扩展显示按钮的方式
        */
        extendMethods() {
            let that = this;
            that.propData.extraBtnList &&
                that.propData.extraBtnList.forEach(item => {
                    item.showStatus = item.showType == "default";
                    if (item.showType === 'toggle') {
                        for (let index = 0; index < that.allTabList.length; index++) {
                            const element = that.allTabList[index];
                            if (element.key == that.activeTab) {
                                //用当前选中的页签对象去执行表达式
                                if (that.getExpressData("data", item.dataFiled, element)) {
                                    item.showStatus = true;
                                } else {
                                    item.showStatus = false;
                                }
                                continue;
                            }
                        }
                    }
                    if (item.showTop === 'custom') {
                        item.showStatus =
                            window[item.dataFunction[0].name] &&
                            window[item.dataFunction[0].name].call(this, {
                                ...that.commonParam(),
                                customParam: item.dataFunction[0].param,
                                _this: that,
                                activeKey: that.activeTab,
                                allKey: that.allTabList
                            });
                    }
                });
            that.extraBtnList = that.propData.extraBtnList;
        },
        /**
        * 加载基本属性到组件中
        */
        initBaseAttrToModule() {
            let that = this;
            this.extendMethods();
            if ( that.propData.staticTabPaneList && (that.propData.staticTabPaneList.length > 1 || (that.propData.staticTabPaneList.length == 1 && Object.keys(that.propData.staticTabPaneList[0]).length > 0)) ) {
                if (this.moduleObject.env != 'develop') {
                    that.propData.staticTabPaneList.forEach(item => {
                        if (item.defaultActiveKey) {
                            this.activeTab = item.key;
                        }
                        if (!this.activeTab) {
                            this.activeTab = this.propData.staticTabPaneList[0].key
                        }
                    })
                }
                that.propData.staticTabPaneList.forEach(item => {
                    item.cnt = item.cnt ? item.cnt : 0;
                    item.opened = this.moduleObject.env == 'develop' ? true : this.activeTab == item.key;
                    if (!item.forceRender) {
                        item.opened = true;
                    }
                });
                that.allTabList = that.propData.staticTabPaneList;
            }
        },
        /**
        * 通用的url参数对象
        * 所有地址url参数转换
        */
        commonParam() {
            let urlObject = IDM.url.queryObject();
            return {
                pageId: window.IDM.broadcast && window.IDM.broadcast.pageModule
                    ? window.IDM.broadcast.pageModule.id
                    : "",
                urlData: JSON.stringify(urlObject)
            }
        },
        /**
         * 处理：clickType
         * tab扩展按钮点击事件
         */
        tabBarExtraClickHandle(item, index) {
            let that = this;
            if (item.clickType == "customFunction") {
                this.changeEventFunHandle(
                    "clickCustomFunction",
                    item.clickCustomFunction
                );
            } else if (item.clickType == "openCtrlCenter") {
                //组件内调用
                IDM.broadcast.openControlSetPanel({
                    param: {
                        marketModuleId: this.moduleObject.comId,
                        pageId: IDM.broadcast ? IDM.broadcast.pageModule.id : "",
                        packageid: this.moduleObject.packageid,
                    },
                    showTop: true,
                    success: function (res) { },
                    yes: function (res) {
                        console.log('yes');
                        //确定后控制中心的表单数据保存了，可以再次调用获取方法获取已经保存的个性化组件属性
                        // that.fetchDynamicAttr();
                    },
                    reset: function (res) {
                        console.log('reset');
                        //重置后可重新获取到初始值
                        // that.fetchDynamicAttr();
                    },
                    other: function (res) {
                        //关闭或其他按钮触发回调方法
                    },
                });
            }
        },
        /**
        * 获取tab自定义的数据
        */
        getTabCustomRender(item) {
            if (item.tabSlotFunction && item.tabSlotFunction.length > 0) {
                if (!window[item.tabSlotFunction[0].name]) {
                    return this.moduleObject.env == 'develop' ? "请把动作面板打开" : "";
                }
                return window[item.tabSlotFunction[0].name] &&
                    window[item.tabSlotFunction[0].name].call(this, {
                        customParam: item.tabSlotFunction[0].param,
                        tab: item
                    })
            } else {
                return '方法未找到';
            }
        },
        convertTabAttrToStyleObject() {
            var styleObject = { "text-shadow": "none" };
            
            var styleObjectTabHover = {};
            //ant-tabs-tab  以tab为单位的
            if ( this.propData.tabLeftPadding && this.propData.tabLeftPadding.inputVal + "" && this.propData.tabLeftPadding.selectVal ) {
                styleObject["padding-left"] = this.propData.tabLeftPadding.inputVal + this.propData.tabLeftPadding.selectVal;
            }
            if ( this.propData.tabRightPadding && this.propData.tabRightPadding.inputVal + "" && this.propData.tabRightPadding.selectVal ) {
                styleObject["padding-right"] = this.propData.tabRightPadding.inputVal + this.propData.tabRightPadding.selectVal;
            }
            if ( this.propData.tabTopPadding && this.propData.tabTopPadding.inputVal + "" && this.propData.tabTopPadding.selectVal ) {
                styleObject["padding-top"] = this.propData.tabTopPadding.inputVal + this.propData.tabTopPadding.selectVal;
            }
            if ( this.propData.tabBottomPadding && this.propData.tabBottomPadding.inputVal + "" && this.propData.tabBottomPadding.selectVal ) {
                styleObject["padding-bottom"] = this.propData.tabBottomPadding.inputVal + this.propData.tabBottomPadding.selectVal;
            }
            if ( this.propData.tabFontHover ) {
                let element = this.propData.tabFontHover;
                // styleObjectTabHover["font-family"] = element.fontFamily;
                // if (element.fontColors.hex8) {
                //     styleObjectTabHover["color"] = element.fontColors.hex8;
                // }
                // styleObjectTabHover["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                // styleObjectTabHover["font-style"] = element.fontStyle;
                // styleObjectTabHover["font-size"] = element.fontSize + element.fontSizeUnit;
                // styleObjectTabHover["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                // styleObjectTabHover["text-align"] = element.fontTextAlign;
                // styleObjectTabHover["text-decoration"] = element.fontDecoration;
                IDM.style.setFontStyle(styleObjectTabHover, element)
                this.adaptiveFontSize(styleObjectTabHover, element)
            }
            window.IDM.setStyleToPageHead( this.moduleObject.id + " .ant-tabs-nav .ant-tabs-tab", styleObject );
            window.IDM.setStyleToPageHead( this.moduleObject.id + " .ant-tabs-nav .ant-tabs-tab:hover", styleObjectTabHover );
            
            //角标
            styleObject = {};
            if (this.propData.remindOffsetX) {
                styleObject["right"] = this.propData.remindOffsetX + "px";
            }
            if (this.propData.remindOffsetY) {
                styleObject["top"] = this.propData.remindOffsetY + "px";
            }
            if (this.propData.remindBgColor && this.propData.remindBgColor.hex8) {
                styleObject["background-color"] = this.propData.remindBgColor.hex8;
            }
            window.IDM.setStyleToPageHead( this.moduleObject.id + " .ant-tabs-tab-remind", styleObject );
            //分割线
            if (this.propData.tabShowDivider) {
                styleObject = {};
                if (this.propData.dividerHeightNumber + "") {
                    styleObject["height"] = this.propData.dividerHeightNumber + "%";
                }
                if (this.propData.dividerTopNumber + "") {
                    styleObject["top"] = this.propData.dividerTopNumber + "%";
                }
                if (this.propData.dividerRightNumber + "") {
                    styleObject["right"] = this.propData.dividerRightNumber + "px";
                }
                if (this.propData.dividerBgColor && this.propData.dividerBgColor.hex8) {
                    styleObject["background-color"] = this.propData.dividerBgColor.hex8;
                }
                window.IDM.setStyleToPageHead( this.moduleObject.id + " .ant-tabs-tab-divider::before", styleObject );
            }
            //整个tab容器的
            styleObject = {};
            let extraBtnStyleObject = {},
                extraBtnSvgStyleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "extraBtnGutter":
                            extraBtnStyleObject["padding-left"] =
                                parseInt(element) / 2 + "px";
                            extraBtnStyleObject["padding-right"] =
                                parseInt(element) / 2 + "px";
                            break;
                        case "extraBtnFontColor":
                            if (element.hex8) {
                                extraBtnStyleObject["color"] = element.hex8;
                            }
                            break;
                        case "extraBtnFontSize":
                            extraBtnStyleObject["font-size"] = this.getAdaptiveSize(element) + "px";
                            extraBtnSvgStyleObject["font-size"] = this.getAdaptiveSize(element) + "px";
                            extraBtnSvgStyleObject["max-height"] = element + "px";
                            extraBtnSvgStyleObject["width"] = element + "px";
                            break;
                        case "tabFont":
                            IDM.style.setFontStyle(styleObject, element)
                            this.adaptiveFontSize(styleObject, element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead( this.moduleObject.id + " .ant-tabs .ant-tabs-nav-container", styleObject );
            window.IDM.setStyleToPageHead( this.moduleObject.id + " .idm_itodotabslist_tabbarextra_box>*", extraBtnStyleObject );
            window.IDM.setStyleToPageHead( this.moduleObject.id + " .idm_itodotabslist_tabbarextra_box>* svg", extraBtnSvgStyleObject );
        },
        convertChooseTabAttrToStyleObject() {
            if (!this.propData.chooseShowBorder) {
                window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_itableslayout .ant-tabs-ink-bar", { display: 'none !important' });
            } else {
                window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_itableslayout .ant-tabs-ink-bar", { height: 'block !important' });
            }
            //当前选中的tab
            
            let chooseObjBorder = {}
            if (this.propData.tabActiveBold) {
                chooseObjBorder["font-weight"] = "bold";
            }
            
            if (this.propData.chooseBorder) {
                let element = this.propData.chooseBorder;
                if (element.border && element.border.top && element.border.top.width > 0) {
                    chooseObjBorder["border-top-width"] = element.border.top.width + element.border.top.widthUnit;
                    chooseObjBorder["border-top-style"] = element.border.top.style;
                    if (element.border.top.colors && element.border.top.colors.hex) {
                        chooseObjBorder["border-top-color"] = element.border.top.colors.hex;
                    }
                }
                if (element.border && element.border.right && element.border.right.width > 0) {
                    chooseObjBorder["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                    chooseObjBorder["border-right-style"] = element.border.right.style;
                    if (element.border.right.colors && element.border.right.colors.hex) {
                        chooseObjBorder["border-right-color"] = element.border.right.colors.hex;
                    }
                }
                if (element.border && element.border.bottom && element.border.bottom.width > 0) {
                    chooseObjBorder["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                    chooseObjBorder["border-bottom-style"] = element.border.bottom.style;
                    if (element.border.bottom.colors && element.border.bottom.colors.hex) {
                        chooseObjBorder["border-bottom-color"] = element.border.bottom.colors.hex;
                    }
                }
                if (element.border && element.border.left && element.border.left.width > 0) {
                    chooseObjBorder["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                    chooseObjBorder["border-left-style"] = element.border.left.style;
                    if (element.border.left.colors && element.border.left.colors.hex) {
                        chooseObjBorder["border-left-color"] = element.border.left.colors.hex;
                    }
                }

                chooseObjBorder["border-top-left-radius"] = element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
                chooseObjBorder["border-top-right-radius"] = element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
                chooseObjBorder["border-bottom-left-radius"] = element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
                chooseObjBorder["border-bottom-right-radius"] = element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
            }
            if ( this.propData.bgColorChoose && this.propData.bgColorChoose.hex8 ) {
                chooseObjBorder["background-color"] = this.propData.bgColorChoose.hex8;
            }
            if ( this.propData.tabFontChoose ) {
                let element = this.propData.tabFontChoose;
                // chooseObjBorder["font-family"] = element.fontFamily;
                // if (element.fontColors.hex8) {
                //     chooseObjBorder["color"] = element.fontColors.hex8;
                // }
                // chooseObjBorder["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                // chooseObjBorder["font-style"] = element.fontStyle;
                // chooseObjBorder["font-size"] = element.fontSize + element.fontSizeUnit;
                // chooseObjBorder["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                // chooseObjBorder["text-align"] = element.fontTextAlign;
                // chooseObjBorder["text-decoration"] = element.fontDecoration;
                IDM.style.setFontStyle(chooseObjBorder, element)
                this.adaptiveFontSize(chooseObjBorder, element)
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .idm_itableslayout .ant-tabs-tab-active", chooseObjBorder);
        },
        /**
         * 处理：bgSize、positionX、positionY、boxShadow、width、height、bgColor、box、bgImgUrl
         * bgRepeat、bgAttachment、border
         * 把属性转换成样式对象
         */
        convertAttrToStyleObject() {
            let styleObject = {};
            let styleObjectTitle = {};
            if (this.propData.bgSize && this.propData.bgSize == "custom") {
                styleObject["background-size"] = (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") + " " + (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto");
            } else if (this.propData.bgSize) {
                styleObject["background-size"] = this.propData.bgSize;
            }
            if (this.propData.positionX && this.propData.positionX.inputVal) {
                styleObject["background-position-x"] =
                    this.propData.positionX.inputVal + this.propData.positionX.selectVal;
            }
            if (this.propData.positionY && this.propData.positionY.inputVal) {
                styleObject["background-position-y"] =
                    this.propData.positionY.inputVal + this.propData.positionY.selectVal;
            }
            
            if ( this.propData.isHideTitleBorderBottom ) {
                styleObjectTitle['border-bottom'] = 'none'
            } else if ( this.propData.titleBorderColor && this.propData.titleBorderColor.hex8 ) {
                styleObjectTitle['border-bottom'] = `1px solid ${this.propData.titleBorderColor.hex8}`
            } else {
                styleObjectTitle['border-bottom'] = '1px solid #e8e8e8'
            }
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case 'boxShadow':
                            styleObject["box-shadow"] = element;
                            break;
                        case "width":
                            styleObject[key] = element;
                            break;
                        case "height":
                            if ( this.propData.isAdaption && this.parentHeight ) {
                                styleObject[key] = this.parentHeight + 'px';
                            } else {
                                styleObject[key] = element;
                            }
                            break;
                        case "bgColor":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
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
                            styleObject[
                                "background-image"
                            ] = `url(${window.IDM.url.getWebPath(element)})`;
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
                                styleObject["border-top-width"] =
                                    element.border.top.width + element.border.top.widthUnit;
                                styleObject["border-top-style"] = element.border.top.style;
                                if (element.border.top.colors.hex8) {
                                    styleObject["border-top-color"] =
                                        element.border.top.colors.hex8;
                                }
                            }
                            if (element.border.right.width > 0) {
                                styleObject["border-right-width"] =
                                    element.border.right.width + element.border.right.widthUnit;
                                styleObject["border-right-style"] = element.border.right.style;
                                if (element.border.right.colors.hex8) {
                                    styleObject["border-right-color"] =
                                        element.border.right.colors.hex8;
                                }
                            }
                            if (element.border.bottom.width > 0) {
                                styleObject["border-bottom-width"] =
                                    element.border.bottom.width + element.border.bottom.widthUnit;
                                styleObject["border-bottom-style"] =
                                    element.border.bottom.style;
                                if (element.border.bottom.colors.hex8) {
                                    styleObject["border-bottom-color"] =
                                        element.border.bottom.colors.hex8;
                                }
                            }
                            if (element.border.left.width > 0) {
                                styleObject["border-left-width"] =
                                    element.border.left.width + element.border.left.widthUnit;
                                styleObject["border-left-style"] = element.border.left.style;
                                if (element.border.left.colors.hex8) {
                                    styleObject["border-left-color"] =
                                        element.border.left.colors.hex8;
                                }
                            }

                            styleObject["border-top-left-radius"] =
                                element.radius.leftTop.radius +
                                element.radius.leftTop.radiusUnit;
                            styleObject["border-top-right-radius"] =
                                element.radius.rightTop.radius +
                                element.radius.rightTop.radiusUnit;
                            styleObject["border-bottom-left-radius"] =
                                element.radius.leftBottom.radius +
                                element.radius.leftBottom.radiusUnit;
                            styleObject["border-bottom-right-radius"] =
                                element.radius.rightBottom.radius +
                                element.radius.rightBottom.radiusUnit;
                            break;
                        case "font":
                            // styleObject["font-family"] = element.fontFamily;
                            // if (element.fontColors.hex8) {
                            //     styleObject["color"] = element.fontColors.hex8;
                            // }
                            // styleObject["font-weight"] =
                            //     element.fontWeight && element.fontWeight.split(" ")[0];
                            // styleObject["font-style"] = element.fontStyle;
                            // styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
                            // styleObject["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            // styleObject["text-align"] = element.fontTextAlign;
                            // styleObject["text-decoration"] = element.fontDecoration;
                            IDM.style.setFontStyle(styleObject, element)
                            this.adaptiveFontSize(styleObject, element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ant-tabs-bar', styleObjectTitle);
        },
        /**
         * 根据结果集来执行表达式的结果
         * dataName：结果集名，建议直接data即可
         * dataFiled：表达式
         * resultData：要查下的结果集
         */
        getExpressData(dataName, dataFiled, resultData) {
            //给defaultValue设置dataFiled的值
            var _defaultVal = undefined;
            if (dataFiled) {
                var filedExp = dataFiled;
                filedExp = dataName + (filedExp.startsWiths("[") ? "" : ".") + filedExp;
                var dataObject = { IDM: window.IDM };
                dataObject[dataName] = resultData;
                _defaultVal = window.IDM.express.replace.call(
                    this,
                    "@[" + filedExp + "]",
                    dataObject
                );
            }
            return _defaultVal;
        },
        /**
         * 切换面板的回调
         */
        changeCallback(key) {
            let that = this;
            this.activeTab = key;
            this.allTabList.forEach(item => {
                if (this.activeTab === item.key) {
                    if (!item.opened) {
                        item.opened = true;
                        that.$nextTick(function (params) {
                            //去加载内部组件
                            that.moduleObject.moduleReload && that.moduleObject.moduleReload(that.moduleObject.packageid, item.key);
                        })
                    }
                }
            })
            this.changeEventFunHandle("changeFunction");
        },
        /**
         * tab 被点击的回调
         */
        tabClickCallback(key) {
            this.changeEventFunHandle("tabClickFunction");
        },
        /**
         * 搜索框失去焦点事件
         */
        searchBlurHandle() {
            if (!this.searchText) {
                this.searchOpen = false;
            }
            //去搜索
            this.changeEventFunHandle("searchFunction");
        },
        /**
         * 搜索函数
         */
        searchHandle() {
            if (!this.searchOpen) {
                //打开
                this.searchOpen = true;
                this.$nextTick(function () {
                    this.$refs.searchInputRef.focus();
                });
                return;
            }
            //去搜索
            this.changeEventFunHandle("searchFunction");
        },
        /**
        * 通过自定义函数
        * name：属性名 会根据此属性名去propData中获取
        * customFunctionList: 忽略name直接传自定义函数集合
        */
        changeEventFunHandle(name, customFunctionList) {
            let that = this;
            let customHandle = customFunctionList || that.propData[name];
            customHandle && customHandle.forEach(item => {
                window[item.name] && window[item.name].call(that, {
                    ...that.commonParam(),
                    customParam: item.param,
                    _that: that,
                    activeKey: that.activeTab,
                    allKey: that.allTabList
                });
            });
        },
        /**
         * 处理：prevClickFunction
         * prev 按钮被点击的回调
         */
        prevClickCallback() {
            this.changeEventFunHandle("prevClickFunction");
        },
        /**
         * 处理：nextClickFunction
         * next 按钮被点击的回调
         */
        nextClickCallback() {
            this.changeEventFunHandle("nextClickFunction");
        },
        resizeContentWrapperHeight(wrapperHeight) {
            let moduleHeight = this.propData.isAdaption ? $("#" + this.moduleObject.packageid).parents(".fsl-region-element").height() : this.propData.height;
            if ( this.propData.isAdaption && (wrapperHeight || moduleHeight) ) {
                //自适应父级容器
                moduleHeight = wrapperHeight || moduleHeight;

                //如果自适应则要减去上margin和下margin(因为margin、padding百分比都是相对父级宽度，所以要计算出实际的宽度值)
                //父级宽度值未知的，因为组件的宽度是100%显示的
                //所以计算公式为：(当前组件的宽度+左右margin实际数值)/(100-左右margin百分比总和)*100=实际宽度
                let iAttrArray = ["marginLeftVal", "marginRightVal"];
                let marginNumber = 0, marginRatio = 0;
                iAttrArray.forEach((item) => {
                    if ( this.propData.box && this.propData.box[item] && this.propData.box[item].indexOf("%") > -1 ) {
                        //用宽度计算出实际的px
                        marginRatio += parseFloat(this.propData.box[item].replace("%", ""));
                    } else if (this.propData.box && this.propData.box[item]) {
                        marginNumber += parseFloat( this.propData.box[item].replace("px", "") );
                    }
                });
                let module_width = this.$refs.module_ref.offsetWidth;
                //实际的100%的宽度
                const module_width_100 = ((module_width + marginNumber) / (100 - marginRatio)) * 100;

                let moduleTBMarginNumber = 0;
                iAttrArray = ["marginTopVal", "marginBottomVal"];
                iAttrArray.forEach((item) => {
                    if (this.propData.box && this.propData.box[item]) {
                        if (this.propData.box[item].indexOf("%") > -1) {
                            //用宽度计算出实际的px
                            moduleTBMarginNumber = moduleTBMarginNumber + (parseFloat(this.propData.box[item].replace("%", "")) / 100) * module_width_100;
                        } else {
                            moduleTBMarginNumber = moduleTBMarginNumber + parseFloat(this.propData.box[item].replace("px", ""));
                        }
                    }
                });
                moduleHeight = moduleHeight - moduleTBMarginNumber - 3;
            }
            this.parentHeight = moduleHeight;
            this.convertAttrToStyleObject()
        },
        /**
        * 组件通信：接收消息的方法
        */
        receiveBroadcastMessage(object) {
            console.log('组件收到消息', object);
            if (object && object.type == "regionResize" && object.message && object.message.gridEleTarget) {
                let gridEleTarget = object.message.gridEleTarget;
                if (gridEleTarget && gridEleTarget.offsetHeight) {
                    this.parentHeight = gridEleTarget.offsetHeight;
                    this.$nextTick(() => {
                        if ( this.propData.isAdaption && gridEleTarget.offsetHeight ) {
                            this.resizeContentWrapperHeight(gridEleTarget.offsetHeight);
                        } 
                    })
                }
            }
        },
        /**
        * 交互功能：设置组件的上下文内容值
        */
        setContextValue(object) {
            console.log('统一接口设置的值', object);
        }
    }
}
</script>

<style lang="scss">
.ITabHeader_app {
    height: 100%;
    position: relative;
    align-items: flex-start;
    .more{
        padding-right: 0 !important;
        .svg-icon{
            position: relative;
            max-height: 20px !important;
            color: red;
        }
        .text{
            display: inline-block;
            height: 100%;
        }
    }
    .header_line{
        width: 8px;
        height: 20px;
        position: relative;
        background: #1B60A4;
    }
    .header_icon{
        position: relative;
        width: 16px;
        height: 16px;
        line-height: 16px;
        .idm_button_svg_icon{
            width: 100%;
            height: 100%;
            fill: currentColor;
        }
    }
    .ant-tabs-content{
        height: calc(100% - 52px);
    }
    .header_img{
        position: relative;
        width: 16px;
        height: 16px;
        line-height: 16px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .idm_itableslayout{
        width: 100%;
        height: 100%;
    }
    .drag_container{
        height: 100%;
        overflow-y: auto;
    }
    .triangle{
        position: absolute;
        bottom: -10px;
        display: inline-block;
        width: 0;
        height: 0;
        border: 5px solid;  
        border-left-color: transparent;
        border-right-color: transparent;
        border-top-color:  red;
        border-bottom-color: transparent;
    }

    .ant-tabs-tab-remind {
        position: absolute;
        top: 0px;
        right: 0px;
        border-radius: 10px;
        padding: 0 6px;
        width: auto;
        height: 20px;
        line-height: 18px;
        text-align: center;
        white-space: nowrap;
        border: 1px solid #fff;
        background-color: #ec4519;
        font-size: 12px;
        color: #fff;
        transform: translate(100%, 0);
        -webkit-transform: translate(100%, 0);
        -moz-transform: translate(100%, 0);
        transition: all linear 0.2s;

        &.ant-tabs-tab-remind-reddot {
            width: 8px;
            height: 8px;
            color: transparent;
            border-radius: 50%;
            padding: 0;
        }
    }

    &.ant-tabs-vertical .ant-tabs-tab-remind,
    &.ant-tabs-card .ant-tabs-tab-remind {
        transform: none;
        -webkit-transform: none;
        -moz-transform: none;
    }

    .ant-tabs-tab-divider {
        &::before {
            content: "";
            position: absolute;
            top: 0;
            right: 0px;
            width: 1px;
            height: 50%;
            background-color: #e8e8e8;
            pointer-events: none;
            // transform: translate(0,50%);
            // -webkit-transform: translate(0,50%);
            // -moz-transform: translate(0,50%);
        }
    }

    .ant-tabs-nav .ant-tabs-tab:last-child .ant-tabs-tab-divider {
        &::before {
            display: none;
        }
    }

    .ant-tabs-bar,
    .ant-tabs-bottom .ant-tabs-bottom-bar {
        margin: 0 !important;
    }

    &.ant-tabs .ant-tabs-left-content {
        padding-left: 0px;
    }

    &.ant-tabs .ant-tabs-right-content {
        padding-right: 0px;
    }

    .idm_itodotabslist_tabbarextra_box {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-end;
        align-items: center;

        &>* {
            padding: 0px 10px;
            cursor: pointer;
            user-select: none;
            transition: opacity linear 0.2s;
            opacity: 0.7;

            &:hover {
                opacity: 1;
            }
        }

        .idm_button_svg_icon {
            font-size: 14px;
            max-height: 14px;
            width: 14px;
            fill: currentColor;
            vertical-align: -0.15em;
            margin-right: 3px;
            outline: none;
        }
    }

    .idm_itodotabslist_search_box {
        input {
            display: none;
        }
    }

    .idm_itodotabslist_search_box.open-search {
        width: 180px;
        height: 30px;
        border: 1px solid #e3e4e5;
        background-color: #f1f1f1;
        border-radius: 15px;
        line-height: initial;
        margin-top: -1px;
        position: relative;

        .idm-icon-searchOutline {
            position: absolute;
            right: 3px;
            top: 3px;
            font-size: 20px !important;
            max-height: 20px !important;
            width: 20px !important;
        }

        input {
            display: block;
            height: 100%;
            outline: none;
            width: calc(100% - 20px);
            border: none;
            background: transparent;
            color: #333333 !important;
        }
    }
}
</style>
