'use client'
import React, { useEffect, useRef, useState } from 'react'
import { CircleUserRound } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/lib/hooks'

const NavUser = () => {
  const [isUserLogin,setIsUserLogin] = useState(false)
  const [isOpen,setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null)
  const store = useAppStore()
  const {auth} = store.getState()
  const {isLogin,accessToken,refreshToken} = auth

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleLogout =()=>{
    // TODO: call logout api
  }

  useEffect(()=>{
    if(isLogin && accessToken && refreshToken){
      setIsUserLogin(true)
    }
  },[accessToken, isLogin, refreshToken])

  useEffect(()=>{
    const handleOutsideClick = (event: MouseEvent ) => {
          if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            closeModal();
            setIsOpen(false)
          }
        };
    if(isOpen){
      document.addEventListener('mousedown', handleOutsideClick);
    }
  },[isOpen])
  
  return (
    <div className=' '>
      <div className=' flex justify-center '>
          <button onClick={()=>{
            setIsOpen(!isOpen)
            openModal()
          }} className=' rounded-full  cursor-pointer'>
            <CircleUserRound className='hover:text-red-400'/>
          </button>
          
            {isOpen && isModalOpen && (
              <div className='top-12 z-40  bg-stone-50 absolute w-[20%] mx-auto p-1 rounded-md '
              ref={modalRef}
              >
                <p hidden={!isUserLogin} className='p-2 hover:bg-blue-200 rounded-lg'>
                  <Link href={''} >Profile</Link></p>
                <p hidden={isUserLogin} className='p-2 hover:bg-blue-200 rounded-lg'>
                  <Link href={''}>SignIn</Link></p>
                <p hidden={isUserLogin} className={`p-2 hover:bg-blue-200 rounded-lg ${isUserLogin ? ``:`bg-amber-200`}`}>
                  <Link href={''}>SignUp</Link></p>
                <p hidden={!isUserLogin} className='p-2 hover:bg-blue-200 rounded-lg'>
                  <Link href={''}>Order</Link></p>
                <p className='p-2 hover:bg-blue-200 rounded-lg'>
                  <Link href={''}>Cart</Link></p>
                <p className='p-2 hover:bg-blue-200 rounded-lg'>
                  <Link href={''}>WishList</Link></p>
                <p  hidden={!isUserLogin} className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-400'>
                  <button onClick={handleLogout}>Logout</button></p>
              </div>
            )}
      </div>
        
        
    </div>
  )
}

export default NavUser