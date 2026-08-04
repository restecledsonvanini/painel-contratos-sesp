import { toast as sonnerToast } from 'sonner';

export function useToast() {
  return {
    success: (message: string, description?: string) =>
      sonnerToast.success(message, description ? { description } : undefined),
    error: (message: string, description?: string) =>
      sonnerToast.error(message, description ? { description } : undefined),
    info: (message: string, description?: string) =>
      sonnerToast.info(message, description ? { description } : undefined),
    dismiss: sonnerToast.dismiss,
  };
}

export { sonnerToast as toast };
