# 🎾 Sprint 2: Generación de Calendario - Guía de Implementación

## 📋 Cambios Realizados

### 1. **Nuevo Modelo: Partido**

Se ha creado el modelo `Partido` que es el núcleo del Sprint 2. Este modelo almacena todos los enfrentamientos generados por el algoritmo.

**Estructura de directorios creada:**

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

**Campos del modelo Partido:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `jornada` | Relation (ManyToOne) | A qué jornada pertenece |
| `jugador1` | Relation (ManyToOne) | Primer jugador |
| `jugador2` | Relation (ManyToOne) | Segundo jugador |
| `estado` | Enum | Pendiente, Programado, Jugado, Aplazado |
| `resultado` | String | Ej: "6-4, 7-5" |
| `ganador` | Relation (ManyToOne) | Quién ganó |
| `pista` | Integer | Número de pista (1-3) |
| `hora` | Time | Hora del partido |
| `fecha` | Date | Fecha del partido |

---

### 2. **Actualización del Modelo: Jornada**

Se han añadido dos campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `numero` | Integer | Número secuencial (1, 2, 3...) |
| `partidos` | Relation (OneToMany) | Partidos de esta jornada |

---

### 3. **Algoritmo Berger Implementado**

En el servicio `api::jornada.jornada` se han añadido dos métodos:

- **`generarCalendarioRoundRobin(jugadores)`**: Algoritmo puro que genera los emparejamientos
- **`generarCalenarioParaDivision(divisionId)`**: Método que integra el algoritmo con la BD

---

### 4. **Endpoints Nuevos**

Se han creado 3 endpoints personalizados:

#### POST `/api/jornadas/generar-calendario/:divisionId`

**Descripción**: Genera automáticamente todas las jornadas y partidos para una división.

**Autenticación**: ✅ Requerida (Admin)

**Ejemplo de uso:**

```bash
curl -X POST http://localhost:1337/api/jornadas/generar-calendario/1 \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Respuesta exitosa:**

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
      "division": 1
    },
    // ... más jornadas
  ]
}
```

---

#### GET `/api/jornadas/division/:divisionId/jornadas`

**Descripción**: Obtiene todas las jornadas de una división con todos sus partidos.

**Autenticación**: ❌ No requerida

**Ejemplo de uso:**

```bash
curl http://localhost:1337/api/jornadas/division/1/jornadas
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "Nombre": "Jornada 1",
    "numero": 1,
    "partidos": [
      {
        "id": 1,
        "jugador1": {
          "id": 10,
          "username": "nadal",
          "Nombre": "Rafael"
        },
        "jugador2": {
          "id": 20,
          "username": "federer",
          "Nombre": "Roger"
        },
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

#### GET `/api/jornadas/:jornadaId/partidos`

**Descripción**: Obtiene solo los partidos de una jornada específica.

**Autenticación**: ❌ No requerida

**Ejemplo de uso:**

```bash
curl http://localhost:1337/api/jornadas/1/partidos
```

---

## 🚀 Cómo Usar (Paso a Paso)

### **Paso 1: Reiniciar Strapi**

Strapi debe reiniciarse para reconocer el nuevo modelo `Partido`:

```bash
cd backend
npm run develop
```

Deberías ver en la consola que se reconstruye la BD.

### **Paso 2: Acceder al Panel de Strapi**

1. Abre `http://localhost:1337/admin`
2. Verifica que aparece la colección **"Partido"** en el menú lateral
3. Verifica que en **"Jornada"** ahora tiene los campos `numero` y `partidos`

### **Paso 3: Preparar Datos (si no los tienes)

Asegúrate de tener:

- ✅ Una **Temporada** creada (ej: "Liga Invierno 2025")
- ✅ Una o más **Divisiones** creadas (ej: "División 1")
- ✅ Al menos **2 jugadores** asignados a la división

**Verificar en el panel:**

```
Temporadas → selecciona una → Divisiones (debe tener al menos 1)
Divisiones → selecciona una → Jugadores (debe tener al menos 2)
```

### **Paso 4: Generar el Calendario

**Opción A: Desde Postman**

1. **URL**: `POST http://localhost:1337/api/jornadas/generar-calendario/1`
2. **Headers**:
   - `Authorization: Bearer <tu_token_jwt>`
   - `Content-Type: application/json`
3. **Cuerpo**: Vacío `{}`
4. **Enviar**

**Opción B: Desde cURL**

```bash
curl -X POST http://localhost:1337/api/jornadas/generar-calendario/1 \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**¿Dónde obtener el token JWT?**

1. Login en `/admin`
2. DevTools (F12) → Network
3. Hacer una petición autenticada
4. Buscar el header `Authorization: Bearer ...`

### **Paso 5: Ver el Resultado

Una vez generado, puedes ver el calendario:

```bash
curl http://localhost:1337/api/jornadas/division/1/jornadas
```

Deberías ver algo como:

```json
[
  {
    "id": 1,
    "Nombre": "Jornada 1",
    "numero": 1,
    "partidos": [
      { "jugador1": {...}, "jugador2": {...}, "estado": "Pendiente" },
      { "jugador1": {...}, "jugador2": {...}, "estado": "Pendiente" }
    ]
  },
  {
    "id": 2,
    "Nombre": "Jornada 2",
    ...
  }
]
```

---

## 📊 Cálculo de Jornadas y Partidos

| Jugadores | Jornadas | Partidos Totales |
|-----------|----------|-----------------|
| 2 | 1 | 1 |
| 3 | 2 | 3 |
| 4 | 3 | 6 |
| 5 | 4 | 10 |
| 8 | 7 | 28 |
| 10 | 9 | 45 |
| 12 | 11 | 66 |
| 16 | 15 | 120 |
| 20 | 19 | 190 |

**Fórmula**: 
- Jornadas = N - 1
- Partidos = N × (N - 1) / 2

---

## 🧪 Pruebas de Validación

Se incluye un archivo de tests en `backend/src/utils/berger.test.ts` que valida:

```bash
# Para ejecutar las pruebas (opcional):
node backend/src/utils/berger.test.ts
```

**Validaciones que pasa:**

✅ Genera N-1 jornadas para N jugadores
✅ Cada jugador juega exactamente N-1 partidos
✅ No hay enfrentamientos repetidos
✅ Funciona con números pares e impares
✅ Maneja correctamente el "descanso" en impares

---

## ⚠️ Posibles Errores y Soluciones

### Error: "400: División no encontrada"

**Causa**: El `divisionId` no existe en la BD

**Solución**: 
1. Verifica que la división existe en el panel
2. Confirma que está **publicada** (check en el botón "Save")
3. Usa el ID correcto

### Error: "400: No hay jugadores asignados"

**Causa**: La división no tiene jugadores

**Solución**:
1. Ve a **Jugadores** en el panel
2. Edita jugadores individuales
3. Asigna al menos 2 a la misma división
4. Haz click en "Save"

### Error: "401 Unauthorized"

**Causa**: Token JWT inválido o expirado

**Solución**:
1. Obtén un nuevo token del panel
2. Incluye en el header: `Authorization: Bearer <token>`

### Error: "500 Internal Server Error"

**Causa**: Strapi no está corriendo o hay error en el código

**Solución**:
1. Verifica que `npm run develop` está ejecutándose
2. Revisa la consola de Strapi para errores
3. Reinicia con `Ctrl+C` y `npm run develop` de nuevo

---

## 📝 Archivos Modificados

### Creados:

- ✅ `backend/src/api/partido/` (completa carpeta)
- ✅ `backend/src/utils/berger.test.ts`
- ✅ `SPRINT2_DOCUMENTACION.md`

### Modificados:

- ✅ `backend/src/api/jornada/content-types/jornada/schema.json`
- ✅ `backend/src/api/jornada/controllers/jornada.ts`
- ✅ `backend/src/api/jornada/routes/jornada.ts`
- ✅ `backend/src/api/jornada/services/jornada.ts`

---

## 🔄 Próximo Sprint (Sprint 3)

Con el calendario generado, el siguiente paso es:

1. **Interfaz de Disponibilidad**: Que los jugadores marquen cuándo pueden jugar
2. **Algoritmo de Asignación**: Asignar pistas/horarios automáticamente
3. **Gestión de Conflictos**: Marcar como "Aplazado" si no hay coordinación

---

## 💡 Tips y Buenas Prácticas

### Para probar rápidamente:

1. Crea una división con 4 jugadores (número par → más fácil de ver)
2. Genera el calendario
3. Deberías ver exactamente 3 jornadas con 2 partidos cada una

### Antes de ir al Sprint 3:

- [ ] Verifica que el algoritmo genera todas las jornadas correctamente
- [ ] Prueba con diferentes números de jugadores (par e impar)
- [ ] Comprueba en la BD que se guardan todos los partidos
- [ ] Documenta cualquier case especial que encuentres

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs de Strapi** (consola con `npm run develop`)
2. **Comprueba la estructura de datos** en el panel de Strapi
3. **Valida los JSONs** en Postman (F12 → Network)
4. **Consulta SPRINT2_DOCUMENTACION.md** para más detalles

¡Buen trabajo en el Sprint 2! 🎾
