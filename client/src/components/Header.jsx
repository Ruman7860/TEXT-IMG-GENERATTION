import React from 'react'
import { assets } from '../assets/assets'
import { useApp } from '../context/AppContent'
import { useNavigate } from 'react-router-dom';
import {motion} from "motion/react"

const Header = () => {
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
        className='flex flex-col justify-center items-center text-center my-32'
        initial={{opacity:0.2,y:100}}
        transition={{duration:1}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true}}
    >
        <motion.div 
            initial={{opacity:0,y:-20}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.2,duration:0.8}}
            className='text-stone-500 inline-flex gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500 '

        >
            <p>Best text to image generator</p>
            <img src={assets.star_icon} alt="star_icon" />
        </motion.div>
        <motion.h1 
            
            className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center'
        >
            Turn text to 
            <span 
                initial = {{opacity:0}}
                animate = {{opacity:1}}
                transition = {{delay:0.4 , duration:2}}
                className='text-blue-600'
            >
                image
            </span>, in seconds.
        </motion.h1>
        <motion.p
            initial = {{opacity : 0, y:20}}
            animate = {{opacity:1, y:0}}
            transition={{delay:0.6,duration:0.8}}
            className='text-center max-w-xl mx-auto mt-5'
        >
            Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type, and watch the magic happen.
        </motion.p>
        <motion.button 
            initial={{opacity:0}}
            animate = {{opacity:1}}
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
            transition={{ default:{duration:0.5},opacity:{delay:0.8,duration:1} }}
            onClick={handleGenerateBtn}
            className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full '
        >
            Generate images 
            <img className='h-6' src={assets.star_group} alt="" />
        </motion.button>

        <motion.div
            initial = {{opacity:0}} 
            animate = {{opacity:1}}
            transition={{delay:1,duration:1}}
            className='flex justify-center gap-3 mt-16 flex-wrap'
        >
            {Array(6).fill('').map((item,index) => (
                <motion.img
                    whileHover={{scale:1.05, duration:0.1}} 
                    className='rounded hover:scale-110 transition-all duration-300 cursor-pointer max-sm:w-12' 
                    src={ index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1} 
                    alt="sample images" 
                    key={index} 
                    width={90}
                />
            ))}
            {/*  NOTE :
                sm:w-10	On screens >= 640px. 
                max-sm:w-10	On screens < 640px. 
            */}
        </motion.div>
        <motion.p 
            initial = {{opacity:0}}
            animate = {{opacity:1}}
            transition={{delay:1.2,duration:0.8}}
            className='mt-2 text-neutral-600 '
        >
            Generated images from imagify
        </motion.p>
    </motion.div>
  )
}

export default Header