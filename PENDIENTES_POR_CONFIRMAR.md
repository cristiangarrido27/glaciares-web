# PENDIENTES POR CONFIRMAR — Glaciares Rent a Car

Este archivo es de uso interno. Ningún texto de aquí fue publicado en la web pública. Reúne los datos que el dueño del negocio debe confirmar o entregar para dejar el sitio 100% preciso.

## 25. Corrección de precios: silla infantil con tope y aeropuerto por tramo (2026-08-30, madrugada)

Instrucción explícita del dueño con reglas comerciales definitivas. Reemplaza cualquier cálculo anterior de estos dos ítems.

**Silla infantil**: se corrigió el precio de $6.000/día a **$5.000 por día, máximo $50.000 por silla** (antes ya existía el tope en el backend, `computeExtrasTotal` con el campo `cap`, pero el precio estaba mal). Se corrigió con el script `reservas/fix-precios-silla-aeropuerto.js`. Verificado con los 5 escenarios pedidos (4/10/15 días × 1 silla, 4/15 días × 2 sillas) — todos dan el monto exacto pedido.

**Servicio de aeropuerto — cambio de arquitectura importante**: antes de este cambio, el cargo de aeropuerto era **solo informativo en el sitio** (`sitio-web/config.js` → `AIRPORT_FEE`, agregado únicamente en pantalla) y **nunca se sumaba al monto real que se cobraba** al confirmar una reserva o pagar por Webpay — el backend no tenía ningún concepto de "aeropuerto" en su cálculo de precio (era el punto #10 de este mismo documento). Esto significaba que, si un cliente pedía retiro en el aeropuerto, el sitio se lo mostraba en el total, pero al final el operador cobraba el monto sin ese cargo salvo que se acordara aparte por WhatsApp.

Ahora el cargo de aeropuerto:
- Se calcula **siempre en el backend** (`reservas/db.js` → `computeAirportFee`), nunca se confía en un monto que mande el navegador.
- Se cobra **por tramo**: $20.000 si el vehículo se retira O se devuelve en el aeropuerto (no ambos), $30.000 si se retira Y se devuelve en el aeropuerto — nunca $40.000 (nunca se suman dos tramos de $20.000).
- Queda guardado por separado en cada reserva: lugar de retiro, lugar de devolución, tipo de servicio (`airportServiceType`), cargo calculado (`airportFeeCalculated`), cargo finalmente confirmado (`airportFeeConfirmed`) y quién lo confirmó/modificó (`airportFeeConfirmedBy`).
- Si el lugar es "otro" (personalizado), el sistema no le inventa un cargo: lo deja en $0 pero marcado para que el operador lo revise y lo ajuste manualmente antes de confirmar (en el panel, modal de "Confirmar disponibilidad", o con el botón "Editar cargo aeropuerto" en la pestaña Reservas).
- Se probaron los 6 combos pedidos (agencia/aeropuerto/hotel en ambas direcciones) más el caso de lugar personalizado con ajuste manual del operador — todos correctos.

**Se eliminó** el extra suelto "Entrega en aeropuerto" ($20.000 fijo) que existía en el catálogo de extras (`/api/extras`): contradecía la nueva regla por tramo (cobraba siempre $20.000 sin importar si era un tramo o ambos). El cargo de aeropuerto ya no pasa por el catálogo de extras.

**Reserva manual desde el panel**: el formulario "Nueva reserva manual" ahora también pide lugar de retiro/devolución y muestra el cargo de aeropuerto calculado (editable) antes de guardar, para que las reservas cargadas a mano por teléfono también reflejen el cargo real.

**Archivos modificados en esta ronda**:
- `reservas/config.js`: `airportFee` (único) → `airportFeeLeg` (20.000) + `airportFeeRoundtrip` (30.000).
- `reservas/db.js`: nuevas funciones `airportServiceType`, `computeAirportFee`, `airportServiceLabel`; `createRequest`, `confirmRequest`, `generatePaymentLinkForBooking` y `buildWhatsAppMessage` actualizadas para calcular/congelar/mostrar el cargo.
- `reservas/routes/admin.js`: `POST /bookings` (reserva manual) y `POST /requests/:id/confirm` y `POST /bookings/:id/generate-payment-link` aceptan lugares/override de aeropuerto; `PATCH /bookings/:id` permite editar el cargo confirmado mientras la reserva no esté pagada.
- `reservas/public/admin/index.html`: modal de confirmar solicitud muestra y permite editar el cargo antes de confirmar; tabla de Reservas muestra el cargo; botón nuevo "Editar cargo aeropuerto"; formulario de reserva manual con lugares y cargo.
- `reservas/fix-precios-silla-aeropuerto.js` (nuevo, uso único): corrige el precio de la silla y elimina el extra "Entrega en aeropuerto" del catálogo.
- `sitio-web/config.js`, `sitio-web/index.html`, `sitio-web/buscar.html`, `sitio-web/condiciones.html`: textos y cálculos actualizados a la regla por tramo; ningún texto sigue diciendo que el aeropuerto cuesta siempre $20.000.

**Nota**: en `/buscar` no existe un selector interactivo donde el cliente elija la cantidad de sillas antes de escribir — los extras (silla incluida) se muestran informativamente y se coordinan por WhatsApp al confirmar, igual que antes de este cambio. Si en algún momento se quiere que el cliente elija cantidad de sillas y vea el total actualizado en la tarjeta sin escribir, es una mejora aparte a evaluar.

## 24. Extras nuevos, cotización por email y botón único de confirmación (2026-08-30, noche)

A partir del análisis del checkout de Matu Rent a Car, se hicieron estos cambios en `/buscar`:

- **Servicios adicionales nuevos**: se agregaron al catálogo de extras "Conductor adicional" ($6.000/día) y "Entrega o devolución fuera de horario" ($15.000 único), vía el script de una sola vez `reservas/add-extras-conductor-horario.js`. **Los precios son un punto de partida, no una tarifa confirmada** — no existe todavía una pantalla en el panel para editar extras, así que para cambiarlos hay que volver a pedírmelo o editar ese archivo directamente. Estos extras ya son visibles en un panel nuevo en `/buscar` ("Servicios adicionales disponibles"), pero igual que los extras anteriores, se coordinan y se suman al total cuando el cliente confirma por WhatsApp — no hay todavía un selector que los sume automáticamente al total mostrado en la tarjeta del vehículo.
- **Cotizar por email**: se agregó un botón "ENVIAR PRESUPUESTO POR EMAIL" en cada tarjeta de vehículo. Es una implementación liviana (abre el programa de correo del cliente con un `mailto:` prellenado con el detalle de la cotización) — no envía el correo desde el servidor ni queda registro en el panel. Si más adelante se quiere un envío real desde el servidor (con registro y sin depender del programa de correo del cliente), es una mejora aparte a evaluar.
- **Se eliminó el botón "SOLICITAR CONFIRMACIÓN"** como CTA separado. Su función no desapareció: quedó fusionada en el modal que ya se abre al tocar un botón de pago bloqueado — si el cliente no escribe un código y toca "SOLICITAR POR WHATSAPP", se registra la solicitud exactamente igual que antes. **Importante:** esto es solo una simplificación de la interfaz; el candado de pago (Webpay exige token de confirmación válido) sigue intacto y no se tocó.
- **IVA**: se confirmó con el dueño que los precios actuales ya incluyen cualquier impuesto aplicable. Por pedido explícito, **no se agregó ninguna línea separada de IVA** en ningún desglose de precio del sitio (a diferencia de lo que muestra Matu Rent a Car).

## 23. Enlace de pago para reservas cargadas a mano (2026-08-30, tarde)

Surgió al usar el flujo del punto 22 con un cliente real: te escribió directo por WhatsApp (sin pasar por el buscador del sitio), le dijiste "sí, está confirmado" y no pasó nada — porque la pestaña Solicitudes solo lista pedidos que pasaron por el botón "SOLICITAR CONFIRMACIÓN" de `/buscar`. Un cliente que te contacta directo nunca genera esa solicitud.

**Arreglo**: ahora, en la tabla de Reservas, cualquier reserva que cargaste a mano ("Nueva reserva manual") tiene un botón **"Generar enlace de pago"**. Al apretarlo, el sistema congela los mismos dos precios (con y sin descuento por reserva anticipada) y te entrega el mismo tipo de enlace/código que ya conoces del flujo de Solicitudes — el cliente paga desde ahí igual, sin tener que visitar el buscador nunca.

**Ojo con la seguridad**: de paso se cerró un hueco que quedó del diseño original — antes, una reserva manual *sin* enlace de pago generado podía, en teoría, iniciar un cobro en Webpay sin ningún candado (nadie lo llegó a usar así, no hubo ningún cobro indebido, pero era una brecha). Ahora, apenas generás un enlace de pago para una reserva, esa reserva queda protegida igual que las del buscador: sin el token de ese enlace, Webpay la rechaza. Las reservas manuales que nunca generan enlace (las que cobrás en efectivo/transferencia, que es la mayoría) siguen funcionando exactamente igual que siempre.

Se probó: reserva manual con enlace generado + pago sin token (rechazado), con token correcto (pasa el candado), código ingresado a mano en `/buscar` (funciona), y una reserva manual clásica sin enlace nunca generado (sigue funcionando como antes, sin romper nada existente).

Archivos modificados: `db.js`, `routes/admin.js`, `routes/webpay.js`, `public/admin/index.html` (todos en el backend; `buscar.html` no necesitó cambios). Script: `deploy-enlace-pago-manual.sh`.

## 22. Flujo de confirmación antes de pago (2026-08-30)

Implementa el pedido "corrige el flujo de confirmación y pago sin eliminar los botones de pago": ahora nadie puede pagar por Webpay sin que Glaciares Rent a Car confirme antes la disponibilidad real, pero los botones de pago siguen visibles en todo momento (solo cambian de texto y quedan bloqueados hasta la confirmación).

### Cómo quedó el flujo
1. El cliente busca en `/buscar` y ve cada vehículo con sus dos botones de pago **siempre visibles**: "PAGO TOTAL — REQUIERE CONFIRMACIÓN" y "ABONO — REQUIERE CONFIRMACIÓN".
2. Al hacer clic en "SOLICITAR CONFIRMACIÓN", se registra la solicitud en el backend (código único, ej. `GR-2026-0007`, estado `requested`, sin bloquear el cupo todavía) y se abre WhatsApp con el detalle completo, terminando en "Solicito confirmar disponibilidad y condiciones para poder realizar el pago."
3. Vos confirmás desde el panel → pestaña **Solicitudes** (ícono de campana): ahí ves cada solicitud pendiente, podés reasignar el vehículo si el pedido ya no está libre (te muestra alternativas), y al presionar "CONFIRMAR DISPONIBILIDAD" el sistema: asigna el vehículo definitivo, congela **ambos** precios (con descuento por pago total anticipado, y sin descuento para el camino de abono), bloquea esas fechas para ese vehículo, y genera un código/token de pago único que vence en 72 horas.
4. El panel te entrega el enlace de pago y el mensaje de WhatsApp ya redactados (con botones "Copiar enlace", "Copiar mensaje", "Enviar por WhatsApp").
5. El cliente entra por ese enlace (o escribe el código a mano en el modal que aparece al tocar cualquier botón de pago en `/buscar`) y recién ahí ve una tarjeta verde de "reserva confirmada" con los montos reales congelados, la garantía mostrada aparte (nunca sumada ni cobrada), y los botones ya habilitados: "PAGAR TOTAL DE $X" / "PAGAR ABONO DE $X".
6. Todo el precio, estado y monto se valida y se lee **siempre del servidor** — nunca se confía en nada que venga de la URL o del navegador. Se probó explícitamente que un token equivocado, vencido, reutilizado, o una reserva ya pagada/rechazada/cancelada, siempre bloquean el pago con un mensaje claro.

### Decisión de diseño que quedó pendiente de tu confirmación
Al pedir "SOLICITAR CONFIRMACIÓN" **no se pide elegir servicios adicionales antes de escribir por WhatsApp** (silla para bebé, seguros, etc.): el mensaje de WhatsApp indica "Ninguno seleccionado todavía (puedo indicarlos por este chat)" y vos los agregás a mano si el cliente los pide en la conversación, antes de confirmar. Se decidió así para no agregar un paso extra al clic único que tenía el botón antes. Si preferís que el cliente pueda elegir extras antes de escribir (como ya existía en el flujo viejo de pago directo), decímelo y lo agrego como un paso intermedio.

### Qué se probó
- 27+ pruebas de lógica de negocio del backend (Fase 1, siguen pasando) más un lote nuevo específico de este flujo: creación de solicitud, confirmación con congelamiento de precio (se verificó la matemática exacta: $260.000 × 0.85 = $221.000 en el caso probado), rechazo de solicitud, doble confirmación de la misma solicitud (bloqueada), reasignación a otro vehículo cuando el pedido original ya no está libre, doble reserva del mismo vehículo en fechas superpuestas (bloqueada), token vencido (rechazado con mensaje de "enlace vencido"), token equivocado o ausente (rechazado, nunca deja pasar a Webpay), pago ya realizado (bloqueado). Se armó una batería de pruebas de la página `/buscar` con un DOM simulado (sin backend real) que confirmó: los botones bloqueados abren el modal de código y nunca inician Webpay directamente; "SOLICITAR CONFIRMACIÓN" registra la solicitud y abre WhatsApp con el código; si el registro falla por red, igual abre WhatsApp (nunca bloquea el contacto con el cliente); el enlace seguro (`?confirmCode=...&token=...`) valida solo al cargar la página; un enlace inválido o vencido muestra un aviso claro en vez de romper la página; pagar el total o el abono llama primero a fijar la modalidad y después a Webpay, con el token real, y arma el formulario de envío a Webpay correctamente.
- **No se pudo probar la llamada real a Transbank** desde este entorno (sin salida de red a sus servidores, igual que en la Fase 1) — se confirmó en cambio que, con el token correcto, la petición pasa el candado de seguridad y llega hasta el intento real de conexión con Transbank (falla ahí por la red del entorno de pruebas, no por el candado).

### Archivos modificados
Backend (repo `glaciares-reservas-backend`): `config.js`, `db.js`, `routes/api.js`, `routes/admin.js`, `routes/webpay.js`, `public/admin/index.html`.
Frontend (repo `glaciares-web`): `buscar.html`.

### Cambios en la base de datos
No se creó ninguna colección nueva: las solicitudes viven en la misma colección de reservas (`bookings`) con `status: 'requested'` o `status: 'rejected'`, para no duplicar lógica ya probada de disponibilidad/calendario/reportes. Se agregaron campos nuevos a cada reserva (todos opcionales, no rompen reservas existentes): `requestedVehicleId`, `assignedVehicleId`, `totalPriceFull`, `totalPriceNormal`, `paymentToken`, `tokenExpiresAt`, `blockedDateId`. Las reservas existentes no se tocaron.

### Pendiente relacionado (no bloqueante)
- El endpoint público viejo `POST /api/bookings` (crear una reserva "pending" directa, sin pasar por Solicitudes) se dejó **sin usar** desde `/buscar`, pero sigue existiendo en el backend por compatibilidad. Ya no puede usarse para cobrar por Webpay sin confirmación (el candado de token lo bloquea igual), pero técnicamente alguien podría llamarlo a mano y dejar una reserva "pending" fantasma ocupando un cupo sin poder pagarla nunca. Si querés, en una próxima vuelta lo cierro del todo o le agrego una expiración automática más corta.
- Igual que en la Fase 1, la base de datos sigue siendo el archivo `data/db.json` (no una base de datos real) — con más lógica de negocio corriendo sobre ese archivo, este riesgo se mantiene vigente.

## 21. Overhaul del panel admin — Fase 1: seguridad + modelo de datos (2026-08-29)

Este punto documenta la respuesta al pedido de "reconstruir el sistema completo como un desarrollador senior". Es un pedido enorme (22 secciones: autenticación, modelo de datos, disponibilidad, precios, pagos, mantención, reportes, WhatsApp, idempotencia, zona horaria, accesibilidad, 30 pruebas, checklist de entrega). **No es honesto pretender que todo eso se hizo perfecto y completo en una sola pasada** — se implementó y probó de verdad la base más crítica (seguridad y datos, que es lo que la instrucción marcaba como no-negociable), y se deja documentado con precisión qué quedó para una Fase 2.

### Decisión de negocio que se te consultó y confirmaste
El punto 7 de tu instrucción decía "no aplicar automáticamente el 15% por reservar con 3 días de anticipación", lo cual contradecía directamente lo que me pediste dos mensajes antes (bajar el descuento automático de 5 a 3 días, ya en producción). Te pregunté y confirmaste: **se mantiene automático**. Ahora vive como una "promoción" editable en `config.js` (nombre, código, días mínimos, %, a qué modo de pago aplica, fechas de vigencia) y se puede prender/apagar desde el panel (Ajustes → Promoción de reserva anticipada) sin tocar código.

### Qué se implementó y se probó (Fase 1 — lista para publicar)
- **Autenticación real**: se reemplazó el usuario/clave único de HTTP Basic Auth (compartido, sin registro de quién hizo qué) por sesiones de verdad. Contraseñas con hash bcrypt (nunca en texto plano), cookie de sesión `HttpOnly` + `SameSite=Lax` + `Secure` en producción, expira sola tras 30 min sin actividad, logout real, bloqueo temporal (15 min) tras 5 intentos fallidos de login, límite adicional de intentos por IP. Roles `admin` y `operador` (el operador no puede editar precios/config ni ver usuarios ni el registro de accesos). Cada acción relevante (crear/editar reserva, cambiar estado, registrar pago, editar vehículo, editar config, crear usuario) queda anotada en un registro de accesos y cambios visible en Ajustes (solo admin).
- **CORS restringido** a los dominios reales del sitio (antes era `*`), con respuesta 403 limpia (antes tiraba un error 500 con la página de error por defecto de Express).
- **`noindex`** agregado a todas las rutas `/admin` (cabecera `X-Robots-Tag` + `<meta name="robots">`) para que Google nunca las indexe.
- **XSS**: todo dato que puede venir de un cliente (nombre, teléfono, notas) se escapa con una función `esc()` antes de insertarse en el panel vía `innerHTML`. Probado con un nombre de prueba `<script>alert(1)</script>`: se guarda tal cual en la base (no se corrompe el dato) pero se muestra como texto inofensivo en el panel, nunca se ejecuta.
- **Modelo de reservas ampliado**, migrado sin tocar ni una reserva existente (las 3 reservas reales que había se conservaron intactas, se les agregaron los campos nuevos con valores derivados de lo que ya tenían): código legible `GR-2026-0001`, canal de origen (web/manual), vehículo solicitado vs. asignado, **tres estados independientes** — disponibilidad / reserva / financiero —, notas internas vs. notas de cliente, historial de cambios de estado. Con esto una reserva "confirmada" ya **no** se cuenta como dinero recibido a menos que exista un pago real registrado (esto se probó explícitamente).
- **Motor de disponibilidad**: revisa bloqueos manuales, mantenciones que inmovilizan el vehículo y otras reservas, con un colchón de limpieza configurable entre arriendos (por defecto 3 horas, editable en `config.js`) calculado con hora real de retiro/devolución, no solo por día. Si hay conflicto, el mensaje explica por qué (bloqueado / en mantención / reservado) y sugiere vehículos alternativos de la misma categoría que sí están libres.
- **Ledger de pagos independiente** de la reserva: cada abono/pago total/saldo/reembolso queda como un movimiento propio (monto, método, tipo, nota, quién lo registró), nunca se guarda el número completo de tarjeta (Webpay solo entrega y se guarda el últimos-4). El saldo pendiente de cada reserva se calcula sumando estos movimientos, no a mano.
- **Idempotencia**: si el navegador del cliente reenvía el formulario de reserva (doble clic, F5), el backend detecta la misma solicitud y devuelve la reserva ya creada en vez de duplicarla. Probado con la API pública real.
- **Zona horaria correcta**: "hoy" y "días de anticipación" ahora se calculan explícitamente en `America/Punta_Arenas`, no con `toISOString()` (que da la fecha en UTC y puede quedar desfasada cerca de la medianoche). Se agregó como prueba automática.
- **Mantención que bloquea disponibilidad**: al agregar un registro de mantención se puede marcar "deja el vehículo sin disponibilidad" con un rango de fechas, y el motor de disponibilidad lo respeta automáticamente.
- **WhatsApp**: botón en cada reserva que abre (no envía solo) un mensaje prellenado con código de reserva, vehículo, fechas, total y saldo — probado que **excluye las notas internas** y sí incluye las notas para el cliente.
- **Reportes corregidos**: "Cobrado" ahora es dinero realmente recibido (suma de pagos reales), separado de "Confirmado, aún sin cobrar" (reservas confirmadas sin pago) y "Saldos pendientes" (abonos con saldo por cobrar). Se agregó exportación a CSV de todas las reservas.
- **Config de precios centralizada** (`config.js`): tarifa aeropuerto, permiso Argentina, seguros, garantía mínima, recargo por atraso, edad mínima/máxima, horas de aviso para cancelación, colchón de limpieza, y la promoción de reserva anticipada — todo editable sin tocar código (hoy vía `POST /api/admin/config`, con UI parcial en el panel para la promoción; el resto se puede exponer en el panel más adelante si lo necesitas seguido).
- **`GET /api/config`** nuevo: expone al sitio público las tarifas/promoción vigentes, para que en el futuro `buscar.html` deje de tener esos números duplicados a mano en su propio `config.js` (ver "pendiente" más abajo — todavía no se conectó ese cable).

### Cómo se probó (sin acceso a un entorno de staging real)
Se armó una copia de trabajo del backend, se instalaron las dependencias nuevas, se corrió la migración sobre una copia de los datos reales (se confirmó que las 3 reservas existentes quedan intactas), se levantó el servidor de verdad y se probaron por HTTP: login correcto e incorrecto, bloqueo tras 5 intentos fallidos, sesión y cookie funcionando, logout, CORS aceptando el dominio real y rechazando uno ajeno, creación de reserva con nombre malicioso (XSS), selección de monto a cobrar en modo abono vs. pago total. Además, 21 pruebas automáticas de lógica de negocio (descuento, disponibilidad con colchón de limpieza, idempotencia, ledger de pagos, zona horaria, hash de contraseñas, mensaje de WhatsApp) — **todas pasaron**. El único paso que no se pudo probar de punta a punta desde acá es la llamada real a Transbank (la red de este entorno de trabajo no tiene salida a sus servidores), pero el cálculo del monto a cobrar se verificó por separado y es correcto.

### Qué queda pendiente para una Fase 2 (no se implementó todavía)
- **Base de datos real**: sigue usándose el archivo `data/db.json` (ver punto 18 más abajo). Con auditoría y ledger de pagos agregados, este riesgo se vuelve más urgente — cuantos más datos valiosos vivan solo en ese archivo, más grave sería perderlo en un redeploy sin disco persistente.
- **Conectar `buscar.html`/`index.html` al nuevo `GET /api/config`** en vez de tener las tarifas hardcodeadas en el frontend — el endpoint ya existe, falta el cableado.
- **Permisos granulares** más allá de admin/operador (hoy es binario).
- **Panel de edición completa de la config de precios** (hoy solo la promoción tiene UI; el resto se edita vía API).
- **Exportación a Excel** (hoy hay CSV, que Excel abre bien, pero no un `.xlsx` con formato).
- **Datos reales de flota que pediste no inventar**: patente, año, vencimiento de seguro/permiso/revisión técnica de cada vehículo — se agregaron los campos en el modelo (vacíos), pero no se completaron porque no tengo esos datos reales. Tampoco se agregaron a la flota el Hyundai H-1, Ford EcoSport, Kia Sportage 2017 ni una segunda Hyundai Tucson diferenciada que mencionaste como "pendiente de confirmar": no se inventaron specs, así que quedan fuera hasta que me pases los datos reales (precio/día, categoría, foto).
- **Auditoría/accesibilidad completa** (WCAG): se hicieron mejoras concretas (foco en modales, cierre con Escape, `role="dialog"`, `aria-live` para avisos, `prefers-reduced-motion`, tablas ya eran legibles en mobile), pero no se hizo una auditoría formal completa de contraste y lectores de pantalla en todas las vistas.
- **Los 30 escenarios de prueba** que pediste como lista formal no se ejecutaron como checklist de 30 ítems uno por uno; se cubrieron los que corresponden a lo ya implementado (21 pruebas automáticas + pruebas HTTP manuales descritas arriba). Si quieres, en la próxima vuelta armamos esa lista completa de 30 y la vamos tachando a medida que se implementa cada sección restante.

### Variables de entorno nuevas que debes agregar en Render
- `SESSION_SECRET`: clave larga y secreta para firmar la cookie de sesión (el script de despliegue te entrega una generada al azar, o puedes crear la tuya).
- `NODE_ENV=production`: para que la cookie de sesión exija HTTPS (`Secure`).
- `ALLOWED_ORIGIN=https://glaciaresrentacar.cl,https://www.glaciaresrentacar.cl`: dominios permitidos por CORS (antes era `*`).
- `ADMIN_USER` / `ADMIN_PASSWORD` ya no protegen el panel (se reemplazó Basic Auth), pueden quedar o borrarse sin efecto.

### Instrucciones de publicación
1. Ejecuta `deploy-backend-fase1-seguridad.sh` igual que los scripts anteriores (clic derecho al archivo → "Copiar como ruta de acceso" → Git Bash → `bash ` + pegar ruta → Enter). El script instala las dependencias nuevas, corre la migración seleccionando la fecha de respaldo automáticamente, y sube todo a GitHub.
2. **Guarda la contraseña temporal** que el script imprime en pantalla al crear el primer usuario admin — no se vuelve a mostrar.
3. Agrega las 3 variables de entorno de arriba en Render → tu servicio → Environment.
4. Entra a `https://glaciares-reservas-backend.onrender.com/admin/login.html`, inicia sesión con esa contraseña temporal, y cámbiala de inmediato en Ajustes → Mi cuenta.

## 20. Pago con abono mínimo (2026-08-28, noche)
Se agregó la segunda forma de pago que faltaba de la foto de Matu: además de "Reservar y pagar" (precio con -15% si se paga todo ahora), cada vehículo tiene un botón "Precio normal con abono mínimo ($1 día)" que cobra solo el precio de 1 día de arriendo por Webpay y deja el resto como saldo a pagar al retirar el vehículo.

Reglas de negocio implementadas:
- El abono mínimo es siempre 1 día de arriendo de ese vehículo específico (sin descuento).
- Si el cliente paga solo el abono, **no** recibe el 15% por reserva anticipada — por eso ese camino muestra el "precio normal". El descuento solo aplica si paga el total ahora.
- El backend nunca confía en el monto que mande el navegador: al iniciar el pago (`/api/webpay/init`), el monto a cobrar sale de `booking.paymentMode` guardado en el servidor al crear la reserva, no de un parámetro que mande el cliente.
- Cuando el pago del abono es aprobado, se guarda `amountPaid` (lo que Transbank realmente cobró) y `balanceDue` (lo que falta) en la reserva.
- El panel admin (`/admin` → pestaña Reservas) ahora tiene una columna "Saldo pendiente" que muestra ese monto cuando corresponde.
- La página de confirmación (después de pagar) muestra "Abono pagado" y "Saldo pendiente (al retiro)" en vez de solo "Total", cuando el pago fue de tipo abono.

**Bug existente que se corrigió de paso:** al revisar el modal de cotización (el que se abre después de hacer clic en cualquiera de los dos botones de pago), noté que el cargo de aeropuerto y el permiso de Argentina se sumaban dos veces en el total que se le mostraba al cliente justo antes de pagar (una vez porque ya venían incluidos en el precio de la tarjeta de resultados, y otra vez porque el modal los vuelve a sumar como "extra" marcado automáticamente). Esto **no afectaba el monto real cobrado por Webpay** (ese siempre se calcula de nuevo en el servidor y estaba bien), pero sí mostraba un número inflado en la pantalla de confirmación antes de pagar — se corrigió para que el número que ve el cliente coincida siempre con lo que realmente se cobra.

## 19. Diseño "precio especial pago adelantado" tipo Matu Rent a Car (2026-08-28)
El descuento por reserva anticipada ya existía en el backend (15% para reservas hechas con 5+ días de anticipación, en `db.js`). Lo que se pidió fue el diseño: mostrar ese ahorro de forma más visible, como en la foto de referencia de Matu Rent a Car. Se hizo en `buscar.html`:
- El precio tachado (sin descuento) ahora aparece junto al precio final, con el texto "Ahorras -15% pagando ahora".
- El botón de pago se puso dorado con el texto "PRECIO ESPECIAL PAGO ADELANTADO" cuando el vehículo tiene descuento confirmado por el backend (nunca se inventa: si el backend no confirma descuento, el botón queda como "Reservar y pagar" normal).
- Se agregó un aviso de urgencia sobre la lista de resultados (ícono con animación de color) que solo aparece cuando al menos un vehículo tiene descuento activo.

**Nota:** no se agregó la opción de "abono mínimo / pago parcial" que también aparece en la foto de Matu, porque el negocio confirmó que solo quería el cambio visual — esa sería una funcionalidad de pago nueva (cobrar un depósito y el saldo después) que requiere cambios de backend y de Webpay, no solo de diseño.

**Nota 2:** el ícono "cambiando de color" se hizo con una animación CSS (más liviana y rápida de cargar que un GIF real), no con un archivo GIF. Logra el mismo efecto visual sin agregar peso a la página.

## 18. Backend de reservas: catálogo desincronizado + riesgo de pérdida de datos (2026-08-28)
Al revisar si el sitio está realmente conectado a `glaciares-reservas-backend.onrender.com`, se detectaron dos problemas:

**a) Catálogo desactualizado.** Los cambios de flota (quitar Hyundai H1, quitar Tucson duplicado de $39.000, agregar Peugeot 3008) solo se habían aplicado a las tarjetas del sitio (`index.html`/`buscar.html`), nunca a la base de datos real del backend (`data/db.json`). El backend seguía respondiendo con el H1 y el Tucson viejo, y sin el Peugeot 3008. Se corrigió con `deploy-backend-fleet-fix.sh` (el dueño confirmó que solo había datos de prueba en `/admin`, sin reservas reales que proteger).

**b) Riesgo de arquitectura — datos no persistentes.** El backend guarda todo (vehículos, reservas, extras) en un solo archivo `data/db.json` dentro del propio servidor (`db.js`: `fs.readFileSync`/`writeFileSync` sobre un archivo local), no en una base de datos real ni en un disco persistente de Render. Esto significa que cada vez que se publica una corrección de código (como la de este mismo punto), Render vuelve a desplegar desde lo que está en GitHub — y cualquier reserva que se haya guardado en el servidor en vivo mientras tanto, y que nunca se haya vuelto a subir a GitHub, se pierde. Por ahora esto no fue un problema porque solo había datos de prueba, pero antes de operar con reservas y pagos reales en volumen, conviene: (1) agregar un disco persistente de Render montado en `data/`, o (2) migrar a una base de datos real (Postgres, por ejemplo, que Render ofrece gratis en su plan básico). Esto no se implementó todavía porque es un cambio de arquitectura que el dueño debe decidir y priorizar.

## 1. Identificadores de medición (analytics-config.js)
- `GOOGLE_ANALYTICS_ID` (GA4, formato `G-XXXXXXXXXX`) — no configurado.
- `GOOGLE_ADS_ID` (formato `AW-XXXXXXXXX`) y `GOOGLE_ADS_CONVERSION_LABEL` — no configurados.
- `META_PIXEL_ID` — no configurado.
- Acción: completar en `sitio-web/analytics-config.js` y descomentar los bloques de carga de scripts indicados en ese mismo archivo.

## 2. Condiciones comerciales — verificar contra el contrato real
Se usaron como base los datos entregados en el brief inicial. Deben compararse con el contrato de arriendo legal vigente antes de publicarlos como definitivos:
- Kilometraje libre: Región de Magallanes, sujeto al contrato.
- Entrega/retiro en aeropuerto: $20.000.
- Permiso para viajar a Argentina: $120.000.
- Abono de reserva: equivalente a 1 día de arriendo.
- **No se tuvo acceso al documento legal de "Condiciones Generales" original para contrastar cifras; se recomienda que el dueño lo revise línea por línea contra `condiciones.html`.**

### 2.1 Actualización 2026-08-18: condiciones reemplazadas por confirmación directa del dueño
El dueño confirmó explícitamente (en el chat, respondiendo una pregunta directa) que las siguientes cifras SÍ corresponden a las condiciones reales de Glaciares Rent a Car, por lo que **reemplazaron** los valores anteriores en `condiciones.html` e `index.html`:

| Dato | Valor anterior | Valor actual (confirmado) |
|---|---|---|
| Edad mínima | 21 a 75 años | 22 años o más (sin tope superior) |
| Garantía | Mínimo $500.000 | $500.000 a $800.000 en Chile; $1.000.000 para Argentina |
| Anticipación para cancelar sin cargo | 72 horas | 48 horas |
| Deducible general | 15 UF + IVA | Ahora es un rango: 40 UF (daños menores) / 70 UF (daños mayores) / 70 UF (daños a terceros) |
| Deducible agravado | 25 UF + IVA | 90 UF + IVA (volcamiento, pérdida total o apropiación indebida) |

Además se agregaron políticas nuevas que antes no estaban documentadas: cargo por conductor adicional ($5.000 + IVA/día), política de No Show (50% del arriendo si no avisas con 48h), cargo por combustible faltante ($10.000 + IVA por cuarto de estanque), cargo por modificación de reserva fuera de plazo ($15.000 + IVA), y el detalle de protecciones opcionales (accesorios, asistencia en ruta, carrocería, todo riesgo).

**Recomendación:** dado que estas cifras son sustancialmente distintas a las del brief original y a que subieron bastante los deducibles (de 15/25 UF a 40/70/90 UF), vale la pena que el dueño revise `condiciones.html` una vez más para confirmar que no hubo un malentendido antes de que un cliente real las vea.

### 2.2 Actualización 2026-08-25: deducible revertido a valor original
El dueño pidió mantener el deducible como estaba antes (no usar las cifras de Mature). Se revirtió solo esa sección en `condiciones.html`:
- Deducible general (daños menores, choque sin responsabilidad, daños a terceros): 15 UF + IVA.
- Deducible agravado (volcamiento, choque con responsabilidad, robo o pérdida total): 25 UF + IVA.

El resto de las condiciones actualizadas en 2.1 (edad mínima, garantía, plazo de cancelación, conductor adicional, no-show, combustible, protecciones opcionales) se mantiene sin cambios.

## 3. Favicon
Se usó el logo actual (`LOGOSINFONDO.png`) como favicon. Si existe una versión cuadrada optimizada para favicon (ej. 512x512 con fondo sólido), reemplazar el `<link rel="icon">` en `index.html` y `condiciones.html`.

## 4. Backend — extra "Permiso para viaje a Argentina" (ya agregado)
Se agregó el extra `{ "id": 5, "name": "Permiso para viaje a Argentina", "price": 120000, "unit": "flat", "kind": "checkbox" }` en `reservas/data/db.json`, preservando las 3 reservas reales existentes. Pendiente solo confirmar si el precio de $120.000 es fijo o varía según duración del viaje.

## 5. Backend — campo `notes` en reservas (ya agregado)
Se agregó soporte para el campo `notes` en `reservas/routes/api.js`, así que la información adicional del cotizador (pasajeros, destino estimado, viaje a Argentina, retiro en aeropuerto) ya queda guardada en cada reserva.

## 6. Opiniones de clientes
No se encontraron reseñas reales verificadas para mostrar en la web. Se reemplazó la sección de testimonios (que antes tenía nombres y comentarios inventados) por un llamado a "Ver opiniones en Google". Cuando existan reseñas reales, se puede reemplazar esa sección por citas textuales de Google, indicando nombre y fecha reales.

## 7. Especificaciones técnicas de vehículos
Las tarjetas de vehículos muestran únicamente foto, categoría, nombre y precio por día, que son los únicos datos confirmados. No se incluyeron pasajeros, maletas, transmisión, combustible ni tracción porque no había datos confirmados para cada modelo. Si el dueño entrega esas fichas técnicas, se pueden agregar a la tarjeta de cada vehículo en `index.html` (función `renderFleet`).

## 8. Redes sociales
Se mantuvieron los enlaces de Instagram y Facebook ya existentes en el sitio anterior. Confirmar que sigan siendo las cuentas oficiales vigentes.

## 9. Dominio y despliegue
El sitio está desplegado en `glaciares-web.netlify.app`. El `canonical` y los datos estructurados apuntan a `https://www.glaciaresrentacar.cl/`, que es el dominio oficial mencionado en el brief. Confirmar que ese dominio ya esté apuntando (DNS) al sitio de Netlify; si no, el canonical quedaría apuntando a un dominio que aún no resuelve.

## 10. Cargo de aeropuerto: ¿por traslado o por servicio total? — RESUELTO (2026-08-30, madrugada)
**Resuelto.** El dueño confirmó la regla definitiva: $20.000 por tramo (solo retiro o solo devolución), $30.000 si es retiro Y devolución en aeropuerto (nunca $40.000). Implementado y probado en el backend (`reservas/db.js` → `computeAirportFee`) y en todo el sitio — ver punto 25 para el detalle completo de archivos modificados.

## 11. Flota actual (actualizado 2026-08-27/28)
La Tucson duplicada ya no existe: se eliminó la unidad de $39.000 y se dejó una sola "Hyundai Tucson" a $48.000/día. Se agregó "Peugeot 3008" a $59.000/día con foto real. Se quitó del catálogo la "Hyundai H1" (furgón) porque no había foto disponible; si se consigue la foto, se puede reincorporar en `index.html`/`buscar.html` (buscar `FLEET`/`fleet`).

## 12. Especificaciones por vehículo en /buscar
La nueva página de resultados (`buscar.html`) no muestra pasajeros, maletas, transmisión, combustible ni tracción por vehículo (mismo motivo que el punto 7: no hay datos confirmados). Los filtros de la página también se limitaron a categoría y precio por el mismo motivo — no se agregaron filtros de transmisión/combustible/tracción/capacidad porque no hay datos reales que respalden esas columnas.

## 13. Vigencia real de la promoción de reserva anticipada
No se confirmó una fecha de término real para la promoción del 15% de descuento. Desde 2026-08-28, mientras `config.js` (`PROMOTION_END_DATE`) quede vacío, el sitio muestra el texto neutro "Beneficio por reserva anticipada" (sin afirmar "vigente" ni "por tiempo limitado"). Cuando exista una fecha real, escribirla en `PROMOTION_END_DATE` (formato `"2026-12-31"`) y el sitio automáticamente mostrará "Promoción vigente" + "Promoción válida para reservas realizadas hasta el [fecha]."

## 14. Retiro/devolución en "Hotel o alojamiento" y "Otro lugar"
El cotizador ahora permite elegir "Hotel o alojamiento en Punta Arenas" y "Otro lugar" como opciones de retiro/devolución, tal como pidió el brief, pero ambas están marcadas como "sujeto a confirmación/evaluación" porque no hay un proceso ni tarifa confirmada para trasladar el vehículo a un hotel específico o a "otro lugar" fuera de la agencia y el aeropuerto. El equipo debe confirmar por WhatsApp la disponibilidad real y si corresponde algún cargo antes de aceptar la reserva.

## 15. Código promocional
El campo de código promocional en el cotizador se guarda y se muestra en el resumen de la reserva, pero no aplica ningún descuento automático (no existe un sistema real de validación de códigos). El mensaje que ve el cliente aclara que el código "será validado por el equipo al confirmar la reserva". Si se implementa un sistema real de códigos, se puede conectar en `buscar.html`.

Desde 2026-08-28 existe `config.js` → `VALID_PROMO_CODES` (lista vacía por ahora). Si el negocio define códigos reales (ej. `["ANTICIPADO15"]`), agregarlos ahí: el sitio mostrará "Código reconocido" al cliente en tiempo real, aunque el descuento efectivo lo sigue determinando el backend, no el código en sí.

## 17. Banner de formas de pago (2026-08-28)
Se agregó un banner en la portada (debajo del hero) y una columna en el footer mostrando qué tarjetas se aceptan: Visa, Mastercard, Redcompra y Webpay Plus.

**Importante:** no se usaron los logotipos oficiales de Visa/Mastercard/Redcompra porque son marcas registradas y no tenemos los archivos con licencia de cada marca (probé descargarlos de bancos de íconos abiertos como Simple Icons, pero Visa y Mastercard están excluidos ahí precisamente por restricciones de marca). En su lugar se hicieron insignias de texto con los colores asociados a cada marca — comunican lo mismo sin usar el arte oficial.

**Actualización 2026-08-28 (tarde):** el dueño subió los archivos oficiales `LOGO WEBPAY RGB-01.jpg` y `LOGO TRANSBANK RGB-01.jpg` (del kit de marca real de Transbank). Se convirtieron a WebP (`sitio-web/pagos/webpay-transbank.webp` y `sitio-web/pagos/transbank.webp`) y se reemplazó la insignia de texto "Webpay Plus" por el logo real en el banner y en el footer.

**Actualización 2026-08-28 (noche, 2):** el dueño subió el kit oficial completo de Mastercard Brand Center (`mc_symbol_PNG.zip`, `mc_branding_EPS.zip`, `mc_decal_printing_EPS.zip` — se verificó el PDF interno `mc_brandcenter_READ-ME` que remite a brand.mastercard.com, confirmando que es material oficial). Se usó el símbolo PNG con transparencia (`sitio-web/pagos/mastercard.png`) para reemplazar la insignia de texto "Mastercard" por el logo real en las tres ubicaciones (banner superior, sección "Medios de pago disponibles" y footer).

Visa, Amex, Diners Club y Redcompra siguen como insignias de texto porque esos archivos oficiales no han llegado. Fuentes oficiales si se quiere completar: Visa → brand.visa.com (sin login); Amex/Diners/Redcompra → habría que pedirlos directamente a cada marca o a Transbank.

**Actualización 2026-08-28 (noche, 3) — carga manual sin pasar por Claude:** se dejaron "ranuras" listas en el código para que el dueño suba estos 4 logos directamente a GitHub sin necesitar otra corrección de código. Nombres de archivo exactos que el sitio ya está buscando en la carpeta `pagos/`:
- `pagos/visa.png`
- `pagos/amex.png`
- `pagos/diners.png`
- `pagos/redcompra.png`

Cómo subirlos manualmente: entrar a github.com/cristiangarrido27/glaciares-web → carpeta `pagos` → botón "Add file" → "Upload files" → arrastrar el archivo con el nombre exacto de arriba (formato PNG con fondo transparente si es posible) → hacer commit directo a `main`. Netlify vuelve a publicar solo en 1-2 minutos, sin necesitar el script `deploy-fix-completo.sh`. Si el archivo no existe, el sitio no se rompe: sigue mostrando la insignia de texto de respaldo automáticamente.

También falta confirmar con Transbank cuáles tarjetas están habilitadas en la cuenta real de Webpay Plus del negocio: la mayoría de los comercios chilenos procesan Visa, Mastercard y Redcompra por defecto, pero American Express y Diners Club suelen requerir aprobación aparte.

**Actualización 2026-08-28 (noche):** se agregó una nueva sección "Medios de pago disponibles" justo antes del footer (pedida explícitamente por el dueño), con insignias para Visa, Mastercard, Amex, Diners Club, Redcompra y el logo real de Webpay/Transbank. El dueño insistió tres veces en incrustar directamente una imagen compuesta de terceros (gráficos tipo "Así se paga hoy" / "Aquí puedes pagar como prefieras", y un paquete de stock de Vecteezy) que junta 9 marcas registradas distintas sin licencia clara para redistribuirse — se explicó cada vez por qué no se usa (riesgo de marca registrada/derechos de autor de un gráfico ajeno) y en su lugar se construyó la sección con insignias de texto + el logo real de Webpay ya autorizado. **Importante:** como ahora se muestran también Amex y Diners Club en esta sección nueva, falta confirmar con Transbank que estén realmente habilitados en la cuenta antes de publicar — si no lo están, hay que quitarlos para no prometer algo que el cliente no puede pagar en la práctica.

## 16. Corrección integral 2026-08-28 (bug de `/buscar`, portada, promoción y pago)
Se corrigieron varios problemas reales detectados en el sitio publicado:

- **Parámetros de `/buscar` ignorados**: la página tenía sus propios nombres internos (`dateFrom`, `hourFrom`, `promo`, etc.) que no coincidían con los nombres que se probaron externamente (`pickUpDate`, `pickUpTime`, `promoCode`, etc.), por lo que un enlace compartido con esos nombres se ignoraba y la página mostraba la fecha de hoy en vez de la búsqueda real. Se unificó **todo el sitio** (formulario de portada, `/buscar`, panel "Modificar búsqueda", mensajes de WhatsApp) a un único set de nombres: `pickUpDate`, `pickUpTime`, `dropOffDate`, `dropOffTime`, `pickUpPlace`, `dropOffPlace`, `dropOffOther`, `passengers`, `destination`, `destinationOther`, `argentina`, `promoCode`.
- **Prioridad de datos**: `/buscar` ahora respeta primero los parámetros de la URL, luego la última búsqueda guardada en `sessionStorage`, y solo usa la fecha de hoy si no hay ninguna de las dos anteriores.
- **Cálculo de días**: antes se calculaba solo con la fecha (ignorando la hora). Ahora usa fecha + hora completas; cada bloque de 24 horas se cobra como un día. Se probó con la URL de ejemplo (10 sep 09:00 → 14 sep 09:00 = 4 días) y da el resultado correcto.
- **Pasajeros y destino**: se agregaron al cotizador de portada y al panel "Modificar búsqueda" de `/buscar`; ahora aparecen en el resumen y en el mensaje de WhatsApp.
- **"Reservar y pagar"**: por pedido explícito del dueño (2026-08-28), el botón se mantiene siempre visible junto a "SOLICITAR CONFIRMACIÓN", para permitir pagar el total por adelantado (con el % de descuento por reserva anticipada cuando el backend lo entrega para esas fechas). Para no volver a caer en la contradicción original, se agregó una aclaración junto al botón: "Al pagar quedas con la reserva registrada; te confirmamos la unidad exacta antes de la entrega." El descuento mostrado en el botón (`-X% incluido`) y en el desglose viene siempre del backend (`discountPct`), nunca se inventa ni se aplica solo por escribir un código.
- **Imagen de portada rota**: las 4 fotos del carrusel (que apuntaban a `/PAISAJES/...` inexistente) se reemplazaron por fotos reales convertidas a WebP en `/portada/portada-patagonia-01..04.webp`, con imagen de respaldo (degradado) si alguna falla — el texto y los botones nunca dependen de que la imagen cargue.
- **Imagen de promoción rota**: `/IMAGENES_GLACIARES_NUEVO AUTOS/PROMOCION/PROMOCION.jpg` no existía. Se reemplazó por `/promocion/promocion-reserva-anticipada.webp` (foto real) con respaldo automático si falla.
- **Íconos de servicios recortados**: `#servicesGrid .card img` ahora usa `object-fit: contain` sobre fondo blanco en vez de `cover`, así se ve el ícono completo sin recortes.
- **Fotos de flota**: se renombraron a nombres simples en minúsculas dentro de `/flota/` (`suzuki-swift.webp`, `suzuki-dzire.webp`, `chevrolet-captiva.webp`, `kia-sorento.webp`, `hyundai-tucson.webp`, `peugeot-3008.webp`), convertidas a WebP (bajaron de ~1.3 MB a 40-65 KB cada una). Las imágenes antiguas en `IMAGENES_GLACIARES_NUEVO AUTOS/...` quedaron sin usar en el repositorio; se pueden borrar más adelante si se quiere limpiar.
- **Políticas centralizadas**: se agregó `config.js` → `RENTAL_POLICIES` con edad mínima (22, confirmada), cancelación (48h, confirmada), garantías, conductor adicional, etc., en un solo lugar en vez de repetidos por el código.

**Nota sobre la estructura de carpetas**: el pedido original sugería `/public/images/portada/...`, pero el sitio completo (Netlify) sirve los archivos desde la raíz del repositorio, no desde una carpeta `/public/`. Se usó `/portada/`, `/promocion/` y `/flota/` en la raíz para mantener consistencia con el resto del sitio (`/LOGOSINFONDO.png`, `/SECCION LUGARES TURISTICOS/`, etc.) sin reestructurar todo el proyecto.

**Pendiente real**: no se encontró ninguna foto para la Hyundai H1 (furgón), por lo que se sacó del catálogo en vez de inventar o dejar una imagen rota. Si se consigue la foto, avisar para reincorporarla.
