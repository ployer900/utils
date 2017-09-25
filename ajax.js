/**
 * @FileName ajax.m.js
 * @Synopsis ajax封装
 * @author ployer900, <yuhongliang900@163.com>
 * @Version 0.0.1
 * @date 2017-09-25
 */

//默认设置选项
var ajaxSettings = {
  type: 'GET',
  url: window.location.toString(),
  data: null,
  contentType: 'application/x-www-form-urlencoded',
  mimeType: '',
  dataType: '',
  jsonp: 'callback',
  jsonpCallback: '',
  timeout: 0,
  headers: '',
  context: window
};

//请求标识
var jsonpID = (() => {
  var id = 1;
  return () => {
    return id++;
  }
})();

//合并对象
var merge = (target, source) => {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (target[key] === undefined) target[key] = source[key];
    }
  }
  return target;
};

//函数判断
var isFunction = (func) => {
  return typeof func === 'function';
};

//序列化
var serialize = (data) => {

};

//数据处理
var handleResponse = (response) => {
  const { type } = response;
  if (type === 'error' || type === 'timeout') {

    console.log(response.options);

    //添加灵犀打点上报异常
    var e = new Error(type);
    throw e;
    return;
  }

  return response.data;
}

//jsonp
export var jsonp = (options) => {
  merge(options, ajaxSettings);
  var _callbackName = options.jsonpCallback;
  var callbackName = (isFunction(_callbackName) ?
      _callbackName() : _callbackName) || ('jsonp' + jsonpID());
  var script = document.createElement('script');
  var originalCallback = window[callbackName];
  var responseData;
  var abortTimeout;

  //覆写全局回调函数
  window[callbackName] = function() { responseData = arguments; };

  return new Promise((resolve, reject) => {
    var loadSuccess = () => {
      abortTimeout && clearTimeout(abortTimeout);
      script.removeEventListener('load', loadSuccess, false);
      script.removeEventListener('error', loadError, false);
      script.parentNode && script.parentNode.removeChild(script);
      window[callbackName] = originalCallback;
      if (responseData && isFunction(originalCallback)) {
        originalCallback(responseData[0]);
      }
      resolve({type: 'success', data: responseData[0]});
      //释放空间
      originalCallback = responseData = undefined;
    };
    var loadError = (e) => {
      abortTimeout && clearTimeout(abortTimeout);
      resolve({ type: 'error', options: options });
    };
    script.addEventListener('load', loadSuccess, false);
    script.addEventListener('error', loadError, false);

    //如果配置了timeout值，则设置超时定时器
    if (options.timeout > 0) abortTimeout = setTimeout(function() {
      resolve({ type: 'timeout', options: options });
    }, options.timeout);

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
    document.head.appendChild(script);
  });
};

export var ajaxJSONP = (options) => {
  return jsonp(options).then(handleResponse);
}
