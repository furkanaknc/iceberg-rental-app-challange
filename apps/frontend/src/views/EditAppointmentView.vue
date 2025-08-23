<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Edit Appointment</h1>
            <p class="mt-1 text-sm text-gray-600">Update appointment details</p>
          </div>
          <router-link to="/dashboard" class="text-gray-500 hover:text-gray-700 text-sm font-medium">
            ← Back to Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="!appointment" class="text-center py-12">
        <h3 class="mt-2 text-sm font-medium text-gray-900">Appointment not found</h3>
        <p class="mt-1 text-sm text-gray-500">The appointment you're looking for doesn't exist.</p>
        <div class="mt-6">
          <router-link
            to="/dashboard"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </router-link>
        </div>
      </div>

      <div v-else class="bg-white shadow rounded-lg">
        <form @submit.prevent="handleSubmit" class="space-y-8 p-6">
          <!-- Appointment Details -->
          <section>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Appointment Details</h2>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700"> Date * </label>
                <input
                  id="date"
                  v-model="appointmentDate"
                  type="date"
                  required
                  :min="today"
                  class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="errors.starts_at ? 'border-red-300' : 'border-gray-300'"
                />
                <p v-if="errors.starts_at" class="mt-1 text-sm text-red-600">
                  {{ errors.starts_at }}
                </p>
              </div>

              <div>
                <label for="time" class="block text-sm font-medium text-gray-700"> Time * </label>
                <input
                  id="time"
                  v-model="appointmentTime"
                  type="time"
                  required
                  class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="errors.starts_at ? 'border-red-300' : 'border-gray-300'"
                />
              </div>
            </div>

            <div class="mt-6">
              <label for="status" class="block text-sm font-medium text-gray-700"> Status </label>
              <select
                id="status"
                v-model="form.status"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div class="mt-6">
              <label for="notes" class="block text-sm font-medium text-gray-700"> Notes </label>
              <textarea
                id="notes"
                v-model="form.notes"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Any additional notes or special requirements..."
              ></textarea>
            </div>
          </section>

          <!-- Property Selection -->
          <section>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Property Selection</h2>

            <div>
              <label for="property_search" class="block text-sm font-medium text-gray-700"> Search Properties </label>
              <input
                id="property_search"
                v-model="propertySearch"
                @input="searchProperties"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by title or postcode..."
              />
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"> Select Property * </label>

              <div v-if="propertiesStore.loading" class="flex justify-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>

              <div v-else-if="propertiesStore.properties.length === 0" class="text-center py-4 text-gray-500">
                No properties found. Try a different search term.
              </div>

              <div v-else class="grid gap-3 max-h-64 overflow-y-auto">
                <label
                  v-for="property in propertiesStore.properties"
                  :key="property.id"
                  class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  :class="form.property_id === property.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
                >
                  <input
                    v-model="form.property_id"
                    :value="property.id"
                    type="radio"
                    name="property"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div class="ml-3 flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ property.title }}</div>
                    <div class="text-sm text-gray-500">{{ property.parish }} • {{ property.postcode }}</div>
                  </div>
                </label>
              </div>

              <p v-if="errors.property_id" class="mt-1 text-sm text-red-600">
                {{ errors.property_id }}
              </p>
            </div>
          </section>

          <!-- Customer Information (Read-only) -->
          <section>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span class="block text-sm font-medium text-gray-700">Name</span>
                  <p class="mt-1 text-sm text-gray-900">
                    {{ appointment.customer.first_name }} {{ appointment.customer.last_name }}
                  </p>
                </div>
                <div>
                  <span class="block text-sm font-medium text-gray-700">Email</span>
                  <p class="mt-1 text-sm text-gray-900">{{ appointment.customer.email }}</p>
                </div>
                <div v-if="appointment.customer.phone">
                  <span class="block text-sm font-medium text-gray-700">Phone</span>
                  <p class="mt-1 text-sm text-gray-900">{{ appointment.customer.phone }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Error Display -->
          <div v-if="appointmentsStore.error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ appointmentsStore.error }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3">
            <router-link
              to="/dashboard"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              :disabled="appointmentsStore.loading || !isFormValid"
              class="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ appointmentsStore.loading ? 'Updating...' : 'Update Appointment' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppointmentsStore } from '../stores/appointments';
import { usePropertiesStore } from '../stores/properties';
import { useNotificationsStore } from '../stores/notifications';
import { format, parseISO } from 'date-fns';

const router = useRouter();
const route = useRoute();
const appointmentsStore = useAppointmentsStore();
const propertiesStore = usePropertiesStore();
const notificationsStore = useNotificationsStore();

const appointmentId = route.params.id as string;
const loading = ref(true);
const appointment = ref<any>(null);

const form = ref({
  property_id: '',
  starts_at: '',
  notes: '',
  status: 'SCHEDULED' as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED',
});

const errors = ref({
  property_id: '',
  starts_at: '',
});

const appointmentDate = ref('');
const appointmentTime = ref('');
const propertySearch = ref('');

const today = computed(() => format(new Date(), 'yyyy-MM-dd'));

const isFormValid = computed(() => {
  return (
    form.value.property_id &&
    appointmentDate.value &&
    appointmentTime.value &&
    !Object.values(errors.value).some((error) => error)
  );
});

watch([appointmentDate, appointmentTime], () => {
  if (appointmentDate.value && appointmentTime.value) {
    const localDateTime = new Date(`${appointmentDate.value}T${appointmentTime.value}`);
    form.value.starts_at = localDateTime.toISOString();
  }
});

const validatePropertyId = (propertyId: string) => {
  if (!propertyId) {
    return 'Please select a property';
  }
  return '';
};

const validateStartsAt = () => {
  if (!appointmentDate.value || !appointmentTime.value) {
    return 'Please select date and time';
  }

  const appointmentDateTime = new Date(`${appointmentDate.value}T${appointmentTime.value}`);
  const now = new Date();

  if (appointmentDateTime <= now) {
    return 'Appointment must be in the future';
  }

  return '';
};

const validateForm = () => {
  errors.value.property_id = validatePropertyId(form.value.property_id);
  errors.value.starts_at = validateStartsAt();
};

const searchProperties = () => {
  propertiesStore.fetchProperties(propertySearch.value);
};

const loadAppointment = async () => {
  try {
    loading.value = true;

    // Fetch appointments if not already loaded
    if (appointmentsStore.appointments.length === 0) {
      await appointmentsStore.fetchAppointments();
    }

    appointment.value = appointmentsStore.getAppointmentById(appointmentId);

    if (appointment.value) {
      // Populate form with existing data
      form.value.property_id = appointment.value.property_id;
      form.value.notes = appointment.value.notes || '';
      form.value.status = appointment.value.status;

      // Parse the appointment date/time
      const appointmentDateTime = parseISO(appointment.value.starts_at);
      appointmentDate.value = format(appointmentDateTime, 'yyyy-MM-dd');
      appointmentTime.value = format(appointmentDateTime, 'HH:mm');
    }
  } catch (error) {
    console.error('Failed to load appointment:', error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  validateForm();

  if (!isFormValid.value) return;

  const updateData: any = {
    starts_at: form.value.starts_at,
    status: form.value.status,
  };

  if (form.value.property_id !== appointment.value.property_id) {
    updateData.property_id = form.value.property_id;
  }

  if (form.value.notes !== appointment.value.notes) {
    updateData.notes = form.value.notes || undefined;
  }

  const result = await appointmentsStore.updateAppointment(appointmentId, updateData);

  if (result.success) {
    notificationsStore.success('Appointment Updated', 'Appointment has been updated successfully');
    router.push('/dashboard');
  } else {
    notificationsStore.error('Update Failed', result.error || 'Failed to update appointment');
  }
};

onMounted(() => {
  loadAppointment();
  propertiesStore.fetchProperties();
});
</script>
