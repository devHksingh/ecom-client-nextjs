"use client";
import { useState } from 'react';
import Link from 'next/link';
import {  ChevronDown, Menu, Search, Store, X } from 'lucide-react';
import useAuth from '@/hook/useAuth';
import Cart from './Cart';
import Wishlist from './Wishlist'; 
import NavUser from './NavUser';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const {isLogin} = useAuth()
  console.log("isLogin",isLogin);
  

  //  navigation data
  const navItems = [
    
    { 
      name: 'Clothing', 
      path: '/clothing',
      dropdown: [
        { name: 'Men', path: '/clothing/men' },
        { name: 'Women', path: '/clothing/women' },
        { name: 'Kids', path: '/clothing/kids' }
      ]
    },
    { 
      name: 'Electronics', 
      path: '/electronics',
      dropdown: [
        { name: 'Phones', path: '/electronics/phones' },
        { name: 'Laptops', path: '/electronics/laptops' },
        { name: 'Accessories', path: '/electronics/accessories' }
      ]
    },
    { 
      name: 'About', 
      path: '/about' 
    },
    { 
      name: 'Contact', 
      path: '/contact' 
    }
  ];

  const toggleDropdown = (index:number) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
    }
  };
  const handleLogout =()=>{
    // TODO: call logout api
  }

  return (
    <header className='bg-white'>
        <nav className=' container mx-auto px-4 sm:px-6 lg:px-8 relative'>
            <div className='flex justify-between h-12 items-center'>
                {/* logo */}
                <div className='flex'>
                    <Link href={'/'}
                    className='text-2xl font-bold text-indigo-600 flex items-center gap-1 flex-shrink-0  '
                    >
                        <Store />Shop
                    </Link>
                </div>
                {/* Desktop Navigation */}
                <div className='hidden sm:flex sm:space-x-8 self-center'>
                    {navItems.map((item,index)=>(
                        <div key={index} className='relative'>
                            {item.dropdown?(
                                <div>
                                    <button
                                    onClick={()=> toggleDropdown(index)}
                                    className='inline-flex items-center px-1 py-1 pt-1 border-b-1 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-800'
                                    >
                                        {item.name}
                                        {/* <ChevronDown size={14} className='  ml-1'/> */}
                                        <ChevronDown className={`transition-transform ml-1 ${openDropdown === index ?`transform rotate-180`:``}`}/>
                                    </button>
                                    {/* Dropdown */}
                                    {openDropdown === index && (
                                        <div className='absolute z-10 mt-2 w-48 rounded-md shadow-md bg-white ring-1 ring-blue-400 '>
                                            <div className="py-1" role="menu" aria-orientation="vertical">
                                                {item.dropdown.map((dropDownItem,dropDownIndex)=>(
                                                    <Link 
                                                    key={dropDownIndex}
                                                    href={dropDownItem.path}
                                                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                                    role='menuitem'
                                                    // onClick={() => setOpenDropdown(null)}
                                                    >
                                                        {dropDownItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ):(
                                <Link 
                                href={item.path}
                                className="inline-flex items-center px-1 py-1 pt-1 border-b-1 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-800"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
                {/* Destop userState */}
                <div className='hidden sm:ml-6 sm:flex sm:items-center sm:justify-evenly gap-4'>
                    {/* search Icon */}
                    {/* lodash */}
                    <form className='flex  relative  '>
                        <input type="search"
                        className='w-12 peer focus:w-full pl-6 relative outline-none   focus:cursor-text focus:border-lime-300 focus:pl-6 focus:pr-1 transition ease-in-out border rounded-md '
                        />
                        <Search className=' absolute inset-0 peer-focus:text-lime-600  pl-1 pr-1'/>
                        
                    </form>
                    {/* Cart Icon  */}
                    <div>
                        {/* User cart component */}
                    {/* <ShoppingCart /> */}
                    <Cart/>
                    </div>
                    {/* wishlist icon */}
                    <div>
                        {/* User wishlist component */}
                        <Wishlist/>
                    </div>
                    {/* UserProfile */}
                    <div className=' self-center flex items-center '>
                        {/* User Profile component */}
                    <NavUser />
                    </div>
                </div>
                {/* Mobile menu button */}
                <div className='flex items-center sm:hidden '>
                
                    <button 
                    className=' cursor-pointer'
                    onClick={()=>setIsOpen(!isOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isOpen?(
                            <X />
                            
                        ):(
                            <Menu />
                        )}
                        
                    </button>
                </div>
                {/* Mobile menu */}
                {isOpen && (
                    <div className='sm:hidden   absolute right-0 top-12 w-full z-50 min-h-full bg-stone-100'>
                        <div className='pt-2 pb-3 space-y-1'>
                            {navItems.map((item,index)=>(
                                <div key={index}>
                                    {item.dropdown ?(
                                        <div>
                                            <button
                                            onClick={() => toggleDropdown(index)}
                                            className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                            >
                                                <span>{item.name}</span>
                                                <ChevronDown className={`transition-transform ${openDropdown === index ?`transform rotate-180`:``}`}/>
                                            </button>
                                            {openDropdown === index && (
                                            <div className="pl-4 py-2 space-y-1">
                                                {item.dropdown.map((dropdownItem, dropdownIndex) => (
                                                <Link
                                                    key={dropdownIndex}
                                                    href={dropdownItem.path}
                                                    className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {dropdownItem.name}
                                                </Link>
                                                ))}
                                                
                                            </div>

                                            )}

                                        </div>
                                    ):(
                                        <Link href={item.path}
                                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                        onClick={() => setIsOpen(false)}>{item.name}</Link>
                                    )}
                                    
                                </div>
                            ))}
                            {!isLogin && (
                                <div>
                                    <Link
                                href={''}
                                className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                >
                                    <span>SignIn</span>
                                </Link>
                                    <Link
                                href={''}
                                className="w-full flex justify-between items-center px-3 py-2 text-base bg-amber-400 font-medium text-gray-600 hover:bg-amber-500 hover:text-gray-800"
                                >
                                    <span>SignUp</span>
                                </Link>
                                </div>
                            )}
                            {isLogin &&(
                                <div >
                                    <Link
                                        href={''}
                                        className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                        >
                                            <span>Profile</span>
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-100 hover:bg-red-500  bg-red-400 rounded">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    </header>
  );
};

export default Navbar;