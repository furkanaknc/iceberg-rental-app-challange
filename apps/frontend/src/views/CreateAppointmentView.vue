<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Create New Appointment</h1>
            <p class="mt-1 text-sm text-gray-600">Schedule a property viewing appointment</p>
          </div>
          <router-link to="/dashboard" class="text-gray-500 hover:text-gray-700 text-sm font-medium">
            ← Back to Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow rounded-lg">
        <form @submit.prevent="handleSubmit" class="space-y-8 p-6">
          <!-- Customer Information -->
          <section>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="first_name" class="block text-sm font-medium text-gray-700"> First Name * </label>
                <input
                  id="first_name"
                  v-model="form.customer.first_name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="errors.customer?.first_name ? 'border-red-300' : 'border-gray-300'"
                  placeholder="John"
                />
                <p v-if="errors.customer?.first_name" class="mt-1 text-sm text-red-600">
                  {{ errors.customer.first_name }}
                </p>
              </div>

              <div>
                <label for="last_name" class="block text-sm font-medium text-gray-700"> Last Name * </label>
                <input
                  id="last_name"
                  v-model="form.customer.last_name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="errors.customer?.last_name ? 'border-red-300' : 'border-gray-300'"
                  placeholder="Doe"
                />
                <p v-if="errors.customer?.last_name" class="mt-1 text-sm text-red-600">
                  {{ errors.customer.last_name }}
                </p>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700"> Email Address * </label>
                <input
                  id="email"
                  v-model="form.customer.email"
                  type="email"
                  required
                  class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="errors.customer?.email ? 'border-red-300' : 'border-gray-300'"
                  placeholder="john.doe@email.com"
                />
                <p v-if="errors.customer?.email" class="mt-1 text-sm text-red-600">
                  {{ errors.customer.email }}
                </p>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700"> Phone Number </label>
                <input
                  id="phone"
                  v-model="form.customer.phone"
                  type="tel"
                  class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="errors.customer?.phone ? 'border-red-300' : 'border-gray-300'"
                  placeholder="+1234567890"
                />
                <p v-if="errors.customer?.phone" class="mt-1 text-sm text-red-600">
                  {{ errors.customer.phone }}
                </p>
              </div>
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
              {{ appointmentsStore.loading ? 'Creating...' : 'Create Appointment' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppointmentsStore } from '../stores/appointments';
import { usePropertiesStore } from '../stores/properties';
import { useNotificationsStore } from '../stores/notifications';
import { format } from 'date-fns';

const router = useRouter();
const appointmentsStore = useAppointmentsStore();
const propertiesStore = usePropertiesStore();
const notificationsStore = useNotificationsStore();

const form = ref({
  customer: {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  },
  property_id: '',
  starts_at: '',
  notes: '',
});

const errors = ref({
  customer: {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  },
  property_id: '',
  starts_at: '',
});

const appointmentDate = ref('');
const appointmentTime = ref('');
const propertySearch = ref('');

const today = computed(() => format(new Date(), 'yyyy-MM-dd'));

const isFormValid = computed(() => {
  return (
    form.value.customer.first_name.trim() &&
    form.value.customer.last_name.trim() &&
    form.value.customer.email.trim() &&
    form.value.property_id &&
    appointmentDate.value &&
    appointmentTime.value &&
    !Object.values(errors.value).some((error) =>
      typeof error === 'string' ? error : Object.values(error).some((e) => e),
    )
  );
});

watch([appointmentDate, appointmentTime], () => {
  if (appointmentDate.value && appointmentTime.value) {
    const localDateTime = new Date(`${appointmentDate.value}T${appointmentTime.value}`);
    form.value.starts_at = localDateTime.toISOString();
  }
  errors.value.starts_at = validateStartsAt();
});

watch(
  () => form.value.customer.first_name,
  () => {
    errors.value.customer.first_name = validateCustomerFirstName(form.value.customer.first_name);
  },
);

watch(
  () => form.value.customer.last_name,
  () => {
    errors.value.customer.last_name = validateCustomerLastName(form.value.customer.last_name);
  },
);

watch(
  () => form.value.customer.email,
  () => {
    errors.value.customer.email = validateCustomerEmail(form.value.customer.email);
  },
);

watch(
  () => form.value.customer.phone,
  () => {
    errors.value.customer.phone = validateCustomerPhone(form.value.customer.phone);
  },
);

watch(
  () => form.value.property_id,
  () => {
    errors.value.property_id = validatePropertyId(form.value.property_id);
  },
);

const validateCustomerFirstName = (name: string) => {
  if (!name.trim()) {
    return 'First name is required';
  }
  if (name.length < 3) {
    return 'First name must be at least 3 characters';
  }
  return '';
};

const validateCustomerLastName = (name: string) => {
  if (!name.trim()) {
    return 'Last name is required';
  }
  if (name.length < 3) {
    return 'Last name must be at least 3 characters';
  }
  return '';
};

const validateCustomerEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

const validateCustomerPhone = (phone: string) => {
  if (phone && phone.length < 10) {
    return 'Phone number must be at least 10 characters';
  }
  return '';
};

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
  errors.value.customer.first_name = validateCustomerFirstName(form.value.customer.first_name);
  errors.value.customer.last_name = validateCustomerLastName(form.value.customer.last_name);
  errors.value.customer.email = validateCustomerEmail(form.value.customer.email);
  errors.value.customer.phone = validateCustomerPhone(form.value.customer.phone);
  errors.value.property_id = validatePropertyId(form.value.property_id);
  errors.value.starts_at = validateStartsAt();
};

const searchProperties = () => {
  propertiesStore.fetchProperties(propertySearch.value);
};

const handleSubmit = async () => {
  validateForm();

  if (!isFormValid.value) return;

  appointmentsStore.error = null;

  const result = await appointmentsStore.createAppointment({
    customer: {
      first_name: form.value.customer.first_name,
      last_name: form.value.customer.last_name,
      email: form.value.customer.email,
      phone: form.value.customer.phone || undefined,
    },
    property_id: form.value.property_id,
    starts_at: form.value.starts_at,
    notes: form.value.notes || undefined,
  });

  if (result.success) {
    notificationsStore.success('Appointment Created', 'Appointment has been created successfully');
    router.push('/dashboard');
  } else {
    notificationsStore.error('Creation Failed', result.error || 'Failed to create appointment');
  }
};

onMounted(() => {
  propertiesStore.fetchProperties();
});
</script>
