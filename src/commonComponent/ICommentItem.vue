<template>
    <div class="d-flex comment-list-container">
        <img :src="itemData.avatar" class="comment-list-avatar" alt="头像加载失败" />
        <div class="common-list-right">
            <div class="cursor-p">
                <span class="comment-list-name mr-10">{{ itemData.sendUser && itemData.sendUser.username }}</span>
                <span class="common-list-author mr-10" v-if="itemData.sendUser && itemData.sendUser.isAuthor"
                    >作者</span
                >
                <span v-if="itemData.toUser && itemData.toUser.username">
                    <span class="mr-10">回复</span>
                    <span class="comment-list-name mr-10">
                        {{ itemData.toUser && itemData.toUser.username }}
                    </span>
                    <span v-if="itemData.toUser && itemData.toUser.isAuthor" class="common-list-author">作者</span>
                </span>
            </div>
            <div>{{ itemData.content }}</div>
            <div class="comment-list-bottom">
                <span class="mr-10 cursor-p">{{ itemData.time }}</span>
                <span class="mr-10 cursor-p" @click.stop="$emit('showReply', { index: lIndex, sIndex: sIndex })">
                    回复
                </span>
                <span class="mr-10 cursor-p">赞({{ itemData.fabulousNumber }})</span>
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
        }
    },
    data() {
        return { replyContent: '' }
    },
    methods: {
        handleSubReply() {
            if( this.moduleObject.env=="develop"){
                return;
            }
            const { itemData, lIndex, sIndex } = this
            this.replyContent = ''
            this.$emit('handleSubReply', { item: itemData, index: lIndex, sIndex: sIndex })
        }
    }
}
</script>
