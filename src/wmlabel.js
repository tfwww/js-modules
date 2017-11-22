// 方便注释代码
var debug = true,
log = debug ? console.log.bind(console) : function() {}

var qSel = function(sel) {
    var len = document.querySelectorAll(sel).length,
        func = document.querySelector(sel)
    if (len > 1) {
        func = document.querySelectorAll(sel)
    }
    return func
}

var hasClass = function(ele, className) {
    return qSel(ele).className.includes(className)
}

var WMLabel = function(numOfMon) {
    var self = this

    self.nextMonth = function(month) {
        var months = self.monthsLabel(month)
        log('months next', months)
        // var monthList = $('.month-ul .li')
        var monthList = qSel('.month-ul .li')
        for (var i = 0; i < monthList.length; i++) {
            var ele = monthList[i]
            var mon = months[i]
            log('ele', ele)
            // ele.text(mon + '月')     
            ele.innerText = mon + '月'              
        }
    }

    self.preMonth = function(month) {
        var months = self.preMonthsLabel(month)
        log('months previous', months)
        // var monthList = $('.month-ul .li')
        var monthList = qSel('.month-ul .li')
        for (var i = 0; i < monthList.length; i++) {
            var ele = monthList[i]
            var mon = months[i]
            ele.innerText = mon + '月'                
        }
    }

    self.monthsLabel = function(currentMonth) {
        log('currentMonth', currentMonth)
        // 要显示多少个月
        // var numOfMon = 7
        var month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        var beginInx = month.indexOf(currentMonth)
        var result = month.slice(beginInx, beginInx + numOfMon)
        var len = result.length
        // 处理 8 月以后无法切全的情况
        if (len < numOfMon) {
        var offset = numOfMon - len
        var tmp = month.slice(0, offset)
        result = result.concat(tmp)
        }            
        return result
    }

    self.preMonthsLabel = function(lastMonth, ) {
        // 要显示多少个月
        // var numOfMon = 7, 

        var month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            result = []
        var endInx = month.indexOf(lastMonth)
        var end = endInx + 1   

        // 处理 5 月之前无法切全的情况
        if (lastMonth < numOfMon) {
            var tmp = month.slice(0, end)
            var offset = numOfMon - tmp.length
            var tmpEnd = month.slice(-offset)
            result = tmpEnd.concat(tmp)
        } else {                         
            result = month.slice(end - numOfMon, end)                
        }           
        return result
    }

    self.showNext = function(target) {
        var currCls = 'current',
            // curEle = $('.' + currCls),
            curEle = qSel('.' + currCls),
            direction = target.dataset.direction    
        var mapper = {
            left: function(cur) {
                // var first = cur.hasClass('first')
                var first = hasClass('.' + currCls, 'first')
                if (!first) {
                    var preEle = cur.previousSibling
                    preEle.classList.add(currCls)
                    cur.classList.remove(currCls)  
                }            
            },
            right: function(cur) {
                var last = hasClass('.' + currCls, 'last')
                if (!last) {
                    var nextEle = cur.nextSibling
                    nextEle.classList.add(currCls)
                    cur.classList.remove(currCls)   
                }                
            }
        }
        mapper[direction](curEle)
    }

    self.eventBind = function() {
        var monthList = qSel('.month-ul')
        monthList.addEventListener('click', function(e) {
            var target = e.target,
                lastSel = '.month-ul .last',
                firstSel = '.month-ul .first',
                lastMon = qSel(lastSel),
                firstMon = qSel(firstSel)
            // 如果是 control 类的元素
            if (target.className.includes('control')) {
                var monText = firstMon.innerText, 
                    lastMonText = lastMon.innerText
                // 切掉"月"
                var monthStr = monText.slice(0, monText.length - 1),
                    lastMonStr = lastMonText.slice(0, lastMonText.length - 1) 
                
                self.showNext(target)
                if (hasClass(lastSel, 'current')) {                           
                    // 切换到下一个月
                    var monthNum = parseInt(monthStr, 10) + 1
                    
                    self.nextMonth(monthNum)
                    log('next')
                    // 滑到左侧尽头
                } else if (hasClass(firstSel, 'current')){                        
                    log('pre')
                    var previousMonth = parseInt(lastMonStr, 10) - 1
                    self.preMonth(previousMonth)
                }         
            }
        })        
    }

    self.render = function(ele, labelArray) {        
        // html 模板处理
        function template(liItems) {
            return `<ul class="month-ul"> 
                        <li class="control" data-direction="left"><</li>
                        ${liItems}
                        <li class="control" data-direction="right">></li>                               
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

