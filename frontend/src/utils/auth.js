import { reactive, readonly, computed } from 'vue';
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const AUTH_SOURCE_KEY = 'authSource';

// Forzamos que todos los emails de administración de la lista estén en minúsculas para evitar fallos de matching
const VIRTUAL_ADMINS = (import.meta.env.VITE_ADMIN_EMAILS 
    ? import.meta.env.VITE_ADMIN_EMAILS.split(',') 
    : ['admin@isturgi.com', 'socio@isturgi.com', 'profe@isturgi.com']
).map(email => email.trim().toLowerCase());

const state = reactive({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    jwt: localStorage.getItem('jwt') || null,
    authSource: localStorage.getItem(AUTH_SOURCE_KEY) || null,
    loading: false,
    error: null,
    initialized: false
});

// Listener global de estado de Firebase
onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        let userData = {
            email: firebaseUser.email.toLowerCase(),
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || null,
            isAdmin: VIRTUAL_ADMINS.includes(firebaseUser.email.toLowerCase())
        };

        try {
            const res = await axios.get(`${apiUrl}/api/jugadors/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.data) {
                userData = { ...userData, ...res.data.data };
            }
        } catch (e) {
            console.warn("No se pudo obtener el perfil extendido (puede que el usuario no esté en la tabla jugadores todavía)");
        }

        state.user = userData;
        state.jwt = token;
        state.authSource = 'firebase';
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('jwt', token);
        localStorage.setItem(AUTH_SOURCE_KEY, 'firebase');
    } else {
        // Corrección del flujo local: Si ya estamos en sesión local, ignoramos el evento vacío de Firebase
        if (state.authSource === 'local' && state.jwt) {
            state.initialized = true;
            return;
        }

        state.user = null;
        state.jwt = null;
        state.authSource = null;
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        localStorage.removeItem(AUTH_SOURCE_KEY);
    }
    state.initialized = true;
});

const normalizeAuthResponse = (data, fallbackIdentifier) => {
    const payload = data?.data ?? data ?? {};
    const token = payload.token || payload.jwt || null;
    const user = payload.user || payload.data || payload.jugador || null;

    if (!token) {
        throw new Error('Respuesta de autenticación inválida');
    }

    const emailNormalizado = String(user?.email || user?.Email || fallbackIdentifier || '').toLowerCase();

    const normalizedUser = user ? {
        ...user,
        email: emailNormalizado,
        uid: user.uid || user.firebaseUid || user.firebase_uid || user.id || null,
        displayName: user.displayName || `${user.Nombre || user.nombre || ''} ${user.Apellidos || user.apellidos || ''}`.trim() || null,
        isAdmin: VIRTUAL_ADMINS.includes(emailNormalizado)
    } : {
        email: emailNormalizado,
        uid: null,
        displayName: null,
        isAdmin: VIRTUAL_ADMINS.includes(emailNormalizado)
    };

    return { token, user: normalizedUser };
};

const setLocalSession = (token, userData) => {
    state.user = userData;
    state.jwt = token;
    state.authSource = 'local';
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('jwt', token);
    localStorage.setItem(AUTH_SOURCE_KEY, 'local');
};

const login = async (identifier, password) => {
    state.loading = true;
    state.error = null;
    try {
        await signInWithEmailAndPassword(auth, identifier, password);
        
        // Control de tiempo máximo (timeout) de 5 segundos para evitar congelar la app
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const checkState = () => {
                attempts++;
                if (state.jwt && state.user) {
                    state.loading = false;
                    resolve({ success: true });
                } else if (attempts > 100) { // 100 * 50ms = 5 segundos máximo
                    state.loading = false;
                    state.error = "Error de sincronización con el servidor de autenticación.";
                    resolve({ success: false, error: state.error });
                } else {
                    setTimeout(checkState, 50);
                }
            };
            checkState();
        });
    } catch (firebaseErr) {
        try {
            const res = await axios.post(`${apiUrl}/api/jugadors/login`, {
                identifier,
                password
            });

            const { token, user } = normalizeAuthResponse(res.data, identifier);
            setLocalSession(token, user);
            state.loading = false;
            return { success: true };
        } catch (localErr) {
            let message = firebaseErr?.message || 'Error al iniciar sesión';
            if (message.includes('auth/invalid-credential') || message.includes('auth/user-not-found')) {
                message = 'Correo o contraseña incorrectos';
            }

            const backendMessage = localErr?.response?.data?.message || localErr?.response?.data?.error || localErr?.message;
            state.error = backendMessage || message;
            state.loading = false;
            return { success: false, error: state.error };
        }
    }
};

const logout = async () => {
    try {
        // Primero reseteamos el estado reactivo para evitar que onAuthStateChanged intente evaluar una sesión intermedia
        state.user = null;
        state.jwt = null;
        state.authSource = null;
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        localStorage.removeItem(AUTH_SOURCE_KEY);
        
        await fbSignOut(auth);
    } catch (err) {
        console.error("Error durante el cierre de sesión:", err);
    } finally {
        state.loading = false;
        state.error = null;
    }
};

const refreshProfile = async () => {
    if (!state.jwt) return { success: false, error: 'No autenticado' };
    try {
        const res = await axios.get(`${apiUrl}/api/jugadors/me`, {
            headers: { Authorization: `Bearer ${state.jwt}` }
        });
        if (res.data && res.data.data) {
            const merged = { ...(state.user || {}), ...res.data.data };
            state.user = merged;
            localStorage.setItem('user', JSON.stringify(merged));
        }
        return { success: true };
    } catch (err) {
        return { success: false, error: err?.message || 'No se pudo refrescar el perfil' };
    }
};

export const useAuth = () => {
    const isAuthComputed = computed(() => !!state.jwt);
    const isAdminComputed = computed(() => state.user?.isAdmin === true);

    return {
        state: readonly(state),
        login,
        logout,
        refreshProfile,
        isAuthenticated: () => isAuthComputed.value,
        isAdmin: () => isAdminComputed.value
    };
};