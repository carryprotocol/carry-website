/**
 * 监听触摸的方向
 * @param target            要绑定监听的目标元素
 * @param isPreventDefault  是否屏蔽掉触摸滑动的默认行为（例如页面的上下滚动，缩放等）
 * @param upCallback        向上滑动的监听回调（若不关心，可以不传，或传false）
 * @param rightCallback     向右滑动的监听回调（若不关心，可以不传，或传false）
 * @param downCallback      向下滑动的监听回调（若不关心，可以不传，或传false）
 * @param leftCallback      向左滑动的监听回调（若不关心，可以不传，或传false）
 */

var touchGap = 30; //innerHeight / 3;

var EventUtil = {
    addHandler: function (element, type, handler) {
        $(element).on(type, handler);
        // if (element.addEventListener)
        //     element.addEventListener(type, handler, false);
        // else if (element.attachEvent)
        //     element.attachEvent("on" + type, handler);
        // else
        //     element["on" + type] = handler;
    },
    removeHandler: function (element, type, handler) {
        if (element.removeEventListener)
            element.removeEventListener(type, handler, false);
        else if (element.detachEvent)
            element.detachEvent("on" + type, handler);
        else
            element["on" + type] = handler;
    },
    listenTouchDirection: function (target, isPreventDefault, upCallback, rightCallback, downCallback, leftCallback) {
        this.addHandler(target, "touchstart", handleTouchEvent);
        this.addHandler(target, "touchend", handleTouchEvent);
        this.addHandler(target, "touchmove", handleTouchEvent);

        var startX;
        var startY;

        function handleTouchEvent(event) {
            switch (event.type) {
                case "touchstart":
                    startX = event.originalEvent.touches[0].pageX;
                    startY = event.originalEvent.touches[0].pageY;
                    break;
                case "touchend":
                    // console.log(event);
                    var spanX = event.originalEvent.changedTouches[0].pageX - startX;
                    var spanY = event.originalEvent.changedTouches[0].pageY - startY;

                    if (Math.abs(spanX) > Math.abs(spanY)) {      //认定为水平方向滑动
                        if (spanX > 30) {         //向右
                            if (rightCallback)
                                rightCallback(event);
                        } else if (spanX < -30) { //向左
                            if (leftCallback)
                                leftCallback(event);
                        }
                    } else {                                    //认定为垂直方向滑动
                        if (spanY > touchGap) {
                            //向下
                            if (downCallback)
                                downCallback(event);
                        } else if (spanY < -touchGap) {
                            //向上
                            if (upCallback)
                                upCallback(event);
                        }
                    }
                    break;
                case "touchmove":
                    //阻止默认行为
                    if (isPreventDefault)
                        // event.preventDefault();
                        break;
            }
        }
    },
    listenMouseDirection: function (target, upCallback, downCallback) {
        this.addHandler(target, "mousewheel DOMMouseScroll", handleTouchEvent);
        function handleTouchEvent(event) {
            var spanY = event.originalEvent.wheelDelta || -event.originalEvent.detail;

            if (spanY > touchGap) {
                //向下
                if (downCallback)
                    downCallback(event);
            } else if (spanY < -touchGap) {
                //向上
                if (upCallback)
                    upCallback(event);
            }
        }
    }
};
