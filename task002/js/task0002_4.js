window.onload = winLoad();

function winLoad() {

    var inputArea = $("input"); //获取输入框
    var oUl = $("div ul"); //获取li
    var suggestData = ['a', 'abandon', 'abdomen', 'abide', 'ability', 'able', 'bad', 'better', 'button', 'baby'];
    inputChange(); //输入框监听事件
    clickLi(); //点击li
    keydownLi(); //键盘事件

    /**
     * 输入框监听事件，兼容处理
     */
    function inputChange() {
        if (inputArea.addEventListener) {
            inputArea.addEventListener("input", OnInput, false);
        } else if (inputArea.attachEvent) {
            inputArea.attachEvent("OnPropChanged", OnPropChanged);
        };
        // Firefox, Google Chrome, Opera, Safari, Internet Explorer from version 9
        function OnInput(event) {
            var inputValue = event.target.value;
            handleInput(inputValue);
        }
        // Internet Explorer
        function OnPropChanged(event) {
            if (event.propertyName.toLowerCase() === "value") {
                var inputValue = event.srcElement.value;
                handleInput(inputValue);
            }
        }
    }


    /**
     * 处理输入值
     * @param {String} value 输入框内的值。
     */
    function handleInput(inputValue) {
        console.log(inputValue);
        var liString = "";
        var pattern = new RegExp("^" + inputValue, "i"); //获取开头相同的字符串

        if (inputValue === "") {
            oUl.style.display = "none";
        } else {
            for (var i = 0; i < suggestData.length; i++) {
                if (suggestData[i].match(pattern)) {
                    console.log(suggestData[i]);
                    liString += "<li><span>" + inputValue + "</span>" + suggestData[i].substr(inputValue.length) + "</li>";
                }
            }
            oUl.innerHTML = liString;
            oUl.style.display = "block";
        }
    }

    /**
     * 划过点击li时触发。
     */
    function clickLi() {
        //使用事件代理。
        delegateEvent(oUl, "li", "mouseover", function () {
            removeLiClass();
            addClass(this, "active"); //移出
        });
        delegateEvent(oUl, "li", "mouseout", function () {
            removeClass(this, "active"); //移出
        });
        delegateEvent(oUl, "li", "click", function () {
            inputArea.value = deleteSpan(this.innerHTML); //点击
            oUl.style.display = "none";
        });
    }

    /**
     * 在input框聚焦时，键盘事件触发。
     */
    function keydownLi() {
        addEvent(inputArea, "keydown", function (ev) {
            var heightLi = $(".active"); //高亮的待选li
            var oEvent = ev || window.event;
            //向上
            if (oEvent.keyCode === 38) {
                if (heightLi) {
                    var previousLi = heightLi.previousElementSibling;
                    if (previousLi) {
                        removeLiClass();
                        addClass(previousLi, "active"); //移出
                    }
                } else {
                    addClass($("div li"), "active");
                }
            }
            //向下
            if (oEvent.keyCode === 40) {
                if (heightLi) {
                    var nextLi = heightLi.nextElementSibling;
                    if (nextLi) {
                        removeLiClass();
                        addClass(nextLi, "active");
                    }
                } else {
                    addClass($("div li"), "active");
                }
            }
            //enter回车
            if (oEvent.keyCode === 13) {
                inputArea.value = deleteSpan(heightLi.innerHTML);
                oUl.style.display = "none";
            }
        })
    }

    /**
     * 删除获取到的值中的<span>标签
     * @param {String} stringHtml  li标签的innerHTML
     */
    function deleteSpan(stringHtml) {
        var reg = /^<span>(\w+)<\/span>(\w+)/;
        var stringArr = stringHtml.match(reg);
        if (stringArr) {
            return stringArr[1] + stringArr[2];
        } else {
            return "";
        }
    }

    /**
     * 用于移除所有的className，在鼠标移出和上下移动时使用
     */
    function removeLiClass() {
        var oLi = oUl.getElementsByTagName("li");
        for (var i = 0, len = oLi.length; i < len; i++) {
            oLi[i].className = "";
        }
    }

}
