import { toast } from "sonner";

export function showError(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 4000,
  });
}

export function showSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

export function showWarning(message: string, description?: string) {
  toast.warning(message, {
    description,
    duration: 4000,
  });
}

export function showInfo(message: string, description?: string) {
  toast.info(message, {
    description,
    duration: 3000,
  });
}

export function showLoading(message: string) {
  const id = toast.loading(message);
  return id;
}

export function dismissToast(id: string | number) {
  toast.dismiss(id);
}
