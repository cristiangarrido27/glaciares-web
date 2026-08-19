/* =====================================================================
   CONFIGURACIÓN CENTRALIZADA DE MEDICIÓN (Google Analytics / Meta Pixel / Google Ads)
   =====================================================================
   Este archivo NO contiene IDs reales todavía. Reemplaza los valores
   null por los identificadores reales del negocio cuando estén
   disponibles y luego descomenta la carga de cada script más abajo.

   Eventos de conversión que ya están instrumentados en index.html
   mediante window.trackEvent(nombre, datos):
     - whatsapp-float        (clic en botón flotante de WhatsApp)
     - mobile-cta-cotizar    (clic en barra fija móvil "Cotizar ahora")
     - cotizador_buscar      (uso del buscador de disponibilidad)
     - cotizar-vehiculo      (clic en "Cotizar este vehículo" por auto)
     - reserva_creada        (reserva generada antes de ir a pagar)
     - contacto_whatsapp     (envío del formulario de contacto)
     - click_telefono        (clic en un enlace tel:)
     - click_correo          (clic en un enlace mailto:)
     - click_como_llegar     (clic en el botón/enlace "Cómo llegar")
   ===================================================================== */

window.ANALYTICS_CONFIG = {
  GOOGLE_ANALYTICS_ID: null,   // Ej: "G-XXXXXXXXXX" (Google Analytics 4)
  GOOGLE_ADS_ID: null,         // Ej: "AW-XXXXXXXXX"
  GOOGLE_ADS_CONVERSION_LABEL: null, // Ej: "AbCdEfGhIjK"
  META_PIXEL_ID: null,         // Ej: "1234567890123456"
};

/* Función central de tracking. Mientras no haya IDs configurados,
   solo registra el evento en consola (modo silencioso) para no rotos
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
   Cuando tengas los IDs reales:
   1) Completa los valores en ANALYTICS_CONFIG arriba.
   2) Descomenta el bloque correspondiente aquí abajo para cargar
      el script oficial de Google Analytics / Google Ads / Meta Pixel.
   --------------------------------------------------------------------- */

// if (window.ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID) {
//   const s = document.createElement('script');
//   s.async = true;
//   s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID;
//   document.head.appendChild(s);
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){ dataLayer.push(arguments); }
//   gtag('js', new Date());
//   gtag('config', window.ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID);
//   if (window.ANALYTICS_CONFIG.GOOGLE_ADS_ID) {
//     gtag('config', window.ANALYTICS_CONFIG.GOOGLE_ADS_ID);
//   }
// }

// if (window.ANALYTICS_CONFIG.META_PIXEL_ID) {
//   !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//   n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
//   n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
//   t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
//   document,'script','https://connect.facebook.net/en_US/fbevents.js');
//   fbq('init', window.ANALYTICS_CONFIG.META_PIXEL_ID);
//   fbq('track', 'PageView');
// }
