/* =====================================================================
   COTIZACIÓN COMPARTIDA — Glaciares Rent a Car
   =====================================================================
   Un solo motor de cálculo para /buscar y /reserva/adicionales, para que
   el cliente vea el MISMO total en cada paso.

   - Todo monto sale de config.js (tarifas confirmadas) o del backend.
   - El total es ESTIMADO: el monto definitivo lo fija el equipo al
     confirmar la disponibilidad (y el backend al generar el enlace de pago).
   - Nunca acumula la promo 4×3 con el descuento por pago anticipado:
     calcula ambas y muestra la más conveniente para el cliente.
   - También guarda la cotización en el navegador (localStorage) para que
     el cliente pueda retomarla al volver de WhatsApp.
   ===================================================================== */
(function () {
  'use strict';
  var cfg = window.GLACIARES_CONFIG || {};
  var MS_DAY = 86400000;

  function money(n) { return '$' + Math.round(n || 0).toLocaleString('es-CL'); }

  /* Fecha local (America/Punta_Arenas en el navegador del cliente). Antes se
     usaba toISOString(), que entrega la fecha UTC: después de las 21:00 en
     Chile "hoy" pasaba a ser mañana y el calendario bloqueaba el día actual. */
  function localISO(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function addDaysISO(iso, n) {
    var p = String(iso).split('-').map(Number);
    var d = new Date(p[0], p[1] - 1, p[2] + n);
    return localISO(d);
  }

  /* Días de arriendo: períodos de 24 h con 1 h de tolerancia (condiciones.html).
     10/11 10:00 → 14/11 10:00 = 4 días · 14/11 10:45 = 4 días · 14/11 12:00 = 5 días. */
  function rentalDays(dFrom, tFrom, dTo, tTo) {
    if (!dFrom || !dTo) return 0;
    var start = new Date(dFrom + 'T' + (tFrom || '00:00') + ':00');
    var end = new Date(dTo + 'T' + (tTo || '00:00') + ':00');
    if (isNaN(start) || isNaN(end)) return 0;
    var diffMin = (end - start) / 60000;
    if (diffMin <= 0) return 0;
    var tol = typeof cfg.RETURN_TOLERANCE_MINUTES === 'number' ? cfg.RETURN_TOLERANCE_MINUTES : 60;
    return Math.max(1, Math.ceil((diffMin - tol) / 1440));
  }

  function daysAhead(pickUpDate, today) {
    var t = String(today || localISO()).split('-').map(Number);
    var p = String(pickUpDate).split('-').map(Number);
    return Math.round((new Date(p[0], p[1] - 1, p[2]) - new Date(t[0], t[1] - 1, t[2])) / MS_DAY);
  }

  var PLACE_ALIASES = { agencia: 'agency_punta_arenas', aeropuerto: 'punta_arenas_airport', hotel: 'hotel_punta_arenas', otro: 'custom_location' };
  function normPlace(id) { return PLACE_ALIASES[id] || id; }

  function airport(pickUpPlace, dropOffPlace) {
    var p = normPlace(pickUpPlace) === 'punta_arenas_airport';
    var d = normPlace(dropOffPlace) === 'punta_arenas_airport';
    var leg = cfg.AIRPORT_FEE_LEG || 20000;
    var rt = cfg.AIRPORT_FEE_ROUNDTRIP || 30000;
    if (p && d) return { type: 'airport_roundtrip', amount: rt, label: 'Servicio en aeropuerto (retiro y devolución)' };
    if (p) return { type: 'airport_pickup_only', amount: leg, label: 'Servicio en aeropuerto (retiro)' };
    if (d) return { type: 'airport_dropoff_only', amount: leg, label: 'Servicio en aeropuerto (devolución)' };
    return { type: 'no_airport_service', amount: 0, label: null };
  }

  /* Costo de un adicional, con la misma regla del backend (verificada contra
     POST /api/quote el 2026-10-03): por día × días (con tope por unidad si
     tiene cap), o único; si el precio es "+ IVA" se suma el 19 %. */
  function extraLine(def, qty, days) {
    var vatRate = typeof cfg.VAT_RATE === 'number' ? cfg.VAT_RATE : 0.19;
    var type = def.chargeType || def.unit;
    var perUnit = type === 'day' ? def.price * days : def.price;
    if (def.cap) perUnit = Math.min(perUnit, def.cap);
    var net = perUnit * qty;
    var vat = def.vatIncluded === false ? Math.round(net * vatRate) : 0;
    return { id: def.id, name: def.name, qty: qty, net: net, vat: vat, cost: net + vat, perDay: type === 'day' };
  }

  function promo4x3Info(days, pricePerDay, pickUpDate, today) {
    var p = cfg.PROMO_4X3 || {};
    var out = { eligible: false, savings: 0, freeDays: 0, reason: '' };
    if (!p.activa) { out.reason = 'inactiva'; return out; }
    var min = p.diasMinimos || 4;
    if (days < min) { out.reason = 'dias'; return out; }
    if (p.validaHasta) {
      var ref = p.vigenciaSegun === 'reserva' ? (today || localISO()) : pickUpDate;
      if (ref > p.validaHasta) { out.reason = 'vigencia'; return out; }
    }
    if ((p.viajeDesde && pickUpDate < p.viajeDesde) || (p.viajeHasta && pickUpDate > p.viajeHasta)) { out.reason = 'periodo'; return out; }
    var free = (p.diasGratis || 1) * (p.repetir ? Math.floor(days / min) : 1);
    out.eligible = true; out.freeDays = free; out.savings = free * pricePerDay;
    return out;
  }

  function earlyInfo(days, base, pickUpDate, today, backendPct) {
    var e = cfg.EARLY_BOOKING || {};
    // Reglas del sitio (confirmadas por el dueño): siempre se exigen, aunque el
    // backend todavía tenga otra anticipación configurada.
    var ok = daysAhead(pickUpDate, today) >= (e.minDaysAhead || 0) && days >= (e.minRentalDays || 1);
    var pct = !ok ? 0 : (typeof backendPct === 'number' ? backendPct : (e.pct || 0));
    return { eligible: pct > 0, pct: pct, savings: pct > 0 ? Math.round(base * pct / 100) : 0 };
  }

  /* -------------------------------------------------------------------
     compute(input) → desglose completo.
     input: { vehicle:{id,name,price,deposit}, pickUpDate, pickUpTime,
              dropOffDate, dropOffTime, pickUpPlace, dropOffPlace,
              argentina:'si'|'no', extras:[{id,qty}], catalog:[...],
              backendDiscountPct?: number, today?: 'YYYY-MM-DD' }
     ------------------------------------------------------------------- */
  function compute(input) {
    var v = input.vehicle;
    var days = rentalDays(input.pickUpDate, input.pickUpTime, input.dropOffDate, input.dropOffTime);
    var base = v.price * days;
    var air = airport(input.pickUpPlace, input.dropOffPlace);
    var catalog = input.catalog || cfg.EXTRAS_FALLBACK || [];
    var lines = [];
    (input.extras || []).forEach(function (sel) {
      var def = catalog.find(function (c) { return c.id === sel.id; });
      if (def && sel.qty > 0) lines.push(extraLine(def, sel.qty, days));
    });
    if (input.argentina === 'si') {
      var arg = catalog.find(function (c) { return c.isArgentinaPermit; });
      if (arg && !lines.some(function (l) { return l.id === arg.id; })) lines.push(extraLine(arg, 1, days));
    }
    var extrasTotal = lines.reduce(function (s, l) { return s + l.cost; }, 0);
    var normal = base + air.amount + extrasTotal;

    var p4 = promo4x3Info(days, v.price, input.pickUpDate, input.today);
    var early = earlyInfo(days, base, input.pickUpDate, input.today, input.backendDiscountPct);

    // Promo que se aplica al total principal: la 4×3 (vale con abono o pago total).
    // El 15 % exige pagar el 100 % por adelantado, así que se ofrece como alternativa
    // solo si ahorra MÁS que la 4×3. Nunca se suman.
    var applied = null;
    if (p4.eligible) applied = { kind: '4x3', savings: p4.savings, label: 'Promo 4×3 (' + p4.freeDays + ' día' + (p4.freeDays > 1 ? 's' : '') + ' sin costo)' };
    var total = normal - (applied ? applied.savings : 0);
    var prepay = null;
    if (early.eligible && early.savings > (applied ? applied.savings : 0)) {
      prepay = { pct: early.pct, savings: early.savings, total: normal - early.savings,
        extraSavings: early.savings - (applied ? applied.savings : 0) };
    }
    var deposit = Math.min(v.price, total); // abono = 1 día de arriendo (backend)
    var guarantee = input.argentina === 'si' ? (cfg.ARGENTINA_GUARANTEE || 750000) : (v.deposit || cfg.MIN_DEPOSIT || 500000);

    return {
      days: days, pricePerDay: v.price, base: base, airport: air, extras: lines,
      extrasTotal: extrasTotal, normal: normal, promo4x3: p4, early: early,
      applied: applied, total: total, prepay: prepay,
      deposit: deposit, balance: total - deposit, guarantee: guarantee,
      argentinaGuarantee: input.argentina === 'si',
    };
  }

  /* ---------------- Cotización guardada (retomar) ---------------- */
  var DRAFT_KEY = 'glaciares_cotizacion';
  function saveDraft(d) {
    try { d.savedAt = Date.now(); localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch (e) { /* sin almacenamiento */ }
  }
  function loadDraft() {
    try {
      var d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (!d || !d.state || !d.state.pickUpDate) return null;
      if (d.state.pickUpDate < localISO()) return null; // ya pasó la fecha de retiro
      if (Date.now() - (d.savedAt || 0) > 30 * MS_DAY) return null;
      return d;
    } catch (e) { return null; }
  }
  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) {} }

  /* Firma de la cotización: si el cliente vuelve a pulsar el botón con la
     misma cotización, se reutiliza el código y NO se vuelve a medir la
     conversión ni a crear otra solicitud en el panel. */
  function signature(d) {
    var s = d.state || {};
    return [d.vehicleId, s.pickUpDate, s.pickUpTime, s.dropOffDate, s.dropOffTime, s.pickUpPlace, s.dropOffPlace, s.argentina,
      JSON.stringify((d.extras || []).slice().sort(function (a, b) { return a.id - b.id; }))].join('|');
  }

  /* Banner "Tienes una cotización guardada" para la portada y /buscar. */
  function renderResumeBanner(opts) {
    opts = opts || {};
    var d = loadDraft();
    if (!d || !d.resumeUrl) return;
    var host = document.createElement('div');
    host.className = 'gq-resume';
    host.setAttribute('role', 'region');
    host.setAttribute('aria-label', 'Cotización guardada');
    var status = d.requestCode ? ('Solicitud ' + d.requestCode + ' · pendiente de confirmación') : 'Aún no enviada';
    host.innerHTML =
      '<div class="gq-resume-in"><div><strong>Tienes una cotización guardada</strong>' +
      '<span>' + escapeHtml(d.vehicleName || '') + ' · ' + escapeHtml(d.summaryDates || '') + ' · ' + money(d.total) + ' · ' + escapeHtml(status) + '</span></div>' +
      '<div class="gq-resume-actions"><a class="gq-resume-go" href="' + escapeHtml(d.resumeUrl) + '">Retomar cotización</a>' +
      '<button type="button" class="gq-resume-x" aria-label="Descartar cotización guardada">✕</button></div></div>';
    var css = document.createElement('style');
    css.textContent = '.gq-resume{position:relative;z-index:40;background:#eff9ff;border-bottom:1px solid #bfe9f7;margin-top:' + (opts.offsetTop || 68) + 'px}' +
      '.gq-resume-in{max-width:1180px;margin:0 auto;padding:10px 20px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;font-size:13px;color:#0A2540}' +
      '.gq-resume-in span{display:block;color:#475569;font-size:12.5px;margin-top:2px}' +
      '.gq-resume-actions{display:flex;gap:8px;align-items:center}' +
      '.gq-resume-go{background:#0A2540;color:#fff;font-weight:700;padding:10px 14px;border-radius:10px;min-height:44px;display:inline-flex;align-items:center}' +
      '.gq-resume-x{width:44px;height:44px;border-radius:10px;color:#475569;font-size:16px}';
    document.head.appendChild(css);
    var anchor = opts.insertBefore || document.querySelector('main') || document.body.firstChild;
    anchor.parentNode.insertBefore(host, anchor);
    host.querySelector('.gq-resume-x').addEventListener('click', function () { clearDraft(); host.remove(); });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  window.GlaciaresCotizacion = {
    money: money, localISO: localISO, addDaysISO: addDaysISO, rentalDays: rentalDays,
    daysAhead: daysAhead, airport: airport, extraLine: extraLine, compute: compute,
    promo4x3Info: promo4x3Info, saveDraft: saveDraft, loadDraft: loadDraft,
    clearDraft: clearDraft, signature: signature, renderResumeBanner: renderResumeBanner,
    escapeHtml: escapeHtml,
  };
})();
