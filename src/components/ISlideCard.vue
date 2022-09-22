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
    class="i-slideCard-outer"
    ref="module_ref"
    :style="
      propData.heightType == 'adaptive' && moduleHeight ? { height: moduleHeight + 'px' } : {}
    "
  >
    <div class="i-slideCard-header" v-if="propData.isShowTitleBar">
      <div class="i-slideCard-header-main">
        <div class="i-slideCard-header-tit">
          <span v-if="propData.titleIconPosition === 'right'">{{ propData.title }}</span>
          <div class="i-slideCard-header-tit-icon" v-if="propData.showIcon">
            <svg
              v-if="propData.titleIcon && propData.titleIcon.length > 0"
              class="idm_filed_svg_icon"
              aria-hidden="true"
            >
              <use :xlink:href="`#${propData.titleIcon && propData.titleIcon[0]}`" />
            </svg>
            <svg-icon v-else icon-class="application-icon" />
          </div>
          <span v-if="propData.titleIconPosition === 'left'">{{ propData.title }}</span>
        </div>
      </div>
      <div class="i-slideCard-header-more" v-if="propData.moreBtn" @click="moreClick">更多 ></div>
    </div>
    <div class="i-slideCard-content">
      <a-spin v-if="isLoading" :tip="propData.loadingDescription || '加载中...'">
        <a-icon slot="indicator" type="loading" spin />
      </a-spin>
      <div
        v-else-if="data && data.length > 0"
        class="i-slideCard-content-wapper"
        :style="{
          'justify-content':
            propData.layoutType != 'scroll' && propData.rowMarginType == 'static'
              ? 'flex-start'
              : 'space-between',
          'overflow-x': propData.layoutType == 'scroll' ? 'auto' : 'hidden',
          'overflow-y': propData.layoutType == 'scroll' ? 'hidden' : 'auto',
          'flex-direction': propData.layoutType == 'scroll' ? 'row' : 'column'
        }"
      >
        <div
          class="i-slideCard-content-row"
          v-for="(record, i) in data"
          :key="i"
          :style="{
            'margin-top':
              i != 0 && propData.rowMarginType == 'static' ? propData.rowMargin + 'px' : '',
            width: propData.layoutType == 'scroll' && propData.columNum == 0 ? 'auto' : '100%',
            'justify-content':
              propData.layoutType == 'scroll' && propData.columNum != 0
                ? 'space-around'
                : 'space-between'
          }"
        >
          <div
            v-for="(item, index) in record"
            :key="index"
            :class="
              item
                ? 'i-slideCard-content-item'
                : 'i-slideCard-content-item i-slideCard-content-empty'
            "
            :style="{
              'flex-direction': propData.itemInnerDirection,
              'justify-content': propData.itemJustifyContent,
              'margin-left':
                index != 0 && propData.layoutType == 'scroll' && propData.columNum == 0
                  ? propData.itemMargin + 'px'
                  : '',
              'flex-shrink': propData.layoutType == 'scroll' && propData.columNum == 0 ? 0 : 1,
              'background-color':
                item &&
                (getExpressData('data', propData.bgColorField || 'bgColor', item) ||
                  (item.bgColor && item.bgColor.hex8))
                  ? propData.dataSourceType != 'static'
                    ? getExpressData('data', propData.bgColorField || 'bgColor', item)
                    : item.bgColor.hex8
                  : '',
              'background-image':
                item &&
                (getExpressData('data', propData.bgImageField || 'bgImgUrl', item) || item.bgImgUrl)
                  ? `url(${window.IDM.url.getWebPath(
                      propData.dataSourceType != 'static'
                        ? getExpressData('data', propData.bgImageField || 'bgImgUrl', item)
                        : item.bgImgUrl
                    )})`
                  : ''
            }"
            @click.stop="itemClick(item)"
          >
            <div v-if="item" class="item-img">
              <img
                v-if="propData.displayType == 'img'"
                width="100%"
                height="100%"
                :src="
                  IDM.url.getWebPath(
                    propData.dataSourceType != 'static'
                      ? getExpressData('data', propData.imageField || 'imgUrl', item)
                      : item.imgUrl
                  )
                "
              />
              <i
                v-else-if="propData.dataSourceType != 'static'"
                :class="getClassStr(getExpressData('data', propData.iconField || 'iconFont', item))"
              />
              <svg v-else class="idm_filed_svg_icon" aria-hidden="true">
                <use :xlink:href="`#${item.iconFont && item.iconFont[0]}`" />
              </svg>
            </div>
            <div
              class="item-text"
              v-if="item && propData.showText"
              :style="{ width: propData.itemInnerDirection == 'column' ? '100%' : 'auto' }"
            >
              <div v-if="propData.mainTextField" class="item-text-main">
                {{
                  propData.dataSourceType != 'static'
                    ? getExpressData('data', propData.mainTextField || 'name', item)
                    : item.name
                }}
              </div>
              <div
                class="item-text-extra"
                v-if="
                  propData.dataSourceType != 'static' &&
                  propData.extraFields &&
                  propData.extraFields.length > 0
                "
              >
                <div
                  class="item-text-extra-col"
                  v-for="(field, i) in propData.extraFields"
                  :key="i"
                  :style="{
                    'text-align': field.textAlign
                      ? field.textAlign
                      : i == 0
                      ? 'left'
                      : i == propData.extraFields.length - 1
                      ? 'right'
                      : 'center',
                    width: field.widthRatio ? `${field.widthRatio}%` : 'auto'
                  }"
                >
                  {{ getExpressData('data', field.name || 'name', item) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-empty v-else :description="propData.emptyDescription || '暂无数据'" />
    </div>
  </div>
</template>

<script>
const devResult = _this => [
  {
    imgUrl: IDM.url.getModuleAssetsWebPath(require('../assets/logo.png'), _this.moduleObject),
    name: '学习强国',
    text1: '15篇文章',
    text2: '3.5w人已学习'
  },
  {
    imgUrl: IDM.url.getModuleAssetsWebPath(require('../assets/logo.png'), _this.moduleObject),
    name: '学习强国',
    text1: '15篇文章',
    text2: '3.5w人已学习'
  },
  {
    imgUrl: IDM.url.getModuleAssetsWebPath(require('../assets/logo.png'), _this.moduleObject),
    name: '学习强国',
    text1: '15篇文章',
    text2: '3.5w人已学习'
  },
  {
    imgUrl: IDM.url.getModuleAssetsWebPath(require('../assets/logo.png'), _this.moduleObject),
    name: '学习强国',
    text1: '15篇文章',
    text2: '3.5w人已学习'
  },
  {
    imgUrl: IDM.url.getModuleAssetsWebPath(require('../assets/logo.png'), _this.moduleObject),
    name: '学习强国',
    text1: '15篇文章',
    text2: '3.5w人已学习'
  }
];
export default {
  name: 'ISlideCard',
  // heightType: 'fixed',
  // itemInnerDirection: 'column',
  // dataSourceType: 'customInterface',
  // displayType: 'icon',
  // dataSource: '1',
  // layoutType: 'scroll',
  // isShowTitleBar: true,
  // rowMarginType: 'ad',
  // columNum: 3,
  // moreBtn: true,
  // showIcon: true,
  // showText: true,
  // titleIconPosition: 'left',
  // title: '主题教育',
  // imageField: 'img',
  // mainTextField: 'name',
  // imageWidth: 50,
  // imageHeight: 50,
  // itemMargin: 10,
  // rowMargin: 10,
  // itemJumpPageParams: [{ key: 'itemName', field: 'name' }]
  // // extraFields: [{ name: 'text1' }, { name: 'text2' }]
  data() {
    return {
      moduleObject: {},
      moduleHeight: 0,
      propData: this.$root.propData.compositeAttr || {},
      isLoading: false,
      data: []
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.initAttrToModule();
    this.loadIconFile();
    this.initData();
  },
  watch: {
    'propData.selectColumn': {
      handler(value) {
        this.initData();
      },
      deep: true
    }
  },
  methods: {
    initAttrToModule() {
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
      this.$nextTick(() => {
        this.resizeContentWrapperHeight();
      });
    },
    // 加载css
    loadIconFile() {
      if (this.propData.iconfontUrl && this.propData.dataSourceType != 'static') {
        let baseUrl =
          this.propData.iconfontUrl +
          (this.propData.iconfontUrl.substring(
            this.propData.iconfontUrl.length - 1,
            this.propData.iconfontUrl.length
          ) == '/'
            ? ''
            : '/');
        IDM.http
          .get(baseUrl + 'iconfont.json', {})
          .then(res => {
            if (!res.data) {
              return;
            }
            //存在，加载css
            IDM.module.loadCss(IDM.url.getWebPath(baseUrl + 'iconfont.css'), true);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    getClassStr(icon) {
      // 自定义
      const isCustom = this.propData.iconfontUrl ? true : false;
      // 取自定义字段 默认 iconfont
      let fontFamily = isCustom && this.propData.iconFontFamily ? this.propData.iconFontFamily : '';
      // 取自定义前缀 默认icon-
      let prefix = isCustom && this.propData.iconPrefix ? this.propData.iconPrefix : '';
      let familyStr = `${fontFamily} ${prefix}`;
      return familyStr + icon;
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.initAttrToModule();
      this.initData();
    },
    /**
     * 组件通信：接收消息的方法
     */
    receiveBroadcastMessage(messageObject) {
      if (messageObject && messageObject.type === 'linkageReload') {
        this.initData();
      }
      if (messageObject && messageObject.type === 'websocket') {
        if (this.propData.messageRefreshKey && messageObject.message) {
          const messageData =
            (typeof messageObject.message === 'string' && JSON.parse(messageObject.message)) ||
            messageObject.message;
          const arr = Array.isArray(this.propData.messageRefreshKey)
            ? this.propData.messageRefreshKey
            : [this.propData.messageRefreshKey];
          if (messageData.badgeType && arr.includes(messageData.badgeType)) {
            this.initData();
          }
        }
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
        let resData = this.getExpressData(
          this.propData.dataName,
          this.propData.dataFiled,
          object.data
        );
        resData = this.customFormat(resData);
        resData = this.propData.resDataField
          ? this.getExpressData('data', this.propData.resDataField, resData)
          : resData;
        this.articleData = resData;
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
    customFormat(customFunction, resultData) {
      if (customFunction && customFunction[0] && customFunction[0].name) {
        resultData =
          window[customFunction[0].name] &&
          window[customFunction[0].name].call(this, {
            customParam: customFunction[0].param,
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
    customFunctionHandle(customFunction, param = {}) {
      if (customFunction && customFunction[0] && customFunction[0].name) {
        window[customFunction[0].name] &&
          window[customFunction[0].name].call(this, {
            customParam: customFunction[0].param,
            moduleObject: this.moduleObject,
            urlObject: IDM.url.queryObject(),
            pageId:
              window.IDM.broadcast && window.IDM.broadcast.pageModule
                ? window.IDM.broadcast.pageModule.id
                : '',
            ...param
          });
      }
    },
    commonParam() {
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '',
        urlData: JSON.stringify(urlObject)
      };
      return params;
    },
    /**
     * 请求数据
     */
    initData() {
      const urlParam = this.commonParam();
      if (this.propData.dataSourceType != 'static') {
        if (!this.propData.selectColumn || !this.propData.selectColumn.id || !this.propData.url) {
          this.setRows(devResult(this));
          return;
        }
        switch (this.propData.dataSourceType) {
          case 'customInterface':
            if (!this.propData.url) return;
            this.isLoading = true;
            IDM.http
              .get(this.propData.url, {
                columnId: this.propData.selectColumn.id,
                componentId: this.moduleObject.comId,
                pageId: urlParam.pageId,
                limit: this.propData.limit || ''
              })
              .done(res => {
                if (res.type === 'success') {
                  let resultData = this.customFormat(this.propData.customFunction, res.data);
                  resultData = this.propData.resDataField
                    ? this.getExpressData('data', this.propData.resDataField, resultData)
                    : resultData;
                  this.setRows(resultData);
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
            this.setRows(this.customFormat(this.propData.customFunction, []));
            break;
        }
      } else if (this.propData.dataStaticSet) {
        if (this.propData.dataStaticSet[0] && !this.propData.dataStaticSet[0].name) {
          this.setRows(devResult(this));
        } else {
          this.setRows(this.propData.dataStaticSet);
        }
      }
    },
    setRows(orignData) {
      const data = [];
      if (this.propData.layoutType == 'scroll' && this.propData.columNum == 0) {
        data[0] = orignData;
      } else {
        const columNum = this.propData.columNum || 3;
        orignData.forEach((item, index) => {
          if (data[parseInt(index / columNum)]) {
            data[parseInt(index / columNum)].push(item);
          } else {
            data[parseInt(index / columNum)] = [item];
          }
        });
        if (data[data.length - 1].length < columNum) {
          for (let i = 0; i < columNum; i++) {
            if (!data[data.length - 1][i]) {
              data[data.length - 1][i] = null;
            }
          }
        }
      }
      this.data = data;
    },
    moreClick() {
      if (!this.moduleObject.env || this.moduleObject.env == 'develop') {
        return;
      }
      if (this.propData.moreTarget && this.propData.moreTarget === 'custom') {
        this.customFunctionHandle(this.propData.customMoreBtnFunction);
      } else if (this.propData.moreUrl) {
        const url = IDM.url.getWebPath(this.propData.moreUrl);
        window.open(url, this.propData.moreTarget || '_self');
      }
    },
    itemClick(item) {
      if (!this.moduleObject.env || this.moduleObject.env == 'develop' || !item) {
        return;
      }
      if (this.propData.itemJumpTarget && this.propData.itemJumpTarget === 'custom') {
        this.customFunctionHandle(this.propData.customItemJumpFunction, { item });
      } else if (this.propData.itemJumpUrl) {
        const url = IDM.url.getWebPath(IDM.express.replace(this.propData.itemJumpUrl, item));
        window.open(url, this.propData.itemJumpTarget || '_self');
      }
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      const styleObject = {};
      const titleStyleObject = {};
      const innerCardStyleObject = {};
      const iconStyleObject = {};
      const emptyFontStyleObject = {};
      const emptyImgStyleObject = {};
      const loadingFontStyleObject = {};
      const loadingIconStyleObject = {};
      const itemStyleObject = {};
      const itemActiveStyleObject = {};
      const itemImgStyleObject = {};
      const moreBtnStyleObject = {};
      const mainTextStyleObject = {};
      const extraTextStyleObject = {};
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
      if (this.propData.innerBgSize && this.propData.innerBgSize == 'custom') {
        innerCardStyleObject['background-size'] =
          (this.propData.innerBgSizeWidth
            ? this.propData.innerBgSizeWidth.inputVal + this.propData.innerBgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.innerBgSizeHeight
            ? this.propData.innerBgSizeHeight.inputVal + this.propData.innerBgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.innerBgSize) {
        innerCardStyleObject['background-size'] = this.propData.innerBgSize;
      }

      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.innerPositionX && this.propData.innerPositionX.inputVal) {
        innerCardStyleObject['background-position-x'] =
          this.propData.innerPositionX.inputVal + this.propData.innerPositionX.selectVal;
      }

      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      if (this.propData.innerPositionY && this.propData.innerPositionY.inputVal) {
        innerCardStyleObject['background-position-y'] =
          this.propData.innerPositionY.inputVal + this.propData.innerPositionY.selectVal;
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
            // case 'innerWidth':
            //   innerCardStyleObject['width'] = element;
            //   break;
            // case 'innerHeight':
            //   innerCardStyleObject['height'] = element;
            //   break;
            case 'bgColor':
              if (element && element.hex8) {
                styleObject['background-color'] = IDM.hex8ToRgbaString(element.hex8);
              }
              break;
            case 'innerBgColor':
              if (element && element.hex8) {
                innerCardStyleObject['background-color'] = IDM.hex8ToRgbaString(element.hex8);
              }
              break;
            case 'itemBgColor':
              if (element && element.hex8) {
                itemStyleObject['background-color'] = IDM.hex8ToRgbaString(element.hex8);
              }
              break;
            case 'itemActiveBgColor':
              if (element && element.hex8) {
                itemActiveStyleObject['background-color'] = IDM.hex8ToRgbaString(element.hex8);
              }
              break;
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'itemShadow':
              itemStyleObject['box-shadow'] = element;
              break;
            case 'itemActiveShadow':
              itemActiveStyleObject['box-shadow'] = element;
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
            case 'innerBox':
              if (element.marginTopVal) {
                innerCardStyleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                innerCardStyleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                innerCardStyleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                innerCardStyleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                innerCardStyleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                innerCardStyleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                innerCardStyleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                innerCardStyleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'itembox':
              if (element.marginTopVal) {
                itemStyleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                itemStyleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                itemStyleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                itemStyleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                itemStyleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                itemStyleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                itemStyleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                itemStyleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'itemImgBox':
              if (element.marginTopVal) {
                itemImgStyleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                itemImgStyleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                itemImgStyleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                itemImgStyleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                itemImgStyleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                itemImgStyleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                itemImgStyleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                itemImgStyleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'bgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'innerBgImgUrl':
              innerCardStyleObject['background-image'] = `url(${window.IDM.url.getWebPath(
                element
              )})`;
              break;
            case 'positionX':
              //背景横向偏移
              break;
            case 'innerPositionX':
              //背景横向偏移
              break;
            case 'positionY':
              //背景纵向偏移
              break;
            case 'innerPositionY':
              //背景纵向偏移
              break;
            case 'bgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'innerBgRepeat':
              //平铺模式
              innerCardStyleObject['background-repeat'] = element;
              break;
            case 'bgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
            case 'innerBgAttachment':
              //背景模式
              innerCardStyleObject['background-attachment'] = element;
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
            case 'innerBorder':
              if (element.border.top.width > 0) {
                innerCardStyleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                innerCardStyleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  innerCardStyleObject['border-top-color'] = IDM.hex8ToRgbaString(
                    element.border.top.colors.hex8
                  );
                }
              }
              if (element.border.right.width > 0) {
                innerCardStyleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                innerCardStyleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  innerCardStyleObject['border-right-color'] = IDM.hex8ToRgbaString(
                    element.border.right.colors.hex8
                  );
                }
              }
              if (element.border.bottom.width > 0) {
                innerCardStyleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                innerCardStyleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  innerCardStyleObject['border-bottom-color'] = IDM.hex8ToRgbaString(
                    element.border.bottom.colors.hex8
                  );
                }
              }
              if (element.border.left.width > 0) {
                innerCardStyleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                innerCardStyleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  innerCardStyleObject['border-left-color'] = IDM.hex8ToRgbaString(
                    element.border.left.colors.hex8
                  );
                }
              }

              innerCardStyleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              innerCardStyleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              innerCardStyleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              innerCardStyleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case 'itemBorder':
              if (element.border.top.width > 0) {
                itemStyleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                itemStyleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  itemStyleObject['border-top-color'] = IDM.hex8ToRgbaString(
                    element.border.top.colors.hex8
                  );
                }
              }
              if (element.border.right.width > 0) {
                itemStyleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                itemStyleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  itemStyleObject['border-right-color'] = IDM.hex8ToRgbaString(
                    element.border.right.colors.hex8
                  );
                }
              }
              if (element.border.bottom.width > 0) {
                itemStyleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                itemStyleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  itemStyleObject['border-bottom-color'] = IDM.hex8ToRgbaString(
                    element.border.bottom.colors.hex8
                  );
                }
              }
              if (element.border.left.width > 0) {
                itemStyleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                itemStyleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  itemStyleObject['border-left-color'] = IDM.hex8ToRgbaString(
                    element.border.left.colors.hex8
                  );
                }
              }

              itemStyleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              itemStyleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              itemStyleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              itemStyleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case 'itemActiveBorder':
              if (element.border.top.width > 0) {
                itemActiveStyleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                itemActiveStyleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  itemActiveStyleObject['border-top-color'] = IDM.hex8ToRgbaString(
                    element.border.top.colors.hex8
                  );
                }
              }
              if (element.border.right.width > 0) {
                itemActiveStyleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                itemActiveStyleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  itemActiveStyleObject['border-right-color'] = IDM.hex8ToRgbaString(
                    element.border.right.colors.hex8
                  );
                }
              }
              if (element.border.bottom.width > 0) {
                itemActiveStyleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                itemActiveStyleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  itemActiveStyleObject['border-bottom-color'] = IDM.hex8ToRgbaString(
                    element.border.bottom.colors.hex8
                  );
                }
              }
              if (element.border.left.width > 0) {
                itemActiveStyleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                itemActiveStyleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  itemActiveStyleObject['border-left-color'] = IDM.hex8ToRgbaString(
                    element.border.left.colors.hex8
                  );
                }
              }

              itemActiveStyleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              itemActiveStyleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              itemActiveStyleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              itemActiveStyleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case 'itemImgBorder':
              if (element.border.top.width > 0) {
                itemImgStyleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                itemImgStyleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  itemImgStyleObject['border-top-color'] = IDM.hex8ToRgbaString(
                    element.border.top.colors.hex8
                  );
                }
              }
              if (element.border.right.width > 0) {
                itemImgStyleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                itemImgStyleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  itemImgStyleObject['border-right-color'] = IDM.hex8ToRgbaString(
                    element.border.right.colors.hex8
                  );
                }
              }
              if (element.border.bottom.width > 0) {
                itemImgStyleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                itemImgStyleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  itemImgStyleObject['border-bottom-color'] = IDM.hex8ToRgbaString(
                    element.border.bottom.colors.hex8
                  );
                }
              }
              if (element.border.left.width > 0) {
                itemImgStyleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                itemImgStyleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  itemImgStyleObject['border-left-color'] = IDM.hex8ToRgbaString(
                    element.border.left.colors.hex8
                  );
                }
              }

              itemImgStyleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              itemImgStyleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              itemImgStyleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              itemImgStyleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
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
            case 'titleIconColor':
              iconStyleObject['color'] = IDM.hex8ToRgbaString(element.hex8);
              break;
            case 'titleIconSize':
              iconStyleObject['font-size'] = `${element}px`;
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
            case 'moreFont':
              moreBtnStyleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                moreBtnStyleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              moreBtnStyleObject['font-weight'] =
                element.fontWeight && element.fontWeight.split(' ')[0];
              moreBtnStyleObject['font-style'] = element.fontStyle;
              moreBtnStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              moreBtnStyleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              moreBtnStyleObject['text-align'] = element.fontTextAlign;
              moreBtnStyleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'mainFont':
              mainTextStyleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                mainTextStyleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              mainTextStyleObject['font-weight'] =
                element.fontWeight && element.fontWeight.split(' ')[0];
              mainTextStyleObject['font-style'] = element.fontStyle;
              mainTextStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              mainTextStyleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              mainTextStyleObject['text-align'] = element.fontTextAlign;
              mainTextStyleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'extraFont':
              extraTextStyleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                extraTextStyleObject['color'] = IDM.hex8ToRgbaString(element.fontColors.hex8);
              }
              extraTextStyleObject['font-weight'] =
                element.fontWeight && element.fontWeight.split(' ')[0];
              extraTextStyleObject['font-style'] = element.fontStyle;
              extraTextStyleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              extraTextStyleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              extraTextStyleObject['text-align'] = element.fontTextAlign;
              extraTextStyleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'itemImgWidth':
              itemImgStyleObject['width'] = `${element}`;
              break;
            case 'itemImgHeight':
              itemImgStyleObject['height'] = `${element}`;
              break;
            case 'itemIconSize':
              itemImgStyleObject['font-size'] = `${element}px`;
              break;
            case 'itemIconColor':
              if (element && element.hex8) {
                itemImgStyleObject['color'] = IDM.hex8ToRgbaString(element.hex8);
              }
              break;
            case 'itemImgBgColor':
              if (element && element.hex8) {
                itemImgStyleObject['background-color'] = IDM.hex8ToRgbaString(element.hex8);
              }
              break;
            case 'itemBoxWidth':
              itemStyleObject['width'] = `${element}`;
              break;
            case 'itemBoxHeight':
              itemStyleObject['height'] = `${element}`;
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
              break;
          }
        }
      }
      // 内层容器高度适配，若外层有高度，则内层随外层缩放。若外层没有高度，则由内层容器的子元素撑起。前提设置的有外层容器高度属性，若无此值不走此逻辑，取下面style中的预设
      if (styleObject.height && styleObject.height != 'auto') {
        innerCardStyleObject.height = 0;
      } else if (styleObject.height && styleObject.height == 'auto') {
        innerCardStyleObject.height = 'auto';
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-slideCard-content',
        innerCardStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-slideCard-header-tit span',
        titleStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-slideCard-header-tit .i-slideCard-header-tit-icon',
        iconStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-slideCard-header .i-slideCard-header-more',
        moreBtnStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-slideCard-content .i-slideCard-content-item',
        itemStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-slideCard-content .i-slideCard-content-item:hover:not(.i-slideCard-content-empty)',
        itemActiveStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-slideCard-content .i-slideCard-content-item .item-img',
        itemImgStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-slideCard-content .i-slideCard-content-item .item-text-main',
        mainTextStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-slideCard-content .i-slideCard-content-item .item-text-extra',
        extraTextStyleObject
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
        if (item.key != IDM.theme.getCurrentThemeInfo()) {
          //此处比对是不渲染输出不用的样式，如果页面会刷新就可以把此处放开
          continue;
        }

        const mainColor = {
          color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
        };
        const mainBgColor = {
          'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
        };
        const minorBgColor = {
          'background-color': item.minorColor ? IDM.hex8ToRgbaString(item.minorColor.hex8) : ''
        };
        const minorColor = {
          color: item.minorColor ? IDM.hex8ToRgbaString(item.minorColor.hex8) : ''
        };

        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .i-slideCard-header .i-slideCard-header-more',
          mainColor
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .i-slideCard-header-tit .i-slideCard-header-tit-icon',
          mainColor
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .i-slideCard-content .i-slideCard-content-item .item-text-extra',
          mainColor
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .ant-spin',
          mainColor
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .i-slideCard-content .i-slideCard-content-item .item-img',
          { ...mainColor, ...minorBgColor }
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .i-slideCard-content .i-slideCard-content-item:hover:not(.i-slideCard-content-empty)',
          mainBgColor
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .i-slideCard-content .i-slideCard-content-item:hover:not(.i-slideCard-content-empty) .item-img',
          minorColor
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' +
            (this.moduleObject.packageid || 'module_demo') +
            ' .i-slideCard-content .i-slideCard-content-item:hover:not(.i-slideCard-content-empty) .item-text-main',
          minorColor
        );
      }
    }
  }
};
</script>

<style scoped lang="scss">
.i-slideCard-outer {
  width: auto;
  box-sizing: border-box;
  padding: 10px;
  font-family: PingFangSC-Regular;
  color: #333333;
  background-color: #fff;
  position: relative;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: auto;
  overflow: hidden;

  .i-slideCard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .i-slideCard-header-main {
      // width: 86%;
      flex-grow: 1;
      display: flex;
      align-items: center;

      .i-slideCard-header-tit {
        font-family: PingFangSC-Regular;
        color: #333333;
        font-style: normal;
        text-decoration: none;
        font-size: 16px;
        max-width: 60%;
        display: flex;
        align-items: center;

        .i-slideCard-header-tit-icon {
          display: inline-block;
          flex: 1;
          margin-right: 5px;
        }

        span {
          margin-right: 5px;
          width: 90%;
          overflow: hidden;
          flex: 8;
        }

        .idm_filed_svg_icon {
          font-size: 1em;
          width: 1em;
          height: 1em;
          fill: currentColor;
          vertical-align: -0.15em;
          outline: none;
        }
      }
    }

    .i-slideCard-header-more {
      color: red;
      &:hover {
        opacity: 0.7;
      }
    }
  }

  .i-slideCard-content {
    flex-grow: 1;
    flex-shrink: 1;
    height: auto;

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

    .i-slideCard-content-wapper {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      &::-webkit-scrollbar {
        display: none;
      }
      .i-slideCard-content-row {
        display: flex;
        flex-shrink: 0;
        // width: 100%;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        .i-slideCard-content-empty {
          opacity: 0;
        }
        .i-slideCard-content-item {
          cursor: pointer;
          height: 90px;
          width: 90px;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px;
          &:hover:not(.i-slideCard-content-empty) {
            background-color: #f2f3f5;
          }
          .item-img {
            width: 50px;
            height: 50px;
            font-size: 50px;
            border-radius: 5px;
            overflow: hidden;
            align-items: center;
            display: flex;
            justify-content: center;
            .idm_filed_svg_icon {
              font-size: inherit;
              line-height: 1;
              width: 1em;
              height: 1em;
              display: block;
              fill: currentColor;
              // vertical-align: -0.15em;
              outline: none;
            }
            img {
              width: 100%;
              height: 100%;
              display: block;
            }
            i {
              width: 100%;
              height: 100%;
              display: block;
              font-size: inherit;
              color: inherit;
              line-height: 1;
            }
          }
          .item-text {
            width: 100%;
            .item-text-main {
              width: 100%;
              // overflow: hidden;
              // white-space: nowrap;
              // text-overflow: ellipsis;
              line-height: 1.6;
              text-align: center;
            }
            .item-text-extra {
              width: 100%;
              display: flex;
              font-size: 12px;
              color: red;
              .item-text-extra-col {
                flex-grow: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }
  }
}
</style>
