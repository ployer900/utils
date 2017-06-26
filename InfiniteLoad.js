/*
* @Author: yuhongliang
* @Date:   2017-06-26 17:23:29
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-06-26 17:24:35
*/
'use strict';

//构造函数
var InfiniteLoad = function() {
    this.init.apply(this, arguments);
}

//初始化
InfiniteLoad.prototype.init = function(el, fetch) {
    var self = this;
    self.el = el;
    self.fetch = fetch;
    self.isScroll = false;
    $(window).on('scroll', function() {
        self.throttle(function() {
            if (self.startLoading(self.el)) {
                self.fetch();
                self.isScroll = true;
            }
        }, 500, 500)();
    });
    self.fetch();
}

//节流函数
InfiniteLoad.prototype.throttle = function(fn, delay, timeout) {
    var timer = null,
        previous = null;
    return function() {
        var now = +new Date();
        if (!previous) previous = now;
        if (timeout && (now - previous) > delay) {
            fn();
            clearTimeout(timer);
        } else {
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn();
            }, timeout);
        }
    }
}

//元素是否可见
InfiniteLoad.prototype.isVisible = function(node, threshold) {
    var top = this.getLoadingIconPosition(node).top,
        height = node.offsetHeight,
        innerHeight = window.innerHeight,
        scrollYOffset = window.pageYOffset,
        threshold = threshold || 0;
    return (scrollYOffset + threshold > (top - innerHeight)) && (scrollYOffset < (top + height));
}

//元素位置
InfiniteLoad.prototype.getLoadingIconPosition = function(node) {
    var left = 0,
        top = 0;
    while(node && node.offsetParent) {
        left += node.offsetLeft;
        top += node.offsetTop;
        node = node.offsetParent;
    }
    return {left: left, top: top};
}

//是否加载
InfiniteLoad.prototype.startLoading = function(node) {
    return this.isVisible(node, 1000) && !this.isScroll;
}

//关闭scroll
InfiniteLoad.prototype.offScroll = function() {
    $(window).off('scroll');
}

//加载完毕
InfiniteLoad.prototype.loadEnded = function(options) {
    $(this.el).css(options);
    this.offScroll();
}

module.exports = InfiniteLoad;
