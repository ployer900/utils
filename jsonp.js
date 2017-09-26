/**
 * Callback index.
 */
let count = 0;

export default function jsonp(url, params, opts) {
	if (!opts) opts = {};

	let prefix = opts.prefix || 'jsonp';

	let id = opts.name || (prefix + (count++));

	let param = opts.param || 'callback';
	let timeout = null != opts.timeout ? opts.timeout : 60000;
	let target = document.getElementsByTagName('script')[0] || document.head;
	let script;
	let timer;

	url = url + '?' + serialize(params);

	function cleanup() {
		if (script.parentNode) script.parentNode.removeChild(script);
	
		try {
			delete window[id];
		} catch (e) {
			window[id] = null;
		}
		if (timer) clearTimeout(timer);
	}

	function cancel() {
		if (window[id]) cleanup();
	}

	return new Promise((resolve, reject) => {
		window[id] = (data) => {
			cleanup();
			resolve(data);
		};

		if (timeout) {
			timer = setTimeout(() => {
				cleanup();
				reject(new Error('Timeout'));
			}, timeout);
		}

		// add qs component
		url += (~url.indexOf('?') ? '&' : '?') + param + '=' + encodeURIComponent(id);
		url = url.replace('?&', '?');

		// create script
		script = document.createElement('script');
		script.src = url;
		script.onerror = () => reject(new Error('Script loading error.'));
		target.parentNode.insertBefore(script, target);
	});
}
