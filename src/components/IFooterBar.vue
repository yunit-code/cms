<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="IFooterBar_app flex_between">
            <div class="IFooterBar_app_left flex_start">
                <div v-for="(item,index) in propData.leftLogoList" :key="index" :style="getLeftLogoStyleBox(item)" class="img_box">
                    <img :src="IDM.url.getWebPath(item.logoImgSrc)" :style="getLeftLogoStyle(item)" />
                    <!-- <img :src="item.logoImgSrc" :style="getLeftLogoStyle(item)" /> -->
                </div>
            </div>
            <div class="IFooterBar_app_center">
                <div class="IFooterBar_app_center_top flex_center">
                    <div v-for="(item,index) in propData.centerTextList" :key="index" class="list">{{ item.text }}</div>
                </div>
                <div class="drag_container" :class="moduleObject.env == 'develop' || !IDM.env_dev ? 'drag_container_outer' : ''" idm-ctrl-inner :idm-ctrl-id="moduleObject.id" idm-container-index="1">
                    
                </div>
            </div>
            <div class="IFooterBar_app_right flex_center">
                <!-- 组件内部容器 增加class="drag_container" 必选 idm-ctrl-id：组件的id，这个必须不能为空 idm-container-index  组件的内部容器索引，不重复唯一且不变，必选 -->
                <div v-if="propData.showRightContain" class="drag_container" :class="moduleObject.env == 'develop' || !IDM.env_dev ? 'drag_container_outer' : ''" idm-ctrl-inner :idm-ctrl-id="moduleObject.id" idm-container-index="2">
        
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'IFooterBar',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                leftLogoList: [
                    {
                        logoImgSrc: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
                        logoImgWidth: '50px',
                        logoImgHeight: '60px',
                        marginRight: '20px',
                        objectFit: 'cover'
                    },
                    {
                        logoImgSrc: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
                        logoImgWidth: '50px',
                        logoImgHeight: '60px',
                        marginRight: '0px',
                        objectFit: 'cover'
                    }
                ],
                centerTextList: [
                    {
                        text: '网站地图'
                    },
                    {
                        text: '联系我们'
                    }
                ],
                showRightContain: true
            },
            innerAttr:this.$root.propData.innerAttr||[],
        }
    },
    props: {
    },
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject();
    },
    mounted() {
        this.$nextTick(function (params) {
            
        });
    },
    destroyed() { },
    methods: {
        getLeftLogoStyleBox(item) {
            let styleObject = {};
            for (const key in item) {
                if (this.propData.hasOwnProperty.call(item, key)) {
                    const element = item[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "logoImgWidth":
                            styleObject["width"] = element;
                            break;
                        case "logoImgHeight":
                            styleObject["height"] = element;
                            break;
                        case "logoMarginRight":
                            styleObject["margin-right"] = element;
                            break;
                    }
                }
            }
            return styleObject;
        },
        getLeftLogoStyle(item) {
            let styleObject = {};
            for (const key in item) {
                if (this.propData.hasOwnProperty.call(item, key)) {
                    const element = item[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "objectFit":
                            styleObject["object-fit"] = element;
                            break;
                    }
                }
            }
            return styleObject;
        },
        /**
         * 提供父级组件调用的刷新prop数据组件
         */
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            this.innerAttr = propData.innerAttr||[];
            this.convertAttrToStyleObject();
        },
        /** * 把属性转换成样式对象 */
        convertAttrToStyleObjectCenterContain() {
            let styleObject = {};
            let propData = {};
            if( this.innerAttr && this.innerAttr.length>0 ){
                this.innerAttr.forEach(element => {
                    if ( element.containerIndex == '1' ) {
                        propData = element.dataAttr
                    }
                });
            }
            for (const key in propData) {
                if (propData.hasOwnProperty.call(propData, key)) {
                    const element = propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthCenterContain":
                             styleObject['width'] = element;
                            break;
                        case "heightCenterContain":
                            styleObject['height'] = element;
                            break;
                        case "boxCenterContain":
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
                        case "fontCenterContain":
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
            IDM.setStyleToPageHead(this.moduleObject.id+` .drag_container[idm-ctrl-id="${this.moduleObject.id}"][idm-container-index="${1}"]`,styleObject);
        },
        convertAttrToStyleObjectRightContain() {
            let styleObject = {};
            let propData = {};
            if( this.innerAttr && this.innerAttr.length>0 ){
                this.innerAttr.forEach(element => {
                    if ( element.containerIndex == '2' ) {
                        propData = element.dataAttr
                    }
                });
            }
            for (const key in propData) {
                if (propData.hasOwnProperty.call(propData, key)) {
                    const element = propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthRightContain":
                             styleObject['width'] = element;
                            break;
                        case "heightRightContain":
                            styleObject['height'] = element;
                            break;
                        case "boxRightContain":
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
                    }
                }
            }
            // window.IDM.setStyleToPageHead(this.moduleObject.id + " .IFooterBar_app_right>.drag_container_outer", styleObject);
            IDM.setStyleToPageHead(this.moduleObject.id+` .drag_container[idm-ctrl-id="${this.moduleObject.id}"][idm-container-index="${2}"]`,styleObject);
        },
        convertAttrToStyleObjectCenterText() {
            let styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "boxCenterTextList":
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
                        case "fontCenterTextList":
                            styleObject["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObject["color"] = element.fontColors.hex8;
                                styleObject["border-right-color"] = element.fontColors.hex8;
                            }
                            styleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObject["font-style"] = element.fontStyle;
                            styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObject["height"] = element.fontSize + element.fontSizeUnit;
                            styleObject["line-height"] = element.fontSize + element.fontSizeUnit;
                            styleObject["text-align"] = element.fontTextAlign;
                            styleObject["text-decoration"] = element.fontDecoration;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .IFooterBar_app_center .list", styleObject);
        },

        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectCenterContain()
            this.convertAttrToStyleObjectRightContain()
            this.convertAttrToStyleObjectCenterText()
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
            this.initData();
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
         * 文本点击事件
         */
        textClickHandle() {
            let that = this;
            if (this.moduleObject.env == "develop") {
                //开发模式下不执行此事件
                return;
            }
            //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
            let urlObject = window.IDM.url.queryObject(),
                pageId = window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : "";
            //自定义函数
            /**
             * [
             * {name:"",param:{}}
             * ]
             */
            var clickFunction = this.propData.clickFunction;
            clickFunction && clickFunction.forEach(item => {
                window[item.name] && window[item.name].call(this, {
                    urlData: urlObject,
                    pageId,
                    customParam: item.param,
                    _this: this
                });
            })
        },
        showThisModuleHandle() {
            this.propData.defaultStatus = "default";
        },
        hideThisModuleHandle() {
            this.propData.defaultStatus = "hidden";
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
            if (object.type && object.type == "linkageShowModule") {
                this.showThisModuleHandle();
            } else if (object.type && object.type == "linkageHideModule") {
                this.hideThisModuleHandle();
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
                // this.propData.fontContent = this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data);
                this.$set(this.propData, "fontContent", this.getExpressData(this.propData.dataName, this.propData.dataFiled, object.data));
            }
        }
    }
}
</script>
<style lang="scss">
.IFooterBar_app{
    height: 200px;
    // background: #1B60A4;
    .IFooterBar_app_left{
        .img_box{
            overflow: hidden;
            img{
                max-width: 100%;
                max-height: 100%;
                width: 100%;
                height: 100%;
            }
        }
    }
    .IFooterBar_app_center{
        .IFooterBar_app_center_top{
            .list{
                height: 14px;
                line-height: 14px;
                padding: 0 5px;
                font-size: 14px;
                color: #FFFFFF;
                letter-spacing: 0;
                text-align: center;
                font-weight: 500;
                border-right: 1px solid white;
                &:last-child{
                    border-right: none;
                }
            }
        }
    }
    .IFooterBar_app_right{
        height: 100%;
        .drag_container_outer{
            border: 1px dotted hsla(0,0%,100%,.6);
        }
    }
}
</style>