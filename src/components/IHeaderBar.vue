<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="IHeaderBar_app">
            <div v-if="propData.showTopContain" class="IHeaderBar_app_top flex_between">
                <div class="left">
                    <div v-if="propData.topLeftShowType == 'time'" class="time">
                        {{ time + ' ' + getCurrentWeek() }}
                    </div>
                    <div v-else class="text">{{ propData.topLeftShowText }}</div>
                </div>
                <div v-if="propData.showSearch && propData.searchPosition == 'top'" class="right search_block">
                    <a-input v-model="search_text" :size="propData.size" :placeholder="propData.searchPlaceholder" :style="{ 'width': propData.widthSearch }">
                        <div v-if="propData.showSearchButton" @click="onSearch" class="search_button flex_start" slot="addonAfter">
                            <svg class="idm_button_svg_icon" v-if="propData.searchButtonIcon && propData.searchButtonIcon.length > 0" aria-hidden="true" > 
                                <use :xlink:href="`#${propData.searchButtonIcon[0]}`"></use>
                            </svg >
                            <span v-if="propData.searchButtonText" class="text">{{ propData.searchButtonText }}</span>
                        </div>
                    </a-input>
                </div>
            </div>
            <div class="IHeaderBar_app_main flex_between">
                <div class="img_box flex_start">
                    <img v-if="propData.logoImgSrc" :src="IDM.url.getWebPath(propData.logoImgSrc)" alt="">
                </div>
                <div v-if="propData.showSearch && propData.searchPosition == 'bottom'" class="search_block">
                    <a-input v-model="search_text" :size="propData.size" :placeholder="propData.searchPlaceholder" :style="{ 'width': propData.widthSearch }">
                        <div v-if="propData.showSearchButton" @click="onSearch" class="search_button" slot="addonAfter">
                            <svg class="idm_button_svg_icon" v-if="propData.searchButtonIcon && propData.searchButtonIcon.length > 0" aria-hidden="true" > 
                                <use :xlink:href="`#${propData.searchButtonIcon[0]}`"></use>
                            </svg >
                            <span v-if="propData.searchButtonText">{{ propData.searchButtonText }}</span>
                        </div>
                    </a-input>
                </div>
            </div>
        </div>
        <AdWindow v-if="propData.showAdWindow" :propData="propData" :moduleObject="moduleObject"></AdWindow>
    </div>
</template>

<script>
var dayjs = require('dayjs')
import AdWindow from './AdWindow.vue'
export default {
    name: 'IHeaderBar',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                showTopContain: true,
                topLeftShowType: 'time',
                topLeftShowText: '你好，地图',
                showSearch: true,
                showSearchButton: true,
                searchPosition: 'top',
                logoImgSrc: '',
                size: 'large',
                widthSearch: '300px',
                searchButtonText: '搜索',
                adImgWidth: '300px',
                adImgHeight: '100px',
                adObjectFit: 'cover'
            },
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            search_text: ''
        }
    },
    props: {
    },
    components: { AdWindow },
    created() {
        this.moduleObject = this.$root.moduleObject;
        this.getCurrentTime()
        this.convertAttrToStyleObject();
    },
    mounted() {
        //赋值给window提供跨页面调用
        this.$nextTick(function (params) {
            //单独组件不能使用这种方式
            // window[this.moduleObject.packageid] = this;
        });
    },
    destroyed() {
        if ( this.timer ) {
            clearInterval(this.timer)
        }
    },
    methods: {
        onSearch() {
            let that = this;
            if(this.moduleObject.env=="develop"){
                return;
            }
            //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
            let urlObject = window.IDM.url.queryObject(),
            pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
            
            var customFunctionSearch = this.propData.customFunctionSearch;
            customFunctionSearch&&customFunctionSearch.forEach(item=>{
                window[item.name]&&window[item.name].call(this,{
                    urlData:urlObject,
                    pageId,
                    customParam:item.param,
                    _this:this,
                    params: this.search_text
                });
            })
        },
        getCurrentTime() {
            this.timer = setInterval(() => {
                this.time = dayjs().format('YYYY-MM-DD HH:mm:ss') 
            },1000) 
        },
        getCurrentWeek() {
            let index = dayjs().day()
            switch (index) {
                case 0:
                    return '星期日'
                case 1:
                    return '星期一'
                case 2:
                    return '星期二'
                case 3:
                    return '星期三'
                case 4:
                    return '星期四'
                case 5:
                    return '星期五'
                case 6:
                    return '星期六'
            }
        },
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
        },
        /**
         * 把属性转换成样式对象
         */
        convertAttrToStyleObjectLogo() {
            var styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    if (this.propData.objectFit) {
                        styleObject["object-fit"] = this.propData.objectFit;
                    }
                    switch (key) {
                        case "widthLogoImg":
                            styleObject['width'] = element;
                            break;
                        case "heightLogoImg":
                            styleObject['height'] = element;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IHeaderBar_app .IHeaderBar_app_main .img_box', styleObject);
        },
        convertAttrToStyleObjectTop() {
            var styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthTop":
                            styleObject['width'] = element;
                            break;
                        case "heightTop":
                            styleObject['height'] = element;
                            break;
                        case "bgColorTop":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "boxTop":
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
                        case "borderTop":
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
                        case "fontTop":
                            styleObject["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObject["color"] = element.fontColors.hex8;
                            }
                            styleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObject["font-style"] = element.fontStyle;
                            styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObject["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObject["text-align"] = element.fontTextAlign;
                            styleObject["text-decoration"] = element.fontDecoration;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IHeaderBar_app .IHeaderBar_app_top', styleObject);
        },
        convertAttrToStyleObjectMain() {
            var styleObject = {};
            
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthMain":
                            styleObject['width'] = element;
                            break;
                        case "heightMain":
                            styleObject['height'] = element;
                            break;
                        case "bgColorMain":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "boxMain":
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
                        case "borderMain":
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
                        case "fontMain":
                            styleObject["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObject["color"] = element.fontColors.hex8;
                            }
                            styleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObject["font-style"] = element.fontStyle;
                            styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObject["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObject["text-align"] = element.fontTextAlign;
                            styleObject["text-decoration"] = element.fontDecoration;
                            break;
                        
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IHeaderBar_app .IHeaderBar_app_main', styleObject);
            
        },
        convertAttrToStyleObjectSearch() {
            var styleObjectSearch = {};
            var styleObjectInput = {};
            var styleObjectSearchButtonText = {};
            var styleObjectSearchButtonIcon = {};
            var styleObjectSearchButton = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "searchButtonIconFont":
                            styleObjectSearchButtonIcon['width'] = element;
                            styleObjectSearchButtonIcon['height'] = element;
                            styleObjectSearchButtonIcon['font-size'] = element;
                            break;
                        case "searchButtonIconColor":
                            styleObjectSearchButtonIcon['color'] = element.hex8;
                            break;
                        case "bgColorSearch":
                            if (element && element.hex8) {
                                styleObjectSearch["background-color"] = element.hex8;
                            }
                            break;
                        case "borderSearch":
                            if (element.border.top.width > 0) {
                                styleObjectSearch["border-top-width"] = element.border.top.width + element.border.top.widthUnit;
                                styleObjectSearch["border-top-style"] = element.border.top.style;
                                if (element.border.top.colors.hex8) {
                                    styleObjectSearch["border-top-color"] = element.border.top.colors.hex8;
                                }
                            }
                            if (element.border.right.width > 0) {
                                styleObjectSearch["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                                styleObjectSearch["border-right-style"] = element.border.right.style;
                                if (element.border.right.colors.hex8) {
                                    styleObjectSearch["border-right-color"] = element.border.right.colors.hex8;
                                }
                            }
                            if (element.border.bottom.width > 0) {
                                styleObjectSearch["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                                styleObjectSearch["border-bottom-style"] = element.border.bottom.style;
                                if (element.border.bottom.colors.hex8) {
                                    styleObjectSearch["border-bottom-color"] = element.border.bottom.colors.hex8;
                                }
                            }
                            if (element.border.left.width > 0) {
                                styleObjectSearch["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                                styleObjectSearch["border-left-style"] = element.border.left.style;
                                if (element.border.left.colors.hex8) {
                                    styleObjectSearch["border-left-color"] = element.border.left.colors.hex8;
                                }
                            }
                            styleObjectSearch["border-top-left-radius"] = element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
                            styleObjectSearch["border-top-right-radius"] = element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
                            styleObjectSearch["border-bottom-left-radius"] = element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
                            styleObjectSearch["border-bottom-right-radius"] = element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
                            break;
                        case "fontInput":
                            styleObjectInput["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectInput["color"] = element.fontColors.hex8;
                            }
                            styleObjectInput["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectInput["font-style"] = element.fontStyle;
                            styleObjectInput["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectInput["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectInput["text-align"] = element.fontTextAlign;
                            styleObjectInput["text-decoration"] = element.fontDecoration;
                            break;
                        case "fontInputSearch":
                            styleObjectSearchButtonText["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectSearchButtonText["color"] = element.fontColors.hex8;
                            }
                            styleObjectSearchButtonText["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectSearchButtonText["font-style"] = element.fontStyle;
                            styleObjectSearchButtonText["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectSearchButtonText["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectSearchButtonText["text-align"] = element.fontTextAlign;
                            styleObjectSearchButtonText["text-decoration"] = element.fontDecoration;
                            break;
                        case "bgColorSearchButton":
                            if (element && element.hex8) {
                                styleObjectSearchButton["background-color"] = element.hex8;
                            }
                            break;
                        case "searchButtonWidth":
                            styleObjectSearchButton["width"] = element;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .search_block .ant-input', styleObjectSearch);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .search_block input', styleObjectInput);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .search_block .search_button', styleObjectSearchButton);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IHeaderBar_app .search_block .idm_button_svg_icon', styleObjectSearchButtonIcon);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IHeaderBar_app .search_block .text', styleObjectSearchButtonText);
        },
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectLogo()
            this.convertAttrToStyleObjectTop()
            this.convertAttrToStyleObjectMain()
            this.convertAttrToStyleObjectSearch()
            var styleObject = {};
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
                        case "font":
                            styleObject["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObject["color"] = element.fontColors.hex8;
                            }
                            styleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObject["font-style"] = element.fontStyle;
                            styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObject["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObject["text-align"] = element.fontTextAlign;
                            styleObject["text-decoration"] = element.fontDecoration;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
            this.convertThemeListAttrToStyleObject()
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
                    this.propData.customInterfaceUrl && window.IDM.http.get(this.propData.customInterfaceUrl, params)
                        .then((res) => {
                            //res.data
                            that.$set(that.propData, "fontContent", that.getExpressData("resultData", that.propData.dataFiled, res.data));
                            // that.propData.fontContent = ;
                        })
                        .catch(function (error) {

                        });
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
                        that.propData.fontContent = resValue;
                    }
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
        }
    }
}
</script>
<style lang="scss">
.IHeaderBar_app{
    height: 100%;
    // background: ghostwhite;
    .IHeaderBar_app_top{
        padding: 4px 20px;
    }
    .IHeaderBar_app_main{
        height: 100px;
        // padding: 30px 20px;
        .img_box{
            width: 70%;
            height: 70px;
            img{
                width: 100%;
                object-fit: cover;
                max-width: 100%;
                max-height: 100%;
            }
        }
    }
    .search_block{
        cursor: pointer;
        .idm_button_svg_icon{
            font-size: 14px;
            width: 14px;
            height: 14px;
            fill: currentColor;
            vertical-align: -0.15em;
            outline: none;
            flex-shrink: 0;
        }
        .span{
            margin-left: 4px;
        }
    }
}
</style>