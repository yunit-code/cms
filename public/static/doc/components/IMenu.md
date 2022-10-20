# 菜单
~~当前为自动生成的模板，保存前请删除此行~~
这里用来描述组件的具体作用说明，描述内容建议简明扼要。
## 组件类名（className）
IMenu
## 组件类ID（classId）
idm.component.cms.menu
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
#### 样式风格【styleForm】
>提供设置组件能达到展示效果的基本属性设置信息
- 标识：`styleForm`
- 默认值：`按钮`
#### 触发方式【triggerType】
>下拉子菜单的触发方式
- 标识：`triggerType`
- 默认值：`点击`
#### 使用简称【useShortName】
>使用栏目的简称
- 标识：`useShortName`
- 默认值：`是`
#### 显示图标【showIcon】
>显示图标
- 标识：`showIcon`
- 默认值：`是`
#### 切换按钮【showSwitchButton】
>切换按钮
- 标识：`showSwitchButton`
- 默认值：`否`
#### 选择栏目【selectColumn】
>选择栏目
- 标识：`selectColumn`
- 默认值：`/ctrl/website/api/channelTree`
#### 显示数量【limit】
>显示数量
- 标识：`limit`
- 默认值：`空`
### 菜单样式设置
#### 菜单高度【heightMenu】
>菜单高度
- 标识：`heightMenu`
- 默认值：`空`
#### 图标间距【fontIconMarginRight】
>图标间距
- 标识：`fontIconMarginRight`
- 默认值：`空`
#### 图标字体【fontIcon】
>图标字体
- 标识：`fontIcon`
- 默认值：`空`
#### 文字字体【fontMenu】
>文字字体
- 标识：`fontMenu`
- 默认值：`空`
### 悬浮样式设置
#### 图标字体【fontIconHover】
>图标字体
- 标识：`fontIconHover`
- 默认值：`空`
#### 文字字体【fontHover】
>文字字体
- 标识：`fontHover`
- 默认值：`空`
#### 背景色【bgColorHover】
>悬浮时背景色
- 标识：`bgColorHover`
- 默认值：`空`
### 选中样式设置
#### 图标字体【fontIconActive】
>选中时图标字体
- 标识：`fontIconActive`
- 默认值：`空`
#### 文字字体【fontActive】
>选中时文字字体
- 标识：`fontActive`
- 默认值：`空`
#### 背景色【bgColorActive】
>选中时背景色
- 标识：`bgColorActive`
- 默认值：`空`
#### 三角符号【bgColorTriangle】
>选中时三角符号
- 标识：`bgColorTriangle`
- 默认值：`空`
### 切换按钮样式
#### 图标大小【fontSizeSwitchButton】
>切换按钮图标大小
- 标识：`fontSizeSwitchButton`
- 默认值：`空`
#### 图标颜色【fontColorSwitchButton】
>切换按钮图标颜色
- 标识：`fontSizeSwitchButton`
- 默认值：`空`
### 样式设置
#### 内外边距【box】
>容器内外边距
- 标识：`box`
- 默认值：`空`
#### 宽高
##### 宽【width】
>容器宽度
- 标识：`width`
- 默认值：`100%`
##### 高【height】
>容器高度
- 标识：`height`
- 默认值：`auto`
#### 背景设置
##### 背景色【bgColor】
>容器背景色
- 标识：`bgColor`
- 默认值：`空`
##### 背景图片【bgImgUrl】
>容器背景图片
- 标识：`bgImgUrl`
- 默认值：`空`
##### 横向偏移【positionX】
>容器背景图片横向偏移
- 标识：`positionX`
- 默认值：`空`
##### 纵向偏移【positionY】
>容器背景图片纵向偏移
- 标识：`positionY`
- 默认值：`空`
##### 背景大小【bgSize】
>容器背景图片大小
- 标识：`bgSize`
- 默认值：`空`
##### 宽度【bgSizeWidth】
>容器背景图片宽度
- 标识：`bgSizeWidth`
- 默认值：`空`
##### 高度【bgSizeHeight】
>容器背景图片高度
- 标识：`bgSizeHeight`
- 默认值：`空`
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
#### 动态内容【dataSourceType】
> 通过这些方式去动态获取结果值显示成文本内容
- 标识：`box`
- 默认值: ``
#### 接口地址【customInterfaceUrl】
> 用于获取数据源的接口地址，请按照统一标准的返回格式返回文本数据，格式如下：{\"code\":\"200\",\"data\":\"\",...}
- 标识：`customInterfaceUrl`
- 默认值: `/ctrl/website/api/navigation`
#### 结果集名【dataName】
> 页面接口设定的结果集名称，位置为：页面设置》高级设置》页面接口
- 标识：`dataName`
- 默认值: ``
#### 显示字段【dataFiled】
> 根据接口返回数据格式指定结果集的字段，比如结果集名为resultData（自定义接口忽略）且它的值为{data:{filedName:[{\"text\":\"\",\"value\":\"\",\"check\":true}]}}，则这里应该填写data.filedName
- 标识：`dataFiled`
- 默认值: ``
#### 栏目名称【dataFiledTitle】
> 结果集中栏目名称所对应的字段key
- 标识：`dataFiledTitle`
- 默认值: `title`
#### 栏目简称【dataFiledShortTitle】
> 结果集中栏目简称所对应的字段key
- 标识：`dataFiledShortTitle`
- 默认值: `shortTitle`
#### 自定义函数【customFunction】
> 获取动态文本内容、自定义接口回调、页面统一接口回调的时候会调用此方法，返回数据格式为字符串，接收参数：{...自定义,interfaceData:自定义接口或页面统一接口的返回结果,expressData:表达式替换后的结果}
- 标识：`customFunction`
- 默认值: `空`