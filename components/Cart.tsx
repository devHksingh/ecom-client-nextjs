'use client'
import { useAppStore } from '@/lib/hooks'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
// import React, { useEffect, useState } from 'react'

const Cart = () => {
    // const [isLogin,setIsLogin] = useState(false)
    
    const store = useAppStore()
    const {cart} = store.getState()
    // useEffect(()=>{
    //     if(auth.isLogin && auth.accessToken && auth.refreshToken){
    //         setIsLogin(true)
    //     }
    // },[auth.refreshToken, auth.isLogin, auth.accessToken])
    console.log("cart",cart)
  return (
    <div className='relative '>
        <Link href={'/cart'}><ShoppingCart className={`${cart.length?'fill-amber-400':''}`} stroke='#f6ae43'/></Link>
        <span className=' absolute inset-x-4.5 -top-2.5 mt[-80px] text-red-500 font-medium text-sm'>{cart.length || ''}</span>
    </div>
  )
}

export default Cart