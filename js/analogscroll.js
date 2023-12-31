/**
 * Copyright 2017, jackness.org
 * Creator: Jackness Lau
 * $Author: Jackness Lau $
 * $Date: 2018.02.11 $
 * $Version: 2.5.4 $
 */
'use strict';
(function($, window, document, undefined) {
    var
        options = {
            // 方向 x|y
            direction: 'y',
            // 滚动条区域
            scrollbar: undefined,
            // 滚动条滑块一次点击的移动距离
            distance: 20,
            // 向下/右 滚按钮
            forward: undefined,
            // 向上/左 滚按钮
            back: undefined,
            // 滚动动画过渡
            transition: 500,

            // 允许滚动冒泡
            bubble: true,
            // 最终禁止滚动冒泡的对象，默认为 window
            bubbleTarget: window,

            // 距离 底部多少像素时开始触发 onend
            endDistance: 0,

            onend: undefined,

            onbegin: undefined,

            onscroll: undefined,

            onresize: undefined

        },
        fn = {
            preventDefault: function(e) {
                e = e || window.event;
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.returnValue = false;
            },
            px2Num: function(ctx) {
                if (ctx == 'auto') {
                    return 0;
                } else {
                    return parseInt(ctx, 10);
                }
            },
            stopBubble: function(e) {
                e = e || window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                e.cancelBubble = true;
            },
            selection: {
                enable: function() {
                    document.onselectstart = null;
                },
                disable: function() {
                    document.onselectstart = function() {
                        return false;
                    };
                    if (window.getSelection) {
                        window.getSelection().removeAllRanges();
                    } else {
                        document.selection.empty();
                    }
                }
            },
            getPosition: function(target) {
                var contentDocument = document;
                if (arguments[2]) {
                    contentDocument = arguments[2];
                }

                var _x = target.offsetLeft;
                var _y = target.offsetTop;
                if ($(target).css('position') == 'fixed') {
                    _x += contentDocument.documentElement.scrollLeft ||
                        contentDocument.body.scrollLeft;
                    _y += contentDocument.documentElement.scrollTop ||
                        contentDocument.body.scrollTop;
                }
                target = target.offsetParent;
                while (target) {
                    _x += target.offsetLeft || 0;
                    _y += target.offsetTop || 0;
                    target = target.offsetParent;
                }
                return {
                    left:_x,
                    top:_y
                };
            },

            inertiaMotion: function(So, St, T) {
                var sArray = [],
                    //摆动，惯性运动,利用的是sin 的特性,再用次方 加强幅度
                    swingHandle = function() {
                        var S = St - So;

                        for (var i = 0, len = T; i < len; i++) {
                            sArray[i] = parseInt(
                                S * Math.pow(Math.sin(i / T * Math.PI / 2), 3) * 100
                            ) / 100 + So;
                        }
                    };

                swingHandle();

                return {
                    Sn:function(Tn) {
                        return Tn > T ? St : sArray[Tn];
                    }
                };
            }


        },
        // analogscroll 用 私有方法
        sf = {
            niceCnt: {
                get: function(ctrl) {
                    var
                        she = ctrl,
                        setting = she.setting;
                    return setting.cntPos || 0;
                },
                set: function(ctrl, pos) {
                    var
                        she = ctrl,
                        el = she.el,
                        attrs = she.attrs,
                        setting = she.setting;

                    setting.cntPos = pos;
                    // $(el.cnt).attr('scroll' + attrs[3], pos);
                    $(el.cnt)['scroll' + attrs[3]](pos);
                }
            },
            getBarWidth: function() {
                var
                    frag = document.createElement('div'),
                    r = 0;

                frag.className = CNT_CLASS;

                frag.style.cssText = [
                    'position: absolute',
                    'left: 0',
                    'top: 0',
                    'width: 50px',
                    'height: 10px',
                    'overflow-y: scroll'
                ].join(';');
                document.body.appendChild(frag);
                r = frag.offsetWidth - frag.scrollWidth + 1;
                if (!r) {
                    r = 18;
                }
                document.body.removeChild(frag);
                return r;
            },
            b2cMapping: function(ctrl) {
                var
                    she = ctrl,
                    el = she.el,
                    setting = she.setting,
                    attrs = she.attrs,

                    contentPrep = el.cnt['scroll' + attrs[3]],
                    nowPostion = parseFloat(el.bar.style[attrs[2]], 10);


                setting.contentNow = Math.ceil(nowPostion / setting.b2eScale);

                setting.direction = setting.contentNow - contentPrep;

                sf.niceCnt.set(she, setting.contentNow);

                sf.positionCheck(she);
            },
            c2bMapping: function(ctrl) {
                var
                    she = ctrl,
                    el = she.el,
                    setting = she.setting,
                    attrs = she.attrs,
                    nowPosition = setting.contentNow = sf.niceCnt.get(she),
                    iNow = nowPosition * setting.b2eScale,
                    barLimit = el.scrollbar['offset' + attrs[1]] - el.bar['offset' + attrs[1]];

                if (iNow > barLimit) {
                    iNow = barLimit;
                }

                el.bar.style[attrs[2]] = iNow + 'px';

                sf.positionCheck(she);
            },

            positionCheck: function(ctrl) {
                var she = ctrl,
                    op = she.op,
                    setting = she.setting,
                    isEnd = false,
                    isBegin = false;


                if (op.onscroll) {
                    op.onscroll(setting.contentNow, setting.direction);
                }

                if (setting.contentNow + op.endDistance >= setting.contentLimit) {
                    if (op.onend) {
                        op.onend();
                    }

                    if (setting.contentNow >= setting.contentLimit) {
                        isEnd = true;
                    }
                } else if (setting.contentNow === 0) {
                    if (op.onbegin) {
                        op.onbegin();
                    }
                    isBegin = true;
                }


                setting.isEnd = isEnd;
                setting.isBegin = isBegin;

                // var nowPosition = el.target["scroll" + attrs[3]];
                // el.bar.style[attr[2]] = nowPosition * nowPosition + 'px';
            }
        };

    var analogscroll = function(target, op) {
        return new analogscroll.fn.init(target, op);
    };

    var STYLE = [
        '.analogscroll__cnt::-webkit-scrollbar {',
        '   width: 0;',
        '   overflow: hidden;',
        '   opacity: 0;',
        '   visibility: hidden;',
        '}'
    ].join('\n');

    var STYLE_ID = 'analogscrollStyle';
    var CNT_CLASS = 'analogscroll__cnt';

    analogscroll.fn = {
        op: {},

        attrs: [],

        resize: function() {
            var she = this,
                op = she.op,
                el = she.el,
                setting = she.setting,
                targetWidth = $(el.target).width(),
                targetHeight = $(el.target).height(),
                attrs = [];


            if ($(el.cnt).attr('data-direction-x')) {
                targetHeight += setting.barWidth;
            }

            if ($(el.cnt).attr('data-direction-y')) {
                targetWidth += setting.barWidth;
            }


            if ( op.direction == 'x' ) {
                attrs = ['width', 'Width', 'left', 'Left', 'bottom'];
            } else {
                attrs = ['height', 'Height', 'top', 'Top', 'right'];
            }

            $(el.cnt).css('width', targetWidth + 'px');
            $(el.cnt).css('height', targetHeight + 'px');

            $(el.target).css('overflow', 'hidden');



            var seOffset = el.target['offset' + attrs[1]],
                seScroll = el.cnt['scroll' + attrs[1]],
                sbOffset = el.scrollbar['offset' + attrs[1]];


            //可视区域与区域总长之间的比例
            setting.scale = 0;

            if (seOffset >= seScroll || seScroll === 0) {
                setting.scale = 1;
            } else {
                setting.scale = Math.round(seOffset / seScroll * 100) / 100;
            }

            //区域与滚动条之间的比例
            setting.b2eScale = seScroll === 0 ? 0 : Math.round(sbOffset / seScroll * 100) / 100;

            if (seOffset > seScroll) {
                setting.contentLimit = 0;
            } else {
                setting.contentLimit = seScroll - seOffset;
            }


            // setting.contentNow = sf.niceCnt.get(she);

            // if(setting.contentNow < 0){
            //     setting.contentNow = 0;
            //     sf.niceCnt.set(she, -setting.contentNow);
            // }
            // if(setting.contentNow > setting.contentLimit){
            //     setting.contentNow = setting.contentLimit;
            //     sf.niceCnt.set(she, -setting.contentNow);
            // }

            el.bar.style[attrs[0]] = sbOffset * setting.scale + 'px';
            el.bar.style[attrs[2]] = setting.contentNow * setting.b2eScale + 'px';


            if (op.onscroll) {
                op.onscroll( setting.contentNow, setting.direction);
            }
            if (op.onresize) {
                op.onresize(setting.scale);
            }

            // 调整滚动刷新间间距
            setting.niceInterval = Math.round(seScroll / 200);
        },

        back: function() {
            var she = this,
                op = she.op,
                So = sf.niceCnt.get(she);


            she.scrollTo(So - op.distance, undefined, true);
        },
        forward: function() {
            var she = this,
                op = she.op,
                So = sf.niceCnt.get(she);

            she.scrollTo(So + op.distance, undefined, true);
        },
        scrollTo: function(d, done, noAni) {
            var she = this,
                op = she.op,
                el = she.el,
                setting = she.setting,
                attrs = she.attrs;

            if (d < 0) {
                d = 0;
            }
            if (d > setting.contentLimit) {
                d = setting.contentLimit;
            }

            var
                interval = 20,
                T = op.transition / interval,
                Tn = 0,
                So = sf.niceCnt.get(she),
                Sn = So,
                St = parseInt(d, 10),
                acc = fn.inertiaMotion(So, St, T);

            if (noAni) {
                Tn = T;
            }



            clearTimeout(setting.scrollToKey);
            (function doit() {
                if (Tn < T) {
                    setting.isAni = true;
                    Sn = acc.Sn(Tn);
                    sf.niceCnt.set(she, Sn);

                    setting.direction = Sn - So;

                    sf.c2bMapping(she);

                    Tn++;
                    setting.scrollToKey = setTimeout(doit, interval);
                } else {
                    setting.isAni = false;
                    sf.niceCnt.set(she, St);

                    if (sf.niceCnt.get(she) != St) {
                        setting.contentLimit = sf.niceCnt.get(she) + el.target['offset' + attrs[1]];
                    }

                    setting.direction = St - So;

                    sf.c2bMapping(she);
                    if (done) {
                        done();
                    }
                }
            })();
        }

    };

    var
        init = analogscroll.fn.init = function(target, o) {
            // 样式初始化
            if (!$('#' + STYLE_ID).length) {
                $(
                    '<style id="{$id}" type="text/css">{$css}</style>'
                        .replace('{$id}', STYLE_ID)
                        .replace('{$css}', STYLE)
                ).appendTo('head');
            }

            var
                she = this,
                op = she.op = $.fn.extend(undefined, options, o),

                setting = she.setting = {
                    scale: 1,
                    // 内容区域 上限
                    contentLimit: 0,
                    // 内容区域 位置
                    contentNow: 0,
                    // 滚动条区域 上限
                    barLimit: 0,
                    // 滚动条区域 位置
                    barNow: 0,
                    // 是否处于开始位置
                    isBegin: true,
                    // 是否处于结束位置
                    isEnd: false,
                    // 当前滚动方向（距离）
                    direction: 0,

                    barWidth: sf.getBarWidth

                },

                el = she.el = {
                    target: $(target)[0],
                    cnt: $(target).children().eq(0)[0],
                    scrollbar: $(she.op.scrollbar)[0],
                    bar: $(she.op.scrollbar).children()[0],
                    back: $(she.op.back),
                    forward: $(she.op.forward)
                };

            if (!el.target || !el.scrollbar) {
                return;
            }



            // el cnt 初始化
            $(el.cnt).attr('data-direction-' + she.op.direction, '1');
            $(el.cnt).css('position', 'relative');
            $(el.cnt).css('overflow-' + she.op.direction, 'scroll');
            $(el.cnt).addClass(CNT_CLASS);



            if (!she.op.bubble) { // 阻止滚动冒泡相关逻辑
                var deltaKey;
                var scrollKey;
                if (she.op.direction == 'y') {
                    deltaKey = 'deltaY';
                    scrollKey = 'scrollTop';
                } else {
                    deltaKey = 'deltaX';
                    scrollKey = 'scrollLeft';
                }
                var handleD = function(d) {
                    var cntEl = $(el.cnt)[0];
                    var iScroll = cntEl[scrollKey];
                    cntEl[scrollKey] = d + iScroll;

                    setting.direction = d;
                    setting.cntPos = cntEl[scrollKey];
                    sf.c2bMapping(she);
                };
                // for ie, chrome
                $(el.cnt).on('mousewheel', function(e) {
                    e.preventDefault();
                    var iEvent = e.originalEvent;
                    var d = iEvent[deltaKey] || -iEvent.wheelDelta;
                    handleD(d);
                });
                // for firefox
                $(el.cnt).on('DOMMouseScroll', function(e) {
                    e.preventDefault();
                    var iEvent = e.originalEvent;
                    var d = iEvent.detail > 0 ? 100 : -100;
                    handleD(d);
                });
            } else {
                $(el.cnt).on('scroll', function() {
                    var nowScroll = $(el.cnt)['scroll' + attrs[3]](),
                        prevScroll = sf.niceCnt.get(she);
                    if (nowScroll == prevScroll) {
                        return;
                    }
                    setting.direction = nowScroll - prevScroll;
                    setting.cntPos = nowScroll;
                    sf.c2bMapping(she);
                });
            }

            she.resize();

            //滚动条-mousemove事件
            var attrs = [],
                mouseEvt = {
                    // for scrollbar
                    down: function(e) {
                        e = e || window.event;
                        fn.preventDefault(e);
                        fn.stopBubble(e);

                        if (setting.isAni) {
                            return;
                        }

                        setting.posX = e.clientX - this.offsetLeft;
                        setting.posY = e.clientY - this.offsetTop;

                        fn.selection.disable();


                        $(document).bind('mousemove', mouseEvt.move);
                        $(document).bind('mouseup', mouseEvt.up);
                        $(window).bind('losecapture', mouseEvt.up);
                        $(window).bind('blur', mouseEvt.up);
                    },
                    // for window
                    move: function(e) {
                        e = e || window.event;

                        fn.preventDefault(e);
                        if (setting.isAni) {
                            return;
                        }
                        var nowPostion = e['client' + attrs[4]] - setting['pos' + attrs[4]];

                        if (nowPostion < 0) {
                            nowPostion = 0;
                        }

                        if (nowPostion > (el.scrollbar['offset' + attrs[1]] - el.bar['offset' + attrs[1]])) {
                            nowPostion = (el.scrollbar['offset' + attrs[1]] - el.bar['offset' + attrs[1]]);
                        }


                        el.bar.style[attrs[2]] = nowPostion + 'px';
                        sf.b2cMapping(she);
                    },
                    // for window
                    up: function() {
                        fn.selection.enable();
                        $(document).unbind('mousemove', mouseEvt.move);
                        $(document).unbind('mouseup', mouseEvt.up);
                        $(window).unbind('losecapture', mouseEvt.up);
                        $(window).unbind('blur', mouseEvt.up);
                    }
                };

            if (op.direction == 'x') {
                attrs = she.attrs = ['width', 'Width', 'left', 'Left', 'X'];
            } else {
                attrs = she.attrs = ['height', 'Height', 'top', 'Top', 'Y'];
            }

            //滚动条滑块初始化
            el.bar.style[attrs[2]] = 0;

            $(el.scrollbar).bind('mousedown', function(e) {
                var self = this;

                e = e || window.event;
                fn.preventDefault(e);
                fn.stopBubble(e);
                fn.selection.disable();

                setting.posX = e.clientX - self.offsetLeft;
                setting.posY = e.clientY - self.offsetTop;


                $(document).bind('mouseup', function up() {
                    clearTimeout(setting.downKey);
                    fn.selection.enable();
                    $(document).unbind('mouseup', up);
                });

                var
                    barWidth = el.bar['offset' + attrs[1]];

                setting.mousePosition = e['client' + attrs[4]] + (document.documentElement['scroll' + attrs[3]] || document.body['scroll' + attrs[3]]) - fn.getPosition(this)[attrs[2]];


                (function move() {
                    clearTimeout(setting.downKey);

                    var barPosition = parseFloat(el.bar.style[attrs[2]], 10),
                        mousePosition = setting.mousePosition;

                    if (mousePosition < barPosition) {
                        she.back();
                    } else if ( mousePosition > barPosition + barWidth) {
                        she.forward();
                    } else {
                        return;
                    }

                    setting.downKey = setTimeout( move, 50);
                })();
            });

            $(el.bar).bind('mousedown', mouseEvt.down);

            $(el.forward).bind('mousedown', function(e) {
                e = e || window.event;
                clearTimeout(setting.downKey);
                fn.preventDefault(e);

                $(document).bind('mouseup', function up() {
                    clearTimeout(setting.downKey);
                    $(document).unbind('mouseup', up);
                });

                (function move() {
                    she.forward();
                    setting.downKey = setTimeout(move, 50);
                })();
            });

            $(el.back).bind('mousedown', function(e) {
                e = e || window.event;
                clearTimeout(setting.downKey);
                fn.preventDefault(e);

                $(document).bind('mouseup', function up() {
                    clearTimeout(setting.downKey);
                    $(document).unbind('mouseup', up);
                });

                (function move() {
                    she.back();
                    setting.downKey = setTimeout(move, 50);
                })();
            });

            return this;
        };

    init.prototype = analogscroll.fn;


    if (typeof define != 'undefined' && define.amd) {
        define([], function() {
            return analogscroll;
        });
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = analogscroll;
    } else {
        window.analogscroll = analogscroll;
    }
})($, window, document);






