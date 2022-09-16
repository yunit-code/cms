<template>
    <div idm-ctrl="idm_module" class="d-flex align-c" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="d-flex align-c" v-if="propData.isShowIcon">
            <svg v-if="propData.icon && propData.icon.length" class="breadcrumb-icon" aria-hidden="true">
                <use :xlink:href="`#${propData.icon[0]}`"></use>
            </svg>
            <svg-icon v-else icon-class="location" className="breadcrumb-icon"></svg-icon>
        </div>
        <div class="breadcrumb-tip">{{ propData.tipText }}</div>
        <a-breadcrumb class="breadcrumb-container">
            <span slot="separator" class="breadcrumb-separator">{{ propData.separator }}</span>
            <a-breadcrumb-item
                v-for="(item, index) in componentData.rows"
                :key="index"
                class="cursor-p"
                @click.native="handleItemClick(item)"
                >{{ item.title }}</a-breadcrumb-item
            >
        </a-breadcrumb>
    </div>
</template>
<script>
import { breadcrumbData } from '../mock/mockData'
export default {
    name: 'IBreadcrumb',
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
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject()
        this.convertThemeListAttrToStyleObject()
    },
    methods: {
        /**
         * 通用的url参数对象
         * 所有地址的url参数转换
         */
        commonParam() {
            let urlObject = IDM.url.queryObject()
            var params = {
                pageId:
                    window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : '',
                ...urlObject
            }
            return params
        },
        handleItemClick(item) {
            if (this.moduleObject.env === 'develop') return
            if (this.propData.customClickFunction && this.propData.customClickFunction.length > 0) {
                this.propData.customClickFunction.forEach((el) => {
                    const funcName = el.name
                    window[funcName].call(this, {
                        ...el.param,
                        ...this,
                        ...item
                    })
                })
                return
            }
            if (item.jumpUrl) {
                const url = IDM.url.getWebPath(item.jumpUrl)
                window.open(url, this.propData.jumpStyle || '_blank')
            }
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.convertAttrToStyleObject()
            this.convertThemeListAttrToStyleObject()
        },
        convertAttrToStyleObject() {
            const styleObject = {},
                iconObj = {},
                separatorObj = {},
                tipFontObj = {},
                breadcrumbFontObj = {},
                breadcrumbLastFontObj = {}
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
                        // 图标样式
                        case 'iconColor':
                            if (element && element.hex8) {
                                iconObj['fill'] = IDM.hex8ToRgbaString(element.hex8) + ' !important'
                            }
                            break
                        case 'iconSize':
                            iconObj['width'] = element + 'px'
                            iconObj['height'] = element + 'px'
                            iconObj['font-size'] = element + 'px'
                            break
                        case 'separatorColor':
                            if (element && element.hex8) {
                                separatorObj['color'] = element.hex8
                            }
                            break
                        // 提示文字
                        case 'tipFont':
                            IDM.style.setFontStyle(tipFontObj, element)
                            break
                        // 面包屑文字
                        case 'breadcrumbFont':
                            IDM.style.setFontStyle(breadcrumbFontObj, element)
                            break
                        case 'breadcrumbLastFont':
                            IDM.style.setFontStyle(breadcrumbLastFontObj, element, true)
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .breadcrumb-icon', iconObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .breadcrumb-separator', separatorObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .breadcrumb-tip', tipFontObj)
            window.IDM.setStyleToPageHead(
                this.moduleObject.id + ' .ant-breadcrumb .ant-breadcrumb-link',
                breadcrumbFontObj
            )
            window.IDM.setStyleToPageHead(
                this.moduleObject.id + ' .ant-breadcrumb>span:last-child .ant-breadcrumb-link',
                breadcrumbLastFontObj
            )
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
                let bgColorObj = {
                    fill: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
                    color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                IDM.setStyleToPageHead(
                    IDM.style.generateClassName(
                        '.' + themeNamePrefix + item.key + (` #${this.moduleObject.id}` || 'module_demo'),
                        [
                            ' .breadcrumb-icon',
                            ' .ant-breadcrumb>span:last-child .ant-breadcrumb-link',
                            ' .ant-breadcrumb .ant-breadcrumb-link:hover'
                        ]
                    ),
                    bgColorObj
                )
            }
        },
        reload() {
            //请求数据源
            this.initData()
        },
        initData() {
            if (this.moduleObject.env === 'develop') {
                this.componentData.rows = breadcrumbData
                return
            }
            this.propData.customInterfaceUrl &&
                window.IDM.http
                    .get(this.propData.customInterfaceUrl, {
                        columnId: this.propData.selectColumn ? this.propData.selectColumn.id : this.commonParam().columnId
                    })
                    .then((res) => {
                        if (res.status == 200 && res.data.code == 200) {
                            if (res.data.data.rows && res.data.data.rows.length > 1) {
                                res.data.data.rows = res.data.data.rows.sort((a, b) => a.index - b.index)
                            }
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
        }
    }
}
</script>

<style lang="scss" scoped>
.breadcrumb-icon {
    margin: 0 5px 0 0;
}
</style>
