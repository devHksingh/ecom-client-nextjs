import { useAppStore } from '@/lib/hooks'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Wishlist = () => {
    const store = useAppStore()
    const {wishList} = store.getState()
  return (
    
    <div className='relative '>
        <Link href={'/wishList'}><Heart  className={`${wishList.length?'fill-red-400':''}`} stroke='#6f1919'/></Link>
        <span className=' absolute inset-x-4.5 -top-2.5 mt[-80px] text-red-500 font-medium text-sm'>{wishList.length || ''}</span>
    </div>
        
    
  )
}

export default Wishlist