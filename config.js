/* =====================================================================
   CONFIGURACIÓN CENTRALIZADA DE TARIFAS Y DATOS DEL COTIZADOR
   =====================================================================
   Un solo lugar para modificar montos que se usan en varias páginas
   (portada, /buscar). No se inventan cifras: estos valores vienen del
   brief comercial ya confirmado por el dueño del negocio.

   SERVICIO DE AEROPUERTO (regla definitiva, confirmada 2026-08-30): se cobra
   POR TRAMO. Un solo tramo (solo retiro O solo devolución en aeropuerto) vale
   AIRPORT_FEE_LEG. Si el vehículo se retira Y se devuelve en el aeropuerto,
   corresponde el valor combinado AIRPORT_FEE_ROUNDTRIP — nunca la suma de dos
   tramos ($40.000). El monto mostrado acá es solo informativo para el
   cliente: el monto que realmente se cobra siempre lo calcula el backend.
   ===================================================================== */

window.GLACIARES_CONFIG = {
  WHATSAPP_NUMBER: '56983335924',
  AGENCY_ADDRESS: 'Av. Francisco Javier Reyna 0473, Punta Arenas',

  AIRPORT_FEE_LEG: 20000,        // un tramo: solo retiro O solo devolución en aeropuerto
  AIRPORT_FEE_ROUNDTRIP: 30000,  // retiro Y devolución en aeropuerto (nunca $40.000)
  ARGENTINA_PERMIT_FEE: 120000, // Permiso para viaje a Argentina
  MIN_DEPOSIT: 500000,       // Garantía con tarjeta, todos los vehículos (confirmado 2026-10-03)
  ARGENTINA_GUARANTEE: 750000, // Garantía para viajes a Argentina (confirmado 2026-09-17)

  PICKUP_PLACES: [
    { id: 'agencia', label: 'Agencia en Punta Arenas (ciudad)', extraFee: 0 },
    { id: 'aeropuerto', label: 'Aeropuerto Presidente Carlos Ibáñez del Campo', extraFee: 20000 },
    { id: 'hotel', label: 'Hotel o alojamiento en Punta Arenas — sujeto a confirmación', extraFee: 0 },
  ],
  DROPOFF_PLACES: [
    { id: 'agencia', label: 'Agencia en Punta Arenas (ciudad)' },
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
    minimumAge: 21,                 // Confirmado por el dueño (2026-10-03): 21 a 75 años
    maximumAge: 75,
    cancellationHours: 72,          // Confirmado por el dueño (2026-10-03)
    airportFeeLeg: 20000,           // un tramo (solo retiro o solo devolución)
    airportFeeRoundtrip: 30000,     // retiro y devolución en aeropuerto (nunca $40.000)
    argentinaPermitFee: 120000,
    additionalDriverDailyFee: 5000,
    additionalDriverIncludesVAT: false, // Se cobra "+ IVA" aparte
    chileGuaranteeMinimum: 500000,
    argentinaGuarantee: 750000,     // Confirmado por el dueño (2026-09-17)
  },

  /* ---------------------------------------------------------------------
     RESEÑAS DE GOOGLE (portada). Completar SOLO con datos reales copiados
     del perfil de Google. Mientras queden vacíos, la portada muestra el
     texto genérico y el botón "Ver opiniones en Google".
     Ejemplo: rating: 4.8, count: 86,
       items: [{ name: 'María P.', date: 'agosto 2026', text: '...' }]
     --------------------------------------------------------------------- */
  GOOGLE_REVIEWS: {
    rating: 4.5,   // Perfil de Google, revisado 9 oct 2026
    count: 69,
    items: [
      { name: 'Javo P.R.', date: 'agosto 2026', text: 'Excelente el servicio, super confiables, condiciones claras, personal amable y atentas. Recomendando al 100%' },
      { name: 'Esteban M.', date: 'agosto 2026', text: 'Excelente servicio de principio a fin. Arrendé un auto en Punta Arenas y no tuve ningún tipo de problema.' },
      { name: 'Brianna P.', date: 'agosto 2026', text: 'I loved having unlimited miles during my trip. It gave me the flexibility to explore more places without any restrictions.' },
    ],
  },

  /* TEMPORADAS (confirmado por el dueño el 2026-11-01).
     Temporada baja: hasta el 15 de diciembre y desde el 21 de marzo.
     Temporada alta: del 16 de diciembre al 20 de marzo (ambos incluidos).
     Cada día de arriendo se cobra con la tarifa de la temporada en que cae:
     un arriendo del 14 al 18 de diciembre paga 2 días en baja y el resto en alta.
     Para la próxima temporada basta agregar otro tramo a ALTA. */
  TEMPORADAS: {
    ALTA: [
      { desde: '2026-12-16', hasta: '2027-03-20', texto: '16 de diciembre al 20 de marzo' },
    ],
  },

  /* PROMOCIÓN 4x3: TERMINADA (era para solicitudes hasta el 31/10/2026).
     Se deja desactivada solo como historial; ya no se muestra ni se calcula. */
  PROMO_4X3: { activa: false, validaHasta: '2026-10-31' },

  /* PROMOCIÓN 6x5 (confirmada por el dueño el 2026-11-01): arrienda 6 días y paga 5.
     - Un solo día gratis por arriendo de 6 días o más (6→paga 5, 7→paga 6, 12→paga 11).
       Confirmado por el dueño el 2026-11-02. Para dar 1 día gratis por cada 6 días, cambiar repetir a true.
     - El día gratis se descuenta a la tarifa más baja del arriendo.
     - Vale en temporada baja y alta, con abono o con pago total.
     - Solo sobre el arriendo del vehículo; aeropuerto y adicionales aparte.
     - No acumulable con el descuento por pago anticipado (se muestra el que más conviene). */
  PROMO_DIAS: {
    activa: true,
    nombre: 'Promo 6×5',
    titulo: 'Arrienda 6 días y paga 5',
    diasMinimos: 6,
    diasGratis: 1,
    repetir: false,
    validaHasta: '',               // fecha límite para solicitar (vacío = sin fecha)
    vigenciaSegun: 'reserva',
    viajeDesde: '',
    viajeHasta: '',
  },

  /* Descuento por pago total anticipado: 10 % desde el 2026-11-01 (antes 15 %).
     El sitio usa SIEMPRE este porcentaje (no el del servidor de reservas) para no
     mostrar un descuento distinto al publicado. Cambiar también a 10 % en el panel
     del servidor de reservas para que el enlace de pago Webpay cobre lo mismo. */
  EARLY_BOOKING: {
    pct: 10,
    minDaysAhead: 5,              // confirmado 2026-10-03 (el backend debe cambiarse a 5 en el panel)
    minRentalDays: 3,
  },

  /* Atención y plazo de respuesta a solicitudes. Dejar en '' hasta tener un dato
     que se pueda cumplir siempre: si está vacío, el sitio NO promete un plazo. */
  RESPONSE_TIME_TEXT: 'Respondemos tu solicitud en menos de 2 horas, todos los días entre 8:00 y 22:00. Si escribes de noche, te respondemos antes de las 9:00 del día siguiente.', // confirmado 2026-10-03
  PAYMENT_LINK_VALID_HOURS: 72, // vigencia real del enlace de pago que genera el panel (backend)

  /* Catálogo de adicionales de respaldo (copiado de GET /api/extras el 2026-10-03).
     Se usa solo si el servidor de reservas no responde, para que el cliente igual
     vea el total. El backend sigue siendo la fuente del monto que se cobra. */
  EXTRAS_FALLBACK: [
    { id: 1, name: 'Silla infantil', description: 'De 2 a 18 kg. Sujeta a disponibilidad. $5.000 por día, máximo $50.000 por silla.', price: 5000, chargeType: 'day', cap: 50000, kind: 'qty', maxQty: 2, stock: 2, vatIncluded: true, active: true, conditions: 'La silla se entrega y retira junto con el vehículo. Sujeta a disponibilidad real al momento de confirmar.' },
    { id: 2, name: 'Protección de cristales', description: 'Cubre pérdida total, piquete o frisadura de parabrisas, luneta y espejos.', price: 5000, chargeType: 'day', kind: 'checkbox', vatIncluded: true, active: true, conditions: 'Se contrata al inicio del arriendo. No tiene descuento por reserva anticipada.' },
    { id: 3, name: 'Protección de neumáticos', description: 'Cubre pérdida total o reventón de neumáticos.', price: 5000, chargeType: 'day', kind: 'checkbox', vatIncluded: true, active: true, conditions: 'No cubre pinchazos, tren delantero ni amortiguadores. Se contrata al inicio del arriendo. No tiene descuento por reserva anticipada.' },
    { id: 6, name: 'Conductor adicional', description: '$5.000 + IVA por día. Autoriza a una segunda persona a conducir el vehículo durante el arriendo.', price: 5000, chargeType: 'day', kind: 'checkbox', vatIncluded: false, active: true },
    { id: 7, name: 'Entrega o devolución fuera de horario', description: 'Retiro o devolución del vehículo fuera del horario habitual de atención.', price: 15000, chargeType: 'flat', kind: 'checkbox', vatIncluded: true, active: true },
    { id: 5, name: 'Permiso para viaje a Argentina', description: 'Cargo único por reserva, previa autorización y con anticipación.', price: 120000, chargeType: 'flat', kind: 'checkbox', vatIncluded: true, isArgentinaPermit: true, active: true },
  ],
  /* Flota con tarifa diaria. La usan /reserva/adicionales y la función del
     servidor que envía la cotización por correo (recalcula el total con estos
     valores; nunca confía en el precio que llega desde el navegador).
     Mantener igual a la lista de index.html y buscar.html. */
  FLEET: [
    // price = temporada baja · priceHigh = temporada alta (16 dic – 20 mar)
    { id: 1, name: 'Suzuki Swift', price: 35000, priceHigh: 39000, cat: 'citycar', catLabel: 'Citycar', img: 'suzuki-swift.webp', deposit: 500000 },
    { id: 2, name: 'Suzuki Dzire', price: 38000, priceHigh: 45000, cat: 'citycar', catLabel: 'Citycar', img: 'suzuki-dzire.webp', deposit: 500000 },
    { id: 10, name: 'Hyundai Tucson ix35', price: 41000, priceHigh: 47000, cat: 'suv', catLabel: 'SUV', img: 'hyundai-tucson-ix35.webp', deposit: 500000 },
    { id: 3, name: 'Chevrolet Captiva', price: 48000, priceHigh: 55000, cat: 'suv', catLabel: 'SUV', img: 'chevrolet-captiva.webp', deposit: 500000 },
    { id: 6, name: 'Kia Sorento', price: 43000, priceHigh: 49000, cat: 'suv', catLabel: 'SUV', img: 'kia-sorento.webp', deposit: 500000 },
    { id: 7, name: 'Hyundai Tucson', price: 49000, priceHigh: 57000, cat: 'suv', catLabel: 'SUV', img: 'hyundai-tucson.webp', deposit: 500000 },
    { id: 8, name: 'Peugeot 3008', price: 54000, priceHigh: 59000, cat: 'suv', catLabel: 'SUV', img: 'peugeot-3008.webp', deposit: 500000 },
    { id: 9, name: 'Chevrolet Orlando', price: 59000, priceHigh: 65000, cat: 'suv', catLabel: 'SUV 7 pasajeros', img: 'chevrolet-orlando.webp', deposit: 500000 },
  ],
  VAT_RATE: 0.19,
  RETURN_TOLERANCE_MINUTES: 60, // condiciones.html: tolerancia de devolución de 1 hora
};
