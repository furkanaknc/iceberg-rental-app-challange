import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '../services/api';
import { format, parseISO } from 'date-fns';
import { Appointment, CreateAppointmentData, UpdateAppointmentData } from './interfaces/appointments.interface';

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getErrorMessage = (err: any, defaultMessage: string): string => {
    return err.response?.data?.error?.message || err.response?.data?.message || err.message || defaultMessage;
  };

  const upcomingAppointments = computed(() => {
    const now = new Date();
    return appointments.value
      .filter((appointment) => appointment.status === 'SCHEDULED' && new Date(appointment.starts_at) >= now)
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  });

  const pastAppointments = computed(() => {
    const now = new Date();
    return appointments.value
      .filter((appointment) => new Date(appointment.starts_at) < now)
      .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());
  });

  const formatAppointmentTime = (dateTime: string) => {
    try {
      const date = parseISO(dateTime);
      return format(date, 'PPP p');
    } catch {
      return dateTime;
    }
  };

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

  const fetchAppointments = async (isAdmin = false) => {
    try {
      loading.value = true;
      error.value = null;

      const endpoint = isAdmin ? '/admin/appointments' : '/appointments/schedule';
      const response = await apiService.get(endpoint);
      appointments.value = response.data.items || response.data;
    } catch (err: any) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      loading.value = false;
    }
  };

  const createAppointment = async (appointmentData: CreateAppointmentData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await apiService.post('/appointments', appointmentData);
      const newAppointment = response.data;

      appointments.value.push(newAppointment);
      error.value = null;
      return { success: true, data: newAppointment };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to create appointment');
      console.error('Failed to create appointment:', err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const updateAppointment = async (id: string, updateData: UpdateAppointmentData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await apiService.patch(`/appointments/${id}`, updateData);
      const updatedAppointment = response.data;

      const index = appointments.value.findIndex((apt) => apt.id === id);
      if (index !== -1) {
        appointments.value[index] = updatedAppointment;
      }

      return { success: true, data: updatedAppointment };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to update appointment');
      console.error('Failed to update appointment:', err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      await apiService.delete(`/appointments/${id}`);

      appointments.value = appointments.value.filter((apt) => apt.id !== id);
      return { success: true };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to delete appointment');
      console.error('Failed to delete appointment:', err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const adminUpdateAppointment = async (id: string, updateData: UpdateAppointmentData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await apiService.patch(`/admin/appointments/${id}`, updateData);
      const updatedAppointment = response.data;

      const index = appointments.value.findIndex((apt) => apt.id === id);
      if (index !== -1) {
        appointments.value[index] = updatedAppointment;
      }

      return { success: true, data: updatedAppointment };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to update appointment');
      console.error('Failed to update appointment (admin):', err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const adminDeleteAppointment = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      await apiService.delete(`/admin/appointments/${id}`);

      appointments.value = appointments.value.filter((apt) => apt.id !== id);
      return { success: true };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to delete appointment');
      console.error('Failed to delete appointment (admin):', err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const getAppointmentById = (id: string) => {
    return appointments.value.find((apt) => apt.id === id);
  };

  return {
    appointments,
    loading,
    error,
    upcomingAppointments,
    pastAppointments,
    formatAppointmentTime,
    formatAppointmentDate,
    formatTime,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    adminUpdateAppointment,
    adminDeleteAppointment,
    getAppointmentById,
  };
});
