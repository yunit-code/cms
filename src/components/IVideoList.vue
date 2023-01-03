<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <a-row :gutter="[propData.horizontalGutter, propData.verticalGutter]">
            <a-col :span="propData.itemSpan || 1" v-for="(item, index) in componentData.rows" :key="index">
                <div class="video-list-item">
                    <div class="video-list-image-container position-r">
                        <img :src="IDM.url.getWebPath(item.poster)" alt="封面加载失败" class="video-list-image" />
                        <div class="video-list-play-button-container d-flex just-c align-c">
                            <svg-icon
                                icon-class="play"
                                className="video-list-play-button"
                                @click.stop.native="handlePlay(item)"
                            ></svg-icon>
                        </div>
                    </div>
                    <div class="video-list-desc text-o-e-1">{{ item.desc }}</div>
                </div>
            </a-col>
        </a-row>
        <a-modal
            :bodyStyle="{ padding: 0, lineHeight: 0 }"
            :visible="visible"
            @cancel="() => (visible = false)"
            title="视频播放"
            width="720px"
            :footer="null"
        >
            <video
                :src="currentVideo.video"
                width="100%"
                loop
                controls
                preload
                :poster="IDM.url.getWebPath(currentVideo.poster)"
            ></video>
        </a-modal>
    </div>
</template>
<script>
import { getVideoListData } from '../mock/mockData'
import listMixins from '../mixins/listMixins'
export default {
    name: 'IVideoList',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {},
            componentData: {
                rows: []
            },
            visible: false,
            currentVideo: { video: '', poster: '' }
        }
    },
    mixins: [listMixins],
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject()
    },
    methods: {
        handlePlay(item) {
            console.log(item)
            this.currentVideo = item
            this.visible = true
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.convertAttrToStyleObject()
        },
        convertAttrToStyleObject() {
            const styleObject = {},
                itemObj = {},
                imageObj = {},
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
                            IDM.style.setBoxStyle(descFontObj, element)
                            break
                        case 'descFont':
                            IDM.style.setFontStyle(descFontObj, element)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .video-list-item', itemObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .video-list-image-container', imageObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .video-list-desc', descFontObj)
            this.initData()
        },
        reload() {
            //请求数据源
            this.initData()
        },
        initData() {
            if (this.moduleObject.env != 'production' && this.moduleObject.env != 'customize') {
                this.componentData.rows = getVideoListData.call(this)
                return
            }
            console.log(555,this.moduleObject.env)
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
.video-list-image {
    width: inherit;
    height: inherit;
}
.video-list-play-button-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.2);
    .video-list-play-button {
        fill: #ffffff;
        width: 50px;
        height: 50px;
        cursor: pointer;
    }
}
</style>
