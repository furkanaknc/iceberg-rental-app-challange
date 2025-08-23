<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span class="text-sm font-medium text-blue-600">
              {{ appointment.customer?.first_name?.[0] || '?' }}{{ appointment.customer?.last_name?.[0] || '?' }}
            </span>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-gray-900">
              {{ appointment.customer?.first_name || 'Unknown' }} {{ appointment.customer?.last_name || 'Customer' }}
            </h3>
            <p class="text-sm text-gray-500">{{ appointment.customer?.email || 'No email' }}</p>
          </div>
        </div>

        <!-- Actions Dropdown -->
        <div class="relative" @click.stop>
          <button
            @click="showDropdown = !showDropdown"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            :class="{ 'bg-gray-100 text-gray-600': showDropdown }"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          <Transition name="dropdown">
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
              @click.stop
            >
              <div class="py-1">
                <button
                  @click="handleEdit"
                  class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                  Edit Appointment
                </button>
                <button
                  @click="handleDelete"
                  class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  Delete Appointment
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Property Info -->
      <div class="mb-4">
        <div class="flex items-center text-sm text-gray-600 mb-2">
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span class="font-medium">{{ appointment.property?.title || 'Unknown Property' }}</span>
        </div>
        <p class="text-sm text-gray-500 ml-6">
          {{ appointment.property?.parish || 'Unknown' }} • {{ appointment.property?.postcode || 'Unknown' }}
        </p>
      </div>

      <!-- Appointment Time -->
      <div class="mb-4">
        <div class="flex items-center text-sm text-gray-600 mb-2">
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-medium">{{ formatAppointmentDate(appointment.starts_at) }}</span>
        </div>
        <p class="text-sm text-gray-500 ml-6">
          {{ formatTime(appointment.starts_at) }}
        </p>
      </div>

      <!-- Travel Info -->
      <div v-if="appointment.departure_time || appointment.available_again_time" class="mb-4 bg-gray-50 rounded-lg p-3">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Travel Schedule</h4>

        <div class="space-y-2 text-xs">
          <div v-if="appointment.departure_time" class="flex items-center justify-between">
            <span class="text-gray-600">Departure:</span>
            <span class="font-medium">{{ formatTime(appointment.departure_time) }}</span>
          </div>

          <div v-if="appointment.distance_km" class="flex items-center justify-between">
            <span class="text-gray-600">Distance:</span>
            <span class="font-medium">{{ appointment.distance_km }}km</span>
          </div>

          <div v-if="appointment.travel_duration_min" class="flex items-center justify-between">
            <span class="text-gray-600">Travel time:</span>
            <span class="font-medium">{{ appointment.travel_duration_min }} min</span>
          </div>

          <div v-if="appointment.available_again_time" class="flex items-center justify-between">
            <span class="text-gray-600">Available again:</span>
            <span class="font-medium">{{
              formatDateTimeAvailableAgain(appointment.available_again_time, appointment.starts_at)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="appointment.notes" class="mb-4">
        <h4 class="text-sm font-medium text-gray-900 mb-1">Notes</h4>
        <p class="text-sm text-gray-600">{{ appointment.notes }}</p>
      </div>

      <!-- Status -->
      <div class="flex items-center justify-between">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="getStatusClass(appointment.status)"
        >
          {{ appointment.status }}
        </span>

        <div class="text-xs text-gray-500">
          {{ appointment.customer?.phone || 'No phone' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { format, parseISO } from 'date-fns';

interface Appointment {
  id: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  property: {
    title: string;
    parish: string;
    postcode: string;
  };
  starts_at: string;
  departure_time?: string;
  available_again_time?: string;
  distance_km?: number;
  travel_duration_min?: number;
  status: string;
  notes?: string;
}

interface Props {
  appointment: Appointment;
}

interface Emits {
  (e: 'edit', appointmentId: string): void;
  (e: 'delete', appointmentId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showDropdown = ref(false);

const formatAppointmentDate = (dateTime: string) => {
  try {
    const date = parseISO(dateTime);
    return format(date, 'PPP');
  } catch {
    return dateTime;
  }
};

const formatTime = (dateTime: string) => {
  try {
    const date = parseISO(dateTime);
    return format(date, 'p');
  } catch {
    return dateTime;
  }
};

const formatDateTimeAvailableAgain = (dateTime: string, referenceDate: string) => {
  try {
    const date = parseISO(dateTime);
    const refDate = parseISO(referenceDate);

    if (format(date, 'yyyy-MM-dd') === format(refDate, 'yyyy-MM-dd')) {
      return format(date, 'p');
    }

    return format(date, 'MMM d, p');
  } catch {
    return dateTime;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const handleEdit = () => {
  emit('edit', props.appointment.id);
  showDropdown.value = false;
};

const handleDelete = () => {
  emit('delete', props.appointment.id);
  showDropdown.value = false;
};

const handleClickOutside = (event: Event) => {
  const target = event.target as Element;
  if (!target.closest('.relative')) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@media (max-width: 768px) {
  .relative {
    position: static;
  }

  .absolute {
    position: fixed !important;
    right: 1rem !important;
    top: auto !important;
    bottom: auto !important;
    margin-top: 0 !important;
    z-index: 1000;
  }

  .w-48 {
    width: calc(100vw - 2rem);
    max-width: 280px;
  }
}
</style>
