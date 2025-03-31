'use client'
// import { addProduct } from '@/lib/store/features/cart/cartSlice'
import { AppStore, makeStore } from '@/lib/store/store'
import React, { ReactNode, useRef } from 'react'
import { Provider } from 'react-redux'

const StoreProvider = ({children}:{children:ReactNode}) => {
    const storeRef = useRef<AppStore>(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
    // TODO: check if pre ftech data needed (userInfo)
    // initaily add data on creating store
    // storeRef.current.dispatch(addProduct({productId:123,quantity:1}))
  }
  return (
    <Provider store={storeRef.current}>
        {children}
    </Provider>
  )
}

export default StoreProvider