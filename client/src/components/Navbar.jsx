import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"

import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';

import lImg from "../assets/travel.png"




import axios from 'axios'
import AuthModel from './AuthModel';

function Navbar() {
    const {userData}=useSelector((state)=>state.user)

    const [showCreditPopup,setShowCreditPopup]=useState(false)

    const [showUserPopup,setShowUserPopup]=useState(false)

    const [confirmDelete,setConfirmDelete]=useState(false)

    const [deleting,setDeleting]=useState(false)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const[showAuth,setShowAuth]=useState(false);



    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl+"/api/auth/logout",{withCredentials:true})
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteAccount = async () => {
        setDeleting(true)
        try {
            await axios.delete(ServerUrl+"/api/user/delete-account",{withCredentials:true})
            dispatch(setUserData(null))
            setConfirmDelete(false)
            setShowUserPopup(false)
            setShowCreditPopup(false)
            navigate("/")
        } catch (error) {
            console.log(error)
        } finally {
            setDeleting(false)
        }
    }
  return (
    
    <div className='bg-[#f3f3f3] flex justify-center px-4 pt-6'>
        <motion.div
        initial={{opacity:0,y:-40}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.3}}
         className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative'>

            <div className='flex items-center gap-3 cursor-pointer'>
                {/* <div className='bg-black text-white p-2 rounded-lg'> */}

                    {/* <BsRobot size={18}/> */}

                    {/* <img src={lImg} size={1} alt="" /> */}



                {/* </div> */}

                <div className="flex items-center gap-2">
  <img
    src={lImg}
    alt="Cogniva Logo"
    className="w-8 h-8 object-contain"
  />
  <span className="text-xl font-bold">Cogniva</span>
</div>


                {/* <h1 className='font-semibold hidden md:block text-lg'>Cogniva</h1> */}
            </div>


            <div className='flex items-center gap-6 relative'>

                <div className='relative'>
                    <button onClick={()=>{

                        if(!userData)
                        {
                            setShowAuth(true)
                            return;
                        }

                        
                        setShowCreditPopup(!showCreditPopup);
                        setShowUserPopup(false)
                    }} className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition'>
                        <BsCoin size={20}/>
                        {userData?.credits || 0}
                    </button>
                    {showCreditPopup && (
                        <div className='absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50'>

                            <p className='text-sm text-gray-600 mb-4'>Need more credits to continue interviews?</p>

                            <button onClick={()=>navigate("/pricing")} className='w-full bg-black text-white py-2 rounded-lg text-sm'>Buy more credits</button>

                        </div>
                    )}
                </div>

                <div className='relative'>
                    <button
                    onClick={()=>{

                        if(!userData)
                        {
                            setShowAuth(true)
                            return;
                        }
                        
                        setShowUserPopup(!showUserPopup);
                        setShowCreditPopup(false)
                        setConfirmDelete(false)
                    }} className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold'>

                        {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={16}/>}
                       
                    </button>
                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-56 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-50'>

                            <p className='text-md text-blue-500 font-medium mb-0.5'>{userData?.name}</p>
                            <p className='text-xs text-gray-400 mb-3 truncate'>{userData?.email}</p>

                            <button onClick={()=>navigate("/history")} className='w-full text-left text-sm py-2 hover:text-black text-gray-600'>Interview History</button>
                            <button onClick={handleLogout} className='w-full text-left text-sm py-2 flex items-center gap-2 text-red-500'>
                                <HiOutlineLogout size={16}/>
                                Logout</button>

                            <div className='border-t border-gray-100 mt-1 pt-1'>
                                {!confirmDelete ? (
                                    <button onClick={()=>setConfirmDelete(true)} className='w-full text-left text-sm py-2 flex items-center gap-2 text-gray-400 hover:text-red-500'>
                                        <MdDeleteOutline size={16}/>
                                        Delete Account</button>
                                ) : (
                                    <div className='py-1'>
                                        <p className='text-xs text-gray-500 mb-2'>This will permanently delete your account, interviews and history. Are you sure?</p>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={handleDeleteAccount}
                                                disabled={deleting}
                                                className='flex-1 text-xs bg-red-500 text-white py-2 rounded-lg disabled:opacity-60'>
                                                {deleting ? "Deleting..." : "Yes, delete"}
                                            </button>
                                            <button
                                                onClick={()=>setConfirmDelete(false)}
                                                disabled={deleting}
                                                className='flex-1 text-xs bg-gray-100 text-gray-600 py-2 rounded-lg'>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>


            </div>

        </motion.div>

         
{showAuth&&<AuthModel onClose={()=>setShowAuth(false)}/>}
        
    </div>

    
    

   

    

  )
}

export default Navbar