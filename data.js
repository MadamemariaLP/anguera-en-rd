// RD TRIP CLUB — datos semilla del viaje (sacados del PDF "Anguera en RD").
// Todo lo que el grupo edita en la app vive en el estado (store), no aquí.

window.TRIP = {
  id: 'anguera-rd-2027',
  name: 'RD TRIP CLUB',
  tagline: 'One group. One island. A thousand memories.',
  crew: 'Padres del fútbol ⚽',
  start: '2027-08-13T14:50:00+02:00', // salida TS0261 desde BCN T2
  end: '2027-08-26',
  nights: 12,
  fx: { USD: 1.17, DOP: 70 }, // 1 € = x (tipo supuesto del PDF; DOP aprox.)
  whatsapp: '', // enlace del grupo de WhatsApp (se pega en Ajustes)
};

window.FAMILIES = [
  { id: 'f1', name: 'Familia 1', color: '#00B4C5', emoji: '🐬', room: '2A + 1 niño' },
  { id: 'f2', name: 'Familia 2', color: '#FF6B5B', emoji: '🦩', room: '2A + 1 niño' },
  { id: 'f3', name: 'Familia 3', color: '#FFB627', emoji: '🥭', room: '2A + 3 niños' },
  { id: 'f4', name: 'Familia 4', color: '#1DB980', emoji: '🌴', room: '2A + 1 adol. + 2 niños' },
];

// 8 adultos, 1 adolescente, 7 niños. Nombres editables desde la app.
window.MEMBERS = [
  { id: 'm1', fam: 'f1', name: 'Adulto 1', kind: 'adult', avatar: '😎' },
  { id: 'm2', fam: 'f1', name: 'Adulto 2', kind: 'adult', avatar: '🌺' },
  { id: 'm3', fam: 'f1', name: 'Peque 1', kind: 'kid', avatar: '🐢' },
  { id: 'm4', fam: 'f2', name: 'Adulto 3', kind: 'adult', avatar: '🏄' },
  { id: 'm5', fam: 'f2', name: 'Adulto 4', kind: 'adult', avatar: '🍹' },
  { id: 'm6', fam: 'f2', name: 'Peque 2', kind: 'kid', avatar: '🦀' },
  { id: 'm7', fam: 'f3', name: 'Adulto 5', kind: 'adult', avatar: '⚽' },
  { id: 'm8', fam: 'f3', name: 'Adulto 6', kind: 'adult', avatar: '🌞' },
  { id: 'm9', fam: 'f3', name: 'Peque 3', kind: 'kid', avatar: '🐠' },
  { id: 'm10', fam: 'f3', name: 'Peque 4', kind: 'kid', avatar: '🦜' },
  { id: 'm11', fam: 'f3', name: 'Peque 5', kind: 'kid', avatar: '🐙' },
  { id: 'm12', fam: 'f4', name: 'Adulto 7', kind: 'adult', avatar: '🥥' },
  { id: 'm13', fam: 'f4', name: 'Adulto 8', kind: 'adult', avatar: '🎸' },
  { id: 'm14', fam: 'f4', name: 'Teen 1', kind: 'teen', avatar: '🎧' },
  { id: 'm15', fam: 'f4', name: 'Peque 6', kind: 'kid', avatar: '🦈' },
  { id: 'm16', fam: 'f4', name: 'Peque 7', kind: 'kid', avatar: '🐳' },
];

window.ZONES = [
  { id: 'yul', name: 'Montreal', short: 'YUL', emoji: '🍁', color: '#FF6B5B', x: 0, y: 0, nights: 1, dates: '13 → 14 ago' },
  { id: 'ltr', name: 'Las Terrenas · Samaná', short: 'LTR', emoji: '🏝️', color: '#00B4C5', x: 214, y: 70, nights: 4, dates: '14 → 18 ago' },
  { id: 'puj', name: 'Punta Cana · Hard Rock', short: 'PUJ', emoji: '🎸', color: '#FFB627', x: 300, y: 128, nights: 7, dates: '18 → 25 ago' },
];

// Itinerario día a día. kind: flight | transfer | beach | adventure | food | chill | party | idea
window.DAYS = [
  { date: '2027-08-13', zone: 'yul', title: 'Barcelona → Montreal', emoji: '✈️',
    items: [
      { id: 'a0', time: '12:00', title: 'Quedada en el aeropuerto · BCN Terminal 2', kind: 'chill', note: '3 h antes del vuelo largo' },
      { id: 'a1', time: '14:50', title: 'Vuelo TS0261 BCN → YUL', kind: 'flight', note: 'Air Transat · 8 h 30 min · llegada 17:20 hora de Montreal' },
      { id: 'a2', time: '18:30', title: 'Hotel junto al aeropuerto YUL', kind: 'chill', note: '~200 $ por familia · 1 noche' },
    ] },
  { date: '2027-08-14', zone: 'ltr', title: 'Montreal → Punta Cana → Las Terrenas', emoji: '🛫',
    items: [
      { id: 'a3', time: '09:20', title: 'Vuelo TS0398 YUL → PUJ', kind: 'flight', note: 'Air Transat · 4 h 25 min · llegada 13:45 a PUJ Terminal A' },
      { id: 'a4', time: '14:45', title: 'Transfer privado a Las Terrenas', kind: 'transfer', note: '4 h de carretera · o coches de alquiler (votación)' },
      { id: 'a5', time: '19:00', title: 'Llegada a la villa al atardecer', kind: 'chill', note: '🌅 Primer chapuzón obligatorio' },
    ] },
  { date: '2027-08-15', zone: 'ltr', title: 'Playa Cosón & piscina', emoji: '🏖️',
    items: [
      { id: 'a6', time: '10:00', title: 'Compra grande en el súper', kind: 'food', note: '~500 $ para 3 días de chef' },
      { id: 'a7', time: '11:30', title: 'Playa Cosón', kind: 'beach', note: 'Día de no hacer nada' },
      { id: 'a8', time: '20:30', title: 'Cena del chef en la villa', kind: 'food', note: 'Chef en casa' },
    ] },
  { date: '2027-08-16', zone: 'ltr', title: 'Quads al Salto El Limón', emoji: '🏍️',
    items: [
      { id: 'a9', time: '09:00', title: 'Ruta en quad al Salto El Limón', kind: 'adventure', note: 'Opcional · 50 $/quad/día', cost: 50, cur: 'USD', optional: true },
      { id: 'a10', time: '16:00', title: 'Tarde en Playa Bonita', kind: 'beach' },
      { id: 'a10b', time: 'Todo el día', title: '🇩🇴 Día de la Restauración (fiesta nacional)', kind: 'party', note: 'Se celebra la guerra de 1863 contra España. Puede haber desfiles, banderas y bancos cerrados.' },
    ] },
  { date: '2027-08-17', zone: 'ltr', title: 'Día en Playa Ballenas', emoji: '🐋',
    items: [
      { id: 'a11', time: '10:30', title: 'Playa Las Ballenas', kind: 'beach', note: 'Vistas a los islotes, a un paseo del pueblo' },
      { id: 'a12', time: '18:00', title: 'Atardecer en el Pueblo de los Pescadores', kind: 'party', note: 'Idea · copa frente al mar', optional: true },
      { id: 'a13', time: '21:00', title: 'Última cena del chef', kind: 'food' },
    ] },
  { date: '2027-08-18', zone: 'puj', title: 'Las Terrenas → Hard Rock', emoji: '🎸',
    items: [
      { id: 'a14', time: '11:00', title: 'Check-out de la villa', kind: 'chill' },
      { id: 'a15', time: '11:30', title: 'Transfer privado a Punta Cana', kind: 'transfer', note: '4 h' },
      { id: 'a16', time: '16:00', title: 'Check-in Hard Rock · empieza el todo incluido', kind: 'party' },
    ] },
  { date: '2027-08-19', zone: 'puj', title: 'Hard Rock, todo incluido', emoji: '🍹',
    items: [
      { id: 'a17', time: 'Todo el día', title: 'Piscinas, playa y kids club', kind: 'chill', note: '0 € extra · cartera en la caja fuerte' },
    ] },
  { date: '2027-08-20', zone: 'puj', title: 'Catamarán party (idea)', emoji: '⛵',
    items: [
      { id: 'a18', time: '11:00', title: 'Catamarán party + snorkel', kind: 'party', note: 'Idea · por votar · ~45 €', cost: 45, cur: 'EUR', optional: true },
    ] },
  { date: '2027-08-21', zone: 'puj', title: 'Hard Rock, todo incluido', emoji: '🏊',
    items: [
      { id: 'a19', time: 'Todo el día', title: 'Piscinas, playa y barra libre', kind: 'chill' },
      { id: 'a20', time: '21:00', title: 'Noche de bachata (Bingo + Ruleta)', kind: 'party', note: 'Juegos RD Trip Club' },
    ] },
  { date: '2027-08-22', zone: 'puj', title: 'Isla Saona (idea)', emoji: '🏝️',
    items: [
      { id: 'a21', time: '07:30', title: 'Excursión a Isla Saona', kind: 'adventure', note: 'Idea · por votar · día completo', optional: true },
    ] },
  { date: '2027-08-23', zone: 'puj', title: 'Hard Rock, todo incluido', emoji: '🌴',
    items: [
      { id: 'a22', time: 'Todo el día', title: 'Día libre en el resort', kind: 'chill' },
      { id: 'a23', time: '19:00', title: 'Concurso de fotos: votación final', kind: 'party' },
    ] },
  { date: '2027-08-24', zone: 'puj', title: 'Último día de playa', emoji: '🌅',
    items: [
      { id: 'a24', time: 'Todo el día', title: 'Playa y piscina', kind: 'beach' },
      { id: 'a25', time: '21:00', title: 'Cena de despedida + entrega de premios', kind: 'party' },
    ] },
  { date: '2027-08-25', zone: 'puj', title: 'Punta Cana → Montreal → BCN', emoji: '🛫',
    items: [
      { id: 'a25b', time: '12:00', title: 'Check-out y transfer a PUJ Terminal A', kind: 'transfer' },
      { id: 'a26', time: '15:05', title: 'Vuelo TS0399 PUJ → YUL', kind: 'flight', note: 'Air Transat · 4 h 30 min · llegada 19:35' },
      { id: 'a26b', time: '23:45', title: 'Vuelo TS0260 YUL → BCN', kind: 'flight', note: 'Air Transat · 7 h 15 min · escala de 4 h 10 min en Montreal' },
    ] },
  { date: '2027-08-26', zone: 'yul', title: 'Llegada a Barcelona', emoji: '🏠',
    items: [
      { id: 'a27', time: '13:00', title: 'Aterrizaje en BCN Terminal 2', kind: 'flight', note: 'Morenos y con la canción del verano en bucle' },
    ] },
];

// Vuelos verificados (capturas de la reserva, 29/10/2026). Comprados y confirmados ✅
window.FLIGHTS_STATUS = { bought: true, airline: 'Air Transat', note: 'Reserva confirmada · 16 billetes ida y vuelta vía Montreal.' };
window.FLIGHTS = [
  { leg: 'Ida 1/2', no: 'TS0261', from: 'BCN', fromCity: 'Barcelona T2', to: 'YUL', toCity: 'Montreal', date: 'Vie 13 ago', dep: '14:50', arr: '17:20', dur: '8 h 30 min', note: 'Noche en Montreal: conexión de 16 h' },
  { leg: 'Ida 2/2', no: 'TS0398', from: 'YUL', fromCity: 'Montreal', to: 'PUJ', toCity: 'Punta Cana T-A', date: 'Sáb 14 ago', dep: '09:20', arr: '13:45', dur: '4 h 25 min', note: 'Total ida: 28 h 55 min (con la noche)' },
  { leg: 'Vuelta 1/2', no: 'TS0399', from: 'PUJ', fromCity: 'Punta Cana T-A', to: 'YUL', toCity: 'Montreal', date: 'Mié 25 ago', dep: '15:05', arr: '19:35', dur: '4 h 30 min', note: 'Conexión de 4 h 10 min en Montreal' },
  { leg: 'Vuelta 2/2', no: 'TS0260', from: 'YUL', fromCity: 'Montreal', to: 'BCN', toCity: 'Barcelona T2', date: 'Mié 25 → Jue 26 ago', dep: '23:45', arr: '13:00 +1', dur: '7 h 15 min', note: 'Total vuelta: 15 h 55 min' },
];

window.STAYS = [
  { id: 's1', zone: 'yul', name: 'Hotel aeropuerto YUL', dates: '13 → 14 ago · 1 noche (vuelo a las 09:20)', price: '~200 $ por familia', status: 'pendiente', img: 'p16', imgCap: 'Poutine, la cena típica de Montreal' },
  { id: 's2', zone: 'ltr', name: 'Villa en Las Terrenas', dates: '14 → 18 ago · 4 noches', price: '2.608–5.838 € en Airbnb (+ luz según villa) · 8 candidatas', status: 'votación', poll: 'p1', img: 'villa', imgCap: 'Playa Cosón, la playa de las villas' },
  { id: 's3', zone: 'puj', name: 'Hard Rock Punta Cana', dates: '18 → 25 ago · 7 noches', price: '11.257 $ · 4 habitaciones', status: 'pendiente', img: 'hardrock', imgCap: 'Hard Rock Hotel & Casino Punta Cana',
    rooms: [
      { fam: 'f1', label: '2A + 1 niño', price: 2700 },
      { fam: 'f2', label: '2A + 1 niño', price: 2700 },
      { fam: 'f3', label: '2A + 3 niños*', price: 2700 },
      { fam: 'f4', label: '2A + 1 adol. + 2 niños*', price: 3157 },
    ],
    note: '* Un niño de cada familia de 5 duerme con una familia de 3: ninguna habitación pasa de 2 niños gratis.' },
];

window.VILLAS = [
  { id: 'v1', url: 'https://www.airbnb.es/rooms/1017327979722645721?adults=8&children=8&check_in=2027-08-14&check_out=2027-08-18', name: 'Casa del Río · Playa Cosón', meta: '9 dorm · 16 camas · 8,5 baños', rating: 4.83, price: 5838, tags: ['Favorita', 'Chef y personal incluidos', 'Frente al mar', 'Luz incluida (según el anuncio)'] },
  { id: 'v2', url: 'https://www.airbnb.es/rooms/10182938?adults=8&children=8&check_in=2027-08-14&check_out=2027-08-18', name: 'Villa tropical beachfront', meta: '8 dorm · 12 camas · 8 baños', rating: 4.86, price: 3086, tags: ['Primera línea', 'Piscina'] },
  { id: 'v3', url: 'https://www.airbnb.es/rooms/1886712?adults=8&children=8&check_in=2027-08-14&check_out=2027-08-18', name: 'Casa Coco · a 50 m de Cosón', meta: '7 dorm · 11 camas · 6,5 baños', rating: 4.87, price: 3422, tags: ['Chef opcional'] },
  { id: 'v4', url: 'https://www.airbnb.es/rooms/1138147595655505633?adults=8&children=8&check_in=2027-08-14&check_out=2027-08-18', name: 'Villa Balboa · Cap Bonita', meta: '6 dorm · 9 camas · 6,5 baños', rating: 4.91, price: 4517, tags: ['Acceso playa VIP', '+45 $/noche luz'] },
  { id: 'v5', url: 'https://www.airbnb.es/rooms/1592054430164573904?adults=8&children=8&check_in=2027-08-14&check_out=2027-08-18', name: 'Villa de lujo · Río Cosón', meta: '6 dorm · 18 camas · 6,5 baños', rating: 4.75, price: 2608, tags: ['Chef incluido', 'Oferta: antes 3.029 €', '+300 € luz'] },
  { id: 'v6', url: 'https://www.airbnb.es/rooms/1790162866194806261?adults=8&children=8&check_in=2027-08-14&check_out=2027-08-18', name: 'Villa Angela · El Portillo', meta: '5 dorm · 9 camas · 5 baños · hasta 16', rating: null, price: 4568, tags: ['Frente a la playa', 'Nueva: sin reseñas'] },
  { id: 'v7', url: 'https://www.airbnb.es/rooms/1605852786416374364?adults=8&children=8&check_in=2027-08-14&check_out=2027-08-18', name: 'Villas Paul · Portillo', meta: '6 dorm · 6 camas · 5,5 baños', rating: 5.0, price: 2683, tags: ['Mayordomo y cocineros', 'Comunidad privada', 'Ojo: solo 6 camas'] },
  { id: 'v8', url: 'https://www.airbnb.es/rooms/7179978?adults=8&children=8&check_in=2027-08-14&check_out=2027-08-18', name: 'Villa única frente a la playa', meta: '8 dorm · 9 camas · 7 baños · 14–17 plazas', rating: 4.79, price: 5398, tags: ['Frente a la playa'] },
];

// url: anuncio de Airbnb (María, 30/10). price = total de Airbnb para 14–18 ago 2027 y 16 huéspedes, consultado el 30/10/2026.
// Las opciones de la encuesta p1 van en el mismo orden (los votos se guardan por índice: añadir siempre al final).
// Presupuesto del grupo (PDF pág. 5). EUR.
window.BUDGET = {
  total: 28340, perPerson: 1770,
  lines: [
    { id: 'flights', cat: 'Vuelos', emoji: '✈️', eur: 11520, calc: '16 × 720 €' },
    { id: 'yul', cat: 'Hotel Montreal', emoji: '🍁', eur: 684, calc: '4 familias × 200 $' },
    { id: 'transfer', cat: 'Transfer PUJ ⇄ LTR', emoji: '🚐', eur: 940, calc: 'Ida y vuelta, precio cerrado' },
    { id: 'villa', cat: 'Villa (media)', emoji: '🏡', eur: 4550, calc: '(3.000 + 6.100) ÷ 2' },
    { id: 'super', cat: 'Súper para el chef', emoji: '🛒', eur: 427, calc: '~3 días' },
    { id: 'chef', cat: 'Chef', emoji: '👨‍🍳', eur: 256, calc: '0 si la villa lo incluye' },
    { id: 'quads', cat: 'Quads (opcional)', emoji: '🏍️', eur: 342, calc: '8 quads × 1 día' },
    { id: 'hardrock', cat: 'Hard Rock', emoji: '🎸', eur: 9621, calc: '3 × 2.700 $ + 3.157 $' },
    { id: 'destino', cat: 'Gastos en destino', emoji: '🧾', eur: 0, calc: 'Sin presupuesto en el PDF (todo incluido en el Hard Rock)' },
  ],
  families: { f1: 5860, f2: 5860, f3: 8115, f4: 8505 },
};

// Pagos grandes (PDF pág. 6). Se marca por familia quién ha pagado su parte.
window.MILESTONES = [
  { id: 'pay1', title: 'Comprar los vuelos', emoji: '✈️', amount: '11.520 €', detail: '720 € por persona · pago completo · cuanto antes', due: 'Cuanto antes', share: { f1: 2160, f2: 2160, f3: 3600, f4: 3600 } },
  { id: 'pay2', title: 'Reservar la villa (50 %)', emoji: '🏡', amount: '~2.275 €', detail: '50 % al reservar, resto más adelante · luz aparte', due: 'Tras la votación', share: { f1: 427, f2: 427, f3: 711, f4: 711 } },
  { id: 'pay3', title: 'Reservar el Hard Rock', emoji: '🎸', amount: '11.257 $', detail: 'Pago completo · cancelación gratis hasta el 18/07/2027', due: 'Cancelación gratis hasta 18 jul 2027', share: { f1: 2308, f2: 2308, f3: 2308, f4: 2698 } },
];

window.DOCS_CHECKLIST = [
  { id: 'd1', emoji: '🛂', title: 'Pasaporte en vigor', detail: 'Mínimo 6 meses de validez tras la vuelta. También los peques.' },
  { id: 'd2', emoji: '🍁', title: 'eTA de Canadá', detail: 'Necesaria para volar vía Montreal. Se pide online en canada.ca (oficial), una por persona.' },
  { id: 'd3', emoji: '🇩🇴', title: 'E-Ticket República Dominicana', detail: 'Formulario gratuito de entrada/salida en eticket.migracion.gob.do (oficial).' },
  { id: 'd4', emoji: '🏥', title: 'Seguro de viaje', detail: 'Con cobertura médica en RD y Canadá.' },
  { id: 'd5', emoji: '👶', title: 'Autorización de menores', detail: 'Si algún niño viaja sin uno de sus padres.' },
  { id: 'd6', emoji: '🔌', title: 'Adaptador tipo A/B', detail: 'Enchufes americanos en RD y Canadá.' },
];

// Lugares para Explora. Coordenadas reales aproximadas para abrir en Maps.
window.PLACES = [
  { id: 'p1', lat: 19.335, lon: -69.487, img: 'p1', zone: 'ltr', cat: 'playa', name: 'Playa Cosón', emoji: '🏖️', desc: 'Kilómetros de arena y cocoteros junto a la villa. Ideal para los peques por la mañana.', q: 'Playa Cosón Las Terrenas', kids: true },
  { id: 'p2', lat: 19.318, lon: -69.575, img: 'p2', zone: 'ltr', cat: 'playa', name: 'Playa Bonita', emoji: '🌊', desc: 'Más tranquila y salvaje. Buena para la tarde de los quads.', q: 'Playa Bonita Las Terrenas', kids: true },
  { id: 'p3', lat: 19.323, lon: -69.537, img: 'p3', zone: 'ltr', cat: 'playa', name: 'Playa Las Ballenas', emoji: '🐋', desc: 'A un paseo del pueblo, con vistas a los islotes Las Ballenas.', q: 'Playa Las Ballenas Las Terrenas', kids: true },
  { id: 'p4', lat: 19.28, lon: -69.449, img: 'p4', zone: 'ltr', cat: 'excursion', name: 'Salto El Limón', emoji: '💦', desc: 'Cascada de ~40 m entre la selva. A caballo, a pie o en quad.', q: 'Salto El Limón Samaná' },
  { id: 'p5', lat: 19.3, lon: -69.233, img: 'p5', zone: 'ltr', cat: 'excursion', name: 'Playa Rincón', emoji: '🥥', desc: 'Una de las playas más bonitas del Caribe. Se llega en barca o 4×4.', q: 'Playa Rincón Samaná' },
  { id: 'p6', lat: 19.04, lon: -69.6, img: 'p6', zone: 'ltr', cat: 'excursion', name: 'Parque Nacional Los Haitises', emoji: '🦅', desc: 'Manglares, cuevas con pinturas taínas y cayos. En barco desde Samaná.', q: 'Parque Nacional Los Haitises' },
  { id: 'p7', lat: 19.171, lon: -69.272, img: 'p7', zone: 'ltr', cat: 'excursion', name: 'Cayo Levantado', emoji: '🏝️', desc: 'Islita frente a la bahía de Samaná. Plan fácil de medio día.', q: 'Cayo Levantado' },
  { id: 'p8', lat: 19.322, lon: -69.529, img: 'p8', zone: 'ltr', cat: 'comida', name: 'Pueblo de los Pescadores', emoji: '🐟', desc: 'Fila de restaurantes frente al mar en Las Terrenas. Pescado del día y atardecer.', q: 'Pueblo de los Pescadores Las Terrenas' },
  { id: 'p9', lat: 19.33, lon: -69.495, img: 'p9', zone: 'ltr', cat: 'comida', name: 'Cena del chef en la villa', emoji: '👨‍🍳', desc: 'Mangú, tostones, pescado con coco (estilo Samaná). Pedidle sancocho una noche.', q: 'Las Terrenas' },
  { id: 'p10', lat: 18.16, lon: -68.7, img: 'p10', zone: 'puj', cat: 'excursion', name: 'Isla Saona', emoji: '🌴', desc: 'Piscina natural con estrellas de mar y catamarán. Día completo.', q: 'Isla Saona' },
  { id: 'p11', lat: 18.6, lon: -68.36, img: 'p11', zone: 'puj', cat: 'fiesta', name: 'Catamarán party', emoji: '⛵', desc: 'Snorkel, música y barra libre en barco. Hay versiones familiares. (Foto: barcos en Bayahibe.)', q: 'Catamaran Punta Cana' },
  { id: 'p12', lat: 18.43, lon: -68.4, img: 'p12', zone: 'puj', cat: 'excursion', name: 'Hoyo Azul · Scape Park', emoji: '💎', desc: 'Cenote turquesa dentro de un parque de aventura en Cap Cana.', q: 'Hoyo Azul Scape Park' },
  { id: 'p13', lat: 18.77, lon: -68.53, img: 'p13', zone: 'puj', cat: 'playa', name: 'Playa Macao', emoji: '🏄', desc: 'Playa virgen con olas para surf, a 20 min del Hard Rock.', q: 'Playa Macao' },
  { id: 'p14', lat: 18.745, lon: -68.46, img: 'p14', zone: 'puj', cat: 'playa', name: 'Playa del Hard Rock', emoji: '🎸', desc: 'La de casa, en la costa de Macao–Bávaro (foto: Bávaro): hamacas y barra libre.', q: 'Hard Rock Hotel Punta Cana', kids: true },
  { id: 'p15', lat: 18.745, lon: -68.455, img: 'p15', zone: 'puj', cat: 'kids', name: 'Hard Rock: piscinas y kids club', emoji: '🧸', desc: 'Piscinas enormes y kids club, para que los mayores tengan su rato de bachata.', q: 'Hard Rock Hotel Punta Cana', kids: true },
  { id: 'p16', lat: 45.4577, lon: -73.7497, img: 'p16', zone: 'yul', cat: 'comida', name: 'Poutine junto al aeropuerto', emoji: '🍟', desc: 'Si llegáis cansados: poutine o pollo en Poulet Rouge (YUL), al lado del hotel.', q: 'Poulet Rouge Aéroport Montréal-Trudeau', kids: true },
  { id: 'y1', lat: 45.5075, lon: -73.5545, img: 'mtl_vieux', zone: 'yul', cat: 'excursion', name: 'Vieux-Montréal', emoji: '🏰', desc: 'Calles empedradas del siglo XVII, rue Saint-Paul y place Jacques-Cartier. El paseo imprescindible de la noche del 13.', q: 'Vieux-Montréal', kids: true },
  { id: 'y2', lat: 45.5045, lon: -73.5562, img: 'mtl_notre', zone: 'yul', cat: 'excursion', name: 'Basílica de Notre-Dame', emoji: '⛪', desc: 'Interior azul y dorado espectacular. Por la noche hacen el espectáculo de luz AURA (consultad horarios y reservad).', q: 'Basilique Notre-Dame de Montréal', kids: true },
  { id: 'y3', lat: 45.5079, lon: -73.5490, img: 'mtl_port', zone: 'yul', cat: 'excursion', name: 'Vieux-Port y Grande Roue', emoji: '🎡', desc: 'Paseo junto al río San Lorenzo y la noria gigante con vistas de la ciudad. Perfecto con peques.', q: 'La Grande roue de Montréal', kids: true },
  { id: 'y4', lat: 45.5038, lon: -73.5874, img: 'mtl_royal', zone: 'yul', cat: 'excursion', name: 'Mont-Royal · Belvédère Kondiaronk', emoji: '🌄', desc: 'El mirador clásico sobre los rascacielos. Al atardecer de agosto, vistas de postal (se sube en coche/taxi casi hasta arriba).', q: 'Belvédère Kondiaronk', kids: true },
  { id: 'y5', lat: 45.5226, lon: -73.6026, img: 'mtl_bagel', zone: 'yul', cat: 'comida', name: 'St-Viateur Bagel', emoji: '🥯', desc: 'Los bagels de Montreal, hechos a mano en horno de leña. El local original abre 24 h: ideal para llevar al hotel.', q: 'St-Viateur Bagel 263 Saint-Viateur Ouest', kids: true },
  { id: 'y6', lat: 45.5166, lon: -73.5779, zone: 'yul', cat: 'comida', name: "Schwartz's Deli", emoji: '🥪', desc: 'Sándwich de smoked meat, institución desde 1928. Suele haber cola.', q: "Schwartz's Deli Montreal", kids: true },
  { id: 'y8', lat: 45.5579, lon: -73.5515, img: 'mtl_olymp', zone: 'yul', cat: 'excursion', name: 'Parc olympique', emoji: '🏟️', desc: 'Estadio de los Juegos Olímpicos de 1976, con la torre inclinada más alta del mundo. Al lado, el Biodôme y el Jardín Botánico.', q: 'Parc olympique de Montréal', kids: true },
  { id: 'y7', lat: 45.5363, lon: -73.6147, img: 'mtl_talon', zone: 'yul', cat: 'compras', name: 'Marché Jean-Talon', emoji: '🍓', desc: 'Mercado al aire libre con fruta de temporada de Quebec. Cierra por la tarde: difícil con nuestros horarios.', q: 'Marché Jean-Talon', kids: true },
];

window.POLLS = [
  { id: 'p1', q: '¿Qué villa reservamos en Las Terrenas?', emoji: '🏡', options: ['Casa del Río · 5.838 €', 'Tropical beachfront · 3.086 €', 'Casa Coco · 3.422 €', 'Villa Balboa · 4.517 €', 'Lujo Río Cosón · 2.608 €', 'Villa Angela · 4.568 €', 'Villas Paul · 2.683 €', 'Villa única frente a la playa · 5.398 €'] },
  { id: 'p2', q: '¿Transfer privado o coches de alquiler?', emoji: '🚐', options: ['Transfer privado (1.100 $)', 'Alquilar 2–3 coches'] },
  { id: 'p3', q: '¿Quads al Salto El Limón?', emoji: '🏍️', options: ['¡Sí, todos!', 'Solo adultos', 'Paso'] },
  { id: 'p4', q: 'Excursión estrella desde Punta Cana', emoji: '⭐', options: ['Isla Saona', 'Catamarán party', 'Hoyo Azul', 'Nada, resort a muerte'] },
];

// Gamificación
window.MISSIONS = [
  'Consigue que un desconocido te enseñe un paso de bachata.',
  'Haz que alguien diga "¡Qué lo que!" sin que se dé cuenta de que lo has provocado.',
  'Saca una foto de grupo donde todos salgan saltando.',
  'Prueba tres frutas que no conocías y vótalas.',
  'Consigue que el camarero te recomiende su plato favorito y pídelo.',
  'Esconde una concha en la maleta de otra familia.',
  'Organiza un brindis sorpresa por alguien del grupo.',
  'Aprende a decir "chévere", "vaina" y "tíguere" y úsalas en la cena.',
  'Haz que todo el grupo cante la canción del verano a la vez.',
  'Consigue una foto con un loro, una iguana o un pelícano.',
  'Gana una partida de dominó a alguien del lugar.',
  'Sé la primera persona en el agua tres días seguidos.',
  'Haz de fotógrafo secreto: 10 fotos de los demás sin que lo noten.',
  'Lleva a los peques a construir el castillo de arena más alto.',
  'Consigue que otra familia te invite a algo sin pedirlo.',
  'Bebe un coco directamente del cocotero.',
];

window.CHALLENGES = [
  { id: 'c1', title: 'Primer@ en el agua', emoji: '🌊', pts: 30 },
  { id: 'c2', title: 'Rey/Reina de la bachata', emoji: '💃', pts: 80 },
  { id: 'c3', title: 'Atardecer perfecto (foto)', emoji: '🌅', pts: 40 },
  { id: 'c4', title: 'Castillo de arena épico', emoji: '🏰', pts: 50 },
  { id: 'c5', title: 'Cocinero/a invitado del chef', emoji: '🍳', pts: 60 },
  { id: 'c6', title: 'Último en irse a dormir', emoji: '🦉', pts: 40 },
  { id: 'c7', title: 'Snorkel: ver una estrella de mar', emoji: '⭐', pts: 50 },
  { id: 'c8', title: 'Dominó: campeón de la noche', emoji: '🁫', pts: 70 },
];

window.BINGO = [
  'Ver un pelícano', 'Comer mangú', 'Presidente bien fría', 'Alguien se quema', 'Bailar bachata',
  'Beber de un coco', 'Partida de dominó', 'Lluvia tropical de 5 min', 'Ver una iguana', 'Foto en un columpio de playa',
  'Alguien pierde una chancla', 'Comer tostones', 'Escuchar "¡Qué lo que!"', 'Atardecer rosa', 'Motoconcho con 3 personas',
  'Mamajuana (adultos)', 'Pescado con coco', 'Peque dormido en hamaca', 'Selfie con el chef', 'Estrella de mar',
  'Comprar un larimar', 'Ver un loro', 'Bañarse de noche', 'Canción del verano x3', 'Helado de chinola',
];

window.WHEEL = ['🍦 Paga los helados', '🎶 Elige la música', '📸 Fotógraf@ oficial', '💃 Abre la pista', '🍽️ Elige restaurante', '🏊 Primer chapuzón', '🥥 Busca cocos', '😴 Siesta libre'];

window.BADGES = [
  { id: 'b1', emoji: '🌊', name: 'Tiburón', rule: 'Cumple 2 retos de agua' },
  { id: 'b2', emoji: '📸', name: 'Paparazzi', rule: 'Sube 10 fotos' },
  { id: 'b3', emoji: '🎯', name: 'Agente secreto', rule: 'Cumple tu misión secreta' },
  { id: 'b4', emoji: '🎰', name: 'Bingo!', rule: 'Canta una línea' },
  { id: 'b5', emoji: '💸', name: 'Cuentas claras', rule: 'Tu familia ha pagado todo' },
  { id: 'b6', emoji: '🗳️', name: 'Demócrata', rule: 'Vota en todas las encuestas' },
];

window.LEXICON = [
  ['¡Qué lo que!', '¿Qué tal? / ¿Qué pasa?'], ['Chévere', 'Genial'], ['Vaina', 'Cosa (vale para todo)'],
  ['Tíguere', 'Listillo, buscavidas'], ['Jevi', 'Guay'], ['Ahorita', 'Ahora… o dentro de un rato largo'],
  ['Motoconcho', 'Moto-taxi'], ['Guagua', 'Autobús'], ['Un chin', 'Un poquito'],
];

// Sitios icónicos de toda la isla (capa «Icónicos» del mapa). far = mejor para otro viaje.
window.ICONIC = [
  { id: 'i1', name: 'Zona Colonial · Santo Domingo', emoji: '🏛️', img: 'zona', lat: 18.473, lon: -69.884, desc: 'La primera ciudad europea de América: Calle Las Damas, la Catedral Primada y el Alcázar de Colón.', how: '≈ 2 h 30 min desde Las Terrenas o Punta Cana. Excursión de día posible.' },
  { id: 'i2', name: 'Altos de Chavón · La Romana', emoji: '🏰', img: 'chavon', lat: 18.421, lon: -68.917, desc: 'Pueblo mediterráneo de piedra sobre el río Chavón, con anfiteatro y vistas de película.', how: '≈ 1 h desde el Hard Rock.' },
  { id: 'i3', name: 'Bayahibe', emoji: '🐠', img: 'bayahibe', lat: 18.370, lon: -68.840, desc: 'Pueblo pesquero con aguas cristalinas; de aquí salen los barcos a Saona y Catalinita.', how: '≈ 1 h 15 min desde el Hard Rock.' },
  { id: 'i4', name: 'Bahía de las Águilas', emoji: '🦅', img: 'aguilas', lat: 17.830, lon: -71.650, desc: 'Considerada la playa más virgen del Caribe, en el Parque Nacional Jaragua.', how: 'Muy lejos (≈ 7 h). Para otro viaje.', far: true },
  { id: 'i5', name: 'Lago Enriquillo', emoji: '🐊', img: 'enriquillo', lat: 18.500, lon: -71.580, desc: 'Lago salado bajo el nivel del mar con cocodrilos americanos e iguanas.', how: 'Muy lejos (≈ 6 h). Para otro viaje.', far: true },
  { id: 'i6', name: 'Pico Duarte', emoji: '⛰️', img: 'duarte', lat: 19.023, lon: -70.998, desc: 'La montaña más alta del Caribe (3.098 m). Trekking de 2–3 días desde Jarabacoa.', how: 'Aventura aparte, no para este viaje.', far: true },
  { id: 'i7', name: '27 Charcos de Damajagua', emoji: '💦', img: 'charcos', lat: 19.680, lon: -70.820, desc: 'Cascadas y pozas para saltar y deslizarse, cerca de Puerto Plata. Con guía y casco.', how: '≈ 4 h desde Las Terrenas.', far: true },
  { id: 'i8', name: 'Teleférico de Puerto Plata', emoji: '🚡', img: 'teleferico', lat: 19.790, lon: -70.700, desc: 'Sube al Pico Isabel de Torres (≈ 800 m) con vistas a toda la costa norte.', how: '≈ 3 h 30 min desde Las Terrenas.', far: true },
  { id: 'i9', name: 'Cabarete', emoji: '🪁', img: 'cabarete', lat: 19.750, lon: -70.410, desc: 'Capital mundial del kitesurf, con ambiente surfero y bares en la arena.', how: '≈ 3 h desde Las Terrenas.', far: true },
  { id: 'i10', name: 'El Morro · Montecristi', emoji: '🗿', img: 'morro', lat: 19.870, lon: -71.660, desc: 'Meseta gigante sobre el mar en el extremo noroeste, junto a los Cayos Siete Hermanos.', how: 'Muy lejos (≈ 6 h). Para otro viaje.', far: true },
  { id: 'i11', name: 'Ballenas jorobadas · Bahía de Samaná', emoji: '🐋', img: 'whale', lat: 19.180, lon: -69.330, desc: 'Miles de jorobadas vienen a criar de enero a marzo. En agosto no hay, pero la bahía es preciosa.', how: '≈ 1 h desde Las Terrenas (solo en temporada).' },
  { id: 'i13', name: 'Basílica de Higüey', emoji: '⛪', img: 'higuey', lat: 18.6157, lon: -68.7076, desc: 'Santuario de la Virgen de la Altagracia, patrona del país (1971), con su enorme arco de hormigón. Cada 21 de enero llegan peregrinos de toda la isla.', how: '≈ 45 min desde el Hard Rock. Excursión de medio día.' },
  { id: 'i12', name: 'Mirador de Samaná', emoji: '🌄', img: 'samana', lat: 19.200, lon: -69.370, desc: 'Vista de la bahía de Samaná desde lo alto, camino de Las Terrenas.', how: 'De paso en el transfer.' },
];

// Recomendaciones locales verificadas (búsqueda 30/10/2026: TripAdvisor, guías locales, webs oficiales). Revisar horarios en Maps antes de ir.
window.LOCALS = [
  { zone: 'ltr', cat: 'comida', name: 'Casa Coson Restaurante', emoji: '🐟', desc: 'Chiringuito a pie de la villa: pescado a la brasa y cócteles.', kids: true, big: true, p: '$$', q: 'Casa Coson Restaurante Las Terrenas' },
  { zone: 'ltr', cat: 'comida', name: 'Donde Valerio', emoji: '🦞', desc: 'Pescado frito, langosta y piña colada en la arena de Cosón.', kids: true, big: true, p: '$$', q: 'Donde Valerio Playa Coson Las Terrenas' },
  { zone: 'ltr', cat: 'comida', name: 'Restaurant Luis', emoji: '🦐', desc: 'Clásico de langosta a la brasa y pescado fresco (más de 1.000 reseñas).', kids: true, big: true, p: '$$', q: 'Restaurant Luis Coson Las Terrenas' },
  { zone: 'ltr', cat: 'comida', name: 'Restaurante Plaza Delfín', emoji: '🥥', desc: 'El más citado para el pescado con coco estilo Samaná (mero, pez león).', kids: true, p: '$$', q: 'Restaurante Plaza Delfin Las Terrenas' },
  { zone: 'ltr', cat: 'comida', name: 'Las Terrenas Dulce Playa', emoji: '🌊', desc: 'Marisco informal frente al mar; pedid el pescado con coco. ≈ 25 $/persona.', kids: true, big: true, p: '$$', q: 'Las Terrenas Dulce Playa' },
  { zone: 'ltr', cat: 'comida', name: 'La Terrasse', emoji: '🍷', desc: 'Bistró francés y de marisco en el Pueblo de los Pescadores. Noche de adultos; mejor reservar.', kids: false, p: '$$$', q: 'La Terrasse Pueblo de los Pescadores Las Terrenas' },
  { zone: 'ltr', cat: 'comida', name: 'Los Chichas Comedor', emoji: '🍛', desc: 'Comedor familiar: plato del día dominicano (arroz, habichuelas, carne) ≈ 250 RD$. Preguntad el precio antes.', kids: true, p: '$', q: 'Los Chichas Comedor Las Terrenas' },
  { zone: 'ltr', cat: 'comida', name: 'Pica Pollo King', emoji: '🍗', desc: 'Pica pollo (pollo frito dominicano) con tostones. Barato y a los peques les encanta.', kids: true, p: '$', q: 'Pica Pollo King Las Terrenas' },
  { zone: 'ltr', cat: 'comida', name: 'Gelateria Italiana Artesanal', emoji: '🍨', desc: 'La heladería mejor valorada del pueblo. Probad la de guanábana.', kids: true, p: '$', q: 'Gelateria Italiana Artesanal Las Terrenas' },
  { zone: 'ltr', cat: 'comida', name: 'Boulangerie Française', emoji: '🥐', desc: 'Desayunos: croissants, pain au chocolat y bocadillos.', kids: true, p: '$', q: 'Boulangerie Francaise Las Terrenas' },
  { zone: 'ltr', cat: 'fiesta', name: 'Sunset Bar Restaurant', emoji: '🌅', desc: 'Bar de atardecer con marisco y música en vivo algunas noches (4,6/5).', kids: true, p: '$$', q: 'Sunset Bar Restaurant Las Terrenas' },
  { zone: 'ltr', cat: 'fiesta', name: 'Mosquito · Playa Bonita', emoji: '🎧', desc: 'Beach bar con DJ al atardecer y olas de surf.', kids: true, p: '$$', q: 'Mosquito Boutique Hotel Playa Bonita Las Terrenas' },
  { zone: 'ltr', cat: 'compras', name: 'Mercado de Plaza Rosada', emoji: '🥭', desc: 'Mercado de productores el sábado (¡el 14 de agosto es sábado!): fruta, cacao, productos locales. Al lado, cajero Scotiabank.', kids: true, p: '$', q: 'Plaza Rosada Las Terrenas' },
  { zone: 'ltr', cat: 'compras', name: 'El Arte de Las Terrenas', emoji: '🎨', desc: 'Mercado cubierto de artistas y artesanos locales en la calle Duarte (9:00–18:00). El sitio para recuerdos hechos allí.', kids: true, p: '$$', q: 'El Arte de Las Terrenas Calle Duarte' },
  { zone: 'ltr', cat: 'compras', name: 'La Plaza · Av. Luis Ginebra', emoji: '🛒', desc: 'Plaza comercial con supermercado: ideal para la compra grande del chef el día 15.', kids: true, p: '$', q: 'La Plaza Avenida Luis Ginebra Las Terrenas' },
  { zone: 'ltr', cat: 'compras', name: 'Plaza El Paseo', emoji: '💊', desc: 'Pequeño centro en mitad del pueblo: farmacia, cajero, agencia de excursiones y buena tienda de puros.', kids: true, p: '$$', q: 'Plaza El Paseo Las Terrenas' },
  { zone: 'ltr', cat: 'excursion', name: 'Flora Tours', emoji: '🧭', desc: 'Agencia local: Frontón + Rincón (≈ 100 $), Los Haitises (≈ 90 $), El Limón (≈ 55 $) y catamarán privado para el grupo.', kids: true, p: '$$', q: 'Flora Tours Las Terrenas' },
  { zone: 'ltr', cat: 'excursion', name: 'Peninsula Tours', emoji: '🚤', desc: 'Operador local muy conocido: Los Haitises desde ≈ 59 $, El Limón a caballo, Playa Frontón.', kids: true, p: '$$', q: 'Peninsula Tours Las Terrenas' },
  { zone: 'puj', cat: 'comida', name: 'Paradores de Playa Macao', emoji: '🐠', desc: 'Pescado entero frito con tostones (600–1.200 RD$). Solo efectivo; preguntad el total antes. Ojo a las corrientes.', kids: true, p: '$$', q: 'Playa Macao' },
  { zone: 'puj', cat: 'comida', name: 'Captain Cook · El Cortecito', emoji: '🦞', desc: 'Pescado y langosta a la brasa en la arena (4,3/5, ≈ 1.150 reseñas).', kids: true, big: true, p: '$$', q: 'Captain Cook El Cortecito Bavaro' },
  { zone: 'puj', cat: 'comida', name: 'Cortecito Bar Restaurante', emoji: '🍤', desc: 'Marisco y comida dominicana en la playa, más económico.', kids: true, p: '$$', q: 'Cortecito Bar Restaurante Bavaro' },
  { zone: 'puj', cat: 'comida', name: 'La Bruja Chupadora BBQ', emoji: '🔥', desc: 'Parrilla popular entre locales en Bávaro.', kids: true, p: '$$', q: 'La Bruja Chupadora Bavaro' },
  { zone: 'puj', cat: 'excursion', name: 'Ojos Indígenas', emoji: '💧', desc: 'Reserva con 11–12 lagunas de agua dulce donde bañarse. Desde fuera del resort, solo con tour.', kids: true, p: '$$', q: 'Indigenous Eyes Ecological Park Punta Cana' },
  { zone: 'puj', cat: 'compras', name: 'Palma Real Shopping Village', emoji: '🛍️', desc: 'Centro comercial al aire libre en Bávaro, a unos 15 min en taxi del Hard Rock: tiendas, heladerías y restaurantes con aire acondicionado.', kids: true, p: '$$', q: 'Palma Real Shopping Village Bavaro' },
  { zone: 'puj', cat: 'compras', name: 'Plaza Bávaro (mercadillo)', emoji: '🧺', desc: 'Más de 100 puestos junto a la playa: ron, café, cacao, puros, conchas y larimar. Toca regatear.', kids: true, p: '$', q: 'Plaza Bavaro Punta Cana' },
  { zone: 'puj', cat: 'compras', name: 'Mercadillo de El Cortecito', emoji: '🪆', desc: 'Puestos de colores en el paseo de la playa: muñecas Limé sin rostro, larimar y bisutería. Aceptan pesos, dólares y a menudo tarjeta.', kids: true, p: '$', q: 'El Cortecito Bavaro mercado artesania' },
  { zone: 'puj', cat: 'compras', name: 'Plaza Bibijagua', emoji: '🍶', desc: 'Mercadillo de playa junto al Barceló Bávaro: recuerdos, ron, café y mamajuana casera para probar (adultos).', kids: true, p: '$', q: 'Plaza Bibijagua Bavaro' },
  { zone: 'puj', cat: 'compras', name: 'Mundo Auténtico', emoji: '💎', desc: 'Precio fijo (sin regateo): larimar, ámbar, cacao, café, ron y mamajuana. Pedid certificado del larimar.', kids: true, p: '$$', q: 'Mundo Auténtico Bávaro' },
  { zone: 'yul', cat: 'comida', name: 'Poulet Rouge · aeropuerto YUL', emoji: '🍟', desc: 'Pollo a la brasa y poutine antes del control (abierto en 2025, 4,6/5). Perfecto para la noche del 13.', kids: true, p: '$', q: 'Poulet Rouge Aéroport Montréal-Trudeau' },
];

window.TIPS = [
  ['💵', 'Propinas', 'La cuenta ya trae un 10 % de servicio y un 18 % de impuesto (ITBIS). Se suele dejar un 5–10 % extra en efectivo.'],
  ['🇩🇴', 'Moneda', 'Pesos (RD$). Los dólares valen en zonas turísticas, pero con mal cambio. En comedores, colmados y paradores: pesos en efectivo.'],
  ['🏧', 'Cajeros', 'Usad los que están dentro de un banco (en Las Terrenas, Scotiabank de Plaza Rosada) y pedid billetes pequeños.'],
  ['🏪', 'Colmados', 'Tienda de barrio y bar a la vez: agua, hielo, Presidente y snacks a precio local.'],
  ['🛵', 'Motoconchos', 'No son para familias con niños. Mejor taxi o transfer, acordando el precio antes de subir.'],
  ['💧', 'Agua', 'Solo embotellada, también para lavarse los dientes. Cuidado con el hielo en los chiringuitos.'],
  ['☀️', 'Sol y mosquitos', 'Protector alto, camisetas de agua para los peques y repelente al atardecer.'],
  ['🌊', 'Corrientes', 'En Macao y algunas playas de Samaná hay corrientes de resaca: mirad las banderas y, si os arrastra, nadad en paralelo a la orilla.'],
  ['🌀', 'Agosto', '30–33 °C y chubascos cortos. Es temporada de huracanes: seguro de viaje que lo cubra.'],
  ['🔒', 'Seguridad', 'Pocos objetos de valor en la playa, nada a la vista en el coche y taxi de noche.'],
  ['🤝', 'Regateo', 'Normal en mercados y con vendedores de playa (empezad un 30–40 % por debajo). En tiendas de precio fijo, no.'],
  ['🛍️', 'Qué comprar', 'Larimar, ámbar, muñecas Limé sin rostro, cacao y chocolate, café Santo Domingo, ron dominicano (Brugal, Barceló), puros y mamajuana. Si lleváis botellas en la maleta, envolvedlas bien.'],
  ['🗣️', 'Frases', '"¿Cuánto e\' todo?" · "¿Tiene pescado con coco?" · "Un chin" (un poquito) · "¿Qué lo que?"'],
];

// Montreal: lo que da tiempo de verdad con nuestros vuelos.
window.MTL_PLAN = [
  ['🛬', 'Vie 13 · 17:20', 'Aterrizaje en YUL. Hotel del aeropuerto y dejar maletas (~18:30).'],
  ['🚕', '19:00', 'Al centro: taxi ~25–30 min o bus 747 (24 h) hasta Vieux-Montréal.'],
  ['🏰', '19:30–21:30', 'Paseo por Vieux-Montréal, Notre-Dame por fuera y Vieux-Port con la noria.'],
  ['🥯', '21:30', 'Cena rápida (Schwartz\'s o bagels de St-Viateur) y vuelta al hotel.'],
  ['⏰', 'Sáb 14 · 06:30', 'Arriba temprano: vuelo TS0398 a las 09:20.'],
  ['🔁', 'Mié 25', 'Vuelta: solo 4 h 10 min de escala. No da para salir de la terminal.'],
];

// Historia y curiosidades (para Explora y Coco).
window.HISTORY = {
  rd: [
    ['🌺', 'Los taínos', 'Eran el pueblo de la isla antes de 1492 y la llamaban Quisqueya o Ayiti. De su idioma vienen hamaca, barbacoa, canoa, tabaco y huracán.'],
    ['⛵', '1492: llega Colón', 'Colón llegó a la isla en diciembre de 1492 y la bautizó La Española. Fue la primera base española en América.'],
    ['🏛️', 'Santo Domingo, la primera', 'Fundada en 1496–1498, es la ciudad europea más antigua de América. Tiene la primera catedral (Catedral Primada) y la primera universidad del continente. Su Zona Colonial es Patrimonio de la Humanidad (UNESCO, 1990).'],
    ['🇩🇴', '27 de febrero de 1844', 'Independencia, tras 22 años bajo dominio haitiano. Los padres de la patria son Duarte, Sánchez y Mella.'],
    ['🎉', '16 de agosto: Restauración', 'Se celebra la guerra de 1863–1865 que devolvió la independencia frente a España. ¡Nos pilla allí! Es fiesta nacional (lunes 16).'],
    ['🦋', 'Las hermanas Mirabal', 'Asesinadas en 1960 por oponerse a la dictadura de Trujillo (1930–1961). Por ellas, el 25 de noviembre es el Día Internacional contra la Violencia hacia la Mujer.'],
    ['⛪', 'Samaná y "La Churcha"', 'En 1824 llegaron a Samaná afroamericanos libres de EE. UU. Sus descendientes aún conservan apellidos y tradiciones en inglés, y la iglesia metodista "La Churcha".'],
    ['🥖', 'Las Terrenas, pueblo de pescadores', 'Era un pueblo de pescadores y agricultores hasta que en los 70–80 llegaron muchos franceses e italianos. Por eso hay tantas boulangeries y restaurantes franceses.'],
    ['💎', 'El larimar', 'Piedra azul que solo existe en RD, en las montañas de Barahona. Se popularizó en 1974 y su nombre mezcla Larissa (la hija de quien la bautizó) y mar.'],
    ['🎶', 'Merengue y bachata', 'Los dos son Patrimonio Cultural Inmaterial de la UNESCO: el merengue desde 2016 y la bachata desde 2019. La bachata se llamaba "música de amargue".'],
    ['⚾', 'El béisbol', 'Es el deporte nacional. RD es uno de los países que más jugadores aporta a las Grandes Ligas de EE. UU.'],
    ['📖', 'La bandera', 'Es la única bandera del mundo con una Biblia en el escudo, junto al lema "Dios, Patria, Libertad".'],
  ],
  ca: [
    ['🍁', '1535: Hochelaga', 'Jacques Cartier llegó a la aldea iroquesa de Hochelaga y llamó "Mont Royal" a su montaña. De ahí viene el nombre de Montreal.'],
    ['⚓', '1642: Ville-Marie', 'Paul de Chomedey de Maisonneuve fundó la misión de Ville-Marie, el origen de Montreal. El Vieux-Montréal conserva calles de esa época.'],
    ['🇨🇦', '1 de julio de 1867', 'Nace Canadá con la Confederación. La bandera de la hoja de arce es de 1965.'],
    ['🗣️', 'En francés', 'Quebec es francófono y Montreal es una de las mayores ciudades de habla francesa del mundo. Saludad con "Bonjour" (muchos contestan "Bonjour-Hi").'],
    ['⛪', 'Notre-Dame', 'La basílica neogótica es de 1829. Céline Dion se casó allí en 1994.'],
    ['🌍', 'Expo 67 y Juegos de 1976', 'La Exposición Universal de 1967 y los Juegos Olímpicos de 1976 transformaron la ciudad. Del 76 queda el estadio con su torre inclinada.'],
    ['🚇', 'Ciudad subterránea', 'Más de 30 km de pasillos (el RÉSO) conectan metro, tiendas y oficinas para sobrevivir al invierno. En agosto, mejor arriba.'],
    ['🍟', 'Poutine y bagels', 'La poutine (patatas, queso en grano y salsa gravy) nació en el Quebec rural en los años 50. Los bagels de Montreal se hierven en agua con miel y se hornean con leña.'],
    ['✈️', 'El aeropuerto YUL', 'Lleva el nombre de Pierre Elliott Trudeau, primer ministro de Canadá (y padre de Justin Trudeau).'],
    ['💵', 'Ojo: dólar canadiense', 'En Canadá se paga en dólares canadienses (CAD), no en dólares de EE. UU. La propina habitual es del 15–20 % y los impuestos se suman al pagar.'],
  ],
};
