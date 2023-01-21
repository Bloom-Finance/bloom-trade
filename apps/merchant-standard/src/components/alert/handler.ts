import { AlertStore } from '../../store/alert.store';

export const showAlert = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' | null,
  callback?: any
) => {
  AlertStore.update((s) => {
    s.message = message;
    s.type = type;
    s.callback = callback;
  });
};
