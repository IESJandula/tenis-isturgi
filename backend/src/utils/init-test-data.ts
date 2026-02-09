/**
 * Script de Inicialización de Datos de Prueba para Sprint 2
 * 
 * Este es un PSEUDO-código/documentación.
 * Para usarlo en producción, transformarlo en endpoint o seed.
 */

// Este archivo es principalmente documentación
// Los datos de prueba se crean manualmente en el panel de admin

export const initializationGuide = `
PASOS PARA CREAR DATOS DE PRUEBA:

1. Crear Temporada:
   POST /api/temporadas
   { "data": { "Nombre": "Liga Invierno 2025" } }

2. Crear División:
   POST /api/divisions
   { "data": { "Nombre": "División 1", "temporada": 1 } }

3. Crear Jugadores (repetir 4 veces):
   POST /api/jugadors
   { "data": { "Nombre": "Rafael", "Apellidos": "Nadal", "Email": "rafael@tennis.com" } }

4. Asignar Jugadores a División (repetir para cada uno):
   PUT /api/jugadors/1
   { "data": { "division": 1 } }

5. Generar Calendario:
   POST /api/jornadas/generar-calendario/1
   Headers: Authorization: Bearer <token_jwt>
   Body: {}

6. Ver Calendario:
   GET /api/jornadas/division/1/jornadas
`;
