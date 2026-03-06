/* ═══════════════════════════════════════════════════════
   WITHOUT A CLASP — Prices Page Renderer
   Reads WAC_PRICES (or localStorage override) and
   renders the price grid and add-ons into the page.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Load data (localStorage override for admin live preview) ── */
  var data;
  try {
    var stored = localStorage.getItem('wac_prices');
    data = (stored) ? JSON.parse(stored) : WAC_PRICES;
  } catch (e) {
    data = WAC_PRICES;
  }

  /* ── SVG icon sets ────────────────────────────────────────────── */
  var CARD_ICONS = {
    bracelet: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="11" stroke="#C9A84C" stroke-width="1"/><circle cx="14" cy="14" r="3.5" fill="#C9A84C" opacity="0.3"/></svg>',
    anklet:   '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><ellipse cx="14" cy="16" rx="11" ry="8" stroke="#C9A84C" stroke-width="1"/><line x1="14" y1="2" x2="14" y2="8" stroke="#C9A84C" stroke-width="1"/></svg>',
    necklace: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M5 4 Q14 18 23 4" stroke="#C9A84C" stroke-width="1" fill="none"/><circle cx="14" cy="20" r="3.5" stroke="#C9A84C" stroke-width="1" fill="none"/></svg>',
    ring:     '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="10" stroke="#C9A84C" stroke-width="1"/><circle cx="14" cy="14" r="6" stroke="#C9A84C" stroke-width="0.5" opacity="0.5"/></svg>'
  };

  var ADDON_ICONS = {
    star:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polygon points="12,2 14,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 10,9" stroke="#C9A84C" stroke-width="1" fill="none"/></svg>',
    heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#C9A84C" stroke-width="1" fill="none"/></svg>',
    stone: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="#C9A84C" stroke-width="1"/><circle cx="12" cy="12" r="9" stroke="#C9A84C" stroke-width="0.5" stroke-dasharray="2 3"/></svg>',
    weld:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="#C9A84C" stroke-width="1"/><path d="M8 12 L11 15 L16 9" stroke="#C9A84C" stroke-width="1.2"/></svg>'
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function badgesForRows(rows) {
    var out = [];
    rows.forEach(function (r) {
      if (r.poa) return;
      var m = r.material.toLowerCase();
      if (m.indexOf('silver') > -1)              out.push('<span class="badge badge-silver">Silver</span>');
      else if (m.indexOf('fill') > -1)           out.push('<span class="badge badge-gold-fill">Gold Fill</span>');
      else if (m.indexOf('solid') > -1 || m.indexOf('14k') > -1) out.push('<span class="badge badge-solid">14k Gold</span>');
    });
    return out.join('');
  }

  /* ── Render price cards ───────────────────────────────────────── */
  var grid = document.getElementById('priceGrid');
  if (grid && data.cards) {
    grid.innerHTML = data.cards.map(function (card, i) {
      var delay = (i % 2 === 1) ? ' delay-1' : '';
      var icon  = CARD_ICONS[card.icon] || CARD_ICONS.bracelet;

      var rows = card.rows.map(function (row) {
        var priceHtml = row.poa
          ? '<span class="price-amount" style="font-size:14px;color:#aaa">POA</span>'
          : '<span class="price-amount"><sup>£</sup>' + esc(row.price) + '</span>';
        var style = row.poa ? ' style="opacity:0.45"' : '';
        return '<div class="price-row"' + style + '>'
          + '<div class="price-row__left">'
          + '<span class="price-item-name">' + esc(row.name) + '</span>'
          + '<span class="price-item-note">' + esc(row.material) + '</span>'
          + '</div>' + priceHtml + '</div>';
      }).join('');

      return '<div class="price-card fade-in' + delay + '">'
        + '<div class="price-card__head">'
        + '<div class="price-card__title">' + esc(card.title) + '</div>'
        + '<div class="price-card__icon">' + icon + '</div>'
        + '</div>'
        + '<div class="price-card__body">' + rows + '</div>'
        + '<div class="material-bar"><span class="material-bar__label">Available in:</span>'
        + badgesForRows(card.rows) + '</div>'
        + '</div>';
    }).join('');
  }

  /* ── Render add-ons ──────────────────────────────────────────── */
  var addonsGrid = document.getElementById('addonsGrid');
  if (addonsGrid && data.addons) {
    var delays = ['', ' delay-1', ' delay-2', ' delay-3'];
    addonsGrid.innerHTML = data.addons.map(function (addon, i) {
      var icon = ADDON_ICONS[addon.icon] || ADDON_ICONS.star;
      return '<div class="addon fade-in' + (delays[i] || '') + '">'
        + '<div class="addon__icon">' + icon + '</div>'
        + '<div class="addon__name">' + esc(addon.name) + '</div>'
        + '<div class="addon__price">' + esc(addon.price) + '</div>'
        + '<div class="addon__desc">' + esc(addon.desc) + '</div>'
        + '</div>';
    }).join('');
  }

})();
