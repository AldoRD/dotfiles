window.AddonsFramework = function() {
	this.browser = new this.Browser;
	this.extension = new this.Extension;
};
window.AddonsFramework.prototype.Browser = function() {
	function f(c, b) {
		if (a[c]) for (var d = 0; d < a[c].length; d++) a[c][d](b);
	}

	function d(a) {
		var b = {action: 'ci_browser_navigate'}, d;
		for (d in a) b[d] = a[d];
		return b;
	}

	var a = {};
	this.attachEvent = function(c, b) {
		a[c] || (a[c] = []);
		a[c].push(b);
	};
	this.fireEvent = f;
	this.navigate = function(a) {
		chrome.runtime.sendMessage(d(a));
	};
	this.NEWTAB = -1;
	this.CURRENTTAB = -2;
	this.NEWWINDOW = -3;
	this.ALLTABS = -4;
	this.TABCLOSED = -5;
	this.DOCUMENTCOMPLETE = 'DocumentComplete';
	this.BEFORENAVIGATE = 'BeforeNavigate';
	this.DNSERROR = 'DNSError';
	this.TABCHANGED = 'TabChanged';
	var b = navigator.userAgent.match(
		/(opr|yabrowser|mrchrome|chrome(?!.*(?:opr|yabrowser|mrchrome)))\/?\s*(\d+)?/i);
	if (b) {
		switch (b[1].toLowerCase()) {
			case 'opr':
				this.name = 'Opera';
				break;
			default:
				this.name = 'Chrome';
		}
		this.version = b[2] || 'unknown';
	} else this.name = 'chromium', this.version = 'unknown';
	chrome.runtime.onMessage.addListener(function(a) {
		'event' == a.action && f(a.name, a.data);
	});
};
window.AddonsFramework.prototype.Extension = function() {
	var f = this, d = {};
	this.fireEvent = function(a, b, c) {
		c ?
			chrome.runtime.sendMessage({action: 'event', name: a, data: b}, c) :
			chrome.runtime.sendMessage({action: 'event', name: a, data: b});
		if (d[a]) for (var e = 0; e < d[a].length; e++) d[a][e].call(f, b, c);
	};
	this.attachEvent = function(a, b) {
		d[a] || (d[a] = []);
		d[a].push(b);
	};
	this.detachEvent = function(a, b) {
		if (d[a]) for (var c = 0; c < d[a].length; c++) b && b === d[a][c] &&
		(delete d[a][c], d[a][c] = null, d[a].splice(c, 1));
	};
	this.log = function() {
		console.log.apply(console,
			arguments);
	};
	chrome.runtime.onMessage.addListener(function(a, b, c) {
		if ('event' == a.action && (b = a.name, a = {data: a.data.data},
			d[b])) for (var e = 0; e < d[b].length; e++) d[b][e] &&
		d[b][e].call(f, a, c);
	});
};
window.framework = new AddonsFramework;
