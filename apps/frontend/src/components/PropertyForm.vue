<template>
  <div class="property-form">
    <h2 class="form-title">{{ isEdit ? 'Edit Property' : 'Create New Property' }}</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="title" class="label">Property Title *</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="input"
          :class="{ 'input-error': errors.title }"
          placeholder="Enter property title"
          required
        />
        <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="postcode" class="label">Postcode *</label>
        <input
          id="postcode"
          v-model="formData.postcode"
          type="text"
          class="input"
          :class="{ 'input-error': errors.postcode }"
          placeholder="Enter postcode"
          required
        />
        <span v-if="errors.postcode" class="error-text">{{ errors.postcode }}</span>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary" :disabled="loading">Cancel</button>
        <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
          <span v-if="loading" class="loading-spinner"></span>
          {{
            loading
              ? isEdit
                ? 'Updating Property...'
                : 'Creating Property...'
              : isEdit
                ? 'Update Property'
                : 'Create Property'
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';

interface Property {
  id?: string;
  title: string;
  postcode: string;
}

interface Props {
  property?: Property;
  loading?: boolean;
  error?: string | null;
}

interface Emits {
  (e: 'submit', data: { title: string; postcode: string }): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
});

const emit = defineEmits<Emits>();

const isEdit = computed(() => !!props.property?.id);

const formData = reactive({
  title: '',
  postcode: '',
});

const errors = ref({
  title: '',
  postcode: '',
});

const clearErrors = () => {
  errors.value = {
    title: '',
    postcode: '',
  };
};

watch(
  () => props.property,
  (newProperty) => {
    if (newProperty) {
      formData.title = newProperty.title;
      formData.postcode = newProperty.postcode;
    } else {
      formData.title = '';
      formData.postcode = '';
    }
    clearErrors();
  },
  { immediate: true },
);

const isFormValid = computed(() => {
  return (
    formData.title.trim().length > 0 &&
    formData.postcode.trim().length > 0 &&
    !Object.values(errors.value).some((error) => error)
  );
});

const validateForm = () => {
  clearErrors();
  let isValid = true;

  if (!formData.title.trim()) {
    errors.value.title = 'Property title is required';
    isValid = false;
  } else if (formData.title.trim().length < 3) {
    errors.value.title = 'Property title must be at least 3 characters';
    isValid = false;
  }

  if (!formData.postcode.trim()) {
    errors.value.postcode = 'Postcode is required';
    isValid = false;
  } else if (formData.postcode.trim().length < 3) {
    errors.value.postcode = 'Postcode must be at least 3 characters';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      title: formData.title.trim(),
      postcode: formData.postcode.trim(),
    });
  }
};
</script>

<style scoped>
.property-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-text {
  color: #ef4444;
  font-size: 0.875rem;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid #ef4444;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .property-form {
    padding: 1rem;
  }

  .form-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .label {
    font-size: 0.875rem;
    margin-bottom: 0.375rem;
  }

  .input {
    padding: 0.75rem;
    font-size: 1rem;
    /* Prevent zoom on iOS */
    transform: scale(1);
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn {
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    min-height: 44px;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .error-message {
    padding: 1rem;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .error-text {
    font-size: 0.75rem;
    margin-top: 0.375rem;
  }
}

@media (max-width: 480px) {
  .property-form {
    padding: 0.75rem;
  }

  .form-title {
    font-size: 1.125rem;
    text-align: center;
  }

  .input {
    padding: 1rem 0.75rem;
  }

  .btn {
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
  }
}
</style>
