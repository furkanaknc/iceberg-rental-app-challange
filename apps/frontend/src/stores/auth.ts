import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '../services/api';
import { LoginCredentials, RegisterData, User } from './interfaces/auth.interface';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const fullName = computed(() => (user.value ? `${user.value.first_name} ${user.value.last_name}` : ''));
  const isAdmin = computed(() => user.value?.role === 'ADMIN');
  const isAgent = computed(() => user.value?.role === 'AGENT');
  const canCreateProperty = computed(() => isAdmin.value || isAgent.value);
  const canDeleteProperty = computed(() => isAdmin.value || isAgent.value);
  const canForceDeleteProperty = computed(() => isAdmin.value);
  const canManageAllAppointments = computed(() => isAdmin.value);

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
    apiService.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    delete apiService.defaults.headers.common['Authorization'];
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await apiService.post('/auth/login', credentials);
      const { access_token } = response.data;

      setToken(access_token);

      await fetchProfile();

      return { success: true };
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      loading.value = true;
      error.value = null;

      await apiService.post('/auth/register', userData);

      return await login({ email: userData.email, password: userData.password });
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async () => {
    try {
      if (!token.value) return;

      const response = await apiService.get('/users/profile');
      user.value = response.data;
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      clearAuth();
    }
  };

  const logout = () => {
    clearAuth();
  };

  const initializeAuth = async () => {
    if (token.value) {
      apiService.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      await fetchProfile();
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    fullName,
    isAdmin,
    isAgent,
    canCreateProperty,
    canDeleteProperty,
    canForceDeleteProperty,
    canManageAllAppointments,
    login,
    register,
    logout,
    fetchProfile,
    initializeAuth,
    clearAuth,
  };
});
