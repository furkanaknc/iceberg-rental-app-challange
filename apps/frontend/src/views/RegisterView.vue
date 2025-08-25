<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your agent account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">Join our real estate team</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="first_name"
                v-model="form.first_name"
                name="first_name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="errors.first_name ? 'border-red-300' : 'border-gray-300'"
                placeholder="John"
              />
              <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
            </div>

            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="last_name"
                v-model="form.last_name"
                name="last_name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="errors.last_name ? 'border-red-300' : 'border-gray-300'"
                placeholder="Doe"
              />
              <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="errors.email ? 'border-red-300' : 'border-gray-300'"
              placeholder="john.doe@email.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="errors.phone ? 'border-red-300' : 'border-gray-300'"
              placeholder="+1234567890"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="errors.password ? 'border-red-300' : 'border-gray-300'"
              placeholder="Password"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            <p class="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters long and contain uppercase, lowercase, number, and special
              character.
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="errors.confirmPassword ? 'border-red-300' : 'border-gray-300'"
              placeholder="Confirm Password"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>
        </div>

        <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ authStore.error }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading || !isFormValid"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <span v-if="authStore.loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500"> Sign in here </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const errors = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const isFormValid = computed(() => {
  return (
    Object.values(form.value).every((value) => value.trim()) && Object.values(errors.value).every((error) => !error)
  );
});

const validateFirstName = (name: string) => {
  if (!name.trim()) {
    return 'First name is required';
  }
  if (name.length < 3) {
    return 'First name must be at least 3 characters';
  }
  return '';
};

const validateLastName = (name: string) => {
  if (!name.trim()) {
    return 'Last name is required';
  }
  if (name.length < 3) {
    return 'Last name must be at least 3 characters';
  }
  return '';
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

const validatePhone = (phone: string) => {
  if (!phone.trim()) {
    return 'Phone number is required';
  }
  if (phone.length < 10) {
    return 'Phone number must be at least 10 characters';
  }
  return '';
};

const validatePassword = (password: string) => {
  if (!password.trim()) {
    return 'Password is required';
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).{8,}$/;
  if (!passwordRegex.test(password)) {
    return 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character';
  }
  return '';
};

const validateConfirmPassword = (confirmPassword: string, password: string) => {
  if (!confirmPassword.trim()) {
    return 'Please confirm your password';
  }
  if (confirmPassword !== password) {
    return 'Passwords do not match';
  }
  return '';
};

const validateForm = () => {
  errors.value.first_name = validateFirstName(form.value.first_name);
  errors.value.last_name = validateLastName(form.value.last_name);
  errors.value.email = validateEmail(form.value.email);
  errors.value.phone = validatePhone(form.value.phone);
  errors.value.password = validatePassword(form.value.password);
  errors.value.confirmPassword = validateConfirmPassword(form.value.confirmPassword, form.value.password);
};

// Real-time validation
watch(
  () => form.value.first_name,
  (newValue) => {
    errors.value.first_name = validateFirstName(newValue);
  },
);

watch(
  () => form.value.last_name,
  (newValue) => {
    errors.value.last_name = validateLastName(newValue);
  },
);

watch(
  () => form.value.email,
  (newValue) => {
    errors.value.email = validateEmail(newValue);
  },
);

watch(
  () => form.value.phone,
  (newValue) => {
    errors.value.phone = validatePhone(newValue);
  },
);

watch(
  () => form.value.password,
  (newValue) => {
    errors.value.password = validatePassword(newValue);
    // Also revalidate confirm password when password changes
    if (form.value.confirmPassword) {
      errors.value.confirmPassword = validateConfirmPassword(form.value.confirmPassword, newValue);
    }
  },
);

watch(
  () => form.value.confirmPassword,
  (newValue) => {
    errors.value.confirmPassword = validateConfirmPassword(newValue, form.value.password);
  },
);

const handleRegister = async () => {
  validateForm();

  if (!isFormValid.value) return;

  const result = await authStore.register({
    first_name: form.value.first_name,
    last_name: form.value.last_name,
    email: form.value.email,
    phone: form.value.phone,
    password: form.value.password,
  });

  if (result.success) {
    router.push('/dashboard');
  }
};
</script>
