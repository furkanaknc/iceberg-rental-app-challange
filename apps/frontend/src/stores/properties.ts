import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/api';
import { CreatePropertyData, Property, UpdatePropertyData } from './interfaces/properties.interface';

export const usePropertiesStore = defineStore('properties', () => {
  const properties = ref<Property[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const clearProperties = () => {
    properties.value = [];
    error.value = null;
  };

  const getErrorMessage = (err: any, defaultMessage: string): string => {
    return err.response?.data?.error?.message || err.response?.data?.message || err.message || defaultMessage;
  };

  const fetchProperties = async (search?: string) => {
    try {
      loading.value = true;
      error.value = null;

      let url = '/properties';
      if (search) {
        url += `?q=${encodeURIComponent(search)}`;
      }

      const response = await apiService.get(url);

      if (response.data.properties && Array.isArray(response.data.properties)) {
        properties.value = response.data.properties;
      } else if (Array.isArray(response.data)) {
        properties.value = response.data;
      } else {
        properties.value = [];
      }

      return { success: true };
    } catch (err: any) {
      properties.value = [];
      console.error('Failed to fetch properties:', err);
      const errorMessage = getErrorMessage(err, 'Failed to fetch properties');
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const createProperty = async (propertyData: CreatePropertyData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await apiService.post('/properties', propertyData);
      const newProperty = response.data;

      properties.value.unshift(newProperty);

      return { success: true, data: newProperty };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to create property');
      console.error('Failed to create property:', err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const updateProperty = async (id: string, propertyData: UpdatePropertyData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await apiService.patch(`/properties/${id}`, propertyData);
      const updatedProperty = response.data;

      const index = properties.value.findIndex((property) => property.id === id);
      if (index !== -1) {
        properties.value[index] = updatedProperty;
      }

      return { success: true, data: updatedProperty };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to update property');
      console.error('Failed to update property:', err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      await apiService.delete(`/properties/${id}`);
      properties.value = properties.value.filter((property) => property.id !== id);

      return { success: true };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to delete property');
      console.error('Failed to delete property:', err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const forceDeleteProperty = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      await apiService.delete(`/admin/force-delete-property/${id}`);
      properties.value = properties.value.filter((property) => property.id !== id);

      return { success: true };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to force delete property');
      console.error('Failed to force delete property:', err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const getPropertyById = (id: string) => {
    return properties.value.find((property) => property.id === id);
  };

  return {
    properties,
    loading,
    error,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    forceDeleteProperty,
    getPropertyById,
    clearProperties,
  };
});
