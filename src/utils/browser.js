const browser = {};

browser.copy = (str) => {
	return new Promise((resolve, reject) => {
		if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(str).then(resolve).catch(reject);
		}
		const el = document.createElement('textarea');
		el.value = str;
		document.body.appendChild(el);
		el.select();
		const success = document.execCommand('copy');
		document.body.removeChild(el);
		if (success) resolve(); else reject();
	});
};

module.exports = browser;