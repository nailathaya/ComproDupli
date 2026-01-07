import { create } from 'zustand';
import { User } from '../types';
import { loginCandidate } from '../services/api';
import { registerCandidate } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,

  // ======================
  // LOGIN (BACKEND CONNECT)
  // ======================

  login: async (credentials) => {
  set({ loading: true, error: null });

  try {
    const res = await loginCandidate(credentials);

    // 🔥 VALIDASI WAJIB
    if (!res?.token || !res?.user) {
      throw new Error('Invalid login response');
    }

    localStorage.setItem('token', res.token);

    set({
      isAuthenticated: true,
      user: res.user,
      token: res.token,
      loading: false,
    });

    return true;
  } catch (err) {
    console.error('LOGIN STORE ERROR:', err);
    set({
      error: 'Email atau password salah',
      loading: false,
    });
    return false;
  }
},


  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      await registerCandidate(userData);
      set({ loading: false });
      return true;
    } catch (err) {
      set({ error: 'Registrasi gagal', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  },
}));
