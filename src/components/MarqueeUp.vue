<template>
  <!-- 无缝滚动效果 -->
  <div class="marquee-wrap" :style="getWrapStyle()">
    <ul class="marquee-list" :class="{'animate-up': animateUp}">
      <li v-for="(item, index) in listData" :key="index" :title="item">{{item}}</li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: "marquee-up",
    props: {
      url: {
        type: String,
        default: "ctrl/api/frame/getDailySentence",
      },
      result_key: {
        type: String,
        default: "",
      },
      widthStr: {
        default: "auto",
        type: String
      },
      skin: {
        default: "blue",
        type: String
      },
      subTitle: {
        type: String,
        default: "习近平勉励人们永远保持清醒头脑",
      },
      invalTime: {
        default: 3,
        type: Number
      },
      maxwidth: {
        default: '300px',
        type: String
      },
    },
    data() {
      return {
        animateUp: false,
        listData: [],
        timer: null
      }
    },
    mounted() {
      this.listData = this.subTitle.split(" ");
      let that = this;
      if (this.url) {
        that.getServerData(this.url, null, function (res) {
          let data = []
          if ( that.result_key ) {
            data = res.data ? res.data[that.result_key] : res.data
          } else {
            data = res.data
          }
          if (data.length > 0) {
            that.listData = [];
            data.map((item, index) => {
              that.listData.push(item.content);
            })
          }
          if (that.listData.length > 1) that.timer = setInterval(that.scrollAnimate, that.invalTime * 1000);
        })
      } else {
        if (that.listData.length > 1) this.timer = setInterval(this.scrollAnimate, this.invalTime * 1000);
      }
    },
    methods: {
      getWrapStyle() {
        let styleObject = {};
        if (this.widthStr) {
          if (this.widthStr == "auto") {
            styleObject["width"] = this.maxwidth;
          } else {
            styleObject["width"] = this.widthStr;
          }

        }
        return styleObject;
      },
      scrollAnimate() {
        this.animateUp = true
        setTimeout(() => {
          this.listData.push(this.listData[0])
          this.listData.shift()
          this.animateUp = false
        }, 500)
      },
      getServerData(url, dataInfo, callback) {
        let that = this;
        if (!url) {
          console.log("接口地址为空，只能使用静态数据", dataInfo);
          callback(dataInfo);
          return;
        }
        console.log('url',url)
        IDM.http.get(url)
          .then(res => {
            if (res.data.code == 200) {
              callback(res.data);
            } else {
              // Message.error(res.data.message);
            }
          }).catch(err => {
            
          })
      },
    },
    destroyed() {
      clearInterval(this.timer)
    }

  };
</script>
<style lang="scss">
  .marquee-wrap {
    display: inline-block;
    width: 300px;
    height: 30px;
    overflow: hidden;
    position: relative;

    .marquee-list {
      margin: 0;
      padding: 0;
      li {
        width: 100%;
        height: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        // padding: 0 20px;
        list-style: none;
        line-height: 30px;
        text-align: left;
        // font-size: 18px;
        font-weight: 400;
      }
    }

    .animate-up {
      transition: all 0.5s ease-in-out;
      transform: translateY(-30px);
    }
  }
</style>