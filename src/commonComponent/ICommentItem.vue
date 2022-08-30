<template>
    <div class="d-flex comment-list-container">
        <img :src="IDM.url.getWebPath(itemData.formUserAvatar)" class="comment-list-avatar" alt="头像加载失败" />
        <div class="common-list-right">
            <div class="cursor-p">
                <span class="comment-list-name mr-10">{{ itemData.formUserName }}</span>
                <span class="common-list-author mr-10" v-if="itemData.isAuthor">作者</span>
                <span v-if="itemData.toUserName">
                    <span class="mr-10">回复</span>
                    <span class="comment-list-name mr-10">
                        {{ itemData.toUserName }}
                    </span>
                    <span v-if="itemData.isAuthor" class="common-list-author">作者</span>
                </span>
            </div>
            <div>{{ itemData.content }}</div>
            <div class="comment-list-bottom">
                <span class="mr-10 cursor-p">{{ itemData.createTime }}</span>
                <span class="mr-10 cursor-p" @click.stop="$emit('showReply', { index: lIndex, sIndex: sIndex })">
                    回复
                </span>
                <span class="mr-10 cursor-p">
                    <span v-if="itemData.isLike">已赞</span> <span v-else>赞</span>
                    <span v-if="propData.isFabulousNumber">({{ itemData.likeNum }})</span></span
                >
                <span
                    class="comment-list-del-btn cursor-p"
                    @click.stop="$emit('handleDelete', { item: itemData, index: lIndex, sIndex: sIndex })"
                >
                    删除
                </span>
            </div>
            <div class="common-list-reply" v-if="itemData.isReply">
                <a-input placeholder="请输入内容" allowClear v-model="replyContent" />
                <div class="d-flex flex-d-r-r align-c comment-list-button-container">
                    <a-button type="primary" size="small" :loading="btnLoading" @click="handleSubReply">回复</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ItemComment',
    props: {
        lIndex: {
            type: Number,
            default: -1
        },
        sIndex: {
            type: Number,
            default: -1
        },
        itemData: {
            type: Object,
            default: () => {}
        },
        btnLoading: {
            type: Boolean,
            default: false
        },
        propData: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return { replyContent: '' }
    },
    methods: {
        handleSubReply() {
            if (this.moduleObject.env == 'develop') {
                return
            }
            const { itemData, lIndex, sIndex } = this
            this.replyContent = ''
            this.$emit('handleSubReply', { item: itemData, index: lIndex, sIndex: sIndex })
        }
    }
}
</script>
