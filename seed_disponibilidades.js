// Seeds availabilities (disponibilidades) so matches can be scheduled
// Creates overlapping slots for match pairs

const API_BASE = process.env.API_BASE || 'http://localhost:8080';

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} for ${url}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

async function post(path, body) {
  return requestJson(`${API_BASE}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

async function get(path) {
  return requestJson(`${API_BASE}${path}`, { method: 'GET' });
}

async function main() {
  console.log(`Seeding disponibilidades into: ${API_BASE}`);

  // Get jugadores from first division
  const jugadores = (await get('/api/jugadors?limit=100')).data || [];
  console.log(`Found ${jugadores.length} jugadores`);

  // Get jornadas
  const jornadas = (await get('/api/jornadas?limit=100')).data || [];
  const jornada1 = jornadas[0];
  if (!jornada1) {
    console.error('No jornadas found');
    return;
  }
  console.log(`Using jornada ${jornada1.id}`);

  // Get partidos for jornada1 to know which pairs play
  const partidos = (await get(`/api/partidos?jornadaId=${jornada1.id}&limit=100`)).data || [];
  console.log(`Found ${partidos.length} partidos in jornada ${jornada1.id}`);

  // Map jugador name -> jugador
  const jugadorMap = {};
  for (const j of jugadores) {
    const fullName = `${j.Nombre} ${j.Apellidos}`;
    jugadorMap[fullName] = j;
  }

  // For each partido, ensure both jugadores have overlapping slots
  const slots = {
    viernes: { '16:00': true, '11:00': true },
    sabado: { '09:00': true, '11:00': true, '16:00': true },
    domingo: { '11:00': true, '18:00': true },
  };

  const slotsCombination1 = { viernes: { '16:00': true }, sabado: { '11:00': true } };
  const slotsCombination2 = { sabado: { '09:00': true }, domingo: { '18:00': true } };
  const slotsCombination3 = { viernes: { '11:00': true }, domingo: { '11:00': true } };

  const slotsArray = [slotsCombination1, slotsCombination2, slotsCombination3];

  for (let idx = 0; idx < partidos.length && idx < 3; idx++) {
    const partido = partidos[idx];
    const jugador1Name = `${partido.jugador1?.Nombre} ${partido.jugador1?.Apellidos}`;
    const jugador2Name = `${partido.jugador2?.Nombre} ${partido.jugador2?.Apellidos}`;

    console.log(`\nPartido ${idx + 1}: ${jugador1Name} vs ${jugador2Name}`);

    // Create disponibilidades with overlapping slots
    const availSlots = slotsArray[idx];

    try {
      const r1 = await post('/api/disponibilidades', {
        jugador: { id: partido.jugador1.id },
        jornada: { id: jornada1.id },
        slots: JSON.stringify(availSlots),
      });
      console.log(`  ✓ ${jugador1Name} slots: ${JSON.stringify(availSlots)}`);
    } catch (e) {
      console.error(`  ✗ Error creating disponibilidad for ${jugador1Name}:`, e.status, e.body);
    }

    try {
      const r2 = await post('/api/disponibilidades', {
        jugador: { id: partido.jugador2.id },
        jornada: { id: jornada1.id },
        slots: JSON.stringify(availSlots),
      });
      console.log(`  ✓ ${jugador2Name} slots: ${JSON.stringify(availSlots)}`);
    } catch (e) {
      console.error(`  ✗ Error creating disponibilidad for ${jugador2Name}:`, e.status, e.body);
    }
  }

  console.log('\n✓ Disponibilidades seeded. Now regenerate calendar to schedule matches.');
}

main().catch((e) => {
  console.error('Seed failed:', e.message);
  if (e.body) console.error('Body:', JSON.stringify(e.body, null, 2));
  process.exit(1);
});
