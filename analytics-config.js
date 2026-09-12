/* =====================================================================
   CONFIGURACIÓN CENTRALIZADA DE MEDICIÓN (Google Analytics / Meta Pixel / Google Ads)
   =====================================================================
   Completa los valores null con los identificadores reales del negocio
   cuando estén disponibles y descomenta el bloque de Meta Pixel más abajo
   si algún día se activa.

   Eventos de conversión que ya están instrumentados en index.html
   mediante window.trackEvent(nombre, datos):
     - whatsapp-float        (clic en botón flotante de WhatsApp, home) [Google Ads: "Contacto" → whatsapp]
     - mobile-cta-cotizar    (clic en barra fija móvil "Cotizar ahora")
     - cotizador_buscar      (uso del buscador de disponibilidad) [Google Ads: "Solicitar cotización" → pendiente, ver GOOGLE_ADS_CONVERSIONES.solicitar_cotizacion]
     - cotizar-vehiculo      (clic en "Cotizar este vehículo" por auto) [Google Ads: "Formulario Cotización" → formulario_cotizacion]
     - solicitar_confirmacion (botón "SOLICITAR CONFIRMACIÓN" en /reserva/adicionales) [Google Ads: "Formulario Glaciares" → formulario_glaciares]
     - contacto_whatsapp     (envío del formulario de contacto, home) [Google Ads: "Contacto" → whatsapp]
     - whatsapp-float (en /buscar y /reserva/adicionales) y "CONSULTAR POR WHATSAPP" sin resultados [Google Ads: "Contacto" (2ª acción) → whatsapp_otras_paginas]
     - click_telefono        (clic en un enlace tel:)
     - click_correo          (clic en un enlace mailto:)
     - click_como_llegar     (clic en el botón/enlace "Cómo llegar")
   ===================================================================== */

window.ANALYTICS_CONFIG = {
  GOOGLE_ANALYTICS_ID: null,   // Ej: "G-XXXXXXXXXX" (Google Analytics 4)
  GOOGLE_ADS_ID: "AW-16582335899",
  META_PIXEL_ID: null,         // Ej: "1234567890123456"

  /* Acciones de conversión configuradas en Google Ads (Objetivos → Conversiones).
     Cada clave es un nombre interno usado en el código de este sitio; el valor
     es el "conversion label" que entrega Google Ads para esa acción específica.
     Un valor null significa que la acción existe en Google Ads pero todavía no
     tiene un label utilizable (ver nota junto a "solicitar_cotizacion"). */
  GOOGLE_ADS_CONVERSIONS: {
    whatsapp: "AxklCK-F9IoaEJu7ieM9",                // "Contacto" — WhatsApp flotante y formulario de contacto (home)
    whatsapp_otras_paginas: "7KQqCO-B8qscEJu7ieM9",  // "Contacto" (2ª acción) — WhatsApp flotante en /buscar y /reserva/adicionales, y "consultar por WhatsApp" sin resultados
    solicitar_cotizacion: null,                       // "Solicitar cotización" — Google Ads no terminó de generar el label (revisar en Objetivos → Conversiones antes de activar)
    formulario_glaciares: "Og1rCOqC8qscEJu7ieM9",    // "Enviar formulario de clientes potenciales" — solicitud de confirmación de reserva (/reserva/adicionales)
    formulario_cotizacion: "A3LBCOvP8YoaEJu7ieM9",   // "Enviar formulario de clientes potenciales" (2ª acción) — "Cotizar este vehículo" (home)
  },
};

/* Función central de tracking. Mientras no haya IDs configurados,
   solo registra el evento en consola (modo silencioso) para no romper
   la ejecución ni inventar datos de medición. */
window.trackEvent = function (eventName, data) {
  try {
    if (window.ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID && typeof gtag === 'function') {
      gtag('event', eventName, data || {});
    }
    if (window.ANALYTICS_CONFIG.META_PIXEL_ID && typeof fbq === 'function') {
      fbq('trackCustom', eventName, data || {});
    }
    if (!window.ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID && !window.ANALYTICS_CONFIG.META_PIXEL_ID) {
      console.debug('[trackEvent]', eventName, data || {});
    }
  } catch (e) {
    console.warn('trackEvent error', e);
  }
};

/* ---------------------------------------------------------------------
   Carga de gtag.js (Google Analytics y/o Google Ads).
   Se activa automáticamente en cuanto haya un GOOGLE_ANALYTICS_ID o un
   GOOGLE_ADS_ID configurado arriba — no hace falta tocar el <head> del
   sitio a mano.
   --------------------------------------------------------------------- */
if (window.ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID || window.ANALYTICS_CONFIG.GOOGLE_ADS_ID) {
  (function () {
    var primaryId = window.ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID || window.ANALYTICS_CONFIG.GOOGLE_ADS_ID;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + primaryId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    if (window.ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID) {
      gtag('config', window.ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID);
    }
    if (window.ANALYTICS_CONFIG.GOOGLE_ADS_ID) {
      gtag('config', window.ANALYTICS_CONFIG.GOOGLE_ADS_ID);
    }
  })();
}

// if (window.ANALYTICS_CONFIG.META_PIXEL_ID) {
//   !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//   n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
//   n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
//   t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
//   document,'script','https://connect.facebook.net/en_US/fbevents.js');
//   fbq('init', window.ANALYTICS_CONFIG.META_PIXEL_ID);
//   fbq('track', 'PageView');
// }

/* =====================================================================
   CONVERSIONES DE GOOGLE ADS
   =====================================================================
   Todos los puntos de contacto instrumentados (WhatsApp, formularios)
   abren WhatsApp o hacen su trabajo en una PESTAÑA NUEVA o vía fetch en
   segundo plano, así que la pestaña del sitio nunca navega fuera: basta
   con disparar el evento de conversión en paralelo al clic, sin
   interceptar ni retrasar la acción del usuario.

   `key` debe ser una de las claves de GOOGLE_ADS_CONVERSIONS. Si se omite,
   se usa "whatsapp" (comportamiento histórico, para no romper llamadas
   existentes). Si la clave no tiene un label configurado (null), no se
   envía nada a Google Ads y solo se deja un aviso en consola — no se
   inventan IDs.
   --------------------------------------------------------------------- */
window.reportAdsConversion = function (key, extraParams) {
  key = key || 'whatsapp';
  try {
    var conversions = window.ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSIONS || {};
    var label = conversions[key];
    if (!label) {
      console.debug('[reportAdsConversion] sin conversion label para "' + key + '" — evento no enviado a Google Ads todavía');
      return;
    }
    if (typeof gtag === 'function' && window.ANALYTICS_CONFIG.GOOGLE_ADS_ID) {
      var payload = { 'send_to': window.ANALYTICS_CONFIG.GOOGLE_ADS_ID + '/' + label };
      for (var k in (extraParams || {})) { payload[k] = extraParams[k]; }
      gtag('event', 'conversion', payload);
    }
  } catch (e) {
    console.warn('reportAdsConversion error', e);
  }
};

/* gtag_report_conversion(url, key): variante estándar recomendada por
   Google Ads para un enlace que SÍ navega en la MISMA pestaña (dispara la
   conversión y recién en el callback redirige a `url`, con un timeout de
   seguridad para no bloquear la navegación si gtag no responde). No se usa
   hoy en los puntos de contacto instrumentados (todos abren WhatsApp en
   pestaña nueva o van por fetch), pero queda disponible por si en el
   futuro se agrega un flujo que sí navegue en la misma pestaña. */
window.gtag_report_conversion = function (url, key) {
  key = key || 'whatsapp';
  var called = false;
  var callback = function () {
    if (called) return;
    called = true;
    if (typeof url !== 'undefined') {
      window.location = url;
    }
  };
  try {
    var conversions = window.ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSIONS || {};
    var label = conversions[key];
    if (typeof gtag === 'function' && window.ANALYTICS_CONFIG.GOOGLE_ADS_ID && label) {
      gtag('event', 'conversion', {
        'send_to': window.ANALYTICS_CONFIG.GOOGLE_ADS_ID + '/' + label,
        'event_callback': callback,
        'event_timeout': 2000,
      });
    } else {
      callback();
    }
  } catch (e) {
    console.warn('gtag_report_conversion error', e);
    callback();
  }
  // Fallback de seguridad: si gtag no llegó a cargar (bloqueador de
  // anuncios, red caída, etc.) igual se completa la redirección.
  setTimeout(callback, 2000);
  return false;
};
