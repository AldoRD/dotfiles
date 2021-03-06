window.AddonsFramework = function(m) {
	var h = this;
	h.browser = new h.Browser;
	h.extension = new h.Extension(h, m);
	h.ui = new function() {
		this.button = new h.Button;
		this.settings = new h.Settings(h);
		this.contextMenu = m && m.contextMenu && m.contextMenu.map(function(e) {
			return new h.ContextMenu(e);
		});
	};
};
window.AddonsFramework.prototype.Browser = function() {
	function m(a) {
		switch (a.tabId || c.CURRENTTAB) {
			case c.NEWTAB:
				chrome.tabs.create({url: a.url, active: !0});
				break;
			case c.BACKGROUNDTAB:
				chrome.tabs.create({url: a.url, active: !1});
				break;
			case c.CURRENTTAB:
				chrome.tabs.query({active: !0, currentWindow: !0}, function(b) {
					0 < b.length && chrome.tabs.update(b[0].id, {url: a.url});
				});
				break;
			case c.NEWWINDOW:
				chrome.windows.create({url: a.url, active: !0});
				break;
			case c.ALLTABS:
				chrome.windows.getAll({populate: !0}, function(b) {
					b.forEach(function(b) {
						b.tabs.forEach(function(b) {
							chrome.tabs.update(b.id,
								{url: a.url});
						});
					});
				});
				break;
			default:
				chrome.tabs.get(a.tabId, function(b) {
					b ?
						(chrome.tabs.update(a.tabId,
							{url: a.url}), delete f[a.tabId]) :
						f[a.tabId] = a;
				});
		}
	}

	function h(a, b) {
		k[a] && k[a].forEach(function(a) {
			a && a(b);
		});
	}

	function e(a) {
		if (a) {
			var b = {
				action: 'event',
				data: {name: c.TABCHANGED, tabId: a.id, url: a.url},
			};
			a.url && 0 !== a.url.indexOf('chrome://') &&
			chrome.tabs.sendMessage(a.id, b);
			h(c.TABCHANGED, b.data);
		}
	}

	var c = this, k = {}, f = {};
	c.attachEvent = function(a, b) {
		k[a] || (k[a] = []);
		k[a].push(b);
	};
	c.detachEvent = function(a, b) {
		if (k[a]) for (var d =
			k[a].length - 1; 0 <= d; d--) k[a][d] && b === k[a][d] &&
		(delete k[a][d], k[a][d] = null, k[a].splice(d, 1));
	};
	c.navigate = m;
	c.onDocumentComplete = function(a, b) {
		h(c.DOCUMENTCOMPLETE, {name: c.DOCUMENTCOMPLETE, tabId: a, url: b});
	};
	c.NEWTAB = -1;
	c.CURRENTTAB = -2;
	c.NEWWINDOW = -3;
	c.ALLTABS = -4;
	c.TABCLOSED = -5;
	c.BACKGROUNDTAB = -6;
	c.DOCUMENTCOMPLETE = 'DocumentComplete';
	c.BEFORENAVIGATE = 'BeforeNavigate';
	c.DNSERROR = 'DNSError';
	c.TABCHANGED = 'TabChanged';
	var l = [], g = navigator.userAgent.match(
		/(opr|yabrowser|mrchrome|chrome(?!.*(?:opr|yabrowser|mrchrome)))\/?\s*(\d+)?/i);
	if (g) {
		switch (g[1].toLowerCase()) {
			case 'opr':
				c.name = 'Opera';
				break;
			default:
				c.name = 'Chrome';
		}
		c.version = g[2] || 'unknown';
	} else (g = navigator.userAgent.match(
		/(firefox|gecko(?!.*(?:firefox)))\/?\s*(\d+)?/i)) && g[1] ?
		(c.name = 'Firefox', c.version = g[2] || 'unknown') :
		(c.name = 'chromium', c.version = 'unknown');
	chrome.tabs.onActivated.addListener(function (a) {
		setTimeout(() => {
			f[a.tabId] && m(f[a.tabId]);
			chrome.tabs.get(a.tabId, function (b) {
				chrome.runtime.lastError ||
				e({ url: b && b.url ? b.url : '', id: a.tabId });
			});
		}, 250);
	});
	chrome.windows.onFocusChanged.addListener(function (a) {
		setTimeout(() => {
			a !== chrome.windows.WINDOW_ID_NONE &&
			chrome.tabs.query({ windowId: a, active: !0 }, function (a) {
				chrome.runtime.lastError ||
				e(a.pop());
			});
		}, 250);
	});
	chrome.tabs.onUpdated.addListener(function(a, b) {
		b.url && (l[a] = {}, l[a].url = b.url);
	});
	chrome.tabs.onRemoved.addListener(function(a) {
		var b = {
			name: c.TABCLOSED,
			tabId: a,
			url: l[a] && l[a].url ? l[a].url : '',
		};
		l.splice(a, 1);
		h(c.TABCLOSED, b);
	});
	chrome.tabs.onUpdated.addListener(function(a, b, d) {
		'loading' != b.status && 'complete' == b.status &&
		chrome.tabs.sendMessage(a, {
			action: 'event', name: c.DOCUMENTCOMPLETE, data: {
				name: c.DOCUMENTCOMPLETE,
				tabId: a, url: b.url ? b.url : d.url,
			},
		});
	});
	chrome.webRequest.onBeforeRequest.addListener(function(a) {
		h(c.BEFORENAVIGATE,
			{name: c.BEFORENAVIGATE, tabId: a.tabId, url: a.url});
	}, {urls: ['<all_urls>'], types: ['main_frame']});
};
window.AddonsFramework.prototype.Extension = function(m, h) {
	function e(a) {
		chrome.windows.getAll({populate: !0}, function(b) {
			b.forEach(function(b) {
				try {
					b.tabs.forEach(function(b) {
						a(b);
					});
				} catch (d) {
				}
			});
		});
	}

	function k() {
		if (chrome.notifications) {
			var a = {
				type: 'basic',
				title: f.name,
				message: 'is Powered By Addons Framework',
				iconUrl: '54321af_logo_48x48.png',
				isClickable: !0,
			}, b = !1, d = function(a) {
				b && (b = !1, chrome.notifications.clear(a, function() {
					setTimeout(function() {
						c(a);
					}, 36E5);
				}));
			}, c = function(c) {
				b ||
				(b = !0, chrome.notifications.create(c ? c : 'licenseNotifier',
					a, function(a) {
						setTimeout(function() {
							d(a);
						}, 3E5);
					}));
			};
			chrome.notifications.onClosed.addListener(function(a) {
				d(a);
			});
			chrome.notifications.onClicked.addListener(function(a) {
				chrome.tabs.create({url: f.gServerUrl, active: !0}, function() {
				});
				d(a);
			});
			c();
		}
	}

	var f = this, l = localStorage.getItem('id'),
		g = {}, a = function(a, b) {
			for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]);
			return a;
		}({
			name: null,
			version: null,
			description: null,
			url: null,
			author: null,
			updateUrl: null,
			optionsPage: null,
		}, h);
	chrome.runtime.onMessage.addListener(function(a, b, d) {
		switch (a.action) {
			case 'event':
				if (b.tab) {
					var c = a.name, e = {
						name: c,
						url: b.tab.url || b.url,
						tabId: b.tab.id,
						data: a.data ? a.data.data : void 0,
					};
					if (g[c]) {
						g[c].forEach(function(a) {
							a.call(f, e, d);
						});
						break;
					}
				}
				break;
			case 'ci_browser_navigate':
				m.browser.navigate(a, b.tab);
				break;
			case 'ci_browser_DocumentComplete':
				if (b.tab &&
					b.tab.id) m.browser.onDocumentComplete(b.tab.id, a.url);
		}
		return !0;
	});
	chrome.runtime.onMessageExternal &&
	chrome.runtime.onMessageExternal.addListener(function(a, b, d) {
		if ('event' === a.action && b.id) {
			var c = a.name, e = {
				name: c,
				url: (b.tab ? b.tab.url : '') || b.url,
				extensionId: b.id,
				data: a.data ? a.data.data : void 0,
			};
			b.tab && (e.tabId = b.tab.id);
			g[c] && g[c].forEach(function(a) {
				a.call(f, e, d);
			});
		}
		return !0;
	});
	this.fireEvent = function(a, b, d) {
		function c(a) {
			return !isNaN(parseInt(a)) && isFinite(a);
		}

		var h = {action: 'event', name: a, data: b};
		b.extensionId ?
			chrome.runtime.sendMessage(b.extensionId, h, d) :
			b.tabId == m.browser.ALLTABS ?
				e(function(a) {
					chrome.tabs.sendMessage(a.id, h, d);
				}) :
				c(b.tabId) && 0 <= b.tabId ?
					chrome.tabs.sendMessage(b.tabId, h, d) :
					chrome.tabs.query({active: !0, currentWindow: !0},
						function(a) {
							a && a[0] && a[0].id && -1 ===
							a[0].url.indexOf('chrome://') &&
							chrome.tabs.sendMessage(a[0].id, h, d);
						});
		g[a] && g[a].forEach(function(a) {
			a.call(f, b, d);
		});
	};
	this.attachEvent = function(a, b) {
		g[a] || (g[a] = []);
		g[a].push(b);
	};
	this.detachEvent = function(a, b) {
		if (g[a]) for (var d = g[a].length -
			1; 0 <= d; d--) g[a][d] && b === g[a][d] &&
		(delete g[a][d], g[a][d] = null, g[a].splice(d, 1));
	};
	this.log = function() {
		console.log.apply(console, arguments);
	};
	this.getBackgroundPage = function() {
		return window;
	};
	for (var b = Object.keys(localStorage),
			 d = 0; d < b.length; d++) if (0 == b[d].indexOf('vars.')) {
		var q = b[d].replace('vars.', ''), n = localStorage[b[d]], p;
		try {
			p = localStorage[b[d]];
		} finally {
			n = p;
		}
		c(q, n);
		delete localStorage[b[d]];
	}
	l || (l = function() {
		function a() {
			return Math.floor(65536 * (1 + Math.random())).
				toString(16).
				substring(1);
		}

		return a() + a() + '-' + a() + '-' + a() + '-' + a() + '-' + a() + a() +
			a();
	}(), localStorage.setItem('id', l), g.Installed &&
	g.Installed.forEach(function(a) {
		a({id: l});
	}));
	(function() {
		f.__defineGetter__('name', function() {
			return a.name;
		});
		f.__defineGetter__('version',
			function() {
				return a.version;
			});
		f.__defineGetter__('description', function() {
			return a.description;
		});
		f.__defineGetter__('url', function() {
			return a.url;
		});
		f.__defineGetter__('author', function() {
			return a.author;
		});
		f.__defineGetter__('updateUrl', function() {
			return a.updateUrl;
		});
		f.__defineGetter__('optionsPage', function() {
			return a.optionsPage;
		});
		a.gServerUrl && (f.gServerUrl = a.gServerUrl, k());
	})();
};
window.AddonsFramework.prototype.Button = function() {
	function m(a) {
		for (var c = 0; c < b.length; c++) try {
			b[c]({tabId: a.id, url: a.url, name: h});
		} catch (g) {
		}
	}

	var h = 'ButtonClick', e = null, c = null, k = null, f = null,
		l = chrome.runtime.getManifest();
	if (l.page_action) {
		var c = l.page_action.default_popup, k = l.page_action.default_icon,
			f = l.page_action.default_title, g = function(a) {
				e.show(a);
				c && e.setPopup({tabId: a, popup: c});
				k && e.setIcon({tabId: a, path: k});
				f && e.setTitle({tabId: a, title: f});
			}, e = chrome.pageAction;
		chrome.tabs.query({
			active: !0,
			windowId: chrome.windows.WINDOW_ID_CURRENT,
		}, function(a) {
			e.show(a[0].id);
		});
		chrome.tabs.onUpdated.addListener(g);
		chrome.tabs.onActivated.addListener(function(a) {
			g(a.tabId);
		});
	} else l.browser_action && (e = chrome.browserAction);
	var a = !1, b = [];
	this.setPopup = function(a) {
		e && (c = a ? a.url : '', e === chrome.browserAction ?
			e.setPopup({popup: c}) :
			chrome.tabs.query(
				{active: !0, windowId: chrome.windows.WINDOW_ID_CURRENT},
				function(a) {
					e.setPopup({tabId: a[0].id, popup: c});
				}));
	};
	this.setIcon = function(a) {
		e && (k = a, e === chrome.browserAction ?
			e.setIcon({path: a}) :
			chrome.tabs.query(
				{active: !0, windowId: chrome.windows.WINDOW_ID_CURRENT},
				function(a) {
					e.setIcon({tabId: a[0].id, path: k});
				}));
	};
	this.setTitle = function(a) {
		e && (f = a, e === chrome.browserAction ?
			e.setTitle({title: f}) :
			chrome.tabs.query(
				{active: !0, windowId: chrome.windows.WINDOW_ID_CURRENT},
				function(a) {
					e.setTitle({tabId: a[0].id, title: f});
				}));
	};
	this.attachEvent = function(c, g) {
		c == h && (a || (e && e.onClicked.addListener(m), a = !0), b.push(g));
	};
	this.detachEvent = function(c, g) {
		if (c == h) {
			for (var f = 0; f < b.length; f++) b[f] ===
			g && (b.splice(f, 1), f--);
			0 == b.length && (a = !1, e && e.onClicked.removeListener(m));
		}
	};
	this.setBadgeText = function(a) {
		'string' !== typeof a && (a = a.toString());
		e && e.setBadgeText({text: a.toString()});
	};
	this.setBadgeBackgroundColor = function(a) {
		function b(a) {
			var c = /rgb\((\d+), (\d+), (\d+)\)/;
			if (c.test(a)) return a = c.exec(a), [
				parseInt(a[1]),
				parseInt(a[2]),
				parseInt(a[3]),
				255];
			a = parseInt(-1 < a.indexOf('#') ? a.substring(1) : a, 16);
			return [a >> 16, (a & 65280) >> 8, a & 255, 255];
		}

		e && e.setBadgeBackgroundColor({color: b(a)});
	};
	this.setBadgeColor =
		function() {
		};
	this.CLICK = h;
};
window.AddonsFramework.prototype.ContextMenu = function(m) {
	function h(c, a) {
		if (c.menuItemId == k) for (var b = 0; b < f.length; b++) try {
			f[b]({tabId: a.id, url: a.url, name: e});
		} catch (d) {
		}
	}

	var e = 'ContextMenuItemClick',
		c = [e, 'page', 'editable', 'selection', 'link', 'image'];
	this.CLICK = e;
	this.DEFAULT = 'page';
	this.IMAGE = 'image';
	this.CONTROL = 'editable';
	this.SELECTION = 'selection';
	this.ANCHOR = 'link';
	var k = function() {
		function c() {
			return Math.floor(65536 * (1 + Math.random())).
				toString(16).
				substring(1);
		}

		return c() + c() + '-' + c() + '-' + c() +
			'-' + c() + '-' + c() + c() + c();
	}(), f = [], l = !1;
	this.setTitle = function(c) {
		chrome.contextMenus.update(k, {title: c});
	};
	this.setContext = function(e) {
		chrome.contextMenus.update(k, {
			contexts: e.map(function(a) {
				return -1 < c.indexOf(a) ? a : null;
			}),
		});
	};
	this.setIcon = function() {
	};
	this.attachEvent = function(c, a) {
		c == e &&
		(l || (chrome.contextMenus.onClicked.addListener(h), l = !0), f.push(a));
	};
	this.detachEvent = function(c, a) {
		if (c == e) {
			for (var b = 0; b < f.length; b++) f[b] === callback &&
			(f.splice(b, 1), b--);
			0 == f.length &&
			(l = !1, chrome.contextMenus.onClicked.removeListener(function(b) {
				a({
					tabId: b.id,
					url: b.url, name: e,
				});
			}));
		}
	};
	chrome.contextMenus.create({
		id: k, contexts: function(e) {
			return (e || 'Default').replace(/Default/i, 'page').
				replace(/Image/i, 'image').
				replace(/Control/i, 'editable').
				replace(/Selection/i, 'selection').
				replace(/Anchor/i, 'link').
				split('|').
				map(function(a) {
					return -1 < c.indexOf(a) ? a : null;
				});
		}(m.context), title: m.title,
	});
};
window.AddonsFramework.prototype.Settings = function(m) {
	this.open = function() {
		var h = m.extension.optionsPage;
		h && m.browser.navigate({url: h, tabId: m.browser.NEWTAB});
	};
};
