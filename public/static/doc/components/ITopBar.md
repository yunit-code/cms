# 头部页头
~~当前为自动生成的模板，保存前请删除此行~~
这里用来描述组件的具体作用说明，描述内容建议简明扼要。
## 组件类名（className）
ITopBar
## 组件类ID（classId）
idm.componet.oacommon.itopbar
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
oaCommon@1.0.1
## 组件属性
### 唯一标识【ctrlId】
>只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
#### 折叠菜单【showMenuSwitch】
> 是否展示折叠菜单按钮
- 标识：`showMenuSwitch`
- 默认值: `true`
#### 显示动画【isMenuCollapseAnimation】
> 菜单展开收缩时，是否运用动画效果
- 标识：`isMenuCollapseAnimation`
- 默认值: `true`
#### 显示搜索【showSearch】
> 是否显示搜索框
- 标识：`showSearch`
- 默认值: `true`
#### 真实头像【isShowRealUserLogo】
> 选项打开显示用户的真实头像，关闭显示默认的用户头像
- 标识：`isShowRealUserLogo`
- 默认值: `false`
#### 委托状态【isShowEntrust】
> 是否显示委托状态
- 标识：`isShowEntrust`
- 默认值: `true`
#### 自动折叠【isMenuCollapseAuto】
> 是否开启自动折叠展开
- 标识：`isMenuCollapseAuto`
- 默认值: `false`
#### 折叠分界【menuCollapseAutoBase】
> 用于填写屏幕宽度的，当大于此宽度的时候自动展开、当小于此 宽度的时候自动折叠，单位px
- 标识：`menuCollapseAutoBase`
- 默认值: `空`

#### 登录按钮【isLoginBtn】
> 是否展示未登录时的登录跳转按钮
- 标识：`isLoginBtn`
- 默认值: `true`
#### 登录按钮跳转链接【isLoginBtnUrl】
> 登录按钮跳转链接
- 标识：`isLoginBtnUrl`
- 默认值: `http://116.236.111.158:5480/DreamWeb_dqzb`
#### 登录页面打开方式【isLoginBtnType】
> 登录页面打开方式
- 标识：`isLoginBtnType`
- 默认值: `新页面打开`

#### 左侧显示内容【leftShowKey】
> 用于设置左侧显示的内容
1) 每日金句，
2) 自定义logo，
3) 已打开tab：
4) 不显示：
- 标识：`leftShowKey`
- 默认值: `1`

### 每日金句属性
#### 每日金句标题【dailySentenceTitle】
> 每日金句标题
- 标识：`dailySentenceTitle`
- 默认值: `每日金句`
#### 每日金句内容【dailySentenceContent】
> 每日金句内容
- 标识：`dailySentenceContent`
- 默认值: `习近平勉励人们永远保持清醒头脑`
#### 每日金句接口获取【getDailySentenceSwitch】
> 是否接口形式获取每日金句内容
- 标识：`getDailySentenceSwitch`
- 默认值: `false`
#### 每日金句接口地址【getDailySentenceUrl】
> 每日金句接口地址
- 标识：`getDailySentenceUrl`
- 默认值: `/ctrl/api/frame/getDailySentence`
#### 结果集名称【getDailySentenceResultKey】
> 接口返回数据集中，数据的关键字key，如果结果集为result.data.data.text，则此处填写text;如果结果集为result.data.data，则此处为空
- 标识：`getDailySentenceResultKey`
- 默认值: `空`
#### 最大宽度【dailySentenceContentMaxWidth】
> 每日金句最大宽度
- 标识：`dailySentenceContentMaxWidth`
- 默认值: `空`

### 左侧logo【logoImgSrc】
> 左侧自定义logo
- 标识：`logoImgSrc`
- 默认值: `空`

### 已打开tab属性
#### 显示默认首页标签【isShowHomeTab】
> 显示默认首页标签
- 标识：`isShowHomeTab`
- 默认值: `true`
#### 默认首页标签名称【homeTabName】
> 显示默认首页标签
- 标识：`homeTabName`
- 默认值: `true`

### 搜索属性
#### 搜索方式【searchType】
> 搜索方式
1) 综合搜索，
2) 全文检索，
- 标识：`searchType`
- 默认值: `1`
#### 搜索方式接口地址【getSearchTypeUrl】
> 搜索方式接口地址
- 标识：`getSearchTypeUrl`
- 默认值: `/ctrl/dsfa/rm/componentdeDefinition`
#### 搜索框查询跳转地址【searchUrl】
用户搜索时页面的跳转地址，此处可以填写具有[表达式](/ctrl/personalcenter/toMultQueryList?_content=@[_content])的地址，表达式中可使用的对象有以下格式：
``` json
{
    "_content":"用户在搜索框中输入的关键字",
    "keyword":"用户在搜索框中输入的关键字",
}
```
例如此处可以填写以下接口地址（示例中的@[_content]或@[keyword]会自动替换为搜索框的内容）：
``` language
/ctrl/personalcenter/toMultQueryList?_content=@[_content]
```
``` language
/ctrl/search/view?keyword=@[keyword]
```

- 标识：`searchUrl`
- 默认值: `空`

### 用户头像属性
#### 用户头像接口地址【userLogoApiUrl】
> 用户头像接口地址
- 标识：`userLogoApiUrl`
- 默认值: `空`
#### 头像字段【userLogoKey】
> 根据用户头像接口返回数据格式指定结果集的字段，若它的值为{data:{userLogo:''}}，则这里应该填写userLogo
- 标识：`userLogoKey`
- 默认值: `空`

### 右侧扩展按钮属性
#### 右侧操作按钮【子表】【operateList】
> 右侧操作选项设置列表
- 标识：`operateList`
- 默认值: `空`
##### 按钮图标【iconSvg】
> 设置按钮的图标
- 标识：`iconSvg`
- 默认值: `空`
##### 按钮文字【buttonText】
> 设置按钮显示的文字
- 标识：`buttonText`
- 默认值: `空`
##### 图标颜色【iconSvgFontColor】
> 设置按钮显示的图标的颜色
- 标识：`iconSvgFontColor`
- 默认值: `空`
##### 图标大小【iconSvgFontSize】
> 设置按钮显示的图标的大小
- 标识：`iconSvgFontSize`
- 默认值: `14`
##### 按钮文字字体【font】
> 设置按钮显示的文字样式
- 标识：`font`
- 默认值: `空`
##### 事件类型【buttonHandleType】
> 点击按钮触发的操作类型，可以选择内置的处理函数，也可以使用自定义编写函数
- 标识：`buttonHandleType`
- 默认值: `none`
##### 事件自定义函数【buttonCustomFunction】
> 当点击按钮的时候会调用此函数，接收参数格式为{customParam:自定义的,currentKey,configObject:当前按钮配置项,fieldConfigObject:当前字段配置项,itemObject:整条数据对象,callback:处理完成要刷新tab的回调方法，调用并传reloadTabKeys即可刷新指定的tab}
- 标识：`buttonCustomFunction`
- 默认值: `空`

### 委托状态属性
#### 按钮图标【iconSvgEntrust】
> 设置按钮的图标
- 标识：`iconSvgEntrust`
- 默认值: `空`
#### 按钮文字【buttonTextEntrust】
> 设置按钮显示的文字
- 标识：`buttonTextEntrust`
- 默认值: `委托状态`
#### 触发方式【showEntrustEvent】
> 点击用户时，触发下拉框的方式
- 标识：`showEntrustEvent`
- 默认值: `click`

### 下拉操作按钮选项设置【子表】【personActionList】
> 点击用户头像下拉框按钮属性配置
- 标识：`personActionList`
- 默认值: `空`
#### 按钮图标【iconSvg】
> 设置按钮的图标
- 标识：`iconSvg`
- 默认值: `空`
#### 按钮文字【buttonText】
> 设置按钮显示的文字
- 标识：`buttonText`
- 默认值: `空`
#### 图标颜色【iconSvgFontColor】
> 设置按钮显示的图标颜色
- 标识：`iconSvgFontColor`
- 默认值: `空`
#### 图标大小【iconSvgFontSize】
> 设置按钮显示的图标大小
- 标识：`iconSvgFontSize`
- 默认值: `14`
#### 按钮文字字体【font】
> 设置按钮显示的文字样式
- 标识：`font`
- 默认值: `空`
#### 事件类型【buttonHandleType】
> 点击按钮触发的操作类型，可以选择内置的处理函数，也可以使用自定义编写函数
- 标识：`buttonHandleType`
- 默认值: `none`
#### 事件自定义函数【buttonCustomFunction】
> 当点击按钮的时候会调用此函数，接收参数格式为{customParam:自定义的,currentKey,configObject:当前按钮配置项,fieldConfigObject:当前字段配置项,itemObject:整条数据对象,callback:处理完成要刷新tab的回调方法，调用并传reloadTabKeys即可刷新指定的tab}
- 标识：`buttonCustomFunction`
- 默认值: `none`

### 样式设置
#### 左侧文字【fontLeft】
>每日金句文字样式设置
- 标识：`fontLeft`
- 默认值: `空`
#### 导航tab样式设置
##### 背景色【tabBgColor】
>导航tab背景色设置
- 标识：`tabBgColor`
- 默认值: `空`
##### 字体样式【fontTab】
>导航tab字体样式设置
- 标识：`fontTab`
- 默认值: `空`
##### tab间距【tabBarGutter】
>导航tab每个标签之间的间隔
- 标识：`tabBarGutter`
- 默认值: `5`
#### 右侧扩展按钮设置【operateListMargin】
>右侧扩展按钮间隔距离
- 标识：`operateListMargin`
- 默认值: `30px`
#### 搜索框文字【fontInput】
>搜索输入框中的文字字体样式设置
- 标识：`fontInput`
- 默认值: `空`
#### 搜索框样式设置
##### 背景色【bgColorSearch】
>搜索框背景色
- 标识：`bgColorSearch`
- 默认值: `空`
##### 边框【borderSearch】
> 搜索框边框
- 标识：`borderSearch`
- 默认值: `空`

#### 切换子机构样式设置
##### 样式风格【organizationStyle】
> 按钮样式风格，默认是现有样式
- 标识：`organizationStyle`
- 默认值: `1`
##### 切换子机构按钮文字【fontOrganization】
> 切换子机构按钮文字
- 标识：`fontOrganization`
- 默认值: `1`
##### 子机构下拉框文字【fontOrganizationList】
> 子机构下拉框文字
- 标识：`fontOrganizationList`
- 默认值: `1`
##### 宽【widthOrganization】
> 填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`widthOrganization`
- 默认值: `60px`
##### 高【heightOrganization】
> 填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`heightOrganization`
- 默认值: `60px`
##### 背景色【bgColorOrganization】
> 背景色
- 标识：`bgColorOrganization`
- 默认值: `空`
##### 内外边距【boxOrganization】
> 内外边距
- 标识：`boxOrganization`
- 默认值: `空`
##### 边框【borderOrganization】
> 边框
- 标识：`borderOrganization`
- 默认值: `空`

#### 委托状态样式设置
##### 委托按钮图标【fontEntrustIcon】
> 委托按钮图标
- 标识：`fontEntrustIcon`
- 默认值: `空`
##### 委托按钮文字【fontEntrustButton】
> 委托按钮文字
- 标识：`fontEntrustButton`
- 默认值: `空`
##### 委托内容文字【fontEntrustPop】
> 委托内容文字
- 标识：`fontEntrustPop`
- 默认值: `空`
##### 委托内容名称文字【fontEntrustPopName】
> 委托内容名称文字
- 标识：`fontEntrustPopName`
- 默认值: `空`
##### 内外边距【boxOrganization】
> 内外边距
- 标识：`boxOrganization`
- 默认值: `空`

#### 欢迎词【fontWelcom】
>欢迎词字体样式设置
- 标识：`fontWelcom`
- 默认值: `空`

#### 个人头像设置
##### 大小【widthUserLogo】
> 个人头像大小，默认宽高一致
- 标识：`widthUserLogo`
- 默认值: `50px`
##### 左间距【marginLeftUserLogo】
> 个人头像距离左侧元素的距离
- 标识：`marginLeftUserLogo`
- 默认值: `30px`

#### 菜单样式设置
##### 适配菜单【isAdaptiveMenu】
> 是否根据菜单的宽度来改变容器的宽度
- 标识：`isAdaptiveMenu`
- 默认值: `true`
##### 展开宽度【widthMenu】
> 展开宽度
- 标识：`widthMenu`
- 默认值: `230px`
##### 收缩宽度【collapseWidthMenu】
> 收缩宽度
- 标识：`collapseWidthMenu`
- 默认值: `64px`

#### 用户名最大宽度【maxWidthUserName】
> 设置用户名的最大显示宽度，超出设定宽度会隐藏
- 标识：`maxWidthUserName`
- 默认值: `空`

#### 宽高
##### 宽【width】
>填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`width`
- 默认值: `100%`
##### 高【height】
>填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`height`
- 默认值: `60px`
#### 背景设置
##### 背景色【bgColor】
>组件背景颜色设置
- 标识：`bgColor`
- 默认值: `空`
#### 内外边距【box】
>组件内外边距
- 标识：`box`
- 默认值: `空`
#### 边框【border】
>组件边框样式设置
- 标识：`border`
- 默认值: `空`
### 主题设置【themeList】
#### 主题标识【key】
>用于设置主题的标识，此项需要搭配自定义开发切换主题的功能，例如：蓝色标识为blue，用户切换主题的时候存储到数据库中的标识为blue，则这里选择blue
- 标识：`key`
- 默认值: `空`
#### 主要颜色【mainColor】
>主题的主要颜色
- 标识：`mainColor`
- 默认值: `空`
#### 次要颜色【minorColor】
>主题的次要颜色
- 标识：`minorColor`
- 默认值: `空`

### 高级
#### tab菜单联动组件【triggerComponents】
> 选择点击tab需要联动的组件
- 标识：`triggerComponents`
- 默认值: `空`
#### menu展开收缩联动组件【triggerComponentsMenu】
> 选择点击菜单展开收缩需要联动的组件
- 标识：`triggerComponentsMenu`
- 默认值: `空`
#### 获取子机构数据接口【getOrganizationListApiUrl】
> 获取子机构数据接口
- 标识：`getOrganizationListApiUrl`
- 默认值: `/ctrl/userinfo/getUserUnits`
#### 切换子机构接口【changeOrganizationApiUrl】
> 切换子机构接口
- 标识：`changeOrganizationApiUrl`
- 默认值: `/ctrl/changeLoginUnit`

#### 切换主题地址【changeThemeIframeUrl】
>切换主题地址的链接地址
- 标识：`changeThemeIframeUrl`
- 默认值: `/p1000/skin/skin.html`
#### 修改密码地址【changePasswordIframeUrl】
>修改密码地址的链接地址
- 标识：`changePasswordIframeUrl`
- 默认值: `/ctrl/userinfo/password`
#### 注销接口地址【logoutUrl】
>注销功能接口地址
- 标识：`logoutUrl`
- 默认值: `/ctrl/logout`
#### 每日金句接口地址【getDailySentenceUrl】
>每日金句接口地址，会根据接口返回值覆盖页面配置的每日金句
- 标识：`getDailySentenceUrl`
- 默认值: `/ctrl/api/frame/getDailySentence`
#### 搜索方式接口地址【getSearchTypeUrl】
>搜索方式接口地址，会根据接口返回值覆盖页面配置的搜索方式
- 标识：`getSearchTypeUrl`
- 默认值: `/ctrl/dsfa/rm/componentdeDefinition`
