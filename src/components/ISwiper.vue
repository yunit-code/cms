<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" class="ISwiper_app" :idm-ctrl-id="moduleObject.id" >
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div v-for="(item) in data_list" :key="item.id" class="swiper-slide">
                    <img @click="jumpPage(item)" v-if="item.image" :src="item.image" />
                </div>
            </div>
            <div v-if="propData.direction == 'horizontal'" class="swiper-pagination"></div>
        </div>
        <div v-if="propData.direction == 'horizontal' && propData.showTitle" class="describe_horizontal" :class="propData.titlePosition == 'inner' ? 'describe_horizontal_inner' : 'describe_horizontal_outer'">
            <div class="title">{{ data_list[this.active_index] ? data_list[this.active_index].title : '' }}</div>
            <div v-if="propData.showTitleTime" class="time">{{ data_list[this.active_index] ? data_list[this.active_index].time : '' }}</div>
        </div>
        <div v-if="propData.direction == 'vertical' && propData.showTitle" class="describe_vertical">
            <div v-for="(item,index) in data_list" @click.stop="onClickDescribe(item,index)" :key="index" class="describe_list" :class="index == active_index ? 'describe_list_active' : ''">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script>
import 'swiper/js/swiper'
import 'swiper/css/swiper.css'
import Swiper from "swiper"
export default {
    name: 'ISwiper',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                direction: 'horizontal',
                baseColumn: '',//指定显示哪个栏目下的图片新闻
                pictureNumber: '',
                intervalTime: '',
                interchargeEffect: '',
                showTitle: true,
                objectFit: 'fill',
                height: '400px',
                heightImg: '100%',
                titlePosition: 'inner'
            },
            data_list: [ ],
            my_swiper: null,
            active_index: 0,
            parentHeight: '',
        }
    },
    props: {
    },
    watch: {
        'propData.direction': {
            handler: function(value) {
                this.active_index = 0;
                if ( this.moduleObject.env == 'develop' ) {
                    this.updateSwiper()
                }
            },
            deep: true
        },
        'propData.selectColumn': {
            handler: function(value) {
                this.getSwiperList()
            },
            deep: true
        },
        'propData.limit': {
            handler: function(value) {
                this.getSwiperList()
            },
            deep: true
        }
    },
    created() {
        this.moduleObject = this.$root.moduleObject;
        this.convertAttrToStyleObject();
    },
    mounted() {
        this.getSwiperList()
    },
    destroyed() { },
    methods: {
        jumpPage(item) {
            if ( (!item) || !item.jumpUrl || this.moduleObject.env == 'develop' ) {
                return
            }
            let url = IDM.url.getWebPath(item.jumpUrl);
            window.open(url, this.propData.jumpStyle || '_self')
        },
        getSwiperList() {
            console.log('获取swiper数据')
            if( (!this.propData.selectColumn) || (!this.propData.selectColumn.length) || !this.propData.customInterfaceUrl ){
                let data_list = [
                    {
                        image: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
                        title: '1-习近平：在庆祝中国共产党成立100周年大会上的讲话'
                    },
                    {
                        image: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
                        title: '2-习近平：在庆祝中国共产党成立100周年大会上的讲话'
                    },
                    {
                        image: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
                        title: '3-习近平：在庆祝中国共产党成立100周年大会上的讲话'
                    }
                ];
                if ( this.propData.limit ) {
                    this.data_list = data_list.splice(0,parseInt(this.propData.limit));
                } else {
                    this.data_list = data_list;
                }
                if ( this.moduleObject.env != 'develop' ) {
                    this.$nextTick(() => {
                        this.initSwiper()
                    })
                }
                return;
            }
            let urlParam = this.commonParam()
            let columnId = '';
            let columnId_arr = [];
            if ( this.propData.selectColumn && this.propData.selectColumn.length ) {
                columnId_arr = this.propData.selectColumn.map((item) => item.id);
                columnId = columnId_arr.join(',');
            }

            IDM.http.get(this.propData.customInterfaceUrl,{
                pageId: urlParam.pageId,
                componentId: this.moduleObject.comId,
                columnId: columnId,
                limit: this.propData.limit
            }).then((res) => {
                if (res && res.data && res.data.code == '200' && res.data.data ) {
                    let result = this.propData.dataFiled ? this.getExpressData('resultData',this.propData.dataFiled,res.data.data) : res.data.data.rows;
                    this.data_list = result || [];
                    if ( this.moduleObject.env != 'develop' ) {
                        this.$nextTick(() => {
                            this.initSwiper()
                        })
                    }
                } else {
                    IDM.message.error(res.data.message);
                }
            })
        },
        updateSwiper() {
            if ( this.my_swiper ) {
                try {
                    this.my_swiper.destroy(true,true)
                } catch (error) {
                    if ( !this.my_swiper ) {
                        this.initSwiper()
                    }
                    return
                }
            } 
            this.initSwiper()
        },
        initSwiper() {
            let that = this;
            let my_swiper = new Swiper('.swiper-container', {
                direction: this.propData.direction || 'horizontal',
                loop: true,
                autoplay: {
                    delay: this.propData.intervalTime || 5000,
                    // disableOnInteraction: true, //*手动操作轮播图后不会暂停*
                },
                on:{
                    slideChange: function(){
                        that.active_index = that.my_swiper && that.my_swiper.realIndex ?  that.my_swiper.realIndex : 0;
                        if ( that.propData.direction == 'vertical' ) {
                            let scroll_top = ($('.describe_list') && $('.describe_list')[that.active_index]) ? $('.describe_list')[that.active_index].offsetTop : 0;
                            $('.describe_vertical') && $('.describe_vertical').scrollTop(scroll_top);
                        }
                    },
                },
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    bulletClass : 'my-bullet',
                    bulletActiveClass: 'my-bullet-active',
                }
            })
            this.my_swiper = my_swiper;
        },
        onClickDescribe(item,index) {
            if ( this.my_swiper ) {
                this.active_index = index;
                this.my_swiper.slideToLoop(index, 1000, false);
            }   
        },
        /**
         * 提供父级组件调用的刷新prop数据组件
         */
        propDataWatchHandle(propData) {
            console.log('ISwiper组件propData',propData)
            this.propData = propData.compositeAttr || {};
            this.convertAttrToStyleObject()
            if ( this.moduleObject.env == 'develop' ) {
                this.updateSwiper()
            }
        },
        
        /**
         * 把属性转换成样式对象
         */
        convertAttrToStyleObjectHorizontalTitle() {
            var styleObject = {};
            var styleObjectTitle = {};
            var styleObjectTime = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch ( key ) {
                        case "heightHorizontalTitle":
                            styleObject['height'] = element + 'px';
                            break;
                        case "positionYTitle":
                            styleObject['bottom'] = element;
                            break;
                        case "fontHorizontalTitle":
                            styleObjectTitle["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectTitle["color"] = element.fontColors.hex8;
                            }
                            styleObjectTitle["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectTitle["font-style"] = element.fontStyle;
                            styleObjectTitle["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectTitle["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectTitle["text-align"] = element.fontTextAlign;
                            styleObjectTitle["text-decoration"] = element.fontDecoration;
                            break;
                        case "fontHorizontalTime":
                            styleObjectTime["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectTime["color"] = element.fontColors.hex8;
                            }
                            styleObjectTime["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectTime["font-style"] = element.fontStyle;
                            styleObjectTime["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectTime["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectTime["text-align"] = element.fontTextAlign;
                            styleObjectTime["text-decoration"] = element.fontDecoration;
                            break;
                        case "bgColorHorizontalTitle":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "boxHorizontalTitle":
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
                        case "boxHorizontalText":
                            if (element.marginTopVal) {
                                styleObjectTitle["margin-top"] = `${element.marginTopVal}`;
                            }
                            if (element.marginRightVal) {
                                styleObjectTitle["margin-right"] = `${element.marginRightVal}`;
                            }
                            if (element.marginBottomVal) {
                                styleObjectTitle["margin-bottom"] = `${element.marginBottomVal}`;
                            }
                            if (element.marginLeftVal) {
                                styleObjectTitle["margin-left"] = `${element.marginLeftVal}`;
                            }
                            if (element.paddingTopVal) {
                                styleObjectTitle["padding-top"] = `${element.paddingTopVal}`;
                            }
                            if (element.paddingRightVal) {
                                styleObjectTitle["padding-right"] = `${element.paddingRightVal}`;
                            }
                            if (element.paddingBottomVal) {
                                styleObjectTitle["padding-bottom"] = `${element.paddingBottomVal}`;
                            }
                            if (element.paddingLeftVal) {
                                styleObjectTitle["padding-left"] = `${element.paddingLeftVal}`;
                            }
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .describe_horizontal', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .describe_horizontal .title', styleObjectTitle);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .describe_horizontal .time', styleObjectTime);
        },
        convertAttrToStyleObjectVerticalTitle() {
            var styleObject = {};
            var styleObjectActive = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch ( key ) {
                        case "widthVerticalTitle":
                            styleObject['width'] = element;
                            break;
                        case "fontVerticalTitle":
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
                        case "bgColorVerticalTitle":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "boxVerticalTitle":
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
                        case "fontVerticalTitleActive":
                            styleObjectActive["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectActive["color"] = element.fontColors.hex8;
                            }
                            styleObjectActive["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectActive["font-style"] = element.fontStyle;
                            styleObjectActive["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectActive["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectActive["text-align"] = element.fontTextAlign;
                            styleObjectActive["text-decoration"] = element.fontDecoration;
                            break;
                        case "bgColorVerticalTitleActive":
                            if (element && element.hex8) {
                                styleObjectActive["background-color"] = element.hex8;
                            }
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .describe_vertical', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .describe_vertical .describe_list_active', styleObjectActive);
        },
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectHorizontalTitle()
            this.convertAttrToStyleObjectVerticalTitle()
            var styleObject = {};
            var styleObjectImg = {};
            var styleObjectSwiper = {};
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
            if ( this.propData.objectFit ) {
                styleObjectImg['object-fit'] = this.propData.objectFit;
            }
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "width":
                            styleObject[key] = element;
                            break;
                        case "height":
                            if ( this.propData.isAdaption && this.parentHeight ) {
                                styleObject[key] = (this.parentHeight - 3) + 'px';
                            } else {
                                styleObject[key] = element;
                            }
                            break;
                        case "widthImg":
                            styleObjectSwiper['width'] = element;
                            break;
                        case "heightImg":
                            styleObjectSwiper['height'] = element;
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
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .swiper-slide img', styleObjectImg);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .swiper-container', styleObjectSwiper);
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
            console.log("ISwiper组件收到消息", object)
            if (object && object.type == "regionResize" && object.message && object.message.gridEleTarget) {
                let gridEleTarget = object.message.gridEleTarget;
                if (gridEleTarget && gridEleTarget.offsetHeight) {
                    this.parentHeight = gridEleTarget.offsetHeight;
                    this.$nextTick(() => {
                        if ( this.propData.isAdaption && gridEleTarget.offsetHeight ) {
                            this.convertAttrToStyleObject()
                        } 
                    })
                }
            }
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
                // this.data_list = this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data);
            }
        }
    }
}
</script>
<style lang="scss">
.ISwiper_app{
    // height: 400px;
    position: relative;
    .swiper-container{
        // height: 100%;
    }
    .swiper-slide{
        img{
            width: 100%;
            height: 100%;
        }
    }
    
    .swiper-pagination{
        .my-bullet{
            display: inline-block;
            width: 40px;
            height: 4px;
            margin-right: 10px;
            background: rgba(0,0,0,0.19);
            border-radius: 2px;
            &:last-child{
                margin-right: 0;
            }
        }
        .my-bullet-active{
            background: white;
        }
    }
    .describe_horizontal{
        
    }
    .describe_horizontal_inner{
        position: absolute;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        color: white;
        background: rgba(0,0,0,0.4);
    }
    .describe_vertical{
        position: absolute;
        right: 0;
        top: 0;
        width: 200px;
        height: 100%;
        color: white;
        background: rgba(0,0,0,0.4);
        z-index: 1;
        overflow-y: auto;
        .describe_list{
            // height: 100px;
            padding: 10px 15px;
            cursor: pointer;
        }
        .describe_list_active{
            background: red;
        }
    }
    .describe_vertical::-webkit-scrollbar {
        width: 0;
    }
}
</style>