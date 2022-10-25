<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="ISearchBar_app">
            <div v-if="propData.showTip" class="tip">
                <span class="tip_font">本次检索为您找到<span class="tip_font_active">{{ total }}</span>篇有关<span class="tip_font_active">{{ searchKey }}</span>的页面</span>
            </div>
            <div class="ISearchBar_main flex_between">
                <div class="ISearchBar_main_left flex_start">
                    <div class="choice_list flex_start">
                        <div class="label">关键字：</div>
                        <a-input @change="changeKeyWord" placeholder="请输入关键字搜索" allowClear/>
                    </div>
                    <div class="choice_list flex_start">
                        <div class="label">时间：</div>
                        <span v-for="(item,index) in time_list" @click="changeTimeType(item)" :key="index" class="time_list" :class="item.value == active_time ? 'time_list_active' : ''">{{ item.label }}</span>
                        <div v-if="active_time == '6'" class="date_block">
                            <a-date-picker @change="onChange" valueFormat="YYYY-MM-DD" placeholder="选择日期"/>
                        </div>
                    </div>
                </div>
                <div class="ISearchBar_main_right flex_end">
                    排序：
                    <span @click="changeSortType('1')" class="sort_list" :class="sort_type == '1' ? 'sort_list_active' : ''">相关度</span>
                    <span class="line"></span>
                    <span @click="changeSortType('2')" class="sort_list" :class="sort_type == '2' ? 'sort_list_active' : ''">发布时间</span>
                </div>
            </div>
        </div>
    </div>
    
</template>
   
<script>
import { Cascader } from 'element-ui';
export default {
    name: 'ISearchBar',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                showTip: true
            },
            time_list: [
                {
                    label: '全部',
                    value: ''
                },
                {
                    label: '一天内',
                    value: 'day'
                },
                {
                    label: '一周内',
                    value: 'week'
                },
                {
                    label: '一月内',
                    value: 'month'
                },
                {
                    label: '一年内',
                    value: 'year'
                },
                {
                    label: '指定日期',
                    value: '6'
                },
            ],
            active_time: '',
            select_date: '',
            sort_type: '1',
            searchKey: '',
            total: 0,
        }
    },
    watch: { 
        
    },
    created() {   //初始化对比
        this.moduleObject = this.$root.moduleObject;
        this.convertAttrToStyleObject();
    },
    methods: {
        postMessage() {
            let queryTime = '';
            if ( this.active_time == '6' ) {
                queryTime = this.select_date;
            } else {
                queryTime = this.active_time;
            }
            if ( (!this.propData.triggerComponents) || !this.propData.triggerComponents.length ) {
                return
            }
            this.sendBroadcastMessage({
                type: 'searchMessage',
                rangeModule: this.propData.triggerComponents.map(el => el.moduleId),
                message: {
                    queryTime: queryTime,
                    searchKey: this.searchKey,
                    showOrder: this.sort_type
                }
            })
        },
        changeKeyWord(e) {
            console.log(e);
            this.$nextTick(() => {
                this.searchKey = e.target._value;
                this.getData()
                this.postMessage()
            })
        },
        getData() {
            if ( this.moduleObject.env == 'develop' || (!this.propData.customInterfaceUrl)) {
                this.total = 0;
                return
            }
            let queryTime = '';
            if ( this.active_time == '6' ) {
                queryTime = this.select_date;
            } else {
                queryTime = this.active_time;
            }
            IDM.http.get(this.propData.customInterfaceUrl,{
                queryTime: queryTime,
                searchKey: this.searchKey,
                showOrder: this.sort_type
            }).then((res) => {
                if (res && res.data && res.data.code == '200' && res.data.data ) {
                    this.total = res.data.data[this.propData.dataFiledTotal || 'total'];
                } else {
                    IDM.message.error(res.data.message);
                }
            })
        },
        changeSortType(value) {
            this.sort_type = value;
            this.getData()
            this.postMessage()
        },
        onChange(e) {
            console.log(e);
            this.select_date = e;
            this.getData()
            this.postMessage()
        },
        changeTimeType(item) {
            this.select_date = '';
            this.active_time = item.value;
            this.getData()
            this.postMessage()
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            this.convertAttrToStyleObject()
        },
        convertAttrToStyleObjectTip() {
            var styleObject = {};
            let styleObjectFont = {};
            let styleObjectFontActive = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "fontTip":
                            IDM.style.setFontStyle(styleObjectFont,element)
                            break;
                        case 'fontTipActive':
                            IDM.style.setFontStyle(styleObjectFontActive,element)
                            break;
                        case 'boxTipActive':
                            IDM.style.setBoxStyle(styleObjectFontActive,element)
                            break;
                        case 'boxTip':
                            IDM.style.setBoxStyle(styleObject,element)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .tip .tip_font', styleObjectFont);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .tip .tip_font_active', styleObjectFontActive);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .tip', styleObject);
        },
        convertAttrToStyleObjectSearchBar() {
            var styleObject = {};
            let styleObjectTimeFont = {};
            let styleObjectTimeFontActive = {};
            let styleObjectTimeList = {};
            let styleObjectSortFont = {};
            let styleObjectSortFontActive = {};
            let styleObjectSortList = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "fontTimeList":
                            IDM.style.setFontStyle(styleObjectTimeFont,element)
                            break;
                        case 'fontTimeListActive':
                            IDM.style.setFontStyle(styleObjectTimeFontActive,element)
                            break;
                        case 'bgColorTimeListActive':
                            if (element && element.hex8) {
                                styleObjectTimeFontActive["background-color"] = element.hex8;
                            }
                            break;
                        case 'boxTimeList':
                            IDM.style.setBoxStyle(styleObjectTimeList,element)
                            break;
                        case 'fontSortList':
                            IDM.style.setFontStyle(styleObjectSortFont,element)
                            break;
                        case 'fontSortListActive':
                            IDM.style.setFontStyle(styleObjectSortFontActive,element)
                            break;
                        case 'bgColorSortListActive':
                            if (element && element.hex8) {
                                styleObjectSortFontActive["background-color"] = element.hex8;
                            }
                            break;
                        case 'boxSortList':
                            IDM.style.setBoxStyle(styleObjectSortList,element)
                            break;
                        case 'widthSearchBar':
                            styleObject['width'] = element;
                            break;
                        case 'heightSearchBar':
                            styleObject['height'] = element;
                            break;
                        case 'bgColorSearchBar':
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case 'boxSearchBar':
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .ISearchBar_main_left', styleObjectTimeFont);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .ISearchBar_main_left .time_list_active', styleObjectTimeFontActive);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .ISearchBar_main_left .time_list', styleObjectTimeList);

            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .ISearchBar_main_right', styleObjectSortFont);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .ISearchBar_main_right .sort_list_active', styleObjectSortFontActive);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .ISearchBar_main_right .sort_list', styleObjectSortList);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ISearchBar_app .ISearchBar_main', styleObject);
        },
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectTip()
            this.convertAttrToStyleObjectSearchBar()
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
                            styleObject[key] = element;
                            break;
                        case "height":
                            styleObject[key] = element;
                            break;
                        case "bgColor":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "box":
                            IDM.style.setBoxStyle('styleObject',element)
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
                            IDM.style.setBorderStyle('styleObject',element)
                            break;
                        case "font":
                            IDM.style.setFontStyle('styleObject',element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
        },
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
        receiveBroadcastMessage(object) {
            console.log("ISwiper组件收到消息", object)
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
        },
    }
}


</script>
<style lang="scss" scoped="scoped">
.ISearchBar_app{
    .tip{
        padding: 10px 0;
        font-size: 14px;
        color: #999;
        .tip_font_active{
            margin: 0 5px;
            color: #0073CA;
        }
    }
    .ISearchBar_main{
        .ISearchBar_main_left{
            .choice_list{
                margin-right: 15px;
                .label{
                    white-space: nowrap;
                }
            }
            .time_list_active{
                color: white;
                background: #0073CA;
            }
            .time_list{
                display: inline-block;
                padding: 5px 15px;
                border-radius: 4px;
                cursor: pointer;
            }
            .date_block{
                margin-left: 15px;
            }
        }
        .ISearchBar_main_right{
            .line{
                width: 1px;
                height: 16px;
                display: inline-block;
                margin: 0 10px;
                background: gainsboro;
            }
            .sort_list{
                cursor: pointer;
            }
            .sort_list_active{
                color: #0073CA;
            }
        }
    }
}
</style>
  
  