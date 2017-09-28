/**
 * @FileName ajax
 * @Synopsis ajax封装
 * @author ployer900, <yuhongliang900@163.com>
 * @Version 0.0.1
 * @date 2017-09-25
 */

// error
function AjaxError(message) {
  this.name = 'MtAjaxError';
  this.message = message;
}
AjaxError.prototype = Object.create(Error.prototype);
AjaxError.prototype.constructor = AjaxError;

// default settings
const ajaxSettings = {
  type: 'GET',
  url: window.location.toString(),
  data: null,
  processData: true,
  contentType: 'application/x-www-form-urlencoded',
  mimeType: '',
  dataType: '',
  jsonp: 'callback',
  jsonpCallback: 'jsonp',
  timeout: 0,
  headers: null,
  async: true,
  global: true,
  context: window,
  traditional: false,
  cache: true,
  xhrFields: null
};

// util tool
let util = {
  merge: (target, source) => {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
    return target;
  },
  isFunction: (args) => typeof args === 'function',
  isObject: (args) => Object.prototype.toString.call(args) === '[object Object]',
  // TODO: using zepto lib serialize method instance of
  serialize: (data) => Object.keys(data).map((key, index) => ( key + '=' + data[key] )).join('&')
};

// callback index
let count = 1;

/**
 * jsonp
 * @param  {Object} [options={}] [options]
 * @return {[type]}              [undefined]
 */
export const jsonp = (options = {}) => {
  if (!util.isObject(options)) {
    throw new AjaxError('parameter in jsonp method must be object');
    return;
  }
  let settings = util.merge({}, options);
  for (let key in ajaxSettings) {
    if (settings[key] === undefined) settings[key] = ajaxSettings[key];
  }
  let { url, jsonp, jsonpCallback, timeout, processData, cache, data } = settings;
  let script = null;
  let timer = null;
  let target = document.head;
  let id = jsonpCallback + (count++);

  // backup already existed global callback
  let originalCallback = window[id];
  let cleanup = () => {
    if (script.parentNode) script.parentNode.removeChild(script);
    try {
      delete window[id];
    } catch(e) {
      window[id] = null;
    }
    if (timer) clearTimeout(timer);
  };

  if (data && processData) url = url + '?' + serialize(data);
  if (cache) url += '&_=' + (+new Date());

  // return promise
  return new Promise((resolve, reject) => {
    window[id] = (data) => {
      cleanup();
      if (util.isFunction(originalCallback)) originalCallback(data);
      resolve(data);
    };
    if (timeout) {
      timer = setTimeout(() => {
        cleanup();
        reject(new Error('Timeout.'));
      }, timeout);
    }

    // add qs component
    url += (~url.indexOf('?') ? '&' : '?') + jsonp + '=' + encodeURIComponent(id);
		url = url.replace('?&', '?');

    // create script
    script = document.createElement('script');
    script.src = url;
    script.onerror = () => reject(new Error('Script loading error.'));
    target.appendChild(script);
  });
}
