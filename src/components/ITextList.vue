<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-text-list">
        <div class="text-list-up-title d-flex position-r" v-if="propData.isShowUpTitle">
            <div class="text-list-up-content">{{ componentData.title }}</div>
        </div>
        <div @click="clickProps($event)">
            <VueScroll
                v-show="propData.isScroll"
                ref="seamlessScroll"
                class="idm-text-list-wrap"
                :class-option="scrollOption"
                :data="componentData.rows"
            >
                <div
                    v-for="(item, index) in componentData.rows"
                    :key="index"
                    :id="index + 1"
                    :data-obj="JSON.stringify(item)"
                    class="text-list-item cursor-p"
                >
                    <div class="d-flex" :class="[propData.isTimeWrap ? '' : 'align-c']">
                        <div
                            class="d-flex align-c text-list-left"
                            v-if="propData.styleType === 'iconAndTextAndTime' || propData.styleType === 'iconAndText'"
                        >
                            <svg
                                v-if="propData.titleIcon && propData.titleIcon.length"
                                class="text-list-left-icon"
                                aria-hidden="true"
                                :data-obj="JSON.stringify(item)"
                            >
                                <use :data-obj="JSON.stringify(item)" :xlink:href="`#${propData.titleIcon[0]}`"></use>
                            </svg>
                            <svg-icon
                                :data-obj="JSON.stringify(item)"
                                v-else
                                icon-class="yuan"
                                className="text-list-left-icon"
                            ></svg-icon>
                        </div>
                        <div
                            :data-obj="JSON.stringify(item)"
                            v-if="propData.styleType === 'timeAndText'"
                            class="text-list-time d-flex align-c"
                        >
                            {{ item.time }} |
                        </div>
                        <div class="flex-1 d-flex align-c">
                            <div class="text-list-title text-o-e-2" :data-obj="JSON.stringify(item)">
                                {{ item.title }}
                            </div>
                        </div>
                        <div
                            :data-obj="JSON.stringify(item)"
                            v-if="
                                !propData.isTimeWrap &&
                                (propData.styleType === 'textAndTime' || propData.styleType === 'iconAndTextAndTime')
                            "
                            class="text-list-time"
                        >
                            {{ item.time }}
                        </div>
                    </div>
                    <div
                        :data-obj="JSON.stringify(item)"
                        v-if="
                            propData.isTimeWrap &&
                            (propData.styleType === 'textAndTime' || propData.styleType === 'iconAndTextAndTime')
                        "
                        class="text-list-time"
                    >
                        {{ item.time }}
                    </div>
                </div>
            </VueScroll>
        </div>
        <div v-show="!propData.isScroll">
            <div
                v-for="(item, index) in componentData.rows"
                :key="index"
                @click="handleItemClick(item)"
                class="text-list-item cursor-p"
            >
                <div class="d-flex" :class="[propData.isTimeWrap ? '' : 'align-c']">
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
                        <div class="text-list-title text-o-e-2">{{ item.title }}</div>
                    </div>
                    <div
                        v-if="
                            !propData.isTimeWrap &&
                            (propData.styleType === 'textAndTime' || propData.styleType === 'iconAndTextAndTime')
                        "
                        class="text-list-time"
                    >
                        {{ item.time }}
                    </div>
                </div>
                <div
                    v-if="
                        propData.isTimeWrap &&
                        (propData.styleType === 'textAndTime' || propData.styleType === 'iconAndTextAndTime')
                    "
                    class="text-list-time"
                >
                    {{ item.time }}
                </div>
            </div>
        </div>
        <div class="d-flex just-c position-r">
            <a-pagination
                class="text-list-pagination"
                v-model="currentPage"
                v-if="propData.isShowPagination"
                show-quick-jumper
                :page-size="propData.contentNumber"
                :total="componentData.total"
                @change="onChange"
            />
        </div>
    </div>
</template>
<script>
import { textListData, textListData3 } from '../mock/mockData'
import listMixins from '../mixins/listMixins'
import VueScroll from 'vue-seamless-scroll'
export default {
    name: 'ITextList',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                fontContent: 'Hello Word'
            },
            currentPage: 1,
            componentList: [],
            componentData: {
                rows: [{ title: '' }],
                total: 0,
                title: ''
            }
        }
    },
    components: {
        VueScroll
    },
    computed: {
        scrollOption() {
            return {
                step: 0.2, // 数值越大速度滚动越快
                limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
                hoverStop: true, // 是否开启鼠标悬停stop
                direction: 1, // 0向下 1向上 2向左 3向右
                openWatch: true, // 开启数据实时监控刷新dom
                singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
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
        clickProps(e) {
            console.log(e.target)
            if (e.target.dataset.obj) {
                let item = JSON.parse(e.target.dataset.obj)
                this.handleItemClick(item)
            }
        },
        onChange() {
            this.initData()
        },
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
                leftObj = {},
                paginationObj = {},
                scrollObj = {}
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
                        case 'minHeight':
                            styleObject['min-height'] = element
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
                        case 'titleClamp':
                            titleObj['line-clamp'] = element
                            titleObj['-webkit-line-clamp'] = element
                            break
                        // 时间样式
                        case 'timeBox':
                            IDM.style.setBoxStyle(timeObj, element)
                            break
                        case 'timeFont':
                            IDM.style.setFontStyle(timeObj, element)
                            break
                        case 'upTitleBorder':
                            IDM.style.setBorderStyle(upTitleObj, element)
                            break
                        case 'upTitleBox':
                            IDM.style.setBoxStyle(upTitleObj, element)
                            break
                        case 'upTitleFont':
                            IDM.style.setFontStyle(upTitleObj, element)
                            break

                        case 'upContentBorder':
                            IDM.style.setBorderStyle(upContentObj, element)
                            break
                        case 'upContentBox':
                            IDM.style.setBoxStyle(upContentObj, element)
                            break
                        case 'upContentFont':
                            IDM.style.setFontStyle(upContentObj, element)
                            break
                        case 'paginationBox':
                            IDM.style.setBoxStyle(paginationObj, element)
                            break
                        case 'scrollHeight':
                            scrollObj['height'] = element
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
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .text-list-pagination', paginationObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-text-list-wrap', scrollObj)
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
                IDM.setStyleToPageHead(
                    '.' +
                        themeNamePrefix +
                        item.key +
                        (` #${this.moduleObject.id}` || 'module_demo') +
                        ' .text-list-up-content',
                    {
                        color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
                        'border-bottom-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                    }
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
            const hasNotDataSourceId = !this.propData.selectColumn || !this.propData.selectColumn.id
            if (hasNotDataSourceId && !this.commonParam().columnId) {
                let itemData = null,
                    list = []
                if (this.propData.styleType !== 'timeAndText') {
                    itemData = _.cloneDeep(textListData.rows[0])
                } else {
                    itemData = _.cloneDeep(textListData3.rows[0])
                }
                this.componentData = textListData
                this.componentData.total = this.propData.contentNumber
                list.length = this.propData.contentNumber || 1
                list.fill(itemData)
                this.$set(this.componentData, 'rows', list)
                this.$nextTick(() => {
                    this.$refs.seamlessScroll.reset()
                })
                return
            }
            this.propData.customInterfaceUrl &&
                window.IDM.http
                    .get(this.propData.customInterfaceUrl, {
                        columnId:
                            this.propData.selectColumn && this.propData.selectColumn.id
                                ? this.propData.selectColumn.id
                                : this.commonParam().columnId,
                        start: this.currentPage,
                        limit: this.propData.contentNumber
                    })
                    .then((res) => {
                        if (res.status == 200 && res.data.code == 200) {
                            this.componentData = res.data.data
                            this.$nextTick(() => {
                                this.$refs.seamlessScroll.reset()
                            })
                        } else {
                            IDM.message.error(res.data.message)
                        }
                    })
                    .catch(function (error) {})
        },
        receiveBroadcastMessage(object) {
            console.log('组件收到消息', object)
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
.idm-text-list::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
    scrollbar-width: none;
}
.idm-text-list-wrap::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
    scrollbar-width: none;
}

.idm-text-list {
    overflow: hidden;
    overflow-y: auto;
}
.position-r {
    position: relative;
    z-index: 1;
}
</style>
