# Sprint 2: Generación de Calendario - Documentación

## Resumen de Cambios

Se ha implementado el **algoritmo Berger (Round Robin)** para generar automáticamente todas las jornadas y partidos de una liga. El sistema genera N-1 jornadas para N jugadores, donde cada jugador juega contra cada uno de los demás una sola vez.

---

## Nuevo Modelo: **Partido**

### Atributos

```
- jornada: Relación ManyToOne con Jornada
- jugador1: Relación ManyToOne con Usuario (Strapi Users-Permissions)
- jugador2: Relación ManyToOne con Usuario
- estado: Enum ['Pendiente', 'Programado', 'Jugado', 'Aplazado']
- resultado: String (ej: "6-4, 7-5")
- ganador: Relación ManyToOne con Usuario
- pista: Integer (número de pista, 1-3)
- hora: Time (hora del partido)
- fecha: Date (fecha del partido)
```

### Estados del Partido

- **Pendiente**: Recién creado, sin horario asignado
- **Programado**: Tiene pista, hora y fecha asignadas
- **Jugado**: Se ha introducido el resultado
- **Aplazado**: No se pudieron coordinar horarios

---

## Cambios en Jornada

Se ha añadido el campo:
- **numero**: Integer (número secuencial de jornada: 1, 2, 3...)
- **partidos**: Relación OneToMany inversa con Partido

---

## Algoritmo Berger (Round Robin)

### ¿Cómo funciona?

1. **Entrada**: Lista ordenada de N jugadores
2. **Salida**: N-1 jornadas con todos los enfrentamientos posibles
3. **Método**: Rotación circular

#### Ejemplo con 4 jugadores (A, B, C, D)

```
Jornada 1: A-B, C-D
Jornada 2: A-C, D-B
Jornada 3: A-D, B-C
```

#### Ejemplo con 5 jugadores (A, B, C, D, E)

```
Jornada 1: A-B, C-D, E-descanso
Jornada 2: A-C, D-E, B-descanso
Jornada 3: A-D, E-B, C-descanso
Jornada 4: A-E, B-C, D-descanso
```

Si hay un número impar de jugadores, alguien descansa en cada jornada (pero eso no se guarda como partido, solo se calcula internamente).

---

## Endpoints Implementados

### 1. Generar Calendario para una División

**POST** `/api/jornadas/generar-calendario/:divisionId`

**Autenticación**: Requerida (solo Admin)

**Parámetros**:
- `divisionId`: ID de la división

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "division": "División 1",
  "totalJornadas": 9,
  "totalJugadores": 10,
  "jornadas": [
    {
      "id": 1,
      "Nombre": "Jornada 1",
      "numero": 1,
      "division": 1,
      "createdAt": "2025-02-02T10:30:00.000Z"
    },
    ...
  ]
}
```

**Errores**:
- `400`: División no encontrada o sin jugadores
- `401`: No autenticado

---

### 2. Obtener todas las Jornadas de una División (con Partidos)

**GET** `/api/jornadas/division/:divisionId/jornadas`

**Autenticación**: No requerida

**Respuesta (200)**:
```json
[
  {
    "id": 1,
    "Nombre": "Jornada 1",
    "numero": 1,
    "division": 1,
    "partidos": [
      {
        "id": 1,
        "jugador1": {
          "id": 10,
          "username": "nadal",
          "Nombre": "Rafael",
          "Apellidos": "Nadal"
        },
        "jugador2": {
          "id": 20,
          "username": "federer",
          "Nombre": "Roger",
          "Apellidos": "Federer"
        },
        "estado": "Pendiente",
        "resultado": null,
        "ganador": null,
        "pista": null,
        "hora": null,
        "fecha": null
      }
    ]
  }
]
```

---

### 3. Obtener Partidos de una Jornada Específica

**GET** `/api/jornadas/:jornadaId/partidos`

**Autenticación**: No requerida

**Respuesta (200)**:
```json
[
  {
    "id": 1,
    "jugador1": { ... },
    "jugador2": { ... },
    "estado": "Pendiente",
    "resultado": null,
    "ganador": null
  }
]
```

---

## Flujo de Uso (Sprint 2)

### Paso 1: Crear Temporada (Admin)

```bash
curl -X POST http://localhost:1337/api/temporadas \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "Nombre": "Liga Invierno 2025"
    }
  }'
```

### Paso 2: Crear Divisiones (Admin)

```bash
curl -X POST http://localhost:1337/api/divisions \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "Nombre": "División 1",
      "temporada": 1
    }
  }'
```

### Paso 3: Crear Jugadores y Asignar a División (Admin)

Los jugadores ya existen como usuarios de Strapi. Solo hay que asignarlos:

```bash
curl -X PUT http://localhost:1337/api/jugadors/1 \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "division": 1
    }
  }'
```

### Paso 4: Generar Calendario (Admin, El Sorteo)

```bash
curl -X POST http://localhost:1337/api/jornadas/generar-calendario/1 \
  -H "Authorization: Bearer <tu_token_jwt>"
```

**Resultado**: Se crean automáticamente 9 jornadas (si hay 10 jugadores) con todos los enfrentamientos.

### Paso 5: Ver el Calendario

```bash
curl http://localhost:1337/api/jornadas/division/1/jornadas
```

---

## Notas Técnicas

### Algoritmo Berger - Complejidad

- **Tiempo**: O(N²) - Siempre genera N-1 jornadas × N/2 partidos
- **Espacio**: O(N²) - Guarda todos los enfrentamientos en memoria antes de insertarlos
- **Garantías**: Cada jugador juega exactamente N-1 partidos (todos contra todos)

### Validaciones Implementadas

✅ Verifica que la división existe
✅ Verifica que hay al menos 2 jugadores
✅ Crea jornadas numeradas correctamente
✅ Inicializa los partidos con estado "Pendiente"

### Próximas Fases (Sprint 3)

- [ ] Interfaz de disponibilidad para que jugadores marquen horarios
- [ ] Algoritmo de asignación de pistas/horarios
- [ ] Sistema de notificaciones

---

## Prueba Rápida en Postman

1. **Generar calendario**
   - Method: POST
   - URL: `http://localhost:1337/api/jornadas/generar-calendario/1`
   - Headers: `Authorization: Bearer <jwt_token>`

2. **Ver calendario**
   - Method: GET
   - URL: `http://localhost:1337/api/jornadas/division/1/jornadas`

3. **Ver partidos de una jornada**
   - Method: GET
   - URL: `http://localhost:1337/api/jornadas/1/partidos`

---

## Cambios en Archivos

### Nuevos Archivos Creados

```
backend/src/api/partido/
├── content-types/
│   └── partido/
│       └── schema.json
├── controllers/
│   └── partido.ts
├── routes/
│   └── partido.ts
└── services/
    └── partido.ts
```

### Archivos Modificados

```
backend/src/api/jornada/
├── content-types/
│   └── jornada/
│       └── schema.json (añadido campo "numero" y relación "partidos")
├── controllers/
│   └── jornada.ts (nuevo método generarCalendario, obtenerJornadasPorDivision, obtenerPartidosPorJornada)
├── routes/
│   └── jornada.ts (nuevas rutas custom)
└── services/
    └── jornada.ts (algoritmo Berger implementado)
```

---

## Troubleshooting

### "División no encontrada"
→ Verifica que el divisionId existe en la BD y que está publicada

### "No hay jugadores asignados"
→ Asegúrate de que los jugadores tienen asignada la división (campo division)

### 401 Unauthorized
→ Incluye el token JWT en el header: `Authorization: Bearer <token>`

### 500 Internal Server Error
→ Revisa que Strapi está corriendo en desarrollo con `npm run develop`

