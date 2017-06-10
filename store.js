/*
* @Author: yuhongliang
* @Date:   2017-06-10 16:49:29
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-06-10 17:02:37
*/

'use strict';

//存储对象
var store = module.exports = {
    //是否支持history.replaceState和history.state
    isSupportHistoryState: window.history.replaceState && window.history.state,
    isSupportLocalStorage: window.localStorage,

    //是否为字符串类型
    isString: function(v) {
        return typeof v === 'string';
    },

    //添加item
    add: function(key, value) {
        if (this.isSupportLocalStorage){
            if (this.isString(key) && this.isString(value)) {
                window.localStorage.setItem(key,value);
            } else throw new Error('key,value必须为字符串数据类型');
        } else if (this.isSupportHistoryState) {
            var state = window.history.state;
            if (!state) state = {};
            state[key] = value;
            window.history.replaceState(state, '', '');
        } else throw new Error('不支持localStorage,history.state');
    },

    //获取item
    get: function(key) {
        if (this.isSupportLocalStorage) return window.localStorage.getItem(key);
        else if (this.isSupportHistoryState) return window.history.state[key];
        else throw new Error('不支持localStorage,history.state');
    },

    //删除item
    delete: function(key) {
        if (this.isSupportLocalStorage) window.localStorage.removeItem(key);
        else if (this.isSupportHistoryState) delete window.history.state[key];
        else throw new Error('不支持localStorage,history.state');
    },

    //清除
    clear: function() {
        if (this.isSupportLocalStorage) window.localStorage.clear();
        else if (this.isSupportHistoryState) window.history.replaceState(null, '', '');
        else throw new Error('不支持localStorage,history.state');
    }
};