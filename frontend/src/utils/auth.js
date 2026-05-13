import { reactive, readonly } from 'vue';
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const AUTH_SOURCE_KEY = 'authSource';

// Emails con permisos de administrador extraídos de .env o usando defaults
const VIRTUAL_ADMINS = import.meta.env.VITE_ADMIN_EMAILS ? import.meta.env.VITE_ADMIN_EMAILS.split(',') : ['admin@isturgi.com', 'socio@isturgi.com', 'profe@isturgi.com'];

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
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || null,
            isAdmin: VIRTUAL_ADMINS.includes(firebaseUser.email)
        };

        // Intentar obtener perfil extendido desde Spring Boot
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
        if (localStorage.getItem(AUTH_SOURCE_KEY) === 'local' && localStorage.getItem('jwt')) {
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

    const normalizedUser = user ? {
        ...user,
        email: user.email || user.Email || fallbackIdentifier,
        uid: user.uid || user.firebaseUid || user.firebase_uid || user.id || null,
        displayName: user.displayName || `${user.Nombre || user.nombre || ''} ${user.Apellidos || user.apellidos || ''}`.trim() || null,
        isAdmin: VIRTUAL_ADMINS.includes(String(user.email || user.Email || fallbackIdentifier || '').toLowerCase())
    } : {
        email: fallbackIdentifier,
        uid: null,
        displayName: null,
        isAdmin: VIRTUAL_ADMINS.includes(String(fallbackIdentifier || '').toLowerCase())
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
        
        // Esperar a que onAuthStateChanged actualice el estado (jwt y user)
        return new Promise((resolve) => {
            const checkState = () => {
                if (state.jwt && state.user) {
                    state.loading = false;
                    resolve({ success: true });
                } else {
                    // Reintentar después de 50ms
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
        await fbSignOut(auth);
    } finally {
        state.user = null;
        state.jwt = null;
        state.authSource = null;
        state.loading = false;
        state.error = null;
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        localStorage.removeItem(AUTH_SOURCE_KEY);
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
    return {
        state: readonly(state),
        login,
        logout,
        refreshProfile,
        isAuthenticated: () => !!state.jwt,
        isAdmin: () => state.user?.isAdmin === true
    };
};
