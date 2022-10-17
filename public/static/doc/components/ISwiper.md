# 轮播
~~当前为自动生成的模板，保存前请删除此行~~
这里用来描述组件的具体作用说明，描述内容建议简明扼要。
## 组件类名（className）
ISwiper
## 组件类ID（classId）
idm.component.cms.swiper
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
cms@1.0.2
## 组件属性
### 唯一标识【ctrlId】
>只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
#### 滑动方向【direction】
> 滑动方向，可设置为水平方向切换 horizontal 或垂直方向切换 vertical
- 标识：`direction`
- 默认值: `水平`
#### 显示标题【showTitle】
> 垂直方向滑动时，右侧描述是否显示；水平方向滑动时，底部描述是否显示
- 标识：`showTitle`
- 默认值: `显示`
#### 标题时间【showTitleTime】
> 水平方向滑动时，底部描述是否显示时间字段
- 标识：`showTitleTime`
- 默认值: `隐藏`
#### 标题位置【titlePosition】
> 标题位置
- 标识：`titlePosition`
- 默认值: `图片外`
#### 跳转方式【jumpStyle】
> 跳转方式，可选择当前页跳转或者新标签页打开
- 标识：`jumpStyle`
- 默认值: `当前页打开`
#### 选择栏目【selectColumn】
> 选择栏目
- 标识：`selectColumn`
- 默认值: `/ctrl/website/api/channelTree`
#### 显示数量【limit】
> 显示数量，最多显示几个
- 标识：`limit`
- 默认值: ``
#### 切换时间【intervalTime】
> 切换时间
- 标识：`intervalTime`
- 默认值: `5000`
#### 切换效果【interchargeEffect】
> 切换效果
1) 普通位移切换，
2) 淡入淡出，
3) 方块，
4) 3d翻转
- 标识：`interchargeEffect`
- 默认值: `普通位移切换`
#### 填充方式【objectFit】
> 填充方式
1) fill：不保证保持原有的比例，内容拉伸填充整个内容容器
2) contain：保持原有尺寸比例。内容被缩放
3) cover：保持原有尺寸比例。但部分内容可能被剪切
4) none：保留原有元素内容的长度和宽度，也就是说内容不会被重置
- 标识：`objectFit`
- 默认值: `fill`
### 底部标题样式设置
#### 标题文字【fontHorizontalTitle】
> 标题文字
- 标识：`fontHorizontalTitle`
- 默认值: `空`
#### 时间文字【fontHorizontalTime】
> 时间文字
- 标识：`fontHorizontalTime`
- 默认值: `空`
#### 容器高度【heightHorizontalTitle】
> 标题容器的高度,例如可填写100
- 标识：`heightHorizontalTitle`
- 默认值: `80`
#### 垂直偏移【positionYTitle】
> 标题容器垂直方向的偏移量
- 标识：`positionYTitle`
- 默认值: ``
#### 背景色【bgColorHorizontalTitle】
> 背景色
- 标识：`bgColorHorizontalTitle`
- 默认值: ``
#### 标题内外边距【boxHorizontalText】
> 标题内外边距
- 标识：`boxHorizontalText`
- 默认值: ``
#### 容器内外边距【boxHorizontalTitle】
> 容器内外边距
- 标识：`boxHorizontalTitle`
- 默认值: ``
### 右侧标题样式设置
#### 容器宽度【widthVerticalTitle】
> 标题容器的宽度
- 标识：`widthVerticalTitle`
- 默认值: `200px`
#### 标题文字【fontVerticalTitle】
> 标题文字
- 标识：`fontVerticalTitle`
- 默认值: ``
#### 背景色【bgColorVerticalTitle】
> 背景色
- 标识：`bgColorVerticalTitle`
- 默认值: ``
#### 选中文字【fontVerticalTitleActive】
> 选中当前标题时文字样式
- 标识：`fontVerticalTitleActive`
- 默认值: ``
#### 选中背景色【bgColorVerticalTitleActive】
> 选中背景色
- 标识：`bgColorVerticalTitleActive`
- 默认值: ``
#### 内外边距【boxVerticalTitle】
> 内外边距
- 标识：`boxVerticalTitle`
- 默认值: ``
### 容器样式设置
#### 图片宽高
##### 图片宽【widthImg】
> 填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`widthImg`
- 默认值: `100%`
##### 图片高【heightImg】
> 填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等
- 标识：`heightImg`
- 默认值: `100%`
#### 宽高
##### 宽【width】
> 填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`width`
- 默认值: `100%`
##### 高【height】
> 填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等
- 标识：`height`
- 默认值: `100%`
#### 背景设置
##### 背景色【bgColor】
> 背景色
- 标识：`bgColor`
- 默认值: ``
##### 背景图片【bgImgUrl】
> 背景图片
- 标识：`bgImgUrl`
- 默认值: ``
##### 横向偏移【positionX】
> 横向偏移
- 标识：`positionX`
- 默认值: ``
##### 纵向偏移【positionY】
> 纵向偏移
- 标识：`positionY`
- 默认值: ``
##### 背景大小【bgSize】
> 背景大小
- 标识：`bgSize`
- 默认值: ``
##### 宽度【bgSizeWidth】
> 宽度
- 标识：`bgSizeWidth`
- 默认值: ``
##### 高度【bgSizeHeight】
> 高度
- 标识：`bgSizeHeight`
- 默认值: ``
##### 平铺模式【bgRepeat】
> 平铺模式
1) 双向重复
2) 水平重复
3) 垂直重复
4) 不重复
5) 继承
- 标识：`bgRepeat`
- 默认值: ``
##### 背景模式【bgAttachment】
> 背景模式
1) 固定
2) 滚动
3) 继承
- 标识：`bgAttachment`
- 默认值: ``
#### 边框【border】
> 边框
- 标识：`border`
- 默认值: ``
#### 文字【font】
> 文字
- 标识：`font`
- 默认值: ``
#### 内外边距【box】
> 内外边距
- 标识：`box`
- 默认值: ``
### 数据源
#### 接口地址【customInterfaceUrl】
> 用于获取数据源的接口地址，请按照统一标准的返回格式返回文本数据，格式如下：{\"code\":\"200\",\"data\":\"\",...}
- 标识：`customInterfaceUrl`
- 默认值: `/ctrl/website/api/columnlist`
#### 显示字段【dataFiled】
> 根据接口返回数据格式指定结果集的字段，比如结果集名为resultData（自定义接口忽略）且它的值为{data:{filedName:[{\"text\":\"\",\"value\":\"\",\"check\":true}]}}，则这里应该填写data.filedName
- 标识：`dataFiled`
- 默认值: `/ctrl/userinfo/getUserUnits`