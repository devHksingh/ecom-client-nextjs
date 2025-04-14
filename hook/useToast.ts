import { useAppDispatch } from '@/lib/hooks'
import { addToast, ToastType } from '@/lib/store/features/toast/toast.Slice'


const useToast = () => {
    const dispatch = useAppDispatch()
    const toast = (type: ToastType, title: string, content: string, duration?: number) => {
        dispatch(addToast({ type, title, content, duration }))
    }
    return {
        success: (title: string, content: string, duration?: number) => toast('success', title, content, duration),
        error: (title: string, content: string, duration?: number) => toast('error', title, content, duration),
        info: (title: string, content: string, duration?: number) => toast('info', title, content, duration),
        default: (title: string, content: string, duration?: number) => toast('default', title, content, duration),

    }

}

export default useToast