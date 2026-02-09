# 🎾 SPRINT 2 - RESUMEN VISUAL DE IMPLEMENTACIÓN

## 📊 Diagrama de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                      FLUJO DEL SPRINT 2                         │
└─────────────────────────────────────────────────────────────────┘

1. ADMIN HACE SORTEO (Generar Calendario)
   │
   ├─→ POST /api/jornadas/generar-calendario/:divisionId
   │   (Con autenticación JWT)
   │
   ├─→ BACKEND: Algoritmo Berger
   │   • Lee jugadores de la división
   │   • Calcula N-1 jornadas
   │   • Genera todos los enfrentamientos
   │   • Valida sin repeticiones
   │
   └─→ GUARDAR EN BD
       • Crea N-1 Jornadas
       • Crea N×(N-1)/2 Partidos
       • Todos con estado "Pendiente"

2. USUARIOS VEN EL CALENDARIO
   │
   ├─→ GET /api/jornadas/division/:divisionId/jornadas
   │   (Sin autenticación)
   │
   └─→ RESPUESTA
       [
         {
           "Jornada 1": [
             { "A vs B": "Pendiente" },
             { "C vs D": "Pendiente" }
           ]
         },
         {
           "Jornada 2": [
             { "A vs C": "Pendiente" },
             { "B vs D": "Pendiente" }
           ]
         },
         {
           "Jornada 3": [
             { "A vs D": "Pendiente" },
             { "B vs C": "Pendiente" }
           ]
         }
       ]
```

---

## 🗄️ Diagrama de Base de Datos

```
┌──────────────────────────────────────────────────────────────┐
│                    ESTRUCTURA DE DATOS                       │
└──────────────────────────────────────────────────────────────┘

Temporada (1)
    │
    └──→ Division (1..N)
         │
         ├──→ Jornada (1..N-1)
         │    ├─ numero: INT
         │    └─ partidos: OneToMany → Partido
         │
         └──→ Jugador (2..N)
              │
              └──→ Partido (como jugador1 o jugador2)
                  ├─ jugador1: FK → Usuario
                  ├─ jugador2: FK → Usuario
                  ├─ jornada: FK → Jornada
                  ├─ estado: ENUM (Pendiente, Programado, Jugado, Aplazado)
                  ├─ resultado: VARCHAR
                  ├─ ganador: FK → Usuario
                  ├─ pista: INT (1-3)
                  ├─ hora: TIME
                  └─ fecha: DATE

EJEMPLO CON 4 JUGADORES:

Temporada "Liga Invierno 2025"
├── División "División 1"
│   ├── Jugador 1: Nadal
│   ├── Jugador 2: Federer
│   ├── Jugador 3: Djokovic
│   ├── Jugador 4: Murray
│   │
│   ├── Jornada 1 (numero=1)
│   │   ├── Partido 1: Nadal vs Federer
│   │   └── Partido 2: Djokovic vs Murray
│   │
│   ├── Jornada 2 (numero=2)
│   │   ├── Partido 3: Nadal vs Djokovic
│   │   └── Partido 4: Federer vs Murray
│   │
│   └── Jornada 3 (numero=3)
│       ├── Partido 5: Nadal vs Murray
│       └── Partido 6: Federer vs Djokovic
```

---

## 🔄 Algoritmo Berger - Visualización

### Con 4 Jugadores (ABCD)

```
POSICIÓN INICIAL: [A, B, C, D]

Jornada 1:
  A vs D  |  B vs C
  ─────────────────
  Posiciones: [A, B, C, D]

Jornada 2:
  A vs C  |  D vs B
  ─────────────────
  Rotación:  [A, D, B, C]

Jornada 3:
  A vs B  |  D vs C
  ─────────────────
  Rotación:  [A, D, C, B]

VALIDACIÓN:
✓ Cada jugador juega 3 partidos
✓ Total 6 partidos = 4×3/2
✓ Sin repeticiones
```

### Con 5 Jugadores (ABCDE)

```
POSICIÓN INICIAL: [A, B, C, D, E]

Jornada 1:
  A vs B  |  C vs D  |  E descansa
  
Jornada 2:
  A vs E  |  B vs C  |  D descansa
  
Jornada 3:
  A vs D  |  E vs B  |  C descansa
  
Jornada 4:
  A vs C  |  D vs B  |  E descansa

VALIDACIÓN:
✓ Cada jugador juega 4 partidos
✓ Total 10 partidos = 5×4/2
✓ Alguien descansa cada jornada (no se guarda como partido)
```

---

## 📁 Estructura de Archivos Creados

```
backend/
└── src/
    ├── api/
    │   ├── partido/  ✨ NUEVO
    │   │   ├── content-types/
    │   │   │   └── partido/
    │   │   │       └── schema.json          (Modelo definido)
    │   │   ├── controllers/
    │   │   │   └── partido.ts               (Core controller)
    │   │   ├── routes/
    │   │   │   └── partido.ts               (Core router)
    │   │   └── services/
    │   │       └── partido.ts               (Core service)
    │   │
    │   ├── jornada/  ✏️ MODIFICADO
    │   │   ├── content-types/
    │   │   │   └── jornada/
    │   │   │       └── schema.json          (+ número, + relación partidos)
    │   │   ├── controllers/
    │   │   │   └── jornada.ts               (+ 3 métodos custom)
    │   │   ├── routes/
    │   │   │   └── jornada.ts               (+ 3 rutas custom)
    │   │   └── services/
    │   │       └── jornada.ts               (+ Algoritmo Berger)
    │   │
    │   └── ...
    │
    └── utils/
        ├── berger.test.ts        ✨ NUEVO (Tests del algoritmo)
        └── init-test-data.ts     ✨ NUEVO (Script de inicialización)

ROOT/
├── SPRINT2_README.md             ✨ NUEVO (Guía completa)
├── SPRINT2_DOCUMENTACION.md      ✨ NUEVO (Especificación técnica)
├── SPRINT2_CHECKLIST.md          ✨ NUEVO (Validación y tests)
└── POSTMAN_SPRINT2.json          ✨ NUEVO (Colección de requests)
```

---

## 🔌 Endpoints Creados

### 1️⃣ Generar Calendario

```
POST /api/jornadas/generar-calendario/:divisionId

Autenticación: ✅ REQUERIDA (JWT)

Request:
  {
    "divisionId": 1
  }

Response (200):
  {
    "success": true,
    "division": "División 1",
    "totalJornadas": 9,
    "totalJugadores": 10,
    "jornadas": [...]
  }

Errores:
  400: División no encontrada / Sin jugadores
  401: No autenticado
```

---

### 2️⃣ Obtener Jornadas de División

```
GET /api/jornadas/division/:divisionId/jornadas

Autenticación: ❌ NO REQUERIDA

Response (200):
  [
    {
      "id": 1,
      "Nombre": "Jornada 1",
      "numero": 1,
      "partidos": [
        {
          "id": 1,
          "jugador1": { id, username, Nombre, Apellidos },
          "jugador2": { id, username, Nombre, Apellidos },
          "estado": "Pendiente",
          "resultado": null,
          "pista": null,
          "hora": null,
          "fecha": null
        }
      ]
    }
  ]
```

---

### 3️⃣ Obtener Partidos de Jornada

```
GET /api/jornadas/:jornadaId/partidos

Autenticación: ❌ NO REQUERIDA

Response (200):
  [
    {
      "id": 1,
      "jugador1": {...},
      "jugador2": {...},
      "estado": "Pendiente",
      ...
    }
  ]
```

---

## ⏱️ Complejidad del Algoritmo

```
Entrada: N jugadores

Operaciones:
  • Creación de array de posiciones: O(N)
  • Bucle de jornadas: O(N)
  • Dentro: emparejamientos: O(N/2)
  • Total: O(N²/2) = O(N²)

Espacios:
  • Array de posiciones: O(N)
  • Array de jornadas: O(N²)
  • Total: O(N²)

Garantías:
  ✓ Siempre genera N-1 jornadas
  ✓ Siempre N(N-1)/2 partidos
  ✓ Cada jugador juega N-1 veces
  ✓ Sin enfrentamientos repetidos
  ✓ Óptimo para propósito (no requiere IA)
```

---

## 📈 Ejemplo Completo (4 Jugadores)

```
INPUT:
  División: "División 1"
  Jugadores: [
    { id: 1, username: "Nadal" },
    { id: 2, username: "Federer" },
    { id: 3, username: "Djokovic" },
    { id: 4, username: "Murray" }
  ]

ALGORITMO BERGER:
  Iteración 0: [1,2,3,4] → (1-4, 2-3)
  Iteración 1: [1,4,2,3] → (1-3, 4-2)
  Iteración 2: [1,3,4,2] → (1-2, 3-4)

BD OUTPUT:
  Jornada 1 (numero=1)
    ├─ Partido 1: Nadal vs Murray (estado: Pendiente)
    └─ Partido 2: Federer vs Djokovic (estado: Pendiente)
    
  Jornada 2 (numero=2)
    ├─ Partido 3: Nadal vs Djokovic (estado: Pendiente)
    └─ Partido 4: Murray vs Federer (estado: Pendiente)
    
  Jornada 3 (numero=3)
    ├─ Partido 5: Nadal vs Federer (estado: Pendiente)
    └─ Partido 6: Djokovic vs Murray (estado: Pendiente)

VALIDACIONES:
  ✓ 3 jornadas = 4-1
  ✓ 6 partidos = 4×3/2
  ✓ Nadal: 3 partidos (Murray, Djokovic, Federer)
  ✓ Federer: 3 partidos (Djokovic, Murray, Nadal)
  ✓ Djokovic: 3 partidos (Federer, Nadal, Murray)
  ✓ Murray: 3 partidos (Nadal, Federer, Djokovic)
  ✓ Sin repeticiones
```

---

## 🚀 Estado del Proyecto

### Sprint 1: ✅ COMPLETADO
- ✅ Web pública
- ✅ CRUD de jugadores, divisiones
- ✅ Modelo de datos básico

### Sprint 2: ✅ COMPLETADO
- ✅ Modelo Partido creado
- ✅ Algoritmo Berger implementado
- ✅ Endpoints de generación y consulta
- ✅ Documentación completa
- ✅ Tests unitarios

### Sprint 3: 📋 PRÓXIMO
- ⏳ Interfaz de disponibilidad
- ⏳ Algoritmo de asignación de pistas/horarios
- ⏳ Gestión de conflictos
- ⏳ Notificaciones

---

## 📞 Resumen Rápido para Alumnos

### ¿Qué hemos hecho?

1. **Creado el modelo Partido**: Almacena enfrentamientos
2. **Implementado Berger**: Algoritmo que genera todos los cruces
3. **Creado endpoint de generación**: POST que genera automáticamente jornadas
4. **Creado endpoints de consulta**: GET para ver el calendario
5. **Documentación completa**: Guides, tests, ejemplos

### ¿Qué tienen que hacer ustedes?

1. **Reiniciar Strapi** para reconocer el modelo Partido
2. **Crear datos de prueba** (temporada, división, jugadores)
3. **Generar calendario** con el endpoint POST
4. **Validar resultados** con los GETs

### ¿Cuándo está listo para Sprint 3?

Cuando todos los tests del checklist pasen ✅

---

**Creado**: 2 de Febrero de 2025
**Versión**: 1.0
**Estado**: LISTO PARA TESTING 🎾
