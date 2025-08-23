<template>
  <div class="notification-container">
    <TransitionGroup name="notification" tag="div" class="notifications">
      <div
        v-for="notification in notificationsStore.notifications"
        :key="notification.id"
        :class="['notification', `notification--${notification.type}`]"
      >
        <div class="notification__icon">
          <svg v-if="notification.type === 'success'" class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else-if="notification.type === 'error'" class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else-if="notification.type === 'warning'" class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div class="notification__content">
          <div class="notification__title">{{ notification.title }}</div>
          <div v-if="notification.message" class="notification__message">
            {{ notification.message }}
          </div>
        </div>

        <button
          @click="notificationsStore.removeNotification(notification.id)"
          class="notification__close"
          type="button"
        >
          <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '../stores/notifications';

const notificationsStore = useNotificationsStore();
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  pointer-events: none;
}

.notifications {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  pointer-events: auto;
  max-width: 100%;
  word-wrap: break-word;
}

.notification--success {
  border-left-color: #10b981;
}

.notification--error {
  border-left-color: #ef4444;
}

.notification--warning {
  border-left-color: #f59e0b;
}

.notification--info {
  border-left-color: #3b82f6;
}

.notification__icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}

.notification--success .notification__icon {
  color: #10b981;
}

.notification--error .notification__icon {
  color: #ef4444;
}

.notification--warning .notification__icon {
  color: #f59e0b;
}

.notification--info .notification__icon {
  color: #3b82f6;
}

.icon {
  width: 100%;
  height: 100%;
}

.notification__content {
  flex: 1;
  min-width: 0;
}

.notification__title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.25;
  margin-bottom: 0.25rem;
}

.notification__message {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

.notification__close {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;
  background: none;
  border: none;
  padding: 0;
}

.notification__close:hover {
  color: #6b7280;
}

/* Transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .notification-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    /* Account for mobile navbar */
    top: 5rem;
  }

  .notifications {
    max-width: none;
    gap: 0.75rem;
  }

  .notification {
    padding: 1rem;
    border-radius: 8px;
  }

  .notification__content {
    margin-left: 0.75rem;
    margin-right: 0.75rem;
  }

  .notification__title {
    font-size: 1rem;
    margin-bottom: 0.375rem;
  }

  .notification__message {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .notification__close {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0.125rem;
  }
}

@media (max-width: 480px) {
  .notification-container {
    top: 1rem;
    right: 0.75rem;
    left: 0.75rem;
    /* Account for mobile navbar */
    top: 5rem;
  }

  .notification {
    padding: 0.875rem;
    border-radius: 6px;
    min-height: 60px;
  }

  .notification__icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.125rem;
  }

  .notification__content {
    margin-left: 0.625rem;
    margin-right: 0.5rem;
  }

  .notification__title {
    font-size: 0.875rem;
    font-weight: 700;
  }

  .notification__message {
    font-size: 0.8125rem;
    margin-top: 0.25rem;
  }

  /* Better touch targets */
  .notification__close {
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -0.5rem;
  }

  /* Mobile-first transitions */
  .notification-enter-from,
  .notification-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }

  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.4s ease-out;
  }
}
</style>
