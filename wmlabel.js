// 方便注释代码
var debug = true,
log = debug ? console.log.bind(console) : function() {}

var WMLabel = function() {
    var self = this

    self.nextMonth = function(month) {
        var months = self.monthsLabel(month)
        log('months next', months)
        var monthList = $('.month-ul .li')
        for (var i = 0; i < monthList.length; i++) {
            var ele = $(monthList[i])
            var mon = months[i]
            log('ele', ele)
            ele.text(mon + '月')                
        }
    }

    self.preMonth = function(month) {
        var months = self.preMonthsLabel(month)
        log('months previous', months)
        var monthList = $('.month-ul .li')
        for (var i = 0; i < monthList.length; i++) {
            var ele = $(monthList[i])
            var mon = months[i]
            ele.text(mon + '月')                
        }
    }

    self.monthsLabel = function(currentMonth) {
        // 要显示多少个月
        var numOfMon = 6
        var month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        var beginInx = month.indexOf(currentMonth)
        var result = month.slice(beginInx, beginInx + 6)
        var len = result.length
        // 处理 8 月以后无法切全的情况
        if (len < numOfMon) {
        var offset = numOfMon - len
        var tmp = month.slice(0, offset)
        result = result.concat(tmp)
        }            
        return result
    }

    self.preMonthsLabel = function(lastMonth) {
        // 要显示多少个月
        var numOfMon = 6, 
            month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            result = []
        var endInx = month.indexOf(lastMonth)
        var end = endInx + 1   

        // 处理 5 月之前无法切全的情况
        if (lastMonth < 6) {
            var tmp = month.slice(0, end)
            var offset = numOfMon - tmp.length
            var tmpEnd = month.slice(-offset)
            result = tmpEnd.concat(tmp)
        } else {                         
            result = month.slice(end - 6, end)                
        }           
        return result
    }

    self.showNext = function($target) {
        var currCls = 'current',
        curEle = $('.' + currCls),
        direction = $target.data('direction')    
        var mapper = {
            left: function(cur) {
                var first = cur.hasClass('first')
                if (!first) {
                    cur.prev().addClass(currCls)
                    cur.removeClass(currCls)  
                }            
            },
            right: function(cur) {
                var last = cur.hasClass('last')
                if (!last) {
                    cur.next().addClass(currCls)
                    cur.removeClass(currCls)   
                }                
            }
        }
        mapper[direction](curEle)
    }

    self.eventBind = function() {
        $(".month-ul").delegate(".control", 'click', function(e) {
            log('click')
            var lastMon = $('.month-ul .last'),
                firstMon = $('.month-ul .first'),
                target = $(e.target)
        
            var monText = firstMon.text(), 
                lastMonText = lastMon.text()
            // 切掉"月"
            var monthStr = monText.slice(0, monText.length - 1),
                lastMonStr = lastMonText.slice(0, lastMonText.length - 1) 
            
            self.showNext(target)
            if (lastMon.hasClass('current')) {                           
                // 切换到下一个月
                var monthNum = parseInt(monthStr, 10) + 1
                
                self.nextMonth(monthNum)
                log('next')
                // 滑到左侧尽头
            } else if (firstMon.hasClass('current')){                        
                log('pre')
                var previousMonth = parseInt(lastMonStr, 10) - 1
                self.preMonth(previousMonth)
            }         
        })
    }

    self.render = function(ele, labelArray) {        
        // html 模板处理
        function template(liItems) {
            return `<ul class="month-ul"> 
                        <li class="control" data-direction="left">左</li>
                        ${liItems}
                        <li class="control" data-direction="right">右</li>                               
                    </ul>`
        }

        function templateItems(labelArray) {
            var firtItem = `<li class="first li current">${labelArray[0]}</li>`,
                lastItem = `<li class="last li">${labelArray[labelArray.length - 1]}</li>`,
                tpl = '',
                labels = labelArray.slice(1, labelArray.length - 1)
        
            for (var i = 0; i < labels.length; i++) {
                var ele = labels[i]
                tpl += `<li class="li">${ele}</li>`
            }
            return firtItem + tpl + lastItem
        }

        function insertTemp(template, position, selName) {    
            var listSel = document.querySelector(selName)
            listSel.insertAdjacentHTML(position, template)
        }
        
        var itemTpl = templateItems(labelArray),
            listTpl = template(itemTpl)
        insertTemp(listTpl, 'beforeend', ele)
    }
}

