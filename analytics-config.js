/* =====================================================================
   CONFIGURACIÓN CENTRALIZADA DE MEDICIÓN (Google Analytics / Meta Pixel / Google Ads)
   =====================================================================
   Completa los valores null con los identificadores reales del negocio
   cuando estén disponibles y descomenta el bloque de Meta Pixel más abajo
   si algún día se activa.

   Eventos de conversión que ya están instrumentados en index.html
   mediante window.trackEvent(nombre, datos):
     - whatsapp-float        (clic en botón flotante de WhatsApp) [Google Ads: conversión "WhatsApp"]
     - mobile-cta-cotizar    (clic en barra fija móvil "Cotizar ahora")
     - cotizador_buscar      (uso del buscador de disponibilidad)
     - cotizar-vehiculo      (clic en "Cotizar este vehículo" por auto)
     - reserva_creada        (reserva generada antes de ir a pagar)
     - contacto_whatsapp     (envío del formulario de contacto) [Google Ads: conversión "WhatsApp"]
     - click_telefono        (clic en un enlace tel:)
     - click_correo          (clic en un enlace mailto:)
     - click_como_llegar     (clic en el botón/enlace "Cómo llegar")
   ===================================================================== */

window.ANALYTICS_CONFIG = {
  GOOGLE_ANALYTICS_ID: null,   // Ej: "G-XXXXXXXXXX" (Google Analytics 4)
  GOOGLE_ADS_ID: "AW-16582335899",
  GOOGLE_ADS_CONVERSION_LABEL: "AxklCK-F9IoaEJu7ieM9", // Acción de conversión "WhatsApp"
  META_PIXEL_ID: null,         // Ej: "1234567890123456"
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
   CONVERSIÓN DE GOOGLE ADS "WhatsApp"
   =====================================================================
   Los dos puntos de WhatsApp instrumentados (botón flotante y formulario
   de contacto) abren WhatsApp en una PESTAÑA NUEVA (target="_blank" /
   window.open), así que la pestaña del sitio nunca navega fuera: basta
   con disparar el evento de conversión en paralelo al clic, sin
   interceptar ni retrasar la apertura de WhatsApp.
   --------------------------------------------------------------------- */
window.reportAdsConversion = function () {
  try {
    if (typeof gtag === 'function' && window.ANALYTICS_CONFIG.GOOGLE_ADS_ID && window.ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_LABEL) {
      gtag('event', 'conversion', {
        'send_to': window.ANALYTICS_CONFIG.GOOGLE_ADS_ID + '/' + window.ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_LABEL,
      });
    }
  } catch (e) {
    console.warn('reportAdsConversion error', e);
  }
};

/* gtag_report_conversion(url): variante estándar recomendada por Google
   Ads para un enlace que SÍ navega en la MISMA pestaña (dispara la
   conversión y recién en el callback redirige a `url`, con un timeout
   de seguridad para no bloquear la navegación si gtag no responde).
   No se usa hoy en whatsapp-float ni contacto_whatsapp (ver arriba),
   pero queda disponible por si en el futuro se agrega un botón de
   WhatsApp sin target="_blank". */
window.gtag_report_conversion = function (url) {
  var called = false;
  var callback = function () {
    if (called) return;
    called = true;
    if (typeof url !== 'undefined') {
      window.location = url;
    }
  };
  try {
    if (typeof gtag === 'function' && window.ANALYTICS_CONFIG.GOOGLE_ADS_ID && window.ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_LABEL) {
      gtag('event', 'conversion', {
        'send_to': window.ANALYTICS_CONFIG.GOOGLE_ADS_ID + '/' + window.ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_LABEL,
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
