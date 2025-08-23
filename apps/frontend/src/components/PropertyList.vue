<template>
  <div class="property-list">
    <div class="list-header">
      <h2 class="list-title">Properties</h2>
      <div class="list-actions">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search properties..."
            class="search-input"
            @input="handleSearch"
          />
        </div>
        <button v-if="canCreateProperty" @click="$emit('create')" class="btn btn-primary">+ Add Property</button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>Loading properties...</span>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="properties.length === 0" class="empty-state">
      <div class="empty-icon">🏠</div>
      <h3>No properties found</h3>
      <p>{{ searchQuery ? 'Try adjusting your search criteria.' : 'Start by creating your first property.' }}</p>
      <button v-if="canCreateProperty && !searchQuery" @click="$emit('create')" class="btn btn-primary">
        Create First Property
      </button>
    </div>

    <div v-else class="properties-grid">
      <div v-for="property in properties" :key="property.id" class="property-card">
        <div class="property-header">
          <h3 class="property-title">{{ property.title }}</h3>
          <div class="property-actions">
            <button @click="$emit('edit', property)" class="btn btn-sm btn-secondary" title="Edit property">✏️</button>
            <button
              v-if="canDeleteProperty"
              @click="handleDelete(property)"
              class="btn btn-sm btn-danger"
              title="Delete property"
              :disabled="deletingId === property.id"
            >
              {{ deletingId === property.id ? '...' : '🗑️' }}
            </button>
          </div>
        </div>

        <div class="property-details">
          <div class="detail-item">
            <span class="detail-label">Parish:</span>
            <span class="detail-value">{{ property.parish || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Postcode:</span>
            <span class="detail-value">{{ property.postcode }}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Created:</span>
            <span class="detail-value">{{ formatDate(property.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useConfirmationStore } from '../stores/confirmation';

interface Property {
  id: string;
  title: string;
  parish: string;
  postcode: string;
  latitude: number | string | null;
  longitude: number | string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  properties: Property[];
  loading?: boolean;
  error?: string | null;
}

interface Emits {
  (e: 'create'): void;
  (e: 'edit', property: Property): void;
  (e: 'delete', property: Property): void;
  (e: 'search', query: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const authStore = useAuthStore();
const confirmationStore = useConfirmationStore();
const searchQuery = ref('');
const deletingId = ref<string | null>(null);

// Role-based permissions
const canCreateProperty = computed(() => authStore.canCreateProperty);
const canDeleteProperty = computed(() => authStore.canDeleteProperty);

const handleSearch = () => {
  emit('search', searchQuery.value);
};

const handleDelete = async (property: Property) => {
  const confirmed = await confirmationStore.show({
    title: 'Delete Property',
    message: `Are you sure you want to delete "${property.title}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'danger',
  });

  if (confirmed) {
    deletingId.value = property.id;
    try {
      emit('delete', property);
    } finally {
      deletingId.value = null;
    }
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
</script>

<style scoped>
.property-list {
  padding: 1.5rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.list-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 250px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #6b7280;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #ef4444;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.property-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: shadow 0.2s;
}

.property-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.property-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.property-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.property-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.property-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  color: #374151;
  font-size: 0.875rem;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .property-list {
    padding: 1rem;
  }

  .list-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .list-title {
    font-size: 1.5rem;
    margin-bottom: 0;
  }

  .list-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-box {
    width: 100%;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
  }

  .properties-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .property-card {
    padding: 1rem;
  }

  .property-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .property-title {
    font-size: 1.125rem;
    text-align: left;
  }

  .property-actions {
    margin-left: 0;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .property-details {
    gap: 0.75rem;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .detail-label {
    font-weight: 600;
    font-size: 0.75rem;
  }

  .detail-value {
    font-size: 0.875rem;
    text-align: left;
    margin-left: 0;
  }

  .btn {
    min-height: 44px;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .btn-sm {
    min-height: 40px;
    padding: 0.625rem 0.875rem;
    font-size: 0.75rem;
  }

  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .loading {
    padding: 2rem 1rem;
  }

  .error-message {
    margin: 1rem;
    padding: 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .property-list {
    padding: 0.75rem;
  }

  .property-card {
    padding: 0.75rem;
  }

  .property-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn,
  .btn-sm {
    width: 100%;
    justify-content: center;
  }

  .list-actions {
    gap: 1rem;
  }
}
</style>
