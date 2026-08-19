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

  // Vigencia de la promoción de reserva anticipada: fecha real no confirmada todavía.
  PROMO_VALID_NOTE: 'Promoción vigente por tiempo limitado, sujeta a modificación sin previo aviso.',
};
