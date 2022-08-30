<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    ref="module_ref"
    class="i-articleDetails-outer"
    :style="
      propData.heightType == 'adaptive' && moduleHeight ? { height: moduleHeight + 'px' } : {}
    "
  >
    <a-spin v-if="isLoading" :tip="propData.loadingDescription || '加载中...'">
      <a-icon slot="indicator" type="loading" spin />
    </a-spin>
    <div
      v-else-if="articleData && Object.keys(articleData).length > 0"
      class="i-articleDetails-wapper"
    >
      <div class="i-articleDetails-header">
        <div v-if="propData.titleField" class="i-articleDetails-title">
          {{ getExpressData('data', propData.titleField, articleData) }}
        </div>
        <div
          v-if="propData.extraFieldList && propData.extraFieldList.length > 0"
          class="i-articleDetails-author"
        >
          <div
            v-for="(item, index) in propData.extraFieldList"
            :key="index"
            class="i-articleDetails-author-item"
            :style="{
              'margin-left': propData.authorItemMargin / 2 + 'px',
              'margin-righ': propData.authorItemMargin / 2 + 'px'
            }"
          >
            {{ item.name }}{{ item.field ? getExpressData('data', item.field, articleData) : '' }}
          </div>
        </div>
      </div>
      <div
        v-if="propData.contentField"
        class="i-articleDetails-content"
        v-html="getExpressData('data', propData.contentField, articleData)"
      ></div>
    </div>
    <a-empty v-else :description="propData.emptyDescription || '暂无数据'" />
  </div>
</template>

<script>
export default {
  name: 'IArticleDetails',
  data() {
    // heightType: 'fixed',
    // dataSource: '1',
    // titleField: 'title',
    // contentField: 'content',
    // loadingSize: 32,
    // emptyImageWidth: 120,
    // emptyImageHeight: 100,
    // themeList: [{key: 'blue', mainColor: {hex8:'#999999FF'}}],
    // extraFieldList: [
    //   {
    //     name: '作者：',
    //     field: 'author',
    //     textAlign: 'right'
    //   },
    //   {
    //     name: '时间：',
    //     field: 'time',
    //     textAlign: 'left'
    //   },
    //   {
    //     name: '访问量：',
    //     field: 'number',
    //     textAlign: 'left'
    //   }
    // ]
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      isLoading: false,
      articleData: {}
    };
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.initAttrToModule();

    this.initData();
  },
  methods: {
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.initAttrToModule();
    },
    /**
     * 组件通信：接收消息的方法
     */
    receiveBroadcastMessage(messageObject) {
      if (messageObject && messageObject.type === 'linkageReload') {
        this.initData();
      }
      if (
        messageObject &&
        messageObject.type === 'regionResize' &&
        messageObject.message &&
        messageObject.message.gridEleTarget
      ) {
        const gridEleTarget = messageObject.message.gridEleTarget;
        if (gridEleTarget && gridEleTarget.offsetHeight) {
          this.resizeContentWrapperHeight(gridEleTarget.offsetHeight);
        }
      }
    },
    setContextValue(object) {
      if (
        object.type == 'pageCommonInterface' &&
        this.propData.dataSourceType == 'pageCommonInterface' &&
        object.key == this.propData.dataName
      ) {
        const resData = this.getExpressData(
          this.propData.dataName,
          this.propData.dataFiled,
          object.data
        );
        this.articleData = this.customFormat(resData);
      }
    },
    resizeContentWrapperHeight(wrapperHeight) {
      let moduleHeight =
        this.propData.heightType == 'adaptive'
          ? $('#' + this.moduleObject.packageid)
              .parents('.fsl-region-element')
              .height()
          : this.propData.moduleHeight;
      if (this.propData.heightType == 'adaptive' && (wrapperHeight || moduleHeight)) {
        //自适应父级容器
        moduleHeight = wrapperHeight || moduleHeight;

        //如果自适应则要减去上margin和下margin(因为margin、padding百分比都是相对父级宽度，所以要计算出实际的宽度值)
        //父级宽度值未知的，因为组件的宽度是100%显示的
        //所以计算公式为：(当前组件的宽度+左右margin实际数值)/(100-左右margin百分比总和)*100=实际宽度
        let iAttrArray = ['marginLeftVal', 'marginRightVal'];
        let marginNumber = 0,
          marginRatio = 0;
        iAttrArray.forEach(item => {
          if (
            this.propData.box &&
            this.propData.box[item] &&
            this.propData.box[item].indexOf('%') > -1
          ) {
            //用宽度计算出实际的px
            marginRatio += parseFloat(this.propData.box[item].replace('%', ''));
          } else if (this.propData.box && this.propData.box[item]) {
            marginNumber += parseFloat(this.propData.box[item].replace('px', ''));
          }
        });
        let module_width = this.$refs.module_ref.offsetWidth;
        //实际的100%的宽度
        const module_width_100 = ((module_width + marginNumber) / (100 - marginRatio)) * 100;

        let moduleTBMarginNumber = 0;
        iAttrArray = ['marginTopVal', 'marginBottomVal'];
        iAttrArray.forEach(item => {
          if (this.propData.box && this.propData.box[item]) {
            if (this.propData.box[item].indexOf('%') > -1) {
              //用宽度计算出实际的px
              moduleTBMarginNumber =
                moduleTBMarginNumber +
                (parseFloat(this.propData.box[item].replace('%', '')) / 100) * module_width_100;
            } else {
              moduleTBMarginNumber =
                moduleTBMarginNumber + parseFloat(this.propData.box[item].replace('px', ''));
            }
          }
        });
        moduleHeight = moduleHeight - moduleTBMarginNumber;
      }
      this.moduleHeight = moduleHeight;
    },
    initAttrToModule() {
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
      this.$nextTick(() => {
        this.resizeContentWrapperHeight();
      });
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths('[') ? '' : '.') + filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject);
      }
      return _defaultVal;
    },
    customFormat(resultData) {
      if (
        this.propData.customFunction &&
        this.propData.customFunction[0] &&
        this.propData.customFunction[0].name
      ) {
        resultData =
          window[this.propData.customFunction[0].name] &&
          window[this.propData.customFunction[0].name].call(this, {
            customParam: this.propData.customFunction[0].param,
            moduleObject: this.moduleObject,
            resultData: resultData,
            urlObject: IDM.url.queryObject(),
            pageId:
              window.IDM.broadcast && window.IDM.broadcast.pageModule
                ? window.IDM.broadcast.pageModule.id
                : ''
          });
      }
      return resultData;
    },
    /**
     * 请求数据
     */
    initData() {
      if (!this.moduleObject.env || this.moduleObject.env == 'develop') {
        this.articleData = {
          title: '标题',
          content: '<span>html标签包裹的文本</span>',
          author: '演示',
          time: '2022-08-15 09:03',
          number: '167'
        };
        return;
      }
      switch (this.propData.dataSourceType) {
        case 'customInterface':
          if (!this.propData.url) return;
          this.isLoading = true;
          IDM.http
            .get(this.propData.url)
            .done(res => {
              if (res.type === 'success') {
                this.articleData = this.customFormat(res.data);
              } else {
                IDM.message.error(res.message || '操作失败!');
              }
              this.isLoading = false;
            })
            .error(err => {
              console.log(err);
              this.isLoading = false;
            });
          break;
        case 'pageCommonInterface':
          //使用通用接口直接跳过，在setContextValue执行
          break;
        case 'customFunction':
          this.articleData = this.customFormat({});
      }
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      const styleObject = {};
      const titleStyleObject = {};
      const authorStyleObject = {};
      const contentStyleObject = {};
      const emptyImgStyleObject = {};
      const emptyFontStyleObject = {};
      const loadingIconStyleObject = {};
      const loadingFontStyleObject = {};
      if (this.propData.bgSize && this.propData.bgSize == 'custom') {
        styleObject['background-size'] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.bgSize) {
        styleObject['background-size'] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'width':
            case 'height':
              styleObject[key] = element;
              break;
            case 'bgColor':
              if (element && element.hex8) {
                styleObject['background-color'] = IDM.hex8ToRgbaString(element.hex8);
              }
              break;
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'box':
              if (element.marginTopVal) {
                styleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                styleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                styleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                styleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                styleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                styleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                styleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                styleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'titleBox':
              if (element.marginTopVal) {
                titleStyleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                titleStyleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                titleStyleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                titleStyleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                titleStyleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                titleStyleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                titleStyleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                titleStyleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'authorBox':
              if (element.marginTopVal) {
                authorStyleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                authorStyleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                authorStyleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                authorStyleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                authorStyleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                authorStyleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                authorStyleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                authorStyleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'contentBox':
              if (element.marginTopVal) {
                contentStyleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                contentStyleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                contentStyleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                contentStyleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                contentStyleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                contentStyleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                contentStyleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                contentStyleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'positionX':
              //背景横向偏移

              break;
            case 'positionY':
              //背景纵向偏移

              break;
            case 'bgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'bgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'bgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
            case 'border':
              if (element.border.top.width > 0) {
                styleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                styleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleObject['border-top-color'] = IDM.hex8ToRgbaString(
                    element.border.top.colors.hex8
                  );
                }
              }
              if (element.border.right.width > 0) {
                styleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                styleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleObject['border-right-color'] = IDM.hex8ToRgbaString(
                    element.border.right.colors.hex8
                  );
                }
              }
              if (element.border.bottom.width > 0) {
                styleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                styleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleObject['border-bottom-color'] = IDM.hex8ToRgbaString(
                    element.border.bottom.colors.hex8
                  );
                }
              }
              if (element.border.left.width > 0) {
                styleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                styleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleObject['border-left-color'] = IDM.hex8ToRgbaString(
                    element.border.left.colors.hex8
                  );
                }
              }

              styleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              styleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              styleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              styleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case 'titleBorder':
              if (element.border.top.width > 0) {
                titleStyleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                titleStyleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  titleStyleObject['border-top-color'] = IDM.hex8ToRgbaString(
                    element.border.top.colors.hex8
                  );
                }
              }
              if (element.border.right.width > 0) {
                titleStyleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                titleStyleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  titleStyleObject['border-right-color'] = IDM.hex8ToRgbaString(
                    element.border.right.colors.hex8
                  );
                }
              }
              if (element.border.bottom.width > 0) {
                titleStyleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                titleStyleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  titleStyleObject['border-bottom-color'] = IDM.hex8ToRgbaString(
                    element.border.bottom.colors.hex8
                  );
                }
              }
              if (element.border.left.width > 0) {
                titleStyleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                titleStyleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  titleStyleObject['border-left-color'] = IDM.hex8ToRgbaString(
                    element.border.left.colors.hex8
                  );
                }
              }

              titleStyleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              titleStyleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              titleStyleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              titleStyleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case 'authorBorder':
              if (element.border.top.width > 0) {
                authorStyleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                authorStyleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  authorStyleObject['border-top-color'] = IDM.hex8ToRgbaString(
                    element.border.top.colors.hex8
                  );
                }
              }
              if (element.border.right.width > 0) {
                authorStyleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                authorStyleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  authorStyleObject['border-right-color'] = IDM.hex8ToRgbaString(
                    element.border.right.colors.hex8
                  );
                }
              }
              if (element.border.bottom.width > 0) {
                authorStyleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                authorStyleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  authorStyleObject['border-bottom-color'] = IDM.hex8ToRgbaString(
                    element.border.bottom.colors.hex8
                  );
                }
              }
              if (element.border.left.width > 0) {
                authorStyleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                authorStyleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  authorStyleObject['border-left-color'] = IDM.hex8ToRgbaString(
                    element.border.left.colors.hex8
                  );
                }
              }

              authorStyleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              authorStyleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              authorStyleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              authorStyleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case 'contentBorder':
              if (element.border.top.width > 0) {
                contentStyleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                contentStyleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  contentStyleObject['border-top-color'] = IDM.hex8ToRgbaString(
                    element.border.top.colors.hex8
                  );
                }
              }
              if (element.border.right.width > 0) {
                contentStyleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                contentStyleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  contentStyleObject['border-right-color'] = IDM.hex8ToRgbaString(
                    element.border.right.colors.hex8
                  );
                }
              }
              if (element.border.bottom.width > 0) {
                contentStyleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                contentStyleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  contentStyleObject['border-bottom-color'] = IDM.hex8ToRgbaString(
                    element.border.bottom.colors.hex8
                  );
                }
              }
              if (element.border.left.width > 0) {
                contentStyleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                contentStyleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  contentStyleObject['border-left-color'] = IDM.hex8ToRgbaString(
                    element.border.left.colors.hex8
                  );
                }
              }

              contentStyleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              contentStyleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              contentStyleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              contentStyleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case 'font':
              styleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              styleObject['font-weight'] = element.fontWeight && element.fontWeight.split(' ')[0];
              styleObject['font-style'] = element.fontStyle;
              styleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              styleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              styleObject['text-align'] = element.fontTextAlign;
              styleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'titleFont':
              titleStyleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                titleStyleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              titleStyleObject['font-weight'] =
                element.fontWeight && element.fontWeight.split(' ')[0];
              titleStyleObject['font-style'] = element.fontStyle;
              titleStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              titleStyleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              titleStyleObject['text-align'] = element.fontTextAlign;
              titleStyleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'authorFont':
              authorStyleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                authorStyleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              authorStyleObject['font-weight'] =
                element.fontWeight && element.fontWeight.split(' ')[0];
              authorStyleObject['font-style'] = element.fontStyle;
              authorStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              authorStyleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              authorStyleObject['text-align'] = element.fontTextAlign;
              authorStyleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'contentFont':
              contentStyleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                contentStyleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              contentStyleObject['font-weight'] =
                element.fontWeight && element.fontWeight.split(' ')[0];
              contentStyleObject['font-style'] = element.fontStyle;
              contentStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              contentStyleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              contentStyleObject['text-align'] = element.fontTextAlign;
              contentStyleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'loadingFont':
              loadingFontStyleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                loadingFontStyleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              loadingFontStyleObject['font-weight'] =
                element.fontWeight && element.fontWeight.split(' ')[0];
              loadingFontStyleObject['font-style'] = element.fontStyle;
              loadingFontStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              loadingFontStyleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              loadingFontStyleObject['text-align'] = element.fontTextAlign;
              loadingFontStyleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'emptyFont':
              emptyFontStyleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                emptyFontStyleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              emptyFontStyleObject['font-weight'] =
                element.fontWeight && element.fontWeight.split(' ')[0];
              emptyFontStyleObject['font-style'] = element.fontStyle;
              emptyFontStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              emptyFontStyleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              emptyFontStyleObject['text-align'] = element.fontTextAlign;
              emptyFontStyleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'emptyImageHeight':
              emptyImgStyleObject['height'] = element + 'px';
              break;
            case 'emptyImageWidth':
              emptyImgStyleObject['width'] = element + 'px';
              break;
            case 'loadingSize':
              loadingIconStyleObject['font-size'] = element + 'px';
              break;
            case 'loadingColor':
              if (element.hex8) {
                loadingIconStyleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-articleDetails-header .i-articleDetails-title',
        titleStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-articleDetails-header .i-articleDetails-author',
        authorStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-articleDetails-content',
        contentStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .ant-empty .ant-empty-description',
        emptyFontStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .ant-empty .ant-empty-image',
        emptyImgStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ' .ant-spin .ant-spin-text',
        loadingFontStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ' .ant-spin .ant-spin-dot',
        loadingIconStyleObject
      );
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
      const themeList = this.propData.themeList;
      if (!themeList) {
        return;
      }
      const themeNamePrefix =
        IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : 'idm-theme-';
      for (var i = 0; i < themeList.length; i++) {
        const item = themeList[i];
        // if (item.key != IDM.theme.getCurrentThemeInfo()) {
        //   //此处比对是不渲染输出不用的样式，如果页面会刷新就可以把此处放开
        //   continue;
        // }

        const colorObject = {
          color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
        };

        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .i-articleDetails-header .i-articleDetails-title',
          colorObject
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .ant-spin',
          colorObject
        );
      }
    }
  }
};
</script>

<style scoped lang="scss">
.i-articleDetails-outer {
  width: auto;
  height: 500px;
  box-sizing: border-box;
  padding: 10px;
  font-family: PingFangSC-Regular;
  color: #333333;
  background-color: #fff;
  position: relative;
  font-size: 14px;
  .i-articleDetails-wapper {
    height: 100%;
    overflow: auto;
    .i-articleDetails-header {
      .i-articleDetails-title {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        white-space: pre-wrap;
      }
      .i-articleDetails-author {
        font-size: 14px;
        color: #9195a3;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0;
        margin-top: 14px;
        .i-articleDetails-author-item {
          margin-right: 20px;
          margin-left: 20px;
        }
      }
    }
    .i-articleDetails-content {
      font-size: 16px;
      white-space: pre-wrap;
      margin-top: 20px;
    }
  }

  ::v-deep .ant-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    svg {
      height: 100%;
      width: 100%;
    }
  }

  ::v-deep .ant-spin {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .anticon {
      margin-bottom: 8px;
      font-size: 32px;
    }
  }
}
</style>
