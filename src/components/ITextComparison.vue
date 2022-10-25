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
                value2: data[ this.propData.dataFiledContent1 || 'content2' ]
            });
            this.value1 = op1.value1;
            this.value2 = op1.value2;
            this.version1 = data[ this.propData.dataFiledVersion1 || 'version1' ];
            this.version2 = data[ this.propData.dataFiledVersion2 || 'version2' ];
        },
        getMockData() {
            let data = {
                content1 : "<p style=\"text-indent: 2em; font-family: Verdana, Arial, \">截至9月5日12时，我市社会面已连续11天、隔离点连续7天无本地新发病例，郑州涉疫防外溢临时管控区均已解除，即日起郑州市全域转入常态化疫情防控管理。鉴于当前全国疫情呈现多点散发、局部暴发态势，疫情防控形势严峻复杂，西藏、青海新冠肺炎疫情仍在高位发展期，四川成都市和广东深圳市疫情呈快速上升趋势，黑龙江大庆市、辽宁大连市、山东省济宁市等存在潜在疫情外溢风险。我市面临较大的输入性疫情风险，为贯彻国务院联防联控机制“外防输入、内防反弹”总策略，严防疫情输入，现就加强近期来（返）郑人员健康管理紧急提醒如下：</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>一、非必要不前往涉疫地区</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">请各位市民密切关注国内疫情动态和高中低风险区变化情况，非必要不前往有本土疫情发生的地区。确需前往的，要严格做好自身防护，主动配合当地防疫措施，途中做好个人防护。已在高中低风险区及有本土疫情所在县(市、区)的，建议非必要不离开当前居住地，确需返郑的请主动报备，并按要求落实健康管理措施。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>二、主动报告行程</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">以下人员请主动向居住地所属社区（村）、工作单位或居住宾馆(酒店)报告，并配合落实核酸检测、医学观察等疫情防控措施，对瞒报、谎报个人行程和健康状况，引发疫情传播的，将承担相应的法律责任。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">1.8月25日以来有成都市、深圳市旅居史；</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">2.近7日内有西藏、新疆、海南、青海、四川、天津、陕西、重庆、云南、甘肃等省（自治区、直辖市）旅居史；</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">3.近7日内有黑龙江大庆市、哈尔滨市、辽宁大连市、吉林长春市、河北石家庄市、山东济宁市、贵州贵阳市旅居史；</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">4.近7日内有其他高中低风险区或有本土阳性病例的县（市、区、旗）旅居史；</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">5.与公布的确诊病例（含无症状感染者）有轨迹重合。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">6.根据国内疫情发展形势，相关涉疫重点区域将进行动态调整。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>三、来（返）郑提前报备</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">郑州市域外来（返）郑人员需提前3天通过“郑好办APP—返郑人员登记管理”入口，据实填报提交；或通过“支付宝—豫事办—来（返）豫报备”入口，如实填报提交。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>四、加强入郑核酸检测</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">省内来（返）郑人员，需持48小时内核酸检测阴性证明，抵郑24小时内主动核酸检测1次。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">省外来（返）郑人员抵郑后，需配合查验“两码一证”（48小时核酸检测证明、健康码、行程码），第一时间在交通场站（机场、火车站、汽车站、公路服务站等）进行免费的“落地即检”，即检即走，不用等待核酸检测结果，返回居住地后落实三天两检管理措施。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">涉疫风险区域来（返）郑人员按照相关管控措施落实管控。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">建议市域外抵郑人员7日内不聚餐、不聚会、不前往人群密集场所，不探亲访友，推荐线上购物，必须外出时做好个人防护，参加常态化核酸检测。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>五、加强个人防护</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">广大市民要继续时刻保持良好的个人防护意识，养成随身携带口罩、科学规范佩戴口罩、勤洗手、常通风、分餐食、用公筷、不扎堆、少聚集等生活习惯，进入公共场所或乘坐公共交通工具时主动扫场所码，配合查验48小时内核酸检测阴性证明。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">尤其是暑期外出旅游的市民在返郑路途中要做好个人防护，保持安全距离，不在人多拥挤的密闭场所久留，做好疫情防控第一责任人。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">一旦出现发热、干咳、咳痰、咽痛、乏力、腹泻、味觉异常、嗅觉异常等症状，不要自行购药、服药，不乘坐公共交通工具，需立即报告社区，开展健康监测、核酸检测及相应管控措施。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>六、加强场所码查验，落实好四方责任</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">各类公共场所、公共交通工具要守好场所码查验关口，逢进必扫、扫码必验、验码必严，从严从实推进“48小时常态化核酸检测+场所码”联动核查。工作人员要主动为不会扫码的老人、幼儿等提供帮助。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">如您遇到疫情防控的问题，请及时向所在社区咨询，或拨打郑州市政务服务便民热线0371-12345，也可登录“郑在抗疫”平台公众号进行线上咨询。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">郑州市新冠肺炎疫情防控指挥部办公室</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">2022年9月5日</p><p><br/></p>",
                content2 : "<p style=\"text-indent: 2em; font-family: Verdana, Arial, \">wewewe</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">截至9月5日12时，我市社会面已连续11天、隔离点连续7天无本地新发病例，郑州涉疫防外溢临时管控区均已解除，即日起郑州市全域转入常态化疫情防控管理。鉴于当前全国疫情呈现多点散发、局部暴发态势，疫情防控形势严峻复杂，西藏、青海新冠肺炎疫情仍在高位发展期，四川成都市和广东深圳市疫情呈快速上升趋势，黑龙江大庆市、辽宁大连市、山东省济宁市等存在潜在疫情外溢风险。我市面临较大的输入性疫情风险，为贯彻国务院联防联控机制“外防输入、内防反弹”总策略，严防疫情输入，现就加强近期来（返）郑人员健康管理紧急提醒如下：</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>一、非必要不前往涉疫地区</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">请各位市民密切关注国内疫情动态和高中低风险区变化情况，非必要不前往有本土疫情发生的地区。确需前往的，要严格做好自身防护，主动配合当地防疫措施，途中做好个人防护。已在高中低风险区及有本土疫情所在县(市、区)的，建议非必要不离开当前居住地，确需返郑的请主动报备，并按要求落实健康管理措施。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>二、主动报告行程</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">以下人员请主动向居住地所属社区（村）、工作单位或居住宾馆(酒店)报告，并配合落实核酸检测、医学观察等疫情防控措施，对瞒报、谎报个人行程和健康状况，引发疫情传播的，将承担相应的法律责任。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">1.8月25日以来有成都市、深圳市旅居史；</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">2.近7日内有西藏、新疆、海南、青海、四川、天津、陕西、重庆、云南、甘肃等省（自治区、直辖市）旅居史；</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">3.近7日内有黑龙江大庆市、哈尔滨市、辽宁大连市、吉林长春市、河北石家庄市、山东济宁市、贵州贵阳市旅居史；</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">4.近7日内有其他高中低风险区或有本土阳性病例的县（市、区、旗）旅居史；</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">5.与公布的确诊病例（含无症状感染者）有轨迹重合。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">6.根据国内疫情发展形势，相关涉疫重点区域将进行动态调整。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>三、来（返）郑提前报备</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">郑州市域外来（返）郑人员需提前3天通过“郑好办APP—返郑人员登记管理”入口，据实填报提交；或通过“支付宝—豫事办—来（返）豫报备”入口，如实填报提交。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>四、加强入郑核酸检测</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">省内来（返）郑人员，需持48小时内核酸检测阴性证明，抵郑24小时内主动核酸检测1次。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">省外来（返）郑人员抵郑后，需配合查验“两码一证”（48小时核酸检测证明、健康码、行程码），第一时间在交通场站（机场、火车站、汽车站、公路服务站等）进行免费的“落地即检”，即检即走，不用等待核酸检测结果，返回居住地后落实三天两检管理措施。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">涉疫风险区域来（返）郑人员按照相关管控措施落实管控。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">建议市域外抵郑人员7日内不聚餐、不聚会、不前往人群密集场所，不探亲访友，推荐线上购物，必须外出时做好个人防护，参加常态化核酸检测。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>五、加强个人防护</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">广大市民要继续时刻保持良好的个人防护意识，养成随身携带口罩、科学规范佩戴口罩、勤洗手、常通风、分餐食、用公筷、不扎堆、少聚集等生活习惯，进入公共场所或乘坐公共交通工具时主动扫场所码，配合查验48小时内核酸检测阴性证明。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">尤其是暑期外出旅游的市民在返郑路途中要做好个人防护，保持安全距离，不在人多拥挤的密闭场所久留，做好疫情防控第一责任人。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">一旦出现发热、干咳、咳痰、咽痛、乏力、腹泻、味觉异常、嗅觉异常等症状，不要自行购药、服药，不乘坐公共交通工具，需立即报告社区，开展健康监测、核酸检测及相应管控措施。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \"><strong>六、加强场所码查验，落实好四方责任</strong></p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">各类公共场所、公共交通工具要守好场所码查验关口，逢进必扫、扫码必验、验码必严，从严从实推进“48小时常态化核酸检测+场所码”联动核查。工作人员要主动为不会扫码的老人、幼儿等提供帮助。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">如您遇到疫情防控的问题，请及时向所在社区咨询，或拨打郑州市政务服务便民热线0371-12345，也可登录“郑在抗疫”平台公众号进行线上咨询。</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">郑州市新冠肺炎疫情防控指挥部办公室</p><p style=\"text-indent: 2em; font-family: Verdana, Arial, \">2022年9月5日</p><p><br/></p>",
                version1 : "V20221020155237597",
                version2 : "V20221020155249081",
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
        overflow-y: scroll;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
        text-align: left;
        color: #333;
        z-index: 10;
        font-size: 18px;

    }
} 

</style>
  
  