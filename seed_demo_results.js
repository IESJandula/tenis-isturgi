const axios = require('axios');

const API_URL = 'http://127.0.0.1:1337/api';

async function seed() {
  try {
    console.log('--- Iniciando Sorteo de Resultados (Demo) ---');
    
    // 1. Login
    const loginRes = await axios.post(`${API_URL}/auth/local`, {
      identifier: 'admin@isturgi.com',
      password: '123456'
    });
    const jwt = loginRes.data.jwt;
    const config = { headers: { Authorization: `Bearer ${jwt}` } };

    // 2. Obtener partidos pendientes
    const resPartidos = await axios.get(`${API_URL}/partidos?filters[estado][$eq]=Pendiente&populate=jugador1,jugador2`, config);
    const partidos = resPartidos.data.data;
    
    if (partidos.length === 0) {
      console.log('No hay partidos pendientes para jugar.');
      return;
    }

    console.log(`Encontrados ${partidos.length} partidos pendientes.`);

    // 3. Jugar 4 partidos aleatorios
    const resultadosPosibles = ['6-4, 6-3', '6-2, 6-5', '4-6, 7-6, 6-4', '6-0, 6-1', '7-5, 6-3'];
    
    for (let i = 0; i < Math.min(partidos.length, 4); i++) {
      const p = partidos[i];
      const res = resultadosPosibles[i % resultadosPosibles.length];
      
      console.log(`Jugando: ${p.jugador1?.Nombre} vs ${p.jugador2?.Nombre} -> ${res}`);
      
      await axios.put(`${API_URL}/partidos/${p.documentId}`, {
        data: {
          resultado: res,
          estado: 'Jugado'
        }
      }, config);
    }

    console.log('--- Proceso completado. La clasificación debería estar actualizada. ---');
  } catch (err) {
    console.error('Error seeding:', err.response?.data || err.message);
  }
}

seed();
