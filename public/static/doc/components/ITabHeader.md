# 页签标题
~~当前为自动生成的模板，保存前请删除此行~~
这里用来描述组件的具体作用说明，描述内容建议简明扼要。
## 组件类名（className）
ITabHeader
## 组件类ID（classId）
idm.component.cms.tabheader
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
### 基础属性
#### 显示更多【isShowMore】
>是否显示更多操作按钮
- 标识：`isShowMore`
- 默认值：`是`
#### 自适应【isAdaption】
>自适应容器高度
- 标识：`isAdaption`
- 默认值：`否`
#### 下划线【isHideTitleBorderBottom】
>标题下划线是否隐藏
- 标识：`isHideTitleBorderBottom`
- 默认值：`显示`
### 页签属性
#### 左侧icon【showLeftIcon】
>标题下划线是否隐藏
- 标识：`isHideTitleBorderBottom`
- 默认值：`显示`
#### 页签大小【size】
### 页签属性
<font color="#CCCCCC">用于设置组件的页签展示基本样式和方式的属性标识的属性分组。</font>
#### 页签大小【size】
可设置页签展示的大小，页签大小总共分为`小`、`中`、`大`三种展示大小，如果要使用大字号字体建议根据字号来进行选择大小。
- 标识：`size`

- 默认值：`中`
#### 页签位置【tabPosition】
可设置页签展示的位置，页签和扩展按钮是一块显示的，可设置显示的位置有`top（上）`、`bottom（下）`、`left（左）`、`right（右）`。可以根据自身需求合理的设置展示的位置。
- 标识：`tabPosition`

- 默认值：`top`
#### 页签间距【tabBarGutter】
用于设置tab页签之间的间隙，数值越大每个页签之间的间距越宽
- 标识：`tabBarGutter`

- 默认值：`32`
#### 左内边距【tabLeftPadding】
设置每个页签的左内边距，指的是文字与页签容器左边的距离，建议搭配页签间距进行合理分配数值。
- 标识：`tabLeftPadding`

- 默认值：空
#### 右内边距【tabRightPadding】
设置每个页签的右内边距，指的是文字与页签容器右边的距离。建议搭配页签间距进行合理分配数值，最好间距能放下提醒数量，否则最后一个页签的提醒数量会被遮挡（如果出现了左右箭头的情况下）。
- 标识：`tabRightPadding`

- 默认值：空
#### 上内边距【tabTopPadding】
设置每个页签的上内边距，指的是文字与页签容器上边的距离。
- 标识：`tabTopPadding`

- 默认值：空
#### 下内边距【tabBottomPadding】
设置每个页签的下内边距，指的是文字与页签容器下边的距离。
- 标识：`tabBottomPadding`

- 默认值：空
#### 风格样式【type】
用于设置tab页签的基本样式，可切换选 `line（线条风格）`、`card（卡片风格）` 类型。
- 标识：`type`

- 默认值：`line`
#### 切换动画【animated】
用于设置tab页签切换的时候是否显示过渡动画效果，在 页签位置=顶部|底部 时有效
- 标识：`animated`

- 默认值：`true`
#### 选中加粗【tabActiveBold】
设置当前选中的tab页签是否文字加粗
- 标识：`tabActiveBold`

- 默认值：`false`
#### 文字【tabFont】
设置所有页签或者是整个页签的文字内容字体样式，可设置使用的字体、大小、颜色、粗细、斜体、行高、下划线等等。
- 标识：`tabFont`

- 默认值：空
#### 角标样式
<font color="#CCCCCC">提供设置组件的页签上面的角标（数量提醒）基本样式的属性标识的属性分组。</font>
##### 角标偏移
<font color="#CCCCCC">角标X，Y的行内分组，没有实际意义</font>
###### 偏移(X)【remindOffsetX】
设置偏移数值，单位为px，默认为跟在文字的后面，可以通过调整此数值来改变横向的偏移位置
- 标识：`remindOffsetX`

- 默认值：`0`
- 📢***温馨提示***：
  数值越小越往右偏移，数值越大越往左偏移
###### 偏移(Y)【remindOffsetY】
设置偏移数值，单位为px，默认为顶部对齐，可以通过调整此数值来改变纵向的偏移位置
- 标识：`remindOffsetY`

- 默认值：`0`
- 📢***温馨提示***：
  数值越小越往上偏移，数值越大越往下偏移
##### 角标颜色【remindBgColor】
设置角标的背景颜色，一般角标提醒都是为红色，白色文字
- 标识：`remindBgColor`

- 默认值：<font color="#ec4519">`#ec4519FF`</font>
##### 显示红点【remindShowDot】
设置未选中的tab是否显示红点而不显示具体的数量数值，通俗来讲就是当前选中的tab显示具体的数字，其他的tab角标只显示一个红点，当切换过去就红点变成了数字
- 标识：`remindShowDot`

- 默认值：`true`
##### 数字Max【remindNumberMax】
用于设置角标数字显示的最大值，如果超过这个值则会显示+号，例如其中的一个页签数量为`100`条，此处设置为99，则在显示的时候会直接显示`99+`，如果设置为`88`则会显示为`88+`
- 标识：`remindNumberMax`

- 默认值：`99`
#### 分割线样式
<font color="#CCCCCC">用于设置tab页签分割线样式的属性的分组。</font>
##### 显示分割【tabShowDivider】
用于设置是否显示分割线，一般建议页签风格为line（线条样式）下才显示分割线
- 标识：`tabShowDivider`

- 默认值：`true`
##### 高度占比【dividerHeightNumber】
设置分割线的高度比例，单位为%，默认为100撑满，只能填写基于tab页签高度的百分比，如果要上下有间距可以设置数值小一点，然后偏移值Y设置`(100-高度占比数值)/2`的结果即可上下居中
- 标识：`dividerHeightNumber`

- 默认值：`100`
##### 偏移值(Y)【dividerTopNumber】
用于设置分割线Y轴距离顶部的偏移值，为了美观且分割线上下居中，最好使用以下表达式计算偏移值结果：
``` js
(100-高度占比数值)/2
```
- 标识：`dividerTopNumber`

- 默认值：`0`
##### 偏移值(X)【dividerRightNumber】
用于设置分割线X轴距离页签右边的偏移值，默认线为文字的右边，如果要tab之间可以参考页签间距的二分之一的大小
- 标识：`dividerRightNumber`

- 默认值：`-16`
- 📢***温馨提示***：
  数值越小越往右偏移，数值越大越往左偏移
##### 分线颜色【dividerBgColor】
设置分割线的颜色值
- 标识：`dividerBgColor`

- 默认值：`#e8e8e8FF`
#### 选中样式
##### 选中下划线【chooseShowBorder】
>选中状态是否显示下划线
- 标识：`chooseShowBorder`
- 默认值：`是`
##### 边框【chooseBorder】
>选中状态下边框
- 标识：`chooseBorder`
- 默认值：``
##### 背景色【bgColorChoose】
>选中状态下背景色
- 标识：`bgColorChoose`
- 默认值：``
##### 选中文字【tabFontChoose】
>选中状态下字体设置
- 标识：`tabFontChoose`
- 默认值：``
### 页签选项设置【子表】【staticTabPaneList】
#### tab标识【key】
>tab标识
- 标识：`key`
- 默认值：``
#### tab文字【tab】
>tab文字
- 标识：`tab`
- 默认值：``
#### tab显示自定义函数【tabSlotFunction】
>tab页签内容自定义函数，支持返回HTML格式字符串，接收参数为格式为{...自定义的,当前页签数据对象}，返回html字符串
- 标识：`tabSlotFunction`
- 默认值：``
#### 选择栏目【selectColumn】
>选择栏目
- 标识：`selectColumn`
- 默认值：``
#### 跳转地址【moreJumpUrl】
>跳转地址
- 标识：`moreJumpUrl`
- 默认值：`/ctrl/website/api/columnJump`
#### 跳转方式【jumpStyle】
>跳转方式
- 标识：`jumpStyle`
- 默认值：`当前页打开`
#### 红点数字【cnt】
>红点显示个数
- 标识：`cnt`
- 默认值：`10`
#### 默认选中【defaultActiveKey】
>默认是否选中当前tab
- 标识：`defaultActiveKey`
- 默认值：`否`
#### 懒加载【forceRender】
>选用此项则被隐藏的tab默认不渲染dom，点击的时候第一次去渲染tab
- 标识：`forceRender`
- 默认值：`否`
#### 文字【tableFont】
>文字
- 标识：`tableFont`
- 默认值：``
### 页签右边扩展按钮属性
#### 按钮间距【extraBtnGutter】
>按钮间距的数值是会平均分配给每个按钮的左右两边的内边距的，建议设置数值为偶数
- 标识：`extraBtnGutter`
- 默认值：``
#### 文字大小【extraBtnFontSize】
>按钮文字大小，包括图标的大小
- 标识：`extraBtnGutter`
- 默认值：``
#### 默认颜色【extraBtnFontColor】
>按钮文字和图标的默认颜色，默认会以透明度0.7的比例显示，请合理填写
- 标识：`extraBtnFontColor`
- 默认值：``
#### 扩展按钮设置【子表】【extraBtnList】
##### 按钮标识【key】
>主要用于标识按钮，可以在需要使用的时候使用此标识进行判断，建议设置为唯一或者按钮的英文、拼音作为标识
- 标识：`key`
- 默认值：``
##### 显示名称【name】
>按钮要显示的名称
- 标识：`name`
- 默认值：``
##### 显示图标【icon】
>按钮显示名称的图标显示
- 标识：`icon`
- 默认值：``
##### 悬浮提示【tip】
>鼠标放到按钮上显示的提示
- 标识：`tip`
- 默认值：``
##### 显示方式【showType】
>可以根据切换显示方式对每个按钮进行更高级的控制，更多使用方法请点击参考更详细的说明
- 标识：`showType`
- 默认值：`始终显示`
##### 显示依据【dataFiled】
>当显示方式为“切换依据显示”的时候代表页签选项卡切换的时候会根据当前填写的依据字段来去匹配结果值，为true则显示，false则不显示，此处填写表达式，更多详细用法点击查看
- 标识：`dataFiled`
- 默认值：``
##### 自定义函数依据显示【dataFunction】
>切换选项卡、数据勾选等动作会触发回调来控制是否显示，动态属性模式下也会调用此函数，接收参数为格式为{...url参数,customParam:自定义的,activeKey,allKey,actionType:动作类型,otherData}
- 标识：`dataFunction`
- 默认值：``
##### 点击事件【clickType】
>设置按钮点击响应事件的类型
- 标识：`clickType`
- 默认值：`自定义动作函数`
##### 点击自定义函数【clickCustomFunction】
>点击自定义函数
- 标识：`clickCustomFunction`
- 默认值：``
### 左侧icon样式
#### 宽【widthLeftIcon】
>宽
- 标识：`widthLeftIcon`
- 默认值：``
#### 高【heightLeftIcon】
>高
- 标识：`heightLeftIcon`
- 默认值：``
#### 垂直偏移【widthLeftIconPositionY】
>元素在y轴方向的偏移量
- 标识：`widthLeftIconPositionY`
- 默认值：``
#### 水平偏移【widthLeftIconPositionX】
>元素在x轴方向的偏移量
- 标识：`widthLeftIconPositionX`
- 默认值：``
#### 背景色【bgColorLeftIcon】
>背景色
- 标识：`bgColorLeftIcon`
- 默认值：``
#### 组件内外边距【boxLeftIcon】
>组件的最外围的内外边距设置
- 标识：`boxLeftIcon`
- 默认值：``
### 更多按钮样式
#### 图标大小【moreIconFontSize】
>图标大小
- 标识：`moreIconFontSize`
- 默认值：``
#### 垂直位移【moreIconTop】
>垂直方向上相对元素自身的位移，可填写：5px
- 标识：`moreIconTop`
- 默认值：`5px`
#### 图标颜色【colorMoreIcon】
>图标颜色
- 标识：`colorMoreIcon`
- 默认值：``
#### 图标内外边距【boxMoreIcon】
>图标内外边距
- 标识：`boxMoreIcon`
- 默认值：``
### 基础样式
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
### 高级
#### 适配设置
##### 基准值【adaptationBaseSearch】
此属性用于标记当前组件在显示效果最完美情况下的宽度大小（px），例如：此组件显示效果最佳宽度为414px，则此处设置为414即可，如果此组件最佳效果为当前配置的屏幕宽（px）的一半则只需要除以2即可。

- 标识：`adaptationBaseSearch`
- 默认值：`414`

##### 适配比例【adaptationPercentSearch】
此属性用于标记当前组件在显示效果最完美情况下的宽度大小（px），例如：此组件显示效果最佳宽度为414px，则此处设置为414即可，如果此组件最佳效果为当前配置的屏幕宽（px）的一半则只需要除以2即可。

- 标识：`adaptationPercentSearch`
- 默认值：`1.2`
#### 切换面板的回调自定义函数【changeFunction】
切换面板的回调函数设置，接收参数格式为：
``` json
{	
	"pageId":"页面ID",
	"urlData":"url参数序列化字符串",
	"customParam":"自定义的参数",
	"activeKey":"当前选中的页签key",
	"allKey":"所有页签集合",
	"allTabDataList":"所有已经加载的页签列表数据集合"
}
```
- 标识：`changeFunction`

- 默认值：空

- 可设置函数数量：多个
#### next按钮点击自定义函数【nextClickFunction】
next 按钮被点击的回调函数设置，接收参数格式为：
``` json
{	
	"pageId":"页面ID",
	"urlData":"url参数序列化字符串",
	"customParam":"自定义的参数",
	"activeKey":"当前选中的页签key",
	"allKey":"所有页签集合",
	"allTabDataList":"所有已经加载的页签列表数据集合"
}
```
- 标识：`nextClickFunction`

- 默认值：空

- 可设置函数数量：多个
#### prev按钮点击自定义函数【prevClickFunction】
prev 按钮被点击的回调函数设置，接收参数格式为：
``` json
{	
	"pageId":"页面ID",
	"urlData":"url参数序列化字符串",
	"customParam":"自定义的参数",
	"activeKey":"当前选中的页签key",
	"allKey":"所有页签集合",
	"allTabDataList":"所有已经加载的页签列表数据集合"
}
```
- 标识：`prevClickFunction`

- 默认值：空

- 可设置函数数量：多个
#### tab被点击自定义函数【tabClickFunction】
tab 页签被点击的回调函数设置，接收参数格式为：
``` json
{	
	"pageId":"页面ID",
	"urlData":"url参数序列化字符串",
	"customParam":"自定义的参数",
	"activeKey":"当前选中的页签key",
	"allKey":"所有页签集合",
	"allTabDataList":"所有已经加载的页签列表数据集合"
}
```
- 标识：`tabClickFunction`

- 默认值：空

- 可设置函数数量：多个