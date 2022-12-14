<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <a-row :gutter="[propData.horizontalGutter, propData.verticalGutter]">
            <a-col :span="propData.itemSpan || 1" v-for="(item, index) in componentData.rows" :key="index" @click="handleItemClick(item)">
                <div
                    class="image-list-item d-flex just-b"
                    :class="[propData.styleType === 'horizontal' ? 'align-c' : 'flex-d-c']"
                >
                    <img :src="IDM.url.getWebPath(item.image)" alt="图片加载失败" class="image-list-image" />
                    <div class="image-list-container">
                        <div class="image-list-title text-o-e-1" v-if="propData.styleType === 'horizontal'">
                            {{ item.title }}
                        </div>
                        <div class="image-list-desc text-o-e-2">{{ item.desc }}</div>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
<script>
import { getImageListData } from '../mock/mockData'
import listMixins from '../mixins/listMixins'
export default {
    name: 'IImageList',
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
    },
    mixins: [listMixins],
    methods: {
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.convertAttrToStyleObject()
        },
        handleItemClick(item) {
            if (this.moduleObject.env === 'develop') return
            if(item.jumpUrl) {
                const url = IDM.url.getWebPath(item.jumpUrl)
                window.open(url, this.propData.jumpStyle || '_blank')
            }
        },
        convertAttrToStyleObject() {
            const styleObject = {},
                itemObj = {},
                imageObj = {},
                textContainerObj = {},
                titleFontObj = {},
                descFontObj = {}
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
                        case 'border':
                            IDM.style.setBorderStyle(styleObject, element)
                            break
                        // 单列样式
                        case 'itemBox':
                            IDM.style.setBoxStyle(itemObj, element)
                            break
                        case 'itemBoxShadow':
                            itemObj['box-shadow'] = element
                            break
                        // 图片样式
                        case 'imgWidth':
                            imageObj['width'] = element
                            break
                        case 'imgHeight':
                            imageObj['height'] = element
                            break
                        case 'imgBorder':
                            IDM.style.setBorderStyle(imageObj, element)
                            break
                        // 文字边距
                        case 'fontBox':
                            IDM.style.setBoxStyle(textContainerObj, element)
                            break
                        case 'titleFont':
                            IDM.style.setFontStyle(titleFontObj, element)
                            break
                        case 'descFont':
                            IDM.style.setFontStyle(descFontObj, element)
                            break
                        case 'descClamp':
                            descFontObj['line-clamp'] = element
                            descFontObj['-webkit-line-clamp'] = element
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .image-list-item', itemObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .image-list-image', imageObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .image-list-container', textContainerObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .image-list-title', titleFontObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .image-list-desc', descFontObj)
            this.initData()
        },
        reload() {
            //请求数据源
            this.initData()
        },
        initData() {
            if (this.moduleObject.env === 'develop') {
                this.componentData.rows = getImageListData.call(this)
                return
            }
            this.propData.customInterfaceUrl &&
                window.IDM.http
                    .get(this.propData.customInterfaceUrl, {
                        ...this.commonParam(),
                        columnId: this.propData.selectColumn ? this.propData.selectColumn.id : this.commonParam().columnId,
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

<style lang="scss" scoped>
.image-list-image {
    width: 100%;
}
.ant-col-5 {
    display: flex;
    width: 20%;
}
.image-list-container {
    width: 100%;
}
.image-list-title {
    margin: 0 0 10px 0;
}
</style>
