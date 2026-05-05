# 🚀 GUÍA DE TESTING RÁPIDA - TENIS ISTURGI

## PASO 1: ARRANCAR BACKEND

**En una terminal PowerShell nueva:**

```powershell
cd "c:\Users\jball\OneDrive\Escritorio\Club de tenis\tenis-isturgi\spring-backend"

# Configurar variables de entorno
$env:SPRING_DATASOURCE_URL="jdbc:h2:mem:testdb"
$env:SPRING_DATASOURCE_DRIVER_CLASS_NAME="org.h2.Driver"
$env:SPRING_DATASOURCE_USERNAME="sa"
$env:SPRING_DATASOURCE_PASSWORD=""
$env:SPRING_JPA_DATABASE_PLATFORM="org.hibernate.dialect.H2Dialect"
$env:ADMIN_EMAILS="admin@test.com"
$env:ALLOW_UNVERIFIED_JWT="true"

# Arrancar servidor
.\apache-maven-3.9.6\bin\mvn.cmd -DskipTests spring-boot:run
```

**Espera a ver:**
```
Tomcat started on port 8080 (http)
Started BackendApplication in X seconds
```

✅ Backend listo en http://localhost:8080

---

## PASO 2: ARRANCAR FRONTEND

**En OTRA terminal PowerShell nueva:**

```powershell
cd "c:\Users\jball\OneDrive\Escritorio\Club de tenis\tenis-isturgi\frontend"
npm run dev
```

**Espera a ver:**
```
VITE ready in XXX ms
Local:   http://localhost:5173
```

✅ Frontend listo en http://localhost:5173

---

## PASO 3: ABRIR NAVEGADOR

```
http://localhost:5173
```

Deberías ver la página de inicio de Club de Tenis Isturgi.

---

## 🔐 CREDENCIALES DE PRUEBA

### Admin
```
Email:    admin@test.com
Password: admin123
```

### User Regular
```
Email:    user@test.com
Password: user123
```

---

## ✅ FLUJO DE TESTING COMPLETO

### A. LOGIN Y PANEL (NUEVO - AHORA DE PRIMERA VEZ)
1. Click botón "Soy Socio" (arriba a la derecha)
2. Ingresa `admin@test.com` / `admin123`
3. Click "Acceder"
4. ✅ **AHORA ENTRA DE PRIMERA VEZ** (sin necesidad de hacer clic dos veces)

### B. CREAR TEMPORADA (Admin)
1. Click "Gestión de Contenidos" (en panel)
2. Click "Nueva Temporada"
3. Nombre: `Temporada 2026`
4. Click "Guardar"

### C. CREAR DIVISIÓN (Admin)
1. Click "Nueva División"
2. Nombre: `División A`
3. Selecciona "Temporada 2026"
4. Click "Guardar"

### D. CREAR JUGADORES (Admin) - MÍNIMO 4
1. Click "Nuevo Jugador"
2. Nombre: `Juan`
3. Email: `juan@test.com`
4. Click "Guardar"
5. **Repite 3 veces más** para tener mínimo 4 jugadores
   - María (maria@test.com)
   - Pedro (pedro@test.com)
   - Ana (ana@test.com)

### E. GENERAR CALENDARIO (Admin)
1. Click "Gestión de Jornadas"
2. En "División A", click "Realizar Sorteo Automático"
3. Espera unos segundos...
4. ✅ Se crearán automáticamente jornadas con partidos (Algoritmo Berger Round-Robin)

### F. PROBAR DISPONIBILIDADES (User)
1. **Logout**: Click perfil (arriba a la derecha) → Logout
2. **Login como user**: `user@test.com` / `user123`
3. Click "Disponibilidad"
4. Marca si estás disponible para cada jornada
5. Click "Guardar"
6. ✅ Se guarda y valida por deadline de jornada

### G. PROBAR RESULTADOS (Admin)
1. **Login como admin**: `admin@test.com` / `admin123`
2. Click "Liga"
3. Busca un partido (ejemplo: "Juan vs María")
4. Click en el partido
5. Ingresa resultado (ej: `6/4 7/5` o `Ganador: Juan`)
6. Click "Guardar"
7. ✅ Resultado guardado como "Provisional"
8. Espera 24h simuladas (o admin puede confirmar)
9. ✅ Auto-confirmación después de 24h

### H. PROBAR PERMISOS (Security)
1. **Como Admin**: Todos los botones disponibles ✅
2. **Como User**: Solo ve datos de lectura, sin opciones de admin ✅
3. **Sin autenticación**: Redirige a login en rutas protegidas ✅

---

## 🔍 QUÉ VERIFICAR EN CADA PASO

| Funcionalidad | Esperado | Status |
|---|---|---|
| Login de primera | Entra directamente sin hacer clic 2 veces | ✅ |
| Crear temporada | Se guarda en BD | ✅ |
| Crear división | Vinculada a temporada | ✅ |
| Crear jugadores | Se ven en listado | ✅ |
| Generar calendario | Se crean jornadas automáticas | ✅ |
| Disponibilidades | Se valida deadline (24h antes) | ✅ |
| Disponibilidades cerradas | No permite enviar después de deadline | ✅ |
| Resultados provisional | Se marca como "Provisional" | ✅ |
| Resultados auto-confirm | Confirma automático después de 24h | ✅ |
| Permisos Admin | Solo admin puede hacer cambios | ✅ |
| Permisos User | User solo ve datos, no edita | ✅ |

---

## 🛠️ PROBLEMAS COMUNES

### "No puede conectar al servidor"
- ¿Está corriendo el backend en puerto 8080?
- ¿Están todas las variables de entorno configuradas?
- Revisa logs: busca "Tomcat started on port 8080"

### "Page is not loading / blanca"
- ¿Está corriendo el frontend en puerto 5173?
- Abre DevTools (F12) y revisa la consola
- Intenta `npm run dev` nuevamente

### "Login requiere hacer clic dos veces"
- ✅ **YA ESTÁ CORREGIDO** en esta versión
- El cambio está en `/frontend/src/utils/auth.js`
- Ahora espera a que Firebase actualice el estado antes de redirigir

### "Las fechas de disponibilidad no se validan"
- Revisa que la jornada tenga `fechaLimiteDisponibilidad`
- La validación rechaza requests después de deadline
- Ve a "Gestión de Jornadas" → "Cerrar Jornada" si necesitas cerrar manualmente

---

## 📱 URLs IMPORTANTES

| Parte | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080/api |
| H2 Console | http://localhost:8080/h2-console |
| API Docs | http://localhost:8080/api/jornadas (ejemplo GET) |

---

## 📊 ESTRUCTURA DE DATOS

```
Temporada (Season)
├── División (Division)
│   ├── Jornada (Journey/Round)
│   │   ├── Partido (Match)
│   │   │   ├── Resultado (con estado: null/"Provisional"/"CONFIRMADO")
│   │   │   └── Timestamps (resultadoProvisionalAt, resultadoConfirmadoAt)
│   │   ├── fechaLimiteDisponibilidad
│   │   └── disponibilidadCerrada
│   └── Jugador (Player)
└── Disponibilidad (Availability)
    ├── Jugador
    └── Jornada (con validación de deadline)
```

---

## ✨ NUEVAS FEATURES IMPLEMENTADAS

- ✅ **JWT + Role-based Access**: ROLE_ADMIN vs ROLE_USER
- ✅ **Resultado Workflow**: Provisional → Confirmación → Auto-confirm 24h
- ✅ **Disponibilidad Deadline**: 24h antes de jornada, con cierre explícito
- ✅ **Permisos por Endpoint**: SecurityConfig bloquea accesos no autorizados
- ✅ **Login de Primera**: Ya no requiere clic doble (ARREGLADO HOY)

---

## 🎯 CHECKLIST FINAL

- [ ] Backend arrancando sin errores
- [ ] Frontend mostrando página inicial
- [ ] Login de PRIMERA entrada (sin doble clic)
- [ ] Admin puede crear temporadas
- [ ] Admin puede crear divisiones
- [ ] Admin puede crear jugadores
- [ ] Admin puede generar calendario
- [ ] User puede marcar disponibilidades
- [ ] Disponibilidades se validan por deadline
- [ ] Admin puede enviar resultados
- [ ] Resultados se guardan como "Provisional"
- [ ] Permisos funcionan correctamente
- [ ] H2 Console accesible en puerto 8080

**Cuando TODO esté ✓, ¡La aplicación está LISTA PARA PRODUCCIÓN!**

---

## 💡 TIPS

- Usa **H2 Console** (http://localhost:8080/h2-console) para ver datos directamente en BD
- JDBC URL: `jdbc:h2:mem:testdb`, User: `sa`, Password: (vacía)
- El backend genera schema automáticamente (Hibernate DDL auto-update)
- Los datos se pierden al reiniciar (es en-memoria)
- Para datos persistentes, cambia `SPRING_DATASOURCE_URL` a MySQL

---

Última actualización: 3 de mayo de 2026
