import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';
import { CiUser } from "react-icons/ci";
import { useApp } from '../context/AppContent';
import {motion} from 'motion/react';

const Login = () => {
  const {setShowLogin,backendUrl,setToken,setUser} = useApp();
  const [state,setState] = useState('Login');
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        if(state === 'Login'){
            if (!email || !password || (state !== 'Login' && !name)) {
                toast.error('All fields are required!');
                return;
            }

            const {data} = await axios.post(
                `${backendUrl}/auth/login`,
                {email,password},
                {withCredentials : true}
            );

            if(data.success === false){
                console.log("Login unsuccessfull");
                toast.error(data.message);
                return;
            }

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token',data.token);
            setShowLogin(false);
            toast.success("Login Successfully");
        }
        else{ // for signup
            const {data} = await axios.post(
                `${backendUrl}/auth/signup`,
                {name,email,password},
                {withCredentials : true}
            );

            if(data.success === false){
                console.log("Login unsuccessfull");
                toast.error(data.message);
                return;
            }

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token',data.token);
            setShowLogin(false);
            toast.success("Signup Successfully");
        }
    } catch (error) {
        console.log("Login/SignUp Error : ", error.response?.data || error.message);
        toast.error(error.response?.data?.message || error.message);
        return;
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = 'unset'
    }
  },[]);
  return (
    <div 
        className='fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center  z-10 backdrop-blur-sm bg-black bg-opacity-30'
    >
        <motion.form 
            onSubmit={handleLogin}
            initial = {{opacity:0.2,y:300}}
            whileInView={{opacity:1,y:0}}
            transition={{duration:0.5}}
            viewport={{once:true}}
            className='relative bg-white p-10 rounded-xl text-slate-500'
        >
            <h1 className='text-center text-neutral-700 text-2xl font-medium'>{state}</h1>
            <p className='text-sm'>
                {state === 'Login' ? 'Welcome back! Please login to continue' : 'Welcome! Please create an account to continue'}
            </p>
            {
                state !== 'Login' && 
                <div className='border px-3 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <CiUser/>
                    <input 
                        type="text" 
                        placeholder='Full Name' 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='outline-none text-sm'

                    />
                </div>
            }
            <div className='border px-3 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.email_icon} alt="" />
                <input 
                    type="email" 
                    placeholder='Email' 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='outline-none text-sm'

                />
            </div>
            <div className='border px-3 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img  src={assets.lock_icon} alt="" />
                <input 
                    type="password" 
                    placeholder='Pasword' 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='outline-none text-sm'

                />
            </div>
            {state === 'Login' &&  
                <p className='text-sm text-blue-600 my-4 cursor-pointer hover:underline'>
                    Forgot Password?
                </p>
            }
            <button type='submit' className={`bg-blue-600 w-full text-white py-2 ${state !== 'Login' && 'my-4'} rounded-full`}>
                {state === 'Login' ? 'Login' : 'Create Account'}
            </button>

            {
                state === 'Login' ?
                <p className='mt-5 text-center'>Don't have an account?{" "}
                    <span 
                        onClick={() => setState('Sign Up')}
                        className='text-blue-600 cursor-pointer hover:underline'
                    >
                        Sign up
                    </span> 
                </p>
                :
                <p className='mt-5 text-center'>Already have an account? {" "}
                    <span
                        onClick={() => setState('Login')} 
                        className='text-blue-600 cursor-pointer hover:underline'
                    >
                        Login
                    </span> 
                </p>
            }

            <img 
                onClick={() => setShowLogin(false)} 
                src={assets.cross_icon} 
                alt="cross-logo" 
                className='absolute top-5 right-5'
            />
        </motion.form>
    </div>
  )
}

export default Login