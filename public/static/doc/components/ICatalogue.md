# 目录
~~当前为自动生成的模板，保存前请删除此行~~
这里用来描述组件的具体作用说明，描述内容建议简明扼要。
## 组件类名（className）
ICatalogue
## 组件类ID（classId）
idm.component.cms.catalogue
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
#### 跳转方式【jumpStyle】
>跳转方式
- 标识：`jumpStyle`
- 默认值：`当前页打开`
### 标题样式设置
#### 高【heightTitle】
>跳转方式
- 标识：`jumpStyle`
- 默认值：`当前页打开`
#### 背景色【bgColorTitle】
>背景色
- 标识：`bgColorTitle`
- 默认值：``
#### 文字【fontTitle】
>文字
- 标识：`fontTitle`
- 默认值：``
### 列表样式设置
#### 高【heightList】
>高
- 标识：`heightList`
- 默认值：`50px`
#### 背景色【bgColorList】
>背景色
- 标识：`bgColorList`
- 默认值：``
#### 文字【fontList】
>文字
- 标识：`fontList`
- 默认值：``
### 列表选中样式设置
#### 背景色【bgColorActive】
>列表选中背景色
- 标识：`bgColorActive`
- 默认值：``
#### 文字【fontActive】
>列表选中文字
- 标识：`fontActive`
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

### 数据源
#### 接口地址【getColumnListApiUrl】
> 接口地址
- 标识：`getColumnListApiUrl`
- 默认值: `/ctrl/website/api/navigation`
#### 显示字段【dataFiled】
> 根据接口返回数据格式指定结果集的字段，比如结果集名为resultData（自定义接口忽略）且它的值为{data:{filedName:[{\"text\":\"\",\"value\":\"\",\"check\":true}]}}，则这里应该填写data.filedName
- 标识：`dataFiled`
- 默认值: ``
