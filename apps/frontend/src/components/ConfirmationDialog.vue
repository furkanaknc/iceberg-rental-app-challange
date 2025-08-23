<template>
  <Teleport to="body">
    <div v-if="confirmationStore.isVisible" class="confirmation-overlay" @click.self="confirmationStore.cancel">
      <div class="confirmation-dialog" :class="`confirmation-dialog--${confirmationStore.options.type}`">
        <!-- Icon -->
        <div class="confirmation-icon">
          <svg v-if="confirmationStore.options.type === 'danger'" class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="confirmationStore.options.type === 'warning'"
            class="icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <!-- Content -->
        <div class="confirmation-content">
          <h3 class="confirmation-title">{{ confirmationStore.options.title }}</h3>
          <p class="confirmation-message">{{ confirmationStore.options.message }}</p>
        </div>

        <!-- Actions -->
        <div class="confirmation-actions">
          <button @click="confirmationStore.cancel" class="btn btn-secondary">
            {{ confirmationStore.options.cancelText }}
          </button>
          <button @click="confirmationStore.confirm" class="btn" :class="getConfirmButtonClass()">
            {{ confirmationStore.options.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useConfirmationStore } from '../stores/confirmation';

const confirmationStore = useConfirmationStore();

const getConfirmButtonClass = () => {
  switch (confirmationStore.options.type) {
    case 'danger':
      return 'btn-danger';
    case 'warning':
      return 'btn-warning';
    default:
      return 'btn-primary';
  }
};
</script>

<style scoped>
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

.confirmation-dialog {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;
}

.confirmation-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.icon {
  width: 3rem;
  height: 3rem;
}

.confirmation-dialog--danger .icon {
  color: #ef4444;
}

.confirmation-dialog--warning .icon {
  color: #f59e0b;
}

.confirmation-dialog--info .icon {
  color: #3b82f6;
}

.confirmation-content {
  text-align: center;
  margin-bottom: 2rem;
}

.confirmation-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.confirmation-message {
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.confirmation-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  min-width: 80px;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background-color: #d97706;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 640px) {
  .confirmation-dialog {
    margin: 1rem;
    padding: 1.5rem;
  }

  .confirmation-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
  }
}
</style>
