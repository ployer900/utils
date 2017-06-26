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
    isSupportSessionStorage: window.sessionStorage,

    //是否为字符串类型
    isString: function(v) {
        return typeof v === 'string';
    },
    //存储session周期的数据
    addSession: function(key, value) {
        if (this.isSupportSessionStorage){
            if (this.isString(key) && this.isString(value)) {
                window.sessionStorage.setItem(key,value);
            } else throw new Error('key,value必须为字符串数据类型');
        } else if (this.isSupportHistoryState) {
            var state = window.history.state;
            if (!state) state = {};
            state[key] = value;
            window.history.replaceState(state, '', '');
        } else throw new Error('不支持sessionStorage,history.state');
    },
    //获取session周期的数据
    getSession: function(key) {
        if (this.isSupportSessionStorage) return window.sessionStorage.getItem(key);
        else if (this.isSupportHistoryState) return window.history.state[key];
        else throw new Error('不支持sessionStorage,history.state');
    },
    //永久性存储数据
    addPermanent: function() {
        if (!this.isSupportLocalStorage) {
            throw new Error('不支持localStorage');
            return;
        }
        if (this.isString(key) && this.isString(value)) {
            window.localStorage.setItem(key,value);
        } else throw new Error('key,value必须为字符串数据类型');
    },
    //获取item
    getPermanent: function(key) {
        if (!this.isSupportLocalStorage) {
            throw new Error('不支持localStorage');
            return;
        }
        return window.localStorage.getItem(key);
    },
    //删除session
    deleteSession: function(key) {
        if (!this.sessionStorage) {
            throw new Error('不支持sessionStorage');
            return;
        }
        return window.sessionStorage.removeItem(key);
    },
    //删除item
    deletePermanent: function(key) {
        if (!this.isSupportLocalStorage) {
            throw new Error('不支持localStorage');
            return;
        }
        return window.localStorage.removeItem(key);
    },
    //清除
    clear: function() {
        if (this.isSupportLocalStorage) window.localStorage.clear();
        else if (this.isSupportSessionStorage) window.sessionStorage.clear();
        else if (this.isSupportHistoryState) window.history.replaceState(null, '', '');
        else throw new Error('不支持localStorage,sessionStorage,history.state');
    }
};
