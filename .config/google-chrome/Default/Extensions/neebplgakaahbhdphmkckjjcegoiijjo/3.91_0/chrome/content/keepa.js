var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.checkStringArgs = function(g, p, f) {
  if (null == g) {
    throw new TypeError("The 'this' value for String.prototype." + f + " must not be null or undefined");
  }
  if (p instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + f + " must not be a regular expression");
  }
  return g + "";
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(g, p, f) {
  g != Array.prototype && g != Object.prototype && (g[p] = f.value);
};
$jscomp.getGlobal = function(g) {
  return "undefined" != typeof window && window === g ? g : "undefined" != typeof global && null != global ? global : g;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(g, p, f, x) {
  if (p) {
    f = $jscomp.global;
    g = g.split(".");
    for (x = 0; x < g.length - 1; x++) {
      var u = g[x];
      u in f || (f[u] = {});
      f = f[u];
    }
    g = g[g.length - 1];
    x = f[g];
    p = p(x);
    p != x && null != p && $jscomp.defineProperty(f, g, {configurable:!0, writable:!0, value:p});
  }
};
$jscomp.polyfill("String.prototype.startsWith", function(g) {
  return g ? g : function(g, f) {
    var p = $jscomp.checkStringArgs(this, g, "startsWith");
    g += "";
    var u = p.length, D = g.length;
    f = Math.max(0, Math.min(f | 0, p.length));
    for (var G = 0; G < D && f < u;) {
      if (p[f++] != g[G++]) {
        return !1;
      }
    }
    return G >= D;
  };
}, "es6", "es3");
$jscomp.polyfill("String.prototype.endsWith", function(g) {
  return g ? g : function(g, f) {
    var p = $jscomp.checkStringArgs(this, g, "endsWith");
    g += "";
    void 0 === f && (f = p.length);
    f = Math.max(0, Math.min(f | 0, p.length));
    for (var u = g.length; 0 < u && 0 < f;) {
      if (p[--f] != g[--u]) {
        return !1;
      }
    }
    return 0 >= u;
  };
}, "es6", "es3");
$jscomp.findInternal = function(g, p, f) {
  g instanceof String && (g = String(g));
  for (var x = g.length, u = 0; u < x; u++) {
    var D = g[u];
    if (p.call(f, D, u, g)) {
      return {i:u, v:D};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill("Array.prototype.find", function(g) {
  return g ? g : function(g, f) {
    return $jscomp.findInternal(this, g, f).v;
  };
}, "es6", "es3");
(function() {
  var g = window, p = !1;
  String.prototype.hashCode = function() {
    var a = 0, c;
    if (0 === this.length) {
      return a;
    }
    var e = 0;
    for (c = this.length; e < c; e++) {
      var b = this.charCodeAt(e);
      a = (a << 5) - a + b;
      a |= 0;
    }
    return a;
  };
  var f = "optOut_crawl revealStock s_boxOfferListing s_boxType s_boxHorizontal webGraphType webGraphRange overlayPriceGraph".split(" "), x = window.opera || -1 < navigator.userAgent.indexOf(" OPR/"), u = -1 < navigator.userAgent.toLowerCase().indexOf("firefox"), D = -1 < navigator.userAgent.toLowerCase().indexOf("edge/"), G = /Apple Computer/.test(navigator.vendor) && /Safari/.test(navigator.userAgent), H = !x && !u && !D && !G, P = H ? "keepaChrome" : x ? "keepaOpera" : G ? "keepaSafari" : D ? 
  "keepaEdge" : "keepaFirefox", ba = u ? "Firefox" : G ? "Safari" : H ? "Chrome" : x ? "Opera" : D ? "Edge" : "Unknown", C = null, M = !1;
  try {
    M = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  } catch (a) {
  }
  if (H) {
    try {
      chrome.runtime.sendMessage("hnkcfpcejkafcihlgbojoidoihckciin", {type:"isActive"}, null, function(a) {
        chrome.runtime.lastError || a && a.isActive && (p = !0);
      });
    } catch (a) {
    }
  }
  try {
    chrome.runtime.onUpdateAvailable.addListener(function(a) {
      chrome.runtime.reload();
    });
  } catch (a) {
  }
  var X = {}, Y = 0;
  chrome.runtime.onMessage.addListener(function(a, d, e) {
    if (d.tab && d.tab.url || d.url) {
      switch(a.type) {
        case "restart":
          document.location.reload(!1);
          break;
        case "setCookie":
          chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:a.key, value:a.val, secure:!0, expirationDate:(Date.now() / 1000 | 0) + 31536E3});
          "token" == a.key ? C != a.val && 64 == a.val.length && (C = a.val, c.set("token", C), setTimeout(function() {
            document.location.reload(!1);
          }, 300)) : c.set(a.key, a.val);
          break;
        case "getCookie":
          return chrome.cookies.get({url:"https://keepa.com/extension", name:a.key}, function(a) {
            null == a ? e({value:null}) : e({value:a.value});
          }), !0;
        case "openPage":
          chrome.windows.create({url:a.url, incognito:!0});
          break;
        case "isPro":
          e({value:c.stockData.pro});
          break;
        case "getStock":
          return c.addStockJob(a, function(b) {
            5 == b.errorCode || 9 == b.errorCode ? (9 == b.errorCode && (a.withTimeout = !0), console.log("retry stock", a.gid), c.addStockJob(a, e)) : e(b);
          }), !0;
        case "getFilters":
          e({value:v.getFilters()});
          break;
        case "sendData":
          d = a.val;
          if (null != d.ratings) {
            var b = d.ratings;
            if (1000 > Y) {
              if ("f1" == d.key) {
                if (b) {
                  for (var E = b.length; E--;) {
                    var k = b[E];
                    null == k || null == k.asin ? b.splice(E, 1) : (k = d.domainId + k.asin, X[k] ? b.splice(E, 1) : (X[k] = 1, Y++));
                  }
                  0 < b.length && n.sendPlainMessage(d);
                }
              } else {
                n.sendPlainMessage(d);
              }
            } else {
              X = null;
            }
          } else {
            n.sendPlainMessage(d);
          }
          e({});
          break;
        case "optionalPermissionsRequired":
          e({value:(H || u || x) && "undefined" === typeof chrome.webRequest});
          break;
        case "optionalPermissionsDenied":
          c.set("optOut_crawl", "1");
          console.log("optionalPermissionsDenied");
          e({value:!0});
          break;
        case "optionalPermissionsInContent":
          d = a.val;
          "undefined" != typeof d && (d ? (c.set("optOut_crawl", "0"), console.log("granted"), chrome.runtime.reload()) : (c.set("optOut_crawl", "1"), l.reportBug("permission denied"), console.log("denied")));
          e({value:!0});
          break;
        case "optionalPermissions":
          return "undefined" === typeof chrome.webRequest && chrome.permissions.request({permissions:["webRequest", "webRequestBlocking"]}, function(a) {
            chrome.runtime.lastError || (e({value:a}), "undefined" != typeof a && (a ? (c.set("optOut_crawl", "0"), console.log("granted"), chrome.runtime.reload()) : (c.set("optOut_crawl", "1"), l.reportBug("permission denied"), console.log("denied"))));
          }), !0;
        default:
          e({});
      }
    }
  });
  window.onload = function() {
    u ? chrome.storage.local.get(["install", "optOutCookies"], function(a) {
      a.optOutCookies && 3456E5 > Date.now() - a.optOutCookies || (a.install ? l.register() : chrome.tabs.create({url:chrome.runtime.getURL("chrome/content/onboard.html")}));
    }) : l.register();
  };
  try {
    chrome.browserAction.onClicked.addListener(function(a) {
      chrome.tabs.create({url:"https://keepa.com/#!manage"});
    });
  } catch (a) {
    console.log(a);
  }
  var c = {storage:chrome.storage.local, contextMenu:function() {
    try {
      chrome.contextMenus.removeAll(), chrome.contextMenus.create({title:"View products on Keepa", contexts:["page"], id:"keepaContext", documentUrlPatterns:"*://*.amazon.com/* *://*.amzn.com/* *://*.amazon.co.uk/* *://*.amazon.de/* *://*.amazon.fr/* *://*.amazon.it/* *://*.amazon.ca/* *://*.amazon.com.mx/* *://*.amazon.es/* *://*.amazon.co.jp/* *://*.amazon.in/*".split(" ")}), chrome.contextMenus.onClicked.addListener(function(a, c) {
        chrome.tabs.sendMessage(c.id, {key:"collectASINs"}, {}, function(a) {
          "undefined" != typeof a && chrome.tabs.create({url:"https://keepa.com/#!viewer/" + encodeURIComponent(JSON.stringify(a))});
        });
      });
    } catch (a) {
      console.log(a);
    }
  }, parseCookieHeader:function(a, c) {
    if (0 < c.indexOf("\n")) {
      c = c.split("\n");
      for (var e = 0; e < c.length; ++e) {
        var b = c[e].substring(0, c[e].indexOf(";")), E = b.indexOf("=");
        b = [b.substring(0, E), b.substring(E + 1)];
        2 == b.length && "-" != b[1] && a.push(b);
      }
    } else {
      c = c.substring(0, c.indexOf(";")), e = c.indexOf("="), c = [c.substring(0, e), c.substring(e + 1)], 2 == c.length && "-" != c[1] && a.push(c);
    }
  }, log:function(a) {
    l.quiet || console.log(a);
  }, iframeWin:null, operationComplete:!1, counter:0, stockInit:!1, stockRequest:[], initStock:function() {
    if (!c.stockInit && "undefined" != typeof chrome.webRequest) {
      var a = ["xmlhttprequest"], d = "*://www.amazon.com/* *://www.amazon.co.uk/* *://www.amazon.es/* *://www.amazon.nl/* *://www.amazon.com.mx/* *://www.amazon.it/* *://www.amazon.in/* *://www.amazon.de/* *://www.amazon.fr/* *://www.amazon.co.jp/* *://www.amazon.ca/* *://www.amazon.com.br/* *://www.amazon.com.au/* *://www.amazon.com.mx/* *://smile.amazon.com/* *://smile.amazon.co.uk/* *://smile.amazon.es/* *://smile.amazon.nl/* *://smile.amazon.com.mx/* *://smile.amazon.it/* *://smile.amazon.in/* *://smile.amazon.de/* *://smile.amazon.fr/* *://smile.amazon.co.jp/* *://smile.amazon.ca/* *://smile.amazon.com.br/* *://smile.amazon.com.au/* *://smile.amazon.com.mx/*".split(" ");
      try {
        var e = [c.stockData.addCartHeaders, c.stockData.geoHeaders, c.stockData.setAddressHeaders, c.stockData.addressChangeHeaders];
        chrome.webRequest.onBeforeSendHeaders.addListener(function(a) {
          if (!a.initiator.startsWith("http")) {
            var b = a.requestHeaders, k = {};
            try {
              for (var d = null, g = 0; g < b.length; ++g) {
                if ("krequestid" == b[g].name) {
                  d = b[g].value;
                  b.splice(g--, 1);
                  break;
                }
              }
              if (d) {
                var l = c.stockRequest[d];
                c.stockRequest[a.requestId] = l;
                setTimeout(function() {
                  delete c.stockRequest[a.requestId];
                }, 30000);
                var f = e[l.requestType];
                for (d = 0; d < b.length; ++d) {
                  var p = b[d].name.toLowerCase();
                  (f[p] || "" === f[p] || f[b[d].name] || "cookie" == p || "content-type" == p || "sec-fetch-dest" == p || "sec-fetch-mode" == p || "sec-fetch-user" == p || "accept" == p || "referer" == p) && b.splice(d--, 1);
                }
                if (0 == l.requestType && 19 > l.stockSession.length) {
                  return k.cancel = !0, k;
                }
                var m = c.stockData.isMobile ? "https://" + l.host + "/gp/aw/d/" + l.asin + "/" : l.referer, u;
                for (u in f) {
                  var n = f[u];
                  if (0 != n.length) {
                    n = n.replace("{COOKIE}", l.stockSession).replace("{REFERER}", m).replace("{ORIGIN}", l.host);
                    if (-1 < n.indexOf("{CSRF}")) {
                      if (l.csrf) {
                        n = n.replace("{CSRF}", l.csrf), l.csrf = null;
                      } else {
                        continue;
                      }
                    }
                    b.push({name:u, value:n});
                  }
                }
                for (f = 0; f < b.length; ++f) {
                  var v = b[f].name.toLowerCase();
                  (c.stockData.stockHeaders[v] || "" === c.stockData.stockHeaders[v] || c.stockData.stockHeaders[b[f].name] || "origin" == v || "pragma" == v || "cache-control" == v || "upgrade-insecure-requests" == v) && b.splice(f--, 1);
                }
                for (var J in c.stockData.stockHeaders) {
                  var x = c.stockData.stockHeaders[J];
                  0 != x.length && (x = x.replace("{COOKIE}", l.stockSession).replace("{REFERER}", m).replace("{ORIGIN}", l.host).replace("{LANG}", c.stockData.languageCode[l.domainId]), b.push({name:J, value:x}));
                }
                k.requestHeaders = b;
                a.requestHeaders = b;
              } else {
                return k;
              }
            } catch (K) {
              k.cancel = !0;
            }
            return k;
          }
        }, {urls:d, types:a}, H ? ["blocking", "requestHeaders", "extraHeaders"] : ["blocking", "requestHeaders"]);
        chrome.webRequest.onHeadersReceived.addListener(function(a) {
          if (!a.initiator.startsWith("http")) {
            var b = a.responseHeaders, e = {};
            try {
              var d = c.stockRequest[a.requestId], g = [];
              if (d) {
                for (a = 0; a < b.length; ++a) {
                  "set-cookie" == b[a].name.toLowerCase() && (c.parseCookieHeader(g, b[a].value), b.splice(a, 1), a--);
                }
                d.cookies = g;
                switch(d.requestType) {
                  case 0:
                    e.responseHeaders = b;
                    break;
                  case 1:
                  case 2:
                    e.responseHeaders = b;
                    break;
                  case 3:
                    e.cancel = !0, setTimeout(function() {
                      d.cookies = g;
                      c.stockSessions[d.domainId + d.asin] = g;
                      d.callback();
                    }, 10);
                }
                b = "";
                for (a = 0; a < d.cookies.length; ++a) {
                  var l = d.cookies[a];
                  b += l[0] + "=" + l[1] + "; ";
                  "session-id" == l[0] && 16 < l[1].length && 65 > l[1].length && l[1] != d.session && (d.sessionIdMismatch = !0);
                }
                d.stockSession = b;
              } else {
                return e;
              }
            } catch (da) {
              e.cancel = !0;
            }
            return e;
          }
        }, {urls:d, types:a}, H ? ["blocking", "responseHeaders", "extraHeaders"] : ["blocking", "responseHeaders"]);
        c.stockInit = !0;
      } catch (b) {
        l.reportBug(b, b.message + " stock exception: " + typeof chrome.webRequest + " " + ("undefined" != typeof chrome.webRequest ? typeof chrome.webRequest.onBeforeSendHeaders : "~") + " " + ("undefined" != typeof chrome.webRequest ? typeof chrome.webRequest.onHeadersReceived : "#"));
      }
    }
  }, stockData:null, stockJobQueue:[], stockSessions:[], addStockJob:function(a, d) {
    a.gid = l.Guid.newGuid().substr(0, 8);
    a.requestType = -1;
    c.stockRequest[a.gid] = a;
    var e = function(a) {
      c.stockJobQueue.shift();
      d(a);
      0 < c.stockJobQueue.length && (c.stockJobQueue[0][0].withTimeout ? setTimeout(function() {
        c.processStockJob(c.stockJobQueue[0][0], c.stockJobQueue[0][1]);
      }, 2000) : c.processStockJob(c.stockJobQueue[0][0], c.stockJobQueue[0][1]));
    };
    c.stockJobQueue.push([a, e]);
    1 == c.stockJobQueue.length && c.processStockJob(a, e);
  }, processStockJob:function(a, d) {
    if (null == c.stockData.stock) {
      console.log("stock retrieval not initialized"), d({error:"stock retrieval not initialized", errorCode:0});
    } else {
      if (0 == c.stockData.stockEnabled[a.domainId]) {
        console.log("stock retrieval not supported for domain"), d({error:"stock retrieval not supported for domain", errorCode:1});
      } else {
        if (!0 === c.stockData.pro || a.force) {
          if (!a.isMAP && a.maxQty && c.stockData.stockMaxQty && a.maxQty < c.stockData.stockMaxQty) {
            d({stock:a.maxQty, limit:!1});
          } else {
            if (null == a.oid) {
              console.log("missing oid", a), d({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " missing oid.", errorCode:10});
            } else {
              if (a.onlyMaxQty) {
                d();
              } else {
                if (c.initStock(), c.stockInit) {
                  if (setTimeout(function() {
                    delete c.stockRequest[a.gid];
                    delete c.stockSessions[a.domainId + a.asin];
                  }, 3E5), a.queue = [function() {
                    for (var b = "", e = !1, k = !1, g = 0, f = 0; f < a.cookies.length; ++f) {
                      var p = a.cookies[f];
                      b += p[0] + "=" + p[1] + "; ";
                      "session-id" == p[0] && 16 < p[1].length && 65 > p[1].length && (e = !0, p[1] != a.session && (k = !0, g = p[1]));
                    }
                    a.cookie = b;
                    e && k ? (a.stockSession = b, b = c.stockData.addCartUrl, e = c.stockData.addCartPOST, a.requestType = 0, l.httpPost("https://" + a.host + b.replaceAll("{SESSION_ID}", g).replaceAll("{OFFER_ID}", a.oid).replaceAll("{ADDCART}", c.stockData.stockAdd[a.domainId]).replaceAll("{ASIN}", a.asin), e.replaceAll("{SESSION_ID}", g).replaceAll("{OFFER_ID}", a.oid).replaceAll("{ADDCART}", c.stockData.stockAdd[a.domainId]).replaceAll("{ASIN}", a.asin), function(b) {
                      var e = decodeURIComponent(a.oid).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), k = b.match(new RegExp(c.stockData.stock)), g = b.match(new RegExp(c.stockData.stockAlt)), E = b.match(new RegExp(c.stockData.stockAlt2.replaceAll("{ESCAPED_OID}", e))), l = b.match(new RegExp(c.stockData.price)), f = b.match(new RegExp(c.stockData.priceSingle.replaceAll("{ESCAPED_OID}", e)));
                      e = (new RegExp(c.stockData.limit)).test(b);
                      null == k && (k = E);
                      if (k && k[1]) {
                        b = parseInt(k[1]), k = -1, g && g[1] && (k = parseInt(g[1])), E && E[1] && (k = parseInt(E[1])), g = -1, f && 1 < f.length ? (f[1].lastIndexOf(".") == f[1].length - 2 && (f[1] += "0"), g = parseInt(f[1].replace(/[\D]/g, ""))) : l && (g = parseInt(l[1].replace(/[\D]/g, "")) / b), l = -1, 0 < k && 100 > k && b > k && (e = !0, l = k), d({stock:Math.max(b, k), orderLimit:l, limit:e, price:g});
                      } else {
                        if ((l = b.match(/automated access/)) || a.isRetry) {
                          delete c.stockSessions[a.domainId + a.asin], a.cookie = null, a.stockSession = null, a.cookies = null;
                        }
                        l ? (d({error:"Amazon stock retrieval rate limited (bot detection) of offer: " + a.asin + " id: " + a.gid + " offer: " + a.oid, errorCode:5}), console.log("stock retrieval rate limited for offer: ", a.asin + " " + a.oid + " id: " + a.gid, b.length)) : d({error:"stock retrieval failed for this offer. try reloading the page. ", errorCode:9});
                      }
                    }, !1, a.gid)) : (l.reportBug(null, "stock session issue: " + e + " " + k + " counter: " + c.counter + " c: " + JSON.stringify(a.cookies) + " " + JSON.stringify(a)), d({error:"stock session issue: " + e + " " + k, errorCode:4}));
                  }], a.callback = function() {
                    return a.queue.shift()();
                  }, c.stockSessions[a.domainId + a.asin]) {
                    a.cookies = c.stockSessions[a.domainId + a.asin], a.callback();
                  } else {
                    var e = c.stockData.zipCodes[a.domainId];
                    c.stockData.domainId == a.domainId ? (console.log("geo match"), a.requestType = 3, l.httpPost("https://" + a.host + c.stockData.addressChangeUrl, c.stockData.addressChangePOST.replace("{ZIPCODE}", e), null, !1, a.gid)) : (a.requestType = 1, l.httpGet("https://" + a.host + "/", function(b) {
                      b = b.match(new RegExp(c.stockData.csrfGeo));
                      null != b ? (a.csrf = b[1], a.requestType = 2, l.httpPost("https://" + a.host + c.stockData.setAddressUrl, c.stockData.setAddressPOST, function(b) {
                        b = b.match(new RegExp(c.stockData.csrfSetAddress));
                        null != b && (a.csrf = b[1]);
                        a.requestType = 3;
                        l.httpPost("https://" + a.host + c.stockData.addressChangeUrl, c.stockData.addressChangePOST.replace("{ZIPCODE}", e), null, !1, a.gid);
                      }, !1, a.gid)) : d({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.gid + " offer: " + a.oid, errorCode:7});
                    }, !1, a.gid));
                  }
                } else {
                  console.log("could not init stock retrieval", c.stockInit, typeof chrome.webRequest), d({error:"could not init stock retrieval", errorCode:"undefined" != typeof chrome.webRequest ? 3 : 33});
                }
              }
            }
          }
        } else {
          console.log("stock retrieval not pro"), d({error:"stock retrieval failed, not subscribed", errorCode:2});
        }
      }
    }
  }, set:function(a, d, e) {
    var b = {};
    b[a] = d;
    c.storage.set(b, e);
  }, remove:function(a, d) {
    c.storage.remove(a, d);
  }, get:function(a, d) {
    "function" != typeof d && (d = function() {
    });
    c.storage.get(a, function(a) {
      d(a);
    });
  }};
  c.contextMenu();
  var l = {quiet:!0, version:chrome.runtime.getManifest().version, browser:1, url:"https://keepa.com", testUrl:"https://test.keepa.com", getDomain:function(a) {
    switch(a) {
      case "com":
        return 1;
      case "co.uk":
        return 2;
      case "de":
        return 3;
      case "fr":
        return 4;
      case "co.jp":
        return 5;
      case "ca":
        return 6;
      case "it":
        return 8;
      case "es":
        return 9;
      case "in":
        return 10;
      case "com.mx":
        return 11;
      case "com.br":
        return 12;
      case "com.au":
        return 13;
      case "nl":
        return 14;
      default:
        return 1;
    }
  }, objectStorage:[], Guid:function() {
    var a = function(c, b, d) {
      return c.length >= b ? c : a(d + c, b, d || " ");
    }, c = function() {
      var a = (new Date).getTime();
      return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, function(b) {
        var c = (a + 16 * Math.random()) % 16 | 0;
        a = Math.floor(a / 16);
        return ("x" === b ? c : c & 7 | 8).toString(16);
      });
    };
    return {newGuid:function() {
      var e = "undefined" != typeof window.crypto.getRandomValues;
      if ("undefined" != typeof window.crypto && e) {
        e = new window.Uint16Array(16);
        window.crypto.getRandomValues(e);
        var b = "";
        for (k in e) {
          var d = e[k].toString(16);
          d = a(d, 4, "0");
          b += d;
        }
        var k = b;
      } else {
        k = c();
      }
      return k;
    }};
  }(), register:function() {
    chrome.cookies.onChanged.addListener(function(a) {
      a.removed || null == a.cookie || "keepa.com" != a.cookie.domain || "/extension" != a.cookie.path || ("token" == a.cookie.name ? C != a.cookie.value && 64 == a.cookie.value.length && (C = a.cookie.value, c.set("token", C), setTimeout(function() {
        document.location.reload(!1);
      }, 300)) : c.set(a.cookie.name, a.cookie.value));
    });
    var a = !1, d = function(d) {
      for (var b = {}, e = 0; e < d.length; b = {$jscomp$loop$prop$name$74:b.$jscomp$loop$prop$name$74}, e++) {
        b.$jscomp$loop$prop$name$74 = d[e];
        try {
          chrome.cookies.get({url:"https://keepa.com/extension", name:b.$jscomp$loop$prop$name$74}, function(b) {
            return function(d) {
              chrome.runtime.lastError && -1 < chrome.runtime.lastError.message.indexOf("No host permission") ? a || (a = !0, l.reportBug("extensionPermission restricted ### " + chrome.runtime.lastError.message)) : null != d && null != d.value && 0 < d.value.length && c.set(b.$jscomp$loop$prop$name$74, d.value);
            };
          }(b));
        } catch (k) {
          console.log(k);
        }
      }
    };
    d(f);
    chrome.cookies.get({url:"https://keepa.com/extension", name:"token"}, function(a) {
      if (null != a && 64 == a.value.length) {
        C = a.value, c.set("token", C);
      } else {
        var b = (Date.now() / 1000 | 0) + 31536E3;
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"optOut_crawl", value:"0", secure:!0, expirationDate:b});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"revealStock", value:"1", secure:!0, expirationDate:b});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxType", value:"0", secure:!0, expirationDate:b});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxOfferListing", value:"1", secure:!0, expirationDate:b});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxHorizontal", value:"0", secure:!0, expirationDate:b});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphType", value:"[1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]", secure:!0, expirationDate:b});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphRange", value:"180", secure:!0, expirationDate:b});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"overlayPriceGraph", value:"0", secure:!0, expirationDate:b});
        d(f);
        c.get("token", function(a) {
          C = (a = a.token) && 64 == a.length ? a : l.Guid.newGuid();
          chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"token", value:C, secure:!0, expirationDate:b});
        });
      }
    });
    try {
      "undefined" != typeof chrome.storage.sync && chrome.storage.sync.clear();
    } catch (e) {
    }
    window.addEventListener("message", function(a) {
      var b = a.data;
      if (b) {
        if ("string" === typeof b) {
          try {
            b = JSON.parse(b);
          } catch (Z) {
            return;
          }
        }
        if (b.log) {
          console.log(b.log);
        } else {
          var c = function() {
          };
          if (a.origin != l.url && a.origin != l.testUrl) {
            var d = v.getMessage();
            if (null != d && ("function" == typeof d.onDoneC && (c = d.onDoneC, delete d.onDoneC), "undefined" == typeof d.sent && b.sandbox && a.source == document.getElementById("keepa_data").contentWindow)) {
              if (b.sandbox == d.url) {
                v.setStatTime(40);
                try {
                  a.source.postMessage({key:"data", value:d}, "*");
                } catch (Z) {
                  v.abortJob(407), c();
                }
              } else {
                b.isUrlMsg ? (d.wasUrl = b.sandbox, v.abortJob(405)) : (a = v.getOutgoingMessage(d, b.sandbox), n.sendMessage(a)), c();
              }
            }
          }
        }
      }
    });
    u ? c.set("addonVersionFirefox", l.version) : c.set("addonVersionChrome", l.version);
    try {
      chrome.runtime.setUninstallURL("https://dyn.keepa.com/app/stats/?type=uninstall&version=" + P + "." + l.version);
    } catch (e) {
    }
    window.setTimeout(function() {
      n.initWebSocket();
    }, 2000);
  }, log:function(a) {
    c.log(a);
  }, lastBugReport:0, reportBug:function(a, d, e) {
    var b = Error();
    c.get(["token"], function(c) {
      var k = Date.now();
      if (!(12E5 > k - l.lastBugReport || /(dead object)|(Script error)|(setUninstallURL)|(File error: Corrupted)|(operation is insecure)|(\.location is null)/i.test(a))) {
        l.lastBugReport = k;
        k = "";
        var g = l.version;
        d = d || "";
        try {
          if (k = b.stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;"), !/(keepa|content)\.js/.test(k) || k.startsWith("https://www.amazon") || k.startsWith("https://smile.amazon") || k.startsWith("https://sellercentral")) {
            return;
          }
        } catch (V) {
        }
        try {
          k = k.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
        } catch (V) {
        }
        if ("object" == typeof a) {
          try {
            a = a instanceof Error ? a.toString() : JSON.stringify(a);
          } catch (V) {
          }
        }
        null == e && (e = {exception:a, additional:d, url:document.location.host, stack:k});
        e.keepaType = P;
        e.version = g;
        setTimeout(function() {
          l.httpPost("https://dyn.keepa.com/service/bugreport/?user=" + c.token + "&type=" + ba + "&version=" + g, JSON.stringify(e), null, !1);
        }, 50);
      }
    });
  }, httpGet:function(a, c, e, b) {
    var d = new XMLHttpRequest;
    c && (d.onreadystatechange = function() {
      4 == d.readyState && c.call(this, d.responseText);
    });
    d.withCredentials = e;
    d.open("GET", a, !0);
    b && d.setRequestHeader("krequestid", b);
    d.send();
  }, httpPost:function(a, c, e, b, g) {
    var d = new XMLHttpRequest;
    e && (d.onreadystatechange = function() {
      4 == d.readyState && e.call(this, d.responseText);
    });
    d.withCredentials = b;
    d.open("POST", a, !0);
    d.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    g && d.setRequestHeader("krequestid", g);
    d.send(c);
  }};
  window.addEventListener("error", function(a, c, e, b, g) {
    a = "object" === typeof a && a.srcElement && a.target ? "[object HTMLScriptElement]" == a.srcElement && "[object HTMLScriptElement]" == a.target ? "Error loading script " + JSON.stringify(a) : JSON.stringify(a) : a.toString();
    var d = "";
    b = b || 0;
    if (g && g.stack) {
      d = g.stack;
      try {
        d = g.stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
        if (!/(keepa|content)\.js/.test(d)) {
          return;
        }
        d = d.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
      } catch (Z) {
      }
    }
    a = {msg:a, url:(c || document.location.toString()) + ":" + parseInt(e || 0) + ":" + parseInt(b || 0), stack:d};
    "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(a);
    l.reportBug(null, null, a);
    return !1;
  });
  var aa = 0;
  var n = {server:["wss://dyn.keepa.com", "wss://dyn-2.keepa.com"], serverIndex:0, clearTimeout:0, webSocket:null, sendPlainMessage:function(a) {
    if (!M) {
      var c = JSON.stringify(a);
      console.log("%cOutgoing (" + c.length + "):", "color:yellow;", a);
      n.webSocket.send(pako.deflate(c));
    }
  }, sendMessage:function(a) {
    if (!M) {
      v.clearIframe();
      var c = pako.deflate(JSON.stringify(a));
      v.clearMessage();
      1 == n.webSocket.readyState && n.webSocket.send(c);
      403 == a.status && v.endSession(aa);
      g.console.clear();
    }
  }, initWebSocket:function() {
    M || c.get(["token", "optOut_crawl"], function(a) {
      var d = a.token, e = a.optOut_crawl;
      if (d && 64 == d.length) {
        var b = function() {
          if (null == n.webSocket || 1 != n.webSocket.readyState) {
            n.serverIndex %= n.server.length;
            if ("undefined" == typeof e || "undefined" == e || null == e || "null" == e) {
              e = "0";
            }
            p && (e = "1");
            "undefined" === typeof chrome.webRequest && (e = "1");
            var a = new WebSocket(n.server[n.serverIndex] + "/apps/cloud/?user=" + d + "&app=" + P + "&version=" + l.version + "&wr=" + typeof chrome.webRequest + "&optOut=" + e);
            a.binaryType = "arraybuffer";
            a.onmessage = function(a) {
              a = a.data;
              var b = null;
              a instanceof ArrayBuffer && (a = pako.inflate(a, {to:"string"}));
              try {
                b = JSON.parse(a);
              } catch (V) {
                l.reportBug(V, a);
                return;
              }
              108 != b.status && ("" == b.key ? (c.stockData.domainId = b.domainId, console.log("domainId. ", c.stockData.domainId)) : 108108 == b.timeout ? (b.stockData && (c.stockData = b.stockData, console.log("stock reveal ready")), "undefined" != typeof b.keepaBoxPlaceholder && c.set("keepaBoxPlaceholder", b.keepaBoxPlaceholder), "undefined" != typeof b.keepaBoxPlaceholderBackup && c.set("keepaBoxPlaceholderBackup", b.keepaBoxPlaceholderBackup), "undefined" != typeof b.keepaBoxPlaceholderBackupClass && 
              c.set("keepaBoxPlaceholderBackupClass", b.keepaBoxPlaceholderBackupClass), "undefined" != typeof b.keepaBoxPlaceholderAppend && c.set("keepaBoxPlaceholderAppend", b.keepaBoxPlaceholderAppend), "undefined" != typeof b.keepaBoxPlaceholderBackupAppend && c.set("keepaBoxPlaceholderBackupAppend", b.keepaBoxPlaceholderBackupAppend)) : (b.domainId && (aa = b.domainId), v.clearIframe(), v.onMessage(b)));
            };
            a.onclose = function(a) {
              setTimeout(function() {
                b();
              }, 18E4 * Math.random());
            };
            a.onerror = function(b) {
              n.serverIndex++;
              a.close();
            };
            a.onopen = function() {
              v.abortJob(414);
            };
            n.webSocket = a;
          }
        };
        b();
      }
    });
  }};
  var v = function() {
    function a(a) {
      try {
        m.stats.times.push(a), m.stats.times.push(Date.now() - m.stats.start);
      } catch (q) {
      }
    }
    function d(b, c) {
      b.sent = !0;
      a(25);
      var d = b.key, w = b.messageId;
      b = b.stats;
      try {
        var q = B[F]["session-id"];
      } catch (h) {
        q = "";
      }
      d = {key:d, messageId:w, stats:b, sessionId:q, payload:[], status:200};
      for (var e in c) {
        d[e] = c[e];
      }
      return d;
    }
    function e(b) {
      F = m.domainId;
      S = x(B);
      "object" != typeof B[F] && (B[F] = {});
      "undefined" == typeof m.headers.Accept && (m.headers.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8");
      f(b, !b.isAjax, function(c) {
        a(0);
        var w = {payload:[]};
        if (c.match(H)) {
          w.status = 403;
        } else {
          if (b.contentFilters && 0 < b.contentFilters.length) {
            for (var e in b.contentFilters) {
              var q = c.match(new RegExp(b.contentFilters[e]));
              if (q) {
                w.payload[e] = q[1].replace(/\n/g, "");
              } else {
                w.status = 305;
                w.payload[e] = c;
                break;
              }
            }
          } else {
            w.payload = [c];
          }
        }
        try {
          b.stats.times.push(3), b.stats.times.push(l.lastBugReport);
        } catch (y) {
        }
        "undefined" == typeof b.sent && (w = d(b, w), n.sendMessage(w));
      });
    }
    function b(b) {
      F = m.domainId;
      S = x(B);
      "object" != typeof B[F] && (B[F] = {});
      "undefined" == typeof m.headers.Accept && (m.headers.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8");
      a(4);
      var e = new URL(b.url), g = null;
      try {
        null != b.scrapeFilters && 0 < b.scrapeFilters.length && b.scrapeFilters[0].lager && chrome.cookies.get({url:e.origin, name:"session-id"}, function(a) {
          null == a ? g = "guest" : null != a.value && 5 < a.value.length && (g = a.value);
        });
      } catch (A) {
      }
      f(b, !b.isAjax, function(q, w) {
        a(6);
        if ("undefined" == typeof b.sent) {
          var y = {};
          try {
            for (var h = q.evaluate("//comment()", q, null, XPathResult.ANY_TYPE, null), f = h.iterateNext(), k = ""; f;) {
              k += f.textContent, f = h.iterateNext();
            }
            if (q.querySelector("body").textContent.match(H) || k.match(H)) {
              y.status = 403;
              if ("undefined" != typeof b.sent) {
                return;
              }
              y = d(b, y);
              n.sendMessage(y);
              return;
            }
          } catch (I) {
          }
          a(7);
          if (b.scrapeFilters && 0 < b.scrapeFilters.length) {
            var m = {}, A = {}, Q = {}, r = "", u = null, v = function() {
              if ("" === r) {
                y.payload = [u];
                y.scrapedData = Q;
                for (var a in A) {
                  y[a] = A[a];
                }
              } else {
                y.status = 305, y.payload = [u, r, ""];
              }
              try {
                b.stats.times.push(99), b.stats.times.push(l.lastBugReport);
              } catch (fa) {
              }
              "undefined" == typeof b.sent && (y = d(b, y), n.sendMessage(y));
            }, x = function(a, b, c) {
              var d = [];
              if (!a.selector) {
                if (!a.regExp) {
                  return r = "invalid selector, sel/regexp", !1;
                }
                d = q.querySelector("html").innerHTML.match(new RegExp(a.regExp));
                if (!d || d.length < a.reGroup) {
                  c = "regexp fail: html - " + a.name + c;
                  if (!1 === a.optional) {
                    return r = c, !1;
                  }
                  u += " // " + c;
                  return !0;
                }
                return d[a.reGroup];
              }
              var e = b.querySelectorAll(a.selector);
              0 == e.length && (e = b.querySelectorAll(a.altSelector));
              if (0 == e.length) {
                if (!0 === a.optional) {
                  return !0;
                }
                r = "selector no match: " + a.name + c;
                return !1;
              }
              if (a.parentSelector && (e = [e[0].parentNode.querySelector(a.parentSelector)], null == e[0])) {
                if (!0 === a.optional) {
                  return !0;
                }
                r = "parent selector no match: " + a.name + c;
                return !1;
              }
              if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > e.length || !1 === a.multiple && 1 < e.length)) {
                c = "selector multiple mismatch: " + a.name + c + " found: " + e.length;
                if (!1 === a.optional) {
                  return r = c, !1;
                }
                u += " // " + c;
                return !0;
              }
              if (a.isListSelector) {
                return m[a.name] = e, !0;
              }
              if (!a.attribute) {
                return r = "selector attribute undefined?: " + a.name + c, !1;
              }
              for (var g in e) {
                if (e.hasOwnProperty(g)) {
                  b = e[g];
                  if (!b) {
                    break;
                  }
                  if (a.childNode) {
                    a.childNode = Number(a.childNode);
                    b = b.childNodes;
                    if (b.length < a.childNode) {
                      c = "childNodes fail: " + b.length + " - " + a.name + c;
                      if (!1 === a.optional) {
                        return r = c, !1;
                      }
                      u += " // " + c;
                      return !0;
                    }
                    b = b[a.childNode];
                  }
                  b = "text" == a.attribute ? b.textContent : "html" == a.attribute ? b.innerHTML : b.getAttribute(a.attribute);
                  if (!b || 0 == b.length || 0 == b.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
                    c = "selector attribute null: " + a.name + c;
                    if (!1 === a.optional) {
                      return r = c, !1;
                    }
                    u += " // " + c;
                    return !0;
                  }
                  if (a.regExp) {
                    var w = b.match(new RegExp(a.regExp));
                    if (!w || w.length < a.reGroup) {
                      c = "regexp fail: " + b + " - " + a.name + c;
                      if (!1 === a.optional) {
                        return r = c, !1;
                      }
                      u += " // " + c;
                      return !0;
                    }
                    d.push("undefined" == typeof w[a.reGroup] ? w[0] : w[a.reGroup]);
                  } else {
                    d.push(b);
                  }
                  if (!a.multiple) {
                    break;
                  }
                }
              }
              return a.multiple ? d : d[0];
            };
            f = !1;
            h = {};
            for (var B in b.scrapeFilters) {
              h.$jscomp$loop$prop$pageType$79 = B;
              a: {
                if (f) {
                  break;
                }
                h.$jscomp$loop$prop$pageFilter$76 = b.scrapeFilters[h.$jscomp$loop$prop$pageType$79];
                h.$jscomp$loop$prop$pageVersionTest$77 = h.$jscomp$loop$prop$pageFilter$76.pageVersionTest;
                k = q.querySelectorAll(h.$jscomp$loop$prop$pageVersionTest$77.selector);
                0 == k.length && (k = q.querySelectorAll(h.$jscomp$loop$prop$pageVersionTest$77.altSelector));
                if (0 != k.length) {
                  if ("undefined" != typeof h.$jscomp$loop$prop$pageVersionTest$77.multiple && null != h.$jscomp$loop$prop$pageVersionTest$77.multiple) {
                    if (!0 === h.$jscomp$loop$prop$pageVersionTest$77.multiple && 2 > k.length) {
                      break a;
                    }
                    if (!1 === h.$jscomp$loop$prop$pageVersionTest$77.multiple && 1 < k.length) {
                      break a;
                    }
                  }
                  if (h.$jscomp$loop$prop$pageVersionTest$77.attribute) {
                    var C = null;
                    C = "text" == h.$jscomp$loop$prop$pageVersionTest$77.attribute ? "" : k[0].getAttribute(h.$jscomp$loop$prop$pageVersionTest$77.attribute);
                    if (null == C) {
                      break a;
                    }
                  }
                  var D = h.$jscomp$loop$prop$pageType$79;
                  h.$jscomp$loop$prop$revealMAP$96 = h.$jscomp$loop$prop$pageFilter$76.revealMAP;
                  h.$jscomp$loop$prop$revealed$98 = !1;
                  h.$jscomp$loop$prop$afterAjaxFinished$99 = function(d) {
                    return function() {
                      var w = 0, h = [];
                      a(26);
                      var f = {}, k;
                      for (k in d.$jscomp$loop$prop$pageFilter$76) {
                        f.$jscomp$loop$prop$sel$85 = d.$jscomp$loop$prop$pageFilter$76[k];
                        if (!(f.$jscomp$loop$prop$sel$85.name == d.$jscomp$loop$prop$pageVersionTest$77.name || d.$jscomp$loop$prop$revealed$98 && "revealMAP" == f.$jscomp$loop$prop$sel$85.name)) {
                          var l = q;
                          if (f.$jscomp$loop$prop$sel$85.parentList) {
                            var r = [];
                            if ("undefined" != typeof m[f.$jscomp$loop$prop$sel$85.parentList]) {
                              r = m[f.$jscomp$loop$prop$sel$85.parentList];
                            } else {
                              if (!0 === x(d.$jscomp$loop$prop$pageFilter$76[f.$jscomp$loop$prop$sel$85.parentList], l, d.$jscomp$loop$prop$pageType$79)) {
                                r = m[f.$jscomp$loop$prop$sel$85.parentList];
                              } else {
                                break;
                              }
                            }
                            A[f.$jscomp$loop$prop$sel$85.parentList] || (A[f.$jscomp$loop$prop$sel$85.parentList] = []);
                            l = 0;
                            var t = {}, n;
                            for (n in r) {
                              if (r.hasOwnProperty(n)) {
                                if ("lager" == f.$jscomp$loop$prop$sel$85.name) {
                                  l++;
                                  try {
                                    var z = void 0;
                                    t.$jscomp$loop$prop$offerId$82 = void 0;
                                    f.$jscomp$loop$prop$sel$85.selector && (z = r[n].querySelector(f.$jscomp$loop$prop$sel$85.selector));
                                    f.$jscomp$loop$prop$sel$85.altSelector && (t.$jscomp$loop$prop$offerId$82 = r[n].querySelector(f.$jscomp$loop$prop$sel$85.altSelector));
                                    t.$jscomp$loop$prop$offerId$82 && (t.$jscomp$loop$prop$offerId$82 = t.$jscomp$loop$prop$offerId$82.getAttribute(f.$jscomp$loop$prop$sel$85.attribute));
                                    t.$jscomp$loop$prop$maxQty$83 = 999;
                                    if (!t.$jscomp$loop$prop$offerId$82) {
                                      try {
                                        var I = JSON.parse(f.$jscomp$loop$prop$sel$85.regExp);
                                        if (I.sel1) {
                                          try {
                                            var B = JSON.parse(r[n].querySelectorAll(I.sel1)[0].dataset[I.dataSet1]);
                                            t.$jscomp$loop$prop$offerId$82 = B[I.val1];
                                            t.$jscomp$loop$prop$maxQty$83 = B.maxQty;
                                          } catch (T) {
                                          }
                                        }
                                        if (!t.$jscomp$loop$prop$offerId$82 && I.sel2) {
                                          try {
                                            var C = JSON.parse(r[n].querySelectorAll(I.sel2)[0].dataset[I.dataSet2]);
                                            t.$jscomp$loop$prop$offerId$82 = C[I.val2];
                                            t.$jscomp$loop$prop$maxQty$83 = C.maxQty;
                                          } catch (T) {
                                          }
                                        }
                                      } catch (T) {
                                      }
                                    }
                                    if (z && t.$jscomp$loop$prop$offerId$82 && null != g) {
                                      w++;
                                      t.$jscomp$loop$prop$mapIndex$88 = n + "";
                                      t.$jscomp$loop$prop$isMAP$86 = !1;
                                      try {
                                        t.$jscomp$loop$prop$isMAP$86 = A[f.$jscomp$loop$prop$sel$85.parentList][t.$jscomp$loop$prop$mapIndex$88].isMAP || -1 != r[n].textContent.toLowerCase().indexOf("add to cart to see product details.");
                                      } catch (T) {
                                      }
                                      t.$jscomp$loop$prop$busy$87 = !0;
                                      t.$jscomp$loop$prop$currentASIN$81 = b.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                                      null == t.$jscomp$loop$prop$currentASIN$81 || 9 > t.$jscomp$loop$prop$currentASIN$81.length || setTimeout(function(a, d) {
                                        return function() {
                                          c.addStockJob({type:"getStock", asin:a.$jscomp$loop$prop$currentASIN$81, oid:a.$jscomp$loop$prop$offerId$82, host:e.host, maxQty:a.$jscomp$loop$prop$maxQty$83, onlyMaxQty:9 == d.$jscomp$loop$prop$sel$85.reGroup, isMAP:a.$jscomp$loop$prop$isMAP$86, referer:e.host + "/dp/" + a.$jscomp$loop$prop$currentASIN$81, domainId:b.domainId, force:!0, session:g}, function(b) {
                                            a.$jscomp$loop$prop$busy$87 && (a.$jscomp$loop$prop$busy$87 = !1, "undefined" != typeof b && (A[d.$jscomp$loop$prop$sel$85.parentList][a.$jscomp$loop$prop$mapIndex$88][d.$jscomp$loop$prop$sel$85.name] = b), 0 == --w && v(y));
                                          });
                                          setTimeout(function() {
                                            a.$jscomp$loop$prop$busy$87 && 0 == --w && (a.$jscomp$loop$prop$busy$87 = !1, console.log("timeout " + a.$jscomp$loop$prop$offerId$82), v(y));
                                          }, 2000 + 1000 * w);
                                        };
                                      }(t, f), 1);
                                    }
                                  } catch (T) {
                                  }
                                } else {
                                  if ("revealMAP" == f.$jscomp$loop$prop$sel$85.name) {
                                    if (t.$jscomp$loop$prop$revealMAP$46$89 = f.$jscomp$loop$prop$sel$85, z = void 0, z = t.$jscomp$loop$prop$revealMAP$46$89.selector ? r[n].querySelector(t.$jscomp$loop$prop$revealMAP$46$89.selector) : r[n], null != z && z.textContent.match(new RegExp(t.$jscomp$loop$prop$revealMAP$46$89.regExp))) {
                                      z = b.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                                      var L = d.$jscomp$loop$prop$pageFilter$76.sellerId;
                                      "undefined" == typeof L || null == L || null == z || 2 > z.length || (L = r[n].querySelector(f.$jscomp$loop$prop$sel$85.childNode).value, null == L || 20 > L + 0 || (z = t.$jscomp$loop$prop$revealMAP$46$89.altSelector.replace("OFFERID", L).replace("ASINID", z), w++, t.$jscomp$loop$prop$mapIndex$49$90 = n + "", p(z, "GET", null, 3000, function(a) {
                                        return function(b) {
                                          try {
                                            var c = d.$jscomp$loop$prop$pageFilter$76.price;
                                            if (c && c.regExp) {
                                              if (b.match(/no valid offer--/)) {
                                                A[a.$jscomp$loop$prop$revealMAP$46$89.parentList][a.$jscomp$loop$prop$mapIndex$49$90] || (A[a.$jscomp$loop$prop$revealMAP$46$89.parentList][a.$jscomp$loop$prop$mapIndex$49$90] = {}), A[a.$jscomp$loop$prop$revealMAP$46$89.parentList][a.$jscomp$loop$prop$mapIndex$49$90][a.$jscomp$loop$prop$revealMAP$46$89.name] = -1;
                                              } else {
                                                var f = b.match(new RegExp("price info--\x3e(?:.|\\n)*?" + c.regExp + "(?:.|\\n)*?\x3c!--")), e = b.match(/price info--\x3e(?:.|\n)*?(?:<span.*?size-small.*?">)([^]*?<\/span)(?:.|\n)*?\x3c!--/);
                                                if (!f || f.length < c.reGroup) {
                                                  u += " //  priceMAP regexp fail: " + (b + " - " + c.name + d.$jscomp$loop$prop$pageType$79);
                                                } else {
                                                  var q = f[c.reGroup];
                                                  A[a.$jscomp$loop$prop$revealMAP$46$89.parentList][a.$jscomp$loop$prop$mapIndex$49$90] || (A[a.$jscomp$loop$prop$revealMAP$46$89.parentList][a.$jscomp$loop$prop$mapIndex$49$90] = {});
                                                  A[a.$jscomp$loop$prop$revealMAP$46$89.parentList][a.$jscomp$loop$prop$mapIndex$49$90][a.$jscomp$loop$prop$revealMAP$46$89.name] = q;
                                                  null != e && 2 == e.length && (A[a.$jscomp$loop$prop$revealMAP$46$89.parentList][a.$jscomp$loop$prop$mapIndex$49$90][a.$jscomp$loop$prop$revealMAP$46$89.name + "Shipping"] = e[1].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                                }
                                              }
                                            }
                                          } catch (ha) {
                                          }
                                          0 == --w && 0 == h.length && v();
                                        };
                                      }(t), function() {
                                        0 == --w && 0 == h.length && v();
                                      })));
                                    }
                                  } else {
                                    z = x(f.$jscomp$loop$prop$sel$85, r[n], d.$jscomp$loop$prop$pageType$79);
                                    if (!1 === z) {
                                      break;
                                    }
                                    if (!0 !== z) {
                                      if (A[f.$jscomp$loop$prop$sel$85.parentList][n] || (A[f.$jscomp$loop$prop$sel$85.parentList][n] = {}), f.$jscomp$loop$prop$sel$85.multiple) {
                                        for (var D in z) {
                                          z.hasOwnProperty(D) && !f.$jscomp$loop$prop$sel$85.keepBR && (z[D] = z[D].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                        }
                                        z = z.join("\u271c\u271c");
                                        A[f.$jscomp$loop$prop$sel$85.parentList][n][f.$jscomp$loop$prop$sel$85.name] = z;
                                      } else {
                                        A[f.$jscomp$loop$prop$sel$85.parentList][n][f.$jscomp$loop$prop$sel$85.name] = f.$jscomp$loop$prop$sel$85.keepBR ? z : z.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                                      }
                                    }
                                  }
                                }
                              }
                              t = {$jscomp$loop$prop$currentASIN$81:t.$jscomp$loop$prop$currentASIN$81, $jscomp$loop$prop$offerId$82:t.$jscomp$loop$prop$offerId$82, $jscomp$loop$prop$maxQty$83:t.$jscomp$loop$prop$maxQty$83, $jscomp$loop$prop$isMAP$86:t.$jscomp$loop$prop$isMAP$86, $jscomp$loop$prop$busy$87:t.$jscomp$loop$prop$busy$87, $jscomp$loop$prop$mapIndex$88:t.$jscomp$loop$prop$mapIndex$88, $jscomp$loop$prop$revealMAP$46$89:t.$jscomp$loop$prop$revealMAP$46$89, $jscomp$loop$prop$mapIndex$49$90:t.$jscomp$loop$prop$mapIndex$49$90};
                            }
                          } else {
                            r = x(f.$jscomp$loop$prop$sel$85, l, d.$jscomp$loop$prop$pageType$79);
                            if (!1 === r) {
                              break;
                            }
                            if (!0 !== r) {
                              if (f.$jscomp$loop$prop$sel$85.multiple) {
                                for (var E in r) {
                                  r.hasOwnProperty(E) && !f.$jscomp$loop$prop$sel$85.keepBR && (r[E] = r[E].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                }
                                r = r.join();
                              } else {
                                f.$jscomp$loop$prop$sel$85.keepBR || (r = r.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                              }
                              Q[f.$jscomp$loop$prop$sel$85.name] = r;
                            }
                          }
                        }
                        f = {$jscomp$loop$prop$sel$85:f.$jscomp$loop$prop$sel$85};
                      }
                      try {
                        if (1 == h.length || "500".endsWith("8") && 0 < h.length) {
                          h.shift()();
                        } else {
                          for (f = 0; f < h.length; f++) {
                            setTimeout(function() {
                              0 < h.length && h.shift()();
                            }, 500 * f);
                          }
                        }
                      } catch (T) {
                      }
                      0 == w && 0 == h.length && v();
                    };
                  }(h);
                  if (h.$jscomp$loop$prop$revealMAP$96) {
                    if (f = q.querySelector(h.$jscomp$loop$prop$revealMAP$96.selector), null != f) {
                      h.$jscomp$loop$prop$url$97 = f.getAttribute(h.$jscomp$loop$prop$revealMAP$96.attribute);
                      if (null == h.$jscomp$loop$prop$url$97 || 0 == h.$jscomp$loop$prop$url$97.length) {
                        h.$jscomp$loop$prop$afterAjaxFinished$99();
                        break;
                      }
                      0 != h.$jscomp$loop$prop$url$97.indexOf("http") && (f = document.createElement("a"), f.href = b.url, h.$jscomp$loop$prop$url$97 = f.origin + h.$jscomp$loop$prop$url$97);
                      Q[h.$jscomp$loop$prop$revealMAP$96.name] = "1";
                      h.$jscomp$loop$prop$url$97 = h.$jscomp$loop$prop$url$97.replace(/(mapPopover.*?)(false)/, "$1true");
                      h.$jscomp$loop$prop$xhr$94 = new XMLHttpRequest;
                      h.$jscomp$loop$prop$hasTimeout$93 = !1;
                      h.$jscomp$loop$prop$ti$95 = setTimeout(function(a) {
                        return function() {
                          a.$jscomp$loop$prop$hasTimeout$93 = !0;
                          a.$jscomp$loop$prop$afterAjaxFinished$99();
                        };
                      }(h), 4000);
                      h.$jscomp$loop$prop$xhr$94.onreadystatechange = function(a) {
                        return function() {
                          if (!a.$jscomp$loop$prop$hasTimeout$93 && 4 == a.$jscomp$loop$prop$xhr$94.readyState) {
                            clearTimeout(a.$jscomp$loop$prop$ti$95);
                            if (200 == a.$jscomp$loop$prop$xhr$94.status) {
                              var b = a.$jscomp$loop$prop$xhr$94.responseText;
                              if (a.$jscomp$loop$prop$revealMAP$96.regExp) {
                                var c = b.match(new RegExp(a.$jscomp$loop$prop$revealMAP$96.regExp));
                                if (!c || c.length < a.$jscomp$loop$prop$revealMAP$96.reGroup) {
                                  if (c = q.querySelector(a.$jscomp$loop$prop$revealMAP$96.selector)) {
                                    var d = c.cloneNode(!1);
                                    d.innerHTML = b;
                                    c.parentNode.replaceChild(d, c);
                                  }
                                } else {
                                  Q[a.$jscomp$loop$prop$revealMAP$96.name] = c[a.$jscomp$loop$prop$revealMAP$96.reGroup], Q[a.$jscomp$loop$prop$revealMAP$96.name + "url"] = a.$jscomp$loop$prop$url$97;
                                }
                              }
                            }
                            a.$jscomp$loop$prop$revealed$98 = !0;
                            a.$jscomp$loop$prop$afterAjaxFinished$99();
                          }
                        };
                      }(h);
                      h.$jscomp$loop$prop$xhr$94.onerror = h.$jscomp$loop$prop$afterAjaxFinished$99;
                      h.$jscomp$loop$prop$xhr$94.open("GET", h.$jscomp$loop$prop$url$97, !0);
                      h.$jscomp$loop$prop$xhr$94.send();
                    } else {
                      h.$jscomp$loop$prop$afterAjaxFinished$99();
                    }
                  } else {
                    h.$jscomp$loop$prop$afterAjaxFinished$99();
                  }
                  f = !0;
                }
              }
              h = {$jscomp$loop$prop$pageFilter$76:h.$jscomp$loop$prop$pageFilter$76, $jscomp$loop$prop$pageVersionTest$77:h.$jscomp$loop$prop$pageVersionTest$77, $jscomp$loop$prop$revealed$98:h.$jscomp$loop$prop$revealed$98, $jscomp$loop$prop$pageType$79:h.$jscomp$loop$prop$pageType$79, $jscomp$loop$prop$hasTimeout$93:h.$jscomp$loop$prop$hasTimeout$93, $jscomp$loop$prop$afterAjaxFinished$99:h.$jscomp$loop$prop$afterAjaxFinished$99, $jscomp$loop$prop$xhr$94:h.$jscomp$loop$prop$xhr$94, $jscomp$loop$prop$ti$95:h.$jscomp$loop$prop$ti$95, 
              $jscomp$loop$prop$revealMAP$96:h.$jscomp$loop$prop$revealMAP$96, $jscomp$loop$prop$url$97:h.$jscomp$loop$prop$url$97};
            }
            a(8);
            if (null == D) {
              r += " // no pageVersion matched";
              y.payload = [u, r, b.dbg1 ? w : ""];
              y.status = 308;
              a(10);
              try {
                b.stats.times.push(99), b.stats.times.push(l.lastBugReport);
              } catch (I) {
              }
              "undefined" == typeof b.sent && (y = d(b, y), n.sendMessage(y));
            }
          } else {
            a(9), y.status = 306, "undefined" == typeof b.sent && (y = d(b, y), n.sendMessage(y));
          }
        }
      });
    }
    function f(b, c, d) {
      if (null != N && !J) {
        J = !0;
        for (var f = 1; f < N.length; f++) {
          var e = N[f];
          try {
            for (var q = window, h = 0; h < e.path.length - 1; h++) {
              q = q[e.path[h]];
            }
            if (e.b) {
              q[e.path[h]](R[e.index], e.a, e.b);
            } else {
              q[e.path[h]](R[e.index], e.a);
            }
          } catch (L) {
          }
        }
        g.console.clear();
      }
      K = b;
      var w = b.messageId;
      setTimeout(function() {
        null != K && K.messageId == w && (K = K = null);
      }, b.timeout);
      b.onDoneC = function() {
        K = null;
      };
      if (c) {
        a(11), c = document.getElementById("keepa_data"), c.removeAttribute("srcdoc"), c.src = b.url;
      } else {
        if (1 == b.httpMethod && (b.scrapeFilters && 0 < b.scrapeFilters.length && (G = b), !M && (M = !0, b.l && 0 < b.l.length))) {
          N = b.l;
          J = !0;
          for (c = 0; c < b.l.length; c++) {
            f = b.l[c];
            try {
              e = window;
              for (q = 0; q < f.path.length - 1; q++) {
                e = e[f.path[q]];
              }
              if (f.b) {
                e[f.path[q]](R[f.index], f.a, f.b);
              } else {
                e[f.path[q]](R[f.index], f.a);
              }
            } catch (L) {
            }
          }
          g.console.clear();
        }
        p(b.url, P[b.httpMethod], b.postData, b.timeout, function(c) {
          a(12);
          if ("o0" == b.key) {
            d(c);
          } else {
            var e = document.getElementById("keepa_data_2");
            e.src = "";
            c = c.replace(/src=".*?"/g, 'src=""');
            if (null != m) {
              m.block && (c = c.replace(new RegExp(m.block, "g"), ""));
              a(13);
              var f = !1;
              e.srcdoc = c;
              a(18);
              e.onload = function() {
                a(19);
                f || (e.onload = void 0, f = !0, a(20), setTimeout(function() {
                  a(21);
                  var b = document.getElementById("keepa_data_2").contentWindow;
                  try {
                    d(b.document, c);
                  } catch (ca) {
                    l.reportBug(ca), D(410);
                  }
                }, 80));
              };
            }
            g.console.clear();
          }
        });
      }
    }
    function k() {
      try {
        var a = document.getElementById("keepa_data");
        a.src = "";
        a.removeAttribute("srcdoc");
      } catch (r) {
      }
      try {
        var b = document.getElementById("keepa_data_2");
        b.src = "";
        b.removeAttribute("srcdoc");
      } catch (r) {
      }
      K = null;
    }
    function p(b, c, d, e, f) {
      var q = new XMLHttpRequest;
      if (f) {
        var g = !1, w = setTimeout(function() {
          g = !0;
          v.abortJob(413);
        }, e || 15000);
        q.onreadystatechange = function() {
          g || (2 == q.readyState && a(27), 4 == q.readyState && (clearTimeout(w), a(29), 503 != q.status && (0 == q.status || 399 < q.status) ? v.abortJob(415, [q.status]) : 0 == q.responseText.length && c == P[0] ? v.abortJob(416) : f.call(this, q.responseText)));
        };
        q.onerror = function() {
          v.abortJob(408);
        };
      }
      q.open(c, b, !0);
      null == d ? q.send() : q.send(d);
    }
    function x(a) {
      var b = "", c = "", d;
      for (d in a[F]) {
        var e = a[F][d];
        "-" != e && (b += c + d + "=" + e + ";", c = " ");
      }
      return b;
    }
    function C(a) {
      delete B["" + a];
      localStorage.cache = pako.deflate(JSON.stringify(B), {to:"string"});
    }
    function D(a, b) {
      if (null != m) {
        try {
          if ("undefined" != typeof m.sent) {
            return;
          }
          var c = d(m, {});
          b && (c.payload = b);
          c.status = a;
          n.sendMessage(c);
          k();
        } catch (A) {
          l.reportBug(A, "abort");
        }
      }
      g.console.clear();
    }
    var G = null, m = null, H = /automated access/, R = [function(a) {
    }, function(a) {
      if (null != m) {
        var b = !0;
        if (m.url == a.url) {
          O = a.frameId, U = a.tabId, W = a.parentFrameId, b = !1;
        } else {
          if (O == a.parentFrameId || W == a.parentFrameId || O == a.frameId) {
            b = !1;
          }
        }
        if (-2 != O && U == a.tabId) {
          a = a.requestHeaders;
          var c = {};
          if (!a.find(function(a) {
            return "krequestid" === a.name;
          })) {
            "" === m.headers.Cookie && (b = !0);
            (m.timeout + "").endsWith("108") || (m.headers.Cookie = b ? "" : S);
            for (var d in m.headers) {
              b = !1;
              for (var e = 0; e < a.length; ++e) {
                if (a[e].name.toLowerCase() == d.toLowerCase()) {
                  "" == m.headers[d] ? (a.splice(e, 1), e--) : a[e].value = m.headers[d];
                  b = !0;
                  break;
                }
              }
              b || "" == m.headers[d] || a.push({name:u ? d.toLowerCase() : d, value:m.headers[d]});
            }
            c.requestHeaders = a;
            return c;
          }
        }
      }
    }, function(a) {
      var b = a.responseHeaders;
      try {
        if (U != a.tabId || null == m || b.find(function(a) {
          return "krequestid" === a.name;
        })) {
          return;
        }
        for (var d = (m.timeout + "").endsWith("108"), e = !1, f = [], g = 0; g < b.length; g++) {
          var h = b[g], l = h.name.toLowerCase();
          "set-cookie" == l ? (-1 < h.value.indexOf("xpires") && c.parseCookieHeader(f, h.value), d || b.splice(g--, 1)) : "x-frame-options" == l && (b.splice(g, 1), g--);
        }
        for (g = 0; g < f.length; g++) {
          var k = f[g];
          if ("undefined" == typeof B[F][k[0]] || B[F][k[0]] != k[1]) {
            e = !0, B[F][k[0]] = k[1];
          }
        }
        !d && e && m.url == a.url && (localStorage.cache = pako.deflate(JSON.stringify(B), {to:"string"}), S = x(B));
      } catch (ea) {
      }
      return {responseHeaders:b};
    }, function(a) {
      if (null != m && m.url == a.url) {
        var b = 0;
        switch(a.error) {
          case "net::ERR_TUNNEL_CONNECTION_FAILED":
            b = 510;
            break;
          case "net::ERR_INSECURE_RESPONSE":
            b = 511;
            break;
          case "net::ERR_CONNECTION_REFUSED":
            b = 512;
            break;
          case "net::ERR_BAD_SSL_CLIENT_AUTH_CERT":
            b = 513;
            break;
          case "net::ERR_CONNECTION_CLOSED":
            b = 514;
            break;
          case "net::ERR_NAME_NOT_RESOLVED":
            b = 515;
            break;
          case "net::ERR_NAME_RESOLUTION_FAILED":
            b = 516;
            break;
          case "net::ERR_ABORTED":
          case "net::ERR_CONNECTION_ABORTED":
            b = 517;
            break;
          case "net::ERR_CONTENT_DECODING_FAILED":
            b = 518;
            break;
          case "net::ERR_NETWORK_ACCESS_DENIED":
            b = 519;
            break;
          case "net::ERR_NETWORK_CHANGED":
            b = 520;
            break;
          case "net::ERR_INCOMPLETE_CHUNKED_ENCODING":
            b = 521;
            break;
          case "net::ERR_CONNECTION_TIMED_OUT":
          case "net::ERR_TIMED_OUT":
            b = 522;
            break;
          case "net::ERR_CONNECTION_RESET":
            b = 523;
            break;
          case "net::ERR_NETWORK_IO_SUSPENDED":
            b = 524;
            break;
          case "net::ERR_EMPTY_RESPONSE":
            b = 525;
            break;
          case "net::ERR_SSL_PROTOCOL_ERROR":
            b = 526;
            break;
          case "net::ERR_ADDRESS_UNREACHABLE":
            b = 527;
            break;
          case "net::ERR_INTERNET_DISCONNECTED":
            b = 528;
            break;
          case "net::ERR_BLOCKED_BY_ADMINISTRATOR":
            b = 529;
            break;
          case "net::ERR_SSL_VERSION_OR_CIPHER_MISMATCH":
            b = 530;
            break;
          case "net::ERR_CONTENT_LENGTH_MISMATCH":
            b = 531;
            break;
          case "net::ERR_PROXY_CONNECTION_FAILED":
            b = 532;
            break;
          default:
            b = 533;
            return;
        }
        setTimeout(function() {
          v.setStatTime(33);
          v.abortJob(b);
        }, 0);
      }
    }], M = !1, J = !1, N = null, K = null, P = ["GET", "HEAD", "POST", "PUT", "DELETE"], B = {}, S = "", F = 1;
    try {
      localStorage.cache && (B = JSON.parse(pako.inflate(localStorage.cache, {to:"string"})));
    } catch (w) {
      setTimeout(function() {
        l.reportBug(w, pako.inflate(localStorage.cache, {to:"string"}));
      }, 2000);
    }
    var O = -2, U = -2, W = -2;
    return {onMessage:function(a) {
      "hhhh" == a.key && chrome.webRequest.onBeforeSendHeaders.addListener(function(a) {
        if (null != m) {
          var b = !0;
          m.url == a.url && (O = a.frameId, U = a.tabId, W = a.parentFrameId, b = !1);
          if (-2 != O && O == a.frameId && U == a.tabId && W == a.parentFrameId) {
            a = a.requestHeaders;
            var c = {};
            (m.timeout + "").endsWith("108") || (m.headers.Cookie = b ? "" : S);
            for (var d in m.headers) {
              b = !1;
              for (var e = 0; e < a.length; ++e) {
                if (a[e].name.toLowerCase() == d.toLowerCase()) {
                  "" == m.headers[d] ? a.splice(e, 1) : a[e].value = m.headers[d];
                  b = !0;
                  break;
                }
              }
              b || "" == m.headers[d] || a.push({name:u ? d.toLowerCase() : d, value:m.headers[d]});
            }
            c.requestHeaders = a;
            return c;
          }
        }
      }, {urls:["<all_urls>"]}, ["blocking", "requestHeaders"]);
      switch(a.key) {
        case "o0":
        case "o1":
          m = a, m.stats = {start:Date.now(), times:[]};
      }
      switch(a.key) {
        case "update":
          chrome.runtime.requestUpdateCheck(function(a, b) {
            "update_available" == a && chrome.runtime.reload();
          });
          break;
        case "o0":
          v.clearIframe();
          e(a);
          break;
        case "o1":
          v.clearIframe();
          b(a);
          break;
        case "o2":
          C(a.domainId);
          break;
        case "1":
          document.location.reload(!1);
      }
    }, clearIframe:k, endSession:C, getOutgoingMessage:d, setStatTime:a, getFilters:function() {
      return G;
    }, getMessage:function() {
      return m;
    }, clearMessage:function() {
      m = null;
      if (null != N && J) {
        J = !1;
        for (var a = 1; a < N.length; a++) {
          var b = N[a];
          try {
            for (var c = window, d = 0; d < b.path.length - 1; d++) {
              c = c[b.path[d]];
            }
            c.removeListener(R[b.index]);
          } catch (Q) {
          }
        }
        g.console.clear();
      }
    }, abortJob:D};
  }();
})();

