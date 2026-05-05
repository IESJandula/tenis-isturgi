#!/usr/bin/env node
/**
 * Script para insertar jugadores de prueba en el backend.
 * Uso: node seed_jugadores_test.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:8080';
const ADMIN_TOKEN = 'fake-admin-token'; // Dev mode: el filtro lo acepta sin verificación si contiene @

const jugadores = [
  {
    nombre: 'Juan',
    apellidos: 'Pérez García',
    email: 'juan@test.com',
    telefono: '645123456',
    nivel: 'Avanzado',
    categoria: 'Absoluto',
    fechaNacimiento: '1990-05-15',
    numeroSocio: '001',
    puntos: 100,
    division: { id: 1 }
  },
  {
    nombre: 'María',
    apellidos: 'López Martín',
    email: 'maria@test.com',
    telefono: '645654321',
    nivel: 'Medio',
    categoria: 'Absoluto',
    fechaNacimiento: '1995-03-22',
    numeroSocio: '002',
    puntos: 75,
    division: { id: 1 }
  },
  {
    nombre: 'Pedro',
    apellidos: 'González Ruiz',
    email: 'pedro@test.com',
    telefono: '645789123',
    nivel: 'Avanzado',
    categoria: 'Absoluto',
    fechaNacimiento: '1988-07-10',
    numeroSocio: '003',
    puntos: 120,
    division: { id: 1 }
  },
  {
    nombre: 'Ana',
    apellidos: 'Sánchez Moreno',
    email: 'ana@test.com',
    telefono: '645456789',
    nivel: 'Iniciado',
    categoria: 'Absoluto',
    fechaNacimiento: '2000-11-05',
    numeroSocio: '004',
    puntos: 50,
    division: { id: 1 }
  },
  {
    nombre: 'Carlos',
    apellidos: 'Fernández López',
    email: 'carlos@test.com',
    telefono: '645321654',
    nivel: 'Medio',
    categoria: 'Absoluto',
    fechaNacimiento: '1992-09-18',
    numeroSocio: '005',
    puntos: 85,
    division: { id: 1 }
  }
];

async function seedJugadores() {
  console.log(`🌱 Insertando ${jugadores.length} jugadores en ${API_URL}...`);
  
  const config = {
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  for (const jugador of jugadores) {
    try {
      const response = await axios.post(`${API_URL}/api/jugadors`, jugador, config);
      console.log(`✅ ${jugador.nombre} ${jugador.apellidos} creado (ID: ${response.data.data.id})`);
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      console.error(`❌ Error creando ${jugador.nombre}: ${msg}`);
    }
  }

  console.log('\n✨ Proceso completado.');
}

seedJugadores().catch(err => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
