<template>
  <div class="properties-view">
    <PropertyList
      :properties="propertiesStore.properties"
      :loading="propertiesStore.loading"
      :error="propertiesStore.error"
      @create="showCreateForm = true"
      @edit="handleEdit"
      @delete="handleDelete"
      @search="handleSearch"
    />

    <div v-if="showCreateForm || editingProperty" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <PropertyForm
          :property="editingProperty"
          :loading="propertiesStore.loading"
          :error="propertiesStore.error"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePropertiesStore } from '../stores/properties';
import { useNotificationsStore } from '../stores/notifications';
import PropertyList from '../components/PropertyList.vue';
import PropertyForm from '../components/PropertyForm.vue';

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

const propertiesStore = usePropertiesStore();
const notificationsStore = useNotificationsStore();
const showCreateForm = ref(false);
const editingProperty = ref<Property | undefined>(undefined);

onMounted(async () => {
  propertiesStore.clearProperties();
  const result = await propertiesStore.fetchProperties();
  if (!result.success) {
    notificationsStore.error('Failed to Load', result.error || 'Could not load properties. Please refresh the page.');
  }
});

const closeModal = () => {
  showCreateForm.value = false;
  editingProperty.value = undefined;
};

const handleEdit = (property: Property) => {
  editingProperty.value = { ...property };
};

const handleSubmit = async (formData: { title: string; postcode: string }) => {
  let result;

  if (editingProperty.value) {
    result = await propertiesStore.updateProperty(editingProperty.value.id, formData);
  } else {
    result = await propertiesStore.createProperty(formData);
  }

  if (result.success) {
    closeModal();
    if (editingProperty.value) {
      notificationsStore.success('Property Updated', 'Property has been updated successfully');
    } else {
      notificationsStore.success('Property Created', 'Property has been created successfully');
    }
    await propertiesStore.fetchProperties();
  } else {
    const actionType = editingProperty.value ? 'Update' : 'Creation';
    notificationsStore.error(`${actionType} Failed`, result.error);
  }
};

const handleDelete = async (property: Property) => {
  const result = await propertiesStore.deleteProperty(property.id);

  if (result.success) {
    notificationsStore.success('Property Deleted', `"${property.title}" has been deleted successfully`);
  } else {
    notificationsStore.error('Deletion Failed', result.error || 'Unknown error occurred');
  }
};

const handleSearch = async (query: string) => {
  try {
    await propertiesStore.fetchProperties(query);
  } catch (err: any) {
    notificationsStore.error('Search Failed', 'Could not search properties. Please try again.');
  }
};
</script>

<style scoped>
.properties-view {
  min-height: 100vh;
  background-color: #f9fafb;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .properties-view {
    padding: 0;
  }

  .modal-overlay {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 2rem;
  }

  .modal-content {
    max-width: 100%;
    max-height: calc(100vh - 4rem);
    border-radius: 12px 12px 0 0;
    margin-top: auto;
    position: relative;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal-content {
    max-height: 90vh;
    border-radius: 16px 16px 0 0;
    width: 100%;
    max-width: 100%;
  }
}
</style>
