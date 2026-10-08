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

  /* ---------------- Cotización guardada (retomar) ----------------
     Formato en localStorage (clave `glaciares_cotizacion`):
       { vehicleId, vehicleName, state, extras, flight, total, summaryDates,
         resumeUrl, sig, savedAt,
         quotes: { [firma]: { code, requestCode, registered, createdAt, total,
                              waOpenedAt, emailSentTo:[...], tracked:{...} } } }
     `quotes` guarda el código de CADA combinación (vehículo + fechas + lugares
     + adicionales). Si el cliente quita un adicional y lo vuelve a poner, o
     vuelve desde WhatsApp, o recarga, se reutiliza el mismo código: nunca se
     crea otro registro ni se repiten los eventos de medición. */
  var DRAFT_KEY = 'glaciares_cotizacion';
  var MAX_QUOTES = 8;
  function migrateDraft(d) {
    if (!d) return d;
    if (!d.quotes) d.quotes = {};
    // Versión anterior (oct 2026): quoteCode/requestCode/sentAt sueltos.
    if (d.sig && (d.quoteCode || d.requestCode) && !d.quotes[d.sig]) {
      d.quotes[d.sig] = {
        code: d.requestCode || d.quoteCode, requestCode: d.requestCode || null,
        registered: !!d.requestCode, createdAt: d.sentAt || d.savedAt || Date.now(),
        total: d.total, waOpenedAt: d.sentAt || null, emailSentTo: [],
        tracked: { generada: true, whatsapp: !!d.sentAt, email: [] },
      };
    }
    delete d.quoteCode; delete d.requestCode; delete d.sentAt;
    return d;
  }
  function saveDraft(d) {
    try {
      d.savedAt = Date.now();
      var keys = Object.keys(d.quotes || {});
      if (keys.length > MAX_QUOTES) {
        keys.sort(function (a, b) { return (d.quotes[a].createdAt || 0) - (d.quotes[b].createdAt || 0); })
          .slice(0, keys.length - MAX_QUOTES).forEach(function (k) { if (k !== d.sig) delete d.quotes[k]; });
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch (e) { /* sin almacenamiento */ }
  }
  function loadDraft() {
    try {
      var d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (!d || !d.state || !d.state.pickUpDate) return null;
      if (d.state.pickUpDate < localISO()) return null; // ya pasó la fecha de retiro
      if (Date.now() - (d.savedAt || 0) > 30 * MS_DAY) return null;
      return migrateDraft(d);
    } catch (e) { return null; }
  }
  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) {} }
  /* Cotización (con código) de la combinación actual, o null si aún no se generó. */
  function currentQuote(d) { return d && d.quotes && d.sig ? (d.quotes[d.sig] || null) : null; }

  /* ---------------- Textos compartidos (página, WhatsApp, correo) ----------------
     Se usan en el navegador y también en la función del servidor que envía el
     correo, para que el cliente vea exactamente los mismos datos en todas partes. */
  var PLACE_LABELS = {
    agency_punta_arenas: 'Agencia en Punta Arenas (ciudad)',
    punta_arenas_airport: 'Aeropuerto Presidente Carlos Ibáñez del Campo',
    hotel_punta_arenas: 'Hotel o alojamiento en Punta Arenas (sujeto a confirmación)',
    custom_location: 'Otro lugar (sujeto a evaluación)',
  };
  var PLACE_SHORT = {
    agency_punta_arenas: 'Agencia (Punta Arenas)',
    punta_arenas_airport: 'Aeropuerto de Punta Arenas',
    hotel_punta_arenas: 'Hotel en Punta Arenas',
    custom_location: 'Otro lugar',
  };
  function placeLabel(id, other, short) {
    var n = normPlace(id);
    if (n === 'custom_location') return other ? String(other) : (short ? 'Otro lugar' : 'Otro lugar (sin especificar)');
    return (short ? PLACE_SHORT[n] : PLACE_LABELS[n]) || String(id || '');
  }
  function destinationLabel(st) {
    if (!st || !st.destination) return '';
    if (st.destination === 'otro') return st.destinationOther || 'Otro destino';
    var found = (cfg.DESTINATIONS || []).find(function (x) { return x.id === st.destination; });
    return found ? found.label : st.destination;
  }
  /* "20/10/2026 a las 09:00" */
  function fechaHora(dateStr, timeStr) {
    var p = String(dateStr || '').split('-');
    var f = p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : String(dateStr || '');
    return f + (timeStr ? ' a las ' + timeStr : '');
  }
  function isArgentinaLine(line, catalog) {
    var def = (catalog || cfg.EXTRAS_FALLBACK || []).find(function (c) { return c.id === line.id; });
    return def ? !!def.isArgentinaPermit : /argentina/i.test(line.name || '');
  }
  /* Adicionales elegidos por el cliente (sin el permiso de Argentina, que se informa aparte). */
  function extrasNames(c, catalog) {
    return c.extras.filter(function (l) { return !isArgentinaLine(l, catalog); })
      .map(function (l) { return l.name + (l.qty > 1 ? ' ×' + l.qty : ''); });
  }
  /* ¿Se informan los lugares en el mensaje corto? Solo si son distintos entre sí
     o si alguno es el aeropuerto o un hotel. */
  function placesWorthMentioning(st) {
    var p = normPlace(st.pickUpPlace), d = normPlace(st.dropOffPlace);
    var special = { punta_arenas_airport: 1, hotel_punta_arenas: 1 };
    return p !== d || !!special[p] || !!special[d] || p === 'custom_location';
  }

  /* Mensaje BREVE de WhatsApp. Sin conceptos vacíos, sin garantía, sin abonos ni
     totales repetidos: ese detalle queda en la página y en el correo.
     q = { vehicleName, state, catalog? } · c = compute(...) · code = código */
  function whatsappMessage(q, c, code) {
    var st = q.state || {};
    var lines = ['Hola, quiero confirmar disponibilidad:'];
    if (code) lines.push('Cotización: ' + code);
    lines.push('Vehículo: ' + q.vehicleName);
    lines.push('Retiro: ' + fechaHora(st.pickUpDate, st.pickUpTime));
    lines.push('Devolución: ' + fechaHora(st.dropOffDate, st.dropOffTime));
    if (placesWorthMentioning(st)) {
      lines.push('Lugar de retiro: ' + placeLabel(st.pickUpPlace, '', true));
      lines.push('Lugar de devolución: ' + placeLabel(st.dropOffPlace, st.dropOffOther, true));
    }
    if (st.argentina === 'si') lines.push('Viaje a Argentina: sí');
    var ex = extrasNames(c, q.catalog);
    if (ex.length) lines.push('Adicionales: ' + ex.join(', '));
    lines.push('Total estimado: ' + money(c.total));
    lines.push('¿Está disponible?');
    return lines.join('\n');
  }

  var PENDING_NOTICE = 'Esta cotización está pendiente de confirmación. El vehículo queda reservado solamente después de que Glaciares Rent a Car confirme la disponibilidad y se pague el abono o el total correspondiente.';

  /* Detalle completo como filas [etiqueta, valor] (correo y "Copiar cotización"). */
  function detailRows(q, c, code) {
    var st = q.state || {};
    var rows = [];
    if (code) rows.push(['Código de cotización', code]);
    rows.push(['Vehículo', q.vehicleName]);
    rows.push(['Retiro', fechaHora(st.pickUpDate, st.pickUpTime) + ' · ' + placeLabel(st.pickUpPlace)]);
    rows.push(['Devolución', fechaHora(st.dropOffDate, st.dropOffTime) + ' · ' + placeLabel(st.dropOffPlace, st.dropOffOther)]);
    rows.push(['Duración', c.days + ' día' + (c.days > 1 ? 's' : '')]);
    if (st.passengers) rows.push(['Pasajeros', String(st.passengers)]);
    var dest = destinationLabel(st);
    if (dest) rows.push(['Destino', dest]);
    if (st.argentina === 'si') rows.push(['Viaje a Argentina', 'Sí']);
    return rows;
  }
  /* Desglose de precio como filas [concepto, monto, nota?]. */
  function priceRows(c) {
    var rows = [['Arriendo: ' + c.days + ' día' + (c.days > 1 ? 's' : '') + ' × ' + money(c.pricePerDay), money(c.base)]];
    if (c.applied) rows.push([c.applied.label, '−' + money(c.applied.savings)]);
    if (c.airport.amount > 0) rows.push([c.airport.label, money(c.airport.amount)]);
    c.extras.forEach(function (e) {
      rows.push([e.name + (e.qty > 1 ? ' ×' + e.qty : '') + (e.perDay ? ' (' + c.days + ' día' + (c.days > 1 ? 's' : '') + ')' : ''),
        money(e.cost), e.vat > 0 ? 'Neto ' + money(e.net) + ' + IVA ' + money(e.vat) : '']);
    });
    return rows;
  }
  function promoText(c) {
    return c.applied ? c.applied.label + ': −' + money(c.applied.savings) : 'Ninguna';
  }
  function guaranteeText(c) {
    return money(c.guarantee) + ' con tarjeta de crédito' + (c.argentinaGuarantee ? ' (viaje a Argentina)' : '') +
      '. No es un pago del arriendo, no se cobra al reservar y se libera al recibir el vehículo conforme.';
  }

  /* Texto plano completo (botón "Copiar cotización" y versión de texto del correo). */
  function quoteText(q, c, code) {
    var out = ['Cotización Glaciares Rent a Car', ''];
    detailRows(q, c, code).forEach(function (r) { out.push(r[0] + ': ' + r[1]); });
    var ex = extrasNames(c, q.catalog);
    out.push('Servicios adicionales: ' + (ex.length ? ex.join(', ') : 'ninguno'));
    out.push('');
    priceRows(c).forEach(function (r) { out.push(r[0] + ': ' + r[1] + (r[2] ? ' (' + r[2] + ')' : '')); });
    out.push('Promoción aplicada: ' + promoText(c));
    out.push('TOTAL ESTIMADO: ' + money(c.total));
    out.push('Abono necesario para reservar: ' + money(c.deposit));
    out.push('Saldo pendiente (al retirar): ' + money(c.balance));
    if (c.prepay) out.push('Alternativa pagando el 100 % por adelantado (−' + c.prepay.pct + '% en el arriendo): ' + money(c.prepay.total));
    out.push('Garantía (informativa, aparte del precio): ' + guaranteeText(c));
    out.push('');
    out.push(PENDING_NOTICE);
    return out.join('\n');
  }

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
    var q = currentQuote(d);
    var code = q ? q.code : '';
    var line = [d.vehicleName || '', d.summaryDates || '', money(q && q.total ? q.total : d.total)].filter(Boolean).join(' · ');
    var host = document.createElement('div');
    host.className = 'gq-resume';
    host.setAttribute('role', 'region');
    host.setAttribute('aria-label', 'Cotización guardada');
    host.innerHTML =
      '<div class="gq-resume-in"><div><strong>Tienes una cotización guardada</strong>' +
      (code ? '<span>Código: <b>' + escapeHtml(code) + '</b></span>' : '') +
      '<span>' + escapeHtml(line) + '</span>' +
      '<span class="gq-resume-st">Estado: Pendiente de envío o confirmación</span></div>' +
      '<div class="gq-resume-actions"><a class="gq-resume-go" href="' + escapeHtml(d.resumeUrl) + '">Retomar cotización</a>' +
      '<button type="button" class="gq-resume-x" aria-label="Descartar cotización guardada">✕</button></div></div>';
    var css = document.createElement('style');
    css.textContent = '.gq-resume{position:relative;z-index:40;background:#eff9ff;border-bottom:1px solid #bfe9f7;margin-top:' + (opts.offsetTop || 68) + 'px}' +
      '.gq-resume-in{max-width:1180px;margin:0 auto;padding:10px 20px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;font-size:13px;color:#0A2540}' +
      '.gq-resume-in span{display:block;color:#475569;font-size:12.5px;margin-top:2px}' +
      '.gq-resume-in .gq-resume-st{color:#92400e;font-weight:700}' +
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
    escapeHtml: escapeHtml, currentQuote: currentQuote, placeLabel: placeLabel,
    destinationLabel: destinationLabel, fechaHora: fechaHora, extrasNames: extrasNames,
    whatsappMessage: whatsappMessage, quoteText: quoteText, detailRows: detailRows,
    priceRows: priceRows, promoText: promoText, guaranteeText: guaranteeText,
    PENDING_NOTICE: PENDING_NOTICE,
  };
})();
