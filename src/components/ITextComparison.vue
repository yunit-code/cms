<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="ITextComparison_app flex_between">
            <div class="ITextComparison_app_left edit_div">
                <div v-if="propData.showVersion" class="title">
                    版本号-{{ version1 }}
                </div>
                <pre v-html='value1' id="edit_pre_1" @scroll="scrollLeft"></pre>
            </div>
            <div class="ITextComparison_app_right edit_div">
                <div v-if="propData.showVersion" class="title">
                    版本号-{{ version2 }}
                </div>
                <pre v-html='value2' id="edit_pre_2" @scroll="scrollRight"></pre>
            </div>
        </div>
    </div>
    
</template>
   
<script>
export default {
    name: 'ITextComparison',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                // customInterfaceUrl: '/ctrl/website/api/contentVersionCompare'
            },
            version1: '1.0版本',
            value1: '',
            version2: '2.0版本',
            value2: '',
        }
    },
    watch: { 
        // value2() {
        //     let op = this.eq({
        //         value1: this.value2,
        //         value2: this.value4
        //     });
        //     this.value1 = op.value1;
        //     this.value3 = op.value2;
        // },
        // value4() {
        //     let op = this.eq({
        //         value1: this.value2,
        //         value2: this.value4
        //     });
        //     this.value1 = op.value1;
        //     this.value3 = op.value2;
        // }
    },
    created() {   //初始化对比
        this.moduleObject = this.$root.moduleObject;
        this.convertAttrToStyleObject();
        this.getInitData()
    },
    methods: {
        getInitData() {
            var params = this.commonParam().urlData;
            let contentId = params ? JSON.parse(params).contentId : '';
            let versionIds = params ? JSON.parse(params).versionIds : '';

            if ( this.moduleObject.env == 'develop' || (!this.propData.customInterfaceUrl) || (!contentId) || (!versionIds)) {
                this.getMockData()
                return
            }

            IDM.http.get(this.propData.customInterfaceUrl,{
                contentId: contentId,
                versionIds: versionIds
            }).then((res) => {
                if (res && res.data && res.data.code == '200' && res.data.data ) {
                    this.makeResultData(res.data.data)
                } else {
                    IDM.message.error(res.data.message);
                }
            })
        },
        makeResultData(data) {
            let op1 = this.eq({
                value1: data[ this.propData.dataFiledContent1 || 'content1' ],
                value2: data[ this.propData.dataFiledContent2 || 'content2' ]
            });
            this.value1 = op1.value1;
            this.value2 = op1.value2;
            this.version1 = data[ this.propData.dataFiledVersion1 || 'version1' ];
            this.version2 = data[ this.propData.dataFiledVersion2 || 'version2' ];
        },
        getMockData() {
            let data = {
                version1 : "V20221020155237597",
                version2 : "V20221020155249081",
                content1: "<p>习近平总书记在党的二十大闭幕会上的重要讲话中指出，全党要紧密团结在党中央周围，高举中国特色社会主义伟大旗帜，坚定历史自信，增强历史主动，敢于斗争、敢于胜利，埋头苦干、锐意进取，团结带领全国各族人民为实现党的二十大确定的目标任务而奋斗。</p><p></p>",
                content2: "<p>习近平总书记在党的二十大闭幕会上的重要讲话中指出，全党要紧密团结在党中央周围，高举中国特色社会主义伟大旗帜，坚定历史自信，增强历史主动，敢于斗争、敢于胜利，埋头苦干、锐意进取，团结带领全国各族人民为实现党的二十大确定的目标任务而奋斗。</p><p>“拥有马克思主义科学理论指导是我们党坚定信仰信念、把握历史主动的根本所在。”湖南省花垣县十八洞村驻村第一书记、乡村振兴工作队队长田晓说，“在习近平新时代中国特色社会主义思想指引下，完成脱贫攻坚、全面建成小康社会的历史任务，实现第一个百年奋斗目标，这是中国共产党和中国人民团结奋斗赢得的历史性胜利。新征程上，我们将埋头苦干、锐意进取，全面推进乡村振兴，加快实现农业农村现代化。”</p><p></p>"
            }
            this.makeResultData(data)
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            this.convertAttrToStyleObject()
        },
        convertAttrToStyleObjectLeft() {
            var styleObject = {};
            var styleObjectTitle = {};
            var styleObjectContent = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthLeft":
                            styleObject['width'] = element;
                            break;
                        case "heightLeft":
                            styleObject['height'] = element;
                            break;
                        case "fontLeftTitle":
                            IDM.style.setFontStyle(styleObjectTitle, element)
                            break;
                        case "fontLeftContent":
                            IDM.style.setFontStyle(styleObjectContent, element)
                            break;
                        case "boxLeft":
                            IDM.style.setBoxStyle(styleObject, element)
                            break;
                        case "borderLeft":
                            IDM.style.setBorderStyle(styleObject, element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ITextComparison_app_left', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ITextComparison_app_left .title', styleObjectTitle);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ITextComparison_app_left #edit_pre_1', styleObjectContent);
        },
        convertAttrToStyleObjectRight() {
            var styleObject = {};
            var styleObjectTitle = {};
            var styleObjectContent = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthRight":
                            styleObject['width'] = element;
                            break;
                        case "heightRight":
                            styleObject['height'] = element;
                            break;
                        case "fontRightTitle":
                            IDM.style.setFontStyle(styleObjectTitle, element)
                            break;
                        case "fontRightContent":
                            IDM.style.setFontStyle(styleObjectContent, element)
                            break;
                        case "boxRight":
                            IDM.style.setBoxStyle(styleObject, element)
                            break;
                        case "borderRight":
                            IDM.style.setBorderStyle(styleObject, element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ITextComparison_app_right', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ITextComparison_app_right .title', styleObjectTitle);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ITextComparison_app_right #edit_pre_2', styleObjectContent);
        },
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectLeft()
            this.convertAttrToStyleObjectRight()
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
        // 同步滚动	
        scrollLeft() {
            document.getElementById("edit_pre_2").scrollTop = document.getElementById("edit_pre_1").scrollTop;
        },
        scrollRight() {
            document.getElementById("edit_pre_1").scrollTop = document.getElementById("edit_pre_2").scrollTop;
        },
        eq(op) {
            if (!op) {
                return op;
            }
            if (!op.value1_style) {
                op.value1_style = "background-color:#FEC8C8;";
            }
            if (!op.value2_style) {
                op.value2_style = "background-color:#FEC8C8;";
            }
            if (!op.eq_min) {
                op.eq_min = 3;
            }
            if (!op.eq_index) {
                op.eq_index = 5;
            }
            if (!op.value1 || !op.value2) {
                return op;
            }
            var ps = {
                v1_i: 0,
                v1_new_value: "",
                v2_i: 0,
                v2_new_value: ""
            };
            while (ps.v1_i < op.value1.length && ps.v2_i < op.value2.length) {
                if (op.value1[ps.v1_i] == op.value2[ps.v2_i]) {
                    ps.v1_new_value += op.value1[ps.v1_i].replace(/</g, "<").replace(">", ">");
                    ps.v2_new_value += op.value2[ps.v2_i].replace(/</g, "<").replace(">", ">");
                    ps.v1_i += 1;
                    ps.v2_i += 1;
                    if (ps.v1_i >= op.value1.length) {
                        ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i).replace(/</g, "<").replace(">", ">") + "</span>";
                        break;
                    }
                    if (ps.v2_i >= op.value2.length) {
                        ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i).replace(/</g, "<").replace(">", ">") + "</span>";
                        break;
                    }
                } else {
                    ps.v1_index = ps.v1_i + 1;
                    ps.v1_eq_length = 0;
                    ps.v1_eq_max = 0;
                    ps.v1_start = ps.v1_i + 1;
                    while (ps.v1_index < op.value1.length) {
                        if (op.value1[ps.v1_index] == op.value2[ps.v2_i + ps.v1_eq_length]) {
                            ps.v1_eq_length += 1;
                        } else if (ps.v1_eq_length > 0) {
                            if (ps.v1_eq_max < ps.v1_eq_length) {
                                ps.v1_eq_max = ps.v1_eq_length;
                                ps.v1_start = ps.v1_index - ps.v1_eq_length;
                            }
                            ps.v1_eq_length = 0;
                            break;//只寻找最近的
                        }
                        ps.v1_index += 1;
                    }
                    if (ps.v1_eq_max < ps.v1_eq_length) {
                        ps.v1_eq_max = ps.v1_eq_length;
                        ps.v1_start = ps.v1_index - ps.v1_eq_length;
                    }

                    ps.v2_index = ps.v2_i + 1;
                    ps.v2_eq_length = 0;
                    ps.v2_eq_max = 0;
                    ps.v2_start = ps.v2_i + 1;
                    while (ps.v2_index < op.value2.length) {
                        if (op.value2[ps.v2_index] == op.value1[ps.v1_i + ps.v2_eq_length]) {
                            ps.v2_eq_length += 1;
                        } else if (ps.v2_eq_length > 0) {
                            if (ps.v2_eq_max < ps.v2_eq_length) {
                                ps.v2_eq_max = ps.v2_eq_length;
                                ps.v2_start = ps.v2_index - ps.v2_eq_length;
                            }
                            ps.v1_eq_length = 0;
                            break;//只寻找最近的
                        }
                        ps.v2_index += 1;
                    }
                    if (ps.v2_eq_max < ps.v2_eq_length) {
                        ps.v2_eq_max = ps.v2_eq_length;
                        ps.v2_start = ps.v2_index - ps.v2_eq_length;
                    }
                    if (ps.v1_eq_max < op.eq_min && ps.v1_start - ps.v1_i > op.eq_index) {
                        ps.v1_eq_max = 0;
                    }
                    if (ps.v2_eq_max < op.eq_min && ps.v2_start - ps.v2_i > op.eq_index) {
                        ps.v2_eq_max = 0;
                    }
                    if ((ps.v1_eq_max == 0 && ps.v2_eq_max == 0)) {
                        ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1[ps.v1_i].replace(/</g, "<").replace(">", ">") + "</span>";
                        ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2[ps.v2_i].replace(/</g, "<").replace(">", ">") + "</span>";
                        ps.v1_i += 1;
                        ps.v2_i += 1;

                        if (ps.v1_i >= op.value1.length) {
                            ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i).replace(/</g, "<").replace(">", ">") + "</span>";
                            break;
                        }
                        if (ps.v2_i >= op.value2.length) {
                            ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i).replace(/</g, "<").replace(">", ">") + "</span>";
                            break;
                        }
                    } else if (ps.v1_eq_max > ps.v2_eq_max) {
                        ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i, ps.v1_start - ps.v1_i).replace(/</g, "<").replace(">", ">") + "</span>";
                        ps.v1_i = ps.v1_start;
                    } else {
                        ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i, ps.v2_start - ps.v2_i).replace(/</g, "<").replace(">", ">") + "</span>";
                        ps.v2_i = ps.v2_start;
                    }
                }
            }
            op.value1 = ps.v1_new_value;
            op.value2 = ps.v2_new_value;
            console.log(op);
            return op;
        }
    }
}


</script>
<style lang="scss" scoped="scoped">
.ITextComparison_app{
    height: 100%;
    // padding: 20px 15px;
    align-items: flex-start;
    .ITextComparison_app_left{
        margin-right: 10px;
    }
    .edit_div {
        height: 100%;
        padding: 20px 15px;
        border: 1px solid #CCCCCC;
        overflow: auto;
        position: relative;
        .title{
            margin-bottom: 20px;
            text-align: center;
            font-size: 22px;
            color: #333;
            font-weight: 600;
        }
    }
    .edit_div pre {
        width: 100%;
        overflow-y: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
        text-align: left;
        color: #333;
        z-index: 10;
        line-height: 32px;
        font-size: 18px;
        list-style: none;
        text-indent: 36px;
    }
} 

</style>
  
  