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
>是否显示后缀搜索按钮
- 标识：`showSearchButton`
- 默认值：`否`
#### 按钮宽度【searchButtonWidth】
>按钮宽度
- 标识：`searchButtonWidth`
- 默认值：``
#### 按钮文字【searchButtonText】
>搜索框按钮文字
- 标识：`searchButtonText`
- 默认值：`搜索`
#### 按钮图标【searchButtonIcon】
>搜索框按钮图标
- 标识：`searchButtonIcon`
- 默认值：``
#### 图标大小【searchButtonIconFont】
>搜索框按钮图标大小
- 标识：`searchButtonIconFont`
- 默认值：``
#### 图标颜色【searchButtonIconColor】
>搜索框按钮图标颜色
- 标识：`searchButtonIconColor`
- 默认值：``
#### 提示信息【searchPlaceholder】
>提示信息
- 标识：`searchPlaceholder`
- 默认值：``
#### 搜索框查询跳转地址【searchUrl】
>搜索框查询跳转地址
- 标识：`searchUrl`
- 默认值：``
#### 自定义函数【customFunctionSearch】
>自定义搜索功能
- 标识：`customFunctionSearch`
- 默认值：``
### 飘窗属性
#### 显示logo【adImgSrc】
>显示logo
- 标识：`adImgSrc`
- 默认值：``
#### 填充方式【adObjectFit】
> 填充方式
1) fill：不保证保持原有的比例，内容拉伸填充整个内容容器
2) contain：保持原有尺寸比例。内容被缩放
3) cover：保持原有尺寸比例。但部分内容可能被剪切
4) none：保留原有元素内容的长度和宽度，也就是说内容不会被重置
- 标识：`adObjectFit`
- 默认值: `fill`
#### 飘窗宽度【adImgWidth】
>飘窗宽度
- 标识：`adImgWidth`
- 默认值：``
#### 飘窗高度【adImgHeight】
>飘窗高度
- 标识：`adImgHeight`
- 默认值：``
#### 滑动速度【adImgSpeed】
>设置飘窗的移动速度，单位为毫秒
- 标识：`adImgSpeed`
- 默认值：`18`
#### 显示时间【adShowTime】
>设置飘窗的显示时间，超出时间飘窗会自动隐藏
- 标识：`adShowTime`
- 默认值：``
#### 跳转链接【adJumpUrl】
>点击飘窗时页面跳转地址
- 标识：`adJumpUrl`
- 默认值：``
### 搜索框样式
#### 宽【widthSearch】
>宽
- 标识：`widthSearch`
- 默认值：`213px`
#### 搜索背景【bgColorSearch】
>搜索背景
- 标识：`bgColorSearch`
- 默认值：``
#### 按钮背景【bgColorSearchButton】
>按钮背景
- 标识：`bgColorSearchButton`
- 默认值：``
#### 搜索框文字【fontInput】
>搜索框文字
- 标识：`fontInput`
- 默认值：``
#### 搜索按钮文字【fontInputSearch】
>搜索按钮文字
- 标识：`fontInputSearch`
- 默认值：``
#### 边框【borderSearch】
>边框
- 标识：`borderSearch`
- 默认值：``
### 顶部容器样式
#### 宽高
##### 宽【widthTop】
>宽
- 标识：`widthTop`
- 默认值：`100%`
##### 高【heightTop】
>高
- 标识：`heightTop`
- 默认值：`auto`
#### 背景色【bgColorTop】
>背景色
- 标识：`bgColorTop`
- 默认值：``
#### 内外边距【boxTop】
>内外边距
- 标识：`boxTop`
- 默认值：``
#### 边框【borderTop】
>边框
- 标识：`borderTop`
- 默认值：``
#### 文字【fontTop】
>文字
- 标识：`fontTop`
- 默认值：``
### 底部容器样式
#### 容器宽高
##### 宽【widthMain】
>宽
- 标识：`widthMain`
- 默认值：`100%`
##### 高【heightMain】
>高
- 标识：`heightMain`
- 默认值：`auto`
#### 背景色【bgColorMain】
>背景色
- 标识：`bgColorMain`
- 默认值：``
#### 内外边距【boxMain】
>内外边距
- 标识：`boxMain`
- 默认值：``
#### 边框【borderMain】
>边框
- 标识：`borderMain`
- 默认值：``
#### 文字【fontMain】
>文字
- 标识：`fontMain`
- 默认值：``

### 容器样式设置
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
### 主题设置【子表】【themeList】
用于设置组件的主题样式表，此处可跟随自身主题进行随意设置，此属性是一个表结构集合的形式属性。

- 标识：`themeListSearch`
- 默认值：`[]`
