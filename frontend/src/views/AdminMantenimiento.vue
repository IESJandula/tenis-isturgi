<template>
  <div class="admin-mantenimiento-page fade-in">
    <section class="hero-section">
      <div class="hero-content">
        <span class="mini-tag">Mantenimiento Global</span>
        <h1>Gestión de Contenidos</h1>
        <p class="hero-lead">Crea y modifica torneos, noticias y perfiles de socios.</p>
        <button type="button" class="btn-algorithm" style="text-decoration: none; display: inline-block;" @click="goBack">Ir a Mi Panel</button>
      </div>
    </section>

    <div class="container main-content">
      <!-- TABS -->
      <div class="tabs-container">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-btn" 
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- CONTENIDO DE LAS TABS -->
      <div class="tab-content glass-card">
        
        <!-- ESTADO DE CARGA -->
        <div v-if="cargando" class="loading-state">
          <div class="spinner"></div>
          <p>Obteniendo datos de {{ activeTabLabel }}...</p>
        </div>

        <div v-else>
          <!-- HEADER DE LA SECCIÓN -->
          <div class="section-header">
            <h2>Gestión de {{ activeTabLabel }}</h2>
            <button @click="abrirNuevo" class="btn-primary">+ Nuevo {{ activeTabSingular }}</button>
          </div>

          <!-- LISTADO -->
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr v-if="activeTab === 'torneos'">
                  <th>Nombre</th>
                  <th>Fecha Inicio</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
                <tr v-if="activeTab === 'noticias'">
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
                <tr v-if="activeTab === 'jugadores'">
                  <th>Socio #</th>
                  <th>Nombre</th>
                  <th>Nivel</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
                <tr v-if="activeTab === 'temporadas'">
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
                <tr v-if="activeTab === 'divisiones'">
                  <th>Nombre</th>
                  <th>Temporada</th>
                  <th>Acciones</th>
                </tr>
                <tr v-if="activeTab === 'galeria'">
                  <th>Miniatura</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <!-- COLUMNAS TORNEOS -->
                  <template v-if="activeTab === 'torneos'">
                    <td><strong>{{ item.Nombre }}</strong></td>
                    <td>{{ item.FechaInicio ? new Date(item.FechaInicio).toLocaleDateString() : 'N/A' }}</td>
                    <td>{{ item.Categoria }}</td>
                  </template>
                  
                  <!-- COLUMNAS NOTICIAS -->
                  <template v-if="activeTab === 'noticias'">
                    <td><strong>{{ item.Titulo }}</strong></td>
                    <td>{{ new Date(item.Fecha).toLocaleDateString() }}</td>
                  </template>

                  <!-- COLUMNAS JUGADORES -->
                  <template v-if="activeTab === 'jugadores'">
                    <td><span class="badge">{{ item.NumeroSocio || 'N/A' }}</span></td>
                    <td><strong>{{ item.Nombre }} {{ item.Apellidos }}</strong></td>
                    <td><span class="tag-nivel">{{ item.Nivel || 'Sin nivel' }}</span></td>
                    <td>{{ item.Email }}</td>
                  </template>

                  <!-- COLUMNAS TEMPORADAS -->
                  <template v-if="activeTab === 'temporadas'">
                    <td><strong>{{ item.Nombre }}</strong></td>
                  </template>

                  <!-- COLUMNAS DIVISIONES -->
                  <template v-if="activeTab === 'divisiones'">
                    <td><strong>{{ item.Nombre }}</strong></td>
                    <td>{{ item.temporada?.Nombre || item.temporada?.nombre || 'Sin temporada' }}</td>
                  </template>

                  <!-- COLUMNAS GALERIA -->
                  <template v-if="activeTab === 'galeria'">
                    <td>
                      <img :src="item.src" class="mini-preview" @error="(e) => e.target.src = '/logo-isturgi.jpg'">
                    </td>
                    <td><strong>{{ item.titulo }}</strong></td>
                    <td>{{ item.categoria }}</td>
                  </template>

                  <td class="actions-td">
                    <button @click="editarItem(item)" class="btn-icon" title="Editar">✏️</button>
                    <button @click="eliminarItem(item)" class="btn-icon del" title="Eliminar">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="items.length === 0" class="empty-msg">No hay registros encontrados.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE EDICIÓN/CREACIÓN -->
    <div v-if="showModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content glass-card slide-up">
        <h3>{{ editandoId ? 'Editar' : 'Nuevo' }} {{ activeTabSingular }}</h3>
        
        <form @submit.prevent="guardarItem" class="admin-form" novalidate>
          <!-- CAMPOS TORNEO -->
          <template v-if="activeTab === 'torneos'">
            <div class="form-group">
              <label>Nombre del Torneo *</label>
              <input v-model="form.Nombre" required placeholder="Ej: Open Verano 2024">
              <p v-if="formErrors.Nombre" class="field-error">{{ formErrors.Nombre }}</p>
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="form.Categoria" required>
                <option value="Torneo">Torneo</option>
                <option value="Liga">Liga</option>
                <option value="Evento especial">Evento especial</option>
                <option value="Escuela">Escuela</option>
              </select>
              <p v-if="formErrors.Categoria" class="field-error">{{ formErrors.Categoria }}</p>
            </div>
            <div class="form-group">
              <label>Edición</label>
              <input v-model="form.Edicion" placeholder="Ej: I, II, 2024...">
            </div>
            <div class="form-group grid-2">
              <div>
                <label>Fecha Inicio</label>
                <input type="date" v-model="form.FechaInicio">
              </div>
              <div>
                <label>Fecha Fin</label>
                <input type="date" v-model="form.FechaFin">
              </div>
            </div>
            <div class="form-group">
              <label>Descripción Breve</label>
              <input v-model="form.Descripcion_breve">
            </div>
            <div class="form-group">
              <label>Detalle (Rich Text)</label>
              <textarea v-model="form.Descripcion" rows="4"></textarea>
            </div>
            <!-- IMAGEN TORNEO -->
            <div class="form-group">
              <label>Cartel / Imagen</label>
              <div class="input-with-preview">
                <input type="file" accept="image/*" @change="onAdminFileChange($event, 'Cartel')">
                <div v-if="form.Cartel" class="image-preview-box">
                  <img :src="form.Cartel" @error="(e) => e.target.style.display = 'none'" @load="(e) => e.target.style.display = 'block'">
                </div>
              </div>
            </div>
            <!-- CAMPOS EXTRA TORNEO -->
            <div class="form-grid-3">
              <div class="form-group">
                <label>Modalidad</label>
                <input v-model="form.Modalidad" placeholder="Individual/Dobles">
              </div>
              <div class="form-group">
                <label>Participación</label>
                <input v-model="form.TipoParticipacion" placeholder="Abierto/Socios">
              </div>
              <div class="form-group">
                <label>Nivel</label>
                <input v-model="form.NivelRequerido">
              </div>
            </div>
            <div class="form-group">
              <label>Premios</label>
              <input v-model="form.Premios">
            </div>
            <div class="form-group">
              <label>Patrocinador</label>
              <input v-model="form.Patrocinador">
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" v-model="form.Puntuable" id="puntuable">
              <label for="puntuable">¿Es puntuable para el ranking?</label>
            </div>
          </template>

          <!-- CAMPOS NOTICIA -->
          <template v-if="activeTab === 'noticias'">
            <div class="form-group">
              <label>Título *</label>
              <input v-model="form.Titulo" required>
              <p v-if="formErrors.Titulo" class="field-error">{{ formErrors.Titulo }}</p>
            </div>
            <div class="form-group">
              <label>Resumen</label>
              <textarea v-model="form.Resumen" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>Cuerpo / Descripción *</label>
              <textarea v-model="form.Descripcion" rows="6" required></textarea>
              <p v-if="formErrors.Descripcion" class="field-error">{{ formErrors.Descripcion }}</p>
            </div>
            <!-- IMAGEN NOTICIA -->
            <div class="form-group">
              <label>Imagen</label>
              <div class="input-with-preview">
                <input type="file" accept="image/*" @change="onAdminFileChange($event, 'Imagen')">
                <div v-if="form.Imagen" class="image-preview-box">
                  <img :src="form.Imagen" @error="(e) => e.target.style.display = 'none'" @load="(e) => e.target.style.display = 'block'">
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Fecha</label>
              <input type="date" v-model="form.Fecha">
            </div>
          </template>

          <!-- CAMPOS JUGADOR -->
          <template v-if="activeTab === 'jugadores'">
            <div class="form-group grid-2">
              <div>
                <label>Nombre *</label>
                <input v-model="form.Nombre" required>
                <p v-if="playerErrors.Nombre" class="field-error">{{ playerErrors.Nombre }}</p>
              </div>
              <div>
                <label>Apellidos *</label>
                <input v-model="form.Apellidos" required>
                <p v-if="playerErrors.Apellidos" class="field-error">{{ playerErrors.Apellidos }}</p>
              </div>
            </div>
            <div class="form-group grid-2">
              <div>
                <label>Email *</label>
                <input v-model="form.Email" required type="email">
                <p v-if="playerErrors.Email" class="field-error">{{ playerErrors.Email }}</p>
              </div>
              <div>
                <label>Teléfono *</label>
                <input v-model="form.Telefono" required maxlength="9" placeholder="Ej: 123456789">
                <p v-if="playerErrors.Telefono" class="field-error">{{ playerErrors.Telefono }}</p>
              </div>
            </div>
            <div class="form-group grid-2">
              <div>
                <label>Contraseña de acceso <span v-if="!editandoId">*</span></label>
                <input v-model="form.Contrasena" :required="!editandoId" minlength="6" type="password" placeholder="Necesaria para iniciar sesión en Firebase" autocomplete="new-password">
                <p v-if="playerErrors.Contrasena" class="field-error">{{ playerErrors.Contrasena }}</p>
              </div>
              <div>
                <label>Confirmación <span v-if="!editandoId || form.Contrasena">*</span></label>
                <input v-model="form.ConfirmarContrasena" :required="!editandoId || !!form.Contrasena" type="password" placeholder="Repite la contraseña" autocomplete="new-password">
                <p v-if="playerErrors.ConfirmarContrasena" class="field-error">{{ playerErrors.ConfirmarContrasena }}</p>
              </div>
            </div>
            <div class="form-group grid-2">
              <div>
                <label>Número de Socio *</label>
                <input v-model="form.NumeroSocio" required placeholder="Ej: 001">
                <p v-if="playerErrors.NumeroSocio" class="field-error">{{ playerErrors.NumeroSocio }}</p>
              </div>
              <div>
                <label>Fecha Nacimiento *</label>
                <input type="date" v-model="form.FechaNacimiento" required>
                <p v-if="playerErrors.FechaNacimiento" class="field-error">{{ playerErrors.FechaNacimiento }}</p>
              </div>
            </div>
            <div class="form-group grid-2">
              <div>
                <label>Nivel *</label>
                <select v-model="form.Nivel" required>
                  <option value="Iniciado">Iniciado</option>
                  <option value="Medio">Medio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Pro">Pro</option>
                </select>
                <p v-if="playerErrors.Nivel" class="field-error">{{ playerErrors.Nivel }}</p>
              </div>
              <div>
                <label>Categoría *</label>
                <select v-model="form.Categoria" required>
                  <option value="">Selecciona una categoría</option>
                  <option value="Absoluto">Absoluto</option>
                  <option value="Juvenil">Juvenil</option>
                  <option value="Infantil">Infantil</option>
                  <option value="Veterano">Veterano</option>
                  <option value="Senior">Senior</option>
                </select>
                <p v-if="playerErrors.Categoria" class="field-error">{{ playerErrors.Categoria }}</p>
              </div>
            </div>
            <div class="form-group">
              <label>Puntos de Ranking</label>
              <input type="number" v-model="form.Puntos">
            </div>
            <div class="form-group">
              <label>Foto de Perfil</label>
              <div class="input-with-preview">
                <input type="file" accept="image/*" @change="onAdminFileChange($event, 'Foto')">
                <div v-if="form.Foto" class="image-preview-box">
                  <img :src="form.Foto" @error="(e) => e.target.style.display = 'none'" @load="(e) => e.target.style.display = 'block'">
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>División *</label>
              <select v-model="form.divisionId" required>
                <option value="" disabled>Selecciona una división</option>
                <option v-for="div in divisionesCompatibles" :key="div.id" :value="div.id">
                  {{ div.Nombre }} ({{ div.Categoria }} - {{ div.Nivel }})
                </option>
              </select>
              <p v-if="!divisionesCompatibles.length" class="field-error">
                ⚠️ No hay divisiones disponibles.
              </p>
              <p v-if="playerErrors.divisionId" class="field-error">{{ playerErrors.divisionId }}</p>
            </div>
          </template>

          <!-- CAMPOS TEMPORADA -->
          <template v-if="activeTab === 'temporadas'">
            <div class="form-group">
              <label>Nombre de la Temporada *</label>
              <input v-model="form.Nombre" required placeholder="Ej: Temporada 2026">
              <p v-if="formErrors.Nombre" class="field-error">{{ formErrors.Nombre }}</p>
            </div>
          </template>

          <!-- CAMPOS DIVISION -->
          <template v-if="activeTab === 'divisiones'">
            <div class="form-group">
              <label>Nombre de la División *</label>
              <input v-model="form.Nombre" required placeholder="Ej: División A">
              <p v-if="formErrors.Nombre" class="field-error">{{ formErrors.Nombre }}</p>
            </div>
            <div class="form-group">
              <label>Temporada *</label>
              <select v-model="form.temporadaId" required>
                <option value="" disabled>Selecciona una temporada</option>
                <option v-for="temporada in temporadas" :key="temporada.id" :value="temporada.id">
                  {{ temporada.Nombre || temporada.nombre || `Temporada ${temporada.id}` }}
                </option>
              </select>
              <p v-if="formErrors.temporadaId" class="field-error">{{ formErrors.temporadaId }}</p>
            </div>
          </template>

          <!-- CAMPOS GALERIA -->
          <template v-if="activeTab === 'galeria'">
            <div class="form-group">
              <label>Título de la foto *</label>
              <input v-model="form.titulo" required>
              <p v-if="formErrors.titulo" class="field-error">{{ formErrors.titulo }}</p>
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="form.categoria" required>
                <option v-for="c in ['Pistas', 'Escuela', 'Liga', 'Torneos', 'Club', 'Eventos']" :key="c" :value="c">{{ c }}</option>
              </select>
              <p v-if="formErrors.categoria" class="field-error">{{ formErrors.categoria }}</p>
            </div>
            <div class="form-group">
              <label>Descripción / Texto</label>
              <input v-model="form.texto">
            </div>
            <div class="form-group">
              <label>Imagen *</label>
              <div class="input-with-preview">
                <input type="file" accept="image/*" @change="onAdminFileChange($event, 'src')">
                <div v-if="form.src" class="image-preview-box">
                  <img :src="form.src" @error="(e) => e.target.style.display = 'none'" @load="(e) => e.target.style.display = 'block'">
                </div>
              </div>
              <p v-if="formErrors.src" class="field-error">{{ formErrors.src }}</p>
            </div>
          </template>

          <div class="modal-actions">
            <button type="button" @click="cerrarModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Confirmar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, reactive } from 'vue';
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

const activeTab = ref('torneos');
const tabs = [
  { id: 'torneos', label: 'Torneos', singular: 'Torneo', endpoint: 'torneos' },
  { id: 'noticias', label: 'Noticias', singular: 'Noticia', endpoint: 'noticias' },
  { id: 'jugadores', label: 'Jugadores', singular: 'Jugador', endpoint: 'jugadors' },
  { id: 'temporadas', label: 'Temporadas', singular: 'Temporada', endpoint: 'temporadas' },
  { id: 'divisiones', label: 'Divisiones', singular: 'División', endpoint: 'divisions' },
  { id: 'galeria', label: 'Galería', singular: 'Foto', endpoint: 'galeria' }
];

const items = ref([]);
const temporadas = ref([]);
const divisiones = ref([]);
const cargando = ref(false);
const guardando = ref(false);
const formErrors = reactive({});
const playerErrors = reactive({});
const showModal = ref(false);
const editandoId = ref(null);
const form = reactive({});
const selectedFiles = reactive({});

const onAdminFileChange = (e, field) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  selectedFiles[field] = file;
};

const activeTabLabel = computed(() => tabs.find(t => t.id === activeTab.value)?.label);
const activeTabSingular = computed(() => tabs.find(t => t.id === activeTab.value)?.singular);
const activeEndpoint = computed(() => tabs.find(t => t.id === activeTab.value)?.endpoint);

const divisionesCompatibles = computed(() => {
  return divisiones.value;
});

const normalizeMediaUrl = (url) => {
  if (typeof url !== 'string' || !url.startsWith('/')) return url;
  return `${apiUrl.replace(/\/$/, '')}${url}`;
};

const cargarDatos = async () => {
  // Esperar a que el estado de auth esté inicializado y haya un token válido
  if (!state.initialized) return;
  if (!state.jwt) return;
  cargando.value = true;
  try {
    const res = await axios.get(`${apiUrl}/api/${activeEndpoint.value}?sort=createdAt:desc`, config());
    const loadedItems = res.data.data || [];
    items.value = activeTab.value === 'galeria'
      ? loadedItems.map((item) => ({
          ...item,
          src: normalizeMediaUrl(item.src),
        }))
      : loadedItems;

    if (activeTab.value === 'divisiones') {
      try {
        const resTemporadas = await axios.get(`${apiUrl}/api/temporadas?sort=createdAt:desc`, config());
        temporadas.value = resTemporadas.data.data || [];
      } catch (e) {
        console.warn('No se pudieron cargar las temporadas:', e);
        temporadas.value = [];
      }
    }

    if (activeTab.value === 'jugadores') {
      try {
        const resDivisiones = await axios.get(`${apiUrl}/api/divisions?sort=createdAt:desc`, config());
        divisiones.value = resDivisiones.data.data || [];
      } catch (e) {
        console.warn('No se pudieron cargar las divisiones:', e);
        divisiones.value = [];
      }
    }
  } catch (error) {
    console.error('Error cargando datos de administración:', error);
    let serverMsg = error.response?.data?.error?.message || error.response?.data?.message || error.response?.data || error.message || 'Error desconocido';
    if (typeof serverMsg === 'object') {
      try { serverMsg = JSON.stringify(serverMsg); } catch (e) { serverMsg = String(serverMsg); }
    }
    // Si es 401/403, dar indicación útil
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast('No autorizado: ' + serverMsg + '. Comprueba que tu usuario es administrador.', 'error');
    } else {
      toast('Error cargando datos: ' + serverMsg, 'error');
    }
  } finally {
    cargando.value = false;
  }
};

const abrirNuevo = () => {
  editandoId.value = null;
  Object.keys(form).forEach(k => delete form[k]);
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
  Object.keys(playerErrors).forEach(k => delete playerErrors[k]);
  
  if (activeTab.value === 'noticias') {
    form.Fecha = new Date().toISOString();
    form.Titulo = '';
    form.Descripcion = '';
  } else if (activeTab.value === 'torneos') {
    form.Nombre = '';
    form.Categoria = 'Torneo';
    form.FechaInicio = new Date().toISOString().substring(0, 10);
    form.Descripcion_breve = '';
    form.Descripcion = '';
    form.Estado = 'Próximamente';
  } else if (activeTab.value === 'jugadores') {
    form.Nombre = '';
    form.Apellidos = '';
    form.Email = '';
    form.Telefono = '';
    form.Contrasena = '';
    form.ConfirmarContrasena = '';
    form.NumeroSocio = '';
    form.Categoria = 'Absoluto';
    form.Nivel = 'Medio';
    form.Puntos = 0;
    form.Foto = '';
    form.divisionId = divisiones.value.length ? divisiones.value[0].id : '';
  } else if (activeTab.value === 'temporadas') {
    form.Nombre = '';
  } else if (activeTab.value === 'divisiones') {
    form.Nombre = '';
    form.temporadaId = temporadas.value.length ? temporadas.value[0].id : '';
  } else if (activeTab.value === 'galeria') {
    form.titulo = '';
    form.categoria = 'Club';
    form.texto = '';
    form.src = '';
  }
  showModal.value = true;
};

const editarItem = (item) => {
  editandoId.value = item.id || item.documentId;
  Object.keys(form).forEach(k => delete form[k]);
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
  Object.keys(playerErrors).forEach(k => delete playerErrors[k]);
  Object.assign(form, item);
  
  // Ajustar fechas para inputs date
  if (form.Fecha) form.Fecha = new Date(form.Fecha).toISOString().substring(0, 10);
  if (form.FechaInicio) form.FechaInicio = new Date(form.FechaInicio).toISOString().substring(0, 10);
  if (form.FechaFin) form.FechaFin = new Date(form.FechaFin).toISOString().substring(0, 10);
  if (form.FechaNacimiento) form.FechaNacimiento = new Date(form.FechaNacimiento).toISOString().substring(0, 10);
  if (form.temporada?.id && !form.temporadaId) form.temporadaId = form.temporada.id;
  if (form.division?.id && !form.divisionId) form.divisionId = form.division.id;
  if (activeTab.value === 'jugadores') form.ConfirmarContrasena = '';
  
  showModal.value = true;
};

const cerrarModal = () => {
  showModal.value = false;
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
  Object.keys(playerErrors).forEach(k => delete playerErrors[k]);
};

const setFormError = (field, message) => {
  formErrors[field] = message;
};

const clearFormErrors = () => {
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
};

const setPlayerError = (field, message) => {
  playerErrors[field] = message;
};

const clearPlayerErrors = () => {
  Object.keys(playerErrors).forEach(k => delete playerErrors[k]);
};

const validatePlayerForm = (payload) => {
  clearPlayerErrors();

  if (!payload.Nombre?.trim()) setPlayerError('Nombre', 'El nombre es obligatorio');
  if (!payload.Apellidos?.trim()) setPlayerError('Apellidos', 'Los apellidos son obligatorios');
  if (!payload.Email?.trim()) setPlayerError('Email', 'El email es obligatorio');
  if (!payload.Telefono?.trim()) setPlayerError('Telefono', 'El teléfono es obligatorio');
  else if (payload.Telefono.replace(/\D/g, '').length !== 9) setPlayerError('Telefono', 'El teléfono debe tener exactamente 9 dígitos');
  if (!payload.NumeroSocio?.trim()) setPlayerError('NumeroSocio', 'El número de socio es obligatorio');
  if (!payload.FechaNacimiento?.trim()) setPlayerError('FechaNacimiento', 'La fecha de nacimiento es obligatoria');
  if (!payload.Nivel?.trim()) setPlayerError('Nivel', 'El nivel es obligatorio');
  if (!payload.Categoria?.trim()) setPlayerError('Categoria', 'La categoría es obligatoria');
  if (!payload.division?.id) setPlayerError('divisionId', 'Debes seleccionar una división');

  if (!editandoId.value && !payload.Contrasena) {
    setPlayerError('Contrasena', 'La contraseña es obligatoria para crear el jugador');
  } else if (payload.Contrasena && payload.Contrasena.length < 6) {
    setPlayerError('Contrasena', 'La contraseña debe tener al menos 6 caracteres');
  }

  if (payload.Contrasena || payload.ConfirmarContrasena) {
    if (!payload.ConfirmarContrasena) {
      setPlayerError('ConfirmarContrasena', 'Debes confirmar la contraseña');
    } else if (payload.Contrasena !== payload.ConfirmarContrasena) {
      setPlayerError('ConfirmarContrasena', 'La contraseña y su confirmación no coinciden');
    }
  }

  return Object.keys(playerErrors).length === 0;
};

const validateNonPlayerForm = (payload) => {
  clearFormErrors();

  if (activeTab.value === 'torneos') {
    if (!payload.Nombre?.trim()) setFormError('Nombre', 'El nombre del torneo es obligatorio');
    if (!payload.Categoria?.trim()) setFormError('Categoria', 'La categoría es obligatoria');
  } else if (activeTab.value === 'noticias') {
    if (!payload.Titulo?.trim()) setFormError('Titulo', 'El título es obligatorio');
    if (!payload.Descripcion?.trim()) setFormError('Descripcion', 'La descripción es obligatoria');
  } else if (activeTab.value === 'temporadas') {
    if (!payload.Nombre?.trim()) setFormError('Nombre', 'El nombre de la temporada es obligatorio');
  } else if (activeTab.value === 'divisiones') {
    if (!payload.Nombre?.trim()) setFormError('Nombre', 'El nombre de la división es obligatorio');
    if (!payload.temporada?.id) setFormError('temporadaId', 'Debes seleccionar una temporada');
  } else if (activeTab.value === 'galeria') {
    if (!payload.titulo?.trim()) setFormError('titulo', 'El título es obligatorio');
    if (!payload.categoria?.trim()) setFormError('categoria', 'La categoría es obligatoria');
    if (!payload.src?.trim()) setFormError('src', 'La URL de la imagen es obligatoria');
  }

  return Object.keys(formErrors).length === 0;
};

const guardarItem = async () => {
  guardando.value = true;
  try {
    // Si hay archivos seleccionados, subirlos primero
    const uploadsMap = {};
    for (const key of Object.keys(selectedFiles)) {
      const file = selectedFiles[key];
      if (!file) continue;
      const fd = new FormData();
      // Strapi /upload expects the field name 'files' (and returns different shapes depending on version)
      fd.append('files', file);
      try {
        // Try local Spring upload endpoint first: POST /api/uploads with field 'file'
        let res = null;
        let url = null;
        try {
          const fdLocal = new FormData();
          fdLocal.append('file', file);
          res = await axios.post(`${apiUrl.replace(/\/$/, '')}/api/uploads`, fdLocal, config());
          url = res?.data?.data?.url || res?.data?.url || null;
        } catch (localErr) {
          // If local upload fails, fallback to Strapi-style /api/upload with 'files'
          try {
            const fdStrapi = new FormData();
            fdStrapi.append('files', file);
            res = await axios.post(`${apiUrl.replace(/\/$/, '')}/api/upload`, fdStrapi, config());
            // Normalize possible response shapes to extract a usable URL
            if (res?.data) {
              if (Array.isArray(res.data) && res.data[0]) url = res.data[0].url || res.data[0]?.attributes?.url;
              if (!url && res.data?.data) {
                const first = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
                url = first?.url || first?.attributes?.url || first?.attributes?.formats?.small?.url || null;
              }
            }
          } catch (e) {
            throw e; // rethrow to outer catch
          }
        }
        if (url) {
          // Normalize to absolute URL when backend returns a relative path like '/uploads/..'
          if (typeof url === 'string' && url.startsWith('/')) {
            const base = apiUrl.replace(/\/$/, '');
            url = base + url;
          }
          uploadsMap[key] = url;
          form[key] = url; // actualizar el form para enviarlo luego
        } else {
          // Fallback: if server didn't return a URL, still attempt to continue but warn
          console.warn('No se obtuvo URL al subir archivo, respuesta:', res.data);
          toast('Subida completada pero no se pudo obtener la URL del archivo.', 'warning');
        }
      } catch (e) {
        console.error('Error subiendo archivo', e);
        toast('Error subiendo archivo: ' + (e.response?.data?.error || e.message), 'error');
        throw e;
      }
    }

    const payload = { ...form };
    
    // Limpiar campos internos de Strapi y relaciones si se colaron
    const reserved = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations', 'division', 'user'];
    reserved.forEach(k => delete payload[k]);

    if (activeTab.value === 'divisiones') {
      payload.temporada = { id: Number(payload.temporadaId) };
      delete payload.temporadaId;
      delete payload.Categoria;
      delete payload.Nivel;
      delete payload.categoria;
      delete payload.nivel;
    }

    if (activeTab.value === 'jugadores' && payload.divisionId) {
      payload.division = { id: Number(payload.divisionId) };
      delete payload.divisionId;
    }

    if (activeTab.value === 'jugadores') {
      if (!validatePlayerForm(payload)) {
        throw new Error('Revisa los campos obligatorios del jugador');
      }
      delete payload.ConfirmarContrasena;
    } else {
      if (!validateNonPlayerForm(payload)) {
        throw new Error('Revisa los campos obligatorios del formulario');
      }
    }

    if (activeTab.value === 'jugadores' && !payload.Contrasena) {
      delete payload.Contrasena;
    }

    if (editandoId.value) {
      await axios.put(`${apiUrl}/api/${activeEndpoint.value}/${editandoId.value}`, payload, config());
    } else {
      payload.publishedAt = new Date().toISOString();
      await axios.post(`${apiUrl}/api/${activeEndpoint.value}`, payload, config());
    }
    
    toast('Guardado correctamente.', 'success');
    cerrarModal();
    cargarDatos();
    // limpiar archivos seleccionados
    Object.keys(selectedFiles).forEach(k => delete selectedFiles[k]);
  } catch (error) {
    console.error(error);
    let serverMsg = error.response?.data?.error?.message || error.response?.data?.message || error.response?.data || error.message || 'Error desconocido';
    if (typeof serverMsg === 'object') {
      try { serverMsg = JSON.stringify(serverMsg); } catch(e) { serverMsg = String(serverMsg); }
    }
    if ((activeTab.value === 'jugadores' && Object.keys(playerErrors).length === 0) || (activeTab.value !== 'jugadores' && Object.keys(formErrors).length === 0)) {
      toast('Error al guardar: ' + serverMsg, 'error');
    }
  } finally {
    guardando.value = false;
  }
};

const eliminarItem = async (item) => {
  const idToDelete = item.id || item.documentId;
  if (!confirm(`¿Estás seguro de eliminar "${item.Nombre || item.Titulo || idToDelete}"?`)) return;
  
  try {
    console.log('Eliminando item:', item);
    await axios.delete(`${apiUrl}/api/${activeEndpoint.value}/${idToDelete}`, config());
    toast('Eliminado con éxito.', 'success');
    cargarDatos();
  } catch (error) {
    console.error('Error al eliminar:', error.response || error);
    let serverMsg = error.response?.data?.error?.message || error.response?.data?.message || error.response?.data || error.message || 'Error desconocido';
    if (typeof serverMsg === 'object') {
      try { serverMsg = JSON.stringify(serverMsg); } catch(e) { serverMsg = String(serverMsg); }
    }
    toast('Error al eliminar: ' + serverMsg, 'error');
  }
};

watch(activeTab, cargarDatos);
watch(() => state.jwt, (val) => {
  if (val) cargarDatos();
});

onMounted(() => {
  if (state.initialized && state.jwt) {
    cargarDatos();
  } else {
    // esperar a la inicialización de auth
    const stop = watch(() => state.initialized, (v) => {
      if (v) {
        if (state.jwt) cargarDatos();
        stop();
      }
    });
  }
});
</script>

<style scoped>
.admin-mantenimiento-page { padding-bottom: 80px; color: white; }

.hero-section {
  background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('/fotos-tenis/photo-1558365849-6ebd8b0454b2.avif');
  background-position: center 40%;
  background-size: cover;
  background-position: center center;
  padding: 60px 20px;
  text-align: center;
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

.hero-lead { color: #fff !important; }

.hero-section .hero-content h1,
.hero-section .hero-content .hero-lead,
.hero-section .hero-content .mini-tag,
.hero-section .hero-content p {
  color: #fff !important;
}

.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

/* TABS */
.tabs-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: rgba(255,255,255,0.05);
  padding: 8px;
  border-radius: 12px;
  width: 100%;
  flex-wrap: wrap;
}

.tab-btn {
  flex: 1 1 140px;
  min-height: 44px;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #888;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  white-space: normal;
  line-height: 1.15;
  text-align: center;
}

.tab-btn.active {
  background: var(--ball);
  color: #000;
}

.glass-card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 15px;
}

.section-header h2 { color: var(--ball); font-size: 1.5rem; }

@media (max-width: 1024px) {
  .tabs-container {
    gap: 8px;
  }

  .tab-btn {
    flex-basis: calc(33.333% - 8px);
    padding: 10px 12px;
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 48px 16px;
    margin-bottom: 28px;
  }

  .container {
    padding: 0 16px;
  }

  .tabs-container {
    padding: 6px;
    gap: 6px;
  }

  .tab-btn {
    flex-basis: calc(50% - 6px);
    padding: 10px 10px;
    font-size: 0.9rem;
  }

  .glass-card {
    padding: 20px;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .section-header h2 {
    font-size: 1.25rem;
  }

  .section-header .btn-primary {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .tab-btn {
    flex-basis: 100%;
  }

  .hero-content h1 {
    font-size: clamp(2rem, 9vw, 2.8rem);
  }

  .hero-lead {
    font-size: 0.95rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn-primary,
  .modal-actions .btn-secondary {
    width: 100%;
  }
}

.btn-primary {
  background: var(--ball);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(199,255,52,0.3); }

/* TABLA */
.table-responsive { overflow-x: auto; }
.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  padding: 15px;
  color: #666;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.admin-table td {
  padding: 15px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.actions-td { display: flex; gap: 10px; }

.btn-icon {
  background: rgba(255,255,255,0.1);
  border: none;
  width: 35px; height: 35px;
  border-radius: 6px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover { background: rgba(255,255,255,0.2); }
.btn-icon.del:hover { background: rgba(255, 60, 60, 0.2); }

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

/* FORM */
.admin-form { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { color: #888; font-size: 0.9rem; }
.form-group input, .form-group select, .form-group textarea {
  background: #111;
  border: 1px solid #333;
  color: white;
  padding: 12px;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.field-error {
  margin: 6px 0 0;
  color: #ff8f8f;
  font-size: 0.82rem;
  font-weight: 600;
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

.btn-secondary {
  background: transparent;
  color: white;
  border: 1px solid #444;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
}

/* SPINNER */
.loading-state { text-align: center; padding: 40px; }
.spinner {
  width: 40px; height: 40px;
  border: 3px solid rgba(199,255,52,0.1);
  border-top-color: var(--ball);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-msg { text-align: center; color: #555; padding: 30px; }

/* NUEVOS ESTILOS PREVIEW */
.mini-preview {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.1);
}

.input-with-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.image-preview-box {
  width: 100%;
  max-height: 200px;
  overflow: hidden;
  border-radius: 8px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
}

.image-preview-box img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

/* ESTILOS SOCIOS */
.badge {
  background: rgba(255,255,255,0.1);
  padding: 4px 10px;
  border-radius: 4px;
  font-family: monospace;
  color: var(--ball);
}

.tag-nivel {
  background: #2a2a2a;
  color: #ddd;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid #444;
}
</style>
