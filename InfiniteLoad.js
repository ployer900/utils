/*
* @Author: yuhongliang
* @Date:   2017-06-26 17:23:29
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-06-26 17:24:35
*/

'use strict';

/**
 *
 * 滚动分页加载
 *
 * 
 */

;(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object' && module.exports) {
        module.exports = factory();
    } else {
        global.ScrollLoad = factory();
    }
}(window, function() {
    var ScrollLoad = function() {
        this.init.apply(this, arguments);
    }
    //原型函数
    ScrollLoad.prototype = {
        constructor: ScrollLoad,
        init: function(el, fetchData) {
            var self = this;
            this.el = el;
            this.fetchData = fetchData;
            this.isScroll = false;
            $(window).on('scroll', function() {
                self.throttle(function() {
                    if (self.isLoad(self.el)) {
                        self.fetchData();
                        self.isScroll = true;
                    }

                }, 500, 500)();
            });
            this.fetchData();
        },
    }
    //节流函数
    ScrollLoad.prototype.throttle = function(fn, delay, timeout) {
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
    ScrollLoad.prototype.isVisible = function(node, threshold) {
        var top = this.getElemPos(node).top,
            height = node.offsetHeight,
            innerHeight = window.innerHeight,
            scrollDis = window.pageYOffset,
            threshold = threshold || 0;
        return (scrollDis + threshold > (top - innerHeight)) && (scrollDis < (top + height));
    }
    //元素位置
    ScrollLoad.prototype.getElemPos = function(node) {
        var left = 0,
            top = 0;
        while(node && node.offsetParent) {
            left += node.offsetLeft;
            top += node.offsetTop;
            node = node.offsetParent;
        }
        return {left: left, top: top};
    }
    //是否加载过
    ScrollLoad.prototype.isLoad = function(node) {
        return this.isVisible(node, 1000) && !this.isScroll;
    }
    //关闭scroll
    ScrollLoad.prototype.offScroll = function() {
        $(window).off('scroll');
    }
    return ScrollLoad;
}));
