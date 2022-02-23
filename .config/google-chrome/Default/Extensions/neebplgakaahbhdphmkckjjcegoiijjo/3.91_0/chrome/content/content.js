var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(c) {
  var p = 0;
  return function() {
    return p < c.length ? {done:!1, value:c[p++]} : {done:!0};
  };
};
$jscomp.arrayIterator = function(c) {
  return {next:$jscomp.arrayIteratorImpl(c)};
};
$jscomp.makeIterator = function(c) {
  var p = "undefined" != typeof Symbol && Symbol.iterator && c[Symbol.iterator];
  return p ? p.call(c) : $jscomp.arrayIterator(c);
};
$jscomp.arrayFromIterator = function(c) {
  for (var p, f = []; !(p = c.next()).done;) {
    f.push(p.value);
  }
  return f;
};
$jscomp.arrayFromIterable = function(c) {
  return c instanceof Array ? c : $jscomp.arrayFromIterator($jscomp.makeIterator(c));
};
$jscomp.checkStringArgs = function(c, p, f) {
  if (null == c) {
    throw new TypeError("The 'this' value for String.prototype." + f + " must not be null or undefined");
  }
  if (p instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + f + " must not be a regular expression");
  }
  return c + "";
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(c, p, f) {
  c != Array.prototype && c != Object.prototype && (c[p] = f.value);
};
$jscomp.getGlobal = function(c) {
  return "undefined" != typeof window && window === c ? c : "undefined" != typeof global && null != global ? global : c;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(c, p, f, l) {
  if (p) {
    f = $jscomp.global;
    c = c.split(".");
    for (l = 0; l < c.length - 1; l++) {
      var t = c[l];
      t in f || (f[t] = {});
      f = f[t];
    }
    c = c[c.length - 1];
    l = f[c];
    p = p(l);
    p != l && null != p && $jscomp.defineProperty(f, c, {configurable:!0, writable:!0, value:p});
  }
};
$jscomp.polyfill("String.prototype.startsWith", function(c) {
  return c ? c : function(c, f) {
    var l = $jscomp.checkStringArgs(this, c, "startsWith");
    c += "";
    var p = l.length, q = c.length;
    f = Math.max(0, Math.min(f | 0, l.length));
    for (var G = 0; G < q && f < p;) {
      if (l[f++] != c[G++]) {
        return !1;
      }
    }
    return G >= q;
  };
}, "es6", "es3");
$jscomp.owns = function(c, p) {
  return Object.prototype.hasOwnProperty.call(c, p);
};
$jscomp.assign = "function" == typeof Object.assign ? Object.assign : function(c, p) {
  for (var f = 1; f < arguments.length; f++) {
    var l = arguments[f];
    if (l) {
      for (var t in l) {
        $jscomp.owns(l, t) && (c[t] = l[t]);
      }
    }
  }
  return c;
};
$jscomp.polyfill("Object.assign", function(c) {
  return c || $jscomp.assign;
}, "es6", "es3");
$jscomp.polyfill("Object.is", function(c) {
  return c ? c : function(c, f) {
    return c === f ? 0 !== c || 1 / c === 1 / f : c !== c && f !== f;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.includes", function(c) {
  return c ? c : function(c, f) {
    var l = this;
    l instanceof String && (l = String(l));
    var p = l.length;
    f = f || 0;
    for (0 > f && (f = Math.max(f + p, 0)); f < p; f++) {
      var q = l[f];
      if (q === c || Object.is(q, c)) {
        return !0;
      }
    }
    return !1;
  };
}, "es7", "es3");
$jscomp.polyfill("String.prototype.includes", function(c) {
  return c ? c : function(c, f) {
    return -1 !== $jscomp.checkStringArgs(this, c, "includes").indexOf(c, f || 0);
  };
}, "es6", "es3");
var onlyStock = !1, isDiscuss = (document.location + "").startsWith("https://discuss.keepa.com"), scanner = function() {
  function c(c, f, q, p, H, B) {
    var l = new XMLHttpRequest, t = !1, g = setTimeout(function() {
      t = !0;
      B();
    }, p || 4000);
    l.onreadystatechange = function() {
      t || (clearTimeout(g), H(l));
    };
    l.onerror = B;
    l.open(f, c, !0);
    null == q ? l.send() : l.send(q);
  }
  function p(l, f) {
    var q = {};
    if (null == document.body) {
      q.status = 599, f(q);
    } else {
      if (document.body.textContent.match("you're not a robot")) {
        q.status = 403, f(q);
      } else {
        for (var p = document.evaluate("//comment()", document, null, XPathResult.ANY_TYPE, null), t = p.iterateNext(), B = ""; t;) {
          B += t, t = p.iterateNext();
        }
        if (B.match(/automated access/)) {
          q.status = 403, f(q);
        } else {
          if (B.match(/ref=cs_503_link/)) {
            q.status = 503, f(q);
          } else {
            var C = 0;
            if (l.scrapeFilters && 0 < l.scrapeFilters.length) {
              p = {};
              t = null;
              var z = "", g = null, y = {}, v = {}, I = !1, w = function(a, b, h) {
                var k = [];
                if (!a.selector) {
                  if (!a.regExp) {
                    return z = "invalid selector, sel/regexp", !1;
                  }
                  var d = document.getElementsByTagName("html")[0].innerHTML.match(new RegExp(a.regExp, "i"));
                  if (!d || d.length < a.reGroup) {
                    d = "regexp fail: html - " + a.name + h;
                    if (!1 === a.optional) {
                      return z = d, !1;
                    }
                    g += " // " + d;
                    return !0;
                  }
                  return d[a.reGroup];
                }
                d = b.querySelectorAll(a.selector);
                0 == d.length && (d = b.querySelectorAll(a.altSelector));
                if (0 == d.length) {
                  if (!0 === a.optional) {
                    return !0;
                  }
                  z = "selector no match: " + a.name + h;
                  return !1;
                }
                if (a.parentSelector && (d = [d[0].parentNode.querySelector(a.parentSelector)], null == d[0])) {
                  if (!0 === a.optional) {
                    return !0;
                  }
                  z = "parent selector no match: " + a.name + h;
                  return !1;
                }
                if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > d.length || !1 === a.multiple && 1 < d.length)) {
                  if (!I) {
                    return I = !0, w(a, b, h);
                  }
                  h = "selector multiple mismatch: " + a.name + h + " found: " + d.length;
                  if (!1 === a.optional) {
                    a = "";
                    for (var e in d) {
                      !d.hasOwnProperty(e) || 1000 < a.length || (a += " - " + e + ": " + d[e].outerHTML + " " + d[e].getAttribute("class") + " " + d[e].getAttribute("id"));
                    }
                    z = h + a + " el: " + b.getAttribute("class") + " " + b.getAttribute("id");
                    return !1;
                  }
                  g += " // " + h;
                  return !0;
                }
                if (a.isListSelector) {
                  return y[a.name] = d, !0;
                }
                if (!a.attribute) {
                  return z = "selector attribute undefined?: " + a.name + h, !1;
                }
                for (var n in d) {
                  if (d.hasOwnProperty(n)) {
                    b = d[n];
                    if (!b) {
                      break;
                    }
                    if (a.childNode) {
                      a.childNode = Number(a.childNode);
                      b = b.childNodes;
                      if (b.length < a.childNode) {
                        d = "childNodes fail: " + b.length + " - " + a.name + h;
                        if (!1 === a.optional) {
                          return z = d, !1;
                        }
                        g += " // " + d;
                        return !0;
                      }
                      b = b[a.childNode];
                    }
                    b = "text" == a.attribute ? b.textContent : "html" == a.attribute ? b.innerHTML : b.getAttribute(a.attribute);
                    if (!b || 0 == b.length || 0 == b.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
                      d = "selector attribute null: " + a.name + h;
                      if (!1 === a.optional) {
                        return z = d, !1;
                      }
                      g += " // " + d;
                      return !0;
                    }
                    if (a.regExp) {
                      e = b.match(new RegExp(a.regExp, "i"));
                      if (!e || e.length < a.reGroup) {
                        d = "regexp fail: " + b + " - " + a.name + h;
                        if (!1 === a.optional) {
                          return z = d, !1;
                        }
                        g += " // " + d;
                        return !0;
                      }
                      k.push(e[a.reGroup]);
                    } else {
                      k.push(b);
                    }
                    if (!a.multiple) {
                      break;
                    }
                  }
                }
                d = k;
                a.multiple || (d = k[0]);
                return d;
              };
              B = document;
              var a = !1, b = {}, e;
              for (e in l.scrapeFilters) {
                b.$jscomp$loop$prop$pageType$86 = e;
                a: {
                  if (a) {
                    break;
                  }
                  b.$jscomp$loop$prop$pageFilter$83 = l.scrapeFilters[b.$jscomp$loop$prop$pageType$86];
                  var n = b.$jscomp$loop$prop$pageFilter$83.pageVersionTest, d = document.querySelectorAll(n.selector);
                  0 == d.length && (d = document.querySelectorAll(n.altSelector));
                  if (0 != d.length) {
                    if ("undefined" != typeof n.multiple && null != n.multiple) {
                      if (!0 === n.multiple && 2 > d.length) {
                        break a;
                      }
                      if (!1 === n.multiple && 1 < d.length) {
                        break a;
                      }
                    }
                    if (n.attribute) {
                      var h = null;
                      h = "text" == n.attribute ? "" : d[0].getAttribute(n.attribute);
                      if (null == h) {
                        break a;
                      }
                    }
                    t = b.$jscomp$loop$prop$pageType$86;
                    d = {};
                    for (var k in b.$jscomp$loop$prop$pageFilter$83) {
                      if (a) {
                        break;
                      }
                      d.$jscomp$loop$prop$sel$79 = b.$jscomp$loop$prop$pageFilter$83[k];
                      if (d.$jscomp$loop$prop$sel$79.name != n.name) {
                        if (d.$jscomp$loop$prop$sel$79.parentList) {
                          h = [];
                          if ("undefined" != typeof y[d.$jscomp$loop$prop$sel$79.parentList]) {
                            h = y[d.$jscomp$loop$prop$sel$79.parentList];
                          } else {
                            if (!0 === w(b.$jscomp$loop$prop$pageFilter$83[d.$jscomp$loop$prop$sel$79.parentList], B, b.$jscomp$loop$prop$pageType$86)) {
                              h = y[d.$jscomp$loop$prop$sel$79.parentList];
                            } else {
                              break;
                            }
                          }
                          v[d.$jscomp$loop$prop$sel$79.parentList] || (v[d.$jscomp$loop$prop$sel$79.parentList] = []);
                          var D = 0, u = {}, A;
                          for (A in h) {
                            if (a) {
                              break;
                            }
                            if (h.hasOwnProperty(A)) {
                              if ("lager" == d.$jscomp$loop$prop$sel$79.name) {
                                D++;
                                try {
                                  var m = void 0, r = void 0;
                                  d.$jscomp$loop$prop$sel$79.selector && (m = h[A].querySelector(d.$jscomp$loop$prop$sel$79.selector));
                                  d.$jscomp$loop$prop$sel$79.altSelector && (r = h[A].querySelector(d.$jscomp$loop$prop$sel$79.altSelector));
                                  r && (r = r.getAttribute(d.$jscomp$loop$prop$sel$79.attribute));
                                  var F = 999, O = !1;
                                  try {
                                    O = -1 != h[A].textContent.toLowerCase().indexOf("add to cart to see product details.");
                                  } catch (E) {
                                  }
                                  if (!r) {
                                    try {
                                      var x = JSON.parse(d.$jscomp$loop$prop$sel$79.regExp);
                                      if (x.sel1) {
                                        try {
                                          var S = JSON.parse(h[A].querySelectorAll(x.sel1)[0].dataset[x.dataSet1]);
                                          r = S[x.val1];
                                          F = S.maxQty;
                                        } catch (E) {
                                        }
                                      }
                                      if (!r && x.sel2) {
                                        try {
                                          var T = JSON.parse(h[A].querySelectorAll(x.sel2)[0].dataset[x.dataSet2]);
                                          r = T[x.val2];
                                          F = T.maxQty;
                                        } catch (E) {
                                        }
                                      }
                                    } catch (E) {
                                    }
                                  }
                                  if (m) {
                                    C++;
                                    u.$jscomp$loop$prop$mapIndex$80 = A + "";
                                    u.$jscomp$loop$prop$busy$81 = !0;
                                    var K = document.location.href.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                                    K = K[1];
                                    null == K || 9 > K.length || (chrome.runtime.sendMessage({type:"getStock", asin:K, oid:r, maxQty:F, isMAP:O, host:document.location.hostname, referer:document.location + "", domainId:l.domainId, force:!0, session:"unknown"}, function(a, b) {
                                      return function(d) {
                                        a.$jscomp$loop$prop$busy$81 && (a.$jscomp$loop$prop$busy$81 = !1, "undefined" != typeof d && (d.error ? console.log(d.error) : (console.log("got stock: ", d), v[b.$jscomp$loop$prop$sel$79.parentList][a.$jscomp$loop$prop$mapIndex$80][b.$jscomp$loop$prop$sel$79.name] = d, 0 == --C && f(q))));
                                      };
                                    }(u, d)), setTimeout(function(a) {
                                      return function() {
                                        a.$jscomp$loop$prop$busy$81 && 0 == --C && (a.$jscomp$loop$prop$busy$81 = !1, f(q));
                                      };
                                    }(u), 2000));
                                  }
                                } catch (E) {
                                }
                              } else {
                                if ("revealMAP" == d.$jscomp$loop$prop$sel$79.name) {
                                  u.$jscomp$loop$prop$revealMAP$84 = d.$jscomp$loop$prop$sel$79, m = void 0, m = u.$jscomp$loop$prop$revealMAP$84.selector ? h[A].querySelector(u.$jscomp$loop$prop$revealMAP$84.selector) : h[A], null != m && m.textContent.match(new RegExp(u.$jscomp$loop$prop$revealMAP$84.regExp, "i")) && (m = document.location.href.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/), m = m[1], r = b.$jscomp$loop$prop$pageFilter$83.sellerId, "undefined" == typeof r || null == r || null == m || 
                                  2 > m.length || (r = h[A].querySelector('input[name="oid"]').value, null == r || 20 > r + 0 || (m = u.$jscomp$loop$prop$revealMAP$84.altSelector.replace("OFFERID", r).replace("ASINID", m), C++, u.$jscomp$loop$prop$mapIndex$14$85 = A + "", c(m, "GET", null, 3000, function(a, b) {
                                    return function(d) {
                                      if (4 == d.readyState) {
                                        C--;
                                        if (200 == d.status) {
                                          try {
                                            var h = d.responseText, k = a.$jscomp$loop$prop$pageFilter$83.price;
                                            if (k && k.regExp) {
                                              if (h.match(/no valid offer--/)) {
                                                v[b.$jscomp$loop$prop$revealMAP$84.parentList][b.$jscomp$loop$prop$mapIndex$14$85] || (v[b.$jscomp$loop$prop$revealMAP$84.parentList][b.$jscomp$loop$prop$mapIndex$14$85] = {}), v[b.$jscomp$loop$prop$revealMAP$84.parentList][b.$jscomp$loop$prop$mapIndex$14$85][b.$jscomp$loop$prop$revealMAP$84.name] = -1;
                                              } else {
                                                var e = h.match(new RegExp("price info--\x3e(?:.|\\n)*?" + k.regExp + "(?:.|\\n)*?\x3c!--")), n = h.match(/price info--\x3e(?:.|\n)*?(?:<span.*?size-small.*?">)([^]*?<\/span)(?:.|\n)*?\x3c!--/);
                                                if (!e || e.length < k.reGroup) {
                                                  g += " //  priceMAP regexp fail: " + (h + " - " + k.name + a.$jscomp$loop$prop$pageType$86);
                                                } else {
                                                  var c = e[k.reGroup];
                                                  v[b.$jscomp$loop$prop$revealMAP$84.parentList][b.$jscomp$loop$prop$mapIndex$14$85] || (v[b.$jscomp$loop$prop$revealMAP$84.parentList][b.$jscomp$loop$prop$mapIndex$14$85] = {});
                                                  v[b.$jscomp$loop$prop$revealMAP$84.parentList][b.$jscomp$loop$prop$mapIndex$14$85][b.$jscomp$loop$prop$revealMAP$84.name] = c;
                                                  null != n && 2 == n.length && (v[b.$jscomp$loop$prop$revealMAP$84.parentList][b.$jscomp$loop$prop$mapIndex$14$85][b.$jscomp$loop$prop$revealMAP$84.name + "Shipping"] = n[1].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                                }
                                              }
                                            }
                                          } catch (J) {
                                          }
                                        }
                                        0 == C && f(q);
                                      }
                                    };
                                  }(b, u), function() {
                                    0 == --C && f(q);
                                  }))));
                                } else {
                                  m = w(d.$jscomp$loop$prop$sel$79, h[A], b.$jscomp$loop$prop$pageType$86);
                                  if (!1 === m) {
                                    a = !0;
                                    break;
                                  }
                                  if (!0 !== m) {
                                    if (v[d.$jscomp$loop$prop$sel$79.parentList][A] || (v[d.$jscomp$loop$prop$sel$79.parentList][A] = {}), d.$jscomp$loop$prop$sel$79.multiple) {
                                      for (var N in m) {
                                        m.hasOwnProperty(N) && !d.$jscomp$loop$prop$sel$79.keepBR && (m[N] = m[N].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                      }
                                      m = m.join("\u271c\u271c");
                                      v[d.$jscomp$loop$prop$sel$79.parentList][A][d.$jscomp$loop$prop$sel$79.name] = m;
                                    } else {
                                      v[d.$jscomp$loop$prop$sel$79.parentList][A][d.$jscomp$loop$prop$sel$79.name] = d.$jscomp$loop$prop$sel$79.keepBR ? m : m.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                                    }
                                  }
                                }
                              }
                            }
                            u = {$jscomp$loop$prop$busy$81:u.$jscomp$loop$prop$busy$81, $jscomp$loop$prop$mapIndex$80:u.$jscomp$loop$prop$mapIndex$80, $jscomp$loop$prop$revealMAP$84:u.$jscomp$loop$prop$revealMAP$84, $jscomp$loop$prop$mapIndex$14$85:u.$jscomp$loop$prop$mapIndex$14$85};
                          }
                        } else {
                          h = w(d.$jscomp$loop$prop$sel$79, B, b.$jscomp$loop$prop$pageType$86);
                          if (!1 === h) {
                            a = !0;
                            break;
                          }
                          if (!0 !== h) {
                            if (d.$jscomp$loop$prop$sel$79.multiple) {
                              for (var P in h) {
                                h.hasOwnProperty(P) && !d.$jscomp$loop$prop$sel$79.keepBR && (h[P] = h[P].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                              }
                              h = h.join();
                            } else {
                              d.$jscomp$loop$prop$sel$79.keepBR || (h = h.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                            }
                            p[d.$jscomp$loop$prop$sel$79.name] = h;
                          }
                        }
                      }
                      d = {$jscomp$loop$prop$sel$79:d.$jscomp$loop$prop$sel$79};
                    }
                    a = !0;
                  }
                }
                b = {$jscomp$loop$prop$pageFilter$83:b.$jscomp$loop$prop$pageFilter$83, $jscomp$loop$prop$pageType$86:b.$jscomp$loop$prop$pageType$86};
              }
              if (null == t) {
                z += " // no pageVersion matched", q.status = 308, q.payload = [g, z, l.dbg1 ? document.getElementsByTagName("html")[0].innerHTML : ""];
              } else {
                if ("" === z) {
                  q.payload = [g];
                  q.scrapedData = p;
                  for (var V in v) {
                    q[V] = v[V];
                  }
                } else {
                  q.status = 305, q.payload = [g, z, l.dbg2 ? document.getElementsByTagName("html")[0].innerHTML : ""];
                }
              }
            } else {
              q.status = 306;
            }
            0 == C && f(q);
          }
        }
      }
    }
  }
  if (!isDiscuss) {
    var f = !0;
    window.self === window.top && (f = !1);
    window.sandboxHasRun && (f = !1);
    f && (window.sandboxHasRun = !0, window.addEventListener("message", function(c) {
      if (c.source == window.parent && c.data && (c.origin == "chrome-extension://" + chrome.runtime.id || c.origin.startsWith("moz-extension://") || c.origin.startsWith("safari-extension://"))) {
        var f = c.data.value;
        "data" == c.data.key && f.url && f.url == document.location && setTimeout(function() {
          null == document.body ? setTimeout(function() {
            p(f, function(c) {
              window.parent.postMessage({sandbox:c}, "*");
            });
          }, 1500) : p(f, function(c) {
            window.parent.postMessage({sandbox:c}, "*");
          });
        }, 800);
      }
    }, !1), window.parent.postMessage({sandbox:document.location + "", isUrlMsg:!0}, "*"));
    window.addEventListener("error", function(c, f, p, G, H) {
      "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(H);
      return !1;
    });
    return {scan:p};
  }
}();
(function() {
  if (!isDiscuss) {
    var c = !1, p = !1, f = window.opera || -1 < navigator.userAgent.indexOf(" OPR/"), l = -1 < navigator.userAgent.toLowerCase().indexOf("firefox"), t = -1 < navigator.userAgent.toLowerCase().indexOf("edge/"), q = /Apple Computer/.test(navigator.vendor) && /Safari/.test(navigator.userAgent), G = !f && !l && !t & !q, H = l ? "Firefox" : q ? "Safari" : G ? "Chrome" : f ? "Opera" : t ? "Edge" : "Unknown", B = chrome.runtime.getManifest().version, C = !1;
    try {
      C = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    } catch (a) {
    }
    if (!window.keepaHasRun) {
      window.keepaHasRun = !0;
      var z = 0;
      window.addEventListener("message", function(a) {
        if ("undefined" == typeof a.data.sandbox) {
          if ("https://keepa.com" == a.origin || "https://test.keepa.com" == a.origin) {
            if (a.data.hasOwnProperty("origin") && "keepaIframe" == a.data.origin) {
              g.handleIFrameMessage(a.data.key, a.data.value, function(b) {
                try {
                  a.source.postMessage({origin:"keepaContentScript", key:a.data.key, value:b, id:a.data.id}, a.origin);
                } catch (k) {
                }
              });
            } else {
              if ("string" === typeof a.data) {
                var b = a.data.split(",");
                if (2 > b.length) {
                  return;
                }
                if (2 < b.length) {
                  for (var e = 2, n = b.length; e < n; e++) {
                    b[1] += "," + b[e];
                  }
                }
                g.handleIFrameMessage(b[0], b[1], function(b) {
                  a.source.postMessage({origin:"keepaContentScript", value:b}, a.origin);
                });
              }
            }
          }
          if (a.origin.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|jp|ca|fr|es|nl|it|in|com\.mx|com\.br)/)) {
            try {
              var d = JSON.parse(a.data);
            } catch (h) {
              return;
            }
            (d = d.asin) && "null" != d && /([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(d) && (d != g.ASIN ? (g.ASIN = d, g.swapIFrame()) : 0 != z ? (window.clearTimeout(z), z = 1) : z = window.setTimeout(function() {
              g.swapIFrame();
            }, 1000));
          }
        }
      });
      var g = {domain:0, iframeStorage:null, ASIN:null, tld:"", placeholder:"", cssFlex:function() {
        var a = "flex", b = ["flex", "-webkit-flex", "-moz-box", "-webkit-box", "-ms-flexbox"], g = document.createElement("flexelement"), n;
        for (n in b) {
          try {
            if ("undefined" != g.style[b[n]]) {
              a = b[n];
              break;
            }
          } catch (d) {
          }
        }
        return a;
      }(), getDomain:function(a) {
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
          case "jp":
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
            return -1;
        }
      }, revealWorking:!1, juvecOnlyOnce:!1, revealMapOnlyOnce:!1, revealCache:{}, revealMAP:function() {
        g.revealMapOnlyOnce || (g.revealMapOnlyOnce = !0, chrome.runtime.sendMessage({type:"isPro"}, function(a) {
          var b = !0 === a.value;
          chrome.storage.local.get("revealStock", function(a) {
            "undefined" == typeof a && (a = {});
            var e = !0;
            try {
              e = "0" != a.revealStock;
            } catch (L) {
            }
            console.log("keepa stock active: " + b + " " + e);
            try {
              if ((e || "com" == g.tld) && !g.revealWorking) {
                if (g.revealWorking = !0, document.getElementById("keepaMAP")) {
                  g.revealWorking = !1;
                } else {
                  var d = function() {
                    var a = new MutationObserver(function(b) {
                      setTimeout(function() {
                        g.revealMAP();
                      }, 100);
                      try {
                        a.disconnect();
                      } catch (aa) {
                      }
                    });
                    a.observe(document.getElementById("keepaMAP").parentNode.parentNode.parentNode, {childList:!0, subtree:!0});
                  }, h = function(a, d, h, e, n, c, m) {
                    if ("undefined" == typeof g.revealCache[e]) {
                      g.revealCache[e] = -1;
                      var f = "" == a.id && "aod-pinned-offer" == a.parentNode.id;
                      c = c || f;
                      try {
                        h = h || -1 != a.textContent.toLowerCase().indexOf("add to cart to see product details.") || !c && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(document.getElementById("price").textContent);
                      } catch (ca) {
                      }
                      if (h || b) {
                        k(a, d, h, e, c);
                        var u = function(a) {
                          var d = document.getElementById("keepaStock" + e);
                          if (null != d) {
                            d.innerHTML = "";
                            if (null != a && null != a.price && h) {
                              var k = document.createElement("div");
                              a = 5 == g.domain ? a.price : (Number(a.price) / 100).toFixed(2);
                              var n = new Intl.NumberFormat(" en-US en-GB de-DE fr-FR ja-JP en-CA zh-CN it-IT es-ES hi-IN es-MX pt-BR en-AU nl-NL tr-TR".split(" ")[g.domain], {style:"currency", currency:" USD GBP EUR EUR JPY CAD CNY EUR EUR INR MXN BRL AUD EUR TRY".split(" ")[g.domain]});
                              0 < a && (k.innerHTML = 'Price&emsp;&ensp;<span style="font-weight: bold;">' + n.format(a) + "</span>");
                              d.parentNode.parentNode.parentNode.prepend(k);
                            }
                            b && (a = g.revealCache[e].stock, 999 == a ? a = "999+" : 1000 == a && (a = "1000+"), k = document.createElement("span"), k.style = "font-weight: bold;", k.innerText = a + " ", a = document.createElement("span"), a.style = "color: #dedede;", a.innerText = " (revealed by \u271c Keepa)", n = document.createElement("span"), n.style = "color:#da4c33;", n.innerText = " order limit", d.appendChild(k), g.revealCache[e].limit && (0 < g.revealCache[e].orderLimit && (n.innerText += 
                            ": " + g.revealCache[e].orderLimit), d.appendChild(n)), c && d.appendChild(a));
                          }
                        };
                        "undefined" != typeof g.revealCache[e] && -1 != g.revealCache[e] ? u(g.revealCache[e]) : chrome.runtime.sendMessage({type:"getStock", asin:d, oid:e, maxQty:m, isMAP:h, host:document.location.hostname, force:h, referer:document.location + "", domainId:g.domain, session:n}, function(a) {
                          if ("undefined" != typeof a && null != a) {
                            if (a.error) {
                              var b = document.getElementById("keepaStock" + e);
                              b.innerHTML = "";
                              var d = document.createElement("span");
                              d.style = "color:#e8c7c1;";
                              d.innerText = "error(" + a.errorCode + ")";
                              d.title = a.error + ". Contact info@keepa.com with a screenshot & URL for assistance.";
                              b.appendChild(d);
                              console.log(a.error);
                            } else {
                              g.revealCache[e] = a, u(a);
                            }
                          }
                        });
                      }
                    }
                  }, k = function(a, h, e, k, n) {
                    h = "" == a.id && "aod-pinned-offer" == a.parentNode.id;
                    var c = (n ? a.parentElement : a).querySelector(".keepaMAP");
                    if (null == (n ? a.parentElement : a).querySelector(".keepaStock")) {
                      null != c && null != c.parentElement && c.parentElement.remove();
                      var m = n ? "165px" : "55px;height:20px;";
                      c = document.createElement("div");
                      c.id = "keepaMAP" + (n ? e + k : "");
                      c.className = "a-section a-spacing-none a-spacing-top-micro aod-clear-float keepaStock";
                      e = document.createElement("div");
                      e.className = "a-fixed-left-grid";
                      var f = document.createElement("div");
                      f.style = "padding-left:" + m;
                      n && (f.className = "a-fixed-left-grid-inner");
                      var u = document.createElement("div");
                      u.style = "width:" + m + ";margin-left:-" + m + ";float:left;";
                      u.className = "a-fixed-left-grid-col aod-padding-right-10 a-col-left";
                      m = document.createElement("div");
                      m.style = "padding-left:0%;float:left;";
                      m.className = "a-fixed-left-grid-col a-col-right";
                      var l = document.createElement("span");
                      l.className = "a-size-small a-color-tertiary";
                      var D = document.createElement("span");
                      D.style = "color: #dedede;";
                      D.innerText = "loading\u2026";
                      var r = document.createElement("span");
                      r.className = "a-size-small a-color-base";
                      r.id = "keepaStock" + k;
                      r.appendChild(D);
                      m.appendChild(r);
                      u.appendChild(l);
                      f.appendChild(u);
                      f.appendChild(m);
                      e.appendChild(f);
                      c.appendChild(e);
                      l.className = "a-size-small a-color-tertiary";
                      g.revealWorking = !1;
                      b && (l.innerText = "Stock");
                      n ? h ? (a = document.querySelector("#aod-pinned-offer-show-more-link"), 0 == a.length && document.querySelector("#aod-pinned-offer-main-content-show-more"), a.prepend(c)) : a.parentNode.insertBefore(c, a.parentNode.children[a.parentNode.children.length - 1]) : a.appendChild(c);
                      n || d();
                    }
                  }, c = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" "), f = document.location.href, l = /&seller=([A-Z0-9]{9,21})($|&)/;
                  if (0 < f.indexOf("/offer-listing/")) {
                    try {
                      var m = document.getElementById("olpTabContent");
                      if (null == m && (m = document.getElementById("olpOfferList"), null == m)) {
                        return;
                      }
                      var r = m.querySelector('[role="grid"]');
                      if (null != r) {
                        var p = r.childNodes, q;
                        for (q in p) {
                          if (p.hasOwnProperty(q)) {
                            var x = p[q];
                            if (null != x && "DIV" == x.nodeName) {
                              try {
                                var t = x.querySelector('input[name="offeringID.1"]');
                                if (t) {
                                  var w = x.children[0], y = t.getAttribute("value"), v = x.querySelector('input[name="session-id"]');
                                  if (v) {
                                    var z = v.getAttribute("value"), C = x.querySelector('input[name="merchantID"]'), E = null;
                                    null != C && (E = C.getAttribute("value"));
                                    null == E && (E = null != x.querySelector('.olpSellerName img[alt="Amazon.' + g.tld + '"]') ? c[g.domain] : null);
                                    if (null == E) {
                                      var B = x.querySelector(".olpSellerName a");
                                      null != B && (B = B.getAttribute("href"));
                                      if (null != B) {
                                        var G = B.match(l);
                                        null != G && 1 < G.length && (E = G[1]);
                                      }
                                    }
                                    var H = -1 != x.textContent.toLowerCase().indexOf("add to cart to see product details.");
                                    (e || H) && h(w, g.ASIN, H, y, z, !1);
                                  }
                                }
                              } catch (L) {
                                console.log(L);
                              }
                            }
                          }
                        }
                      }
                    } catch (L) {
                      console.log(L), g.reportBug(L, "MAP error: " + f);
                    }
                  } else {
                    var I = new MutationObserver(function(a) {
                      try {
                        var b = document.querySelectorAll("#aod-offer,#aod-pinned-offer");
                        if (null != b && 0 != b.length) {
                          a = null;
                          var d = b[0].querySelector('input[name="session-id"]');
                          if (d) {
                            a = d.getAttribute("value");
                          } else {
                            if (d = document.querySelector("#session-id")) {
                              a = document.querySelector("#session-id").value;
                            }
                          }
                          if (!a) {
                            for (var e = document.querySelectorAll("script"), k = $jscomp.makeIterator(e), n = k.next(); !n.done; n = k.next()) {
                              var m = n.value.text.match("ue_sid.?=.?'([0-9-]{19})'");
                              m && (a = m[1]);
                            }
                          }
                          if (a) {
                            for (var u in b) {
                              if (b.hasOwnProperty(u)) {
                                var D = b[u];
                                if (null != D && "DIV" == D.nodeName) {
                                  d = void 0;
                                  e = 999;
                                  var r = D.querySelector('input[name="offeringID.1"]');
                                  if (r) {
                                    d = r.getAttribute("value");
                                  } else {
                                    try {
                                      var p = JSON.parse(D.querySelectorAll("[data-aod-atc-action]")[0].dataset.aodAtcAction);
                                      d = p.oid;
                                      e = p.maxQty;
                                    } catch (Q) {
                                      try {
                                        var A = JSON.parse(D.querySelectorAll("[data-aw-aod-cart-api]")[0].dataset.awAodCartApi);
                                        d = A.oid;
                                        e = A.maxQty;
                                      } catch (da) {
                                      }
                                    }
                                  }
                                  if (d) {
                                    var q = D.children[0], x = D.querySelector('input[name="merchantID"]');
                                    k = null;
                                    null != x && (k = x.getAttribute("value"));
                                    null == k && (k = null != D.querySelector('.olpSellerName img[alt="Amazon.' + g.tld + '"]') ? c[g.domain] : null);
                                    if (null == k) {
                                      var F = D.querySelector(".olpSellerName a, #aod-offer-soldBy a");
                                      null != F && (F = F.getAttribute("href"));
                                      null != F && F.match(l);
                                    }
                                    var t = -1 != D.textContent.toLowerCase().indexOf("add to cart to see product details.");
                                    "undefined" === typeof g.revealCache[d] && h(q, g.ASIN, t, d, a, !0, e);
                                  }
                                }
                              }
                            }
                          } else {
                            console.error("missing sessionId");
                          }
                        }
                      } catch (Q) {
                        console.log(Q), g.reportBug(Q, "MAP error: " + f);
                      }
                    });
                    I.observe(document.querySelector("body"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                    window.onunload = function Z() {
                      try {
                        window.detachEvent("onunload", Z), I.disconnect();
                      } catch (aa) {
                      }
                    };
                    var M = document.querySelector("#newAccordionRow #offerListingID, #qualifiedBuybox #offerListingID, #exportsBuybox #offerListingID");
                    if (null != M && null != M.value) {
                      var R = M.parentElement.querySelector("#session-id"), U = M.parentElement.querySelector("#ASIN");
                      if (null != R && null != U) {
                        var J = document.querySelector("#availability");
                        null == J && (J = document.querySelector("#availabilityInsideBuyBox_feature_div"));
                        null == J && (J = document.querySelector("#shippingMessageInsideBuyBox_feature_div"));
                        null == J && (J = document.querySelector("#buyNew_cbb"));
                        null != J && h(J, U.value, !1, M.value, R.value, !1);
                      }
                    }
                    E = document.getElementById("price");
                    if (null != E && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(E.textContent)) {
                      var W = document.getElementById("merchant-info");
                      e = "";
                      if (W) {
                        if (-1 == W.textContent.toLowerCase().indexOf("amazon.c")) {
                          var X = E.querySelector('span[data-action="a-modal"]');
                          if (X) {
                            var Y = X.getAttribute("data-a-modal");
                            Y.match(/offeringID\.1=(.*?)&amp/) && (e = RegExp.$1);
                          }
                          if (0 == e.length && !Y.match('map_help_pop_(.*?)"')) {
                            g.revealWorking = !1;
                            return;
                          }
                        }
                        if (null != e && 10 < e.length) {
                          var ba = document.querySelector("#session-id");
                          h(E, g.ASIN, !1, e, ba.value, !1);
                        }
                      } else {
                        g.revealWorking = !1;
                      }
                    } else {
                      g.revealWorking = !1;
                    }
                  }
                }
              }
            } catch (L) {
              g.revealWorking = !1, console.log(L);
            }
          });
        }));
      }, onPageLoad:function() {
        g.tld = RegExp.$2;
        var a = RegExp.$4;
        g.ASIN || (g.ASIN = a);
        g.domain = g.getDomain(g.tld);
        chrome.storage.local.get(["s_boxType", "s_boxOfferListing"], function(a) {
          "undefined" == typeof a && (a = {});
          var b = 0 < document.location.href.indexOf("/offer-listing/");
          b && "0" === a.s_boxOfferListing && (onlyStock = !0);
          document.addEventListener("DOMContentLoaded", function(e) {
            e = document.getElementsByTagName("head")[0];
            var d = document.createElement("script");
            d.type = "text/javascript";
            d.src = chrome.runtime.getURL("chrome/content/selectionHook.js");
            e.appendChild(d);
            "0" == a.s_boxType ? g.swapIFrame() : g.getPlaceholderAndInsertIFrame(function(a, d) {
              if (void 0 !== a) {
                d = document.createElement("div");
                d.setAttribute("id", "keepaButton");
                d.setAttribute("style", "    background-color: #444;\n    border: 0 solid #ccc;\n    border-radius: 6px 6px 6px 6px;\n    color: #fff;\n    cursor: pointer;\n    font-size: 12px;\n    margin: 15px;\n    padding: 6px;\n    text-decoration: none;\n    text-shadow: none;\n    box-shadow: 0px 0px 7px 0px #888;\n    width: 100px;\n    background-repeat: no-repeat;\n    height: 32px;\n    background-position-x: 7px;\n    background-position-y: 7px;\n    text-align: center;\n    background-image: url(https://cdn.keepa.com/img/logo_circled_w.svg);\n    background-size: 80px;");
                var e = document.createElement("style");
                e.appendChild(document.createTextNode("#keepaButton:hover{background-color:#666 !important}"));
                document.head.appendChild(e);
                d.addEventListener("click", function() {
                  var a = document.getElementById("keepaButton");
                  a.parentNode.removeChild(a);
                  g.swapIFrame();
                }, !1);
                b && (a = document.getElementById("olpTabContent"), a || (a = document.getElementById("olpProduct"), a = a.nextSibling));
                a.parentNode.insertBefore(d, a);
              }
            });
          }, !1);
        });
      }, swapIFrame:function() {
        if (onlyStock || "com.au" == g.tld) {
          try {
            g.revealMAP(document, g.ASIN, g.tld), g.revealMapOnlyOnce = !1;
          } catch (b) {
          }
        } else {
          if (!document.getElementById("keepaButton")) {
            g.swapIFrame.swapTimer && clearTimeout(g.swapIFrame.swapTimer);
            g.swapIFrame.swapTimer = setTimeout(function() {
              if (!C) {
                document.getElementById("keepaContainer") || g.getPlaceholderAndInsertIFrame(g.insertIFrame);
                try {
                  g.revealMAP(document, g.ASIN, g.tld), g.revealMapOnlyOnce = !1;
                } catch (b) {
                }
                g.swapIFrame.swapTimer = setTimeout(function() {
                  document.getElementById("keepaContainer") || g.getPlaceholderAndInsertIFrame(g.insertIFrame);
                }, 2000);
              }
            }, 2000);
            var a = document.getElementById("keepaContainer");
            if (null != g.iframeStorage && a) {
              try {
                g.iframeStorage.contentWindow.postMessage({origin:"keepaContentScript", key:"updateASIN", value:g.domain + "-0-" + g.ASIN}, g.iframeStorage.src);
              } catch (b) {
                console.error(b);
              }
            } else {
              g.getPlaceholderAndInsertIFrame(g.insertIFrame);
              try {
                g.revealMAP(document, g.ASIN, g.tld), g.revealMapOnlyOnce = !1;
              } catch (b) {
              }
            }
          }
        }
      }, getDevicePixelRatio:function() {
        var a = 1;
        void 0 !== window.screen.systemXDPI && void 0 !== window.screen.logicalXDPI && window.screen.systemXDPI > window.screen.logicalXDPI ? a = window.screen.systemXDPI / window.screen.logicalXDPI : void 0 !== window.devicePixelRatio && (a = window.devicePixelRatio);
        return a;
      }, getPlaceholderAndInsertIFrame:function(a) {
        chrome.storage.local.get("keepaBoxPlaceholder keepaBoxPlaceholderBackup keepaBoxPlaceholderBackupClass keepaBoxPlaceholderAppend keepaBoxPlaceholderBackupAppend webGraphType webGraphRange".split(" "), function(b) {
          "undefined" == typeof b && (b = {});
          var e = 0, n = function() {
            if (!document.getElementById("keepaButton") && !document.getElementById("amazonlive-homepage-widget")) {
              if (C) {
                var d = document.querySelector("#tabular_feature_div,#olpLinkWidget_feature_div,#tellAFriendBox_feature_div");
                try {
                  document.querySelector("#keepaMobileContainer")[0].remove();
                } catch (r) {
                }
                if (d && d.previousSibling) {
                  try {
                    var h = b.webGraphType;
                    try {
                      h = JSON.parse(h);
                    } catch (r) {
                    }
                    var k = b.webGraphRange;
                    try {
                      k = Number(k);
                    } catch (r) {
                    }
                    var c = Math.min(1800, 1.6 * window.innerWidth).toFixed(0), f = "https://graph.keepa.com/pricehistory.png?type=2&asin=" + g.ASIN + "&domain=" + g.domain + "&width=" + c + "&height=450";
                    f = "undefined" == typeof h ? f + "&amazon=1&new=1&used=1&salesrank=1&range=365" : f + ("&amazon=" + h[0] + "&new=" + h[1] + "&used=" + h[2] + "&salesrank=" + h[3] + "&range=" + k + "&fba=" + h[10] + "&fbm=" + h[7] + "&bb=" + h[18] + "&ld=" + h[8] + "&wd=" + h[9]);
                    var l = document.createElement("div");
                    l.setAttribute("id", "keepaMobileContainer");
                    l.setAttribute("style", "margin-bottom: 20px;");
                    var m = document.createElement("img");
                    m.setAttribute("style", "margin: 5px 0; width: " + Math.min(1800, window.innerWidth) + "px;");
                    m.setAttribute("id", "keepaImageContainer" + g.ASIN);
                    m.setAttribute("src", f);
                    document.createElement("div").setAttribute("style", "margin: 20px; display: flex;justify-content: space-evenly;");
                    l.appendChild(m);
                    d.after(l);
                    m.addEventListener("click", function() {
                      m.remove();
                      g.insertIFrame(d.previousSibling, !1, !0);
                    }, !1);
                  } catch (r) {
                    console.error(r);
                  }
                  return;
                }
              }
              if ((h = document.getElementById("gpdp-btf-container")) && h.previousElementSibling) {
                g.insertIFrame(h.previousElementSibling, !1, !0);
              } else {
                if ((h = document.getElementsByClassName("mocaGlamorContainer")[0]) || (h = document.getElementById("dv-sims")), h || (h = document.getElementById("mas-terms-of-use")), h && h.nextSibling) {
                  g.insertIFrame(h.nextSibling, !1, !0);
                } else {
                  if (k = b.keepaBoxPlaceholder || "#bottomRow", h = !1, k = document.querySelector(k)) {
                    "sims_fbt" == k.previousElementSibling.id && (k = k.previousElementSibling, "bucketDivider" == k.previousElementSibling.className && (k = k.previousElementSibling), h = !0), 1 == b.keepaBoxPlaceholderAppend && (k = k.nextSibling), a(k, h);
                  } else {
                    if (k = b.keepaBoxPlaceholderBackup || "#elevatorBottom", "ATFCriticalFeaturesDataContainer" == k && (k = "#ATFCriticalFeaturesDataContainer"), k = document.querySelector(k)) {
                      1 == b.keepaBoxPlaceholderBackupAppend && (k = k.nextSibling), a(k, !0);
                    } else {
                      if (k = document.getElementById("hover-zoom-end")) {
                        a(k, !0);
                      } else {
                        if (k = b.keepaBoxPlaceholderBackupClass || ".a-fixed-left-grid", (k = document.querySelector(k)) && k.nextSibling) {
                          a(k.nextSibling, !0);
                        } else {
                          h = 0;
                          k = document.getElementsByClassName("twisterMediaMatrix");
                          c = !!document.getElementById("dm_mp3Player");
                          if ((k = 0 == k.length ? document.getElementById("handleBuy") : k[0]) && 0 == h && !c && null != k.nextElementSibling) {
                            f = !1;
                            for (c = k; c;) {
                              if (c = c.parentNode, "table" === c.tagName.toLowerCase()) {
                                if ("buyboxrentTable" === c.className || /buyBox/.test(c.className) || "buyingDetailsGrid" === c.className) {
                                  f = !0;
                                }
                                break;
                              } else {
                                if ("html" === c.tagName.toLowerCase()) {
                                  break;
                                }
                              }
                            }
                            if (!f) {
                              k = k.nextElementSibling;
                              a(k, !1);
                              return;
                            }
                          }
                          k = document.getElementsByClassName("bucketDivider");
                          0 == k.length && (k = document.getElementsByClassName("a-divider-normal"));
                          if (!k[h]) {
                            if (!k[0]) {
                              40 > e++ && window.setTimeout(function() {
                                n();
                              }, 100);
                              return;
                            }
                            h = 0;
                          }
                          for (c = k[h]; c && k[h];) {
                            if (c = c.parentNode, "table" === c.tagName.toLowerCase()) {
                              if ("buyboxrentTable" === c.className || /buyBox/.test(c.className) || "buyingDetailsGrid" === c.className) {
                                c = k[++h];
                              } else {
                                break;
                              }
                            } else {
                              if ("html" === c.tagName.toLowerCase()) {
                                break;
                              }
                            }
                          }
                          g.placeholder = k[h];
                          k[h] && k[h].parentNode && (h = document.getElementsByClassName("lpo")[0] && k[1] && 0 == h ? k[1] : k[h], a(h, !1));
                        }
                      }
                    }
                  }
                }
              }
            }
          };
          n();
        });
      }, getAFComment:function(a) {
        for (a = [a]; 0 < a.length;) {
          for (var b = a.pop(), e = 0; e < b.childNodes.length; e++) {
            var c = b.childNodes[e];
            if (8 === c.nodeType && -1 < c.textContent.indexOf("MarkAF")) {
              return c;
            }
            a.push(c);
          }
        }
        return null;
      }, getIframeUrl:function(a, b) {
        return "https://keepa.com/iframe_addon.html#" + a + "-0-" + b;
      }, insertIFrame:function(a, b) {
        if (null != g.iframeStorage && document.getElementById("keepaContainer")) {
          g.swapIFrame();
        } else {
          var e = document.getElementById("hover-zoom-end"), c = function(a) {
            for (var b = document.getElementById(a), d = []; b;) {
              d.push(b), b.id = "a-different-id", b = document.getElementById(a);
            }
            for (b = 0; b < d.length; ++b) {
              d[b].id = a;
            }
            return d;
          }("hover-zoom-end");
          chrome.storage.local.get("s_boxHorizontal", function(d) {
            "undefined" == typeof d && (d = {});
            if (null == a) {
              setTimeout(function() {
                g.getPlaceholderAndInsertIFrame(g.insertIFrame);
              }, 2000);
            } else {
              var h = d.s_boxHorizontal, k = window.innerWidth - 50;
              if (!document.getElementById("keepaContainer")) {
                d = 0 < document.location.href.indexOf("/offer-listing/");
                var n = g.getIframeUrl(g.domain, g.ASIN), f = document.createElement("div");
                "0" != h || d ? f.setAttribute("style", "min-width: 935px; width: calc(100% - 30px); height: 500px; display: flex; border:0 none; margin: 10px 0 0;") : (k -= 550, 960 > k && (k = 960), f.setAttribute("style", "min-width: 935px; max-width:" + k + "px;display: flex;  height: 500px; border:0 none; margin: 10px 0 0;"));
                f.setAttribute("id", "keepaContainer");
                var l = document.createElement("iframe");
                h = document.createElement("div");
                h.setAttribute("id", "keepaClear");
                l.setAttribute("style", "width: 100%; height: 100%; border:0 none;overflow: hidden;");
                l.setAttribute("src", n);
                l.setAttribute("scrolling", "no");
                l.setAttribute("id", "keepa");
                p || (p = !0);
                f.appendChild(l);
                k = !1;
                if (!b) {
                  null == a.parentNode || "promotions_feature_div" !== a.parentNode.id && "dp-out-of-stock-top_feature_div" !== a.parentNode.id || (a = a.parentNode);
                  try {
                    var m = a.previousSibling.previousSibling;
                    null != m && "technicalSpecifications_feature_div" == m.id && (a = m);
                  } catch (K) {
                  }
                  0 < c.length && (e = c[c.length - 1]) && "centerCol" != e.parentElement.id && ((m = g.getFirstInDOM([a, e], document.body)) && 600 < m.parentElement.offsetWidth && (a = m), a === e && (k = !0));
                  (m = document.getElementById("title") || document.getElementById("title_row")) && g.getFirstInDOM([a, m], document.body) !== m && (a = m);
                }
                m = document.getElementById("vellumMsg");
                null != m && (a = m);
                m = document.body;
                var r = document.documentElement;
                r = Math.max(m.scrollHeight, m.offsetHeight, r.clientHeight, r.scrollHeight, r.offsetHeight);
                var q = a.offsetTop / r;
                if (0.5 < q || 0 > q) {
                  m = g.getAFComment(m), null != m && (q = a.offsetTop / r, 0.5 > q && (a = m));
                }
                if (a.parentNode) {
                  m = document.querySelector(".container_vertical_middle");
                  d ? (a = document.getElementById("olpTabContent"), a || (a = document.getElementById("olpProduct"), a = a.nextSibling), a.parentNode.insertBefore(f, a)) : "burjPageDivider" == a.id ? (a.parentNode.insertBefore(f, a), b || a.parentNode.insertBefore(h, f.nextSibling)) : "bottomRow" == a.id ? (a.parentNode.insertBefore(f, a), b || a.parentNode.insertBefore(h, f.nextSibling)) : k ? (a.parentNode.insertBefore(f, a.nextSibling), b || a.parentNode.insertBefore(h, f.nextSibling)) : null != 
                  m ? (a = m, a.parentNode.insertBefore(f, a.nextSibling), b || a.parentNode.insertBefore(h, f.nextSibling)) : (a.parentNode.insertBefore(f, a), b || a.parentNode.insertBefore(h, f));
                  g.iframeStorage = l;
                  f.style.display = g.cssFlex;
                  var t = !1, x = 5;
                  if (!C) {
                    var v = setInterval(function() {
                      if (0 >= x--) {
                        clearInterval(v);
                      } else {
                        var a = null != document.getElementById("keepa" + g.ASIN);
                        try {
                          if (!a) {
                            throw g.getPlaceholderAndInsertIFrame(g.insertIFrame), 1;
                          }
                          if (t) {
                            throw 1;
                          }
                          document.getElementById("keepa" + g.ASIN).contentDocument.location = n;
                        } catch (N) {
                          clearInterval(v);
                        }
                      }
                    }, 4000), w = function() {
                      t = !0;
                      l.removeEventListener("load", w, !1);
                      g.synchronizeIFrame();
                    };
                    l.addEventListener("load", w, !1);
                  }
                } else {
                  g.swapIFrame();
                }
              }
            }
          });
        }
      }, handleIFrameMessage:function(a, b, e) {
        switch(a) {
          case "resize":
            c || (c = !0);
            b = "" + b;
            -1 == b.indexOf("px") && (b += "px");
            if (a = document.getElementById("keepaContainer")) {
              a.style.height = b;
            }
            break;
          case "ping":
            e({location:chrome.runtime.id + " " + document.location});
            break;
          case "openPage":
            chrome.runtime.sendMessage({type:"openPage", url:b});
            break;
          case "getToken":
            chrome.runtime.sendMessage({type:"getCookie", key:"token"}, function(a) {
              e({token:a.value});
            });
            break;
          case "setCookie":
            chrome.runtime.sendMessage({type:"setCookie", key:b.key, val:b.val});
        }
      }, synchronizeIFrame:function() {
        var a = 0;
        chrome.storage.local.get("s_boxHorizontal", function(b) {
          "undefined" != typeof b && "undefined" != typeof b.s_boxHorizontal && (a = b.s_boxHorizontal);
        });
        var b = window.innerWidth, e = !1;
        C || window.addEventListener("resize", function() {
          e || (e = !0, window.setTimeout(function() {
            if (b != window.innerWidth && "0" == a) {
              b = window.innerWidth;
              var c = window.innerWidth - 50;
              c -= 550;
              935 > c && (c = 935);
              document.getElementById("keepaContainer").style.width = c;
            }
            e = !1;
          }, 100));
        }, !1);
      }, getFirstInDOM:function(a, b) {
        var e;
        for (b = b.firstChild; b; b = b.nextSibling) {
          if ("IFRAME" !== b.nodeName && 1 === b.nodeType) {
            if (-1 !== a.indexOf(b)) {
              return b;
            }
            if (e = g.getFirstInDOM(a, b)) {
              return e;
            }
          }
        }
        return null;
      }, getClipRect:function(a) {
        "string" === typeof a && (a = document.querySelector(a));
        var b = 0, e = 0, c = function(a) {
          b += a.offsetLeft;
          e += a.offsetTop;
          a.offsetParent && c(a.offsetParent);
        };
        c(a);
        return 0 == e && 0 == b ? g.getClipRect(a.parentNode) : {top:e, left:b, width:a.offsetWidth, height:a.offsetHeight};
      }, findPlaceholderBelowImages:function(a) {
        var b = a, e, c = 100;
        do {
          for (c--, e = null; !e;) {
            e = a.nextElementSibling, e || (e = a.parentNode.nextElementSibling), a = e ? e : a.parentNode.parentNode, !e || "IFRAME" !== e.nodeName && "SCRIPT" !== e.nodeName && 1 === e.nodeType || (e = null);
          }
        } while (0 < c && 100 < g.getClipRect(e).left);
        return e ? e : b;
      }, httpGet:function(a, b) {
        var e = new XMLHttpRequest;
        b && (e.onreadystatechange = function() {
          4 == e.readyState && b.call(this, e.responseText);
        });
        e.open("GET", a, !0);
        e.send();
      }, httpPost2:function(a, b, e, c, d) {
        var h = new XMLHttpRequest;
        c && (h.onreadystatechange = function() {
          4 == h.readyState && c.call(this, h.responseText);
        });
        h.withCredentials = d;
        h.open("POST", a, !0);
        h.setRequestHeader("Content-Type", e);
        h.send(b);
      }, httpPost:function(a, b, c, f) {
        g.httpPost2(a, b, "text/plain;charset=UTF-8", c, f);
      }, lastBugReport:0, reportBug:function(a, b, c) {
        var e = Date.now();
        if (!(6E5 > e - g.lastBugReport || /(dead object)|(Script error)|(\.location is null)/i.test(a))) {
          g.lastBugReport = e;
          e = "";
          try {
            e = Error().stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
            if (!/(keepa|content)\.js/.test(e)) {
              return;
            }
            e = e.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
          } catch (d) {
          }
          if ("object" == typeof a) {
            try {
              a = a instanceof Error ? a.toString() : JSON.stringify(a);
            } catch (d) {
            }
          }
          null == c && (c = {exception:a, additional:b, url:document.location.host, stack:e});
          null != c.url && c.url.startsWith("blob:") || (c.keepaType = G ? "keepaChrome" : f ? "keepaOpera" : q ? "keepaSafari" : t ? "keepaEdge" : "keepaFirefox", c.version = B, chrome.storage.local.get("token", function(a) {
            "undefined" == typeof a && (a = {token:"undefined"});
            g.httpPost("https://dyn.keepa.com/service/bugreport/?user=" + a.token + "&type=" + H, JSON.stringify(c));
          }));
        }
      }};
      window.onerror = function(a, b, c, f, d) {
        if ("string" !== typeof a) {
          d = a.error;
          var e = a.filename || a.fileName;
          c = a.lineno || a.lineNumber;
          f = a.colno || a.columnNumber;
          a = a.message || a.name || d.message || d.name;
        }
        a = a.toString();
        var k = "";
        f = f || 0;
        if (d && d.stack) {
          k = d.stack;
          try {
            k = d.stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
            if (!/(keepa|content)\.js/.test(k)) {
              return;
            }
            k = k.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
          } catch (D) {
          }
        }
        "undefined" === typeof c && (c = 0);
        "undefined" === typeof f && (f = 0);
        a = {msg:a, url:(b || e || document.location.toString()) + ":" + c + ":" + f, stack:k};
        "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(a);
        g.reportBug(null, null, a);
        return !1;
      };
      if (window.self == window.top && (document.addEventListener("DOMContentLoaded", function(a) {
        chrome.runtime.sendMessage({type:"optionalPermissionsRequired"}, function(a) {
          if (!0 === a.value) {
            var b = 0;
            console.log("opr: ", a.value);
            var c = function() {
              10 < b++ && document.body.removeEventListener("click", c);
              chrome.runtime.sendMessage({type:"optionalPermissions"}, function(a) {
                document.body.removeEventListener("click", c);
              });
            };
            document.body.addEventListener("click", c);
          }
        });
      }), !(/.*music\.amazon\..*/.test(document.location.href) || /.*primenow\.amazon\..*/.test(document.location.href) || /.*amazonlive-portal\.amazon\..*/.test(document.location.href) || /.*amazon\.com\/restaurants.*/.test(document.location.href)))) {
        l = function(a) {
          chrome.runtime.sendMessage({type:"sendData", val:{key:"m1", payload:[a]}}, function() {
          });
        };
        var y = document.location.href, v = !1;
        document.addEventListener("DOMContentLoaded", function(a) {
          if (!v) {
            try {
              if (y.startsWith("https://test.keepa.com") || y.startsWith("https://keepa.com")) {
                var b = document.createElement("div");
                b.id = "extension";
                b.setAttribute("type", H);
                b.setAttribute("version", B);
                document.body.appendChild(b);
                v = !0;
              }
            } catch (e) {
            }
          }
        });
        var I = !1;
        y.match(/^htt(p|ps):\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/s\?/) ? (onlyStock = !0, g.onPageLoad()) : /((\/images)|(\/review)|(\/customer-reviews)|(ask\/questions)|(\/product-reviews))/.test(y) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(y) || !(y.match(/^htt(p|ps):\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/[^.]*?(\/|[?&]ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || y.match(/^htt(p|ps):\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/(.*?)\/dp\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))\//) || 
        y.match(/^htt(p|ps):\/\/.*?\.amzn\.(com).*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)) ? y.match(/^htt(p|ps):\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|nl|es|in|com\.mx|com\.br|com\.au)\/[^.]*?\/(wishlist|registry)/) || y.match(/^htt(p|ps):\/\/w*?\.amzn\.(com)[^.]*?\/(wishlist|registry)/) || (y.match("^https?://.*?(?:seller).*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|nl|es|in|com.mx|com.br|com.au)/") ? l("s" + g.getDomain(RegExp.$1)) : y.match(/^https?:\/\/.*?(?:af.?ilia|part|assoc).*?\.amazon\.(de|com|co\.uk|co\.jp|nl|ca|fr|it|es|in|com\.mx|com\.br|com\.au)\/home/) && 
        l("a" + g.getDomain(RegExp.$1))) : (g.onPageLoad(!1), I = !0);
        if (!C) {
          l = /^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/(s([\/?])|gp\/bestsellers\/|gp\/search\/|.*?\/b\/)/;
          (I || y.match(l)) && document.addEventListener("DOMContentLoaded", function(a) {
            var b = null;
            chrome.runtime.sendMessage({type:"getFilters"}, function(a) {
              b = a;
              if (null != b && null != b.value) {
                var c = function() {
                  var b = y.match("^https?://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|com.br|nl|com.mx)/");
                  if (I || b) {
                    var d = g.getDomain(RegExp.$1);
                    scanner.scan(a.value, function(a) {
                      a.key = "f1";
                      a.domainId = d;
                      chrome.runtime.sendMessage({type:"sendData", val:a}, function(a) {
                      });
                    });
                  }
                };
                c();
                var d = document.location.href, e = -1, k = -1, f = -1;
                k = setInterval(function() {
                  d != document.location.href && (d = document.location.href, clearTimeout(f), f = setTimeout(function() {
                    c();
                  }, 2000), clearTimeout(e), e = setTimeout(function() {
                    clearInterval(k);
                  }, 180000));
                }, 2000);
                e = setTimeout(function() {
                  clearInterval(k);
                }, 180000);
              }
            });
          });
          l = document.location.href;
          l.match("^https?://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|nl|com.mx|com.br|com.au)/") && -1 == l.indexOf("aws.amazon.") && -1 == l.indexOf("music.amazon.") && -1 == l.indexOf("services.amazon.") && -1 == l.indexOf("primenow.amazon.") && -1 == l.indexOf("kindle.amazon.") && -1 == l.indexOf("watch.amazon.") && -1 == l.indexOf("developer.amazon.") && -1 == l.indexOf("skills-store.amazon.") && -1 == l.indexOf("pay.amazon.") && document.addEventListener("DOMContentLoaded", function(a) {
            setTimeout(function() {
              chrome.runtime.onMessage.addListener(function(a, c, f) {
                switch(a.key) {
                  case "collectASINs":
                    a = {};
                    var b = !1;
                    c = (document.querySelector("#main") || document.querySelector("#zg") || document.querySelector("#pageContent") || document.querySelector("#wishlist-page") || document.querySelector("#merchandised-content") || document.querySelector("#reactApp") || document.querySelector("[id^='contentGrid']") || document.querySelector("#container") || document.querySelector(".a-container") || document).getElementsByTagName("a");
                    if (void 0 != c && null != c) {
                      for (var e = 0; e < c.length; e++) {
                        var k = c[e].href;
                        /\/images/.test(k) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(k) || !k.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !k.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || (b = RegExp.$2, k = g.getDomain(RegExp.$1), "undefined" === typeof a[k] && (a[k] = []), a[k].includes(b) || a[k].push(b), b = !0);
                      }
                    }
                    if (b) {
                      f(a);
                    } else {
                      return alert("Keepa: No product ASINs found on this page."), !1;
                    }
                    break;
                  default:
                    f({});
                }
              });
              chrome.storage.local.get(["overlayPriceGraph", "webGraphType", "webGraphRange"], function(a) {
                "undefined" == typeof a && (a = {});
                try {
                  var b = a.overlayPriceGraph, c = a.webGraphType;
                  try {
                    c = JSON.parse(c);
                  } catch (r) {
                  }
                  var d = a.webGraphRange;
                  try {
                    d = Number(d);
                  } catch (r) {
                  }
                  var h;
                  if (1 == b) {
                    var k = document.getElementsByTagName("a"), g = 0 < document.location.href.indexOf("/offer-listing/");
                    if (void 0 != k && null != k) {
                      for (h = 0; h < k.length; h++) {
                        var f = k[h].href;
                        /\/images/.test(f) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(f) || !f.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !f.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || (g || -1 == f.indexOf("offer-listing")) && w.add_events(c, d, k[h], f, RegExp.$1, RegExp.$2);
                      }
                    }
                    var l = function(a) {
                      if ("A" == a.nodeName) {
                        var b = a.href;
                        /\/images/.test(b) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(b) || !b.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !b.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || (g || -1 == b.indexOf("offer-listing")) && w.add_events(c, d, a, b, RegExp.$1, RegExp.$2);
                      }
                    }, m = new MutationObserver(function(a) {
                      a.forEach(function(a) {
                        try {
                          if ("childList" === a.type) {
                            for (h = 0; h < a.addedNodes.length; h++) {
                              l(a.addedNodes[h]);
                              for (var b = a.addedNodes[h].children; null != b && "undefined" != b && 0 < b.length;) {
                                for (var c = [], d = 0; d < b.length; d++) {
                                  l(b[d]);
                                  try {
                                    if (b[d].children && 0 < b[d].children.length) {
                                      for (var e = 0; e < b[d].children.length && 30 > e; e++) {
                                        c.push(b[d].children[e]);
                                      }
                                    }
                                  } catch (K) {
                                  }
                                }
                                b = c;
                              }
                            }
                          } else {
                            if (c = a.target.getElementsByTagName("a"), "undefined" != c && null != c) {
                              for (b = 0; b < c.length; b++) {
                                l(c[b]);
                              }
                            }
                          }
                          l(a.target);
                        } catch (K) {
                        }
                      });
                    });
                    m.observe(document.querySelector("html"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                    window.onunload = function F() {
                      try {
                        window.detachEvent("onunload", F), m.disconnect();
                      } catch (O) {
                      }
                    };
                  }
                } catch (r) {
                }
              });
            }, 100);
          });
          var w = {image_urls_main:[], pf_preview_current:"", preview_images:[], tld:"", img_string:'<img style="border: 1px solid #ff9f29;  -moz-border-radius: 0px;  margin: -3px;   display:block;   position: relative;   top: -3px;   left: -3px;" src=\'', createNewImageElement:function(a) {
            a = a.createElement("img");
            a.style.borderTop = "2px solid #ff9f29";
            a.style.borderBottom = "3px solid grey";
            a.style.display = "block";
            a.style.position = "relative";
            a.style.padding = "5px";
            return a;
          }, preview_image:function(a, b, c, g, d, h) {
            try {
              var e = c.originalTarget.ownerDocument;
            } catch (r) {
              e = document;
            }
            if (!e.getElementById("pf_preview")) {
              var f = e.createElement("div");
              f.id = "pf_preview";
              f.addEventListener("mouseout", function(a) {
                w.clear_image(a);
              }, !1);
              f.style.boxShadow = "rgb(68, 68, 68) 0px 1px 7px -2px";
              f.style.position = "fixed";
              f.style.zIndex = "10000000";
              f.style.bottom = "0px";
              f.style.right = "0px";
              f.style.margin = "12px 12px";
              f.style.backgroundColor = "#fff";
              e.body.appendChild(f);
            }
            w.pf_preview_current = e.getElementById("pf_preview");
            if (!w.pf_preview_current.firstChild) {
              f = Math.max(Math.floor(0.3 * e.defaultView.innerHeight), 128);
              var l = Math.max(Math.floor(0.3 * e.defaultView.innerWidth), 128), n = 2;
              if (300 > l || 150 > f) {
                n = 1;
              }
              1000 < l && (l = 1000);
              1000 < f && (f = 1000);
              w.pf_preview_current.current = -1;
              w.pf_preview_current.a = d;
              w.pf_preview_current.href = g;
              w.pf_preview_current.size = Math.floor(1.1 * Math.min(l, f));
              e.defaultView.innerWidth - c.clientX < 1.05 * l && e.defaultView.innerHeight - c.clientY < 1.05 * f && (c = e.getElementById("pf_preview"), c.style.right = "", c.style.left = "6px");
              d = "https://graph.keepa.com/pricehistory.png?type=" + n + "&asin=" + d + "&domain=" + h + "&width=" + l + "&height=" + f;
              d = "undefined" == typeof a ? d + "&amazon=1&new=1&used=1&salesrank=1&range=365" : d + ("&amazon=" + a[0] + "&new=" + a[1] + "&used=" + a[2] + "&salesrank=" + a[3] + "&range=" + b + "&fba=" + a[10] + "&fbm=" + a[7] + "&bb=" + a[18] + "&ld=" + a[8] + "&wd=" + a[9]);
              e.getElementById("pf_preview").style.display = "block";
              var m = w.createNewImageElement(e);
              w.pf_preview_current.appendChild(m);
              fetch(d).then(function(a) {
                try {
                  if ("FAIL" === a.headers.get("screenshot-status")) {
                    return null;
                  }
                } catch (F) {
                }
                return a.blob();
              }).then(function(a) {
                null != a && m.setAttribute("src", URL.createObjectURL(a));
              });
            }
          }, clear_image:function(a) {
            try {
              try {
                var b = a.originalTarget.ownerDocument;
              } catch (n) {
                b = document;
              }
              var c = b.getElementById("pf_preview");
              c.style.display = "none";
              c.style.right = "2px";
              c.style.left = "";
              w.pf_preview_current.innerHTML = "";
            } catch (n) {
            }
          }, add_events:function(a, b, c, f, d, g) {
            0 <= f.indexOf("#") || (w.tld = d, "pf_prevImg" != c.getAttribute("keepaPreview") && (c.addEventListener("mouseover", function(c) {
              w.preview_image(a, b, c, f, g, d);
              return !0;
            }, !0), c.addEventListener("mouseout", function(a) {
              w.clear_image(a);
            }, !1), c.setAttribute("keepaPreview", "pf_prevImg")));
          }};
        }
      }
    }
  }
})();

