<template>
  <div class="admin-gestion-page fade-in">
    <section class="hero-section">
      <div class="hero-content">
        <span class="mini-tag">Panel de Administración</span>
        <h1>Gestión de Jornadas</h1>
        <p class="hero-lead">Configuración de horarios y asignación de pistas para la Liga Social.</p>
        <button type="button" class="btn-algorithm" style="text-decoration: none; display: inline-block;" @click="goBack">Ir a Mi Panel</button>
      </div>
    </section>

    <div class="container main-content">
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando jornadas...</p>
      </div>

      <div v-else class="admin-container">
        <!-- SECCIÓN DIVISIONES -->
        <div v-if="divisiones.length" class="divisiones-section" style="margin-bottom: 50px;">
          <div class="section-head">
            <div>
              <h2 style="color: white; margin-bottom: 8px; font-size: 1.5rem; border-bottom: 1px solid #333; padding-bottom: 10px;">Sorteo de Calendario (Por Temporada)</h2>
              <p class="section-lead">Busca una división por nombre y ejecútala en su temporada correspondiente.</p>
            </div>
            <div class="section-counter">{{ divisionesFiltradas.length }} división{{ divisionesFiltradas.length === 1 ? '' : 'es' }}</div>
          </div>

          <div class="division-toolbar">
            <input
              v-model="busquedaDivision"
              type="search"
              class="division-search"
              placeholder="Buscar por nombre o temporada"
            >
          </div>

          <div v-if="!divisionesAgrupadas.length" class="empty-search-state">
            No hay divisiones que coincidan con la búsqueda.
          </div>

          <div v-else class="division-group-list">
            <section v-for="grupo in divisionesAgrupadas" :key="grupo.key" class="division-group-card">
              <div class="division-group-header">
                <div>
                  <h3>{{ grupo.temporadaNombre }}</h3>
                  <p>{{ grupo.items.length }} división{{ grupo.items.length === 1 ? '' : 'es' }}</p>
                </div>
              </div>

              <div class="table-wrap">
                <table class="divisions-table">
                  <thead>
                    <tr>
                      <th>División</th>
                      <th>Temporada</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="div in grupo.items" :key="div.id">
                      <td>
                        <div class="table-primary">{{ div.Nombre }}</div>
                        <div class="table-secondary">Generación automática mediante Algoritmo Berger</div>
                      </td>
                      <td>{{ getTemporadaNombre(div) }}</td>
                      <td>
                        <div class="table-actions">
                          <button 
                            @click="generarCalendarioDivision(div)" 
                            :disabled="procesando !== null"
                            class="btn-algorithm btn-table"
                          >
                            {{ procesando === 'div_' + div.id ? 'Procesando...' : 'Realizar Sorteo' }}
                          </button>
                          <button 
                            @click="regenerarCalendarioDivision(div)" 
                            :disabled="procesando !== null"
                            class="btn-reset btn-table"
                          >
                            {{ procesando === 'reset_' + div.id ? 'Regenerando...' : 'Regenerar' }}
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <h2 v-if="jornadas.length" style="color: white; margin-bottom: 20px; font-size: 1.5rem; border-bottom: 1px solid #333; padding-bottom: 10px;">Gestión de Pistas y Resultados (Por Jornada)</h2>

        <div v-if="jornadas.length" class="jornadas-group-list">
          <section v-for="grupo in jornadasAgrupadas" :key="grupo.key" class="division-group-card">
            <div class="division-group-header">
              <div>
                <h3>{{ grupo.temporadaNombre || 'Sin temporada' }} · {{ grupo.divisionNombre }}</h3>
                <p>{{ grupo.items.length }} jornada{{ grupo.items.length === 1 ? '' : 's' }}</p>
              </div>
            </div>

            <div class="cards-grid">
              <div v-for="jornada in grupo.items" :key="jornada.id" class="jornada-admin-card compact">
                <div class="card-info">
                  <h3>{{ jornada.Nombre }}</h3>
                  <p class="meta" style="margin-top: 6px;">
                    <span class="badge-estado" :class="jornada.cerrada ? 'cerrada' : 'abierta'">
                      {{ jornada.cerrada ? 'Cerrada' : 'Abierta' }}
                    </span>
                  </p>
                </div>

                <div class="card-actions">
                  <button 
                    @click="lanzarAlgoritmo(jornada)" 
                    :disabled="procesando !== null"
                    class="btn-algorithm"
                  >
                    {{ procesando === jornada.id ? 'Procesando...' : 'Generar Horarios' }}
                  </button>
                  <button
                    @click="toggleCierreJornada(jornada)"
                    :disabled="procesando !== null"
                    class="btn-close-jornada"
                  >
                    {{ jornada.cerrada ? (procesando === 'reopen_' + jornada.id ? 'Reabriendo...' : 'Reabrir Jornada') : (procesando === 'close_' + jornada.id ? 'Cerrando...' : 'Cerrar Jornada') }}
                  </button>
                  <button
                    @click="eliminarJornada(jornada)"
                    :disabled="procesando !== null"
                    class="btn-delete-jornada"
                  >
                    {{ procesando === 'delete_' + jornada.id ? 'Eliminando...' : 'Eliminar Jornada' }}
                  </button>
                  <button 
                    @click="togglePartidos(jornada)" 
                    class="btn-view-matches"
                  >
                    {{ mostrandoPartidos[jornada.id] ? 'Ocultar Partidos' : 'Ver Partidos' }}
                  </button>
                </div>

                <div v-if="mostrandoPartidos[jornada.id]" class="matches-section">
                  <h4>Gestión de Resultados:</h4>
                  <div v-if="!partidosJornada[jornada.id]?.length" class="no-matches">
                    No hay partidos programados en esta jornada.
                  </div>
                  <div v-else class="matches-list">
                    <div v-for="partido in partidosJornada[jornada.id]" :key="partido.id" class="match-item-admin">
                      <div class="match-main">
                        <span class="m-players">{{ partido.jugador1?.Nombre }} {{ partido.jugador1?.Apellidos || '' }} vs {{ partido.jugador2?.Nombre }} {{ partido.jugador2?.Apellidos || '' }}</span>
                        <span class="m-meta">{{ new Date(partido.fecha).toLocaleDateString('es-ES') }} • {{ partido.hora ? partido.hora.substring(0, 5) : 'Por definir' }} • Pista {{ partido.pista || '?' }}</span>
                      </div>
                      
                      <div v-if="partido.estado !== 'Jugado' && formResultados[partido.id]" class="result-inputs">
                        <div class="set-row">
                          <span>S1</span>
                          <input type="number" v-model="formResultados[partido.id].s1_1" placeholder="0">
                          <input type="number" v-model="formResultados[partido.id].s1_2" placeholder="0">
                        </div>
                        <div class="set-row">
                          <span>S2</span>
                          <input type="number" v-model="formResultados[partido.id].s2_1" placeholder="0">
                          <input type="number" v-model="formResultados[partido.id].s2_2" placeholder="0">
                        </div>
                        <div class="set-row">
                          <span>S3</span>
                          <input type="number" v-model="formResultados[partido.id].s3_1" placeholder="0">
                          <input type="number" v-model="formResultados[partido.id].s3_2" placeholder="0">
                        </div>
                        <button @click="guardarResultado(partido)" class="btn-save-mini">Guardar</button>
                      </div>
                      <div v-else class="result-final">
                        Resultado: <span class="res-tag">{{ partido.resultado }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="resultados[jornada.id]" class="results-log">
                  <h4>Log de Asignación:</h4>
                  <template v-if="Array.isArray(resultados[jornada.id])">
                    <ul>
                      <li v-for="(log, idx) in resultados[jornada.id]" :key="idx">{{ log }}</li>
                    </ul>
                  </template>
                  <template v-else>
                    <p class="summary-message">{{ resultados[jornada.id].message || 'Proceso completado' }}</p>
                    <div class="summary-grid">
                      <div class="summary-item">
                        <span class="summary-label">Partidos</span>
                        <strong>{{ resultados[jornada.id].partidos ?? 0 }}</strong>
                      </div>
                      <div class="summary-item">
                        <span class="summary-label">Programados</span>
                        <strong>{{ resultados[jornada.id].programados ?? 0 }}</strong>
                      </div>
                      <div class="summary-item">
                        <span class="summary-label">Aplazados</span>
                        <strong>{{ resultados[jornada.id].aplazados ?? 0 }}</strong>
                      </div>
                    </div>
                    <div v-if="resultados[jornada.id].slotsUtilizados" class="slots-summary">
                      <h5>Franjas usadas</h5>
                      <ul>
                        <li v-for="(pistas, slot) in resultados[jornada.id].slotsUtilizados" :key="slot">
                          {{ slot }}: {{ pistas }} pista<span v-if="pistas !== 1">s</span>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { toast } from '../utils/toast';
import { useAuth } from '../utils/auth';

const { state } = useAuth();
const router = useRouter();

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const config = () => ({ headers: { Authorization: `Bearer ${state.jwt}` } });

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push('/socio-dashboard');
};

const jornadas = ref([]);
const divisiones = ref([]);
const busquedaDivision = ref('');
const cargando = ref(true);
const proyectando = ref(null);
const procesando = ref(null);
const resultados = reactive({});
const mostrandoPartidos = reactive({});
const partidosJornada = reactive({});
const formResultados = reactive({});
const cargandoPartidos = reactive({});

const getTemporadaNombre = (division) => division?.temporada?.Nombre || division?.temporada?.nombre || 'Sin temporada';

const normalizarTexto = (texto) => (texto || '').toString().trim().toLowerCase();

const divisionesFiltradas = computed(() => {
  const filtro = normalizarTexto(busquedaDivision.value);

  return [...divisiones.value]
    .filter((division) => {
      if (!filtro) return true;

      const nombre = normalizarTexto(division?.Nombre || division?.nombre);
      const temporada = normalizarTexto(getTemporadaNombre(division));

      return nombre.includes(filtro) || temporada.includes(filtro);
    })
    .sort((a, b) => {
      const temporadaA = normalizarTexto(getTemporadaNombre(a));
      const temporadaB = normalizarTexto(getTemporadaNombre(b));

      if (temporadaA !== temporadaB) {
        return temporadaA.localeCompare(temporadaB);
      }

      return normalizarTexto(a?.Nombre || a?.nombre).localeCompare(normalizarTexto(b?.Nombre || b?.nombre));
    });
});

const divisionesAgrupadas = computed(() => {
  const grupos = new Map();

  for (const division of divisionesFiltradas.value) {
    const temporadaNombre = getTemporadaNombre(division);
    const key = `${temporadaNombre}`;

    if (!grupos.has(key)) {
      grupos.set(key, { key, temporadaNombre, items: [] });
    }

    grupos.get(key).items.push(division);
  }

  return Array.from(grupos.values()).sort((a, b) => a.temporadaNombre.localeCompare(b.temporadaNombre));
});

const getDivisionNombre = (j) => j?.division?.Nombre || j?.division?.nombre || 'Sin división';

const jornadasAgrupadas = computed(() => {
  const map = new Map();

  for (const j of jornadas.value) {
    const divId = j?.division?.id ?? (j?.division?.documentId || 'no-div');
    const divNombre = getDivisionNombre(j);
    const temporadaNombre = j?.division?.temporada?.Nombre || 'Sin temporada';
    const key = `${divId}`;

    if (!map.has(key)) map.set(key, { key, divisionId: divId, divisionNombre: divNombre, temporadaNombre, items: [] });
    map.get(key).items.push(j);
  }

  // Optionally sort groups by division name
  return Array.from(map.values()).sort((a, b) => a.divisionNombre.localeCompare(b.divisionNombre));
});

const cargarJornadas = async () => {
  try {
    const res = await axios.get(`${apiUrl}/api/jornadas?limit=300`, config());
    const data = res.data.data || [];
    jornadas.value = [...data].sort((a, b) => {
      const divA = a?.division?.id ?? 0;
      const divB = b?.division?.id ?? 0;
      if (divA !== divB) return divA - divB;

      const numA = Number.isFinite(a?.Numero) ? a.Numero : Number.MAX_SAFE_INTEGER;
      const numB = Number.isFinite(b?.Numero) ? b.Numero : Number.MAX_SAFE_INTEGER;
      if (numA !== numB) return numA - numB;

      return (a?.id ?? 0) - (b?.id ?? 0);
    });
    
    const resDiv = await axios.get(`${apiUrl}/api/divisions`, config());
    divisiones.value = resDiv.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    cargando.value = false;
  }
};

const generarCalendarioDivision = async (division) => {
  if (procesando.value !== null) return;
  if (!confirm(`¿Deseas generar el calendario para ${division.Nombre}? Esto creará jornadas y partidos automáticamente.`)) return;
  
  procesando.value = 'div_' + division.id;
  try {
    const res = await axios.post(`${apiUrl}/api/divisions/${division.id}/generar-calendario`, {}, config());
    toast(`¡Éxito! ${res.data.message}. Se crearon ${res.data.jornadas} jornadas y ${res.data.partidos} partidos.`, 'success');
    await cargarJornadas();
  } catch (e) {
    console.error(e);
    const msg = e.response?.data?.error || e.response?.data?.message || '';
    toast(msg || 'Error al generar calendario.', 'error');
  } finally {
    procesando.value = null;
  }
};

const regenerarCalendarioDivision = async (division) => {
  if (procesando.value !== null) return;
  const confirmar = confirm(
    `Vas a borrar el calendario actual de ${division.Nombre} y generarlo de nuevo. Esta acción elimina jornadas y partidos de esa división. ¿Continuar?`
  );
  if (!confirmar) return;

  procesando.value = 'reset_' + division.id;
  try {
    const res = await axios.post(`${apiUrl}/api/divisions/${division.id}/regenerar-calendario`, {}, config());
    toast(`Calendario regenerado. Jornadas: ${res.data.jornadas}, partidos: ${res.data.partidos}.`, 'success');
    await cargarJornadas();
  } catch (e) {
    console.error(e);
    const msg = e.response?.data?.error || e.response?.data?.message || 'Error al regenerar calendario.';
    toast(msg, 'error');
  } finally {
    procesando.value = null;
  }
};

const lanzarAlgoritmo = async (jornada) => {
  if (!confirm(`¿Deseas ejecutar el algoritmo de asignación para la ${jornada.Nombre}? Esto modificará los partidos pendientes.`)) return;
  
  procesando.value = jornada.id;
  try {
    const res = await axios.post(`${apiUrl}/api/jornadas/${jornada.id}/schedule`, {}, config());
    resultados[jornada.id] = res.data.data;
    toast('Proceso completado. Revisa los logs en la tarjeta.', 'success');
  } catch (e) {
    console.error(e);
    toast('Error al ejecutar el algoritmo.', 'error');
  } finally {
    procesando.value = null;
  }
};

const cargarPartidosDeJornada = async (jornadaId) => {
  if (cargandoPartidos[jornadaId]) return;
  cargandoPartidos[jornadaId] = true;
  try {
    const res = await axios.get(`${apiUrl}/api/jornadas/${jornadaId}/partidos`, config());
    partidosJornada[jornadaId] = res.data;
    
    // Inicializar formularios
    res.data.forEach(p => {
      if (!formResultados[p.id]) {
        formResultados[p.id] = {
          s1_1: null, s1_2: null,
          s2_1: null, s2_2: null,
          s3_1: null, s3_2: null
        };
      }
    });
  } catch (e) {
    console.error(e);
    toast('Error al cargar los partidos.', 'error');
  } finally {
    cargandoPartidos[jornadaId] = false;
  }
};

const cargarJornadaCompleta = async (jornadaId) => {
  const res = await axios.get(`${apiUrl}/api/jornadas/${jornadaId}`, config());
  return res.data.data;
};

const togglePartidos = async (jornada) => {
  const docId = jornada.id;
  if (mostrandoPartidos[docId]) {
    mostrandoPartidos[docId] = false;
    return;
  }

  await cargarPartidosDeJornada(docId);
  mostrandoPartidos[docId] = true;
};

const guardarResultado = async (partido) => {
  const f = formResultados[partido.id];
  if (f.s1_1 === null || f.s1_2 === null) {
    toast('Introduce al menos el resultado del primer set.', 'warning');
    return;
  }

  const resStr = `${f.s1_1}-${f.s1_2}${f.s2_1 !== null ? ', ' + f.s2_1 + '-' + f.s2_2 : ''}${f.s3_1 !== null ? ', ' + f.s3_1 + '-' + f.s3_2 : ''}`;

  if (!confirm(`¿Confirmar resultado ${resStr} para el partido ${partido.jugador1?.Nombre} vs ${partido.jugador2?.Nombre}?`)) return;

  try {
    await axios.put(`${apiUrl}/api/partidos/${partido.id}/resultado`, {
      resultado: resStr
    }, config());

    toast('Resultado guardado correctamente.', 'success');
    // Recargar partidos de la jornada
    const jornadaId = Object.keys(partidosJornada).find(jid => partidosJornada[jid].some(p => p.id === partido.id));
    if (jornadaId) {
      await cargarPartidosDeJornada(Number(jornadaId));
      mostrandoPartidos[jornadaId] = true;
    }
  } catch (e) {
    console.error(e);
    toast('Error al guardar el resultado.', 'error');
  }
};

const toggleCierreJornada = async (jornada) => {
  if (jornada.cerrada) {
    if (!confirm(`¿Reabrir ${jornada.Nombre}? Volverá a aceptar disponibilidades.`)) return;

    procesando.value = 'reopen_' + jornada.id;
    try {
      const completa = await cargarJornadaCompleta(jornada.id);
      completa.disponibilidadCerrada = false;
      const res = await axios.put(`${apiUrl}/api/jornadas/${jornada.id}`, completa, config());
      toast(`Jornada reabierta: ${res.data?.data?.Nombre || jornada.Nombre}.`, 'success');
      await cargarJornadas();
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.error || e.response?.data?.message || 'No se pudo reabrir la jornada.';
      toast(msg, 'error');
    } finally {
      procesando.value = null;
    }
    return;
  }

  if (!confirm(`¿Confirmas cerrar ${jornada.Nombre}? Solo se cerrará si todos sus partidos están en estado Jugado o Aplazado.`)) return;

  procesando.value = 'close_' + jornada.id;
  try {
    const res = await axios.post(`${apiUrl}/api/jornadas/${jornada.id}/close`, {}, config());
    const data = res.data?.data || {};

    await cargarJornadas();

    if (data.nextJornada?.id) {
      const nextId = data.nextJornada.id;
      await cargarPartidosDeJornada(nextId);
      mostrandoPartidos[nextId] = true;
      resultados[nextId] = {
        message: `Jornada cerrada. Siguiente jornada activa: ${data.nextJornada.nombre}`,
        partidos: data.total ?? 0,
        programados: data.jugados ?? 0,
        aplazados: data.aplazados ?? 0,
        slotsUtilizados: {}
      };
      toast(`Jornada cerrada y clasificación actualizada. Siguiente: ${data.nextJornada.nombre}`, 'success');
      return;
    }

    toast('Jornada cerrada y clasificación actualizada. No hay más jornadas siguientes.', 'success');
  } catch (e) {
    console.error(e);
    const msg = e.response?.data?.error || e.response?.data?.message || 'No se pudo cerrar la jornada.';
    toast(msg, 'error');
  } finally {
    procesando.value = null;
  }
};

const eliminarJornada = async (jornada) => {
  if (procesando.value !== null) return;

  const confirmar = confirm(
    `Vas a eliminar ${jornada.Nombre}. Esto borrará también sus partidos y disponibilidades asociadas. ¿Continuar?`
  );
  if (!confirmar) return;

  procesando.value = 'delete_' + jornada.id;
  try {
    await axios.delete(`${apiUrl}/api/jornadas/${jornada.id}`, config());

    delete mostrandoPartidos[jornada.id];
    delete partidosJornada[jornada.id];
    delete resultados[jornada.id];
    delete formResultados[jornada.id];

    toast(`Jornada eliminada: ${jornada.Nombre}.`, 'success');
    await cargarJornadas();
  } catch (e) {
    console.error(e);
    const msg = e.response?.data?.error || e.response?.data?.message || 'No se pudo eliminar la jornada.';
    toast(msg, 'error');
  } finally {
    procesando.value = null;
  }
};

onMounted(cargarJornadas);
</script>

<style scoped>
.admin-gestion-page { padding-bottom: 80px; }

.hero-section {
  background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('/fotos-tenis/photo-1558365849-6ebd8b0454b2.avif');
  background-position: center 40%;
  background-size: cover;
  background-position: center center;
  padding: 60px 20px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
  border-radius: 0 0 28px 28px;
  overflow: hidden;
}

.mini-tag {
  background: #ff3c3c;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 15px;
  display: inline-block;
}

.hero-section .hero-content h1,
.hero-section .hero-content .hero-lead,
.hero-section .hero-content .mini-tag,
.hero-section .hero-content p {
  color: #fff !important;
}

.container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }

.admin-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.section-lead {
  margin: 0;
  color: #9a9a9a;
  font-size: 0.95rem;
}

.section-counter {
  color: var(--ball);
  background: rgba(199, 255, 52, 0.08);
  border: 1px solid rgba(199, 255, 52, 0.18);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.division-toolbar {
  margin-bottom: 18px;
}

.division-search {
  width: 100%;
  max-width: 420px;
  background: #111;
  border: 1px solid rgba(255,255,255,0.12);
  color: white;
  padding: 12px 14px;
  border-radius: 10px;
  outline: none;
}

.division-search:focus {
  border-color: var(--ball);
  box-shadow: 0 0 0 3px rgba(199, 255, 52, 0.12);
}

.empty-search-state {
  color: #bbb;
  background: rgba(255,255,255,0.04);
  border: 1px dashed rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 18px;
  margin-top: 8px;
}

.division-group-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.division-group-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 18px;
}

.table-wrap {
  overflow-x: auto;
}

.divisions-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

.divisions-table thead th {
  text-align: left;
  color: #b8b8b8;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.divisions-table tbody td {
  padding: 14px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  vertical-align: middle;
}

.divisions-table tbody tr:last-child td {
  border-bottom: none;
}

.table-primary {
  color: white;
  font-weight: 800;
}

.table-secondary {
  margin-top: 4px;
  font-size: 0.82rem;
  color: #8f8f8f;
}

.table-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-table {
  padding: 10px 16px;
  border-radius: 8px;
}

.division-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.division-group-header h3 {
  margin: 0 0 4px;
  color: white;
}

.division-group-header p {
  margin: 0;
  color: #8a8a8a;
  font-size: 0.9rem;
}

.division-card {
  background: #161616;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.jornada-admin-card.compact {
  padding: 16px;
  border-radius: 10px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.jornada-division-label {
  font-size: 0.85rem;
  font-weight: 800;
  color: #cfe79a;
  margin-bottom: 6px;
}

.small-meta { font-size: 0.8rem; color: #9a9a9a; margin: 4px 0; }

.division-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 6px;
}

.division-tag {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--ball);
  background: rgba(199, 255, 52, 0.08);
  border: 1px solid rgba(199, 255, 52, 0.2);
}

.division-tag-alt {
  color: #e0e0e0;
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.12);
}

.jornada-admin-card {
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 25px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: center;
}

.card-info h3 { color: var(--ball); margin-bottom: 5px; }
.card-info .meta { color: #888; font-size: 0.9rem; }

.jornada-admin-card.compact .card-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.jornada-admin-card.compact .card-actions .btn-algorithm,
.jornada-admin-card.compact .card-actions .btn-close-jornada,
.jornada-admin-card.compact .card-actions .btn-delete-jornada,
.jornada-admin-card.compact .card-actions .btn-view-matches {
  width: 100%;
}

.jornada-admin-card.compact .matches-section,
.jornada-admin-card.compact .results-log {
  grid-column: auto;
}

.badge-estado {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid transparent;
}

.badge-estado.cerrada {
  background: rgba(56, 166, 85, 0.2);
  color: #9be9a8;
  border-color: rgba(56, 166, 85, 0.5);
}

.badge-estado.abierta {
  background: rgba(255, 193, 7, 0.15);
  color: #ffd666;
  border-color: rgba(255, 193, 7, 0.45);
}

.btn-algorithm {
  background: #fff;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-algorithm:hover {
  background: var(--ball);
}

.results-log {
  grid-column: auto;
  background: #000;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.85rem;
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid #333;
  width: 100%;
}

.results-log h4 { color: #666; margin-bottom: 10px; }
.results-log ul { list-style: none; color: #0f0; }

.summary-message {
  margin: 0 0 12px;
  color: #ddd;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.summary-item {
  background: #111;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #888;
}

.slots-summary h5 {
  margin: 0 0 8px;
  color: var(--ball);
}

.slots-summary ul {
  margin: 0;
  padding-left: 18px;
  color: #ddd;
}

.btn-view-matches {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset {
  background: #451111;
  color: #ffdede;
  border: 1px solid #a33;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: #5b1515;
}

.btn-close-jornada {
  background: #173f1a;
  color: #dcffe0;
  border: 1px solid #2d7b34;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close-jornada:hover {
  background: #1e5522;
}

.btn-delete-jornada {
  background: #5b1717;
  color: #ffd9d9;
  border: 1px solid #a83a3a;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete-jornada:hover {
  background: #7a1e1e;
}

.btn-view-matches:hover {
  background: rgba(255,255,255,0.2);
}

.matches-section {
  grid-column: auto;
  border-top: 1px solid #333;
  padding-top: 20px;
  width: 100%;
}

.matches-section h4 { margin-bottom: 15px; color: #888; }

.match-item-admin {
  background: #000;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.match-main { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; }
.m-players { font-weight: 700; color: #fff; }
.m-meta { font-size: 0.8rem; color: #555; }

.result-inputs {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.set-row {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #111;
  padding: 5px 10px;
  border-radius: 6px;
}

.set-row span { font-size: 0.7rem; color: #666; font-weight: 800; }

.set-row input {
  width: 35px;
  background: transparent;
  border: 1px solid #333;
  color: var(--ball);
  text-align: center;
  padding: 4px;
  border-radius: 4px;
  font-weight: 800;
}

.btn-save-mini {
  background: var(--ball);
  color: var(--ink);
  border: none;
  padding: 6px 15px;
  border-radius: 5px;
  font-weight: 700;
  cursor: pointer;
}

.res-tag {
  color: var(--ball);
  font-weight: 800;
  font-family: monospace;
  background: rgba(199, 255, 52, 0.1);
  padding: 4px 10px;
  border-radius: 4px;
}
</style>
