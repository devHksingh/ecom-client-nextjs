"use client";
import { useAppDispatch } from "@/lib/hooks";
import {
  removeToast,
  ToastProps,
} from "@/lib/store/features/toast/toast.Slice";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ToastType {
  toast: ToastProps;
}

const Toast = ({ toast }: ToastType) => {
  const [isPaused, setIsPaused] = useState(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isPaused) {
      timeRef.current = setTimeout(() => {
        dispatch(removeToast({ id: toast.id }));
      }, toast.duration);
    }
  }, [dispatch, isPaused, toast.duration, toast.id]);

  const handleClose = () => {
    dispatch(removeToast({ id: toast.id }));
  };

  const getToastClasses = () => {
    const baseClasses = `rounded-md p-4 mb-3 shadow-lg flex items-start w-full max-w-sm`;
    switch (toast.type) {
      case "success":
        return `${baseClasses} bg-green-50 border-l-4 border-green-500`;
      case "error":
        return `${baseClasses} bg-red-50 border-l-4 border-red-500`;
      case "info":
        return `${baseClasses} bg-blue-50 border-l-4 border-blue-500`;
      case "default":
        return `${baseClasses} bg-gray-50 border-l-4 border-gray-500`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div
      className={getToastClasses()}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">{getIcon()}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-medium text-sm">{toast.title}</p>
          <button
            onClick={handleClose}
            aria-label="close"
            className="ml-4 bg-transparent p-0"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <div className="mt-1 text-sm text-gray-600">{toast.content}</div>
      </div>
    </div>
  );
};

export default Toast;
