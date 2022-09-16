<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <swiper ref="mySwiper" class="swiper" :options="swiperOption">
            <swiper-slide
                v-for="(item, index) in componentData.rows"
                :key="index"
                class="image-scroll-swiper-item position-r d-flex just-c"
                @click.native="handleClick(item, index)"
            >
                <img :src="IDM.url.getWebPath(item.image)" class="image-scroll" alt="图片加载失败" />
                <div class="image-scroll-title text-o-e-1">{{ item.describe }}</div>
            </swiper-slide>
        </swiper>
        <div class="swiper-button-prev swiper-button-white"></div>
        <div class="swiper-button-next swiper-button-white"></div>
    </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { getImageScrollData } from '../mock/mockData'
import listMixins from '../mixins/listMixins'
export default {
    name: 'IImageScroll',
    components: {
        Swiper,
        SwiperSlide
    },
    mixins: [listMixins],
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                fontContent: 'Hello Word'
            },
            swiperOption: {
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                speed: 500,
                slidesPerView: 5,
                slidesPerGroup: 2,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            },
            componentData: {
                rows: []
            }
        }
    },
    watch: {
        propData: {
            immediate: false,
            deep: true,
            handler(newV) {
                this.$nextTick(() => {
                    this.$refs.mySwiper.$swiper.params['slidesPerGroup'] = newV.slidesPerGroup
                    this.$refs.mySwiper.$swiper.params['autoplay'] = {
                        delay: newV.delay || 3000,
                        disableOnInteraction: false
                    }
                })
                this.$refs.mySwiper.$swiper.update()
                console.log(this.$refs.mySwiper.$swiper)
            }
        }
    },
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject()
    },
    methods: {
        handleClick(item) {
            if (this.moduleObject.env === 'develop') return
            if (item.jumpUrl) {
                const url = IDM.url.getWebPath(item.jumpUrl)
                window.open(url, this.propData.jumpStyle || '_blank')
            }
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.convertAttrToStyleObject()
        },
        convertAttrToStyleObject() {
            const styleObject = {},
                titleObj = {}
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
                        case 'titleFont':
                            IDM.style.setFontStyle(titleObj, element)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .image-scroll-title', titleObj)
            this.initData()
        },
        reload() {
            //请求数据源
            this.initData()
        },
        initData() {
            if (this.moduleObject.env === 'develop') {
                this.componentData.rows = getImageScrollData.call(this)
                return
            }
            this.propData.customInterfaceUrl &&
                window.IDM.http
                    .get(this.propData.customInterfaceUrl, {
                        ...this.commonParam(),
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
.image-scroll {
    width: 92%;
    margin: 0 auto;
}
.image-scroll-swiper-item {
    &:hover {
        .image-scroll-title {
            bottom: 0;
        }
    }
}
.image-scroll-title {
    width: 92%;
    transition: all 0.5s;
    position: absolute;
    left: 4%;
    bottom: -30px;
    background: rgba($color: #000000, $alpha: 0.2);
    color: #fff;
}
.swiper-button-prev,
.swiper-button-next {
    top: 55%;
    width: 30px;
    height: 30px;
    border-radius: 50px;
    background: rgba(0, 0, 0, 0.2);
    padding: 10px;
}
.swiper-button-next:after,
.swiper-button-prev:after {
    font-size: 15px;
    font-weight: 600;
}
</style>
