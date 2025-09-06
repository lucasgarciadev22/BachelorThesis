import { AlertTriangle, CheckCircle, Info, Loader2, XCircle } from "lucide-react";

const toastBaseClasses =
  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm shadow-md" as const

export const variants = {
  success: {
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    className: `${toastBaseClasses} bg-green-50 text-green-800 border border-green-200`,
  },
  info: {
    icon: <Info className="h-4 w-4 text-blue-600" />,
    className: `${toastBaseClasses} bg-blue-50 text-blue-800 border border-blue-200`,
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
    className: `${toastBaseClasses} bg-yellow-50 text-yellow-800 border border-yellow-200`,
  },
  error: {
    icon: <XCircle className="h-4 w-4 text-red-600" />,
    className: `${toastBaseClasses} bg-red-50 text-red-800 border border-red-200`,
  },
  loading: {
    icon: <Loader2 className="h-4 w-4 animate-spin text-blue-600" />,
    className: `${toastBaseClasses} bg-blue-50 text-blue-800 border border-blue-200`,
  },
}