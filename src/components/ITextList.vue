<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="text-list-up" v-if="propData.isShowUpTitle">
            <div class="text-list-up-title">{{ componentData.upTitle.title }}</div>
            <div class="text-list-up-content">{{ componentData.upTitle.content }}</div>
        </div>
        <div
            v-for="(item, index) in componentData.rows"
            :key="index"
            @click="handleItemClick(item)"
            class="text-list-item d-flex align-c"
        >
            <div
                class="d-flex align-c text-list-left"
                v-if="propData.styleType === 'iconAndTextAndTime' || propData.styleType === 'iconAndText'"
            >
                <svg
                    v-if="propData.titleIcon && propData.titleIcon.length"
                    class="text-list-left-icon"
                    aria-hidden="true"
                >
                    <use :xlink:href="`#${propData.titleIcon[0]}`"></use>
                </svg>
                <svg-icon v-else icon-class="yuan" className="text-list-left-icon"></svg-icon>
            </div>
            <div v-if="propData.styleType === 'timeAndText'" class="text-list-time d-flex align-c">
                {{ item.time }} |
            </div>
            <div class="flex-1 d-flex align-c">
                <div class="over-h text-list-title">{{ item.title }}</div>
            </div>
            <div
                v-if="propData.styleType === 'textAndTime' || propData.styleType === 'iconAndTextAndTime'"
                class="text-list-time"
            >
                {{ item.time }}
            </div>
        </div>
    </div>
</template>
<script>
import { textListData, textListData3 } from '../mock/mockData'
import listMixins from '../mixins/listMixins'
export default {
    name: 'ITextList',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                fontContent: 'Hello Word'
            },
            componentData: {
                rows: []
            }
        }
    },
    mixins: [listMixins],
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
                iconObj = {},
                itemStyleObj = {},
                titleObj = {},
                timeObj = {},
                upTitleObj = {},
                upContentObj = {},
                leftObj = {}
            if (this.propData.bgSize && this.propData.bgSize == 'custom') {
                styleObject['background-size'] =
                    (this.propData.bgSizeWidth
                        ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal
                        : 'auto') +
                    ' ' +
                    (this.propData.bgSizeHeight
                        ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal
                        : 'auto')
            } else if (this.propData.bgSize) {
                styleObject['background-size'] = this.propData.bgSize
            }
            if (this.propData.positionX && this.propData.positionX.inputVal) {
                styleObject['background-position-x'] =
                    this.propData.positionX.inputVal + this.propData.positionX.selectVal
            }
            if (this.propData.positionY && this.propData.positionY.inputVal) {
                styleObject['background-position-y'] =
                    this.propData.positionY.inputVal + this.propData.positionY.selectVal
            }
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
                        case 'bgImgUrl':
                            styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`
                            break
                        case 'positionX':
                            //背景横向偏移

                            break
                        case 'positionY':
                            //背景纵向偏移

                            break
                        case 'bgRepeat':
                            //平铺模式
                            styleObject['background-repeat'] = element
                            break
                        case 'bgAttachment':
                            //背景模式
                            styleObject['background-attachment'] = element
                            break
                        case 'border':
                            IDM.style.setBorderStyle(styleObject, element)
                            break
                        // 图标样式
                        case 'titleIconFontColor':
                            if (element && element.hex8) {
                                iconObj['fill'] = IDM.hex8ToRgbaString(element.hex8) + ' !important'
                            }
                            break
                        case 'titleIconFontSize':
                            iconObj['width'] = element + 'px'
                            iconObj['height'] = element + 'px'
                            iconObj['font-size'] = element + 'px'
                            break
                        // 单项样式
                        case 'itemBgColor':
                            if (element && element.hex8) {
                                itemStyleObj['background-color'] = element.hex8
                            }
                            break
                        case 'itemBox':
                            IDM.style.setBoxStyle(itemStyleObj, element)
                            break
                        case 'itemBorder':
                            IDM.style.setBorderStyle(itemStyleObj, element)
                            break
                        case 'iconBox':
                            IDM.style.setBoxStyle(leftObj, element)
                            break
                        // 标题样式
                        case 'titleBox':
                            IDM.style.setBoxStyle(titleObj, element)
                            break
                        case 'titleFont':
                            IDM.style.setFontStyle(titleObj, element)
                            break
                        // 时间样式
                        case 'timeBox':
                            IDM.style.setBoxStyle(timeObj, element)
                            break
                        case 'timeFont':
                            IDM.style.setFontStyle(timeObj, element)
                            break
                        case 'upTitleBox':
                            IDM.style.setBoxStyle(upTitleObj, element)
                            break
                        case 'upTitleFont':
                            IDM.style.setFontStyle(upTitleObj, element)
                            break
                        case 'upContentBox':
                            IDM.style.setBoxStyle(upContentObj, element)
                            break
                        case 'upContentFont':
                            IDM.style.setFontStyle(upContentObj, element)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .text-list-left-icon', iconObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .text-list-item', itemStyleObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .text-list-title', titleObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .text-list-time', timeObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .text-list-up-title', upTitleObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .text-list-up-content', upContentObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .text-list-left', leftObj)
            this.initData()
        },
        reload() {
            //请求数据源
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
                let fillColorObj = {
                    fill: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                IDM.setStyleToPageHead(
                    '.' +
                        themeNamePrefix +
                        item.key +
                        (` #${this.moduleObject.id}` || 'module_demo') +
                        ' .text-list-left-icon',
                    fillColorObj
                )
            }
        },
        handleItemClick(item) {
            if (this.moduleObject.env === 'develop') return
            if (item.jumpUrl) {
                const url = IDM.url.getWebPath(item.jumpUrl)
                window.open(url, this.propData.jumpStyle || '_blank')
            }
        },
        initData() {
            if (this.moduleObject.env === 'develop') {
                if (this.propData.styleType !== 'timeAndText') {
                    this.componentData.rows = this.setFillBlankData(textListData)
                } else {
                    this.componentData.rows = this.setFillBlankData(textListData3)
                }
                return
            }
            this.propData.customInterfaceUrl &&
                window.IDM.http
                    .get(this.propData.customInterfaceUrl, {
                        columnId: this.propData.columnId,
                        start: 0,
                        limit: this.propData.contentNumber
                    })
                    .then((res) => {
                        if (res.status == 200 && res.data.code == 200) {
                            this.componentData = res.data.data
                        } else {
                            IDM.message.error(res.data.message)
                        }
                    })
                    .catch(function (error) {})
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
                this.$set(
                    this.propData,
                    'fontContent',
                    this.getExpressData(this.propData.dataName, this.propData.dataFiled, object.data)
                )
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
