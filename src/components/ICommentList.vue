<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <a-textarea
            placeholder="评论请登录"
            maxLength="512"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            allowClear
            :loading="btnLoading"
            v-model="content"
        />
        <div class="d-flex flex-d-r-r align-c comment-list-button-container">
            <a-button type="primary" @click="handlePublish">发布</a-button>
        </div>
        <div v-for="(item, index) in componentData" :key="index" class="comment-list-item">
            <ICommentItem
                :itemData="item"
                :lIndex="index"
                @showReply="showReply"
                @handleDelete="handleDelete"
                @handleSubReply="handleSubReply"
                :btnLoading="btnLoading2"
            ></ICommentItem>
            <div class="comment-list-sub-comment" v-for="(items, indexs) in item.children" :key="indexs">
                <ICommentItem
                    :lIndex="index"
                    :sIndex="indexs"
                    :itemData="items"
                    @showReply="showReply"
                    @handleDelete="handleDelete"
                    @handleSubReply="handleSubReply"
                    :btnLoading="btnLoading2"
                ></ICommentItem>
            </div>
        </div>
        <div class="d-flex just-c cursor-p" @click="handleClickMore">加载更多</div>
    </div>
</template>
<script>
import ICommentItem from '../commonComponent/ICommentItem'
import { getCommentListData } from '../mock/mockData'
export default {
    name: 'ICommentList',
    components: {
        ICommentItem
    },
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                fontContent: 'Hello Word'
            },
            btnLoading: false,
            btnLoading2: false,
            componentData: [],
            content: ''
        }
    },
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject()
    },
    methods: {
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.convertAttrToStyleObject()
        },
        // 显示回复
        showReply({ index, sIndex }) {
            if (this.moduleObject.env == 'develop') {
                return
            }
            const arr = _.cloneDeep(this.componentData)
            this.setIsReplyFalse(arr)
            if (sIndex === -1) {
                arr[index].isReply = true
            } else {
                arr[index].children[sIndex].isReply = true
            }
            this.$set(this, 'componentData', arr)
        },
        // 删除
        handleDelete({ item, index, sIndex }) {
            if (this.moduleObject.env == 'develop') {
                return
            }
            const arr = _.cloneDeep(this.componentData)
            if (sIndex === -1) {
                arr.splice(index, 1)
            } else {
                arr[index].children.splice(sIndex, 1)
            }
            this.$set(this, 'componentData', arr)
        },
        // 回复
        handleSubReply() {
            this.btnLoading2 = true
            const arr = _.cloneDeep(this.componentData)
            this.setIsReplyFalse(arr)
            this.$set(this, 'componentData', arr)
        },
        // 发布评论
        handlePublish() {
            this.content = ''
            console.log('Fabu..')
        },
        convertAttrToStyleObject() {
            const styleObject = {},
                avatarObj = {},
                itemObj = {},
                userNameFontObj = {}
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
                        // 头像样式
                        case 'avatarHeight':
                            avatarObj['height'] = element
                            break
                        case 'avatarWidth':
                            avatarObj['width'] = element
                            break
                        case 'avatarBorder':
                            IDM.style.setBorderStyle(avatarObj, element)
                            break
                        case 'avatarBox':
                            IDM.style.setBoxStyle(avatarObj, element)
                            break
                        // 单项样式
                        case 'itemBorder':
                            IDM.style.setBorderStyle(itemObj, element)
                            break
                        case 'itemBox':
                            IDM.style.setBoxStyle(itemObj, element)
                            break
                        case 'userNameFont':
                            IDM.style.setFontStyle(userNameFontObj, element)
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .comment-list-avatar', avatarObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .comment-list-item', itemObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .comment-list-name', userNameFontObj)
            this.initData()
        },
        reload() {
            //请求数据源
            this.initData()
        },
        handleClickMore() {},
        setIsReplyFalse(array) {
            return array.map((el) => {
                el.isReply = false
                if (el.children) {
                    el.children = this.setIsReplyFalse(el.children)
                }
                return el
            })
        },
        initData() {
            if (this.moduleObject.env === 'develop') {
                this.componentData = this.setIsReplyFalse(getCommentListData.call(this))
                return
            }
            let that = this
            //所有地址的url参数转换
            var params = that.commonParam()
            switch (this.propData.dataSourceType) {
                case 'customInterface':
                    this.propData.customInterfaceUrl &&
                        window.IDM.http
                            .get(this.propData.customInterfaceUrl, params)
                            .then((res) => {
                                //res.data
                                that.$set(
                                    that.propData,
                                    'fontContent',
                                    that.getExpressData('resultData', that.propData.dataFiled, res.data)
                                )
                                // that.propData.fontContent = ;
                            })
                            .catch(function (error) {})
                    break
                case 'pageCommonInterface':
                    //使用通用接口直接跳过，在setContextValue执行
                    break
                case 'customFunction':
                    if (this.propData.customFunction && this.propData.customFunction.length > 0) {
                        var resValue = ''
                        try {
                            resValue =
                                window[this.propData.customFunction[0].name] &&
                                window[this.propData.customFunction[0].name].call(this, {
                                    ...params,
                                    ...this.propData.customFunction[0].param,
                                    moduleObject: this.moduleObject
                                })
                        } catch (error) {}
                        that.propData.fontContent = resValue
                    }
                    break
            }
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

<style lang="scss">
.comment-list-button-container {
    margin: 10px 0;
}
.common-list-right {
    margin: 0 0 0 20px;
}
.comment-list-sub-comment {
    margin: 20px 0 0 70px;
}
.comment-list-name {
    margin: 0 0 5 0;
}
.mr-10 {
    margin-right: 10px;
}
.comment-list-bottom {
    margin: 5px 0 0 0;
}
.comment-list-del-btn {
    display: none;
}
.comment-list-container:hover {
    .comment-list-del-btn {
        display: inline;
    }
}
.common-list-reply {
    margin: 10px 0 0 0;
    width: 500px;
    padding: 10px;
    background: #eee;
}
</style>
