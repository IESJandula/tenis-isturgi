# ❓ SPRINT 2 - FAQ y Troubleshooting Avanzado

## 🤔 Preguntas Frecuentes

### P1: ¿El algoritmo Berger funciona siempre correctamente?

**R:** Sí. El algoritmo está matemáticamente probado. Para N jugadores:
- Siempre genera **N-1 jornadas**
- Siempre **N(N-1)/2 partidos**
- Cada jugador juega **exactamente N-1 partidos**
- **Cero repeticiones** de enfrentamientos

Es el estándar en competiciones deportivas (Liga de Fútbol, Tenis, etc.)

---

### P2: ¿Puedo generar el calendario varias veces?

**R:** ⚠️ **NO RECOMENDADO**. Si ejecutas el endpoint dos veces:
- Se crean jornadas duplicadas
- Se crean partidos duplicados
- La BD se "ensucia"

**Solución**: Si necesitas regenerar:
1. Borra las jornadas existentes en el panel
2. O crea una nueva División

En Sprint 3 podríamos añadir una validación para evitar esto.

---

### P3: ¿Qué pasa si hay un número impar de jugadores?

**R:** El algoritmo maneja automáticamente:
- Alguien "descansa" en cada jornada
- No se crea partido para el que descansa
- Solo se guardadas los enfrentamientos reales

**Ejemplo con 5 jugadores (A,B,C,D,E)**:
```
Jornada 1: A-B, C-D, E descansa
Jornada 2: A-C, D-E, B descansa
Jornada 3: A-D, E-B, C descansa
Jornada 4: A-E, B-C, D descansa
```

---

### P4: ¿Puedo cambiar el algoritmo de emparejamiento?

**R:** Técnicamente sí, pero **NO LO HAGAS** en este Sprint:
- El Berger es el estándar deportivo
- Cambiar = rechazar el diseño del proyecto
- En futuro Sprints podría haber variantes

Si quieres otra cosa, **documenta primero** y pídelo al cliente.

---

### P5: ¿Qué significa "estado: Pendiente"?

**R:** El partido acaba de crearse pero:
- ❌ Sin horario asignado
- ❌ Sin pista asignada
- ❌ Sin fecha asignada
- ✅ En espera de que los jugadores marquen disponibilidad

---

### P6: ¿Puedo modificar los datos de un Partido después de crearlo?

**R:** Sí, completamente. En el panel de admin:
1. Abre la colección **Partido**
2. Edita estado, resultado, ganador, etc.
3. Los cambios son persistentes

---

### P7: ¿Qué información guardan los IDs en Partido?

**R:** Los IDs relacionan usuarios de Strapi (plugin users-permissions):
```json
{
  "jugador1": 10,  // ← ID del usuario en Strapi
  "jugador2": 20,  // ← ID del usuario en Strapi
  "ganador": 10    // ← ID del usuario ganador
}
```

---

### P8: ¿Los endpoint están protegidos por permisos?

**R:** Parcialmente:
- ✅ **POST** `/generar-calendario` - Requiere autenticación (Admin)
- ❌ **GET** `/jornadas/division/...` - Público (sin autenticación)
- ❌ **GET** `/jornadas/.../partidos` - Público (sin autenticación)

En Sprint 3 podríamos restringir más si queremos.

---

### P9: ¿Cuál es el límite máximo de jugadores?

**R:** Técnicamente, el algoritmo funciona con cualquier número:
- 100 jugadores = 99 jornadas, 4950 partidos ✅
- 1000 jugadores = 999 jornadas, 499500 partidos ✅ (Lento pero funciona)

**En práctica para Isturgi**: Máximo 20-30 jugadores por división.

---

### P10: ¿Cómo asigno jugadores a una división?

**R:** Dos formas:

**Opción 1: Desde el panel de admin**
1. Abre **Jugadores**
2. Edita un jugador
3. Campo "division" → Selecciona división
4. Save

**Opción 2: Por API (PUT)**
```bash
PUT /api/jugadors/1
{
  "data": {
    "division": 1
  }
}
```

---

## 🔧 Troubleshooting Avanzado

### ❌ Error: "TypeError: jugadores is not iterable"

**Síntomas:**
- Status 500
- Error en log de Strapi

**Causas Posibles:**
1. División existe pero está vacía
2. Campo `jugadors` no se populó en la query

**Solución:**
```typescript
// En jornada.service.ts, verifica que populate está bien:
const division = await strapi.db.query('api::division.division').findOne({
  where: { id: divisionId },
  populate: {
    jugadors: true  // ← Debe estar aquí
  }
});
```

---

### ❌ Error: "400: No hay jugadores asignados"

**Síntomas:**
- Status 400
- Mensaje: "No hay jugadores asignados a esta división"

**Causas Posibles:**
1. División correcta pero sin jugadores
2. Jugadores no están publicados
3. Jugadores no tienen la división asignada

**Solución:**
1. Abre el panel de admin
2. Ve a **Divisiones** → Tu división
3. Busca la relación "jugadors"
4. Debe haber al menos 2 en la lista
5. Si está vacía, abre **Jugadores** y asigna manualmente

---

### ❌ Error: "401: Unauthorized"

**Síntomas:**
- Status 401
- Intentas generar calendario

**Causas:**
- Token JWT inválido, expirado o faltante

**Solución:**
```bash
# Obtener token en el panel (F12 → Network → Header Authorization)
# Luego usarlo en Postman:

curl -X POST http://localhost:1337/api/jornadas/generar-calendario/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### ❌ Error: "404: Not Found" en GET

**Síntomas:**
- Status 404
- Intentas ver jornadas/partidos

**Causas:**
- ID de división/jornada no existe
- Jornada fue eliminada

**Solución:**
1. Verifica que el ID existe:
```bash
GET /api/divisions    # Ver todas las divisiones
GET /api/jornadas     # Ver todas las jornadas
```

2. Usa los IDs correctos de la respuesta

---

### ⚠️ Warning: "La BD tiene partidos sin jornada"

**Síntomas:**
- Al consultar partidos, algunos no están relacionados

**Causas:**
- Generación incompleta
- Inserción manual incorrecta

**Solución:**
1. Borra esos partidos en el panel
2. Regenera el calendario

---

### 🐌 Problema: "Generación muy lenta con muchos jugadores"

**Síntomas:**
- POST tarda >30 segundos con 50+ jugadores

**Causas:**
- Algoritmo está bien (O(N²) es correcto)
- La inserción en BD es lenta por cantidad

**Soluciones:**
1. Inserción en batch (próxima mejora)
2. Usar índices en BD
3. Dividir en divisiones menores

---

## 🛠️ Debugging de Código

### ¿Cómo debuggear el algoritmo Berger?

**Opción 1: Ejecutar tests**
```bash
node backend/src/utils/berger.test.ts
```

Esto corre el algoritmo con 4, 5, y 10 jugadores, y valida:
- ✓ Número correcto de jornadas
- ✓ Partidos por jornada
- ✓ Partidos por jugador
- ✓ Sin repeticiones

**Opción 2: Añadir logs en el servicio**

En `backend/src/api/jornada/services/jornada.ts`:

```typescript
generarCalendarioRoundRobin(jugadores: Jugador[]): Enfrentamiento[][] {
  const n = jugadores.length;
  console.log(`[DEBUG] Generando para ${n} jugadores`);
  // ... resto del código ...
  console.log(`[DEBUG] Total jornadas: ${jornadas.length}`);
  console.log(`[DEBUG] Total partidos: ${jornadas.reduce((s, j) => s + j.length, 0)}`);
  return jornadas;
}
```

---

## 📊 Validaciones Que Hacer

### Checklist Post-Generación

Después de generar un calendario, verifica en BD:

```sql
-- Contar jornadas de una división
SELECT COUNT(*) as total_jornadas 
FROM jornadas 
WHERE division = 1;

-- Contar partidos de una jornada
SELECT COUNT(*) as total_partidos 
FROM partidos 
WHERE jornada = 1;

-- Verificar que cada jugador juega N-1 veces
SELECT jugador1 as jugador, COUNT(*) as partidos
FROM partidos
WHERE jornada IN (SELECT id FROM jornadas WHERE division = 1)
GROUP BY jugador1
ORDER BY partidos DESC;
```

---

## 📚 Recursos Adicionales

### Para Entender Round Robin Mejor

- https://en.wikipedia.org/wiki/Round-robin_tournament
- https://en.wikipedia.org/wiki/Berger_tables

### Para Strapi

- Documentación oficial: https://docs.strapi.io
- Custom controllers: https://docs.strapi.io/developer-docs/latest/development/backend-customization/controllers.html

---

## 🎯 Pasos Recomendados Si Algo Falla

1. **Reinicia Strapi**
   ```bash
   Ctrl+C
   npm run develop
   ```

2. **Verifica datos en panel** (`http://localhost:1337/admin`)
   - ¿Existe la División?
   - ¿Está publicada?
   - ¿Tiene jugadores?

3. **Prueba con dataset mínimo**
   - 2 jugadores (1 jornada, 1 partido)
   - Si funciona, escala a 4-5 jugadores

4. **Usa Postman y DevTools**
   - F12 → Network → Ver respuesta exacta
   - DevTools → Console → Errores de cliente

5. **Revisa logs de Strapi**
   - Terminal donde corre `npm run develop`
   - Busca "error" o "ERROR"

6. **Pregunta en el equipo**
   - Compartir screenshot del error
   - Compartir los logs de Strapi

---

## ✅ Confirmación Final

Si llegaste hasta aquí y todo funciona:

```
✓ Modelo Partido existe
✓ Algoritmo Berger valida
✓ Endpoints generan datos
✓ BD tiene partidos guardados
✓ GET devuelven datos correcto
```

**¡FELICIDADES! Sprint 2 está COMPLETO** 🎉

Ahora puedes pasar a **Sprint 3: Disponibilidad y Asignación de Horarios** 🎾

---

**Última actualización**: 2 de Febrero de 2025
**Versión**: 1.0
