<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">Welcome back, {{ authStore.fullName }}!</p>
      </div>
      <!-- Loading State -->
      <div v-if="appointmentsStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="appointmentsStore.error" class="rounded-md bg-red-50 p-4 mb-6">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ appointmentsStore.error }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-8">
        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ authStore.isAdmin ? 'All Upcoming Appointments' : 'Your Upcoming Appointments' }}
            </h2>
            <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {{ appointmentsStore.upcomingAppointments.length }} scheduled
            </span>
          </div>

          <div v-if="appointmentsStore.upcomingAppointments.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No upcoming appointments</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new appointment.</p>
            <div class="mt-6">
              <router-link
                to="/appointments/new"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Appointment
              </router-link>
            </div>
          </div>

          <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AppointmentCard
              v-for="appointment in appointmentsStore.upcomingAppointments"
              :key="appointment.id"
              :appointment="appointment"
              @edit="editAppointment"
              @delete="deleteAppointment"
            />
          </div>
        </section>

        <section v-if="appointmentsStore.pastAppointments.length > 0">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ authStore.isAdmin ? 'All Recent Appointments' : 'Your Recent Appointments' }}
          </h2>

          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
              <li
                v-for="appointment in appointmentsStore.pastAppointments.slice(0, 5)"
                :key="appointment.id"
                class="px-6 py-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ appointment.customer?.first_name?.[0] || '?'
                          }}{{ appointment.customer?.last_name?.[0] || '?' }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ appointment.customer?.first_name || 'Unknown' }}
                        {{ appointment.customer?.last_name || 'Customer' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ appointment.property?.title || 'Unknown Property' }} •
                        {{ appointment.property?.postcode || 'Unknown' }}
                      </div>
                      <div v-if="authStore.isAdmin" class="text-sm text-blue-600">
                        Agent: {{ appointment.agent?.first_name || 'Unknown' }}
                        {{ appointment.agent?.last_name || 'Agent' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ appointmentsStore.formatAppointmentTime(appointment.starts_at) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(appointment.status)"
                    >
                      {{ appointment.status }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAppointmentsStore } from '../stores/appointments';
import { useConfirmationStore } from '../stores/confirmation';
import { useNotificationsStore } from '../stores/notifications';
import AppointmentCard from '../components/AppointmentCard.vue';

const router = useRouter();
const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();
const confirmationStore = useConfirmationStore();
const notificationsStore = useNotificationsStore();

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

const editAppointment = (appointmentId: string) => {
  router.push(`/appointments/${appointmentId}/edit`);
};

const deleteAppointment = async (appointmentId: string) => {
  const confirmed = await confirmationStore.show({
    title: 'Delete Appointment',
    message: 'Are you sure you want to delete this appointment? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'danger',
  });

  if (confirmed) {
    const result = authStore.isAdmin
      ? await appointmentsStore.adminDeleteAppointment(appointmentId)
      : await appointmentsStore.deleteAppointment(appointmentId);

    if (result.success) {
      notificationsStore.success('Appointment Deleted', 'Appointment has been deleted successfully');
    } else {
      notificationsStore.error('Deletion Failed', result.error || 'Failed to delete appointment');
    }
  }
};

onMounted(() => {
  const isAdmin = authStore.isAdmin;
  appointmentsStore.fetchAppointments(isAdmin);
});
</script>

<style scoped>
@media (max-width: 768px) {
  .min-h-screen {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

@media (max-width: 768px) {
  .flex.items-center.justify-between {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .bg-blue-100 {
    align-self: center;
    text-align: center;
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .space-y-8 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1.5rem;
  }

  .inline-flex {
    min-height: 44px;
    padding: 0.75rem 1rem;
  }

  .text-3xl {
    font-size: 1.75rem;
  }

  .text-2xl {
    font-size: 1.5rem;
    text-align: center;
  }

  .bg-blue-100 {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    min-width: 140px;
  }
}
</style>
