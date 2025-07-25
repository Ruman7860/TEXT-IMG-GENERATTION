import React from 'react'
import { assets, plans } from '../assets/assets'
import { useApp } from '../context/AppContent';
import {motion} from 'motion/react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BuyCredit = () => {
  const {user,setShowLogin,setAmount,setIsPayment} = useApp();
  const navigate = useNavigate();
  const navigateToPurchase = (amount) => {
    if(user){
      setIsPayment(true);
      setAmount(amount);
      navigate('/payment');
    }
    else{
      setShowLogin(true);
    }
  }
  return (
    <motion.div 
      initial = {{opacity:0.2,y:100}}
      whileInView={{opacity:1,y:0}}
      transition={{duration:1}}
      viewport={{once:true}}
      className='min-h-[75vh] text-center pt-14 mb-10'
    >
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((plan,index) => (
          <div 
            key={index} 
            className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-300'
          >
            <img width={40} src={assets.logo_icon} alt="logo" />
            <p className='mt-3 mb-1 font-semibold'>{plan.id}</p>
            <p className='text-sm'>{plan.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-semibold'>${plan.price}
              </span> / {plan.credits}
            </p>
            <button 
              onClick={() => navigateToPurchase(plan.price)}
              className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'
            >
              {user ? 'Purchase' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit