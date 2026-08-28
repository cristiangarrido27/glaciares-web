/* =====================================================================
   CONFIGURACIÓN CENTRALIZADA DE TARIFAS Y DATOS DEL COTIZADOR
   =====================================================================
   Un solo lugar para modificar montos que se usan en varias páginas
   (portada, /buscar). No se inventan cifras: estos valores vienen del
   brief comercial ya confirmado por el dueño del negocio.

   IMPORTANTE: si el cargo de aeropuerto corresponde a un cobro por
   cada traslado (retiro Y devolución) o a un único cobro por todo el
   servicio, todavía no está confirmado. Mientras tanto este archivo
   cobra el monto UNA sola vez por reserva (no se duplica si el
   aeropuerto se usa tanto para el retiro como para la devolución).
   Ver PENDIENTES_POR_CONFIRMAR.md, punto sobre "cargo de aeropuerto".
   ===================================================================== */

window.GLACIARES_CONFIG = {
  WHATSAPP_NUMBER: '56983335924',
  AGENCY_ADDRESS: 'Av. Francisco Javier Reyna 0473, Punta Arenas',

  AIRPORT_FEE: 20000,        // Cobro único por servicio de aeropuerto (retiro y/o devolución)
  ARGENTINA_PERMIT_FEE: 120000, // Permiso para viaje a Argentina
  MIN_DEPOSIT: 500000,       // Garantía referencial mínima ("desde")

  PICKUP_PLACES: [
    { id: 'agencia', label: 'Agencia Glaciares Rent a Car — Punta Arenas', extraFee: 0 },
    { id: 'aeropuerto', label: 'Aeropuerto Presidente Carlos Ibáñez del Campo', extraFee: 20000 },
    { id: 'hotel', label: 'Hotel o alojamiento en Punta Arenas — sujeto a confirmación', extraFee: 0 },
  ],
  DROPOFF_PLACES: [
    { id: 'agencia', label: 'Agencia Glaciares Rent a Car — Punta Arenas' },
    { id: 'aeropuerto', label: 'Aeropuerto Presidente Carlos Ibáñez del Campo' },
    { id: 'hotel', label: 'Hotel o alojamiento en Punta Arenas — sujeto a confirmación' },
    { id: 'otro', label: 'Otro lugar — sujeto a evaluación' },
  ],

  // Vigencia de la promoción de reserva anticipada.
  // Si PROMOTION_END_DATE tiene una fecha ("2026-12-31"), se muestra esa fecha exacta.
  // Si queda vacía (""), NO se afirma "por tiempo limitado" ni "vigente": se usa un
  // texto neutro ("Beneficio por reserva anticipada") hasta que el dueño confirme una fecha real.
  PROMOTION_END_DATE: '',
  PROMO_VALID_NOTE: 'Promoción vigente por tiempo limitado, sujeta a modificación sin previo aviso.',

  // Códigos promocionales autorizados. El descuento real que se cobra siempre viene
  // del backend (disponibilidad confirmada); esta lista solo sirve para mostrarle al
  // cliente si el código que escribió es reconocido o si será revisado manualmente.
  VALID_PROMO_CODES: [],

  // Cantidad de pasajeros que se puede elegir en el cotizador.
  MAX_PASSENGERS: 9,

  // Destinos disponibles en el cotizador (portada y /buscar).
  DESTINATIONS: [
    { id: 'punta-arenas', label: 'Punta Arenas' },
    { id: 'puerto-natales', label: 'Puerto Natales' },
    { id: 'torres-del-paine', label: 'Torres del Paine' },
    { id: 'porvenir', label: 'Porvenir' },
    { id: 'tierra-del-fuego', label: 'Tierra del Fuego' },
    { id: 'el-calafate', label: 'El Calafate' },
    { id: 'ushuaia', label: 'Ushuaia' },
    { id: 'otro', label: 'Otro destino' },
  ],

  /* ---------------------------------------------------------------------
     POLÍTICAS COMERCIALES CENTRALIZADAS
     Antes estos datos estaban repetidos (y a veces con valores distintos)
     en varias secciones de index.html y condiciones.html. Ahora viven en
     un solo lugar. Los valores marcados como confirmados ya fueron
     validados por el dueño (ver PENDIENTES_POR_CONFIRMAR.md, punto 2.1).
     Los que quedan en null/"" todavía no tienen un dato real confirmado:
     no se inventan, se dejan pendientes.
     --------------------------------------------------------------------- */
  RENTAL_POLICIES: {
    minimumAge: 22,                 // Confirmado por el dueño (2026-08-18)
    cancellationHours: 48,          // Confirmado por el dueño (2026-08-18)
    airportFee: 20000,
    argentinaPermitFee: 120000,
    additionalDriverDailyFee: 5000,
    additionalDriverIncludesVAT: false, // Se cobra "+ IVA" aparte
    chileGuaranteeMinimum: 500000,
    argentinaGuarantee: 1000000,
  },
};
