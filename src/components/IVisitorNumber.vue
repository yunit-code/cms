<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="IVisitorNumber_app">
        <div class="title">在线访客数</div>
        <div class="number">6</div>
        <div class="time">
            <span>更新时间：</span>
            <span>15:12</span>
        </div>
    </div>
</template>
  
<script>
import { getBrowseInfoData } from '../mock/mockData'
export default {
    name: 'IVisitorNumber',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                showColumn: 2,
                showCircle: true
            },
            number: 6,
            time: '',
            conditionObject: {},
            timer: null,
        }
    },
    props: {
    },
    watch: {
        
    },
    created() {
        this.moduleObject = this.$root.moduleObject;
        this.convertAttrToStyleObject();
        this.initData()
    },
    mounted() {
        this.$nextTick(function (params) {

        });
    },
    destroyed() {
        this.clearTimer()
    },
    methods: {
        initTimer() {
            let timer = setInterval(() => {
                this.initData()
            }, this.propData.reloadTime ? this.propData.reloadTime : 60000);
            this.timer = timer;
        },
        clearTimer() {
            if ( this.timer ) {
                clearInterval(this.timer)
            }
        },
        makeParamsData(data) {
            if ( !data ) {
                return {};
            }
            let result = {};
            if ( this.propData.paramsMakeFunction && this.propData.paramsMakeFunction.length && window[this.propData.paramsMakeFunction[0].name] ) {
                result = window[this.propData.paramsMakeFunction[0].name].call(this, {
                                        ...data,
                                        ...this.propData.paramsMakeFunction[0].param,
                                        moduleObject: this.moduleObject,
                                    });
                console.log('自定义参数函数',result)
                return result
            }
            return data
        },
        initData() {
            var params = this.commonParam();
            //接收其他组件联动参数
            if ( this.propData.linkageParamList && this.propData.linkageParamList.length > 0 ) {
                this.propData.linkageParamList.forEach((lpitem) => {
                if (Object.keys(lpitem).length > 0) {
                    if (lpitem.msgKey && this.conditionObject[lpitem.msgKey]) {
                        if (lpitem.paramFun && lpitem.paramFun.length > 0) {
                            //有函数
                            try {
                                params[lpitem.paramKey || lpitem.msgKey] =
                                    window[lpitem.paramFun[0].name] &&
                                    window[lpitem.paramFun[0].name].call(this, {
                                    ...params,
                                    ...lpitem.paramFun[0].param,
                                    moduleObject: this.moduleObject,
                                    paramValue:this.conditionObject[lpitem.msgKey]
                                    });
                            } catch (error) {
                                params[lpitem.paramKey || lpitem.msgKey] =
                                    typeof this.conditionObject[lpitem.msgKey] == "object"
                                    ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                                    : this.conditionObject[lpitem.msgKey];
                            }
                        } else {
                            params[lpitem.paramKey || lpitem.msgKey] = typeof this.conditionObject[lpitem.msgKey] == "object"
                                ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                                : this.conditionObject[lpitem.msgKey];
                        }
                    }
                }
                });
            }
            params = this.makeParamsData(params)
            let newParam = { ...params };
            let that = this;
            console.log('newParam',newParam)
            if ( this.propData.dataSource && this.propData.dataSource.length ) {
                IDM.datasource.request(this.propData.dataSource[0].id,{
                    moduleObject:this.moduleObject,
                    param:{
                        ...newParam
                    }
                },function(res){
                    console.log('grid组件获取数据++++++++',res)
                    if ( res && res.length ) {
                        that.number = res[that.propData.dataFieldNumber ? that.propData.dataFieldNumber : 'number'];
                        that.time = res[that.propData.dataFieldTime ? that.propData.dataFieldTime : 'time'];
                    }
                },function(error){
                    //这里是请求失败的返回结果
                    console.log('error',error)
                })
            } else {
                that.number = 6
                that.time = '15:12'
            }
        },
        
        /**
         * 提供父级组件调用的刷新prop数据组件
         */
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            this.convertAttrToStyleObject();
            this.initData()
        },
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
                let borderObject = {
                    'border-color': item.mainColor ? item.mainColor.hex8 : "",
                }
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ant-select-selection:hover", borderObject );
            }
        },
        /** * 把属性转换成样式对象 */
        convertAttrToStyleObjectTitle() {
            var styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthTitle":
                            styleObject['width'] = element;
                            break;
                        case "heightTitle":
                            styleObject['height'] = element;
                            break;
                        case "boxTitle":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "borderTitle":
                            IDM.style.setBorderStyle(styleObject,element)
                            break;
                        case "fontTitle":
                            IDM.style.setFontStyle(styleObject,element);
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .title', styleObject);
        },
        convertAttrToStyleObjectNumber() {
            var styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthNumber":
                            styleObject['width'] = element;
                            break;
                        case "heightNumber":
                            styleObject['height'] = element;
                            break;
                        case "boxNumber":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "borderNumber":
                            IDM.style.setBorderStyle(styleObject,element)
                            break;
                        case "fontNumber":
                            IDM.style.setFontStyle(styleObject,element);
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .number', styleObject);
        },
        convertAttrToStyleObjectTime() {
            var styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthTime":
                            styleObject['width'] = element;
                            break;
                        case "heightTime":
                            styleObject['height'] = element;
                            break;
                        case "boxTime":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "borderTime":
                            IDM.style.setBorderStyle(styleObject,element)
                            break;
                        case "fontTime":
                            IDM.style.setFontStyle(styleObject,element);
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .time', styleObject);
        },
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectTitle()
            this.convertAttrToStyleObjectNumber()
            this.convertAttrToStyleObjectTime()
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
                            IDM.style.setBoxStyle(styleObject,element)
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
                            IDM.style.setBorderStyle(styleObject,element)
                            break;
                        case "font":
                            IDM.style.setFontStyle(styleObject,element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
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
        
        /** * 通用的获取表达式匹配后的结果 */
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
        onReInitDataMsgKey(conditionObject,messageKey){
            this.conditionObject[messageKey] = conditionObject;
            this.clearTimer()
            this.timer = null;
            this.initData()
            this.initTimer()
        },
        receiveBroadcastMessage(object) {
            console.log("组件收到消息", object)
            if( object.type && object.type=="linkageReload" ){
                this.initData();
            }
            if(object.type&&object.type=="linkageDemand"){
                if(object.messageKey){
                    this.onReInitDataMsgKey(object.message,object.messageKey);
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
                // this.propData.fontContent = this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data);
                this.$set(this.propData, "fontContent", this.getExpressData(this.propData.dataName, this.propData.dataFiled, object.data));
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.IBrowseInfo_app{
    
}

</style>

