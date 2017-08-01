window.onload= function () {
    sliceImg($('#img-lists'));
    function sliceImg(element) {
        var timer = null;
        var imgArr = element.getElementsByTagName('img');
        var imgLen = imgArr.length;
        var creatDiv = document.createElement("div");  //创建一个div来存btn的按钮
        var iCurrent = parseInt(getStyle(imgArr[0],'width'));
        element.style.width = iCurrent * imgLen + 'px';  //在这获取的width比一开始知道多少张图片更好
        //创建span，为了存放在div中


        for (var i = 0; i < imgLen; i++) {
            creatDiv.innerHTML += '<span></span>';
        }
        element.parentNode.appendChild(creatDiv); //添加到HTML中
        addClass(creatDiv,'btn');
        addClass(creatDiv.getElementsByTagName('span')[0],'active'); //默认设置第一个为第当前活动的span
        //编写点击函数clickSpan：
        clickSpan();
        /**
         * 点击导航
         */
        function clickSpan() {
            delegateEvent(creatDiv, "span", "click", function () {
                var iTaget = -iCurrent * getIndex(this);
                removeSpanClass();
                addClass(this, "active"); //移出
                startMove(element, {
                    "left": iTaget
                });
            });
        }
        /**
         * 用于移除所有的span的选中状态：active
         */
        function removeSpanClass() {
            var oSpan = creatDiv.getElementsByTagName("span");
            for (var i = 0, len = oSpan.length; i < len; i++) {
                removeClass(oSpan[i], "active");
            }
        }

        var timeGap= 2000;
        timer= setInterval(autoPlay,timeGap);

        hoverElement();
        function hoverElement() {
            addEvent(element.parentNode,"mouseover",function () {
                clearInterval(timer);
            });
            addEvent(element.parentNode,"mouseout",function () {
                timer= setInterval(autoPlay,timeGap);
            });
        }
        function autoPlay() {
            var activeSpan= $('.btn .active');
            var iTarget;
            iTarget= (getIndex(activeSpan) + 1) === imgLen ? 0 : (-iCurrent*(getIndex(activeSpan)+1));
            console.log(iTarget);

            var nextSpan= activeSpan.nextElementSibling;
            if (nextSpan) {
                removeSpanClass();
                addClass(nextSpan, 'active');
            }else {
                removeSpanClass();
                addClass($(".btn span"), "active");
            }
            startMove(element,{
                "left":iTarget
            });
        }
    }
};



