import { variants } from "@/components/ui/toast"
import { toast, type ExternalToast } from "sonner"

export const Duration = {
  Short: 3000,
  Medium: 5000,
  Long: 8000,
  Infinite: Infinity,
} as const;

export const toastUtils = {
  message: (message: string, data?:ExternalToast) =>
    toast.message(message, {
        duration: data?.duration??Duration.Short,
        className:data?.className?? variants.info.className,
        ...data,
    }),
  success: (message: string, data?:ExternalToast) =>
    toast.success(message, {
        duration: data?.duration??Duration.Short,
        icon: data?.icon??variants.success.icon,
        className: data?.className??variants.success.className,
        ...data,
    }),
  info: (message: string, data?:ExternalToast) =>
    toast.info(message, {
        duration: data?.duration??Duration.Short,
        icon: data?.icon??variants.info.icon,
        className: data?.className??variants.info.className,
        ...data,
    }),
  warning: (message: string, data?:ExternalToast) =>
    toast.warning(message, {
        duration: data?.duration??Duration.Short,
        icon: data?.icon??variants.warning.icon,
        className: data?.className??variants.warning.className,
        ...data,
    }),
  error: (message: string, data?:ExternalToast) =>
    toast.error(message, {
        duration: data?.duration??Duration.Short,
        icon: data?.icon??variants.error.icon,
        className: data?.className??variants.error.className,
        ...data,
    }),
  loading:(message: string, data?:ExternalToast) =>  
    toast.loading(message, {
      icon: variants.loading.icon,
      className: variants.loading.className,
      duration:data?.duration??Duration.Infinite,
      closeButton: data?.closeButton??true,
      cancel: data?.cancel,
      ...data,
    }),
}