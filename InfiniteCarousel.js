/*
* @Author: yuhongliang
* @Date:   2017-06-27 16:39:03
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-06-27 17:09:57
*/

'use strict';

var InfiniteCarousel = function() {
    // body...
    this.init('.slider_con');
};

InfiniteCarousel.prototype.init = function(el) {
    var list = $(el).find('li');
    var w = window.innerWidth;
    $.each(list,function(index, item) {
        if (index >= 3) index = 3;
        $(item).css('transform','translate3d(' + w * index + 'px,0px,0px)');
    });
};

InfiniteCarousel.prototype.start = function() {
    
}


new InfiniteCarousel();

