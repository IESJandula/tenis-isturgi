<template>
  <div class="admin-mantenimiento-page fade-in">
    <section class="hero-section">
      <div class="hero-content">
        <span class="mini-tag">Mantenimiento Global</span>
        <h1>Gestión de Contenidos</h1>
        <p class="hero-lead">Crea y modifica torneos, noticias y perfiles de socios.</p>
        <div style="margin-top: 20px;">
          <router-link to="/admin-gestion" class="btn-secondary" style="text-decoration: none; display: inline-block;">
            Ir a Gestión de Ligas
          </router-link>
        </div>
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
        
        <form @submit.prevent="guardarItem" class="admin-form">
          <!-- CAMPOS TORNEO -->
          <template v-if="activeTab === 'torneos'">
            <div class="form-group">
              <label>Nombre del Torneo</label>
              <input v-model="form.Nombre" required placeholder="Ej: Open Verano 2024">
            </div>
            <div class="form-group">
              <label>Categoría</label>
              <select v-model="form.Categoria" required>
                <option value="Torneo">Torneo</option>
                <option value="Liga">Liga</option>
                <option value="Evento especial">Evento especial</option>
                <option value="Escuela">Escuela</option>
              </select>
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
              <label>URL Cartel / Imagen</label>
              <div class="input-with-preview">
                <input v-model="form.Cartel" placeholder="https://...">
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
              <label>Título</label>
              <input v-model="form.Titulo" required>
            </div>
            <div class="form-group">
              <label>Resumen</label>
              <textarea v-model="form.Resumen" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>Cuerpo / Descripción</label>
              <textarea v-model="form.Descripcion" rows="6" required></textarea>
            </div>
            <!-- IMAGEN NOTICIA -->
            <div class="form-group">
              <label>URL Imagen</label>
              <div class="input-with-preview">
                <input v-model="form.Imagen" placeholder="https://...">
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
                <label>Nombre</label>
                <input v-model="form.Nombre" required>
              </div>
              <div>
                <label>Apellidos</label>
                <input v-model="form.Apellidos">
              </div>
            </div>
            <div class="form-group grid-2">
              <div>
                <label>Email</label>
                <input v-model="form.Email" required type="email">
              </div>
              <div>
                <label>Teléfono</label>
                <input v-model="form.Telefono">
              </div>
            </div>
            <div class="form-group grid-2">
              <div>
                <label>Número de Socio</label>
                <input v-model="form.NumeroSocio" placeholder="Ej: 001">
              </div>
              <div>
                <label>Fecha Nacimiento</label>
                <input type="date" v-model="form.FechaNacimiento">
              </div>
            </div>
            <div class="form-group grid-2">
              <div>
                <label>Nivel</label>
                <select v-model="form.Nivel">
                  <option value="Iniciado">Iniciado</option>
                  <option value="Medio">Medio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>
              <div>
                <label>Categoría</label>
                <input v-model="form.Categoria" placeholder="Ej: Absoluto">
              </div>
            </div>
            <div class="form-group">
              <label>Puntos de Ranking</label>
              <input type="number" v-model="form.Puntos">
            </div>
            <div class="form-group">
              <label>URL Foto de Perfil</label>
              <div class="input-with-preview">
                <input v-model="form.Foto" placeholder="https://...">
                <div v-if="form.Foto" class="image-preview-box">
                  <img :src="form.Foto" @error="(e) => e.target.style.display = 'none'" @load="(e) => e.target.style.display = 'block'">
                </div>
              </div>
            </div>
          </template>

          <!-- CAMPOS GALERIA -->
          <template v-if="activeTab === 'galeria'">
            <div class="form-group">
              <label>Título de la foto</label>
              <input v-model="form.titulo" required>
            </div>
            <div class="form-group">
              <label>Categoría</label>
              <select v-model="form.categoria" required>
                <option v-for="c in ['Pistas', 'Escuela', 'Liga', 'Torneos', 'Club', 'Eventos']" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Descripción / Texto</label>
              <input v-model="form.texto">
            </div>
            <div class="form-group">
              <label>URL de la imagen</label>
              <div class="input-with-preview">
                <input v-model="form.src" required placeholder="https://...">
                <div v-if="form.src" class="image-preview-box">
                  <img :src="form.src" @error="(e) => e.target.style.display = 'none'" @load="(e) => e.target.style.display = 'block'">
                </div>
              </div>
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
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const token = localStorage.getItem('jwt');
const config = { headers: { Authorization: `Bearer ${token}` } };

const activeTab = ref('torneos');
const tabs = [
  { id: 'torneos', label: 'Torneos', singular: 'Torneo', endpoint: 'torneos' },
  { id: 'noticias', label: 'Noticias', singular: 'Noticia', endpoint: 'noticias' },
  { id: 'jugadores', label: 'Jugadores', singular: 'Jugador', endpoint: 'jugadors' },
  { id: 'galeria', label: 'Galería', singular: 'Foto', endpoint: 'galeria' }
];

const items = ref([]);
const cargando = ref(false);
const guardando = ref(false);
const showModal = ref(false);
const editandoId = ref(null);
const form = reactive({});

const activeTabLabel = computed(() => tabs.find(t => t.id === activeTab.value)?.label);
const activeTabSingular = computed(() => tabs.find(t => t.id === activeTab.value)?.singular);
const activeEndpoint = computed(() => tabs.find(t => t.id === activeTab.value)?.endpoint);

const cargarDatos = async () => {
  if (!token) return;
  cargando.value = true;
  try {
    const res = await axios.get(`${apiUrl}/api/${activeEndpoint.value}?sort=createdAt:desc`, config);
    items.value = res.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    cargando.value = false;
  }
};

const abrirNuevo = () => {
  editandoId.value = null;
  Object.keys(form).forEach(k => delete form[k]);
  
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
    form.NumeroSocio = '';
    form.Nivel = 'Medio';
    form.Puntos = 0;
    form.Foto = '';
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
  Object.assign(form, item);
  
  // Ajustar fechas para inputs date
  if (form.Fecha) form.Fecha = new Date(form.Fecha).toISOString().substring(0, 10);
  if (form.FechaInicio) form.FechaInicio = new Date(form.FechaInicio).toISOString().substring(0, 10);
  if (form.FechaFin) form.FechaFin = new Date(form.FechaFin).toISOString().substring(0, 10);
  if (form.FechaNacimiento) form.FechaNacimiento = new Date(form.FechaNacimiento).toISOString().substring(0, 10);
  
  showModal.value = true;
};

const cerrarModal = () => {
  showModal.value = false;
};

const guardarItem = async () => {
  guardando.value = true;
  try {
    const payload = { ...form };
    
    // Limpiar campos internos de Strapi y relaciones si se colaron
    const reserved = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations', 'division', 'user'];
    reserved.forEach(k => delete payload[k]);

    if (editandoId.value) {
      await axios.put(`${apiUrl}/api/${activeEndpoint.value}/${editandoId.value}`, payload, config);
    } else {
      payload.publishedAt = new Date().toISOString();
      await axios.post(`${apiUrl}/api/${activeEndpoint.value}`, payload, config);
    }
    
    alert('Guardado correctamente.');
    cerrarModal();
    cargarDatos();
  } catch (error) {
    console.error(error);
    alert('Error al guardar: ' + (error.response?.data?.error?.message || 'Error desconocido'));
  } finally {
    guardando.value = false;
  }
};

const eliminarItem = async (item) => {
  const idToDelete = item.id || item.documentId;
  if (!confirm(`¿Estás seguro de eliminar "${item.Nombre || item.Titulo || idToDelete}"?`)) return;
  
  try {
    console.log('Eliminando item:', item);
    await axios.delete(`${apiUrl}/api/${activeEndpoint.value}/${idToDelete}`, config);
    alert('Eliminado con éxito.');
    cargarDatos();
  } catch (error) {
    console.error('Error al eliminar:', error.response || error);
    alert('Error al eliminar: ' + (error.response?.data?.error?.message || 'Error desconocido'));
  }
};

watch(activeTab, cargarDatos);
onMounted(cargarDatos);
</script>

<style scoped>
.admin-mantenimiento-page { padding-bottom: 80px; color: white; }

.hero-section {
  background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=2000&auto=format&fit=crop');
  background-size: cover;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 40px;
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

.hero-lead { color: #888; }

.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

/* TABS */
.tabs-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: rgba(255,255,255,0.05);
  padding: 8px;
  border-radius: 12px;
  width: fit-content;
}

.tab-btn {
  padding: 10px 25px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #888;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
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
