# 📝 SPRINT 2 - RESUMEN EJECUTIVO PARA ALUMNOS

## 🎯 Objetivo Sprint 2

Implementar el **Algoritmo de Generación de Calendario** usando **Round Robin (Berger)** para que:
- El admin haga un sorteo automático
- Se creen todas las jornadas y partidos
- El sistema asigne quién juega contra quién

---

## ✅ Lo Que Se Entrega

### 1. Nuevo Modelo: **Partido**

```
Un Partido es un enfrentamiento entre dos jugadores en una jornada

Campos:
• jornada → A qué jornada pertenece
• jugador1 → Primer jugador
• jugador2 → Segundo jugador
• estado → Pendiente / Programado / Jugado / Aplazado
• resultado → Ej: "6-4, 7-5"
• ganador → El ganador del partido
• pista → Número de pista (1-3)
• hora → Hora del partido
• fecha → Fecha del partido
```

### 2. Algoritmo Berger Implementado

```
Qué hace:
✓ Lee los jugadores de una división
✓ Calcula N-1 jornadas
✓ Genera todos los enfrentamientos posibles
✓ Garantiza que no hay repeticiones
✓ Cada jugador juega contra cada otro exactamente una vez

Ejemplo con 4 jugadores (A, B, C, D):

Jornada 1: A-D, B-C
Jornada 2: A-C, B-D  ← Todos contra todos
Jornada 3: A-B, C-D

Total: 3 jornadas = 4-1 ✓
Total: 6 partidos = 4×3/2 ✓
```

### 3. Tres Endpoints Nuevos

| Endpoint | Método | Autenticación | Qué Hace |
|----------|--------|--------------|----------|
| `/api/jornadas/generar-calendario/:divisionId` | POST | ✅ Sí | Genera automáticamente todas las jornadas |
| `/api/jornadas/division/:divisionId/jornadas` | GET | ❌ No | Ver el calendario completo |
| `/api/jornadas/:jornadaId/partidos` | GET | ❌ No | Ver partidos de una jornada |

---

## 🚀 Cómo Usar (3 Pasos)

### Paso 1: Preparar Datos

En el panel de admin (`http://localhost:1337/admin`):

1. Crea una **Temporada** (ej: "Liga Invierno 2025")
2. Crea una **División** (ej: "División 1")
3. Crea **4-10 Jugadores**
4. **Asigna jugadores a la división**

### Paso 2: Generar Calendario

Desde **Postman**:

```
POST http://localhost:1337/api/jornadas/generar-calendario/1

Headers:
  Authorization: Bearer <TU_TOKEN_JWT>
  Content-Type: application/json

Body:
  {}

Respuesta (200):
{
  "success": true,
  "division": "División 1",
  "totalJornadas": 3,
  "totalJugadores": 4
}
```

### Paso 3: Ver el Calendario

```
GET http://localhost:1337/api/jornadas/division/1/jornadas

Respuesta:
[
  {
    "id": 1,
    "Nombre": "Jornada 1",
    "numero": 1,
    "partidos": [
      {
        "id": 1,
        "jugador1": { "id": 1, "Nombre": "Rafael", ... },
        "jugador2": { "id": 2, "Nombre": "Roger", ... },
        "estado": "Pendiente"
      }
    ]
  }
]
```

---

## 📊 Cálculos Automáticos

Si tienes **N jugadores**:

- **Jornadas** = N - 1
- **Partidos** = N × (N-1) / 2

| Jugadores | Jornadas | Partidos |
|-----------|----------|----------|
| 2 | 1 | 1 |
| 4 | 3 | 6 |
| 5 | 4 | 10 |
| 10 | 9 | 45 |

---

## 🗂️ Cambios en Archivos

### Creados (Nuevos)

```
backend/src/api/partido/
  ├── content-types/partido/schema.json
  ├── controllers/partido.ts
  ├── routes/partido.ts
  └── services/partido.ts

backend/src/utils/
  ├── berger.test.ts
  └── init-test-data.ts

ROOT/
  ├── SPRINT2_README.md
  ├── SPRINT2_DOCUMENTACION.md
  ├── SPRINT2_CHECKLIST.md
  ├── SPRINT2_FAQ.md
  ├── SPRINT2_RESUMEN_VISUAL.md
  └── POSTMAN_SPRINT2.json
```

### Modificados

```
backend/src/api/jornada/
  ├── content-types/jornada/schema.json      (+ numero, + partidos)
  ├── controllers/jornada.ts                 (+ 3 métodos custom)
  ├── routes/jornada.ts                      (+ 3 rutas custom)
  └── services/jornada.ts                    (+ Algoritmo Berger)
```

---

## 🧪 Pruebas

### Test 1: Validar Algoritmo

```bash
node backend/src/utils/berger.test.ts
```

Debe pasar todas las validaciones.

### Test 2: Generar Calendario Manual

1. Crea 4 jugadores en panel
2. Asignalos a una división
3. POST a generar-calendario
4. Deberías ver 3 jornadas con 2 partidos cada una

### Test 3: Validar Datos en BD

```sql
SELECT COUNT(*) FROM jornadas WHERE division = 1;    -- Debe ser 3
SELECT COUNT(*) FROM partidos WHERE jornada IN (SELECT id FROM jornadas WHERE division = 1);  -- Debe ser 6
```

---

## ❌ Errores Comunes y Soluciones

### "400: No hay jugadores asignados"

**Causa**: La división no tiene jugadores asignados

**Solución**:
1. Abre panel de admin
2. Divisiones → Tu división
3. Verifica que tiene jugadores
4. Si no, abre Jugadores y asignalos

### "401: Unauthorized"

**Causa**: Token JWT inválido o faltante

**Solución**:
1. F12 en panel de admin
2. Network → Buscar request con "Authorization: Bearer"
3. Copia el token
4. Úsalo en Postman header

### "500: Internal Server Error"

**Causa**: Strapi no está corriendo o hay error de código

**Solución**:
```bash
# Terminal de backend:
npm run develop
# Esperar a que arranque completamente
```

---

## 📚 Documentación Disponible

Hemos creado 6 documentos:

1. **SPRINT2_README.md** ← Comienza aquí (Guía paso a paso)
2. **SPRINT2_DOCUMENTACION.md** ← Especificación técnica
3. **SPRINT2_RESUMEN_VISUAL.md** ← Diagramas y visualización
4. **SPRINT2_CHECKLIST.md** ← Validaciones y tests
5. **SPRINT2_FAQ.md** ← Preguntas frecuentes
6. **POSTMAN_SPRINT2.json** ← Colección de requests

---

## 💡 Tips Importantes

✅ **DO**:
- Reinicia Strapi después de cambios de modelo
- Publica división y jugadores antes de generar
- Usa al menos 2 jugadores por división
- Valida con tests antes de pasar a Sprint 3

❌ **DON'T**:
- No regeneres el calendario dos veces (crea duplicados)
- No modifiques el algoritmo Berger
- No olvides el token JWT para POST
- No uses menos de 2 jugadores

---

## 🎯 Checklist de Aceptación

```
SPRINT 2 ESTÁ COMPLETO CUANDO:

□ Modelo Partido existe y funciona
□ Algoritmo Berger pasa todos los tests
□ POST /generar-calendario crea jornadas
□ GET /jornadas/division/:id devuelve calendario
□ GET /jornadas/:id/partidos devuelve partidos
□ BD tiene partidos guardados correctamente
□ Documentación está leída y entendida
□ Tu equipo puede generar un calendario
```

---

## 🚀 Próximo Sprint (Sprint 3)

Con esto listo, el siguiente paso es:

1. **Interfaz de disponibilidad**: Jugadores marcan cuándo pueden jugar
2. **Asignación automática**: El sistema asigna pista/hora basado en disponibilidad
3. **Gestión de conflictos**: Si no hay coordinación, marca como "Aplazado"

---

## 📞 ¿Preguntas?

1. Lee **SPRINT2_README.md** (guía paso a paso)
2. Consulta **SPRINT2_FAQ.md** (preguntas frecuentes)
3. Revisa **SPRINT2_DOCUMENTACION.md** (especificación)
4. Pregunta al profesor/mentor

---

## 📅 Entrega

- **Fecha**: 2 de Febrero de 2025
- **Estado**: ✅ LISTO PARA TESTING
- **Próxima Fase**: Sprint 3 (Disponibilidad y Horarios)

---

**¡A por el Sprint 2! 🎾**

El algorit Berger es la base de todo lo que viene. Úsalo bien y entiéndelo bien.
Cualquier duda, consulta la documentación o pregunta a tu equipo.

**Éxito en vuestro proyecto final de curso** 🏆
