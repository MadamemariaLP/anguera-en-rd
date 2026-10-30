// RD TRIP CLUB — datos semilla del viaje (sacados del PDF "Anguera en RD").
// Todo lo que el grupo edita en la app vive en el estado (store), no aquí.

window.TRIP = {
  id: 'anguera-rd-2027',
  name: 'RD TRIP CLUB',
  tagline: 'One group. One island. A thousand memories.',
  crew: 'Padres del fútbol ⚽',
  inviteHash: '89a112055063a15d411cf48ca9bd414b373091505c7bb8365445a78f858b2be0', // SHA-256 del código de invitación (no se guarda en claro)
  start: '2027-08-13T10:00:00+02:00',
  end: '2027-08-25',
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
      { id: 'a1', time: '—', title: 'Vuelo BCN → YUL', kind: 'flight', note: 'Llegada ~17:00 hora del Este' },
      { id: 'a2', time: '18:30', title: 'Hotel junto al aeropuerto YUL', kind: 'chill', note: '~200 $ por familia · 1 noche' },
    ] },
  { date: '2027-08-14', zone: 'ltr', title: 'Montreal → Punta Cana → Las Terrenas', emoji: '🛫',
    items: [
      { id: 'a3', time: '09:30', title: 'Vuelo YUL → PUJ', kind: 'flight', note: 'Llegada 14:00' },
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
  { date: '2027-08-25', zone: 'puj', title: 'Punta Cana → Barcelona', emoji: '🛬',
    items: [
      { id: 'a26', time: '—', title: 'Vuelo PUJ → BCN', kind: 'flight', note: 'Morenos y con la canción del verano en bucle' },
    ] },
];

window.FLIGHTS = [
  { from: 'BCN', fromCity: 'Barcelona', to: 'YUL', toCity: 'Montreal', date: 'Vie 13 ago', dep: '—', arr: '~17:00', note: '16 billetes · 720 €/persona ida y vuelta' },
  { from: 'YUL', fromCity: 'Montreal', to: 'PUJ', toCity: 'Punta Cana', date: 'Sáb 14 ago', dep: '09:30', arr: '14:00', note: 'Escala larga a propósito: ahorra ~3.800 €' },
  { from: 'PUJ', fromCity: 'Punta Cana', to: 'BCN', toCity: 'Barcelona', date: 'Mié 25 ago', dep: '—', arr: '—', note: 'Vuelta' },
];

window.STAYS = [
  { id: 's1', zone: 'yul', name: 'Hotel aeropuerto YUL', dates: '13 → 14 ago · 1 noche', price: '~200 $ por familia', status: 'pendiente' },
  { id: 's2', zone: 'ltr', name: 'Villa en Las Terrenas', dates: '14 → 18 ago · 4 noches', price: '3.000–6.100 € + luz', status: 'votación', poll: 'p1' },
  { id: 's3', zone: 'puj', name: 'Hard Rock Punta Cana', dates: '18 → 25 ago · 7 noches', price: '11.257 $ · 4 habitaciones', status: 'pendiente',
    rooms: [
      { fam: 'f1', label: '2A + 1 niño', price: 2700 },
      { fam: 'f2', label: '2A + 1 niño', price: 2700 },
      { fam: 'f3', label: '2A + 3 niños*', price: 2700 },
      { fam: 'f4', label: '2A + 1 adol. + 2 niños*', price: 3157 },
    ],
    note: '* Un niño de cada familia de 5 duerme con una familia de 3: ninguna habitación pasa de 2 niños gratis.' },
];

window.VILLAS = [
  { id: 'v1', name: 'Casa del Río · Playa Cosón', meta: '9 dorm · 16 camas · 8,5 baños', rating: 4.83, price: 3000, tags: ['Favorita', 'Chef y personal incluidos', 'Frente al mar'] },
  { id: 'v2', name: 'Villa tropical beachfront', meta: '8 dorm · 12 camas · 8 baños', rating: 4.86, price: 3200, tags: ['Primera línea', 'Piscina'] },
  { id: 'v3', name: 'Casa Coco · a 50 m de Cosón', meta: '7 dorm · 11 camas · 6,5 baños', rating: 4.87, price: 3600, tags: ['Chef opcional'] },
  { id: 'v4', name: 'Villa Balboa · Cap Bonita', meta: '6 dorm · 9 camas · 6,5 baños', rating: 4.91, price: 4500, tags: ['Acceso playa VIP', '+45 $/noche luz'] },
  { id: 'v5', name: 'Villa de lujo · Río Cosón', meta: '6 dorm · 18 camas · 6,5 baños', rating: 4.75, price: 6100, tags: ['Chef incluido', '+300 € luz'] },
];

// Presupuesto del grupo (PDF pág. 5). EUR.
window.BUDGET = {
  total: 28340, perPerson: 1770,
  lines: [
    { cat: 'Vuelos', emoji: '✈️', eur: 11520, calc: '16 × 720 €' },
    { cat: 'Hotel Montreal', emoji: '🍁', eur: 684, calc: '4 familias × 200 $' },
    { cat: 'Transfer PUJ ⇄ LTR', emoji: '🚐', eur: 940, calc: 'Ida y vuelta, precio cerrado' },
    { cat: 'Villa (media)', emoji: '🏡', eur: 4550, calc: '(3.000 + 6.100) ÷ 2' },
    { cat: 'Súper para el chef', emoji: '🛒', eur: 427, calc: '~3 días' },
    { cat: 'Chef', emoji: '👨‍🍳', eur: 256, calc: '0 si la villa lo incluye' },
    { cat: 'Quads (opcional)', emoji: '🏍️', eur: 342, calc: '8 quads × 1 día' },
    { cat: 'Hard Rock', emoji: '🎸', eur: 9621, calc: '3 × 2.700 $ + 3.157 $' },
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
  { id: 'p1', zone: 'ltr', cat: 'playa', name: 'Playa Cosón', emoji: '🏖️', desc: 'Kilómetros de arena y cocoteros junto a la villa. Ideal para los peques por la mañana.', q: 'Playa Cosón Las Terrenas', kids: true },
  { id: 'p2', zone: 'ltr', cat: 'playa', name: 'Playa Bonita', emoji: '🌊', desc: 'Más tranquila y salvaje. Buena para la tarde de los quads.', q: 'Playa Bonita Las Terrenas', kids: true },
  { id: 'p3', zone: 'ltr', cat: 'playa', name: 'Playa Las Ballenas', emoji: '🐋', desc: 'A un paseo del pueblo, con vistas a los islotes Las Ballenas.', q: 'Playa Las Ballenas Las Terrenas', kids: true },
  { id: 'p4', zone: 'ltr', cat: 'excursion', name: 'Salto El Limón', emoji: '💦', desc: 'Cascada de ~40 m entre la selva. A caballo, a pie o en quad.', q: 'Salto El Limón Samaná' },
  { id: 'p5', zone: 'ltr', cat: 'excursion', name: 'Playa Rincón', emoji: '🥥', desc: 'Una de las playas más bonitas del Caribe. Se llega en barca o 4×4.', q: 'Playa Rincón Samaná' },
  { id: 'p6', zone: 'ltr', cat: 'excursion', name: 'Parque Nacional Los Haitises', emoji: '🦅', desc: 'Manglares, cuevas con pinturas taínas y cayos. En barco desde Samaná.', q: 'Parque Nacional Los Haitises' },
  { id: 'p7', zone: 'ltr', cat: 'excursion', name: 'Cayo Levantado', emoji: '🏝️', desc: 'Islita frente a la bahía de Samaná. Plan fácil de medio día.', q: 'Cayo Levantado' },
  { id: 'p8', zone: 'ltr', cat: 'comida', name: 'Pueblo de los Pescadores', emoji: '🐟', desc: 'Fila de restaurantes frente al mar en Las Terrenas. Pescado del día y atardecer.', q: 'Pueblo de los Pescadores Las Terrenas' },
  { id: 'p9', zone: 'ltr', cat: 'comida', name: 'Cena del chef en la villa', emoji: '👨‍🍳', desc: 'Mangú, tostones, pescado con coco (estilo Samaná). Pedidle sancocho una noche.', q: 'Las Terrenas' },
  { id: 'p10', zone: 'puj', cat: 'excursion', name: 'Isla Saona', emoji: '🌴', desc: 'Piscina natural con estrellas de mar y catamarán. Día completo.', q: 'Isla Saona' },
  { id: 'p11', zone: 'puj', cat: 'fiesta', name: 'Catamarán party', emoji: '⛵', desc: 'Snorkel, música y barra libre en barco. Hay versiones familiares.', q: 'Catamaran Punta Cana' },
  { id: 'p12', zone: 'puj', cat: 'excursion', name: 'Hoyo Azul · Scape Park', emoji: '💎', desc: 'Cenote turquesa dentro de un parque de aventura en Cap Cana.', q: 'Hoyo Azul Scape Park' },
  { id: 'p13', zone: 'puj', cat: 'playa', name: 'Playa Macao', emoji: '🏄', desc: 'Playa virgen con olas para surf, a 20 min del Hard Rock.', q: 'Playa Macao' },
  { id: 'p14', zone: 'puj', cat: 'playa', name: 'Playa del Hard Rock', emoji: '🎸', desc: 'La de casa: todo incluido, hamacas y barra libre.', q: 'Hard Rock Hotel Punta Cana', kids: true },
  { id: 'p15', zone: 'puj', cat: 'kids', name: 'Kids club del resort', emoji: '🧸', desc: 'Para que los mayores tengan su rato de bachata.', q: 'Hard Rock Hotel Punta Cana', kids: true },
  { id: 'p16', zone: 'yul', cat: 'comida', name: 'Poutine en Montreal', emoji: '🍟', desc: 'Si la noche da para un paseo: probad la poutine antes de dormir.', q: 'poutine near Montreal airport' },
];

window.POLLS = [
  { id: 'p1', q: '¿Qué villa reservamos en Las Terrenas?', emoji: '🏡', options: ['Casa del Río · 3.000 €', 'Tropical beachfront · 3.200 €', 'Casa Coco · 3.600 €', 'Villa Balboa · 4.500 €', 'Lujo Río Cosón · 6.100 €'] },
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
