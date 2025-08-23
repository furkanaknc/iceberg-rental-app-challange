import { defineStore } from 'pinia';
import { ref } from 'vue';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const useConfirmationStore = defineStore('confirmation', () => {
  const isVisible = ref(false);
  const options = ref<ConfirmationOptions>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
  });

  let resolvePromise: ((value: boolean) => void) | null = null;

  const show = (confirmationOptions: ConfirmationOptions): Promise<boolean> => {
    options.value = {
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      type: 'info',
      ...confirmationOptions,
    };
    isVisible.value = true;

    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });
  };

  const confirm = () => {
    isVisible.value = false;
    if (resolvePromise) {
      resolvePromise(true);
      resolvePromise = null;
    }
  };

  const cancel = () => {
    isVisible.value = false;
    if (resolvePromise) {
      resolvePromise(false);
      resolvePromise = null;
    }
  };

  return {
    isVisible,
    options,
    show,
    confirm,
    cancel,
  };
});
