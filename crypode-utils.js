/**
 * Crypode Utils — shared across all pages
 * Cookie/privacy banner · Reading time · Affiliate click tracking
 */
(function () {
  'use strict';

  /* ── 1. COOKIE / PRIVACY BANNER ───────────────────────────────── */
  var PRIVACY_KEY = 'crypode_privacy_ok';

  function showCookieBanner() {
    try { if (localStorage.getItem(PRIVACY_KEY)) return; } catch (e) { return; }

    var b = document.createElement('div');
    b.id = 'crypode-cookie-banner';
    b.style.cssText = [
      'position:fixed;bottom:0;left:0;right:0;z-index:9999',
      'background:#141414;border-top:1px solid rgba(201,168,76,0.3)',
      'padding:12px 24px;display:flex;align-items:center',
      'justify-content:space-between;gap:16px;flex-wrap:wrap',
      'font-family:Tajawal,sans-serif;font-size:0.82rem;color:#EDE8DF',
      'box-shadow:0 -4px 24px rgba(0,0,0,0.5)'
    ].join(';');

    b.innerHTML =
      '<span style="flex:1;min-width:200px">' +
        'We use minimal cookies and only collect your email when you subscribe. ' +
        '<a href="/privacy.html" style="color:#C9A84C;text-decoration:none;font-weight:600">' +
          'Privacy Policy</a>' +
      '</span>' +
      '<button id="crypode-accept-btn" style="' +
        'background:#C9A84C;color:#0D0D0D;border:none;padding:9px 22px;' +
        'font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;' +
        'cursor:pointer;white-space:nowrap;border-radius:2px;' +
        'font-family:Tajawal,sans-serif;flex-shrink:0' +
      '">Accept</button>';

    document.body.appendChild(b);

    document.getElementById('crypode-accept-btn').addEventListener('click', function () {
      try { localStorage.setItem(PRIVACY_KEY, '1'); } catch (e) {}
      b.style.display = 'none';
    });
  }

  /* ── 2. READING TIME ───────────────────────────────────────────── */
  function calcReadTime() {
    var container = document.querySelector('.article-body') ||
                    document.querySelector('#article-content') ||
                    document.querySelector('article');
    if (!container) return;

    var text  = (container.innerText || container.textContent || '').trim();
    var words = text.split(/\s+/).filter(function (w) { return w.length > 0; }).length;
    var mins  = Math.max(1, Math.round(words / 200));

    // Update any span inside .article-meta that already says "X min read"
    var spans = document.querySelectorAll('.article-meta span');
    for (var i = 0; i < spans.length; i++) {
      if (/\d+\s*min\s*read/i.test(spans[i].textContent)) {
        spans[i].textContent = mins + ' min read';
        break;
      }
    }
  }

  /* ── 3. AFFILIATE CLICK TRACKING ──────────────────────────────── */
  var TRACK_URL = 'https://script.google.com/macros/s/AKfycbxYdr-n5PGzgOLQhDQPUnRb8YSwZqGBjsREku66Aw2Sk4cnePNvGYrBNMTQIFF0v8M/exec';

  var AFFILIATES = [
    { re: /binance\.com/,          name: 'Binance'      },
    { re: /bybit\.com\/invite/,    name: 'Bybit'        },
    { re: /mexc\.com|promote\.mexc/, name: 'MEXC'       },
    { re: /bitrue\.com/,           name: 'Bitrue'       },
    { re: /nexo\.sjv/,             name: 'Nexo'         },
    { re: /airwallex\.sjv/,        name: 'Airwallex'    },
    { re: /hostinger\.sjv/,        name: 'Hostinger'    },
    { re: /preply\.sjv/,           name: 'Preply'       },
    { re: /invideo\.sjv/,          name: 'InVideo'      },
    { re: /rewarxlimited\.pxf/,    name: 'Rewarx'       },
    { re: /elementpackpro\.sjv/,   name: 'ElementPack'  },
    { re: /metabox\.sjv/,          name: 'MetaBox'      },
    { re: /eurodns\.pxf/,          name: 'EuroDNS'      },
    { re: /martinic\.evyy/,        name: 'Martinic'     },
    { re: /sentrypc\.7eer/,        name: 'SentryPC'     },
    { re: /jalbum-affiliate/,      name: 'JAlbum'       },
  ];

  function trackAffiliateLinks() {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      AFFILIATES.forEach(function (aff) {
        if (!link._crypodeTracked && aff.re.test(href)) {
          link._crypodeTracked = true;
          link.addEventListener('click', function () {
            try {
              fetch(TRACK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: [
                  'action=click',
                  'affiliate=' + encodeURIComponent(aff.name),
                  'url='       + encodeURIComponent(href),
                  'page='      + encodeURIComponent(location.pathname),
                  'ts='        + encodeURIComponent(new Date().toISOString())
                ].join('&')
              }).catch(function () {});
            } catch (e) {}
          });
        }
      });
    });
  }

  /* ── INIT ──────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    showCookieBanner();
    calcReadTime();
    trackAffiliateLinks();
  }

})();
