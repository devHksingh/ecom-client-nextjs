'use client'
import { useAppSelector } from '@/lib/hooks'
import React from 'react'
import Toast from './Toast'

const ToastContainer = () => {
    const toasts = useAppSelector((state)=>state.toast)
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastContainer