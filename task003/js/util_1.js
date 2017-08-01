/**
 * Created by Administrator on 2017/1/19 0019.
 */
// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    return Object.prototype.toString.call(arr)==='[object Array]'
}
// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    // your implement
    return (typeof (fn)==="function");
}
// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
    if (src==null || typeof (src) !== 'object') {
        return src;
    }
    if (isArray(src)) {
        var clone= [];
        for (var i=0; i<src.length; i++) {
            clone[i] = cloneObject(src[i]);
        }
        return clone;
    }
    if (src instanceof Date) {
        var clone= new Date(src.getDate())
        return clone;
    }
    if (src instanceof Object) {
        var clone= {};
        for(var key in src){
            if(src.hasOwnProperty(key)){    //用hasOwnProperty能判断属性是否为自身属性而非继承属性，所以用if语句忽略掉继承属性
                clone[key]=cloneObject(src[key]);  //重新赋予新的属性
            }
        }
        return clone;
    }
}
// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    if (arr.length<2) return arr;
    for (var i=0; i<arr.length-1; i++) {
        for (var j=i+1; j<arr.length; j++){
            if (arr[i]==arr[j]) {
                arr.splice(j,1);
            }
        }
    }
    return arr;
}

// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str) {
    var head=0,tail=str.length-1;
    while (str[head]==" ") head++;
    while (str[tail]==" ") tail--;
    return str.substring(head,tail+1);//tail+1是因为 tail下标的字符在substring会被删除，所以加一位来保存字符
}
//尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    // 对字符串的正则表达式处理通常用到replace方法
    // str.replace(re, newSub)：将字符串被re匹配到的部分，用newSub来代替。
    return str.replace(/^\s+|\s+$/g, '');
}
// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    for (var index in arr){
        fn(arr[index],index);
    }
}
// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    var len= 0;
    for (var key in obj) {
        if (key) len++;
    } return len;
}
// 判断是否为邮箱地址
function isEmail(emailStr) {
    var pattern = /^(\w+\.)*\w+@\w+(\.\w+)+$/;
    return pattern.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone) {
    var pattern = /^(\+\d{1,4})?\d{7,11}$/;
    return pattern.test(phone);
}
//DOM部分
function hasClass(element, sClass) {
    if (element && element.className) {
        return element.className.match(new RegExp("(\\s|^)" + sClass + "(\\s|$)"));
    } else {
        return false;
    }
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    if (!hasClass(element, newClassName)) {
        element.className += " " + newClassName;
    }
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    if (hasClass(element, oldClassName)) {
        var reg = new RegExp("(\\s|^)" + oldClassName + "(\\s|$)");
        element.className = element.className.replace(reg, "");
    }
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var position = {};
    position.x = element.getBoundingClientRect().left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft); //获取相对位置+滚动距离=绝对位置.
    position.y = element.getBoundingClientRect().top + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    return position;
}
/**
 * $函数的依赖函数，选择器函数
 * @param   {string} selector CSS方式的选择器
 * @param   {object} root     可选参数，selector的父对象。不存在时，为document
 * @returns {Array}  返回获取到的节点数组，需要注意的是使用ID选择器返的也是数组
 */
function VQuery(selector, root) {
    //用来保存选择的元素
    var elements = []; //保存结果节点数组
    var allChildren = null; //用来保存获取到的临时节点数组
    root = root || document; //若没有给root，赋值document
    switch (selector.charAt(0)) {
        case "#": //id选择器
            elements.push(root.getElementById(selector.substring(1)));
            break;
        case ".": //class选择器
            if (root.getElementsByClassName) { //标准
                elements = root.getElementsByClassName(selector.substring(1));
            } else { //兼容低版本浏览器
                var reg = new RegExp("\\b" + selector.substring(1) + "\\b");
                allChildren = root.getElementsByTagName("*");
                for (var i = 0, len = allChildren.length; i < len; i++) {
                    if (reg.test(allChildren[i].className)) {
                        elements.push(allChildren[i]);
                    }
                }
            }
            break;
        case "[": //属性选择器

            if (selector.indexOf("=") === -1) {
                //只有属性没有值的情况
                allChildren = root.getElementsByTagName("*");
                for (var i = 0, len = allChildren.length; i < len; i++) {
                    if (allChildren[i].getAttribute(selector.slice(1, -1)) !== null) {
                        elements.push(allChildren[i]);
                    }
                }
            } else {
                //既有属性又有值的情况
                var index = selector.indexOf("="); //缓存=出现的索引位置。
                allChildren = root.getElementsByTagName("*");
                for (var i = 0, len = allChildren.length; i < len; i++) {
                    if (allChildren[i].getAttribute(selector.slice(1, index)) === selector.slice(index + 1, -1)) {
                        elements.push(allChildren[i]);
                    }
                }
            }
            break;
        default: //tagName
            elements = root.getElementsByTagName(selector);
    }
    return elements;
}
/**
 * 模仿jQuery的迷你$选择符。
 * @param   {string} selector CSS方式的选择器，支持简单的后代选择器（只支持一级）
 * @returns {object} 返回获取到的第一个节点对象，后代选择器时，返回第一个对象中的第一个符合条件的对象
 */
function $(selector) {
    if (selector == document) {
        return document;
    }
    selector = trim(selector);
    //存在空格时，使用后代选择器
    if (selector.indexOf(" ") !== -1) {
        var selectorArr = selector.split(/\s+/); //分割成数组，第一项为parent，第二项为chlid。
        //这里没去考虑特别多的情况了，只是简单的把参数传入。
        return VQuery(selectorArr[1], VQuery(selectorArr[0])[0])[0];
    } else { //普通情况,只返回获取到的第一个对象
        return VQuery(selector, document)[0];
    }
}
// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    if (element.addEventListener) { //标准
        element.addEventListener(event, listener, false);
    } else if (element.attachEvent) { //低版本ie
        element.attachEvent("on" + event, listener);
    } else { //都不行的情况
        element["on" + event] = listener;
    }
}

// 例如：

// addEvent($(".second"), "click", function () {
//     alert("clicksecond");
// });

// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener) {
    if (element.removeEventListener) {
        element.removeEventListener(event, listener);
    } else if (element.detachEvent) {
        element.detachEvent("on" + event, listener);
    }
}

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element, "click", listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    addEvent(element, "keydown", function(event) {
        if (event.keyCode == 13) {
            listener();
        }
    });
}

// 事件代理---element父标签，tag子标签，eventName事件名称，listener响应函数
function delegateEvent(element,tag,eventName,listener){
    //给父标签 事件绑定
    addEvent(element, eventName, function(event){
        //监听点击的标签是否为子标签
        var event = event || window.event;
        var target = event.target || event.srcElement;
        console.log("产生事件的节点："+ target.tagName + "产生事件的节点："+ event.currentTarget.tagName);
        if(target.tagName.toLowerCase() == tag.toLowerCase()) {
            //是的话调用响应函数
            listener.call(target, event);
        }
    });
}

// 函数里面一堆$看着晕啊，那么接下来把我们的事件函数做如下封装改变：

$.on = function(selector, event, listener) {
    addEvent(selector, event, listener);
};
$.click = function(selector, listener) {
    addClickEvent(selector, listener);
};
$.un = function(selector, event, listener) {
    removeEvent(selector, event, listener);
};
$.delegate = function(selector, tag, event, listener) {
    delegateEvent(selector, tag, event, listener);
};

// 判断是否为IE浏览器，返回-1或者版本号
function isIE() {
    var s = navigator.userAgent.toLowerCase();
    console.log(s);
    //ie10的信息：
    //mozilla/5.0 (compatible; msie 10.0; windows nt 6.2; trident/6.0)
    //ie11的信息：
    //mozilla/5.0 (windows nt 6.1; trident/7.0; slcc2; .net clr 2.0.50727; .net clr 3.5.30729; .net clr 3.0.30729; media center pc 6.0; .net4.0c; .net4.0e; infopath.2; rv:11.0) like gecko
    var ie = s.match(/rv:([\d.]+)/) || s.match(/msie ([\d.]+)/);
    if(ie) {
        return ie[1];
    } else {
        return -1;
    }
}

// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
    var cookie = cookieName + "=" + encodeURIComponent(cookieValue);
    if (typeof expiredays === "number") {
        cookie += ";max-age=" + (expiredays * 60 * 60 * 24);
    }
    document.cookie = cookie;
}

// 获取cookie值
function getCookie(cookieName) {
    var cookie = {};
    var all = document.cookie;
    if (all==="") {
        return cookie;
    }
    var list = all.split("; ");
    for (var i = 0; i < list.length; i++) {
        var p = list[i].indexOf("=");
        var name = list[i].substr(0, p);
        var value = list[i].substr(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
// 学习Ajax，并尝试自己封装一个Ajax方法。实现如下方法：
function ajax(url, options) {
    var dataResult; //结果data
    // 处理data
    if (typeof(options.data) === 'object') {
        var str = '';
        for (var c in options.data) {
            str = str + c + '=' + options.data[c] + '&';
        }
        dataResult = str.substring(0, str.length - 1);
    }
    // 处理type
    options.type = options.type || 'GET';

    //获取XMLHttpRequest对象
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    // 发送请求
    xhr.open(options.type, url);
    if (options.type == 'GET') {
        xhr.send(null);
    } else {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(dataResult);
    }

    // readyState
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (options.onsuccess) {
                    options.onsuccess(xhr.responseText, xhr.responseXML);
                }
            } else {
                if (options.onfail) {
                    options.onfail();
                }
            }
        }
    };
}



function startMove(obj,json,fn){
    clearInterval(obj.times);
    obj.times=setInterval(function () {      //json={name:value,name2:value,
        var flag=true;                       //定义flag为局部变量，这样不会因为for in把flag变成false应用到全局
        for(var sty in json) {               //利用for in定义name的值，还有循环整个函数
            var icur = 0;
            if (sty == 'opacity') {
                icur = parseFloat(getStyle(obj, sty)) * 100;
            }
            else {
                icur = parseInt(getStyle(obj, sty))
            }
            var speed = (json[sty] - icur) / 10;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (icur != json[sty]) {
                flag=false;
            }
            if (sty == 'opacity') {
                obj.style.filter = 'alpha(opacity:' + (icur + speed) + ')';
                obj.style[sty] = (icur + speed) / 100;
            }
            else {
                obj.style[sty] = icur + speed + 'px';
            }
        }
        if(flag){                               //flag==true 检测停止函数要放到for in循环的外面
            clearInterval(obj.times);
            if (fn) {
                fn();
            }
        }
    },15)
}
/**
 * 获取实际样式函数
 * @param   {HTMLElement}   element  需要寻找的样式的html节点
 * @param   {String]} attr 在对象中寻找的样式属性
 * @returns {String} 获取到的属性
 */
function getStyle(obj,sty) {  //获取样式
    if(obj.currentStyle){
        return obj.currentStyle[sty];   //IE下的
    }
    else {return getComputedStyle(obj,false)[sty]}//火狐下的
}
/**
 * 获取当前元素在同级元素的索引
 * @param   {HTMLElement} element html节点
 * @returns {number} 索引
 */
function getIndex(element) {
    var aBrother = element.parentNode.children;
    for (var i = 0, len = aBrother.length; i < len; i++) {
        if (aBrother[i] == element) {
            return i;
        }
    }
}
/**
 * 根据索引删除数组中的元素
 * @param  {Array} arr   数组
 * @param  {number} index 索引
 * @return {Array}       新的数组
 */
function deleteInArray (arr,index) {
    if (isArray(arr)&&index<arr.length) {
        return arr.slice(0, index).concat(arr.slice(index+1));
    } else{
        console.error("not a arr or index error");
    }
}
