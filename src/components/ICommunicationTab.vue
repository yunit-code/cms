<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="communication-tab-container d-flex">
            <div
                class="communication-tab-common cursor-p"
                v-for="(item, index) in componentTab"
                :key="index"
                @click="handleTabChange(item)"
                :class="[item.tabKey === defaultKey ? 'communication-tab-active' : 'communication-tab-no-active']"
            >
                {{ item.tabName }}
            </div>
        </div>
        <div class="communication-tab-content">
            <div class="communication-tab-title">
                {{ componentData[defaultKey] && componentData[defaultKey].title }}
            </div>
            <div class="communication-tab-content">
                <span class="communication-tab-tip">[回答]</span>
                {{ componentData[defaultKey] && componentData[defaultKey].content }}
            </div>
        </div>
        <div class="d-flex just-c">
            <div class="communication-tab-button cursor-p" @click="handleButtonClick">
                {{ propData.buttonText }}
            </div>
        </div>
    </div>
</template>
<script>
import { communicationTabData } from '../mock/mockData'
export default {
    name: 'ICommunicationTab',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                fontContent: 'Hello Word'
            },
            componentTab: [],
            componentData: {},
            defaultKey: ''
        }
    },
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject()
        this.convertThemeListAttrToStyleObject()
    },
    methods: {
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.convertAttrToStyleObject()
            this.convertThemeListAttrToStyleObject()
        },
        convertAttrToStyleObject() {
            const styleObject = {},
                tabObj = {},
                tabNoActiveObj = {},
                tabActiveObj = {},
                titleObj = {},
                contentObj = {},
                buttonObj = {}
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key]
                    if (!element && element !== false && element != 0) {
                        continue
                    }
                    switch (key) {
                        case 'width':
                        case 'height':
                            styleObject[key] = element
                            break
                        case 'bgColor':
                            if (element && element.hex8) {
                                styleObject['background-color'] = element.hex8
                            }
                            break
                        case 'box':
                            IDM.style.setBoxStyle(styleObject, element)
                            break
                        case 'border':
                            IDM.style.setBorderStyle(styleObject, element)
                            break
                        // tab样式
                        case 'tabBox':
                            IDM.style.setBoxStyle(tabObj, element)
                            break
                        case 'tabBorder':
                            IDM.style.setBorderStyle(tabObj, element)
                            break
                        case 'tabFont':
                            IDM.style.setFontStyle(tabNoActiveObj, element)
                            break
                        case 'tabBgColor':
                            if (element && element.hex8) {
                                tabNoActiveObj['background-color'] = element.hex8 + ' !important'
                            }
                            break
                        case 'tabActiveBgColor':
                            if (element && element.hex8) {
                                tabActiveObj['background-color'] = element.hex8 + ' !important'
                            }
                            break
                        case 'tabActiveFont':
                            IDM.style.setFontStyle(tabActiveObj, element)
                            break
                        case 'titleFont':
                            IDM.style.setFontStyle(titleObj, element)
                            break
                        case 'contentFont':
                            IDM.style.setFontStyle(contentObj, element)
                            break
                        // 按钮样式
                        case 'btnBox':
                            IDM.style.setBoxStyle(buttonObj, element)
                            break
                        case 'btnBorder':
                            IDM.style.setBorderStyle(buttonObj, element, true)
                            break
                        case 'btnFont':
                            IDM.style.setFontStyle(buttonObj, element, true)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .communication-tab-common', tabObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .communication-tab-no-active', tabNoActiveObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .communication-tab-active', tabActiveObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .communication-tab-title', titleObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .communication-tab-content', contentObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .communication-tab-button', buttonObj)
            this.initData()
        },
        /**
         * 主题颜色
         */
        convertThemeListAttrToStyleObject() {
            var themeList = this.propData.themeList
            if (!themeList) {
                return
            }
            const themeNamePrefix =
                IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
                    ? IDM.setting.applications.themeNamePrefix
                    : 'idm-theme-'
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i]
                const mainBgColorObj = {
                        'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                    },
                    mainBorderColor = {
                        'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                    },
                    mainColor = {
                        color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                    },
                    minorBgColorObj = {
                        'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.minorColor.hex8) : ''
                    }
                IDM.setStyleToPageHead(
                    '.' +
                        themeNamePrefix +
                        item.key +
                        (` #${this.moduleObject.id}` || 'module_demo') +
                        ' .communication-tab-active',
                    mainBgColorObj
                )
                IDM.setStyleToPageHead(
                    '.' +
                        themeNamePrefix +
                        item.key +
                        (` #${this.moduleObject.id}` || 'module_demo') +
                        ' .communication-tab-no-active',
                    minorBgColorObj
                )
                IDM.setStyleToPageHead(
                    '.' +
                        themeNamePrefix +
                        item.key +
                        (` #${this.moduleObject.id}` || 'module_demo') +
                        ' .communication-tab-tip',
                    mainColor
                )
                IDM.setStyleToPageHead(
                    '.' +
                        themeNamePrefix +
                        item.key +
                        (` #${this.moduleObject.id}` || 'module_demo') +
                        ' .communication-tab-button',
                    { ...mainBorderColor, ...mainColor }
                )
            }
        },
        handleButtonClick() {
            if (this.propData.btnClickFunction && this.propData.btnClickFunction.length > 0) {
                var params = this.commonParam()
                this.propData.btnClickFunction.forEach((el) => {
                    const funcName = el.name
                    window[funcName].call(this, {
                        ...params,
                        ...this
                    })
                })
                return
            }
        },
        reload() {
            //请求数据源
            this.initData()
        },
        handleTabChange(item) {
            this.defaultKey = item.tabKey
        },
        initData() {
            if (!this.propData.tabList || this.propData.tabList.length === 0) return
            this.componentTab = this.propData.tabList
            const defaultItem = this.componentTab.find((el) => el.isActive)
            if (defaultItem) {
                this.defaultKey = defaultItem.tabKey
            } else {
                this.defaultKey = this.componentTab[0].tabKey
            }
            this.componentData = communicationTabData

            let that = this
            //所有地址的url参数转换
            var params = that.commonParam()
            switch (this.propData.dataSourceType) {
                case 'customInterface':
                    this.propData.customInterfaceUrl &&
                        window.IDM.http
                            .get(this.propData.customInterfaceUrl, params)
                            .then((res) => {
                                //res.data

                                that.$set(
                                    this,
                                    'componentData',
                                    that.getExpressData('resultData', that.propData.dataFiled, res.data)
                                )
                                // that.propData.fontContent = ;
                            })
                            .catch(function (error) {})
                    break
                case 'pageCommonInterface':
                    //使用通用接口直接跳过，在setContextValue执行
                    break
                case 'customFunction':
                    if (this.propData.customFunction && this.propData.customFunction.length > 0) {
                        var resValue = ''
                        try {
                            resValue =
                                window[this.propData.customFunction[0].name] &&
                                window[this.propData.customFunction[0].name].call(this, {
                                    ...params,
                                    ...this.propData.customFunction[0].param,
                                    moduleObject: this.moduleObject
                                })
                        } catch (error) {}
                        that.componentData = resValue
                    }
                    break
            }
        },
        receiveBroadcastMessage(object) {
            console.log('组件收到消息', object)
            if (object.type && object.type == 'linkageShowModule') {
                this.showThisModuleHandle()
            } else if (object.type && object.type == 'linkageHideModule') {
                this.hideThisModuleHandle()
            }
        },
        setContextValue(object) {
            console.log('统一接口设置的值', object)
            if (object.type != 'pageCommonInterface') {
                return
            }
            //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
            if (object.key == this.propData.dataName) {
                // this.propData.fontContent = this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data);
                this.$set(this, 'componentData', this.getExpressData('resultData', this.propData.dataFiled, this.data))
            }
        },
        sendBroadcastMessage(object) {
            window.IDM.broadcast && window.IDM.broadcast.send(object)
        },
        /**
         * 通用的url参数对象
         * 所有地址的url参数转换
         */
        commonParam() {
            let urlObject = IDM.url.queryObject()
            var params = {
                pageId:
                    window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : '',
                urlData: JSON.stringify(urlObject)
            }
            return params
        }
    }
}
</script>

<style lang="scss" scoped>
.communication-tab-container {
    .communication-tab-common:last-child {
        margin-right: 0 !important;
    }
    .communication-tab-common:first-child {
        margin-left: 0 !important;
    }
}
</style>
