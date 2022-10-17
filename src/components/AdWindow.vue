<template>
    <!--悬浮小广告样式的提示信息-->
    <div id="thediv" class="thediv" ref="thediv" style="position: absolute; z-index: 111; left: 0; top: 0" v-show="thedivShow" @mouseover="clearFdAd" @mouseout="starFdAd">
        <div style=" cursor: pointer; text-align: right; font-size: 12px; color: #999999; " @click="thedivShow = false">
            关闭
        </div>
        <img @click="jumpAd()" :src="getAdImgSrc()" class="img" border="0" />
    </div>
</template>
  
<script>
var interval;
export default {
    data() {
        return {
            xPos: 0,
            yPos: 0,
            xin: true,
            yin: true,
            step: 1,
            delay: 18,
            height: 0,
            Hoffset: 0,
            Woffset: 0,
            yon: 0,
            xon: 0,
            pause: true,
            thedivShow: true,
        };
    },
    props: [ 'propData','moduleObject' ],
    created() {
        console.log('prop',this.propData)
        this.convertAttrToStyleObject()
    },
    mounted() {
        interval = setInterval(this.changePos, this.delay);
        this.autoHideAd()
    },
    methods: {
        autoHideAd() {
            if ( !this.propData.adShowTime ) {
                return
            }
            setTimeout(() => {
                this.thedivShow = false;
            },this.propData.adShowTime)
        },
        jumpAd() {
            if ( this.propData.adJumpUrl ) {
                window.open(this.propData.adJumpUrl)
            }
        },
        convertAttrToStyleObject() {
            var styleObject = {};
            var styleObjectImg = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    if (this.propData.adObjectFit) {
                        styleObjectImg["object-fit"] = this.propData.adObjectFit;
                    }
                    switch (key) {
                        case "adImgWidth":
                            styleObject['width'] = element;
                            break;
                        case "adImgHeight":
                            styleObject['height'] = element;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead('thediv', styleObject);
            window.IDM.setStyleToPageHead('thediv' + ' .img', styleObjectImg);
        },
        getAdImgSrc() {
            if ( this.propData.adImgSrc ) {
                return IDM.url.getWebPath(this.propData.adImgSrc)
            } else {
                return IDM.url.getModuleAssetsWebPath(require('../assets/logo.png'),this.moduleObject)
            }
        },
        changePos() {
            let width = document.documentElement.clientWidth;
            let height = document.documentElement.clientHeight;
            if ( !this.$refs.thediv ) {
                return
            }
            this.Hoffset = this.$refs.thediv.offsetHeight; //获取元素高度
            this.Woffset = this.$refs.thediv.offsetWidth;
            // 滚动部分跟随屏幕滚动
            // this.$refs.thediv.style.left = (this.xPos + document.body.scrollLeft + document.documentElement.scrollLeft) + "px";
            // this.$refs.thediv.style.top = (this.yPos + document.body.scrollTop + document.documentElement.scrollTop) + "px";

            // 滚动部分不随屏幕滚动
            this.$refs.thediv.style.left = this.xPos + document.body.scrollLeft + "px";
            this.$refs.thediv.style.top = this.yPos + document.body.scrollTop + "px";

            if (this.yon) {
                this.yPos = this.yPos + this.step;
            } else {
                this.yPos = this.yPos - this.step;
            }
            if (this.yPos < 0) {
                this.yon = 1;
                this.yPos = 0;
            }
            if (this.yPos >= height - this.Hoffset) {
                this.yon = 0;
                this.yPos = height - this.Hoffset;
            }

            if (this.xon) {
                this.xPos = this.xPos + this.step;
            } else {
                this.xPos = this.xPos - this.step;
            }
            if (this.xPos < 0) {
                this.xon = 1;
                this.xPos = 0;
            }
            if (this.xPos >= width - this.Woffset) {
                this.xon = 0;
                this.xPos = width - this.Woffset;
            }
        },
        clearFdAd() {
            clearInterval(interval);
        },
        starFdAd() {
            let time = this.delay;
            if ( this.propData && this.propData.adImgSpeed ) {
                time = this.propData.adImgSpeed
            }
            interval = setInterval(this.changePos, time);
        },
    },
};
</script>
  
<style lang="scss" scoped>
.thediv {
    z-index: 100;
    position: absolute;
    top: 43px;
    left: 2px;
    height: 184px;
    width: 280px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>
  