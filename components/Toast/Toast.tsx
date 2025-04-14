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
  const [progress, setProgress] = useState(100);
  //   const timeRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const remaingTimeRef = useRef<number>(toast.duration);
  const startTimeRef = useRef<number>(Date.now());
  const dispatch = useAppDispatch();

  //   useEffect(() => {
  //     // Clear any existing interval when component mounts or isPaused changes
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //     if (!isPaused) {
  //       //
  //       startTimeRef.current = Date.now();

  //       const interval = 10;
  //       intervalRef.current = setInterval(() => {
  //         const elapsedTime = Date.now() - startTimeRef.current;
  //         const timeUsed = Math.min(elapsedTime, remaingTimeRef.current);
  //         // updating remaing time
  //         remaingTimeRef.current = remaingTimeRef.current - timeUsed;
  //         // cal progress based on remaining time
  //         const newProgress = Math.max(
  //           0,
  //           (remaingTimeRef.current / toast.duration) * 100
  //         );
  //         setProgress(newProgress);
  //         // remove toast on timer complete
  //         if (newProgress <= 0) {
  //           if (intervalRef.current) clearInterval(intervalRef.current);
  //           dispatch(removeToast({ id: toast.id }));
  //         }
  //       }, interval);
  //     } else {
  //       // when paused cal and store the remaing time
  //       const elapsedTime = Date.now() - startTimeRef.current;
  //       remaingTimeRef.current = Math.max(
  //         0,
  //         remaingTimeRef.current - elapsedTime
  //       );
  //     }
  //     // on unmount
  //     return ()=>{
  //         if(intervalRef.current){
  //             clearInterval(intervalRef.current)
  //         }
  //     }
  //   }, [dispatch, isPaused, toast.duration, toast.id]);

  //   useEffect(() => {
  //     if (!isPaused) {
  //       timeRef.current = setTimeout(() => {
  //         dispatch(removeToast({ id: toast.id }));
  //       }, toast.duration);
  //     }
  //   }, [dispatch, isPaused, toast.duration, toast.id]);

  const handleClose = () => {
    dispatch(removeToast({ id: toast.id }));
  };

  const getToastClasses = () => {
    const baseClasses = `relative rounded-md p-4 mb-3 shadow-lg flex items-start w-full max-w-sm`;
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
  const getprogressBar = () => {
    switch (toast.type) {
      case "success":
        return `bg-green-400 absolute bottom-0 left-0 h-1 transition-all duration-300 ease-linear `;
      case "error":
        return `bg-red-400 absolute bottom-0 left-0 h-1 transition-all duration-300 ease-linear`;
      case "info":
        return `bg-blue-400 absolute bottom-0 left-0 h-1 transition-all duration-300 ease-linear`;
      case "default":
        return `bg-gray-400 absolute bottom-0 left-0 h-1 transition-all duration-300 ease-linear`;
    }
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
    // remaingTimeRef.current = toast.duration;

    const startProgress = () => {
      const interval = 10; // Update progress every 10ms
      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        // Calculate how much time has passed since last start/resume
        const timeUsed = Math.min(elapsedTime, remaingTimeRef.current);
        // Update remaining time
        remaingTimeRef.current = remaingTimeRef.current - timeUsed;
        const newProgress = Math.max(
          0,
          100 - (elapsedTime / toast.duration) * 100
        );

        setProgress(newProgress);
        //
        if (newProgress <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          dispatch(removeToast({ id: toast.id }));
        }
      }, interval);
    };
    if (!isPaused) {
      startProgress();
    } else {
      // when paused cal and store the remaing time
      const elapsedTime = Date.now() - startTimeRef.current;
      remaingTimeRef.current = Math.max(
        0,
        remaingTimeRef.current - elapsedTime
      );
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, isPaused, toast.duration, toast.id]);

  return (
    <div
      className={getToastClasses()}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
    >
      {/* Progress bar */}
      <div className={getprogressBar()} style={{ width: `${progress}%` }}></div>
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
