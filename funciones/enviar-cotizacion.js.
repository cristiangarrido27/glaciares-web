/* =====================================================================
   FUNCIÓN DEL SERVIDOR (Netlify Functions): enviar la cotización por correo
   =====================================================================
   Ruta pública: POST /.netlify/functions/enviar-cotizacion

   - La clave del proveedor de correo vive SOLO en variables de entorno de
     Netlify (nunca en el navegador). Proveedor: Resend (https://resend.com),
     una llamada HTTPS sin dependencias.
   - El total NO se toma del navegador: se recalcula aquí con el mismo motor
     del sitio (config.js + cotizacion.js), así el correo no puede llevar
     precios alterados.
   - Envía 2 correos: al cliente y una copia a Glaciares marcada como
     "Nueva solicitud de disponibilidad". Usa claves de idempotencia, así un
     reintento NUNCA duplica correos.
   - Protecciones: solo POST, origen permitido, tamaño máximo, campo trampa
     anti-robots, consentimiento obligatorio, validación estricta de todos los
     campos (sin enlaces en textos libres) y límite de envíos por IP y correo.

   Variables de entorno (Netlify → Site configuration → Environment variables):
     RESEND_API_KEY      obligatoria. Clave de la API de Resend.
     EMAIL_FROM          obligatoria. Ej.: "Glaciares Rent a Car <cotizaciones@glaciaresrentacar.cl>"
                         (el dominio debe estar verificado en Resend).
     EMAIL_BUSINESS_TO   obligatoria. Casilla que recibe la copia (ej.: glaciaresrentacar@gmail.com).
     EMAIL_MODE          "live" envía al cliente. Cualquier otro valor (o vacío) = modo
                         PRUEBA: todo se desvía a EMAIL_TEST_TO con asunto [PRUEBA].
     EMAIL_TEST_TO       casilla de pruebas (si falta, se usa EMAIL_BUSINESS_TO).
     EMAIL_REPLY_TO      opcional. Respuesta del cliente (por defecto EMAIL_BUSINESS_TO).
     ALLOWED_ORIGINS     opcional. Orígenes permitidos separados por coma.
     SITE_URL            opcional. Por defecto https://www.glaciaresrentacar.cl
   ===================================================================== */
'use strict';

process.env.TZ = 'America/Punta_Arenas'; // "hoy" con la fecha de Chile (promo 4×3, fechas)
// config.js y cotizacion.js son scripts del navegador: escriben en `window`.
globalThis.window = globalThis.window || {};
require('../config.js');
require('../cotizacion.js');

const CFG = globalThis.window.GLACIARES_CONFIG;
const G = globalThis.window.GlaciaresCotizacion;

const SITE_URL = (process.env.SITE_URL || 'https://www.glaciaresrentacar.cl').replace(/\/+$/, '');
const DEFAULT_ORIGINS = [
  'https://www.glaciaresrentacar.cl', 'https://glaciaresrentacar.cl', 'https://glaciares-web.netlify.app',
];
const MAX_BODY = 12000;
const RATE = { ipMax: 6, emailMax: 4, windowMs: 15 * 60 * 1000 };
const hits = new Map(); // límite "best effort" por instancia de la función

/* ---------------- utilidades ---------------- */
function json(status, body, origin) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  if (origin) { headers['Access-Control-Allow-Origin'] = origin; headers.Vary = 'Origin'; }
  return { statusCode: status, headers, body: JSON.stringify(body) };
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function allowedOrigin(origin) {
  if (!origin) return null;
  const list = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const all = list.length ? list : DEFAULT_ORIGINS;
  if (all.includes(origin)) return origin;
  // Vistas previas de Netlify (deploy-preview-12--glaciares-web.netlify.app)
  if (/^https:\/\/[a-z0-9-]+--glaciares-web\.netlify\.app$/.test(origin)) return origin;
  // Desarrollo local con `netlify dev`
  if (process.env.NETLIFY_DEV === 'true' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  return null;
}
function rateLimited(key, max) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter(t => now - t < RATE.windowMs);
  if (arr.length >= max) { hits.set(key, arr); return true; }
  arr.push(now); hits.set(key, arr);
  return false;
}
async function sha(s) {
  return require('crypto').createHash('sha256').update(String(s)).digest('hex').slice(0, 16);
}

/* ---------------- validación ---------------- */
const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
const RE_TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const RE_CODE = /^GR-\d{4}-[A-Z0-9]{3,8}$/;
const RE_EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const RE_NAME = /^[\p{L}\p{M}' .-]{2,60}$/u;
const RE_FREE = /^[\p{L}\p{M}\p{N} .,'°#()-]{0,80}$/u; // sin "/", ":", "@", "<", ">" → sin enlaces
const PLACES = ['agency_punta_arenas', 'punta_arenas_airport', 'hotel_punta_arenas', 'custom_location', 'agencia', 'aeropuerto', 'hotel', 'otro'];

function clean(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }

function validate(body) {
  const errors = [];
  const name = clean(body.customer && body.customer.name);
  const email = clean(body.customer && body.customer.email).toLowerCase();
  const email2 = clean(body.customer && body.customer.emailConfirm).toLowerCase();
  if (!RE_NAME.test(name)) errors.push('nombre');
  if (email.length > 120 || !RE_EMAIL.test(email)) errors.push('correo');
  if (email !== email2) errors.push('confirmacion_correo');
  if (body.consent !== true) errors.push('consentimiento');
  const code = clean(body.code).toUpperCase();
  if (!RE_CODE.test(code)) errors.push('codigo');

  const q = body.quote || {};
  const vehicle = (CFG.FLEET || []).find(v => v.id === Number(q.vehicleId));
  if (!vehicle) errors.push('vehiculo');
  const st = {
    pickUpDate: clean(q.pickUpDate), pickUpTime: clean(q.pickUpTime),
    dropOffDate: clean(q.dropOffDate), dropOffTime: clean(q.dropOffTime),
    pickUpPlace: clean(q.pickUpPlace), dropOffPlace: clean(q.dropOffPlace),
    dropOffOther: clean(q.dropOffOther), passengers: clean(q.passengers),
    destination: clean(q.destination), destinationOther: clean(q.destinationOther),
    argentina: q.argentina === 'si' ? 'si' : 'no',
  };
  if (!RE_DATE.test(st.pickUpDate) || !RE_DATE.test(st.dropOffDate)) errors.push('fechas');
  if (!RE_TIME.test(st.pickUpTime) || !RE_TIME.test(st.dropOffTime)) errors.push('horas');
  if (!PLACES.includes(st.pickUpPlace) || !PLACES.includes(st.dropOffPlace)) errors.push('lugares');
  if (!RE_FREE.test(st.dropOffOther) || !RE_FREE.test(st.destinationOther)) errors.push('texto_libre');
  if (st.passengers && !(/^\d{1,2}$/.test(st.passengers) && +st.passengers >= 1 && +st.passengers <= (CFG.MAX_PASSENGERS || 9))) errors.push('pasajeros');
  if (st.destination && !(CFG.DESTINATIONS || []).some(d => d.id === st.destination)) errors.push('destino');

  const today = G.localISO();
  const days = G.rentalDays(st.pickUpDate, st.pickUpTime, st.dropOffDate, st.dropOffTime);
  if (!(days >= 1 && days <= 120)) errors.push('duracion');
  if (st.pickUpDate && (st.pickUpDate < G.addDaysISO(today, -1) || st.pickUpDate > G.addDaysISO(today, 540))) errors.push('fecha_retiro');

  const catalog = CFG.EXTRAS_FALLBACK || [];
  const extras = [];
  if (!Array.isArray(q.extras) || q.extras.length > 12) errors.push('adicionales');
  else q.extras.forEach(x => {
    const def = catalog.find(c => c.id === Number(x && x.id));
    const qty = Number(x && x.qty);
    const max = def ? (def.maxQty || 1) : 0;
    if (!def || !Number.isInteger(qty) || qty < 1 || qty > max) errors.push('adicional_' + (x && x.id));
    else if (!extras.some(e => e.id === def.id)) extras.push({ id: def.id, qty });
  });

  // Fecha que cuenta para la promo 4×3: la de creación de la cotización
  // (como en la página), acotada a los últimos 30 días y nunca futura.
  let quoteDate = today;
  const created = Number(body.createdAt);
  if (created && created < Date.now() + 60000 && Date.now() - created < 30 * 86400000) quoteDate = G.localISO(new Date(created));

  return { errors, name, email, code, vehicle, state: st, extras, days, quoteDate, catalog };
}

/* ---------------- correo ---------------- */
function waLink(text) {
  return `https://wa.me/${CFG.WHATSAPP_NUMBER || '56983335924'}?text=${encodeURIComponent(text)}`;
}
function rowsHtml(rows) {
  return rows.map(r => `<tr><td style="padding:6px 0;color:#64748b;font-size:13px;vertical-align:top;width:42%">${esc(r[0])}</td><td style="padding:6px 0;color:#0A2540;font-size:13px;font-weight:600;text-align:right">${esc(r[1])}${r[2] ? `<br><span style="font-weight:400;color:#94a3b8;font-size:12px">${esc(r[2])}</span>` : ''}</td></tr>`).join('');
}
function buildEmail(v, c, opts) {
  const q = { vehicleName: v.vehicle.name, state: v.state, catalog: v.catalog };
  const waText = G.whatsappMessage(q, c, v.code);
  const extras = G.extrasNames(c, v.catalog);
  const detail = G.detailRows(q, c, v.code).concat([['Servicios adicionales', extras.length ? extras.join(', ') : 'Ninguno']]);
  const pay = [
    ['Promoción aplicada', G.promoText(c)],
    ['Abono necesario para reservar', G.money(c.deposit), '1 día de arriendo'],
    ['Saldo pendiente', G.money(c.balance), 'Se paga al retirar el vehículo'],
  ];
  if (c.prepay) pay.push([`Alternativa: pago del 100 % por adelantado (−${c.prepay.pct}% en el arriendo)`, G.money(c.prepay.total)]);
  const banner = opts.business
    ? `<tr><td style="background:#f59e0b;color:#1f2937;padding:12px 24px;font-weight:800;font-size:14px">NUEVA SOLICITUD DE DISPONIBILIDAD — enviada desde el sitio web<br><span style="font-weight:600;font-size:12.5px">Cliente: ${esc(v.name)} · ${esc(v.email)}${opts.registered ? '' : ' · ⚠ Código generado en la web (no quedó registrado en el panel)'}${opts.mismatch ? ` · ⚠ El navegador mostró ${esc(G.money(opts.clientTotal))}; total recalculado en el servidor: ${esc(G.money(c.total))}` : ''}</span></td></tr>`
    : '';
  const greeting = opts.business ? '' : `<p style="margin:0 0 14px;font-size:15px;color:#0A2540">Hola ${esc(v.name)}, esta es la cotización que preparaste en nuestro sitio.</p>`;
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cotización ${esc(v.code)}</title></head>
<body style="margin:0;background:#eef2f6;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f6;padding:20px 10px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden">
<tr><td style="background:#0A2540;padding:20px 24px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td><img src="${SITE_URL}/img/logo-glaciares-192.png" width="44" height="44" alt="Glaciares Rent a Car" style="border-radius:50%;display:block"></td>
<td style="padding-left:12px;color:#ffffff;font-weight:800;font-size:16px">GLACIARES RENT A CAR<br><span style="color:#00D4FF;font-size:12px;font-weight:600;letter-spacing:.08em">COTIZACIÓN ${esc(v.code)}</span></td></tr></table></td></tr>
${banner}
<tr><td style="padding:22px 24px 6px">${greeting}
<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:12px 14px;color:#78350f;font-size:13px;font-weight:600;line-height:1.5">${esc(G.PENDING_NOTICE)}</div></td></tr>
<tr><td style="padding:14px 24px 0"><h2 style="margin:0 0 6px;font-size:15px;color:#0A2540">Tu viaje</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml(detail)}</table></td></tr>
<tr><td style="padding:14px 24px 0"><h2 style="margin:0 0 6px;font-size:15px;color:#0A2540">Detalle del precio</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml(G.priceRows(c))}
<tr><td style="padding:10px 0 4px;border-top:2px solid #0A2540;font-size:16px;font-weight:800;color:#0A2540">Total estimado</td><td style="padding:10px 0 4px;border-top:2px solid #0A2540;font-size:18px;font-weight:800;color:#0A2540;text-align:right">${esc(G.money(c.total))}</td></tr>
${rowsHtml(pay)}</table></td></tr>
<tr><td style="padding:14px 24px 0"><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;font-size:12.5px;color:#475569;line-height:1.5"><strong style="color:#0A2540">Garantía (informativa, aparte del precio):</strong> ${esc(G.guaranteeText(c))}</div></td></tr>
<tr><td align="center" style="padding:22px 24px 8px">
<a href="${esc(opts.business ? 'mailto:' + v.email : waLink(waText))}" style="display:inline-block;background:#25D366;color:#ffffff;font-weight:800;font-size:15px;text-decoration:none;padding:14px 22px;border-radius:12px">${opts.business ? 'Responder al cliente por correo' : 'Consultar disponibilidad por WhatsApp'}</a>
<p style="margin:10px 0 0;font-size:12px;color:#94a3b8">Total estimado con las tarifas vigentes. El monto final se confirma junto con la disponibilidad, antes de cualquier pago.</p></td></tr>
<tr><td style="padding:16px 24px 22px;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0">Glaciares Rent a Car · ${esc(CFG.AGENCY_ADDRESS || 'Punta Arenas')} · WhatsApp +56 9 8333 5924 · <a href="${SITE_URL}/condiciones" style="color:#00AFD6">Condiciones de arriendo</a><br>${opts.business ? 'Copia interna generada automáticamente por el cotizador del sitio web.' : `Recibes este correo porque lo solicitaste en ${esc(SITE_URL.replace(/^https?:\/\//, ''))}. No te enviaremos publicidad.`}</td></tr>
</table></td></tr></table></body></html>`;
  const text = (opts.business ? `NUEVA SOLICITUD DE DISPONIBILIDAD (sitio web)\nCliente: ${v.name} <${v.email}>\n\n` : `Hola ${v.name}:\n\n`) +
    G.quoteText(q, c, v.code) + (opts.business ? '' : `\n\nConsultar disponibilidad por WhatsApp: ${waLink(waText)}`);
  return { html, text };
}

async function sendResend(payload, idemKey) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idemKey,
    },
    body: JSON.stringify(payload),
  });
  let data = null;
  try { data = await r.json(); } catch (e) { /* sin cuerpo */ }
  if (!r.ok) { const err = new Error((data && (data.message || data.name)) || `HTTP ${r.status}`); err.status = r.status; throw err; }
  return data;
}

/* ---------------- handler ---------------- */
exports.handler = async (event) => {
  const origin = allowedOrigin(event.headers && (event.headers.origin || event.headers.Origin));
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: origin ? 204 : 403, headers: origin ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' } : {}, body: '' };
  }
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'method' });
  if (!origin) return json(403, { ok: false, error: 'origin' });
  if (!event.body || event.body.length > MAX_BODY) return json(413, { ok: false, error: 'size' }, origin);

  let body;
  try { body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body); }
  catch (e) { return json(400, { ok: false, error: 'json' }, origin); }

  // Campo trampa: los robots lo completan, las personas no lo ven.
  if (body.website) return json(200, { ok: true }, origin);

  const v = validate(body);
  if (v.errors.length) return json(422, { ok: false, error: 'validation', fields: v.errors }, origin);

  const ip = (event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || '').split(',')[0].trim();
  if ((ip && rateLimited('ip:' + ip, RATE.ipMax)) || rateLimited('em:' + v.email, RATE.emailMax)) {
    return json(429, { ok: false, error: 'rate' }, origin);
  }

  const { RESEND_API_KEY, EMAIL_FROM, EMAIL_BUSINESS_TO } = process.env;
  if (!RESEND_API_KEY || !EMAIL_FROM || !EMAIL_BUSINESS_TO) {
    console.error('[enviar-cotizacion] Faltan variables de entorno del correo');
    return json(503, { ok: false, error: 'not_configured' }, origin);
  }
  const live = process.env.EMAIL_MODE === 'live';
  const testTo = process.env.EMAIL_TEST_TO || EMAIL_BUSINESS_TO;
  const replyTo = process.env.EMAIL_REPLY_TO || EMAIL_BUSINESS_TO;

  // Recalcular con el mismo motor del sitio (nunca se usa el precio del navegador).
  const c = G.compute({
    vehicle: v.vehicle, pickUpDate: v.state.pickUpDate, pickUpTime: v.state.pickUpTime,
    dropOffDate: v.state.dropOffDate, dropOffTime: v.state.dropOffTime,
    pickUpPlace: v.state.pickUpPlace, dropOffPlace: v.state.dropOffPlace,
    argentina: v.state.argentina, extras: v.extras, catalog: v.catalog, today: v.quoteDate,
  });
  const clientTotal = Number(body.clientTotal);
  const mismatch = Number.isFinite(clientTotal) && Math.round(clientTotal) !== Math.round(c.total);
  if (mismatch) console.warn('[enviar-cotizacion] total distinto', v.code, clientTotal, c.total);

  const tag = live ? '' : '[PRUEBA] ';
  const resendN = Math.min(Math.max(parseInt(body.resendCount, 10) || 0, 0), 20);
  const emHash = await sha(v.email);
  const dates = `${G.fechaHora(v.state.pickUpDate)}–${G.fechaHora(v.state.dropOffDate)}`;

  // 1) Correo al cliente (es el que determina el éxito).
  const mailC = buildEmail(v, c, { business: false });
  try {
    await sendResend({
      from: EMAIL_FROM, to: [live ? v.email : testTo], reply_to: replyTo,
      subject: `${tag}Tu cotización ${v.code} · ${v.vehicle.name} · Glaciares Rent a Car`,
      html: mailC.html, text: mailC.text,
      tags: [{ name: 'tipo', value: 'cotizacion_cliente' }],
    }, `cot-${v.code}-${emHash}-c${resendN}`);
  } catch (e) {
    console.error('[enviar-cotizacion] fallo correo cliente', v.code, e.status, e.message);
    return json(502, { ok: false, error: 'send_failed' }, origin);
  }

  // 2) Copia a Glaciares (solo en el primer envío de cada código; los reintentos
  //    usan la misma clave de idempotencia, así que nunca llega duplicada).
  let businessCopy = false;
  if (!resendN) {
    const mailB = buildEmail(v, c, { business: true, registered: body.registered === true, mismatch, clientTotal });
    try {
      await sendResend({
        from: EMAIL_FROM, to: [live ? EMAIL_BUSINESS_TO : testTo], reply_to: v.email,
        subject: `${tag}Nueva solicitud de disponibilidad ${v.code} · ${v.vehicle.name} · ${dates}`,
        html: mailB.html, text: mailB.text,
        tags: [{ name: 'tipo', value: 'cotizacion_copia_negocio' }],
      }, `cot-${v.code}-negocio`);
      businessCopy = true;
    } catch (e) {
      console.error('[enviar-cotizacion] fallo copia negocio', v.code, e.status, e.message);
    }
  }

  return json(200, { ok: true, testMode: !live, businessCopy, total: c.total }, origin);
};

// Para pruebas automáticas
exports._internals = { validate, buildEmail, allowedOrigin };
