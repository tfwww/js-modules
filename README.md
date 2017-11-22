# js-modules
js modules  js 组件化

WMLabel.js 
横向显示月份滚动插件

引入 WMLabel.js
<script src="wmlabel.js"></script>  

使用方法
js 文件
var labelArray = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']        
var a = new WMLabel(labelArray.length)    

a.render('#ul-ctn', labelArray)
a.eventBind()

html 文件
新建一个 div 即可