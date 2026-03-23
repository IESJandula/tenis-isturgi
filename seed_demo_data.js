// Seeds demo data into the Spring backend (MySQL) so the frontend has content.
// Usage (from repo root):
//   node seed_demo_data.js
// Optional env:
//   API_BASE=http://localhost:8080

const API_BASE = process.env.API_BASE || 'http://localhost:8080';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

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

function todayIsoDate() {
  // Backend stores dates as String; keep it simple.
  return new Date().toISOString().slice(0, 10);
}

function daysAgoIso(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

async function ensureBackendUp() {
  // Give Spring a moment on slow boots.
  for (let i = 0; i < 20; i++) {
    try {
      await get('/api/noticias');
      return;
    } catch (e) {
      await sleep(500);
    }
  }
  throw new Error(`Backend not reachable at ${API_BASE}`);
}

async function main() {
  console.log(`Seeding demo data into: ${API_BASE}`);
  await ensureBackendUp();

  // 1) Divisiones
  const divisionNames = ['División A', 'División B'];
  const divisions = [];
  for (const name of divisionNames) {
    const created = await post('/api/divisions', { Nombre: name });
    divisions.push(created.data);
  }
  console.log(`Created divisions: ${divisions.map((d) => d.id).join(', ')}`);

  // 2) Jugadores (sin email para no tocar Firebase)
  const playersByDivision = {
    [divisions[0].id]: [
      ['Juan', 'García López'],
      ['Carlos', 'Martínez Ruiz'],
      ['Pedro', 'López Fernández'],
      ['Miguel', 'Rodríguez Santos'],
      ['Antonio', 'Jiménez Díaz'],
      ['Luis', 'Cortés Vega'],
    ],
    [divisions[1].id]: [
      ['Sergio', 'Navarro Pérez'],
      ['Pablo', 'Sánchez Ramos'],
      ['Manuel', 'Gómez Herrera'],
      ['David', 'Romero Torres'],
      ['Javier', 'Molina Castro'],
      ['Francisco', 'Ortega Gil'],
    ],
  };

  const jugadores = [];
  for (const [divisionId, entries] of Object.entries(playersByDivision)) {
    for (const [Nombre, Apellidos] of entries) {
      const created = await post('/api/jugadors', {
        Nombre,
        Apellidos,
        Email: '',
        Telefono: '600000000',
        Nivel: 'Medio',
        Categoria: 'Absoluto',
        division: { id: Number(divisionId) },
      });
      jugadores.push(created.data);
    }
  }
  console.log(`Created jugadores: ${jugadores.length}`);

  // 3) Generar calendario (jornadas + partidos) para cada división
  for (const division of divisions) {
    try {
      const r = await post(`/api/divisions/${division.id}/regenerar-calendario`, {});
      if (r && r.error) {
        console.warn(`Calendar regenerate error for division ${division.id}:`, r);
      } else {
        console.log(`Generated calendar for division ${division.id}`);
      }
    } catch (e) {
      console.warn(`Calendar generation failed for division ${division.id}:`, e.status, e.body || e.message);
    }
  }

  // 4) Noticias
  const news = [
    {
      Titulo: 'Apertura de inscripciones Liga Municipal',
      Resumen: 'Ya está abierta la inscripción para la liga municipal. Plazas limitadas.',
      Descripcion: 'Abierta la inscripción para la liga. Consulta fechas, normas y categorías. ¡Te esperamos!',
      Fecha: daysAgoIso(2),
      Imagen: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1600&q=80',
    },
    {
      Titulo: 'Nuevo curso Escuela Municipal de Tenis',
      Resumen: 'Arranca el curso 2026 con grupos por edades y niveles.',
      Descripcion: 'Nuevos grupos, horarios flexibles y entrenadores titulados. Inscríbete desde la sección de contacto.',
      Fecha: daysAgoIso(7),
      Imagen: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80',
    },
    {
      Titulo: 'Jornada de puertas abiertas',
      Resumen: 'Ven a probar nuestras pistas y conocer el club.',
      Descripcion: 'El próximo sábado tendremos jornada de puertas abiertas con actividades para todas las edades.',
      Fecha: todayIsoDate(),
      Imagen: 'https://images.unsplash.com/photo-1601933470928-cd3abdb02b1b?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  for (const item of news) {
    await post('/api/noticias', item);
  }
  console.log(`Created noticias: ${news.length}`);

  // 5) Torneos
  const torneos = [
    {
      Nombre: 'Torneo Social 16 Puntos',
      Edicion: '2026',
      FechaInicio: daysAgoIso(10),
      FechaFin: daysAgoIso(8),
      Estado: 'Finalizado',
      Categoria: 'Absoluto',
      Descripcion: 'Torneo social por parejas con formato de 16 puntos. Ambiente familiar y competitivo.',
      Descripcion_breve: 'Torneo social por parejas.',
      Cartel: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80',
      Modalidad: 'Dobles',
      TipoParticipacion: 'Socios',
      NivelRequerido: 'Todos',
      Participantes: '32',
      Premios: 'Trofeos y material deportivo',
      Patrocinador: 'Club Tenis Isturgi',
      Puntuable: false,
    },
    {
      Nombre: 'Torneo Primavera',
      Edicion: '2026',
      FechaInicio: daysAgoIso(1),
      FechaFin: daysAgoIso(0),
      Estado: 'En juego',
      Categoria: 'Absoluto',
      Descripcion: 'Torneo de primavera en cuadro eliminatorio. Partidos a 2 sets + super tie-break.',
      Descripcion_breve: 'Cuadro eliminatorio de primavera.',
      Cartel: 'https://images.unsplash.com/photo-1560012057-4372e14c5085?auto=format&fit=crop&w=1600&q=80',
      Modalidad: 'Individual',
      TipoParticipacion: 'Abierto',
      NivelRequerido: 'Medio',
      Participantes: '48',
      Premios: 'Trofeos',
      Patrocinador: 'Ayuntamiento',
      Puntuable: true,
    },
  ];

  for (const item of torneos) {
    await post('/api/torneos', item);
  }
  console.log(`Created torneos: ${torneos.length}`);

  // Summary
  const counts = {
    divisions: (await get('/api/divisions')).data?.length ?? 0,
    jornadas: (await get('/api/jornadas?limit=200')).data?.length ?? 0,
    noticias: (await get('/api/noticias')).data?.length ?? 0,
    torneos: (await get('/api/torneos')).data?.length ?? 0,
    jugadors: (await get('/api/jugadors')).data?.length ?? 0,
  };

  console.log('Seed OK. Counts:', counts);
  console.log('Ahora abre: http://localhost:5173/');
}

main().catch((e) => {
  console.error('Seed failed:', e.message);
  if (e.body) console.error('Body:', JSON.stringify(e.body, null, 2));
  process.exit(1);
});
