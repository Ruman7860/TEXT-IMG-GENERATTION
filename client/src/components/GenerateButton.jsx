import React from 'react'
import { assets } from '../assets/assets'
import { useApp } from '../context/AppContent'
import { useNavigate } from 'react-router-dom';
import {motion} from 'motion/react';

const GenerateButton = () => {
  const {user,setShowLogin} = useApp();
  const navigate = useNavigate();
  const handleGenerateBtn = () => {
    if(user){
      navigate('/results');
      return;
    }
    setShowLogin(true);
    return;
  }

  return (
    <motion.div 
      initial = {{opacity:0,y:100}}
      whileInView={{opacity:1,y:0}}
      transition={{duration:0.5}}
      className='pb-16 text-center'
    >
        <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-10'>See the magic. Try now</h1>
        <button 
          onClick={handleGenerateBtn}
          className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto hover:scale-105 transition-all duration-300'
        >
            Generate Images
            <img src={assets.star_group} alt="button" className='h-6' />
        </button>
    </motion.div>
  )
}

export default GenerateButton