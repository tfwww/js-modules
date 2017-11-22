var __main = function() {
    var labelArray = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']        
    var a = new WMLabel(labelArray.length)    
    a.render('#ul-ctn', labelArray)
    a.eventBind()
}

__main()
