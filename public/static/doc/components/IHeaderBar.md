# 页面顶部
~~当前为自动生成的模板，保存前请删除此行~~
这里用来描述组件的具体作用说明，描述内容建议简明扼要。
## 组件类名（className）
IHeaderBar
## 组件类ID（classId）
idm.component.cms.headerbar
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
#### 显示顶部【showTopContain】
>是否显示顶部容器
- 标识：`showTopContain`
- 默认值：`是`
#### 显示搜索【showSearch】
>是否显示搜索框
- 标识：`showSearch`
- 默认值：`是`
#### 显示飘窗【showAdWindow】
>是否显示飘窗，打开后会在预览和生产模式下，出现飘窗
- 标识：`showAdWindow`
- 默认值：`否`
#### 搜索位置【searchPosition】
>搜索框显示位置
- 标识：`searchPosition`
- 默认值：`顶部`
### 顶部左侧属性
#### 显示内容【topLeftShowType】
>顶部左侧显示内容，可设置为时间、文本、空
- 标识：`topLeftShowType`
- 默认值：`时间`
#### 数据源【topLeftShowTextResource】
>顶部左侧内容选择文本时，选择文本数据源
- 标识：`topLeftShowTextResource`
- 默认值：`自定义`
#### 文本内容【topLeftShowText】
>顶部左侧文本数据源选择自定义时，输入要显示的文本内容
- 标识：`topLeftShowText`
- 默认值：`空`
#### 接口地址【customInterfaceUrlTopLeft】
>用于获取数据源的接口地址，请按照统一标准的返回格式返回文本数据，格式如下：{\"code\":\"200\",\"data\":\"\",...}
- 标识：`customInterfaceUrlTopLeft`
- 默认值：`空`
#### 显示字段【dataFiledTopLeft】
>根据接口返回数据格式指定结果集的字段，比如结果集名为resultData（自定义接口忽略）且它的值为{data:{filedName:[{\"text\":\"\",\"value\":\"\",\"check\":true}]}}，则这里应该填写data.filedName
- 标识：`dataFiledTopLeft`
- 默认值：`空`
### logo属性
#### 显示logo【logoImgSrc】
>是否显示logo
- 标识：`logoImgSrc`
- 默认值：`空`
#### 填充方式【objectFit】
> 填充方式
1) fill：不保证保持原有的比例，内容拉伸填充整个内容容器
2) contain：保持原有尺寸比例。内容被缩放
3) cover：保持原有尺寸比例。但部分内容可能被剪切
4) none：保留原有元素内容的长度和宽度，也就是说内容不会被重置
- 标识：`objectFit`
- 默认值: `fill`
#### logo宽【widthLogoImg】
>填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`widthLogoImg`
- 默认值：`100%`
#### logo高【heightLogoImg】
>填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`heightLogoImg`
- 默认值：`100%`
### 搜索框属性
#### 大小【size】
>搜索框大小
- 标识：`size`
- 默认值：`中`
#### 搜索按钮【showSearchButton】
#### 按钮宽度【searchButtonWidth】
#### 按钮文字【searchButtonText】
#### 按钮图标【searchButtonIcon】
#### 图标大小【searchButtonIconFont】
#### 图标颜色【searchButtonIconColor】
#### 提示信息【searchPlaceholder】
#### 搜索框查询跳转地址【searchUrl】
#### 自定义函数【customFunctionSearch】
### 飘窗属性
#### 显示logo【adImgSrc】
#### 填充方式【adObjectFit】
#### 飘窗宽度【adImgWidth】
#### 飘窗高度【adImgHeight】
#### 滑动速度【adImgSpeed】
#### 显示时间【adShowTime】
#### 跳转链接【adJumpUrl】
### 搜索框样式
#### 宽【widthSearch】
#### 搜索背景【bgColorSearch】
#### 按钮背景【bgColorSearchButton】
#### 搜索框文字【fontInput】
#### 搜索按钮文字【fontInputSearch】
#### 边框【borderSearch】
### 顶部容器样式
#### 宽高
##### 宽【widthTop】
##### 高【heightTop】
#### 背景色【bgColorTop】
#### 内外边距【boxTop】
#### 边框【borderTop】
#### 文字【fontTop】
### 底部容器样式
#### 容器宽高
##### 宽【widthMain】
##### 高【heightMain】
#### 背景色【bgColorMain】
#### 内外边距【boxMain】
#### 边框【borderMain】
#### 文字【fontMain】
### 容器样式设置
#### 内外边距【box】
#### 宽高
##### 宽【width】
##### 高【height】
#### 背景设置
##### 背景色【bgColor】
##### 背景图片【bgImgUrl】
##### 横向偏移【positionX】
##### 纵向偏移【positionY】
##### 背景大小【bgSize】
##### 宽度【bgSizeWidth】
##### 高度【bgSizeHeight】
##### 平铺模式【bgRepeat】
##### 背景模式【bgAttachment】
#### 边框【border】
#### 文字【font】
### 主题设置【子表】【themeList】
#### 主题标识【key】
#### 主要颜色【mainColor】
#### 次要颜色【minorColor】
### 高级
#### 点击时动作【clickFunction】
#### 动态内容【dataSourceType】
#### 接口地址【customInterfaceUrl】
#### 结果集名【dataName】
#### 显示字段【dataFiled】
#### 自定义函数【customFunction】