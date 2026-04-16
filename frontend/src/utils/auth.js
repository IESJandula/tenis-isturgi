import { reactive, readonly } from 'vue';
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Emails con permisos de administrador extraídos de .env o usando defaults
const VIRTUAL_ADMINS = import.meta.env.VITE_ADMIN_EMAILS ? import.meta.env.VITE_ADMIN_EMAILS.split(',') : ['admin@isturgi.com', 'socio@isturgi.com', 'profe@isturgi.com'];

const state = reactive({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    jwt: localStorage.getItem('jwt') || null,
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
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('jwt', token);
    } else {
        state.user = null;
        state.jwt = null;
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
    }
    state.initialized = true;
});

const login = async (identifier, password) => {
    state.loading = true;
    state.error = null;
    try {
        await signInWithEmailAndPassword(auth, identifier, password);
        // onAuthStateChanged actualizará el estado
        return { success: true };
    } catch (err) {
        state.error = err.message || 'Error al iniciar sesión';
        if (state.error.includes('auth/invalid-credential')) {
            state.error = 'Correo o contraseña incorrectos';
        }
        return { success: false, error: state.error };
    } finally {
        state.loading = false;
    }
};

const logout = async () => {
    await fbSignOut(auth);
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
