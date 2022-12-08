<template>
    <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" :title="propData.htmlTitle ? propData.fontContent : ''" >
        <!-- 组件内部容器 增加class="drag_container" 必选 idm-ctrl-id：组件的id，这个必须不能为空 idm-container-index  组件的内部容器索引，不重复唯一且不变，必选 -->
        <div class="ITopBar_app">
            <div class="ITopBar_app_main flex_between">
                <div class="ITopBar_app_left flex_start">
                    <div @click="changeMenuCollapse" v-if="propData.showMenuSwitch" class="menu_switch_block flex_center">
                        <a-icon :type="is_menu_collapse ? 'menu-unfold' : 'menu-fold'" />
                    </div>
                    <div v-if="propData.leftShowKey == '1'" class="daily_sentence_block flex_start">
                        <span>{{ propData.dailySentenceTitle }}</span>
                        <span v-if="propData.dailySentenceTitle" style="margin: 0 5px 0 5px;">|</span>
                        <MarqueeUp :url="propData.getDailySentenceUrl" :result_key="propData.getDailySentenceResultKey" :maxwidth="propData.dailySentenceContentMaxWidth" :sub-title="propData.dailySentenceContent" :skin="user_info.skin" />
                    </div>
                    <div v-if="propData.leftShowKey == '2' && propData.logoImgSrc" class="logo_block">
                        <img :src="IDM.url.getWebPath(propData.logoImgSrc)" />
                    </div>
                    <div v-if="propData.leftShowKey == '3' && nav_list && nav_list.length" class="tab_block" id="tab_block">
                        <oacommon-a-tabs v-model="current_url" @change="changeTab" @edit="editTab" :tabBarGutter="propData.tabBarGutter" type="editable-card" hideAdd>
                            <oacommon-a-tab-pane v-for="pane in nav_list" :key="pane.url" :tab="pane.title" :closable="pane.isFixed ? false : true">
                            </oacommon-a-tab-pane>
                        </oacommon-a-tabs>
                    </div>
                </div>
                <div v-if="propData.isShowCenterTitle" class="ITopBar_app_center">
                    {{ propData.title }}
                </div>
                <div class="ITopBar_app_right flex_end">
                    <div v-if="propData.showSearch" class="search_block">
                        <a-input v-model="search_text" @pressEnter="onSearch" size="large" :placeholder="propData.searchPlaceholder || '请输入搜索内容'">
                            <svg @click="toSearch" class="idm_search_svg_icon" v-if="propData.iconSvgSearch && propData.iconSvgSearch.length > 0" slot="suffix" aria-hidden="true" >
                                <use :xlink:href="`#${propData.iconSvgSearch[0]}`"></use>
                            </svg >
                            <a-icon @click="toSearch" v-else slot="suffix" type="search" />
                        </a-input>
                    </div>
                    <div v-if="propData.operateList && propData.operateList.length" class="operate_block flex_end">
                        <div @click="takeOperate(item,index)" v-for="(item,index) in propData.operateList" :key="index" class="block">
                            <div v-if="(item.buttonText || (item.iconSvg && item.iconSvg.length))" class="operate_list flex_start" :style="getBackgroundColor(item)" :class="item.operateListStyle == '2' ? 'operate_list1' : ''">
                                <a-tooltip v-if="item.hoverText">
                                    <template slot="title">
                                        <span>{{ item.hoverText }}</span>
                                    </template>
                                    <svg class="idm_button_svg_icon" :style="getTopBarStyleInlineIcon(item)" v-if="item.iconSvg && item.iconSvg.length > 0" aria-hidden="true" >
                                        <use :xlink:href="`#${item.iconSvg[0]}`"></use>
                                    </svg >
                                    <span :style="getTopBarStyleInlineText(item)">{{ item.buttonTextResult ? item.buttonTextResult : item.buttonText }}</span>
                                </a-tooltip>
                                <template v-else>
                                    <svg class="idm_button_svg_icon" :style="getTopBarStyleInlineIcon(item)" v-if="item.iconSvg && item.iconSvg.length > 0" aria-hidden="true" >
                                        <use :xlink:href="`#${item.iconSvg[0]}`"></use>
                                    </svg >
                                    <span :style="getTopBarStyleInlineText(item)">{{ item.buttonTextResult ? item.buttonTextResult : item.buttonText }}</span>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div v-if="propData.isShowEntrust" class="entrust_block">
                        <a-popover v-model="is_entrust_show" overlayClassName="entrust_pop" :trigger="propData.showEntrustEvent">
                            <div v-if="user_info && (user_info.agencyUserNameShort || user_info.auserAgencyUserNameShort)" slot="content">
                                <div v-if="user_info.agencyUserNameShort" class="entrust_list">
                                    <span :title="'代办[' + user_info.agencyUserNameShort + ']的文件'" >
                                        代办<label>[{{ user_info.agencyUserNameShort }}]</label>的文件
                                    </span>
                                </div>
                                <div v-if="user_info.auserAgencyUserNameShort" class="entrust_list">
                                    <span :title="'由[' + user_info.auserAgencyUserNameShort + ']代办文件'" >
                                        由<label>[{{ user_info.auserAgencyUserNameShort }}]</label>代办文件
                                    </span>
                                </div>
                            </div>
                            <div class="entrust_list" v-else slot="content">
                                <span>{{ propData.noDataTextEntrust }}</span>
                            </div>
                            <div class="entrust_main flex_end">
                                <svg class="idm_button_svg_icon" v-if="propData.iconSvgEntrust && propData.iconSvgEntrust.length > 0" aria-hidden="true" >
                                    <use :xlink:href="`#${propData.iconSvgEntrust[0]}`"></use>
                                </svg >
                                <span>{{ propData.buttonTextEntrust }}</span>
                            </div>
                        </a-popover>
                    </div>
                    <div class="user_block flex_end">
                        <div class="user_name flex_end" v-if="isLogin">
                            {{ propData.persdonWelcomText }}<span class="user_name_text">{{ user_info.username }}</span>
                        </div>
                        <div class="user_name flex_end" v-if="!isLogin && propData.isLoginBtn">
                            <el-button type="primary" @click="toLogin">登录</el-button>
                        </div>
                        <a-popover v-if="isLogin" v-model="action_visible" overlayClassName="user_block_popover" :trigger="propData.showPersonActionEvent" placement="bottomRight" arrow-point-at-center>
                            <div slot="content">
                                <div @click="takePersonAction(item,index)" v-for="(item,index) in propData.personActionList" :key="index" class="user_dropdown_list flex_start">
                                    <svg class="idm_button_svg_icon" :style="getTopBarStyleInlineIcon(item)" v-if="item.iconSvg && item.iconSvg.length > 0" aria-hidden="true" >
                                        <use :xlink:href="`#${item.iconSvg[0]}`"></use>
                                    </svg >
                                    <span :style="getTopBarStyleInlineText(item)">{{ item.buttonText }}</span>
                                </div>
                            </div>
                            <div v-if="propData.isShowRealUserLogo && userLogo" class="user_logo">
                                <img :src="IDM.url.getWebPath(userLogo)" alt="">
                            </div>
                            <span v-else class="user_logo">
                                <!-- <a-icon type="user" /> -->
                                <SvgIcon icon-class="user"></SvgIcon>
                            </span>
                        </a-popover>
                    </div>
                </div>
            </div>
            <!-- 组件内部容器 增加class="drag_container" 必选 idm-ctrl-id：组件的id，这个必须不能为空 idm-container-index  组件的内部容器索引，不重复唯一且不变，必选 -->
            <div v-if="propData.showMenu" class="drag_container" :class="moduleObject.env == 'develop' || !IDM.env_dev ? 'drag_container_outer' : ''" :idm-ctrl-id="moduleObject.id" idm-container-index="1">

            </div>
        </div>
        <el-dialog title="切换主题" :visible.sync="is_theme_dialog_show" width="810px" :close-on-click-modal="false" custom-class="ITopBar_app_dialog_theme" :append-to-body="true" :before-close="handleClose">
            <iframe :src="iframe_url_theme" scrolling="auto" allowtransparency="true" name="layui-layer-iframe6" class="iframe" frameborder="0" ></iframe>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="is_password_dialog_show" width="500px" :close-on-click-modal="false" custom-class="ITopBar_app_dialog_password" :append-to-body="true" :before-close="handleClosePwd">
            <iframe :src="iframe_url_password" scrolling="auto" allowtransparency="true" name="layui-layer-iframe6" class="iframe" frameborder="0" ></iframe>
        </el-dialog>
        <el-dialog title="锁定屏幕" custom-class="lockScreenPop" destroy-on-close class="lock-screen-outer" :visible.sync="dialogVisibleLockScreen" :append-to-body="true" width="500px" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="lock-screen-wrapper">
                <h4 class="lock-screen-title">请输入解锁密码</h4>
                <el-form ref="lockScreenForm" :model="lockScreenForm" label-width="100px">
                    <el-form-item label="账户:" prop="username">
                        <el-input v-model="lockScreenForm.username" :disabled="true" style="width:100%"></el-input>
                    </el-form-item>
                    <el-form-item label="解锁密码:" prop="password" :rules="[{ required: true, message: '密码不能为空'}]">
                        <el-input v-model="lockScreenForm.password" type="password" autocomplete="off" style="width:100%" @keydown.enter.native="unlockClick"> </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="lock-screen-dialog-footer">
                    <el-button type="primary" class="lock-screen-btn" @click="unlockClick">确 定</el-button>
                    <p v-if="lockScreentip" class="lock-screen-tip">密码不正确</p>
                </div>
            </div>
        </el-dialog>
        <el-dialog :title="change_organization_dialog_title || '切换子机构'" :visible.sync="is_change_organization_pop_show" custom-class="changeOrganizationPop" width="500px" :append-to-body="true">
            <div>
                <el-radio-group v-model="selected_organization_id">
                    <el-radio v-for="(item,index) in organization_list" :key="index" :label="item.unitId">{{ item.unitName }}</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="is_change_organization_pop_show = false">取 消</el-button>
                <el-button type="primary" @click="changeOrganization">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import MarqueeUp from './MarqueeUp.vue'
import { Dialog,MessageBox,Form,Button,Input,FormItem,Popover,RadioGroup,Radio } from 'element-ui';
import $ from 'jquery'
import SvgIcon from '../icons/SvgIcon.vue';
export default {
    name: 'ITopBar',
    components: {
    MarqueeUp,
    [Dialog.name]: Dialog,
    [MessageBox.name]: MessageBox,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Button.name]: Button,
    [Input.name]: Input,
    [Popover.name]: Popover,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    SvgIcon
},
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                isLoginBtn: false,
                isLoginBtnUrl: "http://116.236.111.158:5480/DreamWeb_dqzb",
                isLoginBtnType: "open",
                showMenuSwitch: true,
                leftShowKey: '3',
                dailySentenceTitle: '每日金句',
                dailySentenceContent: '习近平勉励人们永远保持清醒头脑',
                logoImgSrc: '',
                tabBarGutter: 5,
                showSearch: true,
                operateList: [
                    {
                        buttonText: '操作1'
                    },
                    {
                        buttonText: '操作2',
                        buttonHandleType: '2'
                    }
                ],
                buttonTextEntrust: '委托状态',
                persdonWelcomText: '欢迎您,',
                showPersonAction: true,
                personActionList: [
                    {
                        buttonHandleType: 'changeTheme',
                        buttonText: '切换主题'
                    },
                    {
                        buttonHandleType: 'changePassword',
                        buttonText: '修改密码'
                    },
                    {
                        buttonHandleType: 'logout',
                        buttonText: '注销'
                    }
                ],
                changeThemeIframeUrl: '/p1000/skin/skin.html',
                getOrganizationListApiUrl: '/ctrl/userinfo/getUserUnits',
                isShowEntrust: true,
                changeOrganizationEvent: 'click',
                showPersonActionEvent: 'click',
                isMenuCollapseAnimation: true,
                isAdaptiveMenu: true,
                width: '100vw',
                widthMenu: {
                    inputVal: 230,
                    selectVal: "px"
                },
                collapseWidthMenu: {
                    inputVal: 64,
                    selectVal: "px"
                }
            },
            user_info: {
                agencyUserNameShort: '456',
                auserAgencyUserNameShort: '789'
            },
            is_menu_collapse: false,// 是否收缩
            current_url: '',
            nav_list: [
                // {
                //     url: '1',
                //     title: '菜单一'
                // },
                // {
                //     url: '2',
                //     title: '菜单2'
                // },
                // {
                //     url: '3',
                //     title: '菜单3'
                // },
            ],
            is_theme_dialog_show: false,
            is_password_dialog_show: false,
            iframe_url_theme: '',
            iframe_url_password: '',
            action_visible: false,
            parentHeight: '',
            searchType: '',
            userLogo: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            organization_list: [
                // {
                //     unitId: '1',
                //     unitName: '机构1'
                // },
                // {
                //     unitId: '2',
                //     unitName: '机构2'
                // }
            ],
            currentUnitInfo: {},
            dialogVisibleLockScreen: false,
            lockScreenForm:{
                username:"系统管理员（当前已锁）",
                password:""
            },
            lockScreentip:false,
            is_entrust_show: false,
            is_change_organization_pop_show: false,
            change_organization_dialog_title: '',
            selected_organization_id: '',
            search_text: '',
            isLogin: false, // 当前用户是否为登录状态
        }
    },
    props: {
    },
    created() {
        this.moduleObject = this.$root.moduleObject
        if ( this.propData.searchType != '3' && !this.searchType ) {
            this.searchType = this.propData.searchType;
        }
        this.addHomeTab()
        this.postHomePageStatus()
        this.makeMenuCollapseStatus()
        // 获取数据源
        this.reload()
        this.convertAttrToStyleObject();
    },
    mounted() {
        window.closeDialog = function () {
            $("body>.el-dialog__wrapper .el-dialog__headerbtn").click();
        }
    },
    destroyed() { },
    watch: {

    },
    methods: {
        getBackgroundColor(item) {
            let styleObject = {};
            if ( item.operateListStyle == '3' && item.operateListBackgroundColor && item.operateListBackgroundColor.hex8 ) {
                styleObject['background-color'] = IDM.hex8ToRgbaString(item.operateListBackgroundColor.hex8) + ' !important'
                return styleObject
            }
        },
        toSearch() {
            this.onSearch()
        },
        postHomePageStatus() {
            if ( (!this.propData.triggerComponents) || !this.propData.triggerComponents.length ) {
                return
            }
            this.sendBroadcastMessage({
                type: 'postHomeShow',
                // className: 'IMainIframe',
                rangeModule:  this.propData.triggerComponents.map(el => el.moduleId),
                message: {
                    isShowHomeTab: this.propData.isShowHomeTab
                }
            })
        },
        getOperationButtonText() {
            if ( !this.propData.operateList ) {
                return
            }
            for( let i = 0,maxi = this.propData.operateList.length;i < maxi;i++ ) {
                if ( this.propData.operateList[i].sourceTypeButtonText == 'customInterface' && this.propData.operateList[i].customInterfaceUrlButtonText ) {
                    this.getOperationButtonTextInterface(this.propData.operateList[i],i)
                }
                if ( this.propData.operateList[i].sourceTypeButtonText == 'customFunction' && this.propData.operateList[i].customFunctionButtonText ) {
                    this.getOperationButtonTextFunction(this.propData.operateList[i],i)
                }
            }
        },
        getOperationButtonTextInterface(item,index) {
            if(this.moduleObject.env=="develop"){
                return;
            }
            let urlParam = this.commonParam()
            IDM.http.get(this.propData.userLogoApiUrl,{
                pageId: urlParam.pageId,
                componentId: this.moduleObject.comId
            }).then((res) => {
                if (res && res.data && res.data.type == 'success' && item.dataFiledButtonText ) {
                    let result = this.getExpressData('data',item.dataFiledButtonText,res.data)
                    this.$set(this.propData.operateList,index,{
                        ...item,
                        buttonTextResult: result
                    })
                }
            })
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
        getOperationButtonTextFunction(item,index) {
            if( item.customFunctionButtonText.length > 0 ){
                var resValue = "";
                var params = this.commonParam();
                let that = this;
                try {
                    resValue = window[item.customFunctionButtonText[0].name]&&window[item.customFunctionButtonText[0].name].call(this,{...params,...item.customFunctionButtonText[0].param,moduleObject:this.moduleObject});
                    that.$set(this.propData.operateList,index,{
                        ...item,
                        buttonTextResult: resValue
                    })
                } catch (error) {

                }
            }
        },
        hidePop(className,data) {
            let styleObjectHide = {};
            if ( (!data) || (!data.length) ) {
                styleObjectHide['display'] = 'none'
            } else {
                styleObjectHide['display'] = 'block'
            }
            window.IDM.setStyleToPageHead(`.${className}`, styleObjectHide);
        },
        lockScreen() {
            if ( this.propData.lockScreenApiUrl ) {
                let urlParam = this.commonParam()
                IDM.http.post(this.propData.lockScreenApiUrl, {
                    ...urlParam
                }).then((res) => {
                    if (res.type == 'success') {
                        this.dialogVisibleLockScreen = true;
                    } else {
                        IDM.message.error(res.message)
                    }
                }).error((err) => {
                    console.log(err);
                })
            }
        },
        unlockClick(){
            if(this.moduleObject.env=="develop"){
                return;
            }
            if ( !this.propData.unLockScreenApiUrl ) {
                return
            }
            this.$refs.lockScreenForm.validate((valid,object) => {
                if (valid) {
                    const params = {
                        pwd: this.lockScreenForm.password
                    }
                    IDM.http.post(this.propData.unLockScreenApiUrl, {
                        ...params
                    }).then((res) => {
                        if (res.type == 'success') {
                            this.dialogVisibleLockScreen = false
                            this.lockScreentip = false
                            this.lockScreenForm.password = ""
                        } else {
                            this.lockScreentip = true
                        }
                    }).error((err) => {
                        console.log(err);
                    })
                }
            });
        },
        getOrganizationList() {
            if(this.moduleObject.env=="develop"){
                return;
            }
            if ( this.propData.getOrganizationListApiUrl ) {
                let urlParam = this.commonParam()
                IDM.http.get(this.propData.getOrganizationListApiUrl,{
                    pageId: urlParam.pageId,
                    componentId: this.moduleObject.comId
                }).then((res) => {
                    console.log('获取子机构数据',res)
                    if (res && res.data && res.type == 'success' ) {
                        this.organization_list = res.data;
                        let currentUnitInfo = res.data.find((v) => v.isCurrent)
                        if ( currentUnitInfo ) {
                            this.currentUnitInfo = currentUnitInfo;
                        }
                    }
                })
            }
        },
        changeOrganization() {
            if(this.moduleObject.env=="develop"){
                return;
            }
            if (this.selected_organization_id == this.currentUnitInfo.unitId) {
                IDM.message.info("您当前已处于本单位");
                return false
            }
            var param = {
                changeUnitId: this.selected_organization_id,
            }
            let url = 'ctrl/changeLoginUnit'
            if ( this.propData.changeOrganizationApiUrl ) {
                IDM.http.post(this.propData.changeOrganizationApiUrl, {
                    ...param
                }).then((res) => {
                    if (res.type == 'success') {
                        window.location.reload()
                    } else {
                        IDM.message.error(res.message)
                    }
                }).error((err) => {
                    console.log(err);
                })
            }
        },
        toChangeOrganization(item) {
            this.selected_organization_id = this.currentUnitInfo.unitId;
            if ( item.customFunctionDialogTitle && item.customFunctionDialogTitle.length ) {
                var resValue = "";
                try {
                    var params = this.commonParam();
                    resValue = window[item.customFunctionDialogTitle[0].name]&&window[item.customFunctionDialogTitle[0].name].call(this,{...params,...item.customFunctionDialogTitle[0].param,moduleObject:this.moduleObject});
                } catch (error) {
                    console.log('error',error)
                }
                this.change_organization_dialog_title = resValue;
            }
            this.is_change_organization_pop_show = true;
        },
        getUserLogo() {
            if ( this.propData.isShowRealUserLogo && this.propData.userLogoKey ) {
                if ( this.propData.userLogoApiResource == '1' ) {
                    this.userLogo = this.user_info[this.propData.userLogoKey]
                } else if ( this.propData.userLogoApiUrl ) {
                    let urlParam = this.commonParam()
                    IDM.http.get(this.propData.userLogoApiUrl,{
                        pageId: urlParam.pageId,
                        componentId: this.moduleObject.comId
                    }).then((res) => {
                        if (res && res.type == 'success' && res.data ) {
                            this.userLogo = res.data[this.propData.userLogoKey]
                        }
                    })
                }
            }
        },
        makeMenuCollapseStatus() {
            if ( this.propData.isMenuCollapseAuto && this.propData.menuCollapseAutoBase ) {
                let client = IDM.getClientWH()
                if ( client && client.width && this.propData.menuCollapseAutoBase > client.width ) {
                    this.is_menu_collapse = false
                } else {
                    this.is_menu_collapse = true
                }
                this.changeMenuCollapse()

            }
        },
        /** * 主题颜色 */
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
                let fontStyleObject = {
                    "color": item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
                }
                let backgroundStyleObject = {
                    "background": item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
                }
                let borderStyleObject = {
                    'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
                }
                let backgroundStyleHoverObject = {
                    "background": item.minorColor ? IDM.hex8ToRgbaString(item.minorColor.hex8) : "",
                }
                let fontStyleObjectWhite = {
                    "color": "white"
                };
                let radioStyleObject = {
                    "background": item.minorColor ? IDM.hex8ToRgbaString(item.minorColor.hex8) : "",
                    'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
                }
                let backgroundStyleObjectContain = {}
                if ( this.propData.backgroundType == '1' ) {
                    if ( item.bgImgSrc ) {
                        backgroundStyleObjectContain["background-image"] = `url(${window.IDM.url.getWebPath(item.bgImgSrc)})`;
                    } else {
                        let url = IDM.url.getModuleAssetsWebPath(require(`../assets/img/${item.key}/headerbg_${item.key}_dreamweb_001.png`),this.moduleObject)
                        backgroundStyleObjectContain["background-image"] = `url(${url})`;
                    }
                } else if ( this.propData.backgroundType == '2' ) {
                    backgroundStyleObjectContain["background-color"] = item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "";
                }
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_left", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_left .ant-tabs-tab-active", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_left .ant-tabs-tab:hover", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .user_logo", backgroundStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .search_block .anticon", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .search_block .idm_search_svg_icon", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .search_block .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled)", borderStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .search_block .ant-input:focus", borderStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .operate_block .operate_list1", backgroundStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .change_organization .organization_button1", backgroundStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .operate_block .operate_list .idm_button_svg_icon", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .operate_block .operate_list1 .idm_button_svg_icon", fontStyleObjectWhite );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .entrust_block .entrust_main", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ITopBar_app_right .entrust_block .entrust_main", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " #" + this.moduleObject.id, backgroundStyleObjectContain );

                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " .itopbar_app_message_confirm", backgroundStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " .itopbar_app_message_confirm:hover", backgroundStyleHoverObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " .lock-screen-outer .el-button--primary", backgroundStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " .lock-screen-outer .el-button--primary:hover", backgroundStyleHoverObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " .changeOrganizationPop .el-button--primary", backgroundStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " .changeOrganizationPop .el-button--primary:hover", backgroundStyleHoverObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " .changeOrganizationPop .el-radio__input.is-checked+.el-radio__label", fontStyleObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " .changeOrganizationPop .el-radio__input.is-checked .el-radio__inner", radioStyleObject );
                // IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " .organization_block_popover .organization_dropdown_list:hover", fontStyleObject );
            }
        },
        handleClose(done) {
            window.localStorage.themeSkin="";
            done();
            window.location.reload();
        },
        handleClosePwd(done) {
            done();
        },
        getTopBarStyleInlineIcon(item){
            let styleObject = {};
            for (const key in item) {
                if (this.propData.hasOwnProperty.call(item, key)) {
                    const element = item[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "iconSvgFontColor":
                            styleObject["color"] = IDM.hex8ToRgbaString(element.hex8);
                            break;
                        case "iconSvgFontSize":
                            styleObject["font-size"] = element + "px";
                            styleObject["width"] = element + "px";
                            styleObject["height"] = element + "px";
                            break;
                    }
                }
            }
            return styleObject;
        },
        getTopBarStyleInlineText(item) {
            let styleObject = {};
            for (const key in item) {
                if (this.propData.hasOwnProperty.call(item, key)) {
                    const element = item[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "font":
                            styleObject["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObject["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
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
            return styleObject;
        },
        getUserInfo() {
            let user_info = IDM.user.getCurrentUserInfo()
            console.log('ITopBar获取用户信息',user_info)
            this.user_info = user_info || {};
            if ( user_info && user_info.username ) {
                this.isLogin = true;
                this.lockScreenForm.username = user_info.username;
            }
            if ( user_info && user_info.isLockScreen ) {
                this.dialogVisibleLockScreen = user_info.isLockScreen == '1' ? true : false
            }
            this.getUserNameCustom()
        },
        getUserNameCustom() {
            if( this.propData.customFunctionUserName && this.propData.customFunctionUserName.length > 0 ){
                var resValue = "";
                var params = this.commonParam();
                let that = this;
                try {
                    resValue = window[this.propData.customFunctionUserName[0].name]&&window[this.propData.customFunctionUserName[0].name].call(this,{...params,...this.propData.customFunctionUserName[0].param,moduleObject:this.moduleObject});
                    if ( resValue ) {
                        that.$set(that.user_info,'username',resValue)
                    }
                } catch (error) {

                }
            }
        },
        replaceAction(action) {
            if ( !action ) {
                return ''
            }
            if (action.indexOf('../../') == 0) {
                return IDM.url.getWebPath(action.replace('../../', ''))
            } else {
                return IDM.url.getWebPath(action)
            }
        },
        addHomeTab() {
            if ( this.propData.isShowHomeTab ) {
                this.nav_list = [
                    {
                        title: this.propData.homeTabName || '首页',
                        url: 'homeindex',
                        isTabReload: true,
                        isFixed: true,
                        parentName: '',
                        iframeGuidName: IDM.UUID()
                    }
                ]
                this.current_url = 'homeindex'
            } else {
                this.nav_list = [];
            }
        },
        receiveMenuParam(menuObject) {
            //如果是当前页跳转则不需要判断是否打开tab
            if (menuObject.target == 'selfmain' || menuObject.target == 'newmain' || menuObject.target == 'divmain') {
                return
            }
            if ( (!menuObject.action) && !menuObject.link ) {
                return
            }
            if ( this.propData.leftShowKey == '3' ) {
                console.log('menuObject',menuObject)
                let action = '';
                if ( menuObject.action == 'homeindex' ) {
                    action = menuObject.action
                } else {
                    action = this.replaceAction(menuObject.action || menuObject.link);
                }
                console.log('action',action)
                console.log('nav_list',this.nav_list)
                this.current_url = action;

                // 多tab
                //先判断是否存在
                let isExist = false
                this.nav_list.forEach((tab, index) => {
                    if (tab.url === action) {
                        isExist = true
                    }
                })
                if (!isExist) {
                    this.nav_list.push({
                        title: menuObject.menuName || menuObject.name,
                        url: action,
                        isTabReload: menuObject.isTabReload,
                        isFixed: menuObject.isFixed,
                        parentName: menuObject.parentName,
                        iframeGuidName: IDM.UUID()
                    })
                }
            }
        },
        onSearch(e) {
            if( (!this.propData.triggerComponents) || !this.propData.triggerComponents.length ) {
                return IDM.message.warning('请配置选择点击tab需要联动的组件')
            }
            let text = this.search_text;
            if(this.moduleObject.env=="develop"){
                return;
            }
            if ( this.propData.searchType == '3' && this.propData.customFunctionSearch && this.propData.customFunctionSearch.length ) {
                let urlObject = window.IDM.url.queryObject(),
                pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
                var clickFunction = this.propData.customFunctionSearch;
                clickFunction&&clickFunction.forEach(item=>{
                    window[item.name]&&window[item.name].call(this,{
                        urlData:urlObject,
                        pageId,
                        customParam:item.param,
                        _content: text,
                        keyword: text,
                        _this:this
                    });
                })
                return
            }
            var openUrl,action;
            if ( this.propData.searchUrl ) {
                action = IDM.url.getWebPath(this.propData.searchUrl);
                action = action.split('@')[0] + text
            } else {
                if ( this.searchType == '1' ) {
                    action = this.replaceAction(`../../ctrl/personalcenter/toMultQueryList?_content=${text}`);
                } else if ( this.searchType == '2' ) {
                    action = this.replaceAction(`../../ctrl/search/view?keyword=${text}`);
                }
            }

            let item = {
                isTabReload: "-1",
                url: action,
                action: action,
                title: this.propData.searchOpenTabName|| (this.searchType == '1' ? "综合查询" : "全文检索"),
                name:this.propData.searchOpenTabName|| (this.searchType == '1' ? "综合查询" : "全文检索"),
                target: "main",
                param: text
            }

            this.current_url = action;

            let result = this.nav_list.filter((item) => {
                return item.action == action
            })
            if ( (!result) || !result.length ) {
                this.nav_list.push(item)
            } else {
                this.nav_list.forEach((item1) => {
                    if ( item1.action == action ) {
                        item1.url = action;
                    }
                })
            }
            this.sendBroadcastMessage({
                type: 'addTab',
                // className: 'IMainIframe',
                rangeModule: this.propData.triggerComponents.map(el => el.moduleId),
                message: item
            })
        },
        changeTab(e) {
            if( (!this.propData.triggerComponents) || this.propData.triggerComponents.length === 0 ) {
                return IDM.message.warning('请配置选择点击tab需要联动的组件')
            }
            let nav_item = this.nav_list.find((item) => {
                return item.url == e
            })
            this.sendBroadcastMessage({
                type: 'openTab',
                // className: 'IMainIframe',
                rangeModule: this.propData.triggerComponents.map(el => el.moduleId),
                message: nav_item
            })
        },
        editTab(e,action) {
            if( (!this.propData.triggerComponents) || this.propData.triggerComponents.length === 0 ) {
                return IDM.message.warning('请配置选择点击tab需要联动的组件')
            }
            let nav_list = this.nav_list.filter((item) => {
                return item.url != e
            })
            this.nav_list = nav_list;
            if ( e == this.current_url && this.nav_list && this.nav_list.length ) {
                this.current_url = this.nav_list[0].url;
            }
            this.sendBroadcastMessage({
                type: 'deleteTab',
                // className: 'IMainIframe',
                rangeModule: this.propData.triggerComponents.map(el => el.moduleId),
                message: {
                    delete_url: e,
                    open_url: this.current_url
                }
            })
        },
        changeMenuCollapse(status) {
            if(this.moduleObject.env=="develop"){
                return;
            }
            if((!this.propData.triggerComponentsMenu) || this.propData.triggerComponentsMenu.length === 0) {
                return IDM.message.warning('请配置menu展开收缩联动组件')
            }
            this.is_menu_collapse = !this.is_menu_collapse;
            this.sendBroadcastMessage({
                type: 'changeMenuCollapse',
                // className: '',
                rangeModule: this.propData.triggerComponentsMenu.map(el => el.moduleId),
                message: {
                    menuCollapse: this.is_menu_collapse
                }
            })
            this.convertAttrToStyleObject()
        },
        takeOperate(item) {
            if(this.moduleObject.env=="develop"){
                return;
            }
            if ( item.buttonHandleType == 'none' ) {
                return
            } else if ( item.buttonHandleType == 'custom' ) {
                this.takePersonActionCustom(item)
            } else if ( item.buttonHandleType == '1' ) {
                this.lockScreen()
            } else if ( item.buttonHandleType == '2' ) {
                this.toChangeOrganization(item)
            }
        },

        takePersonAction(item,index) {
            this.action_visible = false;
            if(this.moduleObject.env=="develop"){
                return;
            }
            if ( item.buttonHandleType == 'none' ) {

            } else if ( item.buttonHandleType == 'changeTheme' ) {
                this.changeTheme(item)
            } else if ( item.buttonHandleType == 'changePassword' ) {
                this.changePassword(item)
            } else if ( item.buttonHandleType == 'logout' ) {
                this.logout(item)
            } else if ( item.buttonHandleType == 'custom' ) {
                this.takePersonActionCustom(item)
            }
        },
        changeTheme(item) {
            this.iframe_url_theme = IDM.url.getWebPath(this.propData.changeThemeIframeUrl) + (this.propData.changeThemeIframeUrl.indexOf('?')>-1?'&':'?') + 'skin=' + this.user_info.skin
            this.is_theme_dialog_show = true;
        },
        changePassword(item) {
            this.iframe_url_password = IDM.url.getWebPath(this.propData.changePasswordIframeUrl);
            this.is_password_dialog_show = true;
        },
        logout() {
            MessageBox.confirm('是否注销?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'itopbar_app_message',
                confirmButtonClass: 'itopbar_app_message_confirm',
                cancelButtonClass: 'itopbar_app_message_cancel'
            }).then(() => {
                window.localStorage.setItem("showTip", "");
                window.localStorage.themeSkin = "";
                this.logoutSubmit()
            }).catch(() => {

            });
        },
        logoutSubmit() {
            var logoutUrl = this.propData.logoutUrl;
            logoutUrl = logoutUrl + (logoutUrl.indexOf("?")>-1?"&":"?");
            logoutUrl = logoutUrl + "loginFrom=" + this.user_info.applicationUrl;
            window.location.href = IDM.url.getWebPath(logoutUrl);
        },
        takePersonActionCustom(item) {
            let that = this;
            if (this.moduleObject.env == "develop") {
                return;
            }
            let urlObject = window.IDM.url.queryObject();
            let pageId = window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : "";

            var clickFunction = item.buttonCustomFunction;
            clickFunction && clickFunction.forEach(item1 => {
                window[item1.name] && window[item1.name].call(this, {
                    urlData: urlObject,
                    pageId,
                    customParam: item1.param,
                    _this: this
                });
            })
        },
        // 点击登录按钮后 跳转到对应的登录网址
        toLogin() {
            if(this.propData.isLoginBtnType == "self") {
                window.location.href = this.propData.isLoginBtnUrl;
            }
            if(this.propData.isLoginBtnType == "open") {
                window.open(this.propData.isLoginBtnUrl);
            }
        },
        /** * 提供父级组件调用的刷新prop数据组件 */
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            if ( !this.searchType ) {
                this.searchType = this.propData.searchType;
            }
            this.addHomeTab()
            this.makeMenuCollapseStatus()
            this.convertAttrToStyleObject();
        },
        convertAttrToStyleObjectEntrust() {
            var styleObject = {};
            var styleObjectActive = {};
            var styleObjectBox = {};
            var styleObjectIcon = {};
            var styleObjectButton = {};

            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "fontEntrustPop":
                            styleObject["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObject["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObject["font-style"] = element.fontStyle;
                            styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObject["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObject["text-align"] = element.fontTextAlign;
                            styleObject["text-decoration"] = element.fontDecoration;
                            break;
                        case "fontEntrustPopName":
                            styleObjectActive["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectActive["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObjectActive["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectActive["font-style"] = element.fontStyle;
                            styleObjectActive["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectActive["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectActive["text-align"] = element.fontTextAlign;
                            styleObjectActive["text-decoration"] = element.fontDecoration;
                            break;
                        case "fontEntrustIcon":
                            styleObjectIcon["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectIcon["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObjectIcon["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectIcon["font-style"] = element.fontStyle;
                            styleObjectIcon["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectIcon["width"] = element.fontSize + element.fontSizeUnit;
                            styleObjectIcon["height"] = element.fontSize + element.fontSizeUnit;
                            styleObjectIcon["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectIcon["text-align"] = element.fontTextAlign;
                            styleObjectIcon["text-decoration"] = element.fontDecoration;
                            break;
                        case "fontEntrustButton":
                            styleObjectButton["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectButton["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObjectButton["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectButton["font-style"] = element.fontStyle;
                            styleObjectButton["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectButton["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectButton["text-align"] = element.fontTextAlign;
                            styleObjectButton["text-decoration"] = element.fontDecoration;
                            break;
                        case "boxEntrust":
                            if (element.marginTopVal) {
                                styleObjectBox["margin-top"] = `${element.marginTopVal}`;
                            }
                            if (element.marginRightVal) {
                                styleObjectBox["margin-right"] = `${element.marginRightVal}`;
                            }
                            if (element.marginBottomVal) {
                                styleObjectBox["margin-bottom"] = `${element.marginBottomVal}`;
                            }
                            if (element.marginLeftVal) {
                                styleObjectBox["margin-left"] = `${element.marginLeftVal}`;
                            }
                            if (element.paddingTopVal) {
                                styleObjectBox["padding-top"] = `${element.paddingTopVal}`;
                            }
                            if (element.paddingRightVal) {
                                styleObjectBox["padding-right"] = `${element.paddingRightVal}`;
                            }
                            if (element.paddingBottomVal) {
                                styleObjectBox["padding-bottom"] = `${element.paddingBottomVal}`;
                            }
                            if (element.paddingLeftVal) {
                                styleObjectBox["padding-left"] = `${element.paddingLeftVal}`;
                            }
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .entrust_block', styleObjectBox);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .entrust_block .entrust_main .idm_button_svg_icon', styleObjectIcon);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .entrust_block .entrust_main span', styleObjectButton);
            window.IDM.setStyleToPageHead('.entrust_pop .entrust_list span', styleObject);
            window.IDM.setStyleToPageHead('.entrust_pop .entrust_list span label', styleObjectActive);
        },
        convertAttrToStyleObjectUser() {
            var styleObjectWelcom = {};
            var styleObjectUserLogo = {};
            var styleObjectUserName  = {};
            let styleObjectHide = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "fontWelcom":
                            styleObjectWelcom["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectWelcom["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObjectWelcom["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectWelcom["font-style"] = element.fontStyle;
                            styleObjectWelcom["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectWelcom["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectWelcom["text-align"] = element.fontTextAlign;
                            styleObjectWelcom["text-decoration"] = element.fontDecoration;
                            break;
                        case "widthUserLogo":
                            styleObjectUserLogo["width"] = element;
                            styleObjectUserLogo["height"] = element;
                            styleObjectUserLogo["line-height"] = element;
                            break
                        case "marginLeftUserLogo":
                            styleObjectUserLogo["margin-left"] = element;
                            break
                        case "maxWidthUserName":
                            styleObjectUserName["max-width"] = element;
                    }
                }
            }
            if ( ( (!this.propData.personActionList) || !this.propData.personActionList.length) || (!this.propData.showPersonAction) ) {
                styleObjectHide['display'] = 'none'
            } else {
                styleObjectHide['display'] = 'block'
            }
            window.IDM.setStyleToPageHead('.user_block_popover', styleObjectHide);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .user_block .user_name', styleObjectWelcom);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .user_block .user_logo', styleObjectUserLogo);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .user_block .user_name .user_name_text', styleObjectUserName);
        },
        convertAttrToStyleObjectInner() {
            let styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthInner":
                             styleObject['width'] = element;
                            break;
                        case "heightInner":
                            styleObject['height'] = element;
                            break;
                        case "boxInner":
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
            window.IDM.setStyleToPageHead(this.moduleObject.id + " .ITopBar_app_main", styleObject);
        },
        /** * 把属性转换成样式对象 */
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectEntrust()
            this.convertAttrToStyleObjectUser()
            this.convertAttrToStyleObjectInner()
            var styleObject = {};
            var styleObjectLeft = {};//左侧金句字体样式
            var styleObjectPersionAction = {};//个人操作下拉框字体样式
            var styleObjectTab = {};
            var styleObjectTabBg = {};
            var styleObjectWelcom = {};
            var styleObjectInput = {};
            var styleObjectOperate = {};
            var styleObjectSearch = {};
            var styleObjectSearchIcon = {};
            var styleObjectTabPosition = {};
            var styleObjectLogo = {};
            var styleObjectCenterTitle = {};
            if ( this.propData.backgroundType == '3' ) {
                let element = this.propData.bgColor;
                if (element && element.hex8) {
                    styleObject["background-color"] = IDM.hex8ToRgbaString(element.hex8);
                }
            }
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
            if ( this.propData.isMenuCollapseAnimation ) {
                styleObject['transition'] = 'width .2s linear';
            } else {
                styleObject['transition'] = 'none';
            }
            if ( this.propData.showMenuSwitch ) {
                styleObjectTabPosition['left'] = '60px'
            } else {
                styleObjectTabPosition['left'] = '19px'
            }
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "width":
                            if ( this.moduleObject.env == 'develop' && element == '100vw' ) {
                                styleObject[key] = 'auto';
                            } else {
                                if ( this.propData.isAdaptiveMenu ) {
                                    let menu_width
                                    if ( !this.is_menu_collapse ) {
                                        menu_width = this.propData.widthMenu.inputVal + this.propData.widthMenu.selectVal
                                        styleObject[key] = `calc(${element} - ${menu_width})`;
                                    } else {
                                        menu_width = this.propData.collapseWidthMenu.inputVal + this.propData.collapseWidthMenu.selectVal
                                        styleObject[key] = `calc(${element} - ${menu_width})`;
                                    }
                                } else {
                                    styleObject[key] = element;
                                }
                            }
                            break;
                        case "height":
                            if ( (element == 'auto' || element == '') && this.parentHeight ) {
                                styleObject[key] = this.parentHeight + 'px';
                            } else {
                                styleObject[key] = element;
                            }
                            break;
                        case "boxShadow":
                            styleObject["box-shadow"] = element;
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
                                    styleObject["border-top-color"] = IDM.hex8ToRgbaString(element.border.top.colors.hex8);
                                }
                            }
                            if (element.border.right.width > 0) {
                                styleObject["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                                styleObject["border-right-style"] = element.border.right.style;
                                if (element.border.right.colors.hex8) {
                                    styleObject["border-right-color"] = IDM.hex8ToRgbaString(element.border.right.colors.hex8);
                                }
                            }
                            if (element.border.bottom.width > 0) {
                                styleObject["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                                styleObject["border-bottom-style"] = element.border.bottom.style;
                                if (element.border.bottom.colors.hex8) {
                                    styleObject["border-bottom-color"] = IDM.hex8ToRgbaString(element.border.bottom.colors.hex8);
                                }
                            }
                            if (element.border.left.width > 0) {
                                styleObject["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                                styleObject["border-left-style"] = element.border.left.style;
                                if (element.border.left.colors.hex8) {
                                    styleObject["border-left-color"] = IDM.hex8ToRgbaString(element.border.left.colors.hex8);
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
                                styleObject["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObject["font-style"] = element.fontStyle;
                            styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObject["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObject["text-align"] = element.fontTextAlign;
                            styleObject["text-decoration"] = element.fontDecoration;
                            break;
                        case "isAbsolute":
                            if ( element ) {
                                styleObject["position"] = 'absolute';
                            } else {
                                styleObject["position"] = 'relative';
                            }
                            break
                        case "positionStr":
                            if ( this.is_menu_collapse ) {
                                styleObject['top'] = element.split(' ')[0];
                                styleObject['right'] = element.split(' ')[1];
                                styleObject['bottom'] = element.split(' ')[2];
                                styleObject['left'] = '64px';
                            } else {
                                styleObject['inset'] = element;
                            }
                            break
                        case "fontLeft":
                            styleObjectLeft["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectLeft["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObjectLeft["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectLeft["font-style"] = element.fontStyle;
                            styleObjectLeft["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectLeft["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectLeft["text-align"] = element.fontTextAlign;
                            styleObjectLeft["text-decoration"] = element.fontDecoration;
                            break;
                        case 'fontCenterTitle':
                            styleObjectCenterTitle["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectCenterTitle["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObjectCenterTitle["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectCenterTitle["font-style"] = element.fontStyle;
                            styleObjectCenterTitle["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectCenterTitle["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectCenterTitle["text-align"] = element.fontTextAlign;
                            styleObjectCenterTitle["text-decoration"] = element.fontDecoration;
                            break;
                        case "fontTab":
                            styleObjectTab["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectTab["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObjectTab["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectTab["font-style"] = element.fontStyle;
                            styleObjectTab["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectTab["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectTab["text-align"] = element.fontTextAlign;
                            styleObjectTab["text-decoration"] = element.fontDecoration;
                            break;
                        case "tabBgColor":
                            if (element && element.hex8) {
                                styleObjectTabBg["background-color"] = IDM.hex8ToRgbaString(element.hex8);
                            }
                            break;
                        case "fontInput":
                            styleObjectInput["font-family"] = element.fontFamily;
                            if (element.fontColors.hex8) {
                                styleObjectInput["color"] = IDM.hex8ToRgbaString(element.fontColors.hex8);
                            }
                            styleObjectInput["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
                            styleObjectInput["font-style"] = element.fontStyle;
                            styleObjectInput["font-size"] = element.fontSize + element.fontSizeUnit;
                            styleObjectInput["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
                            styleObjectInput["text-align"] = element.fontTextAlign;
                            styleObjectInput["text-decoration"] = element.fontDecoration;
                            break;
                        case "operateListMargin":
                            styleObjectOperate["margin-left"] = element;
                            break;

                        case "bgColorSearch":
                            if (element && element.hex8) {
                                styleObjectSearch["background-color"] = IDM.hex8ToRgbaString(element.hex8);
                            }
                            break;
                        case "borderSearch":
                            if (element.border.top.width > 0) {
                                styleObjectSearch["border-top-width"] = element.border.top.width + element.border.top.widthUnit;
                                styleObjectSearch["border-top-style"] = element.border.top.style;
                                if (element.border.top.colors.hex8) {
                                    styleObjectSearch["border-top-color"] = IDM.hex8ToRgbaString(element.border.top.colors.hex8);
                                }
                            }
                            if (element.border.right.width > 0) {
                                styleObjectSearch["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                                styleObjectSearch["border-right-style"] = element.border.right.style;
                                if (element.border.right.colors.hex8) {
                                    styleObjectSearch["border-right-color"] = IDM.hex8ToRgbaString(element.border.right.colors.hex8);
                                }
                            }
                            if (element.border.bottom.width > 0) {
                                styleObjectSearch["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                                styleObjectSearch["border-bottom-style"] = element.border.bottom.style;
                                if (element.border.bottom.colors.hex8) {
                                    styleObjectSearch["border-bottom-color"] = IDM.hex8ToRgbaString(element.border.bottom.colors.hex8);
                                }
                            }
                            if (element.border.left.width > 0) {
                                styleObjectSearch["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                                styleObjectSearch["border-left-style"] = element.border.left.style;
                                if (element.border.left.colors.hex8) {
                                    styleObjectSearch["border-left-color"] = IDM.hex8ToRgbaString(element.border.left.colors.hex8);
                                }
                            }
                            styleObjectSearch["border-top-left-radius"] = element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
                            styleObjectSearch["border-top-right-radius"] = element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
                            styleObjectSearch["border-bottom-left-radius"] = element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
                            styleObjectSearch["border-bottom-right-radius"] = element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
                            break;
                        case "iconSvgFontSearch":
                            styleObjectSearchIcon['width'] = element;
                            styleObjectSearchIcon['height'] = element;
                            break;
                        case 'logoImgWidth':
                            styleObjectLogo['width'] = element;
                            break;
                        case 'logoImgHeight':
                            styleObjectLogo['height'] = element;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .daily_sentence_block', styleObjectLeft);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .tab_block .ant-tabs-nav-container', styleObjectTab);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .tab_block .ant-tabs-nav-container .ant-tabs-tab', styleObjectTabBg);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .search_block input', styleObjectInput);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .operate_block .operate_list', styleObjectOperate);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .search_block .ant-input', styleObjectSearch);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .search_block .idm_search_svg_icon', styleObjectSearchIcon);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .tab_block', styleObjectTabPosition);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .logo_block img', styleObjectLogo);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ITopBar_app_center', styleObjectCenterTitle);

            this.convertThemeListAttrToStyleObject()
        },
        /** * 通用的url参数对象 * 所有地址的url参数转换 */
        commonParam() {
            let urlObject = IDM.url.queryObject();
            var params = {
                pageId: window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : "",
                urlData: JSON.stringify(urlObject),
            };
            return params;
        },
        /** * 重新加载 */
        reload() {
            //请求数据源
            this.getUserInfo()
            this.getUserLogo()
            this.getOrganizationList()
            this.getOperationButtonText()
        },
        deleteTab(data) {
            if ( (!data) || !data.url ) {
                return
            }
            let nav_list = this.nav_list.filter((item) => {
                return item.url != data.url
            })
            this.nav_list = nav_list;
            if ( data.url == this.current_url && this.nav_list && this.nav_list.length ) {
                this.current_url = this.nav_list[0].url;
            }
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
            if ( object.type == 'addTab' ) {
                this.receiveMenuParam(object.message)
            } else if ( object.type == 'deleteTab' ) {
                this.deleteTab(object.message)
            } else if ( object.type == 'pageResize' ) {
                this.makeMenuCollapseStatus()
            }
            // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
            if(this.propData.messageRefreshKey && this.propData.messageRefreshKey.length && object.type === 'websocket' && object.message){
                const messageData = typeof object.message === 'string' && JSON.parse(object.message) || object.message
                const arr = this.propData.messageRefreshKey || [];
                if(messageData.badgeType && arr.includes(messageData.badgeType)){
                    this.reload()
                }
            }
            if (object && object.type == "regionResize" && object.message && object.message.gridEleTarget) {
                let gridEleTarget = object.message.gridEleTarget;
                if (gridEleTarget && gridEleTarget.offsetHeight) {
                    this.parentHeight = gridEleTarget.offsetHeight;
                    this.$nextTick(() => {
                        if ( this.propData.height == 'auto' && gridEleTarget.offsetHeight ) {
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

        }
    }
}
</script>
<style lang="scss" scoped>
.ITopBar_app{
    height: 100%;
    font-family: PingFangSC-Regular;
    .ITopBar_app_main{
        min-height: 60px;
        padding: 0 20px 0 18px;
        position: relative;
    }
    .idm_button_svg_icon{
        font-size: 14px;
        width: 14px;
        height: 14px;
        fill: currentColor;
        vertical-align: -0.15em;
        outline: none;
        flex-shrink: 0;
    }
    .ITopBar_app_left{
        .tab_block{
            max-width: 700px;
            position: absolute;
            bottom: 0;
            left: 60px;
            // top: 7px;
        }
        .menu_switch_block{
            margin-right: 20px;
            font-size: 18px;
            .anticon{
                cursor: pointer;
            }
        }
        .daily_sentence_block{
            font-size: 16px;
        }
    }
    .ITopBar_app_right{
        .search_block{
            input{
                font-size: 14px;
            }
            .idm_search_svg_icon{
                width: 16px;
                height: 16px;
                fill: currentColor;
            }
        }
        .change_organization{
            margin-left: 30px;
            .organization_button{
                text-align: center;
                font-size: 14px;
                cursor: pointer;
                span{
                    margin-left: 5px;
                }
            }
            .organization_button1{
                padding: 5px 13px;
                color: white;
                // background: red;
                border-radius: 20px;
                .idm_button_svg_icon{
                    color: white;
                }
            }
        }
        .operate_block{
            .operate_list{
                margin-left: 30px;
                font-size: 14px;
                color: #333;
                padding: 5px 13px;
                border-radius: 20px;
                cursor: pointer;
                img{
                    width: 24px;
                }
                span{
                    margin-left: 5px;
                }
            }
            .operate_list1{
                padding: 5px 13px;
                color: white;
                // background: red;
                border-radius: 20px;
                .idm_button_svg_icon{
                    color: white;
                }
            }
        }
        .entrust_block{
            margin-left: 30px;
            font-size: 14px;
            span{
                margin-left: 5px;
            }
            .entrust_main{
                cursor: pointer;
            }
        }
        .user_block{
            margin-left: 20px;
            .user_name{
                font-size: 16px;
                color: #333333;
                font-weight: 400;
                .user_name_text{
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .user_logo{
                width: 50px;
                height: 50px;
                margin-left: 30px;
                display: inline-block;
                flex-shrink: 0;
                text-align: center;
                line-height: 50px;
                font-size: 20px;
                border-radius: 50%;
                cursor: pointer;
                .anticon{
                    color: white;
                }
                .svg-icon{
                    color: white;
                }
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    vertical-align: baseline;
                }
            }
        }
    }
    .drag_container_outer{
        border: 1px dotted hsla(0,0%,100%,.6);
    }
}
</style>
<style lang="scss">
.user_block_popover{
    // padding: 10px 0 !important;
    // background-color: #fff;
    // background-clip: padding-box;
    // border-radius: 4px;
    // box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    .user_dropdown_list{
        padding: 4px 0px;
        font-size: 15px;
        color: #333;
        font-weight: 600;
        cursor: pointer;
        &:hover{
            color: #777;
        }
        .anticon{
            margin-right: 7px;
            font-size: 14px;
        }
        span{
            white-space: nowrap;
        }
        .idm_button_svg_icon{
            margin-right: 5px;
            font-size: 14px;
            width: 14px;
            height: 14px;
            fill: currentColor;
            vertical-align: -0.15em;
            outline: none;
            flex-shrink: 0;
        }
    }
}
.organization_block_popover{
    // padding: 10px 0 !important;
    font-size: 14px;
    color: #333;
    font-weight: 400;
    // background-color: #fff;
    // background-clip: padding-box;
    // border-radius: 4px;
    // box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    .organization_dropdown_list{
        padding: 4px 0px;
        cursor: pointer;
        &:hover{
            color: #777;
        }
    }
}

.ITopBar_app{
    #tab_block{
        .ant-tabs-nav-container{
            height: 46px;
        }
        .ant-tabs-bar{
            margin: 0;
            border-bottom: none;
        }
        .ant-tabs-tab{
            height: 46px;
            line-height: 46px;
        }
        .ant-tabs-nav-container{
            margin-bottom: 0;
        }
        .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab .ant-tabs-close-x{
            display: none;
        }
        .ant-tabs-tab-active{
            .ant-tabs-close-x{
                display: inline-block !important;
            }
        }
        .ant-tabs-tab:hover{
            .ant-tabs-close-x{
                display: inline-block !important;
            }
        }
    }
    .ant-input:focus{
        box-shadow: none;
    }
}
.ITopBar_app_dialog_theme{
    .el-dialog__header{
        border-bottom: 1px solid rgb(230, 230, 230);
    }
    .iframe{
        width: 100%;
        height: 498px;
    }
}
.ITopBar_app_dialog_password{
    .el-dialog__header{
        border-bottom: 1px solid rgb(230, 230, 230);
    }
    .iframe{
        width: 100%;
        height: 340px;
    }
}
.itopbar_app_message{
    .itopbar_app_message_confirm{
        // background: red;
        border: none;
    }
    .itopbar_app_message_cancel{
        &:hover{
            color: #606266;
            background-color: white;
            border-color: #DCDFE6;
        }
    }
}
.lock-screen-wrapper {
  width: 100%;
  padding: 0 34px;
  box-sizing: border-box;

  .lock-screen-title {
    text-align: center;
    margin: 14px 0;
    font-size: 20px;
  }

  .lock-screen-dialog-footer {
    display: flex;
    flex-direction: row-reverse;
    padding: 10px 0;
  }
}
.lock-screen-outer {
  opacity: 1;
  background: #eee;
  z-index: 9999999999!important;
  .el-button--primary{
    border: none;
  }
}
.changeOrganizationPop{
    .el-button--primary{
        border: none;
    }
    .el-button--default:focus, .el-button--default:hover{
        color: #606266;
        background: white;
        border-color: #dcdfe6;
    }
}
.entrust_pop{
    .ant-popover-title{
        display: none;
    }
    .entrust_list{
        max-width: 400px;
        margin-bottom: 3px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        label{
            margin: 0 5px;
            color: #0080ff;
        }

    }
}
</style>
