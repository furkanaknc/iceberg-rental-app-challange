<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo/Brand -->
      <div class="navbar-brand">
        <router-link to="/dashboard" class="brand-link"> 🏠 Real Estate </router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-btn" aria-label="Toggle menu">
        <svg v-if="!mobileMenuOpen" class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <svg v-else class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Desktop Navigation -->
      <div v-if="authStore.isAuthenticated" class="navbar-nav desktop-nav">
        <router-link to="/dashboard" class="nav-link" active-class="nav-link--active"> Dashboard </router-link>
        <router-link to="/properties" class="nav-link" active-class="nav-link--active"> Properties </router-link>
        <router-link to="/appointments/new" class="nav-link" active-class="nav-link--active">
          New Appointment
        </router-link>
      </div>

      <!-- Desktop User Menu -->
      <div class="navbar-user desktop-user">
        <div v-if="authStore.isAuthenticated" class="user-menu">
          <div class="user-info">
            <span class="user-name">{{ authStore.fullName }}</span>
            <span class="user-role">{{ authStore.user?.role }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
        <div v-else class="auth-links">
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <div v-if="authStore.isAuthenticated" class="mobile-nav">
          <router-link to="/dashboard" class="mobile-nav-link" @click="mobileMenuOpen = false"> Dashboard </router-link>
          <router-link to="/properties" class="mobile-nav-link" @click="mobileMenuOpen = false">
            Properties
          </router-link>
          <router-link to="/appointments/new" class="mobile-nav-link" @click="mobileMenuOpen = false">
            New Appointment
          </router-link>
          <div class="mobile-user-info">
            <span class="mobile-user-name">{{ authStore.fullName }}</span>
            <span class="mobile-user-role">{{ authStore.user?.role }}</span>
          </div>
          <button @click="handleLogout" class="mobile-logout-btn">Logout</button>
        </div>
        <div v-else class="mobile-auth">
          <router-link to="/login" class="mobile-nav-link" @click="mobileMenuOpen = false">Login</router-link>
          <router-link to="/register" class="mobile-nav-link" @click="mobileMenuOpen = false">Register</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const mobileMenuOpen = ref(false);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
  mobileMenuOpen.value = false;
};
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-link:hover {
  color: #3b82f6;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #1f2937;
  background-color: #f3f4f6;
}

.nav-link--active {
  color: #3b82f6;
  background-color: #eff6ff;
}

.navbar-user {
  display: flex;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.875rem;
}

.logout-btn:hover {
  background: #dc2626;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #1f2937;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.mobile-menu-btn:hover {
  background-color: #f3f4f6;
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.mobile-nav,
.mobile-auth {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.mobile-nav-link {
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  transition: color 0.2s;
}

.mobile-nav-link:hover {
  color: #3b82f6;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-user-info {
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  text-align: center;
}

.mobile-user-name {
  display: block;
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.mobile-user-role {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mobile-logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-top: 1rem;
}

.mobile-logout-btn:hover {
  background: #dc2626;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
    position: relative;
  }

  .mobile-menu-btn {
    display: block;
  }

  .desktop-nav,
  .desktop-user {
    display: none;
  }

  .mobile-menu {
    display: block;
  }
}

@media (min-width: 769px) {
  .mobile-menu-btn,
  .mobile-menu {
    display: none;
  }
}
</style>
